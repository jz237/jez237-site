// Living exhibit: deterministic poses layered over the original part/explosion registry.
import * as T from 'three';
import { h, loadCSS } from './dom.js';
import { VIEWS } from './rig.js';
import { createSystems, SYSTEMS } from './systems.js?v=1e77876d0b9b';
import { createRepair, REPAIR_DURATION } from './repair.js?v=1c37e19c2cc8';
import { createFlower } from './flower.js?v=14d0816081bf';

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
  await loadCSS('css/operate.css?v=bc398602b78b');
  const { bee, stage, rig, selection } = app;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const op = { mode: 'inspect', power: false, clock: 0, boot: 0, mission: 0, playing: false, sensor: 'normal', flow: 'energy', repair: 0, paused: false, macro: false, autoMission: false, sensorAngle: 0 };
  const art = new T.Group(); art.name = 'operating-exhibit'; stage.scene.add(art);
  const mat = (color, metalness = 0) => new T.MeshStandardMaterial({ color, roughness: .45, metalness });
  const mesh = (geo, material, parent = art) => { const m = new T.Mesh(geo, material); m.layers.set(4); parent.add(m); return m; };
  const sphere = new T.SphereGeometry(1, 20, 12);
  const motionParts = ['wing-r', 'wing-l', 'antenna-r', 'antenna-l', ...bee.parts.filter(p => /^leg-[^/]+$/.test(p.id)).map(p => p.id)].map(id => bee.get(id)).filter(Boolean);
  const poses = new Map();
  function restorePose() { for (const [p, q] of poses) p.node.quaternion.copy(q); poses.clear(); bee.root.position.set(0, 0, 0); }
  function rotate(p, axis, angle) { if (!p) return; poses.set(p, p.node.quaternion.clone()); p.node.rotateOnAxis(axis, angle); }
  const yAxis = new T.Vector3(0, 1, 0), zAxis = new T.Vector3(0, 0, 1);

  const botanical = createFlower(), flower = botanical.root;
  flower.position.set(32, -10, 0); art.add(flower);
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

  const repair = createRepair(app,art);
  const systems = createSystems(app,art), flowLayer = systems.group;
  function anchor(id) { const p=bee.get(id);return p.node.localToWorld(p.centerLocal.clone()); }
  function updateFlows() { systems.update(op.flow,op.clock); }

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
  const sensorHud = h('svg:svg', {class:'sensor-hud', 'aria-hidden':'true', hidden:true});
  const targets = [[0,1.8,0,'POLLEN / DISC FLORETS'],[8,-.5,0,'PETAL / NECTAR GUIDE'],[-.7,-13,1,'STEM / SUPPORT TISSUE']].map(([x,y,z,label])=>{
    const rect=h('svg:rect',{width:30,height:30,rx:3}), line=h('svg:path'),text=h('svg:text',null,label);
    const group=h('svg:g',null,rect,line,text);sensorHud.append(group);return {point:new T.Vector3(x+32,y-10,z),rect,line,text,group,label};
  });
  document.getElementById('ui').append(launch, panel, sensorHud);
  let studioBackground=stage.scene.background;
  const sensorBackground=new T.Color(0x08141c);
  function updateSensorHud() {
    const W=stage.size.x,H=stage.size.y,band=app.fitBand();sensorHud.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const top=H/2+band.cy-band.h/2,bottom=top+band.h;
    targets.forEach((t,i)=>{
      const p=t.point.clone().project(stage.camera),x=(p.x+1)*W/2,y=(1-p.y)*H/2;
      const show=x>15&&x<W-15&&y>top+15&&y<bottom-20&&Math.abs(p.z)<1&&(!op.macro||i===0);
      t.group.style.display=show?'':'none';
      const endX=clamp(x+(i===1?-100:55),W<760?20:370,W-155),endY=clamp(y+(i===0?-45:35),top+25,bottom-15);
      t.rect.setAttribute('x',x-15);t.rect.setAttribute('y',y-15);t.line.setAttribute('d',`M ${x} ${y} L ${endX} ${endY} h 110`);t.text.setAttribute('x',endX);t.text.setAttribute('y',endY-7);
      t.text.textContent=op.sensor==='thermal' ? ['WARM CENTRE · MODEL','COOLING PETAL · MODEL','COOL STEM · MODEL'][i] : t.label;
    });
  }
  let slider = null, missionText = null, playButton = null, savedLabels = true, savedExplode = 0;
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
    if(op.mode==='repair'){repair.frame();return;}
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
    botanical.setSensor(value);
    panel.dataset.sensor = value;
    document.querySelectorAll('[data-sensor]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sensor === value)));
    if (op.mode === 'sensors') status.textContent = value === 'normal' ? 'Visible light • inspect petal veins, anther crowns and individual pollen grains.' : value === 'uv' ? 'Simulated UV • cyan maps nectar-guide contrast; the disc is the landing target.' : 'Simulated thermal • warm centre, cooler petal edges and foliage. Relative model, not measured temperatures.';
    if (changed) app.invalidate();
  }
  function enter(mode) {
    const first = op.mode === 'inspect';
    if (first && mode !== 'inspect') { savedLabels = app.ui.state.labelsOn; savedExplode = app.getExplode(); }
    systems.activate(false);app.mechanisms?.restore();repair.activate(false);
    restorePose(); op.autoMission = false; op.mode = mode; op.playing = false; op.paused = reduced.matches; pause.textContent = op.paused ? 'Resume motion' : 'Pause motion';
    rig.autoRotate = false; rig.sweepAnim = null; rig.tween = null; stage.camera.clearViewOffset();
    sensorHud.toggleAttribute('hidden', mode !== 'sensors'); document.body.classList.toggle('sensor-view',mode === 'sensors' || mode === 'systems' || mode === 'repair'); sensorHud.style.display = mode === 'sensors' ? '' : 'none';
    if (stage.scene.background !== sensorBackground) studioBackground = stage.scene.background;
    stage.scene.background = ['sensors','systems','repair'].includes(mode) ? sensorBackground : studioBackground;
    stage.floor.visible = !['sensors','systems','repair'].includes(mode);
    selection.setIsolate(false); selection.clear(); selection.setXray(false); bee.root.visible = true;
    app.ui.endTour(); app.ui.closeDetail(); app.ui.toggleDirectory(false); app.ui.toggleSpecs(false);
    app.onInteract?.();
    flower.visible = mode === 'mission' || mode === 'sensors'; pollen.visible = mode === 'mission'; scaleArt.visible = mode === 'scale'; flowLayer.visible = mode === 'systems'; lamp.visible = mode === 'power';
    panel.hidden = mode === 'inspect'; launch.hidden = !panel.hidden; document.body.classList.toggle('operating', !panel.hidden);
    panel.dataset.mode=mode;body.replaceChildren(); slider = missionText = playButton = null;
    Object.entries(tabButtons).forEach(([k, b]) => b.setAttribute('aria-pressed', String(mode === k)));
    if (mode === 'inspect') { op.power = false; if (app.ui.state.labelsOn !== savedLabels) app.ui.setLabels(savedLabels); app.setExplode(savedExplode, 0); app.resetView(500); launch.focus(); return; }
    if (app.ui.state.labelsOn) app.ui.setLabels(false); app.setExplode(mode === 'systems' ? .45 : 0, 0); setSensor('normal');
    title.textContent = { power: 'A machine with a heartbeat.', systems: 'Follow the invisible work.', mission: 'One flower. Five small steps.', sensors: 'A different kind of sight.', repair: 'Bring the right wing back.', scale: 'Smaller than you think.' }[mode];
    if (mode === 'power') {
      op.power = true; op.boot = 0; op.autoMission = true;
      body.append(h('p', null, 'One continuous field mission: wake the sensors, deploy the wings, approach the flower, scan, land, gather pollen and depart.'),
        btn('Restart power sequence', () => enter('power')), btn('Start pollination mission', () => enter('mission')),
        h('small', null, 'Startup flows into the full mission automatically. Pause at any time. Reduced motion waits for your input; wingbeats are slowed for inspection.'));

    } else if (mode === 'systems') {
      const row=h('div',{class:'op-choices system-channels'}),routeList=h('div',{class:'system-routes'}),note=h('p',{class:'system-note'});
      const all=btn('Show all routes',()=>{systems.setFocus(-1);routeList.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));app.invalidate();});
      const context=btn(systems.state.context?'Restore natural materials':'Highlight system components',()=>{systems.setContext(!systems.state.context);context.textContent=systems.state.context?'Restore natural materials':'Highlight system components';});
      function channel(key) {
        op.flow=key;updateFlows();systems.activate(true);
        const cfg=SYSTEMS[key];panel.style.setProperty('--system-color','#'+cfg.color.toString(16));status.textContent=cfg.title;note.textContent=cfg.note;
        row.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.flow===key)));
        routeList.replaceChildren();
        cfg.links.forEach(([from,to],i)=>routeList.append(btn('',()=>{systems.setFocus(i);routeList.querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));}, {'aria-label':`Follow ${cfg.labels[from]} to ${cfg.labels[to]}`},)));
        [...routeList.children].forEach((button,i)=>{const [from,to]=cfg.links[i];button.append(h('span',{class:'route-number'},String(i+1).padStart(2,'0')),h('span',null,cfg.labels[from],h('b',null,' → '),cfg.labels[to]));});
        app.invalidate();
      }
      for(const [key,label]of Object.entries({energy:'Energy',signals:'Sensor signals',pollen:'Pollen'}))row.append(btn(label,()=>channel(key),{'data-flow':key}));
      body.append(row,note,routeList,h('div',{class:'system-actions'},all,context),h('small',null,'Arrows show direction. Choose a route to follow it; orbit or explode the bee to trace the connections. Explanatory paths, not measured telemetry or literal wiring.'));
      channel(op.flow);
    } else if (mode === 'mission') {
      op.mission = 0; op.playing = !reduced.matches;
      missionText = h('p'); slider = h('input', { type: 'range', min: 0, max: 1000, value: 0, 'aria-label': 'Pollination mission progress' });
      slider.addEventListener('input', () => { op.mission = +slider.value / 1000; op.playing = false; playButton.textContent = 'Play mission'; poseMission(); app.invalidate(); });
      playButton = btn(op.playing ? 'Pause mission' : 'Play mission', () => { if (op.mission >= 1) op.mission = 0; op.playing = !op.playing; op.paused = false; pause.textContent = 'Pause motion'; playButton.textContent = op.playing ? 'Pause mission' : 'Play mission'; });
      const row = h('div', { class: 'op-steps' }); STEPS.forEach((s, i) => row.append(btn(s, () => { op.mission = (i + .3) / 5; op.playing = false; playButton.textContent = 'Play mission'; poseMission(); app.invalidate(); })));
      body.append(slider, row, missionText, playButton, btn('Replay full sequence', () => enter('power'))); poseMission();
    } else if (mode === 'sensors') {
      const row = h('div', { class: 'op-choices' }); ['normal', 'uv', 'thermal'].forEach(key => row.append(btn({ normal: 'Visible', uv: 'UV', thermal: 'Thermal' }[key], () => setSensor(key), { 'data-sensor': key, 'aria-pressed': String(key === 'normal') })));
      const macro=btn(op.macro?'Show whole flower':'Inspect pollen close-up',()=>{op.macro=!op.macro;macro.textContent=op.macro?'Show whole flower':'Inspect pollen close-up';app.invalidate();});
      const legend=h('div',{class:'sensor-legend'},h('span',null,'LOW RESPONSE'),h('i'),h('span',null,'HIGH RESPONSE'));
      const angle=h('input',{type:'range',min:-180,max:180,value:op.sensorAngle,'aria-label':'Sensor viewing angle'});
      angle.addEventListener('input',()=>{op.sensorAngle=+angle.value;app.invalidate();});
      body.append(row,macro,h('label', {class:'sensor-angle'}, 'Rotate specimen',angle),legend,h('p',null,'Inspect the anther crowns and pollen up close, or rotate the flower to explore each spectral channel.'),
        h('small',null,'Illustrative UV and relative thermal model; colours are not measured temperatures or literal bee vision.'));setSensor('normal');

    } else if (mode === 'repair') {
      op.repairT=0;op.repair=0;repair.activate(true);repair.build(body,status,op,()=>enter('repair'));repair.update(0);
    } else {
      status.textContent = '28 mm body · 52 mm wingspan · 24.26 mm US quarter.';
      body.append(h('p', null, 'The quarter and ruler share the model’s millimetre units. Orbit around them to see just how small the mechanism would be.'), h('small', null, 'Relative comparison only. On-screen size depends on your display and zoom.'));
    }
    requestAnimationFrame(frameExhibit); app.invalidate(true);
  }
  function poseMission() {
    const t = op.mission, step = Math.min(4, Math.floor(t * 5));
    const x = t < .2 ? 15 * smooth(t / .2) : t < .4 ? 15 : t < .6 ? 15 + 12 * smooth((t - .4) / .2) : t < .8 ? 27 : 27 - 33 * smooth((t - .8) / .2);
    const y = t < .2 ? 3.5 + 6.5 * smooth(t / .2) : t < .4 ? 10 : t < .6 ? 10 * (1 - smooth((t - .4) / .2)) : t < .8 ? 0 : 14 * smooth((t - .8) / .2);
    bee.root.position.set(x, y, 0);
    if (slider) { slider.value = String(Math.round(t * 1000)); slider.setAttribute('aria-valuetext', STEPS[step]); }
    status.textContent = t >= 1 ? 'Mission complete • pollen collected; unit returning to standby.' : `${step + 1} / 5 — ${STEPS[step]}`; if (missionText) missionText.textContent = NOTES[step];
    setSensor(step === 1 ? 'uv' : 'normal');
    pollen.visible = step === 3;
    grains.forEach((g, i) => { const f = (op.clock * .45 + i / grains.length) % 1; g.position.set(32 - f * 1.4 + Math.sin(i * 7) * (1 - f) * 2, -9 + f * 4.2, Math.cos(i * 5) * (1 - f) * 2); });
    scan.visible = step === 1;
  }
  const rawXray=selection.setXray.bind(selection);
  selection.setXray=(on)=>{if(on&&op.mode==='systems')enter('inspect');return rawXray(on);};
  const oldTick = app.tick;
  app.tick = (dt, now) => {
    const old = oldTick?.(dt, now);
    if (op.mode === 'inspect') return old;
    // Undo only our pose before applying a fresh explosion transform and pose.
    repair.restore();restorePose(); bee.setExplode(app.getExplode(), true);
    const moving = !op.paused;
    if (moving) { op.clock += dt; if (op.mode === 'power') op.boot += dt; }
    if (op.mode === 'power' && op.autoMission && op.boot >= 8 && moving) { enter('mission'); op.paused=false; op.playing=true; pause.textContent='Pause motion'; }
    if (op.mode === 'mission') { if (op.playing && moving) op.mission = Math.min(1, op.mission + dt / 32); if (op.mission >= 1) { op.playing = false; playButton.textContent = 'Replay mission'; } poseMission(); }
    const powered = op.mode === 'power' || op.mode === 'mission';
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
    if(op.mode==='repair'){if(stage.scene.background!==sensorBackground){studioBackground=stage.scene.background;stage.scene.background=sensorBackground;}if(moving)op.repairT=Math.min(REPAIR_DURATION,op.repairT+dt);repair.update(op.repairT);op.repair=repair.state.step;}
    bee.root.updateMatrixWorld(true); app.picker.valid = false;
    if (op.mode === 'systems') { if(stage.scene.background!==sensorBackground){studioBackground=stage.scene.background;stage.scene.background=sensorBackground;} updateFlows(); }
    if (op.mode === 'power') { lamp.position.copy(anchor('eye-r')); lamp.position.x += 1.6; lamp.material.opacity = .12 + Math.sin(op.clock * 2) * .04; }
    if (flower.visible) {
      scan.scale.setScalar(1 + Math.sin(op.clock * 2) * .08);
      if (op.mode === 'sensors') {
        bee.root.visible = false;scan.visible = false;
        if (stage.scene.background !== sensorBackground) {studioBackground=stage.scene.background;stage.scene.background=sensorBackground;}
        const W=stage.size.x,H=stage.size.y,band=app.fitBand();
        const focus=new T.Vector3(32,op.macro?-8.2:-12,0),direction=new T.Vector3(-.62,.92,.70).normalize().applyAxisAngle(yAxis,T.MathUtils.degToRad(op.sensorAngle));
        const radius=op.macro?5.5:19, usable=Math.min(band.h,band.w)/H;
        const distance=radius/(Math.tan(T.MathUtils.degToRad(stage.camera.fov/2))*Math.max(.12,usable));
        stage.camera.position.copy(focus).addScaledVector(direction,distance);
        stage.camera.lookAt(focus);stage.camera.setViewOffset(W,H,-band.cx,-band.cy,W,H);stage.camera.updateMatrixWorld();
        stage.camera.near=.1;stage.camera.far=1000;stage.camera.updateProjectionMatrix();updateSensorHud();
      }
    }
    if (['mission', 'sensors', 'scale','repair'].includes(op.mode)) { stage.camera.near = .1; stage.camera.far = 1000; stage.camera.updateProjectionMatrix(); }
    app.state.shadowDirty ||= powered;
    return (moving && !['scale', 'repair', 'sensors'].includes(op.mode)) || (moving && op.mode === 'repair' && op.repairT < REPAIR_DURATION) || old;
  };
  window.addEventListener('resize', () => { requestAnimationFrame(()=>requestAnimationFrame(()=>{if(op.mode!=='inspect')frameExhibit();})); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') { enter('inspect'); e.stopPropagation(); } });
  // Existing inspection controls are an explicit exit, except explode in Systems.
  document.querySelector('.dock')?.addEventListener('pointerdown', e => { if (op.mode !== 'inspect' && (op.mode !== 'systems' || e.target.closest('[aria-label="X-ray shells"]'))) enter('inspect'); }, true);
  document.querySelector('.dock')?.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && op.mode !== 'inspect' && (op.mode !== 'systems' || e.target.closest('[aria-label="X-ray shells"]'))) enter('inspect'); }, true);
  document.querySelector('.hud-top')?.addEventListener('click', e => { if (op.mode !== 'inspect' && !e.target.closest('[aria-label="Parts directory"], [aria-label="Controls"]')) enter('inspect'); }, true);
  window.addEventListener('keydown', e => { if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) || e.target?.closest('.operate-panel')) return; if (op.mode !== 'inspect' && ['r', 'R', 'Escape', 't', 'T', 'x', 'X'].includes(e.key)) enter('inspect'); }, true);
  reduced.addEventListener('change', () => { if (reduced.matches) { op.paused = true; op.playing = false; pause.textContent = 'Resume motion'; } });
  flower.visible = pollen.visible = flowLayer.visible = scaleArt.visible = lamp.visible = false;
  app.operations = { enter, state: op, setSensor, flower, systems, repair };
}
