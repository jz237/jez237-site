// Tiny DOM helpers + the icon set used by the HUD.
const SVG_NS = 'http://www.w3.org/2000/svg';

export function h(tag, attrs, ...kids) {
  const svg = tag.startsWith('svg:');
  const el = svg ? document.createElementNS(SVG_NS, tag.slice(4)) : document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.setAttribute('class', v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  for (const kid of kids.flat(2)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const ICONS = {
  explode: '<rect x="9" y="9" width="6" height="6" rx="1"/><path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21M5.6 5.6l2.3 2.3M16.1 16.1l2.3 2.3M18.4 5.6l-2.3 2.3M7.9 16.1l-2.3 2.3"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  pause: '<path d="M9 6v12M15 6v12"/>',
  rotate: '<path d="M20 12a8 8 0 1 1-2.7-6"/><path d="M20 4v4.6h-4.6"/>',
  xray: '<path d="M12 3 4.5 7v10L12 21l7.5-4V7z"/><path d="M4.5 7 12 11l7.5-4M12 11v10"/>',
  labels: '<path d="M3.5 12.6V5.2c0-.9.8-1.7 1.7-1.7h7.4c.5 0 .9.2 1.2.5l7 7c.7.7.7 1.8 0 2.5l-6.2 6.2c-.7.7-1.8.7-2.5 0l-7-7c-.4-.3-.6-.7-.6-1.1z"/><circle cx="8.2" cy="8.2" r="1.3"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.7-6"/><path d="M4 4v4.6h4.6"/>',
  fullscreen: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  camera: '<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.2c-.8.5-1.2 1-1.2 1.9M12 17v.01"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  specs: '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
  tour: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>',
  isolate: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3"/>',
  frame: '<path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"/><circle cx="12" cy="12" r="2.2"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  prev: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  up: '<path d="M12 19V6m-5 5 5-5 5 5"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  wing: '<path d="M4 19c1-7 5-12 15-14-.5 8-4 13-11 14.5"/><path d="M4 19 15 8M8 14.5l1-5.5M11.5 11.5l3 .5"/>',
  leg: '<path d="M6 4l5 6-3 5 6 5"/><circle cx="6" cy="4" r="1.3"/><circle cx="11" cy="10" r="1.3"/><circle cx="8" cy="15" r="1.3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};

export function icon(name, cls = '') {
  const wrap = document.createElementNS(SVG_NS, 'svg');
  wrap.setAttribute('viewBox', '0 0 24 24');
  wrap.setAttribute('class', `ico ${cls}`.trim());
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = ICONS[name] || '';
  return wrap;
}

export function svgIcon(markup, cls = '') {
  const wrap = document.createElementNS(SVG_NS, 'svg');
  wrap.setAttribute('viewBox', '0 0 24 24');
  wrap.setAttribute('class', `ico ${cls}`.trim());
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = markup;
  return wrap;
}

export function button(label, iconName, attrs = {}, kids = []) {
  const b = h('button', { type: 'button', ...attrs });
  if (iconName) b.append(icon(iconName));
  if (label) b.append(h('span', { class: 'lbl' }, label));
  for (const k of [].concat(kids)) b.append(k);
  return b;
}

export function loadCSS(href, timeout = 4000) {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    const done = () => resolve(link);
    link.addEventListener('load', done, { once: true });
    link.addEventListener('error', done, { once: true });
    setTimeout(done, timeout);
    document.head.append(link);
  });
}
