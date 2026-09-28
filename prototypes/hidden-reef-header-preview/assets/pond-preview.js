// Lightweight recorded preview. The interactive pond opens only when requested.
(() => {
  const gardenUrl = 'https://jez237.com/demos/hidden-reef-koi/';
  window.THR_POND_PREVIEW = {
    render(section, assetBase) {
      section.classList.add('pond-garden-hero');
      section.setAttribute('aria-label', 'Pond and water garden');
      section.innerHTML = `
        <div class="pond-preview-media">
          <a class="pond-preview-image" href="${gardenUrl}" aria-label="Explore the koi garden in 3D">
            <img src="${assetBase}/site/koi-garden-preview-v1.jpg" width="1280" height="720" fetchpriority="high" alt="Our 3D koi garden, with colorful fish, rippling water, a wooden bridge and flowering trees">
            <video class="pond-preview-video" data-src="${assetBase}/site/koi-garden-preview-v1.mp4" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
            <span class="pond-preview-label">STILLWATER <span aria-hidden="true">/</span> INTERACTIVE 3D</span>
          </a>
          <button class="pond-preview-toggle" type="button" aria-pressed="false" hidden>Play preview</button>
        </div>
        <div class="pond-preview-copy">
          <span class="pond-preview-kicker">THE LIVING POND</span>
          <h1>Pond &amp; water garden.</h1>
          <p>Step into Stillwater. Meet the koi, wander the garden and discover the water chemistry that helps a pond thrive.</p>
          <ul class="pond-preview-topics" aria-label="Explore in the garden"><li>Meet the koi</li><li>Water lab</li><li>Seasonal care</li></ul>
          <a class="pond-preview-explore" href="${gardenUrl}" aria-label="Explore the koi garden">Explore the koi garden <span aria-hidden="true">↗</span></a>
          <a class="pond-preview-shop" href="#products">Shop pond supplies <span aria-hidden="true">↓</span></a>
        </div>
        <a class="pond-filter-feature" href="../learn/filtoclear/">
          <img src="${assetBase}/site/filtoclear-exploded-preview.png" width="510" height="410" alt="The FiltoClear 5200 separated into its housing, colorful foam rings and UV components" loading="lazy">
          <span class="pond-filter-copy"><span class="pond-filter-kicker">NEW · THE EQUIPMENT COLLECTION</span><strong>What happens inside a pond filter?</strong><span>Take apart the OASE FiltoClear 5200 in 3D. Follow the water, inspect 32 assemblies and watch the cleaning cycle.</span></span>
          <span class="pond-filter-action">Explore the filter <span aria-hidden="true">↗</span></span>
        </a>`;

      const video = section.querySelector('video');
      const toggle = section.querySelector('.pond-preview-toggle');
      if (!('IntersectionObserver' in window)) return;
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      const connection = navigator.connection;
      let enabled = !motion.matches && !connection?.saveData, visible = false, failed = false;
      const wanted = () => enabled && visible && !document.hidden && !failed;
      function update() {
        toggle.hidden = failed;
        toggle.textContent = enabled ? 'Pause preview' : 'Play preview';
        toggle.setAttribute('aria-label', enabled ? 'Pause garden preview' : 'Play garden preview');
        toggle.setAttribute('aria-pressed', String(enabled));
        if (!wanted()) { video.pause(); return; }
        if (!video.hasAttribute('src')) video.src = video.dataset.src;
        video.muted = true;
        if (video.paused) video.play().catch(() => {
          // Browser autoplay policy can require a click. The poster stays usable.
          if (wanted()) { enabled = false; update(); }
        });
      }
      video.addEventListener('playing', () => {
        if (wanted()) video.classList.add('is-playing');
        else video.pause();
      });
      video.addEventListener('error', () => {
        failed = true; video.classList.remove('is-playing'); update();
      });
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .15;
        update();
      }, {threshold:[0,.15]}).observe(video);
      toggle.addEventListener('click', () => { enabled = !enabled; update(); });
      document.addEventListener('visibilitychange', update);
      const preferencesChanged = () => {
        enabled = !motion.matches && !connection?.saveData;
        if (!enabled) video.classList.remove('is-playing');
        update();
      };
      motion.addEventListener('change', preferencesChanged);
      connection?.addEventListener('change', preferencesChanged);
      update();
    }
  };
})();
