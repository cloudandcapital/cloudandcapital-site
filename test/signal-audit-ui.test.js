import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { mountSignalAudit } from '../src/lib/signal-audit-ui.js';
import { QUESTIONS } from '../src/lib/signal-audit.js';
const page = await readFile(new URL('../src/pages/signal-audit.astro', import.meta.url), 'utf8');
const results = await readFile(new URL('../src/components/SignalAuditResults.astro', import.meta.url), 'utf8');
const html = page.slice(page.indexOf('<BaseLayout')).replace('<SignalAuditResults />', results).replace(/<script>[\s\S]*?<\/script>/, '');
function setup() {
  const dom = new JSDOM(html, { url: 'https://cloudandcapital.com/signal-audit' });
  const { window } = dom; const events = [];
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.ccTrack = (...args) => events.push(args);
  let outbound = 0; window.fetch = async () => { outbound++; throw new Error('Unexpected request'); };
  const { state } = mountSignalAudit(window.document);
  const $ = (id) => window.document.getElementById(id);
  const choose = (name, value) => { const input = window.document.querySelector(`input[name="${name}"][value="${value}"]`); input.checked = true; input.dispatchEvent(new window.Event('change', { bubbles: true })); };
  const begin = () => { choose('target-scope', 'product'); choose('technology-scope', 'saas'); $('beginButton').click(); };
  const answerAll = (value) => { for (let i = 0; i < QUESTIONS.length; i++) { choose('answer', value); $('nextButton').click(); } };
  return { dom, window, state, $, choose, begin, answerAll, events, outbound: () => outbound };
}
test('partial answers show the qualified headline in the result and copied summary', async () => {
  const ui=setup(); let copied='';
  Object.defineProperty(ui.window.navigator,'clipboard',{value:{writeText:async text=>{copied=text;}}});
  try {
    ui.begin(); ui.answerAll('score-2');
    assert.equal(ui.$('resultTitle').textContent,'Visible, With Gaps');
    assert.equal(ui.$('axisSignalScore').textContent,'67/100');
    assert.equal(ui.$('axisDecisionScore').textContent,'67/100');
    ui.$('copyButton').click(); await new Promise(resolve=>setImmediate(resolve));
    assert.match(copied,/Visible, With Gaps/); assert.doesNotMatch(copied,/Result: Decision Embedded/);
    assert.equal(ui.outbound(),0);
  } finally { ui.dom.window.close(); }
});
test('enabled controls explain missing selections, question focus moves, and Previous preserves answers', () => {
  const ui = setup(); try {
    assert.equal(ui.$('beginButton').disabled, false); ui.$('beginButton').click(); assert.match(ui.$('setupError').textContent, /Choose what to assess/); ui.begin();
    assert.equal(ui.$('nextButton').disabled, false); assert.equal(ui.window.document.activeElement, ui.$('questionPrompt'));
    ui.$('nextButton').click(); assert.equal(ui.state.index, 0); assert.match(ui.$('answerError').textContent, /Choose the closest answer/);
    ui.choose('answer', 'score-1'); ui.$('nextButton').click();
    assert.match(ui.$('progressText').textContent, /2 of 12/);
    ui.choose('answer', 'score-2'); ui.$('previousButton').click();
    assert.equal(ui.window.document.querySelector('input[name="answer"]:checked').value, 'score-1');
  } finally { ui.dom.window.close(); }
});
test('mixed scope is exclusive with individual categories', () => {
  const ui = setup(); try {
    ui.choose('technology-scope', 'saas'); ui.choose('technology-scope', 'mixed'); assert.match(ui.$('liveStatus').textContent, /Individual categories cleared/);
    assert.deepEqual([...ui.window.document.querySelectorAll('input[name="technology-scope"]:checked')].map((i) => i.value), ['mixed']);
    ui.choose('technology-scope', 'ai-data'); assert.equal(ui.window.document.querySelector('input[value="mixed"]').checked, false); assert.match(ui.$('liveStatus').textContent, /Mixed technology portfolio cleared/);
  } finally { ui.dom.window.close(); }
});
test('all unknown answers hide the map point, explain uncertainty, and make zero requests', () => {
  const ui = setup(); try {
    ui.begin(); ui.answerAll('outside-visibility');
    assert.equal(ui.$('results').hidden, false); assert.equal(ui.$('mapPoint').hidden, true);
    assert.equal(ui.$('evidenceScore').textContent, '0/12'); assert.match(ui.$('coverageNote').textContent, /12 unknown/);
    assert.match(ui.$('moveTitle').textContent, /missing information/); assert.equal(ui.outbound(), 0);
    assert.equal(ui.window.document.activeElement, ui.$('resultTitle'));
    assert.ok(ui.events.every(([, properties]) => !('answers' in properties) && !('score' in properties)));
  } finally { ui.dom.window.close(); }
});
test('a complete strong result displays points and a maintenance suggestion', () => {
  const ui = setup(); try {
    ui.begin(); ui.answerAll('score-3');
    assert.equal(ui.$('axisSignalScore').textContent, '100/100'); assert.equal(ui.$('moveTitle').textContent, 'Keep what’s working');
    assert.equal(ui.$('mapPoint').hidden, false); assert.equal(ui.$('answerReview').children.length, 12); assert.equal(ui.outbound(), 0);
  } finally { ui.dom.window.close(); }
});
test('example edit retains its label; changing scope clears answers and the example identity', () => {
  const ui = setup(); try {
    ui.$('exampleButton').click(); assert.equal(ui.$('exampleNotice').hidden, false); assert.equal(ui.$('axisSignalScore').textContent, '78/100');
    ui.$('editAnswersButton').click(); assert.equal(ui.state.isExample, true); assert.equal(ui.$('nextButton').disabled, false);
    ui.$('previousButton').click(); assert.equal(ui.$('scopeResetWarning').hidden, true); assert.equal(ui.$('scopeResetWarning').textContent, ''); ui.choose('target-scope', 'organization');
    assert.equal(ui.$('scopeResetWarning').hidden, false); assert.match(ui.$('scopeResetWarning').textContent, /clears your 12 answers/); assert.equal(Object.keys(ui.state.answers).length, 12);
    ui.$('beginButton').click();
    assert.equal(ui.state.isExample, false); assert.deepEqual(ui.state.answers, {}); assert.equal(ui.$('scopeChangeNotice').hidden, false); assert.equal(ui.$('nextButton').disabled, false);
  } finally { ui.dom.window.close(); }
});
test('copy and print preserve example context; Start fresh clears the whole session', async () => {
  const ui = setup(); let copied = ''; let printed = 0;
  Object.defineProperty(ui.window.navigator, 'clipboard', { value: { writeText: async (text) => { copied = text; } } }); ui.window.print = () => { printed++; };
  try {
    ui.$('exampleButton').click(); ui.$('copyButton').click(); await new Promise((r) => setImmediate(r));
    assert.match(copied, /Made-up example/); assert.match(copied, /28\/100/); assert.match(copied, /YOUR ANSWERS/);
    assert.equal(ui.$('copyStatus').textContent, 'Summary and answers copied.'); ui.$('printButton').click(); assert.equal(printed, 1);
    ui.$('retakeButton').click(); assert.deepEqual(ui.state.answers, {}); assert.equal(ui.state.result, null); assert.equal(ui.state.isExample, false); assert.equal(ui.$('results').hidden, true);
    assert.equal(ui.window.document.querySelectorAll('input[name="technology-scope"]:checked').length, 0); assert.equal(ui.$('beginButton').disabled, false);
  } finally { ui.dom.window.close(); }
});

