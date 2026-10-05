import * as THREE from 'three';

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Enamel palettes: [base, middle, tip, accent used for iridescent mottling]
export const ENAMEL = {
  tealMagenta: ['#04484e', '#0a8a86', '#18ae9e', '#a02478'],
  magentaViolet: ['#6e0a42', '#bc1c70', '#8c32b8', '#0a7a78'],
  violetBlue: ['#3c1c84', '#3454c4', '#1a88bc', '#a8247a'],
  greenBlue: ['#04502e', '#08885a', '#10a490', '#2a5eb4'],
  crimson: ['#5e0620', '#b4163e', '#e03c74', '#74248a'],
  tealViolet: ['#06525a', '#10988c', '#3470c8', '#70349e'],
  leaf: ['#04401f', '#0a6e3e', '#0e7660', '#2858b0'],
  leafBlue: ['#05452a', '#0a7a58', '#2a6ad0', '#16a090'],
};

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

const texCache = new Map();

// Hand-finished enamel: gradient + iridescent mottling + brush streaks, with
// gold filigree (veins, borders, dots) and a matching relief map.
export function enamelTextures(kind, seed, { w = 512, h = 1024, veins = 'petal' } = {}) {
  const key = `${kind}:${seed}:${w}:${veins}`;
  if (texCache.has(key)) return texCache.get(key);
  const r = rng(seed * 7919 + 13);
  const pal = ENAMEL[kind];
  const c = canvas(w, h);
  const g = c.getContext('2d');

  const grad = g.createLinearGradient(0, h, 0, 0);
  grad.addColorStop(0, pal[0]);
  grad.addColorStop(0.5, pal[1]);
  grad.addColorStop(1, pal[2]);
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  // smooth painted flow: wide blurred colour bands sweeping base to tip, so hue drifts across the petal like hand-fired enamel
  g.filter = `blur(${Math.round(w * 0.045)}px)`;
  const bands = veins === 'petal' ? 7 : 6;
  for (let i = 0; i < bands; i++) {
    const side = (i / (bands - 1)) * 2 - 1;
    const x0 = w * (0.5 + side * 0.16 + (r() - 0.5) * 0.1);
    const x1 = w * (0.5 + side * 0.52 + (r() - 0.5) * 0.2);
    const y1 = h * (-0.12 + r() * 0.3);
    g.beginPath();
    g.moveTo(x0, h * 1.06);
    g.bezierCurveTo(x0 + (x1 - x0) * 0.1, h * 0.65, x0 + (x1 - x0) * 0.7, h * 0.4 + r() * h * 0.1, x1, y1);
    g.lineWidth = w * (0.16 + r() * 0.2);
    g.lineCap = 'butt';
    g.strokeStyle = [pal[3], pal[2], pal[1], pal[0]][(i + Math.floor(r() * 2)) % 4];
    g.globalAlpha = 0.32 + r() * 0.3;
    g.stroke();
  }
  g.globalAlpha = 1;
  // glossy lengthwise sheen on one flank
  {
    const sx = w * (r() > 0.5 ? 0.3 : 0.7);
    g.beginPath();
    g.moveTo(sx, h * 0.95);
    g.quadraticCurveTo(sx + (r() - 0.5) * w * 0.6, h * 0.5, w * 0.5 + (r() - 0.5) * w * 0.4, h * 0.08);
    g.lineWidth = w * 0.09;
    g.strokeStyle = '#fff4ff';
    g.globalAlpha = 0.09;
    g.stroke();
    g.globalAlpha = 1;
  }
  g.filter = 'none';

  // fine brushed streaks, mostly tonal so they read as enamel grain rather than white noise
  for (let i = 0; i < 1100; i++) {
    const x0 = w * (0.5 + (r() - 0.5) * 0.4);
    const y0 = h * (0.95 + r() * 0.05);
    const fan = (r() - 0.5) * w * 1.1;
    const len = h * (0.25 + r() * 0.6);
    const y1 = y0 - len;
    const x1 = x0 + fan * (0.4 + r() * 0.8);
    g.globalAlpha = 0.03 + r() * 0.06;
    const k = r();
    g.strokeStyle = k < 0.1 ? '#ffffff' : k < 0.5 ? '#000000' : k < 0.75 ? pal[2] : pal[3];
    g.lineWidth = 0.5 + r() * 1.3;
    g.beginPath();
    g.moveTo(x0 + fan * 0.05, y0);
    g.quadraticCurveTo(x0 + fan * 0.2 + (r() - 0.5) * 8, (y0 + y1) / 2, x1, y1);
    g.stroke();
  }
  g.globalAlpha = 1;

  // cloisonne depth: darker enamel pooled against the gold border
  for (const [x0, x1] of [[0, w * 0.2], [w, w * 0.8]]) {
    const eg = g.createLinearGradient(x0, 0, x1, 0);
    eg.addColorStop(0, 'rgba(8,0,18,0.5)');
    eg.addColorStop(1, 'rgba(8,0,18,0)');
    g.fillStyle = eg;
    g.fillRect(Math.min(x0, x1), 0, w * 0.2, h);
  }
  g.globalCompositeOperation = 'saturation';
  g.globalAlpha = 0.5;
  g.fillStyle = '#ff0000';
  g.fillRect(0, 0, w, h);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = '#ece6e0';
  g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'source-over';
  const facetEdges = [];

  // darker base blush, lighter tip sheen
  const sh = g.createLinearGradient(0, h, 0, 0);
  sh.addColorStop(0, 'rgba(0,0,0,0.30)');
  sh.addColorStop(0.18, 'rgba(0,0,0,0)');
  sh.addColorStop(0.85, 'rgba(255,255,255,0)');
  sh.addColorStop(1, 'rgba(255,255,255,0.10)');
  g.fillStyle = sh;
  g.fillRect(0, 0, w, h);

  // relief map
  const bc = canvas(w, h);
  const bg = bc.getContext('2d');
  bg.fillStyle = '#808080';
  bg.fillRect(0, 0, w, h);

  const gold = g.createLinearGradient(0, h, 0, 0);
  gold.addColorStop(0, '#9c6b22');
  gold.addColorStop(0.5, '#f2cd72');
  gold.addColorStop(1, '#fff0b0');

  const lines = [];
  const dots = [];
  const addCurve = (pts, wd, dotEvery = 0) => {
    lines.push({ pts, wd });
    if (dotEvery) dots.push({ pts, every: dotEvery });
  };
  const qpts = (x0, y0, cx, cy, x1, y1, n = 24) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      out.push([(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1]);
    }
    return out;
  };

  if (veins === 'petal') {
    addCurve(qpts(w / 2, h * 0.97, w / 2 + 6, h * 0.5, w / 2, h * 0.04), 2.4);
    for (let i = 0; i < 4; i++) {
      const y = h * (0.86 - i * 0.2);
      const reach = w * (0.42 - i * 0.02);
      for (const sgn of [-1, 1]) {
        addCurve(qpts(w / 2, y, w / 2 + sgn * reach * 0.55, y - h * 0.04, w / 2 + sgn * reach, y - h * (0.16 + i * 0.006)), 1.3);
      }
    }
    for (const x of [w * 0.07, w * 0.93]) addCurve([[x, h * 0.9], [x, h * 0.08]], 2.4, 22);
    // scroll motif near the base
    for (const sgn of [-1, 1]) {
      const pts = [];
      for (let a = 0; a < Math.PI * 3.2; a += 0.2) {
        const rr = 6 + a * 4.2;
        pts.push([w / 2 + sgn * (w * 0.2 + Math.cos(a * sgn + 1) * rr), h * 0.86 + Math.sin(a * sgn + 1) * rr]);
      }
      addCurve(pts, 2.2);
    }
  } else {
    // leaf: midrib and pinnate veins
    addCurve(qpts(w / 2, h * 0.98, w / 2 + 8, h * 0.5, w / 2, h * 0.03), 4.2);
    for (let i = 0; i < 12; i++) {
      const y = h * (0.9 - i * 0.07);
      const reach = w * (0.46 - i * 0.012);
      for (const sgn of [-1, 1]) {
        addCurve(qpts(w / 2, y, w / 2 + sgn * reach * 0.5, y - h * 0.02, w / 2 + sgn * reach, y - h * (0.12 + i * 0.002)), 1.8);
        addCurve(qpts(w / 2 + sgn * reach * 0.45, y - h * 0.012, w / 2 + sgn * reach * 0.62, y - h * 0.07, w / 2 + sgn * reach * 0.8, y - h * 0.13), 1.0);
      }
    }
    for (const x of [w * 0.06, w * 0.94]) addCurve([[x, h * 0.92], [x, h * 0.06]], 2.4, 20);
  }

  const stroke = (ctx, pts, wd, style) => {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.lineWidth = wd;
    ctx.strokeStyle = style;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };
  for (const l of lines) {
    stroke(g, l.pts.map((p) => [p[0] + 1.5, p[1] + 1.5]), l.wd + 1.2, 'rgba(20,10,10,0.5)');
    stroke(g, l.pts, l.wd, gold);
    stroke(bg, l.pts, l.wd + 1, '#ffffff');
  }
  for (const d of dots) {
    let acc = 0;
    for (let i = 1; i < d.pts.length; i++) {
      const a = d.pts[i - 1];
      const b = d.pts[i];
      const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
      acc += seg;
      if (acc >= d.every) {
        acc = 0;
        for (const ctx of [g, bg]) {
          ctx.beginPath();
          ctx.arc(b[0], b[1], 3.2, 0, Math.PI * 2);
          ctx.fillStyle = ctx === g ? '#f6d780' : '#ffffff';
          ctx.fill();
        }
      }
    }
  }

  // gold cell network: a share of the facet borders are inlaid in gold, like the cloisonne wires in the reference
  const goldOdds = veins === 'petal' ? 0.16 : 0.05;
  const edgeHash = (a, b) => {
    const x = Math.round((a[0] + b[0]) / 2);
    const y = Math.round((a[1] + b[1]) / 2);
    return (Math.imul(x * 73856093 ^ y * 19349663, 2654435761) >>> 0) / 4294967296;
  };
  const margin = 0.06 * w;
  for (const [a, b] of facetEdges) {
    if (edgeHash(a, b) > goldOdds) continue;
    if (Math.min(a[0], b[0]) < margin || Math.max(a[0], b[0]) > w - margin) continue;
    if (Math.max(a[1], b[1]) > h || Math.min(a[1], b[1]) < 0) continue;
    stroke(g, [a, b], 1.5, gold);
    stroke(bg, [a, b], 2.2, '#d8d8d8');
  }

  // edge eyelets: jewelled-looking gold rings spaced along both borders
  const asp = veins === 'petal' ? 1.5 : 0.8;
  const eyeletCols = ['#0a2e52', '#4a0f33', '#0b4a3f', '#2a1260'];
  const ex = veins === 'petal' ? 0.962 : 0.972;
  let ei = 0;
  for (const x of [w * (1 - ex), w * ex]) {
    for (let y = h * 0.2; y < h * 0.9; y += h * (veins === 'petal' ? 0.088 : 0.075)) {
      const rx = 8.5;
      const ry = rx * asp;
      g.beginPath();
      g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      g.fillStyle = eyeletCols[ei++ % eyeletCols.length];
      g.fill();
      g.lineWidth = 3.2;
      g.strokeStyle = gold;
      g.stroke();
      g.beginPath();
      g.ellipse(x - rx * 0.28, y - ry * 0.3, rx * 0.22, ry * 0.2, 0, 0, Math.PI * 2);
      g.fillStyle = 'rgba(255,255,255,0.55)';
      g.fill();
      bg.beginPath();
      bg.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      bg.fillStyle = '#505050';
      bg.fill();
      bg.lineWidth = 3.6;
      bg.strokeStyle = '#ffffff';
      bg.stroke();
    }
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(bc);
  bump.anisotropy = 4;
  const out = { map, bump };
  texCache.set(key, out);
  return out;
}

