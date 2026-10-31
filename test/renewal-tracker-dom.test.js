// DOM simulation, not a browser/layout/assistive-technology acceptance test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { STORAGE_KEY, EXAMPLES, encodeSaved, decodeSaved, exportCSV } from '../src/lib/renewal-tracker.js';
const component = await readFile(new URL('../src/components/RenewalTracker.astro',import.meta.url),'utf8');
const markup = component.replace(/^---[\s\S]*?---\s*/,'').replace(/<script>[\s\S]*?<\/script>\s*$/,'');
const logic = (await readFile(new URL('../src/lib/renewal-tracker.js',import.meta.url),'utf8')).replace(/^export /gm,'');
const ui = (await readFile(new URL('../src/lib/renewal-tracker-ui.js',import.meta.url),'utf8')).replace(/^import .*?;\s*/,'').replace(/^export /gm,'');
function setup({saved,blocked=false,readBlocked=false,clock='2026-10-12T12:00:00Z'}={}) {
  const dom = new JSDOM(markup,{ url:'https://prototype.invalid',runScripts:'outside-only' });
  const w=dom.window; w.TextEncoder=TextEncoder;
  const RealDate=w.Date;
  w.Date=class extends RealDate { constructor(...args){ super(...(args.length ? args : [clock])); } static now(){ return new RealDate(clock).getTime(); } };
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  if(saved!==undefined) w.localStorage.setItem(STORAGE_KEY,saved);
  if(blocked) w.Storage.prototype.setItem=function(){throw new Error('QuotaExceededError');};
  if(readBlocked) w.Storage.prototype.getItem=function(){throw new Error('SecurityError');};
  w.URL.createObjectURL=()=> 'blob:prototype'; w.URL.revokeObjectURL=()=>{};
  w.eval(logic+'\n'+ui+'\nstartTracker(document.getElementById("renewal-tracker"));');
  const $=id=>w.document.getElementById(id);
  const submit=()=> $('rt-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  const field=(name,value)=>{$('rt-form').elements.namedItem(name).value=value;};
  return {dom,w,$,submit,field};
}
test('copying an example to a real diary restores past-date warnings after save and reload', () => {
  let view=setup({clock:'2026-10-31T12:00:00Z'});
  view.$('rt-records').querySelector('button').click();
  assert.equal(view.$('rt-form').elements.namedItem('illustrative').checked,false);
  view.field('vendor','Fictional own subscription'); view.field('noticeDate','2026-10-01'); view.field('renewalDate','2026-10-20');
  view.submit();
  const saved=view.w.localStorage.getItem(STORAGE_KEY);
  assert.equal(decodeSaved(saved)[0].illustrative,'false');
  assert.match(view.$('rt-records').textContent,/Notice deadline has passed/);
  assert.match(view.$('rt-records').textContent,/Recorded renewal date has passed/);
  view.dom.window.close();
  view=setup({saved,clock:'2026-10-31T12:00:00Z'});
  assert.match(view.$('rt-records').textContent,/Notice deadline has passed/);
  view.$('rt-records').querySelector('button').click();
  assert.equal(view.$('rt-form').elements.namedItem('illustrative').checked,false);
  view.dom.window.close();
});
test('example view shows correct cash/equivalent, is unsaved, and changes month',()=>{
  const {dom,w,$}=setup();
  assert.equal($('rt-monthly').textContent,'$89.00'); assert.equal($('rt-cash').textContent,'$859.00');
  assert.equal(w.localStorage.getItem(STORAGE_KEY),null); assert.equal($('rt-records').querySelectorAll('article').length,3);
  assert.equal($('rt-start').hidden,false); assert.equal($('rt-add').hidden,true); assert.equal($('rt-mode').children.length,0); assert.equal($('rt-title').textContent,'EXAMPLE'); assert.equal($('rt-example-arrow').hasAttribute('hidden'),false);
  $('rt-month').value='2026-12'; $('rt-month').dispatchEvent(new w.Event('change')); assert.equal($('rt-cash').textContent,'$19.00');
  dom.window.close();
});
test('start empty, add, save, reload, edit and delete preserve records',()=>{
  let {dom,w,$,field,submit}=setup();
  $('rt-start').click(); assert.equal($('rt-confirm').open,false);
  assert.equal($('rt-editor').open,true); assert.equal(w.document.activeElement.name,'vendor');
  field('vendor','Own tool'); field('charge','240'); field('frequency','annually'); field('billingDate','2026-11-30'); field('notes','Uses, dependencies and next action'); submit();
  assert.equal($('rt-editor').open,false); assert.equal(w.document.activeElement.id,'rt-add');
  const saved=w.localStorage.getItem(STORAGE_KEY); assert.equal(decodeSaved(saved).length,1); assert.equal(decodeSaved(saved)[0].illustrative,'false');
  dom.window.close();
  ({dom,w,$,field,submit}=setup({saved})); assert.ok($('rt-records').textContent.includes('Own tool'));
  $('rt-records').querySelector('button').click(); field('charge','300'); submit(); assert.equal(decodeSaved(w.localStorage.getItem(STORAGE_KEY))[0].charge,'300.00');
  $('rt-records').querySelectorAll('button')[1].click(); $('rt-confirm-yes').click(); assert.equal(decodeSaved(w.localStorage.getItem(STORAGE_KEY)).length,0);
  dom.window.close();
});
test('unknown dates and owner are visible, and invalid money does not save',()=>{
  const {dom,w,$,field,submit}=setup({saved:encodeSaved([])});
  $('rt-add').click(); field('vendor','Unknown date'); field('charge','19'); submit();
  assert.ok($('rt-records').textContent.includes('Notice deadline not recorded')); assert.ok($('rt-cash-note').textContent.includes('Partial total'));
  $('rt-add').click(); field('vendor','Invalid'); field('charge','19.999'); submit();
  assert.equal($('rt-editor').open,true); assert.ok($('rt-form-error').textContent.includes('decimal'));
  assert.equal(decodeSaved(w.localStorage.getItem(STORAGE_KEY)).length,1); dom.window.close();
});
test('cancel is a decision, confirmed billing ended changes both totals',()=>{
  const {dom,w,$,field,submit}=setup({saved:encodeSaved(EXAMPLES)});
  $('rt-month').value='2026-11'; $('rt-records').querySelector('button').click(); field('decision','Cancel'); submit();
  assert.equal($('rt-cash').textContent,'$859.00');
  $('rt-records').querySelector('button').click(); field('billingState','ended'); submit();
  assert.equal($('rt-monthly').textContent,'$70.00'); assert.equal($('rt-cash').textContent,'$840.00'); dom.window.close();
});
test('storage denial shows not saved; existing saved data remains intact',()=>{
  const original=encodeSaved(EXAMPLES), {dom,w,$,field,submit}=setup({saved:original,blocked:true});
  $('rt-records').querySelector('button').click(); field('charge','25'); submit();
  assert.ok($('rt-save-status').textContent.includes('Not saved')); assert.equal(w.localStorage.getItem(STORAGE_KEY),original); dom.window.close();
});
test('corrupt storage is preserved until overwrite is explicitly confirmed',()=>{
  const {dom,w,$,field,submit}=setup({saved:'{broken'});
  assert.ok($('rt-save-status').textContent.includes('could not be read'));
  $('rt-start').click(); field('vendor','New'); field('charge','20'); submit();
  assert.equal(w.localStorage.getItem(STORAGE_KEY),'{broken'); $('rt-confirm-no').click(); assert.equal(w.localStorage.getItem(STORAGE_KEY),'{broken'); dom.window.close();
});
test('unsaved editor discard requires confirmation and restores focus',()=>{
  const {dom,w,$,field}=setup({saved:encodeSaved([])});
  $('rt-add').click(); field('vendor','Unsaved'); $('rt-form').dispatchEvent(new w.Event('input',{bubbles:true}));
  $('rt-editor').dispatchEvent(new w.Event('cancel',{cancelable:true})); assert.equal($('rt-confirm').open,true); assert.equal($('rt-confirm-no'),w.document.activeElement);
  $('rt-confirm-no').click(); assert.equal($('rt-editor').open,true);
  $('rt-close').click(); $('rt-confirm-yes').click(); assert.equal($('rt-editor').open,false); assert.equal(w.document.activeElement.id,'rt-add'); dom.window.close();
});
test('import waits for confirmation, replaces records, and rejects malformed input',async()=>{
  const {dom,w,$}=setup({saved:encodeSaved([])}), input=$('rt-import');
  Object.defineProperty(input,'files',{configurable:true,value:[{size:300,text:async()=>exportCSV(EXAMPLES)}]});
  await input.onchange({target:input}); assert.equal(decodeSaved(w.localStorage.getItem(STORAGE_KEY)).length,0);
  $('rt-confirm-yes').click(); assert.equal(decodeSaved(w.localStorage.getItem(STORAGE_KEY)).length,3);
  Object.defineProperty(input,'files',{configurable:true,value:[{size:20,text:async()=>'bad,csv'}]});
  await input.onchange({target:input}); assert.ok($('rt-storage-feedback').textContent.includes('Nothing imported')); assert.equal(decodeSaved(w.localStorage.getItem(STORAGE_KEY)).length,3); dom.window.close();
});
test('text is inserted safely and labels/dialog semantics support native keyboard use',()=>{
  const r={...EXAMPLES[0],vendor:'<img src=x onerror=alert(1)>',notes:'<script>bad()</script>'}, {dom,w,$}=setup({saved:encodeSaved([r])});
  assert.equal($('rt-records').querySelector('img'),null); assert.ok($('rt-records').textContent.includes('<img'));
  for(const field of $('rt-form').querySelectorAll('input:not([type=hidden]),select,textarea')) assert.ok(field.closest('label'));
  assert.equal($('rt-editor').getAttribute('aria-labelledby'),'rt-editor-title'); assert.equal($('rt-form-error').getAttribute('role'),'alert');
  assert.equal(w.document.querySelector('[tabindex]'),null); dom.window.close();
});

test('invalid nonempty fallback month never displays a zero cash total',()=>{
 const {dom,w,$}=setup(); $('rt-month').type='text';
 for(const bad of ['11/2026','November 2026','2026-13','']) { $('rt-month').value=bad; $('rt-month').dispatchEvent(new w.Event('change')); assert.equal($('rt-cash').textContent,'Choose a month'); assert.ok($('rt-cash-note').textContent.includes('No charge total')); assert.equal($('rt-month').getAttribute('aria-invalid'),'true'); }
 $('rt-month').value='2026-11'; $('rt-month').dispatchEvent(new w.Event('change')); assert.equal($('rt-cash').textContent,'$859.00'); dom.window.close();
});
test('examples stay current and starting your tracker opens a blank unsaved entry',()=>{
 const {dom,w,$}=setup({clock:'2027-03-10T12:00:00Z'});
 assert.equal($('rt-month').value,'2027-04'); assert.equal($('rt-cash').textContent,'$859.00'); assert.equal($('rt-dates').textContent.includes('Past date'),false);
 $('rt-start').click(); assert.equal($('rt-editor').open,true); assert.equal($('rt-form').elements.namedItem('vendor').value,''); assert.equal($('rt-form').elements.namedItem('illustrative').checked,false); assert.equal($('rt-confirm').open,false); assert.equal(w.localStorage.getItem(STORAGE_KEY),null); dom.window.close();
});
test('adding or copying from examples defaults to a real record',()=>{
 for(const edit of [false,true]) { const {dom,w,$,field,submit}=setup();
 if(edit) $('rt-records').querySelector('button').click(); else $('rt-start').click();
 field('vendor','My real tool'); field('charge','50'); field('frequency','monthly'); submit();
 const saved=decodeSaved(w.localStorage.getItem(STORAGE_KEY)); assert.equal(saved.length,1); assert.equal(saved[0].illustrative,'false'); assert.equal($('rt-monthly').textContent,'$50.00'); assert.equal($('rt-month').value,'2026-10'); dom.window.close(); }
});
test('saved example data stays identified once above the diary and in downloads',()=>{
 const {dom,w,$,field,submit}=setup(); $('rt-records').querySelector('button').click(); assert.equal($('rt-form').elements.namedItem('illustrative').checked,false); $('rt-form').elements.namedItem('illustrative').checked=true; field('decision','Cancel'); submit();
 const saved=w.localStorage.getItem(STORAGE_KEY), records=decodeSaved(saved); assert.equal(records.length,1); assert.equal(records[0].illustrative,'true'); assert.equal(records[0].decision,'Cancel'); assert.ok($('rt-mode').textContent.includes('Example entries in this diary: Project desk')); assert.equal($('rt-records').textContent.includes('Illustrative'),false); assert.ok(exportCSV(records).includes('true')); dom.window.close();
 const reopened=setup({saved}); assert.ok(reopened.$('rt-mode').textContent.includes('Example entries in this diary: Project desk')); assert.equal(reopened.$('rt-records').textContent.includes('Illustrative'),false); reopened.dom.window.close();
});
test('validation focuses failed input and puts its message alongside it',()=>{
 const {dom,w,$,field,submit}=setup({saved:encodeSaved([])}); $('rt-add').click(); field('vendor','A'); field('charge','1,20'); submit();
 const charge=$('rt-form').elements.namedItem('charge'); assert.equal(w.document.activeElement,charge); assert.equal(charge.getAttribute('aria-invalid'),'true'); assert.ok(charge.parentElement.querySelector('.rt-field-error')); assert.equal(charge.getAttribute('aria-describedby'),'rt-field-charge-error');
 field('charge','$1,200.00'); submit(); assert.equal(decodeSaved(w.localStorage.getItem(STORAGE_KEY))[0].charge,'1200.00'); dom.window.close();
});
test('blocked reads do not claim corruption or warn of unreadable saved records',()=>{
 const {dom,w,$,field,submit}=setup({readBlocked:true,blocked:true}); assert.ok($('rt-save-status').textContent.includes('unavailable')); assert.equal($('rt-recover').hidden,true);
 $('rt-start').click(); field('vendor','A'); field('charge','19'); submit(); assert.equal($('rt-confirm').open,false); assert.ok($('rt-save-status').textContent.includes('Not saved')); dom.window.close();
});
test('real past notice dates warn on the card; ordinary past payments do not',()=>{
 const r={...EXAMPLES[0],illustrative:'false',noticeDate:'2026-10-01',renewalDate:'2026-11-01',billingDate:'2025-03-15',decision:'Cancel'}, {dom,w,$}=setup({saved:encodeSaved([r])});
 assert.ok($('rt-records').textContent.includes('Notice deadline has passed')); assert.ok($('rt-records').textContent.includes('Oct 15, 2026')); assert.ok($('rt-records').textContent.includes('Decided: cancel'));
 $('rt-month').value='2026-09'; $('rt-month').dispatchEvent(new w.Event('change')); const billing=[...$('rt-dates').children].find(x=>x.textContent.includes('Billing ·')); assert.equal(billing.textContent.includes('Past date'),false); dom.window.close();
});
test('corrupted saved records have a raw recovery action and described confirmations',()=>{
 const {dom,w,$}=setup({saved:'{broken'}); assert.equal($('rt-recover').hidden,false); assert.equal($('rt-confirm').getAttribute('aria-describedby'),'rt-confirm-message');
 $('rt-start').click(); assert.equal($('rt-editor').open,true); $('rt-form').elements.namedItem('vendor').value='My tool'; $('rt-form').elements.namedItem('charge').value='20'; $('rt-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true})); assert.equal($('rt-confirm-yes').textContent,'Save only this subscription'); assert.ok($('rt-confirm-message').textContent.includes('replaces the saved diary')); $('rt-confirm-no').click(); assert.equal(w.localStorage.getItem(STORAGE_KEY),'{broken'); dom.window.close();
});
test('import errors are shown next to import/export controls',async()=>{
 const {dom,w,$}=setup({saved:encodeSaved([])}), input=$('rt-import'); Object.defineProperty(input,'files',{value:[{size:10,text:async()=>'bad,csv'}]}); await input.onchange({target:input});
 assert.ok($('rt-storage-feedback').closest('.rt-storage')); assert.ok($('rt-storage-feedback').textContent.includes('Nothing imported')); dom.window.close();
});

test('calendar download uses your selected month and reports results beside the dates',async()=>{
 const original=encodeSaved([{...EXAMPLES[0],vendor:'My own subscription',illustrative:'false'}]);
 const {dom,w,$}=setup({saved:original}), files=[], downloads=[];
 w.Blob=Blob; w.URL.createObjectURL=blob=>{files.push(blob);return 'blob:calendar';};
 w.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download);};
 $('rt-month').value='2026-11'; $('rt-month').dispatchEvent(new w.Event('change')); $('rt-ics').click();
 assert.deepEqual(downloads,['cloud-capital-renewals.ics']); assert.equal(files[0].type,'text/calendar;charset=utf-8');
 const calendar=await files[0].text();
 assert.ok(calendar.includes('SUMMARY:Renewal: My own subscription')); assert.ok(calendar.includes('DTSTART;VALUE=DATE:20261105'));
 assert.ok(calendar.includes('DTSTART;VALUE=DATE:20271005')); assert.equal(calendar.includes('DTSTART;VALUE=DATE:20271105'),false);
 assert.equal(calendar.includes('VALARM'),false); assert.equal(calendar.includes('[Illustrative]'),false);
 assert.ok($('rt-calendar-feedback').closest('.rt-calendar')); assert.ok($('rt-calendar-feedback').textContent.includes('set any alerts there'));
 assert.equal($('rt-storage-feedback').textContent,''); assert.equal(w.localStorage.getItem(STORAGE_KEY),original);
 $('rt-month').type='text'; $('rt-month').value='invalid'; $('rt-ics').click();
 assert.equal(downloads.length,1); assert.ok($('rt-calendar-feedback').textContent.includes('valid start month')); assert.equal(w.localStorage.getItem(STORAGE_KEY),original);
 dom.window.close();
});

test('reopening an editor clears previous field errors and restores charge help',()=>{
 const {dom,w,$,field,submit}=setup({saved:encodeSaved([])});$('rt-add').click();field('vendor','Test');field('charge','1,20');submit();assert.ok($('rt-form').querySelector('.rt-field-error'));
 $('rt-close').click();$('rt-add').click();assert.equal($('rt-form').querySelector('.rt-field-error'),null);assert.equal($('rt-form').elements.namedItem('charge').getAttribute('aria-describedby'),'rt-charge-help');assert.equal($('rt-example-edit').hidden,true);dom.window.close();
});


test('hero start opens your first blank subscription without saving example records',()=>{
 const {dom,w,$}=setup();
 assert.equal($('rt-start').getAttribute('aria-label'),'Start my own tracker');
 $('rt-start').click();
 assert.equal($('rt-editor').open,true); assert.equal(w.document.activeElement.name,'vendor');
 assert.equal($('rt-form').elements.namedItem('vendor').value,''); assert.equal($('rt-form').elements.namedItem('illustrative').checked,false);
 assert.equal(w.localStorage.getItem(STORAGE_KEY),null);
 $('rt-close').click(); assert.equal($('rt-editor').open,false); assert.equal(w.document.activeElement.id,'rt-start');
 assert.equal(w.localStorage.getItem(STORAGE_KEY),null); dom.window.close();
});

test('starting from an example preserves an existing diary until replacement is confirmed',()=>{
 const original=encodeSaved([{...EXAMPLES[0],vendor:'My existing tool',illustrative:'false'}]);
 const {dom,w,$,field,submit}=setup({saved:original});
 $('rt-demo').click(); assert.equal($('rt-demo').textContent,'Return to my tracker'); assert.equal($('rt-mode').children.length,0);
 $('rt-demo').click(); assert.equal($('rt-title').textContent,'Your tracker'); assert.equal($('rt-example-arrow').hasAttribute('hidden'),true); assert.equal($('rt-add').hidden,false); assert.equal(w.localStorage.getItem(STORAGE_KEY),original);
 $('rt-demo').click(); $('rt-start').click(); assert.equal(w.localStorage.getItem(STORAGE_KEY),original);
 field('vendor','My new tool'); field('charge','30'); submit();
 assert.equal($('rt-confirm').open,true); assert.equal(w.localStorage.getItem(STORAGE_KEY),original);
 $('rt-confirm-no').click(); assert.equal($('rt-editor').open,true); assert.equal(w.localStorage.getItem(STORAGE_KEY),original);
 submit(); $('rt-confirm-yes').click();
 const saved=decodeSaved(w.localStorage.getItem(STORAGE_KEY)); assert.equal(saved.length,1); assert.equal(saved[0].vendor,'My new tool'); assert.equal(saved[0].illustrative,'false');
 assert.equal($('rt-start').hidden,true); assert.equal($('rt-add').hidden,false); assert.equal($('rt-title').textContent,'Your tracker'); assert.equal(w.document.activeElement.id,'rt-add'); dom.window.close();
});
