// UNDERSTORM 2026 — the renderer. Reads the simulation each frame; never writes to it.
import * as THREE from '../vendor/three.module.min.js';
import { W, H, clamp, lerp } from './config.js';
import { Post } from './post.js';
import { MAT, G, add, makeShip, makeAnchor, FOE_MODELS, PART_MODELS } from './models.js';
import { surface, makeEnv, decorate, foreground } from './gfx.js';

export const QUAL = { low: { scale: 0.62, layers: 4, oct: 3, msaa: 0, parts: 0.4, bd: 0.5, shadow: 0, rays: 0, warp: 0 }, med: { scale: 0.85, layers: 6, oct: 4, msaa: 2, parts: 0.75, bd: 0.8, shadow: 0, rays: 1, warp: 1 }, high: { scale: 1, layers: 9, oct: 4, msaa: 4, parts: 1, bd: 1, shadow: 1, rays: 1, warp: 1 } };
const PI = Math.PI, TAU = PI * 2, rand = Math.random, col = (h) => new THREE.Color(h);
const CAMZ = 36.1;
const BCOL = [[1.0, 0.45, 0.2], [1.0, 0.25, 0.55], [1.0, 0.7, 0.2], [1.0, 0.95, 0.6]];
const ITEM = { A: [0.3, 1, 0.85], R: [1, 0.7, 0.25], C: [0.8, 0.6, 1], M: [1, 1, 1], S: [1, 0.4, 0.35] };

// ---------------------------------------------------------------- instanced sprite batch
class Batch {
  constructor(cap, additive) {
    const g = new THREE.InstancedBufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3)); g.setIndex([0, 1, 2, 0, 2, 3]);
    this.p = new Float32Array(cap * 4); this.s = new Float32Array(cap * 3); this.c = new Float32Array(cap * 4); this.cap = cap; this.n = 0;
    this.ap = new THREE.InstancedBufferAttribute(this.p, 4); this.as = new THREE.InstancedBufferAttribute(this.s, 3); this.ac = new THREE.InstancedBufferAttribute(this.c, 4);
    for (const a of [this.ap, this.as, this.ac]) a.setUsage(THREE.DynamicDrawUsage); g.setAttribute('iP', this.ap); g.setAttribute('iS', this.as); g.setAttribute('iC', this.ac);
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: 'attribute vec4 iP; attribute vec3 iS; attribute vec4 iC; varying vec2 vUv; varying vec4 vC; varying float vS; varying float vSeed; void main(){ vUv = position.xy; vC = iC; vS = iS.z; vSeed = iP.w; float ang = iS.z > 5.5 ? 0.0 : iP.w; float c = cos(ang), s = sin(ang); vec2 q = position.xy * iS.xy; q = vec2(q.x*c - q.y*s, q.x*s + q.y*c); gl_Position = projectionMatrix * viewMatrix * vec4(iP.xyz + vec3(q, 0.0), 1.0); }',
      fragmentShader: NOISE + `varying vec2 vUv; varying vec4 vC; varying float vS; varying float vSeed; void main(){ float d = length(vUv), a;
        if (vS > 5.5) { float n = noise(vUv * 2.4 + vSeed) * 0.6 + noise(vUv * 5.1 - vSeed * 1.7 + vec2(0.0, -vC.a * 1.4)) * 0.4;
          ${additive ? 'float age = vC.a; float body = smoothstep(1.0, 0.0, d + (n - 0.5) * 0.95 + age * 0.4); float heat = body * (1.0 - age); vec3 fc = mix(vec3(1.0, 0.22, 0.03), vec3(1.0, 0.8, 0.35), smoothstep(0.25, 0.7, heat)); fc = mix(fc, vec3(1.0), smoothstep(0.7, 1.0, heat)); gl_FragColor = vec4(fc * vC.rgb * body * (1.0 - age * age) * 2.6, 1.0); return;' : 'float body = smoothstep(1.0, 0.1, d + (n - 0.5) * 0.8); gl_FragColor = vec4(vC.rgb * (0.55 + 0.7 * n), body * vC.a); return;'} }
        if (vS < 0.5) a = pow(max(0.0, 1.0 - d), 2.2);
        else if (vS < 1.5) a = smoothstep(1.0, 0.86, d) * smoothstep(0.58, 0.8, d);
        else if (vS < 2.5) a = pow(max(0.0, 1.0 - d), 2.0) * 0.7 + smoothstep(0.55, 0.36, d) * 1.6;
        else if (vS < 3.5) a = pow(max(0.0, 1.0 - abs(vUv.y)), 3.0) * pow(max(0.0, 1.0 - abs(vUv.x)), 0.6);
        else if (vS < 4.5) a = smoothstep(1.0, 0.15, d);
        else a = step(abs(vUv.x), 1.0);
        ${additive ? 'gl_FragColor = vec4(vC.rgb * a * vC.a, 1.0);' : 'gl_FragColor = vec4(vC.rgb, a * vC.a);'} }` });
    this.mesh = new THREE.Mesh(g, m); this.mesh.frustumCulled = false; this.mesh.renderOrder = additive ? 20 : 10; this.g = g;
  }
  add(x, y, z, sx, sy, rot, r, g, b, a, shape) { if (this.n >= this.cap) return; const i = this.n++, j = i * 4, k = i * 3; this.p[j] = x; this.p[j + 1] = y; this.p[j + 2] = z; this.p[j + 3] = rot; this.s[k] = sx; this.s[k + 1] = sy; this.s[k + 2] = shape; this.c[j] = r; this.c[j + 1] = g; this.c[j + 2] = b; this.c[j + 3] = a; }
  flush() { this.g.instanceCount = this.n; this.ap.needsUpdate = this.as.needsUpdate = this.ac.needsUpdate = true; this.n = 0; }
}

const NOISE = `float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }`;

function canvasTex(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#9a9a9a'; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 520; i++) { const v = 110 + rand() * 110; x.fillStyle = `rgba(${v},${v},${v},${0.05 + rand() * 0.1})`; const s = 4 + rand() * (kind === 'rock' ? 26 : 12); x.fillRect(rand() * 256, rand() * 256, s, s * (kind === 'rock' ? 0.6 : 1)); }
  if (kind === 'panel') { x.strokeStyle = 'rgba(20,20,20,.75)'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(0, i * 64); x.lineTo(256, i * 64); x.stroke(); } for (let r = 0; r < 4; r++) for (let i = 0; i < 3; i++) { const px = ((i + (r % 2) * 0.5) * 86) % 256; x.beginPath(); x.moveTo(px, r * 64); x.lineTo(px, r * 64 + 64); x.stroke(); }
    x.fillStyle = 'rgba(25,25,25,.8)'; for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) x.fillRect(i * 21.3 + 4, r * 64 + 5, 3, 3); x.fillStyle = 'rgba(60,35,20,.35)'; for (let i = 0; i < 40; i++) x.fillRect(rand() * 256, rand() * 256, 2 + rand() * 4, 10 + rand() * 50); }
  else if (kind === 'rock') { x.strokeStyle = 'rgba(15,15,15,.6)'; for (let i = 0; i < 26; i++) { x.lineWidth = 0.5 + rand() * 2; x.beginPath(); let px = rand() * 256, py = rand() * 256; x.moveTo(px, py); for (let j = 0; j < 6; j++) { px += (rand() - 0.5) * 70; py += (rand() - 0.3) * 40; x.lineTo(px, py); } x.stroke(); } }
  else { x.strokeStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 40; i++) { x.lineWidth = 0.6 + rand(); x.beginPath(); const px = rand() * 256, py = rand() * 256; x.moveTo(px, py); x.lineTo(px + (rand() - 0.5) * 120, py + (rand() - 0.5) * 120); x.stroke(); } }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const TERR = { rust: 'panel', hull: 'panel', pipe: 'panel', foundry: 'panel', cloudrock: 'rock', stormrock: 'rock', deep: 'rock', throat: 'rock', core: 'facet', crystal: 'facet', none: 'rock' };

