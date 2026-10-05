import * as THREE from 'three';
import { brushedMetalTexture, perlageTexture, noiseTexture, petalTextures } from './textures.js';

// The clockmaker's material palette. Every creature and plant draws from this
// shared library so the world reads as the work of one maker.
//
// Palette: midnight teal environment, aged gold and brass, ivory porcelain,
// small amber lights, and jewel enamels reserved for selected creatures.

export const PALETTE = {
  teal: new THREE.Color('#0d2a2e'),
  tealDeep: new THREE.Color('#06161a'),
  gold: new THREE.Color('#d6ad5e'),
  amber: new THREE.Color('#ffae42'),
  amberHot: new THREE.Color('#ffc46b'),
  ivory: new THREE.Color('#f1e8d6'),
};

export function createMaterials(quality) {
  const brushed = brushedMetalTexture(11, quality.texSize);
  const brushedFine = brushed.clone();
  brushedFine.repeat.set(4, 4);
  brushedFine.needsUpdate = true;
  const perlage = perlageTexture(3, quality.texSize * 2);
  const grime = noiseTexture(41, quality.texSize, { cells: 3, octaves: 5, lo: 0.55, hi: 1.25 });

  const hi = quality.tier !== 'low';

  const metal = (color, roughness, extra = {}) =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 1,
      roughness,
      roughnessMap: brushed,
      ...extra,
    });

  const enamel = (color, extra = {}) =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.15,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ...extra,
    });

  const lib = {
    // Metals ------------------------------------------------------------
    brass: metal('#c9a35a', 0.6),
    brassAged: metal('#9a7637', 0.85, { roughnessMap: grime }),
    brassPlate: metal('#c6a05a', 0.7, { roughnessMap: perlage }),
    gold: metal('#e8c27a', 0.42),
    copper: metal('#c46a3f', 0.6),
    copperAged: metal('#8f4a2c', 0.85, { roughnessMap: grime }),
    rosegold: metal('#d99a7a', 0.5),
    steelBlued: metal('#2c4a9a', 0.45, { roughnessMap: brushedFine }),
    steel: metal('#b9bcc2', 0.5),
    iron: new THREE.MeshStandardMaterial({ color: '#1d2622', metalness: 0.75, roughness: 0.48 }),
    ironDark: new THREE.MeshStandardMaterial({ color: '#121815', metalness: 0.7, roughness: 0.55 }),
    verdigris: new THREE.MeshStandardMaterial({ color: '#4d8a78', metalness: 0.25, roughness: 0.7, roughnessMap: grime }),

    // Ceramics & enamel ---------------------------------------------------
    porcelain: new THREE.MeshPhysicalMaterial({
      color: '#f0e6d2',
      metalness: 0,
      roughness: 0.42,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      sheen: 0.35,
      sheenColor: new THREE.Color('#fff2dc'),
      sheenRoughness: 0.5,
      side: THREE.DoubleSide,
    }),
    enamelRed: enamel('#a8121a'),
    enamelEmerald: enamel('#0c6e4a', { metalness: 0.5, roughness: 0.25, iridescence: hi ? 0.6 : 0, iridescenceIOR: 1.6 }),
    enamelSapphire: enamel('#1b3c98', { metalness: 0.5, roughness: 0.25 }),
    enamelOrange: enamel('#e2731d'),
    enamelBlack: enamel('#0e0d0f', { roughness: 0.2 }),
    enamelBlueBlack: enamel('#0b1020', { metalness: 0.6, roughness: 0.22, iridescence: hi ? 1 : 0, iridescenceIOR: 1.8, iridescenceThicknessRange: [200, 700] }),
    eye: new THREE.MeshPhysicalMaterial({ color: '#070708', metalness: 0.2, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.02, flatShading: true }),

    // Glass & jewels --------------------------------------------------------
    glass: hi
      ? new THREE.MeshPhysicalMaterial({ color: '#e9f2ee', metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.6, ior: 1.5, transparent: false, side: THREE.DoubleSide, specularIntensity: 1, envMapIntensity: 1.2 })
      : new THREE.MeshPhysicalMaterial({ color: '#cfe3dc', metalness: 0, roughness: 0.05, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }),
    ruby: new THREE.MeshPhysicalMaterial({ color: '#b0101e', metalness: 0, roughness: 0.06, clearcoat: 1, emissive: '#3a0306', emissiveIntensity: 0.6 }),
    amberGlass: new THREE.MeshPhysicalMaterial({
      color: '#ffb54a',
      emissive: '#ff9a2e',
      emissiveIntensity: 0.0,
      metalness: 0,
      roughness: 0.08,
      clearcoat: 1,
      transparent: true,
      opacity: 0.88,
    }),

    // Greenhouse & ground -----------------------------------------------------
    paneGlass: new THREE.MeshPhysicalMaterial({
      color: '#8a968c',
      metalness: 0,
      roughness: 0.3,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      side: THREE.DoubleSide,
      envMapIntensity: 1.4,
    }),
  };

  // painted porcelain (blush, glaze and gilded filigree) for supporting blooms
  const pt = petalTextures({ size: 512, seed: 23, blush: [238, 206, 178] });
  lib.porcelainPainted = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', map: pt.map, roughness: 1, metalness: 1, roughnessMap: pt.orm, metalnessMap: pt.orm,
    clearcoat: 1, clearcoatRoughness: 0.16, sheen: 0.25, sheenColor: new THREE.Color('#fff0dc'), side: THREE.DoubleSide,
  });
  lib.textures = { brushed, perlage, grime };
  return lib;
}

// Inject a travelling energy pulse into a material's emissive term.
// The geometry must provide uv.x running 0→1 along its length (TubeGeometry does).
export function addPulse(material, uniforms, { color = '#ffa640', width = 0.03, trail = 0.18, base = 0.0 } = {}) {
  const u = {
    uPulse: uniforms.uPulse ?? { value: -1 },
    uPulseGain: uniforms.uPulseGain ?? { value: 1 },
    uCharge: uniforms.uCharge ?? { value: 0 },
    uPulseColor: { value: new THREE.Color(color) },
    uPulseWidth: { value: width },
    uPulseTrail: { value: trail },
    uPulseBase: { value: base },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vPulseUv;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvPulseUv = uv;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec2 vPulseUv;
         uniform float uPulse, uPulseGain, uCharge, uPulseWidth, uPulseTrail, uPulseBase;
         uniform vec3 uPulseColor;`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
         {
           float d = vPulseUv.x - uPulse;
           float head = exp(-d * d / (uPulseWidth * uPulseWidth));
           float tail = d < 0.0 ? exp(d / uPulseTrail) * 0.35 : 0.0;
           float charged = uCharge * step(vPulseUv.x, uPulse + 0.001) * (0.5 + 0.5 * sin(vPulseUv.x * 140.0 - uPulse * 30.0));
           float seam = pow(abs(sin(vPulseUv.y * 3.14159 * 4.0)), 24.0);
           float core = head * (0.35 + 1.65 * seam) * 2.2 + head * head * 1.2;
           totalEmissiveRadiance += uPulseColor * uPulseGain * (core + (tail * 0.7 + charged * 0.22 + uPulseBase) * seam);
         }`
      );
  };
  material.customProgramCacheKey = () => 'pulse-' + color;
  return u;
}
