// Air in the case, as in the concept: warm shafts of light falling from the lid spotlights through humid
// jungle air, specks of dust turning in them, a low haze lying between the trees, mist drifting off the
// waterfall and the cascades, and at night faint cool moonbeams through the glass and fireflies over the
// pool. Everything that floats (haze, valley mist, peak wisps, waterfall mist) rides Weatherglass's
// wind field: it leans and streams downwind, streaks out and thins in a gale, settles back when calm.
// Every material here is additive and soft, and guarded against invalid pixels (see safety.js):
// a bad pixel in an additive HDR layer would be bloomed into a full-screen flash.
import {
  Group, Mesh, Points, CylinderGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending,
  Vector3, Color, DoubleSide, Sprite, SpriteMaterial, CanvasTexture, PlaneGeometry, Vector2,
} from 'three';
import { guardMaterial } from './safety.js';

const BEAM_VS = `
varying vec3 vW;
varying vec3 vN;
varying float vY;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vY = uv.y;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const BEAM_FS = `
uniform vec3 uColor;
uniform float uAmount;
uniform float uTime;
varying vec3 vW;
varying vec3 vN;
varying float vY;
float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
void main() {
  vec3 V = normalize(cameraPosition - vW);
  // a soft-edged shaft: brightest where we look through the most air (the middle), fading at the rim
  float edge = pow(abs(dot(normalize(vN), V)), 1.6);
  // strongest near the lamp, fading as it spreads towards the ground
  float along = smoothstep(0.0, 0.12, vY) * pow(1.0 - vY, 1.4);
  // slowly drifting humidity: the shaft is never a flat cone
  float n = noise(vW * 4.0 + vec3(0.0, -uTime * 0.05, uTime * 0.03)) * 0.6 + noise(vW * 11.0 + uTime * 0.04) * 0.4;
  float a = edge * along * (0.55 + 0.7 * n) * uAmount;
  gl_FragColor = vec4(uColor * a, 1.0);
}`;

function softSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,0.85)');
  r.addColorStop(0.45, 'rgba(255,255,255,0.3)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

export class Atmosphere {
  constructor(ctx, mod) {
    this.ctx = ctx;
    this.mod = mod;
    this.group = new Group();
    this.group.name = 'atmosphere';
    this.t = 0;
    this.tier = ctx.quality?.tier ?? 1;
    this.soft = softSpriteTexture();
    this.buildBeams();
    this.buildMotes();
    this.buildHaze();
    this.buildCurtains();
    this.buildMoonbeams();
    this.buildFireflies();
    ctx.scene.add(this.group);
  }

  beamMaterial(color) {
    const m = new ShaderMaterial({
      uniforms: { uColor: { value: new Color(color) }, uAmount: { value: 0 }, uTime: { value: 0 } },
      vertexShader: BEAM_VS, fragmentShader: BEAM_FS,
      transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide,
    });
    guardMaterial(m);
    return m;
  }

  // a cone of light from `from` towards `to`, radius r0 at the lamp, r1 at the far end
  cone(from, to, r0, r1, mat) {
    const dir = to.clone().sub(from), L = dir.length();
    const g = new CylinderGeometry(r0, r1, L, 32, 1, true);
    g.translate(0, -L / 2, 0); // the top at the origin
    // uv.y: 0 at the lamp, 1 at the far end
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
    const m = new Mesh(g, mat);
    m.position.copy(from);
    m.quaternion.setFromUnitVectors(new Vector3(0, -1, 0), dir.normalize());
    m.renderOrder = 40;
    m.frustumCulled = false;
    return m;
  }

  buildBeams() {
    const L = this.mod.lamps;
    this.beamMat = this.beamMaterial(0xffc98a);
    this.beams = [];
    if (!L) return;
    const box = this.ctx.box, y = box.topY - 0.5, z = box.halfD * 0.55;
    for (const x of L.xs) {
      const to = new Vector3(x * 0.92, this.ctx.terrain.height(x * 0.92, -0.2) + 0.1, -0.2);
      const m = this.cone(new Vector3(x, y, z), to, 0.07, 0.95, this.beamMat);
      m.name = 'atmosphere-beam';
      this.group.add(m);
      this.beams.push(m);
    }
  }

  // dust specks turning slowly inside the shafts, catching the light
  buildMotes() {
    const L = this.mod.lamps;
    const n = this.tier === 0 ? 150 : 420;
    const pos = new Float32Array(n * 3), seed = new Float32Array(n);
    const box = this.ctx.box, y0 = box.topY - 0.5, z0 = box.halfD * 0.55;
    const xs = L?.xs || [0];
    for (let i = 0; i < n; i++) {
      const x = xs[i % xs.length], u = Math.random();
      const to = new Vector3(x * 0.92, 0.6, -0.2), from = new Vector3(x, y0, z0);
      const p = from.clone().lerp(to, u);
      const r = (0.07 + 0.85 * u) * Math.sqrt(Math.random()) * 0.8, a = Math.random() * 6.28;
      pos.set([p.x + Math.cos(a) * r, p.y, p.z + Math.sin(a) * r], i * 3);
      seed[i] = Math.random();
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new BufferAttribute(seed, 1));
    const m = new ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAmount: { value: 0 }, uScale: { value: 1 } },
      vertexShader: `
