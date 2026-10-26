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
export class EyeMotion {
  constructor() { this.time = 0; this.yaw = 0; this.pitch = 0; }
  advance(dt, turn = 0, display = 0) {
    if (dt <= 0) return;
    this.time += dt;
    const t = this.time;
    const cycle = Math.floor(t / 2.35), local = t % 2.35;
    const pose = n => [Math.sin(n * 2.399 + 0.35) * 0.24, Math.sin(n * 1.73 + 0.6) * 0.13];
    const a = pose(cycle), b = pose(cycle + 1);
    const u = Math.max(0, Math.min(1, (local - 2.18) / 0.17)), s = u * u * (3 - 2 * u);
    const yaw = (a[0] + (b[0] - a[0]) * s) * (1 - display * 0.65) - display * 0.13 - Math.max(-0.04, Math.min(0.04, turn * 0.04));
    const pitch = (a[1] + (b[1] - a[1]) * s) * (1 - display * 0.65);
    const ease = 1 - Math.exp(-35 * dt);
    this.yaw += (yaw - this.yaw) * ease;
    this.pitch += (pitch - this.pitch) * ease;
  }
}
