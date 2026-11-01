import { Plane, Raycaster, Vector2, Vector3, type Mesh } from 'three';
import { Behaviour, Input, KeyCode, Time } from '@scenoco-three/core';
import { SKY, half } from './world';

/** A shot asked for: where, and from which battery when the player chose one (1, 2, 3). */
export interface Shot {
  x: number;
  y: number;
  silo: number | null;
}

/**
 * The aim: a crosshair in the sky. A mouse or finger puts it where it points and a tap fires there;
 * keys and a stick move it, Space or a pad's A fires, 1 / 2 / 3 fire from that battery. While a finger
 * or button is held it reports `held`, which hold-to-fire turns into a rapid stream of shots.
 */
export class Aim extends Behaviour<Mesh> {
  /** Units per second for keys and sticks. */
  speed = 16;
  readonly shots: Shot[] = [];
  /** Still on the title screen: the demo aims for itself. */
  demo = true;
  held = false;
  private readonly pressed = new Set<number>();
  private bound = false;
  private readonly ray = new Raycaster();
  private readonly plane = new Plane(new Vector3(0, 0, 1), 0);
  private readonly ndc = new Vector2();
  private readonly hit = new Vector3();
  private pulse = 0;

  get x(): number {
    return this.node.position.x;
  }

  get y(): number {
    return this.node.position.y;
  }

  override update(dt: number): void {
    this.bind();
    this.pulse = Math.max(0, this.pulse - dt * 5);
    const s = 1 + this.pulse * 0.6;
    this.node.scale.set(s, s, s);
    this.node.rotation.z += dt * 1.2;
    if (this.demo) return;
    const ax = Input.getAxisRaw('Horizontal');
    const ay = Input.getAxisRaw('Vertical');
    if (ax || ay) this.move(this.x + ax * this.speed * Time.unscaledDeltaTime, this.y + ay * this.speed * Time.unscaledDeltaTime);
    const keys: [KeyCode, number | null][] = [[KeyCode.Space, null], [KeyCode.JoystickButton0, null], [KeyCode.JoystickButton7, null], [KeyCode.Alpha1, 0], [KeyCode.Alpha2, 1], [KeyCode.Alpha3, 2]];
    for (const [key, silo] of keys) if (Input.getKeyDown(key)) this.fire(silo);
    this.held = this.pressed.size > 0 || Input.getKey(KeyCode.Space) || Input.getKey(KeyCode.JoystickButton0) || Input.getKey(KeyCode.JoystickButton7);
  }

  /** The crosshair to a point, kept inside the sky. */
  move(x: number, y: number): void {
    this.node.position.set(Math.max(-half() + 0.2, Math.min(half() - 0.2, x)), Math.max(1.2, Math.min(SKY + 0.5, y)), 0.3);
  }

  fire(silo: number | null = null): void {
    this.shots.push({ x: this.x, y: this.y, silo });
    this.pulse = 1;
  }

  private bind(): void {
    if (this.bound) return;
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    this.bound = true;
    canvas.addEventListener('pointerdown', (e) => {
      if (this.demo || !this.toWorld(e)) return;
      this.pressed.add(e.pointerId);
      this.move(this.hit.x, this.hit.y);
      this.fire();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (this.demo || !this.toWorld(e)) return;
      if (e.pointerType === 'mouse' || this.pressed.has(e.pointerId)) this.move(this.hit.x, this.hit.y);
    });
    const up = (e: PointerEvent) => this.pressed.delete(e.pointerId);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', () => this.pressed.clear());
  }

  private toWorld(e: PointerEvent): boolean {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    return this.ray.ray.intersectPlane(this.plane, this.hit) !== null;
  }
}
