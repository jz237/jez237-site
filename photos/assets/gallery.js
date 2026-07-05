/* ===================================================================
   photos/assets/gallery.js — shared renderer for /photos/ albums
   ------------------------------------------------------------------
   Photo data lives in each album's manifest.json — add photos THERE,
   not in the HTML. See photos/README.md for the format.

   Page contract:
     <div data-gallery
          data-manifest="manifest.json"   (default: manifest.json)
          data-layout="masonry|timeline"  (default: masonry)
          data-batch="18"></div>          (masonry batch size)
   Optional: <template data-gallery-empty> for a custom empty state.
   Optional: elements with [data-photo-total] get the photo count.
   =================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-gallery]');
  if (!root) return;

  var manifestUrl = root.getAttribute('data-manifest') || 'manifest.json';
  var layout = root.getAttribute('data-layout') || 'masonry';
  var batchSize = parseInt(root.getAttribute('data-batch') || '18', 10);

  var photos = [];   // flat list in display order; lightbox follows it
  var lb = null;     // lightbox elements
  var lbIndex = 0;

  fetch(manifestUrl)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var list = Array.isArray(data) ? data : (data.photos || []);
      render(list);
    })
    .catch(function (err) {
      root.innerHTML = '';
      var box = el('div', 'pg-empty');
      box.appendChild(el('div', 'pg-empty-emoji', '📷'));
      box.appendChild(el('p', null, 'Could not load this album (' + err.message + '). If you are viewing the file directly, serve the site over HTTP.'));
      root.appendChild(box);
    });

  /* ---------------- helpers ---------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function formatMonth(key) { // key: YYYY-MM
    var d = new Date(key + '-01T12:00:00');
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  function formatDay(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function lightboxTitle(p) {
    var parts = [];
    if (p.date) parts.push(formatDay(p.date));
    if (p.caption) parts.push(p.caption);
    return parts.join(' • ') || p.alt || '';
  }

  /* ---------------- rendering ---------------- */

  function render(list) {
    document.querySelectorAll('[data-photo-total]').forEach(function (n) {
      n.textContent = String(list.length);
    });

    if (!list.length) {
      renderEmpty();
      return;
    }

    buildLightbox();

    if (layout === 'timeline') {
      renderTimeline(list);
    } else {
      renderMasonry(list);
    }
  }

  function renderEmpty() {
    var tpl = document.querySelector('template[data-gallery-empty]');
    var box = el('div', 'pg-empty');
    if (tpl) {
      box.appendChild(tpl.content.cloneNode(true));
    } else {
      box.appendChild(el('div', 'pg-empty-emoji', '📷'));
      box.appendChild(el('p', null, 'No photos here yet.'));
    }
    root.appendChild(box);
  }

  function photoCell(p, index, withDate) {
    var item = el('div', withDate ? 'pg-card' : 'pg-item');
    var img = document.createElement('img');
    img.src = p.src;
    img.alt = p.alt || p.caption || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    item.appendChild(img);

    if (withDate) {
      var meta = el('div', 'pg-meta');
      if (p.date) meta.appendChild(el('div', 'pg-date', formatDay(p.date)));
      if (p.caption) meta.appendChild(el('div', 'pg-text', p.caption));
      item.appendChild(meta);
    } else if (p.caption || p.date) {
      var cap = el('div', 'pg-caption', p.caption || '');
      if (p.date) cap.appendChild(el('span', 'pg-date', formatDay(p.date)));
      item.appendChild(cap);
    }

    item.addEventListener('click', function () { openLightbox(index); });
    return item;
  }

  function renderMasonry(list) {
    photos = list.slice();

    var grid = el('div', 'pg-masonry');
    root.appendChild(grid);

    var moreWrap = el('div', 'pg-more-wrap');
    var moreBtn = el('button', 'pg-more-btn', 'Load more');
    var topBtn = el('button', 'pg-more-btn', '↑ Back to top');
    topBtn.style.display = 'none';
    topBtn.style.marginLeft = '10px';
    var count = el('div', 'pg-count');
    moreWrap.appendChild(moreBtn);
    moreWrap.appendChild(topBtn);
    moreWrap.appendChild(count);
    root.appendChild(moreWrap);

    var loaded = 0;
    function loadBatch() {
      var end = Math.min(loaded + batchSize, photos.length);
      for (var i = loaded; i < end; i++) {
        grid.appendChild(photoCell(photos[i], i, false));
      }
      loaded = end;
      count.textContent = loaded + ' of ' + photos.length;
      if (loaded >= photos.length) moreBtn.style.display = 'none';
      if (loaded > batchSize) topBtn.style.display = 'inline-block';
    }

    moreBtn.addEventListener('click', loadBatch);
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    loadBatch();
  }

  function renderTimeline(list) {
    // Newest first; undated photos keep their order in an "Undated" group at the end.
    var dated = list.filter(function (p) { return p.date; })
      .sort(function (a, b) { return b.date.localeCompare(a.date); });
    var undated = list.filter(function (p) { return !p.date; });
    photos = dated.concat(undated);

    var groups = [];
    var byKey = {};
    photos.forEach(function (p) {
      var key = p.date ? p.date.slice(0, 7) : 'undated';
      if (!byKey[key]) {
        byKey[key] = [];
        groups.push(key);
      }
      byKey[key].push(p);
    });

    var wrap = el('div', 'pg-timeline');
    root.appendChild(wrap);

    var index = 0;
    groups.forEach(function (key) {
      var items = byKey[key];
      var block = el('section', 'pg-month');
      var header = el('div', 'pg-month-header');
      header.appendChild(el('h2', 'pg-month-title', key === 'undated' ? 'Undated' : formatMonth(key)));
      header.appendChild(el('div', 'pg-month-count', items.length + ' photo' + (items.length === 1 ? '' : 's')));
      block.appendChild(header);

      var grid = el('div', 'pg-month-grid');
      items.forEach(function (p) {
        grid.appendChild(photoCell(p, index, true));
        index++;
      });
      block.appendChild(grid);
      wrap.appendChild(block);
    });
  }

  /* ---------------- lightbox ---------------- */

  function buildLightbox() {
    var box = el('div', 'pg-lightbox');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-hidden', 'true');

    var bar = el('div', 'pg-lb-bar');
    var title = el('div', 'pg-lb-title');
    var hint = el('div', 'pg-lb-hint', 'Click image: fit ⇄ 1:1 · Arrows browse · Esc closes');
    var close = el('button', 'pg-lb-close', 'Close');
    bar.appendChild(title);
    bar.appendChild(hint);
    bar.appendChild(close);

    var stage = el('div', 'pg-lb-stage');
    var img = document.createElement('img');
    img.alt = '';
    stage.appendChild(img);

    var nav = el('div', 'pg-lb-nav');
    var prev = el('button', null, '← Prev');
    var counter = el('span', 'pg-lb-counter');
    var next = el('button', null, 'Next →');
    nav.appendChild(prev);
    nav.appendChild(counter);
    nav.appendChild(next);

    box.appendChild(bar);
    box.appendChild(stage);
    box.appendChild(nav);
    document.body.appendChild(box);

    lb = { box: box, title: title, img: img, counter: counter };

    close.addEventListener('click', closeLightbox);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === stage) closeLightbox();
    });
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    img.addEventListener('click', function () { box.classList.toggle('actual'); });

    var wheelLast = 0;
    box.addEventListener('wheel', function (e) {
      if (!box.classList.contains('open')) return;
      if (box.classList.contains('actual')) return; // 1:1 mode: wheel pans the image
      e.preventDefault();
      var now = Date.now();
      if (now - wheelLast < 350 || Math.abs(e.deltaY) < 6) return;
      wheelLast = now;
      step(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    var touchX = null;
    box.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) touchX = e.touches[0].clientX;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (touchX == null || box.classList.contains('actual')) { touchX = null; return; }
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  function openLightbox(i) {
    lbIndex = i;
    show(i);
    lb.box.classList.add('open');
    lb.box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function show(i) {
    var p = photos[i];
    lb.img.src = p.src;
    lb.img.alt = p.alt || p.caption || '';
    lb.title.textContent = lightboxTitle(p);
    lb.counter.textContent = (i + 1) + ' / ' + photos.length;
    lb.box.classList.remove('actual');
    // Preload neighbours so arrows feel instant.
    [i - 1, i + 1].forEach(function (j) {
      var q = photos[(j + photos.length) % photos.length];
      if (q) { var pre = new Image(); pre.src = q.src; }
    });
  }

  function step(delta) {
    lbIndex = (lbIndex + delta + photos.length) % photos.length;
    show(lbIndex);
  }

  function closeLightbox() {
    lb.box.classList.remove('open', 'actual');
    lb.box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lb.img.src = '';
  }
})();
