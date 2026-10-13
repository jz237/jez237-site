// Things that tie the animals to the ground:
//   - contact shadows: a soft dark pool under each body and a small dark spot under each planted foot,
//     where the sun's shadow map is too coarse to darken the ground (so they sit on it, not above it);
//   - footprints: where a foot plants in soft ground (damp banks, wet soil after rain), a three-toed or
//     rounded print is pressed in, and fades over a minute or two.
import {
  InstancedMesh, PlaneGeometry, ShaderMaterial, InstancedBufferAttribute, DynamicDrawUsage, Matrix4, Quaternion,
  Vector3, Euler, CanvasTexture, Color,
} from 'three';
import { guardMaterial } from './safety.js';

const M = new Matrix4(), Q = new Quaternion(), P = new Vector3(), Sc = new Vector3(), E = new Euler();

function blobTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(0,0,0,1)');
  r.addColorStop(0.5, 'rgba(0,0,0,0.55)');
  r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

// two prints in one texture: left half a three-toed theropod/ornithopod print, right half a rounded
// elephant-like print (sauropods, ceratopsians, stegosaurs)
function printTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(0,0,0,0)';
  g.fillRect(0, 0, 256, 128);
  const dent = (x, y, rx, ry, rot) => {
    const r = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    r.addColorStop(0, 'rgba(0,0,0,0.95)');
    r.addColorStop(0.75, 'rgba(0,0,0,0.6)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    g.scale(rx, ry);
    g.fillStyle = r;
    g.beginPath();
    g.arc(0, 0, 1, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  // three-toed: heel pad and three splayed toes, pointing up (+v)
  dent(64, 84, 16, 20, 0);
  dent(64, 40, 7, 26, 0);
  dent(38, 50, 6, 24, -0.55);
  dent(90, 50, 6, 24, 0.55);
  // rounded: a broad oval pad with a rim of short toe marks
  dent(192, 70, 34, 40, 0);
  for (let k = -2; k <= 2; k++) dent(192 + k * 13, 28 + Math.abs(k) * 4, 6, 8, k * 0.25);
  return new CanvasTexture(c);
}

const VS = `
attribute vec4 aDecal; // x: opacity, y: atlas half (0 or 0.5), z: atlas width (1 or 0.5)
varying vec2 vUv;
varying float vA;
void main() {
  vUv = vec2(aDecal.y + uv.x * aDecal.z, uv.y);
  vA = aDecal.x;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
}`;

const FS = `
uniform sampler2D map;
uniform vec3 uColor;
varying vec2 vUv;
varying float vA;
void main() {
  float a = texture2D(map, vUv).a * vA;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`;

function decalMesh(tex, count, color, name) {
  const g = new PlaneGeometry(1, 1);
  g.rotateX(-Math.PI / 2);
  const attr = new InstancedBufferAttribute(new Float32Array(count * 4), 4);
  attr.setUsage(DynamicDrawUsage);
  g.setAttribute('aDecal', attr);
  const m = new ShaderMaterial({
    uniforms: { map: { value: tex }, uColor: { value: color } },
    vertexShader: VS, fragmentShader: FS,
    transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
  });
  guardMaterial(m);
  const im = new InstancedMesh(g, m, count);
  im.name = name;
  im.frustumCulled = false;
  im.renderOrder = 0.6;
  for (let i = 0; i < count; i++) im.setMatrixAt(i, M.makeScale(0, 0, 0));
  return { im, attr };
}

export class Contact {
  constructor(ctx, mod) {
    this.ctx = ctx;
    this.mod = mod;
    this.blob = decalMesh(blobTexture(), 160, new Color(0.02, 0.015, 0.01), 'contact-shadows');
    this.prints = decalMesh(printTexture(), 260, new Color(0.09, 0.06, 0.035), 'footprints');
    this.printList = [];
    this.printNext = 0;
    ctx.scene.add(this.blob.im, this.prints.im);
  }

  // called when a foot plants: press a print if the ground there is soft
  footprint(d, p, heading, rounded) {
    const T = this.ctx.terrain, w = this.ctx.world;
    const nearWater = Math.max(T.lakeMask(p.x + 0.25, p.z), T.lakeMask(p.x - 0.25, p.z), T.lakeMask(p.x, p.z + 0.25), T.lakeMask(p.x, p.z - 0.25), T.riverMask(p.x, p.z) * 1.2);
    const inWater = Math.max(T.lakeMask(p.x, p.z), T.riverMask(p.x, p.z)) > 0.5;
    // the trodden earth of the footpath takes a print too
    const onPath = window.__jtPathAt?.(p.x, p.z, 0.02) ? 0.75 : 0;
    const soft = Math.max(nearWater, (w.groundWetness || 0) * 0.9, onPath);
    if (inWater || soft < 0.3) return;
    const i = this.printNext;
    this.printNext = (i + 1) % 260;
    const size = Math.max(0.03, d.length * 0.055) * (rounded ? 1.15 : 1);
    this.printList[i] = { x: p.x, z: p.z, y: T.height(p.x, p.z) + 0.003, rot: heading, size, age: 0, life: 70 + Math.random() * 40, depth: Math.min(1, soft), rounded };
  }

  update(dt) {
    const T = this.ctx.terrain;
    // contact shadows, rebuilt each frame
    let n = 0;
    const a = this.blob.attr.array;
    const sun = this.ctx.world.lightIntensity ?? 1;
    const k = 0.32 + 0.18 * Math.min(1, sun); // a little darker in strong light
    for (const d of this.mod.walkers || []) {
      if (!d.root.visible) continue;
      const bx = d.pos.x, bz = d.pos.z;
      const y = T.height(bx, bz) + 0.004;
      // body pool, stretched along the body
      E.set(0, d.heading, 0);
      Q.setFromEuler(E);
      M.compose(P.set(bx, y, bz), Q, Sc.set(Math.max((d.side || 0.1) * 2.6, d.length * 0.18), 1, d.length * 0.72));
      this.blob.im.setMatrixAt(n, M);
      a.set([k * 0.75, 0, 1, 0], n * 4);
      n++;
      // each foot: darker the closer it is to the ground
      for (const L of d.feet.legs) {
        if (n >= 160) break;
        L.contact.getWorldPosition(P);
        const gy = T.height(P.x, P.z), lift = Math.max(0, P.y - gy);
        const s = d.length * 0.09;
        const op = k * 1.25 * Math.max(0, 1 - lift / (d.length * 0.08));
        M.compose(P.set(P.x, gy + 0.005, P.z), Q, Sc.set(s, 1, s * 1.3));
        this.blob.im.setMatrixAt(n, M);
        a.set([op, 0, 1, 0], n * 4);
        n++;
      }
    }
    for (let i = n; i < 160; i++) a[i * 4] = 0;
    this.blob.im.instanceMatrix.needsUpdate = true;
    this.blob.attr.needsUpdate = true;
    // footprints: fade with age; rain washes them out faster
    const rain = this.ctx.modules.life?.env?.rain || 0;
    const pa = this.prints.attr.array;
    let any = false;
    for (let i = 0; i < 260; i++) {
      const f = this.printList[i];
      if (!f) continue;
      f.age += dt * (1 + rain * 4);
      const t = f.age / f.life;
      if (t >= 1) {
        this.printList[i] = null;
        pa[i * 4] = 0;
        any = true;
        continue;
      }
      E.set(0, f.rot, 0);
      Q.setFromEuler(E);
      M.compose(P.set(f.x, f.y, f.z), Q, Sc.set(f.size * (f.rounded ? 1 : 0.85), 1, f.size));
      this.prints.im.setMatrixAt(i, M);
      pa.set([0.5 * f.depth * (1 - t * t) * Math.min(1, f.age * 4), f.rounded ? 0.5 : 0, 0.5, 0], i * 4);
      any = true;
    }
    if (any) {
      this.prints.im.instanceMatrix.needsUpdate = true;
      this.prints.attr.needsUpdate = true;
    }
  }
}
