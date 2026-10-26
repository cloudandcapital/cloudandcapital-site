import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM, CookieJar } from 'jsdom';
import { startColorMode, initialColorMode, themeBootstrap, THEME_STORAGE_KEY } from '../src/lib/color-mode.js';
function setup(url='https://cloudandcapital.com/tools', jar=new CookieJar()) {
  const dom=new JSDOM('<html data-color-mode="light"><head><meta name="theme-color" content="#F5EEE9"></head><body><button data-theme-toggle hidden></button></body></html>',{url,cookieJar:jar,runScripts:'outside-only'});
  dom.window.matchMedia=()=>{throw new Error('Device theme must not select the default');};
  return {dom,root:dom.window.document.documentElement,button:dom.window.document.querySelector('button'),view:dom.window};
}
test('new visitors start light and a theme choice leaves subscription records intact',()=>{
  const s=setup(); s.view.localStorage.setItem('subscription-diary','keep'); startColorMode(s.root); assert.equal(s.root.dataset.colorMode,'light'); assert.equal(s.button.hidden,false);
  s.button.click(); assert.equal(s.root.dataset.colorMode,'dark'); assert.equal(s.button.getAttribute('aria-label'),'Switch to light mode'); assert.equal(s.view.localStorage.getItem(THEME_STORAGE_KEY),'dark'); assert.equal(s.view.localStorage.getItem('subscription-diary'),'keep'); assert.equal(s.view.document.querySelector('meta').content,'#211F1D');
  s.button.click(); assert.equal(s.root.dataset.colorMode,'light'); s.dom.window.close();
});
test('an explicit choice follows visitors between the website and tool subdomains',()=>{
  const jar=new CookieJar(); const site=setup('https://cloudandcapital.com/',jar); startColorMode(site.root); site.button.click();
  const lens=setup('https://lens.cloudandcapital.com/',jar); assert.equal(initialColorMode(lens.view),'dark'); startColorMode(lens.root); lens.button.click();
  assert.equal(initialColorMode(site.view),'light');
  const guard=setup('https://guard.cloudandcapital.com/',jar); assert.equal(initialColorMode(guard.view),'light');
  site.dom.window.close(); lens.dom.window.close(); guard.dom.window.close();
});
test('preview mode wins without initially persisting it and preserves other URL parts',()=>{
  const s=setup('https://preview.vercel.app/?theme=dark&source=review#dates'); startColorMode(s.root); assert.equal(s.root.dataset.colorMode,'dark'); assert.equal(s.view.localStorage.getItem(THEME_STORAGE_KEY),null); assert.equal(s.view.document.cookie,'');
  s.button.click(); assert.equal(s.view.location.search,'?theme=light&source=review'); assert.equal(s.view.location.hash,'#dates'); s.dom.window.close();
});
test('blocked storage and cookies do not prevent toggling',()=>{
  const s=setup(); Object.defineProperty(s.view,'localStorage',{get(){throw new Error('Blocked');}}); Object.defineProperty(s.view.document,'cookie',{get(){throw new Error('Blocked');},set(){throw new Error('Blocked');}});
  startColorMode(s.root); assert.equal(s.root.dataset.colorMode,'light'); s.button.click(); assert.equal(s.root.dataset.colorMode,'dark'); s.dom.window.close();
});
test('early head bootstrap agrees with hydration for stored, query and invalid values',()=>{
  for(const [query,saved,expected] of [['','dark','dark'],['?theme=light','dark','light'],['?theme=unknown','invalid','light']]) {
    const s=setup('https://preview.vercel.app/'+query); s.view.localStorage.setItem(THEME_STORAGE_KEY,saved); s.view.eval(themeBootstrap); assert.equal(s.root.dataset.colorMode,expected); startColorMode(s.root); assert.equal(s.root.dataset.colorMode,expected); s.dom.window.close();
  }
});
test('tracker-only preference migrates without copying or changing its saved data',()=>{
  const s=setup(); s.view.localStorage.setItem('cc-renewal-color-mode-v1','dark'); s.view.localStorage.setItem('subscription-diary','original'); assert.equal(initialColorMode(s.view),'dark'); startColorMode(s.root); assert.equal(s.view.localStorage.getItem(THEME_STORAGE_KEY),null); assert.equal(s.view.localStorage.getItem('subscription-diary'),'original'); s.dom.window.close();
});
test('repeated initialization and cleanup do not duplicate a toggle listener',()=>{
  const s=setup(); const cleanup=startColorMode(s.root); startColorMode(s.root); s.button.click(); assert.equal(s.root.dataset.colorMode,'dark'); cleanup(); startColorMode(s.root); s.button.click(); assert.equal(s.root.dataset.colorMode,'light'); s.dom.window.close();
});
