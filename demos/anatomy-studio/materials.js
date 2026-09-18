import * as THREE from 'three';

function texture(draw, size = 256) { const canvas = document.createElement('canvas'); canvas.width = canvas.height = size; draw(canvas.getContext('2d'), size); const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy = 4; return tex; }
let seed = 237; const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const grain = texture((c, s) => { const d = c.createImageData(s, s); for (let i = 0; i < d.data.length; i += 4) { const v = 110 + random() * 50; d.data.set([v, v, v, 255], i); } c.putImageData(d, 0, 0); });
const pores = texture((c, s) => { c.fillStyle = '#808080'; c.fillRect(0, 0, s, s); for (let i = 0; i < 900; i++) { const r = 1 + random() * 2.2; c.fillStyle = random() > .5 ? '#6a6a6a' : '#9a9a9a'; c.beginPath(); c.arc(random() * s, random() * s, r, 0, 7); c.fill(); } });
const striation = texture((c, s) => { c.fillStyle = '#808080'; c.fillRect(0, 0, s, s); for (let x = 0; x < s; x += 3) { const v = 96 + Math.round(random() * 64); c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(x, 0, 2, s); } for (let i = 0; i < 260; i++) { c.fillStyle = random() > .5 ? '#707070' : '#909090'; c.fillRect(random() * s, random() * s, 1.5, 6 + random() * 24); } });
const vesselRidge = texture((c, s) => { c.fillStyle = '#808080'; c.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 6) { c.fillStyle = `rgb(${112 + Math.round(random() * 40)},${112 + Math.round(random() * 40)},${112 + Math.round(random() * 40)})`; c.fillRect(0, y, s, 3); } });

