import { Vector2, type Object3D } from 'three';
import { Behaviour, Event, Random, destroy, findObjectOfType, instantiate, type Prefab } from '@scenoco-three/core';
import type { SegKind } from './assets';
import { Field } from './Field';
import { Segment } from './Segment';
import { COLS, LEFT, RIGHT, ROWS, TOP, ZONE_TOP, cellX, cellY, colAt, inField, rowAt } from './grid';

export type QueenVariant = 'splitter' | 'shielded' | 'spitter';

/** One segment of a chain: its node, its health, where it was put this frame. */
export interface Seg {
  node: Object3D;
  part: Segment;
  hp: number;
  x: number;
  y: number;
}

/**
 * One millipede. Its head walks the grid a cell at a time — from (c, r) toward (tc, tr), `t` of the
 * way — and leaves a trail, `path`; every other segment rides that trail a fixed spacing behind the
 * one before. Shooting a segment out of the middle cuts the trail there and the rear becomes a chain of
 * its own, with its own head, picking up the grid wherever it was.
 */
export class Chain {
  segs: Seg[] = [];
  /** The head's trail, oldest first. */
  path: Vector2[] = [];
  c = 0;
  r = -1;
  tc = 0;
  tr = 0;
  t = 0;
  /** Across: +1 right, -1 left. Down the field: +1 toward the player, -1 back up inside the zone. */
  dir = 1;
  vdir = 1;
  /** Struck a poisoned mushroom: straight down to the floor. */
  dive = false;
  /** Cells per second. */
  speed = 2;
  kind: SegKind = 'normal';
  variant: QueenVariant | null = null;
  /** A shielded queen's plates, broken by a smart bomb. */
  cracked = false;
  spit = 3;
  /** Seconds its head has spent in the player's zone. */
  zoneTime = 0;
}

/** World units between two segments along the trail. */
const SPACING = 1.06;

const radiusOf = (kind: SegKind) => (kind === 'queen' || kind === 'armored' ? 0.64 : kind === 'child' ? 0.38 : 0.52);

export interface SpawnOptions {
  kind?: SegKind;
  length: number;
  speed: number;
  variant?: QueenVariant | null;
  /** A column to come down at; random when left out. */
  col?: number;
  /** Comes in from a side wall on `row` instead of down from the top. */
  side?: { row: number; dir: 1 | -1 };
  hpBoost?: number;
}

/**
 * Every millipede on the field: walking them, laying their segments along their trails, and what a
 * hit does to one — the segment becomes a mushroom where it fell, and the chain breaks in two.
 */
export class Swarm extends Behaviour {
  segment: Prefab | null = null;

  readonly chains: Chain[] = [];
  /** A segment destroyed: where, of what, whether it was a head, and whether it was the last of a queen. */
  readonly killed = new Event<[x: number, y: number, kind: SegKind, head: boolean, lastQueen: boolean]>();
  /** A spitter queen lobs a spore from here. */
  readonly spat = new Event<[x: number, y: number]>();

  /** Set by the game: frost and the inchworm slow the swarm. */
  speedScale = 1;

  private field!: Field;

  override awake(): void {
    this.field = findObjectOfType(Field)!;
  }

  get queenAlive(): boolean {
    return this.chains.some((c) => c.kind === 'queen' || c.kind === 'armored');
  }

  get segmentCount(): number {
    return this.chains.reduce((n, c) => n + c.segs.length, 0);
  }

  spawn(o: SpawnOptions): Chain {
    const chain = new Chain();
    chain.kind = o.kind ?? 'normal';
    chain.speed = o.speed;
    chain.variant = o.variant ?? null;
    if (o.side) {
      const { row, dir } = o.side;
      chain.dir = dir;
      chain.c = dir > 0 ? -1 : COLS;
      chain.r = chain.tr = row;
      chain.tc = chain.c + dir;
      chain.vdir = row >= ZONE_TOP ? -1 : 1;
      const x0 = cellX(chain.c);
      const y = cellY(row);
      for (let i = o.length + 1; i >= 0; i--) chain.path.push(new Vector2(x0 - dir * i * SPACING, y));
    } else {
      const c = o.col ?? Random.rangeInt(2, COLS - 2);
      chain.c = chain.tc = c;
      chain.r = -1;
      chain.tr = 0;
      chain.dir = Random.value < 0.5 ? 1 : -1;
      const x = cellX(c);
      const y0 = cellY(-1);
      for (let i = o.length + 1; i >= 0; i--) chain.path.push(new Vector2(x, y0 + i * SPACING));
    }
    const boost = o.hpBoost ?? 0;
    for (let i = 0; i < o.length; i++) {
      const node = instantiate(this.segment!, { parent: this.node, position: [0, 40, 0] });
      const part = node.getComponent(Segment)!;
      const head = i === 0;
      const queen = chain.kind === 'queen' || chain.kind === 'armored';
      const look: SegKind = chain.kind === 'armored' && !head ? 'armored' : chain.kind === 'armored' ? 'queen' : chain.kind;
      part.dress(look, head);
      const hp = queen ? (head ? 5 + (chain.variant === 'shielded' ? 2 : 0) : 2) + boost : 1;
      chain.segs.push({ node, part, hp, x: 0, y: 40 });
    }
    this.chains.push(chain);
    this.lay(chain, cellX(chain.c), cellY(chain.r), 0);
    return chain;
  }

