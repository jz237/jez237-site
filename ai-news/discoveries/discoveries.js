/* Progressive enhancement: stories and sources remain readable without JS. */
(() => {
  const form = document.querySelector('.discovery-controls');
  const search = document.querySelector('#discovery-search');
  const topic = document.querySelector('#discovery-topic');
  const evidence = document.querySelector('#discovery-evidence');
  const count = document.querySelector('#result-count');
  const more = document.querySelector('#load-more');
  const empty = document.querySelector('#empty-results');
  const cards = [...document.querySelectorAll('.discovery-story')];
  const texts = new Map(cards.map(card => [card, card.textContent.toLocaleLowerCase()]));
  const pageSize = 18;
  let visible = pageSize;
  function selected() {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return cards.filter(card => (!topic.value || card.dataset.topic === topic.value)
      && (!evidence.value || card.dataset.kind === evidence.value)
      && words.every(word => texts.get(card).includes(word)));
  }
  function render(reset = false) {
    if (reset) visible = pageSize;
    const matches = selected();
    const shown = new Set(matches.slice(0, visible));
    cards.forEach(card => { card.hidden = !shown.has(card); });
    count.textContent = `${Math.min(visible, matches.length)} of ${matches.length} reports${matches.length !== cards.length ? ` · ${cards.length} in the notebook` : ''}`;
    empty.hidden = matches.length !== 0;
    more.hidden = visible >= matches.length;
  }
  function visitHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = cards.find(card => card.id === id);
    if (!target) return;
    // Set values directly: form.reset() schedules the user-reset pagination
    // handler, which would hide a deep-linked story beyond the first page.
    search.value = '';
    topic.value = '';
    evidence.value = '';
    visible = Math.max(pageSize, cards.indexOf(target) + 1);
    render();
    requestAnimationFrame(() => { target.scrollIntoView({ block: 'start' }); });
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => render(true));
  form.addEventListener('change', () => render(true));
  form.addEventListener('reset', () => { requestAnimationFrame(() => render(true)); });
  more.addEventListener('click', () => {
    const matches = selected();
    const next = matches[visible];
    visible += pageSize;
    render();
    // Keyboard users should land at the first newly revealed story, not skip it.
    if (next) { next.tabIndex = -1; next.focus({ preventScroll: true }); }
  });
  const guideToggle = document.querySelector('.guide-toggle');
  const guide = document.querySelector('#evidence-notes');
  guideToggle.addEventListener('click', () => {
    const expanded = guideToggle.getAttribute('aria-expanded') === 'true';
    guideToggle.setAttribute('aria-expanded', String(!expanded));
    guide.hidden = expanded;
  });
  window.addEventListener('hashchange', visitHash);
  render();
  visitHash();
})();