test('edited examples keep their provenance without a false original scenario description', async () => {
  const ui = setup(); let copied = '';
  Object.defineProperty(ui.window.navigator, 'clipboard', { value: { writeText: async (text) => { copied = text; } } });
  try {
    ui.$('exampleButton').click(); assert.equal(ui.$('resultEyebrow').textContent, 'Example result'); assert.equal(ui.$('exampleDescription').hidden, false);
    assert.equal(ui.events.find(([name]) => name === 'tool_start')[1].entry, 'audit_example');
    ui.$('editAnswersButton').click(); ui.answerAll('score-3');
    assert.equal(ui.$('exampleLabel').textContent, 'Started from the made-up example, then edited');
    assert.equal(ui.$('exampleDescription').hidden, true); assert.equal(ui.$('exampleDescription').textContent, '');
    assert.equal(ui.$('exampleContext').textContent, 'These answers started from the made-up example.');
    ui.$('copyButton').click(); await new Promise((r) => setImmediate(r));
    assert.match(copied, /Started from the made-up example, then edited/); assert.doesNotMatch(copied, /Made-up example: a team’s software renewals/);
    assert.match(copied, /Taken: /); assert.equal(ui.$('assessmentDate').dateTime, ui.state.takenAt); assert.equal(ui.$('rubricVersion').textContent, '2026-10-31-r3');
  } finally { ui.dom.window.close(); }
});

