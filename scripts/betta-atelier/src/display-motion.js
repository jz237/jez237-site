// Display is a brief muscular action, independent of swimming effort.
// Rates/angles are artistic tuning, not measured betta physiology.
export class DisplayMotion {
  constructor() { this.flare = 0; this.requested = false; }
  advance(dt) {
    if (dt <= 0) return;
    const target = this.requested ? 1 : 0;
    this.flare += (target - this.flare) * (1 - Math.exp(-(this.requested ? 26 : 12) * dt));
  }
}

// Saccades followed by quiet fixation, with slightly different timing per eye.
// Angles are about a fixed socket pivot, not pupil translations on the face.
export class EyeMotion {
  constructor(side) { this.side = side; this.time = 0; this.yaw = 0; this.pitch = 0; }
  advance(dt, turn = 0, display = 0) {
    if (dt <= 0) return;
    this.time += dt;
    const t = this.time + (this.side < 0 ? 0.63 : 0);
    const cycle = Math.floor(t / 2.35), local = t % 2.35;
    const pose = n => [Math.sin(n * 2.399 + this.side * 0.35) * 0.24, Math.sin(n * 1.73 + 0.6) * 0.13];
    const a = pose(cycle), b = pose(cycle + 1);
    const u = Math.max(0, Math.min(1, (local - 2.18) / 0.17)), s = u * u * (3 - 2 * u);
    const yaw = (a[0] + (b[0] - a[0]) * s) * (1 - display * 0.65) - display * 0.13 - Math.max(-0.04, Math.min(0.04, turn * 0.04));
    const pitch = (a[1] + (b[1] - a[1]) * s) * (1 - display * 0.65);
    const ease = 1 - Math.exp(-35 * dt);
    this.yaw += (yaw - this.yaw) * ease;
    this.pitch += (pitch - this.pitch) * ease;
  }
}
