import * as THREE from 'three';

function texture(draw, size = 512) { const canvas = document.createElement('canvas'); canvas.width = canvas.height = size; draw(canvas.getContext('2d'), size); const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy = 8; return tex; }
let seed = 237; const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
/** Tileable multi-octave value noise in [0,1]. */
function noiseField(size, octaves = 4, base = 8) {
  const out = new Float32Array(size * size); let amp = 1, total = 0;
  for (let o = 0; o < octaves; o++) { const n = base << o, grid = new Float32Array(n * n); for (let i = 0; i < grid.length; i++) grid[i] = random();
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const gx = x / size * n, gy = y / size * n, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const g = (i, j) => grid[((j + n) % n) * n + ((i + n) % n)]; const v = (g(x0, y0) * (1 - sx) + g(x0 + 1, y0) * sx) * (1 - sy) + (g(x0, y0 + 1) * (1 - sx) + g(x0 + 1, y0 + 1) * sx) * sy; out[y * size + x] += v * amp; }
    total += amp; amp *= .5; }
  for (let i = 0; i < out.length; i++) out[i] /= total; return out;
}
const paint = (c, s, field, lo, hi) => { const d = c.createImageData(s, s); for (let i = 0; i < field.length; i++) { const v = Math.round(lo + (hi - lo) * field[i]); d.data.set([v, v, v, 255], i * 4); } c.putImageData(d, 0, 0); };
// Bone: fine grain plus pores that read as cortical surface texture.
const boneTex = texture((c, s) => { paint(c, s, noiseField(s, 5, 6), 105, 150); for (let i = 0; i < 2600; i++) { const r = .6 + random() * 2.4, v = 70 + Math.round(random() * 40); c.fillStyle = `rgb(${v},${v},${v})`; c.beginPath(); c.arc(random() * s, random() * s, r, 0, 7); c.fill(); } });
// Muscle: fibres along v with bundle-scale variation and fascicle seams.
const muscleTex = texture((c, s) => { paint(c, s, noiseField(s, 3, 4), 110, 146); const f = noiseField(s, 2, 3); for (let x = 0; x < s; x += 2) { const v = 92 + Math.round(random() * 70); c.fillStyle = `rgba(${v},${v},${v},.55)`; c.fillRect(x, 0, 1 + Math.round(random()), s); } for (let i = 0; i < 90; i++) { const x = random() * s; c.strokeStyle = `rgba(60,60,60,${.25 + random() * .35})`; c.lineWidth = 1 + random() * 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + (random() - .5) * 30, s); c.stroke(); } for (let i = 0; i < 700; i++) { const v = 150 + Math.round(random() * 60); c.fillStyle = `rgba(${v},${v},${v},.5)`; c.fillRect(random() * s, random() * s, 1.5, 8 + random() * 40); } });
// Organs: soft mottling with a branching vascular tracery pressed into the surface.
const organTex = texture((c, s) => { paint(c, s, noiseField(s, 4, 5), 112, 146); c.lineCap = 'round'; const branch = (x, y, a, w, depth) => { if (depth <= 0 || w < .4) return; const len = 18 + random() * 40, nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len; c.strokeStyle = `rgba(70,70,70,${.35 + w * .1})`; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.lineTo(nx, ny); c.stroke(); branch(nx, ny, a + (random() - .5) * 1.2, w * .72, depth - 1); if (random() > .35) branch(nx, ny, a + (random() - .5) * 2.2, w * .55, depth - 1); }; for (let i = 0; i < 26; i++) branch(random() * s, random() * s, random() * 6.283, 2.6, 7); for (let i = 0; i < 900; i++) { const v = 150 + Math.round(random() * 50); c.fillStyle = `rgba(${v},${v},${v},.35)`; c.beginPath(); c.arc(random() * s, random() * s, 1 + random() * 2.5, 0, 7); c.fill(); } });
// Brain: fine granular cortex.
const brainTex = texture((c, s) => { paint(c, s, noiseField(s, 5, 8), 108, 148); for (let i = 0; i < 1200; i++) { const v = 90 + Math.round(random() * 40); c.fillStyle = `rgba(${v},${v},${v},.4)`; c.beginPath(); c.arc(random() * s, random() * s, 1 + random() * 2, 0, 7); c.fill(); } });
// Vessels: circumferential ridges of the muscular wall.
const vesselTex = texture((c, s) => { paint(c, s, noiseField(s, 3, 6), 118, 138); for (let y = 0; y < s; y += 5) { const v = 90 + Math.round(random() * 60); c.fillStyle = `rgba(${v},${v},${v},.6)`; c.fillRect(0, y, s, 2 + Math.round(random())); } });
// Skin: pores and fine creases.
const skinTex = texture((c, s) => { paint(c, s, noiseField(s, 4, 7), 116, 140); for (let i = 0; i < 3000; i++) { const v = 80 + Math.round(random() * 40); c.fillStyle = `rgba(${v},${v},${v},.45)`; c.beginPath(); c.arc(random() * s, random() * s, .6 + random() * 1.4, 0, 7); c.fill(); } for (let i = 0; i < 240; i++) { c.strokeStyle = 'rgba(95,95,95,.35)'; c.lineWidth = .8; const x = random() * s, y = random() * s, a = random() * 6.283; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18); c.stroke(); } });
// Iris: radial fibres, a darker limbal ring and a lighter collarette, centred in UV space.
const irisTex = texture((c, s) => { const g = c.createRadialGradient(s / 2, s / 2, s * .05, s / 2, s / 2, s * .5); g.addColorStop(0, '#2b2b2b'); g.addColorStop(.12, '#6f8a5a'); g.addColorStop(.55, '#587a4a'); g.addColorStop(.85, '#3d5a36'); g.addColorStop(1, '#1e2a1c'); c.fillStyle = g; c.fillRect(0, 0, s, s);
  for (let i = 0; i < 420; i++) { const a = random() * 6.283, r0 = s * (.06 + random() * .1), r1 = s * (.3 + random() * .2); const v = 60 + Math.round(random() * 150); c.strokeStyle = `rgba(${v},${v + 20},${Math.round(v * .6)},${.25 + random() * .4})`; c.lineWidth = .6 + random() * 1.6; c.beginPath(); c.moveTo(s / 2 + Math.cos(a) * r0, s / 2 + Math.sin(a) * r0); c.lineTo(s / 2 + Math.cos(a + (random() - .5) * .08) * r1, s / 2 + Math.sin(a + (random() - .5) * .08) * r1); c.stroke(); }
  c.fillStyle = '#0b0b0b'; c.beginPath(); c.arc(s / 2, s / 2, s * .13, 0, 7); c.fill(); }, 512);
