(function () {
  const body = document.body;
  const dataFile = body.dataset.collectionData;
  const label = body.dataset.collectionLabel || 'Collection';
  const emptyText = body.dataset.collectionEmpty || 'No images have been archived in this collection yet.';
  const order = body.dataset.collectionOrder || 'newest';
  const subtype = body.dataset.collectionSubtype || '';
  // Factual infographics are split into topics. The daily job tags most entries
  // with "factual_subtype: <name>" in their notes; older and general entries carry
  // no specific tag, so those are sorted by title keywords instead.
  const topic = body.dataset.collectionTopic || '';
  const TAGGED_TOPICS = {
    'cat-infographic': 'cats',
    'bizarre-insect-life': 'insects',
    'rare-insect': 'insects',
    'phobia-infographic': 'phobias',
    'medical-health-infographic': 'health',
    'reef-fish-infographic': 'reef-fish'
  };
  const KEYWORD_TOPICS = [
    ['insects', /beetle|honeybee|\bbees?\b|wasp|\bfly\b|\bants?\b|termite|\bmoth\b|phasmid|insect|cricket|cicada|grasshopper|mayfly|antlion|hangingfly|nymph|weevil|\bbug\b|lacewing|scorpionfly|dobsonfly|salmonfly|spittlebug|water scorpion|glow-worm/i],
    ['how-things-work', /decal|receipt|sprinkler|watch|freehub|refrigerator|can opener|zipper|pencil|battery|smart glass|vinyl|heat shield|solar sail|gravitational-wave|ferrofluid|radiocarbon|cherenkov/i],
    ['earth-space', /heat dome|frost|sprite|basalt|lightning|fulgurite|hailstone|atmospheric river|pyrocumulonimbus|volcanic|snow crystal|aurora|tsunami|cave pearl|enceladus|pulsar|geyser|pillow lava|\bopal\b|saharan dust|soil crust|upwelling|internal waves|brinicle|black smoker|hydrothermal/i]
  ];
  function topicOf(item) {
    // Entries carry an explicit group (written by append-entry.py / factual_groups.py);
    // the tag and keyword rules below only cover entries that predate it.
    const group = item.factualInfographic && item.factualInfographic.group;
    if (group) return group;
    const tag = String(item.tests || '').match(/(?:^|;)\s*factual_subtype:\s*([a-z-]+)(?=;|\s|$)/);
    if (tag && TAGGED_TOPICS[tag[1]]) return TAGGED_TOPICS[tag[1]];
    const title = String(item.title || '');
    const hit = KEYWORD_TOPICS.find((entry) => entry[1].test(title));
    return hit ? hit[0] : 'nature-science';
  }
  const grid = document.getElementById('collection-grid');
  const count = document.getElementById('collection-count');
  const viewer = document.getElementById('collection-lightbox');
  const stage = document.getElementById('collection-lightbox-stage');
  const viewerImage = document.getElementById('collection-lightbox-image');
  const viewerTitle = document.getElementById('collection-lightbox-title');
  const closeButton = document.getElementById('collection-lightbox-close');
  const IMAGE_BASE = 'https://media.jez237.com/image-gen-2-benchmark/images/';

  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  function imageUrl(value) {
    const path = String(value || '');
    if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('/')) return path;
    return path.startsWith('images/') ? `${IMAGE_BASE}${path.slice(7)}` : path;
  }

  function sizeClass(value) {
    const match = String(value || '').match(/^(\d+)x(\d+)$/);
    if (!match) return '';
    const width = Number(match[1]);
    const height = Number(match[2]);
    return height > width ? ' portrait' : width > height ? ' landscape' : '';
  }

  function card(item) {
    const source = imageUrl(item.image);
    return `<article class="collection-card">
      <div class="collection-image${sizeClass(item.size)}">
        <img src="${escapeHtml(source)}" alt="${escapeHtml(item.title)}" loading="lazy">
      </div>
      <div class="collection-content">
        <div class="collection-kicker">${escapeHtml(item.date)} · ${escapeHtml(label)}</div>
        <h2>${dataFile === 'factual-infographics-data.json'
          ? `<a href="https://jez237.com/experiments/image-gen-2-benchmark/infographics/${encodeURIComponent(item.id)}/">${escapeHtml(item.title)}</a>`
          : escapeHtml(item.title)}</h2>
        <details><summary>Show prompt</summary><pre>${escapeHtml(item.prompt)}</pre></details>
      </div>
    </article>`;
  }

  function openViewer(source, alt) {
    viewerImage.src = source;
    viewerImage.alt = alt || 'Expanded generated image';
    viewerTitle.textContent = alt || 'Generated image';
    viewer.classList.add('open');
    viewer.classList.remove('actual');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus({ preventScroll: true });
  }

  function closeViewer() {
    viewer.classList.remove('open', 'actual');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    viewerImage.removeAttribute('src');
    stage.scrollTo(0, 0);
  }

  function bindImages() {
    grid.querySelectorAll('.collection-image img').forEach((image) => {
      image.tabIndex = 0;
      image.addEventListener('click', () => openViewer(image.currentSrc || image.src, image.alt));
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openViewer(image.currentSrc || image.src, image.alt);
        }
      });
    });
  }

  function render(items) {
    const matching = subtype ? items.filter((item) => {
      const match = String(item.tests || '').match(/(?:^|;)\s*factual_subtype:\s*([a-z-]+)(?=;|\s|$)/);
      return match && match[1] === subtype;
    }) : topic ? items.filter((item) => topicOf(item) === topic) : items;
    const indexed = matching.map((item, index) => ({ item, index }));
    indexed.sort((a, b) => {
      const dateOrder = String(b.item.date || '').localeCompare(String(a.item.date || ''));
      if (dateOrder) return dateOrder;
      if (order === 'journey') return a.index - b.index;
      return String(b.item.slot || '').localeCompare(String(a.item.slot || '')) || String(b.item.id || '').localeCompare(String(a.item.id || ''));
    });
    const sorted = indexed.map(({ item }) => item);
    count.textContent = `Images: ${sorted.length}`;
    if (!sorted.length) {
      grid.innerHTML = `<p class="collection-empty">${escapeHtml(emptyText)}</p>`;
      return;
    }
    grid.innerHTML = sorted.map(card).join('');
    bindImages();
  }

  viewerImage.addEventListener('click', (event) => {
    event.stopPropagation();
    viewer.classList.toggle('actual');
    if (viewer.classList.contains('actual')) {
      requestAnimationFrame(() => stage.scrollTo(Math.max(0, (viewerImage.offsetWidth - stage.clientWidth) / 2), Math.max(0, (viewerImage.offsetHeight - stage.clientHeight) / 2)));
    }
  });
  stage.addEventListener('click', (event) => { if (event.target === stage) closeViewer(); });
  closeButton.addEventListener('click', closeViewer);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && viewer.classList.contains('open')) closeViewer(); });

  fetch(dataFile, { cache: 'no-cache' })
    .then((response) => response.ok ? response.json() : Promise.reject(new Error(`Could not load ${dataFile}`)))
    .then(render)
    .catch((error) => {
      count.textContent = 'Images: unavailable';
      grid.innerHTML = `<p class="collection-empty">${escapeHtml(error.message)}</p>`;
    });
})();
