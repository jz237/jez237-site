import { Vector3, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';
import { Behaviour, Random, WaitForSeconds, destroy } from '@scenoco-three/core';

/** Destroys its node `seconds` after it starts: a burst of sparks that has burnt out. */
export class Lifetime extends Behaviour {
  seconds = 1;

  override start(): void {
    this.startCoroutine(this.expire());
  }

  private *expire() {
    yield new WaitForSeconds(this.seconds);
    destroy(this.node);
  }
}

/** Turns its node, degrees per second about each axis. */
export class Spin extends Behaviour {
  speed = new Vector3(0, 90, 0);

  override update(dt: number): void {
    const r = this.node.rotation;
    r.x += (this.speed.x * Math.PI * dt) / 180;
    r.y += (this.speed.y * Math.PI * dt) / 180;
    r.z += (this.speed.z * Math.PI * dt) / 180;
  }
}

/** A neon tube that stutters now and then, each on its own clock — Breakout's walls. */
export class NeonFlicker extends Behaviour<Mesh> {
  minDelay = 3;
  maxDelay = 6;

  private rest = 1;

  override start(): void {
    this.rest = this.material.emissiveIntensity;
    this.startCoroutine(this.flicker());
  }

  /** The glow it returns to: the game brightens the tubes with the biome. */
  set level(value: number) {
    this.rest = value;
    this.material.emissiveIntensity = value;
  }

  private *flicker() {
    while (true) {
      yield new WaitForSeconds(Random.range(this.minDelay, this.maxDelay));
      const dips = Random.rangeInt(1, 5);
      for (let i = 0; i < dips; i++) {
        this.material.emissiveIntensity = this.rest * Random.range(0.8, 0.92);
        yield new WaitForSeconds(Random.range(0.03, 0.08));
        this.material.emissiveIntensity = this.rest;
        yield new WaitForSeconds(Random.range(0.03, 0.12));
      }
    }
  }

  get material(): MeshStandardMaterial {
    return this.node.material as MeshStandardMaterial;
  }
}

/** A shock ring: grows from nothing to `size` over `seconds`, fading as it goes, then gone. */
export class Shockwave extends Behaviour<Mesh> {
  size = 18;
  seconds = 0.7;

  private t = 0;

  override update(dt: number): void {
    this.t += dt;
    const k = Math.min(1, this.t / this.seconds);
    const eased = 1 - (1 - k) * (1 - k) * (1 - k);
    this.node.scale.setScalar(0.2 + eased * this.size);
    const material = this.node.material as MeshStandardMaterial;
    material.opacity = (1 - k) * 0.9;
    if (k >= 1) destroy(this.node);
  }
}

