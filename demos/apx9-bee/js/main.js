// APX-9 exploded view: boots the stage, builds the bee from its assemblies, runs the camera / picking / post chain.
import * as THREE from 'three';
import { Q } from './quality.js';
import * as kit from './kit.js';
import { createStage } from './stage.js';
import { Rig, VIEWS, anglesQuat } from './rig.js';
import { Picker } from './picking.js';
import { createPost } from './post.js';
import { Selection } from './select.js';
import { createAccum } from './accum.js';

const ASSEMBLIES = ['head', 'optics', 'thorax', 'flight', 'wings', 'abdomen', 'tail', 'core', 'legs'];
const P = Q.params;
const QA = P.has('qa');
const $ = (s) => document.querySelector(s);
const clamp = THREE.MathUtils.clamp;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const loaderBar = $('#loader-bar');
const loaderMsg = $('#loader-msg');
function progress(f, msg) {
  if (loaderBar) loaderBar.style.transform = `scaleX(${clamp(f, 0, 1)})`;
  if (msg && loaderMsg) loaderMsg.textContent = msg;
}

function fatal(err, hint) {
  console.error('[apx9]', err);
  document.body.classList.remove('loading');
  document.body.classList.add('failed');
  const box = $('#fatal');
  if (box) {
    box.querySelector('.fatal-msg').textContent = hint || 'The 3D view could not start on this device.';
    box.querySelector('.fatal-detail').textContent = String(err?.stack || err || '');
  }
}

