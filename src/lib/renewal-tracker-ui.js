import { STORAGE_KEY, examplesFor, nextChargeDate, FREQUENCIES, normalizeRecord, monthlyEquivalent, chargesInMonth, recordWarnings, exportCSV, importCSV, encodeSaved, decodeSaved, exportCalendar } from './renewal-tracker.js';

export function startTracker(root) {
  if (!root) return;
  const $ = id => root.querySelector('#' + id);
  const form = $('rt-form'), editor = $('rt-editor'), confirmation = $('rt-confirm');
  let records = [], demo = true, savedDiary = [], loadFailed = false, storageOK = true, focusBefore;
  let dirty = false, confirmFocus, rawSaved = null;
  const usd = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  const dateLabel = date => date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T00:00:00Z')) : 'Not recorded';
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const create = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
  function feedback(text, location = 'rt-feedback') { $(location).textContent = text; }
  const storageFeedback = text => feedback(text, 'rt-storage-feedback');
  const currentMonth = () => today().slice(0,7);
  function examples() { const result = examplesFor(today()); $('rt-month').value = result[0].billingDate.slice(0,7); return result; }
  function persist() {
    try {
      const payload = encodeSaved(records);
      localStorage.setItem(STORAGE_KEY, payload);
      if (localStorage.getItem(STORAGE_KEY) !== payload) throw new Error('Storage verification failed');
      savedDiary = records.map(r => ({ ...r })); storageOK = true; loadFailed = false; rawSaved = payload; $('rt-recover').hidden = true;
      $('rt-save-status').textContent = `Saved in this browser at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Export CSV for a backup.`;
    } catch {
      storageOK = false;
      $('rt-save-status').textContent = 'Not saved: browser storage is unavailable or full. Your changes are only in this open page. Export CSV before closing.';
    }
  }
  try { rawSaved = localStorage.getItem(STORAGE_KEY); }
  catch { storageOK = false; $('rt-save-status').textContent = 'Browser storage is unavailable. Records can be used in this page; export CSV before closing.'; }
  if (rawSaved !== null) {
    try { savedDiary = decodeSaved(rawSaved); records = savedDiary.map(r => ({ ...r })); demo = false; $('rt-month').value = currentMonth(); $('rt-save-status').textContent = 'Loaded your saved diary from this browser. Changes save when you press Save subscription.'; }
    catch { loadFailed = true; storageOK = false; $('rt-recover').hidden = false; $('rt-save-status').textContent = 'Saved data could not be read. It has not been overwritten. Download the unreadable saved data before replacing it.'; }
  }
  if (demo) records = examples();
  function ask(message, action, label = 'Confirm') {
    confirmFocus = document.activeElement;
    $('rt-confirm-message').textContent = message; $('rt-confirm-yes').textContent = label; $('rt-confirm-title').textContent = label + '?';
    $('rt-confirm-yes').onclick = () => { confirmation.close(); action(); if (confirmFocus?.isConnected && !confirmFocus.closest('dialog:not([open])')) confirmFocus.focus(); };
    $('rt-confirm-no').onclick = () => { confirmation.close(); confirmFocus?.focus(); };
    confirmation.showModal(); $('rt-confirm-no').focus();
  }
  confirmation.addEventListener('cancel', () => confirmFocus?.focus());
  function replaceDiary(next, message, label = 'Replace diary', forceConfirmation = false) {
    const apply = () => { records = next; demo = false; $('rt-month').value = currentMonth(); persist(); render(); storageFeedback(storageOK ? 'Diary updated and saved.' : 'Diary updated in this page only. Export a backup.'); };
    if (forceConfirmation || savedDiary.length || loadFailed || !demo && records.length) ask(message + (loadFailed ? ' Previously saved data could not be read; this will overwrite it. Download it first if you need to recover it.' : ''), apply, label);
    else apply();
  }
  function demoBanner() {
    const mode = $('rt-mode'); mode.replaceChildren();
    if (demo) {
      if (loadFailed) mode.append(create('p', 'Your saved diary could not be read. Download the unreadable saved data below before replacing it.'));
    } else {
      const examplesInDiary = records.filter(r => r.illustrative === 'true');
      if (examplesInDiary.length) mode.append(create('p', `Example entries in this diary: ${examplesInDiary.map(r => r.vendor).join(', ')}. Replace their details with your own, or remove them.`));
    }
  }
  function localStorageReadable() { try { return localStorage.getItem(STORAGE_KEY) !== null; } catch { return false; } }
  function render() {
    demoBanner();
    $('rt-start').hidden = !demo;
    $('rt-add').hidden = demo;
    $('rt-title').textContent = demo ? 'Example tracker' : 'Your tracker';
    const canReturn = demo && (savedDiary.length || !loadFailed && localStorageReadable());
    $('rt-demo').hidden = demo && !canReturn;
    $('rt-demo').textContent = canReturn ? 'Return to my tracker' : 'View example tracker';
    $('rt-monthly').textContent = usd(monthlyEquivalent(records));
    const month = $('rt-month').value;
    let charges = [];
    let monthValid = true;
    try { charges = chargesInMonth(records, month); } catch { monthValid = false; $('rt-cash').textContent = 'Choose a month'; }
    $('rt-month').setAttribute('aria-invalid', String(!monthValid));
    if (monthValid) $('rt-cash').textContent = usd(charges.reduce((sum, c) => sum + c.cents, 0) / 100);
    const undated = records.filter(r => r.billingState === 'ongoing' && !r.billingDate).length;
    $('rt-cash-note').textContent = !monthValid ? 'Enter a valid month as YYYY-MM, for example 2026-11. No charge total has been calculated.' : `${undated ? `Partial total: ${undated} ongoing subscription${undated === 1 ? '' : 's'} missing a billing date. ` : ''}Projected from entered dates and unchanged prices. Decisions do not stop billing.`;
    $('rt-count').textContent = `${records.length} record${records.length === 1 ? '' : 's'}`;
    const list = $('rt-records'); list.replaceChildren();
    if (!records.length) list.append(create('p', 'Your diary is empty. Add one subscription and check its bill and renewal terms.', 'rt-empty'));
    for (const r of records) {
      const article = create('article', undefined, 'rt-record'), heading = create('div', undefined, 'rt-record-heading'), name = create('div');
      name.append(create('h3', r.vendor));
      name.append(create('span', r.billingState === 'ended' ? 'Billing ended' : r.decision === 'Cancel' ? 'Decided: cancel' : r.decision, 'rt-tag'));
      const buttons = create('div', undefined, 'rt-actions');
      for (const action of ['Edit', 'Delete']) { const b = create('button', action); b.type = 'button'; b.setAttribute('aria-label', `${action} ${r.vendor}`); b.onclick = action === 'Edit' ? () => openEditor(r, b) : () => {
        ask(`Delete ${r.vendor} from ${demo ? 'the example view' : 'your diary'}? This does not cancel a vendor subscription.`, () => { records = records.filter(x => x.id !== r.id); if (!demo) persist(); render(); (demo ? $('rt-start') : $('rt-add')).focus(); feedback(demo ? 'Removed from the unsaved example view.' : storageOK ? 'Record deleted and diary saved.' : 'Record removed from this page only.'); }, 'Delete record');
      }; buttons.append(b); }
      heading.append(name, buttons); article.append(heading);
      const grid = create('div', undefined, 'rt-record-grid');
      for (const pairs of [
        [['Actual charge', `${usd(Number(r.charge))} ${r.frequency}`], ['Monthly equivalent', `${usd(Number(r.charge) / FREQUENCIES[r.frequency])}${r.billingState === 'ended' ? ' (excluded)' : ''}`]],
        [['Next projected charge', r.billingState === 'ended' ? 'Excluded: billing ended' : dateLabel(nextChargeDate(r,today()))], ['Billing date entered', dateLabel(r.billingDate)], ['Renewal date', dateLabel(r.renewalDate)]],
        [['Notice deadline', dateLabel(r.noticeDate)]],
        [['Decision owner', r.owner || 'Unassigned'], ['Decision', r.decision]]
      ]) { const dl = create('dl'); for (const [label, value] of pairs) { dl.append(create('dt', label), create('dd', value, label === 'Actual charge' ? 'rt-charge' : '')); } grid.append(dl); }
      article.append(grid);
      if (r.notes) article.append(create('p', r.notes, 'rt-notes'));
      const warnings = recordWarnings(r, today()); if (warnings.length) { const ul = create('ul', undefined, 'rt-warning'); warnings.forEach(w => ul.append(create('li', w))); article.append(ul); }
      list.append(article);
    }
    const dates = charges.map(c => ({ date: c.date, pastWarning: false, text: `Billing · ${c.record.vendor} · ${usd(c.cents / 100)}` }));
    for (const r of records.filter(r => r.billingState === 'ongoing')) for (const [field, label] of [['noticeDate', 'Notice deadline'], ['renewalDate', 'Renewal']]) if (r[field]) dates.push({ date: r[field], pastWarning: r.illustrative !== 'true', text: `${label} · ${r.vendor} · ${r.owner || 'Owner unassigned'}` });
    dates.sort((a,b) => a.date.localeCompare(b.date));
    const diary = $('rt-dates'); diary.replaceChildren();
    if (!dates.length) diary.append(create('li', 'No dates recorded for this diary or billing month yet.', 'rt-calendar-empty'));
    for (const d of dates) { const li = create('li'), time = create('time', dateLabel(d.date)); time.dateTime = d.date; li.append(time, create('span', d.text + (d.pastWarning && d.date < today() ? ' · Past date: check record' : ''))); diary.append(li); }
    if (demo && !loadFailed && storageOK) $('rt-save-status').textContent = 'Start your own tracker to save subscriptions in this browser.';
  }
  function openEditor(record, opener = $('rt-add')) {
    focusBefore = opener; form.reset(); $('rt-form-error').textContent = ''; dirty = false;
    for (const node of form.querySelectorAll('.rt-field-error')) node.remove();
    const values = record || { id: crypto.randomUUID ? crypto.randomUUID() : `record-${Date.now()}-${Math.random().toString(16).slice(2)}`, illustrative: 'false', frequency: 'monthly', billingState: 'ongoing', decision: 'Review needed' };
    for (const [k,v] of Object.entries(values)) if (k !== 'illustrative' && form.elements.namedItem(k)) form.elements.namedItem(k).value = v;
    form.elements.namedItem('illustrative').checked = values.illustrative === 'true';
    $('rt-example-edit').hidden = !(demo && record);
    for (const field of form.querySelectorAll('[aria-invalid]')) { field.removeAttribute('aria-invalid'); field.removeAttribute('aria-describedby'); }
    form.elements.namedItem('charge').setAttribute('aria-describedby', 'rt-charge-help');
    $('rt-editor-title').textContent = record ? 'Edit subscription' : 'Add a subscription'; editor.showModal(); form.elements.namedItem('vendor').focus();
  }
  function closeEditor() { editor.close(); if (focusBefore?.isConnected && !focusBefore.closest('[hidden]')) focusBefore.focus(); else (demo ? $('rt-start') : $('rt-add')).focus(); }
  function discard() { if (dirty) ask('Discard your unsaved changes to this subscription?', closeEditor, 'Discard changes'); else closeEditor(); }
  $('rt-start').onclick = e => { if (demo) { e.preventDefault(); openEditor(undefined, $('rt-start')); } };
  $('rt-add').onclick = () => openEditor(); $('rt-close').onclick = discard; $('rt-cancel').onclick = discard;
  form.addEventListener('input', () => dirty = true); form.addEventListener('change', () => dirty = true);
  editor.addEventListener('cancel', e => { e.preventDefault(); discard(); });
  form.onsubmit = e => {
    e.preventDefault();
    for (const node of form.querySelectorAll('.rt-field-error')) node.remove();
    for (const node of form.querySelectorAll('[aria-invalid]')) { node.removeAttribute('aria-invalid'); node.removeAttribute('aria-describedby'); }
    form.elements.namedItem('charge').setAttribute('aria-describedby','rt-charge-help');
    $('rt-form-error').textContent = '';
    let record;
    try { record = normalizeRecord({ ...Object.fromEntries(new FormData(form)), currency: 'USD', illustrative: String(form.elements.namedItem('illustrative').checked) }); if (records.length >= 500 && !records.some(r => r.id === record.id)) throw new Error('This diary supports up to 500 subscriptions.'); } catch (err) {
      $('rt-form-error').textContent = err.message;
      const name = /charge|amount|decimal/.test(err.message) ? 'charge' : /Vendor/.test(err.message) ? 'vendor' : /date/.test(err.message) ? ['billingDate','renewalDate','noticeDate'].find(k => form.elements.namedItem(k).value && !/^\d{4}-\d{2}-\d{2}$/.test(form.elements.namedItem(k).value)) : null;
      const failed = name && form.elements.namedItem(name);
      if (failed) { const message = create('span', err.message, 'rt-field-error'); message.id = `rt-field-${name}-error`; failed.after(message); failed.setAttribute('aria-invalid','true'); failed.setAttribute('aria-describedby',message.id); failed.focus(); failed.scrollIntoView?.({block:'center'}); }
      else $('rt-form-error').scrollIntoView?.({block:'center'});
      return;
    }
    const apply = () => {
      if (demo) { records = []; $('rt-month').value = currentMonth(); }
      const index = records.findIndex(r => r.id === record.id); if (index >= 0) records[index] = record; else records.push(record);
      if (demo) { demo = false; } persist(); render(); closeEditor(); feedback(storageOK ? 'Subscription saved in this browser.' : 'Subscription updated in this page only. Export CSV before closing.');
    };
    if (loadFailed || demo && savedDiary.length) ask('Save only this subscription? This replaces the saved diary. Export or download the existing data first if you need a backup.', apply, 'Save only this subscription'); else apply();
  };
  $('rt-month').onchange = render;
  function download(text, type, filename) {
    const url = URL.createObjectURL(new Blob([text], { type })), anchor = create('a'); anchor.href = url; anchor.download = filename; root.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $('rt-export').onclick = () => { download(exportCSV(records), 'text/csv;charset=utf-8', 'cloud-capital-renewals.csv'); storageFeedback('CSV prepared for download. Check your downloads to keep the backup.'); };
  $('rt-import').onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      if (file.size > 3000000) throw new Error('CSV is too large (maximum 3 MB).');
      const next = importCSV(await file.text());
      replaceDiary(next, `Import ${next.length} subscription${next.length === 1 ? '' : 's'}? This replaces the current diary, rather than merging it. Export CSV first if you want a backup.`, 'Import and replace diary', true);
    } catch(err) { storageFeedback(`Nothing imported. ${err.message}`); }
    e.target.value = '';
  };
  $('rt-ics').onclick = () => {
    try { download(exportCalendar(records, $('rt-month').value), 'text/calendar;charset=utf-8', 'cloud-capital-renewals.ics'); storageFeedback('Calendar prepared for download: 12 months from the selected month. Import it into your calendar app and check the dates.'); } catch(err) { storageFeedback(err.message); }
  };
  $('rt-demo').onclick = () => {
    if (demo) {
      if (savedDiary.length || !loadFailed && localStorageReadable()) {
        records = savedDiary.map(r => ({ ...r })); demo = false; $('rt-month').value = currentMonth(); render(); $('rt-add').focus(); feedback('Returned to your saved diary.');
      }
      return;
    }
    const show = () => { records = examples(); demo = true; render(); feedback('Showing the example tracker.'); };
    if (!storageOK && !demo) ask('Your current changes are not saved. Export CSV before switching to examples, or confirm to discard the in-page changes.', show, 'View examples'); else show();
  };
  $('rt-clear').onclick = () => ask('Remove the saved diary from this browser? Export CSV first if you want a backup. This does not cancel subscriptions or remove imported calendar events.', () => {
    try { localStorage.removeItem(STORAGE_KEY); if (localStorage.getItem(STORAGE_KEY) !== null) throw new Error('Could not clear storage'); savedDiary = []; records = []; demo = false; storageOK = true; loadFailed = false; rawSaved = null; $('rt-recover').hidden = true; $('rt-month').value = currentMonth(); render(); $('rt-save-status').textContent = 'Saved diary removed from this browser. This empty page is not saved yet.'; storageFeedback('Saved diary cleared.'); } catch { storageFeedback('Could not clear browser storage. Your diary remains in this page.'); }
  }, 'Clear saved diary');
  $('rt-recover').onclick = () => { if (rawSaved !== null) { download(rawSaved,'text/plain;charset=utf-8','cloud-capital-unreadable-saved-data.txt'); storageFeedback('Unreadable saved data prepared for download. Keep it before replacing the diary.'); } };
  window.addEventListener('beforeunload', e => { if ((!storageOK && !demo) || dirty && editor.open) { e.preventDefault(); e.returnValue = ''; } });
  render();
}
