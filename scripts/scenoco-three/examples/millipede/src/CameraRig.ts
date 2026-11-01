import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { Behaviour, Mathf, Time, findObjectOfType } from '@scenoco-three/core';
import { LEFT, RIGHT, TOP } from './grid';
import { Player } from './Player';

/**
 * Breakout's camera, stood further back: behind the gunner looking up the field, drifting after it so
 * the near mushrooms slide past the far ones, and shaking with trauma when the game hits hard.
 *
 * Its field of view is fitted every frame so the whole field — and a strip above it for the HUD — is
 * on screen, upright phone or wide monitor alike.
 */
export class CameraRig extends Behaviour<PerspectiveCamera> {
  target = new Vector3(0, 11.5, 0);
  follow = 0.22;
  smoothing = 3;
  shake = 0.6;
  recovery = 1.5;

  /** Where it stands on an upright screen: higher and steeper, so a narrow field fills more of it. */
  portrait = new Vector3(0, 8, 46);
  portraitTarget = new Vector3(0, 12.8, 0);

  private readonly home = new Vector3();
  private readonly wide = new Vector3();
  private readonly wideTarget = new Vector3();
  private readonly look = new Vector3();
  private readonly corner = new Vector3();
  private drift = 0;
  private trauma = 0;
  private player: Player | null = null;
  private aspect = 0;

  override start(): void {
    this.wide.copy(this.node.position);
    this.wideTarget.copy(this.target);
    this.home.copy(this.wide);
    this.player = findObjectOfType(Player);
  }

  /** A hit the screen should feel: 0.2 a tremor, 1 a jolt. */
  impact(strength: number): void {
    this.trauma = Math.min(1, this.trauma + strength);
  }

  override lateUpdate(dt: number): void {
    const camera = this.node;
    const upright = camera.aspect < 0.85;
    this.home.copy(upright ? this.portrait : this.wide);
    const aim = upright ? this.portraitTarget : this.wideTarget;
    // Upright, the field fills the width: following the gunner would push a wall off the screen.
    const wanted = upright ? 0 : (this.player?.node.position.x ?? 0) * this.follow;
    this.drift += (wanted - this.drift) * (1 - Math.exp(-this.smoothing * dt));
    this.trauma = Math.max(0, this.trauma - this.recovery * Time.unscaledDeltaTime);
    const jolt = this.trauma * this.trauma * this.shake;
    const t = Time.unscaledTime * 22;
    const nx = (Mathf.perlinNoise(t, 0.1) - 0.5) * 2;
    const ny = (Mathf.perlinNoise(0.7, t) - 0.5) * 2;
    camera.position.set(this.home.x + this.drift + nx * jolt, this.home.y + ny * jolt, this.home.z);
    this.look.set(aim.x + this.drift * 0.5, aim.y, aim.z);
    camera.lookAt(this.look);
    camera.rotateZ(nx * jolt * 0.04);
    if (camera.aspect !== this.aspect || Time.frameCount % 30 === 0) this.fit();
  }

  /**
   * The narrowest fov that keeps the field's corners and the HUD strip inside the frame. A point's
   * screen position is its view-space slope over tan(fov / 2), so one pass scales the fov exactly.
   */
  private fit(): void {
    const camera = this.node;
    this.aspect = camera.aspect;
    camera.updateMatrixWorld();
    const inverse = camera.matrixWorldInverse;
    let need = 0;
    const top = camera.aspect < 0.85 ? TOP + 0.9 : TOP + 1.6;
    const corners: [number, number][] = [[LEFT - 0.35, -1.3], [RIGHT + 0.35, -1.3], [LEFT - 0.35, top], [RIGHT + 0.35, top]];
    for (const [x, y] of corners) {
      this.corner.set(x, y, 0).applyMatrix4(inverse);
      const depth = -this.corner.z;
      if (depth <= 0) continue;
      need = Math.max(need, Math.abs(this.corner.y) / depth, Math.abs(this.corner.x) / depth / camera.aspect);
    }
    if (!need) return;
    const fov = 2 * Math.atan(need * 1.02) * MathUtils.RAD2DEG;
    if (Math.abs(fov - camera.fov) < 0.01) return;
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}
