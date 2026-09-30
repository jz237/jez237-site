// Recorded aquarium previews: no aquarium renderer or simulation runs here.
(() => {
  const section = document.querySelector('.aquarium-worlds');
  if (!section) return;
  const videos = [...section.querySelectorAll('video[data-src]')];
  const toggle = section.querySelector('.aquarium-preview-toggle');
  const pending = new Set();
  const blocked = new Set();
  const failed = new Set();
  const retries = new Map();
  const timers = new Map();
  // Start each visit in play mode. A slow connection or an interrupted play()
  // promise must not become a permanent, shared pause for both aquariums.
  let enabled = true;
  const onscreen = video => {
    const r = video.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  };
  const wanted = video => enabled && !document.hidden && onscreen(video) && !failed.has(video);

  const needsStart = () => !enabled || ((blocked.size > 0 || failed.size > 0) && !videos.some(video => !video.paused));
  function allowRetry() {
    blocked.clear(); retries.clear();
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    for (const video of failed) { video.removeAttribute('src'); video.load(); }
    failed.clear();
  }
  function controls() {
    if (!toggle) return;
    const start = needsStart();
    toggle.hidden = false;
    toggle.textContent = start ? 'Play previews' : 'Pause previews';
    toggle.setAttribute('aria-pressed', String(!start));
  }
  function retry(video) {
    if (!wanted(video) || blocked.has(video) || timers.has(video)) return;
    const attempt = retries.get(video) || 0;
    if (attempt >= 4) { blocked.add(video); controls(); return; }
    retries.set(video, attempt + 1);
    timers.set(video, setTimeout(() => { timers.delete(video); update(); }, [250, 1000, 3000, 8000][attempt]));
  }

  function update() {
    controls();
    for (const video of videos) {
      video.autoplay = wanted(video);
      if (!wanted(video)) {
        clearTimeout(timers.get(video)); timers.delete(video);
        video.pause(); continue;
      }
      if (!video.paused || pending.has(video) || blocked.has(video) || timers.has(video)) continue;
      // Set these before assigning the source for browsers that decide autoplay
      // eligibility at resource selection. Keep native playback inline and silent.
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (!video.hasAttribute('src')) { video.preload = 'auto'; video.src = video.dataset.src; }
      pending.add(video);
      Promise.resolve(video.play()).then(() => {
        pending.delete(video);
        if (!wanted(video)) video.pause();
      }).catch(error => {
        pending.delete(video);
        if (!wanted(video)) return;
        if (error.name === 'NotAllowedError') { blocked.add(video); controls(); }
        else retry(video); // AbortError is normal during scrolling or buffering.
      });
    }
  }
  for (const video of videos) {
    video.addEventListener('playing', () => {
      if (wanted(video)) {
        video.classList.add('is-playing'); blocked.delete(video); retries.delete(video);
        clearTimeout(timers.get(video)); timers.delete(video); controls();
      }
      else video.pause();
    });
    video.addEventListener('canplay', update);
    video.addEventListener('pause', () => retry(video));
    video.addEventListener('error', () => {
      failed.add(video);
      video.classList.remove('is-playing');
      video.pause();
      controls(); // Keep retry available; a failure in one clip cannot stop the other.
    });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(update, {threshold: [0, .01]});
    videos.forEach(video => observer.observe(video));
  } else {
    // Older browsers still start previews; coalesce scroll events to one check.
    let frame = 0;
    addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); }, {passive:true});
  }
  toggle?.addEventListener('click', () => {
    if (!needsStart()) enabled = false;
    else { enabled = true; allowRetry(); }
    update();
  });
  // Browsers may insist on user activation. Retry in that activation instead of
  // leaving the videos disabled for the rest of the visit. Honor manual Pause.
  const activate = event => {
    if (!enabled || !blocked.size || toggle?.contains(event.target)) return;
    blocked.clear(); retries.clear(); update();
  };
  document.addEventListener('pointerdown', activate, {passive:true});
  document.addEventListener('keydown', activate);
  document.addEventListener('visibilitychange', update);
  addEventListener('resize', update);
  addEventListener('online', () => { if (enabled) allowRetry(); update(); });
  addEventListener('pageshow', event => {
    if (event.persisted) { enabled = true; allowRetry(); }
    update();
  });
  update();
})();
