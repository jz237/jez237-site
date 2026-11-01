import * as T from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export const SECTORS = [
  {
    name: "COPPER EXCHANGE",
    color: 0x64dbcd,
    accent: 0xffb060,
    fog: 0x0b2026,
    kind: "station",
    caption: "Old infrastructure. New infestation.",
  },
  {
    name: "THE FOUNDRY",
    color: 0xff9b5f,
    accent: 0xffdc8c,
    fog: 0x281810,
    kind: "forge",
    caption: "Heat signatures everywhere. Trust nothing.",
  },
  {
    name: "FLOODGATE NINE",
    color: 0x63bded,
    accent: 0xb2f1d9,
    fog: 0x091c2a,
    kind: "water",
    caption: "The water is rising. So is the resistance.",
  },
  {
    name: "GHOST TERMINAL",
    color: 0xb7a3f7,
    accent: 0xf2b083,
    fog: 0x16182a,
    kind: "ghost",
    caption: "No arrivals. No departures. No witnesses.",
  },
  {
    name: "SURFACE APPROACH",
    color: 0xb8db94,
    accent: 0xffcf70,
    fog: 0x18241f,
    kind: "surface",
    caption: "Daylight ahead. They will not let you reach it.",
  },
];
const boxGeo = new T.BoxGeometry(1, 1, 1),
  sphereGeo = new T.IcosahedronGeometry(1, 1),
  cylGeo = new T.CylinderGeometry(1, 1, 1, 10);
const matCache = new Map();
const metal = (color, emissive = 0, power = 0) => {
  const key = `${color}:${emissive}:${power}`;
  if (!matCache.has(key))
    matCache.set(
      key,
      new T.MeshStandardMaterial({
        color,
        metalness: 0.65,
        roughness: 0.37,
        emissive,
        emissiveIntensity: power,
      }),
    );
  return matCache.get(key);
};
const hull = metal(0x45616b),
  dark = metal(0x172b33),
  steel = metal(0x80949a),
  rust = metal(0x594436),
  ivory = metal(0xc9cab3),
  black = metal(0x0d161f);
const amber = metal(0xf6af5d, 0xff9c40, 3),
  mint = metal(0x95f5db, 0x56e9cc, 3),
  red = metal(0xff886e, 0xff4e25, 2.7);
function part(
  parent,
  g,
  m,
  x,
  y,
  z,
  sx = 1,
  sy = 1,
  sz = 1,
  rx = 0,
  ry = 0,
  rz = 0,
) {
  const q = new T.Mesh(g, m);
  q.position.set(x, y, z);
  q.scale.set(sx, sy, sz);
  q.rotation.set(rx, ry, rz);
  parent.add(q);
  return q;
}
const box = (p, m, x, y, z, sx, sy, sz, ry = 0) =>
  part(p, boxGeo, m, x, y, z, sx, sy, sz, 0, ry);
