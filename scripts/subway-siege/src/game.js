import * as T from "three";
import { SECTORS, droneModel, bossModel } from "./world.js";
export const SHIPS = [
  {
    id: "vanguard",
    name: "VANGUARD",
    desc: "Balanced / 3 hull",
    lives: 3,
    shield: 50,
    charge: 30,
    speed: 12,
    rate: 1,
    color: 0x8eddd4,
  },
  {
    id: "striker",
    name: "STRIKER",
    desc: "Rapid fire / 2 hull",
    lives: 2,
    shield: 25,
    charge: 15,
    speed: 14,
    rate: 0.75,
    color: 0xf1a45f,
  },
  {
    id: "bastion",
    name: "BASTION",
    desc: "Armoured / 4 hull",
    lives: 4,
    shield: 75,
    charge: 60,
    speed: 9.7,
    rate: 1.15,
    color: 0x9bbba3,
  },
];
export const WEAPONS = {
  laser: {
    name: "TWIN LASER",
    color: 0x96f8e3,
    rate: 0.16,
    damage: 1,
    speed: 34,
    r: 0.11,
  },
  lance: {
    name: "RAIL LANCE",
    color: 0xfff2b5,
    rate: 0.28,
    damage: 4,
    speed: 61,
    r: 0.16,
    pierce: 3,
  },
  plasma: {
    name: "PLASMA",
    color: 0x7bffe1,
    rate: 0.1,
    damage: 1.1,
    speed: 29,
    r: 0.18,
  },
  tri: {
    name: "TRI-BURST",
    color: 0xa2d9ff,
    rate: 0.21,
    damage: 1.5,
    speed: 34,
    r: 0.13,
  },
  heavy: {
    name: "HEAVY BLASTER",
    color: 0xffbd64,
    rate: 0.36,
    damage: 6,
    speed: 24,
    r: 0.28,
    splash: 1.7,
  },
  overheat: {
    name: "OVERHEAT",
    color: 0xff819e,
    rate: 0.065,
    damage: 1.5,
    speed: 36,
    r: 0.13,
  },
  nova: {
    name: "NOVA FAN",
    color: 0xbfe88d,
    rate: 0.28,
    damage: 1.6,
    speed: 31,
    r: 0.14,
  },
  saw: {
    name: "SAW RIPPER",
    color: 0xdbb6ff,
    rate: 0.3,
    damage: 2,
    speed: 25,
    r: 0.24,
    pierce: 4,
  },
};
const WEAPON_LIST = Object.keys(WEAPONS).filter((k) => k !== "laser");
const ENEMIES = {
  scout: { hp: 3, speed: 4.5, r: 0.53, value: 100, color: 0xea9b67, fire: 3.5 },
  swarm: { hp: 1.3, speed: 7, r: 0.35, value: 75, color: 0xffce78, fire: 99 },
  weaver: { hp: 5, speed: 3.5, r: 0.7, value: 180, color: 0x88d6bf, fire: 2.4 },
  hunter: { hp: 5, speed: 5, r: 0.55, value: 220, color: 0xcd9bdd, fire: 2.1 },
  sentry: {
    hp: 8,
    speed: 2.6,
    r: 0.66,
    value: 260,
    color: 0xf0b367,
    fire: 2.7,
  },
  brute: {
    hp: 16,
    speed: 2.7,
    r: 0.85,
    value: 350,
    color: 0xd77b70,
    fire: 2.8,
  },
  splitter: {
    hp: 7,
    speed: 3.9,
    r: 0.72,
    value: 240,
    color: 0xb2b1f2,
    fire: 3.1,
  },
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const random = (a, b) => a + Math.random() * (b - a);
// Continuous collision, not endpoint-only: fast rail shots cannot tunnel through a target.
export function segmentDistance2(px, pz, ax, az, bx, bz) {
  const dx = bx - ax,
    dz = bz - az,
    den = dx * dx + dz * dz;
  const t = den ? clamp(((px - ax) * dx + (pz - az) * dz) / den, 0, 1) : 0;
  return (px - ax - t * dx) ** 2 + (pz - az - t * dz) ** 2;
}
export function segmentBoxEntry(ax, az, bx, bz, minX, maxX, minZ, maxZ) {
  let lo = 0,
    hi = 1;
  for (const [a, b, min, max] of [
    [ax, bx, minX, maxX],
    [az, bz, minZ, maxZ],
  ]) {
    const d = b - a;
    if (Math.abs(d) < 1e-8) {
      if (a < min || a > max) return null;
      continue;
    }
    const t1 = (min - a) / d,
      t2 = (max - a) / d;
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
    if (lo > hi) return null;
  }
  return lo;
}
function circleEntry(ax, az, bx, bz, radius) {
  const c = ax * ax + az * az - radius * radius;
  if (c <= 0) return 0;
  const dx = bx - ax,
    dz = bz - az,
    a = dx * dx + dz * dz,
    b = 2 * (ax * dx + az * dz),
    disc = b * b - 4 * a * c;
  if (a < 1e-12 || disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}
export const UPGRADES = [
  {
    id: "rate",
    name: "ACCELERATOR",
    icon: "↟",
    desc: "14% faster firing. More metal downrange.",
    max: 5,
  },
  {
    id: "power",
    name: "HOT CORE",
    icon: "✷",
    desc: "20% more damage from every weapon.",
    max: 5,
  },
  {
    id: "pierce",
    name: "TUNGSTEN",
    icon: "↥",
    desc: "Every shot punches through one more target.",
    max: 3,
  },
  {
    id: "magnet",
    name: "MAGNET ARRAY",
    icon: "◎",
    desc: "Pull supplies in from farther away.",
    max: 3,
  },
  {
    id: "charge",
    name: "CAPACITOR",
    icon: "ϟ",
    desc: "Pulse charges faster. Refill 40 energy now.",
    max: 4,
  },
  {
    id: "shield",
    name: "FIELD REPAIR",
    icon: "⊕",
    desc: "Restore 65 shield and one hull point.",
    max: 99,
  },
  {
    id: "wing",
    name: "WING DRONE",
    icon: "⋈",
    desc: "An escort cannon fires alongside you.",
    max: 2,
  },
];

export class Game {
  constructor(world, sound, settings, ui) {
    this.world = world;
    this.sound = sound;
    this.settings = settings;
    this.ui = ui;
    this.state = "menu";
    this.wave = 1;
    this.score = 0;
    this.ship = SHIPS[settings.ship || 0];
    this.player = {
      x: 0,
      z: 7,
      px: 0,
      pz: 7,
      charge: 30,
      shield: 50,
      invul: 0,
      weapon: "laser",
      weaponT: 0,
      fire: 0,
      lives: 3,
    };
    this.enemies = [];
    this.bullets = [];
    this.shots = [];
    this.pickups = [];
    this.trains = [];
    this.warnings = [];
    this.keys = {};
    this.pointer = { active: false };
    this.entityId = 0;
    this.time = 0;
    this.demo = false;
    this.menuT = 0;
    this.createPlayer();
    this.addInputs();
    this.world.onArc = (x, z) => this.sound.arc(x, z);
    this.world.onBlast = (x, z, size) => this.sound.explode(size, x, z);
  }
  createPlayer() {
    if (this.playerMesh) this.world.remove(this.playerMesh);
    this.playerMesh = droneModel(this.ship.id);
    this.world.scene.add(this.playerMesh);
    if (this.shieldMesh) this.world.remove(this.shieldMesh, true);
    this.shieldMesh = this.world.makeShield();
    this.world.scene.add(this.shieldMesh);
    this.wings = [];
  }
  selectShip(index) {
    this.settings.ship = index;
    this.ship = SHIPS[index];
    this.createPlayer();
  }
  clear() {
    for (const a of [
      this.enemies,
      this.pickups,
      this.trains,
      this.warnings,
      this.wings,
    ])
      for (const e of a) this.world.remove(e.mesh);
    this.enemies = [];
    this.bullets = [];
    this.shots = [];
    this.pickups = [];
    this.trains = [];
    this.warnings = [];
    this.wings = [];
    this.world.rings.forEach((r) => this.world.remove(r.mesh, true));
    this.world.rings = [];
    this.world.particles = [];
    this.world.shards = [];
    this.keys = {};
    this.pointer = { active: false };
  }
  start(demo = false) {
    this.clear();
    this.demo = demo;
    this.state = "play";
    this.wave = 1;
    this.score = 0;
    this.time = 0;
    this.kills = 0;
    this.escapes = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.comboT = 0;
    this.overdrive = 0;
    this.overdriveReady = true;
    this.hits = 0;
    this.fired = 0;
    this.slow = 0;
    this.hitWave = false;
    this.upgrades = {
      rate: 0,
      power: 0,
      pierce: 0,
      magnet: 0,
      charge: 0,
      shield: 0,
      wing: 0,
    };
    this.player = {
      x: 0,
      z: 7,
      px: 0,
      pz: 7,
      charge: this.ship.charge,
      shield: this.ship.shield,
      invul: 1.5,
      weapon: "laser",
      weaponT: 0,
      fire: 0,
      lives: this.ship.lives,
    };
    this.lastDrop = 0;
    this.demoT = 0;
    this.waveClearT = 0;
    this.createPlayer();
    this.ui.start(demo);
    this.sound.unlock();
    this.beginWave();
    this.sound.play("pickup", 0.4);
    this.sound.setMusic("game");
  }
  menu() {
    this.clear();
    this.state = "menu";
    this.demo = false;
    this.wave = 1;
    this.world.setSector(0);
    this.sound.setSector(0);
    this.player.x = 3;
    this.player.z = 5;
    this.player.invul = 0;
    this.playerMesh.visible = true;
    this.shieldMesh.visible = false;
    this.ui.menu();
    this.sound.stopEffects();
    this.sound.setMusic("menu");
  }
  beginWave() {
    this.world.setSector(Math.floor((this.wave - 1) / 4) % SECTORS.length);
    this.sound.setSector(this.world.sector);
    this.isBoss = this.wave % 4 === 0;
    this.bossDead = false;
    this.waveTotal = this.isBoss
      ? 8 + Math.floor(this.wave / 4) * 2
      : Math.min(40, 10 + this.wave * 3);
    this.spawned = 0;
    this.resolved = 0;
    this.spawnT = 0.65;
    this.trainT = this.wave === 1 ? 100 : 3.5;
    this.waveTime = 0;
    this.waveClearT = 0;
    this.hitWave = false;
    this.player.invul = Math.max(this.player.invul, 1.2);
    this.shots = [];
    const sector = SECTORS[Math.floor((this.wave - 1) / 4) % SECTORS.length];
    this.ui.toast(
      this.isBoss
        ? "HEAVY CONTACT"
        : `SECTOR ${String((Math.floor((this.wave - 1) / 4) % 5) + 1).padStart(2, "0")}`,
      this.isBoss
        ? "SIGNAL WARDEN"
        : `WAVE ${String(this.wave).padStart(2, "0")}`,
      this.isBoss ? "Break its armour. Watch the firing lanes." : sector.name,
    );
    this.ui.radio(
      this.isBoss ? "CONTROL / PRIORITY" : "CONTROL / UPLINK",
      this.isBoss
        ? "A heavy rail signature is blocking your route. Destroy it to open the line."
        : sector.caption,
    );
    this.sound.setMusic(this.isBoss ? "boss" : "game");
    if (this.isBoss) this.spawnBoss();
  }
  nextWave() {
    this.wave++;
    this.player.charge = clamp(this.player.charge + 18, 0, 100);
    this.player.shield = clamp(this.player.shield + 8, 0, 100);
    this.enemies.forEach((e) => this.world.remove(e.mesh));
    this.enemies = [];
    this.beginWave();
  }
  spawnEnemy(type, x = random(-7, 7), z = -19, child = false) {
    const data = ENEMIES[type];
    if (!data) return;
    const e = {
      ...data,
      type,
      id: ++this.entityId,
      x,
      z,
      px: x,
      pz: z,
      hp: data.hp * (1 + Math.max(0, this.wave - 2) * 0.065),
      speed: data.speed * (1 + Math.min(0.8, this.wave * 0.026)),
      fire: random(1.4, data.fire),
      age: 0,
      phase: random(0, 6.28),
      home: x,
      warning: 0,
      dead: false,
      child,
    };
    e.max = e.hp;
    e.mesh = droneModel(type, true);
    e.mesh.position.set(x, 0, z);
    if (type === "swarm") e.mesh.scale.multiplyScalar(0.67);
    this.enemies.push(e);
    this.world.scene.add(e.mesh);
    return e;
  }
  chooseEnemy() {
    const pool = ["scout", "scout", "swarm"];
    if (this.wave >= 2) pool.push("weaver", "splitter");
    if (this.wave >= 3) pool.push("hunter", "brute");
    if (this.wave >= 4) pool.push("sentry");
    if (this.wave % 6 === 2) pool.push("weaver", "weaver");
    if (this.wave % 6 === 3) pool.push("hunter", "hunter");
    if (this.wave % 6 === 5) pool.push("splitter", "brute");
    return pool[Math.floor(Math.random() * pool.length)];
  }
  spawnFormation() {
    const slots = Math.min(
        this.waveTotal - this.spawned,
        Math.random() < 0.3 ? 3 : 1,
      ),
      type = this.chooseEnemy(),
      centre = random(-5.8, 5.8);
    for (let j = 0; j < slots; j++) {
      this.spawnEnemy(
        type,
        clamp(centre + (j - (slots - 1) / 2) * 1.6, -7.8, 7.8),
        -19 - Math.abs(j - (slots - 1) / 2) * 0.8,
      );
      this.spawned++;
    }
  }
  spawnBoss() {
    const kind = Math.floor(this.wave / 4 - 1) % 3,
      names = ["SIGNAL WARDEN", "SWITCHYARD HYDRA", "THE IRON CONDUCTOR"];
    const hp = 185 + this.wave * 22;
    const e = {
      id: ++this.entityId,
      type: "boss",
      kind,
      name: names[kind],
      hp,
      max: hp,
      r: 2.35,
      x: 0,
      z: -22,
      px: 0,
      pz: -22,
      fire: 3,
      age: 0,
      phase: 0,
      warning: 0,
      dead: false,
      color: 0xffb46c,
      value: 3500 + this.wave * 450,
    };
    e.mesh = bossModel(kind);
    e.mesh.position.set(e.x, 0, e.z);
    this.world.scene.add(e.mesh);
    this.enemies.push(e);
    this.sound.bossArrive();
    return e;
  }
  spawnTrain(x) {
    if (this.trains.length || this.warnings.length) return;
    const warning = { x, t: 2.4, mesh: this.world.warning(x) };
    this.warnings.push(warning);
    this.ui.radio(
      "EXPRESS / LIVE TRACK",
      `Train inbound on ${x < 0 ? "left" : x > 0 ? "right" : "centre"} track. Clear the amber lane.`,
    );
    this.sound.trainWarn(x);
  }
  bullet(x, z, vx, vz, w, damageMul = 1) {
    const b = {
      x,
      z,
      px: x,
      pz: z,
      vx,
      vz,
      r: w.r,
      damage: w.damage * (1 + 0.2 * this.upgrades.power) * damageMul,
      life: 2,
      color: w.color,
      len: w === WEAPONS.lance ? 1.1 : w === WEAPONS.heavy ? 0.5 : 0.55,
      pierce:
        (w.pierce || 0) + this.upgrades.pierce + (this.overdrive > 0 ? 1 : 0),
      splash: w.splash || 0,
      hit: new Set(),
      friendly: true,
    };
    this.bullets.push(b);
    this.fired++;
    return b;
  }
  fire() {
    const p = this.player;
    if (p.fire > 0) return;
    const w = WEAPONS[p.weapon];
    p.fire =
      w.rate *
      this.ship.rate *
      Math.pow(0.86, this.upgrades.rate) *
      (this.overdrive > 0 ? 0.6 : 1);
    const put = (dx, vx = 0, mul = 1) =>
      this.bullet(p.x + dx, p.z - 0.8, vx, -w.speed, w, mul);
    if (p.weapon === "tri") {
      put(0);
      put(-0.35, -7);
      put(0.35, 7);
    } else if (p.weapon === "nova") {
      for (let i = -2; i <= 2; i++) put(i * 0.15, i * 7);
    } else if (p.weapon === "saw") {
      put(-0.42, -3);
      put(0.42, 3);
    } else if (p.weapon === "overheat") put(random(-0.25, 0.25), random(-4, 4));
    else if (p.weapon === "lance" || p.weapon === "heavy") put(0);
    else {
      put(-0.46, -0.3);
      put(0.46, 0.3);
    }
    this.sound.fire(p.weapon, p.x, p.z);
    this.world.muzzle(
      p.x,
      p.z - 0.9,
      w.color,
      p.weapon === "heavy" || p.weapon === "lance" ? 1.6 : 1,
    );
    this.recoil = 0.1;
  }
  enemyShot(e, angle, speed = 8, color = 0xff9b6b, r = 0.17) {
    if (this.shots.length >= 240) return;
    if (e.type !== "boss" && e.mesh) {
      this.sound.enemyFire(e.x, e.z, e.type === "brute");
      this.world.muzzle(e.x, e.z + 0.8, color, 0.7);
    }
    this.shots.push({
      x: e.x,
      z: e.z + 0.7,
      px: e.x,
      pz: e.z + 0.7,
      vx: Math.sin(angle) * speed,
      vz: Math.cos(angle) * speed,
      r,
      life: 7,
      color,
      friendly: false,
    });
  }
  aim(e, lead = false) {
    const p = this.player;
    return Math.atan2(p.x + (lead ? this.velocityX * 0.3 : 0) - e.x, p.z - e.z);
  }
  bossVolley(e) {
    const phase = e.phase,
      base = this.aim(e),
      speed = 6.5 + Math.min(4, this.wave * 0.22);
    if (e.kind === 0) {
      for (let i = -2 - phase; i <= 2 + phase; i++)
        this.enemyShot(e, base + i * 0.15, speed, 0xff9d6b, 0.19);
    } else if (e.kind === 1) {
      for (let k = -1; k <= 1; k++) {
        const port = { x: e.x + k * 1.9, z: e.z };
        for (let j = -1; j <= 1; j++)
          this.enemyShot(
            port,
            base + k * 0.15 + j * 0.12,
            speed,
            0x95e9de,
            0.18,
          );
      }
    } else {
      const count = 10 + phase * 3;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + e.age * 0.23;
        this.enemyShot(e, angle, 5.5 + phase, 0xffbd76, 0.19);
      }
    }
    if (phase === 2) {
      for (const s of [-1, 1])
        this.enemyShot(
          { x: e.x + s * 2, z: e.z },
          base + s * 0.5,
          speed + 2,
          0xff6f79,
          0.2,
        );
    }
    this.sound.bossVolley(e.x, e.z);
    this.world.muzzle(e.x, e.z + 1.6, 0xffb46c, 2.4);
  }
  pulse() {
    if (this.state !== "play" || this.player.charge < 100) return false;
    this.player.charge = 0;
    this.world.ring(this.player.x, this.player.z, 0xa6f6e6, 2);
    this.world.ring(this.player.x, this.player.z, 0xffc578, 1.6);
    this.world.burst(this.player.x, this.player.z, 0xb5ffe2, 60, true);
    this.world.pulseWave(this.player.x, this.player.z);
    this.world.shake = 0.5;
    this.slow = 0.3;
    this.shots = [];
    this.player.invul = Math.max(this.player.invul, 1);
    for (const e of this.enemies)
      if (!e.dead) {
        e.hp -= e.type === "boss" ? 34 : 22;
        if (e.hp <= 0) this.kill(e, "pulse");
        else this.world.burst(e.x, e.z, e.color, 10);
      }
    for (const t of this.trains) t.hp -= 22;
    this.sound.pulse();
    this.ui.toast(
      "CAPACITOR DISCHARGED",
      "RAIL PULSE",
      "Hostile projectiles neutralised",
    );
    return true;
  }
  damage() {
    if (this.state !== "play" || this.player.invul > 0 || this.demo)
      return false;
    const p = this.player;
    this.hitWave = true;
    p.invul = 1.15;
    this.combo = 0;
    this.comboT = 0;
    this.overdriveReady = true;
    const shielded = p.shield > 0;
    if (shielded) {
      p.shield = Math.max(0, p.shield - 34);
      this.world.burst(p.x, p.z, 0x8bf7d7, 20);
    } else {
      p.lives--;
      this.world.burst(p.x, p.z, 0xff986d, 50, true);
    }
    this.world.playerHit(shielded, p.x, p.z);
    this.world.shake = 0.4;
    this.ui.damage();
    if (p.lives <= 0) {
      this.world.shatter(this.playerMesh, p.x, p.z, 0xffbd8b, 2);
      this.world.explode(p.x, p.z, 0xffbd8b, 2);
      this.sound.playerDeath(p.x, p.z);
      this.finish();
    } else this.sound.playerHit(shielded, p.x, p.z);
    return true;
  }
  kill(e, cause = "shot") {
    if (e.dead) return;
    e.dead = true;
    this.kills++;
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.comboT = 3.8;
    const multiplier = 1 + Math.min(30, this.combo) * 0.08;
    const pts = Math.round(e.value * multiplier);
    this.score += pts;
    this.resolved += e.child ? 0 : 1;
    this.player.charge = clamp(
      this.player.charge + 5 + this.upgrades.charge * 1.25,
      0,
      100,
    );
    this.world.pop(e.x, e.z, "+" + pts);
    if (e.type === "boss") {
      // Chain detonation; the world plays each blast (and its sound) in sequence.
      this.world.bossDeath(e.mesh, e.x, e.z, e.color);
      this.world.ring(e.x, e.z, e.color, 2.5);
      this.sound.explode(1.5, e.x, e.z);
    } else {
      const size =
        e.type === "brute"
          ? 1.5
          : e.type === "swarm"
            ? 0.6
            : e.type === "sentry" || e.type === "splitter"
              ? 1.15
              : 0.9;
      this.world.shatter(e.mesh, e.x, e.z, e.color, size);
      this.world.explode(e.x, e.z, e.color, size);
      if (Math.random() < 0.7)
        this.world.ring(e.x, e.z, e.color, 0.5 + Math.random() * 0.4);
      this.sound.explode(size, e.x, e.z);
    }
    if (this.combo >= 12 && this.overdriveReady) {
      this.overdrive = 7;
      this.overdriveReady = false;
      this.sound.overdrive();
      this.ui.toast(
        "12 KILL CHAIN",
        "OVERDRIVE",
        "Accelerated fire · tungsten rounds",
      );
      this.world.ring(this.player.x, this.player.z, 0x9bf3dd, 1.2);
    }
    if (e.type === "boss") {
      this.bossDead = true;
      this.shots = [];
      this.slow = 0.8;
      this.score += this.wave * 150;
      this.ui.toast(
        "ROUTE REOPENED",
        "WARDEN DOWN",
        `Bounty +${this.wave * 150}`,
      );
      this.drop(e.x - 1, e.z, "shield");
      this.drop(e.x + 1, e.z, "weapon");
      for (const minion of this.enemies)
        if (minion !== e && !minion.dead) {
          minion.dead = true;
          this.world.shatter(
            minion.mesh,
            minion.x,
            minion.z,
            minion.color,
            0.6,
          );
          this.world.explode(minion.x, minion.z, minion.color, 0.6);
        }
      this.spawned = this.waveTotal;
    } else {
      if (e.type === "splitter" && cause !== "pulse") {
        for (const dx of [-0.7, 0.7])
          this.spawnEnemy("swarm", clamp(e.x + dx, -8, 8), e.z, true);
      }
      const guaranteed = this.kills - this.lastDrop >= 7;
      if (guaranteed || Math.random() < 0.2) {
        this.lastDrop = this.kills;
        const roll = Math.random();
        this.drop(
          e.x,
          e.z,
          guaranteed && this.player.shield < 25
            ? "shield"
            : roll < 0.25
              ? "shield"
              : roll < 0.45
                ? "charge"
                : "weapon",
        );
      }
    }
  }
  drop(x, z, type, weapon) {
    const choice =
        weapon || WEAPON_LIST[Math.floor(Math.random() * WEAPON_LIST.length)],
      name =
        type === "shield"
          ? "SHIELD +42"
          : type === "charge"
            ? "PULSE +40"
            : WEAPONS[choice].name,
      color =
        type === "shield"
          ? 0x8cf3d8
          : type === "charge"
            ? 0xffc66f
            : WEAPONS[choice].color;
    const p = {
      x,
      z,
      age: 0,
      type,
      weapon: choice,
      name,
      mesh: this.world.pickupModel(type, choice, name, color),
    };
    p.mesh.position.set(x, 0.15, z);
    p.rotor = p.mesh.getObjectByName("pickup-rotor");
    p.rotor.rotation.y = Math.random() * Math.PI * 2;
    p.labelMesh = p.mesh.getObjectByName("pickup-label");
    this.pickups.push(p);
    this.world.scene.add(p.mesh);
    return p;
  }
  collect(p) {
    if (p.type === "shield") {
      this.player.shield = clamp(this.player.shield + 42, 0, 100);
      this.ui.toast("SUPPLY ACQUIRED", "SHIELD CELL", "+42 shield");
    } else if (p.type === "charge") {
      this.player.charge = clamp(this.player.charge + 40, 0, 100);
      this.ui.toast("SUPPLY ACQUIRED", "ENERGY CELL", "+40 pulse energy");
    } else {
      this.player.weapon = p.weapon;
      this.player.weaponT = 20;
      this.ui.toast(
        "WEAPON ONLINE",
        WEAPONS[p.weapon].name,
        "20 seconds · keep the pressure on",
      );
    }
    this.sound.pickup(p.type, p.x, p.z);
    this.world.ring(p.x, p.z, p.type === "shield" ? 0x8cf3d8 : 0xffc878, 0.6);
    this.world.burst(p.x, p.z, p.type === "shield" ? 0x8cf3d8 : 0xffc878, 14);
    p.dead = true;
  }
  pickUpgrades() {
    const pool = UPGRADES.filter((u) => this.upgrades[u.id] < u.max);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 3);
  }
  chooseUpgrade(id) {
    const u = UPGRADES.find((u) => u.id === id);
    if (this.state !== "upgrade" || !u || this.upgrades[id] >= u.max) return;
    this.upgrades[id]++;
    if (id === "shield") {
      this.player.shield = clamp(this.player.shield + 65, 0, 100);
      this.player.lives = Math.min(6, this.player.lives + 1);
    }
    if (id === "charge")
      this.player.charge = clamp(this.player.charge + 40, 0, 100);
    if (id === "wing") {
      const mesh = droneModel("vanguard");
      mesh.scale.multiplyScalar(0.45);
      this.world.scene.add(mesh);
      this.wings.push({ mesh, fire: 0, side: this.wings.length ? -1 : 1 });
    }
    this.sound.play("pickup", 0.5);
    this.state = "play";
    this.ui.close();
    this.nextWave();
  }
  pause() {
    if (this.state !== "play" || this.demo) return;
    this.state = "paused";
    this.keys = {};
    this.pointer.active = false;
    this.sound.pause();
    this.sound.stopEffects();
    this.ui.pause();
  }
  resume() {
    if (this.state !== "paused") return;
    this.state = "play";
    this.keys = {};
    this.pointer.active = false;
    this.ui.close();
    this.sound.setMusic(this.isBoss ? "boss" : "game");
  }
  finish() {
    if (this.state === "over") return;
    this.state = "over";
    this.keys = {};
    this.pointer.active = false;
    this.sound.stopEffects();
    this.sound.setMusic("menu");
    this.ui.finish();
  }
  update(dt) {
    this.time += dt;
    const p = this.player;
    if (this.state === "menu") {
      this.menuT += dt;
      p.x = 3.4 + Math.sin(this.time * 0.65) * 3;
      p.z = 4 + Math.sin(this.time * 0.4) * 2;
      this.playerMesh.position.set(
        p.x,
        0.3 + Math.sin(this.time * 3) * 0.08,
        p.z,
      );
      this.playerMesh.rotation.z = Math.cos(this.time * 0.65) * -0.12;
      this.animateModel(this.playerMesh, dt);
      this.shieldMesh.visible = false;
      if (this.menuT > 1.2 && this.enemies.length < 7) {
        this.menuT = 0;
        this.spawnEnemy(
          ["scout", "weaver", "hunter", "brute"][Math.floor(this.time) % 4],
          random(-5, 8),
          -22,
        );
      }
      for (const e of this.enemies) {
        e.z += dt * 4;
        e.mesh.position.set(e.x, Math.sin(this.time * 2 + e.phase) * 0.09, e.z);
        this.animateModel(e.mesh, dt);
        if (e.z > 10) e.dead = true;
      }
      this.cleanup();
      return;
    }
    if (this.state !== "play") return;
    if (this.slow > 0) {
      this.slow -= dt;
      dt *= 0.55;
    }
    this.waveTime += dt;
    this.waveClearT = Math.max(0, this.waveClearT - dt);
    this.comboT -= dt;
    if (this.comboT <= 0) {
      this.combo = 0;
      this.overdriveReady = true;
    }
    this.overdrive = Math.max(0, this.overdrive - dt);
    p.invul = Math.max(0, p.invul - dt);
    p.fire = Math.max(0, p.fire - dt);
    p.weaponT = Math.max(0, p.weaponT - dt);
    if (p.weaponT === 0) p.weapon = "laser";
    p.px = p.x;
    p.pz = p.z;
    let kx =
        (this.keys.KeyD || this.keys.ArrowRight ? 1 : 0) -
        (this.keys.KeyA || this.keys.ArrowLeft ? 1 : 0),
      kz =
        (this.keys.KeyS || this.keys.ArrowDown ? 1 : 0) -
        (this.keys.KeyW || this.keys.ArrowUp ? 1 : 0);
    const pad = navigator.getGamepads?.()?.[0];
    if (pad) {
      kx += Math.abs(pad.axes[0]) > 0.18 ? pad.axes[0] : 0;
      kz += Math.abs(pad.axes[1]) > 0.18 ? pad.axes[1] : 0;
      if (pad.buttons[1]?.pressed) this.pulse();
    }
    if (this.demo) {
      this.demoT += dt;
      let dx = 0;
      for (const s of this.shots) {
        const dz = p.z - s.z;
        if (dz > 0 && dz < 5 && Math.abs(p.x - s.x) < 1.8)
          dx += (p.x > s.x ? 1 : -1) * (5 - dz);
      }
      const enemy = this.enemies
        .filter((e) => !e.dead)
        .sort((a, b) => b.z - a.z)[0];
      const target = enemy ? enemy.x : Math.sin(this.time) * 5;
      kx = clamp((target - p.x) * 1.5 + dx, -1, 1);
      kz = (6.5 - p.z) * 0.8;
      for (const t of [...this.trains, ...this.warnings])
        if (Math.abs(p.x - t.x) < 2.1) kx = p.x > t.x ? 1 : -1;
      if (p.charge >= 100 && (this.enemies.length > 5 || this.isBoss))
        this.pulse();
    }
    const len = Math.hypot(kx, kz);
    if (len > 1) {
      kx /= len;
      kz /= len;
    }
    if (kx || kz) {
      p.x += kx * this.ship.speed * dt;
      p.z += kz * this.ship.speed * 0.8 * dt;
      this.pointer.active = false;
    } else if (this.pointer.active) {
      const a = 1 - Math.exp(-dt * 18);
      p.x += (this.pointer.x - p.x) * a;
      p.z += (this.pointer.z - p.z) * a;
    }
    p.x = clamp(p.x, -8, 8);
    p.z = clamp(p.z, -1, 10);
    this.velocityX = (p.x - p.px) / dt;
    this.playerMesh.position.set(
      p.x,
      0.1 + Math.sin(this.time * 7) * 0.035,
      p.z,
    );
    this.playerMesh.rotation.z = -(p.x - p.px) * 1.2;
    this.playerMesh.rotation.x = (p.z - p.pz) * 0.3;
    this.playerMesh.visible =
      p.invul === 0 || Math.floor(p.invul * 14) % 2 === 0;
    this.animateModel(this.playerMesh, dt);
    this.shieldMesh.position.set(p.x, 0.6, p.z);
    this.shieldMesh.visible = p.shield > 0;
    this.shieldMesh.material.opacity =
      0.035 + p.shield * 0.00065 + Math.sin(this.time * 3) * 0.015;
    this.shieldMesh.rotation.y += dt * 0.3;
    if (
      this.settings.auto ||
      this.keys.Space ||
      this.keys.KeyJ ||
      this.pointer.active ||
      pad?.buttons[0]?.pressed ||
      pad?.buttons[7]?.pressed ||
      this.demo
    )
      this.fire();
    for (const wing of this.wings) {
      const x = p.x + wing.side * 1.35,
        z = p.z + 0.5;
      wing.mesh.position.set(x, 0.05, z);
      this.animateModel(wing.mesh, dt);
      wing.fire -= dt;
      if (
        wing.fire <= 0 &&
        (this.settings.auto ||
          this.keys.Space ||
          this.keys.KeyJ ||
          this.pointer.active ||
          pad?.buttons[0]?.pressed ||
          pad?.buttons[7]?.pressed ||
          this.demo)
      ) {
        wing.fire = 0.33;
        this.bullet(x, z, 0, -32, WEAPONS.laser, 0.65);
      }
    }
    this.spawnT -= dt;
    if (
      this.spawnT <= 0 &&
      this.spawned < this.waveTotal &&
      !(this.isBoss && this.bossDead)
    ) {
      this.spawnFormation();
      this.spawnT =
        Math.max(0.33, 1.1 - this.wave * 0.025) * (this.isBoss ? 2.6 : 1);
    }
    this.trainT -= dt;
    if (this.trainT <= 0 && this.wave > 1) {
      this.trainT = random(13, 20);
      this.spawnTrain([-6, 0, 6][Math.floor(Math.random() * 3)]);
    }
    for (const w of this.warnings) {
      w.t -= dt;
      w.mesh.visible = this.settings.motion || Math.floor(w.t * 5) % 2 === 0;
      if (w.t <= 0) {
        this.world.remove(w.mesh);
        w.dead = true;
        const mesh = this.world.trainTemplate.clone();
        mesh.rotation.y = Math.PI;
        this.world.scene.add(mesh);
        this.sound.trainPass(w.x);
        this.trains.push({
          x: w.x,
          z: -23,
          hp: 38 + this.wave * 2,
          mesh,
          speed: 12 + Math.min(8, this.wave * 0.5),
          dead: false,
        });
      }
    }
    this.warnings = this.warnings.filter((w) => !w.dead);
    for (const e of [...this.enemies]) {
      if (e.dead) continue;
      e.px = e.x;
      e.pz = e.z;
      e.age += dt;
      e.fire -= dt;
      if (e.type === "boss") {
        const phase = e.hp / e.max < 0.32 ? 2 : e.hp / e.max < 0.67 ? 1 : 0;
        if (phase !== e.phase) {
          e.phase = phase;
          e.warning = 0.8;
          this.ui.toast(
            "ARMOUR FAILURE",
            phase === 1 ? "PATTERN SHIFT" : "CORE EXPOSED",
            phase === 1
              ? "Faster volleys. Keep moving."
              : "Final phase · finish the job.",
          );
          this.world.ring(e.x, e.z, 0xff9e73, 2);
          this.world.burst(e.x, e.z, 0xffd18f, 30, true);
          this.world.explode(e.x + random(-1.5, 1.5), e.z, 0xffd18f, 1.4);
          this.world.shockwave(e.x, e.z, 0.04, 3);
          this.sound.bossPhase(e.x, e.z);
        }
        e.x = Math.sin(e.age * (0.55 + e.phase * 0.1)) * 5;
        e.z += (-10.5 - e.z) * Math.min(1, dt * 1.1);
        if (e.fire < 0.7) {
          if (!e.warning) this.sound.charge(e.x, e.z);
          e.warning = Math.max(e.warning, e.fire);
        }
        if (e.fire <= 0) {
          this.bossVolley(e);
          e.fire = 2.3 - e.phase * 0.4;
          e.warning = 0;
        }
        e.mesh.getObjectByName("crown").rotation.z += dt * (0.7 + phase * 0.6);
      } else {
        if (e.type === "weaver" || e.type === "splitter") {
          e.x = clamp(e.home + Math.sin(e.age * 2 + e.phase) * 1.6, -8, 8);
          e.z += e.speed * dt;
        } else if (e.type === "hunter") {
          const target = p.x + this.velocityX * 0.2;
          e.x += clamp(target - e.x, -2.5, 2.5) * dt;
          e.z += e.speed * dt;
        } else if (e.type === "sentry") {
          e.z += e.speed * dt * (e.z > -9 && e.age < 13 ? 0.12 : 1);
          e.x += Math.sin(e.age) * dt * 0.25;
        } else {
          e.z += e.speed * dt;
          e.x = clamp(e.x + Math.sin(e.age * 2 + e.phase) * dt * 0.65, -8, 8);
        }
        if (e.fire < 0.55 && e.z > -15 && e.type !== "swarm")
          e.warning = e.fire;
        else e.warning = 0;
        if (e.fire <= 0 && e.z > -15 && e.z < p.z - 1) {
          const a = this.aim(e, e.type === "hunter");
          if (e.type === "weaver") {
            this.enemyShot(e, a - 0.23, 7, 0xfbc688);
            this.enemyShot(e, a + 0.23, 7, 0xfbc688);
          } else if (e.type === "brute") {
            for (let i = -1; i <= 1; i++)
              this.enemyShot(e, a + i * 0.23, 6.3, 0xff936e, 0.21);
          } else if (e.type !== "swarm")
            this.enemyShot(e, a, e.type === "hunter" ? 10 : 7.2, 0xffb377);
          e.fire =
            ((ENEMIES[e.type].fire || 3) * random(0.8, 1.2)) /
            (1 + Math.min(0.8, this.wave * 0.025));
        }
      }
      e.mesh.position.set(e.x, Math.sin(this.time * 4 + e.age) * 0.045, e.z);
      // Clones re-derive Euler angles from the quaternion, so the template's
      // 180° yaw comes back as x = z = -π; setting only z would flip the
      // drone upside down beneath the track bed. Set all three.
      if (e.type === "boss") e.mesh.rotation.z = Math.sin(e.age) * 0.015;
      else e.mesh.rotation.set(0, Math.PI, (e.x - e.px) * -0.5);
      this.animateModel(e.mesh, dt);
      const threat = e.mesh.getObjectByName("threat");
      if (threat) {
        threat.visible = e.warning > 0;
        threat.scale.setScalar(1 + e.warning * 0.7);
      }
      const flame = e.mesh.getObjectByName("flame");
      if (flame) {
        flame.scale.set(
          1.1 + Math.sin(this.time * 25) * 0.1,
          0.6 + Math.random() * 0.12,
          1,
        );
        flame.material.opacity = e.warning > 0 ? 0.9 : 0.45;
      }
      if (e.type !== "boss" && e.z > 13) {
        e.dead = true;
        this.escapes++;
        this.resolved += e.child ? 0 : 1;
        this.damage();
        this.ui.radio(
          "PERIMETER / BREACHED",
          "A hostile escaped the line. No bounty awarded.",
        );
        if (this.state !== "play") return;
        continue;
      }
      if (
        segmentDistance2(0, 0, e.px - p.px, e.pz - p.pz, e.x - p.x, e.z - p.z) <
        (e.r + 0.32) ** 2
      ) {
        this.damage();
        if (this.state !== "play") return;
        if (e.type !== "boss") {
          e.dead = true;
          this.escapes++;
          this.resolved += e.child ? 0 : 1;
          this.world.burst(e.x, e.z, e.color, 20);
          this.world.shatter(e.mesh, e.x, e.z, e.color);
        }
      }
    }
    for (const t of this.trains) {
      t.pz = t.z;
      t.z += dt * t.speed;
      t.mesh.position.set(t.x, 0, t.z);
      if (Math.abs(t.x - p.x) < 1.15 && p.z > t.z - 8.8 && p.z < t.z + 1.85)
        this.damage();
      if (t.z > 26) t.dead = true;
      if (t.hp <= 0 && !t.dead) {
        t.dead = true;
        this.score += 1250;
        this.world.pop(t.x, t.z, "EXPRESS +1250");
        this.world.shatter(t.mesh, t.x, t.z - 3.5, 0xffba76, 3.2);
        for (let j = 0; j < 3; j++) {
          this.world.explode(t.x, t.z - j * 3.4, 0xffba76, j ? 1.6 : 2.6);
          this.world.ring(t.x, t.z - j * 3.4, 0xffd58d, 1.2);
        }
        this.sound.explode(3.2, t.x, t.z);
        this.drop(t.x, t.z, "charge");
      }
    }
    if (this.state !== "play") return;
    for (const b of this.bullets) {
      b.px = b.x;
      b.pz = b.z;
      b.x += b.vx * dt;
      b.z += b.vz * dt;
      b.life -= dt;
      if (b.pierce >= 4) b.vx *= Math.exp(-dt * 0.15);
      const targets = [];
      for (const e of this.enemies) {
        if (e.dead || b.hit.has(e.id)) continue;
        const at = circleEntry(
          b.px - e.px,
          b.pz - e.pz,
          b.x - e.x,
          b.z - e.z,
          e.r + b.r,
        );
        if (at !== null) targets.push({ enemy: e, at });
      }
      for (const train of this.trains) {
        if (train.dead || train.hp <= 0) continue;
        const at = segmentBoxEntry(
          b.px - train.x,
          b.pz - train.pz,
          b.x - train.x,
          b.z - train.z,
          -1 - b.r,
          1 + b.r,
          -8.5 - b.r,
          1.6 + b.r,
        );
        if (at !== null) targets.push({ train, at });
      }
      targets.sort((a, b) => a.at - b.at);
      for (const target of targets) {
        if (b.life <= 0) break;
        if (target.train) {
          target.train.hp -= b.damage;
          b.life = 0;
          this.hits++;
          this.world.impact(
            b.px + (b.x - b.px) * target.at,
            b.pz + (b.z - b.pz) * target.at,
            0xffdfb5,
          );
          this.sound.hit(b.x, b.z);
          break;
        }
        const e = target.enemy;
        if (e.dead || b.life <= 0) continue;
        {
          b.hit.add(e.id);
          e.hp -= b.damage;
          this.hits++;
          this.world.impact(
            b.px + (b.x - b.px) * target.at,
            b.pz + (b.z - b.pz) * target.at,
            b.color,
          );
          if (e.hp > 0) this.sound.hit(e.x, e.z);
          if (e.hp <= 0) this.kill(e);
          if (b.splash) {
            for (const other of this.enemies)
              if (
                other !== e &&
                !other.dead &&
                Math.hypot(other.x - e.x, other.z - e.z) < b.splash
              ) {
                other.hp -= b.damage * 0.5;
                if (other.hp <= 0) this.kill(other);
              }
            this.world.ring(e.x, e.z, b.color, 0.4);
          }
          if (b.pierce > 0) b.pierce--;
          else b.life = 0;
        }
      }
    }
    if (this.state !== "play") return;
    for (const s of this.shots) {
      s.px = s.x;
      s.pz = s.z;
      s.x += s.vx * dt;
      s.z += s.vz * dt;
      s.life -= dt;
      if (
        segmentDistance2(0, 0, s.px - p.px, s.pz - p.pz, s.x - p.x, s.z - p.z) <
        (0.32 + s.r) ** 2
      ) {
        s.life = 0;
        this.damage();
        if (this.state !== "play") return;
      }
    }
    this.bullets = this.bullets.filter(
      (b) => b.life > 0 && b.z > -30 && Math.abs(b.x) < 14,
    );
    this.shots = this.shots.filter(
      (s) => s.life > 0 && s.z < 16 && s.z > -25 && Math.abs(s.x) < 15,
    );
    for (const item of this.pickups) {
      if (item.dead) continue;
      item.age += dt;
      item.z += dt * 2.1;
      const d = Math.hypot(p.x - item.x, p.z - item.z),
        range = 1.8 + this.upgrades.magnet * 1.8;
      if (d < range && d > 0.01) {
        const pull = dt * (3 + this.upgrades.magnet * 2);
        item.x += ((p.x - item.x) / d) * pull;
        item.z += ((p.z - item.z) / d) * pull;
      }
      item.mesh.position.set(
        item.x,
        0.15 + Math.sin(this.time * 4 + item.age) * 0.13,
        item.z,
      );
      item.rotor.rotation.y += dt * 1.9;
      item.rotor.rotation.z = Math.sin(this.time * 1.8 + item.age) * 0.13;
      if (d < 0.85) this.collect(item);
      if (item.age > 15 || item.z > 14) item.dead = true;
    }
    this.cleanup();
    if (this.state !== "play") return;
    const cleared =
      this.spawned >= this.waveTotal &&
      this.enemies.length === 0 &&
      (!this.isBoss || this.bossDead) &&
      this.trains.length === 0 &&
      this.warnings.length === 0;
    if (cleared) {
      this.clearDelay = (this.clearDelay || 0) + dt;
      if (this.clearDelay > 0.9) {
        this.clearDelay = 0;
        this.shots = [];
        const bonus = this.hitWave ? this.wave * 100 : this.wave * 250;
        this.score += bonus;
        if (!this.hitWave)
          this.ui.toast(
            "NO DAMAGE TAKEN",
            "FLAWLESS",
            `Station bonus +${bonus}`,
          );
        this.sound.waveClear();
        if (this.wave % 2 === 0) {
          this.state = "upgrade";
          this.sound.play("pickup", 0.5);
          if (this.demo) {
            const u = this.pickUpgrades()[0];
            this.chooseUpgrade(u.id);
          } else this.ui.upgrade(this.pickUpgrades());
        } else this.nextWave();
      }
    } else this.clearDelay = 0;
    this.score += dt * 5;
    this.ui.hud();
  }
  animateModel(mesh, dt) {
    const rotor = mesh.getObjectByName("rotor");
    if (rotor) rotor.rotation.y += dt * 24;
    const flame = mesh.getObjectByName("flame");
    if (flame) flame.scale.y = 0.65 + Math.sin(this.time * 30) * 0.13;
  }
  cleanup() {
    for (const key of ["enemies", "pickups", "trains"]) {
      this[key] = this[key].filter((e) => {
        if (e.dead) {
          this.world.remove(e.mesh);
          return false;
        }
        return true;
      });
    }
  }
  addInputs() {
    const canvas = this.world.renderer.domElement;
    addEventListener("keydown", (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code,
        )
      )
        e.preventDefault();
      if (e.repeat && ["KeyX", "KeyP", "Escape", "KeyF"].includes(e.code))
        return;
      if (e.code === "KeyP" || e.code === "Escape") {
        if (this.state === "play") this.pause();
        else if (this.state === "paused") this.resume();
        return;
      }
      if (this.state !== "play") return;
      this.keys[e.code] = true;
      if (e.code === "KeyX") this.pulse();
      if (e.code === "KeyF") this.ui.toggleFire();
      if (e.code === "KeyM") this.ui.toggleMute();
    });
    addEventListener("keyup", (e) => {
      delete this.keys[e.code];
    });
    addEventListener("blur", () => {
      this.keys = {};
      this.pointer.active = false;
      if (!this.demo) this.pause();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.keys = {};
        this.pointer.active = false;
        if (this.demo) {
          this.state = "paused";
          this.sound.pause();
        } else this.pause();
      } else if (this.demo && this.state === "paused") {
        this.state = "play";
        this.sound.setMusic(this.isBoss ? "boss" : "game");
      }
    });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("pointerdown", (e) => {
      if (this.state !== "play" || this.demo) return;
      if (e.button === 2) {
        this.pulse();
        return;
      }
      this.sound.unlock();
      canvas.setPointerCapture(e.pointerId);
      const v = this.world.pointer(e.clientX, e.clientY);
      if (!v) return;
      this.pointer = {
        active: true,
        id: e.pointerId,
        x: this.player.x,
        z: this.player.z,
        lastX: v.x,
        lastZ: v.z,
      };
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", (e) => {
      if (
        this.state !== "play" ||
        !this.pointer.active ||
        e.pointerId !== this.pointer.id
      )
        return;
      const v = this.world.pointer(e.clientX, e.clientY);
      if (!v) return;
      const ratio = e.pointerType === "touch" ? 1.25 : 1;
      this.pointer.x = clamp(
        this.pointer.x + (v.x - this.pointer.lastX) * ratio,
        -8,
        8,
      );
      this.pointer.z = clamp(
        this.pointer.z + (v.z - this.pointer.lastZ) * ratio,
        -1,
        10,
      );
      this.pointer.lastX = v.x;
      this.pointer.lastZ = v.z;
      e.preventDefault();
    });
    const up = (e) => {
      if (e.pointerId === this.pointer.id) this.pointer.active = false;
    };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("lostpointercapture", up);
  }
  snapshot() {
    return {
      state: this.state,
      demo: this.demo,
      wave: this.wave,
      score: Math.floor(this.score),
      kills: this.kills || 0,
      escapes: this.escapes || 0,
      combo: this.combo || 0,
      lives: this.player.lives,
      shield: this.player.shield,
      charge: this.player.charge,
      weapon: this.player.weapon,
      spawned: this.spawned || 0,
      waveTotal: this.waveTotal || 0,
      enemies: this.enemies.length,
      shots: this.shots.length,
      bullets: this.bullets.length,
      trains: this.trains.length,
      warnings: this.warnings.length,
      upgrades: { ...this.upgrades },
      boss: this.enemies.find((e) => e.type === "boss")
        ? {
            hp: this.enemies.find((e) => e.type === "boss").hp,
            phase: this.enemies.find((e) => e.type === "boss").phase,
          }
        : null,
    };
  }
}
