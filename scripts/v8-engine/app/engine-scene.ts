import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { chargeState } from '@/lib/learning';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import {
  surfaceTexture,
  sectionCap,
  pistonGeometry,
  markingTexture,
} from './engine-finishes';
import { createOverlays, type FlowMode } from './engine-overlays';
import {
  cylinderState,
  R,
  RAD,
  PHASES,
  COLORS,
  CAM_Y,
  camRadius,
  valvetrainState,
} from '@/lib/mechanics';
export type View = 'assembled' | 'cutaway' | 'exploded';
export type Layers = {
  block: boolean;
  heads: boolean;
  pistons: boolean;
  crankshaft: boolean;
  valvetrain: boolean;
};
export type Part = {
  name: string;
  description: string;
  cylinder?: number;
  material?: string;
};
export type Settings = {
  angle: number;
  view: View;
  transparent: boolean;
  colors: boolean;
  layers: Layers;
  section: number;
  teaching: boolean;
  selectedCylinder: number;
  isolate: boolean;
  depthOfField: boolean;
  playing: boolean;
  connected: boolean;
  flows: FlowMode;
  presentation: boolean;
  quality: 'performance' | 'balanced' | 'ultra';
  lighting: 'studio' | 'technical' | 'dramatic';
};
const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
export function createEngineScene(
  host: HTMLElement,
  onPick: (p: Part) => void,
  onSection: (x: number) => void,
) {
  const scene = new T.Scene();
  scene.background = new T.Color().setRGB(0.012, 0.02, 0.026);
  const renderer = new T.WebGLRenderer({
    antialias: true,
    alpha: true,
    stencil: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute(
    'aria-label',
    'Interactive 3D V8 engine. Drag to orbit, scroll to zoom, right-drag to pan.',
  );
  const pmrem = new T.PMREMGenerator(renderer),
    room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.45;
  room.dispose();
  const camera = new T.PerspectiveCamera(35, 1, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 1.2;
  controls.maxDistance = 26;
  controls.maxPolarAngle = Math.PI * 0.91;
  const cameraTarget = V(8, 5.8, 10);
  const orbitTarget = V(0, 0.9, 0);
  let cameraTransition = false;
  camera.position.copy(cameraTarget);
  controls.target.set(0, 0.9, 0);
  controls.addEventListener('start', () => {
    cameraTransition = false;
  });
  const hemisphere = new T.HemisphereLight(0xc4dcff, 0x2a231e, 0.9);
  scene.add(hemisphere);
  const studioLights: T.RectAreaLight[] = [];
  RectAreaLightUniformsLib.init();
  [
    [0xffe9d2, 5, 4, 7, 3, 5, 4],
    [0xbddcff, 4, -5, 4, 1, 4, 6],
    [0xc7ffff, 7, 0, 5, -6, 3, 5],
  ].forEach(([color, intensity, x, y, z, w, h]) => {
    const light = new T.RectAreaLight(color, intensity, w, h);
    light.position.set(x, y, z);
    light.lookAt(0, 1, 0);
    studioLights.push(light);
    scene.add(light);
  });
  const key = new T.DirectionalLight(0xffefdc, 2.2);
  key.position.set(4, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, {
    left: -6,
    right: 6,
    top: 7,
    bottom: -5,
    near: 0.1,
    far: 25,
  });
  key.shadow.normalBias = 0.025;
  key.shadow.bias = -0.00015;
  key.shadow.radius = 3;
  scene.add(key);
  [
    [0xffe1be, 100, 4, 8, 4],
    [0xa1c5ff, 90, -5, 4, 1],
    [0xffffff, 100, 0, 5, -6],
  ].forEach(([color, intensity, x, y, z]) => {
    const light = new T.PointLight(color, intensity * 0.18, 35, 2);
    light.position.set(x, y, z);
    scene.add(light);
  });
  const engine = new T.Group();
  scene.add(engine);
  const mat = (color: number, metalness = 0.8, roughness = 0.3) =>
    new T.MeshPhysicalMaterial({ color, metalness, roughness });
  const steel = mat(0xa7b3bd, 0.92, 0.24),
    aluminum = mat(0xd2d7d7, 0.78, 0.32),
    dark = mat(0x30383e, 0.78, 0.33),
    black = mat(0x121920, 0.35, 0.42),
    brass = mat(0xbba16c, 0.8, 0.29);
  const blockMat = mat(0x75818b, 0.7, 0.43),
    headMat = mat(0x8c979d, 0.8, 0.32),
    coverMat = mat(0x173c43, 0.72, 0.31);
  const castTexture = surfaceTexture('cast'),
    brushedTexture = surfaceTexture('brushed'),
    rubberTexture = surfaceTexture('rubber');
  for (const material of [blockMat, headMat]) {
    material.bumpMap = castTexture;
    material.bumpScale = 0.008;
    material.roughnessMap = castTexture;
    material.roughness = 0.85;
  }
  aluminum.bumpMap = brushedTexture;
  aluminum.bumpScale = 0.0015;
  aluminum.roughness = 0.46;
  steel.bumpMap = brushedTexture;
  steel.bumpScale = 0.001;
  steel.roughness = 0.3;
  steel.clearcoat = 0.16;
  steel.clearcoatRoughness = 0.22;
  black.bumpMap = rubberTexture;
  black.bumpScale = 0.002;
  black.roughness = 0.8;
  black.metalness = 0.05;
  coverMat.roughness = 0.25;
  steel.name = 'Brushed steel';
  aluminum.name = 'Machined aluminum';
  dark.name = 'Dark steel';
  black.name = 'Rubber / polymer finish';
  brass.name = 'Brass / bronze finish';
  blockMat.name = headMat.name = 'Cast aluminum';
  coverMat.name = 'Coated aluminum';
  const cutPlane = new T.Plane(V(-1, 0, 0), 0.16),
    pickables: T.Object3D[] = [];
  const part = (name: string, description: string, cylinder?: number) => ({
    name,
    description,
    cylinder,
  });
  function mesh(
    geo: T.BufferGeometry,
    material: T.Material,
    parent: T.Object3D,
    position = V(),
    info?: Part,
  ) {
    const m = new T.Mesh(geo, material);
    geo.computeBoundingSphere();
    m.castShadow = (geo.boundingSphere?.radius || 0) > 0.18;
    m.receiveShadow = true;
    m.position.copy(position);
    parent.add(m);
    if (info) {
      m.userData.part = {
        ...info,
        material: material.name || 'Illustrative component finish',
      };
      pickables.push(m);
    }
    return m;
  }
  const box = (
    x: number,
    y: number,
    z: number,
    m: T.Material,
    p: T.Object3D,
    pos = V(),
    info?: Part,
  ) =>
    mesh(
      new RoundedBoxGeometry(x, y, z, 2, Math.min(x, y, z) * 0.16),
      m,
      p,
      pos,
      info,
    );
  const cyl = (
    r: number,
    h: number,
    m: T.Material,
    p: T.Object3D,
    pos = V(),
    info?: Part,
    segments = 40,
  ) => mesh(new T.CylinderGeometry(r, r, h, segments), m, p, pos, info);
  function axisCylinder(
    r: number,
    h: number,
    m: T.Material,
    p: T.Object3D,
    pos = V(),
    info?: Part,
  ) {
    const c = cyl(r, h, m, p, pos, info);
    c.rotation.x = Math.PI / 2;
    return c;
  }
  function ring(
    r: number,
    t: number,
    m: T.Material,
    p: T.Object3D,
    pos = V(),
    horizontal = false,
    info = part(
      'Machined retaining ring',
      'A precision ring locates or retains the adjacent component.',
    ),
  ) {
    const q = mesh(new T.TorusGeometry(r, t, 8, 48), m, p, pos, info);
    if (horizontal) q.rotation.x = Math.PI / 2;
    return q;
  }
  function bolt(p: T.Object3D, pos: T.Vector3) {
    ring(
      0.085,
      0.01,
      aluminum,
      p,
      pos.clone().add(V(0, -0.044, 0)),
      true,
      part(
        'Machined bolt seat',
        'A recessed counterbore locates the washer on a machined mounting face.',
      ),
    );
    cyl(
      0.065,
      0.07,
      steel,
      p,
      pos,
      part(
        'Hex-head fastener',
        'Clamps the mating components together with bolt preload.',
      ),
      6,
    );
    cyl(
      0.09,
      0.025,
      dark,
      p,
      pos.clone().add(V(0, -0.03, 0)),
      part(
        'Bolt washer',
        'Spreads the fastener load across the machined mounting surface.',
      ),
    );
  }
  function link(m: T.Mesh, a: T.Vector3, b: T.Vector3) {
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
    m.scale.y = a.distanceTo(b);
  }
  const block = new T.Group(),
    heads = new T.Group(),
    crank = new T.Group(),
    pistonGroup = new T.Group(),
    valveGroup = new T.Group();
  engine.add(block, heads, crank, pistonGroup, valveGroup);
  const crankInfo = part(
    'Cross-plane crankshaft',
    'Four shared crankpins, arranged in two perpendicular planes, convert piston motion into rotation. Each pin carries two rods side by side.',
  );
  for (let j = 0; j < 5; j++) {
    const z = 2.6 - j * 1.3;
    axisCylinder(0.19, 0.56, steel, crank, V(0, 0, z), crankInfo);
    const bearing = new T.Group();
    block.add(bearing);
    box(
      0.84,
      0.22,
      0.25,
      dark,
      bearing,
      V(0, -0.35, z),
      part(
        'Main bearing cap',
        'Five main bearings support the crankshaft on its rotation axis.',
      ),
    );
    [-0.32, 0.32].forEach((x) => bolt(bearing, V(x, -0.2, z)));
  }
  PHASES.forEach((phase, j) => {
    const z = 1.95 - j * 1.3,
      x = R * Math.sin(phase * RAD),
      y = R * Math.cos(phase * RAD);
    axisCylinder(0.16, 0.74, steel, crank, V(x, y, z), crankInfo);
    [-0.43, 0.43].forEach((dz) => {
      const web = box(0.34, 1, 0.16, dark, crank, V(), crankInfo);
      link(web, V(-x * 0.82, -y * 0.82, z + dz), V(x, y, z + dz));
      axisCylinder(
        0.3,
        0.17,
        dark,
        crank,
        V(-x * 0.7, -y * 0.7, z + dz),
        part(
          'Counterweight',
          'Counterweights oppose the rotating crankpins and help balance the rotating assembly.',
        ),
      );
    });
  });
  axisCylinder(
    0.78,
    0.16,
    dark,
    crank,
    V(0, 0, -3.03),
    part(
      'Flywheel',
      'Stores rotational energy between power strokes to smooth crankshaft speed.',
    ),
  );
  ring(0.69, 0.035, steel, crank, V(0, 0, -3.13));
  for (let k = 0; k < 60; k++) {
    const a = (k * Math.PI) / 30,
      tooth = box(
        0.055,
        0.075,
        0.18,
        steel,
        crank,
        V(0.79 * Math.sin(a), 0.79 * Math.cos(a), -3.03),
        part(
          'Flywheel ring-gear tooth',
          'The starter motor engages this gear to turn the engine during starting.',
        ),
      );
    tooth.rotation.z = -a;
  }
  axisCylinder(
    0.45,
    0.25,
    black,
    crank,
    V(0, 0, 3.1),
    part(
      'Crank pulley',
      'Rotates with the crankshaft; the adjacent timing sprocket drives the camshaft at half speed.',
    ),
  );
  [2.99, 3.1, 3.21].forEach((z) => ring(0.45, 0.024, steel, crank, V(0, 0, z)));
  axisCylinder(0.17, 0.6, steel, crank, V(0, 0, 2.85), crankInfo);
  axisCylinder(0.17, 0.6, steel, crank, V(0, 0, -2.85), crankInfo);
  const banks: {
    sign: number;
    block: T.Group;
    head: T.Group;
    valve: T.Group;
    covers: T.Object3D[];
  }[] = [];
  const pistons: {
    id: number;
    piston: T.Group;
    rod: T.Mesh;
    big: T.Group;
    small: T.Mesh;
    glow: T.Mesh;
    material: T.MeshStandardMaterial;
  }[] = [];
  const valves: {
    id: number;
    type: 'intake' | 'exhaust';
    moving: T.Group;
    spring: T.Mesh;
    rocker: T.Group;
    pushrod: T.Mesh;
    follower: T.Mesh;
    bank: T.Group;
    x: number;
    z: number;
  }[] = [];
  function slabWithBores(
    parent: T.Group,
    material: T.Material,
    top: number,
    height: number,
    sign: number,
  ) {
    const shape = new T.Shape();
    shape.moveTo(-0.52, -2.7);
    shape.lineTo(0.52, -2.7);
    shape.lineTo(0.68, -2.54);
    shape.lineTo(0.68, 2.54);
    shape.lineTo(0.52, 2.7);
    shape.lineTo(-0.52, 2.7);
    shape.lineTo(-0.68, 2.54);
    shape.lineTo(-0.68, -2.54);
    shape.closePath();
    for (let j = 0; j < 4; j++) {
      for (const x of top > 2.6 ? [-0.21, 0.21] : [0]) {
        const hole = new T.Path();
        hole.absarc(
          0,
          1.95 - j * 1.3 + sign * 0.14 + x,
          top > 2.6 ? 0.175 : 0.49,
          0,
          Math.PI * 2,
          true,
        );
        shape.holes.push(hole);
      }
    }
    const slab = mesh(
      new T.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: true,
        bevelSize: 0.035,
        bevelThickness: 0.025,
        bevelSegments: 3,
        steps: 1,
      }),
      material,
      parent,
      V(0, top, 0),
      part(
        top > 2.6 ? 'Cylinder head' : 'Cylinder block',
        'Two banks of four bores meet at 90°. The cutaway removes the near half of the casting to expose the mechanism.',
      ),
    );
    slab.rotation.x = Math.PI / 2;
  }
  [-1, 1].forEach((sign) => {
    const bank = new T.Group(),
      head = new T.Group(),
      valve = new T.Group();
    bank.rotation.z =
      head.rotation.z =
      valve.rotation.z =
        (-sign * Math.PI) / 4;
    block.add(bank);
    heads.add(head);
    valveGroup.add(valve);
    slabWithBores(bank, blockMat, 2.48, 1.27, sign);
    slabWithBores(head, headMat, 2.7, 0.2, sign);
    for (const side of [-1, 1]) {
      for (const y of [1.3, 2.32])
        box(
          0.07,
          0.08,
          5.25,
          blockMat,
          bank,
          V(side * 0.69, y, 0),
          part(
            'Block reinforcement rib',
            'Adds stiffness to the cylinder-bank casting.',
          ),
        );
      for (let j = 0; j < 4; j++) {
        const z = 1.95 - j * 1.3 + sign * 0.14;
        const plug = cyl(
          0.16,
          0.035,
          brass,
          bank,
          V(side * 0.716, 1.73, z),
          part(
            'Core plug',
            'Seals an opening used during the casting of the cylinder block.',
          ),
        );
        plug.rotation.z = Math.PI / 2;
        ring(0.14, 0.016, dark, bank, V(side * 0.735, 1.73, z)).rotation.y =
          Math.PI / 2;
        box(
          0.09,
          1.05,
          0.07,
          blockMat,
          bank,
          V(side * 0.69, 1.82, z - 0.53),
          part(
            'Block reinforcement rib',
            'Adds stiffness between adjacent cylinders.',
          ),
        );
        box(
          0.07,
          0.15,
          0.37,
          dark,
          head,
          V(side * 0.7, 2.61, z),
          part(
            'Head port',
            'Schematic intake or exhaust passage through the cylinder head.',
          ),
        );
      }
    }
    const covers: T.Object3D[] = [];
    covers.push(
      box(
        1.16,
        0.22,
        5.18,
        coverMat,
        head,
        V(0, 3.45, 0),
        part(
          'Valve cover',
          'Protects the rocker arms and valve springs. Removed in cutaway view.',
        ),
      ),
    );
    for (let x = -0.4; x <= 0.41; x += 0.2)
      covers.push(
        box(
          0.04,
          0.04,
          4.72,
          aluminum,
          head,
          V(x, 3.58, 0),
          part(
            'Valve-cover fin',
            'Raised aluminum ribs stiffen the cover and increase its surface area.',
          ),
        ),
      );
    for (let j = 0; j < 5; j++)
      [-0.57, 0.57].forEach((x) => bolt(head, V(x, 2.75, 2.5 - j * 1.25)));
    banks.push({ sign, block: bank, head, valve, covers });
    for (let j = 0; j < 4; j++) {
      const id = j * 2 + (sign === 1 ? 1 : 2),
        s = cylinderState(id, 0),
        z = s.z;
      mesh(
        new T.CylinderGeometry(0.488, 0.488, 1.25, 48, 1, true),
        headMat,
        bank,
        V(0, 1.86, z),
        part(
          `Cylinder ${id} liner`,
          'The piston slides along this bore. The bank angle is fixed at 45° from vertical.',
          id,
        ),
      );
      const piston = new T.Group();
      pistonGroup.add(piston);
      piston.rotation.z = -s.beta;
      const pm = aluminum.clone();
      pm.vertexColors = true;
      const pg = pistonGeometry(),
        pc = pg.attributes.position,
        tint = new Float32Array(pc.count * 3);
      for (let i = 0; i < pc.count; i++) {
        const r = Math.hypot(pc.getX(i), pc.getZ(i));
        const carbon =
          pc.getY(i) > 0.19 ? 0.08 + 0.18 * Math.pow(r / 0.458, 3) : 0;
        tint.set([1 - carbon, 1 - carbon * 1.1, 1 - carbon * 1.25], i * 3);
      }
      pg.setAttribute('color', new T.BufferAttribute(tint, 3));
      mesh(
        pg,
        pm,
        piston,
        V(),
        part(
          `Piston ${id}`,
          'Combustion pushes the piston down. Its wrist pin transfers force through a fixed-length connecting rod.',
          id,
        ),
      );
      for (const z of [-0.28, 0.28])
        axisCylinder(
          0.145,
          0.18,
          aluminum,
          piston,
          V(0, 0, z),
          part(
            `Wrist-pin boss ${id}`,
            'Reinforced internal bosses carry the wrist-pin load into the piston crown.',
            id,
          ),
        );
      [-0.05, 0.08, 0.15].forEach((y) =>
        ring(0.458, 0.012, dark, piston, V(0, y, 0), true),
      );
      axisCylinder(
        0.092,
        0.87,
        steel,
        piston,
        V(),
        part(
          `Wrist pin ${id}`,
          'A pivot through the piston allows the rod to swing as the crankpin rotates.',
          id,
        ),
      );
      const rod = box(
        0.105,
        1,
        0.13,
        aluminum,
        pistonGroup,
        V(),
        part(
          `Connecting rod ${id}`,
          'A rigid 162 mm rod joins the wrist pin to the crankpin. Its angle is solved from the slider–crank geometry.',
          id,
        ),
      );
      const forged = new T.Shape();
      forged.moveTo(-0.09, -0.5);
      forged.lineTo(0.09, -0.5);
      forged.lineTo(0.055, -0.28);
      forged.lineTo(0.04, 0.28);
      forged.lineTo(0.07, 0.5);
      forged.lineTo(-0.07, 0.5);
      forged.lineTo(-0.04, 0.28);
      forged.lineTo(-0.055, -0.28);
      forged.closePath();
      rod.geometry.dispose();
      rod.geometry = new T.ExtrudeGeometry(forged, {
        depth: 0.1,
        bevelEnabled: true,
        bevelSize: 0.012,
        bevelThickness: 0.012,
        bevelSegments: 2,
        steps: 1,
      });
      rod.geometry.translate(0, 0, -0.05);
      rod.material = steel;
      const big = new T.Group();
      pistonGroup.add(big);
      ring(
        0.18,
        0.045,
        aluminum,
        big,
        V(),
        false,
        part(
          `Connecting-rod big end · ${id}`,
          'Encloses the bearing around the shared crankpin.',
          id,
        ),
      );
      [-0.16, 0.16].forEach((x) =>
        box(0.055, 0.08, 0.2, steel, big, V(x, 0, 0)),
      );
      const small = axisCylinder(0.1, 0.18, steel, pistonGroup, V());
      const glow = mesh(
        new T.CylinderGeometry(0.445, 0.445, 1, 32),
        new T.MeshBasicMaterial({
          color: COLORS[0],
          transparent: true,
          opacity: 0.13,
          depthWrite: false,
        }),
        pistonGroup,
      );
      glow.rotation.z = -s.beta;
      pistons.push({ id, piston, rod, big, small, glow, material: pm });
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 128;
      labelCanvas.height = 128;
      const ctx = labelCanvas.getContext('2d')!;
      ctx.fillStyle = '#112025';
      ctx.beginPath();
      ctx.arc(64, 64, 43, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#829699';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#eef2ed';
      ctx.font = '500 52px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(id), 64, 67);
      const sprite = new T.Sprite(
        new T.SpriteMaterial({
          map: new T.CanvasTexture(labelCanvas),
          depthTest: false,
          transparent: true,
        }),
      );
      sprite.position.set(sign * 2.05, 2.45, z);
      sprite.scale.set(0.36, 0.36, 0.36);
      engine.add(sprite);
      sprite.userData.part = part(
        `Cylinder ${id}`,
        'Select a cylinder to follow its four-stroke cycle.',
        id,
      );
      pickables.push(sprite);
      (['intake', 'exhaust'] as const).forEach((type, k) => {
        const x = 0,
          valveZ = z + (k === 0 ? -0.21 : 0.21),
          moving = new T.Group();
        valve.add(moving);
        moving.position.set(x, 0, valveZ);
        const vi = part(
          `${type === 'intake' ? 'Intake' : 'Exhaust'} valve · ${id}`,
          type === 'intake'
            ? 'Opens during the intake stroke to admit fresh charge. Idealized timing: 360–540° after firing.'
            : 'Opens during the exhaust stroke to release spent gas. Idealized timing: 180–360° after firing.',
          id,
        );
        cyl(0.17, 0.045, steel, moving, V(0, 2.51, 0), vi);
        cyl(0.032, 0.69, steel, moving, V(0, 2.88, 0), vi);
        cyl(0.105, 0.045, brass, moving, V(0, 3.2, 0), vi);
        const pts = [];
        for (let t = 0; t <= 160; t++) {
          const a = (t / 160) * Math.PI * 14;
          pts.push(V(0.084 * Math.cos(a), t / 160, 0.084 * Math.sin(a)));
        }
        const spring = mesh(
          new T.TubeGeometry(new T.CatmullRomCurve3(pts), 160, 0.014, 5, false),
          dark,
          valve,
          V(x, 2.82, valveZ),
          part(
            `Valve spring ${id}`,
            'The spring closes the valve and keeps the follower in contact with the cam.',
            id,
          ),
        );
        spring.scale.y = 0.36;
        const rocker = new T.Group();
        rocker.position.set(-sign * 0.36, 3.23, valveZ);
        valve.add(rocker);
        box(
          0.72,
          0.075,
          0.105,
          brass,
          rocker,
          V(),
          part(
            `Rocker arm ${id}`,
            'A pivoting rocker transfers pushrod movement to the valve stem.',
            id,
          ),
        );
        const pushrod = cyl(
          0.023,
          1,
          steel,
          valve,
          V(),
          part(
            `Pushrod ${id}`,
            'Transfers cam lift from the central camshaft to the rocker arm.',
            id,
          ),
        );
        const follower = cyl(
          0.05,
          0.14,
          dark,
          valve,
          V(),
          part(
            'Cam follower',
            'A radial follower transfers the cam profile to the fixed-length pushrod.',
            id,
          ),
        );
        cyl(
          0.055,
          0.36,
          steel,
          valve,
          V(-sign * 0.36, 3.04, valveZ),
          part(
            `Rocker stud · ${id}`,
            'Supports the rocker fulcrum above the cylinder head.',
            id,
          ),
        );
        valves.push({
          id,
          type,
          moving,
          spring,
          rocker,
          pushrod,
          follower,
          bank: valve,
          x,
          z: valveZ,
        });
      });
    }
  });
  const cam = new T.Group();
  cam.position.y = CAM_Y;
  valveGroup.add(cam);
  const camInfo = part(
    'Camshaft',
    'Rotates once for every two crankshaft revolutions. Sixteen phased lobes actuate the intake and exhaust valves.',
  );
  axisCylinder(0.105, 5.6, steel, cam, V(), camInfo);
  valves.forEach(({ id, type, z }) => {
    const profile = new T.Shape();
    for (let i = 0; i <= 256; i++) {
      const phi = (i / 256) * Math.PI * 2,
        r = camRadius(id, phi, type);
      if (i === 0) profile.moveTo(r * Math.sin(phi), r * Math.cos(phi));
      else profile.lineTo(r * Math.sin(phi), r * Math.cos(phi));
    }
    profile.closePath();
    mesh(
      new T.ExtrudeGeometry(profile, { depth: 0.1, bevelEnabled: false }),
      dark,
      cam,
      V(0, 0, z - 0.05),
      camInfo,
    );
  });
  function sprocket(radius: number, teeth: number, parent: T.Group, y: number) {
    const g = new T.Group();
    g.position.set(0, y, 2.88);
    parent.add(g);
    axisCylinder(
      radius - 0.035,
      0.11,
      dark,
      g,
      V(),
      part(
        'Timing sprocket',
        'The cam sprocket has twice as many teeth as the crank sprocket, producing a 2:1 reduction.',
      ),
    );
    ring(radius - 0.07, 0.025, steel, g);
    for (let i = 0; i < teeth; i++) {
      const a = (i * Math.PI * 2) / teeth,
        t = box(
          0.045,
          0.07,
          0.12,
          steel,
          g,
          V(radius * Math.sin(a), radius * Math.cos(a), 0),
          part(
            'Timing sprocket tooth',
            'Engages the timing chain to keep the camshaft synchronized with the crankshaft.',
          ),
        );
      t.rotation.z = -a;
    }
    return g;
  }
  const lower = sprocket(0.22, 20, valveGroup, 0),
    upper = sprocket(0.44, 40, valveGroup, CAM_Y);
  const alpha = Math.asin((0.44 - 0.22) / CAM_Y),
    chainPoints: T.Vector3[] = [];
  const arc = (
    cy: number,
    r: number,
    start: number,
    end: number,
    n: number,
  ) => {
    for (let i = 0; i <= n; i++) {
      const a = start + ((end - start) * i) / n;
      chainPoints.push(V(r * Math.cos(a), cy + r * Math.sin(a), 2.88));
    }
  };
  arc(CAM_Y, 0.46, -alpha, Math.PI + alpha, 50);
  arc(0, 0.24, Math.PI + alpha, Math.PI * 2 - alpha, 30);
  const chainCurve = new T.CatmullRomCurve3(chainPoints, true, 'centripetal');
  const chainLinks: T.Mesh[] = [];
  for (let i = 0; i < 100; i++)
    chainLinks.push(
      box(
        0.055,
        0.047,
        0.14,
        brass,
        valveGroup,
        V(),
        part(
          'Timing chain',
          'An endless chain couples the 20-tooth crank sprocket to the 40-tooth cam sprocket.',
        ),
      ),
    );
  const pan = box(
    1.5,
    0.42,
    5.7,
    black,
    block,
    V(0, -0.85, 0),
    part(
      'Oil pan',
      'Collects lubricating oil beneath the rotating assembly. Oil flow is not simulated.',
    ),
  );
  const platform = mesh(
    new T.CylinderGeometry(4.4, 4.5, 0.08, 96),
    new T.MeshPhysicalMaterial({
      color: 0x101b21,
      metalness: 0.65,
      roughness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.45,
    }),
    scene,
    V(0, -1.19, 0),
  );
  const platformRim = ring(
    4.3,
    0.009,
    mat(0x557070, 0.5, 0.5),
    scene,
    V(0, -1.14, 0),
    true,
  );
  const contactCanvas = document.createElement('canvas');
  contactCanvas.width = contactCanvas.height = 128;
  const context = contactCanvas.getContext('2d')!,
    gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,.45)');
  gradient.addColorStop(0.55, 'rgba(0,0,0,.2)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const contactTexture = new T.CanvasTexture(contactCanvas);
  const contact = mesh(
    new T.PlaneGeometry(6.4, 6.4),
    new T.MeshBasicMaterial({
      map: contactTexture,
      transparent: true,
      depthWrite: false,
    }),
    scene,
    V(0, -1.144, 0),
  );
  contact.rotation.x = -Math.PI / 2;
  contact.castShadow = false;
  const castingMaterials: T.MeshStandardMaterial[] = [];
  // Decorative geometry stays in its owning assembly; kinematics are unchanged.
  const ceramic = mat(0xf2ede1, 0.05, 0.24),
    copper = mat(0xa47753, 0.85, 0.3);
  function tube(
    points: T.Vector3[],
    radius: number,
    material: T.Material,
    parent: T.Object3D,
    info: Part,
  ) {
    const geometry = new T.TubeGeometry(
      new T.CatmullRomCurve3(points),
      40,
      radius,
      10,
      false,
    );
    if (
      info.name.startsWith('Exhaust header') &&
      material instanceof T.MeshStandardMaterial
    ) {
      material = material.clone();
      (material as T.MeshStandardMaterial).vertexColors = true;
      const uv = geometry.attributes.uv,
        colors = new Float32Array(uv.count * 3);
      for (let i = 0; i < uv.count; i++) {
        const t = uv.getX(i),
          c = new T.Color(0xa78654);
        if (t < 0.35) c.lerp(new T.Color(0x878da7), t / 0.35);
        else
          c.copy(new T.Color(0x878da7)).lerp(
            new T.Color(0xc6c4bc),
            (t - 0.35) / 0.65,
          );
        c.toArray(colors, i * 3);
      }
      geometry.setAttribute('color', new T.BufferAttribute(colors, 3));
    }
    return mesh(geometry, material, parent, V(), info);
  }
  const markingTextures: T.Texture[] = [];
  banks.forEach(({ sign, head, block: bank, covers }) => {
    const stamp = markingTexture(`V8  •  ${sign === 1 ? 'LH' : 'RH'}  0555`);
    markingTextures.push(stamp);
    const stampMat = new T.MeshStandardMaterial({
      map: stamp,
      transparent: true,
      depthWrite: false,
      metalness: 0.45,
      roughness: 0.7,
      clippingPlanes: [cutPlane],
    });
    const badge = mesh(
      new T.PlaneGeometry(1.15, 0.29),
      stampMat,
      head,
      V(sign * 0.687, 2.59, 0),
      part(
        'Casting identification',
        'Illustrative bank and casting identifier, stamped into the machined side face.',
      ),
    );
    badge.rotation.y = (sign * Math.PI) / 2;
    for (const side of [-1, 1]) {
      box(
        0.009,
        0.012,
        4.95,
        dark,
        bank,
        V(side * 0.679, 1.94, 0),
        part(
          'Casting parting seam',
          'A subtle seam marks where the casting mold halves meet.',
        ),
      );
      box(
        0.012,
        0.009,
        4.98,
        copper,
        head,
        V(side * 0.68, 2.49, 0),
        part(
          'Head gasket edge',
          'The exposed edge of the multilayer sealing gasket.',
        ),
      );
    }
    slabWithBores(head, copper, 2.49, 0.022, sign);
    const gasket = head.children[head.children.length - 1];
    gasket.userData.part = part(
      'Multi-layer head gasket',
      'Seals the joint between block and cylinder head, separating combustion pressure from coolant and oil passages.',
    );
    for (let j = 0; j < 4; j++) {
      const id = j * 2 + (sign === 1 ? 1 : 2),
        z = cylinderState(id, 0).z;
      const hi = part(
        `Exhaust header · cylinder ${id}`,
        'Carries hot exhaust gas away from the cylinder head. Individual primary pipes are shown; the downstream collector is omitted.',
        id,
      );
      tube(
        [
          V(sign * 0.7, 2.61, z),
          V(sign * 1.02, 2.61, z),
          V(sign * 1.3, 2.35, z),
          V(sign * 1.42, 1.88, z),
        ],
        0.115,
        steel,
        head,
        hi,
      );
      const flange = box(
        0.055,
        0.34,
        0.46,
        dark,
        head,
        V(sign * 0.745, 2.61, z),
        part(
          `Exhaust flange · ${id}`,
          'Bolted flange seals the header pipe against the exhaust port.',
          id,
        ),
      );
      flange.userData.part = hi;
      const heatRing = ring(
        0.124,
        0.012,
        mat(0x897362, 0.83, 0.43),
        head,
        V(sign * 0.779, 2.61, z),
        false,
        part(
          'Exhaust-port heat tint',
          'Subtle discoloration near the hot exhaust flange; an illustrative wear finish.',
          id,
        ),
      );
      heatRing.rotation.y = Math.PI / 2;
      const plug = new T.Group();
      head.add(plug);
      plug.position.set(sign * 0.7, 2.69, z + 0.38);
      plug.rotation.z = (-sign * Math.PI) / 2;
      const pi = part(
        `Spark plug · cylinder ${id}`,
        'An insulated electrode ignites the compressed fuel–air charge near the end of compression. The ignition circuit is schematic.',
        id,
      );
      cyl(0.07, 0.13, steel, plug, V(), pi, 6);
      cyl(0.043, 0.21, ceramic, plug, V(0, 0.15, 0), pi);
      for (let n = 0; n < 4; n++)
        ring(0.044, 0.008, ceramic, plug, V(0, 0.08 + n * 0.04, 0), true, pi);
      cyl(0.031, 0.055, brass, plug, V(0, 0.28, 0), pi);
      for (const dz of [-0.48, 0.48]) {
        const boss = cyl(
          0.095,
          0.12,
          headMat,
          head,
          V(sign * 0.56, 2.76, z + dz),
          part(
            'Head bolt boss',
            'Reinforced casting around a cylinder-head fastener.',
          ),
        );
        bolt(head, boss.position.clone().add(V(0, 0.09, 0)));
      }
      ring(
        0.487,
        0.009,
        steel,
        bank,
        V(0, 2.46, z),
        true,
        part(
          `Bore deck edge · ${id}`,
          'Machined edge of the cylinder bore at the block deck.',
          id,
        ),
      );
    }
    for (const z of [-2.25, 2.25])
      for (const x of [-0.48, 0.48]) {
        const screw = cyl(
          0.055,
          0.06,
          steel,
          head,
          V(x, 3.59, z),
          part(
            'Valve-cover screw',
            'Secures the protective cover over the rocker mechanism.',
          ),
          6,
        );
        covers.push(screw);
      }
    const cap = cyl(
      0.18,
      0.11,
      black,
      head,
      V(0, 3.63, -1.6),
      part('Oil filler cap', 'Removable access for adding engine oil.'),
    );
    covers.push(cap);
  });
  pistons.forEach(({ id, piston, rod, big }) => {
    const ri = part(
      `Connecting rod ${id}`,
      'The I-section beam carries alternating tension and compression between the piston and crankshaft.',
      id,
    );
    for (const z of [-0.065, 0.065])
      box(0.14, 0.75, 0.025, steel, rod, V(0, 0, z), ri);
    ring(
      0.162,
      0.014,
      copper,
      big,
      V(0, 0, 0.048),
      false,
      part(
        `Rod bearing shell · ${id}`,
        'A replaceable bearing surface supports the rod big end on the crankpin with an oil film.',
        id,
      ),
    );
    for (const x of [-0.18, 0.18]) bolt(big, V(x, -0.09, 0));
    [-0.05, 0.08, 0.15].forEach((y, n) =>
      ring(
        0.459,
        0.008,
        steel,
        piston,
        V(0, y, 0),
        true,
        part(
          `${n === 0 ? 'Oil control' : 'Compression'} ring · ${id}`,
          n === 0
            ? 'Controls the lubricating oil film on the cylinder wall.'
            : 'Seals combustion pressure between the piston and cylinder wall.',
          id,
        ),
      ),
    );
    for (const z of [-0.438, 0.438])
      ring(
        0.095,
        0.01,
        dark,
        piston,
        V(0, 0, z),
        false,
        part(
          `Wrist-pin circlip · ${id}`,
          'Retains the wrist pin axially inside the piston.',
          id,
        ),
      );
  });
  valves.forEach(({ id, rocker, moving }) => {
    axisCylinder(
      0.072,
      0.15,
      steel,
      rocker,
      V(),
      part(
        `Rocker pivot · ${id}`,
        'The rocker rotates around this fulcrum as the pushrod rises.',
        id,
      ),
    );
    bolt(rocker, V(0, 0.075, 0));
    ring(
      0.077,
      0.011,
      steel,
      moving,
      V(0, 3.22, 0),
      true,
      part(
        `Spring retainer · ${id}`,
        'Locks the valve spring to the valve stem.',
        id,
      ),
    );
  });
  for (let j = 0; j < 9; j++) {
    box(
      1.42,
      0.035,
      0.06,
      dark,
      pan,
      V(0, -0.225, -2.4 + j * 0.6),
      part(
        'Oil-pan stiffening rib',
        'Stiffens the sump wall and increases its external surface area.',
      ),
    );
    for (const x of [-0.73, 0.73]) bolt(pan, V(x, 0.22, -2.4 + j * 0.6));
  }
  cyl(
    0.095,
    0.09,
    brass,
    pan,
    V(0, -0.25, 2.3),
    part(
      'Oil drain plug',
      'Removed during servicing to drain oil from the sump.',
    ),
    6,
  );
  for (const z of [-3.14, 3.25]) {
    axisCylinder(
      0.16,
      0.07,
      steel,
      crank,
      V(0, 0, z),
      part(
        'Crankshaft hub',
        'Locates the rotating flywheel or pulley concentrically on the crankshaft.',
      ),
    );
    for (let n = 0; n < 6; n++) {
      const a = (n * Math.PI) / 3;
      const screw = cyl(
        0.045,
        0.045,
        steel,
        crank,
        V(0.26 * Math.sin(a), 0.26 * Math.cos(a), z),
        part('Hub bolt', 'Secures the rotating flange to the crankshaft.'),
        6,
      );
      screw.rotation.x = Math.PI / 2;
    }
  }
  const intakeAssembly = new T.Group();
  heads.add(intakeAssembly);
  const plenumInfo = part(
    'Intake plenum',
    'A common air chamber distributes the incoming charge to eight intake runners. Internal flow is shown schematically.',
  );
  const plenumShape = new T.Shape();
  plenumShape.moveTo(-0.42, -2.3);
  plenumShape.lineTo(0.42, -2.3);
  plenumShape.lineTo(0.42, 2.3);
  plenumShape.lineTo(-0.42, 2.3);
  plenumShape.closePath();
  const plenum = mesh(
    new T.ExtrudeGeometry(plenumShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSize: 0.12,
      bevelThickness: 0.1,
      bevelSegments: 4,
    }),
    aluminum,
    intakeAssembly,
    V(0, 3.5, 0),
    plenumInfo,
  );
  plenum.rotation.x = Math.PI / 2;
  const throttleInfo = part(
    'Throttle body',
    'The throttle meters air entering the intake plenum. Its plate is shown partially open; throttle response is not simulated.',
  );
  const throttle = mesh(
    new T.CylinderGeometry(0.25, 0.25, 0.38, 40, 1, true),
    steel,
    intakeAssembly,
    V(0, 3.28, 2.55),
    throttleInfo,
  );
  throttle.rotation.x = Math.PI / 2;
  const plate = axisCylinder(
    0.235,
    0.02,
    brass,
    intakeAssembly,
    V(0, 3.28, 2.56),
    throttleInfo,
  );
  plate.rotation.y = 0.65;
  for (let j = 0; j < 6; j++)
    box(
      0.8,
      0.035,
      0.06,
      dark,
      intakeAssembly,
      V(0, 3.63, -1.9 + j * 0.75),
      plenumInfo,
    );
  const coolantMat = mat(0x238da8, 0.45, 0.25);
  coolantMat.emissive.set(0x084753);
  coolantMat.emissiveIntensity = 0.2;
  banks.forEach(({ sign, head, block: bank }) => {
    for (let j = 0; j < 4; j++) {
      const id = j * 2 + (sign === 1 ? 1 : 2),
        z = cylinderState(id, 0).z;
      // End points are expressed in the head frame, then follow that assembly.
      const inlet = V((-sign * 3.2) / Math.sqrt(2), 3.2 / Math.sqrt(2), z);
      tube(
        [V(-sign * 0.72, 2.61, z), V(-sign * 1.0, 2.8, z), inlet],
        0.13,
        aluminum,
        head,
        part(
          `Intake runner · cylinder ${id}`,
          'Connects the common plenum to this cylinder’s intake port.',
          id,
        ),
      );
      const terminalAngle = ((id - 1) * Math.PI) / 4;
      const terminal = V(
        Math.sin(terminalAngle) * 0.18,
        3.28,
        -2.95 + Math.cos(terminalAngle) * 0.18,
      ).applyAxisAngle(V(0, 0, 1), (sign * Math.PI) / 4);
      tube(
        [
          V(sign * 1.02, 2.69, z + 0.38),
          V(sign * 1.22, 3.0, z + 0.4),
          V(sign * 0.8, 3.8, z),
          terminal,
        ],
        0.022,
        black,
        head,
        part(
          `Ignition lead · cylinder ${id}`,
          'Carries high voltage from the distributor to the spark plug. Routing is illustrative.',
          id,
        ),
      );
      for (const side of [-1, 1]) {
        tube(
          [
            V(side * 0.56, 1.32, z - 0.36),
            V(side * 0.6, 1.8, z),
            V(side * 0.56, 2.34, z + 0.36),
          ],
          0.035,
          coolantMat,
          bank,
          part(
            `Coolant jacket passage · ${id}`,
            'Blue cutaway channels indicate coolant passages beside the cylinder wall. The jacket is simplified; coolant flow and temperature are not simulated.',
            id,
          ),
        );
        const boss = cyl(
          0.18,
          0.1,
          blockMat,
          bank,
          V(side * 0.73, 1.33, z - 0.51),
          part(
            'Cast mounting boss',
            'A reinforced mounting feature cast into the block.',
          ),
        );
        boss.rotation.z = Math.PI / 2;
      }
    }
    for (const side of [-1, 1]) {
      tube(
        [
          V(side * 0.59, 2.35, -2.5),
          V(side * 0.59, 2.35, 0),
          V(side * 0.59, 2.35, 2.5),
        ],
        0.035,
        coolantMat,
        bank,
        part(
          'Coolant gallery',
          'Connects the illustrated cylinder cooling passages along the bank.',
        ),
      );
      const contour = new T.Shape();
      contour.moveTo(-2.63, 1.22);
      contour.lineTo(-2.4, 0.83);
      contour.lineTo(2.4, 0.83);
      contour.lineTo(2.63, 1.22);
      contour.closePath();
      const skirt = mesh(
        new T.ExtrudeGeometry(contour, {
          depth: 0.13,
          bevelEnabled: true,
          bevelSize: 0.045,
          bevelThickness: 0.035,
          bevelSegments: 3,
        }),
        blockMat,
        bank,
        V(side * 0.6, 0, 0),
        part(
          'Crankcase skirt',
          'The deeper, chamfered block skirt stiffens the lower casting around the rotating assembly.',
        ),
      );
      skirt.rotation.y = Math.PI / 2;
    }
  });
  const distributorInfo = part(
    'Distributor',
    'Routes ignition voltage to the spark-plug leads in firing order. Electrical switching is not simulated.',
  );
  cyl(0.24, 0.32, dark, intakeAssembly, V(0, 3.0, -2.95), distributorInfo);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    cyl(
      0.045,
      0.12,
      brass,
      intakeAssembly,
      V(Math.sin(a) * 0.18, 3.22, -2.95 + Math.cos(a) * 0.18),
      distributorInfo,
    );
  }
  axisCylinder(
    0.28,
    0.28,
    aluminum,
    block,
    V(0, 1.85, 3.05),
    part(
      'Water-pump housing',
      'Circulates coolant through the block and heads in a real engine. The accessory drive is omitted.',
    ),
  );
  tube(
    [V(0, 1.85, 3.19), V(0.5, 2.0, 3.15), V(0.85, 2.0, 2.72)],
    0.095,
    black,
    block,
    part(
      'Coolant outlet hose',
      'Connects the pump housing to the cooling circuit; the radiator is outside this exhibit.',
    ),
  );
  cyl(
    0.22,
    0.55,
    black,
    block,
    V(-1.05, 0.15, 2.3),
    part(
      'Oil filter',
      'Removes particles from lubricating oil before it returns to the engine’s oil galleries.',
    ),
  );
  banks.forEach((b) =>
    [b.block, b.head].forEach((g) =>
      g.traverse((o) => {
        if (o instanceof T.Mesh && b.covers.includes(o)) {
          o.material = (o.material as T.MeshStandardMaterial).clone();
        } else if (o instanceof T.Mesh) {
          const m = (o.material as T.MeshStandardMaterial).clone();
          o.material = m;
          castingMaterials.push(m);
        }
      }),
    ),
  );
  // The teaching overlay uses the same crank angle and cylinder coordinates.
  const charge = new T.Group();
  engine.add(charge);
  const chargePositions = new Float32Array(72 * 3);
  const chargeGeo = new T.BufferGeometry();
  chargeGeo.setAttribute('position', new T.BufferAttribute(chargePositions, 3));
  const chargeMat = new T.PointsMaterial({
    color: COLORS[2],
    size: 0.045,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  });
  const molecules = new T.Points(chargeGeo, chargeMat);
  charge.add(molecules);
  const flowBeads = Array.from({ length: 12 }, () =>
    mesh(
      new T.ConeGeometry(0.04, 0.13, 7),
      new T.MeshBasicMaterial({ color: COLORS[2] }),
      charge,
    ),
  );
  const flame = mesh(
    new T.SphereGeometry(0.15, 16, 10),
    new T.MeshBasicMaterial({
      color: 0xffbe66,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
    charge,
  );
  intakeAssembly.traverse((o) => {
    if (o instanceof T.Mesh) {
      const m = (o.material as T.MeshStandardMaterial).clone();
      o.material = m;
      castingMaterials.push(m);
    }
  });
  const cappedObjects = pickables.filter(
    (o) =>
      o instanceof T.Mesh &&
      [
        'Cylinder block',
        'Cylinder head',
        'Intake plenum',
        'Multi-layer head gasket',
      ].includes(o.userData.part?.name) &&
      o.geometry.type === 'ExtrudeGeometry',
  ) as T.Mesh[];
  const caps = cappedObjects.map((o, i) =>
    sectionCap(o, cutPlane, scene, 20 + i * 3),
  );
  const helpers = caps.flatMap((c) => c.special);
  const target = new T.WebGLRenderTarget(1, 1, {
    type: T.HalfFloatType,
    stencilBuffer: true,
  });
  target.samples = 0; // SMAA handles edges without a redundant multisample resolve.
  const composer = new EffectComposer(renderer, target);
  const renderPass = new RenderPass(scene, camera);
  const outline = new OutlinePass(new T.Vector2(1, 1), scene, camera);
  outline.visibleEdgeColor.set(0xe4f6ff);
  outline.hiddenEdgeColor.set(0x24404c);
  outline.edgeStrength = 3;
  outline.edgeThickness = 1;
  outline.edgeGlow = 0;
  outline.pulsePeriod = 0;
  const bokeh = new BokehPass(scene, camera, {
    focus: 12,
    aperture: 0.0005,
    maxblur: 0.006,
  });
  const bloom = new UnrealBloomPass(new T.Vector2(1, 1), 0.065, 0.15, 6);
  const output = new OutputPass(),
    antialias = new SMAAPass();
  composer.addPass(renderPass);
  composer.addPass(bokeh);
  composer.addPass(bloom);
  composer.addPass(outline);
  composer.addPass(output);
  composer.addPass(antialias);
  for (const pass of [bokeh, outline]) {
    const original = pass.render.bind(pass);
    pass.render = (...args: Parameters<typeof original>) => {
      const visibility = helpers.map((o) => o.visible);
      helpers.forEach((o) => {
        o.visible = false;
      });
      try {
        original(...args);
      } finally {
        helpers.forEach((o, i) => {
          o.visible = visibility[i];
        });
      }
    };
  }
  (flame.material as T.MeshBasicMaterial).color.setRGB(8, 4, 1);
  const selectedLabel = document.createElement('div'),
    labelLine = document.createElement('div');
  selectedLabel.className = 'selected-anchor';
  labelLine.className = 'selected-leader';
  host.appendChild(labelLine);
  host.appendChild(selectedLabel);
  const overlays = createOverlays(scene, camera, host, controls, onSection);
  let coverAlpha = 0;
  let cutProgress = 1;
  let explosion = 0,
    previousView: View | undefined,
    previousTransparent: boolean | undefined;
  const raycaster = new T.Raycaster();
  const hoverLabel = document.createElement('div');
  hoverLabel.className = 'part-hover';
  hoverLabel.hidden = true;
  host.appendChild(hoverLabel);
  let activeObject: T.Object3D | undefined;
  const ghostMaterials = new Map<
    T.Mesh,
    { original: T.Material | T.Material[]; ghost: T.Material }
  >();
  function restoreGhosts() {
    ghostMaterials.forEach(({ original, ghost }, object) => {
      if (object.material === ghost) object.material = original;
    });
  }
  function selectObject(object: T.Object3D) {
    restoreGhosts();
    clearSelection();
    activeObject = object;
    onPick(object.userData.part);
  }
  function focusObject() {
    if (!activeObject) return;
    engine.updateMatrixWorld(true);
    const bounds = new T.Box3().setFromObject(activeObject);
    pickables.forEach((o) => {
      if (o.userData.part?.name === activeObject?.userData.part?.name)
        bounds.union(new T.Box3().setFromObject(o));
    });
    bounds.getCenter(orbitTarget);
    const followingPiston =
      activeObject.userData.part?.name.startsWith('Piston ');
    if (followingPiston) orbitTarget.y += 0.35;
    const extent = bounds.getSize(V()).length();
    cameraTarget
      .copy(camera.position)
      .sub(controls.target)
      .normalize()
      .multiplyScalar(Math.max(followingPiston ? 6.5 : 2.8, extent * 2.2))
      .add(orbitTarget);
    cameraTransition = true;
  }
  function clearSelection() {
    outline.selectedObjects = [];
  }
  let pointerStart = { x: 0, y: 0 };
  function down(e: PointerEvent) {
    pointerStart = { x: e.clientX, y: e.clientY };
  }
  function hitAt(e: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(
      new T.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    const hits = raycaster.intersectObjects(pickables, false).filter((h) => {
      let o: T.Object3D | null = h.object;
      while (o) {
        if (!o.visible) return false;
        o = o.parent;
      }
      const m = (h.object as T.Mesh).material as T.MeshStandardMaterial;
      return (
        !(m?.transparent && m.opacity < 0.25) &&
        !m?.clippingPlanes?.some((p) => p.distanceToPoint(h.point) < 0)
      );
    });
    return hits[0];
  }
  function move(e: PointerEvent) {
    const hit = e.buttons ? undefined : hitAt(e);
    hoverLabel.hidden = !hit;
    renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
    if (hit) {
      const rect = host.getBoundingClientRect();
      hoverLabel.textContent =
        hit.object.userData.part.name + ' · Click to inspect';
      hoverLabel.style.left = `${Math.max(8, Math.min(e.clientX - rect.left + 14, rect.width - 245))}px`;
      hoverLabel.style.top = `${Math.max(8, e.clientY - rect.top - 38)}px`;
    }
  }
  function leave() {
    hoverLabel.hidden = true;
  }
  function up(e: PointerEvent) {
    if (
      e.button !== 0 ||
      Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) > 5
    )
      return;
    const hit = hitAt(e);
    if (!hit) return;
    selectObject(hit.object);
    focusObject();
  }
  renderer.domElement.addEventListener('pointerdown', down);
  renderer.domElement.addEventListener('pointerup', up);
  renderer.domElement.addEventListener('pointermove', move);
  renderer.domElement.addEventListener('pointerleave', leave);
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  let frameCount = 0,
    sampleStart = performance.now(),
    shadowState = '';
  let previousQuality = '';
  let previousLighting = '';
  function render(settings: Settings, dt: number) {
    if (previousLighting !== settings.lighting) {
      const style = settings.lighting;
      const intensities =
        style === 'technical'
          ? [2.5, 2.5, 2]
          : style === 'dramatic'
            ? [3, 0.65, 4]
            : [2.6, 1.8, 3.2];
      studioLights.forEach((l, i) => (l.intensity = intensities[i]));
      hemisphere.intensity =
        style === 'technical' ? 1.3 : style === 'dramatic' ? 0.3 : 0.75;
      key.intensity =
        style === 'technical' ? 1.3 : style === 'dramatic' ? 1.9 : 1.5;
      renderer.toneMappingExposure =
        style === 'technical' ? 0.82 : style === 'dramatic' ? 0.68 : 0.76;
      previousLighting = style;
      renderer.shadowMap.needsUpdate = true;
    }
    if (previousQuality !== settings.quality) {
      const q = settings.quality;
      const ratio =
        q === 'performance'
          ? 1
          : q === 'ultra'
            ? Math.min(window.devicePixelRatio * 1.5, 2)
            : Math.min(window.devicePixelRatio, 1.25);
      renderer.setPixelRatio(ratio);
      composer.setPixelRatio(ratio);
      const shadowSize =
        q === 'performance' ? 1024 : q === 'ultra' ? 4096 : 2048;
      key.shadow.mapSize.set(shadowSize, shadowSize);
      key.shadow.map?.dispose();
      key.shadow.map = null;
      renderer.shadowMap.needsUpdate = true;
      bloom.enabled = q !== 'performance';
      previousQuality = q;
    }
    if (++frameCount === 60) {
      const fps = 60000 / (performance.now() - sampleStart);
      host.dataset.fps = fps.toFixed(0);
      if (
        fps < 28 &&
        settings.quality === 'balanced' &&
        renderer.getPixelRatio() > 0.9 &&
        document.visibilityState === 'visible'
      ) {
        const ratio = Math.max(0.9, renderer.getPixelRatio() - 0.2);
        renderer.setPixelRatio(ratio);
        composer.setPixelRatio(ratio);
      }
      frameCount = 0;
      sampleStart = performance.now();
    }
    restoreGhosts();
    const { angle, view, layers, transparent, colors } = settings;
    if (previousView !== view || previousTransparent !== transparent)
      clearSelection();
    explosion = T.MathUtils.damp(explosion, view === 'exploded' ? 1 : 0, 5, dt);
    cutProgress = T.MathUtils.damp(
      cutProgress,
      view === 'cutaway' ? 1 : 0,
      7,
      dt,
    );
    cutPlane.constant = 6 - (6 - settings.section) * cutProgress;
    block.visible = layers.block;
    heads.visible = layers.heads;
    crank.visible = layers.crankshaft;
    pistonGroup.visible = layers.pistons;
    valveGroup.visible = layers.valvetrain;
    if (
      previousView !== view &&
      (view === 'exploded' || previousView === 'exploded')
    ) {
      orbitTarget.set(0, view === 'exploded' ? 1.5 : 0.9, 0);
      cameraTarget.copy(view === 'exploded' ? V(10, 7.2, 12.5) : V(8, 5.8, 10));
      cameraTransition = true;
    }
    if (previousView !== view || previousTransparent !== transparent) {
      castingMaterials.forEach((m) => {
        m.clippingPlanes = [cutPlane];
        m.clipShadows = true;
        m.transparent = transparent;
        m.opacity = transparent ? 0.16 : 1;
        m.depthWrite = !transparent;
        m.side = T.DoubleSide;
        m.needsUpdate = true;
      });
      previousView = view;
      previousTransparent = transparent;
    }
    coverAlpha = T.MathUtils.damp(
      coverAlpha,
      view === 'cutaway' || transparent ? 0 : 1,
      8,
      dt,
    );
    banks.forEach((b) =>
      b.covers.forEach((c) => {
        c.visible = coverAlpha > 0.01;
        const m = (c as T.Mesh).material as T.MeshStandardMaterial;
        m.transparent = coverAlpha < 0.999;
        m.opacity = coverAlpha;
        m.depthWrite = coverAlpha > 0.95;
      }),
    );
    crank.rotation.z = -angle * RAD;
    cam.rotation.z = (-angle * RAD) / 2;
    lower.rotation.z = -angle * RAD;
    upper.rotation.z = (-angle * RAD) / 2;
    chainLinks.forEach((m, i) => {
      const t =
        (i / 100 -
          (((angle / 360) * ((2 * Math.PI * 0.24) / chainCurve.getLength())) %
            1) +
          1) %
        1;
      m.position.copy(chainCurve.getPointAt(t));
      m.quaternion.setFromUnitVectors(V(1, 0, 0), chainCurve.getTangentAt(t));
    });
    banks.forEach((b) => {
      b.block.position.set(b.sign * explosion * 0.45, explosion * 0.2, 0);
      b.head.position.set(b.sign * explosion * 1.05, explosion * 1.05, 0);
      b.valve.position.copy(b.head.position);
    });
    pan.position.y = -0.85 - explosion * 0.7;
    intakeAssembly.position.y = explosion * 1.65;
    platform.position.y = -1.19 - explosion * 0.8;
    platformRim.position.y = -1.14 - explosion * 0.8;
    contact.position.y = -1.144 - explosion * 0.8;
    pistons.forEach((p) => {
      const s = cylinderState(p.id, angle),
        pin = V(s.pinX, s.pinY, s.z),
        wrist = V(s.x, s.y, s.z);
      p.piston.position.copy(wrist);
      link(p.rod, pin, wrist);
      p.big.position.copy(pin);
      p.big.rotation.z = -Math.atan2(s.x - s.pinX, s.y - s.pinY);
      p.small.position.copy(wrist);
      p.material.color.set(colors ? COLORS[s.stroke] : 0xd2d7d7);
      p.material.emissive.set(colors ? COLORS[s.stroke] : 0x000000);
      p.material.emissiveIntensity = colors ? 0.08 : 0;
      const crown = s.distance + 0.23,
        top = 2.46,
        h = Math.max(0.015, top - crown);
      p.glow.scale.y = h;
      p.glow.position.set(
        Math.sin(s.beta) * (crown + h / 2),
        Math.cos(s.beta) * (crown + h / 2),
        s.z,
      );
      p.glow.visible =
        colors || (settings.teaching && p.id === settings.selectedCylinder);
      (p.glow.material as T.MeshBasicMaterial).color.set(COLORS[s.stroke]);
    });
    valves.forEach((v) => {
      const motion = valvetrainState(v.id, angle, v.type),
        { lift } = motion;
      v.moving.position.y = -lift;
      v.spring.scale.y = 0.36 - lift;
      v.rocker.rotation.z = motion.rockerAngle;
      link(
        v.pushrod,
        V(motion.lowerX, motion.lowerY, v.z),
        V(motion.upperX, motion.upperY, v.z),
      );
      v.follower.position.set(motion.lowerX, motion.lowerY - 0.07, v.z);
    });
    charge.visible = settings.teaching && layers.pistons;
    if (charge.visible) {
      const s = chargeState(settings.selectedCylinder, angle);
      charge.position.set(0, 0, s.z);
      charge.rotation.z = -s.beta;
      chargeMat.color.set(COLORS[s.stroke]);
      for (let i = 0; i < 72; i++) {
        const theta = i * 2.39996 + angle * RAD * 0.3;
        const radius = 0.39 * Math.sqrt(((i % 12) + 0.5) / 12);
        chargePositions[i * 3] = Math.cos(theta) * radius;
        chargePositions[i * 3 + 1] =
          s.crown + s.height * ((Math.floor(i / 12) + 0.5) / 6);
        chargePositions[i * 3 + 2] = Math.sin(theta) * radius;
      }
      chargeGeo.attributes.position.needsUpdate = true;
      molecules.visible = true;
      flame.position.set(0, s.crown + s.height / 2, 0);
      flame.scale.set(2.1, (s.height * 0.45) / 0.15, 2.1);
      (flame.material as T.MeshBasicMaterial).opacity = s.burn * 0.85;
      flowBeads.forEach((bead, i) => {
        bead.visible = s.flow !== 'closed';
        let t = (((angle / 90 + i / 12) % 1) + 1) % 1;
        if (s.flow === 'in') t = 1 - t;
        const side = s.flow === 'in' ? -s.bank : s.bank;
        bead.position.set(
          side * t * 0.85,
          2.43 + t * 0.45,
          s.flow === 'in' ? -0.21 : 0.21,
        );
        bead.quaternion.setFromUnitVectors(
          V(0, 1, 0),
          V(side * 0.85, 0.45, 0)
            .normalize()
            .multiplyScalar(s.flow === 'in' ? -1 : 1),
        );
        (bead.material as T.MeshBasicMaterial).color.set(
          s.flow === 'in' ? COLORS[2] : COLORS[1],
        );
      });
    }
    if ((settings.isolate || settings.connected) && activeObject) {
      const name = activeObject.userData.part?.name;
      const root =
        name === 'Cross-plane crankshaft'
          ? crank
          : name?.startsWith('Piston ') || name?.startsWith('Rocker arm ')
            ? activeObject.parent
            : activeObject;
      engine.traverse((o) => {
        if (
          !(o instanceof T.Mesh) ||
          o.parent === charge ||
          o.userData.sectionHelper
        )
          return;
        let cached = ghostMaterials.get(o);
        if (!cached) {
          const material = Array.isArray(o.material)
            ? o.material[0]
            : o.material;
          cached = { original: o.material, ghost: material.clone() };
          ghostMaterials.set(o, cached);
        }
        cached.original = o.material;
        const original = Array.isArray(o.material) ? o.material[0] : o.material;
        cached.ghost.copy(original);
        let ancestor: T.Object3D | null = o;
        let inAssembly = false;
        while (ancestor) {
          if (ancestor === root) inAssembly = true;
          ancestor = ancestor.parent;
        }
        const id = activeObject?.userData.part?.cylinder;
        let related = false,
          candidate: T.Object3D | null = o;
        while (candidate && candidate !== engine) {
          const p = candidate.userData.part;
          if (
            settings.connected &&
            (id
              ? p?.cylinder === id ||
                /crankshaft|camshaft|timing chain/i.test(p?.name || '')
              : candidate === activeObject?.parent)
          )
            related = true;
          candidate = candidate.parent;
        }
        const chosen = inAssembly || o.userData.part?.name === name || related;
        cached.ghost.transparent = !chosen;
        cached.ghost.opacity = chosen ? 1 : 0.025;
        cached.ghost.depthWrite = chosen;
        if (!chosen && cached.ghost instanceof T.MeshStandardMaterial) {
          cached.ghost.color.set(0x66828e);
          cached.ghost.metalness = 0;
          cached.ghost.roughness = 1;
          cached.ghost.side = T.FrontSide;
          cached.ghost.bumpMap = null;
          cached.ghost.map = null;
          cached.ghost.envMapIntensity = 0;
        }
        if (chosen && cached.ghost instanceof T.MeshStandardMaterial)
          cached.ghost.clippingPlanes = [];
        o.material = cached.ghost;
      });
    }
    if (cameraTransition) {
      camera.position.lerp(cameraTarget, 1 - Math.exp(-dt * 5));
      controls.target.lerp(orbitTarget, 1 - Math.exp(-dt * 5));
      if (camera.position.distanceTo(cameraTarget) < 0.01)
        cameraTransition = false;
    }
    controls.autoRotate = settings.presentation;
    controls.autoRotateSpeed = 0.35;
    controls.update(dt);
    overlays.update(
      cutPlane.constant,
      view === 'cutaway' &&
        !transparent &&
        !settings.presentation &&
        !settings.teaching,
      view === 'exploded' ? 'off' : settings.flows,
      angle,
    );
    caps.forEach((c) =>
      c.update(
        view === 'cutaway' &&
          !transparent &&
          !settings.isolate &&
          !settings.connected,
      ),
    );
    let selectionVisible = !!activeObject;
    let ancestor = activeObject;
    while (ancestor) {
      selectionVisible &&= ancestor.visible;
      ancestor = ancestor.parent || undefined;
    }
    outline.selectedObjects =
      selectionVisible && activeObject ? [activeObject] : [];
    outline.enabled = selectionVisible;
    bokeh.enabled =
      settings.depthOfField &&
      settings.quality !== 'performance' &&
      !settings.playing &&
      view === 'assembled' &&
      !transparent &&
      !settings.isolate;
    (bokeh.uniforms as Record<string, T.IUniform>).focus.value =
      camera.position.distanceTo(controls.target);
    if (activeObject && selectionVisible) {
      const center = new T.Box3()
        .setFromObject(activeObject)
        .getCenter(V())
        .project(camera);
      const w = host.clientWidth,
        h = host.clientHeight,
        x = ((center.x + 1) * w) / 2,
        y = ((1 - center.y) * h) / 2;
      const lx = Math.min(w - 205, Math.max(8, x + 45)),
        ly = Math.max(12, Math.min(h - 42, y - 55));
      selectedLabel.textContent = activeObject.userData.part?.name || '';
      selectedLabel.style.left = `${lx}px`;
      selectedLabel.style.top = `${ly}px`;
      labelLine.style.left = `${x}px`;
      labelLine.style.top = `${y}px`;
      labelLine.style.width = `${Math.hypot(lx - x, ly + 16 - y)}px`;
      labelLine.style.transform = `rotate(${Math.atan2(ly + 16 - y, lx - x)}rad)`;
      selectionVisible =
        center.z > -1 && center.z < 1 && x > 0 && x < w && y > 0 && y < h;
    }
    selectedLabel.hidden = labelLine.hidden = !selectionVisible;
    const nextShadowState = [
      angle.toFixed(2),
      explosion.toFixed(3),
      cutPlane.constant.toFixed(3),
      transparent,
      ...Object.values(layers),
    ].join(':');
    if (nextShadowState !== shadowState) {
      renderer.shadowMap.needsUpdate = true;
      shadowState = nextShadowState;
    }
    composer.render(dt);
  }
  return {
    render,
    async capture() {
      const size = renderer.getSize(new T.Vector2()),
        ratio = renderer.getPixelRatio();
      const width = Math.round(Math.min(3840, (3840 * size.x) / size.y)),
        height = Math.round((width * size.y) / size.x);
      try {
        renderer.setPixelRatio(1);
        composer.setPixelRatio(1);
        renderer.setSize(width, height, false);
        composer.setSize(width, height);
        composer.render(0);
        const blobPromise = new Promise<Blob>((resolve, reject) =>
          renderer.domElement.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Image export failed'))),
            'image/png',
          ),
        );
        return await blobPromise;
      } finally {
        renderer.setPixelRatio(ratio);
        composer.setPixelRatio(ratio);
        renderer.setSize(size.x, size.y);
        composer.setSize(size.x, size.y);
      }
    },
    focus: focusObject,
    select(name: string, zoom = true) {
      const object = pickables.find((o) => o.userData.part?.name === name);
      if (!object) return false;
      selectObject(object);
      if (zoom) focusObject();
      return true;
    },
    preset(name: string) {
      const presets: Record<string, T.Vector3> = {
        perspective: V(8, 5.8, 10),
        front: V(0, 2, 15),
        side: V(14, 3, 0),
        top: V(0, 16, 0.01),
      };
      cameraTarget.copy(presets[name] || presets.perspective);
      orbitTarget.set(0, 0.9, 0);
      cameraTransition = true;
    },
    dispose() {
      markingTextures.forEach((t) => t.dispose());
      contactTexture.dispose();
      overlays.dispose();
      selectedLabel.remove();
      labelLine.remove();
      composer.passes.forEach((p) => p.dispose());
      composer.dispose();
      castTexture.dispose();
      brushedTexture.dispose();
      rubberTexture.dispose();
      restoreGhosts();
      ghostMaterials.forEach(({ ghost }) => ghost.dispose());
      chargeGeo.dispose();
      chargeMat.dispose();
      clearSelection();
      hoverLabel.remove();
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', down);
      renderer.domElement.removeEventListener('pointerup', up);
      renderer.domElement.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('pointerleave', leave);
      scene.traverse((o) => {
        if (o instanceof T.Mesh) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
        if (o instanceof T.Sprite) {
          o.material.map?.dispose();
          o.material.dispose();
        }
      });
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
    stats() {
      return {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
      };
    },
  };
}
