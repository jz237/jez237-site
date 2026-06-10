// Automatic quality scaler. Watches a smoothed frame time and steps the
// detail level down BEFORE the game can dip under 30fps; steps back up
// cautiously when there is headroom.

export const LEVELS = [
  { // 0 — potato
    name: 'Low',
    pixelRatio: 1.0,
    shadowSize: 1024,
    bloom: false,
    treeFrac: 0.4,
    grassFrac: 0,
    fogFar: 260,
    particleScale: 0.45,
  },
  { // 1
    name: 'Medium',
    pixelRatio: 1.25,
    shadowSize: 1024,
    bloom: false,
    treeFrac: 0.65,
    grassFrac: 0.5,
    fogFar: 330,
    particleScale: 0.7,
  },
  { // 2
    name: 'High',
    pixelRatio: 1.5,
    shadowSize: 2048,
    bloom: true,
    treeFrac: 0.85,
    grassFrac: 0.8,
    fogFar: 400,
    particleScale: 1,
  },
  { // 3 — full
    name: 'Ultra',
    pixelRatio: 2.0,
    shadowSize: 2048,
    bloom: true,
    treeFrac: 1,
    grassFrac: 1,
    fogFar: 460,
    particleScale: 1,
  },
];

export class QualityScaler {
  constructor(startLevel, applyFn) {
    this.level = startLevel;
    this.apply = applyFn;
    this.emaDt = 1 / 60;
    this.slowTime = 0;
    this.fastTime = 0;
    this.cooldown = 0;
    this.apply(LEVELS[this.level], this.level);
  }

  frame(dt) {
    if (dt > 0.5) return; // tab was hidden; ignore
    this.emaDt = this.emaDt * 0.94 + dt * 0.06;
    this.cooldown -= dt;
    const fps = 1 / this.emaDt;

    if (fps < 44) this.slowTime += dt; else this.slowTime = 0;
    if (fps > 57) this.fastTime += dt; else this.fastTime = 0;

    if (this.slowTime > 1.4 && this.level > 0 && this.cooldown <= 0) {
      this.level--;
      this.cooldown = 4;
      this.slowTime = 0;
      this.apply(LEVELS[this.level], this.level);
    } else if (this.fastTime > 14 && this.level < LEVELS.length - 1 && this.cooldown <= 0) {
      this.level++;
      this.cooldown = 8;
      this.fastTime = 0;
      this.apply(LEVELS[this.level], this.level);
    }
  }
}
