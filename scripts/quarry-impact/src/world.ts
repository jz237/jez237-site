import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { pbr, url } from './assets';
import { terrainHeight, trackPoint } from './rules';
let seed = 9311;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const dummy = new T.Object3D();
export class Quarry {
  derbyWalls: T.Group = new T.Group();
  derbyColliders: R.Collider[] = [];
  props: { mesh: T.Mesh; body: R.RigidBody; start: T.Vector3 }[] = [];
  scenery = new T.Group();
  road: T.Mesh;
  checkpoint = new T.Group();
  sun: T.DirectionalLight;
  constructor(
    public scene: T.Scene,
    public physics: R.World,
  ) {
    scene.add(this.scenery, this.derbyWalls, this.checkpoint);
    scene.fog = new T.FogExp2(0xaaa995, 0.0028);
    scene.add(new T.HemisphereLight(0xc1d5e7, 0x7c6a47, 0.55));
    this.sun = new T.DirectionalLight(0xffdfba, 2.4);
    this.sun.position.set(-70, 95, 45);
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
    const ground = pbr('mud', 1, {
      color: 0xb5ac8c,
      normalScale: new T.Vector2(0.65, 0.65),
    });
    const rock = pbr('rock', 1, { color: 0xaaa699 });
    const asphalt = pbr('asphalt', 1);
    const geo = new T.PlaneGeometry(640, 640, 192, 192);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position,
      uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
      uv.setXY(i, x / 9, z / 9);
    }
    geo.computeVertexNormals();
    const terrain = new T.Mesh(geo, ground);
    terrain.receiveShadow = true;
    scene.add(terrain);
    physics.createCollider(
      R.ColliderDesc.trimesh(
        new Float32Array(pos.array),
        new Uint32Array(geo.index!.array),
      ).setFriction(0.85),
    );
    // Broad arena floor: small aggregate at a believable real-world scale.
    const arenaGeo = new T.CircleGeometry(45, 96);
    arenaGeo.rotateX(-Math.PI / 2);
    const aUV = arenaGeo.attributes.uv;
    for (let i = 0; i < aUV.count; i++)
      aUV.setXY(
        i,
        arenaGeo.attributes.position.getX(i) / 6,
        arenaGeo.attributes.position.getZ(i) / 6,
      );
    const arena = new T.Mesh(
      arenaGeo,
      pbr('coast_sand_rocks_02', 1, { color: 0x9b947e }),
    );
    arena.position.y = 0.018;
    arena.receiveShadow = true;
    scene.add(arena);
    // Quarry benches form irregular exposed walls, rather than a flat background ring.
    const vertices: number[] = [],
      indices: number[] = [],
      uvs: number[] = [];
    const rings = [
      { r: 137, h: 0 },
      { r: 148, h: 13 },
      { r: 155, h: 14 },
      { r: 164, h: 28 },
      { r: 175, h: 29 },
      { r: 187, h: 40 },
    ];
    for (let j = 0; j < rings.length; j++)
      for (let i = 0; i <= 192; i++) {
        const a = (i / 192) * Math.PI * 2;
        const wobble =
          Math.sin(a * 9) * 5 +
          Math.cos(a * 17) * 2 +
          Math.sin(a * 61 + j * 3.2) * 1.1;
        const r = rings[j].r + wobble;
        vertices.push(
          Math.sin(a) * r * 1.08,
          rings[j].h + Math.sin(a * 5) * 3 + Math.sin(a * 37 + j * 0.7) * 1.3,
          Math.cos(a) * r,
        );
        uvs.push((i / 192) * 95, j * 2.4);
      }
    for (let j = 0; j < rings.length - 1; j++)
      for (let i = 0; i < 192; i++) {
        const a = j * 193 + i;
        indices.push(a, a + 193, a + 1, a + 1, a + 193, a + 194);
      }
    const cliffGeo = new T.BufferGeometry();
    cliffGeo.setAttribute(
      'position',
      new T.Float32BufferAttribute(vertices, 3),
    );
    cliffGeo.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
    cliffGeo.setIndex(indices);
    cliffGeo.computeVertexNormals();
    rock.side = T.DoubleSide;
    const cliffs = new T.Mesh(cliffGeo, rock);
    cliffs.receiveShadow = true;
    cliffs.castShadow = true;
    scene.add(cliffs);
    physics.createCollider(
      R.ColliderDesc.trimesh(
        new Float32Array(vertices),
        new Uint32Array(indices),
      ),
    );
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
        ru.push(side === -1 ? 0 : 1, i / 5);
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
    let begin = 0,
      last = 0;
    for (let i = 0; i <= 360; i++) {
      const mat = i === 360 ? -1 : trackPoint(i / 360).z < -20 ? 1 : 0;
      if (mat !== last) {
        roadGeo.addGroup(begin * 6, (i - begin) * 6, last);
        begin = i;
        last = mat;
      }
    }
    this.road = new T.Mesh(roadGeo, [
      asphalt,
      pbr('coast_sand_rocks_02', 1, { color: 0xaaa48c }),
    ]);
    this.road.receiveShadow = true;
    scene.add(this.road);
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
      const col = physics.createCollider(
        R.ColliderDesc.cuboid(2.11, 0.58, 0.375)
          .setTranslation(x, 0.58, z)
          .setRotation(
            new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), a),
          )
          .setFriction(0.5),
      );
      this.derbyColliders.push(col);
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
    const stoneGeo = new T.IcosahedronGeometry(1, 1);
    const sp = stoneGeo.attributes.position;
    for (let i = 0; i < sp.count; i++)
      sp.setXYZ(
        i,
        sp.getX(i) * (1 + rand() * 0.35),
        sp.getY(i) * (1 + rand() * 0.35),
        sp.getZ(i) * (1 + rand() * 0.35),
      );
    stoneGeo.computeVertexNormals();
    const stones = new T.InstancedMesh(stoneGeo, rock, 360);
    stones.castShadow = true;
    stones.receiveShadow = true;
    for (let i = 0; i < 360; i++) {
      const a = rand() * Math.PI * 2,
        r = 132 + rand() * 14;
      dummy.position.set(Math.sin(a) * r * 1.06, rand() * 2, Math.cos(a) * r);
      dummy.scale.set(1 + rand() * 3, 0.7 + rand() * 3, 1 + rand() * 3);
      dummy.rotation.set(rand(), rand() * 6, rand());
      dummy.updateMatrix();
      stones.setMatrixAt(i, dummy.matrix);
    }
    scene.add(stones);
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
    if (solid)
      this.physics.createCollider(
        R.ColliderDesc.cuboid(s.x / 2, s.y / 2, s.z / 2).setTranslation(
          p.x,
          p.y,
          p.z,
        ),
      );
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
    const metal = new T.MeshStandardMaterial({
      color: 0x555f59,
      metalness: 0.6,
      roughness: 0.75,
    });
    const yellow = new T.MeshStandardMaterial({
      color: 0xb99c46,
      metalness: 0.4,
      roughness: 0.72,
    });
    const rubber = new T.MeshStandardMaterial({
      color: 0x222727,
      roughness: 0.95,
    });
    this.box(
      new T.Vector3(-72, 4, -39),
      new T.Vector3(21, 8, 13),
      metal,
      this.scenery,
      true,
    );
    for (let i = 0; i < 42; i++)
      this.box(
        new T.Vector3(-82.3 + i * 0.5, 4, -32.4),
        new T.Vector3(0.07, 7.8, 0.08),
        metal,
      );
    this.box(new T.Vector3(-72, 8.2, -39), new T.Vector3(22, 0.4, 14), metal);
    this.box(new T.Vector3(-72, 2, -32.3), new T.Vector3(6, 4, 0.15), rubber);
    this.sign('BLACKRIDGE WORKS', -72, -31, 0, 0.85);
    for (let i = 0; i < 3; i++) {
      const x = -92 + i * 8,
        z = -50;
      const silo = new T.Mesh(new T.CylinderGeometry(2.7, 2.7, 13, 24), metal);
      silo.position.set(x, 9, z);
      silo.castShadow = true;
      this.scenery.add(silo);
      for (const dx of [-2, 2])
        this.box(
          new T.Vector3(x + dx, 2, z),
          new T.Vector3(0.25, 4, 0.25),
          metal,
        );
    }
    // Parked articulated excavator, tracked base, hydraulic boom, bucket and cab glazing.
    const ex = new T.Group();
    ex.position.set(62, terrainHeight(62, -42), -42);
    ex.rotation.y = -0.8;
    this.scenery.add(ex);
    for (const x of [-1.6, 1.6]) {
      this.box(new T.Vector3(x, 0.6, 0), new T.Vector3(1, 1, 5.2), rubber, ex);
      for (let j = 0; j < 18; j++)
        this.box(
          new T.Vector3(x, 1.12, -2.5 + j * 0.29),
          new T.Vector3(1.05, 0.08, 0.15),
          metal,
          ex,
        );
    }
    this.box(
      new T.Vector3(0, 1.6, 0),
      new T.Vector3(3.3, 1.2, 3.8),
      yellow,
      ex,
    );
    this.box(
      new T.Vector3(-0.8, 3, -0.3),
      new T.Vector3(1.6, 1.8, 2),
      metal,
      ex,
    );
    this.box(
      new T.Vector3(-0.8, 3.2, 0.72),
      new T.Vector3(1.3, 1.2, 0.025),
      new T.MeshPhysicalMaterial({
        color: 0x809ba2,
        metalness: 0.6,
        roughness: 0.16,
      }),
      ex,
    );
    for (const [a, b, width] of [
      [new T.Vector3(0.5, 2, 1), new T.Vector3(0.5, 7, 4), 0.65],
      [new T.Vector3(0.5, 7, 4), new T.Vector3(0.5, 3, 8), 0.5],
    ] as [T.Vector3, T.Vector3, number][]) {
      const d = b.clone().sub(a);
      const beam = new T.Mesh(
        new T.BoxGeometry(width, d.length(), width),
        yellow,
      );
      beam.position.copy(a).add(b).multiplyScalar(0.5);
      beam.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
      ex.add(beam);
      const piston = new T.Mesh(
        new T.CylinderGeometry(0.08, 0.08, d.length() + 3, 12),
        metal,
      );
      piston.position.copy(beam.position).add(new T.Vector3(0.35, 0, 0));
      piston.quaternion.copy(beam.quaternion);
      ex.add(piston);
    }
    this.box(
      new T.Vector3(0.5, 2.5, 8),
      new T.Vector3(1.7, 1.3, 1.5),
      metal,
      ex,
    );
    this.physics.createCollider(
      R.ColliderDesc.cuboid(3, 2, 3).setTranslation(62, 2, -42),
    );
    for (let i = 0; i < 5; i++) {
      const x = -63 + i * 7,
        z = 59;
      this.box(
        new T.Vector3(x, 1.3, z),
        new T.Vector3(5.8, 2.6, 2.5),
        new T.MeshStandardMaterial({
          color: [0x59665d, 0x8d5947, 0x626d73][i % 3],
          metalness: 0.5,
          roughness: 0.8,
        }),
        this.scenery,
        true,
      );
      for (let n = 0; n < 18; n++)
        this.box(
          new T.Vector3(x - 2.8 + n * 0.32, 1.3, z + 1.27),
          new T.Vector3(0.07, 2.5, 0.05),
          metal,
        );
    }
  }
  playground() {
    const concrete = pbr('rock', 1, { color: 0x777971 });
    for (const [x, z] of [
      [65, 20],
      [-65, 12],
      [30, -70],
    ]) {
      const y = terrainHeight(x, z);
      const points = [
        -4, 0, -8, 4, 0, -8, -4, 2, 8, 4, 2, 8, -4, 0, 8, 4, 0, 8,
      ];
      const idx = [0, 2, 1, 1, 2, 3, 2, 4, 3, 3, 4, 5, 0, 4, 2, 1, 3, 5];
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(points, 3));
      g.setAttribute(
        'uv',
        new T.Float32BufferAttribute([0, 0, 1, 0, 0, 2, 1, 2, 0, 2, 1, 2], 2),
      );
      g.setIndex(idx);
      g.computeVertexNormals();
      const m = new T.Mesh(g, concrete);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      this.scenery.add(m);
      this.physics.createCollider(
        R.ColliderDesc.trimesh(
          new Float32Array(points),
          new Uint32Array(idx),
        ).setTranslation(x, y, z),
      );
    }
    const barrelMat = new T.MeshStandardMaterial({
      color: 0x95633f,
      metalness: 0.6,
      roughness: 0.8,
    });
    for (let i = 0; i < 22; i++) {
      const x = 55 + rand() * 12,
        z = -12 + rand() * 20,
        y = terrainHeight(x, z) + 0.6;
      const body = this.physics.createRigidBody(
        R.RigidBodyDesc.dynamic().setTranslation(x, y, z),
      );
      this.physics.createCollider(
        R.ColliderDesc.cylinder(0.55, 0.34).setMass(28).setFriction(0.7),
        body,
      );
      const mesh = new T.Mesh(
        new T.CylinderGeometry(0.34, 0.34, 1.1, 16),
        barrelMat,
      );
      mesh.castShadow = true;
      this.scenery.add(mesh);
      this.props.push({ mesh, body, start: new T.Vector3(x, y, z) });
    }
    const water = new T.MeshPhysicalMaterial({
      color: 0x444b43,
      metalness: 0.5,
      roughness: 0.14,
      transparent: true,
      opacity: 0.68,
    });
    for (let i = 0; i < 12; i++) {
      const a = rand() * 6.28,
        r = 10 + rand() * 27;
      const pg = new T.CircleGeometry(1.3 + rand() * 2.5, 32);
      const pp = pg.attributes.position;
      for (let k = 1; k < pp.count; k++) {
        const f = 0.85 + rand() * 0.3;
        pp.setXY(k, pp.getX(k) * f, pp.getY(k) * f);
      }
      const p = new T.Mesh(pg, water);
      p.rotation.x = -Math.PI / 2;
      p.position.set(Math.sin(a) * r, 0.025, Math.cos(a) * r);
      p.scale.y = 0.45 + rand() * 0.6;
      this.scenery.add(p);
    }
  }
  fences() {
    const metal = new T.MeshStandardMaterial({
      color: 0x6b716b,
      metalness: 0.6,
      roughness: 0.7,
    });
    const positions: number[] = [];
    for (let i = 0; i < 100; i++) {
      const a = (i / 100) * Math.PI * 2,
        r = 50;
      const x = Math.sin(a) * r,
        z = Math.cos(a) * r;
      if (i > 22 && i < 30) continue;
      this.box(new T.Vector3(x, 2, z), new T.Vector3(0.07, 4, 0.07), metal);
      const b = ((i + 1) / 100) * Math.PI * 2;
      for (let j = 0; j < 4; j++) {
        const h = 1.5 + j * 0.6;
        positions.push(x, h, z, Math.sin(b) * r, h, Math.cos(b) * r);
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    this.scenery.add(
      new T.LineSegments(
        g,
        new T.LineBasicMaterial({
          color: 0x69736e,
          transparent: true,
          opacity: 0.5,
        }),
      ),
    );
  }
  async trees() {
    await this.scannedRocks();
    const loader = new GLTFLoader();
    const needles = new T.TextureLoader().load(url('models/needle.webp'));
    needles.colorSpace = T.SRGBColorSpace;
    needles.anisotropy = 8;
    for (const kind of ['pine', 'spruce']) {
      const gltf = await loader.loadAsync(url('models/' + kind + '3d.glb'));
      const bounds = new T.Box3().setFromObject(gltf.scene);
      const h = bounds.max.y - bounds.min.y;
      const positions: { p: T.Vector3; s: number; r: number }[] = [];
      for (let i = 0; i < 240; i++) {
        const a = rand() * Math.PI * 2,
          r = 164 + rand() * 118;
        const x = Math.sin(a) * r * 1.08,
          z = Math.cos(a) * r;
        positions.push({
          p: new T.Vector3(x, terrainHeight(x, z), z),
          s: (9 + rand() * 14) / h,
          r: rand() * 6.28,
        });
      }
      for (let i = 0; i < 65; i++) {
        const a = rand() * Math.PI * 2,
          r = 118 + rand() * 14;
        const x = Math.sin(a) * r,
          z = Math.cos(a) * r;
        positions.push({
          p: new T.Vector3(x, terrainHeight(x, z), z),
          s: (6 + rand() * 9) / h,
          r: rand() * 6.28,
        });
      }
      const photo = new T.TextureLoader().load(url('models/' + kind + '.webp'));
      photo.colorSpace = T.SRGBColorSpace;
      photo.anisotropy = 8;
      const treeMaterial = new T.MeshStandardMaterial({
        map: photo,
        alphaTest: 0.4,
        side: T.DoubleSide,
        roughness: 0.92,
        color: 0xb4b9a7,
      });
      const treeGeo = new T.PlaneGeometry(0.64, 1);
      treeGeo.translate(0, 0.5, 0);
      const crowns = new T.InstancedMesh(
        treeGeo,
        treeMaterial,
        positions.length * 3,
      );
      crowns.castShadow = true;
      crowns.receiveShadow = true;
      positions.forEach((p, i) => {
        for (let k = 0; k < 3; k++) {
          dummy.position.copy(p.p);
          dummy.scale.setScalar(p.s * h);
          dummy.rotation.set(0, p.r + (k * Math.PI) / 3, 0);
          dummy.updateMatrix();
          crowns.setMatrixAt(i * 3 + k, dummy.matrix);
        }
      });
      crowns.computeBoundingSphere();
      this.scenery.add(crowns);
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse((o) => {
        if (!(o instanceof T.Mesh)) return;
        const geometry = o.geometry.clone().applyMatrix4(o.matrixWorld);
        const mat = (o.material as T.MeshStandardMaterial).clone();
        if (o.name === 'leaves') {
          mat.map = needles;
          mat.alphaTest = 0.4;
          mat.color.setHex(kind === 'pine' ? 0x9eab83 : 0x809982);
          mat.side = T.DoubleSide;
          mat.roughness = 0.9;
        } else mat.color.setHex(0x524b39);
        const nearby = positions.slice(-65);
        const mesh = new T.InstancedMesh(geometry, mat, nearby.length);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        nearby.forEach((p, i) => {
          dummy.position.copy(p.p);
          dummy.scale.setScalar(p.s);
          dummy.rotation.set(0, p.r, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.computeBoundingSphere();
        this.scenery.add(mesh);
      });
    }
  }

  async scannedRocks() {
    const gltf = await new GLTFLoader().loadAsync(url('models/rocks-lod.glb'));
    gltf.scene.updateMatrixWorld(true);
    let variant = 0;
    gltf.scene.traverse((o) => {
      if (!(o instanceof T.Mesh)) return;
      const geo = o.geometry.clone().applyMatrix4(o.matrixWorld);
      geo.computeBoundingBox();
      const bb = geo.boundingBox!;
      const center = bb.getCenter(new T.Vector3());
      geo.translate(-center.x, -bb.min.y, -center.z);
      const size = bb.getSize(new T.Vector3());
      const normalizer = 1 / Math.max(size.x, size.y, size.z);
      geo.scale(normalizer, normalizer, normalizer);
      const count = 60;
      const mesh = new T.InstancedMesh(geo, o.material, count);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      for (let i = 0; i < count; i++) {
        const a = ((i + variant * 0.17) / count) * Math.PI * 2;
        const r = 135 + rand() * 28;
        const x = Math.sin(a) * r * 1.08,
          z = Math.cos(a) * r;
        dummy.position.set(x, terrainHeight(x, z) - 1, z);
        const scale = 6 + rand() * 16;
        dummy.scale.set(
          scale * (0.7 + rand() * 0.5),
          scale * (0.6 + rand() * 0.7),
          scale,
        );
        dummy.rotation.set(0, rand() * 6.28, rand() * 0.3);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.computeBoundingSphere();
      this.scenery.add(mesh);
      variant++;
    });
  }
  setMode(mode: string) {
    const derby = mode === 'derby';
    this.derbyWalls.visible = derby;
    this.derbyColliders.forEach((c) => c.setEnabled(derby));
    this.checkpoint.visible = mode === 'race';
  }
  update() {
    for (const p of this.props) {
      p.mesh.position.copy(p.body.translation());
      p.mesh.quaternion.copy(p.body.rotation());
    }
  }
  resetProps() {
    for (const p of this.props) {
      p.body.setTranslation(p.start, true);
      p.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      p.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }
}