export function enamelMaterial(kind, seed, opts = {}) {
  const { map, bump } = enamelTextures(kind, seed, opts);
  const leafy = opts.veins === 'leaf';
  return new THREE.MeshPhysicalMaterial({
    map,
    bumpMap: bump,
    bumpScale: 1.6,
    metalness: 0.5,
    roughness: 0.28,
    clearcoat: leafy ? 0.3 : 0.5,
    clearcoatRoughness: leafy ? 0.18 : 0.05,
    iridescence: 0.3,
    iridescenceIOR: 1.8,
    iridescenceThicknessRange: [200, 760],
    envMapIntensity: leafy ? 0.55 : 1.0,
    side: THREE.DoubleSide,
  });
}

export const GEM_COLORS = {
  ruby: new THREE.Color('#e0245e'),
  rose: new THREE.Color('#ff4f9a'),
  sapphire: new THREE.Color('#1f56e8'),
  emerald: new THREE.Color('#17b872'),
  amber: new THREE.Color('#ffae2b'),
  amethyst: new THREE.Color('#8f4de0'),
  aqua: new THREE.Color('#22c6d6'),
};

export function createMaterials() {
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xc48a2c, metalness: 1, roughness: 0.28, envMapIntensity: 1.35, clearcoat: 0.25, clearcoatRoughness: 0.2 });
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xb88434, metalness: 1, roughness: 0.34, envMapIntensity: 1.3 });
  const brassDark = new THREE.MeshPhysicalMaterial({ color: 0x9c7230, metalness: 1, roughness: 0.46, envMapIntensity: 1.3 });
  const gunmetal = new THREE.MeshPhysicalMaterial({ color: 0x4a4f58, metalness: 1, roughness: 0.34, envMapIntensity: 1.4 });
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xc9ccd2, metalness: 1, roughness: 0.28, envMapIntensity: 1.6 });
  const gem = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    metalness: 0,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    ior: 1.75,
    specularIntensity: 1,
    envMapIntensity: 3.2,
    emissive: 0x000000,
  });
  const metal = (color, rough = 0.26, env = 1.5) => new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: rough, envMapIntensity: env, clearcoat: 0.35, clearcoatRoughness: 0.12 });
  const copper = metal(0xd2693a);
  const roseGold = metal(0xe6968a);
  const anoTeal = metal(0x18b7b0, 0.22, 1.7);
  const anoViolet = metal(0x8a4fe8, 0.22, 1.7);
  const anoBlue = metal(0x2f6cf0, 0.22, 1.7);
  const anoMagenta = metal(0xe0328c, 0.22, 1.7);
  const screw = new THREE.MeshPhysicalMaterial({ color: 0xe0ac44, metalness: 1, roughness: 0.28, envMapIntensity: 1.7, vertexColors: true });
  const stemBraid = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, metalness: 0.8, roughness: 0.24, clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 1.6 });
  const core = coreMaterial();
  return { gold, brass, brassDark, gunmetal, steel, gem, screw, stemBraid, core, copper, roseGold, anoTeal, anoViolet, anoBlue, anoMagenta };
}

