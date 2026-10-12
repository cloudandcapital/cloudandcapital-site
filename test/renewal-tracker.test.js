import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLES, examplesFor, nextChargeDate, validDate, moneyCents, normalizeRecord, monthlyEquivalent, chargesInMonth, addMonths, recordWarnings, exportCSV, importCSV, encodeSaved, decodeSaved, exportCalendar } from '../src/lib/renewal-tracker.js';
const record = overrides => normalizeRecord({ ...EXAMPLES[0], illustrative: 'false', ...overrides });
test('worked example separates $89 equivalent and $859 cash', () => {
  assert.equal(monthlyEquivalent(EXAMPLES), 89);
  assert.equal(chargesInMonth(EXAMPLES,'2026-11').reduce((sum,c) => sum+c.cents,0),85900);
  assert.equal(chargesInMonth(EXAMPLES,'2026-12').reduce((sum,c) => sum+c.cents,0),1900);
  assert.equal(chargesInMonth(EXAMPLES,'2026-10').length,0);
});
test('money validates cents, zero, precision and invalid amounts', () => {
  assert.equal(moneyCents('0.01'),1); assert.equal(moneyCents('999999999.99'),99999999999);
  for(const bad of ['', '-1','NaN','Infinity','1e2','1.001','1,20','1000000000']) assert.throws(()=>moneyCents(bad));
  assert.equal(monthlyEquivalent([record({charge:'0.10',frequency:'annually'})]),.1/12);
});
test('month-end billing clamps from original anchor without drifting', () => {
  assert.equal(addMonths('2027-01-31',1),'2027-02-28'); assert.equal(addMonths('2027-01-31',2),'2027-03-31');
  assert.equal(addMonths('2028-01-31',1),'2028-02-29'); assert.equal(addMonths('2028-02-29',12),'2029-02-28'); assert.equal(addMonths('2028-02-29',48),'2032-02-29');
  const r=record({billingDate:'2027-01-31'}); assert.equal(chargesInMonth([r],'2027-02')[0].date,'2027-02-28'); assert.equal(chargesInMonth([r],'2027-03')[0].date,'2027-03-31');
});
test('quarterly and annual schedules retain start date and full charge', () => {
  const r=record({charge:'120',frequency:'quarterly',billingDate:'2026-12-31'});
  assert.equal(monthlyEquivalent([r]),40); assert.equal(chargesInMonth([r],'2027-01').length,0); assert.equal(chargesInMonth([r],'2027-03')[0].cents,12000);
  assert.equal(chargesInMonth([r],'2026-09').length,0);
});
test('missing dates produce partial projection and owner flags', () => {
  const r=record({billingDate:'',renewalDate:'',noticeDate:'',owner:''}); assert.equal(recordWarnings(r).length,4);
  assert.equal(monthlyEquivalent([r]),19); assert.equal(chargesInMonth([r],'2026-11').length,0);
  assert.ok(recordWarnings(record({noticeDate:'2026-11-06'})).some(w=>w.includes('after renewal')));
});
test('date validation rejects invalid dates and accepts leap days',()=>{
  assert.equal(validDate('2028-02-29'),true);
  for(const d of ['2027-02-29','2026-04-31','2026-13-01','2026-00-01','2026-01-00','0000-01-01','2026-1-01','word']) { assert.equal(validDate(d),false); assert.throws(()=>record({billingDate:d})); }
});
test('cancel decision keeps payments; confirmed ended excludes them',()=>{
  const cancel=record({decision:'Cancel'}); assert.equal(chargesInMonth([cancel],'2026-11').length,1); assert.equal(monthlyEquivalent([cancel]),19);
  const ended=record({billingState:'ended'}); assert.equal(monthlyEquivalent([ended]),0); assert.equal(chargesInMonth([ended],'2026-11').length,0); assert.equal(recordWarnings(ended).length,0);
});
test('CSV exact round trip preserves commas, quotes, Unicode and newlines',()=>{
  const input=[record({vendor:'Ångström, "Desk"',notes:'First\r\nSecond\nThird; 🥂',owner:"'Owner"}),...EXAMPLES.slice(1)];
  assert.deepEqual(importCSV(exportCSV(input)),input); assert.deepEqual(importCSV(exportCSV([])),[]);
});
test('CSV formula-like text is inert and reversible',()=>{
  for(const value of ['=HYPERLINK("x")','+SUM(1,2)','-danger','@command','\t=1','\n=1',"'quoted"]) { const r=record({vendor:value,notes:value,owner:value}); const csv=exportCSV([r]); assert.ok(csv.includes('"\'')); assert.deepEqual(importCSV(csv),[r]); }
});
test('bad import is rejected without coercing incomplete data',()=>{
  assert.throws(()=>importCSV('vendor,charge\na,19')); assert.throws(()=>importCSV(exportCSV(EXAMPLES)+'"unclosed'));
  assert.throws(()=>importCSV(exportCSV([EXAMPLES[0],EXAMPLES[0]])));
  assert.throws(()=>importCSV(exportCSV([record({})]).replace('USD','EUR')));
  assert.throws(()=>importCSV(exportCSV([record({})]).replace('"monthly"','"weekly"')));
  assert.throws(()=>record({frequency:'toString'}));
});
test('saved records retain exact fields; corrupted and unsupported data fails',()=>{
  assert.deepEqual(decodeSaved(encodeSaved(EXAMPLES)),EXAMPLES); assert.deepEqual(decodeSaved(encodeSaved([])),[]);
  assert.throws(()=>decodeSaved('{')); assert.throws(()=>decodeSaved('{"version":2,"currency":"USD","records":[]}'));
  assert.throws(()=>decodeSaved('{"version":1,"currency":"EUR","records":[]}'));
});
test('calendar exports independent billing, renewal and notice with stable UIDs',()=>{
  const ics=exportCalendar(EXAMPLES,'2026-10',new Date('2026-10-12T12:00:00Z'));
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20261019')); assert.ok(ics.includes('DTSTART;VALUE=DATE:20261118'));
  assert.ok(ics.includes('Notice deadline: Design library')); assert.ok(ics.includes('Renewal: Design library'));
  assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,19); // 11 monthly + 2 annual + 6 distinct recorded dates
  assert.equal(ics.includes('VALARM'),false); assert.equal(ics.includes('RRULE'),false);
  assert.equal(ics,exportCalendar(EXAMPLES,'2026-10',new Date('2026-10-12T12:00:00Z')));
  for(const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line)<=75);
});
test('calendar escapes text and excludes missing, ended and out-of-window dates',()=>{
  const r=record({vendor:'Désk,;\\\nInjected: x',billingDate:'2027-01-31',renewalDate:'',noticeDate:'',notes:'🥂'.repeat(50)});
  const ics=exportCalendar([r],'2027-02'); assert.ok(ics.includes('DTSTART;VALUE=DATE:20270228\r\nDTEND;VALUE=DATE:20270301'));
  assert.ok(ics.includes('Désk\\,\\;\\\\\\nInjected: x'));
  for(const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line)<=75);
  assert.equal((exportCalendar([record({billingState:'ended'})],'2026-11').match(/BEGIN:VEVENT/g)||[]).length,0);
});

