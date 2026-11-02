(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const tagFilters = [...document.querySelectorAll('[data-tag-filter]')];
  const grid = document.getElementById('story-grid');
  const count = document.getElementById('story-count');
  const staticPager = document.getElementById('static-pager');
  const filterPager = document.getElementById('filter-pager');
  const section = document.getElementById('stories');
  const PER_PAGE = Number(section?.dataset.perPage) || 10;
  // Every page carries a card template for every story (newest first), so filters can
  // reach stories that live on other static pages.
  const cardTemplates = [...document.querySelectorAll('template[data-card-template]')];
  const staticCards = grid ? [...grid.children] : [];
  const names = {all: 'All stories', freshwater: 'Freshwater', reef: 'Reef & ocean'};
  const tagNames = Object.fromEntries(tagFilters.map(button => [button.dataset.tagFilter, button.textContent.trim()]));
  let category = 'all';
  let tag = 'all';
  let page = 1;
  const matches = item => (category === 'all' || item.dataset.category === category) &&
    (tag === 'all' || (item.dataset.tags || '').split(' ').includes(tag));
  const filtering = () => category !== 'all' || tag !== 'all';
  // Slugs in the current filter across all pages (used by the reader's Previous/Next).
  function currentSlugs() {
    return cardTemplates.filter(matches).map(t => t.dataset.cardTemplate);
  }
  let markLinks = () => {};
  function pagerButton(label, target, attrs = '') {
    return `<button type="button" data-page-target="${target}" ${attrs}>${label}</button>`;
  }
  function apply(updateURL) {
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    tagFilters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tagFilter === tag)));
    if (!grid) return;
    if (!filtering()) {
      // Unfiltered: the server-rendered page stays exactly as published.
      if (grid.children.length !== staticCards.length || [...grid.children].some((c, i) => c !== staticCards[i])) grid.replaceChildren(...staticCards);
      if (staticPager) staticPager.hidden = false;
      if (filterPager) { filterPager.hidden = true; filterPager.replaceChildren(); }
      count.textContent = count.dataset.staticCount || count.textContent;
      page = 1;
    } else {
      const found = cardTemplates.filter(matches);
      const pages = Math.max(1, Math.ceil(found.length / PER_PAGE));
      page = Math.min(Math.max(1, page), pages);
      const slice = found.slice((page - 1) * PER_PAGE, page * PER_PAGE);
      grid.replaceChildren(...slice.map(t => t.content.firstElementChild.cloneNode(true)));
      markLinks(grid);
      if (staticPager) staticPager.hidden = true;
      if (filterPager) {
        if (pages > 1) {
          const nums = Array.from({length: pages}, (_, i) => `<li>${pagerButton(String(i + 1), i + 1, `aria-label="Page ${i + 1}"${i + 1 === page ? ' aria-current="page"' : ''}`)}</li>`).join('');
          filterPager.innerHTML = (page > 1 ? pagerButton('← Newer', page - 1) : '<span class="pager-step" aria-disabled="true">← Newer</span>') +
            `<ol>${nums}</ol>` + (page < pages ? pagerButton('Older →', page + 1) : '<span class="pager-step" aria-disabled="true">Older →</span>');
          filterPager.hidden = false;
        } else { filterPager.hidden = true; filterPager.replaceChildren(); }
      }
      const label = tag === 'all' ? names[category] : `${category === 'all' ? '' : names[category] + ' · '}${tagNames[tag]}`;
      count.textContent = `${label} · ${found.length} ${found.length === 1 ? 'story' : 'stories'}` + (pages > 1 ? ` · page ${page} of ${pages}` : '');
    }
    if (updateURL) {
      const url = new URL(window.location.href);
      if (category === 'all') url.searchParams.delete('topic'); else url.searchParams.set('topic', category);
      if (tag === 'all') url.searchParams.delete('tag'); else url.searchParams.set('tag', tag);
      if (filtering() && page > 1) url.searchParams.set('p', String(page)); else url.searchParams.delete('p');
      history.replaceState(history.state, '', url);
    }
  }
  function select(value, updateURL = true) {
    category = Object.hasOwn(names, value) ? value : 'all';
    page = 1;
    apply(updateURL);
  }
  function selectTag(value, updateURL = true) {
    tag = Object.hasOwn(tagNames, value) ? value : 'all';
    page = 1;
    apply(updateURL);
  }
  filters.forEach(button => button.addEventListener('click', () => select(button.dataset.filter)));
  tagFilters.forEach(button => button.addEventListener('click', () => selectTag(button.dataset.tagFilter)));
  filterPager?.addEventListener('click', event => {
    const button = event.target.closest('[data-page-target]');
    if (!button) return;
    page = Number(button.dataset.pageTarget);
    apply(true);
    section?.scrollIntoView({block: 'start', behavior: 'instant'});
  });
  document.querySelectorAll('[data-topic-link]').forEach(link => link.addEventListener('click', () => select(link.dataset.topicLink)));
  {
    const params = new URLSearchParams(location.search);
    tag = Object.hasOwn(tagNames, params.get('tag')) ? params.get('tag') : 'all';
    category = Object.hasOwn(names, params.get('topic')) ? params.get('topic') : 'all';
    page = Number(params.get('p')) || 1;
    apply(false);
  }

  // Progressive enhancement: normal article links remain the no-JS/old-browser fallback.
  const dialog = document.getElementById('article-reader');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const templates = new Map([...document.querySelectorAll('[data-reader-template]')]
    .map(template => [template.dataset.readerTemplate, template]));
  const paths = new Map([...templates].map(([slug, template]) =>
    [new URL(template.dataset.path, document.baseURI).pathname, slug]));
  const content = document.getElementById('reader-content');
  const scroller = document.getElementById('reader-scroll');
  const previous = document.getElementById('reader-previous');
  const next = document.getElementById('reader-next');
  const position = document.getElementById('reader-position');
  const originalTitle = document.title;
  const stateKey = 'aquariumJournalReader';
  let current = null;
  let sequence = [];
  let trigger = null;
  let pageY = 0;
  let bodyStyle = null;
  let rootOverflow = '';
  let closingHistory = false;
  let backdropPress = false;

  function slugForLink(link) {
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return null;
    const url = new URL(link.href, document.baseURI);
    return url.origin === location.origin ? paths.get(url.pathname) : null;
  }
  markLinks = root => root.querySelectorAll('a[href]').forEach(link => {
    if (slugForLink(link)) {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', 'article-reader');
    }
  });
  markLinks(document);

  function lockPage() {
    pageY = window.scrollY;
    bodyStyle = document.body.getAttribute('style');
    rootOverflow = document.documentElement.style.overflow;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${pageY}px`;
    document.body.style.left = '0';
    document.body.style.width = '100%';
    if (gutter) document.body.style.paddingRight = `${gutter}px`;
    document.documentElement.style.overflow = 'hidden';
  }
  function restorePage() {
    if (!current) return;
    current = null;
    if (dialog.open) dialog.close();
    if (bodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', bodyStyle);
    document.documentElement.style.overflow = rootOverflow;
    document.title = originalTitle;
    window.scrollTo({top: pageY, behavior: 'instant'});
    if (trigger?.isConnected) trigger.focus({preventScroll: true});
  }
  function render(slug) {
    current = slug;
    content.replaceChildren(templates.get(slug).content.cloneNode(true));
    const title = content.querySelector('.reader-title');
    title.id = 'reader-title';
    document.title = `${title.textContent} · Aquarium News`;
    // A related-story link can lead outside the filtered sequence; fall back to every story.
    if (!sequence.includes(slug)) sequence = [...templates.keys()];
    const index = sequence.indexOf(slug);
    previous.disabled = index <= 0;
    next.disabled = index >= sequence.length - 1;
    position.textContent = `${index + 1} of ${sequence.length}`;
    scroller.scrollTop = 0;
    if (dialog.open) title.focus({preventScroll: true});
  }
  function openReader(slug, source = null, fromHistory = false) {
    if (!templates.has(slug) || closingHistory) return;
    // Save the browsing position before fixed-body locking changes window.scrollY.
    // A related-story link inside an open reader swaps the article in place, so Close
    // still takes a single Back step to the edition.
    if (!fromHistory) {
      if (dialog.open) history.replaceState({...history.state, [stateKey]: slug}, '', location.href);
      else history.pushState({...history.state, [stateKey]: slug}, '', location.href);
    }
    if (!dialog.open) {
      trigger = source?.getAttribute('aria-hidden') === 'true'
        ? source.closest('.story')?.querySelector('h3 a') : source;
      if (!trigger) trigger = [...document.querySelectorAll('a[href]')].find(link => slugForLink(link) === slug && link.tabIndex >= 0);
      // Previous/Next walk every story in the current filter, across all pages.
      const inFilter = currentSlugs();
      sequence = inFilter.includes(slug) ? inFilter : [...templates.keys()];
      lockPage();
      render(slug);
      dialog.showModal();
      content.querySelector('.reader-title').focus({preventScroll: true});
    } else render(slug);
  }
  function closeReader() {
    if (!dialog.open || closingHistory) return;
    const shouldGoBack = history.state?.[stateKey] === current;
    restorePage();
    if (shouldGoBack) {
      closingHistory = true;
      history.back();
    }
  }
  function step(direction) {
    const slug = sequence[sequence.indexOf(current) + direction];
    if (!slug) return;
    render(slug);
    history.replaceState({...history.state, [stateKey]: slug}, '', location.href);
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const source = event.target.closest('a[href]');
    const slug = slugForLink(source);
    if (!slug) return;
    event.preventDefault();
    openReader(slug, source);
  });
  document.getElementById('reader-close').addEventListener('click', closeReader);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeReader(); });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('a[href], button:not(:disabled), summary, [tabindex="0"]')]
      .filter(element => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first) return;
    if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('pointerdown', event => { backdropPress = event.target === dialog; });
  dialog.addEventListener('pointerup', event => {
    if (backdropPress && event.target === dialog) closeReader();
    backdropPress = false;
  });
  // Native/programmatic close still restores page state; controls use closeReader for history.
  dialog.addEventListener('close', () => { if (!dialog.open && current) restorePage(); });
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  window.addEventListener('popstate', event => {
    closingHistory = false;
    const slug = event.state?.[stateKey];
    if (templates.has(slug)) openReader(slug, null, true);
    else restorePage();
  });
  if (templates.has(history.state?.[stateKey])) openReader(history.state[stateKey], null, true);
})();
