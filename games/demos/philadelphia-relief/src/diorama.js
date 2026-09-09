/** A zoom-dependent miniature stage. Vegetation is illustrative, sampled from
 * green aerial pixels; its enlarged crowns are never shown at inspection scale. */
export function dioramaAmount(distance, enabled = true) {
  const t = enabled ? Math.min(1, Math.max(0, (distance - 9000) / 36000)) : 0;
  return t * t * (3 - 2 * t);
}

export function displayExaggeration(state, distance = state.camDist) {
  if (!state.layers.terrain) return 0;
  const amount = dioramaAmount(distance, state.diorama && state.era === 'present'
    && state.compareMode === 'off');
  return state.exaggeration + Math.max(0, 15 - state.exaggeration) * amount;
}

export function edgeSamples(width, height, segments = 256) {
  const points = [];
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const uv = [[t, 0], [1, t], [1 - t, 1], [0, 1 - t]][side];
      points.push({ x: (uv[0] - .5) * width, z: (uv[1] - .5) * height, uv, side });
    }
  }
  return points;
}

const WALL_VERTEX = /* glsl */ `
  uniform sampler2D uHeight;
  uniform float uExag;
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vec3 p = position;
    p.y = mix(-2200.0, texture2D(uHeight, uv).r * uExag, position.y);
    vPos = p; vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const WALL_FRAGMENT = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    float grain = hash(floor(vPos.xz * .08) + floor(vPos.y * .12));
    float strata = sin(vPos.y * .036 + sin(vPos.x * .0008 + vPos.z * .001) * 1.3);
    float fine = sin(vPos.y * .17 + sin(vPos.x * .008 + vPos.z * .007));
    vec3 earth = mix(vec3(.24, .15, .085), vec3(.48, .35, .20),
      clamp((vPos.y + 2200.0) / 3100.0, 0.0, 1.0));
    earth *= .88 + strata * .08 + fine * .025 + grain * .12;
    earth *= .72 + .42 * max(0.0, dot(vNormal, normalize(vec3(-.6, .7, .4))));
    earth = mix(earth, vec3(.085, .061, .040), 1.0 - smoothstep(-1900.0, -1800.0, vPos.y));
    gl_FragColor = vec4(earth, 1.0);
  }
`;
const FLOOR_VERTEX = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FLOOR_FRAGMENT = /* glsl */ `
  uniform vec2 uSize;
  varying vec3 vPos;
  void main() {
    vec2 p = abs(vPos.xz - vec2(1200.0, -800.0)) - uSize * .5;
    float distance = length(max(p, 0.0));
    float shadow = exp(-distance / 3200.0) * .26 + exp(-distance / 700.0) * .12;
    vec3 paper = vec3(.79, .765, .72);
    paper *= 1.0 - shadow;
    gl_FragColor = vec4(paper, 1.0);
  }
`;

const TREE_VERTEX = /* glsl */ `
  uniform float uExag;
  uniform float uAmount;
  attribute vec3 aTree;
  attribute float aSize;
  varying vec3 vNormal;
  varying vec3 vLocal;
  varying float vSeed;
  void main() {
    vNormal = normal; vLocal = position; vSeed = fract(aSize * .317);
    vec3 p = position * vec3(aSize, aSize * 1.35, aSize) * uAmount;
    p.y += aSize * .9 * uAmount;
    p += vec3(aTree.x, aTree.y * uExag, aTree.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const TREE_FRAGMENT = /* glsl */ `
  uniform vec3 uSunDir;
  varying vec3 vNormal;
  varying vec3 vLocal;
  varying float vSeed;
  void main() {
    float light = max(0.0, dot(normalize(vNormal), uSunDir));
    float foliage = sin(vLocal.x * 28.0) * sin(vLocal.y * 32.0) * sin(vLocal.z * 26.0);
    vec3 green = mix(vec3(.060, .105, .030), vec3(.23, .28, .065), vSeed);
    green *= (.68 + light * .95) * (1.0 + foliage * .13);
    green *= smoothstep(-1.2, .5, vLocal.y) * .5 + .5;
    gl_FragColor = vec4(green, 1.0);
  }
