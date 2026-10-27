import { draw } from './swim-gait.js';
// Display is a brief muscular action, independent of swimming effort.
// Rates/angles are artistic tuning, not measured betta physiology.
export class DisplayMotion {
  constructor() {
    this.flare = 0; this.requested = false;
    this.target = false; this.from = 0; this.elapsed = 1;
    // How closely the fins are held folded in (0..1), as an unwell fish clamps them: set by a host
    // (the Globes betta bowl's water), eased there; 0 here.
    this.clamp = 0;
  }
  advance(dt) {
    if (dt <= 0) return;
    if (this.requested !== this.target) {
      this.target = this.requested;
      this.from = this.flare;
      this.elapsed = 0;
    }
    // One full second from the current pose to display, including a smooth
    // start/finish. Reversing mid-transition continues from the visible pose.
    this.elapsed = Math.min(1, this.elapsed + dt / (this.target ? 1 : 0.35));
    const u = this.elapsed, ease = u * u * (3 - 2 * u);
    this.flare = this.from + ((this.target ? 1 : 0) - this.from) * ease;
  }
}

// Shared saccades followed by quiet fixation: both eyes look together.
// Angles are about a fixed socket pivot, not pupil translations on the face.
// Fixations last from a fraction of a second to several seconds, most of them short, and each
// glance is to a new place: small corrections as often as wide looks, never on a clock.
export class EyeMotion {
  constructor() {
    this.time = 0; this.yaw = 0; this.pitch = 0;
    this.seed = 0x3e7e5;
    // Where the gaze rests and where it goes next, when the next glance starts, how long it takes.
    this.from = [0.06, 0.02]; this.to = [0.06, 0.02];
    this.glance = 1.4; this.glanceLength = 0.17;
  }
  advance(dt, turn = 0, display = 0) {
    if (dt <= 0) return;
    this.time += dt;
    const t = this.time;
    if (t >= this.glance + this.glanceLength) {
      const r = () => draw(this), wide = r() < 0.55;
      this.from = this.to;
      // (A wide look goes anywhere in the socket's range; a correction moves a little from here.)
      const yaw = wide ? (r() * 2 - 1) * 0.24 : this.from[0] + (r() * 2 - 1) * 0.08;
      const pitch = wide ? (r() * 2 - 1) * 0.13 : this.from[1] + (r() * 2 - 1) * 0.05;
      this.to = [Math.max(-0.24, Math.min(0.24, yaw)), Math.max(-0.13, Math.min(0.13, pitch))];
      const hold = r();
      this.glance = t + 0.35 + 3.6 * hold * hold;
      this.glanceLength = wide ? 0.15 + 0.06 * r() : 0.1 + 0.04 * r();
    }
    const u = Math.max(0, Math.min(1, (t - this.glance) / this.glanceLength)), s = u * u * (3 - 2 * u);
    const a = this.from, b = this.to;
    const yaw = (a[0] + (b[0] - a[0]) * s) * (1 - display * 0.65) - display * 0.13 - Math.max(-0.04, Math.min(0.04, turn * 0.04));
    const pitch = (a[1] + (b[1] - a[1]) * s) * (1 - display * 0.65);
    const ease = 1 - Math.exp(-35 * dt);
    this.yaw += (yaw - this.yaw) * ease;
    this.pitch += (pitch - this.pitch) * ease;
  }
}
