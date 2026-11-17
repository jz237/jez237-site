/**
 * Rendering extras that sit beside the per-piece materials:
 *   - a selection outline (an "inverted hull": the piece's back faces, pushed out along the normals);
 *   - a depth pre-pass for see-through skin, so only the nearest layer of skin is blended;
 *   - cavity shading for bone (grooves darker, ridges paler) from the mesh's own curvature;
 *   - a soft reflection of the body in the platform.
 *
 * Helper meshes are children of the piece they belong to and share its geometry, so they follow it when the body
 * is exploded. They carry userData.follow so the studio can hand them the detail-tier geometry when it swaps in.
 */
import * as THREE from 'three';
import { Reflector } from './vendor/objects/Reflector.js';
import { breathe } from './materials.js?v=984d071ad9';

const noRaycast = () => {};

function helper(mesh, material, renderOrder = 0) {
  const child = new THREE.Mesh(mesh.geometry, material);
  child.userData.follow = true;
  child.renderOrder = renderOrder;
  child.castShadow = false;
  child.receiveShadow = false;
  child.raycast = noRaycast;
  mesh.add(child);
  return child;
}

// ---------------------------------------------------------------- selection outline
// Two helpers on the selected piece, drawn after everything opaque:
//   1. a mask: the piece again, both sides, no colour and no depth test, marking its whole silhouette in the stencil;
//   2. the hull: the piece's back faces pushed out along the normals, drawn only where the mask is not set.
// The mask matters for hollow pieces (a heart chamber, a vertebra's canal): without it the far wall of the hull
// shows through every opening and floods the inside with the outline colour.
const OUTLINE_ORDER = 2e6;   // after the capped pieces of a cross-section
const mirrorHidden = new Set();   // helpers the platform mirror must not draw (its render target has no stencil)
export function createOutline(color = '#5fe0bb') {
  const thickness = { value: 0.001 };
  const mask = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, depthTest: false, side: THREE.DoubleSide, stencilWrite: true, stencilRef: 1, stencilFunc: THREE.AlwaysStencilFunc, stencilZPass: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp });
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, fog: false, stencilWrite: true, stencilRef: 1, stencilFunc: THREE.NotEqualStencilFunc, stencilFail: THREE.KeepStencilOp, stencilZFail: THREE.KeepStencilOp, stencilZPass: THREE.KeepStencilOp });
  material.onBeforeCompile = shader => {
    shader.uniforms.uOutline = thickness;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uOutline;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n\ttransformed += normalize( normal ) * uOutline;');
  };
  material.customProgramCacheKey = () => 'selection-outline';
  let helpers = [], host = null;
  return {
    material,
    /** Put the outline on a mesh (or take it off with null). */
    attach(mesh) {
      if (mesh === host) return;
      for (const h of helpers) { h.parent?.remove(h); mirrorHidden.delete(h); }
      helpers = []; host = mesh;
      if (!mesh) return;
      const hull = helper(mesh, material, OUTLINE_ORDER + 1);
      hull.onAfterRender = renderer => renderer.clearStencil();
      helpers = [helper(mesh, mask, OUTLINE_ORDER), hull];
      for (const h of helpers) mirrorHidden.add(h);
    },
    /** Keep the line about two pixels wide whatever the zoom, and clip it with the section plane. */
    update(camera, viewportHeight, planes) {
      if (!host) return;
      const world = host.getWorldPosition(new THREE.Vector3());
      const distance = camera.isOrthographicCamera ? 1 : world.distanceTo(camera.position);
      const perPixel = camera.isOrthographicCamera ? (camera.top - camera.bottom) / camera.zoom / viewportHeight : 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / viewportHeight;
      thickness.value = perPixel * 2.2 / (host.scale.x || 1);   // the hull is displaced in the mesh's own units
      for (const m of [material, mask]) if ((m.clippingPlanes || null) !== (planes || null)) { m.clippingPlanes = planes || null; m.needsUpdate = true; }
    }
  };
}

// ---------------------------------------------------------------- see-through skin
// Drawn after everything inside the body and just before the skin itself: it writes the skin's depth without colour,
// so the colour pass that follows only blends the layer nearest the camera. Without it an arm can show through the
// chest in the wrong order, because blended surfaces are sorted per piece, not per pixel.
const SKIN_DEPTH_ORDER = 10, SKIN_COLOUR_ORDER = 11;
export const skinDepthMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true });
breathe(skinDepthMaterial);   // the depth it writes has to match the breathing skin drawn after it

export function syncSkinDepth(part) {
  const mat = part.mesh.material;
  const want = part.file === 'regions' && mat.transparent && !mat.depthWrite && mat.blending === THREE.NormalBlending && mat.opacity < 0.9;
  let child = part.mesh.userData.skinDepth;
  if (want && !child) child = part.mesh.userData.skinDepth = helper(part.mesh, skinDepthMaterial, SKIN_DEPTH_ORDER);
  if (child) child.visible = want;
  if (want) part.mesh.renderOrder = SKIN_COLOUR_ORDER; else if (part.mesh.renderOrder === SKIN_COLOUR_ORDER) part.mesh.renderOrder = 0;
}

// ---------------------------------------------------------------- bone cavity shading
/**
 * Vertex colours from curvature: along each edge, the normals of a convex surface spread apart and those of a
 * concave one lean together. Averaged per vertex and scaled to metres, that gives a signed curvature which
 * darkens and warms grooves, foramina and sutures and lifts ridges slightly. `scale` is the mesh's local-to-world
 * scale (positions are quantised).
 */