  /** A short fast chain from a point on the field — a splitter queen's swarmlets. */
  spawnAt(x: number, y: number, length: number, speed: number, dir: 1 | -1): void {
    const c = Math.max(0, Math.min(COLS - 1, Math.round(colAt(x))));
    const r = Math.max(0, Math.min(ROWS - 1, Math.round(rowAt(y))));
    this.spawn({ kind: 'child', length, speed, side: { row: r, dir } });
    const chain = this.chains[this.chains.length - 1]!;
    chain.c = c;
    chain.tc = c + dir;
    chain.path = [];
    for (let i = length + 1; i >= 0; i--) chain.path.push(new Vector2(cellX(c) - dir * i * SPACING * 0.5, cellY(r)));
    if (r >= ZONE_TOP) chain.vdir = -1;
  }

  clear(): void {
    for (const chain of this.chains) for (const seg of chain.segs) destroy(seg.node);
    this.chains.length = 0;
  }

  // --- walking ---------------------------------------------------------------------------

  override update(dt: number): void {
    for (const chain of [...this.chains]) {
      const step = chain.speed * this.speedScale * dt;
      let move = step;
      let guard = 8;
      while (move > 0 && guard-- > 0) {
        const left = 1 - chain.t;
        if (move < left) {
          chain.t += move;
          move = 0;
        } else {
          move -= left;
          chain.t = 0;
          chain.c = chain.tc;
          chain.r = chain.tr;
          this.choose(chain);
        }
      }
      const hx = cellX(chain.c) + (cellX(chain.tc) - cellX(chain.c)) * chain.t;
      const hy = cellY(chain.r) + (cellY(chain.tr) - cellY(chain.r)) * chain.t;
      this.lay(chain, hx, hy, step);
      if (chain.r >= ZONE_TOP) chain.zoneTime += dt;
      if (chain.variant === 'spitter' && chain.segs.length && chain.r >= 1 && chain.r < ZONE_TOP - 3) {
        chain.spit -= dt;
        if (chain.spit <= 0) {
          chain.spit = Random.range(2.2, 3.4);
          const head = chain.segs[0]!;
          this.spat.emit(head.x, head.y);
        }
      }
    }
  }

  /** At a cell centre: where next. Across until blocked, then a row down (or up, in the zone) and back. */
  private choose(chain: Chain): void {
    const { c, r } = chain;
    if (r < 0) {
      chain.tc = c;
      chain.tr = r + 1;
      return;
    }
    if (chain.dive) {
      if (r < ROWS - 1) {
        chain.tc = c;
        chain.tr = r + 1;
        return;
      }
      chain.dive = false;
      chain.vdir = -1;
    }
    const nc = c + chain.dir;
    const entering = c < 0 || c >= COLS;
    const blocker = entering ? null : this.field.get(nc, r);
    const wall = !entering && (nc < 0 || nc >= COLS);
    if (!wall && !blocker) {
      chain.tc = nc;
      chain.tr = r;
      return;
    }
    // A poisoned mushroom sends an ordinary millipede straight down; a queen shrugs it off.
    if (blocker?.poison && chain.kind !== 'queen' && chain.kind !== 'armored' && r < ROWS - 1) {
      chain.dive = true;
      chain.dir = -chain.dir as 1 | -1;
      chain.tc = c;
      chain.tr = r + 1;
      return;
    }
    chain.dir = -chain.dir;
    chain.tc = c;
    chain.tr = this.nextRow(chain, r);
  }

