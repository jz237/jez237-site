/* === nav.js — one place for site header + nav links === */
(function () {
  // Site root detection: if we're on localhost or file:// => root is '/'
  // On github pages at jz237.github.io/jez237-site/ => root is '/jez237-site/'
  function siteRoot() {
    const host = location.hostname;
    if (host === 'jz237.github.io') return '/jez237-site';
    return '';
  }

  const ROOT = siteRoot();
  const LINKS = [
    { href: ROOT + '/index.html',          label: 'Home' },
    { href: ROOT + '/index.html#projects', label: 'Projects' },
    { href: ROOT + '/index.html#tools',    label: 'Tools' },
    { href: ROOT + '/games/',              label: 'Games' },
    { href: ROOT + '/photos/',             label: 'Photos' },
    { href: ROOT + '/plants/',             label: 'Plant Progress' },
    { href: ROOT + '/ai-news/',            label: 'AI News' },
    { href: ROOT + '/plex/',               label: 'Plex' },
    { href: ROOT + '/ops/',                label: 'Ops Center' },
    { href: ROOT + '/garden/',             label: 'Garden Calendar' }
  ];

  function render() {
    const mount = document.getElementById('site-nav');
    if (!mount) return;
    const nav = document.createElement('nav');
    const brand = document.createElement('div');
    brand.className = 'brand';
    brand.textContent = 'jez237-site';
    const links = document.createElement('div');
    links.className = 'links';
    LINKS.forEach(l => {
      const a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      links.appendChild(a);
    });
    nav.appendChild(brand);
    nav.appendChild(links);
    mount.appendChild(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