export function cavityTint(geometry, scale = 1) {
  const pos = geometry.attributes.position, nor = geometry.attributes.normal, index = geometry.index;
  if (!pos || !nor || !index) return false;
  const n = pos.count, sum = new Float32Array(n), count = new Uint16Array(n), ix = index.array;
  const px = new Float32Array(n), py = new Float32Array(n), pz = new Float32Array(n), nx = new Float32Array(n), ny = new Float32Array(n), nz = new Float32Array(n);
  for (let i = 0; i < n; i++) { px[i] = pos.getX(i); py[i] = pos.getY(i); pz[i] = pos.getZ(i); const x = nor.getX(i), y = nor.getY(i), z = nor.getZ(i), l = Math.hypot(x, y, z) || 1; nx[i] = x / l; ny[i] = y / l; nz[i] = z / l; }
  const edge = (a, b) => {
    const dx = px[b] - px[a], dy = py[b] - py[a], dz = pz[b] - pz[a], d2 = dx * dx + dy * dy + dz * dz;
    if (d2 === 0) return;
    const c = ((nx[b] - nx[a]) * dx + (ny[b] - ny[a]) * dy + (nz[b] - nz[a]) * dz) / d2;
    sum[a] += c; sum[b] += c; if (count[a] < 65535) count[a]++; if (count[b] < 65535) count[b]++;
  };
  for (let t = 0; t < ix.length; t += 3) { edge(ix[t], ix[t + 1]); edge(ix[t + 1], ix[t + 2]); edge(ix[t + 2], ix[t]); }
  const col = new Float32Array(n * 3), RADIUS = 0.0045;   // a curve tighter than about 4.5 mm gets the full effect
  for (let i = 0; i < n; i++) {
    const c = count[i] ? sum[i] / count[i] / scale : 0;   // 1 / metres; positive = convex
    const v = Math.max(-1, Math.min(1, c * RADIUS));
    const m = v < 0 ? 1 + v * 0.34 : 1 + v * 0.07;
    col[i * 3] = m; col[i * 3 + 1] = v < 0 ? m * (1 + v * 0.03) : m; col[i * 3 + 2] = v < 0 ? m * (1 + v * 0.10) : m;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return true;
}

// ---------------------------------------------------------------- platform reflection
/**
 * A dim, blurred mirror image of the body on the platform. The scene is drawn a second time from below, so this
 * is the first effect the studio drops when frames get slow. `fresh` is cleared once per frame by the studio:
 * the extra passes (ambient occlusion, depth of field) draw the scene again and must not re-render the mirror.
 */
export function createFloorReflection(radius = 1.3) {
  const shader = {
    name: 'FloorReflection',
    uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, uStrength: { value: 0.3 } },
    vertexShader: /* glsl */`
      uniform mat4 textureMatrix; varying vec4 vUv; varying vec2 vDisc;
      #include <common>
      #include <logdepthbuf_pars_vertex>
      void main() {
        vUv = textureMatrix * vec4( position, 1.0 ); vDisc = uv * 2.0 - 1.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 color; uniform sampler2D tDiffuse; uniform float uStrength; varying vec4 vUv; varying vec2 vDisc;
      #include <logdepthbuf_pars_fragment>
      void main() {
        #include <logdepthbuf_fragment>
        vec2 uv = vUv.xy / vUv.w; vec3 sum = vec3( 0.0 ); float r = 0.006;
        sum += texture2D( tDiffuse, uv ).rgb * 0.24;
        sum += texture2D( tDiffuse, uv + vec2( r, 0.0 ) ).rgb * 0.12; sum += texture2D( tDiffuse, uv - vec2( r, 0.0 ) ).rgb * 0.12;
        sum += texture2D( tDiffuse, uv + vec2( 0.0, r ) ).rgb * 0.12; sum += texture2D( tDiffuse, uv - vec2( 0.0, r ) ).rgb * 0.12;
        sum += texture2D( tDiffuse, uv + vec2( r, r ) * 1.4 ).rgb * 0.07; sum += texture2D( tDiffuse, uv - vec2( r, r ) * 1.4 ).rgb * 0.07;
        sum += texture2D( tDiffuse, uv + vec2( r, -r ) * 1.4 ).rgb * 0.07; sum += texture2D( tDiffuse, uv - vec2( r, -r ) * 1.4 ).rgb * 0.07;
        float edge = 1.0 - smoothstep( 0.55, 1.0, length( vDisc ) );   // fades out towards the rim of the platform
        gl_FragColor = vec4( sum * color * uStrength * edge, 1.0 );
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  };
  const mirror = new Reflector(new THREE.CircleGeometry(radius, 96), { textureWidth: 768, textureHeight: 768, color: 0xffffff, shader, multisample: 0, clipBias: 0.002 });
  mirror.rotation.x = -Math.PI / 2;
  mirror.position.y = 0.0016;
  mirror.material.transparent = true;
  mirror.material.blending = THREE.AdditiveBlending;   // light added to the dark platform, as a reflection is
  mirror.material.depthWrite = false;
  mirror.userData.fresh = false;
  const draw = mirror.onBeforeRender;
  mirror.onBeforeRender = function (renderer, scene, camera) {
    if (mirror.userData.fresh) return;
    mirror.userData.fresh = true;
    for (const h of mirrorHidden) h.visible = false;
    draw.call(this, renderer, scene, camera);
    for (const h of mirrorHidden) h.visible = true;
  };
  return mirror;
}
