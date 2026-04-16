async function loadJson(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed: ${path}`);
  return r.json();
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function statusClass(status = '') {
  return String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Make links work across local dev server, github pages subpath, and absolute URLs
function normalizeLink(link) {
  if (!link) return link;
  const host = location.hostname;
  const isLocal  = ['localhost','127.0.0.1','::1'].includes(host) || location.protocol === 'file:';
  const isGhPage = host === 'jz237.github.io';
  if (isLocal) {
    // Strip the production URL prefix so clicks stay on the local server
    return link.replace(/^https?:\/\/jz237\.github\.io\/jez237-site\//, '/');
  }
  if (isGhPage && link.startsWith('/') && !link.startsWith('/jez237-site')) {
    // Root-absolute paths need the repo subpath on github pages
    return '/jez237-site' + link;
  }
  return link;
}

function renderCards(containerId, items = []) {
  const root = document.getElementById(containerId);
  if (!root) return;
  root.innerHTML = '';

  if (!items.length) {
    root.appendChild(el('div', 'item', 'No entries yet.'));
    return;
  }

  items.forEach(item => {
    if (typeof item === 'string') {
      root.appendChild(el('div', 'item', item));
      return;
    }

    const card = el('div', 'item item-card');
    const top = el('div', 'item-top');

    const normalized = normalizeLink(item.link);
    const title = document.createElement('a');
    title.className = 'item-title';
    title.href = normalized || '#';
    title.textContent = item.name || 'Untitled';
    // Only open in new tab for external (non-local) URLs
    title.target = (normalized && normalized.startsWith('http')) ? '_blank' : '_self';

    const badge = el('span', `badge ${statusClass(item.status)}`, item.status || 'planned');

    top.appendChild(title);
    top.appendChild(badge);

    card.appendChild(top);
    if (item.desc) card.appendChild(el('div', 'muted', item.desc));

    root.appendChild(card);
  });
}

function renderSiteContent(data) {
  document.getElementById('hero-title').textContent = `${data.name} — personal site`;
  document.getElementById('hero-tagline').textContent = data.tagline;
  document.getElementById('hero-about').textContent = data.about;

  renderCards('projects-list', data.projects || []);
  renderCards('tools-list', data.tools || []);
  renderCards('games-list', data.games || []);
  renderCards('photos-list', data.photos || []);
  renderCards('homelab-list', data.homelab || []);
}

async function init() {
  try {
    const site = await loadJson('./content/site.json');
    renderSiteContent(site);
  } catch (e) {
    console.error(e);
  }
}

init();
