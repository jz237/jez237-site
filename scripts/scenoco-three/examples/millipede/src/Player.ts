import { Plane, Raycaster, Vector2, Vector3, type Group, type Mesh, type Object3D, type PointLight } from 'three';
import { Behaviour, Input, Time, findObjectOfType } from '@scenoco-three/core';
import { Field } from './Field';
import { LEFT, PLAYER_BOTTOM, PLAYER_TOP, RIGHT, cellX, cellY, colAt, rowAt } from './grid';

/**
 * The gunner: a little armoured beetle-ship in the bottom of the field. It goes where it is steered —
 * a mouse directly, a finger by dragging anywhere (so the finger never covers it), keys or a stick by
 * speed — eases after that point, and is shoved out of any mushroom it would sit in.
 *
 * It does not fire: the game does, from where it is. It only shows the firing — the barrel kicks.
 */
export class Player extends Behaviour<Group> {
  body: Object3D | null = null;
  barrel: Object3D | null = null;
  shield: Mesh | null = null;
  beam: Mesh | null = null;
  light: PointLight | null = null;
  radius = 0.42;
  /** Keys and sticks, units per second. */
  speed = 13;

  /** The point it is steered toward. */
  readonly target = new Vector3(0, 1.4, 0);
  /** Following a script — the title screen's demo — rather than the player. */
  demo = true;
  /** Seconds left of the blink after a death, when nothing can hurt it. */
  invulnerable = 0;
  hidden = false;

  private field!: Field;
  private recoil = 0;
  private lean = 0;
  private lastX = 0;
  private bound = false;
  private dragId: number | null = null;
  private readonly lastTouch = new Vector3();
  private readonly ray = new Raycaster();
  private readonly plane = new Plane(new Vector3(0, 0, 1), -0.4);
  private readonly ndc = new Vector2();
  private readonly hit = new Vector3();

  override awake(): void {
    this.field = findObjectOfType(Field)!;
  }

  override update(dt: number): void {
    this.bind();
    if (this.demo) {
      const t = Time.time;
      this.target.set(Math.sin(t * 0.7) * 7.5 + Math.sin(t * 1.9) * 1.5, 2.2 + Math.sin(t * 1.3) * 1.4, 0);
    } else {
      const ax = Input.getAxisRaw('Horizontal');
      const ay = Input.getAxisRaw('Vertical');
      if (ax || ay) {
        this.target.x += ax * this.speed * dt;
        this.target.y += ay * this.speed * dt;
      }
    }
    this.clampTarget();
    const p = this.node.position;
    const k = 1 - Math.exp(-18 * dt);
    p.x += (this.target.x - p.x) * k;
    p.y += (this.target.y - p.y) * k;
    this.shove();
    p.x = Math.min(RIGHT - 0.45, Math.max(LEFT + 0.45, p.x));
    p.y = Math.min(PLAYER_TOP, Math.max(PLAYER_BOTTOM, p.y));
    p.z = 0.35;

    // Looks: it banks into a move, the barrel kicks back, it blinks while it cannot be hurt.
    const vx = dt > 0 ? (p.x - this.lastX) / dt : 0;
    this.lastX = p.x;
    this.lean += (Math.max(-0.6, Math.min(0.6, -vx * 0.05)) - this.lean) * (1 - Math.exp(-10 * dt));
    this.recoil = Math.max(0, this.recoil - dt * 9);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    if (this.body) {
      this.body.rotation.y = this.lean;
      this.body.position.z = Math.sin(Time.time * 6) * 0.04;
      this.body.visible = !this.hidden && (this.invulnerable <= 0 || Math.floor(Time.unscaledTime * 14) % 2 === 0);
    }
    if (this.barrel) this.barrel.position.y = 0.55 - this.recoil * 0.18;
  }

  /** It fired: the barrel kicks. */
  kick(): void {
    this.recoil = 1;
  }

  /** Back to the bottom centre. */
  home(): void {
    this.target.set(0, 1.4, 0);
    this.node.position.set(0, 1.4, 0.35);
  }

  private clampTarget(): void {
    this.target.x = Math.min(RIGHT - 0.45, Math.max(LEFT + 0.45, this.target.x));
    this.target.y = Math.min(PLAYER_TOP, Math.max(PLAYER_BOTTOM, this.target.y));
  }

  /** Out of any mushroom it overlaps: pushed along the line from the mushroom's centre. */
  private shove(): void {
    const p = this.node.position;
    const c0 = Math.round(colAt(p.x));
    const r0 = Math.round(rowAt(p.y));
    for (let r = r0 - 1; r <= r0 + 1; r++) {
      for (let c = c0 - 1; c <= c0 + 1; c++) {
        const shroom = this.field.get(c, r);
        if (!shroom || Time.time < shroom.born) continue;
        const mx = cellX(c);
        const my = cellY(r);
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.hypot(dx, dy);
        const reach = this.radius + 0.36;
        if (d >= reach) continue;
        const nx = d > 1e-4 ? dx / d : 0;
        const ny = d > 1e-4 ? dy / d : 1;
        p.x = mx + nx * reach;
        p.y = my + ny * reach;
      }
    }
  }

  // --- the pointer: a mouse points, a finger drags ------------------------------------------

  private bind(): void {
    if (this.bound) return;
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    this.bound = true;
    canvas.addEventListener('pointerdown', (e) => {
      if (this.demo) return;
      if (e.pointerType === 'mouse') this.point(e);
      else if (this.dragId === null && this.toWorld(e, this.lastTouch)) this.dragId = e.pointerId;
    });
    canvas.addEventListener('pointermove', (e) => {
      if (this.demo) return;
      if (e.pointerType === 'mouse') return this.point(e);
      if (e.pointerId !== this.dragId || !this.toWorld(e, this.hit)) return;
      // The finger's move, a little more than one to one: a short drag crosses the field.
      this.target.x += (this.hit.x - this.lastTouch.x) * 1.35;
      this.target.y += (this.hit.y - this.lastTouch.y) * 1.35;
      this.lastTouch.copy(this.hit);
      this.clampTarget();
    });
    const up = (e: PointerEvent) => {
      if (e.pointerId === this.dragId) this.dragId = null;
    };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  private point(e: PointerEvent): void {
    if (!this.toWorld(e, this.hit)) return;
    this.target.set(this.hit.x, this.hit.y + 0.4, 0);
    this.clampTarget();
  }

  private toWorld(e: PointerEvent, out: Vector3): boolean {
    const canvas = e.target as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    this.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    return this.ray.ray.intersectPlane(this.plane, out) !== null;
  }
}