test('known renewal gap still renders when exclusions hide the map and links to a place to track it', () => {
  const ui = setup(); const values = ['score-2', 'score-2', 'score-1', 'not-applicable', 'score-1', 'not-applicable', 'score-1', 'score-0', 'score-1', 'score-1', 'score-1', 'score-1'];
  try {
    ui.begin(); for (const answer of values) { ui.choose('answer', answer); ui.$('nextButton').click(); }
    assert.equal(ui.$('mapPoint').hidden, true); assert.equal(ui.$('mapCoverageNotice').hidden, false);
    assert.match(ui.$('moveTitle').textContent, /renewal/); assert.match(ui.$('priorityReason').textContent, /renew automatically/);
    assert.match(ui.$('mapCoverageNotice').textContent, /scored answer you provided/);
    assert.equal(ui.$('renewalTrackerLink').hidden, false); assert.equal(ui.$('renewalTrackerLink').getAttribute('href'), '/tools/software-renewal-tracker');
  } finally { ui.dom.window.close(); }
});

for (const scenario of ['all not applicable', 'all unknown', 'strong answers with two exclusions']) {
  test(`${scenario}: the rendered explanation and copied notice use the correct cause`, async () => {
    const ui = setup(); let copied = '';
    Object.defineProperty(ui.window.navigator, 'clipboard', { value: { writeText: async (text) => { copied = text; } } });
    try {
      ui.begin();
      for (const question of QUESTIONS) {
        const answer = scenario === 'all not applicable' ? 'not-applicable' : scenario === 'all unknown' ? 'outside-visibility' : ['unit-economics-value', 'consumption-demand'].includes(question.id) ? 'not-applicable' : 'score-3';
        ui.choose('answer', answer); ui.$('nextButton').click();
      }
      const notice = ui.$('mapCoverageNotice').textContent;
      assert.equal(ui.$('mapCoverageNotice').hidden, false); assert.doesNotMatch(notice, /answer you provided/);
      assert.doesNotMatch(ui.$('resultMeaning').textContent, /missing information/);
      assert.doesNotMatch(ui.$('mapDescription').textContent, /Missing information/);
      if (scenario === 'all unknown') assert.match(notice, /unknown or left unanswered/);
      else { assert.match(notice, /not applicable/); assert.doesNotMatch(notice, /missing|unknown/); }
      ui.$('copyButton').click(); await new Promise((r) => setImmediate(r));
      assert.ok(copied.includes(notice));
    } finally { ui.dom.window.close(); }
  });
}

test('print lifecycle opens all answers and method, then restores the on-screen disclosures', () => {
  const ui = setup(); try {
    ui.$('exampleButton').click(); const details = [...ui.window.document.querySelectorAll('#results details')];
    details[1].open = true;
    ui.window.dispatchEvent(new ui.window.Event('beforeprint')); assert.ok(details.every((node) => node.open));
    ui.window.dispatchEvent(new ui.window.Event('beforeprint'));
    ui.window.dispatchEvent(new ui.window.Event('afterprint')); assert.deepEqual(details.map((node) => node.open), [false, true]);
  } finally { ui.dom.window.close(); }
});
test('a failed clipboard write provides a visible way to keep the result', async () => {
  const ui = setup(); Object.defineProperty(ui.window.navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Unavailable'); } } });
  try { ui.$('exampleButton').click(); ui.$('copyButton').click(); await new Promise((r) => setImmediate(r)); assert.match(ui.$('copyStatus').textContent, /Print \/ Save PDF/); assert.equal(ui.$('results').hidden, false); assert.equal(ui.$('manualCopyPanel').hidden, false); assert.match(ui.$('manualCopyText').value, /CLOUD & CAPITAL · SIGNAL AUDIT/); assert.equal(ui.window.document.activeElement, ui.$('manualCopyText')); }
  finally { ui.dom.window.close(); }
});

test('editing a completed assessment does not inflate lifecycle counts, and Start fresh begins a new session', () => {
  const ui = setup(); try {
    ui.$('exampleButton').click(); ui.$('editAnswersButton').click(); ui.answerAll('score-3');
    assert.equal(ui.events.filter(([name]) => name === 'tool_start').length, 1);
    assert.equal(ui.events.filter(([name]) => name === 'tool_complete').length, 1);
    assert.equal(ui.$('exampleNotice').hidden, false);
    ui.$('retakeButton').click(); ui.begin(); ui.answerAll('score-2');
    assert.equal(ui.events.filter(([name]) => name === 'tool_start').length, 2);
    assert.equal(ui.events.filter(([name]) => name === 'tool_complete').length, 2);
    assert.equal(ui.$('exampleNotice').hidden, true);
  } finally { ui.dom.window.close(); }
});
