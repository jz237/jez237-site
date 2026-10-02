// Idle progressive refinement. Once the view has been still for a moment the page keeps re-rendering the same frame with a
// sub-pixel camera shift, a key light moved across a small disc (area-light soft shadows) and a rotated AO noise phase, and
// averages the results in HDR. Interaction snaps straight back to the single un-jittered frame.
import * as THREE from 'three';

const LIGHT_DISC = 0.1;          // key-light disc radius as a fraction of the light distance (about +/-5.7 degrees)
const GOLDEN = 2.399963229728653;
const AO_NOISE_PERIOD = 5;       // GTAOPass magic-square noise tile size

function halton(i, b) {
  let f = 1, r = 0;
  while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); }
  return r;
}

export function createAccum({ stage, post, Q }) {
  const { renderer, camera, key } = stage;
  const pass = post.passes.accum;
  const aoShift = post.ao.gtaoMaterial.uniforms.uNoiseShift?.value;
  const max = post.accumSupported ? Math.max(0, Math.floor(Q.accum || 0)) : 0;
  const size = new THREE.Vector2();
  const base = new THREE.Vector3(), ux = new THREE.Vector3(), uy = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  let n = 0;          // refinement frames rendered since the last reset (0 = only the plain frame exists)
  let shadowStale = false;
  let began = false;

  const api = {
    max,
    get n() { return n; },
    get pending() { return max > 1 && n < max; },
    get converged() { return max > 1 && n >= max; },

    /** Back to a plain frame. Returns true when the shadow map still holds a jittered render and must be redrawn. */
    reset() {
      n = 0;
      const stale = shadowStale;
      shadowStale = false;
      if (aoShift) aoShift.set(0, 0);
      return stale;
    },

    /** Move camera / light / AO phase to the next sample; returns the blend weight of that frame. */
    begin() {
      const i = n;
      began = true;
      if (i > 0) {
        renderer.getDrawingBufferSize(size);
        camera.setViewOffset(size.x, size.y, halton(i, 2) - 0.5, halton(i, 3) - 0.5, size.x, size.y);
        base.copy(key.position);
        const dist = base.distanceTo(key.target.position);
        ux.crossVectors(stage.keyDir, up).normalize();
        uy.crossVectors(ux, stage.keyDir).normalize();
        const rad = Math.sqrt(i / max) * LIGHT_DISC * dist, ang = i * GOLDEN;
        key.position.addScaledVector(ux, Math.cos(ang) * rad).addScaledVector(uy, Math.sin(ang) * rad);
        if (aoShift) aoShift.set(i % AO_NOISE_PERIOD, Math.floor(i / AO_NOISE_PERIOD) % AO_NOISE_PERIOD);
        shadowStale = true;
      }
      renderer.shadowMap.needsUpdate = true;
      return 1 / (i + 1);
    },

    /** Undo the jitter applied by begin(). */
    end() {
      if (!began) return;
      began = false;
      if (n > 0) {
        camera.clearViewOffset();
        camera.updateProjectionMatrix();
        key.position.copy(base);
      }
      n++;
    },
  };
  return api;
}
