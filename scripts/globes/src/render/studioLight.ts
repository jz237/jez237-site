// The betta bowl's studio's light (studio.ts studioLight: by day, by night, or on the way between) as
// the uniforms its WGSL takes at each entry point and hands to studio_light: the backdrop's and the
// table's (StudioBackdrop.ts) and the bowl's passes' (GlobeView.ts) alike, so the glass and the water
// show the room the bowl stands in, lit as it is. No pipeline knows day from night: only these change.

import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';
import { studioLight } from './studio';

const matrices = [0, 1, 2, 3].map(() => uniform(new THREE.Matrix4()));

/** For a pass's inputs (studio.ts STUDIO_LIGHT_PARAMS). */
export const studioLightInputs = { studioLight0: matrices[0], studioLight1: matrices[1], studioLight2: matrices[2], studioLight3: matrices[3] };

const values = new Float32Array(64);

/** The studio lit `night` of the way from day to night (0..1). */
export function lightStudio(night: number): void {
  studioLight(night, values);
  matrices.forEach((m, k) => m.value.fromArray(values, 16 * k));
}

lightStudio(0);
