// Light/dark theme for the Demos collection. Shares the 'theme' preference
// that the rest of the site stores (see assets/nav.js).
(() => {
  const root = document.documentElement;
  const read = () => { try { return localStorage.getItem('theme') || ''; } catch (_) { return ''; } };
  const isLight = () => root.getAttribute('data-theme') === 'light';
  const paint = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isLight() ? '#f6efdf' : '#0b0f14');
  };
  if (read() === 'light') root.setAttribute('data-theme', 'light');
  paint();

  document.addEventListener('DOMContentLoaded', () => {
    const rail = document.querySelector('.rail');
    if (!rail) return;
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    const label = () => {
      toggle.textContent = isLight() ? '🌙 Dark' : '☀ Light';
      toggle.setAttribute('aria-label', isLight() ? 'Switch to dark theme' : 'Switch to light theme');
    };
    label();
    toggle.addEventListener('click', () => {
      const next = isLight() ? '' : 'light';
      if (next) root.setAttribute('data-theme', next);
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', next); } catch (_) {}
      label();
      paint();
    });
    rail.appendChild(toggle);
  });
})();
