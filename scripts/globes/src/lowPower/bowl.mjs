import * as T from 'three';
import { CAMERA_VIEW, GlobeController } from '../interaction/GlobeController';
import { BowlLid } from '../interaction/BowlLid';
import { Feeding } from '../interaction/Feeding';
import { globeConfig } from '../config';
import { bowlShape } from '../render/bowl';
import { FishFood, FOOD_MAX } from '../fish/FishFood';
import { Learn } from '../app/learn/Learn';
import { WaterCare } from '../water/WaterCare';
import { CLEAR_WATER, forcedWaterEffects } from '../water/effects';
import { createBetta } from '../../../betta-atelier/src/fish.js';
import { FIN_QUALITY } from '../../../betta-atelier/src/fin-dynamics.js';
import { VarietyPainter } from '../../../betta-atelier/src/varieties.js';
import { BettaSwim, BETTA_SCALE, bettaMouth, swimPose } from '../fish/bettaSwim.mjs';
import { BETTA_PROBES, readBettaWater } from '../fish/bettaWater.mjs';
import { FramePace } from '../app/framePace.mjs';
import { VarietyMenu } from '../app/VarietyMenu';
import { NightToggle } from '../app/NightToggle';
import { FollowToggle } from '../app/FollowToggle';
import { keptNight, NIGHT_LETHARGY } from '../app/night.mjs';
import { BED_LEVEL, GLASS_INNER } from '../render/scape/mesh.mjs';
import { makeBowl } from './scenery.mjs';
import { addSurfaceLife } from './surfaceLife.mjs';
import { createBowlOptics } from './glassOptics.mjs';
import { Slosh, WATER_LEVEL } from './slosh.mjs';
import '../app/styles.css';
import './bowl.css';

