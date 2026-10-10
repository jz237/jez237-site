// Development study page for the lizard sculpt, shading and rig.
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {LizardModel, LIZARD_SCALE} from './lib/LizardModel';
import {LizardRig} from './lib/LizardRig';

const q = new URLSearchParams(location.search);
const renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.append(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1612);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.4;
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.005, 20);
const controls = new OrbitControls(camera, renderer.domElement);
const key = new THREE.DirectionalLight(0xffe2b8, 2.4);
key.position.set(0.25, 0.6, 0.3);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = key.shadow.camera.bottom = -0.25;
key.shadow.camera.right = key.shadow.camera.top = 0.25;
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.004;
scene.add(key);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshStandardMaterial({color: 0x5b4632, roughness: 0.9}));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const lizard = await LizardModel.load('./lizard/');
scene.add(lizard.root);
const views: Record<string, [number[], number[]]> = {
  side: [[0.0, 0.03, 0.42], [0.0, 0.02, 0]],
  angle: [[0.25, 0.14, 0.3], [-0.01, 0.015, 0]],
  top: [[0.0, 0.45, 0.001], [0, 0, 0]],
  head: [[0.17, 0.05, 0.1], [0.1, 0.024, 0]],
  headside: [[0.1, 0.03, 0.12], [0.1, 0.024, 0]],
  front: [[0.3, 0.04, 0.0], [0.05, 0.02, 0]],
  foot: [[0.1, 0.03, 0.14], [0.05, 0.005, 0.035]],
  belly: [[0.0, -0.08, 0.25], [0, 0.01, 0]],
};
const v = views[q.get('view') || 'angle'] || views.angle;
camera.position.set(...(v[0] as [number, number, number]));
controls.target.set(...(v[1] as [number, number, number]));
controls.update();
const display = Number(q.get('display') || 0);
lizard.skin.uDisplay.value = display;
const lidOpen = Number(q.get('open') ?? 1);
lizard.eyes.forEach((e) => (e.open.value = lidOpen));
lizard.tongueOut = Number(q.get('tongue') || 0);
const world = new THREE.Matrix4();
if (!q.get('rig')) lizard.setBindPose(world);
if (q.get('jaw')) {
  const j = lizard.bone('jaw');
  const s = new THREE.Matrix4().makeScale(LIZARD_SCALE, LIZARD_SCALE, LIZARD_SCALE);
  const rot = new THREE.Matrix4().makeRotationZ(-Number(q.get('jaw')));
  lizard.bones[j].matrix.copy(s).multiply(lizard.bind[j]).multiply(rot);
  lizard.syncAttachments();
}
if (q.get('rig')) {
  const rig = new LizardRig(lizard, {heightAt: () => 0, normalAt: (_x: number, _z: number, out = new THREE.Vector3()) => out.set(0, 1, 0)});
  const mode = q.get('rig');
  const T = Number(q.get('t') || 1);
  const I = rig.inputs;
  I.clearance = Number(q.get('clear') ?? 0.7);
  I.chestLift = Number(q.get('lift') || 0);
  I.jaw = Number(q.get('jaw') || 0);
  I.display = Number(q.get('display') || 0);
  I.wave = Number(q.get('wave') || 0);
  const speed = Number(q.get('speed') || 0.12);
  const dt = 1 / 60;
  let ang = 0;
  for (let t = 0; t < T; t += dt) {
    if (mode === 'walk') {
      I.speed = speed; I.turnRate = Number(q.get('turn') || 0);
      I.heading += I.turnRate * dt;
      I.x += Math.cos(I.heading) * I.speed * dt;
      I.z -= Math.sin(I.heading) * I.speed * dt;
    } else if (mode === 'turn') {
      I.turnRate = 2; I.heading += 2 * dt;
    }
    ang += dt;
    rig.update(dt);
  }
  lizard.root.updateMatrixWorld(true);
  // keep the camera framing relative to the lizard
  const off = new THREE.Vector3(I.x, 0, I.z);
  camera.position.add(off);
  controls.target.add(off);
  controls.update();
  (window as any).rig = rig;
}
const info = document.getElementById('info')!;
info.textContent = `${lizard.data.vertexCount} verts · ${lizard.data.indexCount / 3} tris`;
addEventListener('resize', () => {camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);});
renderer.setAnimationLoop(() => {controls.update(); renderer.render(scene, camera);});
(window as any).studyReady = true;
