import {
  BoxGeometry, type BufferGeometry, CapsuleGeometry, ConeGeometry, MeshStandardMaterial, SphereGeometry, TorusGeometry,
  type MeshStandardMaterialParameters,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { NeonSpotsTexture, NeonStripeTexture } from './textures';

/**
 * What many copies share, made once: the mushrooms' and segments' shapes and paints. A scene names
 * them in a prop — `geometry={geo.dome}` — so no copy frees them, and a hundred segments are a
 * hundred draws of three materials, not three hundred materials.
 */
function neon(color: string, emissive: string, intensity: number, extra: MeshStandardMaterialParameters = {}) {
  return new MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity, roughness: 0.28, metalness: 0.35, ...extra });
}

const dome = new SphereGeometry(0.46, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2);
dome.rotateX(Math.PI / 2); // the cap bulges out of the field, toward the camera
dome.scale(1, 1, 0.82);

const shell = new SphereGeometry(0.46, 28, 18);
shell.rotateZ(Math.PI / 2); // poles front and back: the stripes run across the body
shell.scale(1, 0.92, 0.78);

const mandible = new ConeGeometry(0.06, 0.3, 8);
mandible.rotateZ(-Math.PI / 2); // pointing forward, +x

const antenna = new CapsuleGeometry(0.028, 0.55, 3, 6);
antenna.rotateZ(-Math.PI / 2);
antenna.translate(0.3, 0, 0); // from its root forward

/** A queen's crown: a gold band with five points, standing up off her head. */
function crownShape() {
  const parts: BufferGeometry[] = [new TorusGeometry(0.36, 0.065, 8, 30)];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const spike = new ConeGeometry(0.1, 0.34, 8);
    spike.rotateX(Math.PI / 2); // pointing up, out of the field
    spike.translate(Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0.17);
    parts.push(spike);
  }
  return mergeGeometries(parts.map((g) => g.toNonIndexed()))!;
}

export const geo = {
  dome,
  rim: new TorusGeometry(0.43, 0.055, 8, 36),
  crown: crownShape(),
  shell,
  legs: new BoxGeometry(0.12, 1.3, 0.1),
  eye: new SphereGeometry(0.12, 14, 10),
  antenna,
  mandible,
  bolt: new CapsuleGeometry(0.075, 0.55, 4, 8),
  dot: new SphereGeometry(0.16, 14, 10),
};

const stripes = new NeonStripeTexture();
const spots = new NeonSpotsTexture();

export type SegKind = 'normal' | 'queen' | 'child' | 'armored';

export const mat = {
  dome: neon('#5a3006', '#ffa21c', 0.72, { emissiveMap: spots, roughness: 0.22 }),
  rim: neon('#ffd23f', '#ffd23f', 1.45),
  poisonDome: neon('#2b0748', '#c04bff', 0.95, { emissiveMap: spots, roughness: 0.22 }),
  poisonRim: neon('#6bff5a', '#6bff5a', 1.7),
  /** By kind: the body's shell, and the head's, brighter. */
  body: {
    normal: neon('#1d4a0a', '#6dff3a', 1.65, { emissiveMap: stripes }),
    queen: neon('#4a0b45', '#ff3dd8', 1.7, { emissiveMap: stripes }),
    child: neon('#0b4b5c', '#2ff5d2', 1.6, { emissiveMap: stripes }),
    armored: neon('#22344c', '#9fdcff', 1.5, { emissiveMap: stripes, metalness: 0.85, roughness: 0.18 }),
  } satisfies Record<SegKind, MeshStandardMaterial>,
  head: {
    normal: neon('#5a0b4a', '#ff3dd8', 1.55, { emissiveMap: stripes }),
    queen: neon('#6a4b06', '#ffd23f', 1.6, { emissiveMap: stripes }),
    child: neon('#0e6a7e', '#9ffcff', 2.2, { emissiveMap: stripes }),
    armored: neon('#6a4b06', '#ffd23f', 1.6, { emissiveMap: stripes }),
  } satisfies Record<SegKind, MeshStandardMaterial>,
  legs: neon('#10182a', '#3a6bff', 1.1, { metalness: 0.8 }),
  eye: neon('#ffffff', '#fff2a8', 1.5),
  antenna: neon('#ffe0f8', '#ff9fe8', 1.6),
  mandible: neon('#ffe0f0', '#ff7aa8', 2.2),
  bolt: neon('#ff5a7d', '#ff5a7d', 3.6),
  heavyBolt: neon('#ffe0ea', '#ff7d9b', 4.6),
  droneBolt: neon('#ffd23f', '#ffd23f', 3.6),
  crown: neon('#ffd877', '#ffb000', 0.55, { metalness: 0.95, roughness: 0.18 }),
  spore: neon('#ff3dd8', '#ff3dd8', 5),
};
