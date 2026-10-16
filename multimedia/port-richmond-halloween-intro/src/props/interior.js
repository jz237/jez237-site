// Interior lighting helpers: the world's night fill (HemisphereLight + scene.environment) would light the rooms as
// if they were outdoors. Interior materials get a constant ambient-occlusion map that scales ALL indirect light
// (hemisphere + IBL) by `ambient`, so the practical lights (lamp, TV, street spill) carry the rooms.
// Objects on LAMP_SHADOW_LAYER are the only ones rendered into the 3609 lamp's cube shadow map.
import * as THREE from 'three';

export const LAMP_SHADOW_LAYER = 9;

const aoTex = new Map();
function aoTexture(v) {
  const key = Math.round(v * 255);
  if (!aoTex.has(key)) {
    const d = new Uint8Array(16).fill(key);
    for (let i = 3; i < 16; i += 4) d[i] = 255;
    const t = new THREE.DataTexture(d, 2, 2, THREE.RGBAFormat);
    t.needsUpdate = true;
    t.name = 'interiorAO' + key;
    aoTex.set(key, t);
  }
  return aoTex.get(key);
}

// Replace materials under `root` with interior clones (cached per source material and ambient level).
export function interiorize(root, ambient = 0.2, { skip = () => false, shadowLayer = null } = {}) {
  const cache = new Map();
  const conv = (m) => {
    if (!m || !(m.isMeshStandardMaterial)) return m;          // ShaderMaterials / basic stay as they are
    if (m.userData.interior || m.userData.uniforms) return m;
    const k = m.uuid + ':' + ambient;
    if (!cache.has(k)) {
      const c = m.clone();
      if (m.onBeforeCompile && m.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile) { c.onBeforeCompile = m.onBeforeCompile; c.customProgramCacheKey = m.customProgramCacheKey; }
      c.aoMap = aoTexture(ambient);
      c.aoMapIntensity = 1;
      c.userData = { ...m.userData, interior: true };
      c.name = (m.name || 'mat') + '_int';
      cache.set(k, c);
    }
    return cache.get(k);
  };
  root.traverse((o) => {
    if (!o.isMesh || skip(o)) return;
    o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
    if (shadowLayer !== null && o.castShadow) o.layers.enable(shadowLayer);
  });
}
