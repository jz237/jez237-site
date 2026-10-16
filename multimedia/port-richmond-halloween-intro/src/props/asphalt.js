// Close-range asphalt under car B (CAR agent): the world's road is coarse at 15-80 cm, so a local patch draped on the
// world ground (3 mm above it) carries wet aggregate, tar seams, hairline cracks, grit and a little debris (dead
// leaves, a candy wrapper, a cigarette butt). Edges fade out (alpha) into the world's road. Static.
//   buildAsphaltPatch(ctx, { center, sizeX, sizeZ, puddle: { x, z, r }, quality, avoid }) -> { group, api, update(t, camera) }
import * as THREE from 'three';
import { canvasTexture } from './textures.js';
import { rng } from './util.js';

function aggregateTextures() {
  const S = 1024;
  // albedo: dark binder with lighter stones; height (in the same canvas' alpha-free twin) drives bump + roughness
  const R = rng(4242);
  const stones = [];
  for (let i = 0; i < 16000; i++) stones.push([R() * S, R() * S, 0.8 + Math.pow(R(), 3.0) * 6.0, R(), R()]);
  const cracks = [];
  for (let c = 0; c < 7; c++) {
    let x = R() * S, y = R() * S, a = R() * Math.PI * 2;
    const pts = [[x, y]];
    for (let k = 0; k < 40; k++) { a += (R() - 0.5) * 0.9; x += Math.cos(a) * 9; y += Math.sin(a) * 9; pts.push([x, y]); }
    cracks.push(pts);
  }
  const drawCracks = (g, col, w) => {
    g.strokeStyle = col; g.lineCap = 'round';
    for (const pts of cracks) { g.lineWidth = w; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const p of pts) g.lineTo(p[0], p[1]); g.stroke(); }
  };
  const albedo = canvasTexture('carB_asphaltAlbedo', S, S, (g) => {
    g.fillStyle = '#272624'; g.fillRect(0, 0, S, S);
    for (const [x, y, r, a, b] of stones) {
      const v = 36 + a * a * 44 | 0;   // low contrast: wet binder and stones close in value (no polka dots)
      g.fillStyle = `rgb(${v},${v - 2 + (b * 6 | 0)},${v - 5})`;
      g.beginPath(); g.ellipse(x, y, r, r * (0.6 + 0.4 * b), a * 6, 0, Math.PI * 2); g.fill();
    }
    // fine grit
    for (let i = 0; i < 60000; i++) { const v = 25 + R() * 60 | 0; g.fillStyle = `rgba(${v},${v},${v - 3},0.5)`; g.fillRect(R() * S, R() * S, 1, 1); }
    // tar seam (sealed joint) across the patch + crack sealant
    g.strokeStyle = '#090807'; g.lineWidth = 26; g.beginPath(); g.moveTo(0, S * 0.63); g.bezierCurveTo(S * 0.3, S * 0.6, S * 0.6, S * 0.68, S, S * 0.64); g.stroke();
    drawCracks(g, '#0a0908', 3.2);
    // oil stain
    const gr = g.createRadialGradient(S * 0.3, S * 0.35, 0, S * 0.3, S * 0.35, S * 0.18);
    gr.addColorStop(0, 'rgba(6,6,8,0.55)'); gr.addColorStop(1, 'rgba(6,6,8,0)');
    g.fillStyle = gr; g.fillRect(0, 0, S, S);
  }, { repeat: [1, 1] });
  const height = canvasTexture('carB_asphaltHeight', S, S, (g) => {
    g.fillStyle = '#505050'; g.fillRect(0, 0, S, S);
    for (const [x, y, r, a, b] of stones) {
      const v = 96 + a * 60 | 0;
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.beginPath(); g.ellipse(x, y, r, r * (0.6 + 0.4 * b), a * 6, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = '#2a2a2a'; g.lineWidth = 26; g.beginPath(); g.moveTo(0, S * 0.63); g.bezierCurveTo(S * 0.3, S * 0.6, S * 0.6, S * 0.68, S, S * 0.64); g.stroke();
    drawCracks(g, '#000000', 3.5);
  }, { repeat: [1, 1], srgb: false });
  return { albedo, height };
}

function leafTexture(seed) {
  return canvasTexture('carB_leaf' + seed, 128, 128, (g, w, h) => {
    const R = rng(seed);
    g.clearRect(0, 0, w, h);
    const hue = [[96, 52, 22], [120, 74, 28], [70, 40, 20]][seed % 3];
    g.fillStyle = `rgb(${hue[0]},${hue[1]},${hue[2]})`;
    g.beginPath(); g.moveTo(64, 8);
    for (let a = 0; a <= Math.PI * 2; a += 0.2) { const r = 50 * (0.75 + 0.25 * Math.sin(a * 5)) * (0.9 + 0.1 * R()); g.lineTo(64 + Math.sin(a) * r * 0.75, 64 - Math.cos(a) * r); }
    g.closePath(); g.fill();
    g.strokeStyle = 'rgba(30,18,8,0.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(64, 10); g.lineTo(64, 120); g.stroke();
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(64, 30 + i * 16); g.lineTo(64 + (i % 2 ? 26 : -26), 18 + i * 16); g.stroke(); }
  }, { mips: true, wrap: false });
}
function wrapperTexture() {
  return canvasTexture('carB_wrapper', 256, 128, (g, w, h) => {
    g.fillStyle = '#d96a10'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#111'; for (let x = -40; x < w; x += 34) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 18, 0); g.lineTo(x + 58, h); g.lineTo(x + 40, h); g.fill(); }
    g.fillStyle = '#f2e8d0'; g.fillRect(60, 40, 136, 48);
    g.fillStyle = '#7a1010'; g.font = 'bold 30px sans-serif'; g.fillText('TRICK!', 76, 76);
  }, { mips: true, wrap: false });
}

