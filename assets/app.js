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

function fmtDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso || ''; }
}

function statusClass(status = '') {
  return String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
    const title = document.createElement('a');
    title.className = 'item-title';
    title.href = item.link || '#';
    title.textContent = item.name || 'Untitled';
    title.target = item.link?.startsWith('http') ? '_blank' : '_self';

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
  renderCards('garden-list', data.garden || []);
  renderCards('cats-list', data.cats || []);
}

function renderNews(items) {
  const wrap = document.getElementById('news-list');
  wrap.innerHTML = '';

  if (!items.length) {
    wrap.appendChild(el('div', 'item', 'No news items available right now.'));
    return;
  }

  items.forEach((n, idx) => {
    const row = el('div', 'news-item' + (idx < 3 ? ' open' : ''));
    const head = el('div', 'news-head');

    const left = el('div');
    left.appendChild(el('div', 'news-title', n.title || 'Untitled'));
    left.appendChild(el('div', 'news-meta', `${n.source || 'Unknown'} · ${fmtDate(n.published)}`));

    const right = el('div', 'news-meta', `Score ${n.score ?? '-'}`);
    head.appendChild(left);
    head.appendChild(right);

    const body = el('div', 'news-body');
    if (n.summary) body.appendChild(el('p', 'muted', n.summary));

    const link = document.createElement('a');
    link.href = n.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Read original article ↗';
    body.appendChild(link);

    head.addEventListener('click', () => row.classList.toggle('open'));

    row.appendChild(head);
    row.appendChild(body);
    wrap.appendChild(row);
  });
}

function uniqueSources(items) {
  return [...new Set(items.map(i => i.source).filter(Boolean))].sort();
}

function populateSourceFilter(items) {
  const select = document.getElementById('news-source');
  if (!select) return;
  select.innerHTML = '';

  const all = document.createElement('option');
  all.value = '';
  all.textContent = 'All sources';
  select.appendChild(all);

  uniqueSources(items).forEach(source => {
    const opt = document.createElement('option');
    opt.value = source;
    opt.textContent = source;
    select.appendChild(opt);
  });
}

async function init() {
  try {
    const [site, news] = await Promise.all([
      loadJson('./content/site.json'),
      loadJson('./ai-news/public/ai-news-latest.json')
    ]);

    renderSiteContent(site);

    const baseItems = news.items || [];
    document.getElementById('news-updated').textContent = `Updated: ${fmtDate(news.updatedAt)}`;

    const latestBtn = document.getElementById('btn-latest');
    const topBtn = document.getElementById('btn-top');
    const sourceSelect = document.getElementById('news-source');
    const queryInput = document.getElementById('news-query');

    let mode = 'latest';
    populateSourceFilter(baseItems);

    function applyFilters() {
      const source = sourceSelect?.value || '';
      const q = (queryInput?.value || '').trim().toLowerCase();

      let items = [...baseItems];
      if (source) items = items.filter(i => i.source === source);
      if (q) {
        items = items.filter(i => {
          const t = (i.title || '').toLowerCase();
          const s = (i.summary || '').toLowerCase();
          return t.includes(q) || s.includes(q);
        });
      }

      if (mode === 'top') {
        items.sort((a, b) => (b.score || 0) - (a.score || 0));
      } else {
        items.sort((a, b) => (new Date(b.published) - new Date(a.published)));
      }

      renderNews(items.slice(0, 50));
    }

    latestBtn.onclick = () => { mode = 'latest'; applyFilters(); };
    topBtn.onclick = () => { mode = 'top'; applyFilters(); };
    sourceSelect.onchange = applyFilters;
    queryInput.oninput = applyFilters;

    applyFilters();
  } catch (e) {
    const wrap = document.getElementById('news-list');
    wrap.innerHTML = `<div class="item">Could not load feed data: ${e.message}</div>`;
  }
}

init();
