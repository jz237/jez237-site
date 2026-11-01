import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3, type Group, type Object3D } from 'three';
import { Behaviour, Random, Time } from '@scenoco-three/core';
import { ParticleSystem } from '@scenoco-three/particles';
import { geo, mat, windows } from './assets';

/** One tower material per window drawing: lit windows glow white-warm through the emissive map. */
const towerMats = windows.map(
  (map) => new MeshStandardMaterial({ color: '#16264a', emissive: '#ffe2b0', emissiveMap: map, emissiveIntensity: 2.4, roughness: 0.45, metalness: 0.55 }),
);
const beacon = new MeshStandardMaterial({ color: '#ff3b4b', emissive: '#ff3b4b', emissiveIntensity: 4 });

/**
 * A city: a cluster of towers with their windows lit, a beacon on the tallest. A hit flattens it into
 * smoking rubble that burns on; a bonus city rebuilds it. An Aegis shield, when it has one, takes the
 * hit instead.
 */
export class City extends Behaviour<Group> {
  towers: Object3D | null = null;
  rubble: Object3D | null = null;
  shield: Mesh | null = null;
  fire: ParticleSystem | null = null;

  alive = true;
  shields = 0;
  private glow = 0;
  private beaconMesh: Mesh | null = null;

  override awake(): void {
    this.build(Random.rangeInt(0, 9999));
    this.show();
  }

  /** New towers, each its own height, a beacon on the tallest. */
  build(seed: number): void {
    const towers = this.towers!;
    towers.clear();
    let x = -0.95;
    let tallest: Mesh | null = null;
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    while (x < 0.95) {
      const w = 0.3 + rnd() * 0.32;
      const h = 0.9 + rnd() * 2.1;
      const d = 0.4 + rnd() * 0.35;
      const box = new BoxGeometry(w, h, d);
      // Window UVs in world size, so every floor is the same height on every tower.
      const uv = box.attributes.uv!;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w * 2.2, uv.getY(i) * h * 1.5);
      const tower = new Mesh(box, towerMats[Math.floor(rnd() * towerMats.length)]!);
      tower.position.set(x + w / 2, h / 2, (rnd() - 0.5) * 0.3);
      towers.add(tower);
      if (!tallest || h > (tallest.geometry as BoxGeometry).parameters.height) tallest = tower;
      x += w + 0.04;
    }
    if (tallest) {
      this.beaconMesh = new Mesh(geo.glow, beacon);
      this.beaconMesh.scale.setScalar(0.35);
      this.beaconMesh.position.set(0, (tallest.geometry as BoxGeometry).parameters.height / 2 + 0.08, 0);
      tallest.add(this.beaconMesh);
    }
  }

  /** Hit by a warhead or a beam: true when it fell, false when a shield took it. */
  hit(): boolean {
    if (!this.alive) return false;
    if (this.shields > 0) {
      this.shields--;
      this.glow = 1;
      this.show();
      return false;
    }
    this.alive = false;
    this.show();
    return true;
  }

  rebuild(): void {
    this.alive = true;
    this.glow = 2.4;
    this.build(Random.rangeInt(0, 9999));
    this.show();
  }

  private show(): void {
    if (this.towers) this.towers.visible = this.alive;
    if (this.rubble) this.rubble.visible = !this.alive;
    if (this.shield) this.shield.visible = this.alive && this.shields > 0;
    if (this.alive) this.fire?.stop();
    else this.fire?.play();
  }

  override update(dt: number): void {
    if (this.beaconMesh) this.beaconMesh.visible = Math.sin(Time.unscaledTime * 3 + this.node.position.x) > 0.2;
    if (this.glow > 0) {
      this.glow = Math.max(0, this.glow - dt);
      this.node.scale.y = 1 + this.glow * 0.08;
    }
    if (this.shield?.visible) this.shield.rotation.y += dt * 0.6;
  }
}

/**
 * A missile battery: a squat armoured base, a glass dome, a barrel that swings to wherever the player
 * is aiming and kicks back when it fires. Knocked out, it goes dark and red until the wave ends; every
 * wave it is rebuilt and refilled, as in the arcade.
 */
export class Silo extends Behaviour<Group> {
  base: Mesh | null = null;
  pivot: Object3D | null = null;
  barrel: Object3D | null = null;
  index = 0;

  ammo = 15;
  ammoMax = 15;
  alive = true;
  private kick = 0;
  private aim = 0;
  private readonly muzzle = new Vector3();

  /** Swing the barrel toward a point in the sky. */
  aimAt(x: number, y: number): void {
    const p = this.node.position;
    this.aim = Math.atan2(x - p.x, Math.max(0.2, y - p.y));
  }

  fired(): void {
    this.kick = 1;
  }

  /** Where interceptors leave from: the barrel's tip. */
  tip(): Vector3 {
    const p = this.node.position;
    const a = this.pivot?.rotation.z ?? 0;
    return this.muzzle.set(p.x - Math.sin(a) * 0.9, p.y + 0.45 + Math.cos(a) * 0.9, 0);
  }

  knockOut(): void {
    this.alive = false;
    this.ammo = 0;
    if (this.base) this.base.material = mat.siloDead;
  }

  refill(ammo: number): void {
    this.alive = true;
    this.ammoMax = ammo;
    this.ammo = ammo;
    if (this.base) this.base.material = mat.silo;
  }

  override update(dt: number): void {
    if (this.pivot) {
      const want = this.alive ? -this.aim : 0;
      this.pivot.rotation.z += (want - this.pivot.rotation.z) * (1 - Math.exp(-14 * dt));
    }
    this.kick = Math.max(0, this.kick - dt * 6);
    if (this.barrel) this.barrel.position.y = 0.45 - this.kick * 0.2;
  }
}
