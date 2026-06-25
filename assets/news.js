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

const FILL_EXCLUDED_REASONS = new Set([
  'fluff',
  'framework_or_plumbing',
  'not_ai_story',
  'watchlist_low_signal',
  'repo_title_low_context'
]);

function visibleItemsForCategory(items, category, mode = 'curated') {
  const categoryItems = items.filter(i => (i.category || 'AI') === category);
  if (mode === 'all') return categoryItems;
  const curatedItems = categoryItems.filter(i => i.editorial_allow === true);
  if (category !== 'AI') return curatedItems.length ? curatedItems : categoryItems;

  const curatedUrls = new Set(curatedItems.map(i => i.url));
  const fillItems = categoryItems
    .filter(i => !curatedUrls.has(i.url))
    .filter(i => !FILL_EXCLUDED_REASONS.has(i.editorial_reason || ''))
    .filter(i => (i.score || 0) >= 2.8 || i.tryWorthy === true)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const targetCount = Math.min(18, categoryItems.length);
  return [...curatedItems, ...fillItems].slice(0, Math.max(curatedItems.length, targetCount));
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
    if ((n.clusterSize || 0) > 1) badges.appendChild(el('span', 'badge cluster-badge', `${n.clusterSize} sources`));

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
    if (n.brief?.practicalImpact && isFeatured) body.appendChild(el('p', 'news-impact', n.brief.practicalImpact));
    card.appendChild(body);
    wrap.appendChild(card);
  });
}

