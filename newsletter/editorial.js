(() => {
  'use strict';
  const reveal = id => {
    const target = document.getElementById(id);
    const notes = target?.closest('.editorial-sources');
    if (!notes) return false;
    notes.open = true;
    target.scrollIntoView({block: 'nearest', behavior: 'instant'});
    target.focus({preventScroll: true});
    return true;
  };
  // Keep complete references accessible without JS, but quiet during normal reading.
  document.querySelectorAll('.editorial-sources').forEach(notes => { notes.open = false; });
  if (location.hash) reveal(location.hash.slice(1));
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const citation = event.target.closest('.editorial-citation');
    if (!citation) return;
    const id = citation.dataset.reference || citation.getAttribute('href')?.slice(1);
    if (id && reveal(id)) event.preventDefault();
  });
})();