// Crystal core: faceted prismatic cells with a warm hot centre.
export function coreMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPulse: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vPos; varying vec3 vN; varying vec3 vV;
      void main(){
        vPos = position;
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vPos; varying vec3 vN; varying vec3 vV;
      uniform float uTime; uniform float uPulse;
      vec3 hash33(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return fract(sin(p)*43758.5453); }
      vec3 hsv2rgb(vec3 c){ vec3 p = abs(fract(c.xxx + vec3(0.0,2.0/3.0,1.0/3.0))*6.0-3.0); return c.z*mix(vec3(1.0), clamp(p-1.0,0.0,1.0), c.y); }
      void main(){
        vec3 p = normalize(vPos) * 4.2;
        vec3 ip = floor(p); vec3 fp = fract(p);
        float d1 = 9.0, d2 = 9.0; vec3 cid = vec3(0.0);
        for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
          vec3 g = vec3(float(i),float(j),float(k));
          vec3 o = hash33(ip+g);
          vec3 r = g + o - fp;
          float d = dot(r,r);
          if(d<d1){ d2=d1; d1=d; cid=ip+g; } else if(d<d2){ d2=d; }
        }
        float edge = 1.0 - smoothstep(0.0, 0.07, sqrt(d2)-sqrt(d1));
        float h = fract(dot(hash33(cid), vec3(0.37,0.41,0.22)) + uTime*0.02 + dot(normalize(vN), vec3(0.4,0.6,0.2))*0.18);
        vec3 col = pow(hsv2rgb(vec3(h, 0.82, 1.0)), vec3(2.0));
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.1);
        vec3 hot = pow(vec3(1.0, 0.62, 0.16), vec3(2.0));
        float fb = 0.62 + 0.75 * fract(dot(hash33(cid + 3.0), vec3(0.5, 0.3, 0.2)) * 7.0);
        col = mix(hot*1.3, col*1.35*fb, 0.5 + 0.5*smoothstep(0.0, 0.6, f));
        col += hot * 0.5 * pow(1.0 - f, 3.0);
        col += edge * vec3(1.0,0.78,0.45) * 0.28;
        col *= (0.7 + 0.3*uPulse);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}