function bake(group) {
  const by = new Map();
  group.updateMatrixWorld(true);
  group.traverse((o) => {
    if (!o.isMesh) return;
    let g = o.geometry.clone().applyMatrix4(o.matrixWorld);
    if (g.index) {
      const unindexed = g.toNonIndexed();
      g.dispose();
      g = unindexed;
    }
    const a = by.get(o.material) || [];
    a.push(g);
    by.set(o.material, a);
  });
  const out = new T.Group();
  for (const [m, gs] of by) {
    const geometry = mergeGeometries(gs);
    if (!geometry) throw Error("Incompatible model geometry");
    out.add(new T.Mesh(geometry, m));
    gs.forEach((g) => g.dispose());
  }
  return out;
}
function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return t;
}
const glowTex = canvasTexture(128, 128, (c, w, h) => {
  const a = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  a.addColorStop(0, "#fff");
  a.addColorStop(0.2, "#ffffff9a");
  a.addColorStop(0.6, "#ffffff18");
  a.addColorStop(1, "#ffffff00");
  c.fillStyle = a;
  c.fillRect(0, 0, w, h);
});
const shadowMat = new T.MeshBasicMaterial({
  color: 0x000810,
  map: glowTex,
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
});
const threatMat = new T.MeshBasicMaterial({
  color: 0xffac73,
  transparent: true,
  opacity: 0.65,
  depthWrite: false,
  side: T.DoubleSide,
});
const threatGeo = new T.RingGeometry(0.8, 0.84, 24);
const templates = new Map();
const wreckEdges = new WeakMap();
const shardAxis = new T.Vector3(1, 0, 0);
export function droneModel(type = "vanguard", enemy = false) {
  const key = type + enemy;
  if (templates.has(key)) return templates.get(key).clone();
  const group = new T.Group(),
    p = new T.Group();
  group.add(p);
  const c = enemy
    ? {
        scout: 0xea9b67,
        weaver: 0x88d6bf,
        hunter: 0xcd9bdd,
        sentry: 0xf0b367,
        brute: 0xd77b70,
        splitter: 0xb2b1f2,
        swarm: 0xffce78,
      }[type] || 0xf39c66
    : { vanguard: 0x8eddd4, striker: 0xf1a45f, bastion: 0x9bbba3 }[type];
  const paint = metal(c),
    light = metal(c, c, 3.2);
  const brute = type === "brute" || type === "bastion",
    fast = type === "hunter" || type === "striker",
    scale = brute ? 1.25 : fast ? 0.88 : 1;
  box(p, dark, 0, 0.35, 0, 0.85, 0.48, 1.2);
  box(p, paint, 0, 0.58, -0.12, 0.63, 0.28, 0.83);
  box(p, black, 0, 0.75, -0.26, 0.36, 0.13, 0.4);
  box(p, light, 0, 0.76, -0.44, 0.29, 0.08, 0.06);
  for (const s of [-1, 1]) {
    box(
      p,
      paint,
      s * 0.57,
      0.39,
      0.12,
      0.43,
      0.24,
      0.82,
      s * (fast ? 0.4 : 0.18),
    );
    box(p, steel, s * 0.47, 0.44, -0.48, 0.16, 0.16, 0.65);
    box(p, light, s * 0.47, 0.44, -0.83, 0.1, 0.1, 0.12);
    box(p, dark, s * 0.61, 0.27, 0.62, 0.27, 0.23, 0.28);
    box(p, light, s * 0.61, 0.27, 0.8, 0.17, 0.12, 0.16);
    box(p, ivory, s * 0.53, 0.55, 0.23, 0.18, 0.035, 0.29);
    if (brute) box(p, paint, s * 0.88, 0.44, 0.02, 0.26, 0.48, 1.02);
    if (type === "weaver" || type === "splitter") {
      box(p, paint, s * 0.88, 0.4, 0.07, 0.75, 0.13, 0.23, s * 0.65);
      box(p, light, s * 1.15, 0.4, -0.17, 0.13, 0.13, 0.13);
    }
  }
  if (type === "sentry") {
    part(p, cylGeo, dark, 0, 0.8, 0, 0.55, 0.22, 0.55);
    box(p, light, 0, 0.96, -0.45, 0.22, 0.18, 0.8);
  }
  const solid = bake(p);
  solid.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  group.remove(p);
  group.add(solid);
  const rotor = new T.Group();
  rotor.name = "rotor";
  rotor.position.set(0, 0.76, 0.35);
  for (let i = 0; i < 3; i++)
    box(rotor, steel, 0, 0, 0, 0.65, 0.035, 0.08, (i * Math.PI) / 3);
  group.add(rotor);
  const shadow = part(
    group,
    new T.PlaneGeometry(2.8, 2.8),
    shadowMat,
    0,
    -0.37,
    0.22,
    1,
    1,
    1,
    -Math.PI / 2,
  );
  shadow.name = "shadow";
  const flame = new T.Sprite(
    new T.SpriteMaterial({
      map: glowTex,
      color: c,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
    }),
  );
  flame.position.set(0, 0.25, 0.95);
  flame.scale.set(1.2, 0.7, 1);
  flame.name = "flame";
  group.add(flame);
  if (enemy) {
    const telegraph = new T.Mesh(threatGeo, threatMat);
    telegraph.rotation.x = -Math.PI / 2;
    telegraph.position.y = -0.02;
    telegraph.name = "threat";
    telegraph.visible = false;
    group.add(telegraph);
  }
  group.scale.setScalar(scale);
  if (enemy) group.rotation.y = Math.PI;
  templates.set(key, group);
  return group.clone();
}
export function bossModel(kind) {
  if (templates.has("boss" + kind)) return templates.get("boss" + kind).clone();
  const g = new T.Group(),
    p = new T.Group();
  g.add(p);
  const light = kind === 1 ? mint : kind === 2 ? red : amber;
  box(p, dark, 0, 0.8, 0, 3.6, 1.25, 2.1);
  box(p, hull, 0, 1.25, 0, 2.7, 0.55, 1.5);
  box(p, ivory, 0, 1.58, -0.2, 1, 0.12, 0.65);
  for (const s of [-1, 1]) {
    box(p, rust, s * 2, 0.6, 0.3, 1.2, 0.8, 2.7, s * 0.1);
    box(p, steel, s * 2, 1, 0.2, 0.95, 0.18, 2);
    box(p, light, s * 2, 1.12, -0.65, 0.6, 0.08, 0.15);
    box(p, black, s * 1.55, 0.9, 1.4, 0.4, 0.4, 1.7);
    box(p, light, s * 1.55, 0.9, 2.28, 0.33, 0.28, 0.08);
    for (let j = 0; j < 3; j++)
      box(p, light, s * 2.48, 0.6, -0.65 + j * 0.7, 0.05, 0.18, 0.3);
  }
  const core = part(p, sphereGeo, light, 0, 1.1, 1.04, 0.55, 0.55, 0.3);
  const solid = bake(p);
  solid.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  g.remove(p);
  g.add(solid);
  const ring = part(
    g,
    new T.TorusGeometry(1.1, 0.08, 6, 32),
    light,
    0,
    1.55,
    0.1,
    1,
    1,
    1,
    Math.PI / 2,
  );
  ring.name = "crown";
  const shadow = part(
    g,
    new T.PlaneGeometry(8, 8),
    shadowMat,
    0,
    0.03,
    0.2,
    1,
    1,
    1,
    -Math.PI / 2,
  );
  shadow.name = "shadow";
  templates.set("boss" + kind, g);
  return g.clone();
}
export function trainModel() {
  const g = new T.Group(),
    p = new T.Group();
  g.add(p);
  for (let j = 0; j < 3; j++) {
    const z = j * 3.4;
    box(p, hull, 0, 0.82, z, 1.75, 1.65, 3);
    box(p, steel, 0, 1.7, z, 1.8, 0.16, 2.9);
    box(p, dark, 0, 1.8, z, 0.9, 0.14, 1.4);
    for (const s of [-1, 1])
      for (let k = 0; k < 3; k++)
        box(p, mint, s * 0.887, 1.14, z - 0.9 + k * 0.85, 0.03, 0.46, 0.55);
    box(p, ivory, 0, 0.9, z - 1.51, 1.5, 1.05, 0.05);
    box(p, amber, -0.55, 0.5, z - 1.56, 0.26, 0.16, 0.04);
    box(p, amber, 0.55, 0.5, z - 1.56, 0.26, 0.16, 0.04);
    box(p, black, 0, 1.2, z - 1.56, 1.25, 0.45, 0.05);
  }
  const solid = bake(p);
  g.remove(p);
  g.add(solid);
  return g;
}

