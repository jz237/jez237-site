/* === site-enhance.js — lighter ambient + interactions for non-plant pages === */
(function () {
  // --- Seasonal palette ---
  const SEASONS = {
    spring: { primary:'#7ab362', secondary:'#f4a7b9', warm:'#e8c57a', glow:'rgba(122,179,98,0.38)' },
    summer: { primary:'#4fa36a', secondary:'#ffcc4a', warm:'#ff8b4a', glow:'rgba(79,163,106,0.38)' },
    fall:   { primary:'#d87b3a', secondary:'#c94b2d', warm:'#f2b84a', glow:'rgba(216,123,58,0.38)' },
    winter: { primary:'#7fb3cf', secondary:'#b8d4e2', warm:'#d9b88a', glow:'rgba(127,179,207,0.35)' }
  };
  function seasonOf(d){
    const m = d.getMonth(), day = d.getDate();
    if ((m === 2 && day >= 20) || m === 3 || m === 4 || (m === 5 && day <= 20)) return 'spring';
    if ((m === 5 && day >= 21) || m === 6 || m === 7 || (m === 8 && day <= 22)) return 'summer';
    if ((m === 8 && day >= 23) || m === 9 || m === 10 || (m === 11 && day <= 20)) return 'fall';
    return 'winter';
  }
  const s = SEASONS[seasonOf(new Date())];
  const root = document.documentElement;
  root.style.setProperty('--se-accent-primary',   s.primary);
  root.style.setProperty('--se-accent-secondary', s.secondary);
  root.style.setProperty('--se-accent-warm',      s.warm);
  root.style.setProperty('--se-accent-glow',      s.glow);

  // --- Scroll reveal ---
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('se-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.se-reveal, [data-reveal]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.se-reveal, [data-reveal]').forEach(el => el.classList.add('se-in'));
  }

  // --- Image hover tilt ---
  const tilters = document.querySelectorAll('img.photo, img.hero-photo, .feature-media, .card-media');
  tilters.forEach(el => {
    el.addEventListener('mousemove', ev => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width;
      const y = (ev.clientY - r.top) / r.height;
      el.style.setProperty('--se-rx', ((0.5 - y) * 8) + 'deg');
      el.style.setProperty('--se-ry', ((x - 0.5) * 8) + 'deg');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--se-rx', '0deg');
      el.style.setProperty('--se-ry', '0deg');
    });
  });
})();
