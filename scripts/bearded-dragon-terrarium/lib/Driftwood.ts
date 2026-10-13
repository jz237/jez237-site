import * as THREE from 'three';
import {dataTexture, tileFbm} from './Textures';

type HeightSample = (u: number, v: number) => number;
const TAU = Math.PI * 2;
const fract = (x: number) => x - Math.floor(x);

/** Read the same repeat-wrapped, flipped UVs used by the physical material. */
function heightSampler(texture: THREE.Texture): HeightSample {
  const source = texture.image as HTMLImageElement;
  const canvas = document.createElement('canvas');
  canvas.width = source.width; canvas.height = source.height;
  const context = canvas.getContext('2d', {willReadFrequently: true})!;
  context.drawImage(source, 0, 0);
  const {data, width, height} = context.getImageData(0, 0, canvas.width, canvas.height);
  return (u, v) => {
    const x = fract(u) * width - 0.5, y = (1 - fract(v)) * height - 0.5;
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const pixel = (xx: number, yy: number) => data[(((yy % height + height) % height) * width + (xx % width + width) % width) * 4] / 255;
    return THREE.MathUtils.lerp(THREE.MathUtils.lerp(pixel(ix, iy), pixel(ix + 1, iy), fx), THREE.MathUtils.lerp(pixel(ix, iy + 1), pixel(ix + 1, iy + 1), fx), fy);
  };
}

/** Freshly exposed fibres on a broken end, with irregular growth rings and splits. */
function endGrainMaterial() {
  const size = 512;
  const grain = (x: number, y: number) => {
    const u = x / size, v = y / size, dx = u - 0.43, dy = (v - 0.56) * 1.08;
    const radius = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
    const warp = tileFbm(u * 8, v * 8, 8, 3, 71);
    const rings = Math.sin(radius * 218 + warp * 5 + Math.sin(angle * 3) * 0.7);
    const split = Math.pow(Math.max(0, Math.cos(angle * 5 + warp * 0.7)), 160) * THREE.MathUtils.smoothstep(radius, 0.16, 0.44);
    const fibres = tileFbm(u * 128, v * 128, 128, 2, 19);
    return {rings, split, fibres};
  };
  const color = dataTexture(size, size, (x, y, out) => {
    const g = grain(x, y), shade = 0.92 + g.rings * 0.05 + (g.fibres - 0.5) * 0.15 - g.split * 0.56;
    out[0] = 157 * shade; out[1] = 142 * shade; out[2] = 120 * shade;
  });
  const bump = dataTexture(size, size, (x, y, out) => {
    const g = grain(x, y);
    out[0] = out[1] = out[2] = 150 + g.rings * 9 + g.fibres * 26 - g.split * 108;
  }, false);
  return new THREE.MeshStandardMaterial({map: color, bumpMap: bump, bumpScale: 0.0007, roughness: 0.87});
}

