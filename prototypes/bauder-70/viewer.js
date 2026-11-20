"use strict";

const video = document.querySelector("#turntable");
const object = document.querySelector(".object");
const playButton = document.querySelector("#play");
const angleInput = document.querySelector("#angle");
const readout = document.querySelector("#angle-readout");
const views = [...document.querySelectorAll("[data-angle]")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const fullTurn = Math.PI * 2;
const phaseOffset = .42;
let pendingAngle = null;
let shownAngle = null;
let drag = null;
let frameRequest = 0;
let failed = false;

// Match the Blender turntable's slower motion over each inscription.
function visibleAngle(time) {
  if (!Number.isFinite(video.duration)) return 349;
  const phase = fullTurn * time / video.duration - phaseOffset;
  const yaw = phase - .30 * Math.sin(2 * phase);
  return ((yaw * 180 / Math.PI) % 360 + 360) % 360;
}

function timeAtAngle(degrees) {
  const target = (degrees % 360) * Math.PI / 180;
  let low = 0;
  let high = fullTurn;
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2;
    if (mid - .30 * Math.sin(2 * mid) < target) low = mid;
    else high = mid;
  }
  const progress = (((low + high) / 2 + phaseOffset) / fullTurn) % 1;
  return progress * video.duration;
}

function displayAngle(angle) {
  const rounded = Math.round(angle);
  if (shownAngle === rounded) return;
  shownAngle = rounded;
  angleInput.value = rounded;
  angleInput.style.setProperty("--value", (rounded / 3.6) + "%");
  angleInput.setAttribute("aria-valuetext", rounded + " degrees");
  readout.textContent = rounded + "°";
  object.style.setProperty("--shadow-scale", (.30 + .70 * Math.abs(Math.cos(angle * Math.PI / 180))).toFixed(3));
  for (const view of views) {
    const difference = Math.abs(rounded - Number(view.dataset.angle));
    view.setAttribute("aria-pressed", String(Math.min(difference, 360 - difference) <= 1));
  }
}

function seekAngle(requested) {
  if (failed) return;
  video.pause();
  pendingAngle = requested;
  displayAngle(requested);
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA && Number.isFinite(video.duration)) {
    video.currentTime = timeAtAngle(requested);
  }
}

function frame() {
  if (video.paused || failed) return;
  displayAngle(visibleAngle(video.currentTime));
  frameRequest = requestAnimationFrame(frame);
}

function reflectPlayback() {
  const playing = !video.paused && !video.ended;
  const label = playing ? "Pause rotation" : "Play rotation";
  playButton.setAttribute("aria-label", label);
  playButton.title = label;
  playButton.classList.toggle("is-playing", playing);
  cancelAnimationFrame(frameRequest);
  if (playing) {
    pendingAngle = null;
    frame();
  }
}

function startRotation() {
  if (failed) return;
  // A browser may require a tap before it permits muted autoplay.
  video.play().catch(reflectPlayback);
}

function unavailable() {
  failed = true;
  video.pause();
  video.hidden = true;
  document.querySelector(".fallback").hidden = false;
  document.querySelector(".controls").hidden = true;
  document.querySelector(".status").hidden = false;
  object.style.cursor = "default";
}

playButton.addEventListener("click", () => {
  if (video.paused) startRotation();
  else video.pause();
});
angleInput.addEventListener("input", () => seekAngle(Number(angleInput.value)));
for (const view of views) {
  view.addEventListener("click", () => seekAngle(Number(view.dataset.angle)));
}
video.addEventListener("loadedmetadata", () => {
  if (pendingAngle !== null) seekAngle(pendingAngle);
  else displayAngle(visibleAngle(video.currentTime));
});
video.addEventListener("play", reflectPlayback);
video.addEventListener("pause", reflectPlayback);
video.addEventListener("error", unavailable);
video.querySelector("source").addEventListener("error", unavailable);
video.addEventListener("seeked", () => {
  if (pendingAngle === null) displayAngle(visibleAngle(video.currentTime));
});
reducedMotion.addEventListener("change", event => {
  if (event.matches) video.pause();
});

object.addEventListener("pointerdown", event => {
  if (failed || !event.isPrimary || event.button !== 0) return;
  drag = { id: event.pointerId, x: event.clientX, angle: shownAngle, active: false };
  object.setPointerCapture(event.pointerId);
});
object.addEventListener("pointermove", event => {
  if (!drag || event.pointerId !== drag.id) return;
  const distance = event.clientX - drag.x;
  if (!drag.active && Math.abs(distance) < 4) return;
  drag.active = true;
  object.classList.add("dragging");
  const angle = drag.angle + distance * 260 / object.clientWidth;
  seekAngle(((angle % 360) + 360) % 360);
});
function finishDrag() {
  drag = null;
  object.classList.remove("dragging");
}
object.addEventListener("lostpointercapture", finishDrag);
object.addEventListener("pointercancel", finishDrag);
object.addEventListener("pointerup", finishDrag);

displayAngle(349);
if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) unavailable();
else if (!reducedMotion.matches) startRotation();
