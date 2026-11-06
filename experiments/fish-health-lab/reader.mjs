// "Read more" sources open in an in-page pop-up, like a product quick view on the
// shop (Jez, Nov 6 2026 09:17 EST: "have the sites come up in a pop-up similar to
// the way the shop online works"). The page loads in a sandboxed iframe with no
// referrer; the bar keeps "Open in a new tab" for anyone who wants the full site.
// Ctrl/⌘/Shift/middle clicks keep the browser's own new-tab behaviour.
const READER_SANDBOX = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms';

export function createReader({ $ }) {
  const dialog = $('#reader-dialog'), frame = $('#reader-frame');
  dialog.addEventListener('close', () => { frame.src = 'about:blank'; document.documentElement.classList.remove('reader-open'); });

  function open(event, link) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return false;
    const url = link.href;
    if (!/^https:\/\//.test(url) || typeof dialog.showModal !== 'function') return false;
    event.preventDefault();
    $('#reader-title').textContent = (link.dataset.readerTitle || link.textContent || '').replace(/\s*↗\s*$/, '').replace(/^Read more:\s*/i, '');
    $('#reader-source').textContent = link.dataset.readerSource || new URL(url).hostname.replace(/^www\./, '');
    $('#reader-open').href = url;
    $('#reader-status').hidden = false;
    frame.setAttribute('sandbox', READER_SANDBOX);
    frame.setAttribute('referrerpolicy', 'no-referrer');
    frame.onload = () => { if (frame.src !== 'about:blank') $('#reader-status').hidden = true; };
    frame.src = url;
    document.documentElement.classList.add('reader-open');
    dialog.showModal();
    return true;
  }

  return { open };
}
