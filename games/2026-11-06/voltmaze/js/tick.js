// Berserk 2026: a steady tick for an online tab in the background. requestAnimationFrame stops in a hidden tab
// and the page's own timers are throttled (once a second, later once a minute), but a dedicated worker's timers
// are not, so main.js runs the co-op sim on these ticks while the tab is hidden. Post a period in ms to start,
// 0 to stop.
let id = 0;
onmessage = (e) => {
  clearInterval(id); id = 0;
  const ms = +e.data;
  if (ms > 0) id = setInterval(() => postMessage(0), ms);
};