async function boot() {
  kit.detail.seg = Q.seg;
  kit.detail.tess = Q.tess;
  const only = (P.get('only') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const names = only.length ? ASSEMBLIES.filter((n) => only.includes(n)) : ASSEMBLIES;
  // Start every module download at once so the import graph is not discovered one assembly at a time; building stays sequential.
  const loads = names.map((n) => import(`./assemblies/${n}.js`));
  const layoutLoad = import('./layout.js');
  const uiLoad = import(`./${P.get('uimod') || 'ui'}.js`);
  for (const p of [...loads, layoutLoad, uiLoad]) p.catch(() => {});
  progress(0.04, 'Preparing studio');

  const container = $('#stage');
  let stage;
  try { stage = createStage(container, Q); } catch (e) { return fatal(e, 'WebGL 2 is required to display the APX-9 model.'); }
  const { renderer, scene, camera } = stage;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;

  const rig = new Rig(camera, canvas, { minDist: 6, maxDist: 780 });
  const picker = new Picker(renderer, scene, camera);
  const post = createPost({ stage, Q, picker });
  const accum = createAccum({ stage, post, Q });

  /* ------------------------------------------------------------ assemble the bee */
  const bee = new kit.Bee();
  const ctx = { bee, Q, shared: {}, ...kit };
  const report = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    progress(0.08 + (0.7 * i) / names.length, `Machining ${name}`);
    await nextFrame();
    const t0 = performance.now();
    try {
      const mod = await loads[i];
      await mod.build(ctx);
      report.push({ name, ok: true, ms: Math.round(performance.now() - t0) });
    } catch (err) {
      console.error(`[apx9] assembly "${name}" failed`, err);
      report.push({ name, ok: false, ms: Math.round(performance.now() - t0), error: String(err?.message || err) });
    }
  }
  const demoName = P.get('demo');
  if (demoName) {
    try { await (await import(`./assemblies/${demoName}.js`)).build(ctx); report.push({ name: demoName, ok: true }); }
    catch (err) { console.error('[apx9] demo failed', err); report.push({ name: demoName, ok: false, error: String(err?.message || err) }); }
  }

  let layout = {};
  try {
    const lm = await layoutLoad;
    layout = lm.LAYOUT || {};
    const sg = parseFloat(P.get('sg'));
    bee.subGain = Number.isFinite(sg) ? sg : (lm.SUB_GAIN ?? 1);
  } catch { /* no overrides yet */ }
  progress(0.82, 'Mating parts');
  await nextFrame();
  const tF = performance.now();
  bee.finalize(layout);
  scene.add(bee.root);
  report.push({ name: 'finalize', ok: true, ms: Math.round(performance.now() - tF) });
  picker.setBee(bee);
  const selection = new Selection({ bee, post, rig, invalidate: () => invalidate(), overlay: () => { state.overlay = true; } });

  /* ------------------------------------------------------------ state */
  const state = {
    explode: 0, tween: null, dirty: true, overlay: false, shadowDirty: true, boundsDirty: true, framed: false,
    frames: 0, ready: false, hoverEvt: null, lastPick: 0, fps: 0, drawTime: 0,
  };
  const box = new THREE.Box3();
  const sph = new THREE.Sphere();
  const prev = { c: new THREE.Vector3(), r: 1, valid: false, sc: null };
  const bbox = new THREE.Box3();
  const _c1 = new THREE.Vector3();
  let cloudA = [], cloudB = [];                 // world corner clouds (previous / current bounds update) for the tight-fit follow
  const scratch = [];
  const tight = (m) => 1 + (m - 1) * 0.55;      // sphere-style margin -> margin for the tight perspective fit
  let app = null;

  function invalidate(shadow = false) {
    state.dirty = true;
    if (shadow) { state.shadowDirty = true; state.boundsDirty = true; }
  }

  function subjectParts() {
    if (state.framed && selection.selected.length) {
      const out = [];
      for (const p of selection.selected) for (const q of p.walk()) out.push(q);
      return out;
    }
    return null;
  }

  function updateBounds(follow = true) {
    state.boundsDirty = false;
    bee.worldBounds(box);
    if (box.isEmpty()) return;
    box.getBoundingSphere(sph);
    rig.radius = sph.radius;
    rig.center.copy(sph.center);
    stage.fitShadow(box, !prev.valid);
    bee.worldCorners(undefined, cloudB);
    if (follow && prev.valid) {
      const sub = subjectParts();
      if (sub) {
        bee.worldBounds(bbox, sub);
        if (!bbox.isEmpty()) {
          bbox.getCenter(_c1);
          if (prev.sc) rig.target.add(_c1).sub(prev.sc);
          prev.sc = prev.sc ? prev.sc.copy(_c1) : _c1.clone();
        }
      } else {
        if (cloudA.length && cloudB.length) {
          const o = { quat: rig.quat, band: app?.fitBand?.() || null, margin: 1.08 };
          const a = rig.fitPoints(cloudA, o), b = rig.fitPoints(cloudB, o);
          const k = b.dist / a.dist;
          if (Number.isFinite(k)) {
            rig.dist = clamp(rig.dist * k, rig.minDist, rig.maxDist);
            rig.target.sub(a.target).multiplyScalar(k).add(b.target);
          }
        }
        prev.sc = null;
      }
    }
    [cloudA, cloudB] = [cloudB, cloudA];
    prev.c.copy(sph.center);
    prev.r = sph.radius;
    prev.valid = true;
  }

  function setExplode(v, ms = 0, delay = 0) {
    v = clamp(v, 0, 1);
    if (ms <= 0) { state.tween = null; applyExplode(v); return; }
    state.tween = { from: state.explode, to: v, t: -delay / 1000, dur: ms / 1000 };
    invalidate();
  }
  const lookDir = new THREE.Vector3();
  /** Floor shadow strength: weaker the more exploded the bee is, and weaker still when looking straight down, where it only smears. */
  function updateFloor() {
    camera.getWorldDirection(lookDir);
    const k = clamp((-lookDir.y - 0.8) / 0.19, 0, 1);
    stage.floor.material.opacity = (state.floorOpacity ?? 0.34) * (1 - 0.65 * k * k * (3 - 2 * k));
  }
  function applyExplode(v) {
    state.explode = v;
    bee.setExplode(v);
    state.floorOpacity = 0.34 - 0.2 * v * v * (3 - 2 * v);
    updateFloor();
    invalidate(true);
    app?.onExplode?.(v);
  }

  const fitOpts = (margin) => {
    const band = app?.fitBand?.() || null;
    return band ? { margin, band } : { margin };
  };

  function frameAll({ ms = 0, quat = null, margin = 1.14 } = {}) {
    bee.worldCorners(undefined, scratch);
    if (scratch.length) rig.frameCorners(scratch, { ms, quat, margin: tight(margin), band: app?.fitBand?.() || null });
    state.framed = false;
    invalidate();
  }

  /** Scripted-camera follow: keeps an exact fit of the whole bee for the current orientation while the intro turns. */
  function followFit(dt) {
    bee.worldCorners(undefined, scratch);
    if (!scratch.length) return;
    const f = rig.fitPoints(scratch, { margin: tight(1.14), quat: rig.quat, band: app?.fitBand?.() || null });
    const k = 1 - Math.exp(-6 * dt);
    rig.target.lerp(f.target, k);
    rig.dist = Math.exp(Math.log(rig.dist) + (Math.log(f.dist) - Math.log(rig.dist)) * k);
    rig.apply();
  }

  function resetView(ms = 900) {
    selection.clear();
    state.framed = false;
    frameAll({ ms, quat: VIEWS.hero() });
  }

  function setView(name, ms = 900) {
    const quat = (VIEWS[name] || VIEWS.hero)();
    if (state.framed && selection.selected.length && selection.frame(ms, 1.55, quat, app?.fitBand?.() || null)) {
      prev.sc = null;
      invalidate();
      return;
    }
    frameAll({ ms, quat });
  }

  function frameSelection(ms = 800, margin = 1.55, quat = null) {
    if (selection.frame(ms, margin, quat, app?.fitBand?.() || null)) { state.framed = true; prev.sc = null; return true; }
    return false;
  }

  /* ------------------------------------------------------------ resize + interaction */
  const doResize = () => {
    const [w, h, dpr] = stage.resize();
    post.resize(w, h, dpr);
    invalidate();
  };
  doResize();
  new ResizeObserver(doResize).observe(container);

  rig.changeCb = () => invalidate();
  rig.interactCb = () => { rig.autoRotate = false; app?.onInteract?.(); invalidate(); };
  rig.hoverCb = (x, y, e) => {
    if (x == null) { state.hoverEvt = null; selection.setHover(null); app?.onHover?.(null); return; }
    state.hoverEvt = e;
  };
  rig.tapCb = (x, y, e) => {
    const part = picker.pick(e.clientX, e.clientY, canvas);
    if (part) selection.select(part, { toggle: e.shiftKey || e.ctrlKey || e.metaKey });
    else selection.clear();
    if (!part) state.framed = false;
    app?.onTap?.(part, e);
  };
  rig.dblCb = (x, y, e) => {
    const part = picker.pick(e.clientX, e.clientY, canvas);
    if (part) { selection.select(part); frameSelection(); } else resetView();
  };

  selection.onVisibility = () => invalidate(true);
  selection.on((kind) => {
    if (kind === 'select' && !selection.selected.length) state.framed = false;
    app?.onSelect?.(kind, selection);
  });

  window.addEventListener('keydown', (e) => {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === ' ' && e.target?.closest?.('button, a, summary, [role="button"]')) return;
    switch (e.key) {
      case 'Escape': selection.clear(); break;
      case ' ': e.preventDefault(); setExplode(state.explode > 0.5 ? 0 : 1, 2200); break;
      case 'ArrowLeft': rig.nudge(-0.08, 0); break;
      case 'ArrowRight': rig.nudge(0.08, 0); break;
      case 'ArrowUp': rig.nudge(0, -0.08); break;
      case 'ArrowDown': rig.nudge(0, 0.08); break;
      case '+': case '=': rig.zoomBy(0.8); break;
      case '-': case '_': rig.zoomBy(1.25); break;
      case 'r': case 'R': resetView(); break;
      case 'f': case 'F': frameSelection(); break;
      default: return;
    }
    invalidate();
  });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); fatal('WebGL context lost', 'The graphics context was lost. Reload the page to continue.'); });

  /* ------------------------------------------------------------ frame loop */
  let last = performance.now();
  let fpsT = last, fpsN = 0;
  const IDLE_MS = 140;                // stillness before the refinement average starts
  let idleAt = 0;
  function draw(now) {
    if (accum.reset()) state.shadowDirty = true;
    updateFloor();
    selection.sync();
    if (state.boundsDirty) updateBounds(true);
    if (state.shadowDirty) { renderer.shadowMap.needsUpdate = true; state.shadowDirty = false; }
    renderer.info.reset();
    state.drawTime = now / 1000;
    post.render({ id: selection.needsId, focus: selection.focus, time: state.drawTime });
    state.frames++;
    fpsN++;
    if (now - fpsT > 1000) { state.fps = Math.round((fpsN * 1000) / (now - fpsT)); fpsN = 0; fpsT = now; }
    app?.afterRender?.(now);
  }

  /** One more sample of the idle refinement average (sub-pixel camera shift, light on a disc, AO noise phase). */
  function refine() {
    selection.sync();
    if (selection.needsId && !picker.valid) picker.renderFull();   // before the camera is jittered
    renderer.info.reset();
    const w = accum.begin();
    post.render({ id: false, idFresh: selection.needsId, focus: selection.focus, time: state.drawTime, accumWeight: w });
    accum.end();
    state.frames++;
  }

  /** Outline / focus changes only: re-run the final pass over the scene already rendered. */
  function drawOverlay() {
    selection.sync();
    post.renderOverlay({ id: selection.needsId, focus: selection.focus, time: state.drawTime });
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden || !state.ready) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    let need = state.dirty;
    state.dirty = false;
    let overlay = state.overlay;
    state.overlay = false;
    if (state.tween) {
      const tw = state.tween;
      tw.t += dt;
      if (tw.t >= 0) {
        const k = Math.min(1, tw.t / tw.dur);
        applyExplode(tw.from + (tw.to - tw.from) * ease(k));
        if (k >= 1) state.tween = null;
      }
      need = true;
    }
    if (rig.update(dt)) need = true;
    if (rig.sweepAnim && !state.framed) followFit(dt);
    if (rig.autoRotate) need = true;
    if (selection.update(dt)) overlay = true;
    if (state.hoverEvt && now - state.lastPick > 55 && !rig.drag) {
      const e = state.hoverEvt;
      state.hoverEvt = null;
      state.lastPick = now;
      const part = picker.pick(e.clientX, e.clientY, canvas);
      selection.setHover(part);
      app?.onHover?.(part, e);
    }
    if (app?.tick?.(dt, now)) need = true;
    if (need) { idleAt = now; draw(now); }
    else if (accum.pending && now - idleAt >= IDLE_MS) refine();
    else if (overlay) drawOverlay();
  }

  /* ------------------------------------------------------------ public handle */
  app = {
    THREE, kit, Q, bee, stage, rig, picker, post, selection, state, report, canvas,
    invalidate, setExplode, getExplode: () => state.explode, frameAll, resetView, setView, frameSelection, resize: doResize,
    ui: null, accum,
  };

  const stats = () => ({
    ...bee.stats(), calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
    fps: state.fps, dpr: stage.dpr, tier: Q.tier, report,
  });

  const tick2 = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  /** Deterministic state setter + render for QA screenshots. */
  app.snap = async (o = {}) => {
    if (o.xray != null) selection.setXray(!!o.xray);
    if (o.isolate != null) selection.setIsolate(!!o.isolate);
    if (o.explode != null) { state.tween = null; applyExplode(o.explode); }
    updateBounds(false);
    if (o.sel !== undefined) {
      const ids = [].concat(o.sel || []);
      selection.selected = ids.map((id) => bee.get(id)).filter(Boolean);
      selection.dirtyFlags = true;
      if (!ids.length) state.framed = false;
      selection._applyVisibility?.();
      app.ui?.refresh?.();
    }
    if (o.hover !== undefined) selection.setHover(o.hover ? bee.get(o.hover) : null);
    const quat = o.view ? (VIEWS[o.view] || VIEWS.hero)() : o.yaw != null ? anglesQuat(o.yaw, o.pitch ?? 0, o.roll ?? 0) : null;
    if (o.fit !== false) {
      if (o.fitSel && selection.selected.length) {
        const parts = [];
        for (const p of selection.selected) for (const q of p.walk()) parts.push(q);
        bee.worldCorners(parts, scratch);
        rig.frameCorners(scratch, { ms: 0, margin: tight(o.margin ?? 1.5), quat: quat ?? rig.quat.clone(), band: app.fitBand?.() || null });
        state.framed = true;
      } else {
        bee.worldCorners(undefined, scratch);
        rig.frameCorners(scratch, { ms: 0, margin: tight(o.margin ?? 1.14), quat: quat ?? rig.quat.clone(), band: app.fitBand?.() || null });
      }
    } else if (quat) { rig.quat.copy(quat); rig.apply(); }
    if (o.dist) { rig.dist = o.dist; rig.apply(); }
    if (o.target) { rig.target.set(...o.target); rig.apply(); }
    prev.valid = false;
    updateBounds(false);
    prev.sc = null;
    rig.autoRotate = false;
    state.shadowDirty = true;
    invalidate();
    await tick2();
    draw(performance.now());
    if (o.settle !== false) app.settle();
    for (let i = 0; i < 3; i++) app.tick?.(1, performance.now());   // callout cards jump to their final slots instead of gliding
    await tick2();
    return stats();
  };
  app.stats = stats;
  app.draw = () => draw(performance.now());
  /** Finish the idle refinement now (deterministic QA frames). */
  app.settle = () => { for (let g = 0; accum.pending && g < 512; g++) refine(); };
  window.__apx = app;

  /* ------------------------------------------------------------ first frame */
  progress(0.9, 'Lighting');
  await nextFrame();
  updateBounds(false);
  prev.valid = true;
  const exParam = parseFloat(P.get('explode'));
  const startQuat = P.get('view') ? (VIEWS[P.get('view')] || VIEWS.hero)() : VIEWS.hero();
  frameAll({ ms: 0, quat: startQuat });
  rig.saveHome();
  const wantIntro = !QA && !reducedMotion && !Number.isFinite(exParam);
  if (Number.isFinite(exParam)) applyExplode(clamp(exParam, 0, 1));
  else if (reducedMotion || QA) applyExplode(0.7);
  state.ready = true;
  state.dirty = true;
  requestAnimationFrame(frame);

  try {
    const ui = await uiLoad;
    app.ui = (await ui.initUI(app)) || null;
  } catch (err) {
    console.error('[apx9] ui failed', err);
    report.push({ name: 'ui', ok: false, error: String(err?.message || err) });
  }

  progress(1, 'Ready');
  draw(performance.now());
  await nextFrame();
  document.body.classList.remove('loading');
  document.body.classList.add('ready');
  if (QA) document.body.classList.add('qa');
  if (P.get('ui') === '0') document.body.classList.add('no-ui');
  if (P.has('stats')) { const el = $('#stats'); if (el) { el.hidden = false; setInterval(() => (el.textContent = JSON.stringify(stats(), null, 1)), 800); } }

  const hashId = decodeURIComponent((location.hash.match(/^#p=(.+)$/) || [])[1] || '');
  const selId = P.get('sel') || hashId;
  if (selId && bee.get(selId)) { selection.select(bee.get(selId)); frameSelection(0); }

  if (wantIntro) {
    rig.sweep(1, 9000, 350);   // one full turn while the bee comes apart, easing back onto the hero view so the refined frame settles there
    setTimeout(() => { if (!state.tween && state.explode < 0.01) setExplode(0.72, 3600); }, 650);
  }
  console.info('[apx9] ready', stats());
}

boot().catch((e) => fatal(e));