test('formatted USD charges are accepted without guessing malformed grouping',()=>{
 assert.equal(moneyCents('$19'),1900); assert.equal(moneyCents(' $ 1,200.00 '),120000); for(const bad of ['1,20','12,34,567','1 200','€19'])assert.throws(()=>moneyCents(bad));
});
test('CSV accepts harmless padding and uppercase booleans but rejects ambiguous dates',()=>{
 const padded=exportCSV(EXAMPLES).replace('"cc-renewal-tracker-v1"','"cc-renewal-tracker-v1",,,,,').replaceAll('"true"','"TRUE"'); assert.deepEqual(importCSV(padded),EXAMPLES);
 assert.throws(()=>importCSV(exportCSV(EXAMPLES).replace('2026-11-05','11/5/2026')),/row 3, billingDate.*YYYY-MM-DD/);
});

test('next projected charge stays anchored through short months and annual rollover',()=>{
 const monthly=record({billingDate:'2027-01-31'}); assert.equal(nextChargeDate(monthly,'2027-02-28'),'2027-02-28'); assert.equal(nextChargeDate(monthly,'2027-03-01'),'2027-03-31');
 const annual=record({billingDate:'2028-02-29',frequency:'annually'}); assert.equal(nextChargeDate(annual,'2029-02-28'),'2029-02-28'); assert.equal(nextChargeDate(annual,'2029-03-01'),'2030-02-28'); assert.equal(nextChargeDate(record({billingDate:''}),'2026-10-12'),null);
});
test('moving examples always put the $859 in the following month',()=>{
 for(const today of ['2026-12-10','2027-03-31','2028-01-31']) { const examples=examplesFor(today),month=addMonths(today.slice(0,7)+'-01',1).slice(0,7); assert.equal(monthlyEquivalent(examples),89); assert.equal(chargesInMonth(examples,month).reduce((sum,c)=>sum+c.cents,0),85900); assert.ok(examples.every(r=>validDate(r.noticeDate)&&r.illustrative==='true')); }
});

test('past deadline warning formats dates and mentions cancellation only for Cancel',()=>{
 const keep=record({noticeDate:'2026-10-01',renewalDate:'2026-11-01',decision:'Keep'}),cancel={...keep,decision:'Cancel'};
 const keepWarning=recordWarnings(keep,'2026-10-12').find(x=>x.includes('has passed'));assert.ok(keepWarning.includes('Nov 1, 2026'));assert.ok(keepWarning.includes('renewal status'));assert.equal(keepWarning.includes('cancellation confirmation'),false);
 assert.ok(recordWarnings(cancel,'2026-10-12').some(x=>x.includes('cancellation confirmation')));
});