export class World {
  constructor(canvas, settings) {
    this.settings = settings;
    this.scene = new T.Scene();
    this.scene.background = new T.Color(0x0b2026);
    this.scene.fog = new T.FogExp2(0x0b2026, 0.026);
    this.camera = new T.PerspectiveCamera(50, 1, 0.1, 190);
    this.renderer = new T.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    const pmrem = new T.PMREMGenerator(this.renderer),
      room = new RoomEnvironment();
    this.scene.environment = pmrem.fromScene(room, 0.04).texture;
    this.scene.environmentIntensity = 0.65;
    room.dispose();
    pmrem.dispose();
    this.composer = new EffectComposer(
      this.renderer,
      new T.WebGLRenderTarget(1, 1, { type: T.HalfFloatType }),
    );
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new T.Vector2(1, 1), 0.48, 0.5, 1.05);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.scene.add(new T.HemisphereLight(0xa5d5de, 0x292019, 1.8));
    const sun = new T.DirectionalLight(0xffd5a2, 4.2);
    sun.position.set(-7, 16, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -15,
      right: 15,
      top: 20,
      bottom: -20,
      near: 0.5,
      far: 65,
    });
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.025;
    this.sun = sun;
    this.scene.add(sun);
    const cool = new T.DirectionalLight(0x77c6db, 2.6);
    cool.position.set(8, 7, -10);
    this.scene.add(cool);
    this.flash = new T.PointLight(0xffb469, 0, 16, 2);
    this.scene.add(this.flash);
    this.sectorLight = new T.PointLight(0x64dbcd, 28, 40, 1.5);
    this.sectorLight.position.set(0, 5, -14);
    this.scene.add(this.sectorLight);
    this.segments = [];
    this.signs = [];
    this.fans = [];
    this.rings = [];
    this.particles = [];
    this.themes = [];
    this.trainTemplate = trainModel();
    this.makeEnvironment();
    this.makeParticleSystem();
    this.makeWreckageSystem();
    this.makeProjectileBatches();
    this.ray = new T.Raycaster();
    this.plane = new T.Plane(new T.Vector3(0, 1, 0), -0.55);
    this.tmpVec = new T.Vector3();
    this.t = 0;
    this.distance = 0;
    this.shake = 0;
    this.sector = 0;
    this.resize();
    this.renderer.info.autoReset = false;
    addEventListener("resize", () => this.resize());
  }
  resize() {
    const w = innerWidth,
      h = innerHeight,
      aspect = w / h,
      portrait = aspect < 0.8;
    this.viewH = Math.max(31, 22 / aspect);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.tiltY = portrait ? 34 : 26;
    this.tiltZ = portrait ? 22 : 29;
    this.lookZ = portrait ? -8 : -5;
    const distance = Math.hypot(this.tiltY, this.tiltZ);
    this.camDistance = Math.max(
      1,
      ((portrait ? 9.8 : 11) / (0.466 * aspect) +
        ((10 - this.lookZ) * this.tiltZ) / distance) /
        distance,
    );
    this.scene.fog.density = 0.026 / this.camDistance;
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.particleMaterial.uniforms.pixelScale.value = h / this.viewH;
    this.width = w;
    this.height = h;
  }
  setQuality(low) {
    this.low = low;
    this.renderer.shadowMap.enabled = !low;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : 1.35));
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.resize();
  }
  makeEnvironment() {
    const floorTex = canvasTexture(256, 256, (c, w, h) => {
      c.fillStyle = "#64777b";
      c.fillRect(0, 0, w, h);
      let seed = 91;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      for (let i = 0; i < 5000; i++) {
        const a = random() * 0.1;
        c.fillStyle = `rgba(0,0,0,${a})`;
        c.fillRect(
          random() * w,
          random() * h,
          random() * 4 + 1,
          random() * 4 + 1,
        );
      }
      c.strokeStyle = "#47595e";
      c.lineWidth = 2;
      for (let i = 0; i <= 256; i += 64) {
        c.beginPath();
        c.moveTo(i, 0);
        c.lineTo(i, h);
        c.moveTo(0, i);
        c.lineTo(w, i);
        c.stroke();
      }
    });
    floorTex.wrapS = floorTex.wrapT = T.RepeatWrapping;
    floorTex.repeat.set(12, 24);
    const floor = new T.MeshStandardMaterial({
      color: 0x59717a,
      map: floorTex,
      metalness: 0.48,
      roughness: 0.32,
    });
    const deck = box(this.scene, floor, 0, -0.3, -22, 65, 0.3, 120);
    deck.receiveShadow = true;
    const ties = new T.InstancedMesh(boxGeo, rust, 400),
      rails = new T.Group(),
      o = new T.Object3D();
    let idx = 0;
    for (const x of [-6, -3, 0, 3, 6]) {
      for (const dx of [-0.53, 0.53]) {
        box(rails, steel, x + dx, -0.07, -22, 0.07, 0.17, 115);
        box(rails, mint, x + dx, 0.023, -22, 0.018, 0.015, 115);
      }
      for (let i = 0; i < 80; i++) {
        o.position.set(x, -0.12, -68 + i * 1.1);
        o.scale.set(1.5, 0.09, 0.2);
        o.updateMatrix();
        ties.setMatrixAt(idx++, o.matrix);
      }
    }
    ties.instanceMatrix.needsUpdate = true;
    this.scene.add(ties, bake(rails));
    this.ties = ties;
    this.stripMat = metal(0xb4dacc, 0x5fdfcd, 1.8);
    this.decorMats = [this.stripMat, amber];
    for (let i = 0; i < 15; i++) {
      const p = new T.Group(),
        g = new T.Group();
      for (const s of [-1, 1]) {
        box(p, hull, s * 10.7, 0.6, 0, 3.8, 1.35, 4.8);
        box(p, ivory, s * 8.85, 1.34, 0, 0.18, 0.08, 4.8);
        box(p, amber, s * 8.7, 1.35, 0, 0.08, 0.04, 3.4);
        box(p, dark, s * 12.35, 3.2, 0, 0.45, 5.3, 5);
        box(p, hull, s * 10.25, 3, -1.8, 0.65, 5.3, 0.65);
        box(p, steel, s * 10.25, 5.6, -1.8, 0.95, 0.25, 0.95);
        for (let k = 0; k < 5; k++)
          box(
            p,
            k % 2 ? steel : hull,
            s * 12.05,
            1.5 + k * 0.7,
            0,
            0.08,
            0.5,
            4.8,
          );
        box(p, this.stripMat, s * 10.2, 3.5, -1.43, 0.45, 1.5, 0.06);
        box(p, black, s * 11.5, 1.8, 0.9, 1.3, 1.8, 1.1);
        box(p, rust, s * 11.5, 2.7, 0.9, 1.4, 0.14, 1.2);
        part(p, cylGeo, rust, s * 12, 3.5, 0, 0.16, 5, 0.16, Math.PI / 2);
        if (i % 3 === 0) {
          box(p, hull, s * 9.7, 1.8, 0.5, 0.5, 0.9, 1.8);
          for (let k = 0; k < 3; k++)
            box(p, steel, s * 9.4, 2.1, 0.1 + k * 0.4, 0.08, 0.1, 0.22);
        }
        if (i % 3 === 1) {
          box(p, rust, s * 11.1, 1.6, 0, 1.4, 0.55, 0.6);
          for (const dx of [-0.5, 0.5])
            box(p, steel, s * 11.1 + dx, 1.2, 0, 0.08, 0.8, 0.12);
        }
        if (i % 4 === 2) {
          for (let j = 0; j < 3; j++) {
            box(p, rust, s * 11, 1.7 + j * 0.4, 0.5, 1, 0.35, 1);
            box(p, amber, s * 11, 1.73 + j * 0.4, -0.01, 0.45, 0.06, 0.015);
          }
        }
        box(p, black, s * 7.8, 0.04, 0, 0.6, 0.015, 2.8);
        box(p, this.stripMat, s * 7.8, 0.05, 0, 0.05, 0.01, 2.8);
      }
      for (const s of [-1, 1]) {
        box(p, dark, s * 9.6, 6, -1.8, 4.2, 0.38, 0.45);
        box(p, steel, s * 8.9, 5.4, -1.8, 0.18, 1.6, 0.18);
        box(p, this.stripMat, s * 8.7, 5.1, -1.8, 1.8, 0.07, 0.16);
      }
      g.add(bake(p));
      g.position.z = -60 + i * 5;
      g.userData.id = i;
      this.scene.add(g);
      this.segments.push(g);
      // Irregular service bays, posters, puddles and sector machinery break up the station's rhythm.
      const bay = new T.Group(),
        side = i % 2 ? -1 : 1;
      if (i % 5 === 0) {
        for (const dx of [-1, 1]) {
          part(bay, cylGeo, rust, side * 15 + dx * 0.8, 1.1, 0, 0.6, 2.2, 0.6);
          part(
            bay,
            cylGeo,
            steel,
            side * 15 + dx * 0.8,
            2.3,
            0,
            0.63,
            0.1,
            0.63,
          );
          box(bay, amber, side * 15 + dx * 0.8, 1.4, -0.6, 0.65, 0.12, 0.03);
        }
        box(bay, dark, side * 15, 0.1, 0, 4, 0.2, 3.5);
      } else if (i % 5 === 1) {
        box(bay, hull, side * 15, 1.2, 0, 3, 2.4, 3);
        box(bay, black, side * 15, 2.45, 0, 2, 0.12, 2);
        for (let j = 0; j < 7; j++)
          box(bay, steel, side * 15, 2.55, -0.8 + j * 0.27, 2, 0.05, 0.07);
        box(bay, mint, side * 13.45, 1.5, 0, 0.04, 0.22, 1.3);
      } else if (i % 5 === 2) {
        for (let j = 0; j < 3; j++) {
          box(
            bay,
            rust,
            side * 15 + j * 0.4,
            0.5 + j * 0.5,
            j * 0.4,
            2.2,
            1,
            1.8,
          );
          box(
            bay,
            ivory,
            side * 15 + j * 0.4,
            0.7 + j * 0.5,
            j * 0.4 - 0.92,
            0.45,
            0.3,
            0.02,
          );
        }
      } else if (i % 5 === 3) {
        for (const dx of [-1, 1]) {
          part(
            bay,
            cylGeo,
            steel,
            side * 15 + dx * 0.45,
            1.2,
            0,
            0.2,
            2.4,
            0.2,
          );
          box(bay, dark, side * 15 + dx * 0.45, 2.4, 0, 0.6, 0.2, 1.5);
        }
        box(bay, amber, side * 15, 0.2, 0, 2.7, 0.09, 2.8);
      } else {
        box(bay, black, side * 15, 0.02, 0, 4, 0.03, 4);
        for (let j = 0; j < 5; j++)
          box(bay, steel, side * 15 + j * 0.5 - 1, 0.07, 0, 0.08, 0.08, 3.8);
      }
      g.add(bake(bay));
      const puddle = new T.Mesh(
        new T.PlaneGeometry(1, 1),
        new T.MeshPhysicalMaterial({
          color: 0x344b53,
          transparent: true,
          opacity: 0.6,
          metalness: 0.85,
          roughness: 0.12,
          clearcoat: 1,
        }),
      );
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.set(Math.sin(i * 9.2) * 6, 0.012, Math.cos(i * 5) * 1.4);
      puddle.scale.set(1.5 + (i % 4), 0.3 + (i % 3) * 0.4, 1);
      g.add(puddle);
      if (i % 3 === 1) {
        const posterTex = canvasTexture(256, 320, (c, w, h) => {
          c.fillStyle = ["#cc944b", "#608a8e", "#9b6654"][i % 3];
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#172c31";
          c.font = "bold 55px Arial";
          c.fillText(["KEEP", "STAY", "LIVE"][i % 3], 15, 70);
          c.fillText(["MOVING", "CLEAR", "RAILS"][i % 3], 15, 125);
          c.lineWidth = 5;
          c.strokeStyle = "#243b3d";
          c.strokeRect(17, 154, 222, 140);
          c.beginPath();
          c.moveTo(35, 240);
          c.lineTo(100, 180);
          c.lineTo(170, 250);
          c.lineTo(220, 185);
          c.stroke();
          c.font = "14px monospace";
          c.fillText("IRONLINE / TRANSIT AUTHORITY", 13, 311);
        });
        const poster = part(
          g,
          new T.PlaneGeometry(1.4, 1.75),
          new T.MeshBasicMaterial({ map: posterTex }),
          side * 12,
          3.6,
          0.5,
          1,
          1,
          1,
          0,
          (side * -Math.PI) / 2,
        );
      }
      const theme = new T.Group();
      for (const s of [-1, 1]) {
        part(theme, cylGeo, amber, s * 11.4, 1.45, 0, 0.45, 0.1, 0.45);
        part(
          theme,
          new T.ConeGeometry(0.5, 1.4, 7),
          metal(0xfab26f, 0xfc7f25, 2),
          s * 11.4,
          2.2,
          0,
          0.7,
          1,
          0.7,
        );
      }
      theme.visible = false;
      g.add(theme);
      this.themes.push({ mesh: theme, sector: 1 });
      const water = new T.Mesh(
        new T.PlaneGeometry(3.3, 4.95),
        new T.MeshPhysicalMaterial({
          color: 0x1e7892,
          metalness: 0.8,
          roughness: 0.13,
          transparent: true,
          opacity: 0.7,
          clearcoat: 1,
        }),
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(side * 10.7, 1.36, 0);
      water.visible = false;
      g.add(water);
      this.themes.push({ mesh: water, sector: 2 });
      if (i % 3 === 0) {
        const tex = this.signTexture(i),
          m = new T.MeshBasicMaterial({ map: tex });
        const sign = part(
          g,
          new T.PlaneGeometry(4.7, 1.2),
          m,
          i % 2 ? -10.2 : 10.2,
          4.75,
          -1.36,
        );
        this.signs.push(sign);
      }
      const glow = new T.Mesh(
        new T.PlaneGeometry(7, 5),
        new T.MeshBasicMaterial({
          map: glowTex,
          color: i % 2 ? 0x64dbcd : 0xffac61,
          transparent: true,
          opacity: 0.17,
          depthWrite: false,
          blending: T.AdditiveBlending,
        }),
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(i % 2 ? -5 : 5, 0.035, 0);
      g.add(glow);
    }
    const debris = new T.InstancedMesh(boxGeo, steel, 90);
    for (let i = 0; i < 90; i++) {
      o.position.set(
        (i % 2 ? 1 : -1) * (7.5 + Math.sin(i * 3.7) * 0.8),
        -0.03,
        -60 + ((i * 1.77) % 70),
      );
      o.rotation.set(i, 0.1 * i, i * 0.7);
      o.scale.set(0.04 + (i % 4) * 0.03, 0.025, 0.15);
      o.updateMatrix();
      debris.setMatrixAt(i, o.matrix);
    }
    this.scene.add(debris);
    const dustGeo = new T.BufferGeometry(),
      arr = new Float32Array(450);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = Math.sin(i * 5.62) * 14;
      arr[i + 1] = ((i * 7.3) % 4) + 0.3;
      arr[i + 2] = -45 + ((i * 3.141) % 64);
    }
    dustGeo.setAttribute("position", new T.BufferAttribute(arr, 3));
    this.dust = new T.Points(
      dustGeo,
      new T.PointsMaterial({
        color: 0xb6d8cc,
        size: 0.035,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    this.scene.add(this.dust);
  }
  signTexture(i) {
    return canvasTexture(512, 128, (c, w, h) => {
      c.fillStyle = "#102229";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#dbd7b8";
      c.font = "bold 29px Arial";
      c.fillText(SECTORS[this.sector || 0].name, 20, 46);
      c.fillStyle = "#ffb164";
      c.fillRect(0, 74, w, 5);
      c.font = "16px monospace";
      c.fillStyle = "#8aa6a7";
      c.fillText(
        [
          "↗ UPTOWN / NO SERVICE",
          "DO NOT CROSS LIVE RAILS",
          "PLATFORM " + (i + 1) + " / EXPRESS",
          "EMERGENCY ACCESS ONLY",
        ][i % 4],
        20,
        108,
      );
    });
  }
  setSector(index) {
    if (index === this.sector) return;
    this.sector = index;
    const s = SECTORS[index];
    this.scene.fog.color.setHex(s.fog);
    this.scene.background.setHex(s.fog);
    this.sectorLight.color.setHex(s.color);
    this.stripMat.emissive.setHex(s.color);
    this.themes.forEach((t) => (t.mesh.visible = t.sector === index));
    this.signs.forEach((x, i) => {
      x.material.map.dispose();
      x.material.map = this.signTexture(i);
      x.material.needsUpdate = true;
    });
  }
  makeParticleSystem() {
    const count = 1100;
    this.particleGeo = new T.BufferGeometry();
    this.particlePos = new Float32Array(count * 3);
    this.particleCol = new Float32Array(count * 3);
    this.particleSize = new Float32Array(count);
    this.particleAlpha = new Float32Array(count);
    this.particleGeo.setAttribute(
      "position",
      new T.BufferAttribute(this.particlePos, 3).setUsage(T.DynamicDrawUsage),
    );
    this.particleGeo.setAttribute(
      "color",
      new T.BufferAttribute(this.particleCol, 3).setUsage(T.DynamicDrawUsage),
    );
    this.particleGeo.setAttribute(
      "size",
      new T.BufferAttribute(this.particleSize, 1).setUsage(T.DynamicDrawUsage),
    );
    this.particleGeo.setAttribute(
      "alpha",
      new T.BufferAttribute(this.particleAlpha, 1).setUsage(T.DynamicDrawUsage),
    );
    this.particleMaterial = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: { pixelScale: { value: 20 } },
      vertexShader:
        "attribute vec3 color; attribute float size; attribute float alpha; varying vec3 vColor; varying float vAlpha; uniform float pixelScale; void main(){vColor=color;vAlpha=alpha; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(size*pixelScale,1.,90.);}",
      fragmentShader:
        "varying vec3 vColor; varying float vAlpha; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float a=pow(1.-r,1.7)*vAlpha;gl_FragColor=vec4(vColor*(1.2+pow(1.-r,5.)*2.),a);}",
    });
    const points = new T.Points(this.particleGeo, this.particleMaterial);
    points.frustumCulled = false;
    this.scene.add(points);
  }
  makeProjectileBatches() {
    this.boltMat = new T.MeshBasicMaterial({ color: 0xffffff });
    this.bolts = new T.InstancedMesh(sphereGeo, this.boltMat, 700);
    this.bolts.instanceMatrix.setUsage(T.DynamicDrawUsage);
    this.bolts.frustumCulled = false;
    this.scene.add(this.bolts);
    this.boltObj = new T.Object3D();
    this.boltColor = new T.Color();
  }
  makeWreckageSystem() {
    this.shards = [];
    this.shardCapacity = 480;
    const layer = (opacity) => {
      const mesh = new T.InstancedMesh(
        boxGeo,
        new T.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity,
          blending: T.AdditiveBlending,
          depthWrite: false,
        }),
        this.shardCapacity,
      );
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
      mesh.frustumCulled = false;
      mesh.count = 0;
      this.scene.add(mesh);
      return mesh;
    };
    this.shardGlow = layer(0.38);
    this.shardCore = layer(1);
    this.shardTrail = layer(0.34);
    this.shardObj = new T.Object3D();
    this.shardSpin = new T.Quaternion();
    this.shardColor = new T.Color();
    this.shardDirection = new T.Vector3();
  }
  shatter(mesh, x, z, color, scale = 1) {
    // Launch actual hull edges, not another cloud of glowing dots.
    const sources = [];
    let total = 0;
    mesh.updateMatrixWorld(true);
    mesh.traverse((o) => {
      if (!o.isMesh || !o.visible) return;
      if (!wreckEdges.has(o.geometry)) {
        const edges = new T.EdgesGeometry(o.geometry, 28),
          positions = edges.getAttribute("position").array,
          kept = [];
        for (let i = 0; i < positions.length; i += 6) {
          if (
            Math.hypot(
              positions[i] - positions[i + 3],
              positions[i + 1] - positions[i + 4],
              positions[i + 2] - positions[i + 5],
            ) > 0.16
          )
            kept.push(...positions.slice(i, i + 6));
        }
        edges.dispose();
        wreckEdges.set(o.geometry, new Float32Array(kept));
      }
      const edges = wreckEdges.get(o.geometry);
      if (edges.length) {
        total += edges.length / 6;
        sources.push({ edges, matrix: o.matrixWorld, end: total });
      }
    });
    if (!total) return;
    const c = new T.Color(color),
      count = Math.round((12 + scale * 10) * (this.low ? 0.6 : 1)),
      a = new T.Vector3(),
      b = new T.Vector3();
    for (let i = 0; i < count; i++) {
      const choice = Math.floor(Math.random() * total),
        source = sources.find((s) => choice < s.end),
        j = (choice - (source.end - source.edges.length / 6)) * 6;
      a.fromArray(source.edges, j).applyMatrix4(source.matrix);
      b.fromArray(source.edges, j + 3).applyMatrix4(source.matrix);
      const dir = b.clone().sub(a),
        length = Math.min(2.2, dir.length()),
        center = a.clone().add(b).multiplyScalar(0.5),
        angle =
          Math.atan2(center.x - x, center.z - z) + (Math.random() - 0.5) * 1.8,
        speed = 3 + Math.random() * (4 + scale * 2),
        life = 0.85 + Math.random() * 0.75;
      this.shards.push({
        x: center.x,
        y: Math.max(0.15, center.y),
        z: center.z,
        vx: Math.sin(angle) * speed,
        vz: Math.cos(angle) * speed,
        vy: 2 + Math.random() * 5,
        length,
        width: 0.035 + Math.random() * 0.035,
        rotation: new T.Quaternion().setFromUnitVectors(
          shardAxis,
          dir.normalize(),
        ),
        axis: new T.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize(),
        spin: (Math.random() - 0.5) * 15,
        life,
        max: life,
        r: c.r,
        g: c.g,
        b: c.b,
      });
    }
    if (this.shards.length > this.shardCapacity)
      this.shards.splice(0, this.shards.length - this.shardCapacity);
  }
  updateWreckage(dt) {
    for (const p of this.shards) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 8 * dt;
      const drag = Math.exp(-dt * 0.7);
      p.vx *= drag;
      p.vz *= drag;
      p.rotation.premultiply(
        this.shardSpin.setFromAxisAngle(p.axis, p.spin * dt),
      );
      if (p.y < 0.08) {
        p.y = 0.08;
        p.vy = Math.abs(p.vy) * 0.35;
      }
    }
    this.shards = this.shards.filter((p) => p.life > 0);
    this.shards.forEach((p, i) => {
      const fade = Math.min(1, p.life * 2.4),
        o = this.shardObj;
      o.position.set(p.x, p.y, p.z);
      o.quaternion.copy(p.rotation);
      o.scale.set(p.length, p.width * 3, p.width * 3);
      o.updateMatrix();
      this.shardGlow.setMatrixAt(i, o.matrix);
      this.shardColor.setRGB(p.r * 3 * fade, p.g * 3 * fade, p.b * 3 * fade);
      this.shardGlow.setColorAt(i, this.shardColor);
      o.scale.set(p.length, p.width, p.width);
      o.updateMatrix();
      this.shardCore.setMatrixAt(i, o.matrix);
      this.shardColor.setRGB(
        (0.7 + p.r) * fade,
        (0.7 + p.g) * fade,
        (0.7 + p.b) * fade,
      );
      this.shardCore.setColorAt(i, this.shardColor);
      this.shardDirection.set(p.vx, p.vy, p.vz);
      const trail = Math.min(1.5, this.shardDirection.length() * 0.09);
      o.position.addScaledVector(this.shardDirection, -0.045);
      o.quaternion.setFromUnitVectors(
        shardAxis,
        this.shardDirection.normalize(),
      );
      o.scale.set(trail, p.width * 0.7, p.width * 0.7);
      o.updateMatrix();
      this.shardTrail.setMatrixAt(i, o.matrix);
      this.shardColor.setRGB(p.r * fade, p.g * fade, p.b * fade);
      this.shardTrail.setColorAt(i, this.shardColor);
    });
    for (const mesh of [this.shardGlow, this.shardCore, this.shardTrail]) {
      mesh.count = this.shards.length;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }
  burst(x, z, color = 0xffb45d, n = 24, big = false) {
    const c = new T.Color(color);
    for (let i = 0; i < n * (this.low ? 0.55 : 1); i++) {
      const a = Math.random() * Math.PI * 2,
        s = 1 + Math.random() * (big ? 10 : 6);
      this.particles.push({
        x,
        z,
        y: 0.65,
        vx: Math.sin(a) * s,
        vz: Math.cos(a) * s,
        vy: 1 + Math.random() * 5,
        life: 0.35 + Math.random() * 0.7,
        max: 1,
        size: 0.15 + Math.random() * (big ? 0.9 : 0.5),
        r: c.r,
        g: c.g,
        b: c.b,
      });
    }
    if (this.particles.length > 1100)
      this.particles.splice(0, this.particles.length - 1100);
    if (big) {
      this.flash.position.set(x, 2, z);
      this.flash.intensity = 70;
      this.shake = Math.max(this.shake, 0.22);
    }
  }
  ring(x, z, color = 0xffb45d, scale = 1) {
    const mesh = new T.Mesh(
      new T.RingGeometry(0.85, 1, 48),
      new T.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.8,
        side: T.DoubleSide,
        depthWrite: false,
        blending: T.AdditiveBlending,
      }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.2, z);
    this.scene.add(mesh);
    this.rings.push({ mesh, t: 0, scale });
  }
  warning(x) {
    if (!this.warningTemplate) {
      const p = new T.Group();
      for (let i = 0; i < 20; i++)
        box(p, red, 0, 0.05, -23 + i * 1.9, 1.4, 0.025, 0.7);
      this.warningTemplate = bake(p);
    }
    const g = this.warningTemplate.clone();
    g.position.x = x;
    this.scene.add(g);
    return g;
  }
  pickupModel(type, weapon = "laser", name, color) {
    const key = "pickup:" + (type === "weapon" ? weapon : type);
    if (templates.has(key)) return templates.get(key).clone();
    const col =
        color ??
        (type === "shield"
          ? 0x8cf3d8
          : type === "charge"
            ? 0xffc66f
            : 0xb4b7ff),
      paint = metal(col),
      light = metal(col, col, 1.3),
      g = new T.Group(),
      model = new T.Group(),
      rotor = new T.Group(),
      owned = [];
    const geo = (geometry) => {
      owned.push(geometry);
      return geometry;
    };
    const emblem = (points, material, depth = 0.13) => {
      const s = new T.Shape();
      points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
      s.closePath();
      return part(
        model,
        geo(
          new T.ExtrudeGeometry(s, {
            depth,
            bevelEnabled: true,
            bevelSize: 0.035,
            bevelThickness: 0.025,
            bevelSegments: 1,
          }),
        ),
        material,
        0,
        0,
        -depth / 2,
      );
    };
    if (type === "shield") {
      emblem(
        [
          [-0.56, 0.56],
          [0.56, 0.56],
          [0.5, -0.2],
          [0, -0.7],
          [-0.5, -0.2],
        ],
        steel,
        0.22,
      );
      const face = emblem(
        [
          [-0.44, 0.43],
          [0.44, 0.43],
          [0.37, -0.16],
          [0, -0.53],
          [-0.37, -0.16],
        ],
        paint,
      );
      face.position.z += 0.18;
      box(model, light, 0, 0.02, 0.3, 0.17, 0.64, 0.08);
      box(model, light, 0, 0.08, 0.3, 0.55, 0.17, 0.08);
      model.rotation.x = -0.6;
    } else if (type === "charge") {
      part(model, cylGeo, dark, 0, 0, 0, 0.42, 1.1, 0.42);
      for (const y of [-0.53, 0.53])
        part(model, cylGeo, steel, 0, y, 0, 0.48, 0.13, 0.48);
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        box(
          model,
          light,
          Math.sin(a) * 0.4,
          0,
          Math.cos(a) * 0.4,
          0.12,
          0.72,
          0.12,
          a,
        );
      }
      const bolt = emblem(
        [
          [0.1, 0.42],
          [-0.24, -0.02],
          [0.02, -0.02],
          [-0.1, -0.43],
          [0.28, 0.08],
          [0.04, 0.08],
        ],
        ivory,
        0.1,
      );
      bolt.position.z = 0.45;
    } else {
      box(model, dark, 0, 0, 0.18, 0.76, 0.48, 0.72);
      box(model, paint, 0, 0.23, 0.16, 0.6, 0.14, 0.57);
      box(model, steel, 0, -0.3, 0.36, 0.24, 0.34, 0.28);
      const barrel = (x, y, length = 1.1, radius = 0.1, angle = 0) => {
        const b = new T.Group();
        part(
          b,
          cylGeo,
          steel,
          0,
          0,
          -length * 0.4,
          radius,
          length,
          radius,
          Math.PI / 2,
        );
        part(
          b,
          cylGeo,
          light,
          0,
          0,
          -length * 0.9,
          radius * 1.1,
          0.12,
          radius * 1.1,
          Math.PI / 2,
        );
        b.position.set(x, y, 0);
        b.rotation.y = angle;
        model.add(b);
      };
      if (weapon === "saw") {
        part(
          model,
          geo(new T.TorusGeometry(0.54, 0.13, 6, 24)),
          steel,
          0,
          0.18,
          -0.45,
          1,
          1,
          1,
        );
        for (let i = 0; i < 10; i++) {
          const a = (i * Math.PI) / 5;
          part(
            model,
            boxGeo,
            light,
            Math.sin(a) * 0.58,
            0.18 + Math.cos(a) * 0.58,
            -0.45,
            0.22,
            0.25,
            0.16,
            0,
            0,
            -a + 0.35,
          );
        }
      } else if (weapon === "plasma") {
        part(model, sphereGeo, light, 0, 0.15, -0.48, 0.38, 0.38, 0.5);
        for (const z of [-0.2, -0.6])
          part(
            model,
            geo(new T.TorusGeometry(0.45, 0.055, 6, 20)),
            steel,
            0,
            0.15,
            z,
          );
      } else if (weapon === "nova") {
        for (let i = -2; i <= 2; i++)
          barrel(i * 0.2, 0.1, 0.8, 0.075, -i * 0.22);
      } else if (weapon === "overheat") {
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          barrel(Math.sin(a) * 0.28, Math.cos(a) * 0.28, 1.05, 0.07);
        }
      } else if (weapon === "tri") {
        barrel(-0.27, 0);
        barrel(0.27, 0);
        barrel(0, 0.32);
      } else if (weapon === "heavy") {
        barrel(0, 0.08, 1.25, 0.25);
        box(model, paint, -0.5, 0, -0.24, 0.23, 0.4, 0.65);
        box(model, paint, 0.5, 0, -0.24, 0.23, 0.4, 0.65);
      } else if (weapon === "lance") {
        barrel(0, 0, 1.65, 0.12);
        for (const x of [-0.23, 0.23])
          box(model, light, x, 0.06, -0.74, 0.09, 0.2, 1.16);
      } else {
        barrel(-0.24, 0);
        barrel(0.24, 0);
      }
    }
    rotor.name = "pickup-rotor";
    rotor.position.y = 1.1;
    rotor.scale.setScalar(1.2);
    rotor.add(bake(model));
    g.add(rotor);
    part(
      g,
      geo(new T.TorusGeometry(0.72, 0.035, 5, 28)),
      light,
      0,
      0.15,
      0,
      1,
      1,
      1,
      Math.PI / 2,
    );
    const label =
        name ||
        (type === "shield"
          ? "SHIELD +42"
          : type === "charge"
            ? "PULSE +40"
            : weapon.toUpperCase()),
      font = "bold 32px ui-monospace, monospace",
      measure = document.createElement("canvas").getContext("2d");
    measure.font = font;
    const width = Math.ceil(measure.measureText(label).width) + 36,
      map = canvasTexture(width, 64, (c, w, h) => {
        c.fillStyle = "#07151eef";
        c.fillRect(0, 0, w, h);
        c.strokeStyle = "#" + col.toString(16).padStart(6, "0");
        c.lineWidth = 3;
        c.strokeRect(1.5, 1.5, w - 3, h - 3);
        c.fillStyle = "#f0f9ef";
        c.font = font;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(label, w / 2, h / 2 + 1);
      }),
      tag = new T.Sprite(
        new T.SpriteMaterial({
          map,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
          sizeAttenuation: false,
        }),
      );
    tag.name = "pickup-label";
    tag.position.y = 2.35;
    tag.frustumCulled = false;
    tag.userData.aspect = width / 64;
    tag.renderOrder = 20;
    g.add(tag);
    g.userData = { label, type, weapon };
    templates.set(key, g);
    // Emblem and baked source geometries are no longer needed. The base ring is shared by clones.
    const ringGeometry = g.children.find((o) => o.isMesh)?.geometry;
    owned
      .filter((geometry) => geometry !== ringGeometry)
      .forEach((geometry) => geometry.dispose());
    return g.clone();
  }
  pointer(x, y) {
    this.ray.setFromCamera(
      new T.Vector2((x / innerWidth) * 2 - 1, (-y / innerHeight) * 2 + 1),
      this.camera,
    );
    return this.ray.ray.intersectPlane(this.plane, this.tmpVec)?.clone();
  }
  project(x, z, y = 1) {
    return new T.Vector3(x, y, z).project(this.camera);
  }
  pop(x, z, label, color) {
    const v = this.project(x, z),
      d = document.createElement("div");
    d.className = "pop";
    d.textContent = label;
    d.style.left = (v.x * 0.5 + 0.5) * innerWidth + "px";
    d.style.top = (-v.y * 0.5 + 0.5) * innerHeight + "px";
    if (color) d.style.color = color;
    document.getElementById("popups").append(d);
    setTimeout(() => d.remove(), 1100);
  }
  update(dt, game) {
    this.t += dt;
    const moving = game.state === "play" || game.state === "menu";
    const velocity =
      game.state === "menu" ? 3 : 5 + Math.min(6, game.wave * 0.15);
    if (moving) {
      this.distance += dt * velocity;
      this.segments.forEach((p) => {
        p.position.z += dt * velocity;
        if (p.position.z > 15) p.position.z -= 75;
      });
      this.ties.position.z = this.distance % 1.1;
      this.dust.position.z = (this.t * 0.4) % 8;
    }
    const menu = game.state === "menu";
    const desiredX = menu ? -6 : game.player.x * 0.08;
    this.camX =
      (this.camX || 0) + (desiredX - (this.camX || 0)) * Math.min(1, dt * 2);
    this.shake = Math.max(0, this.shake - dt);
    const s = this.settings.motion ? 0 : this.shake * 0.4;
    this.camera.position.set(
      this.camX + (Math.random() - 0.5) * s,
      this.tiltY * this.camDistance,
      this.tiltZ * this.camDistance + this.lookZ,
    );
    this.camera.lookAt(this.camX, 0, this.lookZ);
    this.camera.updateMatrixWorld();
    this.flash.intensity *= Math.exp(-dt * 10);
    this.updateWreckage(dt);
    const pickupTags = [];
    for (const item of game.pickups) {
      const label = item.labelMesh;
      if (!label) continue;
      // Screen-stable billboards stay readable while the actual item tumbles beneath them.
      const pixelH = this.width < 700 ? 26 : 28,
        pixelW = pixelH * label.userData.aspect,
        unit = (2 * Math.tan((this.camera.fov * Math.PI) / 360)) / this.height;
      label.scale.set(pixelW * unit, pixelH * unit, 1);
      const screen = this.project(
          item.x,
          item.z,
          item.mesh.position.y + label.position.y,
        ),
        sx = (screen.x * 0.5 + 0.5) * this.width,
        sy = (-screen.y * 0.5 + 0.5) * this.height;
      label.center.x = Math.max(
        0,
        Math.min(
          1,
          Math.min(
            (sx - 8) / pixelW,
            Math.max(0.5, 1 - (this.width - 8 - sx) / pixelW),
          ),
        ),
      );
      const left = sx - label.center.x * pixelW;
      let lift = 0;
      // Nearby drops stack their labels instead of covering one another on phones.
      while (
        pickupTags.some(
          (r) =>
            left < r.right + 4 &&
            left + pixelW > r.left - 4 &&
            sy - pixelH / 2 - lift < r.bottom + 4 &&
            sy + pixelH / 2 - lift > r.top - 4,
        )
      ) {
        lift += pixelH + 5;
        if (lift > (game.pickups.length + 1) * (pixelH + 5)) break;
      }
      label.center.y = 0.5 - lift / pixelH;
      const bounds = {
        left,
        right: left + pixelW,
        top: sy - pixelH / 2 - lift,
        bottom: sy + pixelH / 2 - lift,
      };
      label.userData.bounds = bounds;
      pickupTags.push(bounds);
    }
    this.particles.forEach((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.y += p.vy * dt;
      p.vy -= dt * 9;
      p.vx *= Math.exp(-dt * 1.8);
      p.vz *= Math.exp(-dt * 1.8);
      if (p.y < 0.03) {
        p.y = 0.03;
        p.vy *= -0.3;
      }
    });
    this.particles = this.particles.filter((p) => p.life > 0);
    const n = Math.min(this.particles.length, 1100);
    for (let i = 0; i < n; i++) {
      const p = this.particles[i],
        j = i * 3;
      this.particlePos[j] = p.x;
      this.particlePos[j + 1] = p.y;
      this.particlePos[j + 2] = p.z;
      this.particleCol[j] = p.r;
      this.particleCol[j + 1] = p.g;
      this.particleCol[j + 2] = p.b;
      this.particleSize[i] = p.size;
      this.particleAlpha[i] = Math.min(1, p.life * 2);
    }
    this.particleGeo.setDrawRange(0, n);
    for (const v of Object.values(this.particleGeo.attributes))
      v.needsUpdate = true;
    this.rings = this.rings.filter((r) => {
      r.t += dt;
      const k = r.t / 0.65;
      r.mesh.scale.setScalar((1 + k * 10) * r.scale);
      r.mesh.material.opacity = (1 - k) * 0.65;
      if (k >= 1) {
        this.remove(r.mesh, true);
        return false;
      }
      return true;
    });
    let count = 0;
    for (const b of [...game.bullets, ...game.shots]) {
      if (count >= 700) break;
      this.boltObj.position.set(b.x, 0.7, b.z);
      this.boltObj.rotation.y = Math.atan2(b.vx, b.vz);
      this.boltObj.scale.set(
        b.r * 1.1,
        b.r * 0.75,
        Math.max(b.r * 2, b.len || 0.45),
      );
      this.boltObj.updateMatrix();
      this.bolts.setMatrixAt(count, this.boltObj.matrix);
      this.boltColor.setHex(b.color);
      this.boltColor.multiplyScalar(b.friendly ? 2.3 : 3);
      this.bolts.setColorAt(count++, this.boltColor);
    }
    this.bolts.count = count;
    this.bolts.instanceMatrix.needsUpdate = true;
    if (this.bolts.instanceColor) this.bolts.instanceColor.needsUpdate = true;
    if (moving && Math.random() < dt * 7 && !this.low) {
      const side = Math.random() < 0.5 ? -1 : 1;
      this.burst(
        side * 8.5,
        Math.random() * 30 - 18,
        SECTORS[this.sector].accent,
        2,
      );
    }
    this.renderer.info.reset();
    if (this.low) this.renderer.render(this.scene, this.camera);
    else this.composer.render();
  }
  remove(mesh, dispose = false) {
    if (!mesh) return;
    mesh.removeFromParent();
    if (dispose)
      mesh.traverse((x) => {
        if (x.isMesh) {
          x.geometry.dispose();
          if (Array.isArray(x.material)) x.material.forEach((m) => m.dispose());
          else x.material.dispose();
        }
      });
  }
}
