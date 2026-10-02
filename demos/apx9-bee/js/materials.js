// APX-9 material library. One shared instance of each material so merged parts batch cleanly.
// Metals depend on the studio environment (stage.js); never fake reflections with colour alone.
import * as THREE from 'three';
import * as T from './textures.js';

const C = (h) => new THREE.Color(h);
const phys = (o) => new THREE.MeshPhysicalMaterial(o);
const std = (o) => new THREE.MeshStandardMaterial(o);

const carbonMap = T.carbonTwill({ cells: 16 });
const brushRough = T.brushed({ lo: 0.2, hi: 0.52 });
const brushRoughV = T.brushed({ lo: 0.2, hi: 0.52, vertical: true, seed: 9 });
const peelRough = T.peel({ lo: 0.8, hi: 1.0 });
const peelNorm = T.peelNormal({ strength: 0.55 });
const knurlNorm = T.knurlNormal({ pitch: 12, strength: 2.2 });
const hazardMap = T.hazard({ stripes: 4 });
const pcbMap = T.circuit({ seed: 11 });
const pcbGlow = T.circuit({ seed: 11, glow: true });

export const YELLOW = '#f4b100';

export const M = {
  // ---- painted shells (the signature APX-9 colours)
  yellow: phys({ name: 'yellow paint', color: C(YELLOW), roughness: 0.34, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.07, roughnessMap: peelRough, normalMap: peelNorm, normalScale: new THREE.Vector2(0.18, 0.18), sheen: 0.1, sheenColor: C('#ffd25a'), sheenRoughness: 0.5 }),
  yellowMatte: phys({ name: 'yellow satin', color: C('#e9a90b'), roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
  yellowDeep: phys({ name: 'amber paint', color: C('#d98e08'), roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.1 }),
  black: phys({ name: 'black gloss', color: C('#0b0b0d'), roughness: 0.26, metalness: 0.0, clearcoat: 0.9, clearcoatRoughness: 0.08, roughnessMap: peelRough }),
  blackMatte: phys({ name: 'black matte', color: C('#121214'), roughness: 0.62, clearcoat: 0.1 }),
  rubber: std({ name: 'rubber', color: C('#161618'), roughness: 0.88, metalness: 0 }),
  carbon: phys({ name: 'carbon twill', color: C('#ffffff'), map: carbonMap, bumpMap: carbonMap, bumpScale: 0.6, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.06, metalness: 0.15 }),

  // ---- metals
  chrome: std({ name: 'chrome', color: C('#eef1f4'), metalness: 1, roughness: 0.14 }),
  steel: std({ name: 'polished steel', color: C('#cfd3d9'), metalness: 1, roughness: 0.2 }),
  brushed: phys({ name: 'brushed steel', color: C('#c4c8ce'), metalness: 1, roughness: 1, roughnessMap: brushRough, anisotropy: 0.7, anisotropyRotation: 0 }),
  brushedV: phys({ name: 'brushed steel (v)', color: C('#c4c8ce'), metalness: 1, roughness: 1, roughnessMap: brushRoughV, anisotropy: 0.7, anisotropyRotation: Math.PI / 2 }),
  gunmetal: phys({ name: 'gunmetal', color: C('#3b3f47'), metalness: 0.95, roughness: 0.3, clearcoat: 0.2 }),
  gunmetalDark: phys({ name: 'dark gunmetal', color: C('#23262c'), metalness: 0.9, roughness: 0.34, clearcoat: 0.3 }),
  titanium: phys({ name: 'titanium', color: C('#a49f98'), metalness: 1, roughness: 0.3, roughnessMap: brushRough, anisotropy: 0.5 }),
  anodizedBlue: phys({ name: 'anodised titanium', color: C('#4a5a7c'), metalness: 1, roughness: 0.28, clearcoat: 0.3 }),
  gold: phys({ name: 'gold', color: C('#e2b13c'), metalness: 1, roughness: 0.2 }),
  brass: phys({ name: 'brass', color: C('#c79a45'), metalness: 1, roughness: 0.26 }),
  copper: phys({ name: 'copper', color: C('#c8743f'), metalness: 1, roughness: 0.25 }),
  knurled: phys({ name: 'knurled steel', color: C('#b9bdc4'), metalness: 1, roughness: 0.35, normalMap: knurlNorm, normalScale: new THREE.Vector2(0.9, 0.9) }),

  // ---- optics and glass
  eye: phys({ name: 'compound eye lens', color: C('#04050a'), metalness: 0.82, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.035, iridescence: 0.16, iridescenceIOR: 1.4, iridescenceThicknessRange: [140, 260] }),
  lens: phys({ name: 'sensor lens', color: C('#06090f'), metalness: 0.4, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 0.8, iridescenceIOR: 1.7, iridescenceThicknessRange: [200, 520] }),
  glass: phys({ name: 'glass', color: C('#e8f4ff'), metalness: 0, roughness: 0.02, transparent: true, opacity: 0.22, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false, side: THREE.DoubleSide }),
  glassBlue: phys({ name: 'blue glass', color: C('#7db8ff'), metalness: 0, roughness: 0.04, transparent: true, opacity: 0.32, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false, side: THREE.DoubleSide }),
  membrane: phys({ name: 'wing membrane', color: C('#f4fbff'), metalness: 0, roughness: 0.06, transparent: true, opacity: 0.2, clearcoat: 1, clearcoatRoughness: 0.03, iridescence: 1, iridescenceIOR: 1.45, iridescenceThicknessRange: [160, 520], side: THREE.DoubleSide, depthWrite: false }),

  // ---- electronics and light
  pcb: phys({ name: 'circuit board', color: C('#ffffff'), map: pcbMap, roughness: 0.4, metalness: 0.5, clearcoat: 0.6 }),
  pcbGlow: std({ name: 'glowing circuit', color: C('#0c1014'), map: pcbMap, emissive: C('#59e1ff'), emissiveMap: pcbGlow, emissiveIntensity: 2.2, roughness: 0.4, metalness: 0.4 }),
  hazard: phys({ name: 'hazard stripes', color: C('#ffffff'), map: hazardMap, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.1 }),
  glowCyan: std({ name: 'cyan LED', color: C('#06232b'), emissive: C('#46dcff'), emissiveIntensity: 3.2, roughness: 0.4 }),
  glowBlue: std({ name: 'blue LED', color: C('#06122b'), emissive: C('#2f7bff'), emissiveIntensity: 3.0, roughness: 0.4 }),
  glowAmber: std({ name: 'amber LED', color: C('#2b1a05'), emissive: C('#ffb020'), emissiveIntensity: 3.0, roughness: 0.4 }),
  glowGreen: std({ name: 'green LED', color: C('#06260f'), emissive: C('#5dff8f'), emissiveIntensity: 2.8, roughness: 0.4 }),
  glowRed: std({ name: 'red LED', color: C('#2b0806'), emissive: C('#ff4332'), emissiveIntensity: 3.0, roughness: 0.4 }),
  glowWhite: std({ name: 'white LED', color: C('#202020'), emissive: C('#ffffff'), emissiveIntensity: 3.0, roughness: 0.4 }),
  coreBlue: phys({ name: 'power cell glass', color: C('#1e66ff'), emissive: C('#0a52ff'), emissiveIntensity: 1.7, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 0.88 }),
  coreInner: std({ name: 'power cell plasma', color: C('#9fd4ff'), emissive: C('#6cc0ff'), emissiveIntensity: 4.0, roughness: 0.3 }),

  // ---- fur
  fur: phys({ name: 'fur', color: C('#ffffff'), vertexColors: true, roughness: 0.92, metalness: 0, sheen: 1, sheenColor: C('#fff1c4'), sheenRoughness: 0.42, side: THREE.DoubleSide }),
  furBase: std({ name: 'fur under-layer', color: C('#ffffff'), vertexColors: true, roughness: 1, metalness: 0 }),

  // ---- utility
  ghost: new THREE.MeshBasicMaterial({ name: 'ghost', color: C('#8a93a0'), transparent: true, opacity: 0.1, depthWrite: false }),
};

/** Textured decal material (transparent, floats just above the surface it is laid on). */
export function decal(map, { color = '#ffffff', emissive = null, emissiveIntensity = 1, roughness = 0.4 } = {}) {
  const m = new THREE.MeshStandardMaterial({ map, color: C(color), transparent: true, alphaTest: 0.02, roughness, metalness: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  if (emissive) { m.emissive = C(emissive); m.emissiveMap = map; m.emissiveIntensity = emissiveIntensity; }
  return m;
}

const paintCache = new Map();
/** Custom clearcoat paint colour. */
export function paint(hex, { rough = 0.34, coat = 1 } = {}) {
  const k = `${hex}|${rough}|${coat}`;
  if (!paintCache.has(k)) paintCache.set(k, phys({ color: C(hex), roughness: rough, clearcoat: coat, clearcoatRoughness: 0.08, roughnessMap: peelRough }));
  return paintCache.get(k);
}
const metalCache = new Map();
export function metal(hex, rough = 0.25, extra = {}) {
  const k = `${hex}|${rough}|${JSON.stringify(extra)}`;
  if (!metalCache.has(k)) metalCache.set(k, phys({ color: C(hex), metalness: 1, roughness: rough, ...extra }));
  return metalCache.get(k);
}
export function emissive(hex, intensity = 3) {
  return std({ color: C('#101010'), emissive: C(hex), emissiveIntensity: intensity, roughness: 0.4 });
}

export const TEX = { carbonMap, brushRough, peelRough, hazardMap, pcbMap, pcbGlow };