function renderLeadStory(wrap, story) {
  if (!story) return;
  const lead = el('article', 'news-lead-story');
  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.src = story.image && !isLikelyBadImage(story.image) ? story.image : placeholderImage(story.source);
  lead.appendChild(img);

  const body = el('div', 'news-lead-body');
  body.appendChild(el('div', 'eyebrow', story.signalGroup || 'Top story'));
  const title = document.createElement('a');
  title.href = story.url;
  title.target = '_blank';
  title.rel = 'noopener';
  title.className = 'news-lead-title';
  title.textContent = story.title || 'Untitled';
  body.appendChild(title);
  body.appendChild(el('div', 'news-meta', `${story.source || 'Unknown'} · ${fmtDate(story.published)} · score ${story.score ?? '-'}`));
  if (story.brief?.whatHappened) body.appendChild(el('p', 'news-lead-what', story.brief.whatHappened));
  if (story.brief?.whoItAffects) body.appendChild(el('p', 'news-why', story.brief.whoItAffects));
  if (story.brief?.practicalImpact) body.appendChild(el('p', 'news-impact', story.brief.practicalImpact));
  lead.appendChild(body);
  wrap.appendChild(lead);
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

function renderSummary(items, mode) {
  const summary = document.getElementById('news-summary');
  if (!summary) return;

  const localImages = items.filter(i => (i.image || '').startsWith('public/thumbnails/')).length;
  const primarySources = items.filter(i => i.sourceRole === 'primary').length;
  const groups = groupBySignal(items);
  const topGroups = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .map(([group, groupItems]) => `${group}: ${groupItems.length}`);

  summary.innerHTML = '';
  [
    `${items.length} ${mode === 'all' ? 'raw' : 'curated'} stories`,
    `${localImages} with local images`,
    `${primarySources} primary-source`,
    ...topGroups
  ].forEach(label => summary.appendChild(el('span', 'news-summary-pill', label)));
}

function renderTools(news) {
  const wrap = document.getElementById('news-tools');
  if (!wrap) return;
  const pool = news.items || [];
  const fallback = pool
    .filter(i => (i.category || 'AI') === 'AI')
    .filter(i => i.toolCandidate === true || i.sourceType === 'tool-directory' || i.sourceType === 'tool-release')
    .sort((a, b) => {
      const sourceScore = type => type === 'tool-directory' ? 2 : type === 'tool-release' ? 1 : 0;
      return (sourceScore(b.sourceType) - sourceScore(a.sourceType)) || ((b.score || 0) - (a.score || 0));
    });
  const seen = new Set();
  const tools = [...(news.tools || []), ...fallback]
    .filter(i => i && i.url && !seen.has(i.url) && seen.add(i.url))
    .slice(0, 6);
  wrap.innerHTML = '';
  if (!tools.length) return;
  wrap.appendChild(el('h2', 'news-tools-title', 'Tools Worth Trying'));
  const row = el('div', 'news-tools-row');
  tools.forEach(item => {
    const a = document.createElement('a');
    a.className = 'news-tool-pill';
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener';
    const name = el('span', 'news-tool-name', item.toolLabel || item.title || 'Untitled');
    const meta = el('span', 'news-tool-meta', item.toolSummary || item.source || 'AI tool');
    a.appendChild(name);
    a.appendChild(meta);
    row.appendChild(a);
  });
  wrap.appendChild(row);
}

function renderHealth(news) {
  const body = document.getElementById('news-health-body');
  if (!body) return;
  const health = news.sourceHealth || [];
  const ok = health.filter(s => s.status === 'ok').length;
  const errors = health.filter(s => s.status !== 'ok');
  const itemTotal = health.reduce((sum, s) => sum + (s.items || 0), 0);
  body.innerHTML = '';
  body.appendChild(el('p', 'news-health-line', `${ok}/${health.length} sources healthy · ${itemTotal} feed items checked · ${errors.length} errors`));
  if (errors.length) {
    const list = el('ul', 'news-health-errors');
    errors.forEach(error => list.appendChild(el('li', '', `${error.source}: ${error.error || error.status}`)));
    body.appendChild(list);
  }
}

async function init() {
  try {
    let news = await loadJson('public/ai-news-latest.json');
    let baseItems = news.items || [];
    let archiveIndex = { archives: [] };
    try {
      archiveIndex = await loadJson('public/archive-index.json');
    } catch {}

    document.getElementById('news-updated').textContent = `Updated: ${fmtDate(news.updatedAt)}`;

    const sortSelect = document.getElementById('news-sort');
    const categorySelect = document.getElementById('news-category');
    const viewSelect = document.getElementById('news-view');
    const sourceSelect = document.getElementById('news-source');
    const tierSelect = document.getElementById('news-tier');
    const archiveSelect = document.getElementById('news-archive');
    const queryInput = document.getElementById('news-query');

    (archiveIndex.archives || []).forEach(entry => {
      const opt = document.createElement('option');
      opt.value = entry.path;
      opt.textContent = `${entry.date} (${entry.count})`;
      archiveSelect.appendChild(opt);
    });

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
      const tier = tierSelect?.value || '';
      const q = (queryInput?.value || '').trim().toLowerCase();

      let items = visibleItemsForCategory(baseItems, category, mode);
      if (source) items = items.filter(i => i.source === source);
      if (tier) items = items.filter(i => (i.sourceRole || 'secondary') === tier);
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
      renderSummary(items, mode);

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

      renderLeadStory(wrap, topStories[0]);
      renderSection(wrap, category === 'Science' ? 'Discovery Watch' : 'Top Briefing', topStories.slice(1), topSet);

      const remaining = items.filter(i => !topSet.has(i.url));
      const grouped = groupBySignal(remaining);
      const orderedGroups = [
        ...SIGNAL_ORDER.filter(group => grouped.has(group)),
        ...[...grouped.keys()].filter(group => !SIGNAL_ORDER.includes(group)).sort()
      ];
      const compactSingles = [];
      orderedGroups.forEach(group => {
        const groupItems = grouped.get(group) || [];
        if (category === 'AI' && groupItems.length === 1) compactSingles.push(groupItems[0]);
        else renderSection(wrap, group, groupItems);
      });
      if (compactSingles.length) renderSection(wrap, 'More AI News', compactSingles);
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
    tierSelect.onchange = applyFilters;
    archiveSelect.onchange = async () => {
      const path = archiveSelect.value || 'public/ai-news-latest.json';
      news = await loadJson(path);
      baseItems = news.items || [];
      populateSources(categorySelect.value, viewSelect?.value || 'curated');
      sourceSelect.value = '';
      renderTools(news);
      renderHealth(news);
      applyFilters();
    };
    queryInput.oninput = applyFilters;

    // Init with default category
    populateSources(categorySelect.value, viewSelect?.value || 'curated');
    renderTools(news);
    renderHealth(news);

    applyFilters();
  } catch (e) {
    const wrap = document.getElementById('news-grid');
    wrap.innerHTML = `<div class="item">Could not load feed data: ${e.message}</div>`;
  }
}

init();
