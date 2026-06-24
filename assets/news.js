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

function uniqueSources(items) {
  return [...new Set(items.map(i => i.source).filter(Boolean))].sort();
}

function visibleItemsForCategory(items, category, mode = 'curated') {
  const categoryItems = items.filter(i => (i.category || 'AI') === category);
  if (mode === 'all') return categoryItems;
  const curatedItems = categoryItems.filter(i => i.editorial_allow === true);
  return curatedItems.length ? curatedItems : categoryItems;
}

const SIGNAL_ORDER = [
  'Model releases',
  'Agents & tooling',
  'Media generation',
  'Infrastructure',
  'Policy & risk',
  'Research',
  'Business',
  'Product updates'
];

function isLikelyBadImage(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  return (
    u.includes('sprite') ||
    u.includes('logo') ||
    u.includes('icon') ||
    u.includes('placeholder') ||
    u.includes('pixel')
  );
}

function placeholderImage(source) {
  const label = (source || 'AI News').replace(/&/g, 'and').slice(0, 24);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='338'>
    <rect width='100%' height='100%' fill='#0c1118'/>
    <text x='50%' y='50%' fill='#8fa0b8' font-size='28' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif'>${label}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function renderNews(items, featuredUrlSet = new Set(), container = null) {
  const wrap = container || document.getElementById('news-grid');
  if (!container) wrap.innerHTML = '';

  if (!items.length) {
    wrap.appendChild(el('div', 'item', 'No news items available right now.'));
    return;
  }

  items.forEach((n) => {
    const isFeatured = featuredUrlSet.has(n.url);
    const card = el('article', `news-card ${isFeatured ? 'featured' : 'compact'}`);

    const img = document.createElement('img');
    img.className = 'news-card-img';
    img.alt = '';
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';

    if (n.image && !isLikelyBadImage(n.image)) {
      img.src = n.image;
      img.onerror = () => {
        img.src = placeholderImage(n.source);
      };
      img.onload = () => {
        if (img.naturalWidth < 240 || img.naturalHeight < 120) {
          img.src = placeholderImage(n.source);
        }
      };
    } else {
      img.src = placeholderImage(n.source);
    }

    card.appendChild(img);

    const body = el('div', 'news-card-body');
    const badges = el('div', 'news-card-badges');
    if (n.signalGroup) badges.appendChild(el('span', 'badge signal-badge', n.signalGroup));
    if (n.sourceTier) badges.appendChild(el('span', `badge source-badge ${(n.sourceRole || '').toLowerCase()}`, n.sourceTier));

    const title = document.createElement('a');
    title.className = 'news-card-title';
    title.href = n.url;
    title.target = '_blank';
    title.rel = 'noopener';
    title.textContent = n.title || 'Untitled';

    const meta = el('div', 'news-meta', `${n.source || 'Unknown'} · ${fmtDate(n.published)} · score ${n.score ?? '-'}`);

    if (badges.children.length) body.appendChild(badges);
    body.appendChild(title);
    body.appendChild(meta);

    if (n.summary) body.appendChild(el('p', 'muted', n.summary));
    if (n.whyItMatters) body.appendChild(el('p', 'news-why', n.whyItMatters));
    card.appendChild(body);
    wrap.appendChild(card);
  });
}

function renderSection(wrap, title, items, featuredSet = new Set()) {
  if (!items.length) return;
  const section = document.createElement('section');
  section.className = 'news-signal-section';
  section.appendChild(el('h2', 'news-section-heading', title));
  const grid = document.createElement('div');
  grid.className = 'news-inner-grid';
  section.appendChild(grid);
  wrap.appendChild(section);
  renderNews(items, featuredSet, grid);
}

function groupBySignal(items) {
  const grouped = new Map();
  items.forEach(item => {
    const key = item.signalGroup || 'Product updates';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  });
  return grouped;
}