/** Closed, displaced branch surfaces serve both rendering and solid contacts. */
export function driftwood(material: THREE.MeshStandardMaterial, height: HeightSample = () => 1) {
  const meshes: THREE.Mesh[] = [], endMaterial = endGrainMaterial();
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const branch = (points: THREE.Vector3[], r0: number, r1: number, seed: number, main = false) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const N = Math.max(40, Math.ceil(curve.getLength() / 0.0035)), S = 80;
    const frames = curve.computeFrenetFrames(N, false);
    const verts: number[] = [], uv: number[] = [], idx: number[] = [];
    let length = 0, previous = curve.getPoint(0);
    for (let i = 0; i <= N; i++) {
      const t = i / N, p = curve.getPoint(t);
      length += p.distanceTo(previous); previous = p;
      const taper = THREE.MathUtils.lerp(r0, r1, t);
      const collar = main ? 1 + 0.07 * Math.exp(-(((t - 0.65) / 0.15) ** 2)) : THREE.MathUtils.lerp(0.42, 1, THREE.MathUtils.smoothstep(t, 0, 0.18)) + 0.07 * Math.exp(-(((t - 0.20) / 0.09) ** 2));
      const radius = taper * collar * (1 + 0.07 * Math.sin(t * 9 + seed) + 0.03 * Math.sin(t * 23 + seed * 1.7));
      const grainV = length / 0.26 + seed * 0.173;
      const endWeight = THREE.MathUtils.smoothstep(t, 0.91, 1);
      for (let j = 0; j <= S; j++) {
        const a = (j === S ? 0 : j / S) * TAU, grainU = j / S + seed * 0.137;
        // Millimetre-scale scanned relief replaces regular corrugated ridges.
        const ridge = 1 + 0.022 * Math.sin(a * 5 + t * 3 + seed) + 0.014 * Math.sin(a * 11 - t * 4);
        const r = radius * ridge - (1 - height(grainU, grainV)) * Math.min(0.0022, r1 * 0.12);
        const fracture = (0.40 * Math.sin(a * 7 + seed) + 0.28 * Math.sin(a * 13 - seed) + 0.20 * Math.sin(a * 23 + seed * 0.3)) * Math.min(0.010, r1 * 0.5) * endWeight;
        const q = p.clone().addScaledVector(frames.normals[i], Math.cos(a) * r).addScaledVector(frames.binormals[i], Math.sin(a) * r).addScaledVector(frames.tangents[i], fracture);
        verts.push(q.x, q.y, q.z); uv.push(grainU, grainV);
      }
    }
    for (let i = 0; i < N; i++) for (let j = 0; j < S; j++) {
      const k = i * (S + 1) + j;
      idx.push(k, k + 1, k + S + 1, k + 1, k + S + 2, k + S + 1);
    }
    const shellCount = idx.length;
    // Each fractured end reuses the exact displaced boundary, with its own UVs
    // and normals. Caps stay closed for the tail's swept collision queries.
    for (const end of [0, N]) {
      const center = curve.getPoint(end / N).addScaledVector(frames.tangents[end], end ? -0.003 : 0);
      const centerIndex = verts.length / 3, rings = 5, rotation = seed * 1.37;
      verts.push(center.x, center.y, center.z); uv.push(0.5, 0.5);
      const ringStart = verts.length / 3;
      for (let ring = 1; ring <= rings; ring++) for (let j = 0; j <= S; j++) {
        const edge = (end * (S + 1) + j) * 3, amount = ring / rings;
        const q = center.clone().lerp(new THREE.Vector3(verts[edge], verts[edge + 1], verts[edge + 2]), amount);
        const a = (j === S ? 0 : j / S) * TAU + rotation;
        verts.push(q.x, q.y, q.z); uv.push(0.5 + Math.cos(a) * amount * 0.47, 0.5 + Math.sin(a) * amount * 0.47);
      }
      const triangle = (a: number, b: number, c: number) => end ? idx.push(a, b, c) : idx.push(a, c, b);
      for (let j = 0; j < S; j++) triangle(centerIndex, ringStart + j, ringStart + j + 1);
      for (let ring = 0; ring < rings - 1; ring++) for (let j = 0; j < S; j++) {
        const a = ringStart + ring * (S + 1) + j, b = a + S + 1;
        triangle(a, b, b + 1); triangle(a, b + 1, a + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(idx); geometry.addGroup(0, shellCount, 0); geometry.addGroup(shellCount, idx.length - shellCount, 1);
    geometry.computeVertexNormals();
    // The UV seam has duplicate vertices; average its normals so light cannot
    // reveal the join as a line running down an otherwise continuous branch.
    const normals = geometry.getAttribute('normal'), normal = new THREE.Vector3();
    for (let i = 0; i <= N; i++) {
      const a = i * (S + 1), b = a + S;
      normal.fromBufferAttribute(normals, a).add(new THREE.Vector3().fromBufferAttribute(normals, b)).normalize();
      normals.setXYZ(a, normal.x, normal.y, normal.z); normals.setXYZ(b, normal.x, normal.y, normal.z);
    }
    const mesh = new THREE.Mesh(geometry, [material, endMaterial]);
    mesh.castShadow = mesh.receiveShadow = true; mesh.name = 'weathered-solid-driftwood'; meshes.push(mesh);
  };
  branch([v(.33,.089,.153),v(.20,.171,.10),v(.08,.277,.01),v(-.070,.371,-.082),v(-.120,.507,-.108)],.046,.022,11,true);
  branch([v(.030,.315,-.02),v(.10,.376,-.075),v(.245,.402,-.094)],.033,.019,15);
  branch([v(-.041,.349,-.064),v(-.188,.435,-.092),v(-.227,.489,-.111)],.032,.012,16);
  branch([v(-.085,.402,-.082),v(-.035,.466,-.105),v(.029,.501,-.113)],.024,.010,17);
  branch([v(.132,.230,.049),v(.221,.120,.048),v(.352,.077,.061)],.031,.012,18);
  branch([v(.272,.122,.135),v(.395,.084,.176),v(.432,.076,.163)],.024,.008,19);
  return meshes;
}

export async function loadDriftwood() {
  const base = './materials/rough_wood/', loader = new THREE.TextureLoader();
  const [color, normal, packed, displacement] = await Promise.all(['diff', 'nor_gl', 'arm', 'disp'].map(map => loader.loadAsync(`${base}rough_wood_${map}_2k.jpg`)));
  for (const texture of [color, normal, packed]) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.anisotropy = 8;
  }
  color.colorSpace = THREE.SRGBColorSpace;
  normal.colorSpace = packed.colorSpace = displacement.colorSpace = THREE.NoColorSpace;
  packed.channel = 0;
  const material = new THREE.MeshStandardMaterial({
    map: color, normalMap: normal, normalScale: new THREE.Vector2(0.65, 0.65),
    roughnessMap: packed, roughness: 1, aoMap: packed, aoMapIntensity: 0.75, metalness: 0,
  });
  // Preserve the scanned variation, with the matte response of dry, exposed wood.
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = 0.68 + roughnessFactor * 0.30;');
  };
  material.customProgramCacheKey = () => 'dry-weathered-wood-pbr-v1';
  const meshes = driftwood(material, heightSampler(displacement));
  displacement.dispose();
  return meshes;
}
