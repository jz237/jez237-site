(() => {
  const thumbnails = ".index-thumb-grid > div > a, .portfolio-gallery-thumb, .portfolio-lightbox-thumb";
  let active = null;
  let pending = 0;
  let x = 0;
  let y = 0;

  function clear() {
    cancelAnimationFrame(pending);
    pending = 0;
    if (active) active.classList.remove("pointer-lit");
    active = null;
  }

  function paint() {
    pending = 0;
    const box = active.getBoundingClientRect();
    if (!box.width || !box.height) return;
    active.style.setProperty("--glow-x", ((x - box.left) / box.width * 100).toFixed(1) + "%");
    active.style.setProperty("--glow-y", ((y - box.top) / box.height * 100).toFixed(1) + "%");
    active.classList.add("pointer-lit");
  }

  function track(event) {
    if (!event.isPrimary) return;
    const tile = event.target.closest(thumbnails);
    if (tile !== active) {
      clear();
      active = tile;
    }
    if (!active) return;
    x = event.clientX;
    y = event.clientY;
    if (!pending) pending = requestAnimationFrame(paint);
  }

  // Gallery and lightbox buttons are built after load. They share the homepage handler.
  document.addEventListener("pointerover", event => { if (event.pointerType !== "touch") track(event); });
  document.addEventListener("pointermove", track, {passive:true});
  document.addEventListener("pointerdown", track, {passive:true});
  document.addEventListener("pointerout", event => {
    if (active && !active.contains(event.relatedTarget)) clear();
  });
  document.addEventListener("pointerup", event => { if (event.pointerType !== "mouse") clear(); });
  document.addEventListener("pointercancel", clear);
  document.addEventListener("visibilitychange", clear);
  window.addEventListener("blur", clear);
})();
