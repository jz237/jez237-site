// Opens a factual infographic's text page as a pop-up over the gallery, in the same window
// (Jez, Nov 25 2026: "have the read about it info page pop right up in the same window when you click on one").
// The pop-up shows the page's own <main>, fetched from /infographics/<id>/, so there is one copy of the text.
// If anything fails (no fetch, the GitHub mirror, an old browser) the link simply opens the page as before.
(() => {
  'use strict';
  const script = document.currentScript;
  const BASE = new URL('.', script ? script.src : location.href);
  const VERSION = '20261125-popup';
  const ARTICLE = /\/experiments\/image-gen-2-benchmark\/infographics\/[^/?#]+\/?$/;
  const STATE = 'infographicReader';

  const articleAddress = (value) => {
    try {
      const url = new URL(value, location.href);
      return url.origin === location.origin && ARTICLE.test(url.pathname) ? url.href.split('#')[0] : '';
    } catch (error) { return ''; }
  };
  const addStyles = (href) => new Promise((resolve) => {
    const address = new URL(href, location.href).href;
    if ([...document.styleSheets].some((sheet) => sheet.href === address)) return resolve();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = address;
    link.onload = link.onerror = () => resolve();
    document.head.append(link);
    setTimeout(resolve, 2500);
  });
  addStyles(new URL(`infographic-reader.css?v=${VERSION}`, BASE));

  let layer; let dialog; let scroller; let pageLink; let closeButton; let zoom;
  let openAddress = ''; let returnFocus = null; let bodyOverflow = ''; let request = 0;

  function build() {
    layer = document.createElement('div');
    layer.className = 'ir-layer';
    layer.hidden = true;
    layer.innerHTML = `<div class="ir-dialog" role="dialog" aria-modal="true" aria-label="About this infographic" tabindex="-1">
      <div class="ir-bar"><a class="ir-page" href="#">Open as a full page</a><button class="ir-close" type="button">Close <span aria-hidden="true">×</span></button></div>
      <div class="ir-scroll ia-page" tabindex="-1"></div></div>
      <div class="ir-zoom" hidden><img alt=""><button class="ir-close ir-zoom-close" type="button">Close picture <span aria-hidden="true">×</span></button></div>`;
    dialog = layer.querySelector('.ir-dialog');
    scroller = layer.querySelector('.ir-scroll');
    pageLink = layer.querySelector('.ir-page');
    closeButton = layer.querySelector('.ir-bar .ir-close');
    zoom = layer.querySelector('.ir-zoom');
    document.body.append(layer);
    closeButton.addEventListener('click', () => close());
    layer.addEventListener('mousedown', (event) => { if (event.target === layer) close(); });
    zoom.addEventListener('click', () => closeZoom());
    scroller.addEventListener('click', insideClick);
    layer.addEventListener('keydown', keys);
  }

  function keys(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (!zoom.hidden) closeZoom(); else close();
      return;
    }
    if (event.key !== 'Tab') return;
    const scope = zoom.hidden ? dialog : zoom;
    const stops = [...scope.querySelectorAll('a[href], button, summary, [tabindex="0"]')].filter((node) => node.offsetParent !== null);
    if (!stops.length) return;
    const first = stops[0]; const last = stops[stops.length - 1];
    if (event.shiftKey && (document.activeElement === first || !scope.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function openZoom(source, alt) {
    const image = zoom.querySelector('img');
    image.src = source;
    image.alt = alt || '';
    zoom.hidden = false;
    zoom.scrollTo(0, 0);
    zoom.querySelector('button').focus({ preventScroll: true });
  }
  function closeZoom() {
    zoom.hidden = true;
    zoom.querySelector('img').removeAttribute('src');
    const figure = scroller.querySelector('.ia-figure > a');
    (figure || closeButton).focus({ preventScroll: true });
  }

  function insideClick(event) {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const raw = link.getAttribute('href');
    if (raw.startsWith('#')) {                      // a numbered source: scroll to it inside the pop-up
      event.preventDefault();
      const target = scroller.querySelector(`[id="${raw.slice(1).replace(/"/g, '')}"]`);
      if (!target) return;
      scroller.querySelectorAll('.ir-target').forEach((node) => node.classList.remove('ir-target'));
      target.classList.add('ir-target');
      target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    const figure = link.closest('.ia-figure');
    if (figure) {                                   // the picture, or "Open the picture full size": enlarge it here
      event.preventDefault();
      const image = figure.querySelector('img');
      openZoom(link.href, image ? image.alt : '');
      return;
    }
    const article = articleAddress(link.href);
    if (article) { event.preventDefault(); open(article, { replace: true }); return; }
    const url = new URL(link.href);
    if (url.origin === location.origin && url.pathname.replace(/\.html$/, '') === location.pathname.replace(/\.html$/, '')) {
      event.preventDefault();                       // a link back to the gallery that is already underneath
      close();
    }
  }

  async function load(address) {
    const response = await fetch(address, { headers: { Accept: 'text/html' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const main = page.querySelector('main.ia');
    if (!main) throw new Error('no article');
    const absolute = (value) => new URL(value, address).href;
    main.querySelectorAll('[href]').forEach((node) => {
      const value = node.getAttribute('href');
      if (value.startsWith('#')) return;
      node.setAttribute('href', absolute(value));
      if (node.tagName === 'A' && new URL(node.href).origin !== location.origin && !node.closest('.ia-figure')) {
        node.target = '_blank';
        node.rel = 'noopener';
      }
    });
    main.querySelectorAll('[src]').forEach((node) => node.setAttribute('src', absolute(node.getAttribute('src'))));
    const styles = page.querySelector('link[rel="stylesheet"][href*="infographic-article.css"]');
    await addStyles(styles ? absolute(styles.getAttribute('href')) : new URL('infographic-article.css', BASE));
    return main;
  }

  async function open(address, options = {}) {
    if (!layer) build();
    const turn = ++request;
    const wasOpen = !layer.hidden;
    if (!wasOpen) {
      returnFocus = document.activeElement;
      bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      layer.hidden = false;
    }
    if (!zoom.hidden) closeZoom();
    openAddress = address;
    pageLink.href = address;
    dialog.setAttribute('aria-busy', 'true');
    if (!wasOpen) scroller.innerHTML = '<p class="ir-wait">Opening…</p>';
    closeButton.focus({ preventScroll: true });
    if (options.push !== false) {
      const state = { ...(history.state || {}), [STATE]: address };
      if (options.replace || (history.state && history.state[STATE])) history.replaceState(state, '');
      else history.pushState(state, '');
    }
    try {
      const main = await load(address);
      if (turn !== request) return;
      scroller.replaceChildren(main);
      scroller.scrollTo(0, 0);
      const title = main.querySelector('h1');
      dialog.setAttribute('aria-label', title ? title.textContent.trim() : 'About this infographic');
      dialog.removeAttribute('aria-busy');
    } catch (error) {
      if (turn === request) location.href = address;   // fall back to the page itself
    }
  }

  function close(fromHistory) {
    if (!layer || layer.hidden) return;
    request += 1;
    if (!zoom.hidden) closeZoom();
    layer.hidden = true;
    scroller.replaceChildren();
    document.body.style.overflow = bodyOverflow;
    openAddress = '';
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
    if (!fromHistory && history.state && history.state[STATE]) history.back();
  }

  // The browser's Back button closes the pop-up; Forward opens it again.
  addEventListener('popstate', (event) => {
    const address = event.state && event.state[STATE];
    if (address) { if (address !== openAddress) open(address, { push: false }); }
    else close(true);
  });
  // A page reloaded or restored with the pop-up's history entry on top starts without it.
  if (history.state && history.state[STATE]) {
    const state = { ...history.state };
    delete state[STATE];
    history.replaceState(state, '');
  }

  // Every link on the page to an infographic's text page opens the pop-up instead of leaving the gallery.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || (layer && layer.contains(link)) || link.target === '_blank') return;
    const address = articleAddress(link.href);
    if (!address) return;
    event.preventDefault();
    open(address);
  });

  window.InfographicReader = {
    // Returns true when the pop-up took the address, false when the caller should do what it did before.
    open(value) {
      const address = articleAddress(value);
      if (!address || !window.fetch || !window.DOMParser) return false;
      open(address);
      return true;
    },
    close: () => close(),
  };
})();
