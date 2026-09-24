// Automatic quality scaler. Watches a smoothed frame time and steps the
// detail level down BEFORE the game can dip under 30fps; steps back up
// cautiously when there is headroom.

export const LEVELS = [
  { // 0 — potato
    name: 'Low', contactCap: 16,
    nearTrees: 8, nearRadius: 16, groundDetail: 0.35,
    pixelRatio: 1.0,
    shadowSize: 1024,
    bloom: false,
    grade: false,
    treeFrac: 0.4,
    grassFrac: 0,
    fogFar: 260,
    particleScale: 0.45,
  },
  { // 1
    name: 'Medium', contactCap: 32,
    nearTrees: 16, nearRadius: 22, groundDetail: 0.7,
    pixelRatio: 1.25,
    shadowSize: 1024,
    bloom: false,
    grade: true,
    treeFrac: 0.65,
    grassFrac: 0.5,
    fogFar: 330,
    particleScale: 0.7,
  },
  { // 2
    name: 'High', contactCap: 64,
    nearTrees: 28, nearRadius: 28, groundDetail: 1,
    pixelRatio: 1.5,
    shadowSize: 2048,
    bloom: true,
    grade: true,
    treeFrac: 0.85,
    grassFrac: 0.8,
    fogFar: 400,
    particleScale: 1,
  },
  { // 3 — full
    name: 'Ultra', contactCap: 80,
    nearTrees: 40, nearRadius: 34, groundDetail: 1,
    pixelRatio: 2.0,
    shadowSize: 2048,
    bloom: true,
    grade: true,
    treeFrac: 1,
    grassFrac: 1,
    fogFar: 520,
    particleScale: 1,
  },
];

export class QualityScaler {
  constructor(startLevel, applyFn) {
    this.level = startLevel;
    this.apply = applyFn;
    this.locked = false;
    this.emaDt = 1 / 60;
    this.slowTime = 0;
    this.fastTime = 0;
    this.cooldown = 0;
    // Shader compiles and texture uploads stall the first frames after load,
    // deploy and every level change. Don't read those hitches as a slow GPU.
    this.grace = 6;
    this.apply(LEVELS[this.level], this.level);
  }

  // ignore frame times for a while (e.g. right after DEPLOY builds the map)
  hold(seconds) { this.grace = Math.max(this.grace, seconds); this.slowTime = 0; }

  // pin to a fixed level ('auto' releases back to adaptive scaling)
  setLock(level) {
    if (level === 'auto' || level === null || level === undefined) {
      this.locked = false;
      return;
    }
    this.locked = true;
    if (this.level !== level) {
      this.level = level;
      this.apply(LEVELS[this.level], this.level);
      this.hold(3);
    }
  }

  frame(dt) {
    if (dt > 0.5) return; // tab was hidden; ignore
    if (this.grace > 0) {
      this.grace -= dt;
      // track, but reset toward steady state so one spike can't linger
      this.emaDt = this.emaDt * 0.8 + Math.min(dt, 1 / 30) * 0.2;
      return;
    }
    this.emaDt = this.emaDt * 0.94 + dt * 0.06;
    if (this.locked) return;
    this.cooldown -= dt;
    const fps = 1 / this.emaDt;

    if (fps < 44) this.slowTime += dt; else this.slowTime = 0;
    if (fps > 57) this.fastTime += dt; else this.fastTime = 0;

    if (this.slowTime > 2.5 && this.level > 0 && this.cooldown <= 0) {
      this.level--;
      this.cooldown = 4;
      this.slowTime = 0;
      this.apply(LEVELS[this.level], this.level);
      this.grace = 2;
    } else if (this.fastTime > 10 && this.level < LEVELS.length - 1 && this.cooldown <= 0) {
      this.level++;
      this.cooldown = 8;
      this.fastTime = 0;
      this.apply(LEVELS[this.level], this.level);
      this.grace = 2;
    }
  }
}