uniform float uTime; uniform float uScale; attribute float aSeed; varying float vA;
void main() {
  vec3 p = position + vec3(sin(uTime * 0.21 + aSeed * 40.0), sin(uTime * 0.13 + aSeed * 23.0) * 0.6, cos(uTime * 0.17 + aSeed * 31.0)) * 0.05;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uScale * (1.2 + aSeed * 1.6) / -mv.z, 1.0, 4.0);
  vA = 0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 50.0); // specks turn and glint
}`,
      fragmentShader: `
uniform float uAmount; varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.1, length(d)) * vA * uAmount;
  gl_FragColor = vec4(vec3(1.0, 0.86, 0.62) * a, 1.0);
}`,
      transparent: true, depthWrite: false, blending: AdditiveBlending,
    });
    guardMaterial(m);
    this.motes = new Points(g, m);
    this.motes.name = 'atmosphere-motes';
    this.motes.frustumCulled = false;
    this.group.add(this.motes);
  }

  // low haze lying between the trees, and mist rising off the falls and cascades
  buildHaze() {
    const T = this.ctx.terrain, box = this.ctx.box;
    this.haze = [];
    const n = this.tier === 0 ? 14 : 30;
    for (let i = 0; i < n; i++) {
      const x = (Math.random() * 2 - 1) * (box.halfW - 1.2), z = (Math.random() * 2 - 1) * (box.halfD - 0.9);
      const h = T.height(x, z);
      if (h > 1.4) {
        i--;
        continue;
      }
      const s = new Sprite(new SpriteMaterial({ map: this.soft, color: 0xdfe6dc, transparent: true, opacity: 0, depthWrite: false }));
      s.position.set(x, Math.max(h, 0.1) + 0.2 + Math.random() * 0.25, z);
      s.scale.set(2.2 + Math.random() * 1.6, 0.55 + Math.random() * 0.3, 1);
      s.userData = { base: s.position.clone(), ph: Math.random() * 6.28, k: 0.5 + Math.random() * 0.5, dx: 0, dz: 0, wx: 0, wz: 0, dy: s.position.y - Math.max(h, 0.1) };
      s.renderOrder = 6;
      s.name = 'atmosphere-haze';
      this.group.add(s);
      this.haze.push(s);
    }
    // mist at the waterfall's foot and the three cascades
    const spots = [[-1.38, 1.0, -1.26, 0.5], [-0.95, 0.72, -0.78, 0.3], [-0.28, 0.44, 0.0, 0.3], [0.62, 0.2, 0.78, 0.35]];
    this.mist = [];
    for (const [x, y, z, s0] of spots) {
      for (let k = 0; k < 4; k++) {
        const s = new Sprite(new SpriteMaterial({ map: this.soft, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
        s.userData = { x, y, z, s0, life: Math.random() * 4, max: 3.5 + Math.random() * 1.5 };
        s.renderOrder = 7;
        s.name = 'atmosphere-mist';
        this.group.add(s);
        this.mist.push(s);
      }
    }
  }

  // mist lying in bands between the rows of trees at the back, as in a diorama's receding layers, and
  // cloud wisps wrapped round the peaks. Soft noise-edged sheets: the curtains stand fixed (so they
  // part and shift against the trees as the view moves), the wisps always face the viewer. Both drift
  // slowly; normal blending, guarded.
  buildCurtains() {
    const T = this.ctx.terrain, box = this.ctx.box;
    const vs = (bill) => `
