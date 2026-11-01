import { type Mesh, type Object3D } from 'three';
import {
  Behaviour, Input, KeyCode, Random, Time, WaitForSeconds, WaitForSecondsRealtime, destroy, findObjectOfType,
  findObjectsOfType, instantiate, type Prefab,
} from '@scenoco-three/core';
import { createScoreBoard, type ScoreBoard } from '../../../jez237/scores';
import { Aim } from './Aim';
import type { WarheadKind } from './assets';
import { CameraRig } from './CameraRig';
import { City, Silo } from './Defense';
import { Hud, type Card } from './Hud';
import { globalTop, localTop, renderTitle } from './Leaders';
import { Shockwave } from './misc';
import { Blast, Bomber, Interceptor, Meteor, Orbital, Satellite, Warhead, type Theatre } from './Ordnance';
import { Sky } from './Sky';
import { Sound } from './Sound';
import { PX, SKY, SPAWN_Y, half, widthFor, world } from './world';

export type Phase = 'title' | 'playing' | 'tally' | 'arsenal' | 'paused' | 'over';
type Boss = 'bomber' | 'orbital' | 'meteor' | 'stealth' | 'nuke';
type Upgrade = 'blast' | 'speed' | 'ammo' | 'flak' | 'aegis' | 'rebuild';

const VERSION = 'v1.0.1';
const FIRE_KEY = 'auroraSiege3d_rapid';
const DIFF_KEY = 'auroraSiege3d_difficulty';
const DIFFICULTIES = { easy: 0.82, normal: 1, hard: 1.28 } as const;
type Difficulty = keyof typeof DIFFICULTIES;
const BONUS_EVERY = 12000;
const CITY_X = [-0.33, -0.22, -0.11, 0.11, 0.22, 0.33];
const SILO_X = [-0.44, 0, 0.44];

const BOSSES: Record<Boss, { title: string; tell: string; voice: string; tint: string }> = {
  bomber: { title: 'BOMBER DETECTED', tell: 'BRING IT DOWN BEFORE IT CROSSES — 20 HITS', voice: 'vo-bomber', tint: '#5a5a6a' },
  orbital: { title: 'ORBITAL WEAPON CHARGING', tell: 'EVERY HIT STALLS THE CHARGE', voice: 'vo-orbital', tint: '#6a3aff' },
  meteor: { title: 'METEOR SHOWER INCOMING', tell: 'THEY BREAK APART — KEEP FIRING', voice: 'vo-meteor', tint: '#c86414' },
  stealth: { title: 'STEALTH SIGNATURES', tell: 'WATCH THE RADAR SWEEP', voice: 'vo-stealth', tint: '#14ff64' },
  nuke: { title: 'NUCLEAR WARHEADS DETECTED', tell: 'ONE GETS THROUGH, A DISTRICT GOES', voice: 'vo-nuke', tint: '#ffc800' },
};
const BOSS_ORDER: Boss[] = ['bomber', 'orbital', 'meteor', 'stealth', 'nuke'];

const UPGRADES: Record<Upgrade, { title: string; text: (tier: number) => string; max: number }> = {
  blast: { title: 'BIGGER BLASTS', text: (t) => `Interceptor blasts ${15 * (t + 1)}% wider.`, max: 3 },
  speed: { title: 'FASTER INTERCEPTORS', text: (t) => `Interceptors fly ${25 * (t + 1)}% faster.`, max: 3 },
  ammo: { title: 'DEEPER MAGAZINES', text: (t) => `Every battery carries ${4 * (t + 1)} more rounds.`, max: 3 },
  flak: { title: 'FLAK BURST', text: (t) => (t ? 'Flak bursts grow larger.' : 'Every blast throws three flak bursts.'), max: 2 },
  aegis: { title: 'AEGIS SHIELD', text: () => 'Shields the two most exposed cities — one hit each.', max: 99 },
  rebuild: { title: 'REBUILD A CITY', text: () => 'A fallen city rises again, now.', max: 99 },
};

/**
 * The rules of the siege: the waves and what each sends — the classic edition's mix of warheads,
 * satellites and five kinds of boss — the batteries and their rounds, every blast and what it catches,
 * chains, the end-of-wave tally, the Arsenal between boss waves, and the title screen's demo, where the
 * defence fights on its own.
 */
export class Game extends Behaviour implements Theatre {
  warhead: Prefab | null = null;
  mirv: Prefab | null = null;
  smart: Prefab | null = null;
  nuke: Prefab | null = null;
  bomb: Prefab | null = null;
  stealthy: Prefab | null = null;
  interceptor: Prefab | null = null;
  blast: Prefab | null = null;
  hostileBlast: Prefab | null = null;
  satellite: Prefab | null = null;
  bomber: Prefab | null = null;
  orbital: Prefab | null = null;
  meteor: Prefab | null = null;
  ringFx: Prefab | null = null;
  radar: Prefab | null = null;
  burstAir: Prefab | null = null;
  burstImpact: Prefab | null = null;
  burstRubble: Prefab | null = null;
  burstKill: Prefab | null = null;
  burstMetal: Prefab | null = null;
  burstMeteor: Prefab | null = null;
  burstNuke: Prefab | null = null;
  fireworks: Prefab[] = [];

  phase: Phase = 'title';
  score = 0;
  wave = 1;

  private hud!: Hud;
  private sound!: Sound;
  private aim!: Aim;
  private sky!: Sky;
  private rig: CameraRig | null = null;
  private board!: ScoreBoard;
  private cities: City[] = [];
  private silos: Silo[] = [];

