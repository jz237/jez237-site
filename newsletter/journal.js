(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const stories = [...document.querySelectorAll('.story[data-category]')];
  const count = document.getElementById('story-count');
  const names = {all: 'All stories', freshwater: 'Freshwater', reef: 'Reef & ocean'};
  function select(category, updateURL = true) {
    if (!Object.hasOwn(names, category)) category = 'all';
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    stories.forEach(story => { story.hidden = category !== 'all' && story.dataset.category !== category; });
    const shown = stories.filter(story => !story.hidden).length;
    count.textContent = `${names[category]} · ${shown} ${shown === 1 ? 'story' : 'stories'} in this pilot edition`;
    if (updateURL) {
      const url = new URL(window.location.href);
      if (category === 'all') url.searchParams.delete('topic');
      else url.searchParams.set('topic', category);
      history.replaceState(null, '', url);
    }
  }
  filters.forEach(button => button.addEventListener('click', () => select(button.dataset.filter)));
  document.querySelectorAll('[data-topic-link]').forEach(link => link.addEventListener('click', () => select(link.dataset.topicLink)));
  select(new URLSearchParams(location.search).get('topic') || 'all', false);

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
  const links = [...document.querySelectorAll('a[href]')];
  links.forEach(link => {
    if (slugForLink(link)) {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', 'article-reader');
    }
  });

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
    document.title = `${title.textContent} · The Aquarium Journal`;
    const index = sequence.indexOf(slug);
    previous.disabled = index <= 0;
    next.disabled = index >= sequence.length - 1;
    position.textContent = `${index + 1} of ${sequence.length}`;
    scroller.scrollTop = 0;
    if (dialog.open) title.focus({preventScroll: true});
  }
  function openReader(slug, source = null, fromHistory = false) {
    if (!templates.has(slug) || closingHistory) return;
    if (!dialog.open) {
      trigger = source?.getAttribute('aria-hidden') === 'true'
        ? source.closest('.story')?.querySelector('h3 a') : source;
      if (!trigger) trigger = links.find(link => slugForLink(link) === slug && link.tabIndex >= 0);
      const visible = stories.filter(story => !story.hidden)
        .map(story => slugForLink(story.querySelector('h3 a'))).filter(Boolean);
      sequence = visible.includes(slug) ? visible : [...templates.keys()];
      lockPage();
      render(slug);
      dialog.showModal();
      content.querySelector('.reader-title').focus({preventScroll: true});
    } else render(slug);
    if (!fromHistory) history.pushState({...history.state, [stateKey]: slug}, '', location.href);
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
    const focusable = [...dialog.querySelectorAll('a[href], button:not(:disabled), [tabindex="0"]')]
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
