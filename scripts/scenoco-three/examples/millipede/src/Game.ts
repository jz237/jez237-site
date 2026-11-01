import { Color, Fog, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';
import {
  Behaviour, Input, KeyCode, Random, SceneManager, Time, WaitForSeconds, WaitForSecondsRealtime, destroy,
  findObjectOfType, findObjectsOfType, instantiate, type Prefab,
} from '@scenoco-three/core';
import { createScoreBoard, type ScoreBoard } from '../../../jez237/scores';
import type { SegKind } from './assets';
import { CameraRig } from './CameraRig';
import { Bee, Enemy, Flea, Inchworm, Scorpion, Spider, Spore, type Arena } from './Enemy';
import { Field, type Shroom } from './Field';
import { COLS, LEFT, RIGHT, TOP, ZONE_TOP, cellX, cellY, colAt, rowAt } from './grid';
import { Hud, type Chip } from './Hud';
import { globalTop, localTop, renderTitle } from './Leaders';
import { Bolt, Drone, NeonFlicker, Pickup, Shockwave } from './misc';
import { Player } from './Player';
import { Sound } from './Sound';
import { Swarm, type Chain, type QueenVariant } from './Swarm';

export type Phase = 'title' | 'playing' | 'upgrade' | 'paused' | 'over';
type Power = Pickup['power'];
type Path = 'volley' | 'lance' | 'drone';

const VERSION = 'v3.0.4';
const EXTRA_LIFE_EVERY = 60000;
const MAX_LIVES = 5;
const MAX_BOMBS = 3;

const POWERS: Record<Power, { label: string; duration: number; weight: number }> = {
  spread: { label: 'SPREAD', duration: 10, weight: 1.2 },
  laser: { label: 'LASER', duration: 5, weight: 1 },
  shield: { label: 'SHIELD', duration: 8, weight: 1 },
  frost: { label: 'FROST', duration: 6, weight: 1 },
  score: { label: '2× SCORE', duration: 10, weight: 1 },
};

const PATHS: Record<Path, { name: string; desc: string[] }> = {
  volley: { name: 'VOLLEY', desc: ['Twin side bolts join your shot.', 'Side bolts fan wider and hit harder.', 'LOCKED IN: five-bolt storm.', 'Storm bolts sharpen further.'] },
  lance: { name: 'LANCE', desc: ['Centre bolt pierces one extra segment.', 'Heavier bolt, quicker cycle.', 'LOCKED IN: pierces three, fires faster.', 'Lance overclocks.'] },
  drone: { name: 'DRONE', desc: ['An escort drone orbits and fires.', 'Drone fires faster.', 'LOCKED IN: twin drone escort.', 'Drones overclock.'] },
};

const QUEENS: Record<QueenVariant, { label: string; tell: string }> = {
  splitter: { label: 'SPLITTER QUEEN', tell: 'BREAKS INTO SWARMLETS' },
  shielded: { label: 'SHIELDED QUEEN', tell: 'ONLY THE HEAD IS SOFT — BOMBS CRACK ARMOUR' },
  spitter: { label: 'SPITTER QUEEN', tell: 'LOBS POISON SPORES — SHOOT THEM DOWN' },
};

/** Every five waves the garden changes colour: the grid, the tubes, the dark around it. */
const BIOMES = [
  { name: 'TEAL DEPTHS', grid: '#2f6bff', tube: '#38e1ff', sky: '#02040a' },
  { name: 'MAGENTA DUSK', grid: '#a83bff', tube: '#ff4fd8', sky: '#07020d' },
  { name: 'EMBER FIELDS', grid: '#ff5a2a', tube: '#ffb347', sky: '#0b0402' },
];

/**
 * The rules of a run: the waves and what each sends, the gunner's guns, every hit and what it is worth,
 * power-ups, the smart bomb, the paths chosen between queens, lives, and the title screen's demo behind
 * it all. Bolts are moved here, a few small steps a frame, so not even the fastest can pass through a
 * mushroom; the millipedes walk in `Swarm`, the mushrooms stand in `Field`.
 */
export class Game extends Behaviour implements Arena {
  bolt: Prefab | null = null;
  heavyBolt: Prefab | null = null;
  droneBolt: Prefab | null = null;
  spider: Prefab | null = null;
  flea: Prefab | null = null;
  bee: Prefab | null = null;
  scorpion: Prefab | null = null;
  inchworm: Prefab | null = null;
  spore: Prefab | null = null;
  drone: Prefab | null = null;
  shockwave: Prefab | null = null;
  goldwave: Prefab | null = null;
  pickupSpread: Prefab | null = null;
  pickupLaser: Prefab | null = null;
  pickupShield: Prefab | null = null;
  pickupFrost: Prefab | null = null;
  pickupScore: Prefab | null = null;
  burstSegment: Prefab | null = null;
  burstQueen: Prefab | null = null;
  burstChild: Prefab | null = null;
  burstArmor: Prefab | null = null;
  burstShroom: Prefab | null = null;
  burstPoison: Prefab | null = null;
  burstSpider: Prefab | null = null;
  burstBug: Prefab | null = null;
  burstScorpion: Prefab | null = null;
  burstInchworm: Prefab | null = null;
  burstPickup: Prefab | null = null;
  burstPlayer: Prefab | null = null;
  spark: Prefab | null = null;
  backdrop: Mesh | null = null;
  tubes: Object3D | null = null;

  phase: Phase = 'title';
  score = 0;
  lives = 3;
  wave = 0;
  bombs = 1;

  private field!: Field;
  private swarm!: Swarm;
  private player!: Player;
  private sound!: Sound;
  private rig: CameraRig | null = null;
  private hud!: Hud;
  private board!: ScoreBoard;

  private readonly bolts: Bolt[] = [];
  private readonly drones: Drone[] = [];
  private readonly powers: Record<Power, number> = { spread: 0, laser: 0, shield: 0, frost: 0, score: 0 };
  private readonly paths: Record<Path, number> = { volley: 0, lance: 0, drone: 0 };
  private pathLock: Path | null = null;
  private combo = 0;
  private comboTimer = 0;
  private slowTimer = 0;
  private fireTimer = 0;
  private laserTick = 0;
  private laserSound = 0;
  private shroomSound = 0;
  private nextLife = EXTRA_LIFE_EVERY;
  private pity = 0;
  private clearing = false;
  private dying = false;
  private awaitingTitle = false;
  private biome = -1;
  /** Seconds the swarm has had nothing on screen to shoot. */
  private unseen = 0;
  /** The best score anyone has — the global board's top, or this device's, whichever is higher. */
  private best = 0;
  private spawn = { spider: 3.5, flea: 6, scorpion: 9, bee: 14, inchworm: 22, side: 6, demoSpider: 6 };

  // --- Arena: what an enemy asks of the game -------------------------------------------------

  get slow(): number {
    return (this.powers.frost > 0 ? 0.55 : 1) * (this.slowTimer > 0 ? 0.55 : 1);
  }

  get playerX(): number {
    return this.player.node.position.x;
  }

  get playerY(): number {
    return this.player.node.position.y;
  }

  enemyLanded(): void {
    this.sound.play('tick');
  }

  // --- setting up ---------------------------------------------------------------------------

  override awake(): void {
    this.field = findObjectOfType(Field)!;
    this.swarm = findObjectOfType(Swarm)!;
    this.player = findObjectOfType(Player)!;
    this.sound = findObjectOfType(Sound)!;
    this.hud = new Hud();
    this.board = createScoreBoard({
      // Its own board: the Classic edition keeps `neon-myriapod`.
      game: 'millipede-neon',
      title: 'MILLIPEDE · NEON 3D',
      levelLabel: 'WAVE',
      accent: '#2ff5d2',
      accent2: '#ffa21c',
      panel: 'linear-gradient(160deg,rgba(10,28,40,.95),rgba(4,6,16,.97))',
      font: 'Orbitron, sans-serif',
    });
    this.refreshLeaders();
    const scores = document.getElementById('scores-button');
    scores?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.board.open();
    });
    this.listen(this.swarm.killed, (x, y, kind, head, last) => this.segmentKilled(x, y, kind, head, last));
    this.listen(this.swarm.spat, (x, y) => this.spit(x, y));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.phase === 'playing') this.pause(true);
    });
  }

  override start(): void {
    this.rig = findObjectOfType(CameraRig);
    this.field.grow(0.14);
    this.setBiome(0);
    this.hud.sound(this.sound.muted);
    this.hud.playing(false);
    this.hud.lives(this.lives);
    this.hud.bombs(this.bombs);
    this.hud.score(0);
    this.hud.wave(1);
    document.getElementById('version')!.textContent = `Millipede · ${VERSION}`;
  }

  // --- every frame --------------------------------------------------------------------------

  override update(dt: number): void {
    this.hud.portrait(innerHeight > innerWidth);
    this.controls();
    this.sound.music(this.phase === 'title' || this.phase === 'over' ? 'musicTitle' : this.swarm.queenAlive ? 'musicBoss' : 'musicGame');
    if (this.phase === 'title') return this.demo(dt);
    if (this.phase !== 'playing') return;

    this.slowTimer = Math.max(0, this.slowTimer - dt);
    this.swarm.speedScale = this.slow;
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    if (this.comboTimer <= 0 && this.combo > 0) this.combo = Math.max(0, this.combo - dt * 6);
    this.hud.combo(this.multiplier, this.combo);
    this.powersTick(dt);
    this.guns(dt);
    this.spawns(dt);
    this.unseen = this.swarm.chains.length && !this.swarm.visibleCount ? this.unseen + dt : 0;
    if (this.unseen > 6) {
      this.swarm.clear();
      this.unseen = 0;
    }
    if (!this.swarm.chains.length && !this.clearing) this.startCoroutine(this.waveCleared());
  }

  override lateUpdate(dt: number): void {
    this.moveBolts(dt);
    if (this.phase === 'playing') {
      this.laser(dt);
      this.catchPickups();
      this.collide();
    }
  }

  private controls(): void {
    if (Input.getButtonDown('Sound') || Input.getKeyDown(KeyCode.M)) this.hud.sound(this.sound.toggleMute());
    if (this.board.isOpen) return;
    const go = Input.getButtonDown('Continue') || Input.getKeyDown(KeyCode.Return) || Input.getKeyDown(KeyCode.JoystickButton0);
    switch (this.phase) {
      case 'title':
        if (Input.getButtonDown('Play') || Input.getKeyDown(KeyCode.Return) || Input.getKeyDown(KeyCode.Space) || Input.getKeyDown(KeyCode.JoystickButton9) || Input.getKeyDown(KeyCode.JoystickButton0)) this.begin();
        break;
      case 'playing':
        if (Input.getButtonDown('Bomb') || Input.getKeyDown(KeyCode.Space) || Input.getKeyDown(KeyCode.B) || Input.getKeyDown(KeyCode.JoystickButton2)) this.bomb();
        if (Input.getButtonDown('Pause') || Input.getKeyDown(KeyCode.P) || Input.getKeyDown(KeyCode.Escape) || Input.getKeyDown(KeyCode.JoystickButton9)) this.pause(true);
        break;
      case 'paused':
        if (Input.getButtonDown('MainMenu') || Input.getKeyDown(KeyCode.Q)) this.endRun('title');
        else if (Input.getButtonDown('QuitGame')) this.endRun('quit');
        else if (Input.getButtonDown('Resume') || Input.getButtonDown('Pause') || Input.getKeyDown(KeyCode.P) || Input.getKeyDown(KeyCode.Escape) || Input.getKeyDown(KeyCode.Space) || Input.getKeyDown(KeyCode.JoystickButton9)) this.pause(false);
        break;
      case 'upgrade': {
        const picks: [Path, string, KeyCode][] = [['volley', 'Volley', KeyCode.Alpha1], ['lance', 'Lance', KeyCode.Alpha2], ['drone', 'Drone', KeyCode.Alpha3]];
        for (const [path, button, key] of picks) if (Input.getButtonDown(button) || Input.getKeyDown(key)) this.choose(path);
        break;
      }
      case 'over':
        if (this.awaitingTitle && (go || Input.getKeyDown(KeyCode.Space))) this.toTitle();
        break;
    }
  }

  // --- the title screen's demo --------------------------------------------------------------

  private demo(dt: number): void {
    this.swarm.speedScale = 1;
    if (!this.swarm.chains.length) this.swarm.spawn({ length: 12, speed: 2.6 });
    if (this.field.count < 40) this.field.grow(0.14, 12);
    this.spawn.demoSpider -= dt;
    if (this.spawn.demoSpider <= 0) {
      this.spawn.demoSpider = Random.range(7, 11);
      this.makeSpider();
    }
    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fireTimer = 0.24;
      this.shoot(true);
    }
  }

  // --- a run --------------------------------------------------------------------------------

  private begin(): void {
    this.sound.unlock();
    this.sound.play('start');
    this.clearAll();
    this.field.clear();
    this.field.grow(0.15);
    this.score = 0;
    this.lives = 3;
    this.wave = 0;
    this.bombs = 1;
    this.combo = 0;
    this.comboTimer = 0;
    this.slowTimer = 0;
    this.nextLife = EXTRA_LIFE_EVERY;
    this.pity = 0;
    this.clearing = false;
    this.dying = false;
    this.awaitingTitle = false;
    this.pathLock = null;
    for (const k of Object.keys(this.powers) as Power[]) this.powers[k] = 0;
    for (const k of Object.keys(this.paths) as Path[]) this.paths[k] = 0;
    this.spawn = { spider: 3.5, flea: 6, scorpion: 9, bee: 14, inchworm: 22, side: 6, demoSpider: 6 };
    this.player.demo = false;
    this.player.hidden = false;
    this.player.home();
    this.player.invulnerable = 1.2;
    this.phase = 'playing';
    Time.timeScale = 1;
    this.hud.playing(true);
    this.hud.banner(null);
    this.hud.score(0);
    this.hud.lives(this.lives);
    this.hud.bombs(this.bombs);
    this.syncDrones();
    this.startWave();
  }

  private clearAll(): void {
    this.swarm.clear();
    for (const e of findObjectsOfType(Enemy)) destroy(e.node);
    for (const p of findObjectsOfType(Pickup)) destroy(p.node);
    for (const b of this.bolts) destroy(b.node);
    this.bolts.length = 0;
  }

  private startWave(): void {
    this.wave++;
    const w = this.wave;
    const late = Math.max(0, w - 12);
    this.hud.wave(w);
    this.setBiome(Math.floor((w - 1) / 5) % BIOMES.length);
    if (w > 1) this.field.grow(Math.min(0.2, 0.13 + w * 0.005), 10);
    this.swarm.spawn({ length: Math.min(24, 10 + w + Math.floor(late / 3)), speed: Math.min(9, 2 + w * 0.36 + late * 0.15) });
    if (w >= 3) this.swarm.spawn({ length: Math.min(22, 7 + w + Math.floor(late / 4)), speed: Math.min(9.5, 2.5 + w * 0.32 + late * 0.15) });
    if (w >= 16) this.swarm.spawn({ length: Math.min(18, 6 + Math.floor(w * 0.48)), speed: Math.min(10, 2.8 + w * 0.23 + late * 0.2) });
    let name = w >= 26 ? 'OVERDRIVE' : w >= 16 ? 'INFESTATION' : w === 3 ? 'POISON RUN' : w === 2 ? 'SPIDER SPORE' : 'CLASSIC CRAWL';
    let tell = w >= 26 ? 'EXTRA LANES · FAST PESTS' : w >= 16 ? 'MORE LANES · DENSER FIELD' : w === 3 ? 'SCORPIONS POISON THE FIELD' : w === 2 ? 'SPIDERS ENTER FROM THE EDGES' : 'CLEAR LANES · BUILD RHYTHM';
    if (w % 4 === 0) {
      const variant: QueenVariant = w <= 4 ? 'splitter' : (['splitter', 'shielded', 'spitter'] as const)[Random.rangeInt(0, 3)]!;
      const length = Math.min(26, 13 + Math.floor(w * 0.72) + Math.floor(late / 5));
      this.swarm.spawn({
        kind: variant === 'shielded' ? 'armored' : 'queen',
        variant,
        length: variant === 'shielded' ? Math.max(8, length - 4) : length,
        speed: Math.min(7, 1.55 + w * 0.18 + late * 0.1),
        hpBoost: Math.min(3, Math.floor(late / 8)),
      });
      name = QUEENS[variant].label;
      tell = QUEENS[variant].tell;
      this.drop(0, 9, w >= 8 ? 'shield' : 'frost');
      this.sound.play('queenWarn');
      this.rig?.impact(0.5);
      this.hud.flash('gold');
    } else {
      this.sound.play('wave');
    }
    if (w === 2) this.drop(0, 12, 'spread');
    const biome = BIOMES[Math.floor((w - 1) / 5) % BIOMES.length]!;
    this.hud.intro(`WAVE ${w}${w > 1 && (w - 1) % 5 === 0 ? ' · ' + biome.name : ''}`, name, tell);
  }

  private *waveCleared() {
    this.clearing = true;
    const p = this.player.node.position;
    this.award(p.x, p.y + 1.6, 50 * this.wave, 'WAVE CLEAR ');
    yield new WaitForSeconds(1.3);
    if (this.phase !== 'playing') {
      yield new WaitForSecondsRealtime(0.1);
    }
    while (this.phase === 'paused') yield null;
    if (this.phase === 'playing' && this.wave % 4 === 0) this.offerUpgrade();
    else if (this.phase === 'playing') this.startWave();
    this.clearing = false;
  }

  // --- upgrades between queens ----------------------------------------------------------------

  private offerUpgrade(): void {
    this.phase = 'upgrade';
    Time.timeScale = 0;
    this.sound.play('pickup');
    const cards = (Object.keys(PATHS) as Path[]).map((id) => {
      const tier = this.paths[id];
      const closed = this.pathLock !== null && id !== this.pathLock;
      return {
        id,
        title: `${PATHS[id].name} · ${'●'.repeat(Math.min(tier, 4))}${'○'.repeat(Math.max(0, 3 - tier))}${tier >= 3 ? ' ★' : ''}`,
        text: closed ? 'Path closed — you are committed.' : PATHS[id].desc[Math.min(tier, 3)]!,
        closed,
      };
    });
    this.hud.upgrade(cards, `WAVE ${this.wave} CLEARED · PICK ONE · A SMART BOMB COMES WITH IT`);
  }

  private choose(path: Path): void {
    if (this.pathLock && path !== this.pathLock) return this.sound.play('tick');
    this.paths[path]++;
    if (!this.pathLock && this.paths[path] >= 3) this.pathLock = path;
    this.bombs = Math.min(MAX_BOMBS, this.bombs + 1);
    this.hud.bombs(this.bombs);
    this.hud.upgrade(null);
    this.phase = 'playing';
    Time.timeScale = 1;
    this.sound.play('oneup');
    const p = this.player.node.position;
    this.hud.popup(`${PATHS[path].name} TIER ${this.paths[path]}`, p.x, p.y + 2, 0.5, this.camera, 'big');
    this.syncDrones();
    this.startWave();
  }

  private syncDrones(): void {
    const want = this.paths.drone >= 3 ? 2 : this.paths.drone >= 1 ? 1 : 0;
    while (this.drones.length < want) {
      const drone = instantiate(this.drone!, { position: this.player.node.position.clone() }).getComponent(Drone)!;
      drone.index = this.drones.length;
      this.drones.push(drone);
    }
    while (this.drones.length > want) destroy(this.drones.pop()!.node);
  }

  // --- guns ---------------------------------------------------------------------------------

  private guns(dt: number): void {
    const p = this.player.node.position;
    for (const drone of this.drones) {
      drone.follow(p.x, p.y, dt, this.paths.drone);
      drone.cooldown -= dt;
      if (drone.cooldown <= 0 && !this.dying) {
        drone.cooldown = Math.max(0.3, 0.6 - this.paths.drone * 0.06);
        this.fire(this.droneBolt, drone.node.position.x, drone.node.position.y + 0.3, 0, 30, 1, 1, 0, true);
      }
    }
    if (this.dying) return;
    this.fireTimer -= dt;
    if (this.fireTimer > 0) return;
    this.fireTimer = Math.max(0.045, 0.088 - Math.min(10, this.wave) * 0.0018 - this.paths.lance * 0.006);
    this.shoot(false);
  }

  private shoot(demo: boolean): void {
    const p = this.player.node.position;
    const x = p.x;
    const y = p.y + 0.7;
    const lv = demo ? 0 : this.paths.volley;
    const ll = demo ? 0 : this.paths.lance;
    const damage = 1 + (ll >= 2 ? 1 : 0);
    const pierce = Math.min(3, ll);
    if (this.powers.spread > 0) {
      this.fire(this.heavyBolt, x, y + 0.1, 0, 33, damage + 1, 3, pierce);
      this.fire(this.bolt, x - 0.3, y, -(5 + lv * 1.2), 31, 1, 2, 0);
      this.fire(this.bolt, x + 0.3, y, 5 + lv * 1.2, 31, 1, 2, 0);
    } else {
      this.fire(ll >= 2 ? this.heavyBolt : this.bolt, x, y, 0, 32, damage, 2 + (ll >= 1 ? 1 : 0), pierce);
      if (lv >= 1) {
        const spread = 3.4 + lv * 1.2;
        this.fire(this.bolt, x - 0.3, y - 0.1, -spread, 31, lv >= 2 ? 2 : 1, 2, 0);
        this.fire(this.bolt, x + 0.3, y - 0.1, spread, 31, lv >= 2 ? 2 : 1, 2, 0);
        if (lv >= 3) {
          this.fire(this.bolt, x - 0.45, y - 0.2, -spread * 1.8, 29, 1, 1, 0);
          this.fire(this.bolt, x + 0.45, y - 0.2, spread * 1.8, 29, 1, 1, 0);
        }
      }
    }
    this.player.kick();
    this.sound.play('shot', x);
  }

  private fire(prefab: Prefab | null, x: number, y: number, vx: number, vy: number, damage: number, mushroomDamage: number, pierce: number, drone = false): void {
    if (!prefab || this.bolts.length > 64) return;
    const bolt = instantiate(prefab, { position: [x, y, 0.45] }).getComponent(Bolt)!;
    bolt.vx = vx;
    bolt.vy = vy;
    bolt.damage = damage;
    bolt.mushroomDamage = mushroomDamage;
    bolt.pierce = pierce;
    bolt.drone = drone;
    bolt.node.rotation.z = Math.atan2(-vx, vy);
    this.bolts.push(bolt);
  }

  /** Every bolt a few small steps, striking the first thing on each. */
  private moveBolts(dt: number): void {
    const enemies = findObjectsOfType(Enemy);
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i]!;
      b.life -= dt;
      const p = b.node.position;
      const steps = Math.max(1, Math.ceil((Math.hypot(b.vx, b.vy) * dt) / 0.25));
      let dead = false;
      for (let s = 0; s < steps && !dead; s++) {
        p.x += (b.vx * dt) / steps;
        p.y += (b.vy * dt) / steps;
        dead = this.strike(b, enemies);
      }
      if (!dead && (b.life <= 0 || p.y > TOP + 0.6 || p.x < LEFT - 1 || p.x > RIGHT + 1)) {
        dead = true;
        if (!b.struck && !b.drone && this.phase === 'playing') this.comboMiss();
      }
      if (dead) {
        destroy(b.node);
        this.bolts.splice(i, 1);
      }
    }
  }

  /** What a bolt at its position hits: a segment, else an enemy, else a mushroom. True when it is spent. */
  private strike(b: Bolt, enemies: Enemy[]): boolean {
    const p = b.node.position;
    const hit = this.swarm.segmentAt(p.x, p.y, 0.06);
    if (hit) {
      const seg = hit.chain.segs[hit.index]!;
      if (!b.hits.has(seg)) {
        b.hits.add(seg);
        const queen = hit.chain.kind === 'queen' || hit.chain.kind === 'armored';
        const result = this.swarm.damage(hit.chain, hit.index, b.damage + (queen ? 1 : 0));
        if (result === 'armor') {
          this.burst(this.burstArmor, p.x, p.y);
          this.sound.play('clink', p.x);
          if (this.phase === 'playing' && Random.value < 0.25) this.hud.popup('ARMOUR', p.x, p.y, 0.5, this.camera, 'cold');
          return true;
        }
        b.struck = true;
        if (result === 'hit') {
          this.burst(this.spark, p.x, p.y);
          if (queen) this.sound.play('queenHit', p.x);
        }
        if (b.pierce > 0 && !queen) {
          b.pierce--;
          return false;
        }
        return true;
      }
    }
    for (const e of enemies) {
      if (e.isDestroyed || e.hp <= 0) continue;
      const q = e.node.position;
      const reach = e.radius + 0.12;
      if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 > reach * reach) continue;
      b.struck = true;
      if (e.hit(b.damage)) this.killEnemy(e);
      else this.burst(this.spark, p.x, p.y);
      return true;
    }
    const shroom = this.field.at(p.x, p.y);
    if (shroom) {
      b.struck = true;
      this.chip(shroom, b.mushroomDamage);
      return true;
    }
    return false;
  }

  private chip(shroom: Shroom, damage: number): void {
    const x = cellX(shroom.c);
    const y = cellY(shroom.r);
    const poison = shroom.poison;
    if (this.field.hit(shroom, damage)) {
      this.burst(poison ? this.burstPoison : this.burstShroom, x, y);
      this.sound.play('crumble', x);
      if (this.phase === 'playing') this.award(x, y, poison ? 15 : 5, '', true);
    } else if (Time.time - this.shroomSound > 0.05) {
      this.shroomSound = Time.time;
      this.sound.play('mushroom', x);
    }
  }

  // --- the laser power-up: a beam up the column, chewing the first mushroom ------------------

  private laser(dt: number): void {
    const beam = this.player.beam;
    if (!beam) return;
    const on = this.powers.laser > 0 && !this.dying;
    beam.visible = on;
    if (!on) return;
    const p = this.player.node.position;
    const c = Math.round(colAt(p.x));
    let top = TOP;
    let block: Shroom | null = null;
    if (Math.abs(cellX(c) - p.x) < 0.55) {
      for (let r = Math.floor(rowAt(p.y)) - 1; r >= 0; r--) {
        const s = this.field.get(c, r);
        if (s && Time.time >= s.born) {
          block = s;
          top = cellY(r) - 0.25;
          break;
        }
      }
    }
    const length = Math.max(0.2, top - p.y - 0.6);
    beam.scale.set(1 + Math.sin(Time.time * 50) * 0.15, length, 1);
    beam.position.y = 0.6 + length / 2;
    this.laserTick -= dt;
    if (this.laserTick > 0) return;
    this.laserTick = 0.06;
    if (Time.time - this.laserSound > 0.14) {
      this.laserSound = Time.time;
      this.sound.play('laser', p.x);
    }
    const hits: { chain: Chain; index: number }[] = [];
    for (const chain of this.swarm.chains) {
      chain.segs.forEach((seg, index) => {
        if (Math.abs(seg.x - p.x) < 0.5 && seg.y > p.y && seg.y < top && seg.node.visible) hits.push({ chain, index });
      });
    }
    hits.sort((a, b) => b.index - a.index);
    for (const h of hits) if (h.chain.segs[h.index]) this.swarm.damage(h.chain, h.index, 1);
    for (const e of findObjectsOfType(Enemy)) {
      const q = e.node.position;
      if (Math.abs(q.x - p.x) < e.radius + 0.2 && q.y > p.y && q.y < top && e.hp > 0 && e.hit(1)) this.killEnemy(e);
    }
    if (block) this.chip(block, 1);
  }

  // --- the smart bomb -------------------------------------------------------------------------

  private bomb(): void {
    if (this.bombs <= 0 || this.dying) return this.sound.play('tick');
    this.bombs--;
    this.hud.bombs(this.bombs);
    const p = this.player.node.position;
    this.sound.play('bomb', p.x);
    this.hud.flash('white');
    this.rig?.impact(0.9);
    this.ring(this.goldwave, p.x, p.y, 26);
    this.hud.popup('SMART BOMB', p.x, p.y + 2, 0.5, this.camera, 'big');
    for (const e of findObjectsOfType(Enemy)) {
      if (e.hp <= 0) continue;
      e.hp = 0;
      this.killEnemy(e, 150);
    }
    const reach = 9.5 + this.paths.drone * 0.6;
    const hits: { chain: Chain; index: number }[] = [];
    for (const chain of this.swarm.chains) {
      chain.segs.forEach((seg, index) => {
        if (Math.hypot(seg.x - p.x, seg.y - p.y) < reach || chain.kind === 'queen' || chain.kind === 'armored') hits.push({ chain, index });
      });
    }
    hits.sort((a, b) => b.index - a.index);
    for (const { chain, index } of hits) {
      const seg = chain.segs[index];
      if (!seg) continue;
      if (chain.kind === 'queen' || chain.kind === 'armored') {
        chain.cracked = true;
        if (seg.hp > 1) this.swarm.damage(chain, index, 1, true);
        this.burst(this.burstQueen, seg.x, seg.y);
      } else {
        this.swarm.damage(chain, index, 2 + Math.min(2, this.paths.drone), true);
      }
    }
    for (const shroom of [...this.field.all()]) {
      if (Math.hypot(cellX(shroom.c) - p.x, cellY(shroom.r) - p.y) < reach * 0.8) this.chip(shroom, 2);
    }
  }

  // --- what dies, and what it is worth --------------------------------------------------------

  private segmentKilled(x: number, y: number, kind: SegKind, head: boolean, lastQueen: boolean): void {
    const queen = kind === 'queen' || kind === 'armored';
    this.burst(queen ? this.burstQueen : kind === 'child' ? this.burstChild : this.burstSegment, x, y);
    if (this.phase !== 'playing') return;
    const points = queen ? (head ? 420 : 190) : kind === 'child' ? (head ? 80 : 40) : head ? 120 : 60;
    this.award(x, y, points, '', false, head);
    this.creditKill();
    this.rig?.impact(queen ? 0.18 : 0.06);
    this.sound.play(lastQueen ? 'queenDeath' : 'segment', x);
    if (lastQueen) {
      this.ring(this.goldwave, x, y, 22);
      this.rig?.impact(0.8);
      this.hud.flash('gold');
      this.hud.popup('QUEEN DOWN!', x, y + 1.5, 0.5, this.camera, 'big');
      this.bombs = Math.min(MAX_BOMBS, this.bombs + 1);
      this.hud.bombs(this.bombs);
      this.drop(x, y);
    }
  }

  private killEnemy(e: Enemy, flat?: number): void {
    const q = e.node.position;
    const burst = { spider: this.burstSpider, flea: this.burstBug, bee: this.burstBug, scorpion: this.burstScorpion, inchworm: this.burstInchworm, spore: this.burstPoison }[e.kind];
    this.burst(burst, q.x, q.y);
    destroy(e.node);
    if (this.phase !== 'playing') return;
    const points = flat ?? e.points(this.playerX, this.playerY);
    this.award(q.x, q.y, points, '', false, points >= 600);
    this.creditKill();
    this.sound.play('enemy', q.x);
    this.rig?.impact(0.15);
    if (e.kind === 'inchworm') {
      this.slowTimer = 4;
      this.ring(this.shockwave, q.x, q.y, 12);
      this.hud.popup('TIME SLOWED', q.x, q.y + 1, 0.5, this.camera, 'good');
    }
    if (e.kind !== 'spore') this.maybeDrop(q.x, q.y);
  }

  private get multiplier(): number {
    return this.combo >= 20 ? 5 : this.combo >= 10 ? 3 : this.combo >= 5 ? 2 : 1;
  }

  private creditKill(): void {
    this.combo += 1;
    this.comboTimer = 2.2;
  }

  private comboMiss(): void {
    if (this.combo <= 0) return;
    this.combo = Math.max(0, this.combo - 1.5);
    this.comboTimer = Math.min(this.comboTimer, 0.9);
  }

  private award(x: number, y: number, base: number, prefix = '', quiet = false, hot = false): void {
    const combo = this.multiplier;
    const double = this.powers.score > 0 ? 2 : 1;
    const gain = Math.round(base * combo * double);
    this.score += gain;
    this.hud.score(this.score);
    this.hud.hi(Math.max(this.best, this.score));
    if (!quiet) {
      const text = `${prefix}${combo * double > 1 ? `×${combo * double} ` : ''}+${gain}`;
      this.hud.popup(text, x, y, 0.6, this.camera, hot || combo > 1 ? 'hot' : double > 1 ? 'good' : '');
    }
    while (this.score >= this.nextLife) {
      this.nextLife += EXTRA_LIFE_EVERY;
      const p = this.player.node.position;
      if (this.lives < MAX_LIVES) {
        this.lives++;
        this.hud.lives(this.lives);
        this.hud.popup('1UP', p.x, p.y + 1.5, 0.5, this.camera, 'good');
      } else {
        this.bombs = Math.min(MAX_BOMBS, this.bombs + 1);
        this.hud.bombs(this.bombs);
        this.hud.popup('BOMB UP', p.x, p.y + 1.5, 0.5, this.camera, 'good');
      }
      this.sound.play('oneup');
    }
  }

  // --- power-ups ------------------------------------------------------------------------------

  private maybeDrop(x: number, y: number): void {
    this.pity++;
    if (Random.value < 0.18 || this.pity >= 7) this.drop(x, y);
  }

  private drop(x: number, y: number, power?: Power): void {
    this.pity = 0;
    const kinds = Object.keys(POWERS) as Power[];
    let pick = power;
    if (!pick) {
      let roll = Random.value * kinds.reduce((n, k) => n + POWERS[k].weight, 0);
      for (const k of kinds) {
        roll -= POWERS[k].weight;
        if (roll <= 0) {
          pick = k;
          break;
        }
      }
    }
    const prefab = { spread: this.pickupSpread, laser: this.pickupLaser, shield: this.pickupShield, frost: this.pickupFrost, score: this.pickupScore }[pick ?? 'spread'];
    if (!prefab) return;
    const clampedX = Math.max(LEFT + 1.2, Math.min(RIGHT - 1.2, x));
    instantiate(prefab, { position: [clampedX, Math.min(TOP - 1, y), 0.7] });
  }

  private catchPickups(): void {
    if (this.dying) return;
    const p = this.player.node.position;
    for (const pickup of findObjectsOfType(Pickup)) {
      const q = pickup.node.position;
      if (Math.abs(q.x - p.x) > 1.4 || Math.abs(q.y - p.y) > 0.8) continue;
      const power = pickup.power;
      this.powers[power] = POWERS[power].duration;
      this.burst(this.burstPickup, q.x, q.y);
      destroy(pickup.node);
      this.sound.play(power === 'shield' ? 'shield' : 'pickup', q.x);
      this.hud.popup(POWERS[power].label, q.x, q.y + 1, 0.6, this.camera, 'good');
    }
  }

  private powersTick(dt: number): void {
    const chips: Chip[] = [];
    for (const k of Object.keys(this.powers) as Power[]) {
      if (this.powers[k] <= 0) continue;
      this.powers[k] = Math.max(0, this.powers[k] - dt);
      if (this.powers[k] <= 0) this.sound.play('expire');
      else chips.push({ id: k, label: POWERS[k].label, left: this.powers[k], total: POWERS[k].duration });
    }
    this.hud.chips(chips);
    this.hud.frost(this.slow < 1);
    if (this.player.shield) this.player.shield.visible = this.powers.shield > 0;
  }

  // --- the enemies, when they come ------------------------------------------------------------

  private spawns(dt: number): void {
    const w = this.wave;
    const late = Math.max(0, w - 12);
    const s = this.spawn;
    for (const k of ['spider', 'flea', 'scorpion', 'bee', 'inchworm', 'side'] as const) s[k] -= dt;
    const count = (kind: Enemy['kind']) => findObjectsOfType(Enemy).filter((e) => e.kind === kind).length;
    if (w >= 2 && s.spider <= 0) {
      s.spider = Math.max(2.1, Random.range(4.4, 7.2) - Math.min(2.2, w * 0.13) - late * 0.045);
      if (count('spider') < (w >= 14 ? 2 : 1)) {
        this.makeSpider();
        this.sound.play('spider');
      }
    }
    // A flea comes sooner when the player's zone runs short of cover.
    if (w >= 3 && (s.flea <= 0 || (this.field.inZone() < 3 && s.flea < 3))) {
      s.flea = Math.max(3.2, Random.range(7, 11) - Math.min(3, w * 0.18) - late * 0.07);
      this.make(this.flea, Flea).enter(w, cellX(Random.rangeInt(0, COLS)));
      this.sound.play('flea');
    }
    if (w >= 3 && s.scorpion <= 0) {
      s.scorpion = Math.max(4.2, Random.range(10, 15) - Math.min(4, w * 0.2) - late * 0.09);
      this.make(this.scorpion, Scorpion).enter(Random.value < 0.5 ? 1 : -1, w);
      this.sound.play('scorpion');
    }
    if (w >= 5 && s.bee <= 0) {
      s.bee = Math.max(6.5, Random.range(12, 18) - Math.min(5, w * 0.22));
      this.make(this.bee, Bee).enter(w, cellX(Random.rangeInt(2, COLS - 2)));
      this.sound.play('flea');
    }
    if (w >= 4 && s.inchworm <= 0) {
      s.inchworm = Random.range(30, 48);
      const worm = this.make(this.inchworm, Inchworm);
      worm.enter(Random.value < 0.5 ? 1 : -1);
      const q = worm.node.position;
      this.hud.popup('INCHWORM!', q.x < 0 ? LEFT + 3 : RIGHT - 3, q.y + 1, 0.5, this.camera, 'good');
    }
    // A millipede that has reached the zone calls in fresh heads from the walls.
    const settled = this.swarm.chains.find((c) => c.zoneTime > 5);
    if (w >= 2 && settled && s.side <= 0) {
      s.side = Math.max(3, 7 - w * 0.2);
      settled.zoneTime = 0;
      const dir = Random.value < 0.5 ? 1 : -1;
      this.swarm.spawn({ length: 1, speed: Math.min(10, 3 + w * 0.36), side: { row: ZONE_TOP + Random.rangeInt(0, 4), dir } });
    }
  }

  private makeSpider(): void {
    this.make(this.spider, Spider).enter(Random.value < 0.5 ? 1 : -1, this.wave);
  }

  private make<T extends Enemy>(prefab: Prefab | null, type: abstract new () => T): T {
    const node = instantiate(prefab!, { position: [0, -20, 0] });
    const enemy = node.getComponent(type)!;
    enemy.game = this;
    return enemy;
  }

  private spit(x: number, y: number): void {
    if (this.phase !== 'playing') return;
    this.make(this.spore, Spore).launch(x, y);
    this.sound.play('scorpion', x);
  }

  // --- the gunner hit -------------------------------------------------------------------------

  private collide(): void {
    if (this.dying || this.player.invulnerable > 0) return;
    const p = this.player.node.position;
    const r = this.player.radius;
    let culprit: Enemy | null = null;
    for (const e of findObjectsOfType(Enemy)) {
      if (!e.dangerous) continue;
      const q = e.node.position;
      const reach = e.radius * 0.85 + r;
      if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 < reach * reach) {
        culprit = e;
        break;
      }
    }
    const segment = culprit ? null : this.swarm.touches(p.x, p.y, r * 0.8);
    if (!culprit && !segment) return;
    if (this.powers.shield > 0) {
      this.powers.shield = 0;
      this.player.invulnerable = 0.9;
      this.ring(this.goldwave, p.x, p.y, 6);
      this.rig?.impact(0.4);
      this.sound.play('shield', p.x);
      this.hud.popup('SHIELD BROKE', p.x, p.y + 1.5, 0.5, this.camera, 'cold');
      if (culprit) this.killEnemy(culprit);
      return;
    }
    this.startCoroutine(this.die());
  }

  private *die() {
    this.dying = true;
    const p = this.player.node.position;
    this.lives--;
    this.hud.loseLife(this.lives);
    this.burst(this.burstPlayer, p.x, p.y);
    this.ring(this.shockwave, p.x, p.y, 10);
    this.player.hidden = true;
    this.powers.laser = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.rig?.impact(1);
    this.hud.flash('bad');
    this.sound.play('death', p.x);
    // Spiders on top of the wreck leave with it, so a respawn is not a second death.
    for (const e of findObjectsOfType(Enemy)) {
      const q = e.node.position;
      if (Math.hypot(q.x - p.x, q.y - p.y) < 4 && e.kind !== 'spore') {
        this.burst(this.burstSpider, q.x, q.y);
        destroy(e.node);
      }
    }
    Time.timeScale = 0.3;
    yield new WaitForSecondsRealtime(0.6);
    if (this.phase === 'playing') Time.timeScale = 1;
    yield new WaitForSeconds(0.7);
    if (this.lives <= 0) {
      this.dying = false;
      return this.gameOver();
    }
    const mended = this.field.heal();
    if (mended) this.award(0, 3, mended * 5, 'MENDED ', true);
    this.player.home();
    this.player.hidden = false;
    this.player.invulnerable = 2.4;
    this.dying = false;
  }

  private gameOver(): void {
    this.phase = 'over';
    Time.timeScale = 1;
    this.hud.combo(1, 0);
    this.hud.chips([]);
    for (const k of Object.keys(this.powers) as Power[]) this.powers[k] = 0;
    if (this.player.beam) this.player.beam.visible = false;
    if (this.player.shield) this.player.shield.visible = false;
    this.player.hidden = true;
    this.sound.play('gameover');
    this.hud.intro('GAME OVER', `SCORE ${this.score.toLocaleString('en-US')}`, `WAVE ${this.wave}`);
    this.startCoroutine(this.toBoard());
  }

  private *toBoard() {
    yield new WaitForSecondsRealtime(2.2);
    this.board.submit(this.score, this.wave, () => {
      this.awaitingTitle = true;
      this.hud.banner('GAME OVER', 'TAP FOR THE TITLE SCREEN', 'bad');
    });
  }

  private toTitle(): void {
    this.awaitingTitle = false;
    this.phase = 'title';
    this.hud.banner(null);
    this.hud.playing(false);
    this.clearAll();
    while (this.drones.length) destroy(this.drones.pop()!.node);
    this.player.demo = true;
    this.player.hidden = false;
    this.player.invulnerable = 0;
    this.setBiome(0);
    this.refreshLeaders();
  }

  private pause(on: boolean): void {
    if (on && this.phase === 'playing') {
      this.phase = 'paused';
      Time.timeScale = 0;
      this.hud.pauseMenu(`WAVE ${this.wave} · SCORE ${this.score.toLocaleString('en-US')}`);
    } else if (!on && this.phase === 'paused') {
      this.phase = 'playing';
      Time.timeScale = 1;
      this.hud.pauseMenu(null);
    }
  }

  /**
   * Leaving a run from the pause menu: to this edition's title, or out to the edition picker. Either
   * way the run ends as a game over does — a top-ten score still gets its initials and is saved.
   */
  private endRun(where: 'title' | 'quit'): void {
    if (this.phase !== 'paused') return;
    this.hud.pauseMenu(null);
    this.phase = 'over';
    Time.timeScale = 1;
    this.hud.chips([]);
    this.hud.combo(1, 0);
    for (const k of Object.keys(this.powers) as Power[]) this.powers[k] = 0;
    if (this.player.beam) this.player.beam.visible = false;
    if (this.player.shield) this.player.shield.visible = false;
    this.player.hidden = true;
    const leave = () => (where === 'title' ? this.toTitle() : window.location.assign('../'));
    if (this.score > 0) this.board.submit(this.score, this.wave, leave);
    else leave();
  }

  /**
   * The title screen's global and local top fives, and the HUD's HI: shown at once from this device,
   * then again when the global board answers.
   */
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

  // --- looks ----------------------------------------------------------------------------------

  private burst(prefab: Prefab | null, x: number, y: number): void {
    if (prefab) instantiate(prefab, { position: [x, y, 0.5] });
  }

  private ring(prefab: Prefab | null, x: number, y: number, size: number): void {
    if (!prefab) return;
    // On the floor, under everything: a ring must never hide what it went off among.
    const ring = instantiate(prefab, { position: [x, y, 0.06] }).getComponent(Shockwave);
    if (ring) ring.size = size;
  }

  private setBiome(index: number): void {
    if (index === this.biome) return;
    this.biome = index;
    const biome = BIOMES[index]!;
    if (this.backdrop) (this.backdrop.material as MeshStandardMaterial).emissive.set(biome.grid);
    this.tubes?.traverse((o) => {
      const flicker = o.getComponent?.(NeonFlicker);
      if (!flicker) return;
      flicker.material.color.set(biome.tube);
      flicker.material.emissive.set(biome.tube);
    });
    const scene = SceneManager.activeScene;
    if (scene) {
      scene.background = new Color(biome.sky);
      if (scene.fog instanceof Fog) scene.fog.color.set(biome.sky);
    }
  }
}
