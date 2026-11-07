// "Read more" sources open in an in-page pop-up, like a product quick view on the
// shop (Jez, Nov 6 2026 09:17 EST: "have the sites come up in a pop-up similar to
// the way the shop online works"). The page loads in a sandboxed iframe with no
// referrer; the bar keeps "Open in a new tab" for anyone who wants the full site.
// Ctrl/⌘/Shift/middle clicks keep the browser's own new-tab behaviour.
const READER_SANDBOX = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms';
// Older browsers keep the plain new-tab link: on a Windows 7 PC both Chrome 109 and Firefox ESR 115
// showed the Merck page for a moment and then went blank inside the pop-up, while a new tab worked
// (Jez, Nov 7 2026). Windows 7/8 browsers, and browsers without Object.groupBy (before Chrome 117,
// Firefox 119, Safari 17.4), open sources in a new tab.
export function legacyReader(win = globalThis) {
  return typeof win.Object?.groupBy !== 'function' || /Windows NT 6\.[0-3]\b/.test(win.navigator?.userAgent || '');
}

export function createReader({ $ }) {
  const dialog = $('#reader-dialog'), frame = $('#reader-frame');
  dialog.addEventListener('close', () => { frame.src = 'about:blank'; document.documentElement.classList.remove('reader-open'); });

  function open(event, link) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return false;
    if (legacyReader()) return false;
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