export async function startLowPowerBowl() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) throw new Error('WebGL2 unavailable');
  const renderer = new T.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: false });
  renderer.setClearColor(0, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  // Keep the shadow map between updates. Leaves move slowly enough to refresh it at 4 Hz.
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const stage = document.getElementById('stage');
  stage.classList.add('raster-bowl');
  stage.prepend(canvas);
  const scene = new T.Scene();
  // Sim coordinates translate with the bowl. Only the glass, sand and furnishings turn
  // with the hand. Swimmers, bubbles and the free surface have their own orientation.
  const basin = new T.Group(), shell = new T.Group(), liquid = new T.Group();
  scene.add(basin);
  basin.add(shell, liquid);
  const sky = new T.HemisphereLight(0xe3f3ff, 0xbda67b, 1.65);
  const key = new T.DirectionalLight(0xffead1, 2.3);
  key.position.set(-0.8, 3, 0.9);
  key.castShadow = true;
  Object.assign(key.shadow.camera, { left: -1.1, right: 1.1, top: 1.1, bottom: -1.1, near: 1, far: 5 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.001;
  key.shadow.normalBias = 0.006;
  scene.add(sky);
  shell.add(key, key.target);
  const camera = new T.PerspectiveCamera(34, 1, 0.03, 24);
  const glass = { ...globeConfig, maxTilt: Math.PI / 6 };
  const controller = new GlobeController(canvas, camera, glass);
  controller.rolling = true;
  controller.placeAt(0);
  controller.zoomTo(4.3, true);
  canvas.setAttribute('aria-label', 'Betta bowl. Drag to tilt, Ctrl-drag to turn, and scroll or pinch to zoom.');
  canvas.title = 'Drag to tilt · Ctrl-drag to turn · Scroll or pinch to zoom';
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
  resize();
  const surface = new Slosh();
  const { lid, obstacles, bubbles, plants, tint, waterFilm } = makeBowl(basin, shell, liquid, surface, key);
  const floating = addSurfaceLife(liquid);
  const cover = new BowlLid(bowlShape(glass, true));
  const feeding = new Feeding(cover, controller);
  lid.matrixAutoUpdate = false;

  Object.assign(FIN_QUALITY, { step: 1 / 60, passScale: 0.5, maxFrame: 1 / 30 });
  const fish = createBetta({ compact: true });
  const pale = { value: 0 };
  const fishMaterials = new Set();
  fish.traverse(part => {
    if (part.isMesh) { part.receiveShadow = true; fishMaterials.add(part.material); }
  });
  for (const material of fishMaterials) {
    waterFilm.illuminate(material);
    const original = material.onBeforeCompile.bind(material);
    const cacheKey = material.customProgramCacheKey();
    material.customProgramCacheKey = () => cacheKey + '-water-pale';
    material.onBeforeCompile = (shader, renderer) => {
      original(shader, renderer);
      shader.uniforms.paleness = pale;
      shader.fragmentShader = 'uniform float paleness;\n' + shader.fragmentShader.replace('#include <opaque_fragment>',
        'outgoingLight = mix(outgoingLight, vec3(dot(outgoingLight, vec3(.2126,.7152,.0722))*.75+.14), .75*paleness);\n#include <opaque_fragment>');
    };
  }
  const rig = new T.Group();
  rig.scale.setScalar(BETTA_SCALE);
  rig.updateMatrix();
  rig.add(fish);
  basin.add(rig);
  rig.userData.topic = 'fish';
  const swim = new BettaSwim();
  swim.compensateDrift = true;
  swim.obstacles = obstacles.map(o => ({ ...o, a: [...o.a], b: [...o.b] }));
  const env = { radius: GLASS_INNER, sandLevel: BED_LEVEL, level: WATER_LEVEL, gravity: [0, -24, 0], iso: 0.5 };
  const probes = new Float32Array(4 * BETTA_PROBES.length);
  const sense = { probes: new Float32Array(probes.length), sand: new Float32Array(BETTA_PROBES.length), centroid: [0, -0.15, 0] };
  let water;
  fish.userData.locomotion = swimPose(swim);
  fish.userData.update(0);
  const localFlow = [0, 0, 0];
  fish.userData.externalFlow = localFlow;
  const forced = forcedWaterEffects(new URLSearchParams(location.search).get('water'));
  const condition = { fx: forced ?? CLEAR_WATER };
  const food = new FishFood();
  food.enabled = food.pellets = true;
  const eater = {
    mouthAt: () => bettaMouth(swim.position, swim.heading, swim.pitch),
    ahead: () => [-Math.cos(swim.heading) * Math.cos(swim.pitch), Math.sin(swim.pitch), Math.sin(swim.heading) * Math.cos(swim.pitch)],
    busy: () => swim.mode === 'startle', reach: 0.055, get appetite() { return condition.fx.appetite; },
    food: null, gapeWant: 0,
  };
  const eaters = [eater], foodSamples = new Float32Array(FOOD_MAX * 4), sandSamples = new Float32Array(FOOD_MAX);

  const controls = document.createElement('div');
  controls.className = 'betta-controls';
  controls.innerHTML = '<button type="button" aria-label="Feed fish">Feed</button><button type="button" aria-pressed="false">Flare fins</button>';
  const [feed, flare] = controls.querySelectorAll('button');
  stage.append(controls);
  const variety = new VarietyMenu(controls);
  const painter = new VarietyPainter(fish);
  painter.show(variety.variety);
  const bar = document.querySelector('.site-links');
  bar.append(document.querySelector('.graphics-choice'));
  const night = new NightToggle(bar, keptNight(() => localStorage));
  const follow = new FollowToggle(bar);
  follow.onChange = on => { if (on) controller.followEye.copy(camera.position); };
  let flared = false;
  flare.addEventListener('click', () => {
    flared = !flared;
    flare.setAttribute('aria-pressed', String(flared));
    flare.textContent = flared ? 'Relax fins' : 'Flare fins';
  });

  const pellets = new T.InstancedMesh(new T.SphereGeometry(1, 10, 7), new T.MeshLambertMaterial({ color: 0xe19b53 }), FOOD_MAX);
  pellets.count = 0;
  pellets.frustumCulled = false;
  basin.add(pellets);
  feeding.onChange = () => {
    feed.textContent = feeding.state === 'idle' ? 'Feed' : feeding.state === 'closing' ? 'Closing lid' : 'Close lid';
    feed.setAttribute('aria-label', feeding.state === 'idle' ? 'Feed fish' : feed.textContent);
    feed.disabled = feeding.state === 'closing';
  };
  feed.addEventListener('click', () => feeding.request());
  const picker = new T.Raycaster();
  const pickable = [];
  basin.traverse(part => {
    if (!part.isMesh) return;
    for (let parent = part; parent; parent = parent.parent) {
      if (!parent.userData.topic) continue;
      part.userData.topic = parent.userData.topic;
      pickable.push(part);
      break;
    }
  });
  // The small mirror captures objects on the viewer's side of the water.
  // Submerged-only geometry is needed just for views from below the film.
  const submergedTopics = new Set(['fish', 'sand', 'rock', 'driftwood']);
  const lens = createBowlOptics();
  const backdrops = [];
  for (const part of pickable) {
    const topic = part.userData.topic;
    if (topic === 'glass' || topic === 'water') {
      backdrops.push(part);
      if (topic === 'water') lens.install(part, { film: true });
    } else {
      part.layers.enable(submergedTopics.has(topic) ? 2 : 1);
      lens.install(part, { topic, distort: topic !== 'lid' });
    }
  }
  lens.install(pellets);
  sky.layers.enable(1);
  key.layers.enable(1);
  sky.layers.enable(3);
  key.layers.enable(3);
  function pickTopic(x, y) {
    const rect = canvas.getBoundingClientRect();
    const u = (x - rect.left) / rect.width, v = (y - rect.top) / rect.height;
    const solid = lens.pick(renderer, scene, camera, u, v);
    if (solid) return solid;
    picker.setFromCamera(new T.Vector2(2*u - 1, 1 - 2*v), camera);
    const hits = picker.intersectObjects(backdrops, false);
    let backdrop = null;
    for (const hit of hits) {
      const topic = hit.object.userData.topic;
      if (topic === 'glass') {
        const p = basin.worldToLocal(hit.point.clone());
        backdrop = p.y < surface.heightAt(p.x, p.z) ? 'water' : 'glass';
      } else if (topic === 'water') backdrop = 'water';
    }
    return backdrop;
  }
  const learn = new Learn(controls, stage, {
    pickTopic, variety: () => variety.variety, betta: { swim, get flared() { return flared; } }, food, feeding, life: floating.life,
  }, false);
  const waterCare = new WaterCare(controls, stage, {
    water: condition, forced, feeding, food, learn, rotation: () => controller.rotation.elements,
  });
  variety.onChange = id => { painter.show(id); learn.aboutFish(); };
  night.onChange = on => { if (on) learn.atNight(); };
  let press = null;
  canvas.addEventListener('pointerdown', e => {
    press = e.isPrimary && e.button === 0 ? { x: e.clientX, y: e.clientY, id: e.pointerId } : null;
  });
  canvas.addEventListener('pointermove', e => {
    if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 5) press = null;
  });
  canvas.addEventListener('pointercancel', () => { press = null; });
  canvas.addEventListener('pointerup', e => {
    if (press?.id !== e.pointerId) return;
    press = null;
    if (!learn.tap(e.clientX, e.clientY) && pickTopic(e.clientX, e.clientY) === 'lid') feeding.request();
  });
  const air = new T.InstancedMesh(new T.SphereGeometry(1, 7, 5),
    new T.MeshPhongMaterial({ color: 0xa5dbe2, transparent: true, opacity: 0.48, depthWrite: false }), 16);
  air.frustumCulled = false;
  air.renderOrder = 2;
  if (bubbles) { basin.add(air); lens.install(air); }
  const bubble = new T.Object3D();
  const aim = new T.Vector3(), view = new T.Vector3(...CAMERA_VIEW);
  const matrix = new T.Matrix4(), point = new T.Vector3(), oldRotation = new T.Quaternion();
  const turn = [0, 0, 0];
  let lastTwist = controller.twist, shadowAt = 0;
  const lamp = shell.children.find(part => part.userData.lampVertices);
  let lastLamp = -1;
  const bedAt = (x, z) => {
    const m = controller.rotation.elements;
    return (BED_LEVEL - m[3] * x - m[5] * z) / m[4];
  };
  const pace = new FramePace();
  pace.frameMs = 1000 / 30;
  let last = null, t = 0, nightMix = Number(night.on);
  const diagnostics = { frames: 0, swim, fish, renderer, painter, controller, surface, learn, waterCare, food, feeding, camera, basin, pickable, lens, get water() { return water; } };
  if (new URLSearchParams(location.search).has('qa')) window.__bettaLow = diagnostics;
  await fish.userData.ready;
  stage.querySelector('.splash')?.remove();

  function moveBowl(dt) {
    controller.update(dt, 24);
    basin.position.copy(controller.center);
    shell.quaternion.setFromRotationMatrix(matrix.setFromMatrix3(controller.rotation));
    const gravity = controller.bodyAccel(24);
    surface.step(dt, gravity, controller.omega);
    liquid.quaternion.copy(surface.rotation);
    const turning = !shell.quaternion.equals(oldRotation);
    for (const plant of plants.values()) plant.update(t, dt, surface, controller.rotation, controller.omega, bedAt);
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i], turned = swim.obstacles[i];
      if (o.follow) {
        const plant = plants.get(o.follow.mesh);
        plant.moveEnd(point, o.a, o.follow.a).applyMatrix3(controller.rotation).toArray(turned.a);
        plant.moveEnd(point, o.b, o.follow.b).applyMatrix3(controller.rotation).toArray(turned.b);
      } else if (turning) {
        point.fromArray(o.a).applyMatrix3(controller.rotation).toArray(turned.a);
        point.fromArray(o.b).applyMatrix3(controller.rotation).toArray(turned.b);
      }
    }
    if (t >= shadowAt) {
      renderer.shadowMap.needsUpdate = true;
      shadowAt = t + 0.25;
    }
    if (turning) {
      key.updateWorldMatrix(true, false);
      key.target.updateWorldMatrix(true, false);
      key.shadow.updateMatrices(key);
      oldRotation.copy(shell.quaternion);
    }
    const twist = controller.twist - lastTwist;
    const delta = twist - 2 * Math.PI * Math.round(twist / (2 * Math.PI));
    lastTwist = controller.twist;
    if (delta && Math.abs(delta) <= 1) {
      for (let i = 0; i < 3; i++) turn[i] = delta * controller.rotation.elements[3 + i];
      swim.turnWith(turn);
    }
    env.gravity = gravity;
    feeding.update(dt, p => food.spawn(p, 1), food.count);
    cover.update(dt, controller.rotation);
    lid.matrix.copy(cover.toLid).invert();
    lid.matrixWorldNeedsUpdate = true;
    lid.visible = cover.shown;
  }

  // Sample the same anatomical points as the full fish, in bowl-centred world
  // axes. Differences across its trunk and fins let it feel a turning current.
  const bodyPoint = [0, 0, 0];
  function sampleFish() {
    fish.updateMatrix();
    matrix.multiplyMatrices(rig.matrix, fish.matrix);
    for (let i = 0; i < BETTA_PROBES.length; i++) {
      fish.userData.bodyMotion.transform(...BETTA_PROBES[i], bodyPoint);
      const { x, y, z } = point.fromArray(bodyPoint).applyMatrix4(matrix);
      point.toArray(probes, 4 * i);
      const bed = sense.sand[i] = bedAt(x, z);
      const top = surface.currentAt(x, y, z, bed, sense.probes, 4 * i);
      sense.probes[4 * i + 3] = T.MathUtils.clamp(0.5 + (top - y) * 25, 0, 1);
    }
    const mouth = eater.mouthAt();
    env.level = surface.heightAt(mouth[0], mouth[2]);
    env.sandLevel = bedAt(swim.position[0], swim.position[2]);
    water = readBettaWater(sense, probes, env, env.level);
  }

  function moveFood(dt) {
    const probes = food.probePoints();
    for (let i = 0; i < FOOD_MAX; i++) {
      const k = 4 * i, x = probes[k], y = probes[k + 1], z = probes[k + 2];
      sandSamples[i] = bedAt(x, z);
      const top = surface.currentAt(x, y, z, sandSamples[i], foodSamples, k);
      foodSamples[k + 3] = T.MathUtils.clamp(0.5 + (top - y) * 25, 0, 1);
    }
    food.update(dt, foodSamples, sandSamples, 0, { rotation: controller.rotation.elements, gravity: env.gravity, iso: 0.5, radius: GLASS_INNER }, eaters);
    const data = food.renderData();
    pellets.count = data[0];
    for (let i = 0; i < pellets.count; i++) {
      const k = 4 + 8 * i;
      bubble.position.fromArray(data, k);
      bubble.scale.setScalar(data[k + 3]);
      bubble.updateMatrix();
      pellets.setMatrixAt(i, bubble.matrix);
    }
    if (pellets.count) pellets.instanceMatrix.needsUpdate = true;
    for (const splash of food.splashes) {
      point.fromArray(splash).applyQuaternion(surface.inverse);
      surface.ripples.disturb(point.x, point.z, 0.115, 1.15);
    }
    food.splashes.length = 0;
  }

  const clearTint = tint.material.color.clone(), tea = new T.Color(0xaf7139), cloudy = new T.Color(0xc9d5ca);
  let cloud = 0, tannin = 0;
  function showWater(dt, fx) {
    cloud = T.MathUtils.damp(cloud, fx.cloud, 0.7, dt);
    tannin = T.MathUtils.damp(tannin, fx.tint, 0.7, dt);
    tint.material.color.copy(clearTint).lerp(tea, tannin).lerp(cloudy, cloud);
    tint.material.opacity = 0.06 + 0.28 * tannin + 0.36 * cloud;
    pale.value = T.MathUtils.damp(pale.value, fx.pale, 0.7, dt);
    if (lamp && fx.heaterLamp !== lastLamp) {
      lastLamp = fx.heaterLamp;
      const colors = lamp.geometry.getAttribute('color');
      for (const v of lamp.userData.lampVertices) colors.setXYZ(v, 0.06 + 0.85 * lastLamp, 0.03 + 0.26 * lastLamp, 0.012 + 0.04 * lastLamp);
      colors.needsUpdate = true;
    }
  }
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
    moveBowl(dt);
    sampleFish();
    food.aim(eaters);
    swim.food = eater.food?.pos ?? null;
    swim.gape = eater.gapeWant;
    const fx = condition.fx;
    swim.lethargy = Math.max(fx.lethargy, nightMix * NIGHT_LETHARGY);
    swim.gasp = fx.gasp;
    fish.userData.display.clamp = T.MathUtils.damp(fish.userData.display.clamp, fx.clamp, 0.6, dt);
    fish.userData.gait.breathPhase += 5 * fx.gasp * dt;
    floating.life.tending = fx.nest;
    swim.gulpUrge = floating.life.nestNeed;
    swim.fold = fish.userData.bodyMotion.turnAngles.at(-1) ?? 0;
    swim.advance(dt, water.flow, env, water.submerged > 0.5, water, fish.userData.stroke);
    fish.userData.locomotion = swimPose(swim);
    for (let k = 0; k < 3; k++) localFlow[k] = water.flow[k] / BETTA_SCALE;
    fish.userData.display.requested = flared || swim.flaring;
    fish.userData.update(t);
    moveFood(dt);
    floating.update(dt, controller.rotation.elements, Math.hypot(...controller.omega), swim, surface, bedAt);
    if (waterCare.on) waterCare.frame(dt);
    if (learn.on) learn.frame();
    showWater(dt, fx);
    if (bubbles) {
      for (let i = 0; i < air.count; i++) {
        const h = (t * 0.52 + i / air.count) % 1;
        bubble.position.fromArray(bubbles.at).applyMatrix3(controller.rotation);
        bubble.position.y += (surface.heightAt(bubble.position.x, bubble.position.z) - bubble.position.y) * h;
        bubble.position.x += h * 0.02 * Math.sin(i * 5 + t * 3);
        if (i % 4 === 0 && h < dt * 0.52) {
          point.fromArray(bubbles.at).applyMatrix3(controller.rotation);
          point.x += 0.02 * Math.sin(i * 5 + t * 3);
          point.y = surface.heightAt(point.x, point.z);
          point.applyQuaternion(surface.inverse);
          surface.ripples.disturb(point.x, point.z, 0.095, 0.32);
        }
        bubble.scale.setScalar(bubbles.radius * (0.72 + 0.4 * h));
        bubble.updateMatrix();
        air.setMatrixAt(i, bubble.matrix);
      }
      air.instanceMatrix.needsUpdate = true;
    }
    controller.followShare = T.MathUtils.damp(controller.followShare, Number(follow.on), 4, dt);
    if (controller.followShare < 0.001 && !follow.on) controller.followShare = 0;
    if (follow.on) {
      aim.fromArray(swim.position).add(basin.position).addScaledVector(view, -1.65 * controller.followZoom);
      controller.followEye.lerp(aim, 1 - Math.exp(-5 * dt));
    }
    lens.uniforms.lensStrength.value = 0;
    waterFilm.update(renderer, scene, camera, t, nightMix, 1 - .60*cloud - .20*tannin);
    lens.update(camera, basin, shell, surface);
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
