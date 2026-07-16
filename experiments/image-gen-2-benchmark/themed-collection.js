(function () {
  const body = document.body;
  const dataFile = body.dataset.collectionData;
  const label = body.dataset.collectionLabel || 'Collection';
  const emptyText = body.dataset.collectionEmpty || 'No images have been archived in this collection yet.';
  const grid = document.getElementById('collection-grid');
  const count = document.getElementById('collection-count');
  const viewer = document.getElementById('collection-lightbox');
  const stage = document.getElementById('collection-lightbox-stage');
  const viewerImage = document.getElementById('collection-lightbox-image');
  const viewerTitle = document.getElementById('collection-lightbox-title');
  const closeButton = document.getElementById('collection-lightbox-close');
  const IMAGE_BASE = 'https://pub-26279ae8f18243e38be5748fbfb75f4c.r2.dev/image-gen-2-benchmark/images/';

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
    const description = item.tests || '';
    return `<article class="collection-card">
      <div class="collection-image${sizeClass(item.size)}">
        <img src="${escapeHtml(source)}" alt="${escapeHtml(item.title)}" loading="lazy">
      </div>
      <div class="collection-content">
        <div class="collection-kicker">${escapeHtml(item.date)} · ${escapeHtml(label)}</div>
        <h2>${escapeHtml(item.title)}</h2>
        ${description ? `<p class="collection-description">${escapeHtml(description)}</p>` : ''}
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
    const sorted = items.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.slot || '').localeCompare(String(a.slot || '')) || String(b.id || '').localeCompare(String(a.id || '')));
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
