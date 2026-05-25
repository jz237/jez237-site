(() => {
  const actionFrames = document.querySelectorAll(".hero-actions");

  actionFrames.forEach((frame) => {
    if (!frame.querySelector(".btn")) return;

    frame.dataset.collapsible = "true";
    frame.tabIndex = 0;
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-expanded", "true");
    frame.setAttribute("aria-label", "Toggle guide buttons");

    const toggleFrame = () => {
      const isCollapsed = frame.classList.toggle("is-collapsed");
      frame.setAttribute("aria-expanded", String(!isCollapsed));
    };

    frame.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      toggleFrame();
    });

    frame.addEventListener("keydown", (event) => {
      if (event.target !== frame) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleFrame();
    });
  });
})();
