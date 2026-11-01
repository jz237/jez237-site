import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { Behaviour, Mathf, Time } from '@scenoco-three/core';
import { SKY, half } from './world';

/**
 * Breakout's camera, set down behind the cities: a little low, looking up into the sky they defend, so
 * the skyline stands against the aurora. It sways gently, shakes with trauma when the ground is hit,
 * and fits its field of view every frame to the whole sky — a strip above for the HUD — whatever the
 * screen.
 */
export class CameraRig extends Behaviour<PerspectiveCamera> {
  target = new Vector3(0, 10.5, 0);
  shake = 0.7;
  recovery = 1.4;

  private readonly home = new Vector3();
  private readonly look = new Vector3();
  private readonly corner = new Vector3();
  private trauma = 0;
  private lift = 0;
  private aspect = 0;
  private width = 0;

  override start(): void {
    this.home.copy(this.node.position);
  }

  impact(strength: number): void {
    this.trauma = Math.min(1, this.trauma + strength);
  }

  override lateUpdate(): void {
    const camera = this.node;
    this.trauma = Math.max(0, this.trauma - this.recovery * Time.unscaledDeltaTime);
    const jolt = this.trauma * this.trauma * this.shake;
    const t = Time.unscaledTime * 22;
    const nx = (Mathf.perlinNoise(t, 0.1) - 0.5) * 2;
    const ny = (Mathf.perlinNoise(0.7, t) - 0.5) * 2;
    const sway = Math.sin(Time.unscaledTime * 0.13) * 0.6;
    camera.position.set(this.home.x + sway + nx * jolt, this.home.y + ny * jolt, this.home.z);
    this.look.set(this.target.x + sway * 0.3, this.target.y, this.target.z);
    // Upright, the front fills the width and leaves height to spare: aim lower until the ground sits near
    // the bottom of the frame, so the spare height goes to the sky.
    if (camera.aspect < 0.85) {
      this.corner.set(0, -2, 0).project(camera);
      if (Number.isFinite(this.corner.y)) this.lift += (this.corner.y + 0.74) * 2.5 * Math.min(0.1, Time.unscaledDeltaTime);
    } else this.lift += (0 - this.lift) * 0.1;
    this.look.y += this.lift;
    camera.lookAt(this.look);
    camera.rotateZ(nx * jolt * 0.03);
    if (camera.aspect !== this.aspect || half() !== this.width || Time.frameCount % 30 === 0) this.fit();
  }

  /** The narrowest fov that keeps the sky's corners, the ground and the HUD strip in frame. */
  private fit(): void {
    const camera = this.node;
    this.aspect = camera.aspect;
    this.width = half();
    camera.updateMatrixWorld();
    let need = 0;
    const w = half() + 0.4;
    const top = camera.aspect < 0.85 ? SKY + 1.2 : SKY + 1.8;
    for (const [x, y] of [[-w, -2], [w, -2], [-w, top], [w, top]] as const) {
      this.corner.set(x, y, 0).applyMatrix4(camera.matrixWorldInverse);
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
