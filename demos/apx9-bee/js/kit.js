// Everything an assembly module needs, in one import.
//   import { THREE, V3, K, M, revolve, plate, armorPanel, sweep, M4, ... } from '../kit.js';
import * as THREE from 'three';
export { THREE };
export * from './geo.js';
export * from './materials.js';
export * from './skeleton.js';
export { M4, Part, Bee, smoother } from './registry.js';
export { makeFur, ellipsoidSampler } from './fur.js';
export { LEVEL, ex } from './explode.js';
export { Q } from './quality.js';
import * as T from './textures.js';
export { T };
