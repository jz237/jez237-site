import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBetta } from '../../../betta-atelier/src/fish.js';
import { FIN_QUALITY } from '../../../betta-atelier/src/fin-dynamics.js';
import { VarietyPainter } from '../../../betta-atelier/src/varieties.js';
import { BettaSwim, BETTA_SCALE, bettaMouth, swimPose } from '../fish/bettaSwim.mjs';
import { FramePace } from '../app/framePace.mjs';
import { VarietyMenu } from '../app/VarietyMenu';
import { NightToggle } from '../app/NightToggle';
import { FollowToggle } from '../app/FollowToggle';
import { keptNight, NIGHT_LETHARGY } from '../app/night.mjs';
import { BED_LEVEL, GLASS_INNER } from '../render/scape/mesh.mjs';
import { makeBowl, WATER_LEVEL } from './scenery.mjs';
import '../app/styles.css';
import './bowl.css';

export async function startLowPowerBowl() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) throw new Error('WebGL2 unavailable');
  const renderer = new T.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: false });
  renderer.setClearColor(0, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  // The wood, rocks and leaves are stationary here. Draw their lamp shadow map just once.
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const stage = document.getElementById('stage');
  stage.classList.add('raster-bowl');
  stage.prepend(canvas);
  const scene = new T.Scene();
  const sky = new T.HemisphereLight(0xe3f3ff, 0xbda67b, 1.65);
  const key = new T.DirectionalLight(0xffead1, 2.3);
  key.position.set(-0.8, 3, 0.9);
  key.castShadow = true;
  Object.assign(key.shadow.camera, { left: -1.1, right: 1.1, top: 1.1, bottom: -1.1, near: 1, far: 5 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.001;
  key.shadow.normalBias = 0.006;
  scene.add(sky, key);
  const camera = new T.PerspectiveCamera(34, 1, 0.03, 24);
  const orbit = new OrbitControls(camera, canvas);
  orbit.enablePan = false;
  orbit.enableDamping = true;
  orbit.minDistance = 1.25;
  orbit.maxDistance = 8;
  orbit.minPolarAngle = 0.72;
  orbit.maxPolarAngle = Math.PI / 2 - 0.035;
  let pixelBudget = 720000;
  const resize = () => {
    const { width, height } = stage.getBoundingClientRect();
    if (!(width && height)) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1, Math.sqrt(pixelBudget / (width * height))));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Widen the field on narrow screens so the whole bowl fits at the starting distance.
    camera.fov = T.MathUtils.radToDeg(2 * Math.atan(Math.tan(17 * Math.PI / 180) / Math.min(1, camera.aspect)));
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);
  camera.position.set(0, 0.68, 4.28);
  resize();
  orbit.update();
  orbit.saveState();
  const { lid, obstacles, bubbles } = makeBowl(scene);
  const lidRest = lid.position.y;

  Object.assign(FIN_QUALITY, { step: 1 / 60, passScale: 0.5, maxFrame: 1 / 30 });
  const fish = createBetta({ compact: true });
  fish.traverse(part => { if (part.isMesh) part.receiveShadow = true; });
  const rig = new T.Group();
  rig.scale.setScalar(BETTA_SCALE);
  rig.add(fish);
  scene.add(rig);
  const swim = new BettaSwim();
  swim.obstacles = obstacles;
  const env = { radius: GLASS_INNER, sandLevel: BED_LEVEL, level: WATER_LEVEL, gravity: [0, -24, 0] };
  const water = { surface: WATER_LEVEL, sand: BED_LEVEL, submerged: 1, airAbove: 0, angular: [0, 0, 0], flow: [0, 0, 0], centroid: [0, -0.15, 0] };
  fish.userData.locomotion = swimPose(swim);
  fish.userData.update(0);
  const localFlow = [0, 0, 0];
  fish.userData.externalFlow = localFlow;

  const controls = document.createElement('div');
  controls.className = 'betta-controls';
  controls.innerHTML = '<button type="button" aria-label="Feed fish">Feed</button><button type="button" aria-pressed="false">Flare fins</button>';
  const [feed, flare] = controls.querySelectorAll('button');
  stage.append(controls);
  const variety = new VarietyMenu(controls);
  const painter = new VarietyPainter(fish);
  painter.show(variety.variety);
  variety.onChange = id => painter.show(id);
  const bar = document.querySelector('.site-links');
  const night = new NightToggle(bar, keptNight(() => localStorage));
  const follow = new FollowToggle(bar);
  follow.onChange = on => { if (!on) orbit.reset(); };
  let flared = false;
  flare.addEventListener('click', () => {
    flared = !flared;
    flare.setAttribute('aria-pressed', String(flared));
    flare.textContent = flared ? 'Relax fins' : 'Flare fins';
  });

  const pellet = new T.Mesh(new T.SphereGeometry(0.014, 10, 7), new T.MeshLambertMaterial({ color: 0xe19b53 }));
  pellet.visible = false;
  scene.add(pellet);
  const ripple = new T.Mesh(new T.RingGeometry(0.94, 1, 48),
    new T.MeshBasicMaterial({ color: 0xc6e8ee, transparent: true, depthWrite: false, side: T.DoubleSide }));
  ripple.rotation.x = -Math.PI / 2;
  ripple.renderOrder = 4;
  ripple.visible = false;
  scene.add(ripple);
  let rippleAge = 1;
  let foodAge = 0;
  function offerFood() {
    if (pellet.visible) return;
    pellet.position.set((Math.random() - 0.5) * 0.3, lidRest + 0.04, 0.1);
    pellet.visible = true;
    feed.disabled = true;
    foodAge = 0;
  }
  feed.addEventListener('click', offerFood);
  const picker = new T.Raycaster();
  let press;
  canvas.addEventListener('pointerdown', e => { press = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (!press || Math.hypot(e.clientX - press[0], e.clientY - press[1]) > 5) return;
    const rect = canvas.getBoundingClientRect();
    picker.setFromCamera(new T.Vector2(2 * (e.clientX - rect.left) / rect.width - 1, 1 - 2 * (e.clientY - rect.top) / rect.height), camera);
    if (picker.intersectObject(lid).length) offerFood();
  });
  const air = new T.InstancedMesh(new T.SphereGeometry(1, 7, 5),
    new T.MeshPhongMaterial({ color: 0xa5dbe2, transparent: true, opacity: 0.48, depthWrite: false }), 16);
  air.frustumCulled = false;
  air.renderOrder = 2;
  if (bubbles) scene.add(air);
  const bubble = new T.Object3D();
  const aim = new T.Vector3(), offset = new T.Vector3();
  const pace = new FramePace();
  pace.frameMs = 1000 / 30;
  let last = null, t = 0, nightMix = Number(night.on);
  const diagnostics = { frames: 0, swim, fish, renderer, painter };
  if (new URLSearchParams(location.search).has('qa')) window.__bettaLow = diagnostics;
  await fish.userData.ready;
  stage.querySelector('.splash')?.remove();
  let sampledAt = null, samples = 0, longestGap = 0;
  function draw(now) {
    if (!pace.draw(now)) return;
    if (sampledAt === null) { sampledAt = now; samples = 0; longestGap = 0; }
    else {
      samples++;
      longestGap = Math.max(longestGap, now - last);
    }
    if (samples >= 30 || now - sampledAt >= 2500) {
      // Drop the worst frame (first draw, shader compilation, GC) before resizing the canvas.
      if (samples > 1 && (now - sampledAt - longestGap) / (samples - 1) > 46 && pixelBudget > 180000) {
        pixelBudget = Math.max(180000, Math.min(pixelBudget, canvas.width * canvas.height) * 0.7);
        resize();
      }
      sampledAt = now;
      samples = 0;
      longestGap = 0;
    }
    const dt = last === null ? 1 / 30 : Math.min(0.067, Math.max(0, (now - last) / 1000));
    last = now;
    t += dt;
    nightMix = T.MathUtils.damp(nightMix, Number(night.on), 2, dt);
    stage.classList.toggle('raster-night', night.on);
    sky.intensity = 1.65 - 1.35 * nightMix;
    key.intensity = 2.3 - 1.52 * nightMix;
    key.color.setRGB(1 - 0.68 * nightMix, 0.84 - 0.33 * nightMix, 0.67 + 0.33 * nightMix);
    if (pellet.visible) {
      foodAge += dt;
      if (foodAge > 0.45) {
        const above = pellet.position.y > WATER_LEVEL;
        pellet.position.y = Math.max(WATER_LEVEL - 0.007, pellet.position.y - 1.5 * dt);
        if (above && pellet.position.y <= WATER_LEVEL) {
          ripple.position.set(pellet.position.x, WATER_LEVEL + 0.002, pellet.position.z);
          rippleAge = 0;
        }
      }
    }
    rippleAge += dt;
    ripple.visible = rippleAge < 1;
    if (ripple.visible) {
      ripple.scale.setScalar(0.015 + 0.24 * rippleAge);
      ripple.material.opacity = 0.48 * (1 - rippleAge) ** 2;
    }
    const open = pellet.visible && foodAge < 1.4;
    lid.position.y = T.MathUtils.damp(lid.position.y, lidRest + (open ? 0.22 : 0), 7, dt);
    lid.position.x = T.MathUtils.damp(lid.position.x, open ? -0.33 : 0, 7, dt);
    const edible = pellet.visible && pellet.position.y <= WATER_LEVEL;
    swim.food = edible ? pellet.position.toArray() : null;
    if (edible) {
      const mouth = bettaMouth(swim.position, swim.heading, swim.pitch);
      const distance = Math.hypot(mouth[0]-pellet.position.x, mouth[1]-pellet.position.y, mouth[2]-pellet.position.z);
      swim.gape = T.MathUtils.clamp(1 - distance / 0.065, 0, 1);
      if (distance < 0.033 || foodAge > 50) {
        pellet.visible = false;
        feed.disabled = false;
        swim.food = null;
      }
    } else swim.gape = Math.max(0, swim.gape - 2 * dt);
    swim.lethargy = nightMix * NIGHT_LETHARGY;
    swim.fold = fish.userData.bodyMotion.turnAngles.at(-1) ?? 0;
    water.flow[0] = 0.009 * Math.sin(0.68 * t + swim.position[2]);
    water.flow[2] = 0.006 * Math.cos(0.47 * t + swim.position[0]);
    swim.advance(dt, water.flow, env, true, water, fish.userData.stroke);
    fish.userData.locomotion = swimPose(swim);
    for (let k = 0; k < 3; k++) localFlow[k] = water.flow[k] / BETTA_SCALE;
    fish.userData.display.requested = flared || swim.flaring;
    fish.userData.update(t);
    if (bubbles) {
      for (let i = 0; i < air.count; i++) {
        const h = (t * 0.52 + i / air.count) % 1;
        bubble.position.fromArray(bubbles.at);
        bubble.position.y += (WATER_LEVEL - bubble.position.y) * h;
        bubble.position.x += h * 0.02 * Math.sin(i * 5 + t * 3);
        bubble.scale.setScalar(bubbles.radius * (0.72 + 0.4 * h));
        bubble.updateMatrix();
        air.setMatrixAt(i, bubble.matrix);
      }
      air.instanceMatrix.needsUpdate = true;
    }
    if (follow.on) {
      offset.copy(camera.position).sub(orbit.target);
      offset.setLength(T.MathUtils.damp(offset.length(), 1.45, 2, dt));
      orbit.target.lerp(aim.fromArray(swim.position), 1 - Math.exp(-4 * dt));
      camera.position.copy(orbit.target).add(offset);
    }
    orbit.update(dt);
    renderer.render(scene, camera);
    diagnostics.frames++;
  }
  const resume = () => {
    last = null;
    sampledAt = null;
    renderer.setAnimationLoop(document.hidden ? null : draw);
  };
  document.addEventListener('visibilitychange', resume);
  resume();
}