  private nextRow(chain: Chain, r: number): number {
    let nr = r + chain.vdir;
    if (nr > ROWS - 1) {
      chain.vdir = -1;
      nr = r - 1;
    }
    if (chain.vdir < 0 && nr < ZONE_TOP) {
      chain.vdir = 1;
      nr = r + 1;
    }
    return Math.max(0, Math.min(ROWS - 1, nr));
  }

  /** The head at (hx, hy): extend the trail and set every segment down along it. */
  private lay(chain: Chain, hx: number, hy: number, moved: number): void {
    const p = chain.path;
    const n = p.length;
    if (n >= 2 && p[n - 2]!.distanceTo(new Vector2(hx, hy)) < 0.1) p[n - 1]!.set(hx, hy);
    else p.push(new Vector2(hx, hy));

    const segs = chain.segs;
    const head = segs[0];
    if (!head) return;
    const angle = Math.atan2(cellY(chain.tr) - cellY(chain.r), cellX(chain.tc) - cellX(chain.c));
    this.put(head, hx, hy, angle, moved);

    let j = p.length - 1;
    let acc = 0;
    for (let s = 1; s < segs.length; s++) {
      const want = s * SPACING;
      while (j > 0 && acc + p[j]!.distanceTo(p[j - 1]!) < want) {
        acc += p[j]!.distanceTo(p[j - 1]!);
        j--;
      }
      const seg = segs[s]!;
      if (j === 0) {
        this.put(seg, p[0]!.x, p[0]!.y, seg.node.rotation.z, moved);
        continue;
      }
      const a = p[j]!;
      const b = p[j - 1]!;
      const d = a.distanceTo(b) || 1;
      const f = (want - acc) / d;
      this.put(seg, a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, Math.atan2(a.y - b.y, a.x - b.x), moved);
    }
    // Forget the trail no segment rides any more.
    if (j > 3) p.splice(0, j - 3);
  }

  private put(seg: Seg, x: number, y: number, angle: number, moved: number): void {
    seg.x = x;
    seg.y = y;
    seg.part.place(x, y, angle, moved);
    seg.node.visible = y < TOP + 0.35 && x > LEFT - 0.55 && x < RIGHT + 0.55;
  }

  // --- hits ------------------------------------------------------------------------------

  /** The segment nearest a point within reach of it — what a bolt at (x, y) strikes. */
  segmentAt(x: number, y: number, reach = 0): { chain: Chain; index: number } | null {
    let best: { chain: Chain; index: number } | null = null;
    let bestD = Infinity;
    for (const chain of this.chains) {
      const radius = radiusOf(chain.kind) + reach;
      for (let i = 0; i < chain.segs.length; i++) {
        const seg = chain.segs[i]!;
        if (!seg.node.visible) continue;
        const dx = seg.x - x;
        const dy = seg.y - y;
        const d = dx * dx + dy * dy;
        if (d < radius * radius && d < bestD) {
          bestD = d;
          best = { chain, index: i };
        }
      }
    }
    return best;
  }

  /** Whether a circle at (x, y) touches any segment. */
  touches(x: number, y: number, radius: number): Seg | null {
    for (const chain of this.chains) {
      const reach = radiusOf(chain.kind) * 0.85 + radius;
      for (const seg of chain.segs) {
        const dx = seg.x - x;
        const dy = seg.y - y;
        if (dx * dx + dy * dy < reach * reach) return seg;
      }
    }
    return null;
  }

  /** A hit for `damage`. A shielded queen's body plates turn bolts until a bomb cracks them. */
  damage(chain: Chain, index: number, damage: number, bomb = false): 'armor' | 'hit' | 'kill' {
    const seg = chain.segs[index];
    if (!seg) return 'hit';
    if (chain.variant === 'shielded' && index > 0 && !chain.cracked && !bomb) {
      seg.part.clink();
      return 'armor';
    }
    seg.hp -= damage;
    if (seg.hp > 0) {
      seg.part.wound();
      return 'hit';
    }
    this.kill(chain, index);
    return 'kill';
  }

