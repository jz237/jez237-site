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
  tealMagenta: ['#0c8a8c', '#17a898', '#c4287e', '#6c37c4'],
  magentaViolet: ['#a3135c', '#d22c88', '#7c38ca', '#12928f'],
  violetBlue: ['#6a37c2', '#4c64da', '#1f96c6', '#c4287e'],
  greenBlue: ['#0a8c5e', '#0e988f', '#3c7ad6', '#b83a88'],
  crimson: ['#901236', '#cc2858', '#ea649c', '#6c37c4'],
  tealViolet: ['#0c8a7c', '#2c84ca', '#8c44ca', '#c4287e'],
  leaf: ['#0a6a3a', '#10806a', '#2a5cc0', '#22a85c'],
  leafBlue: ['#0c6c52', '#2468c0', '#3a5cd0', '#10927e'],
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

  // iridescent mottling
  for (let i = 0; i < 16; i++) {
    const x = r() * w;
    const y = r() * h;
    const rad = (0.15 + r() * 0.35) * h;
    const col = i % 3 === 0 ? pal[3] : i % 3 === 1 ? pal[2] : pal[1];
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, col);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = 0.28 + r() * 0.25;
    g.globalCompositeOperation = i % 2 ? 'soft-light' : 'overlay';
    g.fillStyle = rg;
    g.fillRect(0, 0, w, h);
  }
  g.globalCompositeOperation = 'source-over';
  // broad colour blends: teal-to-magenta-to-violet shifts inside one petal
  for (let i = 0; i < 7; i++) {
    const x = r() * w;
    const y = r() * h;
    const rad = (0.22 + r() * 0.3) * h;
    const col = [pal[3], pal[2], pal[1]][i % 3];
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, col);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = 0.34 + r() * 0.2;
    g.fillStyle = rg;
    g.fillRect(0, 0, w, h);
  }

  // brush streaks along the length
  for (let i = 0; i < 1400; i++) {
    const x = r() * w;
    const y0 = r() * h;
    const len = 40 + r() * 260;
    g.globalAlpha = 0.04 + r() * 0.07;
    g.strokeStyle = r() > 0.5 ? '#ffffff' : '#000000';
    g.lineWidth = 0.6 + r() * 1.6;
    g.beginPath();
    g.moveTo(x, y0);
    g.lineTo(x + (r() - 0.5) * 8, y0 - len);
    g.stroke();
  }
  g.globalAlpha = 1;

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
    addCurve(qpts(w / 2, h * 0.97, w / 2 + 6, h * 0.5, w / 2, h * 0.04), 3.4);
    for (let i = 0; i < 5; i++) {
      const y = h * (0.86 - i * 0.16);
      const reach = w * (0.42 - i * 0.02);
      for (const sgn of [-1, 1]) {
        addCurve(qpts(w / 2, y, w / 2 + sgn * reach * 0.55, y - h * 0.04, w / 2 + sgn * reach, y - h * (0.16 + i * 0.006)), 2.0);
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
    addCurve(qpts(w / 2, h * 0.98, w / 2 + 8, h * 0.5, w / 2, h * 0.03), 5.5);
    for (let i = 0; i < 12; i++) {
      const y = h * (0.9 - i * 0.07);
      const reach = w * (0.46 - i * 0.012);
      for (const sgn of [-1, 1]) {
        addCurve(qpts(w / 2, y, w / 2 + sgn * reach * 0.5, y - h * 0.02, w / 2 + sgn * reach, y - h * (0.12 + i * 0.002)), 2.8);
        addCurve(qpts(w / 2 + sgn * reach * 0.45, y - h * 0.012, w / 2 + sgn * reach * 0.62, y - h * 0.07, w / 2 + sgn * reach * 0.8, y - h * 0.13), 1.5);
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
  return new THREE.MeshPhysicalMaterial({
    map,
    bumpMap: bump,
    bumpScale: 1.6,
    metalness: 0.18,
    roughness: 0.36,
    clearcoat: 0.3,
    clearcoatRoughness: 0.12,
    iridescence: 0.3,
    iridescenceIOR: 1.55,
    iridescenceThicknessRange: [180, 620],
    envMapIntensity: 0.45,
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
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xe3b24c, metalness: 1, roughness: 0.24, envMapIntensity: 1.7, clearcoat: 0.25, clearcoatRoughness: 0.2 });
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xcf9e44, metalness: 1, roughness: 0.32, envMapIntensity: 1.6 });
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
  const screw = new THREE.MeshPhysicalMaterial({ color: 0xe0ac44, metalness: 1, roughness: 0.28, envMapIntensity: 1.7, vertexColors: true });
  const stemBraid = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, metalness: 0.25, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.14, envMapIntensity: 1.2 });
  const core = coreMaterial();
  return { gold, brass, brassDark, gunmetal, steel, gem, screw, stemBraid, core };
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
        col = mix(hot*1.5, col*1.25, smoothstep(0.1, 0.8, f));
        col += edge * vec3(1.0,0.78,0.45) * 0.28;
        col *= (0.7 + 0.3*uPulse);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}
