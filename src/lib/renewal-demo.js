import { examplesFor } from './renewal-tracker.js';

export function startRenewalDemo(root, now = new Date()) {
  if (!root || root.dataset.demoReady) return;
  root.dataset.demoReady = 'true';
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const record = examplesFor(date)[0];
  const formatDate = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(value + 'T00:00:00Z'));
  const setText = (selector, text) => { root.querySelector(selector).textContent = text; };
  setText('[data-demo-vendor]', record.vendor);
  setText('[data-demo-price]', new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(record.charge)));
  for (const [selector, value] of [['[data-demo-notice]', record.noticeDate], ['[data-demo-renewal]', record.renewalDate]]) {
    const time = root.querySelector(selector); time.textContent = formatDate(value); time.dateTime = value;
  }
  const notice = new Date(record.noticeDate + 'T00:00:00Z');
  setText('[data-demo-month]', new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(notice));
  setText('[data-demo-day]', String(notice.getUTCDate()));

  const toggle = root.querySelector('[data-demo-toggle]');
  const preference = root.ownerDocument.defaultView.matchMedia?.('(prefers-reduced-motion: reduce)');
  let paused = false;
  const renderMotion = () => {
    const reduced = Boolean(preference?.matches);
    root.dataset.demoPlaying = String(!paused && !reduced);
    toggle.hidden = reduced;
    const label = paused ? 'Play animation' : 'Pause animation';
    toggle.setAttribute('aria-label', label); toggle.title = label;
    root.querySelector('[data-demo-pause]').toggleAttribute('hidden', paused);
    root.querySelector('[data-demo-play]').toggleAttribute('hidden', !paused);
  };
  toggle.addEventListener('click', () => { paused = !paused; renderMotion(); });
  preference?.addEventListener('change', renderMotion);
  renderMotion();
}
