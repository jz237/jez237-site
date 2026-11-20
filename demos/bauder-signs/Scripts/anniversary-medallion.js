(() => {
  const badges = Array.from(document.querySelectorAll(".anniversary-media"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const visible = new Set();

  function showPoster(badge) {
    if (!badge.hasAttribute("src")) return;
    badge.pause();
    badge.removeAttribute("src");
    badge.load();
  }

  function update() {
    for (const badge of badges) {
      if (reducedMotion.matches || badge.dataset.failed) {
        showPoster(badge);
      } else if (document.hidden || !visible.has(badge)) {
        badge.pause();
      } else {
        if (!badge.hasAttribute("src")) {
          if (!badge.canPlayType("video/mp4")) continue;
          badge.src = badge.dataset.video;
        }
        badge.play().catch(() => {});
      }
    }
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    update();
  });
  for (const badge of badges) {
    badge.addEventListener("error", () => {
      if (!badge.hasAttribute("src")) return;
      badge.dataset.failed = "true";
      showPoster(badge);
    });
    observer.observe(badge);
  }
  function scrollToAnniversary() {
    if (location.hash !== "#anniversary") return;
    const badge = badges.find(element => element.getClientRects().length);
    if (badge) badge.scrollIntoView({block: "center", inline: "nearest"});
  }
  window.addEventListener("hashchange", scrollToAnniversary);
  scrollToAnniversary();
  document.addEventListener("visibilitychange", update);
  reducedMotion.addEventListener("change", update);
})();
