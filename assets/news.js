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

function renderNews(items) {
  const wrap = document.getElementById('news-grid');
  wrap.innerHTML = '';

  if (!items.length) {
    wrap.appendChild(el('div', 'item', 'No news items available right now.'));
    return;
  }

  items.forEach((n) => {
    const card = el('article', 'news-card');

    if (n.image && !isLikelyBadImage(n.image)) {
      const img = document.createElement('img');
      img.className = 'news-card-img';
      img.src = n.image;
      img.alt = '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.onerror = () => img.remove();
      img.onload = () => {
        if (img.naturalWidth < 240 || img.naturalHeight < 120) img.remove();
      };
      card.appendChild(img);
    }

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
    const news = await loadJson('./ai-news/public/ai-news-latest.json');
    const baseItems = news.items || [];

    document.getElementById('news-updated').textContent = `Updated: ${fmtDate(news.updatedAt)}`;

    const latestBtn = document.getElementById('btn-latest');
    const topBtn = document.getElementById('btn-top');
    const sourceSelect = document.getElementById('news-source');
    const queryInput = document.getElementById('news-query');

    sourceSelect.innerHTML = '<option value="">All sources</option>';
    uniqueSources(baseItems).forEach(source => {
      const opt = document.createElement('option');
      opt.value = source;
      opt.textContent = source;
      sourceSelect.appendChild(opt);
    });

    let mode = 'latest';

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

      if (mode === 'top') items.sort((a, b) => (b.score || 0) - (a.score || 0));
      else items.sort((a, b) => (new Date(b.published) - new Date(a.published)));

      renderNews(items.slice(0, 60));
    }

    latestBtn.onclick = () => { mode = 'latest'; applyFilters(); };
    topBtn.onclick = () => { mode = 'top'; applyFilters(); };
    sourceSelect.onchange = applyFilters;
    queryInput.oninput = applyFilters;

    applyFilters();
  } catch (e) {
    const wrap = document.getElementById('news-grid');
    wrap.innerHTML = `<div class="item">Could not load feed data: ${e.message}</div>`;
  }
}

init();
