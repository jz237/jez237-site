import type { Group, Object3D } from 'three';
import { Behaviour, Random, destroy, findObjectOfType } from '@scenoco-three/core';
import { Field } from './Field';
import { COLS, LEFT, PLAYER_BOTTOM, PLAYER_TOP, RIGHT, ROWS, ZONE_TOP, cellX, cellY, colAt, rowAt } from './grid';

export type EnemyKind = 'spider' | 'flea' | 'bee' | 'scorpion' | 'inchworm' | 'spore';

/** The game an enemy reports to, without a cycle in the imports: set by the game as it makes one. */
export interface Arena {
  readonly slow: number;
  readonly wave: number;
  readonly playerX: number;
  readonly playerY: number;
  enemyLanded(enemy: Enemy): void;
}

/**
 * Anything on the field that is not the millipede: it moves on its own, a bolt takes `hp` off it, and
 * for its first moments it is only a warning — it blinks and cannot hurt.
 */
export abstract class Enemy extends Behaviour<Group> {
  kind: EnemyKind = 'spider';
  hp = 1;
  radius = 0.55;
  /** Seconds of warning left. */
  warn = 0.6;
  /** The visible part, which blinks during the warning and kicks on a hit. */
  look: Object3D | null = null;
  /** Can it touch the player at all — a spore cannot. */
  harmful = true;

  game!: Arena;
  protected field!: Field;
  protected t = 0;
  private kick = 0;

  override awake(): void {
    this.field = findObjectOfType(Field)!;
  }

  get dangerous(): boolean {
    return this.harmful && this.warn <= 0;
  }

  override update(dt: number): void {
    const d = dt * (this.game?.slow ?? 1);
    this.warn = Math.max(0, this.warn - dt);
    this.t += d;
    this.move(d);
    this.kick = Math.max(0, this.kick - dt * 6);
    if (this.look) {
      this.look.visible = this.warn <= 0 || Math.floor(this.t * 12) % 2 === 0;
      this.look.scale.setScalar(1 + this.kick * 0.3);
    }
    const p = this.node.position;
    if (p.x < LEFT - 3 || p.x > RIGHT + 3 || p.y < -2 || p.y > ROWS + 4) destroy(this.node);
  }

  protected abstract move(dt: number): void;

  /** A bolt struck it. True when that was the end of it. */
  hit(damage: number): boolean {
    this.hp -= damage;
    this.kick = 1;
    return this.hp <= 0;
  }

  /** Points for it, given where the player is — a spider is worth more the closer it came. */
  points(px: number, py: number): number {
    if (this.kind === 'spider') {
      const d = Math.hypot(this.node.position.x - px, this.node.position.y - py);
      return d < 2 ? 900 : d < 4 ? 600 : 300;
    }
    return { flea: 200, bee: 400, scorpion: 500, inchworm: 500, spore: 50 }[this.kind];
  }

  /** Heading in from `side` (+1 from the left): the x it starts at. */
  protected static edge(side: number): number {
    return side > 0 ? LEFT - 0.7 : RIGHT + 0.7;
  }
}

/** Prowls the player's zone in a jittery zigzag, eating mushrooms, then leaves. */
export class Spider extends Enemy {
  legs: Object3D | null = null;
  private vx = 4;
  private vy = 2;
  private life = 7;
  private turn = 0;

  enter(side: number, wave: number): void {
    this.kind = 'spider';
    this.hp = 1;
    this.radius = 0.6;
    this.node.position.set(Enemy.edge(side), Random.range(PLAYER_BOTTOM + 0.5, PLAYER_TOP + 1.2), 0.4);
    this.vx = side * Random.range(3.4, 5.4) * (1 + Math.min(0.6, wave * 0.02));
    this.vy = Random.range(-3, 3);
    this.life = Random.range(5.5, 8.5);
  }

  protected move(dt: number): void {
    const p = this.node.position;
    this.life -= dt;
    if (this.life > 0) {
      if (p.x < LEFT + 0.6 && this.vx < 0) this.vx = Math.abs(this.vx);
      if (p.x > RIGHT - 0.6 && this.vx > 0) this.vx = -Math.abs(this.vx);
    }
    // Hops at the player's height and past it, a fresh angle every so often.
    this.turn -= dt;
    if (this.turn <= 0) {
      this.turn = Random.range(0.25, 0.7);
      const toward = Math.sign(this.game.playerY - p.y) || 1;
      this.vy = (Random.value < 0.65 ? toward : -toward) * Random.range(2.5, 5.5);
    }
    p.x += this.vx * dt;
    p.y += this.vy * dt;
    if (p.y < PLAYER_BOTTOM) this.vy = Math.abs(this.vy);
    if (p.y > PLAYER_TOP + 2) this.vy = -Math.abs(this.vy);
    p.y = Math.max(PLAYER_BOTTOM - 0.2, Math.min(PLAYER_TOP + 2.2, p.y));
    this.node.rotation.z = Math.sin(this.t * 9) * 0.15;
    if (this.legs) this.legs.rotation.z = Math.sin(this.t * 22) * 0.18;
    // It eats the mushrooms it crosses, some of them.
    const shroom = this.field.at(p.x, p.y, 0.3);
    if (shroom && Random.value < 0.05) this.field.remove(shroom);
  }
}

