// Title / landing screen: the garden is already alive behind it (APX-9 at
// work, followed by the camera); the viewer chooses how to enter.

export function showLanding({ onChoose, reducedMotion = false, touch = false }) {
  const el = document.createElement('div');
  el.id = 'landing';
  el.innerHTML = `
    <div class="inner">
      <h1>The Clockwork Garden</h1>
      <span class="rule"></span>
      <p class="sub">A forgotten Victorian glasshouse, a garden of brass and porcelain, and APX-9, the mechanical bee that tends it.</p>
      <div class="modes">
        <button data-mode="film"><b>Watch the film</b><span>58 seconds · the garden wakes</span></button>
        <button data-mode="fly"><b>Fly as APX-9</b><span>${touch ? 'joystick and touch' : 'mouse and keyboard, or a gamepad'}</span></button>
        <button data-mode="follow"><b>Follow APX-9</b><span>watch it go about its day</span></button>
      </div>
      <p class="note">Sound stays off until you turn it on.${reducedMotion ? ' Your system asks for reduced motion: cameras will move gently (change this in the menu).' : ''}</p>
    </div>`;
  document.body.appendChild(el);
  document.body.classList.add('landing');
  const first = el.querySelector('button[data-mode=film]');
  setTimeout(() => first.focus({ preventScroll: true }), 50);
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-mode]');
    if (!b) return;
    el.classList.add('out');
    document.body.classList.remove('landing');
    setTimeout(() => el.remove(), 700);
    onChoose(b.dataset.mode);
  });
  return el;
}
