import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { assessReadiness } from '../src/lib/interactive-lab.js';
import { validBrief } from '../test-support/interactive-lab-fixture.js';

const source = await readFile(new URL('../src/pages/interactive-lab.astro', import.meta.url), 'utf8');
const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const html = source.slice(source.indexOf('<BaseLayout')).replace(/<script is:inline>[\s\S]*?<\/script>/, '');
const tick = () => new Promise((resolve) => setImmediate(resolve));
function setup(briefFetch) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://cloudandcapital.com/interactive-lab' });
  const { window } = dom;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    if (body.stage === 'brief') return briefFetch(body, options);
    const data = assessReadiness(body);
    return { ok: true, json: async () => ({ status: 'needs_context', ...data }) };
  };
  window.eval(script);
  const $ = (id) => window.document.getElementById(id);
  const input = (id, value) => { $(id).value = value; $(id).dispatchEvent(new window.Event('input', { bubbles: true })); };
  return { dom, window, $, input };
}
async function chooseExample(ui, type = 'renewal') {
  ui.window.document.querySelector(`[data-type="${type}"]`).click();
  await tick();
  assert.equal(ui.$('contextStage').hidden, false);
}

test('examples are complete and keep their made-up-data label after editing', async () => {
  const ui = setup();
  try {
    for (const type of ['renewal', 'commitment', 'build_buy', 'cost_review', 'architecture']) {
      await chooseExample(ui, type);
      assert.equal(ui.$('briefBtn').disabled, false, type);
      assert.equal(ui.$('exampleNotice').hidden, false);
      assert.equal(ui.$('contextFields').querySelectorAll('textarea').length, 4);
      ui.$('backBtn').click();
    }
    ui.input('decisionInput', 'Our software renews soon, and I need help comparing the choices.');
    ui.$('contextBtn').click();
    await tick();
    assert.equal(ui.$('exampleNotice').hidden, false);
    ui.$('backBtn').click();
    ui.$('resetBtn').click();
    assert.equal(ui.$('exampleNotice').hidden, true);
    assert.equal(ui.$('decisionCount').textContent, '0 / 2,000 characters');
  } finally { ui.dom.window.close(); }
});

test('Back preserves all answers for the same decision family', async () => {
  const ui = setup();
  try {
    await chooseExample(ui);
    ui.input('context-demand', 'My own note: the design team uses ten seats every week.');
    const answers = [...ui.$('contextFields').querySelectorAll('textarea')].map((item) => item.value);
    ui.$('backBtn').click();
    ui.$('contextBtn').click();
    await tick();
    assert.deepEqual([...ui.$('contextFields').querySelectorAll('textarea')].map((item) => item.value), answers);
    assert.equal(ui.$('briefBtn').disabled, false);
  } finally { ui.dom.window.close(); }
});

test('a different decision family does not reuse incompatible answers', async () => {
  const ui = setup();
  try {
    await chooseExample(ui);
    ui.$('backBtn').click();
    ui.input('decisionInput', 'Should we reserve GPU capacity for a year or buy it as needed?');
    ui.$('contextBtn').click();
    await tick();
    assert.equal(ui.$('typeChip').textContent, 'Capacity or commitment');
    assert.equal(ui.$('briefBtn').disabled, true);
    assert.ok([...ui.$('contextFields').querySelectorAll('textarea')].every((item) => !item.value));
  } finally { ui.dom.window.close(); }
});

test('generation failures preserve the fields and allow another try', async () => {
  const ui = setup(async () => ({ ok: false, json: async () => ({ error: 'That took too long. Your inputs are still here.' }) }));
  try {
    await chooseExample(ui);
    const answers = [...ui.$('contextFields').querySelectorAll('textarea')].map((item) => item.value);
    ui.$('briefBtn').click();
    assert.equal(ui.$('backBtn').disabled, true);
    await tick();
    assert.match(ui.$('errorMsg').textContent, /too long/);
    assert.equal(ui.$('briefBtn').disabled, false);
    assert.equal(ui.$('backBtn').disabled, false);
    assert.deepEqual([...ui.$('contextFields').querySelectorAll('textarea')].map((item) => item.value), answers);
  } finally { ui.dom.window.close(); }
});

test('Cancel preserves answers and ignores a late generation response', async () => {
  let finish;
  const ui = setup(async () => new Promise((resolve) => { finish = resolve; }));
  try {
    await chooseExample(ui);
    ui.$('briefBtn').click();
    const decision = ui.$('decisionInput').value;
    const demand = ui.$('context-demand').value;
    ui.$('cancelBtn').click();
    finish({ ok: true, json: async () => ({ status: 'ready', brief: {} }) });
    await tick();
    assert.equal(ui.$('briefState').hidden, true);
    assert.equal(ui.$('contextStage').hidden, false);
    assert.equal(ui.$('decisionInput').value, decision);
    assert.equal(ui.$('context-demand').value, demand);
    assert.equal(ui.$('errorMsg').hidden, true);
    assert.equal(ui.$('outputPane').getAttribute('aria-busy'), 'false');
  } finally { ui.dom.window.close(); }
});

test('successful output and Copy preserve the checked arithmetic and example label', async () => {
  const explanation = 'Calculated: applying a 20% increase to $2,880.00 gives $3,456.00. The increase is $576.00.';
  const ui = setup(async () => ({ ok: true, json: async () => ({ status: 'ready', brief: validBrief, calculations: [{ explanation }] }) }));
  let copied = '';
  Object.defineProperty(ui.window.navigator, 'clipboard', { value: { writeText: async (text) => { copied = text; } } });
  try {
    await chooseExample(ui);
    ui.$('briefBtn').click();
    await tick();
    assert.equal(ui.$('briefState').hidden, false);
    assert.equal(ui.$('briefExampleNotice').hidden, false);
    assert.equal(ui.$('calculationsSection').hidden, false);
    assert.equal(ui.$('checkedCalculations').textContent, explanation);
    assert.match(ui.$('recommendationMove').textContent, /Stage/);
    ui.$('copyBtn').click();
    await tick();
    assert.match(copied, /ILLUSTRATIVE EXAMPLE/);
    assert.ok(copied.indexOf('RECOMMENDATION') < copied.indexOf('KNOWN FACTS'));
    assert.equal(copied.split(explanation).length - 1, 1);
    assert.equal(copied.split('NEXT ACTIONS').length - 1, 1);
    assert.equal(ui.$('copyState').textContent, 'Decision brief copied.');
  } finally { ui.dom.window.close(); }
});

test('browser cutoff aborts generation, keeps answers, and unlocks the form', async () => {
  let expire;
  const ui = setup(async (_body, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new ui.window.DOMException('Aborted', 'AbortError')));
  }));
  const originalSetTimeout = ui.window.setTimeout;
  ui.window.setTimeout = (callback, delay, ...args) => {
    if (delay === 60000) { expire = callback; return 123456; }
    return originalSetTimeout(callback, delay, ...args);
  };
  try {
    await chooseExample(ui);
    const demand = ui.$('context-demand').value;
    ui.$('briefBtn').click();
    assert.equal(typeof expire, 'function');
    expire();
    await tick();
    assert.match(ui.$('errorMsg').textContent, /too long/);
    assert.equal(ui.$('briefBtn').disabled, false);
    assert.equal(ui.$('context-demand').value, demand);
    assert.equal(ui.$('outputPane').getAttribute('aria-busy'), 'false');
  } finally { ui.dom.window.close(); }
});