uniform float uWide;
varying vec2 vUv;
varying vec3 vW;
void main() {
  vUv = uv;
  vW = (modelMatrix * vec4(position, 1.0)).xyz;
  ${bill
    ? 'vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0); mv.xy += position.xy * vec2(uWide, 1.0); gl_Position = projectionMatrix * mv; vW = (inverse(viewMatrix) * mv).xyz;'
    : 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);'}
}`;
    const fs = `
uniform vec3 uColor; uniform float uAmount; uniform float uTime; uniform float uSeed; uniform vec2 uStretch;
uniform vec2 uDrift; uniform float uStreak;
uniform sampler2D uTerrainTex; uniform vec2 uFieldMin; uniform vec2 uFieldSize; uniform float uGround;
varying vec2 vUv;
varying vec3 vW;
float hh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hh(i), hh(i + vec2(1, 0)), f.x), mix(hh(i + vec2(0, 1)), hh(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
void main() {
  // carried along by the wind (uDrift integrates it), drawn out into streaks as it strengthens
  vec2 p = vUv * uStretch;
  p.x /= 1.0 + 0.8 * uStreak;
  p.y *= 1.0 + 0.6 * uStreak;
  p += uDrift + vec2(uSeed, uSeed * 0.37);
  float n = fbm(p + vec2(fbm(p * 0.7 + uTime * 0.006), 0.0) * (0.6 - 0.3 * uStreak));
  // ragged top and bottom edges, ragged ends: never a straight-edged bar however hard it blows
  float ry = vUv.y + (n - 0.5) * 0.45, rx = vUv.x + (fbm(p * 1.9 + 3.3) - 0.5) * 0.25;
  float band = smoothstep(0.0, 0.5, ry) * smoothstep(1.0, 0.52, ry);
  float edge = smoothstep(0.0, 0.25, rx) * smoothstep(1.0, 0.75, rx);
  float a = band * edge * smoothstep(0.32 + 0.1 * uStreak, 0.72, n) * uAmount;
  // thinning out towards the ground under it, so the ground never slices the sheet off in a straight line
  // (it lies on the land like smoke, not like a pane standing in it)
  if (uGround > 0.0) {
    float gh = texture2D(uTerrainTex, clamp((vW.xz - uFieldMin) / uFieldSize, 0.0, 1.0)).x;
    a *= smoothstep(0.0, uGround, vW.y - gh + (n - 0.5) * 0.12);
  }
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`;
    const mk = (bill, stretch, seed) => {
      const m = new ShaderMaterial({
        uniforms: {
          uColor: { value: new Color(1, 1, 1) }, uAmount: { value: 0 }, uTime: { value: 0 }, uSeed: { value: seed },
          uStretch: { value: new Vector2(...stretch) }, uDrift: { value: new Vector2() }, uStreak: { value: 0 }, uWide: { value: 1 },
          uTerrainTex: this.ctx.uniforms.uTerrainTex, uFieldMin: this.ctx.uniforms.uFieldMin, uFieldSize: this.ctx.uniforms.uFieldSize, uGround: { value: bill ? 0.45 : 0.3 }, // (fade height: the wisps clear the boulders on the peaks)
        },
        vertexShader: vs(bill), fragmentShader: fs, transparent: true, depthWrite: false, side: DoubleSide, fog: false,
      });
      guardMaterial(m);
      return m;
    };
    this.curtains = [];
    // rows of mist in the valleys behind the meadow, lower and thinner towards the front
    const rows = this.tier === 0 ? [-2.9, -1.7] : [-3.3, -2.7, -2.1, -1.5, -0.9];
    rows.forEach((z, ri) => {
      for (let x = -box.halfW + 1.2; x < box.halfW - 1.2; x += 2.4 + Math.random() * 1.6) {
        const w = 2.6 + Math.random() * 2.2, cx = Math.min(box.halfW - 0.4 - w / 2, x + w / 2);
        let h = 0;
        for (let k = -2; k <= 2; k++) h += T.height(cx + (k * w) / 5, z) / 5;
        if (h > 1.5) continue; // a mountain stands here: wisps cover the peaks instead
        const dn = window.__jtDen; // the view into the cave stays clear
        if (dn && z > dn.z - 0.6 && Math.abs(cx - dn.x) < w / 2 + 1.4) continue;
        const hgt = 0.55 + Math.random() * 0.35;
        const m = new Mesh(new PlaneGeometry(w, hgt), mk(false, [w * 1.1, hgt * 2.2], Math.random() * 50));
        m.position.set(cx, Math.max(h, 0.05) + hgt * 0.42, z + (Math.random() - 0.5) * 0.25);
        m.rotation.y = (Math.random() - 0.5) * 0.2;
        m.userData = { k: (0.75 + 0.25 * Math.random()) * (0.55 + 0.45 * (1 - ri / rows.length)), base: m.position.clone(), ph: Math.random() * 6.28, nu: 1.1, lift: 0.15, w, wx: 0, wz: 0 };
        m.renderOrder = 5;
        m.name = 'atmosphere-curtain';
        this.group.add(m);
        this.curtains.push(m);
      }
    });
    // wisps on the peaks: find the summits, then hang two or three ribbons of cloud around each
    const peaks = [];
    for (let x = -box.halfW + 0.6; x < box.halfW - 0.6; x += 0.15)
      for (let z = -box.halfD + 0.4; z < box.halfD - 0.4; z += 0.15) {
        const h = T.height(x, z);
        if (h < 2.0) continue;
        let top = true;
        for (let a = 0; a < 8 && top; a++) if (T.height(x + Math.cos(a * 0.785) * 0.5, z + Math.sin(a * 0.785) * 0.5) > h) top = false;
        if (top && !peaks.some((p) => Math.hypot(p.x - x, p.z - z) < 1.2)) peaks.push({ x, z, h });
      }
    this.peaks = peaks;
    this.wisps = [];
    for (const p of peaks) {
      const n = this.tier === 0 ? 1 : 3;
      for (let i = 0; i < n; i++) {
        const w = 1.3 + Math.random() * 1.1, hgt = 0.32 + Math.random() * 0.2;
        const m = new Mesh(new PlaneGeometry(w, hgt), mk(true, [w * 1.4, hgt * 3.0], Math.random() * 50));
        m.position.set(p.x + (Math.random() - 0.5) * 0.5, p.h * (0.62 + 0.22 * i / n) + 0.05, p.z + 0.25 + Math.random() * 0.3);
        m.userData = { k: 0.6 + 0.4 * Math.random(), base: m.position.clone(), ph: Math.random() * 6.28, nu: 1.4, lift: 0.8, w, wx: 0, wz: 0, bill: true };
        m.renderOrder = 5;
        m.frustumCulled = false;
        m.name = 'atmosphere-wisp';
        this.group.add(m);
        this.wisps.push(m);
      }
    }
  }

  // two faint cool shafts slanting in through the front glass at night
  buildMoonbeams() {
    this.moonMat = this.beamMaterial(0x9fb8e8);
    this.moon = [];
    for (const [x0, x1] of [[-3.5, -2.3], [2.2, 3.4]]) {
      const from = new Vector3(x0, this.ctx.box.topY - 0.15, this.ctx.box.halfD + 0.4);
      const to = new Vector3(x1, this.ctx.terrain.height(x1, -0.8) + 0.05, -0.8);
      const m = this.cone(from, to, 0.35, 1.1, this.moonMat);
      m.name = 'atmosphere-moonbeam';
      this.group.add(m);
      this.moon.push(m);
    }
  }

  // fireflies over the pool and along the stream at night: drifting, blinking points of green-gold
  buildFireflies() {
    const n = this.tier === 0 ? 40 : 90;
    const pos = new Float32Array(n * 3), seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, r = Math.sqrt(Math.random());
      const nearPool = i % 3 !== 0;
      const x = nearPool ? 2.75 + Math.cos(a) * 2.4 * r : -1.2 + Math.random() * 2.2;
      const z = nearPool ? 2.5 + Math.sin(a) * 1.4 * r : -0.9 + Math.random() * 1.8;
      pos.set([x, Math.max(0.06, this.ctx.terrain.height(x, z)) + 0.08 + Math.random() * 0.35, z], i * 3);
      seed[i] = Math.random();
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new BufferAttribute(seed, 1));
    const m = new ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAmount: { value: 0 }, uScale: { value: 1 } },
      vertexShader: `
uniform float uTime; uniform float uScale; attribute float aSeed; varying float vA;
void main() {
  float t = uTime * (0.25 + aSeed * 0.2);
  vec3 p = position + vec3(sin(t + aSeed * 30.0) * 0.25, sin(t * 1.7 + aSeed * 11.0) * 0.06, cos(t * 0.8 + aSeed * 17.0) * 0.18);
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uScale * 2.2 / -mv.z, 1.5, 6.0);
  float blink = fract(uTime * (0.18 + aSeed * 0.12) + aSeed * 7.0);
  vA = smoothstep(0.0, 0.08, blink) * smoothstep(0.45, 0.2, blink); // a slow pulse, then dark
}`,
      fragmentShader: `
uniform float uAmount; varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  float a = (smoothstep(0.5, 0.0, r) * 0.6 + smoothstep(0.15, 0.0, r)) * vA * uAmount;
  gl_FragColor = vec4(vec3(0.75, 1.0, 0.35) * a * 2.2, 1.0);
}`,
      transparent: true, depthWrite: false, blending: AdditiveBlending,
    });
    guardMaterial(m);
    this.flies = new Points(g, m);
    this.flies.name = 'atmosphere-fireflies';
    this.flies.frustumCulled = false;
    this.group.add(this.flies);
  }

  // Weatherglass's wind (units/s) at a point, eased into u.wx/u.wz so a gust swells and dies away
  // rather than flickering; lift (0..1) is how high above the floor, where it blows harder
  windAt(x, z, lift, u, dt, rate = 1.5) {
    const v = this.ctx.wind?.sample?.(x, z, this._w || (this._w = { x: 0, z: 0 }), lift);
    const k = 1 - Math.exp(-dt * rate);
    u.wx += ((Number.isFinite(v?.x) ? v.x : 0) - u.wx) * k;
    u.wz += ((Number.isFinite(v?.z) ? v.z : 0) - u.wz) * k;
    return Math.hypot(u.wx, u.wz);
  }

  update(dt) {
    this.t += dt;
    const life = this.ctx.modules.life?.env, w = this.ctx.world;
    const night = life?.night ?? 0, dusk = Math.max(life?.dusk || 0, life?.golden || 0);
    const hum = Math.min(1, (w.humidity ?? 0.5) * 0.8 + (w.groundWetness || 0) * 0.6 + (life?.rain || 0) * 0.5);
    const scale = this.ctx.renderer.domElement.height * 0.9;
    // lamp shafts: faint by day (the sun drowns them), clear at dusk, strongest at night; humid air shows more
    const beam = (0.05 + 0.08 * dusk + 0.11 * night) * (0.6 + 0.6 * hum);
    this.beamMat.uniforms.uAmount.value += (beam - this.beamMat.uniforms.uAmount.value) * Math.min(1, dt);
    this.beamMat.uniforms.uTime.value = this.t;
    this.motes.material.uniforms.uTime.value = this.t;
    this.motes.material.uniforms.uAmount.value = 0.35 + 0.9 * night + 0.4 * dusk;
    this.motes.material.uniforms.uScale.value = scale * 0.02;
    // moonbeams only at night
    this.moonMat.uniforms.uAmount.value = 0.09 * night * (1 - (life?.rain || 0));
    this.moonMat.uniforms.uTime.value = this.t;
    // haze: thicker in the morning and after rain, lit warm by day and blue-grey at night
    const morning = Math.max(0, 1 - Math.abs((w.timeOfDay ?? 0.5) - 0.3) * 6);
    const hz = 0.05 + 0.1 * hum + 0.08 * morning + 0.05 * night;
    // the haze is carried by the wind: it streams across the case and wraps round, sinking out of sight
    // where it meets a mountainside and fading at the glass
    const T = this.ctx.terrain, box = this.ctx.box, X = box.halfW - 1.2, Z = box.halfD - 0.9;
    for (const s of this.haze) {
      const u = s.userData;
      const sp = this.windAt(u.base.x + u.dx, u.base.z + u.dz, 0.1, u, dt);
      u.dx += u.wx * 0.6 * dt;
      u.dz += u.wz * 0.6 * dt;
      let x = u.base.x + u.dx, z = u.base.z + u.dz;
      if (x > X) u.dx -= 2 * X; else if (x < -X) u.dx += 2 * X;
      if (z > Z) u.dz -= 2 * Z; else if (z < -Z) u.dz += 2 * Z;
      x = u.base.x + u.dx + Math.sin(this.t * 0.03 + u.ph) * 0.4 / (1 + sp * 3);
      z = u.base.z + u.dz;
      const h = T.height(x, z);
      s.position.set(x, Math.max(h, 0.1) + u.dy, z);
      const fade = Math.min(1, (X - Math.abs(x)) / 0.8, (Z - Math.abs(z)) / 0.5) * Math.min(1, Math.max(0, (1.6 - h) / 0.4));
      s.scale.x = u.sx || (u.sx = s.scale.x);
      s.scale.x = u.sx * (1 + 0.5 * Math.min(1, sp / 1.5));
      s.material.opacity = hz * u.k * (0.7 + 0.3 * Math.sin(this.t * 0.07 + u.ph)) * Math.max(0, fade) * (1 - 0.35 * Math.min(1, Math.max(0, sp - 1) / 1.5));
      s.material.color.setRGB(0.85 - 0.3 * night, 0.88 - 0.25 * night, 0.84 - 0.1 * night);
    }
    // valley mist and peak wisps: heaviest in the morning and after rain, still present all day; warm
    // at golden hour, grey under storm cloud, faint blue at night
    const storm = Math.min(1, (w.storminess || 0) + (w.cloudCover || 0) * 0.4);
    const mist = (0.42 + 0.35 * morning + 0.25 * hum) * (1 - 0.45 * night);
    const mc = this.mc || (this.mc = new Color());
    mc.setRGB(0.92, 0.94, 0.93).lerp(new Color(1.0, 0.86, 0.7), (life?.golden || 0) * 0.6).lerp(new Color(0.6, 0.63, 0.66), storm * 0.5).lerp(new Color(0.14, 0.17, 0.24), night);
    // the mist slides along with the wind, leans downwind of where it lies, and in a strong wind is
    // drawn out into streaks and thinned; the peak wisps stream off the summits as banner clouds
    const cam = this.ctx.camera, right = this._right || (this._right = new Vector3());
    right.setFromMatrixColumn(cam.matrixWorld, 0).setY(0).normalize();
    for (const set of [this.curtains, this.wisps])
      for (const m of set) {
        const u = m.userData, U = m.material.uniforms;
        const sp = this.windAt(u.base.x, u.base.z, u.lift, u, dt, 0.8);
        const streak = Math.min(1, Math.max(0, (sp - 0.4) / 1.8));
        const along = u.bill ? u.wx * right.x + u.wz * right.z : u.wx * Math.cos(m.rotation.y) - u.wz * Math.sin(m.rotation.y);
        const calm = sp > 1e-3 ? 0.012 / sp : 0;
        U.uDrift.value.x -= (along * 0.5 + along * calm) * u.nu * dt;
        U.uDrift.value.y += 0.004 * dt;
        U.uStreak.value = streak;
        const lean = u.bill ? 0.35 + 0.35 * streak : 0.25, cap = u.bill ? 0.9 : 0.45;
        const ox = Math.max(-cap, Math.min(cap, u.wx * lean)), oz = Math.max(-cap / 2, Math.min(cap / 2, u.wz * lean * 0.6));
        m.position.set(u.base.x + ox + Math.sin(this.t * 0.02 + u.ph) * 0.25 / (1 + sp * 4), u.base.y, u.base.z + oz);
        if (u.bill) U.uWide.value = 1 + 0.9 * streak;
        U.uTime.value = this.t;
        U.uAmount.value = mist * u.k * (1 - 0.35 * Math.min(1, Math.max(0, sp - 1) / 1.5));
        U.uColor.value.copy(mc);
      }
    // waterfall mist: puffs born at the foot of each fall, rising and spreading as they fade
    for (const s of this.mist) {
      const u = s.userData;
      u.life += dt;
      if (u.life > u.max) {
        u.life = 0;
        u.ox = (Math.random() - 0.5) * 0.12;
        u.oz = (Math.random() - 0.5) * 0.12;
        u.dx = u.dz = 0;
      }
      const k = u.life / u.max;
      // blown off downwind as it rises
      if (u.wx === undefined) u.wx = u.wz = u.dx = u.dz = 0;
      const sp = this.windAt(u.x + u.dx, u.z + u.dz, 0.2, u, dt, 3);
      u.dx += u.wx * 0.8 * dt;
      u.dz += u.wz * 0.8 * dt;
      s.position.set(u.x + (u.ox || 0) + u.dx, u.y + 0.04 + k * 0.28 / (1 + sp), u.z + (u.oz || 0) + u.dz);
      s.scale.setScalar(u.s0 * (0.4 + k));
      s.material.opacity = 0.16 * Math.sin(Math.PI * k) * (0.7 + 0.5 * hum);
    }
    // fireflies: warm nights only
    const warm = Math.min(1, Math.max(0, ((life?.temp ?? 20) - 12) / 8));
    this.flies.material.uniforms.uTime.value = this.t;
    this.flies.material.uniforms.uAmount.value = night * warm * (1 - (life?.rain || 0));
    this.flies.material.uniforms.uScale.value = scale * 0.02;
  }
}