  private difficulty: Difficulty = 'normal';
  private rapid = false;
  private best = 0;
  private boss: Boss | null = null;
  private chain = 0;
  private chainWindow = 0;
  private nextBonus = BONUS_EVERY;
  private quiet = 0;
  private rapidTimer = 0;
  private radarTimer = 0;
  private nukeTimer = 0;
  private demoTimer = 0;
  private waveTime = 0;
  private flags = { mirv: false, smart: false, ammoLow: false, chain: false };
  private readonly tiers: Record<Upgrade, number> = { blast: 0, speed: 0, ammo: 0, flak: 0, aegis: 0, rebuild: 0 };
  private offered: Upgrade[] = [];

  // --- Theatre: what the ordnance asks of the game -----------------------------------------------

  get slow(): number {
    return 1;
  }

  landed(w: Warhead): void {
    if (!w.alive) return;
    const p = w.node.position;
    w.kill();
    if (w.kind === 'nuke') return this.nukeLands(p.x);
    this.groundHit(p.x, 64 * 1.4 * PX);
  }

  arrived(i: Interceptor): void {
    const p = i.node.position;
    this.detonate(p.x, p.y, (60 + Math.random() * 26) * 1.4 * PX * (1 + this.tiers.blast * 0.15), true);
    if (this.tiers.flak > 0) this.startCoroutine(this.flak(p.x, p.y));
  }

  dropBombs(x: number, y: number, count: number): void {
    const targets = this.targets();
    const t = targets[Random.rangeInt(0, targets.length)] ?? { x: Random.range(-half(), half()), y: 0 };
    for (let i = 0; i < count; i++) {
      this.launchWarhead('bomb', x + Random.range(-0.3, 0.3), y, t.x + (count > 1 ? Random.range(-1.5, 1.5) : 0), 0, (50 + this.ew() * 8) * PX, 0);
    }
    this.sound.whistle();
  }

  orbitalFires(o: Orbital): void {
    const live = this.cities.filter((c) => c.alive);
    const target = live[Random.rangeInt(0, live.length)];
    o.targetX = target ? target.node.position.x : 0;
    this.rig?.impact(0.9);
    this.hud.flash('violet');
    this.sound.explosion(2, 5);
    this.startCoroutine(this.beamStrike(target ?? null));
  }

  meteorLanded(m: Meteor): void {
    const p = m.node.position;
    m.alive = false;
    destroy(m.node);
    this.groundHit(p.x, 1.6);
  }

  // --- setting up -----------------------------------------------------------------------------------

