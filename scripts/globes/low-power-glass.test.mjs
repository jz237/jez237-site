import assert from 'node:assert/strict';
import test from 'node:test';
import { Vector2 } from 'three';
import { GLASS_INNER } from './src/render/scape/mesh.mjs';
import { buildLensProfile, LENS_SIZE, MAX_INVERSE_DISTANCE } from './src/lowPower/lensProfile.mjs';

const [width, height, depth] = LENS_SIZE;
const table = buildLensProfile();
function gain(i, j, k, channel) {
  return table[2 * (i + width * (j + height * k)) + channel];
}

// Independent reference: follow a camera ray to both spheres by solving the
// quadratic intersection and applying vector Snell refraction at each wall.
function enter(origin, direction, radius, eta) {
  const b = origin.dot(direction);
  const t = -b - Math.sqrt(b*b - origin.lengthSq() + radius*radius);
  const hit = origin.clone().addScaledVector(direction, t);
  const normal = hit.clone().normalize(), cosine = -normal.dot(direction);
  const next = direction.clone().multiplyScalar(eta).addScaledVector(normal,
    eta*cosine - Math.sqrt(1 - eta*eta*(1 - cosine*cosine)));
  return [hit, next];
}

test('low power projects points back onto their refracted camera rays', () => {
  for (const k of [2, 4, 7]) {
    const eye = new Vector2(0, (depth - 1) / (k * MAX_INVERSE_DISTANCE));
    for (const j of [12, 24, 36]) for (const screenR of [.12, .32, .52]) {
      const z = 2*j/(height-1)-1;
      const dir = new Vector2(screenR, z-eye.y).normalize();
      const [outer, glassDir] = enter(eye, dir, 1, 1/1.5);
      for (const [channel, index] of [1.333, 1].entries()) {
        const [inner, ray] = enter(outer, glassDir, GLASS_INNER, 1.5/index);
        const trueR = inner.x + (z-inner.y)*ray.x/ray.y;
        const at = trueR*(width-1), i = Math.floor(at), f = at-i;
        const projected = trueR*((1-f)*gain(i,j,k,channel) + f*gain(i+1,j,k,channel));
        assert.ok(Math.abs(projected-screenR)<.002);
      }
    }
  }
});

test('submerged magnification increases with depth, while air and the front wall stay close to true size', () => {
  const near = gain(0,36,3,0), middle = gain(0,24,3,0), deep = gain(0,12,3,0);
  assert.ok(near > 1.1 && near < middle && middle < deep);
  assert.ok(Math.abs(middle-1.333) < .001);
  assert.ok(Math.abs(gain(0,12,3,1)-1) < .005);
  assert.equal(gain(0,height-1,3,0),1);
});

test('the projected interior stays ordered and inside the silhouette at every view distance', () => {
  for (let k=0;k<depth;k++) for (let j=0;j<height;j++) {
    const s = k*MAX_INVERSE_DISTANCE/(depth-1), z = 2*j/(height-1)-1;
    const silhouette = (1-z*s)/Math.sqrt(1-s*s);
    for (const channel of [0,1]) {
      let previous = 0;
      for (let i=0;i<width;i++) {
        const q = i/(width-1);
        if (q*q + z*z > GLASS_INNER**2) break;
        const projected = q*gain(i,j,k,channel);
        assert.ok(projected >= previous && projected <= silhouette + .0001);
        previous = projected;
      }
    }
  }
});
