import { Color, CustomBlending, OneFactor, OneMinusSrcAlphaFactor, ShaderMaterial, Vector3, type Camera, type Group, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';

/**
 * Depth without changing the game: a point is drawn further along the line from the camera through where
 * it really is. On screen it sits exactly where it plays — a tap still meets it — but it is further off,
 * smaller, fogged, its trail running back into the distance. `k` 1 is the battle plane; above 1 is beyond.
 */
const through = new Vector3();
function along(camera: Camera, at: Vector3, k: number, out: Vector3): void {
  camera.getWorldPosition(through);
  out.copy(at).sub(through).multiplyScalar(k).add(through);
}
import { Behaviour, destroy } from '@scenoco-three/core';
import type { WarheadKind } from './assets';
import { SPAWN_Y, half } from './world';

/** What a missile or a boss reports to: the game, without importing it. */
export interface Theatre {
  readonly slow: number;
  landed(warhead: Warhead): void;
  arrived(interceptor: Interceptor): void;
  dropBombs(x: number, y: number, count: number): void;
  orbitalFires(orbital: Orbital): void;
  meteorLanded(meteor: Meteor): void;
}

/**
 * An incoming warhead: it waits out its `delay` above the sky, then falls in a straight line from where it
 * came in toward its target, leaving a trail of fire and smoke. A smart one weaves; the game steers it
 * away from blasts. A stealth one is all but invisible until the radar sweeps it.
 */
export class Warhead extends Behaviour<Group> {
  look: Object3D | null = null;
  kind: WarheadKind = 'normal';
  tx = 0;
  ty = 0;
  speed = 1;
  delay = 0;
  stealth = false;
  revealed = 0;
  split = false;
  /** 0 → 1 of the way down — when a MIRV splits. */
  progress = 0;
  splitAt = 0.5;
  wiggle = Math.random() * 1000;
  alive = true;
  whistled = false;
  game!: Theatre;
  /** Where it really is, on the battle plane: what blasts and the ground test. The node is drawn in depth. */
  readonly gp = new Vector3();
  /** How far beyond the battle plane it starts — it closes in as it falls. */
  depth = 2.6;
  private travelled = 0;
  private length = 1;

  /** Set off from (x, y) toward (tx, ty), after `delay` seconds. */
  private sx = 0;
  private sy = 0;

  aim(x: number, y: number, tx: number, ty: number, speed: number, delay: number): void {
    this.sx = x;
    this.sy = y;
    this.gp.set(x, y, 0);
    // Waiting, it is parked far above the sky, so its trail does not glow where it will come in.
    this.node.position.set(x, 400, 0);
    this.tx = tx;
    this.ty = ty;
    this.speed = speed;
    this.delay = delay;
    this.length = Math.max(1, Math.hypot(tx - x, ty - y));
    this.point();
  }

  get waiting(): boolean {
    return this.delay > 0;
  }

  override update(dt: number): void {
    if (!this.alive) return;
    const d = dt * (this.game?.slow ?? 1);
    if (this.delay > 0) {
      this.delay -= d;
      this.node.visible = false;
      if (this.delay <= 0) {
        this.gp.set(this.sx, this.sy, 0);
        this.draw();
      }
      return;
    }
    const p = this.gp;
    const dx = this.tx - p.x;
    const dy = this.ty - p.y;
    const len = Math.hypot(dx, dy) || 1;
    const step = this.speed * d;
    p.x += (dx / len) * step;
    p.y += (dy / len) * step;
    if (this.kind === 'smart') p.x += Math.sin(performance.now() * 0.002 + this.wiggle) * 0.35 * d * 3;
    this.travelled += step;
    this.progress = this.travelled / this.length;
    this.point();
    this.draw();
    this.revealed = Math.max(0, this.revealed - dt);
    this.node.visible = !this.stealth || this.revealed > 0;
    if (len <= step || p.y <= this.ty + 0.05) this.game.landed(this);
  }

  /** How far back it is drawn now: deep at first, on the battle plane for the last third of its fall. */
  get k(): number {
    return 1 + this.depth * Math.max(0, 1 - this.progress / 0.8) ** 1.6;
  }

  private draw(): void {
    along(this.camera, this.gp, this.k, this.node.position);
  }

  /** Nose toward the target. */
  private point(): void {
    const p = this.gp;
    this.node.rotation.z = Math.atan2(this.tx - p.x, -(this.ty - p.y));
    // Leaning out of the distance toward the camera while it closes in.
    this.node.rotation.x = -0.7 * Math.max(0, 1 - this.progress / 0.8);
  }

  kill(): void {
    this.alive = false;
    destroy(this.node);
  }
}

/** An interceptor: from a battery's barrel straight to where the player tapped, then a blast. */
export class Interceptor extends Behaviour<Group> {
  tx = 0;
  ty = 0;
  speed = 15;
  game!: Theatre;
  /** Where it really is on the battle plane; it is drawn arcing out toward the camera on the way. */
  readonly gp = new Vector3();
  private done = false;
  private total = 1;
  private gone = 0;

  launch(x: number, y: number, tx: number, ty: number, speed: number): void {
    this.gp.set(x, y, 0);
    this.node.position.set(x, y, 0);
    this.tx = tx;
    this.ty = ty;
    this.speed = speed;
    this.total = Math.max(0.5, Math.hypot(tx - x, ty - y));
    this.node.rotation.z = Math.atan2(-(tx - x), ty - y);
  }

  override update(dt: number): void {
    if (this.done) return;
    const p = this.gp;
    const dx = this.tx - p.x;
    const dy = this.ty - p.y;
    const len = Math.hypot(dx, dy);
    const step = this.speed * dt;
    if (len <= step) {
      p.set(this.tx, this.ty, 0);
      this.done = true;
      this.game.arrived(this);
      destroy(this.node);
      return;
    }
    p.x += (dx / len) * step;
    p.y += (dy / len) * step;
    this.gone += step;
    // An arc: drawn up to a fifth nearer the camera mid-flight, back on the plane where it bursts.
    along(this.camera, p, 1 - 0.34 * Math.sin(Math.PI * Math.min(1, this.gone / this.total)), this.node.position);
  }
}

/**
 * A blast: a ball of fire that swells to `size`, holds and fades — the classic's own curve. Friendly
 * ones destroy what they touch; each remembers what it has hit, so a slow blast counts a target once.
 */
export class Blast extends Behaviour<Mesh> {
  size = 2.6;
  life = 1;
  friendly = true;
  chain = 1;
  readonly hit = new Set<object>();
  radius = 0;
  private age = 0;
  private material!: ShaderMaterial;

  override awake(): void {
    this.material = new ShaderMaterial({
      vertexShader: BLAST_VERTEX,
      fragmentShader: BLAST_FRAGMENT,
      transparent: true,
      depthWrite: false,
      // Premultiplied: colour adds like light, alpha only partly covers what is behind — a fireball that
      // glows without bleaching to pastel, and cools to embers instead of a muddy disc.
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      uniforms: { core: { value: new Color() }, mid: { value: new Color() }, edge: { value: new Color() }, fade: { value: 1 }, heat: { value: 1 }, time: { value: Math.random() * 10 } },
    });
    this.node.material = this.material;
  }

  override start(): void {
    (this.material.uniforms.core!.value as Color).set(this.friendly ? '#fff2b0' : '#ffd090');
    (this.material.uniforms.mid!.value as Color).set(this.friendly ? '#ff7a00' : '#ff4a00');
    (this.material.uniforms.edge!.value as Color).set(this.friendly ? '#d01800' : '#a00800');
  }

  override update(dt: number): void {
    this.age += dt;
    const t = this.age / this.life;
    this.radius = this.size * Math.sin(Math.min(1, t) * Math.PI * 0.82);
    this.node.scale.setScalar(Math.max(0.01, this.radius));
    // Hot and white as it bursts, cooling to its rim colour as it fades.
    this.material.uniforms.heat!.value = Math.max(0, 1 - t * 2.8);
    // Full while it burns; gone quickly once it has peaked — embers, not a lingering disc.
    // Bright while it burns, a faint ember shell by three quarters of its life, gone at the end.
    this.material.uniforms.fade!.value = t < 0.3 ? 1 : t < 0.6 ? 1 - ((t - 0.3) / 0.3) * 0.88 : Math.max(0, 0.12 * (1 - (t - 0.6) / 0.25));
    this.material.uniforms.time!.value += dt;
    if (t >= 1) destroy(this.node);
  }
}

const BLAST_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const BLAST_FRAGMENT = /* glsl */ `
  uniform vec3 core, mid, edge;
  uniform float fade, heat, time;
  varying vec3 vNormal;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    vec3 n = normalize(vNormal);
    // Distance from the ball's centre as seen on screen — linear across the disc, unlike 1 - n.z, which
    // stays near 0 over most of it and makes a flat plate with a thin rim.
    float d = clamp(length(n.xy), 0.0, 1.0);
    float boil = noise(n.xy * 4.0 + vec2(time * 2.1, -time * 1.6)) * 0.6 + noise(n.xy * 9.0 - vec2(time * 2.7, time * 1.2)) * 0.4;
    float r = clamp(d + (boil - 0.5) * 0.34, 0.0, 1.0);
    // Colours kept under 1: brighter, and the tone curve bleaches orange toward pastel.
    float heart = 0.12 + heat * 0.4;
    vec3 colour = mix(core * (0.85 + heat * 0.25), mid * 0.95, smoothstep(0.0, heart, r));
    colour = mix(colour, edge * 0.8, smoothstep(heart + 0.1, heart + 0.6, r));
    // Cooling: the whole ball sinks to ember red.
    colour = mix(edge * 0.7, colour, clamp(fade * 1.2, 0.0, 1.0));
    float body = pow(1.0 - smoothstep(0.0, 1.0, r), 1.4) * (0.8 + 0.4 * boil);
    colour *= mix(0.35, 1.0, fade) * body;
    // Glow adds like light; only the young fireball covers what is behind it, so it never leaves a stain.
    gl_FragColor = vec4(colour, body * 0.55 * heat * fade);
  }
`;

/** Shared by the bosses: hit points, a flash when struck. */
abstract class Boss extends Behaviour<Group> {
  look: Object3D | null = null;
  hp = 1;
  maxHp = 1;
  alive = true;
  game!: Theatre;
  protected flash = 0;

  /** A blast reached it. True when that was the end of it. */
  hurt(): boolean {
    this.hp--;
    this.flash = 1;
    if (this.hp <= 0) this.alive = false;
    return !this.alive;
  }

  protected kicked(dt: number): void {
    this.flash = Math.max(0, this.flash - dt * 4);
    if (this.look) this.look.scale.setScalar(1 + this.flash * 0.15);
  }
}

/** A satellite gunship crossing the upper sky, dropping warheads; it leaves after two passes. */
export class Satellite extends Boss {
  vx = 2;
  cooldown = 2.5;
  passes = 0;
  bombEvery = 2.4;

  override update(dt: number): void {
    if (!this.alive) return;
    const d = dt * (this.game?.slow ?? 1);
    const p = this.node.position;
    p.x += this.vx * d;
    this.node.rotation.y += d * 1.5;
    this.kicked(dt);
    this.cooldown -= d;
    if (this.cooldown <= 0 && Math.abs(p.x) < half()) {
      this.cooldown = this.bombEvery + Math.random() * 0.7;
      this.game.dropBombs(p.x, p.y - 0.4, 1);
    }
    const edge = half() + 3;
    if ((this.vx > 0 && p.x > edge) || (this.vx < 0 && p.x < -edge)) {
      this.passes++;
      if (this.passes >= 2) {
        this.alive = false;
        destroy(this.node);
      } else p.x = this.vx > 0 ? -edge : edge;
    }
  }
}

/** The bomber run: a heavy plane crossing once, dropping clusters of three on the cities. */
export class Bomber extends Boss {
  vx = 1.2;
  dropTimer = 0;
  dropEvery = 1.5;

  override update(dt: number): void {
    if (!this.alive) return;
    const d = dt * (this.game?.slow ?? 1);
    const p = this.node.position;
    p.x += this.vx * d;
    p.y += Math.sin(performance.now() * 0.0012) * 0.004;
    this.kicked(dt);
    this.dropTimer += d;
    if (this.dropTimer >= this.dropEvery && Math.abs(p.x) < half() + 0.5) {
      this.dropTimer = 0;
      this.game.dropBombs(p.x, p.y - 0.4, 3);
    }
    if ((this.vx > 0 && p.x > half() + 5) || (this.vx < 0 && p.x < -half() - 5)) {
      this.alive = false;
      destroy(this.node);
    }
  }
}

/**
 * The orbital cannon: hangs over the field charging for ten seconds — each hit stuns it — then fires a
 * beam that flattens a city. It takes many hits to bring down.
 */
export class Orbital extends Boss {
  ring: Object3D | null = null;
  core: Mesh | null = null;
  beam: Mesh | null = null;
  chargeTime = 10;
  charged = 0;
  stun = 0;
  firing = 0;
  targetX = 0;

  override hurt(): boolean {
    this.stun = 0.3;
    return super.hurt();
  }

  get charge(): number {
    return Math.min(1, this.charged / this.chargeTime);
  }

  override update(dt: number): void {
    if (!this.alive) return;
    this.kicked(dt);
    if (this.ring) this.ring.rotation.z += dt * (1 + this.charge * 6);
    if (this.core) (this.core.material as MeshStandardMaterial).emissiveIntensity = 0.9 + this.charge * 2.6 + Math.sin(performance.now() * 0.02) * this.charge * 0.8;
    if (this.firing > 0) {
      this.firing -= dt;
      if (this.beam) {
        this.beam.visible = true;
        const p = this.node.position;
        const dx = this.targetX - p.x;
        const dy = 0.6 - p.y;
        const len = Math.hypot(dx, dy);
        this.beam.scale.set(1 + Math.sin(performance.now() * 0.05) * 0.3, len, 1);
        this.beam.position.set(dx / 2, dy / 2, 0);
        this.beam.rotation.z = Math.atan2(-dx, dy);
      }
      if (this.firing <= 0) {
        this.alive = false;
        destroy(this.node);
      }
      return;
    }
    if (this.stun > 0) this.stun -= dt;
    else this.charged += dt * (this.game?.slow ?? 1);
    if (this.charged >= this.chargeTime) {
      this.firing = 1.5;
      this.game.orbitalFires(this);
    }
  }
}

/** A meteor: tumbles down; a hit breaks a large one into three medium, a medium into three small. */
export class Meteor extends Boss {
  vx = 0;
  vy = -2;
  size: 'large' | 'medium' | 'small' = 'large';
  radius = 0.5;
  delay = 0;
  private spin = Math.random() * 2 - 1;

  setSize(size: 'large' | 'medium' | 'small'): void {
    this.size = size;
    this.hp = this.maxHp = size === 'large' ? 4 : size === 'medium' ? 2 : 1;
    this.radius = size === 'large' ? 0.55 : size === 'medium' ? 0.34 : 0.2;
    this.node.scale.setScalar(this.radius / 0.5);
  }

  private parked: number | null = null;

  override update(dt: number): void {
    if (!this.alive) return;
    const d = dt * (this.game?.slow ?? 1);
    if (this.delay > 0) {
      if (this.parked === null) {
        this.parked = this.node.position.y;
        this.node.position.y = 400;
      }
      this.delay -= d;
      this.node.visible = false;
      if (this.delay <= 0) this.node.position.y = this.parked;
      return;
    }
    this.node.visible = true;
    this.kicked(dt);
    const p = this.node.position;
    p.x += this.vx * d;
    p.y += this.vy * d;
    this.node.rotation.x += this.spin * d * 2;
    this.node.rotation.y += this.spin * d * 3;
    if (p.y <= 0.2) this.game.meteorLanded(this);
  }
}

export { SPAWN_Y };