/** Planar UVs along the piece's longest axis so muscle striations run with the fibres. */
export function projectedUV(mesh, repeat = 6) {
  const g = mesh.geometry; g.computeBoundingBox(); const box = g.boundingBox, size = box.getSize(new THREE.Vector3()), p = g.attributes.position, uv = new Float32Array(p.count * 2);
  const longest = size.x >= size.y && size.x >= size.z ? 0 : size.y >= size.z ? 1 : 2, other = longest === 0 ? (size.y >= size.z ? 1 : 2) : longest === 1 ? (size.x >= size.z ? 0 : 2) : (size.x >= size.y ? 0 : 1);
  const mins = box.min.toArray(), dims = size.toArray();
  for (let i = 0; i < p.count; i++) { const v = [p.getX(i), p.getY(i), p.getZ(i)]; uv[i * 2] = (v[other] - mins[other]) / Math.max(dims[other], 1e-4) * repeat * 0.5; uv[i * 2 + 1] = (v[longest] - mins[longest]) / Math.max(dims[longest], 1e-4) * repeat; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

export const fileColors = {skeletal: '#f0e6c8', joints: '#d8d1c0', visceral: '#f2a8b8', heart: '#ff6b7a', brain: '#f5c0c8', muscular: '#e07a7a', vessels: '#7f8fe6', nerves: '#f5e08a', lymphoid: '#9fd98a', regions: '#e6c9a8'};
export const fileLabels = {skeletal: 'Skeleton', joints: 'Ligaments & discs', visceral: 'Viscera', heart: 'Heart', brain: 'Brain & senses', muscular: 'Muscles', vessels: 'Arteries & veins', nerves: 'Nerves & cord', lymphoid: 'Lymphatics', regions: 'Surface regions'};

/** Realistic finish for one piece. Returns {color, roughness, clearcoat, opacity, bump, bumpScale, emissive, sheen...}. */
function realistic(p) {
  const n = p.name, path = p.path || '', L = n.toLowerCase();
  const wet = {roughness: .32, clearcoat: .65, clearcoatRoughness: .25};
  switch (p.file) {
    case 'skeletal':
      if (/tooth|incisor|canine|molar|premolar/.test(L)) return {color: '#f4f1e8', roughness: .28, clearcoat: .7, clearcoatRoughness: .15};
      if (/cartilage|cartilages/.test(L + path.toLowerCase())) return {color: '#dfe7e3', roughness: .38, clearcoat: .5, opacity: .92, transparent: true};
      return {color: '#e8e0cf', roughness: .58, clearcoat: .2, clearcoatRoughness: .5, bump: pores, bumpScale: .0006};
    case 'joints':
      if (/disc/.test(L)) return {color: '#d4d7da', roughness: .45, clearcoat: .3};
      return {color: '#e7dfd0', roughness: .7, bump: striation, bumpScale: .0003};
    case 'visceral':
      if (/lobe of (right|left) lung/.test(L)) return {color: '#e5a3ab', ...wet, bump: pores, bumpScale: .0009};
      if (/bronch|trachea/.test(L)) return {color: '#e2d5c1', roughness: .4, clearcoat: .4, bump: vesselRidge, bumpScale: .0006};
      if (L === 'pleura') return {color: '#e9d7d3', roughness: .2, clearcoat: .8, opacity: .32, transparent: true, depthWrite: false};
      if (/omentum|mesocolon|meso-appendix|taenia/.test(L)) return {color: '#e5cf9c', roughness: .35, clearcoat: .6, opacity: .82, transparent: true};
      if (/liver/.test(L)) return {color: '#7b2f2b', ...wet};
      if (/gallbladder|bile duct/.test(L)) return {color: '#5e8a58', ...wet};
      if (/stomach|duodenum|jejunum|ileum|oesophagus|pharynx/.test(L)) return {color: '#cc8f7f', ...wet};
      if (/colon|appendix|anal|rectum/.test(L)) return {color: '#b98079', ...wet};
      if (/kidney|renal|suprarenal/.test(L)) return {color: '#7d3038', ...wet};
      if (/ureter|urethra|bladder/.test(L)) return {color: '#d9b0a0', ...wet};
      if (/pancrea/.test(L)) return {color: '#e4c59b', roughness: .45, clearcoat: .4, bump: pores, bumpScale: .0012};
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
      return {color: '#a5333b', ...wet, bump: striation, bumpScale: .0005};
    case 'vessels': {
      const artery = /arter|aorta|trunk|circle/.test(L) || /Arterial system/.test(path);
      return {color: artery ? '#c8403f' : /portal/.test(L + path) ? '#6f4fa0' : '#4a5ba8', roughness: .4, clearcoat: .5, bump: vesselRidge, bumpScale: .0003};
    }
    case 'brain':
      if (/falx|tentorium|dura/.test(L)) return {color: '#e0d6c2', roughness: .3, clearcoat: .5, opacity: .38, transparent: true, depthWrite: false};
      if (/ventricle|choroid|aqueduct|central canal/.test(L)) return {color: '#8cc4e6', roughness: .2, clearcoat: .8, opacity: .62, transparent: true};
      if (/cornea/.test(L)) return {color: '#cfe8f5', roughness: .05, clearcoat: 1, opacity: .35, transparent: true, depthWrite: false};
      if (/lens/.test(L)) return {color: '#e8f2f4', roughness: .05, clearcoat: 1, opacity: .6, transparent: true};
      if (/vitreous|chamber|segment of eyeball|zonular/.test(L)) return {color: '#d3e7ee', roughness: .1, clearcoat: .8, opacity: .28, transparent: true, depthWrite: false};
      if (/sclera/.test(L)) return {color: '#f2eee6', roughness: .25, clearcoat: .8};
      if (/iris/.test(L)) return {color: '#5d7a4c', roughness: .35, clearcoat: .6, bump: striation, bumpScale: .0004};
      if (/retina/.test(L)) return {color: '#8b3b3b', roughness: .3, clearcoat: .6};
      if (/lacrimal|ear|cochlea|vestibule/.test(L)) return {color: '#e0c9b8', roughness: .45, clearcoat: .3};
      if (/white matter/.test(L)) return {color: '#efe7de', roughness: .35, clearcoat: .5};
      if (/cerebral sulci/.test(L)) return {color: '#c98d93', roughness: .4, clearcoat: .4};
      if (/Cerebellum/.test(path)) return {color: '#d9a1a6', roughness: .38, clearcoat: .55, bump: striation, bumpScale: .0006};
      if (/Brainstem/.test(path)) return {color: '#dcc1b3', roughness: .38, clearcoat: .55};
      if (/Diencephalon|striatum|Basal forebrain|Limbic/.test(path) || /thalamus|caudate|putamen|pallidus|amygdal|hippocamp|fornix/.test(L)) return {color: '#c99aa0', roughness: .38, clearcoat: .55};
      if (/corpus callosum|commissure|septum/.test(L)) return {color: '#ece2d8', roughness: .35, clearcoat: .5};
      return {color: '#e3b4b7', roughness: .36, clearcoat: .6, clearcoatRoughness: .3, bump: pores, bumpScale: .0007};
    case 'nerves': return {color: '#f0dc9a', roughness: .5, clearcoat: .25};
    case 'muscular':
      if (/fascia|bursa|sheath|retinacul|aponeurosis|iliotibial|septum|thoracolumbar/.test(L)) return {color: '#e6dccb', roughness: .5, clearcoat: .3, opacity: .78, transparent: true};
      if (/tendon/.test(L)) return {color: '#efe7d8', roughness: .4, clearcoat: .4};
      return {color: '#9b2f33', roughness: .42, clearcoat: .45, clearcoatRoughness: .35, bump: striation, bumpScale: .0011, striated: true};
    case 'lymphoid':
      if (/spleen/.test(L)) return {color: '#6e2a3a', ...wet};
      if (/thymus/.test(L)) return {color: '#d9a0a8', roughness: .4, clearcoat: .4};
      return {color: '#86b96f', roughness: .45, clearcoat: .3};
    case 'regions':
      if (/hair/.test(L)) return {color: '#3a2a20', roughness: .8};
      return {color: '#d8b28f', roughness: .55, clearcoat: .15, opacity: .30, transparent: true, depthWrite: false, bump: pores, bumpScale: .0004};
  }
  return {color: '#cfc6bb', roughness: .6};
}

export const modes = ['realistic', 'coded', 'xray', 'clay'];
export function finishMaterial(mesh, part, mode = 'realistic') {
  const r = realistic(part); const base = fileColors[part.file] || '#cccccc';
  let spec;
  if (mode === 'realistic') spec = r;
  else if (mode === 'coded') spec = {color: base, roughness: .5, clearcoat: .3, opacity: r.transparent ? Math.max(r.opacity, .4) : 1, transparent: !!r.transparent, depthWrite: r.depthWrite};
  else if (mode === 'xray') spec = {color: part.file === 'skeletal' ? '#eef3f7' : base, roughness: .25, clearcoat: .5, opacity: part.file === 'skeletal' ? .92 : .16, transparent: part.file !== 'skeletal', depthWrite: part.file === 'skeletal', emissive: base, emissiveIntensity: part.file === 'skeletal' ? 0 : .35};
  else spec = {color: '#cfc6bb', roughness: .85, clearcoat: 0, opacity: r.transparent ? .5 : 1, transparent: !!r.transparent, depthWrite: r.depthWrite};
  if (spec.striated && !mesh.geometry.attributes.uv) projectedUV(mesh, 8);
  const mat = new THREE.MeshPhysicalMaterial({color: spec.color, roughness: spec.roughness ?? .5, metalness: 0, clearcoat: spec.clearcoat ?? 0, clearcoatRoughness: spec.clearcoatRoughness ?? .3, envMapIntensity: .75, transparent: !!spec.transparent, opacity: spec.opacity ?? 1, depthWrite: spec.depthWrite ?? true, side: THREE.FrontSide});
  if (spec.bump && mesh.geometry.attributes.uv) { mat.bumpMap = spec.bump; mat.bumpScale = spec.bumpScale; }
  if (spec.emissive) { mat.emissive.set(spec.emissive); mat.emissiveIntensity = spec.emissiveIntensity ?? .3; }
  mesh.material = mat; return mat;
}
export function studioEnvironment(renderer) {
  const room = new THREE.Scene(); room.background = new THREE.Color('#1a1d24');
  const panel = (position, scale, intensity, tint = [1, 1, 1]) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(...scale), new THREE.MeshBasicMaterial({color: new THREE.Color(intensity * tint[0], intensity * tint[1], intensity * tint[2]), side: THREE.DoubleSide})); p.position.set(...position); p.lookAt(0, .9, 0); room.add(p); };
  panel([0, 5, 0], [8, 2], 4.5, [1, .97, .92]); panel([-5, 2, 1], [1.3, 7], 3, [.9, .95, 1]); panel([5, 3, -2], [2, 7], 3.5, [1, .93, .88]); panel([0, 2, -6], [7, 1.1], 1.8); panel([1, 1, 6], [4, 1], 1.4, [1, .98, .95]);
  const pmrem = new THREE.PMREMGenerator(renderer), target = pmrem.fromScene(room, .025); pmrem.dispose(); room.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); }); return target.texture;
}