export class Renderer {
  constructor(canvas, quality = 'high') {
    this.canvas = canvas; const r = this.r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false });
    r.outputColorSpace = THREE.LinearSRGBColorSpace; r.autoClear = false; r.setClearColor(0x000000, 1);
    this.post = new Post(r); this.scene = new THREE.Scene(); this.cam = new THREE.PerspectiveCamera(28, 16 / 9, 1, 400); this.cam.position.set(W / 2, H / 2, CAMZ);
    this.q = QUAL[quality]; this.qName = quality; this.time = 0; this.frameN = 0; this.shake = 0; this.flash = 0; this.flashCol = col(0xffffff); this.fade = 1; this.opt = { flash: 1, shake: 1 };
    this.tex = { panel: surface('panel'), rock: surface('rock'), facet: surface('facet') };
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x202028, 0.9); this.key = new THREE.DirectionalLight(0xffffff, 2.2); this.key.position.set(-0.5, 0.8, 0.7); this.rim = new THREE.DirectionalLight(0xffffff, 0.9); this.rim.position.set(0.6, -0.3, -0.6);
    this.scene.add(this.hemi, this.key, this.rim);
    r.shadowMap.type = THREE.PCFSoftShadowMap; r.shadowMap.enabled = true; this.key.position.set(W / 2 - 20, H / 2 + 32, 26); this.key.target.position.set(W / 2, H / 2, -2); this.scene.add(this.key.target);
    const sh = this.key.shadow; sh.mapSize.set(2048, 2048); sh.camera.left = -24; sh.camera.right = 24; sh.camera.top = 17; sh.camera.bottom = -17; sh.camera.near = 2; sh.camera.far = 90; sh.bias = -0.0006; sh.normalBias = 0.06; this.key.castShadow = !!this.q.shadow;
    this.shipL = new THREE.PointLight(0x52ffd8, 0, 16, 1.6); this.anL = new THREE.PointLight(0x52ffd8, 0, 12, 1.6); this.scene.add(this.shipL, this.anL);
    this.pl = [0, 1, 2, 3].map(() => { const l = new THREE.PointLight(0xffffff, 0, 22, 1.5); this.scene.add(l); return { l, i: 0 }; }); this.pli = 0;
    // sky
    this.bgU = { uTime: { value: 0 }, uScroll: { value: 0 }, uFlash: { value: 0 }, uDens: { value: 0.5 }, uSeed: { value: 0 }, uSky0: { value: col(0) }, uSky1: { value: col(0) }, uCl: { value: col(0) }, uCs: { value: col(0) }, uBolt: { value: col(0xffffff) }, uLt: { value: new THREE.Vector2(0.5, 0.5) }, uKey: { value: col(0xffffff) }, uSun: { value: new THREE.Vector2(0.74, 0.8) }, uSunI: { value: 1 } };
    this.bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null); this.bg.frustumCulled = false; this.bg.renderOrder = -1000; this.scene.add(this.bg); this.mkSky();
    this.add = new Batch(2600, true); this.smoke = new Batch(1100, false); this.scene.add(this.smoke.mesh, this.add.mesh);
    this.parts = []; this.world = new THREE.Group(); this.scene.add(this.world); this.far = new THREE.Group(); this.scene.add(this.far); this.fore = new THREE.Group(); this.scene.add(this.fore); this.env = null; this.own = []; this.lamps = [];
    this.fm = new Map(); this.bm = new Map();
    this.ship = makeShip(); this.scene.add(this.ship); this.anchor = makeAnchor(); this.scene.add(this.anchor); this.ghost = makeShip(); const gm = new THREE.MeshBasicMaterial({ color: 0x52ffd8, transparent: true, opacity: 0.22, depthWrite: false }); this.ghost.traverse((o) => { if (o.isMesh) { o.material = gm; o.castShadow = false; } }); this.ghost.visible = false; this.scene.add(this.ghost);
    this.motes = [0, 1].map(() => { const g = new THREE.Group(); add(g, G.ico, MAT.gT, [0, 0, 0], 0.2); add(g, G.tor, MAT.hull, [0, 0, 0], 0.34); this.scene.add(g); return g; });
    // debris chunks
    this.chunkMat = new THREE.MeshStandardMaterial({ color: 0x6a6f78, metalness: 0.7, roughness: 0.5 }); this.chunks = []; for (let i = 0; i < 48; i++) { const m = new THREE.Mesh(i % 3 ? G.box : G.ico, this.chunkMat); m.visible = false; this.scene.add(m); this.chunks.push({ m, life: 0, vx: 0, vy: 0, vr: 0 }); } this.ci = 0;
    // ribbons: beam, tether, arcs, hazards
    this.ribMat = (frag, uni) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: uni, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: NOISE + frag });
    this.beamU = { t: { value: 0 }, a: { value: 0 } };
    this.beam = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.ribMat('varying vec2 vUv; uniform float t, a; void main(){ float y = abs(vUv.y - 0.5) * 2.0; float n = noise(vec2(vUv.x * 30.0 - t * 40.0, vUv.y * 6.0)); float core = pow(max(0.0, 1.0 - y), 6.0); float halo = pow(max(0.0, 1.0 - y), 1.6) * (0.5 + 0.5 * n); float tip = smoothstep(0.0, 0.03, vUv.x) * (1.0 - smoothstep(0.985, 1.0, vUv.x) * 0.3); gl_FragColor = vec4((vec3(1.0, 1.0, 1.0) * core * 6.0 + vec3(0.25, 1.0, 0.85) * halo * 3.0) * a * tip, 1.0); }', this.beamU));
    this.beam.renderOrder = 25; this.beam.visible = false; this.scene.add(this.beam);
    this.haz = []; for (let i = 0; i < 14; i++) { const u = { t: { value: 0 }, on: { value: 0 }, c: { value: col(0xffffff) }, k: { value: 0 } }; const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.ribMat('varying vec2 vUv; uniform float t, on, k; uniform vec3 c; void main(){ float y = abs(vUv.y - 0.5) * 2.0; float n = noise(vec2(vUv.x * 14.0 + t * (k > 0.5 ? 2.0 : 9.0), t * 6.0 + vUv.y * (k > 0.5 ? 3.0 : 0.0))); float tele = (smoothstep(0.1, 0.0, abs(y - 0.02 - n * 0.06)) * 0.9 + (1.0 - y) * 0.1) * (0.55 + 0.45 * sin(t * 40.0)); float j = abs(vUv.y - 0.5 + (n - 0.5) * 0.5) * 2.0; float bolt = pow(max(0.0, 1.0 - j), 6.0) * 4.0 + pow(max(0.0, 1.0 - y), 2.0) * (0.35 + n * 0.5); float soft = pow(max(0.0, 1.0 - y), 1.6) * (0.5 + n * 1.3) * 1.1; gl_FragColor = vec4(c * mix(tele, k > 0.5 ? soft : bolt, on), 1.0); }', u)); m.visible = false; m.renderOrder = 24; this.scene.add(m); this.haz.push({ m, u }); }
    this.lines = []; const lm = new THREE.LineBasicMaterial({ color: col(0x9ffff0).multiplyScalar(3.4), transparent: true, blending: THREE.AdditiveBlending, depthTest: false }); const lm2 = new THREE.LineBasicMaterial({ color: col(0xff5040).multiplyScalar(3.4), transparent: true, blending: THREE.AdditiveBlending, depthTest: false }); this.lm = lm; this.lm2 = lm2;
    for (let i = 0; i < 16; i++) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(72 * 3), 3)); const l = new THREE.Line(g, lm); l.frustumCulled = false; l.visible = false; l.renderOrder = 26; this.scene.add(l); this.lines.push(l); }
    // liquid, pursuit wall
    this.liqU = { t: { value: 0 }, c: { value: col(0x2fd0c0) }, s: { value: 0 }, hot: { value: 0 } };
    this.liq = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: this.liqU, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: NOISE + 'varying vec2 vUv; uniform float t, s, hot; uniform vec3 c; void main(){ float top = 1.0 - vUv.y; float n = noise(vec2(vUv.x * 40.0 + s * 1.3 + t * 0.6, vUv.y * 12.0 - t * 0.8)); float n2 = noise(vec2(vUv.x * 90.0 + s * 2.9 - t, vUv.y * 30.0)); float edge = smoothstep(0.035 + n * 0.02, 0.0, top); vec3 col = c * (0.35 + 0.5 * n * n2 + hot * 1.4 * pow(n, 3.0)) + c * edge * (2.5 + hot * 3.0); gl_FragColor = vec4(col, 0.82 + edge * 0.18); }' }));
    this.liq.renderOrder = 8; this.liq.visible = false; this.scene.add(this.liq);
    this.wallU = { t: { value: 0 }, c: { value: col(0xff4a6a) } };
    this.wallM = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.ribMat('varying vec2 vUv; uniform float t; uniform vec3 c; void main(){ float n = noise(vec2(vUv.y * 9.0, t * 3.0)) * 0.5 + noise(vec2(vUv.y * 23.0 + 4.0, t * 6.0)) * 0.3; float e = smoothstep(0.55 + n * 0.5, 1.0, vUv.x + n * 0.25); float body = smoothstep(1.0, 0.0, vUv.x) ; gl_FragColor = vec4(c * (e * 1.8 + 0.2 * body * n), 1.0); }', this.wallU)); this.wallM.visible = false; this.wallM.renderOrder = 27; this.scene.add(this.wallM);
    this.wallB = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x050205, transparent: true, opacity: 0.94, depthTest: false })); this.wallB.renderOrder = 26; this.wallB.visible = false; this.scene.add(this.wallB);
    this.tSmooth = 0; this.ltT = 3; this.pal = null;
  }

  mkSky() {
    if (this.bg.material) this.bg.material.dispose();
    this.bg.material = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: this.bgU, defines: { LAYERS: this.q.layers, OCT: this.q.oct, WARP: this.q.warp },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }',
      fragmentShader: NOISE + `varying vec2 vUv; uniform float uTime, uScroll, uFlash, uDens, uSeed, uSunI; uniform vec3 uSky0, uSky1, uCl, uCs, uBolt, uKey; uniform vec2 uLt, uSun;
        float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < OCT; i++) { s += a * noise(p); p = p * 2.02 + vec2(13.1, 7.7); a *= 0.5; } return s; }
        float fbm2(vec2 p){ return 0.62 * noise(p) + 0.3 * noise(p * 2.1 + 5.0); }
        float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
        void main(){ vec2 p = vec2(vUv.x * 1.7778, vUv.y); float hz = smoothstep(0.0, 1.0, vUv.y); vec3 sky = mix(uSky1, uSky0, pow(hz, 0.75)); vec2 sp = vec2(uSun.x * 1.7778, uSun.y); float sd = distance(p, sp);
          vec3 col = sky + uSky1 * 0.4 * exp(-pow((vUv.y - 0.22) * 3.4, 2.0)); col += uKey * uSunI * (exp(-sd * sd * 46.0) * 3.4 + exp(-sd * 3.0) * 0.34);
          vec2 ld = normalize(sp - p + 1e-4);
          for (int i = 0; i < LAYERS; i++) { float z = (float(i) + 0.5) / float(LAYERS); float sc = mix(3.4, 1.15, z); float par = mix(0.004, 0.045, z * z);
            vec2 q = p * sc + vec2(uScroll * par * sc + uTime * 0.012 * (1.0 + z) + float(i) * 19.7 + uSeed, float(i) * 3.3 - uTime * 0.005);
            #if WARP
            q += (vec2(fbm2(q * 0.55 + 3.1), fbm2(q * 0.55 + 7.7)) - 0.46) * 1.0;
            #endif
            float n = fbm(q); float band = 0.5 + 0.5 * sin(vUv.y * 6.283 * (0.7 + z * 0.6) + float(i) * 1.7 + n * 2.0);
            float d = smoothstep(0.50 - uDens * 0.22, 0.80 - uDens * 0.22, n * 0.82 + band * 0.3); float nl = fbm2(q + ld * 0.22); float sh = clamp(0.5 + (n - nl) * 3.6, 0.0, 1.0);
            vec3 c = mix(uCs, uCl, sh * sh); c += uKey * uSunI * pow(sh, 3.0) * exp(-sd * 2.4) * 0.9; c += uBolt * uFlash * exp(-distance(vUv, uLt) * 3.2) * (2.2 - z) * (0.4 + n);
            c = mix(sky, c, 0.3 + 0.7 * z); col = mix(col, c, d * (0.5 + 0.45 * z)); }
          if (uFlash > 0.3) { vec2 a = vec2(uLt.x * 1.7778, 1.05), b = vec2(uLt.x * 1.7778 + 0.1, uLt.y); float dm = 1.0; vec2 pv = a; float sd2 = uSeed + floor(uTime * 9.0);
            for (int k = 1; k <= 7; k++) { float t = float(k) / 7.0; vec2 pt = mix(a, b, t) + vec2((noise(vec2(float(k) * 7.3, sd2)) - 0.5) * 0.22 * sin(t * 3.1416), 0.0); dm = min(dm, seg(p, pv, pt)); pv = pt; }
            col += uBolt * (uFlash - 0.3) * 0.00016 / (dm * dm + 0.000012); }
          col += uBolt * uFlash * 0.1; gl_FragColor = vec4(col, 1.0); }` });
  }

  setQuality(name) { this.q = QUAL[name]; this.qName = name; this.mkSky(); this.key.castShadow = !!this.q.shadow && !(this.st && this.st.dark); this.resize(this.cw, this.ch); }
  resize(w, h) { this.cw = w; this.ch = h; const pr = Math.min(window.devicePixelRatio || 1, 2) * this.q.scale; this.r.setPixelRatio(1); const pw = Math.max(320, Math.round(w * pr)), ph = Math.max(180, Math.round(h * pr)); this.r.setSize(pw, ph, false); this.post.resize(pw, ph, this.q.msaa); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }

  // ---------------------------------------------------------------- per-stage scenery
  loadStage(st) {
    this.st = st; const P = this.pal = st.pal, u = this.bgU;
    u.uSky0.value.set(P.sky0); u.uSky1.value.set(P.sky1); u.uCl.value.set(P.cl); u.uCs.value.set(P.cs); u.uBolt.value.set(P.bolt); u.uSeed.value = st.idx * 37.7; u.uDens.value = st.fog ? 0.78 : st.dark ? 0.35 : 0.55; u.uKey.value.set(P.key); u.uSunI.value = st.dark ? 0 : st.fog ? 0.55 : 1; u.uSun.value.set(st.liquid === 'lava' ? 0.6 : 0.74, st.liquid === 'lava' ? 0.22 : 0.8);
    if (this.env) this.env.dispose(); this.env = makeEnv(this.r, P, st.dark); this.scene.environment = this.env.texture; this.scene.environmentIntensity = st.dark ? 0.35 : 0.85;
    this.scene.fog = new THREE.Fog(P.fog, 42, 122);
    this.hemi.color.set(P.cl); this.hemi.groundColor.set(P.cs); this.hemi.intensity = st.dark ? 0.04 : 0.4; this.key.color.set(P.key); this.key.intensity = st.dark ? 0.05 : 2.6; this.key.castShadow = !!this.q.shadow && !st.dark; this.rim.color.set(P.rim); this.rim.intensity = st.dark ? 0.12 : 0.8;
    this.baseAmb = this.hemi.intensity; this.baseKey = this.key.intensity;
    for (const m of this.own) m.dispose(); this.own = [];
    for (const g of [this.world, this.far, this.fore]) { for (const c of [...g.children]) { g.remove(c); c.traverse((o) => { if (o.geometry && o.userData.own) o.geometry.dispose(); }); } }
    for (const [, m] of this.bm) { this.scene.remove(m); if (m.userData.geo) m.userData.geo.dispose(); } this.bm.clear(); for (const [, m] of this.fm) this.scene.remove(m); this.fm.clear(); this.parts.length = 0;
    const tk = TERR[st.terr] || 'rock';
    const T = this.tex[tk], fam = tk === 'panel' ? 'ind' : tk === 'rock' ? 'rock' : 'cry';
    this.terrMat = new THREE.MeshStandardMaterial({ map: T.map, normalMap: T.normalMap, normalScale: new THREE.Vector2(1.3, 1.3), color: col(P.tb).lerp(col(P.ta), 0.45), metalness: tk === 'panel' ? 0.7 : tk === 'facet' ? 0.35 : 0.1, roughness: tk === 'facet' ? 0.22 : tk === 'panel' ? 0.5 : 0.82, side: THREE.DoubleSide, vertexColors: true, emissive: col(P.glow), emissiveIntensity: tk === 'facet' ? 0.14 : 0.0, envMapIntensity: tk === 'rock' ? 0.5 : 1.1 });
    this.plateMat = new THREE.MeshStandardMaterial({ map: this.tex.panel.map, normalMap: this.tex.panel.normalMap, color: col(P.ta), metalness: 0.8, roughness: 0.42 });
    this.pistMat = new THREE.MeshStandardMaterial({ map: this.tex.panel.map, normalMap: this.tex.panel.normalMap, color: 0xb9a070, metalness: 0.85, roughness: 0.36 });
    this.rimMat = new THREE.MeshBasicMaterial({ color: col(P.glow).multiplyScalar(st.dark ? 0.8 : 1.15), side: THREE.DoubleSide, fog: false });
    this.blockMat = new THREE.MeshStandardMaterial({ map: T.map, normalMap: T.normalMap, color: col(P.tb).lerp(col(P.ta), 0.6), metalness: tk === 'panel' ? 0.7 : 0.2, roughness: tk === 'facet' ? 0.25 : 0.6 });
    this.own.push(this.terrMat, this.plateMat, this.pistMat, this.rimMat, this.blockMat);
    if (st.terr !== 'none') for (const sign of [1, -1]) { const arr = sign > 0 ? st.floor : st.ceil; this.world.add(this.mkTerrain(st, arr, sign), this.mkRim(st, arr, sign)); }
    const dec = decorate(st, P, fam, this.q.bd); this.world.add(dec); this.lamps = dec.userData.lamps; this.own.push(...dec.userData.mats);
    const fg = foreground(st, P, fam); this.foreL = fg.userData.len; this.own.push(...fg.userData.mats); for (const off of [0, this.foreL]) { const g2 = off ? fg.clone() : fg; g2.userData.off = off; this.fore.add(g2); }
    this.mkBackdrop(st);
    this.rimC = col(P.rim); this.glowC = col(P.glow); this.liqU.c.value.set(P.liq || 0x2fd0c0); this.liqU.hot.value = st.liquid === 'lava' ? 1 : 0;
  }

  mkTerrain(st, arr, sign) {
    // six vertices per column: deep wall, shaded wall, wall edge | top edge, shelf, far slope
    const n = st.n, step = st.step, pos = new Float32Array(n * 18), uv = new Float32Array(n * 12), colr = new Float32Array(n * 18), idx = [];
    const flat = (TERR[st.terr] || 'rock') === 'panel', far = sign > 0 ? -9 : H + 9, hs = (i) => { const s = Math.sin(i * 12.9898 + st.idx) * 43758.5453; return s - Math.floor(s); };
    for (let i = 0; i < n; i++) { const x = i * step, y = arr[i], o = i * 18, q = i * 12, open = sign > 0 ? y < -1 : y > H + 1, back = open ? y - sign * 6 : y + sign * (flat ? 0.6 : 1.4 + hs(i * 0.37) * 1.8 + Math.sin(i * 0.21) * 0.8), mid = y - sign * 3.2;
      pos.set([x, far, 0.5, x, mid, 0.5, x, y, 0.5, x, y, 0.5, x, y + sign * 0.2, -2.6, x, back, -10], o);
      uv.set([x * 0.11, far * 0.11, x * 0.11, mid * 0.11, x * 0.11, y * 0.11, x * 0.11, 0, x * 0.11, 0.34, x * 0.11, 1.15], q);
      colr.set([0.06, 0.06, 0.06, 0.3, 0.3, 0.3, 0.86, 0.86, 0.86, 1, 1, 1, 0.82, 0.82, 0.82, 0.4, 0.4, 0.4], o);
      if (i < n - 1) { const a = i * 6, b = a + 6; for (const [p, r] of [[0, 1], [1, 2], [3, 4], [4, 5]]) idx.push(a + p, b + p, b + r, a + p, b + r, a + r); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.BufferAttribute(colr, 3)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, this.terrMat); m.userData.own = 1; m.frustumCulled = false; m.receiveShadow = true; return m;
  }

  // a thin lit line along the exact edge you collide with
  mkRim(st, arr, sign) {
    const n = st.n, step = st.step, pos = [], idx = []; let k = 0, prev = false;
    for (let i = 0; i < n; i++) { const y = arr[i], open = sign > 0 ? y < -1 : y > H + 1; if (open) { prev = false; continue; } pos.push(i * step, y, 0.53, i * step, y - sign * 0.07, 0.53); if (prev) idx.push(k - 2, k, k + 1, k - 2, k + 1, k - 1); k += 2; prev = true; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); const m = new THREE.Mesh(g, this.rimMat); m.userData.own = 1; m.frustumCulled = false; return m;
  }

  mkBackdrop(st) {
    const P = st.pal, L = 170, n = Math.round(30 * this.q.bd), kind = st.backdrop; this.farL = L;
    const mat = new THREE.MeshStandardMaterial({ color: col(P.tb).multiplyScalar(0.6), metalness: 0.15, roughness: 0.92, flatShading: true, envMapIntensity: 0.25 }), gm = new THREE.MeshBasicMaterial({ color: col(P.glow).multiplyScalar(1.6) });
    const defs = { box: [G.box, mat], cyl: [G.cyl, mat], ico: [G.ico, mat], oct: [G.oct, mat], tor: [G.torF, mat], glow: [G.box, gm], sph: [G.sph, mat] }, lists = {}; for (const k in defs) lists[k] = [];
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), Sc = new THREE.Vector3();
    const put = (k, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) => { E.set(rx, ry, rz); Q.setFromEuler(E); M.compose(V.set(x, y, z), Q, Sc.set(sx, sy, sz)); lists[k].push(M.clone()); };
    let seed = st.idx * 97 + 5; const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < n; i++) { const x = R() * L, z = (kind === 'hauler' || kind === 'graveyard' ? -38 : -22) - R() * R() * 75, y = R() * 40 - 11, s = 1 + R() * 2.5;
      if (kind === 'pylons' || kind === 'works') { const h = 14 + R() * 40; put('box', x, y - 10, z, s * 0.8, h, s * 0.8); put('box', x, y + R() * 10, z, s * 5, 0.5, 0.5); if (R() < 0.6) put('cyl', x + 2, y - 4, z, s * 1.6, s * 4, s * 1.6); if (kind === 'works') put('cyl', x, y + 4, z, 0.5, 30, 0.5, 0, 0, PI / 2); put('glow', x, y + R() * 8 - 4, z + s * 0.5, 0.25, 0.25 + R() * 2, 0.1); }
      else if (kind === 'canyon' || kind === 'eyewall' || kind === 'deep') { const top = i % 2; put('ico', x, top ? 26 + R() * 6 : -9 - R() * 5, z, 5 + R() * 9, 10 + R() * 14, 5 + R() * 6, R(), R(), R() * 0.4); if (kind === 'eyewall' && R() < 0.5) put('ico', x + 5, R() * 18, z, s, s * 0.7, s, R() * 3, R() * 3, 0); if (kind === 'deep' && R() < 0.3) put('glow', x, R() * 18, z, 0.15, 0.15, 0.15); }
      else if (kind === 'hauler' || kind === 'graveyard') { const gv = kind === 'graveyard'; put('box', x, y, z, gv ? 3 + R() * 7 : 6 + R() * 16, gv ? 0.8 + R() * 1.6 : 1.5 + R() * 4, 3 + R() * 5, R() * 0.4, R() * 0.6, (R() - 0.5) * (gv ? 2 : 0.3)); if (R() < 0.5) put('cyl', x + 3, y + 2, z, 1 + R(), 5 + R() * 6, 1 + R(), 0, 0, PI / 2 + (R() - 0.5)); if (R() < 0.4) put('glow', x, y, z + 2, 0.2 + R() * 1.5, 0.15, 0.1); }
      else if (kind === 'reef' || kind === 'core') { const top = i % 2; put('oct', x, top ? 20 + R() * 8 : -3 - R() * 6, z, 1.5 + R() * 3, 5 + R() * 12, 1.5 + R() * 3, (R() - 0.5) * 0.6, R() * 3, (R() - 0.5) * 0.7); if (R() < 0.35) put('glow', x + R() * 4, R() * 18, z, 0.2, 0.2, 0.2, 0, 0, 0.78); if (kind === 'core' && R() < 0.4) put('tor', x, 9, z - 20, 16 + R() * 10, 16 + R() * 10, 3, 0, R() * 1.2, 0); }
      else if (kind === 'herd') { if (i % 3 === 0) { put('sph', x, R() * 26 - 4, z - 10, 5 + R() * 5, 2 + R() * 2, 2.4 + R() * 2); put('glow', x - 1, R() * 26 - 4, z - 8, 1.2, 0.08, 0.08); } }
      else if (kind === 'foundry') { const h = 10 + R() * 30; put('cyl', x, y - 12, z, s * 1.5, h, s * 1.5); put('box', x, y + 12 + R() * 6, z, s * 4, 2, s * 2); put('glow', x, y - 12 + h / 2, z, s * 1.2, 0.3, s * 1.2); if (R() < 0.5) put('box', x + 4, 20 + R() * 4, z, 0.3, 14, 0.3); }
      else if (kind === 'throat') { if (i % 2 === 0) put('tor', x, 9, z * 0.4 - 6, 15 + R() * 6, 13 + R() * 5, 4, 0, PI / 2 - 0.5 + R(), 0); else put('ico', x, i % 4 === 1 ? 26 : -8, z, 6, 9, 5, R(), R(), 0); }
    }
    for (const off of [0, L]) { const g = new THREE.Group(); g.userData.off = off; for (const k in lists) { const a = lists[k]; if (!a.length) continue; const im = new THREE.InstancedMesh(defs[k][0], defs[k][1], a.length); a.forEach((m, i) => im.setMatrixAt(i, m)); im.frustumCulled = false; g.add(im); } this.far.add(g); }
  }

  // ---------------------------------------------------------------- effects
  spark(x, y, n, spd, c, size = 0.12, life = 0.45, grav = 0, shape = 0, z = 0.3) { n = Math.max(1, Math.round(n * this.q.parts)); for (let i = 0; i < n; i++) { if (this.parts.length > 1800) return; const a = rand() * TAU, v = spd * (0.25 + rand() * 0.75); this.parts.push({ x, y, z, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: life * (0.5 + rand() * 0.7), m: life, s: size * (0.6 + rand() * 0.8), r: c[0], g: c[1], b: c[2], gr: grav, sh: shape, add: 1, dr: 2.2 }); } }
  puff(x, y, n, spd, shade = 0.12, size = 0.9, life = 1.1) { n = Math.max(1, Math.round(n * this.q.parts)); for (let i = 0; i < n; i++) { const a = rand() * TAU, v = spd * rand(); this.parts.push({ x, y, z: 0.4, vx: Math.cos(a) * v - 1.5, vy: Math.sin(a) * v + 0.6, l: life * (0.6 + rand() * 0.6), m: life, s: size * (0.6 + rand()), r: shade, g: shade, b: shade * 1.1, gr: 0, sh: 6, add: 0, dr: 1.4, seed: rand() * 40 }); } }
  fire(x, y, n, size, life = 0.5, spd = 1.5, tint = [1, 1, 1]) { n = Math.max(1, Math.round(n * (0.5 + this.q.parts * 0.5))); for (let i = 0; i < n; i++) { const a = rand() * TAU, v = spd * rand(); this.parts.push({ x: x + Math.cos(a) * size * 0.25 * rand(), y: y + Math.sin(a) * size * 0.25 * rand(), z: 0.45, vx: Math.cos(a) * v - 1, vy: Math.sin(a) * v + 0.5, l: life * (0.7 + rand() * 0.6), m: life, s: size * (0.7 + rand() * 0.6), r: tint[0], g: tint[1], b: tint[2], gr: 0, sh: 6, add: 1, dr: 1.2, seed: rand() * 40, grow: size * 0.9 }); } }
  chunk(x, y, n, spd, scale = 0.3) { for (let i = 0; i < n; i++) { const c = this.chunks[this.ci++ % this.chunks.length], a = rand() * TAU, v = spd * (0.4 + rand()); c.m.position.set(x, y, 0.2 + rand()); c.m.scale.set(scale * (0.5 + rand()), scale * (0.5 + rand()), scale * (0.5 + rand())); c.vx = Math.cos(a) * v - 2; c.vy = Math.sin(a) * v + 1.5; c.vr = (rand() - 0.5) * 12; c.life = 1.4 + rand(); c.m.visible = true; } }
  light(x, y, hex, i) { const p = this.pl[this.pli++ & 3]; p.l.position.set(x, y, 2.5); p.l.color.set(hex); p.i = i; }
  shock(x, y, s, v = 1) { this.post.shock(x / W, y / H, s, v); }
  kick(s) { this.shake = Math.max(this.shake, s * this.opt.shake); }
  flashFx(s, hex = 0xffffff) { const v = s * this.opt.flash; if (v > this.flash) { this.flash = v; this.flashCol.set(hex); } }
  bolt(strength = 1) { this.bgU.uFlash.value = Math.max(this.bgU.uFlash.value, strength); this.bgU.uLt.value.set(0.15 + rand() * 0.7, 0.2 + rand() * 0.6); this.ambBoost = Math.max(this.ambBoost || 0, strength); }

  event(f, S) {
    const A = [1, 0.62, 0.22], Wt = [1, 1, 1], Tc = [0.3, 1, 0.85], Rd = [1, 0.3, 0.2], Vi = [0.8, 0.65, 1];
    switch (f.k) {
      case 'boom': { const s = f.s || 0.6; this.fire(f.x, f.y, 2 + s * 2.5, 0.7 + s * 0.8, 0.42 + s * 0.2, 1 + s); this.spark(f.x, f.y, 10 + s * 14, 7 + s * 6, A, 0.2 + s * 0.06, 0.6, -4, 3); this.spark(f.x, f.y, 5 + s * 4, 2 + s * 2, Wt, 0.3 + s * 0.3, 0.2); this.puff(f.x, f.y, 3 + s * 4, 1.5 + s, 0.1, 0.5 + s * 0.6); this.parts.push({ x: f.x, y: f.y, z: 0.3, vx: 0, vy: 0, l: 0.3, m: 0.3, s: 0.3, r: 1, g: 0.8, b: 0.5, gr: 0, sh: 1, add: 1, dr: 0, grow: 3 + s * 9 }); this.light(f.x, f.y, 0xffa040, 30 + s * 60); if (f.big) { this.shock(f.x, f.y, 0.016 + s * 0.006); this.kick(0.25 + s * 0.12); this.chunk(f.x, f.y, 3 + Math.round(s * 3), 5 + s * 2, 0.16 + s * 0.08); } else this.chunk(f.x, f.y, 1, 4, 0.12); break; }
      case 'hit': this.spark(f.x, f.y, 3, 4, Tc, 0.1, 0.2); break;
      case 'spark': this.spark(f.x, f.y, 3, 3.5, A, 0.09, 0.25); break;
      case 'tink': this.spark(f.x, f.y, 2, 5, Wt, 0.08, 0.16); break;
      case 'absorb': this.spark(f.x, f.y, 4, 3, Tc, 0.12, 0.25); break;
      case 'shatter': this.spark(f.x, f.y, 12, 6, Vi, 0.14, 0.6, -6, 3); this.spark(f.x, f.y, 4, 2, Wt, 0.22, 0.2); this.light(f.x, f.y, 0xb090ff, 16); break;
      case 'grow': this.spark(f.x, f.y, 10, 3, Vi, 0.14, 0.5); break;
      case 'tear': this.fire(f.x, f.y, 3, 1.2, 0.5, 2); this.spark(f.x, f.y, 16, 7, A, 0.18, 0.6, -4, 3); this.puff(f.x, f.y, 5, 2, 0.14, 1); this.kick(0.3); this.chunk(f.x, f.y, 4, 5, 0.25); break;
      case 'release': if (f.n === 3) { this.shock(f.x, f.y, 0.03, 1.4); this.kick(0.55); this.flashFx(0.22, 0x80ffe8); this.spark(f.x + 1, f.y, 22, 9, Tc, 0.18, 0.4); } else { this.spark(f.x + 1, f.y, 5 + f.n * 5, 5, Tc, 0.14, 0.25); if (f.n === 2) { this.shock(f.x, f.y, 0.012); this.kick(0.18); } } break;
      case 'die': this.fire(f.x, f.y, 6, 1.6, 0.8, 3, [0.5, 1, 0.95]); this.spark(f.x, f.y, 60, 11, Tc, 0.2, 0.9, 0, 3); this.spark(f.x, f.y, 30, 6, Wt, 0.3, 0.5); this.puff(f.x, f.y, 10, 3, 0.1, 1); this.shock(f.x, f.y, 0.05); this.kick(0.9); this.flashFx(0.35); this.chunk(f.x, f.y, 8, 7, 0.2); this.light(f.x, f.y, 0x60ffe0, 120); break;
      case 'hitp': case 'shield': this.flashFx(0.25, 0xff4040); this.kick(0.5); this.spark(S.p.x, S.p.y, 20, 7, Rd, 0.16, 0.5); break;
      case 'pickup': this.spark(f.x, f.y, 18, 6, ITEM[f.item] || Tc, 0.16, 0.5); this.parts.push({ x: f.x, y: f.y, z: 0.3, vx: 0, vy: 0, l: 0.4, m: 0.4, s: 0.4, r: 0.4, g: 1, b: 0.9, gr: 0, sh: 1, add: 1, dr: 0, grow: 9 }); break;
      case 'strike': this.flashFx(0.3, this.pal.bolt); this.kick(0.45); this.bolt(1); break;
      case 'flash': this.bolt(1.2); this.flashFx(0.12, this.pal.bolt); break;
      case 'bossdie': this.flashFx(0.7); this.kick(1.4); this.shock(f.x, f.y, 0.07, 0.7); break;
      case 'bossgone': this.flashFx(1); this.kick(2); this.shock(f.x, f.y, 0.1, 0.6); this.fire(f.x, f.y, 14, 3.4, 1.3, 5); this.spark(f.x, f.y, 120, 16, A, 0.3, 1.4, -2); this.spark(f.x, f.y, 60, 9, Wt, 0.4, 0.8); this.puff(f.x, f.y, 24, 5, 0.1, 2, 2); this.chunk(f.x, f.y, 24, 10, 0.4); this.light(f.x, f.y, 0xffc070, 400); break;
      case 'phase': this.flashFx(0.6, 0xc0a0ff); this.kick(1.2); this.shock(f.x, f.y, 0.08, 0.6); break;
      case 'reveal': case 'blink': this.spark(f.x, f.y, 14, 5, Rd, 0.14, 0.4); this.puff(f.x, f.y, 6, 2.5, 0.5, 1.2, 0.8); break;
      case 'wake': case 'cast': this.spark(f.x, f.y, 26, 7, A, 0.16, 0.6); this.kick(0.4); this.light(f.x, f.y, 0xff8040, 60); break;
      case 'fogout': this.puff(f.x, f.y, 20, 6, 0.6, 1.6, 1.2); this.shock(f.x, f.y, 0.02); break;
      case 'stun': this.spark(f.x, f.y, 30, 8, Wt, 0.16, 0.6); break;
      case 'clank': this.kick(0.22); this.spark(f.x, f.y, 6, 4, A, 0.1, 0.3); break;
      case 'growl': this.kick(0.3); break;
      case 'launch': this.spark(f.x, f.y, 10, 6, Tc, 0.14, 0.3); break;
      case 'dock': this.spark(f.x, f.y, 10, 4, Tc, 0.12, 0.3); break;
      case 'thunk': this.spark(f.x, f.y, 10, 6, Wt, 0.12, 0.3); this.kick(0.15); break;
      case 'panic': this.flashFx(0.2, 0xff4040); this.puff(f.x, f.y, 10, 4, 0.5, 1.4); break;
      case 'chain': this.spark(f.x, f.y, 6 + f.n * 3, 6, Tc, 0.16, 0.5); break;
      case 'cp': this.flashFx(0.1, 0x80ffe0); break;
      case 'tier': if (f.n) this.spark(S.p.x + 0.9, S.p.y, 5 + f.n * 3, 3, Tc, 0.1, 0.25); break;
    }
  }

  // ---------------------------------------------------------------- frame
  frame(S, dt, o = {}) {
    const t = (this.time += dt), sc = S.scroll, st = S.st, p = S.p, a = S.a, B = this.add, P = this.pal; this.frameN++;
    const fl = this.opt.flash;
    // sky, ambient lightning
    const u = this.bgU; u.uTime.value = t; u.uScroll.value = sc; u.uFlash.value *= Math.exp(-dt * 7); this.ambBoost = (this.ambBoost || 0) * Math.exp(-dt * 6);
    if ((this.ltT -= dt) < 0) { this.ltT = (st.act === 3 ? 1.5 : 4) + rand() * (st.dark ? 9 : 6); this.bolt(0.5 + rand() * 0.5); if (o.onThunder) o.onThunder(); }
    this.hemi.intensity = this.baseAmb + this.ambBoost * (st.dark ? 0.7 : 0.25) * fl; this.key.intensity = this.baseKey + this.ambBoost * (st.dark ? 1.6 : 0.4) * fl;
    // camera
    this.shake *= Math.exp(-dt * 7); const sh = this.shake * 0.35; this.cam.position.set(W / 2 + (rand() - 0.5) * sh, H / 2 + (rand() - 0.5) * sh, CAMZ); this.cam.rotation.z = (rand() - 0.5) * sh * 0.01;
    this.world.position.x = -sc; for (const g of this.fore.children) g.position.x = -((((sc * 1.0) % this.foreL) + this.foreL) % this.foreL) + g.userData.off - 20; for (const g of this.far.children) g.position.x = -(((sc % this.farL) + this.farL) % this.farL) + g.userData.off - 50;
    // blocks
    for (const b of S.ab) {
      let m = this.bm.get(b); if (!m) { m = this.mkBlock(b); this.scene.add(m); this.bm.set(b, m); }
      m.userData.f = this.frameN; m.position.set(b.cx - sc, b.cy, b.k === 'cry' || b.k === 'seed' ? 0 : -1.1); if (b.rot) m.rotation.z = b.rot;
      if (b.grow) { const s = clamp((b.growT || 0) / 14 + 1, 0.05, 1); m.scale.set(b.w * 0.72 * s, b.h * 0.72 * s, 1.5 * s); }
      if (b.flash > 0) { b.flash--; B.add(b.cx - sc, b.cy, 1.7, b.w, b.h, 0, 1, 1, 1, 0.6, 0); }
      if ((b.k === 'solid' || b.k === 'hull' || b.k === 'pist') && !b.det) { const x = b.cx - sc, hw = b.w / 2, hh = b.h / 2, c = this.rimC; B.add(x, b.cy + hh, 0.56, hw, 0.035, 0, c.r, c.g, c.b, 0.5, 5); B.add(x, b.cy - hh, 0.56, hw, 0.035, 0, c.r, c.g, c.b, 0.5, 5); B.add(x - hw, b.cy, 0.56, 0.035, hh, 0, c.r, c.g, c.b, 0.5, 5); B.add(x + hw, b.cy, 0.56, 0.035, hh, 0, c.r, c.g, c.b, 0.5, 5); }
      if (b.k === 'seed') { const s = 0.5 + Math.sin(t * 5 + b.x) * 0.06; m.scale.setScalar(b.grown ? 0.3 : s); if (!b.grown) B.add(b.cx - sc, b.cy, 1, 1.2, 1.2, 0, 0.7, 0.5, 1, 0.5, 0); }
    }
    for (const [b, m] of this.bm) if (m.userData.f !== this.frameN) { this.scene.remove(m); if (m.userData.geo) m.userData.geo.dispose(); this.bm.delete(b); }
    // foes
    for (const e of S.en) {
      let g = this.fm.get(e); if (!g) { g = e.boss ? new THREE.Group() : FOE_MODELS[e.type](); if (e.boss) g.userData.pm = new Map(); this.scene.add(g); this.fm.set(e, g); }
      g.userData.f = this.frameN;
      if (e.boss) { this.syncBoss(e, g, S, t); continue; }
      g.visible = !e.hidden; g.position.set(e.x, e.y, 0); const ud = g.userData; if (e.dir > 0 && !ud.rot) g.scale.x = -Math.abs(g.scale.x);
      if (ud.spin) ud.spin.rotation.z = e.rot; if (ud.pivot) ud.pivot.rotation.z = e.rot - PI / 2; if (ud.base && e.o.at === 'ceil') ud.base.rotation.x = PI; if (ud.rot) ud.rot.rotation.z = e.rot;
      if (ud.core) ud.core.scale.setScalar((e.type === 'mine' || e.type === 'shard' ? 0.16 : 0.22) * (1 + (e.tele || 0) * 2.2 + Math.sin(t * 6 + e.x) * 0.12));
      if (e.type === 'mote') { g.rotation.z = Math.sin(t * 3 + e.ph) * 0.2; g.scale.y = 1 + Math.sin(t * 5 + e.x) * 0.08; } else if (e.type === 'puffer') g.rotation.z = t * 0.6; else if (e.type === 'mine') g.rotation.z = e.rot; else if (e.type === 'shard') g.rotation.x = t * (2 + (e.tele || 0) * 14);
      else if (e.type === 'whale') { g.scale.setScalar(e.r / 1.25); g.scale.x = (e.dir > 0 ? -1 : 1) * e.r / 1.25; ud.body.rotation.z = Math.sin(t * 0.9 + e.y) * 0.06; ud.body.rotation.x = Math.sin(t * 0.7 + e.y) * 0.1; if (e.flash > 0 || e.panT > 0) B.add(e.x, e.y, 1, e.r * 1.6, e.r, 0, 1, 0.3, 0.2, 0.25, 0); }
      else if (e.type === 'seeker') { ud.on.visible = !!e.lit; ud.off.visible = !e.lit; g.rotation.z = Math.atan2(-e.vy, -e.vx || -1) * 0.5; if (e.lit) B.add(e.x - 0.4, e.y, 0.6, 1.2, 1.2, 0, 1, 1, 1, 0.5, 0); }
      else if (e.type === 'weaver') { ud.segs.forEach((sm, i) => { const s = e.segs[i]; sm.visible = !!s; if (s) sm.position.set((s.x - e.x) * (e.dir > 0 ? -1 : 1), s.y - e.y, 0); }); }
      else if (e.type === 'wreck') { ud.lamp.visible = !!e.awake; g.rotation.z = e.rot; if (e.awake) B.add(e.x - 0.4, e.y + 0.25, 0.8, 0.8, 0.8, 0, 1, 0.2, 0.15, 0.8, 0); }
      else if (e.type === 'gunship') { g.rotation.x = Math.sin(t * 1.3) * 0.15; B.add(e.x + 1.5, e.y, 0.3, 1.2, 0.5, 0, 1, 0.6, 0.2, 0.9, 3); }
      else if (e.type === 'lurker' && !e.hidden) { g.rotation.z = e.ta !== undefined ? e.ta + PI : 0; if (e.tele) B.add(e.x, e.y, 0.5, 1.6, 1.6, 0, 1, 0.2, 0.15, e.tele * 0.8, 0); }
      else if (e.type === 'carrier') { ud.spin.rotation.z = t * 9; const c = ITEM[e.o.item] || ITEM.A; B.add(e.x, e.y, 0.6, 1.5, 1.5, 0, c[0], c[1], c[2], 0.35 + Math.sin(t * 6) * 0.15, 0); }
      if (e.hidden && st.fog && this.frameN % 9 === 0) this.parts.push({ x: e.x + (rand() - 0.5), y: e.y + (rand() - 0.5), z: 0.5, vx: 0, vy: 0.3, l: 0.8, m: 0.8, s: 0.5, r: 0.8, g: 0.3, b: 0.25, gr: 0, sh: 0, add: 1, dr: 0, al: 0.16 });
      if (e.flash > 0 && !e.hidden && e.type !== 'whale') B.add(e.x, e.y, 1, e.r * 1.7, e.r * 1.7, 0, 1, 1, 1, 0.9, 0);
    }
    for (const [e, g] of this.fm) if (g.userData.f !== this.frameN) { this.scene.remove(g); this.fm.delete(e); }
    // player ship
    const ship = this.ship; ship.visible = p.alive && !(p.inv > 0 && (this.frameN & 4) && S.mode !== 'clear'); ship.position.set(p.x, p.y, 0); ship.userData.body.rotation.x = clamp(-p.vy * 0.07, -0.8, 0.8);
    if (p.alive) {
      const fl2 = 0.7 + rand() * 0.5; B.add(p.x - 1.25, p.y, 0.1, 0.9 * fl2, 0.2, 0, 0.3, 1, 0.9, 1, 3); for (const zz of [0.68, -0.68]) this.parts.push({ x: p.x - 0.85, y: p.y - 0.02 + zz * 0.12, z: zz * 0.6, vx: -9 - rand() * 4, vy: (rand() - 0.5) * 0.6, l: 0.22, m: 0.22, s: 0.09, r: 0.3, g: 1, b: 0.9, gr: 0, sh: 3, add: 1, dr: 3 }); B.add(p.x - 0.95, p.y, 0.1, 0.4, 0.4, 0, 0.6, 1, 0.95, 0.9, 0);
      if (p.tier > 0 || p.charge > 0.12) { const k = Math.min(1, p.charge / 1.65), s = 0.35 + k * 0.9 + Math.sin(t * 30) * 0.06; const c = p.tier === 3 ? [1, 1, 1] : p.tier === 2 ? [0.5, 1, 0.9] : [0.25, 0.9, 0.8]; B.add(p.x + 1.0, p.y, 0.5, s, s, 0, c[0], c[1], c[2], 1, 2); B.add(p.x + 1.0, p.y, 0.5, s * 2.4, s * 2.4, t * 4, c[0], c[1], c[2], 0.5, 1); if (this.frameN % 2 === 0) { const an = rand() * TAU, d = 1.6 + rand(); this.parts.push({ x: p.x + 1 + Math.cos(an) * d, y: p.y + Math.sin(an) * d, z: 0.5, vx: -Math.cos(an) * d * 4, vy: -Math.sin(an) * d * 4, l: 0.25, m: 0.25, s: 0.09, r: 0.4, g: 1, b: 0.9, gr: 0, sh: 0, add: 1, dr: 0 }); } }
      if (p.lock) { B.add(p.x, p.y, 0.6, 1.4, 1.4, 0, 1, 0.35, 0.1, 0.4 + Math.sin(t * 20) * 0.2, 0); if (this.frameN % 3 === 0) this.puff(p.x - 0.3, p.y + 0.2, 1, 0.6, 0.5, 0.35, 0.5); }
      if (p.shield > 0) B.add(p.x, p.y, 0.6, 1.3, 1.3, t, 0.4, 0.8, 1, 0.5, 1);
    }
    this.shipL.position.set(p.x + 0.5, p.y, 1.6); const lt = p.alive ? (st.dark ? 14 + p.light * 150 : 6 + p.light * 40) + (p.beamT > 0 ? 200 : 0) : 0; this.shipL.intensity += (lt - this.shipL.intensity) * 0.2; this.shipL.distance = st.dark ? 9 + p.light * 22 : 16;
    for (let i = 0; i < 2; i++) { const m = this.motes[i]; m.visible = i < p.motes && p.alive; m.position.set(p.m[i].x, p.m[i].y, 0); m.rotation.z = t * 5; m.rotation.x = t * 3; if (m.visible) B.add(p.m[i].x, p.m[i].y, 0.3, 0.6, 0.6, 0, 0.3, 1, 0.85, 0.7, 0); }
    // anchor and tether
    const an = this.anchor; an.visible = !!a.st && (p.alive || a.st >= 3); let li = 0;
    if (an.visible) { an.position.set(a.x, a.y, 0); an.userData.ring.rotation.x = a.spin; an.rotation.z = a.st === 2 ? PI : 0; const cc = p.core === 2 ? [1, 0.7, 0.25] : p.core === 3 ? [0.8, 0.6, 1] : [0.3, 1, 0.85]; B.add(a.x, a.y, 0.4, 1.3 + p.lvl * 0.15, 1.3 + p.lvl * 0.15, 0, cc[0], cc[1], cc[2], 0.55, 0);
      this.anL.position.set(a.x, a.y, 1.5); this.anL.intensity = st.dark ? 22 : 9;
      if (a.st >= 3 && p.alive) { for (let k = 0; k < 3; k++) li = this.zigzag(li, p.x, p.y, a.x, a.y, 0.16 + k * 0.1, 20, this.lm); const d = Math.hypot(a.x - p.x, a.y - p.y); B.add((p.x + a.x) / 2, (p.y + a.y) / 2, 0.4, d / 2, 0.3, Math.atan2(a.y - p.y, a.x - p.x), cc[0], cc[1], cc[2], 0.9, 3); if (this.frameN % 2 === 0) { const uu = rand(); this.spark(lerp(p.x, a.x, uu), lerp(p.y, a.y, uu), 1, 2, cc, 0.08, 0.25); } }
    } else this.anL.intensity = 0;
    for (const arc of S.arcs) { const q = arc.pts; for (let i = 0; i + 3 < q.length; i += 2) { li = this.zigzag(li, q[i], q[i + 1], q[i + 2], q[i + 3], 0.3, 12, this.lm); li = this.zigzag(li, q[i], q[i + 1], q[i + 2], q[i + 3], 0.5, 12, this.lm); B.add(q[i + 2], q[i + 3], 0.5, 0.9, 0.9, 0, 0.6, 1, 0.95, 0.9, 0); } }
    // beam
    if (p.beamT > 0 && p.alive) { const x0 = p.x + 0.8, x1 = p.beamX, a2 = Math.min(1, p.beamT / 6); this.beam.visible = true; this.beam.position.set((x0 + x1) / 2, p.y, 0.6); this.beam.scale.set(Math.max(0.1, x1 - x0), 1.9, 1); this.beamU.t.value = t; this.beamU.a.value = a2; B.add(x1, p.y, 0.7, 1.6, 1.6, 0, 0.6, 1, 0.9, 1, 2); this.spark(x1, p.y, 3, 9, [0.5, 1, 0.9], 0.14, 0.3); this.heatBox = [x0 / W, p.y / H, (x1 - x0) / W, 0.09]; this.heat = a2; } else { this.beam.visible = false; this.heat = 0; }
    // enemy bullets, player shots, pickups
    for (const b of S.eb) { const c = BCOL[b.k] || BCOL[0], s = b.r * 2.3; this.smoke.add(b.x, b.y, 0.45, s * 1.5, s * 1.5, 0, 0, 0, 0, 0.6, 4); if (b.k === 3) B.add(b.x, b.y, 0.5, 0.7, 0.16, Math.atan2(b.vy, b.vx), c[0], c[1], c[2], 1, 3); B.add(b.x, b.y, 0.5, s, s, 0, c[0], c[1], c[2], 1, 2); }
    for (const s of S.ps) { const ang = Math.atan2(s.vy, s.vx);
      if (s.k === 0) B.add(s.x, s.y, 0.4, 0.75, 0.15, ang, 0.4, 1, 0.9, 1, 3);
      else if (s.k === 1) { B.add(s.x, s.y, 0.4, 1.2, 0.34, ang, 0.5, 1, 0.9, 1, 3); B.add(s.x, s.y, 0.4, 0.5, 0.5, 0, 0.8, 1, 1, 1, 2); }
      else if (s.k === 2) { B.add(s.x, s.y, 0.4, 0.9, 1.5, 0, 0.5, 1, 0.9, 1, 2); B.add(s.x - 0.8, s.y, 0.4, 2.2, 0.9, 0, 0.3, 1, 0.85, 0.8, 3); B.add(s.x, s.y, 0.4, 1.9, 1.9, t * 9, 0.6, 1, 1, 0.6, 1); }
      else if (s.k === 3) { B.add(s.x, s.y, 0.4, 0.55, 0.13, ang, 1, 0.75, 0.3, 1, 3); B.add(s.x, s.y, 0.4, 0.25, 0.25, 0, 1, 0.9, 0.6, 1, 2); }
      else if (s.k === 4) { B.add(s.x, s.y, 0.4, 0.5, 0.5, t * 12, 0.8, 0.6, 1, 1, 1); B.add(s.x, s.y, 0.4, 0.3, 0.3, 0, 0.9, 0.8, 1, 1, 2); }
      else if (s.k === 5) { B.add(s.x, s.y, 0.4, 0.5, 0.14, ang, 1, 0.45, 0.35, 1, 3); if (this.frameN % 2 === 0) this.parts.push({ x: s.x, y: s.y, z: 0.4, vx: 0, vy: 0, l: 0.3, m: 0.3, s: 0.12, r: 1, g: 0.5, b: 0.3, gr: 0, sh: 0, add: 1, dr: 0 }); }
      else B.add(s.x, s.y, 0.4, 0.5, 0.11, ang, 0.5, 0.9, 1, 1, 3); }
    for (const k of S.pk) { const c = ITEM[k.item]; B.add(k.x, k.y, 0.5, 0.42, 0.42, 0, c[0], c[1], c[2], 1, 2); B.add(k.x, k.y, 0.5, 0.95, 0.95, t * 3, c[0], c[1], c[2], 0.9, 1); B.add(k.x, k.y, 0.5, 1.5 + Math.sin(t * 6) * 0.2, 1.5 + Math.sin(t * 6) * 0.2, 0, c[0], c[1], c[2], 0.3, 0); }
    // hazards and vents
    let hi = 0; const bc = col(P.bolt);
    for (const z of S.hz) { const h = this.haz[hi++]; if (!h) break; const on = z.t >= z.tele ? 1 : 0; h.m.visible = true; h.u.t.value = t; h.u.on.value = on; h.u.k.value = 0; h.u.c.value.copy(bc).multiplyScalar(on ? 1 : 0.5 + (z.t / z.tele) * 0.6); const th = on ? z.half * 2.6 : z.half * 2; if (z.k === 'h') { h.m.rotation.z = 0; h.m.position.set(W / 2, z.y, 0.8); h.m.scale.set(W + 6, th, 1); } else { h.m.rotation.z = PI / 2; h.m.position.set(z.x, H / 2, 0.8); h.m.scale.set(H + 6, th, 1); } }
    for (const v of S.vents) { const sx = v.x - sc; if (sx < -3 || sx > W + 3 || v.x < S.ventMin) continue; const ph = ((S.gt / v.per + v.ph) % 1 + 1) % 1, on = ph < v.duty, tele = ph > 0.8; const y0 = Math.max(v.y0, S.floor(sx)), y1 = Math.min(v.y1, S.ceil(sx)); B.add(sx, y0 + 0.2, 0.6, 0.5, 0.25, 0, 1, 0.7, 0.3, tele ? 0.5 + Math.sin(t * 40) * 0.5 : 0.25, 0);
      if (!on && !tele) continue; const h = this.haz[hi++]; if (!h) break; h.m.visible = true; h.u.t.value = t; h.u.on.value = on ? 1 : 0; h.u.k.value = 1; h.u.c.value.set(v.lava ? 0xff6a20 : 0xd8fff8).multiplyScalar(on ? 1 : 0.6); h.m.rotation.z = PI / 2; h.m.position.set(sx, (y0 + y1) / 2, 0.8); h.m.scale.set(y1 - y0, on ? v.half * 3 : v.half, 1); if (on && this.frameN % 3 === 0) this.puff(sx, y0 + rand() * (y1 - y0), 1, 1, v.lava ? 0.25 : 0.75, 0.6, 0.6); }
    for (; hi < this.haz.length; hi++) this.haz[hi].m.visible = false;
    // liquid
    if (S.flood !== null && S.flood > -0.9) { this.liq.visible = true; const top = S.flood + Math.sin(t * 2) * 0.06; this.liq.position.set(W / 2, (top - 6) / 2, 0.55); this.liq.scale.set(W + 8, top + 6, 1); this.liqU.t.value = t; this.liqU.s.value = sc; if (this.frameN % 4 === 0) this.spark(rand() * W, top, 1, 1.5, st.liquid === 'lava' ? [1, 0.5, 0.15] : [0.5, 1, 0.9], 0.1, 0.7, st.liquid === 'lava' ? 2 : -3); } else this.liq.visible = false;
    // pursuit wall
    if (S.wall !== null && S.wall > -1.5) { const wx = S.wall; this.wallM.visible = this.wallB.visible = true; this.wallB.position.set(wx - 10, H / 2, 1.6); this.wallB.scale.set(20, H + 8, 1); this.wallM.position.set(wx - 1.6, H / 2, 1.7); this.wallM.scale.set(3.6, H + 6, 1); this.wallU.t.value = t; this.wallU.c.value.set(P.glow); if (this.frameN % 2 === 0) this.spark(wx + 0.2, rand() * H, 1, 5, [1, 0.3, 0.4], 0.14, 0.5); this.kick(0.12); } else this.wallM.visible = this.wallB.visible = false;
    // boss-specific overlays
    const bs = S.boss; if (bs && bs.banks) for (const b of bs.banks) { const al = b.off > 0 ? Math.max(0, 1 - (330 - b.off) / 20) + Math.max(0, 1 - b.off / 40) : 1; for (let i = 0; i < 6; i++) this.smoke.add(b.x + Math.cos(i * 1.05 + t * 0.3) * 1.3, b.y + Math.sin(i * 1.05 + t * 0.25) * 1.3, 1.2, b.r * 0.85, b.r * 0.85, 0, 0.72, 0.72, 0.68, 0.34 * Math.min(1, al), 4); }
    if (bs && bs.boss === 'front') for (let i = 0; i < 12; i++) this.smoke.add(bs.x + 1.5 + Math.sin(i * 2.1 + t * 0.4) * 1.2, i * 1.7 - 0.5, 0.9, 3.4, 3.4, 0, 0.12, 0.14, 0.24, 0.85, 4);
    if (bs && bs.lines) for (const l of bs.lines) { li = this.zigzag(li, l[0], l[1], l[2], l[3], 0.2, 20, this.lm2); li = this.zigzag(li, l[0], l[1], l[2], l[3], 0.35, 20, this.lm2); }
    for (; li < this.lines.length; li++) this.lines[li].visible = false;
    // stage fog wisps
    if (st.fog && this.frameN % 3 === 0) this.parts.push({ x: W + 3, y: rand() * H, z: 1.6, vx: -4 - rand() * 3, vy: 0, l: 10, m: 10, s: 2.5 + rand() * 2.5, r: 0.75, g: 0.75, b: 0.7, gr: 0, sh: 4, add: 0, dr: 0, al: 0.07 });
    if (st.fast && S.wall !== null && this.frameN % 2 === 0) this.parts.push({ x: W + 1, y: rand() * H, z: 0.2, vx: -40, vy: 0, l: 1, m: 1, s: 0.07, r: 1, g: 0.6, b: 0.8, gr: 0, sh: 0, add: 1, dr: 0 });
    // what the AI pilot is looking at
    if (o.ai && p.alive) { const m = o.ai, tg = m.target; if (tg) { const rr = tg.r + 0.6; B.add(tg.x, tg.y, 0.9, rr, rr, t * 2, 0.3, 1, 0.85, 0.9, 1); B.add(tg.x, tg.y, 0.9, rr * 1.5, 0.03, 0, 0.3, 1, 0.85, 0.7, 5); B.add(tg.x, tg.y, 0.9, 0.03, rr * 1.5, 0, 0.3, 1, 0.85, 0.7, 5); const dx = tg.x - p.x, dy = tg.y - p.y, d = Math.hypot(dx, dy); B.add(p.x + dx / 2, p.y + dy / 2, 0.9, d / 2, 0.02, Math.atan2(dy, dx), 0.3, 1, 0.85, 0.35, 5); }
      if (m.threats) for (let i = 0; i < m.threats.length && i < 24; i += 2) B.add(m.threats[i], m.threats[i + 1], 0.9, 0.5, 0.5, 0, 1, 0.25, 0.2, 0.9, 1);
      if (m.goal) { B.add(m.goal[0], m.goal[1], 0.9, 0.18, 0.18, 0.785, 1, 0.85, 0.3, 0.9, 5); const dx = m.goal[0] - p.x, dy = m.goal[1] - p.y, d = Math.hypot(dx, dy); if (d > 0.3) B.add(p.x + dx / 2, p.y + dy / 2, 0.9, d / 2, 0.025, Math.atan2(dy, dx), 1, 0.85, 0.3, 0.6, 5); } }
    // ghost of the best run
    if (o.ghost && p.alive) { this.ghost.visible = true; this.ghost.position.set(o.ghost[0], o.ghost[1], -0.3); } else this.ghost.visible = false;
    this.weather(S, st, dt);
    for (let i = 0; i < this.lamps.length; i += 3) { const lx = this.lamps[i] - sc; if (lx > -2 && lx < W + 2) B.add(lx, this.lamps[i + 1], this.lamps[i + 2] + 0.1, 0.5, 0.5, 0, this.glowC.r, this.glowC.g, this.glowC.b, 0.26 + Math.sin(t * 3 + i) * 0.07, 0); }
    // particles
    const ds = S.ds || 0; let w = 0;
    for (let i = 0; i < this.parts.length; i++) { const q = this.parts[i]; q.l -= dt; if (q.l <= 0) continue; const k = Math.exp(-q.dr * dt); q.vx *= k; q.vy *= k; q.vy += q.gr * dt; q.x += q.vx * dt - ds * (q.add ? 0.4 : 1); q.y += q.vy * dt; const f = q.l / q.m, s = q.grow ? q.s + (1 - f) * q.grow : q.sh === 4 ? q.s * (1.6 - f * 0.6) : q.s * (0.4 + f * 0.6);
      if (q.add) { if (q.sh === 6) B.add(q.x, q.y, q.z, s, s, q.seed, q.r, q.g, q.b, 1 - f, 6); else B.add(q.x, q.y, q.z, q.sh === 3 ? s * 2 : s, q.sh === 3 ? s * 0.4 : s, q.sh === 3 ? Math.atan2(q.vy, q.vx) : 0, q.r, q.g, q.b, (q.al || 1) * Math.min(1, f * 2.5), q.sh); } else this.smoke.add(q.x, q.y, q.z, s, s, q.seed || 0, q.r, q.g, q.b, (q.al || 0.5) * Math.min(1, f * 2) * Math.min(1, (q.m - q.l) * 4 + 0.1), 4);
      this.parts[w++] = q; }
    this.parts.length = w;
    for (const c of this.chunks) { if (c.life <= 0) continue; c.life -= dt; if (c.life <= 0) { c.m.visible = false; continue; } c.vy -= 9 * dt; c.m.position.x += c.vx * dt - ds; c.m.position.y += c.vy * dt; c.m.rotation.x += c.vr * dt; c.m.rotation.z += c.vr * 0.7 * dt; const sx = c.m.position.x, f = S.st.floorAt(sc + sx); if (c.m.position.y < f + 0.1 && c.vy < 0) { c.vy = -c.vy * 0.4; c.vx *= 0.6; c.m.position.y = f + 0.1; } }
    for (const q of this.pl) { q.i *= Math.exp(-dt * 8); q.l.intensity = q.i; }
    B.flush(); this.smoke.flush();
    this.flash *= Math.exp(-dt * 6);
    this.post.render(this.scene, this.cam, dt, { bloom: 0.85, flash: this.flash, flashCol: this.flashCol, fade: this.fade, heat: this.heat, heatBox: this.heatBox, rays: this.q.rays ? this.bgU.uSunI.value * 0.34 : 0, sun: this.bgU.uSun.value });
  }

  // ambient motes, rain, embers and wind, by stage
  weather(S, st, dt) {
    const k = this.q.parts, P = this.parts, i = st.idx; if (P.length > 1500) return; const R = rand;
    if (i === 3) { for (let n = 0; n < 4 * k; n++) P.push({ x: R() * (W + 8), y: H + 1, z: -1 + R() * 2, vx: -7, vy: -40, l: 0.55, m: 0.55, s: 0.22, r: 0.55, g: 0.95, b: 0.95, gr: 0, sh: 3, add: 1, dr: 0, al: 0.3 }); }
    else if (i === 6 || i === 11) { if (R() < 0.6 * k) P.push({ x: R() * W, y: Math.max(0, S.flood === null ? 0 : S.flood) + R() * 2, z: R(), vx: -1 + R() * 2, vy: 2 + R() * 4, l: 2.2, m: 2.2, s: 0.07 + R() * 0.05, r: i === 6 ? 1 : 0.7, g: i === 6 ? 0.5 : 0.4, b: i === 6 ? 0.15 : 1, gr: 0.6, sh: 0, add: 1, dr: 0.2 }); }
    else if (i === 4) { if (R() < 0.35 * k) P.push({ x: R() * W, y: R() * H, z: -1 + R() * 2, vx: -1, vy: 0, l: 0.7, m: 0.7, s: 0.16, r: 0.85, g: 0.75, b: 1, gr: 0, sh: 1, add: 1, dr: 0, al: 0.7, grow: 0.25 }); }
    else if (i === 8 || i === 10) { for (let n = 0; n < 2 * k; n++) P.push({ x: W + 2, y: R() * H, z: R() * 1.5, vx: -(i === 10 ? 46 : 26) - R() * 10, vy: this.st === st ? S.windY * 2 : 0, l: 1, m: 1, s: 0.3, r: 0.8, g: 0.86, b: 1, gr: 0, sh: 3, add: 1, dr: 0, al: 0.16 }); }
    else if (i === 7) { if (R() < 0.25 * k) P.push({ x: R() * W, y: R() * H, z: R(), vx: -0.6, vy: 0.2 - R() * 0.4, l: 3, m: 3, s: 0.05, r: 0.3, g: 0.9, b: 0.8, gr: 0, sh: 0, add: 1, dr: 0, al: 0.5 }); }
    else if (R() < 0.3 * k) P.push({ x: W + 1, y: R() * H, z: -2 + R() * 3, vx: -3 - R() * 3, vy: (R() - 0.5), l: 6, m: 6, s: 0.05 + R() * 0.04, r: this.glowC.r, g: this.glowC.g, b: this.glowC.b, gr: 0, sh: 0, add: 1, dr: 0, al: 0.45 });
  }

  zigzag(li, x0, y0, x1, y1, amp, n, mat) { const l = this.lines[li]; if (!l) return li; const pa = l.geometry.attributes.position, dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d; for (let i = 0; i <= n; i++) { const u = i / n, j = i === 0 || i === n ? 0 : (rand() - 0.5) * 2 * amp; pa.setXYZ(i, x0 + dx * u + nx * j, y0 + dy * u + ny * j, 0.5); } pa.needsUpdate = true; l.geometry.setDrawRange(0, n + 1); l.material = mat; l.visible = true; return li + 1; }

  mkBlock(b) {
    let m;
    if (b.k === 'cry') { m = new THREE.Mesh(G.ico, MAT.glassV); m.scale.set(b.w * 0.72, b.h * 0.72, 1.5); m.rotation.set(b.x * 1.3, b.y * 0.7, b.x + b.y); }
    else if (b.k === 'seed') { m = new THREE.Group(); add(m, G.ico1, MAT.gV, [0, 0, 0], 1); add(m, G.tor, MAT.dark, [0, 0, 0], 1.3); }
    else if (b.k === 'pist') { m = new THREE.Group(); add(m, G.box, this.pistMat, [0, 0, 0], [b.w, b.h, 3]); const s = Math.sign(b.amp) || 1; add(m, G.box, MAT.gA, [0, s * (b.h / 2 - 0.12), 1.52], [b.w * 0.9, 0.1, 0.05]); add(m, G.box, MAT.dark, [0, s * (b.h / 2), 0], [b.w * 1.08, 0.3, 3.2]); add(m, G.cyl, MAT.hull, [0, -s * (b.h / 2 + 6), 0], [0.5, 12, 0.5]); }
    else { const g = new THREE.BoxGeometry(b.w, b.h, 3.2), uv = g.attributes.uv, nr = g.attributes.normal; for (let i = 0; i < uv.count; i++) { const ax = Math.abs(nr.getX(i)), ay = Math.abs(nr.getY(i)); uv.setXY(i, uv.getX(i) * (ax > 0.5 ? 3.2 : b.w) * 0.16, uv.getY(i) * (ay > 0.5 ? 3.2 : b.h) * 0.16); } m = new THREE.Mesh(g, b.k === 'hull' ? this.plateMat : this.blockMat || this.plateMat); m.userData.geo = g; }
    m.traverse((o) => { if (o.isMesh && o.material.isMeshStandardMaterial) { o.castShadow = !o.material.transparent; o.receiveShadow = true; } });
    return m;
  }

  syncBoss(e, g, S, t) {
    const pm = g.userData.pm, B = this.add;
    for (const q of e.parts) {
      let m = pm.get(q); if (!m) { m = (PART_MODELS[q.kind] || PART_MODELS.hull)(); m.userData.s0 = m.scale.clone(); g.add(m); pm.set(q, m); }
      m.userData.f = this.frameN; const ud = m.userData; m.visible = q.on || !!ud.slide; m.position.set(q.x, q.y, q.kind === 'hull' ? -0.8 : 0); m.scale.copy(ud.s0).multiplyScalar(q.r);
      if (q.kind === 'plate' || q.kind === 'seg') m.rotation.z = q.rot || 0; if (ud.spin) { ud.spin.rotation.z = t * 2; ud.spin.rotation.x = t * 1.3; }
      if (ud.slide) { ud.sv = (ud.sv || 0) + ((q.on ? 0 : 1) - (ud.sv || 0)) * 0.2; ud.slide.position.z = -ud.sv * 2.6; ud.slide.scale.y = 1.96 * (1 - ud.sv * 0.85); }
      if (ud.lid) { ud.lv = (ud.lv || 0) + ((q.armor ? 1 : 0) - (ud.lv || 0)) * 0.15; ud.lid.rotation.y = -ud.lv * 0 ; ud.lid.scale.setScalar(0.74 * (0.02 + ud.lv)); ud.weak.scale.setScalar(0.62 * (0.75 + Math.sin(t * 8) * 0.06)); }
      if (ud.weak && q.on) { const open = !q.armor; if (q.kind === 'core') ud.weak.scale.setScalar(0.6 * (open ? 1 + Math.sin(t * 9) * 0.1 : 0.5)); if (open && q.weak) B.add(q.x, q.y, 1, q.r * 1.7, q.r * 1.7, 0, 1, 0.45, 0.2, 0.3 + Math.sin(t * 7) * 0.1, 0); }
      if (q.flash > 0 && q.on) B.add(q.x, q.y, 1.2, q.r * 1.6, q.r * 1.6, 0, 1, 1, 1, 0.8, 0);
      if (e.boss === 'hunter' && q.kind === 'eye') { m.rotation.z = (e.rot || 0) + PI; if (e.glow > 0) B.add(q.x, q.y, 1, 2.6, 2.6, 0, 1, 0.3, 0.2, e.glow * 0.7, 0); } if (e.boss === 'hunter' && q.kind !== 'eye') m.rotation.z = (e.rot || 0) + PI;
      if (e.boss === 'ace' && q.kind === 'anchor' && e.tele > 0) B.add(q.x, q.y, 1, 1 + e.tele * 2.4, 1 + e.tele * 2.4, t * 9, 1, 0.25, 0.2, 0.9, 1);
      if (e.boss === 'veil') { m.visible = true; B.add(q.x, q.y, 1.3, 1.1, 1.1, 0, 1, 0.3, 0.2, e.stun > 0 ? 1 : 0.5, 2); }
    }
    for (const [q, m] of pm) if (m.userData.f !== this.frameN) { g.remove(m); pm.delete(q); }
    if (S.bossDie > 0 && this.frameN % 3 === 0) this.puff(e.x + (rand() - 0.5) * 6, e.y + (rand() - 0.5) * 6, 1, 2, 0.12, 1.4, 1.2);
  }
}
