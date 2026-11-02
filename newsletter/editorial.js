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
(() => {
  'use strict';
  // Copy link: the button is shown only where the Clipboard API exists; otherwise
  // (and on any failure) the plain visible URL stays available. No third-party widgets.
  const root = document.documentElement;
  if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') root.classList.add('can-copy-link');
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy-link]');
    if (!button) return;
    const line = button.closest('.share-line');
    const status = line?.querySelector('.share-status');
    try {
      await navigator.clipboard.writeText(button.dataset.copyLink);
      line?.classList.remove('share-failed');
      if (status) status.textContent = 'Link copied';
      setTimeout(() => { if (status) status.textContent = ''; }, 2500);
    } catch {
      line?.classList.add('share-failed');
      if (status) status.textContent = 'Copy unavailable. Use the link below.';
    }
  });
})();