`;

function makeTrees(THREE, imagery, projection, sampleElevation, uniforms, bounds = null) {
  if (!imagery) return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imagery, 0, 0, 1024, 1024);
  const pixels = ctx.getImageData(0, 0, 1024, 1024).data;
  const positions = [], sizes = [];
  let seed = 237;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const w = bounds ? (bounds.east - bounds.west) * projection.metersPerDegLon : projection.widthM;
  const h = bounds ? (bounds.north - bounds.south) * projection.metersPerDegLat : projection.heightM;
  const ox = bounds ? projection.lonToX((bounds.west + bounds.east) / 2) : 0;
  const oz = bounds ? projection.latToZ((bounds.north + bounds.south) / 2) : 0;
  const step = bounds ? 18 : 245, inset = bounds ? 9 : 250;
  for (let z = -h / 2 + inset; z < h / 2 - inset; z += step) {
    for (let x = -w / 2 + inset; x < w / 2 - inset; x += step) {
      const px = x + (random() - .5) * step * .9, pz = z + (random() - .5) * step * .9;
      const ix = Math.floor((px / w + .5) * 1023), iz = Math.floor((pz / h + .5) * 1023);
      const at = (iz * 1024 + ix) * 4;
      const r = pixels[at], g = pixels[at + 1], b = pixels[at + 2];
      // Dark green canopy, not pale fields, roads, roofs or water.
      if (g < 42 || g > 143 || g < r * 1.08 || g < b * 1.20 || g - r < 9) continue;
      const elev = sampleElevation(projection.xToLon(px + ox), projection.zToLat(pz + oz));
      if (elev < 4) continue;
      positions.push(px + ox, elev, pz + oz);
      sizes.push(bounds ? 2.6 + random() * 2.8 : 85 + random() * 105);
    }
  }
  const base = new THREE.SphereGeometry(1, 7, 5);
  const geometry = new THREE.InstancedBufferGeometry().copy(base);
  base.dispose();
  geometry.setAttribute('aTree', new THREE.InstancedBufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('aSize', new THREE.InstancedBufferAttribute(new Float32Array(sizes), 1));
  geometry.instanceCount = sizes.length;
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: TREE_VERTEX,
    fragmentShader: TREE_FRAGMENT });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'illustrative woodland canopy'; mesh.frustumCulled = false;
  mesh.userData.total = sizes.length;
  return mesh;
}

export function createDiorama(THREE, { terrain, projection, sampleElevation, imagery }) {
  const group = new THREE.Group();
  group.name = 'diorama stage';
  const w = projection.widthM, h = projection.heightM;
  const points = edgeSamples(w, h), pos = [], uv = [], normals = [], indices = [];
  const direction = [[0, 0, -1], [1, 0, 0], [0, 0, 1], [-1, 0, 0]];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    pos.push(p.x, 0, p.z, p.x, 1, p.z);
    uv.push(...p.uv, ...p.uv); normals.push(...direction[p.side], ...direction[p.side]);
    if (i && points[i - 1].side === p.side) {
      const a = (i - 1) * 2, b = i * 2;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  const wallUniforms = { uHeight: terrain.uniforms.uHeight, uExag: terrain.uniforms.uExag };
  const wall = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ uniforms: wallUniforms,
    vertexShader: WALL_VERTEX, fragmentShader: WALL_FRAGMENT, side: THREE.DoubleSide }));
  wall.frustumCulled = false; group.add(wall);
  const floorGeo = new THREE.PlaneGeometry(1500000, 1500000);
  floorGeo.rotateX(-Math.PI / 2); floorGeo.translate(0, -2220, 0);
  const floor = new THREE.Mesh(floorGeo, new THREE.ShaderMaterial({
    uniforms: { uSize: { value: new THREE.Vector2(w, h) } },
    vertexShader: FLOOR_VERTEX, fragmentShader: FLOOR_FRAGMENT }));
  floor.frustumCulled = false; group.add(floor);
  const closeCanopies = new Map();
  const treeUniforms = { uExag: { value: 1 }, uAmount: { value: 1 },
    uSunDir: { value: new THREE.Vector3(-.5, .8, .3).normalize() } };
  const trees = makeTrees(THREE, imagery, projection, sampleElevation, treeUniforms);
  if (trees) group.add(trees);
  const closeUniforms = { ...treeUniforms, uAmount: { value: 1 } };
  const dropTile = key => {
    const mesh = closeCanopies.get(key);
    if (!mesh) return;
    group.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); closeCanopies.delete(key);
  };
  return {
    group,
    addTile(cell, image) {
      if (cell.level > 1 || closeCanopies.has(cell.key)) return;
      const mesh = makeTrees(THREE, image, projection, sampleElevation, closeUniforms, cell.bounds);
      if (!mesh) return;
      mesh.userData.cell = cell; mesh.visible = false;
      closeCanopies.set(cell.key, mesh); group.add(mesh);
      while (closeCanopies.size > 20) dropTile(closeCanopies.keys().next().value);
    },
    dropTile,
    attachTerrain(next) {
      wallUniforms.uHeight = next.uniforms.uHeight;
      wallUniforms.uExag = next.uniforms.uExag;
    },
    update(amount, exaggeration, sunDir, state, pose) {
      const enabled = state.diorama && state.era === 'present' && state.compareMode === 'off';
      group.visible = enabled && state.layers.terrain;
      floor.visible = wall.visible = amount > .001;
      const imageryOn = state.layers.imagery && state.layers.structures;
      const near = [...closeCanopies.values()].sort((a, b) => {
        const distance = m => Math.hypot(m.userData.cell.lon - pose.lon, m.userData.cell.lat - pose.lat);
        return distance(a) - distance(b);
      });
      const fine = near.some(mesh => mesh.userData.cell.level === 0);
      let shown = 0;
      for (const mesh of near) {
        mesh.visible = imageryOn && pose.dist < 6500
          && (!fine || mesh.userData.cell.level === 0) && shown++ < 8;
      }
      closeUniforms.uAmount.value = Math.min(1, Math.max(0, (6500 - pose.dist) / 1800));
      treeUniforms.uExag.value = exaggeration;
      treeUniforms.uAmount.value = .035 + amount * .965;
      treeUniforms.uSunDir.value.copy(sunDir);
      if (trees) {
        trees.visible = state.layers.imagery && (imageryOn || amount > .1);
      }
    },
    dispose() {
      group.traverse(node => { node.geometry?.dispose(); node.material?.dispose(); });
    },
  };
}
