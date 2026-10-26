// Pure, browser-independent tracker rules. Money is held as integer USD cents.
export const FREQUENCIES = { monthly: 1, quarterly: 3, annually: 12 };
export const DECISIONS = ['Review needed', 'Keep', 'Adjust plan', 'Compare alternatives', 'Cancel'];
export const FIELDS = ['id', 'vendor', 'charge', 'frequency', 'billingDate', 'renewalDate', 'noticeDate', 'owner', 'decision', 'billingState', 'notes', 'illustrative', 'currency'];
export const STORAGE_KEY = 'cloud-and-capital:renewal-tracker:v1';
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [y, m, d] = value.split('-').map(Number);
  return y >= 1900 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 && d <= new Date(Date.UTC(y, m, 0)).getUTCDate();
}
export function moneyCents(value) {
  let text = String(value).trim().replace(/^\$\s*/, '');
  if (text.includes(',')) {
    if (!/^[1-9]\d{0,2}(?:,\d{3})+(?:\.\d{1,2})?$/.test(text)) throw new Error('Use a USD amount such as 19, $19 or 1,200.00, with at most two decimal places.');
    text = text.replaceAll(',', '');
  }
  if (!/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/.test(text)) throw new Error('Enter a USD charge from 0 to 999,999,999.99, with at most two decimal places.');
  const [whole, part = ''] = text.split('.');
  return Number(whole) * 100 + Number(part.padEnd(2, '0'));
}
export function normalizeRecord(raw) {
  const r = Object.fromEntries(FIELDS.map(k => [k, String(raw[k] ?? '')]));
  if (!r.vendor.trim()) throw new Error('Vendor / tool is required.');
  if (r.vendor.length > 120 || r.owner.length > 120 || r.notes.length > 3000) throw new Error('Vendor and owner allow 120 characters; notes allow 3,000.');
  const cents = moneyCents(r.charge);
  r.charge = (cents / 100).toFixed(2);
  if (!Object.hasOwn(FREQUENCIES, r.frequency)) throw new Error('Choose monthly, quarterly or annually.');
  for (const field of ['billingDate', 'renewalDate', 'noticeDate']) if (r[field] && !validDate(r[field])) throw new Error('Use valid calendar dates from 1900 to 9999.');
  if (!DECISIONS.includes(r.decision)) throw new Error('Choose a valid decision.');
  if (!['ongoing', 'ended'].includes(r.billingState)) throw new Error('Choose ongoing or ended billing.');
  if (r.currency !== 'USD') throw new Error('Version one supports USD only.');
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(r.id)) throw new Error('Record ID is missing or invalid.');
  if (!['true', 'false'].includes(r.illustrative)) throw new Error('Illustrative must be true or false.');
  return r;
}
export function validateRecords(records) {
  if (!Array.isArray(records) || records.length > 500) throw new Error('Import up to 500 subscriptions.');
  const normalized = records.map(normalizeRecord);
  if (new Set(normalized.map(r => r.id)).size !== normalized.length) throw new Error('Duplicate record IDs found. Nothing was imported.');
  return normalized;
}
export function monthlyEquivalent(records) {
  return records.filter(r => r.billingState === 'ongoing').reduce((sum, r) => sum + moneyCents(r.charge) / FREQUENCIES[r.frequency], 0) / 100;
}
// Anchor to the entered day, clamp short months, and restore the anchor next month.
export function addMonths(date, count) {
  if (!validDate(date) || !Number.isInteger(count)) throw new Error('Invalid date or month offset.');
  const [year, month, day] = date.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + count, 1));
  const y = target.getUTCFullYear(), m = target.getUTCMonth() + 1;
  if (y < 1900 || y > 9999) return null;
  const d = Math.min(day, new Date(Date.UTC(y, m, 0)).getUTCDate());
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
export function chargesInMonth(records, month) {
  if (!/^\d{4}-\d{2}$/.test(month) || !validDate(month + '-01')) throw new Error('Choose a valid month.');
  const [y, m] = month.split('-').map(Number);
  return records.filter(r => r.billingState === 'ongoing' && r.billingDate).flatMap(r => {
    const [by, bm] = r.billingDate.split('-').map(Number);
    const offset = (y - by) * 12 + m - bm;
    if (offset < 0 || offset % FREQUENCIES[r.frequency]) return [];
    return [{ record: r, date: addMonths(r.billingDate, offset), cents: moneyCents(r.charge) }];
  }).sort((a, b) => a.date.localeCompare(b.date) || a.record.vendor.localeCompare(b.record.vendor));
}
export function nextChargeDate(r, asOf) {
  if (!r.billingDate || r.billingState === 'ended') return null;
  if (!validDate(asOf)) throw new Error('Choose a valid reference date.');
  const [y,m] = asOf.split('-').map(Number), [by,bm] = r.billingDate.split('-').map(Number);
  const frequency = FREQUENCIES[r.frequency];
  let offset = Math.max(0, Math.ceil(((y-by)*12+m-bm)/frequency)*frequency);
  let date = addMonths(r.billingDate,offset);
  if (date && date < asOf) date = addMonths(r.billingDate,offset+frequency);
  return date;
}
export function recordWarnings(r, asOf = '') {
  if (r.billingState === 'ended') return [];
  const warnings = [];
  if (!r.billingDate) warnings.push('Billing date missing: excluded from the dated charge total.');
  if (!r.renewalDate) warnings.push('Renewal date not recorded.');
  if (!r.noticeDate) warnings.push('Notice deadline not recorded: check the vendor terms.');
  if (!r.owner.trim()) warnings.push('Decision owner not assigned.');
  if (r.noticeDate && r.renewalDate && r.noticeDate > r.renewalDate) warnings.push('Notice deadline is after renewal: check both dates.');
  if (asOf && r.illustrative !== 'true' && r.noticeDate && r.noticeDate < asOf) { const renewalLabel = r.renewalDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(r.renewalDate + 'T00:00:00Z')) : ''; warnings.push(`Notice deadline has passed${renewalLabel ? `; recorded renewal is ${renewalLabel}` : ''}. Check the vendor terms${r.decision === 'Cancel' ? ' and cancellation confirmation' : ' and renewal status'}.`); }
  if (asOf && r.illustrative !== 'true' && r.renewalDate && r.renewalDate < asOf) warnings.push('Recorded renewal date has passed. Confirm whether it renewed and update the record.');
  return warnings;
}
// Apostrophe-prefix text so spreadsheet formula cells stay inert; double an
// existing prefix as well, then undo exactly one prefix on tracker re-import.
function safeCell(value) { return /^\s*[=+\-@\t\r\n']/.test(value) ? "'" + value : value; }
export function exportCSV(records) {
  const rows = [['cc-renewal-tracker-v1'], FIELDS, ...records.map(r => FIELDS.map(k => safeCell(String(r[k]))))];
  return '\uFEFF' + rows.map(row => row.map(v => '"' + v.replaceAll('"', '""') + '"').join(',')).join('\r\n') + '\r\n';
}
export function parseCSV(text) {
  if (text.length > 3000000) throw new Error('CSV is too large (maximum 3 MB).');
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = [], cell = '', quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === '"') {
      if (cell || closed) throw new Error('Malformed CSV quotation.');
      quoted = true;
    } else if (c === ',') { row.push(cell); cell = ''; closed = false; }
    else if (c === '\r' || c === '\n') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = ''; closed = false;
    } else { if (closed) throw new Error('Unexpected text after a CSV quote.'); cell += c; }
  }
  if (quoted) throw new Error('Unclosed CSV quotation.');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  return rows;
}
export function importCSV(text) {
  const rows = parseCSV(text);
  while (rows[0]?.length > 1 && rows[0].at(-1) === '') rows[0].pop();
  if (rows[0]?.length !== 1 || rows[0][0] !== 'cc-renewal-tracker-v1' || JSON.stringify(rows[1]) !== JSON.stringify(FIELDS)) throw new Error('Use a CSV exported by this tracker; keep its version row and column headings.');
  return validateRecords(rows.slice(2).map((row, i) => {
    while (row.length > FIELDS.length && row.at(-1) === '') row.pop();
    if (row.length !== FIELDS.length) throw new Error(`CSV row ${i + 3} has the wrong number of columns.`);
    const raw = Object.fromEntries(FIELDS.map((k, j) => [k, row[j].startsWith("'") ? row[j].slice(1) : row[j]]));
    raw.illustrative = raw.illustrative.toLowerCase();
    for (const field of ['billingDate','renewalDate','noticeDate']) if (raw[field] && !validDate(raw[field])) throw new Error(`CSV row ${i+3}, ${field}: use YYYY-MM-DD. Spreadsheet date formats are not guessed.`);
    try { return normalizeRecord(raw); } catch (err) { throw new Error(`CSV row ${i+3}: ${err.message}`); }
  }));
}
export function encodeSaved(records) { return JSON.stringify({ version: 1, currency: 'USD', records: validateRecords(records) }); }
export function decodeSaved(text) {
  const saved = JSON.parse(text);
  if (saved.version !== 1 || saved.currency !== 'USD') throw new Error('Saved data format is unsupported.');
  return validateRecords(saved.records);
}
const escICS = value => value.replaceAll('\\', '\\\\').replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
function foldLine(line) {
  let result = '', chunk = '';
  for (const c of line) {
    if (new TextEncoder().encode(chunk + c).length > 75) { result += chunk + '\r\n'; chunk = ' '; }
    chunk += c;
  }
  return result + chunk;
}
export function exportCalendar(records, startMonth, stamp = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cloud and Capital//Renewal Tracker v1//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  const start = startMonth + '-01';
  if (!validDate(start)) throw new Error('Choose a valid start month.');
  const end = addMonths(start, 12) || '9999-12-31';
  const timestamp = stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const event = (r, kind, date, detail) => {
    const next = new Date(date + 'T00:00:00Z'); next.setUTCDate(next.getUTCDate() + 1);
    const label = r.illustrative === 'true' ? '[Illustrative] ' : '';
    lines.push('BEGIN:VEVENT', `UID:${r.id}-${kind}-${date}@renewal.cloudandcapital.com`, `DTSTAMP:${timestamp}`, `DTSTART;VALUE=DATE:${date.replaceAll('-', '')}`, `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replaceAll('-', '')}`, 'SUMMARY:' + escICS(label + kind + ': ' + r.vendor), 'DESCRIPTION:' + escICS(`${detail}\nOwner: ${r.owner || 'Unassigned'}\nDecision: ${r.decision}\n${r.notes}\nManually entered; confirm vendor terms. This event does not cancel billing.`), 'END:VEVENT');
  };
  for (let i = 0; i < 12; i++) {
    const month = addMonths(start, i)?.slice(0, 7);
    if (month) for (const c of chargesInMonth(records, month)) event(c.record, 'Billing', c.date, `Projected charge: USD ${c.record.charge}. Assumes unchanged price and frequency.`);
  }
  for (const r of records.filter(r => r.billingState === 'ongoing')) for (const [field, kind] of [['renewalDate', 'Renewal'], ['noticeDate', 'Notice deadline']]) if (r[field] && r[field] >= start && r[field] < end) event(r, kind, r[field], 'Recorded date; confirm the exact deadline and time zone with the vendor.');
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
export const EXAMPLES = validateRecords([
  { id: 'example-monthly', vendor: 'Project desk', charge: '19', frequency: 'monthly', billingDate: '2026-11-05', renewalDate: '2026-11-05', noticeDate: '2026-11-04', owner: 'Owner', decision: 'Keep', billingState: 'ongoing', notes: 'Monthly renewal. Check the vendor terms.', illustrative: 'true', currency: 'USD' },
  { id: 'example-annual-240', vendor: 'Design library', charge: '240', frequency: 'annually', billingDate: '2026-11-18', renewalDate: '2026-11-18', noticeDate: '2026-10-19', owner: 'Owner', decision: 'Review needed', billingState: 'ongoing', notes: '30-day notice period. Review before the deadline.', illustrative: 'true', currency: 'USD' },
  { id: 'example-annual-600', vendor: 'Client workspace', charge: '600', frequency: 'annually', billingDate: '2026-11-28', renewalDate: '2026-11-28', noticeDate: '2026-10-28', owner: 'Operations', decision: 'Compare alternatives', billingState: 'ongoing', notes: 'One-calendar-month notice period. Compare plans before renewal.', illustrative: 'true', currency: 'USD' }
]);
export function examplesFor(asOf) {
  if (!validDate(asOf)) throw new Error('Choose a valid example reference date.');
  const month = addMonths(asOf.slice(0,7)+'-01',1)?.slice(0,7) || asOf.slice(0,7);
  return EXAMPLES.map((r,i) => {
    const billingDate = month + ['-05','-18','-28'][i];
    const notice = new Date(billingDate+'T00:00:00Z'); notice.setUTCDate(notice.getUTCDate() - (i===1 ? 30 : 1));
    const noticeDate = i===2 ? addMonths(billingDate,-1) : notice.toISOString().slice(0,10);
    return {...r,billingDate,renewalDate:billingDate,noticeDate};
  });
}
