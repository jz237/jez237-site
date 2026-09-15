// Reuses the site's Stunt Car Racer woodland atlas. Crossed, fixed planes
// give parallax from every driving angle without per-tree camera updates.
// Fine leaves, bark and branch shading live in one shared mipmapped texture.
import * as THREE from 'three';

export function woodlandMaterial() {
  // Transparent first paint while the local atlas loads (never white cards).
  const map = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
  map.needsUpdate = true;
  const mat = new THREE.MeshLambertMaterial({
    map, vertexColors: true, side: THREE.DoubleSide, alphaTest: 0.42,
  });
  new THREE.TextureLoader().load('./assets/textures/woodland.png', texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    mat.map = texture;
    mat.needsUpdate = true;
    map.dispose();
  });
  // Cull back faces for the shadow pass only: no duplicate shadow fragments.
  mat.shadowSide = THREE.FrontSide;
  mat.onBeforeCompile = shader => {
    // Leaves receive sky light on both sides; flipping the deliberately
    // upward normals would make back-facing cards almost black.
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      '#include <normal_fragment_begin>\nnormal *= faceDirection;',
    );
  };
  mat.customProgramCacheKey = () => 'woodland-two-sided-crown-v1';
  return mat;
}

function card(width, height, bottom, angle, bounds, tint = 0xffffff, tilt = 0) {
  const g = new THREE.PlaneGeometry(width, height);
  const uv = g.attributes.uv;
  const [u0, v0, u1, v1] = bounds;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
  }
  g.rotateX(tilt);
  g.rotateY(angle);
  g.translate(0, bottom + height / 2, 0);
  const p = g.attributes.position, n = g.attributes.normal;
  const c = new THREE.Color(tint), colors = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    // Upward crown normals keep the baked leaf detail softly lit, avoiding
    // the alternating bright/dark rectangles of flat billboard lighting.
    const normal = new THREE.Vector3(p.getX(i) * 0.12, 1, p.getZ(i) * 0.12).normalize();
    n.setXYZ(i, normal.x, normal.y, normal.z);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

// Bounds avoid the adjacent species and transparent outside padding.
const OAK = [0.003, 0.005, 0.497, 0.576];
const FIR = [0.515, 0.005, 0.992, 0.987];
const CROWN = [0.035, 0.205, 0.465, 0.565];

export function woodlandParts(species) {
  const fir = species === 0, slender = species === 2;
  const h = fir ? 8 : slender ? 6 : 6.8;
  const w = fir ? 4.15 : slender ? 4.1 : 6.1;
  const tint = slender ? 0xd4e2b4 : fir ? 0xe0e8d7 : 0xf0edda;
  const parts = [];
  for (let i = 0; i < 3; i++) {
    parts.push(card(w * (i === 1 ? 0.91 : 1), h, 0, i * Math.PI / 3, fir ? FIR : OAK, tint));
  }
  // A tilted interior crown gives the broadleaf canopy volume when looking
  // down from a ridge. It stays inside the three outer silhouettes.
  if (!fir) parts.push(card(w * 0.70, h * 0.44, h * 0.44, 0.5, CROWN, tint, -Math.PI * 0.38));
  return parts;
}

export function undergrowthParts() {
  return [0, Math.PI / 3, Math.PI * 2 / 3].map(a => card(1.8, 1.05, -0.12, a, CROWN, 0xb8c58b));
}
