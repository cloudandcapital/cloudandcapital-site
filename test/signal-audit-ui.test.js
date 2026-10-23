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
test('scope gating, question focus, Next gating, and Previous preserve the selected answer', () => {
  const ui = setup(); try {
    assert.equal(ui.$('beginButton').disabled, true); ui.begin();
    assert.equal(ui.$('nextButton').disabled, true); assert.equal(ui.window.document.activeElement, ui.$('questionPrompt'));
    ui.choose('answer', 'score-1'); ui.$('nextButton').click();
    assert.match(ui.$('progressText').textContent, /2 of 12/);
    ui.choose('answer', 'score-2'); ui.$('previousButton').click();
    assert.equal(ui.window.document.querySelector('input[name="answer"]:checked').value, 'score-1');
  } finally { ui.dom.window.close(); }
});
test('mixed scope is exclusive with individual categories', () => {
  const ui = setup(); try {
    ui.choose('technology-scope', 'saas'); ui.choose('technology-scope', 'mixed');
    assert.deepEqual([...ui.window.document.querySelectorAll('input[name="technology-scope"]:checked')].map((i) => i.value), ['mixed']);
    ui.choose('technology-scope', 'ai-data'); assert.equal(ui.window.document.querySelector('input[value="mixed"]').checked, false);
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
    ui.$('previousButton').click(); ui.choose('target-scope', 'organization'); ui.$('beginButton').click();
    assert.equal(ui.state.isExample, false); assert.deepEqual(ui.state.answers, {}); assert.equal(ui.$('scopeChangeNotice').hidden, false); assert.equal(ui.$('nextButton').disabled, true);
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
    assert.equal(ui.window.document.querySelectorAll('input[name="technology-scope"]:checked').length, 0); assert.equal(ui.$('beginButton').disabled, true);
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
