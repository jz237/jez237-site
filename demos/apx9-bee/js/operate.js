// Living exhibit: deterministic poses layered over the original part/explosion registry.
import * as T from 'three';
import { h, loadCSS } from './dom.js';
import { VIEWS } from './rig.js';

const clamp = T.MathUtils.clamp;
const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const STEPS = ['Approach', 'Scan', 'Land', 'Collect pollen', 'Depart'];
const NOTES = [
  'Compound eyes find the flower. The antennae sample the air ahead.',
  'UV nectar guides reveal the landing target. A scan checks the flower before contact.',
  'Six articulated legs settle onto the petals while the flight actuators slow.',
  'The brush gathers pollen into the collection module. Gold particles show the transfer.',
  'Payload secured. The unit lifts away, ready to pollinate the next flower.',
];

export async function initOperations(app) {
  await loadCSS('css/operate.css');
  const { bee, stage, rig, selection } = app;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const op = { mode: 'inspect', power: false, clock: 0, boot: 0, mission: 0, playing: false, sensor: 'normal', flow: 'energy', repair: 0, paused: false };
  const art = new T.Group(); art.name = 'operating-exhibit'; stage.scene.add(art);
  const mat = (color, metalness = 0) => new T.MeshStandardMaterial({ color, roughness: .45, metalness });
  const mesh = (geo, material, parent = art) => { const m = new T.Mesh(geo, material); m.layers.set(4); parent.add(m); return m; };
  const sphere = new T.SphereGeometry(1, 20, 12);
  const motionParts = ['wing-r', 'wing-l', 'antenna-r', 'antenna-l', ...bee.parts.filter(p => /^leg-[^/]+$/.test(p.id)).map(p => p.id)].map(id => bee.get(id)).filter(Boolean);
  const poses = new Map();
  function restorePose() { for (const [p, q] of poses) p.node.quaternion.copy(q); poses.clear(); bee.root.position.set(0, 0, 0); }
  function rotate(p, axis, angle) { if (!p) return; poses.set(p, p.node.quaternion.clone()); p.node.rotateOnAxis(axis, angle); }
  const yAxis = new T.Vector3(0, 1, 0), zAxis = new T.Vector3(0, 0, 1);

  // A stylized flower, modelled at the same millimetre scale as the bee.
  const flower = new T.Group(); flower.position.set(32, -10, 0); art.add(flower);
  const petals = mat(0xcf78a3), heart = mat(0xe6aa30), leaf = mat(0x558d68);
  for (let i = 0; i < 10; i++) {
    const a = i * Math.PI / 5;
    const p = mesh(sphere, petals, flower); p.position.set(Math.cos(a) * 7, 0, Math.sin(a) * 7); p.scale.set(6, .65, 2.8); p.rotation.y = -a;
    const guide = mesh(new T.ConeGeometry(.4, 5, 8), new T.MeshBasicMaterial({ color: 0x79ffff }), flower);
    guide.position.set(Math.cos(a) * 6, .65, Math.sin(a) * 6); guide.rotation.z = Math.PI / 2; guide.rotation.y = -a; guide.visible = false; guide.userData.uv = true;
  }
  const center = mesh(sphere, heart, flower); center.scale.set(3.4, 1.1, 3.4);
  const stem = mesh(new T.CylinderGeometry(.6, .85, 16, 12), leaf, flower); stem.position.y = -8;
  const blade = mesh(sphere, leaf, flower); blade.position.set(-3, -8, 0); blade.scale.set(5, .3, 1.7); blade.rotation.z = -.4;
  const scan = mesh(new T.TorusGeometry(10, .08, 6, 64), new T.MeshBasicMaterial({ color: 0x20c6b5, transparent: true, opacity: .7 }), flower); scan.rotation.x = Math.PI / 2; scan.position.y = 1.4;
  const pollen = new T.Group(); art.add(pollen);
  const pollenMat = new T.MeshBasicMaterial({ color: 0xffc33c });
  const grains = Array.from({ length: 28 }, () => mesh(new T.SphereGeometry(.18, 6, 4), pollenMat, pollen));
  const lamp = mesh(sphere, new T.MeshBasicMaterial({ color: 0x56e8e7, transparent: true, opacity: .8 })); lamp.scale.set(1.5, 2, 1.5); lamp.material.opacity = .18;

  // A real-sized US quarter and a millimetre ruler; never claim physical screen size.
  const scaleArt = new T.Group(); art.add(scaleArt);
  const coinMat = mat(0xa8adb0, .8);
  const coin = mesh(new T.CylinderGeometry(12.13, 12.13, 1.75, 64), coinMat, scaleArt); coin.position.set(27, -9, 0);
  const ring = mesh(new T.TorusGeometry(11.15, .13, 6, 80), mat(0xdce0df, .7), scaleArt); ring.rotation.x = Math.PI / 2; ring.position.set(27, -8.08, 0);
  const stamp = document.createElement('canvas'); stamp.width = stamp.height = 256;
  const sc = stamp.getContext('2d'); sc.fillStyle = '#58666b'; sc.textAlign = 'center'; sc.font = 'bold 60px serif'; sc.fillText('25¢', 128, 141); sc.font = '15px monospace'; sc.fillText('US QUARTER', 128, 183); sc.fillText('24.26 mm', 128, 74);
  const face = mesh(new T.PlaneGeometry(18, 18), new T.MeshBasicMaterial({ map: new T.CanvasTexture(stamp), transparent: true, depthWrite: false }), scaleArt); face.rotation.x = -Math.PI / 2; face.position.set(27, -8.1, 0);
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
  const c = canvas.getContext('2d'); c.fillStyle = '#28353b'; c.font = '28px monospace';
  for (let i = 0; i <= 50; i++) { const x = 6 + i * 10; c.fillRect(x, 0, 2, i % 10 ? 14 : 26); if (i % 10 === 0) c.fillText(String(i), Math.min(x, 465), 58); }
  c.fillText('mm · relative scale', 90, 112);
  const ruler = mesh(new T.PlaneGeometry(51.2, 12.8), new T.MeshBasicMaterial({ map: new T.CanvasTexture(canvas), transparent: true, side: T.DoubleSide }), scaleArt);
  ruler.rotation.x = -Math.PI / 2; ruler.position.set(4, -10, 24);

  // Curves follow actual part anchors, including the exploded state.
  const flowLayer = new T.Group(); art.add(flowLayer);
  const paths = Array.from({ length: 3 }, () => {
    const positions = new Float32Array(33 * 3), geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(positions, 3));
    const line = new T.Line(geo, new T.LineBasicMaterial({ color: 0x159bda, transparent: true, opacity: .65, depthTest: false })); line.layers.set(4); line.renderOrder = 12; flowLayer.add(line);
    const dots = Array.from({ length: 5 }, () => { const d = mesh(new T.SphereGeometry(.25, 8, 6), new T.MeshBasicMaterial({ color: 0x7eeeff, depthTest: false }), flowLayer); d.renderOrder = 13; return d; });
    return { line, dots, positions };
  });
  const links = {
    energy: [['power-core', 'wing-mount-r'], ['power-core', 'wing-mount-l'], ['power-core', 'pollination-module']],
    signals: [['eye-r', 'neural-processor'], ['antenna-r', 'neural-processor'], ['neural-processor', 'wing-mount-r']],
    pollen: [['leg-rear-r', 'pollination-module'], ['leg-rear-l', 'pollination-module'], ['pollination-module', 'abdomen-shell']],
  };
  const colors = { energy: 0x159bda, signals: 0x9164df, pollen: 0xe9a416 };
  function anchor(id) { const p = bee.get(id); return p ? p.node.localToWorld(p.centerLocal.clone()) : new T.Vector3(); }
  function updateFlows() {
    links[op.flow].forEach(([from, to], i) => {
      const a = anchor(from), b = anchor(to), mid = a.clone().lerp(b, .5); mid.y += 6;
      const curve = new T.QuadraticBezierCurve3(a, mid, b), path = paths[i];
      for (let k = 0; k <= 32; k++) curve.getPoint(k / 32).toArray(path.positions, k * 3);
      path.line.geometry.attributes.position.needsUpdate = true; path.line.geometry.computeBoundingSphere(); path.line.material.color.setHex(colors[op.flow]);
      path.dots.forEach((d, k) => { d.position.copy(curve.getPoint((op.clock * .25 + k / 5) % 1)); d.material.color.setHex(colors[op.flow]); });
    });
  }

  const btn = (text, fn, attrs = {}) => h('button', { type: 'button', onclick: fn, ...attrs }, text);
  const launch = btn('◉  Power on / Operate', () => enter('power'), { class: 'operate-launch' });
  const title = h('h2', null, 'Bring it to life');
  const status = h('p', { class: 'op-status', role: 'status', 'aria-live': 'polite' });
  const body = h('div', { class: 'op-body' });
  const pause = btn('Pause motion', () => { op.paused = !op.paused; pause.textContent = op.paused ? 'Resume motion' : 'Pause motion'; });
  const tabs = h('nav', { class: 'op-tabs', 'aria-label': 'Operating modes' });
  const modes = { power: 'Power', systems: 'Systems', mission: 'Mission', sensors: 'Vision', repair: 'Repair', scale: 'Scale' };
  const tabButtons = {};
  for (const [key, label] of Object.entries(modes)) { const b = btn(label, () => enter(key), { 'aria-pressed': 'false' }); tabs.append(b); tabButtons[key] = b; }
  const panel = h('section', { class: 'operate-panel panel', hidden: true, 'aria-label': 'Operate APX-9' },
    h('div', { class: 'op-heading' }, h('span', { class: 'op-eyebrow' }, 'APX-9 / FIELD LAB'), btn('×', () => enter('inspect'), { 'aria-label': 'Close operating panel' })), title, tabs, status, body,
    h('footer', null, pause, btn('Back to inspection', () => enter('inspect'))));
  document.getElementById('ui').append(launch, panel);
  let slider = null, missionText = null, playButton = null, repairButton = null, savedLabels = true, savedExplode = 0;
  const oldFit = app.fitBand;
  app.fitBand = () => {
    if (op.mode === 'inspect') return oldFit?.();
    const W = stage.size.x, H = stage.size.y;
    if (W < 760) { const r = panel.getBoundingClientRect(); return { w: W - 20, h: Math.max(100, r.top - 105), cx: 0, cy: (105 + r.top) / 2 - H / 2 }; }
    return { w: Math.max(200, W - 380), h: H - 170, cx: 160, cy: 5 };
  };
  function frameExhibit() {
    if (op.mode === 'inspect') return;
    const dock = document.querySelector('.dock')?.getBoundingClientRect();
    panel.style.bottom = stage.size.x < 760 ? `${Math.max(98, stage.size.y - (dock?.top ?? stage.size.y - 98) + 10)}px` : '';
    const extra = ['mission', 'sensors', 'scale'].includes(op.mode);
    if (extra) {
      const corners = [];
      for (const x of [-36, 50]) for (const y of [-27, 25]) for (const z of [-30, 30]) corners.push(new T.Vector3(x, y, z));
      rig.frameCorners(corners, { ms: 0, quat: VIEWS.hero(), margin: 1.05, band: app.fitBand() });
    } else app.frameAll({ ms: 0, quat: VIEWS.hero(), margin: 1.2 });
  }
  function setSensor(value) {
    const changed = op.sensor !== value;
    op.sensor = value;
    petals.color.setHex(value === 'uv' ? 0x382782 : value === 'thermal' ? 0xcc293e : 0xcf78a3);
    heart.color.setHex(value === 'uv' ? 0x9dffff : value === 'thermal' ? 0xffec70 : 0xe6aa30);
    leaf.color.setHex(value === 'thermal' ? 0x334e9e : 0x558d68);
    flower.children.forEach(m => { if (m.userData.uv) m.visible = value === 'uv'; });
    document.querySelectorAll('[data-sensor]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sensor === value)));
    if (op.mode === 'sensors') status.textContent = value === 'normal' ? 'Visible light • the flower as we see it.' : value === 'uv' ? 'Simulated UV • bright nectar guides lead toward the centre.' : 'Simulated thermal • illustrative temperature contrast, not measured data.';
    if (changed) app.invalidate();
  }
  function enter(mode) {
    const first = op.mode === 'inspect';
    if (first && mode !== 'inspect') { savedLabels = app.ui.state.labelsOn; savedExplode = app.getExplode(); }
    restorePose(); op.mode = mode; op.playing = false; op.paused = reduced.matches; pause.textContent = op.paused ? 'Resume motion' : 'Pause motion';
    rig.autoRotate = false; rig.sweepAnim = null; rig.tween = null; stage.camera.clearViewOffset();
    selection.setIsolate(false); selection.clear(); selection.setXray(false); bee.root.visible = true;
    app.ui.endTour(); app.ui.closeDetail(); app.ui.toggleDirectory(false); app.ui.toggleSpecs(false);
    app.onInteract?.();
    flower.visible = mode === 'mission' || mode === 'sensors'; pollen.visible = mode === 'mission'; scaleArt.visible = mode === 'scale'; flowLayer.visible = mode === 'systems'; lamp.visible = mode === 'power';
    panel.hidden = mode === 'inspect'; launch.hidden = !panel.hidden; document.body.classList.toggle('operating', !panel.hidden);
    body.replaceChildren(); slider = missionText = playButton = repairButton = null;
    Object.entries(tabButtons).forEach(([k, b]) => b.setAttribute('aria-pressed', String(mode === k)));
    if (mode === 'inspect') { op.power = false; if (app.ui.state.labelsOn !== savedLabels) app.ui.setLabels(savedLabels); app.setExplode(savedExplode, 0); app.resetView(500); launch.focus(); return; }
    if (app.ui.state.labelsOn) app.ui.setLabels(false); app.setExplode(mode === 'systems' ? .65 : 0, 0); setSensor('normal');
    title.textContent = { power: 'A machine with a heartbeat.', systems: 'Follow the invisible work.', mission: 'One flower. Five small steps.', sensors: 'A different kind of sight.', repair: 'Bring the right wing back.', scale: 'Smaller than you think.' }[mode];
    if (mode === 'power') {
      op.power = true; op.boot = 0;
      body.append(h('p', null, 'Eyes, antennae, legs, then wings. Watch each system wake before the unit lifts into a hover.'), btn('Restart power sequence', () => { op.boot = 0; op.paused = false; pause.textContent = 'Pause motion'; }), h('small', null, 'Wing movement is slowed for inspection. This is a speculative robot, not a flight-physics simulation.'));
    } else if (mode === 'systems') {
      status.textContent = 'Live schematic • paths track the parts as you explode the model.';
      const row = h('div', { class: 'op-choices' });
      for (const [key, label] of Object.entries({ energy: 'Energy', signals: 'Sensor signals', pollen: 'Pollen' })) row.append(btn(label, () => { op.flow = key; row.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.textContent === label))); updateFlows(); app.invalidate(); }, { 'aria-pressed': String(op.flow === key) }));
      body.append(row, h('p', null, 'Blue: battery → actuators. Violet: sensors → processor → flight control. Gold: brushes → collection module → storage.'), h('small', null, 'Use the original Assembled / Exploded slider below. Paths are explanatory, not physical wiring.'));
    } else if (mode === 'mission') {
      op.mission = 0; op.playing = !reduced.matches;
      missionText = h('p'); slider = h('input', { type: 'range', min: 0, max: 1000, value: 0, 'aria-label': 'Pollination mission progress' });
      slider.addEventListener('input', () => { op.mission = +slider.value / 1000; op.playing = false; playButton.textContent = 'Play mission'; poseMission(); app.invalidate(); });
      playButton = btn(op.playing ? 'Pause mission' : 'Play mission', () => { if (op.mission >= 1) op.mission = 0; op.playing = !op.playing; op.paused = false; pause.textContent = 'Pause motion'; playButton.textContent = op.playing ? 'Pause mission' : 'Play mission'; });
      const row = h('div', { class: 'op-steps' }); STEPS.forEach((s, i) => row.append(btn(s, () => { op.mission = (i + .3) / 5; op.playing = false; playButton.textContent = 'Play mission'; poseMission(); app.invalidate(); })));
      body.append(slider, row, missionText, playButton); poseMission();
    } else if (mode === 'sensors') {
      const row = h('div', { class: 'op-choices' }); ['normal', 'uv', 'thermal'].forEach(key => row.append(btn({ normal: 'Visible', uv: 'UV', thermal: 'Thermal' }[key], () => setSensor(key), { 'data-sensor': key, 'aria-pressed': String(key === 'normal') })));
      body.append(row, h('p', null, 'Look toward the flower from the optical sensor. Compare the same landing target across three illustrated sensing modes.'), h('small', null, 'False-colour educational views, not biological vision or calibrated measurements.')); setSensor('normal');
    } else if (mode === 'repair') {
      op.repair = 0; status.textContent = 'FAULT R-07 • right wing response below threshold.';
      body.append(h('p', null, 'Run the diagnostic, remove the thorax cover, then locate the right wing mount in the model or parts directory. Fit the spare and run a flight check.'), repairButton = btn('Run diagnostic', advanceRepair), h('small', null, 'Repair is reversible. Changing modes restores every original part.'));
    } else {
      status.textContent = '28 mm body · 52 mm wingspan · 24.26 mm US quarter.';
      body.append(h('p', null, 'The quarter and ruler share the model’s millimetre units. Orbit around them to see just how small the mechanism would be.'), h('small', null, 'Relative comparison only. On-screen size depends on your display and zoom.'));
    }
    requestAnimationFrame(frameExhibit); app.invalidate(true);
  }
  function advanceRepair() {
    if (op.repair === 0) { op.repair = 1; status.textContent = 'Fault isolated: right wing mount. Remove the thorax cover to access it.'; selection.select(bee.get('thorax-armor')); repairButton.textContent = 'Remove thorax cover'; }
    else if (op.repair === 1) { op.repair = 2; app.setExplode(.55, reduced.matches ? 0 : 1100); selection.clear(); status.textContent = 'Select the right wing mount. Use the model or open the parts directory.'; repairButton.textContent = 'Open parts directory'; }
    else if (op.repair === 2) app.ui.toggleDirectory(true);
    else if (op.repair === 3) { op.repair = 4; op.repairT = 0; status.textContent = 'Spare actuator fitted. Reassemble and check both wings.'; repairButton.textContent = 'Reassemble & test'; selection.clear(); }
    else if (op.repair === 4) { op.repair = 5; app.setExplode(0, 0); op.boot = 7; op.power = true; status.textContent = 'PASS • both wings respond. Unit ready for pollination.'; repairButton.textContent = 'Try again'; }
    else enter('repair');
    app.invalidate(true);
  }
  selection.on(kind => {
    if (kind !== 'select' || op.mode !== 'repair' || op.repair !== 2 || !selection.primary) return;
    if (/^wing-mount-r(?:\/|$)/.test(selection.primary.id)) { op.repair = 3; status.textContent = 'Correct assembly. Replace its oscillation actuator.'; repairButton.textContent = 'Fit spare actuator'; app.ui.toggleDirectory(false); }
    else status.textContent = 'That is not the faulted assembly. Find Right Wing Mount & Actuator.';
  });
  function poseMission() {
    const t = op.mission, step = Math.min(4, Math.floor(t * 5));
    const x = t < .2 ? -20 + 35 * smooth(t / .2) : t < .4 ? 15 : t < .6 ? 15 + 12 * smooth((t - .4) / .2) : t < .8 ? 27 : 27 - 47 * smooth((t - .8) / .2);
    const y = t < .4 ? 10 : t < .6 ? 10 * (1 - smooth((t - .4) / .2)) : t < .8 ? 0 : 14 * smooth((t - .8) / .2);
    bee.root.position.set(x, y, 0);
    if (slider) { slider.value = String(Math.round(t * 1000)); slider.setAttribute('aria-valuetext', STEPS[step]); }
    status.textContent = `${step + 1} / 5 — ${STEPS[step]}`; if (missionText) missionText.textContent = NOTES[step];
    setSensor(step === 1 ? 'uv' : 'normal');
    pollen.visible = step === 3;
    grains.forEach((g, i) => { const f = (op.clock * .45 + i / grains.length) % 1; g.position.set(32 - f * 1.4 + Math.sin(i * 7) * (1 - f) * 2, -9 + f * 4.2, Math.cos(i * 5) * (1 - f) * 2); });
    scan.visible = step === 1;
  }
  const oldTick = app.tick;
  app.tick = (dt, now) => {
    const old = oldTick?.(dt, now);
    if (op.mode === 'inspect') return old;
    // Undo only our pose before applying a fresh explosion transform and pose.
    restorePose(); bee.setExplode(app.getExplode(), true);
    const moving = !op.paused;
    if (moving) { op.clock += dt; if (op.mode === 'power') op.boot += dt; }
    if (op.mode === 'mission') { if (op.playing && moving) op.mission = Math.min(1, op.mission + dt / 24); if (op.mission >= 1) { op.playing = false; playButton.textContent = 'Replay mission'; } poseMission(); }
    const powered = op.mode === 'power' || op.mode === 'mission' || (op.mode === 'repair' && op.repair === 5);
    if (powered && app.getExplode() < .03) {
      const awake = op.mode === 'power' ? op.boot : 8;
      if (op.mode === 'power') {
        const stageIndex = Math.min(4, Math.floor(awake / 1.4));
        status.textContent = ['01 / Eyes online', '02 / Antennae sampling', '03 / Leg servos calibrated', '04 / Wings deployed', '05 / Hover stable'][stageIndex];
        bee.root.position.y = smooth((awake - 5.6) / 1.2) * (3.5 + Math.sin(op.clock * 1.8) * .35);
      }
      motionParts.forEach(p => {
        if (p.id.startsWith('wing-')) { const landed = op.mode === 'mission' && op.mission > .57 && op.mission < .8; rotate(p, yAxis, (p.id.endsWith('-r') ? 1 : -1) * (-.75 * (1 - smooth((awake - 4.2) / 1.4)) + (landed ? -.16 : Math.sin(op.clock * 18) * .3) * smooth((awake - 4.2) / 1.4))); }
        if (p.id.startsWith('antenna-') && awake > 1.4) rotate(p, zAxis, Math.sin(op.clock * 2.3) * .09);
        if (p.id.startsWith('leg-') && awake > 2.8) rotate(p, zAxis, Math.sin(op.clock * 2 + p.index) * .045);
      });
    }
    if (op.mode === 'repair' && op.repair === 4) { if (moving) op.repairT += dt; const mount = bee.get('wing-mount-r'); if (mount) mount.node.position.z += Math.sin(Math.min(1, op.repairT / 1.4) * Math.PI) * 6; }
    bee.root.updateMatrixWorld(true); app.picker.valid = false;
    if (op.mode === 'systems') updateFlows();
    if (op.mode === 'power') { lamp.position.copy(anchor('eye-r')); lamp.position.x += 1.6; lamp.material.opacity = .12 + Math.sin(op.clock * 2) * .04; }
    if (flower.visible) { scan.scale.setScalar(1 + Math.sin(op.clock * 2) * .08); if (op.mode === 'sensors') { bee.root.visible = false; const W = stage.size.x, H = stage.size.y; const distance = W < 760 ? Math.max(1.7, H / W * 1.25) : 1; stage.camera.position.set(32 - 40 * distance, -10 + 24 * distance, 24 * distance); stage.camera.lookAt(32, -10, 0); stage.camera.setViewOffset(W, H, W < 760 ? 0 : -160, W < 760 ? H * .21 : 0, W, H); stage.camera.updateMatrixWorld(); } }
    if (['mission', 'sensors', 'scale'].includes(op.mode)) { stage.camera.near = .1; stage.camera.far = 1000; stage.camera.updateProjectionMatrix(); }
    app.state.shadowDirty = powered;
    return (moving && !['scale', 'repair'].includes(op.mode)) || (moving && op.mode === 'repair' && (op.repair === 5 || op.repair === 4 && op.repairT < 1.4)) || old;
  };
  window.addEventListener('resize', () => { if (op.mode !== 'inspect') frameExhibit(); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') { enter('inspect'); e.stopPropagation(); } });
  // Existing inspection controls are an explicit exit, except explode in Systems.
  document.querySelector('.dock')?.addEventListener('pointerdown', () => { if (op.mode !== 'inspect' && op.mode !== 'systems') enter('inspect'); }, true);
  document.querySelector('.dock')?.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && op.mode !== 'inspect' && op.mode !== 'systems') enter('inspect'); }, true);
  document.querySelector('.hud-top')?.addEventListener('click', e => { if (op.mode !== 'inspect' && !e.target.closest('[aria-label="Parts directory"], [aria-label="Controls"]')) enter('inspect'); }, true);
  window.addEventListener('keydown', e => { if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) || e.target?.closest('.operate-panel')) return; if (op.mode !== 'inspect' && ['r', 'R', 'Escape', 't', 'T'].includes(e.key)) enter('inspect'); }, true);
  reduced.addEventListener('change', () => { if (reduced.matches) { op.paused = true; op.playing = false; pause.textContent = 'Resume motion'; } });
  flower.visible = pollen.visible = flowLayer.visible = scaleArt.visible = lamp.visible = false;
  app.operations = { enter, state: op, setSensor, advanceRepair };
}
