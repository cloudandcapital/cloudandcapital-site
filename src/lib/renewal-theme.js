export const THEME_STORAGE_KEY = 'cc-renewal-color-mode-v1';

export function startRenewalTheme(root) {
  if (!root || root.dataset.themeScope !== 'renewal' || root.dataset.themeReady) return;
  const button = root.querySelector('[data-theme-toggle]');
  if (!button) return;
  root.dataset.themeReady = 'true';
  const view = root.ownerDocument.defaultView;
  const requested = new URL(view.location.href).searchParams.get('theme');
  let saved;
  try { saved = view.localStorage.getItem(THEME_STORAGE_KEY); } catch {}
  let mode = requested === 'dark' || requested === 'light' ? requested : saved === 'dark' ? 'dark' : 'light';
  const render = () => {
    root.dataset.colorMode = mode;
    const dark = mode === 'dark';
    const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    button.setAttribute('aria-label', label); button.title = label;
    button.querySelector('[data-theme-moon]').toggleAttribute('hidden', dark);
    button.querySelector('[data-theme-sun]').toggleAttribute('hidden', !dark);
    root.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#211F1D' : '#F5EEE9');
    button.hidden = false;
  };
  button.addEventListener('click', () => {
    mode = mode === 'dark' ? 'light' : 'dark'; render();
    try { view.localStorage.setItem(THEME_STORAGE_KEY, mode); } catch {}
    const url = new URL(view.location.href);
    if (url.searchParams.has('theme')) {
      url.searchParams.set('theme', mode);
      view.history.replaceState(view.history.state, '', url);
    }
  });
  render();
}
