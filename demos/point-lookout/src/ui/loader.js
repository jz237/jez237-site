// Loading screen: a single hairline that fills, then a small breathing ring. No text.
// Progress is the weighted sum of named tasks.

export function createLoader() {
  const root = document.getElementById('loader');
  const bar = root.querySelector('.loader-bar');
  const fill = root.querySelector('.loader-bar-fill');
  const enter = root.querySelector('.loader-enter');

  const tasks = new Map(); // name -> { weight, value }
  let shown = 0;

  function render() {
    let total = 0, done = 0;
    for (const t of tasks.values()) { total += t.weight; done += t.weight * t.value; }
    const p = total > 0 ? done / total : 0;
    shown = Math.max(shown, p);
    fill.style.transform = `scaleX(${shown.toFixed(4)})`;
    bar.setAttribute('aria-valuenow', String(Math.round(shown * 100)));
  }

  return {
    // declare a task with a relative weight before it starts
    add(name, weight = 1) { tasks.set(name, { weight, value: 0 }); render(); },
    set(name, value) {
      const t = tasks.get(name);
      if (t) t.value = Math.max(t.value, Math.min(1, value));
      render();
    },
    // resolves when the visitor clicks / taps anywhere or presses Enter/Space (starts the audio)
    ready() {
      fill.style.transform = 'scaleX(1)';
      bar.setAttribute('aria-valuenow', '100');
      root.classList.add('is-ready');
      enter.disabled = false;
      // 'click' (not pointerdown): it is the activation event that unlocks Web Audio on iOS and
      // the only one screen readers synthesise.
      return new Promise((resolve) => {
        let done = false;
        const go = (e) => {
          if (done) return;
          if (e.type === 'keydown' && !['Enter', ' ', 'Spacebar'].includes(e.key)) return;
          done = true;
          root.removeEventListener('click', go);
          window.removeEventListener('keydown', go);
          root.classList.add('is-leaving');
          resolve();
        };
        root.addEventListener('click', go);
        window.addEventListener('keydown', go);
      });
    },
    hide() {
      root.classList.add('is-hidden');
      setTimeout(() => root.remove(), 2200);
    },
    error(message) {
      root.classList.add('is-error');
      root.querySelectorAll('.loader-error').forEach((n) => n.remove());
      const p = document.createElement('p');
      p.className = 'loader-error';
      p.textContent = message;
      root.appendChild(p);
    },
  };
}