async function init() {
  try {
    const news = await loadJson('public/ai-news-latest.json');
    const baseItems = news.items || [];

    document.getElementById('news-updated').textContent = `Updated: ${fmtDate(news.updatedAt)}`;

    const sortSelect = document.getElementById('news-sort');
    const categorySelect = document.getElementById('news-category');
    const viewSelect = document.getElementById('news-view');
    const sourceSelect = document.getElementById('news-source');
    const queryInput = document.getElementById('news-query');

    function populateSources(category, mode) {
      const categoryItems = visibleItemsForCategory(baseItems, category, mode);
      const sources = uniqueSources(categoryItems);
      sourceSelect.innerHTML = '<option value="">All sources</option>';
      sources.forEach(source => {
        const opt = document.createElement('option');
        opt.value = source;
        opt.textContent = source;
        sourceSelect.appendChild(opt);
      });
    }

    function applyFilters() {
      const category = categorySelect?.value || 'AI';
      const mode = viewSelect?.value || 'curated';
      const source = sourceSelect?.value || '';
      const q = (queryInput?.value || '').trim().toLowerCase();

      let items = visibleItemsForCategory(baseItems, category, mode);
      if (source) items = items.filter(i => i.source === source);
      if (q) {
        items = items.filter(i => {
          const t = (i.title || '').toLowerCase();
          const s = (i.summary || '').toLowerCase();
          const w = (i.whyItMatters || '').toLowerCase();
          const g = (i.signalGroup || '').toLowerCase();
          return t.includes(q) || s.includes(q) || w.includes(q) || g.includes(q);
        });
      }

      const sortMode = sortSelect?.value || 'latest';
      if (sortMode === 'top') items.sort((a, b) => (b.score || 0) - (a.score || 0));
      else items.sort((a, b) => (new Date(b.published) - new Date(a.published)));


      const limit = category === 'Science' ? 30 : (mode === 'all' ? 60 : 36);
      items = items.slice(0, limit);

      const itemLabel = items.length === 1 ? 'story' : 'stories';
      const modeLabel = mode === 'all' ? 'raw' : 'curated';
      document.getElementById('news-updated').textContent = `Updated: ${fmtDate(news.updatedAt)} · ${items.length} ${modeLabel} ${itemLabel}`;

      const wrap = document.getElementById('news-grid');
      wrap.innerHTML = '';

      if (!items.length) {
        wrap.appendChild(el('div', 'item', 'No news items available right now.'));
        return;
      }

      const topCount = category === 'AI' ? Math.min(4, items.length) : Math.min(3, items.length);
      const topStories = [...items]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, topCount);
      const topSet = new Set(topStories.map(i => i.url));

      renderSection(wrap, category === 'Science' ? 'Discovery Watch' : 'Top Briefing', topStories, topSet);

      const remaining = items.filter(i => !topSet.has(i.url));
      const grouped = groupBySignal(remaining);
      const orderedGroups = [
        ...SIGNAL_ORDER.filter(group => grouped.has(group)),
        ...[...grouped.keys()].filter(group => !SIGNAL_ORDER.includes(group)).sort()
      ];
      orderedGroups.forEach(group => renderSection(wrap, group, grouped.get(group)));
    }

    categorySelect.onchange = () => {
      populateSources(categorySelect.value, viewSelect?.value || 'curated');
      sourceSelect.value = '';
      applyFilters();
    };
    viewSelect.onchange = () => {
      populateSources(categorySelect.value, viewSelect.value);
      sourceSelect.value = '';
      applyFilters();
    };
    sortSelect.onchange = applyFilters;
    sourceSelect.onchange = applyFilters;
    queryInput.oninput = applyFilters;

    // Init with default category
    populateSources(categorySelect.value, viewSelect?.value || 'curated');

    applyFilters();
  } catch (e) {
    const wrap = document.getElementById('news-grid');
    wrap.innerHTML = `<div class="item">Could not load feed data: ${e.message}</div>`;
  }
}

init();