  override awake(): void {
    this.hud = new Hud();
    this.sound = findObjectOfType(Sound)!;
    this.aim = findObjectOfType(Aim)!;
    this.sky = findObjectOfType(Sky)!;
    this.cities = findObjectsOfType(City);
    this.silos = findObjectsOfType(Silo);
    this.silos.forEach((s, i) => (s.index = i));
    this.sound.onVoice = (text) => this.hud.voice(text);
    this.board = createScoreBoard({
      game: 'aurora-siege-3d',
      title: 'AURORA SIEGE 3D',
      levelLabel: 'WAVE',
      accent: '#53ffa3',
      accent2: '#55d2ff',
      panel: 'linear-gradient(160deg,rgba(8,30,40,.95),rgba(4,6,18,.97))',
      font: 'Orbitron, sans-serif',
    });
    try {
      this.rapid = localStorage.getItem(FIRE_KEY) === '1';
      const d = localStorage.getItem(DIFF_KEY) as Difficulty | null;
      if (d && d in DIFFICULTIES) this.difficulty = d;
    } catch {
      // storage refused
    }
    this.hud.fireMode(this.rapid);
    this.hud.difficulty(this.difficulty);
    document.getElementById('scores-button')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.board.open();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.phase === 'playing') this.pause(true);
    });
  }

  override start(): void {
    this.rig = findObjectOfType(CameraRig);
    document.getElementById('version')!.textContent = `Aurora Siege 3D · ${VERSION}`;
    this.layout();
    this.hud.sound(this.sound.muted);
    this.hud.playing(false);
    this.refreshLeaders();
    this.sound.setMusic(true, 0.42);
  }

  /** Cities and batteries across a front as wide as the screen shows. */
  private layout(): void {
    world.width = widthFor(this.camera && 'aspect' in this.camera ? this.camera.aspect : 16 / 9);
    const w = world.width;
    const squeeze = Math.min(1, (w * 0.11 * 0.55) / 2);
    this.cities.sort((a, b) => a.node.position.x - b.node.position.x);
    this.cities.forEach((c, i) => {
      c.node.position.set(CITY_X[i]! * w, 0, 0);
      c.node.scale.x = squeeze;
    });
    this.silos.sort((a, b) => a.node.position.x - b.node.position.x);
    this.silos.forEach((s, i) => {
      s.index = i;
      s.node.position.set(SILO_X[i]! * w, 0.15, 0);
    });
  }

  // --- every frame ----------------------------------------------------------------------------------

  override update(dt: number): void {
    this.hud.portrait(innerHeight > innerWidth);
    this.controls();
    this.hud.silos(this.silos.map((s) => ({ x: s.node.position.x, y: s.node.position.y, ammo: s.ammo, alive: s.alive })), this.camera);
    this.aim.node.visible = this.phase === 'title' || this.phase === 'playing';
    for (const s of this.silos) s.aimAt(this.aim.x, this.aim.y);
    if (this.phase === 'title') return this.demo(dt);
    if (this.phase !== 'playing' && this.phase !== 'tally') return;

    this.chainWindow -= dt;
    if (this.chainWindow <= 0) this.chain = 0;
    this.waveTime += dt;
    if (this.phase === 'playing') {
      this.shoot(dt);
      this.steer(dt);
      this.bossTick(dt);
      this.threats();
      this.checkCleared(dt);
    } else this.aim.shots.length = 0;
  }

  override lateUpdate(): void {
    this.blasts(this.phase === 'title' || this.phase === 'over');
  }

  private controls(): void {
    if (Input.getButtonDown('Sound') || Input.getKeyDown(KeyCode.M)) this.hud.sound(this.sound.toggleMute());
    if (this.board.isOpen) return;
    if (Input.getButtonDown('FireMode') || Input.getKeyDown(KeyCode.F)) this.toggleFire();
    const go = Input.getButtonDown('Continue') || Input.getKeyDown(KeyCode.Return) || Input.getKeyDown(KeyCode.JoystickButton0);
    switch (this.phase) {
      case 'title':
        if (Input.getButtonDown('Difficulty') || Input.getKeyDown(KeyCode.D)) this.cycleDifficulty();
        if (Input.getButtonDown('Play') || Input.getKeyDown(KeyCode.Return) || Input.getKeyDown(KeyCode.Space) || Input.getKeyDown(KeyCode.JoystickButton9) || Input.getKeyDown(KeyCode.JoystickButton0)) this.begin();
        break;
      case 'playing':
      case 'tally':
        if (Input.getButtonDown('Pause') || Input.getKeyDown(KeyCode.P) || Input.getKeyDown(KeyCode.Escape) || Input.getKeyDown(KeyCode.JoystickButton9)) this.pause(true);
        break;
      case 'paused':
        if (Input.getButtonDown('MainMenu') || Input.getKeyDown(KeyCode.Q)) this.endRun('title');
        else if (Input.getButtonDown('QuitGame')) this.endRun('quit');
        else if (Input.getButtonDown('Resume') || Input.getButtonDown('Pause') || Input.getKeyDown(KeyCode.P) || Input.getKeyDown(KeyCode.Escape) || Input.getKeyDown(KeyCode.JoystickButton9)) this.pause(false);
        break;
      case 'arsenal': {
        const keys = [KeyCode.Alpha1, KeyCode.Alpha2, KeyCode.Alpha3];
        this.offered.forEach((u, i) => {
          if (Input.getButtonDown(`Pick${i + 1}`) || Input.getKeyDown(keys[i]!)) this.choose(u);
        });
        break;
      }
      case 'over':
        if (go && this.hud && document.getElementById('banner')?.classList.contains('shown')) this.toTitle();
        break;
    }
  }

  // --- the title screen's demo: the defence fights on its own ----------------------------------------

  private demo(dt: number): void {
    this.aim.demo = true;
    this.demoTimer -= dt;
    const live = findObjectsOfType(Warhead).filter((w) => w.alive);
    if (this.demoTimer <= 0 && live.length < 7) {
      this.demoTimer = Random.range(0.5, 1.3);
      this.enemy(0, 1.6);
    }
    // Fire at the lowest warhead nobody is already after, where it will be when the interceptor gets there.
    this.rapidTimer -= dt;
    if (this.rapidTimer <= 0) {
      this.rapidTimer = 0.55;
      const target = live.filter((w) => !w.waiting && w.node.position.y < SKY - 1).sort((a, b) => a.node.position.y - b.node.position.y)[0];
      if (target) {
        const p = target.node.position;
        const silo = this.nearestSilo(p.x, true);
        if (silo) {
          const d = Math.hypot(p.x - silo.node.position.x, p.y);
          const t = d / 15;
          const len = Math.hypot(target.tx - p.x, target.ty - p.y) || 1;
          const lx = p.x + ((target.tx - p.x) / len) * target.speed * t;
          const ly = p.y + ((target.ty - p.y) / len) * target.speed * t;
          this.aim.move(lx, ly);
          this.launch(silo, lx, ly, true);
        }
      }
    }
    if (this.cities.filter((c) => c.alive).length < 3) for (const c of this.cities) if (!c.alive) c.rebuild();
  }

  // --- a run ------------------------------------------------------------------------------------------

  private begin(): void {
    this.sound.unlock();
    this.sound.newAnnouncer();
    this.clearSky();
    this.layout();
    this.score = 0;
    this.wave = 1;
    this.chain = 0;
    this.nextBonus = BONUS_EVERY;
    for (const k of Object.keys(this.tiers) as Upgrade[]) this.tiers[k] = 0;
    for (const c of this.cities) {
      c.shields = 0;
      if (!c.alive) c.rebuild();
    }
    this.phase = 'playing';
    Time.timeScale = 1;
    this.aim.demo = false;
    this.aim.shots.length = 0;
    this.aim.move(0, SKY * 0.55);
    this.hud.playing(true);
    this.hud.banner(null);
    this.hud.score(0);
    this.hud.hi(this.best);
    this.sound.setMusic(true, 0.3);
    this.startWave(true);
  }

  private clearSky(): void {
    const kinds: (abstract new () => Behaviour)[] = [Warhead, Interceptor, Blast, Satellite, Bomber, Orbital, Meteor];
    for (const kind of kinds) for (const b of findObjectsOfType(kind)) destroy(b.node);
  }

  private ew(): number {
    const w = this.wave;
    return (w <= 16 ? w : 16 + (w - 16) * 0.25) * DIFFICULTIES[this.difficulty];
  }

  private startWave(first = false): void {
    const w = this.wave;
    this.waveTime = 0;
    this.quiet = 0;
    this.flags = { mirv: false, smart: false, ammoLow: false, chain: false };
    const ammo = 15 + Math.floor(this.ew() * 1.5) + this.tiers.ammo * 4;
    const rebuilt = this.silos.some((s) => !s.alive);
    for (const s of this.silos) s.refill(ammo);
    if (rebuilt && !first) setTimeout(() => this.hud.plate('BATTERIES REBUILT', 'ALL SILOS BACK ONLINE', 1600), 900);
    this.hud.wave(w);
    this.updateCities();
    this.sky.preset(Math.floor((w - 1) / 2), first);
    this.boss = w >= 4 && w % 4 === 0 ? BOSS_ORDER[Math.floor((w - 4) / 4) % BOSS_ORDER.length]! : null;
    this.sky.warn(this.boss ? BOSSES[this.boss].tint : '#000000', this.boss ? 0.06 : 0);
    if (this.boss) {
      const b = BOSSES[this.boss];
      this.hud.intro(`WAVE ${w} · BOSS WAVE`, b.title, b.tell, true);
      this.sound.announce('vo-boss', true);
      setTimeout(() => this.phase === 'playing' && this.wave === w && this.sound.announce(b.voice, true), 1400);
      this.rig?.impact(0.4);
    } else {
      this.hud.intro(`WAVE ${w}`, w < 6 ? 'INITIAL BOMBARDMENT' : w < 10 ? 'MIRV SIGNATURES DETECTED' : 'SMART WEAPONS IN THE THEATRE', first ? 'TAP THE SKY WHERE THEY WILL BE' : 'HOLD THE LINE');
      this.sound.announce(first ? 'vo-incoming' : 'wave', first);
    }
    if (!first) this.sound.fanfare();
    const count = 6 + Math.floor(this.ew() * 2);
    const gap = Math.max(0.45, 1.8 - this.ew() * 0.05);
    switch (this.boss) {
      case 'bomber': {
        const dir = w % 8 === 4 ? 1 : -1;
        const b = this.make(this.bomber, Bomber);
        b.node.position.set(dir > 0 ? -half() - 4 : half() + 4, SKY * 0.8 + Random.range(0, 1.5), 0);
        b.vx = dir * (30 + this.ew() * 1.5) * PX * 1.2;
        b.node.scale.set(dir * 1.35, 1.35, 1.35);
        b.hp = b.maxHp = 20;
        for (let i = 0; i < 4; i++) this.enemy(i * 1.2 + 2);
        break;
      }
      case 'orbital': {
        const o = this.make(this.orbital, Orbital);
        o.node.position.set(0, SKY - 1.6, 0);
        o.hp = o.maxHp = 36;
        for (let i = 0; i < 5; i++) this.enemy(i * 1.5 + 1.5);
        break;
      }
      case 'meteor':
        for (let i = 0; i < 18; i++) {
          const m = this.make(this.meteor, Meteor);
          m.setSize('large');
          m.node.position.set(Random.range(-half() * 0.95, half() * 0.95), SPAWN_Y, 0);
          m.vx = Random.range(-35, 35) * PX;
          m.vy = -(40 + this.ew() * 3.5 + Random.range(0, 15)) * PX;
          m.delay = i * 0.6 + Random.range(0, 0.4);
        }
        break;
      case 'stealth':
        for (let i = 0; i < count; i++) this.enemy(i * gap + Random.range(0, 0.6) + 1, 1, true);
        this.radarTimer = 0;
        break;
      case 'nuke':
        for (let i = 0; i < 5; i++) {
          const t = this.target();
          this.launchWarhead('nuke', Random.range(-half() * 0.95, half() * 0.95), SPAWN_Y, t.x, 0, Random.range(53 + this.ew() * 6, 75 + this.ew() * 9) * PX, i * 0.9 + Random.range(0, 0.6) + 1);
        }
        this.nukeTimer = 0;
        break;
      default:
        for (let i = 0; i < count; i++) this.enemy(i * gap + Random.range(0, 0.6) + 1);
        if (w >= 8) {
          const sats = 1 + Math.floor((this.ew() - 8) / 4);
          for (let s = 0; s < sats; s++) {
            const sat = this.make(this.satellite, Satellite);
            const dir = s % 2 === 0 ? 1 : -1;
            sat.node.position.set(dir > 0 ? -half() - 3 : half() + 3, SKY * (0.72 + Random.range(0, 0.12)), 0);
            sat.vx = dir * (55 + this.ew() * 5) * PX;
            sat.hp = sat.maxHp = 2;
            sat.bombEvery = Math.max(0.8, 2.4 - this.ew() * 0.04);
            sat.cooldown = 2.4 + Random.range(0, 1.5);
          }
        }
    }
  }

  /** One warhead of the wave's mix, after `delay` seconds. */
  private enemy(delay: number, speedScale = 1, stealth = false): void {
    const w = this.wave;
    const roll = Random.value;
    let kind: WarheadKind = 'normal';
    if (this.phase !== 'title') {
      if (w >= 6 && roll < 0.2) kind = 'mirv';
      else if (w >= 10 && roll < 0.35) kind = 'smart';
    }
    const t = this.target();
    const speed = Random.range(28 + this.ew() * 7, 40 + this.ew() * 10) * PX * speedScale;
    const x = Random.range(-half() * 0.95, half() * 0.95);
    const warhead = this.launchWarhead(kind, x, SPAWN_Y + Random.range(0, 4), t.x, 0, speed, delay, stealth);
    if (kind === 'smart' && !this.flags.smart && this.phase === 'playing') {
      this.flags.smart = true;
      this.sound.announce('vo-smart');
    }
    if (kind === 'mirv') warhead.splitAt = 0.45 + Random.range(0, 0.18);
  }

  private launchWarhead(kind: WarheadKind, x: number, y: number, tx: number, ty: number, speed: number, delay: number, stealth = false): Warhead {
    const prefab = stealth ? this.stealthy : { normal: this.warhead, mirv: this.mirv, smart: this.smart, nuke: this.nuke, bomb: this.bomb }[kind];
    const w = this.make(prefab, Warhead);
    w.kind = kind;
    w.stealth = stealth;
    w.aim(x, y, tx, ty, speed, delay);
    return w;
  }

  private make<T extends Behaviour>(prefab: Prefab | null, type: abstract new () => T): T {
    const node = instantiate(prefab!, { position: [0, 60, 0] });
    const part = node.getComponent(type)!;
    (part as unknown as { game: Theatre }).game = this;
    return part;
  }

  /** Where warheads go: the standing cities and every battery. */
  private targets(): { x: number; y: number }[] {
    return [
      ...this.cities.filter((c) => c.alive).map((c) => ({ x: c.node.position.x, y: 0 })),
      ...this.silos.map((s) => ({ x: s.node.position.x, y: 0 })),
    ];
  }

  private target(): { x: number; y: number } {
    const t = this.targets();
    return t[Random.rangeInt(0, t.length)] ?? { x: Random.range(-half() * 0.9, half() * 0.9), y: 0 };
  }

  // --- the batteries ------------------------------------------------------------------------------------

  private shoot(dt: number): void {
    for (const shot of this.aim.shots.splice(0)) this.fireAt(shot.x, shot.y, shot.silo);
    this.rapidTimer -= dt;
    if (this.rapid && this.aim.held && this.rapidTimer <= 0) {
      this.rapidTimer = 0.22;
      this.fireAt(this.aim.x, this.aim.y, null);
    }
  }

  private nearestSilo(x: number, any = false): Silo | null {
    let best: Silo | null = null;
    let d = Infinity;
    for (const s of this.silos) {
      if (!s.alive || (!any && s.ammo <= 0)) continue;
      const e = Math.abs(s.node.position.x - x);
      if (e < d) {
        d = e;
        best = s;
      }
    }
    return best;
  }

  private fireAt(x: number, y: number, which: number | null): void {
    const chosen = which !== null ? this.silos.find((s) => s.index === which && s.alive && s.ammo > 0) ?? null : this.nearestSilo(x);
    if (!chosen) return this.sound.tick();
    this.launch(chosen, x, Math.max(1, y), false);
    if (!this.flags.ammoLow) {
      const left = this.silos.reduce((n, s) => n + s.ammo, 0);
      const max = this.silos.reduce((n, s) => n + s.ammoMax, 0);
      if (max > 0 && left / max <= 0.2) {
        this.flags.ammoLow = true;
        this.sound.announce('vo-ammo-low');
      }
    }
  }

  private launch(silo: Silo, x: number, y: number, free: boolean): void {
    if (!free) silo.ammo--;
    silo.aimAt(x, y);
    silo.fired();
    const tip = silo.tip();
    const i = this.make(this.interceptor, Interceptor);
    i.launch(tip.x, tip.y, x, y, 15 * (1 + this.tiers.speed * 0.25));
    this.sound.launch();
  }

  private *flak(x: number, y: number) {
    yield new WaitForSeconds(0.25);
    const size = (0.9 + this.tiers.flak * 0.3) * (1 + this.tiers.blast * 0.15);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + Random.range(0, 1);
      this.detonate(x + Math.cos(a) * 1.4, y + Math.sin(a) * 1.4, size, true, true);
    }
  }

  // --- blasts and what they catch ------------------------------------------------------------------------

  private detonate(x: number, y: number, size: number, friendly: boolean, quiet = false): void {
    const b = this.make(friendly ? this.blast : this.hostileBlast, Blast);
    b.node.position.set(x, y, 0);
    b.size = size;
    b.friendly = friendly;
    b.life = friendly ? 1 : 1.2;
    this.burst(friendly ? this.burstAir : this.burstImpact, x, y);
    if (!quiet) {
      this.sound.explosion(friendly ? 1 : 1.2, this.chain || 1);
      this.rig?.impact(friendly ? 0.08 : 0.25);
    }
  }

  private blasts(demo: boolean): void {
    const warheads = findObjectsOfType(Warhead);
    const sats = findObjectsOfType(Satellite);
    const bombers = findObjectsOfType(Bomber);
    const orbitals = findObjectsOfType(Orbital);
    const meteors = findObjectsOfType(Meteor);
    for (const b of findObjectsOfType(Blast)) {
      if (!b.friendly || b.radius <= 0) continue;
      const p = b.node.position;
      const r = b.radius;
      for (const w of warheads) {
        if (!w.alive || w.waiting || b.hit.has(w)) continue;
        const q = w.node.position;
        if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 <= r * r) {
          b.hit.add(w);
          this.killWarhead(w, demo);
        }
      }
      for (const s of sats) this.bossHit(b, s, r + 0.45, demo, 750, 'SATELLITE DOWN!');
      for (const s of bombers) this.bossHit(b, s, r + 0.85, demo, 1000, 'BOMBER DOWN!');
      for (const o of orbitals) if (o.firing <= 0) this.bossHit(b, o, r + 0.7, demo, 1500, 'ORBITAL DESTROYED!');
      for (const m of meteors) {
        if (!m.alive || m.delay > 0 || b.hit.has(m)) continue;
        const q = m.node.position;
        const reach = r + m.radius;
        if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 > reach * reach) continue;
        b.hit.add(m);
        if (m.hurt()) this.meteorBroken(m, demo);
        else this.sound.explosion(0.4, 1);
      }
    }
  }

  private bossHit(b: Blast, s: Satellite | Bomber | Orbital, reach: number, demo: boolean, points: number, label: string): void {
    if (!s.alive || b.hit.has(s)) return;
    const p = b.node.position;
    const q = s.node.position;
    if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 > reach * reach) return;
    b.hit.add(s);
    this.burst(this.burstMetal, q.x, q.y);
    this.sound.explosion(0.6, 1);
    if (!s.hurt()) return;
    destroy(s.node);
    this.detonate(q.x, q.y, 3.4, true);
    this.ring(this.ringFx, q.x, q.y, 10);
    this.rig?.impact(0.6);
    if (demo) return;
    this.award(q.x, q.y + 1, points, label + ' ');
    this.hud.plate(label, `+${points.toLocaleString('en-US')} BONUS`, 1300);
    this.sound.explosion(2, 4);
  }

  private meteorBroken(m: Meteor, demo: boolean): void {
    const q = m.node.position;
    m.alive = false;
    destroy(m.node);
    this.burst(this.burstMeteor, q.x, q.y);
    this.sound.explosion(0.7, 2);
    if (!demo) this.award(q.x, q.y, m.size === 'large' ? 200 : 100);
    if (m.size === 'small') return;
    for (let i = 0; i < 3; i++) {
      const a = ((Math.PI * 2) / 3) * i + Random.range(-0.5, 0.5);
      const piece = this.make(this.meteor, Meteor);
      piece.setSize(m.size === 'large' ? 'medium' : 'small');
      piece.node.position.copy(q);
      piece.vx = Math.cos(a) * (m.size === 'large' ? 35 + Random.range(0, 25) : 50 + Random.range(0, 30)) * PX;
      piece.vy = m.vy * (m.size === 'large' ? 0.8 : 0.7) + Math.sin(a) * 18 * PX - Random.range(0, 18) * PX;
    }
  }

  private killWarhead(w: Warhead, demo: boolean): void {
    const q = w.node.position.clone();
    const nuke = w.kind === 'nuke';
    w.kill();
    if (nuke) {
      this.burst(this.burstNuke, q.x, q.y);
      this.rig?.impact(1);
      this.hud.flash('white');
      this.sound.nuke();
    } else this.burst(this.burstKill, q.x, q.y);
    if (demo) return;
    const gain = 1 + Math.max(0, this.chain - 1) * 0.35;
    const base = nuke ? 300 : w.kind === 'smart' ? 240 : w.kind === 'mirv' ? 180 : 100;
    this.award(q.x, q.y, base * gain, '', this.chain >= 2);
    this.chain++;
    this.chainWindow = 1.2;
    if (this.chain >= 2) this.hud.chain(this.chain, gain);
    this.sound.combo(this.chain);
    if (this.chain === 5 && !this.flags.chain) {
      this.flags.chain = true;
      this.sound.announce('vo-chain');
    }
  }

  private award(x: number, y: number, points: number, prefix = '', hot = false): void {
    const gain = Math.round(points);
    this.score += gain;
    this.hud.score(this.score);
    this.hud.hi(Math.max(this.best, this.score));
    this.hud.popup(`${prefix}+${gain.toLocaleString('en-US')}`, x, y, this.camera, hot ? 'hot' : '');
    this.checkBonus();
  }

  /** Every 12,000 points: a fallen city rebuilt, or 1,000 more when every city stands. */
  private checkBonus(): void {
    while (this.score >= this.nextBonus) {
      this.nextBonus += BONUS_EVERY;
      const dead = this.cities.find((c) => !c.alive);
      if (dead) {
        dead.rebuild();
        this.hud.plate('BONUS CITY', 'A CITY RISES FROM THE ASH', 1600);
        this.sound.fanfare();
      } else {
        this.score += 1000;
        this.hud.plate('BONUS', '+1,000 — EVERY CITY STANDING', 1400);
      }
      this.updateCities();
    }
  }

  // --- what reaches the ground -----------------------------------------------------------------------

  private groundHit(x: number, size: number): void {
    this.detonate(x, 0.3, size, false);
    this.rig?.impact(0.35);
    if (this.phase === 'title') {
      for (const c of this.cities) if (c.alive && Math.abs(c.node.position.x - x) < world.width * 0.05) this.cityFalls(c, true);
      return;
    }
    for (const c of this.cities) if (c.alive && Math.abs(c.node.position.x - x) < world.width * 0.05) this.cityFalls(c);
    for (const s of this.silos) if (Math.abs(s.node.position.x - x) < world.width * 0.04) this.siloFalls(s);
  }

  private nukeLands(x: number): void {
    this.detonate(x, 0.4, 130 * PX * 1.4, false);
    this.burst(this.burstNuke, x, 0.6);
    this.ring(this.ringFx, x, 0.4, 14);
    this.rig?.impact(1);
    this.hud.flash('white');
    this.sound.nuke();
    const reach = 130 * PX;
    for (const c of this.cities) if (c.alive && Math.abs(c.node.position.x - x) < reach) this.cityFalls(c, this.phase === 'title');
    if (this.phase !== 'title') for (const s of this.silos) if (Math.abs(s.node.position.x - x) < reach) this.siloFalls(s);
  }

  private *beamStrike(city: City | null) {
    yield new WaitForSeconds(1.5);
    if (city?.alive) this.cityFalls(city);
  }

  private cityFalls(c: City, demo = false): void {
    const shielded = c.shields > 0;
    if (!c.hit()) {
      if (shielded) {
        this.ring(this.ringFx, c.node.position.x, 1, 4);
        this.hud.popup('SHIELD HELD', c.node.position.x, 2.2, this.camera, 'cold');
        this.updateCities();
      }
      return;
    }
    const p = c.node.position;
    this.burst(this.burstRubble, p.x, 0.8);
    this.sound.cityCrash();
    this.rig?.impact(0.5);
    if (demo) return;
    this.hud.flash('bad');
    this.updateCities();
    const alive = this.cities.filter((k) => k.alive).length;
    if (alive === 1) this.sound.announce('vo-last-city', true);
    else if (alive > 1) this.sound.announce('cityLost', true);
    if (!alive) this.gameOver();
  }

  private siloFalls(s: Silo): void {
    const was = s.alive && s.ammo > 0;
    s.knockOut();
    this.burst(this.burstImpact, s.node.position.x, 0.6);
    if (was) this.sound.announce('vo-base-down');
  }

  private updateCities(): void {
    this.hud.cities(this.cities.map((c) => c.alive), this.cities.map((c) => c.shields));
  }

  // --- warheads in flight -------------------------------------------------------------------------------

  /** Smart warheads veer from blasts toward the nearest city; MIRVs split; the whistle when one comes in. */
  private steer(dt: number): void {
    const blasts = findObjectsOfType(Blast).filter((b) => b.friendly);
    const live = this.cities.filter((c) => c.alive);
    for (const w of findObjectsOfType(Warhead)) {
      if (!w.alive || w.waiting) continue;
      const p = w.node.position;
      if (!w.whistled && p.y < SKY) {
        w.whistled = true;
        this.sound.whistle();
      }
      if (w.kind === 'smart' && live.length) {
        const near = blasts.find((b) => Math.hypot(b.node.position.x - p.x, b.node.position.y - p.y) < b.radius + 3.4);
        if (near) w.tx += Math.sign(p.x - near.node.position.x) * 1.1 * dt;
        const city = live.reduce((a, c) => (Math.abs(c.node.position.x - p.x) < Math.abs(a.node.position.x - p.x) ? c : a), live[0]!);
        w.tx += (city.node.position.x - w.tx) * dt * 0.8;
      }
      if (w.kind === 'mirv' && !w.split && w.progress > w.splitAt) {
        w.split = true;
        if (!this.flags.mirv) {
          this.flags.mirv = true;
          this.sound.announce('mirv');
        }
        for (let i = 0; i < 2 + (this.wave > 12 ? 1 : 0); i++) {
          const t = live[Random.rangeInt(0, live.length)];
          const tx = (t ? t.node.position.x : Random.range(-half(), half())) + Random.range(-2, 2);
          this.launchWarhead('normal', p.x, p.y, tx, 0, w.speed * 1.1, 0);
        }
        this.burst(this.burstKill, p.x, p.y);
        this.sound.whistle();
      }
    }
  }

  private bossTick(dt: number): void {
    if (this.boss === 'stealth') {
      this.radarTimer += dt;
      if (this.radarTimer >= 2) {
        this.radarTimer = 0;
        this.ring(this.radar, 0, 0.2, 34, 1.5);
        this.sound.ping();
      }
      // The sweep's front runs out at ~23 units a second; anything it crosses shows for a moment.
      const front = (this.radarTimer / 1.5) * 34;
      for (const w of findObjectsOfType(Warhead)) {
        if (!w.stealth || !w.alive) continue;
        const d = w.node.position.length();
        if (Math.abs(d - front) < 1.2) w.revealed = 0.45;
      }
    }
    if (this.boss === 'nuke' && findObjectsOfType(Warhead).some((w) => w.kind === 'nuke' && w.alive)) {
      this.nukeTimer += dt;
      if (this.nukeTimer > 0.8) {
        this.nukeTimer = 0;
        this.enemy(Random.range(0, 0.3));
      }
    }
  }

  private threats(): void {
    const list = findObjectsOfType(Warhead)
      .filter((w) => w.alive && (w.waiting ? w.delay < 1.4 : w.node.position.y > SKY + 0.6) && (!w.stealth || w.revealed > 0))
      .map((w) => ({ x: w.node.position.x, y: SKY + 1, kind: w.kind }));
    this.hud.threats(list, this.camera);
  }

  private checkCleared(dt: number): void {
    const active =
      findObjectsOfType(Warhead).some((w) => w.alive) ||
      findObjectsOfType(Satellite).some((s) => s.alive) ||
      findObjectsOfType(Bomber).some((s) => s.alive) ||
      findObjectsOfType(Orbital).some((s) => s.alive) ||
      findObjectsOfType(Meteor).some((s) => s.alive);
    this.quiet = active ? 0 : this.quiet + dt;
    if (this.quiet > 1) {
      this.quiet = 0;
      this.startCoroutine(this.tally());
    }
  }

  // --- between waves -----------------------------------------------------------------------------------

  private *tally() {
    this.phase = 'tally';
    this.hud.threats([], null);
    this.sound.announce('secure');
    const cities = this.cities.filter((c) => c.alive).length;
    const ammo = this.silos.reduce((n, s) => n + (s.alive ? s.ammo : 0), 0);
    const state = { cities: 0, cityPoints: 0, ammo: 0, ammoPoints: 0 };
    this.hud.tally(state);
    yield new WaitForSeconds(0.5);
    for (let i = 0; i < cities; i++) {
      state.cities++;
      state.cityPoints += 150;
      this.score += 150;
      this.hud.score(this.score);
      this.hud.tally(state);
      this.sound.coin(i);
      yield new WaitForSeconds(0.12);
    }
    for (let i = 0; i < ammo; i += 3) {
      const batch = Math.min(3, ammo - i);
      state.ammo += batch;
      state.ammoPoints += batch * 8;
      this.score += batch * 8;
      for (const s of this.silos) if (s.ammo > 0) {
        s.ammo = Math.max(0, s.ammo - batch);
        break;
      }
      this.hud.score(this.score);
      this.hud.tally(state);
      this.sound.coin(8 + i / 3);
      yield new WaitForSeconds(0.04);
    }
    this.checkBonus();
    yield new WaitForSeconds(1.1);
    this.hud.tally(null);
    for (let i = 0; i < 6; i++) {
      const fw = this.fireworks[i % this.fireworks.length];
      this.burst(fw ?? null, Random.range(-half() * 0.8, half() * 0.8), SKY * Random.range(0.55, 0.85));
    }
    this.sound.fanfare();
    yield new WaitForSeconds(0.8);
    while ((this.phase as Phase) === 'paused') yield null;
    if ((this.phase as Phase) !== 'tally') return;
    const bossWave = this.boss !== null;
    this.wave++;
    if (bossWave) this.offerArsenal();
    else {
      this.phase = 'playing';
      this.startWave();
    }
  }

  private offerArsenal(): void {
    const open = (Object.keys(UPGRADES) as Upgrade[]).filter((u) => this.tiers[u] < UPGRADES[u].max && (u !== 'rebuild' || this.cities.some((c) => !c.alive)));
    const picks: Upgrade[] = [];
    while (picks.length < 3 && open.length) picks.push(open.splice(Random.rangeInt(0, open.length), 1)[0]!);
    this.offered = picks;
    this.phase = 'arsenal';
    this.sound.pick();
    const cards: Card[] = picks.map((u) => ({ id: u, title: UPGRADES[u].title + (UPGRADES[u].max < 10 && this.tiers[u] ? ` · ${this.tiers[u] + 1}` : ''), text: UPGRADES[u].text(this.tiers[u]) }));
    this.hud.arsenal(cards, `BOSS WAVE ${this.wave - 1} REPELLED · CHOOSE ONE FOR THE ARSENAL`);
  }

  private choose(u: Upgrade): void {
    this.tiers[u]++;
    if (u === 'aegis') {
      const exposed = this.cities.filter((c) => c.alive).sort((a, b) => a.shields - b.shields || Math.abs(a.node.position.x) - Math.abs(b.node.position.x)).slice(0, 2);
      for (const c of exposed) {
        c.shields++;
        this.showShield(c);
      }
    }
    if (u === 'rebuild') this.cities.find((c) => !c.alive)?.rebuild();
    this.hud.arsenal(null);
    this.updateCities();
    this.sound.fanfare();
    this.hud.plate(UPGRADES[u].title, 'ADDED TO THE ARSENAL', 1300);
    this.renderArsenal();
    this.phase = 'playing';
    this.startWave();
  }

  private showShield(c: City): void {
    if (c.shield) c.shield.visible = c.alive && c.shields > 0;
  }

  private renderArsenal(): void {
    const parts = (Object.keys(this.tiers) as Upgrade[]).filter((u) => this.tiers[u] && u !== 'rebuild' && u !== 'aegis').map((u) => `${UPGRADES[u].title} ${this.tiers[u]}`);
    this.hud.effects(parts.join(' · '));
  }

  // --- the end of a run --------------------------------------------------------------------------------

  private gameOver(): void {
    this.phase = 'over';
    this.hud.threats([], null);
    this.hud.intro('THE SIEGE IS LOST', `SCORE ${this.score.toLocaleString('en-US')}`, `WAVE ${this.wave}`, true);
    this.sound.setMusic(true, 0.42);
    this.startCoroutine(this.toBoard());
  }

  private *toBoard() {
    yield new WaitForSecondsRealtime(2.4);
    this.board.submit(this.score, this.wave, () => this.hud.banner('DEFENSE LOST', 'TAP FOR THE TITLE SCREEN', 'bad'));
  }

  private toTitle(): void {
    this.phase = 'title';
    this.hud.banner(null);
    this.hud.tally(null);
    this.hud.arsenal(null);
    this.hud.playing(false);
    this.hud.effects('');
    this.clearSky();
    for (const c of this.cities) {
      c.shields = 0;
      if (!c.alive) c.rebuild();
    }
    for (const s of this.silos) s.refill(15);
    this.sky.preset(0);
    this.sky.warn('#000000', 0);
    this.aim.demo = true;
    this.sound.setMusic(true, 0.42);
    this.refreshLeaders();
  }

  private pause(on: boolean): void {
    if (on && (this.phase === 'playing' || this.phase === 'tally')) {
      this.resumeTo = this.phase;
      this.phase = 'paused';
      Time.timeScale = 0;
      this.hud.pauseMenu(`WAVE ${this.wave} · SCORE ${this.score.toLocaleString('en-US')}`);
    } else if (!on && this.phase === 'paused') {
      this.phase = this.resumeTo;
      Time.timeScale = 1;
      this.hud.pauseMenu(null);
    }
  }

  private resumeTo: Phase = 'playing';

  /** Leaving from the pause menu: to the title, or out to the Missile Command editions. A top-ten score is still saved. */
  private endRun(where: 'title' | 'quit'): void {
    if (this.phase !== 'paused') return;
    this.hud.pauseMenu(null);
    this.phase = 'over';
    Time.timeScale = 1;
    this.hud.threats([], null);
    const leave = () => (where === 'title' ? this.toTitle() : window.location.assign('../../../missile-command/'));
    if (this.score > 0) this.board.submit(this.score, this.wave, leave);
    else leave();
  }

  private toggleFire(): void {
    this.rapid = !this.rapid;
    try {
      localStorage.setItem(FIRE_KEY, this.rapid ? '1' : '0');
    } catch {
      // not remembered
    }
    this.hud.fireMode(this.rapid);
    this.sound.tick();
    if (this.phase === 'playing') this.hud.plate(this.rapid ? 'HOLD FOR RAPID FIRE' : 'ONE SHOT A TAP', 'FIRE MODE', 900);
  }

  private cycleDifficulty(): void {
    const order: Difficulty[] = ['easy', 'normal', 'hard'];
    this.difficulty = order[(order.indexOf(this.difficulty) + 1) % order.length]!;
    try {
      localStorage.setItem(DIFF_KEY, this.difficulty);
    } catch {
      // not remembered
    }
    this.hud.difficulty(this.difficulty);
    this.sound.tick();
  }

  private refreshLeaders(): void {
    const el = document.getElementById('title-scores');
    const local = localTop();
    this.best = Math.max(this.best, local[0]?.score ?? 0);
    this.hud.hi(this.best);
    if (el) renderTitle(el, local, undefined);
    void globalTop().then((global) => {
      this.best = Math.max(this.best, global?.[0]?.score ?? 0);
      this.hud.hi(Math.max(this.best, this.score));
      if (el) renderTitle(el, localTop(), global);
    });
  }

  // --- looks -----------------------------------------------------------------------------------------

  private burst(prefab: Prefab | null, x: number, y: number): void {
    if (prefab) instantiate(prefab, { position: [x, y, 0.3] });
  }

  private ring(prefab: Prefab | null, x: number, y: number, size: number, seconds = 0.7): void {
    if (!prefab) return;
    const node: Object3D = instantiate(prefab, { position: [x, y, -0.1] });
    const ring = node.getComponent(Shockwave);
    if (ring) {
      ring.size = size;
      ring.seconds = seconds;
    }
  }
}

export type { Mesh };
