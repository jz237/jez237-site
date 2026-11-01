import { Color, Matrix4, Quaternion, Vector3, type Group, type InstancedMesh } from 'three';
import { Behaviour, Random, Time } from '@scenoco-three/core';
import { COLS, ROWS, ZONE_TOP, cellX, cellY, colAt, inField, rowAt } from './grid';

/** One mushroom: where it stands, what is left of it, and whether the scorpion has poisoned it. */
export interface Shroom {
  c: number;
  r: number;
  hp: number;
  poison: boolean;
  /** Game time it sprouts at: it grows in from nothing then. */
  born: number;
  /** The last hit's kick, fading. */
  kick: number;
  tilt: number;
  /** Each a little different. */
  size: number;
}

export const SHROOM_HP = 4;

/**
 * The mushroom field: one mushroom per cell at most, kept as data and drawn as four instanced
 * batches — caps and rims, ordinary and poisoned — so two hundred mushrooms are four draws.
 *
 * A hit takes a bite: the cap shrinks a size and kicks. The batches are rebuilt every frame from the
 * list; that is a few hundred matrices, and what lets each mushroom sprout and wobble on its own.
 */
export class Field extends Behaviour<Group> {
  domes: InstancedMesh | null = null;
  rims: InstancedMesh | null = null;
  poisonDomes: InstancedMesh | null = null;
  poisonRims: InstancedMesh | null = null;

  private readonly cells: (Shroom | null)[] = new Array<Shroom | null>(COLS * ROWS).fill(null);
  private readonly list: Shroom[] = [];
  private readonly m = new Matrix4();
  private readonly q = new Quaternion();
  private readonly p = new Vector3();
  private readonly s = new Vector3();
  private readonly tint = new Color();
  private readonly z = new Vector3(0, 0, 1);

  get count(): number {
    return this.list.length;
  }

  all(): readonly Shroom[] {
    return this.list;
  }

  get(c: number, r: number): Shroom | null {
    return inField(c, r) ? this.cells[r * COLS + c]! : null;
  }

  /** The mushroom a point is inside, if any. */
  at(x: number, y: number, reach = 0.46): Shroom | null {
    const shroom = this.get(Math.round(colAt(x)), Math.round(rowAt(y)));
    if (!shroom || Time.time < shroom.born) return null;
    const dx = x - cellX(shroom.c);
    const dy = y - cellY(shroom.r);
    const size = reach * (0.55 + (0.45 * shroom.hp) / SHROOM_HP);
    return dx * dx + dy * dy < size * size ? shroom : null;
  }

  /** A new mushroom in an empty cell, sprouting after `delay` seconds. A poisoned one taints a cell that has one. */
  add(c: number, r: number, poison = false, delay = 0): Shroom | null {
    if (!inField(c, r)) return null;
    const there = this.cells[r * COLS + c];
    if (there) {
      if (poison) there.poison = true;
      return null;
    }
    const shroom: Shroom = { c, r, hp: SHROOM_HP, poison, born: Time.time + delay, kick: 0, tilt: Random.range(-0.25, 0.25), size: Random.range(0.88, 1.1) };
    this.cells[r * COLS + c] = shroom;
    this.list.push(shroom);
    return shroom;
  }

  /** Takes `damage` off it; true when that was the last of it. */
  hit(shroom: Shroom, damage: number): boolean {
    shroom.hp -= damage;
    shroom.kick = 1;
    if (shroom.hp > 0) return false;
    this.remove(shroom);
    return true;
  }

  remove(shroom: Shroom): void {
    if (this.cells[shroom.r * COLS + shroom.c] === shroom) this.cells[shroom.r * COLS + shroom.c] = null;
    const i = this.list.indexOf(shroom);
    if (i >= 0) this.list.splice(i, 1);
  }

  clear(): void {
    this.cells.fill(null);
    this.list.length = 0;
  }

  /** After a death: every bitten mushroom whole again, every poisoned one cured. How many were mended. */
  heal(): number {
    let mended = 0;
    for (const shroom of this.list) {
      if (shroom.hp < SHROOM_HP || shroom.poison) {
        mended++;
        shroom.hp = SHROOM_HP;
        shroom.poison = false;
        shroom.kick = 1;
      }
    }
    return mended;
  }

  /** How many stand in the player's zone. */
  inZone(): number {
    return this.list.reduce((n, s) => n + (s.r >= ZONE_TOP ? 1 : 0), 0);
  }

  /**
   * Tops the field up to `density` of the rows above the zone, sprouting row by row from the top —
   * the first wave's whole field, a few fresh ones after each later wave.
   */
  grow(density: number, cap = 9999): number {
    const open: [number, number][] = [];
    for (let r = 1; r < ZONE_TOP - 1; r++) for (let c = 0; c < COLS; c++) if (!this.cells[r * COLS + c]) open.push([c, r]);
    const want = Math.min(cap, Math.round(density * COLS * (ZONE_TOP - 2)) - this.list.filter((s) => s.r >= 1 && s.r < ZONE_TOP - 1).length);
    let made = 0;
    for (let i = 0; i < want && open.length; i++) {
      const [c, r] = open.splice(Random.rangeInt(0, open.length), 1)[0]!;
      this.add(c, r, false, r * 0.03 + Random.range(0, 0.15));
      made++;
    }
    return made;
  }

  override update(dt: number): void {
    const now = Time.time;
    let plain = 0;
    let poison = 0;
    for (const shroom of this.list) {
      const age = now - shroom.born;
      if (age <= 0) continue;
      shroom.kick = Math.max(0, shroom.kick - dt * 6);
      // easeOutBack: the cap pops up past its size and settles.
      const t = Math.min(1, age / 0.42);
      const o = t - 1;
      const grow = t >= 1 ? 1 : 1 + 2.2 * o * o * o + 1.2 * o * o;
      const size = shroom.size * grow * (0.48 + (0.52 * shroom.hp) / SHROOM_HP) * (1 + shroom.kick * 0.22);
      this.p.set(cellX(shroom.c), cellY(shroom.r), 0);
      this.q.setFromAxisAngle(this.z, shroom.tilt + Math.sin(now * 1.3 + shroom.c * 0.7 + shroom.r) * 0.06);
      this.s.set(size, size, size * (1 + shroom.kick * 0.4));
      this.m.compose(this.p, this.q, this.s);
      // A bitten cap darkens toward its core; a fresh hit flashes white.
      const shade = 0.5 + (0.5 * shroom.hp) / SHROOM_HP;
      this.tint.setRGB(shade + shroom.kick, shade + shroom.kick, shade + shroom.kick);
      if (shroom.poison) {
        this.set(this.poisonDomes, this.poisonRims, poison++);
      } else {
        this.set(this.domes, this.rims, plain++);
      }
    }
    this.finish(this.domes, this.rims, plain);
    this.finish(this.poisonDomes, this.poisonRims, poison);
  }

  private set(dome: InstancedMesh | null, rim: InstancedMesh | null, i: number): void {
    dome?.setMatrixAt(i, this.m);
    dome?.setColorAt(i, this.tint);
    rim?.setMatrixAt(i, this.m);
  }

  private finish(dome: InstancedMesh | null, rim: InstancedMesh | null, count: number): void {
    for (const mesh of [dome, rim]) {
      if (!mesh) continue;
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }
}