  private kill(chain: Chain, index: number): void {
    const seg = chain.segs[index]!;
    const head = index === 0;
    const queen = chain.kind === 'queen' || chain.kind === 'armored';
    const queenLeft = queen ? this.chains.filter((c) => c.kind === chain.kind).reduce((n, c) => n + c.segs.length, 0) : 0;
    const c = Math.round(colAt(seg.x));
    const r = Math.round(rowAt(seg.y));
    // Where a segment dies, a mushroom grows — a queen's are often poisoned.
    if (inField(c, r)) this.field.add(c, r, queen && Random.value < 0.5);
    this.killed.emit(seg.x, seg.y, chain.kind, head, queen && queenLeft <= 1);
    if (queen && head && chain.variant === 'splitter') {
      this.spawnAt(seg.x, seg.y, 2, chain.speed * 1.6 + 1.5, 1);
      this.spawnAt(seg.x, seg.y, 2, chain.speed * 1.6 + 1.5, -1);
    }
    this.split(chain, index);
  }

  private split(chain: Chain, k: number): void {
    const dead = chain.segs[k]!;
    const rear = chain.segs.slice(k + 1);
    chain.segs = chain.segs.slice(0, k);
    destroy(dead.node);
    if (rear.length) this.chains.push(this.detach(chain, rear, (k + 1) * SPACING));
    if (!chain.segs.length) this.chains.splice(this.chains.indexOf(chain), 1);
  }

  /** The segments behind a cut, as a chain of their own: its trail is the old one from there back. */
  private detach(old: Chain, rear: Seg[], arc: number): Chain {
    const p = old.path;
    let j = p.length - 1;
    let acc = 0;
    while (j > 0) {
      const d = p[j]!.distanceTo(p[j - 1]!);
      if (acc + d >= arc) break;
      acc += d;
      j--;
    }
    const q = j === 0 ? p[0]!.clone() : p[j]!.clone().lerp(p[j - 1]!, (arc - acc) / (p[j]!.distanceTo(p[j - 1]!) || 1));
    const ahead = p[Math.min(j, p.length - 1)]!;

    const chain = new Chain();
    chain.path = [...p.slice(0, j).map((v) => v.clone()), q];
    chain.kind = old.kind;
    chain.variant = old.variant;
    chain.cracked = old.cracked;
    chain.speed = old.speed + (old.kind === 'queen' || old.kind === 'armored' ? 0 : 0.35);
    chain.vdir = old.vdir;
    chain.dive = old.dive;
    chain.segs = rear;
    const look: SegKind = old.kind === 'armored' ? 'queen' : old.kind;
    rear[0]!.part.dress(look, true);

    const cx = colAt(q.x);
    const cy = rowAt(q.y);
    const mx = ahead.x - q.x;
    const my = ahead.y - q.y;
    if (cy < -0.5) {
      // Still coming down through the gate.
      chain.c = chain.tc = Math.round(cx);
      chain.tr = Math.ceil(cy - 1e-6);
      chain.r = chain.tr - 1;
      chain.t = Math.min(0.999, Math.max(0, cy - chain.r));
      chain.dir = old.dir;
    } else if (Math.abs(mx) >= Math.abs(my)) {
      const d = mx >= 0 ? 1 : -1;
      chain.dir = d;
      chain.r = chain.tr = Math.max(0, Math.round(cy));
      chain.tc = d > 0 ? Math.floor(cx + 1e-6) + 1 : Math.ceil(cx - 1e-6) - 1;
      chain.c = chain.tc - d;
      chain.t = Math.min(0.999, Math.max(0, Math.abs(cx - chain.c)));
      // Heading into the mushroom the cut just grew: it turns there, as a millipede does.
      if (this.field.get(chain.tc, chain.r) || chain.tc < 0 || chain.tc >= COLS) {
        chain.c = Math.round(cx) === chain.tc ? chain.tc - d : Math.round(cx);
        chain.t = 0;
        chain.dir = -d;
        chain.tc = chain.c;
        chain.tr = this.nextRow(chain, chain.r);
      }
    } else {
      const d = my < 0 ? 1 : -1;
      chain.c = chain.tc = Math.max(0, Math.min(COLS - 1, Math.round(cx)));
      chain.tr = d > 0 ? Math.floor(cy + 1e-6) + 1 : Math.ceil(cy - 1e-6) - 1;
      chain.r = chain.tr - d;
      chain.t = Math.min(0.999, Math.max(0, Math.abs(cy - chain.r)));
      let turn = 0;
      for (let i = j; i < p.length; i++) {
        const dx = p[i]!.x - q.x;
        if (Math.abs(dx) > 0.3) {
          turn = Math.sign(dx);
          break;
        }
      }
      chain.dir = turn || (Random.value < 0.5 ? 1 : -1);
    }
    return chain;
  }
}
