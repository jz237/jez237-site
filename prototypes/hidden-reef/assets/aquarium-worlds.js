// Recorded aquarium previews: no aquarium renderer or simulation runs here.
(() => {
  const section = document.querySelector('.aquarium-worlds');
  if (!section || !('IntersectionObserver' in window)) return;
  const videos = [...section.querySelectorAll('video[data-src]')];
  const toggle = section.querySelector('.aquarium-preview-toggle');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const visible = new Set();
  const failed = new Set();
  let enabled = !motion.matches && !connection?.saveData;
  const wanted = video => enabled && !document.hidden && visible.has(video) && !failed.has(video);

  function update() {
    toggle.hidden = false;
    toggle.textContent = enabled ? 'Pause previews' : 'Play previews';
    toggle.setAttribute('aria-pressed', String(enabled));
    for (const video of videos) {
      if (!wanted(video)) { video.pause(); continue; }
      if (!video.hasAttribute('src')) video.src = video.dataset.src;
      video.muted = true;
      if (video.paused) video.play().catch(() => {
        // Autoplay may be blocked by the browser. Keep the photograph usable.
        if (wanted(video)) { enabled = false; update(); }
      });
    }
  }
  for (const video of videos) {
    video.addEventListener('playing', () => {
      if (wanted(video)) video.classList.add('is-playing');
      else video.pause();
    });
    video.addEventListener('error', () => {
      failed.add(video);
      video.classList.remove('is-playing');
      video.pause();
      if (failed.size === videos.length) toggle.hidden = true;
    });
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= .15) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    update();
  }, {threshold: [0, .15]});
  videos.forEach(video => observer.observe(video));
  toggle.addEventListener('click', () => { enabled = !enabled; update(); });
  document.addEventListener('visibilitychange', update);
  const preferencesChanged = () => {
    enabled = !motion.matches && !connection?.saveData;
    if (!enabled) videos.forEach(video => video.classList.remove('is-playing'));
    update();
  };
  motion.addEventListener('change', preferencesChanged);
  connection?.addEventListener('change', preferencesChanged);
  update();
})();
