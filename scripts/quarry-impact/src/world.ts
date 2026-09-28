import {loadWorkyard, workyardFences} from './scenery-workyard';
import { createQuarryPhysics, terrainGeometry, BARRELS, RAMPS, RAMP_POINTS, RAMP_INDICES, rockPlacements, SCREE_POSITIONS, SCREE_UVS, screePlacements, overlapsQuarryRoadside, overlapsQuarryHeadwall, overlapsQuarryEastBay, overlapsQuarryWestWall, WORKS_OFFSET } from './quarry-layout';
import * as T from 'three';
import { DAYLIGHT_DIRECTION, DAYLIGHT_DISTANCE } from './static-shadows';
import { northForestGround } from './scenery-north-floor';
import { northForestRock } from './scenery-north-crest';
import R from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { pbr, texture, url } from './assets';
import { terrainHeight, trackPoint } from './rules';
import { forestScenery, updateForestView } from './scenery-vegetation';
import { loadQuarryCut } from './scenery-cut';
import { loadQuarryRoadside } from './scenery-roadside';
import { loadQuarryExtension } from './scenery-extension';
import { loadQuarryHeadwall } from './scenery-headwall';
import { loadQuarryEastBay } from './scenery-east-bay';
import { loadQuarryWestWall } from './scenery-west-wall';
import { loadQuarryRoadApproach, ROAD_APPROACH_START, ROAD_APPROACH_END } from './scenery-road-approach';
import { quarryRoadSurface } from './scenery-road-material';
import { quarryArenaSurface } from './scenery-arena-material';
import { quarryCircuitSurface } from './scenery-circuit-material';
import { attachCircuitCoordinates } from './scenery-circuit-layout';
import { quarryRoadsideGround } from './scenery-roadside-material';
import { batchScenery, quarryAggregate, landscapeHeight, quarryCliffs, roadsideDetails, weatheredMetal } from './scenery-surfaces';
let seed = 9311;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const dummy = new T.Object3D();
// Poly Haven's cladding scan covers 2.7 metres. Keep ribs at that scale on
// every face instead of stretching one photograph across the whole shed.
function claddingUV(mesh: T.Mesh<T.BoxGeometry>) {
  const { position, normal, uv } = mesh.geometry.attributes;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    const nx = normal.getX(i), ny = normal.getY(i);
    uv.setXY(i, (Math.abs(nx) > .5 ? z : x) / 2.7,
      (Math.abs(ny) > .5 ? z : y) / 2.7);
  }
  return mesh;
}
// A narrow translucent shoreline keeps shallow water embedded in the aggregate.
// Vertex opacity fades both the water edge and the wider damp margin in-place.
function softShoreMaterial(material: T.MeshStandardMaterial) {
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'attribute float shoreAlpha; varying float vShoreAlpha;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvShoreAlpha = shoreAlpha;');
    shader.fragmentShader = 'varying float vShoreAlpha;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= vShoreAlpha;');
  };
  material.customProgramCacheKey = () => 'soft-quarry-shore-v1';
  return material;
}
function puddleGeometry(radius: number, variations: number[], wet: boolean) {
  const segments = 192;
  const rings = wet ? [[0, .65], [.9, .75], [1, .65], [1.1, .24], [1.23, 0]] : [[0, 1], [.88, 1], [.965, .82], [1, 0]];
  const positions: number[] = [], uv: number[] = [], alpha: number[] = [], indices: number[] = [];
  for (const [r, opacity] of rings) {
    for (let j = 0; j <= segments; j++) {
      const a = j / segments * Math.PI * 2;
      const contour = 1 + Math.sin(a * 3 + variations[0] * 6.28) * .105
        + Math.sin(a * 5 + variations[7] * 6.28) * .066
        + Math.sin(a * 11 + variations[14] * 6.28) * .025
        + Math.sin(a * 23 + variations[21] * 6.28) * .008;
      // Uneven capillary spread avoids a uniform decorative outline.
      const spread = wet && r > 1 ? 1 + (r - 1) * (.2 + .18 * Math.sin(a * 7 + variations[28] * 6.28)) : 1;
      const x = Math.cos(a) * radius * contour * r * spread;
      const y = Math.sin(a) * radius * contour * r * spread;
      positions.push(x, y, 0); uv.push(x / 2, y / 2); alpha.push(opacity);
      if (j < segments && r !== 0) {
        const b = positions.length / 3 - 1, p = b - segments - 1;
        indices.push(p, b, p + 1, p + 1, b, b + 1);
      }
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setAttribute('shoreAlpha', new T.Float32BufferAttribute(alpha, 1));
  g.setIndex(indices); g.computeVertexNormals();
  return g;
}
export class Quarry {
  derbyWalls: T.Group = new T.Group();
  derbyColliders: R.Collider[] = [];
  props: { mesh: T.Mesh; body: R.RigidBody; start: T.Vector3 }[] = [];
  scenery = new T.Group();
  collisionPhysics: ReturnType<typeof createQuarryPhysics>;
  road: T.Mesh;
  checkpoint = new T.Group();
  sun: T.DirectionalLight;
  private workyardLODs: T.LOD[] = [];
  private cutLODs: T.LOD[] = [];
  private roadsideLODs: T.LOD[] = [];
  private extensionLODs: T.LOD[] = [];
  private headwallLODs: T.LOD[] = [];
  private eastBayLODs: T.LOD[] = [];
  private westWallLODs: T.LOD[] = [];
  private roadApproachLODs: T.LOD[] = [];
  private rockMaterial: T.MeshStandardMaterial;
  constructor(
    public scene: T.Scene,
    public physics: R.World,
  ) {
    this.collisionPhysics=createQuarryPhysics(R,physics,false);
    this.derbyColliders=this.collisionPhysics.walls;
    scene.add(this.scenery, this.derbyWalls, this.checkpoint);
    scene.fog = new T.FogExp2(0xa5b1bb, 0.0011);
    scene.add(new T.HemisphereLight(0xc1d5e7, 0x7c6a47, 0.8));
    this.sun = new T.DirectionalLight(0xfff1dc, 2.65);
    this.sun.position.copy(DAYLIGHT_DIRECTION).multiplyScalar(DAYLIGHT_DISTANCE);
    this.sun.castShadow = true;
    Object.assign(this.sun.shadow.camera, {
      left: -75,
      right: 75,
      top: 75,
      bottom: -75,
      near: 1,
      far: 250,
    });
    this.sun.shadow.mapSize.set(4096, 4096);
    this.sun.shadow.bias = -0.00015;
    this.sun.shadow.normalBias = 0.035;
    scene.add(this.sun, this.sun.target);
    const ground = northForestGround();
    const rock = northForestRock();
    this.rockMaterial = rock;
    const asphalt = quarryCircuitSurface();
    const groundData=terrainGeometry();
    const geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.BufferAttribute(groundData.positions,3));
    geo.setIndex(new T.BufferAttribute(groundData.indices,1));
    const groundUV=new Float32Array(groundData.positions.length/3*2);
    for(let i=0;i<groundData.positions.length/3;i++){groundUV[i*2]=groundData.positions[i*3]/9;groundUV[i*2+1]=groundData.positions[i*3+2]/9;}
    geo.setAttribute('uv',new T.BufferAttribute(groundUV,2));
    geo.computeVertexNormals();
    const terrain = new T.Mesh(geo, ground);
    terrain.receiveShadow = true;
    scene.add(terrain);
    // Broad arena floor: small aggregate at a believable real-world scale.
    const arenaGeo = new T.CircleGeometry(45, 96);
    arenaGeo.rotateX(-Math.PI / 2);
    const aUV = arenaGeo.attributes.uv;
    for (let i = 0; i < aUV.count; i++)
      aUV.setXY(
        i,
        arenaGeo.attributes.position.getX(i) / 2,
        arenaGeo.attributes.position.getZ(i) / 2,
      );
    const arena = new T.Mesh(
      arenaGeo,
      quarryArenaSurface(),
    );
    arena.position.y = 0.018;
    arena.receiveShadow = true;
    scene.add(arena);
    // Exposed faces share their actual irregular geometry with the physics wall.
    const cliffGeo = quarryCliffs();
    rock.side = T.DoubleSide;
    const cliffs = new T.Mesh(cliffGeo, rock);
    cliffs.receiveShadow = true;
    cliffs.castShadow = true;
    this.scenery.add(cliffs);
    // Closed ribbon uses the exact same centerline as AI and checkpoints.
    const rp: number[] = [],
      ru: number[] = [],
      ri: number[] = [];
    for (let i = 0; i <= 360; i++) {
      const p = trackPoint(i / 360),
        q = trackPoint((i + 0.2) / 360);
      const tangent = new T.Vector2(q.x - p.x, q.z - p.z).normalize();
      for (const side of [-1, 1]) {
        const x = p.x + tangent.y * side * 6,
          z = p.z - tangent.x * side * 6;
        rp.push(x, terrainHeight(x, z) + 0.06, z);
        ru.push(x / 2, z / 2);
      }
    }
    for (let i = 0; i < 360; i++) {
      let a = i * 2;
      ri.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    const roadGeo = new T.BufferGeometry();
    roadGeo.setAttribute('position', new T.Float32BufferAttribute(rp, 3));
    roadGeo.setAttribute('uv', new T.Float32BufferAttribute(ru, 2));
    roadGeo.setIndex(ri);
    roadGeo.computeVertexNormals();
    attachCircuitCoordinates(roadGeo);
    roadGeo.setAttribute('circuitEdge', new T.Float32BufferAttribute(new Float32Array(rp.length / 3).fill(1), 1));
    let begin = 0,
      last = 0;
    for (let i = 0; i <= 360; i++) {
      const authored = i >= ROAD_APPROACH_START && i < ROAD_APPROACH_END;
      const mat = i === 360 || authored ? -1 : trackPoint(i / 360).z < -20 ? 1 : 0;
      if (mat !== last) {
        if (last >= 0) roadGeo.addGroup(begin * 6, (i - begin) * 6, last);
        begin = i;
        last = mat;
      }
    }
    this.road = new T.Mesh(roadGeo, [
      asphalt,
      quarryAggregate(),
    ]);
    this.road.receiveShadow = true;
    scene.add(this.road);
    roadsideDetails(this.scenery, asphalt);
    // Concrete arena barriers with hazard stripes and openable access for other modes.
    const concrete = pbr('rock', 1, { color: 0x9b9b8f });
    const stripe = this.hazardMaterial();
    for (let i = 0; i < 66; i++) {
      const a = (i / 66) * Math.PI * 2;
      const x = Math.sin(a) * 46,
        z = Math.cos(a) * 46;
      const wall = this.box(
        new T.Vector3(x, 0.58, z),
        new T.Vector3(4.22, 1.16, 0.75),
        concrete,
        this.derbyWalls,
      );
      wall.rotation.y = a;
      const label = new T.Mesh(new T.PlaneGeometry(3.8, 0.23), stripe);
      label.position.set(
        x - Math.sin(a) * 0.386,
        0.86,
        z - Math.cos(a) * 0.386,
      );
      label.rotation.y = a + Math.PI;
      this.derbyWalls.add(label);
    }
    // Scanned-texture scree at the foot of the walls.
    const stoneGeo=new T.BufferGeometry();
    stoneGeo.setAttribute('position',new T.BufferAttribute(SCREE_POSITIONS.slice(),3));
    stoneGeo.setAttribute('uv',new T.BufferAttribute(SCREE_UVS.slice(),2));
    const sp=stoneGeo.attributes.position;
    stoneGeo.computeVertexNormals();
    stoneGeo.setAttribute('color', new T.Float32BufferAttribute(new Float32Array(sp.count*3).fill(1), 3));
    const scree = screePlacements();
    const stones = new T.InstancedMesh(stoneGeo, rock, scree.length);
    stones.castShadow = true;
    stones.receiveShadow = true;
    for(const [i,p] of scree.entries()){
      dummy.position.set(p.x,p.y,p.z);
      dummy.scale.set(p.sx,p.sy,p.sz);
      dummy.rotation.set(p.rx,p.ry,p.rz);
      dummy.updateMatrix();
      stones.setMatrixAt(i, dummy.matrix);
    }
    scene.add(stones);
    const aggregateMatrices: T.Matrix4[] = [], aggregateColors: T.Color[] = [];
    for(let i=0;i<460;i++) {
      let x:number,z:number;
      if(i<170) {
        const a=rand()*Math.PI*2,r=40+rand()*5;x=Math.sin(a)*r;z=Math.cos(a)*r;
      } else {
        const t=rand(),p=trackPoint(t),q=trackPoint(t+.001),angle=Math.atan2(q.x-p.x,q.z-p.z),side=rand()<.5?-1:1,offset=7+rand()*3;
        x=p.x+Math.cos(angle)*side*offset;z=p.z-Math.sin(angle)*side*offset;
      }
      const s=.055+rand()*.16;
      dummy.position.set(x,terrainHeight(x,z)+s*.13+.025,z);dummy.scale.set(s,s*.38,s*.7);dummy.rotation.set(rand(),rand()*6.28,rand());dummy.updateMatrix();
      const tint=.7+rand()*.3;
      // Consume the original random sequence before filtering, preserving every
      // retained chip and all scenery generated after this batch.
      if (!overlapsQuarryRoadside(x,z,s) && !overlapsQuarryHeadwall(x,z,s) && !overlapsQuarryEastBay(x,z,s) && !overlapsQuarryWestWall(x,z,s)) {
        aggregateMatrices.push(dummy.matrix.clone());
        aggregateColors.push(new T.Color(tint,tint*.97,tint*.91));
      }
    }
    const aggregate = new T.InstancedMesh(stoneGeo, rock, aggregateMatrices.length);
    aggregate.receiveShadow=true;
    aggregateMatrices.forEach((matrix,i)=>{aggregate.setMatrixAt(i,matrix);aggregate.setColorAt(i,aggregateColors[i]);});
    aggregate.computeBoundingSphere();this.scenery.add(aggregate);
    this.industrial();
    this.playground();
    this.fences();
    for (let i = 0; i < 12; i++) {
      const p = trackPoint(i / 12);
      const q = trackPoint(i / 12 + 0.002);
      const a = Math.atan2(q.x - p.x, q.z - p.z);
      this.sign(
        i === 0
          ? 'START / FINISH'
          : i % 3 === 0
            ? 'QUARRY IMPACT'
            : 'BRAKE  /  TURN',
        p.x + Math.cos(a) * 9,
        p.z - Math.sin(a) * 9,
        a + Math.PI,
        0.55,
      );
    }
    const ring = new T.Mesh(
      new T.TorusGeometry(4.5, 0.05, 6, 48),
      new T.MeshBasicMaterial({
        color: 0xecc875,
        transparent: true,
        opacity: 0.5,
      }),
    );
    ring.position.y = 4.8;
    this.checkpoint.add(ring);
    this.checkpoint.visible = false;
    batchScenery(this.scenery, new Set(this.props.map(p => p.mesh)));
  }
  box(
    p: T.Vector3,
    s: T.Vector3,
    m: T.Material,
    parent: T.Object3D = this.scenery,
    solid = false,
  ) {
    const mesh = new T.Mesh(new T.BoxGeometry(s.x, s.y, s.z), m);
    mesh.position.copy(p);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  hazardMaterial() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const x = c.getContext('2d')!;
    x.fillStyle = '#bf9d49';
    x.fillRect(0, 0, 256, 64);
    x.fillStyle = '#252922';
    for (let i = -64; i < 320; i += 64) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i + 32, 0);
      x.lineTo(i + 96, 64);
      x.lineTo(i + 64, 64);
      x.fill();
    }
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return new T.MeshStandardMaterial({ map: t, roughness: 0.85 });
  }
  sign(text: string, x: number, z: number, yaw = 0, scale = 1) {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#1b2625';
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = '#ddba6f';
    ctx.fillRect(0, 236, 1024, 20);
    ctx.font = 'bold 67px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 512, 135);
    ctx.font = '22px Arial';
    ctx.fillStyle = '#a5b3ae';
    ctx.fillText('BLACKRIDGE QUARRY  •  EST. 1978', 512, 200);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    const group = new T.Group();
    group.position.set(x, terrainHeight(x, z), z);
    group.rotation.y = yaw;
    group.scale.setScalar(scale);
    this.scenery.add(group);
    const s = new T.Mesh(
      new T.BoxGeometry(9, 2.25, 0.12),
      new T.MeshStandardMaterial({ map: tex, roughness: 0.7 }),
    );
    s.position.y = 4;
    group.add(s);
    const steel = new T.MeshStandardMaterial({
      color: 0x404642,
      metalness: 0.65,
      roughness: 0.65,
    });
    for (const xx of [-3.6, 3.6])
      this.box(
        new T.Vector3(xx, 1.7, 0),
        new T.Vector3(0.12, 3.8, 0.12),
        steel,
        group,
      );
  }
  industrial() {
    // Retain the original freestanding works sign and its collision proxy.
    this.sign('BLACKRIDGE WORKS', -54, -31, 0, .85);
  }
  playground() {
    const concrete = pbr('rock', 1, { color: 0x777971 });
    for (const {x,y,z} of RAMPS) {
      const points=RAMP_POINTS, idx=RAMP_INDICES;
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(points, 3));
      g.setAttribute(
        'uv',
        new T.Float32BufferAttribute([0, 0, 1, 0, 0, 2, 1, 2, 0, 2, 1, 2], 2),
      );
      g.setIndex(new T.BufferAttribute(idx,1));
      g.computeVertexNormals();
      const m = new T.Mesh(g, concrete);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      this.scenery.add(m);
    }
    const barrelMat = new T.MeshStandardMaterial({
      color: 0x95633f,
      metalness: 0.6,
      roughness: 0.8,
    });
    for (const {id,x,y,z} of BARRELS) {
      const body=this.collisionPhysics.props[id].body;
      const mesh = new T.Mesh(
        new T.CylinderGeometry(0.34, 0.34, 1.1, 16),
        barrelMat,
      );
      mesh.castShadow = true;
      this.scenery.add(mesh);
      this.props.push({ mesh, body, start: new T.Vector3(x, y, z) });
    }
    const water = softShoreMaterial(new T.MeshPhysicalMaterial({
      color: 0x56625e,
      metalness: 0.05,
      roughness: 0.045,
      clearcoat: 1,
      clearcoatRoughness: .055,
      ior: 1.33,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }));
    const wetSoil = softShoreMaterial(new T.MeshStandardMaterial({ color:0x514d40,roughness:.48,transparent:true,opacity:.4,depthWrite:false }));
    for (let i = 0; i < 12; i++) {
      const a = rand() * 6.28,
        r = 10 + rand() * 27;
      const radius = 1.3 + rand() * 2.5;
      // Preserve the deterministic placement sequence while smoothing the contour.
      const variations = Array.from({ length: 33 }, rand);
      const pg = puddleGeometry(radius, variations, false);
      const p = new T.Mesh(pg, water);
      p.rotation.x = -Math.PI / 2;
      p.position.set(Math.sin(a) * r, 0.025, Math.cos(a) * r);
      p.scale.y = 0.45 + rand() * 0.6;
      this.scenery.add(p);
      const wet = new T.Mesh(puddleGeometry(radius, variations, true), wetSoil);
      wet.rotation.copy(p.rotation);wet.position.copy(p.position);wet.position.y=.022;
      wet.scale.set(1,p.scale.y,1);this.scenery.add(wet);
    }
  }
  fences() { workyardFences(this.scenery); }
  async trees() {
    this.workyardLODs = await loadWorkyard(this.scenery, this.derbyWalls);
    await this.scannedRocks();
    await forestScenery(this.scenery, rand);
  }

  async scannedRocks() {
    const gltf = await new GLTFLoader().loadAsync(url('models/rocks-lod.glb'));
    gltf.scene.updateMatrixWorld(true);
    let variant = 0;
    let scannedMaterial: T.MeshStandardMaterial | undefined;
    gltf.scene.traverse((o) => {
      if (!(o instanceof T.Mesh)) return;
      scannedMaterial ??= o.material as T.MeshStandardMaterial;
      const geo = o.geometry.clone().applyMatrix4(o.matrixWorld);
      geo.computeBoundingBox();
      const bb = geo.boundingBox!;
      const center = bb.getCenter(new T.Vector3());
      geo.translate(-center.x, -bb.min.y, -center.z);
      const size = bb.getSize(new T.Vector3());
      const normalizer = 1 / Math.max(size.x, size.y, size.z);
      geo.scale(normalizer, normalizer, normalizer);
      const placements = rockPlacements(variant);
      const mesh = new T.InstancedMesh(geo, o.material, placements.length);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      for (const [i,p] of placements.entries()) {
        dummy.position.set(p.x,p.y,p.z);
        dummy.scale.set(p.sx,p.sy,p.sz);
        dummy.rotation.set(0,p.yaw,p.roll);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.computeBoundingSphere();
      this.scenery.add(mesh);
      variant++;
    });
    if (!scannedMaterial) throw new Error('Scanned quarry rock material is missing');
    this.cutLODs = await loadQuarryCut(this.scenery, this.rockMaterial, scannedMaterial);
    this.roadsideLODs = await loadQuarryRoadside(this.scenery, {
      ground: quarryRoadsideGround(), rock: this.rockMaterial, scannedRock: scannedMaterial,
    });
    this.extensionLODs = await loadQuarryExtension(this.scenery, this.rockMaterial, scannedMaterial);
    this.headwallLODs = await loadQuarryHeadwall(this.scenery, this.rockMaterial, scannedMaterial);
    this.eastBayLODs = await loadQuarryEastBay(this.scenery, this.rockMaterial, scannedMaterial);
    this.westWallLODs = await loadQuarryWestWall(this.scenery, this.rockMaterial, scannedMaterial);
    this.roadApproachLODs = await loadQuarryRoadApproach(this.scenery, {
      lane: quarryRoadSurface('aggregate'), skirt: quarryRoadSurface('ground'), scannedRock: scannedMaterial,
    });
  }
  setMode(mode: string) {
    const derby = mode === 'derby';
    this.derbyWalls.visible = derby;
    this.derbyColliders.forEach((c) => c.setEnabled(derby));
    this.checkpoint.visible = mode === 'race';
  }
  update(camera?: T.Camera) {
    if(camera) {
      updateForestView(camera);
      for (const lod of this.workyardLODs) lod.update(camera);
      for (const lod of this.cutLODs) lod.update(camera);
      for (const lod of this.roadsideLODs) lod.update(camera);
      for (const lod of this.extensionLODs) lod.update(camera);
      for (const lod of this.headwallLODs) lod.update(camera);
      for (const lod of this.eastBayLODs) lod.update(camera);
      for (const lod of this.westWallLODs) lod.update(camera);
      for (const lod of this.roadApproachLODs) lod.update(camera);
    }
    for (const p of this.props) {
      p.mesh.position.copy(p.body.translation());
      p.mesh.quaternion.copy(p.body.rotation());
    }
  }
  applyProps(states:{id:number;p:{x:number;y:number;z:number};q:{x:number;y:number;z:number;w:number};v:{x:number;y:number;z:number};av:{x:number;y:number;z:number}}[]) {
    for(const state of states){const p=this.props[state.id];if(!p)continue;p.body.setBodyType(R.RigidBodyType.KinematicPositionBased,true);p.body.setTranslation(state.p,true);p.body.setRotation(state.q,true);p.body.setLinvel(state.v,true);p.body.setAngvel(state.av,true);p.mesh.position.copy(state.p);p.mesh.quaternion.copy(state.q);}
  }
  resetProps() {
    for (const p of this.props) {
      p.body.setBodyType(R.RigidBodyType.Dynamic,true);
      p.body.setRotation({x:0,y:0,z:0,w:1},true);
      p.body.setTranslation(p.start, true);
      p.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      p.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }
}
