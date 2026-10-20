import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

test('mobile menu closes on Escape, navigation, and a return to desktop without trapping scroll', async () => {
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  const script = layout.match(/<script>([\s\S]*?)<\/script>/)[1];
  const dom = new JSDOM('<button id="tool-nav-toggle" aria-expanded="false">Menu</button><ul id="tool-nav-links"><li><a href="#contact">Contact</a></li></ul><section id="contact"></section>', { runScripts: 'outside-only' });
  const { window } = dom;
  let desktopChange;
  window.matchMedia = () => ({ addEventListener: (_, listener) => { desktopChange = listener; } });
  window.eval(script);
  const button = window.document.getElementById('tool-nav-toggle');
  const links = window.document.getElementById('tool-nav-links');
  const assertClosed = () => {
    assert.equal(button.getAttribute('aria-expanded'), 'false');
    assert.equal(button.getAttribute('aria-label'), 'Open menu');
    assert.equal(links.classList.contains('is-open'), false);
    assert.equal(window.document.body.style.overflow, '');
  };
  button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  assert.equal(window.document.body.style.overflow, 'hidden');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  assertClosed();
  assert.equal(window.document.activeElement, button);
  button.click();
  links.querySelector('a').click();
  assertClosed();
  button.click();
  desktopChange({ matches: true });
  assertClosed();
  dom.window.close();
});
