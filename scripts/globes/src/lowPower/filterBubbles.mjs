import { DynamicDrawUsage, InstancedMesh, MeshPhongMaterial, Object3D, SphereGeometry, Vector3 } from 'three';
import { GLASS_INNER } from '../render/scape/mesh.mjs';

const CAPACITY = 16;

export class FilterBubbles {
  mesh = new InstancedMesh(new SphereGeometry(1, 7, 5),
    new MeshPhongMaterial({ color: 0xa5dbe2, transparent: true, opacity: 0.48, depthWrite: false }), CAPACITY);
  drops = Array.from({ length: CAPACITY }, () => ({
    position: new Vector3(), velocity: new Vector3(), radius: 0, rise: 0,
  }));
  outlet = new Vector3();
  flow = [0, 0, 0];
  instance = new Object3D();
  emission = 1;
  serial = 0;

  constructor(source) {
    this.source = source;
    this.mesh.name = 'Filter bubbles';
    this.mesh.count = 0;
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
  }

  update(dt, rotation, surface, bedAt) {
    this.outlet.fromArray(this.source.at).applyMatrix3(rotation);
    this.emission = Math.min(1 + dt*this.source.rate, this.emission + dt*this.source.rate);
    if (this.emission >= 1 && this.outlet.y >= surface.heightAt(this.outlet.x, this.outlet.z)) this.emission = 0;
    // Only newly released air follows the rotating outlet. Older bubbles keep
    // their position and momentum in the same frame as the swimming fish.
    const response = 1 - Math.exp(-dt / .16);
    let count = 0;
    for (const drop of this.drops) {
      const p = drop.position, v = drop.velocity;
      if (!drop.radius) {
        if (this.emission < 1) continue;
        this.emission--;
        const variation = (++this.serial * .61803398875) % 1;
        drop.radius = this.source.radius * (.8 + .5*variation);
        drop.rise = .24 + .12*variation;
        p.copy(this.outlet);
        v.set(0, drop.rise, 0);
      }
      const bed = bedAt(p.x, p.z);
      surface.currentAt(p.x, p.y, p.z, bed, this.flow);
      v.x += (this.flow[0] - v.x) * response;
      v.y += (drop.rise + this.flow[1] - v.y) * response;
      v.z += (this.flow[2] - v.z) * response;
      p.addScaledVector(v, dt);
      const radius = GLASS_INNER - drop.radius;
      if (p.lengthSq() > radius*radius) {
        p.setLength(radius);
        v.addScaledVector(p, -Math.max(0, p.dot(v)) / (radius*radius));
      }
      p.y = Math.max(p.y, bedAt(p.x, p.z) + drop.radius);
      const top = surface.heightAt(p.x, p.z);
      if (p.y + drop.radius >= top) {
        if (drop.radius > this.source.radius) {
          surface.disturbAtSurface(p.x, top, p.z, .085, .28*drop.radius/this.source.radius);
        }
        drop.radius = 0;
        continue;
      }
      this.instance.position.copy(p);
      this.instance.scale.setScalar(drop.radius);
      this.instance.updateMatrix();
      this.mesh.setMatrixAt(count++, this.instance.matrix);
    }
    this.mesh.count = count;
    if (count) this.mesh.instanceMatrix.needsUpdate = true;
  }
}
