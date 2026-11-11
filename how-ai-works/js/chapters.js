/* Chapter navigation shared by both lab pages: rail highlight + progress bar,
   the phone layout where only one chapter is open at a time, the Prev / Next
   bar, and the pause / speed controls. Needs core.js. */
(function () {
  'use strict';
  const L = window.Lab;
  if (!L) return;
  const chapters = L.$$('.chapter'), links = L.$$('.lab-nav a');
  const mq = window.matchMedia('(max-width: 680px)');
  let current = 0, openIdx = 0;
  const acc = () => mq.matches;

  function setCurrent(i) {
    current = i;
    const id = chapters[i].id;
    links.forEach(a => {
      const mine = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', mine);
      if (mine) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      const nav = a.parentNode;   // on phones the chapter list is a horizontal strip
      if (mine && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = a.offsetLeft - nav.offsetLeft - 12;
    });
    const fill = L.$('#railFill');
    if (fill) fill.style.width = ((i + 1) / chapters.length * 100) + '%';
    const mt = L.$('#mobileTitle');
    if (mt) mt.textContent = (i + 1) + '/' + chapters.length + ' · ' + (chapters[i].dataset.short || '');
  }
  // on phones only one chapter is open at a time
  function layout() {
    document.documentElement.classList.toggle('lab-acc', acc());
    chapters.forEach((c, i) => {
      const shut = acc() && i !== openIdx;
      c.classList.toggle('collapsed', shut);
      const b = c.querySelector('.ch-toggle');
      if (b) { b.setAttribute('aria-expanded', String(!shut)); b.textContent = shut ? 'Open' : 'Close'; }
    });
    if (acc() && openIdx >= 0) setCurrent(openIdx);
    L.kick();
  }
  function open(i, scroll) {
    openIdx = i;
    layout();
    if (scroll && i >= 0) chapters[i].scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  chapters.forEach((c, i) => {
    const head = c.querySelector('.lab-card-header'), body = c.querySelector('.lab-card-body');
    if (!head) return;
    const b = L.h('button', { class: 'lab-button ch-toggle', type: 'button' });
    if (body) { body.id = body.id || c.id + '-body'; b.setAttribute('aria-controls', body.id); }
    head.append(b);
    head.addEventListener('click', ev => {
      if (!acc() || (ev.target.closest('a,button') && ev.target !== b)) return;
      open(openIdx === i ? -1 : i, openIdx !== i);
    });
  });
  // a link to something inside a closed chapter opens that chapter first
  const jump = () => {
    const el = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    const ch = el && el.closest('.chapter');
    if (ch && acc()) { open(chapters.indexOf(ch), false); el.scrollIntoView({ block: 'start' }); }
  };
  window.addEventListener('hashchange', jump);
  // Prev/Next and the chapter headers move around without touching the address, so a link to the
  // hash that is already in it fires no hashchange; open its chapter directly
  document.addEventListener('click', ev => {
    const a = ev.target.closest && ev.target.closest('a[href*="#"]');
    if (a && acc() && a.hash.length > 1 && a.hash === location.hash && a.pathname === location.pathname) jump();
  });
  if (mq.addEventListener) mq.addEventListener('change', layout); else if (mq.addListener) mq.addListener(layout);
  if ('IntersectionObserver' in window && chapters.length) {
    const io = new IntersectionObserver(es => {
      if (acc()) return;
      es.forEach(e => { if (e.isIntersecting) setCurrent(chapters.indexOf(e.target)); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    chapters.forEach(c => io.observe(c));
  }
  const go = d => {
    const n = L.clamp((acc() && openIdx >= 0 ? openIdx : current) + d, 0, chapters.length - 1);
    if (acc()) open(n, true);
    else chapters[n].scrollIntoView({ behavior: L.reduce ? 'auto' : 'smooth', block: 'start' });
  };
  [['#mobilePrev', -1], ['#mobileNext', 1]].forEach(p => { const b = L.$(p[0]); if (b) b.addEventListener('click', () => go(p[1])); });
  if (chapters.length) { setCurrent(0); layout(); jump(); }

  /* ---------- motion controls ---------- */
  const pauseBtn = L.$('#motionPause');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      L.setMotion({ paused: !L.state.paused });
      pauseBtn.textContent = L.state.paused ? 'Resume motion' : 'Pause all motion';
      pauseBtn.setAttribute('aria-pressed', String(L.state.paused));
    });
    L.$$('[data-speed]').forEach(b => b.addEventListener('click', () => {
      L.setMotion({ speed: Number(b.dataset.speed) });
      L.$$('[data-speed]').forEach(x => x.classList.toggle('active', x === b));
    }));
  }
  L.onMotion(st => L.$$('svg.smil').forEach(s => { try { if (st.paused) s.pauseAnimations(); else s.unpauseAnimations(); } catch (e) { /* no SMIL */ } }));
})();
