const bound = (n) => Math.max(-1, Math.min(1, n));
export class Inputs {
  constructor(canvas, shortcut) {
    this.keys = new Set();
    this.touch = [
      { x: 0, y: 0, turbo: false },
      { x: 0, y: 0, turbo: false },
    ];
    this.mouse = { x: 0, y: 0, turbo: false };
    this.sensitivity = 1;
    this.trackball = false;
    window.addEventListener("keydown", (e) => {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          "Enter",
        ].includes(e.code)
      )
        e.preventDefault();
      if (!e.repeat) shortcut(e.code);
      this.keys.add(e.code);
    });
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
    window.addEventListener("blur", () => this.reset());
    canvas.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "touch" && this.trackball) {
        canvas.requestPointerLock?.();
        this.mouse.turbo = e.button === 0;
      }
    });
    window.addEventListener("pointerup", () => (this.mouse.turbo = false));
    document.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement === canvas) {
        this.mouse.x += e.movementX * 0.13 * this.sensitivity;
        this.mouse.y += e.movementY * 0.13 * this.sensitivity;
      }
    });
    document.querySelectorAll(".steer").forEach((el, i) => {
      let id = null,
        start = null;
      el.addEventListener("pointerdown", (e) => {
        id = e.pointerId;
        const r = el.getBoundingClientRect();
        start = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        el.setPointerCapture(id);
        move(e);
      });
      const move = (e) => {
        if (e.pointerId !== id) return;
        this.touch[i].x = bound((e.clientX - start.x) / 45);
        this.touch[i].y = bound((e.clientY - start.y) / 45);
        el.style.setProperty("--dx", this.touch[i].x * 30 + "px");
        el.style.setProperty("--dy", this.touch[i].y * 30 + "px");
      };
      el.addEventListener("pointermove", move);
      for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
        el.addEventListener(event, () => {
          id = null;
          this.touch[i].x = this.touch[i].y = 0;
          el.style.setProperty("--dx", "0px");
          el.style.setProperty("--dy", "0px");
        });
    });
    document.querySelectorAll(".turbo").forEach((el, i) => {
      el.addEventListener("pointerdown", (e) => {
        el.setPointerCapture(e.pointerId);
        this.touch[i].turbo = true;
      });
      for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
        el.addEventListener(event, () => (this.touch[i].turbo = false));
    });
  }
  reset() {
    this.keys.clear();
    this.mouse = { x: 0, y: 0, turbo: false };
    this.touch.forEach((t) => {
      t.x = t.y = 0;
      t.turbo = false;
    });
  }
  read(players) {
    const pads = Array.from(navigator.getGamepads?.() ?? []).filter(Boolean),
      k = (c) => (this.keys.has(c) ? 1 : 0);
    return Array.from({ length: players }, (_, i) => {
      let x =
          i === 0 ? k("KeyD") - k("KeyA") : k("ArrowRight") - k("ArrowLeft"),
        y = i === 0 ? k("KeyS") - k("KeyW") : k("ArrowDown") - k("ArrowUp");
      if (players === 1) {
        x += k("ArrowRight") - k("ArrowLeft");
        y += k("ArrowDown") - k("ArrowUp");
      }
      x += this.touch[i].x;
      y += this.touch[i].y;
      let turbo =
        !!(i === 0 ? k("ShiftLeft") || k("Space") : k("Enter")) ||
        this.touch[i].turbo;
      const pad = pads[i];
      if (pad) {
        x += Math.abs(pad.axes[0]) > 0.12 ? pad.axes[0] * this.sensitivity : 0;
        y += Math.abs(pad.axes[1]) > 0.12 ? pad.axes[1] * this.sensitivity : 0;
        turbo ||= pad.buttons[0]?.pressed || pad.buttons[7]?.pressed;
      }
      if (i === 0 && this.trackball) {
        x += this.mouse.x;
        y += this.mouse.y;
        turbo ||= this.mouse.turbo;
        this.mouse.x *= 0.9;
        this.mouse.y *= 0.9;
      }
      x = bound(x);
      y = bound(y);
      return { x: (x + y) / Math.SQRT2, z: (y - x) / Math.SQRT2, turbo };
    });
  }
}
