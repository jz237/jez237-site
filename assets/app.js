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

function renderSiteContent(data) {
  document.getElementById('hero-title').textContent = `${data.name} — personal site`;
  document.getElementById('hero-tagline').textContent = data.tagline;
  document.getElementById('hero-about').textContent = data.about;

  const projects = document.getElementById('projects-list');
  projects.innerHTML = '';
  (data.projects || []).forEach(p => {
    const i = el('div', 'item');
    const a = document.createElement('a');
    a.href = p.link || '#';
    a.textContent = p.name;
    a.target = p.link?.startsWith('http') ? '_blank' : '_self';
    i.appendChild(a);
    i.appendChild(el('div', 'muted', p.desc || ''));
    projects.appendChild(i);
  });

  const games = document.getElementById('games-list');
  games.innerHTML = '';
  (data.games || []).forEach(g => games.appendChild(el('div', 'item', g)));

  const photos = document.getElementById('photos-list');
  photos.innerHTML = '';
  (data.photos || []).forEach(p => photos.appendChild(el('div', 'item', p)));
}

function renderNews(items) {
  const wrap = document.getElementById('news-list');
  wrap.innerHTML = '';
  items.forEach((n, idx) => {
    const row = el('div', 'news-item' + (idx < 3 ? ' open' : ''));
    const head = el('div', 'news-head');
    const left = el('div');
    left.appendChild(el('div', '', n.title || 'Untitled'));
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

async function init() {
  try {
    const [site, news] = await Promise.all([
      loadJson('./content/site.json'),
      loadJson('./ai-news/public/ai-news-latest.json')
    ]);

    renderSiteContent(site);
    const items = news.items || [];
    document.getElementById('news-updated').textContent = `Updated: ${fmtDate(news.updatedAt)}`;

    let current = [...items];
    const latestBtn = document.getElementById('btn-latest');
    const topBtn = document.getElementById('btn-top');

    latestBtn.onclick = () => {
      current = [...items].sort((a, b) => (new Date(b.published) - new Date(a.published)));
      renderNews(current.slice(0, 40));
    };

    topBtn.onclick = () => {
      current = [...items].sort((a, b) => (b.score || 0) - (a.score || 0));
      renderNews(current.slice(0, 40));
    };

    renderNews(current.slice(0, 40));
  } catch (e) {
    const wrap = document.getElementById('news-list');
    wrap.innerHTML = `<div class="item">Could not load feed data: ${e.message}</div>`;
  }
}

init();
