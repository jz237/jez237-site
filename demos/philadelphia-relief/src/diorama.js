import { canopySites, canopyLevel, prepareCanopy } from './canopy-layout.js?v=philly-2026092121';
import { woodlandIndex, prepareWoodland } from './woodland.js?v=philly-2026092121';
import { createCanopyCulling } from './canopy-culling.js?v=philly-2026092122';
/** A zoom-dependent miniature stage. Crowns follow mapped woodland boundaries;
 * enlarged regional crowns shrink to individual trees as the camera approaches. */
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
    float grain = hash(floor(vPos.xz * .13) + floor(vPos.y * .21));
    float strata = sin(vPos.y * .036 + sin(vPos.x * .0008 + vPos.z * .001) * 1.3);
    float fine = sin(vPos.y * .17 + sin(vPos.x * .008 + vPos.z * .007));
    vec3 earth = mix(vec3(.24, .15, .085), vec3(.48, .35, .20),
      clamp((vPos.y + 2200.0) / 3100.0, 0.0, 1.0));
    float fissure = pow(max(0.0, sin(vPos.x * .012 + vPos.z * .015 + sin(vPos.y * .004))), 28.0);
    earth *= .92 + strata * .09 + fine * .045 + grain * .08 - fissure * .13;
    earth *= .72 + .42 * max(0.0, dot(vNormal, normalize(vec3(-.6, .7, .4))));
    float timber = .045 * sin(vPos.x * .008 + vPos.z * .013 + sin(vPos.y * .09));
    earth = mix(earth, vec3(.16 + timber, .105 + timber * .6, .065),
      1.0 - smoothstep(-1900.0, -1820.0, vPos.y));
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
    vec2 p = abs(vPos.xz - vec2(1600.0, -1100.0)) - uSize * .5;
    float distance = length(max(p, 0.0));
    float shadow = exp(-distance / 2800.0) * .23 + exp(-distance / 500.0) * .18;
    vec3 paper = vec3(.85, .827, .79);
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
    vLocal = position; vSeed = fract(aSize * .317);
    vec3 profile = vec3(.85 + vSeed * .15, 1.05 + vSeed * .55, 1.0 - vSeed * .18);
    vNormal = normalize(normal / profile);
    float lobes = 1.0 + .12 * sin(position.x * 9.0 + vSeed * 12.0)
      * sin(position.z * 7.0 - position.y * 6.0);
    vec3 p = position * lobes * vec3(aSize) * profile * uAmount;
    p.y += aSize * .9 * uAmount;
    p += vec3(aTree.x, aTree.y * uExag, aTree.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const TREE_FRAGMENT = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uKeyStrength;
  uniform float uSkyFill;
  varying vec3 vNormal;
  varying vec3 vLocal;
  varying float vSeed;
  void main() {
    vec3 crownNormal = normalize(vNormal + .13 * vec3(sin(vLocal.y*11.0),
      sin(vLocal.z*9.0),sin(vLocal.x*12.0)));
    float light = max(0.0, dot(crownNormal, uSunDir));
    float foliage = sin(vLocal.x * 28.0) * sin(vLocal.y * 32.0) * sin(vLocal.z * 26.0);
    vec3 green = mix(vec3(.043, .084, .029), vec3(.18, .235, .072), vSeed);
    float aa = 1.0 - smoothstep(.12, .5, max(fwidth(vLocal.x), fwidth(vLocal.y)) * 28.0);
    vec3 sunlight = mix(vec3(1.18,.80,.48),vec3(1.02,1.02,.88),smoothstep(.08,.5,uSunDir.y));
    green *= vec3(.40 + uSkyFill * .55) + sunlight * light * uKeyStrength * .85;
    green *= 1.0 + foliage * .1 * aa;
    green += vec3(.025,.033,.012) * pow(max(0.0,vLocal.y),3.0) * uKeyStrength;
    green *= smoothstep(-1.2, .5, vLocal.y) * .5 + .5;
    gl_FragColor = vec4(green, 1.0);
  }
`;

function makeTrees(THREE, coverage, projection, sampleElevation, uniforms, bounds = null) {
  if (!coverage) return null;
  const { positions, sizes } = canopySites(coverage, projection, sampleElevation, bounds);
  return treeMesh(THREE, positions, sizes, uniforms);
}

function treeMesh(THREE, positions, sizes, uniforms) {
  const base = new THREE.SphereGeometry(1, 7, 5);
  const geometry = new THREE.InstancedBufferGeometry().copy(base);
  base.dispose();
  const culling = createCanopyCulling(THREE, geometry, positions, sizes);
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: TREE_VERTEX,
    fragmentShader: TREE_FRAGMENT });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'illustrative woodland canopy'; mesh.frustumCulled = false;
  mesh.userData.cull = camera =>
    culling.update(camera, uniforms.uExag.value, uniforms.uAmount.value);
  mesh.userData.total = sizes.length;
  return mesh;
}

export function createDiorama(THREE, { terrain, projection, sampleElevation, woodland, onReady = () => {} }) {
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
  const pendingCells = new Map();
  const treeUniforms = { uExag: { value: 1 }, uAmount: { value: 1 },
    uKeyStrength: {value:1}, uSkyFill: {value:.7},
    uSunDir: { value: new THREE.Vector3(-.5, .8, .3).normalize() } };
  let coverage = woodland ? woodlandIndex(woodland) : null;
  let trees = makeTrees(THREE, coverage, projection, sampleElevation, treeUniforms);
  if (trees) group.add(trees);
  const closeUniforms = { ...treeUniforms, uAmount: { value: 1 } };
  let streetTrees = null;
  const lifetime = new AbortController();
  let woodlandWork = null, tileWork = null;
  async function prepareTiles() {
    if (!coverage || tileWork || lifetime.signal.aborted) return;
    while (pendingCells.size && !lifetime.signal.aborted) {
      const [key, cell] = pendingCells.entries().next().value;
      pendingCells.delete(key);
      const job = { key, controller: new AbortController() };
      tileWork = job;
      try {
        const { positions, sizes } = await prepareCanopy(coverage, projection, sampleElevation,
          cell.bounds, { signal: job.controller.signal });
        if (job.controller.signal.aborted || lifetime.signal.aborted) continue;
        const mesh = treeMesh(THREE, positions, sizes, closeUniforms);
        mesh.userData.cell = cell; mesh.visible = false;
        closeCanopies.set(key, mesh); group.add(mesh);
        while (closeCanopies.size > 20) dropTile(closeCanopies.keys().next().value);
        onReady();
      } catch (error) {
        if (!job.controller.signal.aborted) console.warn('Tree detail unavailable', error);
      } finally { tileWork = null; }
    }
  }
  const dropTile = key => {
    pendingCells.delete(key);
    if (tileWork?.key === key) tileWork.controller.abort();
    const mesh = closeCanopies.get(key);
    if (!mesh) return;
    group.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); closeCanopies.delete(key);
  };
  return {
    group,
    stats() { return { preparing: !!woodlandWork || !!tileWork, queued: pendingCells.size,
      regionalTrees: trees?.userData.total || 0, localTiles: closeCanopies.size }; },
    setWoodland(doc) {
      if (woodlandWork) return woodlandWork;
      if (coverage || !doc || lifetime.signal.aborted) return Promise.resolve();
      woodlandWork = (async () => {
        const options = { signal: lifetime.signal };
        const nextCoverage = await prepareWoodland(doc, options);
        const { positions, sizes } = await prepareCanopy(nextCoverage, projection,
          sampleElevation, null, options);
        if (lifetime.signal.aborted) return;
        coverage = nextCoverage;
        trees = treeMesh(THREE, positions, sizes, treeUniforms);
        trees.visible = false; group.add(trees); onReady();
        void prepareTiles();
      })().catch(error => {
        if (!lifetime.signal.aborted) console.warn('Woodland preparation unavailable', error);
      }).finally(() => { woodlandWork = null; });
      return woodlandWork;
    },
    setLocalDetail(doc) {
      if (streetTrees) {
        group.remove(streetTrees); streetTrees.geometry.dispose(); streetTrees.material.dispose();
        streetTrees = null;
      }
      const positions = [], sizes = [];
      for (const e of doc?.elements || []) {
        if (e.tags?.natural !== 'tree' || !Number.isFinite(e.lon) || !Number.isFinite(e.lat)) continue;
        positions.push(projection.lonToX(e.lon), sampleElevation(e.lon, e.lat), projection.latToZ(e.lat));
        const height = parseFloat(e.tags.height);
        sizes.push(Number.isFinite(height) ? Math.max(1.5, Math.min(12, height / 2.4)) : 4);
      }
      if (sizes.length) {
        streetTrees = treeMesh(THREE, positions, sizes, closeUniforms);
        streetTrees.name = 'mapped individual trees'; group.add(streetTrees);
      }
    },
    addTile(cell) {
      if (lifetime.signal.aborted || cell.level > 1 || closeCanopies.has(cell.key)
        || tileWork?.key === cell.key && !tileWork.controller.signal.aborted) return;
      pendingCells.set(cell.key, cell);
      while (pendingCells.size > 20) pendingCells.delete(pendingCells.keys().next().value);
      void prepareTiles();
    },
    dropTile,
    attachTerrain(next) {
      wallUniforms.uHeight = next.uniforms.uHeight;
      wallUniforms.uExag = next.uniforms.uExag;
    },
    update(amount, exaggeration, sunDir, state, pose, light=state, camera=null) {
      const enabled = state.diorama && state.era === 'present' && state.compareMode === 'off';
      group.visible = enabled && state.layers.terrain;
      floor.visible = wall.visible = amount > .001;
      const modelOn = state.layers.structures;
      const near = [...closeCanopies.values()].sort((a, b) => {
        const distance = m => Math.hypot(m.userData.cell.lon - pose.lon, m.userData.cell.lat - pose.lat);
        return distance(a) - distance(b);
      });
      const level = canopyLevel(near.map(mesh => mesh.userData.cell),pose);
      let shown = 0;
      for (const mesh of near) {
        mesh.visible = !state.lightweight && modelOn && pose.dist < 6500
          && mesh.userData.cell.level === level && shown++ < 8;
      }
      closeUniforms.uAmount.value = Math.min(1, Math.max(0, (6500 - pose.dist) / 1800));
      if (streetTrees) streetTrees.visible = modelOn && pose.dist < 6500;
      treeUniforms.uExag.value = exaggeration;
      treeUniforms.uAmount.value = .045 + amount * .955;
      treeUniforms.uSunDir.value.copy(sunDir);
      treeUniforms.uKeyStrength.value=light.keyLight; treeUniforms.uSkyFill.value=light.ambient;
      if (trees) {
        trees.visible = !state.lightweight && (modelOn || amount > .1);
      }
      if (camera && group.visible) {
        camera.updateMatrixWorld();
        if (trees?.visible) trees.userData.cull(camera);
        if (streetTrees?.visible) streetTrees.userData.cull(camera);
        for (const mesh of near) if (mesh.visible) mesh.userData.cull(camera);
      }
    },
    dispose() {
      lifetime.abort(); tileWork?.controller.abort(); pendingCells.clear();
      group.traverse(node => { node.geometry?.dispose(); node.material?.dispose(); });
    },
  };
}
