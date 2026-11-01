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
})();
