(() => {
  const badges = Array.from(document.querySelectorAll(".anniversary-media"));
  const visible = new Set();
  const observer = window.IntersectionObserver && new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    update();
  });

  function useFrames(badge) {
    if (!badge.isConnected) return;
    const frames = document.createElement("span");
    frames.className = "anniversary-media anniversary-frames";
    frames.setAttribute("role", "img");
    frames.setAttribute("aria-label", badge.getAttribute("aria-label"));
    if (observer) observer.unobserve(badge);
    visible.delete(badge);
    badge.replaceWith(frames);
    badge.pause();
  }

  function update() {
    for (const badge of badges) {
      if (!badge.isConnected) continue;
      if (document.hidden || (observer ? !visible.has(badge) : !badge.getClientRects().length)) {
        badge.pause();
      } else {
        if (!badge.canPlayType("video/mp4")) {
          useFrames(badge);
          continue;
        }
        if (!badge.hasAttribute("src")) {
          badge.src = badge.dataset.video;
        }
        badge.play().catch(error => {
          // Scrolling away can interrupt a pending play. Other failures use the rendered frames.
          if (error.name !== "AbortError") useFrames(badge);
        });
      }
    }
  }

  for (const badge of badges) {
    badge.addEventListener("error", () => useFrames(badge), {once: true});
    if (observer) observer.observe(badge);
  }
  if (!observer) update();
  function scrollToAnniversary() {
    if (location.hash !== "#anniversary") return;
    const badge = Array.from(document.querySelectorAll(".anniversary-media")).find(element => element.getClientRects().length);
    if (badge) badge.scrollIntoView({block: "center", inline: "nearest"});
  }
  window.addEventListener("hashchange", scrollToAnniversary);
  scrollToAnniversary();
  document.addEventListener("visibilitychange", update);
})();
