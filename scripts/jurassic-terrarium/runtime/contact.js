// Things that tie the animals to the ground:
//   - contact shadows: a soft dark pool under each body and a small dark spot under each planted foot,
//     where the sun's shadow map is too coarse to darken the ground (so they sit on it, not above it);
//   - footprints: where a foot plants in soft ground (damp banks, wet soil after rain, the trodden path),
//     a three-toed or rounded print is pressed in, with a rim of mud pushed up round it; lit by the sun
//     (the wall facing it bright, the far wall in shadow), so it reads as a hollow, deeper for the
//     heavier animals. Prints last for minutes, so the animals' comings and goings build up into tracks.
//     Rain fills them: puddles that mirror the sky, catch the sun as a glint and ripple while it rains,
//     then slowly dry out; heavy rain wears them away.
import {
  InstancedMesh, PlaneGeometry, ShaderMaterial, InstancedBufferAttribute, DynamicDrawUsage, Matrix4, Quaternion,
  Vector3, Vector2, Euler, CanvasTexture, Color, DataTexture, RGBAFormat, UnsignedByteType, LinearFilter,
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

// two prints in one height texture: left half a three-toed theropod print, right half a rounded print
// (sauropods, ceratopsians, stegosaurs). R = height (0.5 = the ground, lower = pressed in, higher = the rim
// of mud pushed up round it), A = where the print is (for blending)
function printTexture() {
  const W = 512, H = 256;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, W, H);
  const dent = (x, y, rx, ry, rot) => {
    const r = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    // a flat floor and steep walls, as a foot pressed into mud
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.62, 'rgba(255,255,255,0.95)');
    r.addColorStop(0.85, 'rgba(255,255,255,0.45)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.save();
    g.translate(x * 2, y * 2);
    g.rotate(rot);
    g.scale(rx * 2, ry * 2);
    g.fillStyle = r;
    g.beginPath();
    g.arc(0, 0, 1, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  g.globalCompositeOperation = 'lighten';
  // three-toed: heel pad and three splayed toes with claw tips, pointing up (+v)
  dent(64, 86, 15, 19, 0);
  dent(64, 44, 7, 26, 0);
  dent(64, 16, 3, 6, 0);
  dent(38, 52, 6, 23, -0.55);
  dent(26, 32, 3, 5, -0.55);
  dent(90, 52, 6, 23, 0.55);
  dent(102, 32, 3, 5, 0.55);
  // rounded: a broad oval pad with a rim of short toe marks
  dent(192, 72, 33, 39, 0);
  for (let k = -2; k <= 2; k++) dent(192 + k * 13, 29 + Math.abs(k) * 4, 6, 8, k * 0.25);
  const img = g.getImageData(0, 0, W, H), d = img.data, n = W * H;
  const depth = new Float32Array(n);
  for (let i = 0; i < n; i++) depth[i] = d[i * 4] / 255;
  // the rim: the depth spread out (box blur, twice) less the depth itself
  const blur = (src, r) => {
    const tmp = new Float32Array(n), out = new Float32Array(n);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let a = 0, c2 = 0;
        for (let k = -r; k <= r; k++) {
          const xx = x + k;
          if (xx >= 0 && xx < W) (a += src[y * W + xx]), c2++;
        }
        tmp[y * W + x] = a / c2;
      }
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let a = 0, c2 = 0;
        for (let k = -r; k <= r; k++) {
          const yy = y + k;
          if (yy >= 0 && yy < H) (a += tmp[yy * W + x]), c2++;
        }
        out[y * W + x] = a / c2;
      }
    return out;
  };
  const wide = blur(blur(depth, 7), 7);
  for (let i = 0; i < n; i++) {
    const rim = Math.max(0, wide[i] - depth[i]) * 1.6;
    const h = Math.max(-1, Math.min(1, rim * 0.55 - depth[i]));
    d[i * 4] = Math.round((0.5 + 0.5 * h) * 255);
    d[i * 4 + 1] = Math.round(depth[i] * 255);
    d[i * 4 + 2] = 0;
    d[i * 4 + 3] = Math.round(Math.min(1, depth[i] * 1.5 + rim * 2.5) * 255);
  }
  // carried in a DataTexture (a canvas's premultiplied alpha would crush R where A is small); rows
  // flipped, as a DataTexture starts at the bottom
  const out = new Uint8Array(n * 4);
  for (let y = 0; y < H; y++) out.set(d.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4);
  const tex = new DataTexture(out, W, H, RGBAFormat, UnsignedByteType);
  tex.magFilter = tex.minFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const PRINT_VS = `
attribute vec4 aDecal; // x: opacity, y: atlas half (0 or 0.5), z: atlas width (0.5), w: water in it, 0..1
varying vec2 vUv;
varying float vA;
varying float vFill;
varying vec3 vW;
varying vec3 vAx;
varying vec3 vAz;
void main() {
  vUv = vec2(aDecal.y + uv.x * aDecal.z, uv.y);
  vA = aDecal.x;
  vFill = aDecal.w;
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(position, 1.0);
  vW = w.xyz;
  vAx = normalize(mat3(m) * vec3(1.0, 0.0, 0.0));
  vAz = normalize(mat3(m) * vec3(0.0, 0.0, 1.0));
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const PRINT_FS = `
uniform sampler2D map;
uniform vec2 uTexel;
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform vec3 uSkyColor;
uniform float uNight;
uniform float uTime;
uniform float uRain;
varying vec2 vUv;
varying float vA;
varying float vFill;
varying vec3 vW;
varying vec3 vAx;
varying vec3 vAz;
float ph(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec4 t = texture2D(map, vUv);
  float cov = t.a * vA;
  if (cov < 0.004) discard;
  // the ground's slope across the print, from the height texture: a normal for the hollow and the rim
  float hx = texture2D(map, vUv + vec2(uTexel.x, 0.0)).r - texture2D(map, vUv - vec2(uTexel.x, 0.0)).r;
  float hy = texture2D(map, vUv + vec2(0.0, uTexel.y)).r - texture2D(map, vUv - vec2(0.0, uTexel.y)).r;
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 n = normalize(up - (vAx * hx - vAz * hy) * 7.0);
  vec3 L = normalize(uLightDir);
  float day = 1.0 - uNight * 0.75;
  float rel = (dot(n, L) - dot(up, L)) * day; // + where a wall faces the sun, - where it is turned away
  float depth = t.g;
  // the decal is unlit: its colours are scaled by how much light there is
  float lit = clamp(length(uLightColor) / 5.0, 0.12, 1.0);
  vec3 mud = vec3(0.07, 0.052, 0.034) * (0.35 + 0.65 * lit);
  vec3 soil = vec3(0.5, 0.42, 0.29) * lit; // a wall or the rim catching the sun
  float sunlit = clamp(rel * 3.5, 0.0, 1.0), shade = clamp(-rel * 3.0, 0.0, 1.0);
  vec3 col = mix(mud * (1.0 - 0.35 * depth), soil, sunlit) * (1.0 - 0.5 * shade);
  float a = cov * clamp(0.3 + 0.45 * depth + 0.6 * sunlit + 0.5 * shade, 0.0, 0.95);
  // rainwater lying in the deepest part: the sky mirrored, a glint of the sun, rings while it rains
  float wet = vFill > 0.01 ? smoothstep(1.0 - vFill - 0.05, 1.0 - vFill + 0.05, depth) : 0.0;
  if (wet > 0.0) {
    vec3 V = normalize(cameraPosition - vW);
    vec3 wn = up;
    if (uRain > 0.02) {
      vec2 q = vW.xz * 40.0, c = floor(q);
      float h = ph(c), p = fract(uTime * (1.4 + h) + h * 9.0);
      float r = length(fract(q) - 0.5 - (vec2(ph(c + 3.1), ph(c + 7.7)) - 0.5) * 0.4);
      float ring = smoothstep(0.06, 0.0, abs(r - p * 0.45)) * (1.0 - p) * step(h, uRain);
      wn = normalize(up + vec3(fract(q) - 0.5, 0.0).xzy * ring * 1.5);
    }
    // dark, muddy water: the sky only shows in it at a low angle; a bright line where it meets the mud
    float fres = 0.04 + 0.96 * pow(1.0 - max(dot(V, wn), 0.0), 4.0);
    vec3 R = reflect(-V, wn);
    // what it mirrors: low down, the dark trees round about; higher, the sky
    vec3 refl = mix(vec3(0.07, 0.08, 0.055) * (0.3 + 0.7 * lit), uSkyColor * (0.45 + 0.45 * lit), smoothstep(0.08, 0.7, R.y));
    vec3 wc = mix(vec3(0.03, 0.026, 0.02) * (0.4 + 0.6 * lit), refl, min(1.0, fres + 0.15));
    wc += uLightColor * pow(max(dot(R, L), 0.0), 180.0) * 2.5 * day;
    float edge = smoothstep(0.0, 0.06, depth - (1.0 - vFill)) * (1.0 - smoothstep(0.06, 0.14, depth - (1.0 - vFill)));
    wc += uSkyColor * edge * 0.25 * lit;
    col = mix(col, wc, wet);
    a = mix(a, vA * 0.92, wet);
  }
  gl_FragColor = vec4(col, a);
}`;

function printMesh(count, shared) {
  const g = new PlaneGeometry(1, 1);
  g.rotateX(-Math.PI / 2);
  const attr = new InstancedBufferAttribute(new Float32Array(count * 4), 4);
  attr.setUsage(DynamicDrawUsage);
  g.setAttribute('aDecal', attr);
  const tex = printTexture();
  const m = new ShaderMaterial({
    uniforms: {
      map: { value: tex }, uTexel: { value: new Vector2(1.5 / tex.image.width, 1.5 / tex.image.height) },
      uLightDir: shared.uLightDir, uLightColor: shared.uLightColor, uSkyColor: shared.uSkyColor, uNight: shared.uNight,
      uTime: shared.uTime, uRain: { value: 0 },
    },
    vertexShader: PRINT_VS, fragmentShader: PRINT_FS,
    transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
  });
  guardMaterial(m);
  const im = new InstancedMesh(g, m, count);
  im.name = 'footprints';
  im.frustumCulled = false;
  im.renderOrder = 0.6;
  for (let i = 0; i < count; i++) im.setMatrixAt(i, M.makeScale(0, 0, 0));
  return { im, attr };
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
    this.NP = ctx.quality?.pick ? ctx.quality.pick(240, 480, 640) : 480;
    this.prints = printMesh(this.NP, ctx.uniforms);
    this.printList = [];
    this.printNext = 0;
    ctx.scene.add(this.blob.im, this.prints.im);
  }

  // ambient occlusion on the ground: soft dark pools that never move, round the foot of every stone, tree,
  // the cabin and the den ({x, z, r, a}); built once when the scene is laid out
  groundShade(spots) {
    if (this.shade) return;
    const T = this.ctx.terrain, n = spots.length;
    if (!n) return;
    this.shade = decalMesh(blobTexture(), n, new Color(0.015, 0.012, 0.008), 'ground-occlusion');
    const a = this.shade.attr.array;
    spots.forEach((p, i) => {
      M.compose(P.set(p.x, T.height(p.x, p.z) + 0.002, p.z), Q.identity(), Sc.set(p.r * 2, 1, p.r * 2));
      this.shade.im.setMatrixAt(i, M);
      a.set([p.a ?? 0.45, 0, 1, 0], i * 4);
    });
    this.shade.im.renderOrder = 0.58;
    this.shade.im.instanceMatrix.needsUpdate = true;
    this.shade.attr.needsUpdate = true;
    this.ctx.scene.add(this.shade.im);
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
    this.printNext = (i + 1) % this.NP;
    const size = Math.max(0.03, d.length * 0.055) * (rounded ? 1.15 : 1);
    // heavier animals press deeper; mud by the water seeps a little water into the print at once
    const depth = Math.min(1, soft) * Math.min(1, 0.55 + 0.3 * (d.feet?.weight || 1));
    const f = { x: p.x, z: p.z, y: T.height(p.x, p.z) + 0.003, rot: heading, size, age: 0, life: 360 + Math.random() * 240, depth, rounded, fill: nearWater > 0.6 ? 0.25 : 0 };
    this.printList[i] = f;
    E.set(0, f.rot, 0);
    Q.setFromEuler(E);
    M.compose(P.set(f.x, f.y, f.z), Q, Sc.set(f.size * (f.rounded ? 1 : 0.85), 1, f.size));
    this.prints.im.setMatrixAt(i, M);
    this.prints.im.instanceMatrix.needsUpdate = true;
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
    // footprints: rain fills them and slowly wears them away; afterwards they dry out; they fade at the end
    const life = this.ctx.modules.life?.env, rain = life?.rain || 0, sunny = life?.sunny ?? 0.5;
    this.prints.im.material.uniforms.uRain.value = rain;
    const pa = this.prints.attr.array;
    let any = false;
    for (let i = 0; i < this.NP; i++) {
      const f = this.printList[i];
      if (!f) continue;
      f.age += dt * (1 + rain * 1.5);
      const t = f.age / f.life;
      if (t >= 1) {
        this.printList[i] = null;
        pa[i * 4] = 0;
        any = true;
        continue;
      }
      if (rain > 0.05) f.fill = Math.min(0.85, f.fill + dt * rain * 0.03);
      else f.fill = Math.max(0, f.fill - dt * 0.0025 * (0.4 + sunny));
      const op = f.depth * Math.min(1, f.age * 4) * (1 - Math.max(0, (t - 0.7) / 0.3) ** 2);
      pa[i * 4] = op;
      pa[i * 4 + 1] = f.rounded ? 0.5 : 0;
      pa[i * 4 + 2] = 0.5;
      pa[i * 4 + 3] = f.fill;
      any = true;
    }
    if (any) {
      this.prints.attr.needsUpdate = true;
    }
  }
}
