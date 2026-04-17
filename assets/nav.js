/* === nav.js — single-source site header + nav links === */
(function () {
  function siteRoot() {
    const host = location.hostname;
    if (host === 'jz237.github.io') return '/jez237-site';
    return '';
  }

  const ROOT = siteRoot();
  const LINKS = [
    { href: ROOT + '/index.html',          label: 'Home' },
    { href: ROOT + '/plants/',             label: 'Garden' },
    { href: ROOT + '/garden/',             label: 'Calendar' },
    { href: ROOT + '/photos/',             label: 'Photos' },
    { href: ROOT + '/games/',              label: 'Games' },
    { href: ROOT + '/ai-news/',            label: 'AI News' },
    { href: ROOT + '/plex/',               label: 'Plex' },
    { href: ROOT + '/ops/',                label: 'Ops' }
  ];

  // Inline brand SVG — small botanical monogram
  const BRAND_SVG = '' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="nv-bg" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#34291f"/><stop offset="100%" stop-color="#1d1811"/>' +
        '</linearGradient>' +
        '<linearGradient id="nv-leaf" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#e8c57a"/><stop offset="50%" stop-color="#7ab362"/><stop offset="100%" stop-color="#4a6274"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<circle cx="20" cy="20" r="19" fill="url(#nv-bg)" stroke="rgba(232,197,122,0.35)" stroke-width="0.8"/>' +
      '<path d="M20 7 C 29 12 29 26 20 33 C 11 26 11 12 20 7 Z" fill="url(#nv-leaf)" opacity="0.92"/>' +
      '<path d="M20 9 L20 32" stroke="rgba(0,0,0,0.4)" stroke-width="0.9" stroke-linecap="round"/>' +
      '<path d="M20 14 Q16 15 13 17 M20 14 Q24 15 27 17 M20 20 Q15 21 11 24 M20 20 Q25 21 29 24 M20 26 Q17 27 15 29 M20 26 Q23 27 25 29" stroke="rgba(0,0,0,0.28)" stroke-width="0.6" fill="none" stroke-linecap="round"/>' +
    '</svg>';

  function currentSection() {
    // Normalize path to the first meaningful segment
    const path = location.pathname.replace(/^\/jez237-site/, '') || '/';
    if (path === '/' || /^\/(index\.html)?$/.test(path)) return ROOT + '/index.html';
    const firstSeg = path.split('/').filter(Boolean)[0] || '';
    return ROOT + '/' + firstSeg + '/';
  }

  function render() {
    const mount = document.getElementById('site-nav');
    if (!mount) return;
    mount.innerHTML = '';

    const nav = document.createElement('nav');

    const brand = document.createElement('a');
    brand.className = 'brand-mark';
    brand.href = ROOT + '/index.html';
    brand.innerHTML = BRAND_SVG + '<span class="brand-text">jez237</span>';

    const linkBox = document.createElement('div');
    linkBox.className = 'links';

    const current = currentSection();
    LINKS.forEach(l => {
      const a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      if (l.href === current) a.setAttribute('aria-current', 'page');
      linkBox.appendChild(a);
    });

    // Theme toggle
    const saved = (function(){ try { return localStorage.getItem('theme') || ''; } catch(_) { return ''; } })();
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Toggle color theme');
    function updateToggleLabel() {
      toggle.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '☀';
    }
    updateToggleLabel();
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? '' : 'light';
      if (next) document.documentElement.setAttribute('data-theme', next);
      else document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('theme', next); } catch(_) {}
      updateToggleLabel();
    });

    nav.appendChild(brand);
    nav.appendChild(linkBox);
    nav.appendChild(toggle);
    mount.appendChild(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
