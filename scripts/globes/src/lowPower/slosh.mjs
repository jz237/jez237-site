import { Quaternion, Vector3 } from 'three';
import { GLASS_INNER } from '../render/scape/mesh.mjs';
import { RIPPLE_HEIGHT, SurfaceRipples } from './ripples.mjs';

export const WATER_LEVEL = 0.25;
export const SURFACE_RADIUS = Math.sqrt(GLASS_INNER ** 2 - WATER_LEVEL ** 2);
const UP = new Vector3(0, 1, 0);
const limit = (v, n) => Math.max(-n, Math.min(n, v));

// The shallowest two rocking modes of the free surface, in horizontal world axes.
// The bowl's acceleration inclines the effective gravity. After the hand stops, gravity
// pulls the surface level and drag damps its oscillation. Rotation alone preserves the
// volume of a spherical cap. The small curved mode vanishes at its contact with the glass.
export class Slosh {
  sx = 0; sz = 0;
  vx = 0; vz = 0;
  time = 0;
  currentX = 0; currentZ = 0;
  normal = UP.clone();
  rotation = new Quaternion();
  inverse = new Quaternion();
  bend = { value: 0 };
  ripples = new SurfaceRipples(SURFACE_RADIUS);
  point = new Vector3();

  step(dt, gravity, omega) {
    this.time += dt;
    const steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps;
    const gx = limit(gravity[0] / 24 + omega[2] * 0.075, 0.38);
    const gz = limit(gravity[2] / 24 - omega[0] * 0.075, 0.38);
    for (let i = 0; i < steps; i++) {
      this.vx += (48 * (gx - this.sx) - 2.5 * this.vx) * h;
      this.vz += (48 * (gz - this.sz) - 2.5 * this.vz) * h;
      this.sx += this.vx * h;
      this.sz += this.vz * h;
    }
    // Limit the crest in the closed bowl during a repeated hard shake.
    const scale = Math.min(1, 0.37 / (Math.hypot(this.sx, this.sz) || 1));
    this.sx *= scale;
    this.sz *= scale;
    this.normal.set(-this.sx, 1, -this.sz).normalize();
    this.rotation.setFromUnitVectors(UP, this.normal);
    this.inverse.copy(this.rotation).invert();
    this.bend.value = limit((this.vx + this.vz) * 0.042, 0.075);
    const gain = Math.min(1, 1.85 / (Math.hypot(this.vx, this.vz) || 1));
    this.currentX = this.vx * gain;
    this.currentZ = this.vz * gain;
    // The rotating glass also draws water up where it moves through the film.
    // Blend its vertical rim speed with that of the rocking free surface.
    const wallX = this.currentX + .32*(omega[2]-this.currentX);
    const wallZ = this.currentZ + .32*(-omega[0]-this.currentZ);
    this.ripples.step(dt, wallX, wallZ);
  }

  // The rocking water moves fastest near the film. Its rising side lifts what is
  // swimming there; near the glass the horizontal stream turns along the wall.
  currentAt(x, y, z, bed, out, offset = 0) {
    const top = this.heightAt(x, z);
    const depth = Math.max(0, Math.min(1, (y - bed) / Math.max(0.04, top - bed)));
    const along = this.currentX * x + this.currentZ * z;
    const span = Math.max(0.1, GLASS_INNER ** 2 - y * y);
    const speed = 0.26 + 0.72 * depth;
    out[offset] = speed * (this.currentX - x * along / span) + 0.009 * Math.sin(0.68 * this.time + z);
    out[offset + 1] = depth * along;
    out[offset + 2] = speed * (this.currentZ - z * along / span) + 0.006 * Math.cos(0.47 * this.time + x);
    return top;
  }

  riseAtRestPosition(x,z) {
    const r2 = Math.min(1, (x*x + z*z) / SURFACE_RADIUS**2);
    return this.bend.value*(1-r2)*(1-3*r2) + this.ripples.heightAt(x,z);
  }

  disturbAtSurface(x, y, z, radius, speed) {
    const p = this.point.set(x,y,z).applyQuaternion(this.inverse);
    const scale = SURFACE_RADIUS / Math.sqrt(GLASS_INNER**2 - p.y*p.y);
    this.ripples.disturb(p.x*scale, p.z*scale, radius, speed);
  }

  sampleAtRise(x, z, dx, dz, rise) {
    // A ring of the surface widens as it falls and narrows as it rises along
    // the sphere. Recover its resting coordinates at this physical position.
    const y = WATER_LEVEL + rise;
    const scale = SURFACE_RADIUS / Math.sqrt(GLASS_INNER**2 - y*y);
    return this.riseAtRestPosition((x + dx*rise)*scale, (z + dz*rise)*scale);
  }

  localDisplacement(x, z, dx = 0, dz = 0, floor = -Infinity, ceiling = Infinity) {
    const bound = Math.abs(this.bend.value) + RIPPLE_HEIGHT;
    let lo = Math.max(-bound, floor), hi = Math.min(bound, ceiling);
    // A steep shoreline can cross a vertical sightline more than once if
    // extended outside the bowl. Keep the search inside the physical column.
    if (ceiling <= -bound || (hi === ceiling && this.sampleAtRise(x,z,dx,dz,hi) >= hi-.00001)) return ceiling;
    if (floor >= bound || (lo === floor && this.sampleAtRise(x,z,dx,dz,lo) <= lo+.00001)) return floor;
    let rise = Math.max(lo, Math.min(hi, 0));
    for (let i = 0; i < 16; i++) {
      const next = this.sampleAtRise(x,z,dx,dz,rise);
      if (Math.abs(next-rise) < .00002) return next;
      if (next > rise) lo = rise; else hi = rise;
      // Bisect only if the fixed-point iteration stalls at a steep crest.
      rise = i < 4 && next >= lo && next <= hi ? next : (lo+hi)*.5;
    }
    return rise;
  }

  heightAt(x, z) {
    const plane = WATER_LEVEL / this.normal.y + this.sx * x + this.sz * z;
    const p = this.point.set(x, plane, z).applyQuaternion(this.inverse);
    const cap2 = GLASS_INNER**2 - x*x - z*z;
    const limit = Math.abs(plane) + (Math.abs(this.bend.value) + RIPPLE_HEIGHT) / this.normal.y;
    if (cap2 >= 0 && cap2 < limit*limit) {
      const cap = Math.sqrt(cap2);
      const rise = this.localDisplacement(p.x,p.z,this.sx,this.sz,(-cap-plane)*this.normal.y,(cap-plane)*this.normal.y);
      return plane + rise / this.normal.y;
    }
    return plane + this.localDisplacement(p.x, p.z, this.sx, this.sz) / this.normal.y;
  }
}
