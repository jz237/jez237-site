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
    const title = document.createElement('a');
    title.className = 'news-card-title';
    title.href = n.url;
    title.target = '_blank';
    title.rel = 'noopener';
    title.textContent = n.title || 'Untitled';

    const meta = el('div', 'news-meta', `${n.source || 'Unknown'} · ${fmtDate(n.published)} · score ${n.score ?? '-'}`);
    body.appendChild(title);
    body.appendChild(meta);

    if (n.summary) body.appendChild(el('p', 'muted', n.summary));
    card.appendChild(body);
    wrap.appendChild(card);
  });
}

async function init() {
  try {
    const news = await loadJson('https://raw.githubusercontent.com/jz237/jez237-site/main/ai-news/public/ai-news-latest.json');
    const baseItems = news.items || [];

    document.getElementById('news-updated').textContent = `Updated: ${fmtDate(news.updatedAt)}`;

    const latestBtn = document.getElementById('btn-latest');
    const topBtn = document.getElementById('btn-top');
    const categorySelect = document.getElementById('news-category');
    const sourceSelect = document.getElementById('news-source');
    const queryInput = document.getElementById('news-query');

    let mode = 'latest';

    function populateSources(category) {
      const categoryItems = baseItems.filter(i => (i.category || 'AI') === category);
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
      const source = sourceSelect?.value || '';
      const q = (queryInput?.value || '').trim().toLowerCase();

      let items = baseItems.filter(i => (i.category || 'AI') === category);
      if (source) items = items.filter(i => i.source === source);
      if (q) {
        items = items.filter(i => {
          const t = (i.title || '').toLowerCase();
          const s = (i.summary || '').toLowerCase();
          return t.includes(q) || s.includes(q);
        });
      }

      if (mode === 'top') items.sort((a, b) => (b.score || 0) - (a.score || 0));
      else items.sort((a, b) => (new Date(b.published) - new Date(a.published)));

      const limit = category === 'Science' ? 30 : 60;
      items = items.slice(0, limit);

      const wrap = document.getElementById('news-grid');
      wrap.innerHTML = '';

      const grid = document.createElement('div');
      grid.className = 'news-inner-grid';
      wrap.appendChild(grid);

      const featuredByScore = [...items]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, Math.max(4, Math.round(items.length * 0.22)));
      const featuredSet = new Set(featuredByScore.map(i => i.url));
      renderNews(items, featuredSet, grid);
    }

    categorySelect.onchange = () => {
      populateSources(categorySelect.value);
      applyFilters();
    };
    latestBtn.onclick = () => { mode = 'latest'; applyFilters(); };
    topBtn.onclick = () => { mode = 'top'; applyFilters(); };
    sourceSelect.onchange = applyFilters;
    queryInput.oninput = applyFilters;

    // Init with default category
    populateSources(categorySelect.value);

    applyFilters();
  } catch (e) {
    const wrap = document.getElementById('news-grid');
    wrap.innerHTML = `<div class="item">Could not load feed data: ${e.message}</div>`;
  }
}

init();