/** Drops straight down, sowing mushrooms; a first hit only makes it angry and faster. */
export class Flea extends Enemy {
  private vy = 5;
  private lastRow = -1;

  enter(wave: number, x: number): void {
    this.kind = 'flea';
    this.hp = 2;
    this.radius = 0.45;
    this.warn = 0.7;
    this.node.position.set(x, ROWS + 1, 0.45);
    this.vy = Random.range(5, 7) + wave * 0.1;
  }

  override hit(damage: number): boolean {
    const dead = super.hit(damage);
    if (!dead) this.vy *= 2;
    return dead;
  }

  protected move(dt: number): void {
    const p = this.node.position;
    p.y -= this.vy * dt;
    this.node.rotation.z += dt * 6;
    const r = Math.round(rowAt(p.y));
    if (r !== this.lastRow) {
      this.lastRow = r;
      if (r >= 1 && r < ROWS - 1 && Random.value < 0.3) this.field.add(Math.round(colAt(p.x)), r);
    }
  }
}

/** Dives in a swooping column, planting a dense trail. */
export class Bee extends Enemy {
  wings: Object3D | null = null;
  private x0 = 0;
  private vy = 6;
  private drop = 0.2;

  enter(wave: number, x: number): void {
    this.kind = 'bee';
    this.hp = 2;
    this.radius = 0.5;
    this.warn = 0.7;
    this.x0 = x;
    this.node.position.set(x, ROWS + 1, 0.5);
    this.vy = Random.range(5.5, 7) + wave * 0.11;
  }

  protected move(dt: number): void {
    const p = this.node.position;
    p.x = this.x0 + Math.sin(this.t * 3.2) * 1.6;
    p.y -= this.vy * dt;
    if (this.wings) this.wings.rotation.x = Math.sin(this.t * 60) * 0.6;
    this.drop -= dt;
    if (this.drop <= 0 && p.y > cellY(ZONE_TOP - 1) && p.y < ROWS - 0.5) {
      this.drop = 0.2;
      this.field.add(Math.round(colAt(p.x)), Math.round(rowAt(p.y)));
    }
  }
}

/** Crosses the upper field, poisoning every mushroom on its row. */
export class Scorpion extends Enemy {
  tail: Object3D | null = null;
  private vx = 3;

  enter(side: number, wave: number): void {
    this.kind = 'scorpion';
    this.hp = 2;
    this.radius = 0.6;
    this.warn = 0.9;
    const row = Random.rangeInt(1, Math.floor(ROWS * 0.55));
    this.node.position.set(Enemy.edge(side), cellY(row), 0.4);
    this.vx = side * (Random.range(2.8, 4.2) + wave * 0.05);
    this.node.scale.x = side;
  }

  protected move(dt: number): void {
    const p = this.node.position;
    p.x += this.vx * dt;
    if (this.tail) this.tail.rotation.z = Math.sin(this.t * 5) * 0.25;
    const c = Math.round(colAt(p.x));
    const shroom = this.field.get(c, Math.round(rowAt(p.y)));
    if (shroom && Math.abs(cellX(c) - p.x) < 0.4) shroom.poison = true;
  }
}

/** A rare bonus target inching across: shoot it and time slows. */
export class Inchworm extends Enemy {
  private vx = 1.6;

  enter(side: number): void {
    this.kind = 'inchworm';
    this.hp = 1;
    this.radius = 0.6;
    this.warn = 0.9;
    this.node.position.set(Enemy.edge(side), cellY(Random.rangeInt(7, 14)), 0.4);
    this.vx = side * 1.7;
    this.node.scale.x = side;
  }

  protected move(dt: number): void {
    // Scrunch, then surge.
    const gait = Math.max(0, Math.sin(this.t * 4.2));
    this.node.position.x += this.vx * dt * (0.25 + gait * 1.5);
    if (this.look) this.look.scale.y = 1 - gait * 0.3;
    if (this.look) this.look.position.z = gait * 0.25;
  }
}

/** A queen's poison spore: lobbed over the field, it lands as a poisoned mushroom unless shot down. */
export class Spore extends Enemy {
  private x0 = 0;
  private y0 = 0;
  private x1 = 0;
  private y1 = 0;
  private flight = 1;

  launch(x: number, y: number): void {
    this.kind = 'spore';
    this.hp = 1;
    this.radius = 0.4;
    this.warn = 0;
    this.harmful = false;
    this.x0 = x;
    this.y0 = y;
    const c = Random.rangeInt(0, COLS);
    const r = Random.rangeInt(Math.max(2, Math.round(rowAt(y)) + 2), ZONE_TOP - 1);
    this.x1 = cellX(c);
    this.y1 = cellY(Math.min(ZONE_TOP - 2, r));
    this.flight = Random.range(1.1, 1.6);
    this.node.position.set(x, y, 0.5);
  }

  protected move(): void {
    const k = Math.min(1, this.t / this.flight);
    const p = this.node.position;
    p.x = this.x0 + (this.x1 - this.x0) * k;
    p.y = this.y0 + (this.y1 - this.y0) * k;
    p.z = 0.5 + Math.sin(k * Math.PI) * 3;
    if (k >= 1) {
      this.field.add(Math.round(colAt(p.x)), Math.round(rowAt(p.y)), true);
      this.game.enemyLanded(this);
      destroy(this.node);
    }
  }
}
