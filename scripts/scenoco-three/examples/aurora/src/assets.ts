import {
  BoxGeometry, type BufferGeometry, CapsuleGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry, MeshStandardMaterial, SphereGeometry,
  type MeshStandardMaterialParameters,
} from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { WindowsTexture } from './textures';

/**
 * What many copies share, made once: warheads, interceptors, towers, rubble. A scene names them in a
 * prop — `geometry={geo.warhead}` — so no copy frees them, and a sky full of missiles is many draws of
 * a handful of materials.
 */
function neon(color: string, emissive: string, intensity: number, extra: MeshStandardMaterialParameters = {}) {
  return new MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity, roughness: 0.3, metalness: 0.4, ...extra });
}

const warhead = new ConeGeometry(0.11, 0.42, 10);
warhead.rotateZ(Math.PI); // nose down: a warhead falls nose first
const interceptor = new CapsuleGeometry(0.06, 0.32, 4, 8);

/** A lumpy rock: a sphere-ish solid with each corner pushed in or out, the same way wherever it is shared. */
function rock() {
  let g: BufferGeometry = new DodecahedronGeometry(0.5, 1);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const p = g.attributes.position!;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453) % 1;
    const k = 0.78 + h * 0.38;
    p.setXYZ(i, x * k, y * k * 0.88, z * k);
  }
  g.computeVertexNormals();
  return g;
}

export const geo = {
  warhead,
  glow: new SphereGeometry(0.16, 14, 10),
  interceptor,
  blast: new SphereGeometry(1, 40, 24),
  rubble: new DodecahedronGeometry(0.16, 0),
  meteor: rock(),
  silo: new CylinderGeometry(0.62, 0.8, 0.5, 24),
  dome: new SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
  barrel: new CylinderGeometry(0.07, 0.1, 0.8, 12),
  box: new BoxGeometry(1, 1, 1),
};

/** Three window drawings, so neighbouring towers are lit differently. */
export const windows = [new WindowsTexture(1), new WindowsTexture(2), new WindowsTexture(3)];

export const mat = {
  warhead: neon('#3a1608', '#ff6a3a', 4.2),
  warheadGlow: neon('#ffd0a0', '#ff8a4a', 6),
  mirv: neon('#3a2a08', '#ffb347', 3.4),
  smart: neon('#33083a', '#ff4fd8', 3.6),
  nuke: neon('#5a4a10', '#ffd23f', 1.8, { metalness: 0.7, roughness: 0.25 }),
  stealth: neon('#0a2a1a', '#3bff9a', 2.4, { transparent: true, opacity: 0.85 }),
  interceptor: neon('#bff6ff', '#7fe8ff', 5),
  interceptorGlow: neon('#ffffff', '#c8f4ff', 7),
  rubble: neon('#2a2018', '#ff6a2a', 0.5, { roughness: 0.9, metalness: 0.1 }),
  tower: new MeshStandardMaterial({ color: '#141a2a', emissive: '#ffffff', emissiveIntensity: 1.25, roughness: 0.5, metalness: 0.5 }),
  roof: neon('#1b2540', '#2f6bff', 0.8, { metalness: 0.7 }),
  backTower: neon('#05070d', '#1a2a50', 0.35, { metalness: 0.6, roughness: 0.6 }),
  silo: neon('#1b2540', '#38e1ff', 0.6, { metalness: 0.8, roughness: 0.25 }),
  dome: neon('#173a7a', '#3b8bff', 1.1, { metalness: 0.6, roughness: 0.15 }),
  barrel: neon('#ffe0ea', '#7fe8ff', 2.4),
  siloDead: neon('#1a1414', '#ff3b4b', 0.4, { roughness: 0.8 }),
  meteor: neon('#2a1d16', '#ff5a1a', 0.45, { roughness: 0.95, metalness: 0.05, flatShading: true }),
};

export type WarheadKind = 'normal' | 'mirv' | 'smart' | 'nuke' | 'bomb';