export function buildAsphaltPatch(ctx, { center, sizeX = 4.4, sizeZ = 4.2, puddle = null, quality = 'high' } = {}) {
  const group = new THREE.Group();
  group.name = 'CarB_asphalt';
  const { albedo, height } = aggregateTextures();
  const rep = 1.25; // metres per texture tile
  for (const t of [albedo, height]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; }
  const nx = quality === 'low' ? 44 : 88, nz = Math.round(nx * sizeZ / sizeX);
  const geo = new THREE.PlaneGeometry(sizeX, sizeZ, nx, nz).rotateX(-Math.PI / 2);
  const p = geo.attributes.position, uv = geo.attributes.uv;
  const fade = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + center.x, z = p.getZ(i) + center.z;
    p.setXYZ(i, x, ctx.groundY(x, z) + 0.003, z);
    uv.setXY(i, x / rep, z / rep);
    const ex = Math.min(x - (center.x - sizeX / 2), center.x + sizeX / 2 - x) / 0.7;
    const ez = Math.min(z - (center.z - sizeZ / 2), center.z + sizeZ / 2 - z) / 0.7;
    fade[i] = Math.max(0, Math.min(1, Math.min(ex, ez)));
  }
  geo.setAttribute('aFade', new THREE.BufferAttribute(fade, 1));
  geo.computeVertexNormals();
  const pud = puddle ? new THREE.Vector3(puddle.x, puddle.r, puddle.z) : new THREE.Vector3(0, 0, 1e5);
  const mat = new THREE.MeshStandardMaterial({
    name: 'CarBAsphaltClose', map: albedo, color: 0x9a9894, roughness: 0.28, metalness: 0.0,
    roughnessMap: height, bumpMap: height, bumpScale: 0.22, envMap: ctx.envMap, envMapIntensity: 0.4,
    transparent: true, depthWrite: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uPud = { value: pud };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFade; varying float vFade; varying vec3 vAW;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFade = aFade; vAW = transformed;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vFade; varying vec3 vAW; uniform vec3 uPud;')
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        // wet: binder fills with water (glossy), stone tops a little rougher; the puddle margin is soaked
        float hgt = texture2D(roughnessMap, vRoughnessMapUv).g;
        float soak = 1.0 - smoothstep(uPud.y * 0.9, uPud.y * 1.9, length(vAW.xz - uPud.xz));
        // (pass 1b: rougher stone tops + gentler bump: the glossy aggregate glittered under the lead's key lights)
        roughnessFactor = mix(0.3, 0.68, smoothstep(0.35, 0.8, hgt)) * (1.0 - 0.4 * soak);`)
      .replace('#include <map_fragment>', `#include <map_fragment>
        { float soak2 = 1.0 - smoothstep(uPud.y * 0.9, uPud.y * 1.9, length(vAW.xz - uPud.xz)); diffuseColor.rgb *= mix(0.62, 0.42, soak2); }`)
      .replace('#include <opaque_fragment>', '#include <opaque_fragment>\ngl_FragColor.a *= smoothstep(0.0, 1.0, vFade);');
  };
  mat.customProgramCacheKey = () => 'carB_asphalt_close';
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'carB_asphaltPatch';
  mesh.receiveShadow = true;
  mesh.renderOrder = 1;
  group.add(mesh);

  // ---- debris (static): dead leaves, a candy wrapper, a cigarette butt -- kept out of the face/puddle area
  const R = rng(77);
  const leafMats = [0, 1, 2].map((i) => new THREE.MeshStandardMaterial({ name: 'CarBLeaf' + i, map: leafTexture(31 + i), alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.35, color: 0x8a8a8a }));
  const spots = [[0.55, -1.3], [0.9, 1.25], [-0.2, -1.6], [1.4, -0.4], [-0.6, 1.5], [1.7, 1.1], [0.2, 1.75]];
  for (let i = 0; i < spots.length; i++) {
    const [dx, dz] = spots[i];
    const x = center.x + dx, z = center.z + dz;
    const s = 0.06 + R() * 0.05;
    const g = new THREE.PlaneGeometry(s, s * 1.2, 4, 4).rotateX(-Math.PI / 2);
    const gp = g.attributes.position;
    for (let k = 0; k < gp.count; k++) gp.setY(k, 0.01 * Math.pow(Math.abs(gp.getX(k)) / s * 2, 2) * (R() < 0.5 ? 1 : 0.5)); // curled edges
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, leafMats[i % 3]);
    m.position.set(x, ctx.groundY(x, z) + 0.005, z);
    m.rotation.y = R() * Math.PI * 2;
    m.receiveShadow = true;
    group.add(m);
  }
  {
    const g = new THREE.PlaneGeometry(0.075, 0.035, 8, 4).rotateX(-Math.PI / 2);
    const gp = g.attributes.position;
    for (let k = 0; k < gp.count; k++) gp.setY(k, 0.004 + 0.004 * Math.sin(gp.getX(k) * 160) * Math.cos(gp.getZ(k) * 140) + (Math.abs(gp.getX(k)) > 0.03 ? 0.004 : 0));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ name: 'CarBWrapper', map: wrapperTexture(), roughness: 0.22, metalness: 0.35, side: THREE.DoubleSide }));
    const x = center.x + 1.15, z = center.z - 0.85;
    m.position.set(x, ctx.groundY(x, z) + 0.002, z); m.rotation.y = 0.7;
    group.add(m);
  }
  {
    const butt = new THREE.Group();
    const filt = new THREE.Mesh(new THREE.CylinderGeometry(0.0039, 0.0039, 0.022, 10), new THREE.MeshStandardMaterial({ name: 'CarBButtFilter', color: 0xb9874a, roughness: 0.8 }));
    const pap = new THREE.Mesh(new THREE.CylinderGeometry(0.0037, 0.0037, 0.012, 10), new THREE.MeshStandardMaterial({ name: 'CarBButtPaper', color: 0xd8d4c8, roughness: 0.85 }));
    pap.position.y = 0.017;
    const ash = new THREE.Mesh(new THREE.CylinderGeometry(0.0036, 0.0036, 0.003, 10), new THREE.MeshStandardMaterial({ name: 'CarBButtAsh', color: 0x2a2826, roughness: 1 }));
    ash.position.y = 0.0245;
    butt.add(filt, pap, ash);
    butt.rotation.z = Math.PI / 2; butt.rotation.y = 1.1;
    const x = center.x + 0.75, z = center.z + 0.62;
    butt.position.set(x, ctx.groundY(x, z) + 0.0042, z);
    group.add(butt);
  }
  return { group, api: { mesh, material: mat }, update() {} };
}