// Hair: long strands with tonal variation for an anisotropic sheen.
const hairTex = texture((c, s) => { paint(c, s, noiseField(s, 2, 3), 90, 150); for (let x = 0; x < s; x += 1.5) { const v = 70 + Math.round(random() * 110); c.fillStyle = `rgba(${v},${v},${v},.7)`; c.fillRect(x, 0, 1, s); } });
// Nerve: fine longitudinal fascicles.
const nerveTex = texture((c, s) => { paint(c, s, noiseField(s, 3, 4), 118, 140); for (let x = 0; x < s; x += 3) { const v = 100 + Math.round(random() * 60); c.fillStyle = `rgba(${v},${v},${v},.5)`; c.fillRect(x, 0, 1, s); } });
const grain = boneTex, pores = boneTex, striation = muscleTex, vesselRidge = vesselTex;

/** Planar UVs along the piece's longest axis so muscle striations run with the fibres. */
export function projectedUV(mesh, cell = 0.06, world = null) {
  const g = mesh.geometry; g.computeBoundingBox(); const box = g.boundingBox, size = box.getSize(new THREE.Vector3()), p = g.attributes.position, uv = new Float32Array(p.count * 2);
  if (world) {   // shared body-space projection (x, y) so adjacent pieces continue the same pattern across their seams
    const s = world.scale || 1, o = world.offset || [0, 0, 0];
    for (let i = 0; i < p.count; i++) { uv[i * 2] = (p.getX(i) * s + o[0]) / cell; uv[i * 2 + 1] = (p.getY(i) * s + o[1]) / cell; }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return;
  }
  const longest = size.x >= size.y && size.x >= size.z ? 0 : size.y >= size.z ? 1 : 2, other = longest === 0 ? (size.y >= size.z ? 1 : 2) : longest === 1 ? (size.x >= size.z ? 0 : 2) : (size.x >= size.y ? 0 : 1);
  const mins = box.min.toArray();
  for (let i = 0; i < p.count; i++) { const v = [p.getX(i), p.getY(i), p.getZ(i)]; uv[i * 2] = (v[other] - mins[other]) / cell; uv[i * 2 + 1] = (v[longest] - mins[longest]) / cell; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

/** UVs in [0,1] across the piece's two largest axes, centred: used for disc-like maps such as the iris. */
export function planarCenteredUV(mesh) {
  const g = mesh.geometry; g.computeBoundingBox(); const box = g.boundingBox, size = box.getSize(new THREE.Vector3()), p = g.attributes.position, uv = new Float32Array(p.count * 2);
  const smallest = size.x <= size.y && size.x <= size.z ? 0 : size.y <= size.z ? 1 : 2, a = smallest === 0 ? 1 : 0, b = smallest === 2 ? 1 : 2; const c = box.getCenter(new THREE.Vector3()).toArray(), ext = Math.max(size.getComponent(a), size.getComponent(b), 1e-4);
  for (let i = 0; i < p.count; i++) { const v = [p.getX(i), p.getY(i), p.getZ(i)]; uv[i * 2] = (v[a] - c[a]) / ext + .5; uv[i * 2 + 1] = (v[b] - c[b]) / ext + .5; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}
/** Skin tone variation as vertex colours in body space: warmer lips, cheeks, nose tip and ears; cooler creases; fine mottling. */
export function skinTint(geometry, world) {
  const p = geometry.attributes.position, s = world.scale || 1, o = world.offset || [0, 0, 0], col = new Float32Array(p.count * 3);
  const hash = (x, y, z) => { const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return n - Math.floor(n); };
  const zones = [   // [x, y, z, radius, r, g, b] warm/cool multipliers around body-space points (metres)
    [0, 1.528, 0.078, .022, 1.06, .74, .72],      // lips
    [.055, 1.548, .052, .045, 1.03, .92, .90], [-.055, 1.548, .052, .045, 1.03, .92, .90],   // cheeks
    [0, 1.556, .092, .018, 1.04, .90, .88],       // nose tip
    [.075, 1.57, -.02, .04, 1.04, .90, .89], [-.075, 1.57, -.02, .04, 1.04, .90, .89],       // ears
    [.03, 1.582, .045, .026, .96, .93, .95], [-.03, 1.582, .045, .026, .96, .93, .95],       // orbits, slightly cool
    [.24, .84, .02, .05, 1.03, .93, .92], [-.24, .84, .02, .05, 1.03, .93, .92],             // knuckles / hands
    [.09, .43, -.02, .07, 1.02, .95, .94], [-.09, .43, -.02, .07, 1.02, .95, .94],           // knees
    [.10, .04, .03, .09, 1.03, .93, .92], [-.10, .04, .03, .09, 1.03, .93, .92]];            // feet
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) * s + o[0], y = p.getY(i) * s + o[1], z = p.getZ(i) * s + o[2];
    let r = 1, g = 1, b = 1;
    for (const zn of zones) { const d = Math.hypot(x - zn[0], y - zn[1], z - zn[2]); if (d < zn[3]) { const w = 1 - d / zn[3]; const k = w * w * (3 - 2 * w); r += (zn[4] - 1) * k; g += (zn[5] - 1) * k; b += (zn[6] - 1) * k; } }
    const n = (hash(Math.round(x * 90), Math.round(y * 90), Math.round(z * 90)) - .5) * .05 + (hash(Math.round(x * 400), Math.round(y * 400), Math.round(z * 400)) - .5) * .03;
    col[i * 3] = r + n; col[i * 3 + 1] = g + n * .9; col[i * 3 + 2] = b + n * .8;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
}
export const fileColors = {skeletal: '#f0e6c8', joints: '#d8d1c0', visceral: '#f2a8b8', heart: '#ff6b7a', brain: '#f5c0c8', muscular: '#e07a7a', vessels: '#7f8fe6', nerves: '#f5e08a', lymphoid: '#9fd98a', regions: '#e6c9a8'};
export const fileLabels = {skeletal: 'Skeleton', joints: 'Ligaments & discs', visceral: 'Viscera', heart: 'Heart', brain: 'Brain & senses', muscular: 'Muscles', vessels: 'Arteries & veins', nerves: 'Nerves & cord', lymphoid: 'Lymphatics', regions: 'Surface regions'};

/** Realistic finish for one piece. Returns {color, roughness, clearcoat, opacity, bump, bumpScale, emissive, sheen...}. */
function realistic(p) {
  const n = p.name, path = p.path || '', L = n.toLowerCase();
  const wet = {roughness: .3, clearcoat: .85, clearcoatRoughness: .18, bump: organTex, bumpScale: .0012, roughMap: organTex, ior: 1.42};
  switch (p.file) {
    case 'skeletal':
      if (/tooth|incisor|canine|molar|premolar/.test(L)) return {color: '#f4f1e8', roughness: .28, clearcoat: .7, clearcoatRoughness: .15};
      if (/cartilage|cartilages/.test(L + path.toLowerCase())) return {color: '#dfe7e3', roughness: .38, clearcoat: .5, opacity: .92, transparent: true};
      return {color: '#e8e0cf', roughness: .55, clearcoat: .22, clearcoatRoughness: .5, bump: boneTex, bumpScale: .0009, roughMap: boneTex};
    case 'joints':
      if (/disc/.test(L)) return {color: '#d4d7da', roughness: .45, clearcoat: .3};
      return {color: '#e7dfd0', roughness: .7, bump: striation, bumpScale: .0003};
    case 'visceral':
      if (/lobe of (right|left) lung/.test(L)) return {color: '#e5a3ab', ...wet, bump: organTex, bumpScale: .0016};
      if (/bronch|trachea/.test(L)) return {color: '#e2d5c1', roughness: .4, clearcoat: .4, bump: vesselRidge, bumpScale: .0006};
      if (L === 'pleura') return {color: '#e9d7d3', roughness: .2, clearcoat: .8, opacity: .32, transparent: true, depthWrite: false};
      if (/omentum|mesocolon|meso-appendix|taenia/.test(L)) return {color: '#e5cf9c', roughness: .35, clearcoat: .6, opacity: .82, transparent: true};
      if (/liver/.test(L)) return {color: '#7b2f2b', ...wet, bumpScale: .0022};
      if (/gallbladder|bile duct/.test(L)) return {color: '#5e8a58', ...wet};
      if (/stomach|duodenum|jejunum|ileum|oesophagus|pharynx/.test(L)) return {color: '#cc8f7f', ...wet};
      if (/colon|appendix|anal|rectum/.test(L)) return {color: '#b98079', ...wet};
      if (/kidney|renal|suprarenal/.test(L)) return {color: '#7d3038', ...wet};
      if (/ureter|urethra|bladder/.test(L)) return {color: '#d9b0a0', ...wet};
      if (/pancrea/.test(L)) return {color: '#e4c59b', roughness: .42, clearcoat: .5, bump: boneTex, bumpScale: .0018, roughMap: boneTex};
      if (/thyroid|parathyroid|hypophysis|pineal/.test(L)) return {color: '#b9585d', ...wet};
      if (/gland|duct/.test(L)) return {color: '#d4a382', roughness: .45, clearcoat: .4};
      if (/tongue|palate|uvula|gingiva|mucosa/.test(L)) return {color: '#c9757c', ...wet};
      if (/testis|epididymis|penis|prostate|seminal|ductus|ejaculatory/.test(L)) return {color: '#c99589', roughness: .4, clearcoat: .4};
      return {color: '#d09a90', ...wet};
    case 'heart':
      if (/leaflet/.test(L)) return {color: '#eadbcd', roughness: .3, clearcoat: .6, opacity: .95, transparent: true};
      if (/papillary/.test(L)) return {color: '#8f2a30', ...wet};
      if (/coronary artery|interventricular artery|circumflex|septal branches|inferolateral/.test(L)) return {color: '#d6403f', roughness: .35, clearcoat: .6};
      if (/cardiac vein|coronary sinus|vein of left ventricle/.test(L)) return {color: '#4f56a8', roughness: .35, clearcoat: .6};
      if (/pulmonary vein/.test(L)) return {color: '#c84a4a', roughness: .35, clearcoat: .6, bump: vesselRidge, bumpScale: .0004};
      if (/pulmonary (trunk|artery)|bifurcation/.test(L)) return {color: '#5661b5', roughness: .35, clearcoat: .6, bump: vesselRidge, bumpScale: .0004};
      if (/aorta|aortic/.test(L)) return {color: '#cf4646', roughness: .35, clearcoat: .6, bump: vesselRidge, bumpScale: .0004};
      if (/vena cava/.test(L)) return {color: '#4b58ad', roughness: .35, clearcoat: .6, bump: vesselRidge, bumpScale: .0004};
      return {color: '#a5333b', ...wet, bump: muscleTex, bumpScale: .0012, striated: true};
    case 'vessels': {
      const artery = /arter|aorta|trunk|circle/.test(L) || /Arterial system/.test(path);
      return {color: artery ? '#c8403f' : /portal/.test(L + path) ? '#6f4fa0' : '#4a5ba8', roughness: .36, clearcoat: .7, clearcoatRoughness: .2, bump: vesselTex, bumpScale: .0006, roughMap: vesselTex, striated: true};
    }
    case 'brain':
      if (/falx|tentorium|dura/.test(L)) return {color: '#e0d6c2', roughness: .3, clearcoat: .5, opacity: .38, transparent: true, depthWrite: false};
      if (/ventricle|choroid|aqueduct|central canal/.test(L)) return {color: '#8cc4e6', roughness: .2, clearcoat: .8, opacity: .62, transparent: true};
      if (/cornea/.test(L)) return {color: '#eaf6fb', roughness: .02, clearcoat: 1, clearcoatRoughness: .02, opacity: .28, transparent: true, depthWrite: false, ior: 1.376};
      if (/lens/.test(L)) return {color: '#f4fbfd', roughness: .03, clearcoat: 1, opacity: .55, transparent: true, ior: 1.41};
      if (/vitreous|chamber|segment of eyeball|zonular/.test(L)) return {color: '#dcedf3', roughness: .1, clearcoat: .8, opacity: .22, transparent: true, depthWrite: false};
      if (/sclera/.test(L)) return {color: '#f4f0ea', roughness: .22, clearcoat: .9, clearcoatRoughness: .1, bump: organTex, bumpScale: .0004, roughMap: organTex};
      if (/iris/.test(L)) return {color: '#ffffff', map: irisTex, roughness: .3, clearcoat: .8, clearcoatRoughness: .1, planarUV: true};
      if (/retina/.test(L)) return {color: '#8b3b3b', roughness: .3, clearcoat: .6};
      if (/lacrimal|ear|cochlea|vestibule/.test(L)) return {color: '#e0c9b8', roughness: .45, clearcoat: .3};
      if (/white matter/.test(L)) return {color: '#efe7de', roughness: .35, clearcoat: .5};
      if (/cerebral sulci/.test(L)) return {color: '#c98d93', roughness: .4, clearcoat: .4};
      if (/Cerebellum/.test(path)) return {color: '#d9a1a6', roughness: .36, clearcoat: .6, bump: muscleTex, bumpScale: .0008, striated: true};
      if (/Brainstem/.test(path)) return {color: '#dcc1b3', roughness: .38, clearcoat: .55};
      if (/Diencephalon|striatum|Basal forebrain|Limbic/.test(path) || /thalamus|caudate|putamen|pallidus|amygdal|hippocamp|fornix/.test(L)) return {color: '#c99aa0', roughness: .38, clearcoat: .55};
      if (/corpus callosum|commissure|septum/.test(L)) return {color: '#ece2d8', roughness: .35, clearcoat: .5};
      return {color: '#e3b4b7', roughness: .34, clearcoat: .7, clearcoatRoughness: .25, bump: brainTex, bumpScale: .0011, roughMap: brainTex};
    case 'nerves': return {color: '#f0dc9a', roughness: .48, clearcoat: .3, bump: nerveTex, bumpScale: .0006, striated: true};
    case 'muscular':
      if (/fascia|bursa|sheath|retinacul|aponeurosis|iliotibial|septum|thoracolumbar/.test(L)) return {color: '#e6dccb', roughness: .5, clearcoat: .3, opacity: .78, transparent: true};
      if (/tendon/.test(L)) return {color: '#efe7d8', roughness: .4, clearcoat: .4};
      return {color: '#9b2f33', roughness: .4, clearcoat: .55, clearcoatRoughness: .3, bump: muscleTex, bumpScale: .0022, roughMap: muscleTex, striated: true};
    case 'lymphoid':
      if (/spleen/.test(L)) return {color: '#6e2a3a', ...wet};
      if (/thymus/.test(L)) return {color: '#d9a0a8', roughness: .4, clearcoat: .4};
      return {color: '#86b96f', roughness: .45, clearcoat: .3};
    case 'regions':
      if (/hair/.test(L)) return {color: '#2a1a12', roughness: .62, clearcoat: .08, clearcoatRoughness: .7, sheen: .8, sheenColor: '#6a4a34', sheenRoughness: .45, bump: hairTex, bumpScale: .0016, roughMap: hairTex, striated: true};
      return {color: '#d8b28f', roughness: .5, clearcoat: .2, opacity: .30, transparent: true, depthWrite: false, bump: skinTex, bumpScale: .0008, sheen: .35, sheenColor: '#f2d2c0'};
  }
  return {color: '#cfc6bb', roughness: .6};
}

export const modes = ['skin', 'realistic', 'coded', 'xray', 'clay'];
/** Opaque skin for the Skin finish: warm tone, pores, soft sheen standing in for subsurface scattering. */
function skinSpec(p) { const L = p.name.toLowerCase(); if (/hair/.test(L)) return realistic(p); return {color: '#d9ad8e', roughness: .5, clearcoat: .1, clearcoatRoughness: .6, bump: skinTex, bumpScale: .0011, roughMap: skinTex, sheen: .4, sheenColor: '#e8a08a', sheenRoughness: .75, sss: {wrap: .45, bleed: [.42, .12, .06]}}; }
export function finishMaterial(mesh, part, mode = 'realistic') {
  const r = realistic(part); const base = fileColors[part.file] || '#cccccc';
  let spec;
  if (mode === 'realistic') spec = r;
  else if (mode === 'skin') spec = part.file === 'regions' ? skinSpec(part) : r;
  else if (mode === 'coded') spec = {color: base, roughness: .5, clearcoat: .3, opacity: r.transparent ? Math.max(r.opacity, .4) : 1, transparent: !!r.transparent, depthWrite: r.depthWrite};
  else if (mode === 'xray') spec = {color: part.file === 'skeletal' ? '#eef3f7' : base, roughness: .25, clearcoat: .5, opacity: part.file === 'skeletal' ? .92 : .16, transparent: part.file !== 'skeletal', depthWrite: part.file === 'skeletal', emissive: base, emissiveIntensity: part.file === 'skeletal' ? 0 : .35};
  else spec = {color: '#cfc6bb', roughness: .85, clearcoat: 0, opacity: r.transparent ? .5 : 1, transparent: !!r.transparent, depthWrite: r.depthWrite};
  if (spec.planarUV && !mesh.geometry.attributes.uv) { planarCenteredUV(mesh); if (mesh.userData) mesh.userData.uvCell = 0; }
  if ((spec.bump || spec.roughMap) && !mesh.geometry.attributes.uv) { const cell = spec.striated ? .045 : .06; const world = part.file === 'regions' && !/hair/i.test(part.name) ? { scale: mesh.scale?.x || 1, offset: mesh.position ? mesh.position.toArray() : [0, 0, 0] } : null; projectedUV(mesh, cell, world); if (mesh.userData) { mesh.userData.uvCell = cell; mesh.userData.uvWorld = world; } }
  const mat = new THREE.MeshPhysicalMaterial({color: spec.color, roughness: spec.roughness ?? .5, metalness: 0, clearcoat: spec.clearcoat ?? 0, clearcoatRoughness: spec.clearcoatRoughness ?? .3, envMapIntensity: .8, transparent: !!spec.transparent, opacity: spec.opacity ?? 1, depthWrite: spec.depthWrite ?? true, side: THREE.FrontSide, ior: spec.ior ?? 1.45});
  if (spec.map && mesh.geometry.attributes.uv) { mat.map = spec.map; mat.map.colorSpace = THREE.SRGBColorSpace; }
  if (spec.bump && mesh.geometry.attributes.uv) { mat.bumpMap = spec.bump; mat.bumpScale = spec.bumpScale; }
  if (spec.roughMap && mesh.geometry.attributes.uv) { mat.roughnessMap = spec.roughMap; mat.roughness = Math.min(1, (spec.roughness ?? .5) * 1.6); }
  if (spec.sheen) { mat.sheen = spec.sheen; mat.sheenColor.set(spec.sheenColor || '#ffffff'); mat.sheenRoughness = spec.sheenRoughness ?? .6; }
  if (spec.sss && mesh.geometry && mesh.userData?.uvWorld) { if (!mesh.geometry.attributes.color) skinTint(mesh.geometry, mesh.userData.uvWorld); mat.vertexColors = true; }
  if (spec.sss) {   // light wrap + warm bleed at the terminator: a cheap stand-in for subsurface scattering in skin
    const sss = spec.sss;
    mat.onBeforeCompile = shader => {
      shader.uniforms.uSkinWrap = {value: sss.wrap}; shader.uniforms.uSkinBleed = {value: new THREE.Vector3(...sss.bleed)};
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uSkinWrap; uniform vec3 uSkinBleed;')
        .replace('float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\t#ifdef USE_CLEARCOAT',
          'float dotNLraw = dot( geometryNormal, directLight.direction );\n\tfloat dotNL = saturate( ( dotNLraw + uSkinWrap ) / ( 1.0 + uSkinWrap ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\tirradiance += uSkinBleed * pow( 1.0 - saturate( abs( dotNLraw ) ), 3.0 ) * directLight.color;\n\t#ifdef USE_CLEARCOAT');
    };
    mat.customProgramCacheKey = () => `skin-sss-${sss.wrap}`;
  }
  if (spec.emissive) { mat.emissive.set(spec.emissive); mat.emissiveIntensity = spec.emissiveIntensity ?? .3; }
  mesh.material = mat; return mat;
}
export function studioEnvironment(renderer) {
  // A photographic studio: large soft key box above-left, cool rim panel behind-right, warm fill low-front, dark floor and walls.
  const room = new THREE.Scene(); room.background = new THREE.Color('#14171d');
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({color: new THREE.Color(.06, .065, .075), side: THREE.DoubleSide})); floor.rotation.x = -Math.PI / 2; floor.position.y = -1; room.add(floor);
  const box = (position, scale, intensity, tint = [1, 1, 1]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(...scale), new THREE.MeshBasicMaterial({color: new THREE.Color(intensity * tint[0], intensity * tint[1], intensity * tint[2])})); p.position.set(...position); p.lookAt(0, .9, 0); room.add(p); };
  box([-2.5, 4.2, 2.5], [3.2, 2.2, .1], 6.5, [1, .96, .9]);      // key softbox
  box([3.2, 2.6, -2.6], [1.2, 4, .1], 3.2, [.85, .93, 1]);       // cool rim
  box([2.6, .9, 3.4], [2.4, 1.2, .1], 1.6, [1, .9, .82]);        // warm fill
  box([0, 1.2, -5.5], [6, 2.5, .1], .9, [.9, .95, 1]);           // back panel
  box([-4.5, 1.5, -1], [.8, 3, .1], 1.2, [1, 1, 1]);             // side strip
  const pmrem = new THREE.PMREMGenerator(renderer), target = pmrem.fromScene(room, .04); pmrem.dispose(); room.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); }); return target.texture;
}
function studioEnvironmentOld(renderer) {
  const room = new THREE.Scene(); room.background = new THREE.Color('#1a1d24');
  const panel = (position, scale, intensity, tint = [1, 1, 1]) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(...scale), new THREE.MeshBasicMaterial({color: new THREE.Color(intensity * tint[0], intensity * tint[1], intensity * tint[2]), side: THREE.DoubleSide})); p.position.set(...position); p.lookAt(0, .9, 0); room.add(p); };
  panel([0, 5, 0], [8, 2], 4.5, [1, .97, .92]); panel([-5, 2, 1], [1.3, 7], 3, [.9, .95, 1]); panel([5, 3, -2], [2, 7], 3.5, [1, .93, .88]); panel([0, 2, -6], [7, 1.1], 1.8); panel([1, 1, 6], [4, 1], 1.4, [1, .98, .95]);
  const pmrem = new THREE.PMREMGenerator(renderer), target = pmrem.fromScene(room, .025); pmrem.dispose(); room.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); }); return target.texture;
}
