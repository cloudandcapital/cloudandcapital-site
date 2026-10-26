import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { startRenewalTheme, THEME_STORAGE_KEY } from '../src/lib/renewal-theme.js';
function setup(query = '') {
  const dom = new JSDOM('<html data-theme-scope="renewal"><head><meta name="theme-color" content="#F5EEE9"></head><body><button data-theme-toggle hidden><svg data-theme-moon></svg><svg data-theme-sun hidden></svg></button></body></html>', { url:'https://example.invalid/tracker' + query });
  return { dom, root:dom.window.document.documentElement, button:dom.window.document.querySelector('button'), storage:dom.window.localStorage };
}
test('theme toggles and remembers its preference without changing tracker records', () => {
  const {dom,root,button,storage} = setup();
  storage.setItem('subscriptions', '[{"vendor":"Keep me"}]');
  startRenewalTheme(root); startRenewalTheme(root);
  assert.equal(root.dataset.colorMode,'light'); assert.equal(button.hidden,false);
  button.click();
  assert.equal(root.dataset.colorMode,'dark'); assert.equal(storage.getItem(THEME_STORAGE_KEY),'dark');
  assert.equal(button.getAttribute('aria-label'),'Switch to light mode');
  assert.equal(root.querySelector('[data-theme-sun]').hasAttribute('hidden'),false);
  assert.equal(root.querySelector('[data-theme-moon]').hasAttribute('hidden'),true);
  assert.equal(root.querySelector('meta').content,'#211F1D');
  assert.equal(storage.getItem('subscriptions'),'[{"vendor":"Keep me"}]');
  const next=setup(); next.storage.setItem(THEME_STORAGE_KEY,storage.getItem(THEME_STORAGE_KEY)); startRenewalTheme(next.root);
  assert.equal(next.root.dataset.colorMode,'dark'); next.dom.window.close(); dom.window.close();
});
test('explicit preview mode wins saved preference and toggle preserves other URL parts', () => {
  const {dom,root,button,storage}=setup('?theme=dark&source=link#dates');
  storage.setItem(THEME_STORAGE_KEY,'light'); startRenewalTheme(root);
  assert.equal(root.dataset.colorMode,'dark'); assert.equal(storage.getItem(THEME_STORAGE_KEY),'light');
  button.click(); assert.equal(dom.window.location.search,'?theme=light&source=link'); assert.equal(dom.window.location.hash,'#dates'); dom.window.close();
});
test('blocked storage still allows theme switching', () => {
  const {dom,root,button}=setup();
  Object.defineProperty(dom.window,'localStorage',{get(){throw new Error('Blocked');}});
  startRenewalTheme(root); button.click(); assert.equal(root.dataset.colorMode,'dark'); dom.window.close();
});
test('invalid preferences fall back to light and other pages do not opt in', () => {
  const {dom,root,storage}=setup('?theme=unknown'); storage.setItem(THEME_STORAGE_KEY,'unknown'); startRenewalTheme(root); assert.equal(root.dataset.colorMode,'light'); dom.window.close();
  const other=setup(); delete other.root.dataset.themeScope; startRenewalTheme(other.root); startRenewalTheme(null); assert.equal(other.root.dataset.colorMode,undefined); assert.equal(other.button.hidden,true); other.dom.window.close();
});
