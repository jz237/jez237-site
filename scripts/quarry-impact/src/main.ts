import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { QuarryAO, LocalReflections } from './rendering';
import { StaticQuarryShadows, DAYLIGHT_DIRECTION, DAYLIGHT_DISTANCE } from './static-shadows';
import { prepareNorthForestFloor } from './scenery-north-floor';
import { northForestDiagnostics } from './scenery-north-forest';
import { northRidgeDiagnostics } from './scenery-north-ridge';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadCars, environment } from './assets';
import { prepareArenaFloor } from './scenery-arena-material';
import { prepareCircuitSurface } from './scenery-circuit-material';
import { Quarry } from './world';
import { Vehicle, type Input } from './vehicle';
import { Effects } from './effects';
import { VehicleFire } from './vehicle-fire';
import {DrivingBrain} from './driving-brain';
import {DemoDirector, DEMO_CAMERAS, type DemoCamera} from './demo-director';
import { Sound } from './audio';
import { OnlineView } from './online-view';
import { OnlineUI } from './online-ui';
import { scenerySurfaceHeight, quarryExtensionHeight, quarryWestWallHeight, landscapeHeight } from './quarry-layout';
import {
  DEFINITIONS,
  clamp,
  wrap,
  trackPoint,
  CHECKPOINTS,
  damageFromImpulse,
  derbyOrder,
  advanceCheckpoint,
  terrainHeight,
  type Mode,
  type CarKind,
} from './rules';
import './style.css';
const ui = document.querySelector<HTMLDivElement>('#ui')!;
const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const saveKey = 'quarry-impact-v1';
let saved: any = {};
try {
  saved = JSON.parse(localStorage.getItem(saveKey) ?? '{}');
} catch {}
const settings = {
  quality: saved.quality ?? 'ultra',
  engine: saved.engine ?? 0.72,
  effects: saved.effects ?? 0.8,
  ambience: saved.ambience ?? 0.45,
};
const cameraImpactOffset = new T.Vector3();
const sound = new Sound();
let vehicleFire:VehicleFire | undefined;
const drivers=new DrivingBrain(),director=new DemoDirector();
let demo=false,demoRestart=0;
let preparingEvent=false,preparationInterrupted=false;
sound.levels = {
  engine: settings.engine,
  effects: settings.effects,
  ambience: settings.ambience,
};
let mode: Mode = 'derby',
  kind: CarKind = 'coupe',
  state:
    | 'loading'
    | 'menu'
    | 'lobby'
    | 'countdown'
    | 'playing'
    | 'paused'
    | 'result'
    | 'wrecked'
    | 'inspect' = 'loading';
let resumeState = 'playing';
let wreckHold = 0;
let cars: Vehicle[] = [];
let elapsed = 0,
  countdown = 3.5,
  accumulator = 0,
  clock = 0,
  lastFrame = performance.now(),
  hudTime = 0;
let hood = false,
  traffic = true,
  autopilot = false,
  resultTitle = '',
  statusMessage = '',
  statusUntil = 0;
let qualityScale = 1;
const frames: number[] = [];
let capturedFrames:number[]|null=null;
let benchmarkStart = 0;
const benchmarkSamples: {
  time: number;
  fps: number;
  geometries: number;
  textures: number;
  heap: number;
}[] = [];
let collisions = 0;
let lastImpact = new Map<string, number>();
let keys = new Set<string>();
let testInput: Input | null = null;
const renderer = new T.WebGLRenderer({
  canvas,
  antialias: false, // Composer renders offscreen; SMAA supplies final edge antialiasing.
  powerPreference: 'high-performance',
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = .96;
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.info.autoReset = false;
const scene = new T.Scene();
const camera = new T.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 850);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const ao = new QuarryAO(scene, camera);
const reflections = new LocalReflections(renderer, scene);
composer.addPass(ao);
composer.addPass(new OutputPass());
composer.addPass(new SMAAPass());
const orbit = new OrbitControls(camera, canvas);
orbit.enabled = false;
orbit.minDistance = 2.5;
orbit.maxDistance = 22;
orbit.maxPolarAngle = Math.PI * 0.48;
orbit.enableDamping = true;
let physics: R.World, events: R.EventQueue, quarry: Quarry, fx: Effects;
let staticShadows: StaticQuarryShadows | undefined;
let environmentTarget: T.WebGLRenderTarget | undefined;
let online:OnlineView, onlineUI:OnlineUI, onlinePhase='';
const isPlayer=(c:Vehicle)=>c===cars[0];
const modes = {
  derby: {
    label: 'DEMOLITION DERBY',
    description: 'Eight cars. One survivor.',
    button: 'ENTER DERBY',
  },
  playground: {
    label: 'DESTRUCTION PLAYGROUND',
    description: 'Explore. Launch. Break. Repeat.',
    button: 'FREE DRIVE',
  },
  race: {
    label: 'QUARRY CIRCUIT',
    description: 'Three laps. Full contact.',
    button: 'START RACE',
  },
};
const persist = () => {
  try {
    localStorage.setItem(saveKey, JSON.stringify({ ...saved, ...settings }));
  } catch {}
};
function loading(message: string) {
  ui.innerHTML = `<div class="menu"><div class="brand"><i></i> BLACKRIDGE MOTOR CLUB</div><div class="intro"><div class="eyebrow">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1></div><div class="loading"><div class="eyebrow">${message}</div><div></div></div></div>`;
}
function menu() {
  demo=false;demoRestart=0;director.reset();orbit.maxDistance=22;orbit.enablePan=true;
  if (online?.active) online.disconnect();
  state = 'menu';
  wreckHold = 0;
  keys.clear(); testInput = null;
  orbit.enabled = false;
  sound.pause(false);
  quarry.setMode(mode);
  ui.innerHTML = `<div class="menu"><div class="topbar"><div class="brand"><i></i> BLACKRIDGE MOTOR CLUB</div><div class="location">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / &nbsp; DRY TRACK</div></div><div class="intro"><div class="eyebrow">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving ground.<br>Take the long way home — if it still runs.</p><div class="car-picker">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button data-car="${k}" class="${k === kind ? 'active' : ''}">${DEFINITIONS[k].name}</button>`).join('')}</div><div class="spec">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div class="menu-bottom">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class="mode-card ${m === mode ? 'active' : ''}" data-mode="${m}"><span class="number">0${i + 1} / ${m === 'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : 'EXPLORATION'}</span><strong>${modes[m].label}</strong><small>${modes[m].description}</small></button>`).join('')}<button class="primary" id="start">${modes[mode].button}<span>↗</span></button></div><div class="footer"><span>THREE MACHINES &nbsp; · &nbsp; ONE QUARRY &nbsp; · &nbsp; NO PRISTINE FINISHES</span><div><a href="./licenses/CREDITS.md" target="_blank" rel="noopener">CREDITS</a><button id="settings">SETTINGS</button><button id="fullscreen">FULLSCREEN ↗</button></div></div></div>`;
  ui.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(
    (b) =>
      (b.onclick = () => {
        mode = b.dataset.mode as Mode;
        menu();
      }),
  );
  ui.querySelectorAll<HTMLButtonElement>('[data-car]').forEach(
    (b) =>
      (b.onclick = () => {
        kind = b.dataset.car as CarKind;
        createCars(true);
        menu();
      }),
  );
  document.querySelector<HTMLButtonElement>('#start')!.onclick = () => start(false);
  const watch=document.createElement('button');watch.id='watch-demo';watch.className='small-button';watch.textContent='WATCH DEMO ▷';
  watch.onclick=()=>{if(mode==='playground')mode='derby';void start(true);};
  ui.querySelector('.intro')!.append(watch);
  document.querySelector<HTMLButtonElement>('#settings')!.onclick = () =>
    pause(true);
  document.querySelector<HTMLButtonElement>('#fullscreen')!.onclick =
    fullScreen;
  const onlineButton=document.createElement('button');onlineButton.id='online';onlineButton.textContent='PLAY ONLINE ↗';
  onlineButton.onclick=()=>onlineUI.show();ui.querySelector('.footer > div')!.prepend(onlineButton);
}
function leaveOnline() {
  online.disconnect();onlinePhase='';keys.clear();testInput=null;
  const url=new URL(location.href);url.searchParams.delete('room');history.replaceState(null,'',url);
  createCars(true);menu();
}
async function connectOnline(endpoint:string,room:string,name:string) {
  demo=false;
  await sound.init();online.reset();online.active=true;onlinePhase='';
  try {online.network.connect({endpoint,room,name,kind});}catch(error){online.active=false;throw error;}
}
function receiveOnline() {
  const s=online.network.snapshot;if(!online.active||!s)return;
  online.receive(s);elapsed=s.elapsed;countdown=s.countdown;mode=s.mode;
  const changed=onlinePhase!==s.phase;onlinePhase=s.phase;
  if(s.phase==='lobby') {
    state='lobby';orbit.enabled=false;onlineUI.lobby(s,changed);return;
  }
  kind=cars[0].kind;quarry.setMode(mode);
  if(changed) {
    if(s.phase==='result') {
      finish(s.ranking[0]===online.network.id?'EVENT WINNER':mode==='race'?'RACE COMPLETE':'DERBY COMPLETE');
    }else if(state==='paused') resumeState=s.phase;
    else {state=s.phase;orbit.enabled=false;hud();sound.pause(false);}
  }
  if(s.phase==='result') {
    const button=document.querySelector<HTMLButtonElement>('#again');
    if(button){button.disabled=!online.network.isHost;button.textContent=online.network.isHost?'RUN IT BACK ↗':'WAITING FOR HOST REMATCH';}
  }
}
function createCars(attract = false) {
  drivers.reset();
  sound.clearCars();
  vehicleFire?.reset();
  for (const c of cars) c.dispose();
  cars = [];
  fx.reset();
  quarry.resetProps();
  lastImpact.clear();
  collisions = 0;
  const count = attract ? 1 : mode === 'playground' ? (traffic ? 5 : 1) : 8;
  const colors = [
    DEFINITIONS[kind].color,
    0x983e2f,
    0x426068,
    0xafa343,
    0xc6c6b3,
    0x485453,
    0x344266,
    0x664234,
  ];
  for (let i = 0; i < count; i++) {
    const type =
      i === 0 ? kind : (['coupe', 'sedan', 'hatch'] as CarKind[])[i % 3];
    const car = new Vehicle(i, type, colors[i], scene, physics, fx);
    cars.push(car);
    if (attract) car.place(0, -13, 0.65);
    else if (mode === 'derby') {
      const a = (i / 8) * Math.PI * 2;
      car.place(
        Math.sin(a) * 29,
        -Math.cos(a) * 29,
        Math.atan2(-Math.sin(a), Math.cos(a)),
      );
    } else if (mode === 'race') {
      const p = trackPoint(1 - i * 0.008),
        q = trackPoint(1 - i * 0.008 + 0.003);
      const yaw = Math.atan2(q.x - p.x, q.z - p.z);
      car.place(
        p.x + Math.cos(yaw) * (i % 2 ? 2 : -2),
        p.z - Math.sin(yaw) * (i % 2 ? 2 : -2),
        yaw,
      );
      car.nextCheckpoint = 1;
    } else car.place(i === 0 ? 0 : 65 + i * 6, -20 + i * 6, 0);
  }
  for (let i = 0; i < 90; i++) {
    for (const c of cars) c.preStep(1 / 60);
    physics.step();
    for (const c of cars) c.postStep(1 / 60, 0);
  }
  cars.forEach((c) => {
    c.previous.copy(c.current);
    c.root.position.copy(c.current);
  });
  sound.attach(cars);
}
async function start(watch=demo) {
  demo=watch;demoRestart=0;director.reset();keys.clear();testInput=null;
  wreckHold = 0;
  if(online?.active) {if(online.network.isHost)online.network.start(mode);return;}
  if(preparingEvent)return;
  preparingEvent=true;preparationInterrupted=false;
  state='loading';
  loading(watch?'PREPARING DEMO':'PREPARING EVENT');
  try {
    await sound.init();
  } catch (e) {
    console.warn('Audio loading failed', e);
    toast('Sound unavailable — check local assets', 8);
  }
  createCars();
  for(const car of cars)staticShadows?.bindReceivers(car.root);
  await warmPrograms();
  elapsed = 0;
  countdown = mode === 'playground' ? 0 : 3.5;
  accumulator = 0;
  state = countdown ? 'countdown' : 'playing';
  orbit.enabled = false;
  quarry.setMode(mode);
  cameraImpactOffset.set(0,0,0);
  camera.position.copy(cars[0].current).add(new T.Vector3(0, 4, -8));
  hud();
  sound.pause(false);
  preparingEvent=false;
  if(preparationInterrupted||document.hidden)pause();
}
function hud() {
  ui.innerHTML = `<div class="hud"><div class="hud-top"><div><div class="eyebrow">BLACKRIDGE / ${mode === 'race' ? 'CIRCUIT 01' : 'QUARRY FLOOR'}</div><div class="hud-title">${modes[mode].label}</div></div><div class="event-stats"><div><span id="event-label">${mode === 'derby' ? 'REMAINING' : mode === 'race' ? 'POSITION' : 'FREE DRIVE'}</span><strong id="event-value">8 / 8</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? 'TIME LEFT' : 'SESSION'}</span><strong id="time-value">05:00</strong></div><button class="small-button" id="pause">Ⅱ</button></div></div><canvas class="minimap" id="map" width="270" height="220"></canvas><div class="status"><div class="status-row"><span>${DEFINITIONS[kind].name}</span><b id="health">100%</b></div><div class="condition"><b id="health-bar" style="width:100%"></b></div><div class="subsystems"><span id="engine-status">ENGINE OK</span><span id="steer-status">STEERING OK</span><span id="surface">GRAVEL</span></div></div><div class="speed"><strong id="speed">0</strong> <span>KM/H</span><small id="gear">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class="rpm"><b id="rpm-bar"></b></div></div><div class="controls"><kbd>WASD</kbd> DRIVE <kbd>SPACE</kbd> HANDBRAKE <kbd>C</kbd> CAMERA <kbd>R</kbd> RECOVER ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT <kbd>T</kbd> TRAFFIC' : ''}</div><div class="center-message" id="countdown"></div><div id="toast"></div></div>`;
  document.querySelector<HTMLButtonElement>('#pause')!.onclick = () => pause();
  if(demo)demoHud();
  if(online?.active)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="network-status" id="network-status"></div>');
}
function demoHud(){
  ui.querySelector('.hud-title')!.textContent='LIVE DEMO / '+modes[mode].label;
  ui.querySelector('.controls')!.innerHTML='<kbd>C</kbd> CAMERA <kbd>[</kbd><kbd>]</kbd> CAR <kbd>SPACE</kbd> PAUSE · FREE ORBIT: DRAG / SCROLL';
  ui.querySelector('.status-row > span')!.id='follow-name';
  ui.querySelector('.hud')!.insertAdjacentHTML('beforeend',`<div class="demo-toolbar"><label>VIEW<select id="demo-camera">${Object.entries(DEMO_CAMERAS).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label>FOLLOW<select id="demo-car"><option value="auto">Director chooses</option>${cars.map(c=>`<option value="${c.id}">#${c.id+1} ${DEFINITIONS[c.kind].name}</option>`).join('')}</select></label><label>EVENT<select id="demo-event"><option value="derby">Demolition derby</option><option value="race">Quarry circuit</option></select></label><button class="small-button" id="demo-exit">EXIT DEMO</button></div>`);
  const view=document.querySelector<HTMLSelectElement>('#demo-camera')!;view.value=director.view;view.onchange=()=>director.select(view.value as DemoCamera);
  const follow=document.querySelector<HTMLSelectElement>('#demo-car')!;follow.onchange=()=>{if(follow.value==='auto'){director.manual=false;director.select('director');view.value='director';}else director.follow(+follow.value);};
  const event=document.querySelector<HTMLSelectElement>('#demo-event')!;event.value=mode;event.onchange=()=>{mode=event.value as Mode;void start(true);};
  document.querySelector<HTMLButtonElement>('#demo-exit')!.onclick=()=>{createCars(true);menu();};
}
function text(id: string, t: string) {
  const e = document.getElementById(id);
  if (e) e.textContent = t;
}
function toast(t: string, duration = 3) {
  statusMessage = t;
  statusUntil = clock + duration;
}
function updateHud() {
  if (!['playing', 'countdown'].includes(state)&&!(demo&&state==='result')) return;
  const player = demo?(cars.find(c=>c.id===director.followed)??cars[0]):cars[0];
  if(demo){text('follow-name',`#${player.id+1} ${DEFINITIONS[player.kind].name}`);const view=document.querySelector<HTMLSelectElement>('#demo-camera');if(view)view.value=director.view;const follow=document.querySelector<HTMLSelectElement>('#demo-car');if(follow)follow.value=director.manual?String(director.followed):'auto';}
  text('health', Math.ceil(player.health) + '%');
  const hb = document.getElementById('health-bar')!;
  hb.style.width = player.health + '%';
  hb.style.background = player.health < 30 ? '#dd7a55' : '#d9c486';
  text('speed', Math.round(Math.abs(player.speed) * 3.6).toString());
  text(
    'gear',
    `GEAR ${player.gear === 0 ? 'R' : player.gear}  /  ${Math.round(player.rpm)} RPM`,
  );
  document.getElementById('rpm-bar')!.style.width =
    clamp((player.rpm / 7000) * 100, 0, 100) + '%';
  text('surface', player.surface.toUpperCase());
  text('engine-status', player.health < 40 ? 'ENGINE DAMAGED' : 'ENGINE OK');
  text(
    'steer-status',
    Math.abs(player.damageLeft - player.damageRight) > 16
      ? 'STEERING PULL'
      : 'STEERING OK',
  );
  const remaining = Math.max(0, 300 - elapsed);
  text(
    'time-value',
    mode === 'derby'
      ? formatTime(remaining)
      : mode === 'race'
        ? `${Math.min(3, player.lap)} / 3 · ${formatTime(elapsed + player.penalty)}`
        : formatTime(elapsed),
  );
  text(
    'event-value',
    mode === 'derby'
      ? cars.filter((c) => c.health > 0).length + ' / 8'
      : mode === 'race'
        ? `${online?.active?(online.network.snapshot?.ranking.indexOf(online.network.id)??0)+1:rankRace().indexOf(player) + 1} / 8`
        : traffic
          ? 'TRAFFIC ON'
          : 'SOLO',
  );
  document.getElementById('countdown')!.innerHTML =
    state === 'countdown'
      ? `<strong>${Math.ceil(countdown)}</strong><p>${mode === 'derby' ? 'SURVIVE THE IMPACT' : 'FIND YOUR LINE'}</p>`
      : demo&&state==='result'?`<p>${resultTitle}</p><p>NEXT EVENT IN ${Math.ceil(demoRestart)}</p>`:'';
  if (!demo&&player.rollTime > 2) toast('OVERTURNED — PRESS R TO RECOVER', 1);
  if (!demo&&mode === 'race') {
    const target = CHECKPOINTS[player.nextCheckpoint];
    const d = new T.Vector3(
      target.x - player.current.x,
      0,
      target.z - player.current.z,
    ).normalize();
    if (player.forward.dot(d) < -0.65 && player.speed > 3)
      toast('WRONG WAY — FOLLOW THE CHECKPOINTS', 1);
  }
  document.getElementById('toast')!.innerHTML =
    clock < statusUntil ? `<div class="toast">${statusMessage}</div>` : '';
  drawMap();
}
function drawMap() {
  const c = document.querySelector<HTMLCanvasElement>('#map');
  if (!c) return;
  const x = c.getContext('2d')!;
  x.clearRect(0, 0, 270, 220);
  const scale = mode === 'derby' ? 2 : 0.85;
  const ox = 135,
    oz = 110;
  x.strokeStyle = '#d0c49288';
  x.lineWidth = 2;
  x.beginPath();
  if (mode === 'derby')
    x.ellipse(ox, oz, 46 * scale, 46 * scale, 0, 0, Math.PI * 2);
  else
    for (let i = 0; i <= 100; i++) {
      const p = trackPoint(i / 100);
      i
        ? x.lineTo(ox + p.x * scale, oz - p.z * scale)
        : x.moveTo(ox + p.x * scale, oz - p.z * scale);
    }
  x.stroke();
  for (const car of cars) {
    x.fillStyle =
      (demo?car.id===director.followed:isPlayer(car)) ? '#f6dc98' : car.health <= 0 ? '#5d6458' : '#c0cabb';
    x.beginPath();
    x.arc(
      ox + car.current.x * scale,
      oz - car.current.z * scale,
      (demo?car.id===director.followed:isPlayer(car)) ? 5 : 3,
      0,
      Math.PI * 2,
    );
    x.fill();
  }
}
function formatTime(t: number) {
  return `${Math.floor(t / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor(t % 60)
    .toString()
    .padStart(2, '0')}`;
}
function pause(settingsOnly = false) {
  if (['loading', 'paused'].includes(state)||state==='result'&&!demo) return;
  resumeState = state;
  state = 'paused';
  keys.clear();
  online?.network.clearInput();
  sound.pause(true);
  orbit.enabled = false;
  ui.insertAdjacentHTML('beforeend', `<div class="overlay" id="overlay"><div class="dialog"><div class="eyebrow">BLACKRIDGE MOTOR CLUB</div><h2>${settingsOnly ? 'SETTINGS' : 'TAKE A BREATHER'}</h2><div class="settings-row"><label for="quality">Graphics</label><select id="quality"><option value="ultra">Ultra</option><option value="high">High</option><option value="medium">Medium</option></select></div>${(['engine', 'effects', 'ambience'] as const).map((k) => `<div class="settings-row"><label for="${k}-volume">${k[0].toUpperCase() + k.slice(1)}</label><input id="${k}-volume" type="range" min="0" max="1" step=".05" value="${settings[k]}"></div>`).join('')}<p>${demo?'C camera · [ / ] choose car<br>Space / Escape pause · M mute · F fullscreen<br>Free orbit: drag to look around, scroll to zoom':"W / ↑ accelerate · S / ↓ brake & reverse<br>A D / ← → steer · Space handbrake · C camera<br>R recover · M mute · F fullscreen · Escape pause"+(mode === 'playground' ? '<br>I inspect wreck · T toggle traffic · R repair' : '')}</p><button class="primary" id="resume">${resumeState === 'menu' ? 'BACK' : 'RESUME'}</button>${resumeState !== 'menu' ? '<button class="small-button" id="restart">RESTART EVENT</button><button class="small-button" id="main-menu">RETURN TO QUARRY</button>' : ''}</div></div>`);
  const quality = document.querySelector<HTMLSelectElement>('#quality')!;
  quality.value = settings.quality;
  quality.onchange = () => {
    settings.quality = quality.value;
    applyQuality();
    persist();
  };
  for (const k of ['engine', 'effects', 'ambience'] as const)
    document.querySelector<HTMLInputElement>('#' + k + '-volume')!.oninput = (
      e,
    ) => {
      settings[k] = +(e.target as HTMLInputElement).value;
      sound.levels[k] = settings[k];
      sound.setLevels();
      persist();
    };
  document.querySelector<HTMLButtonElement>('#resume')!.onclick = resume;
  const restart = document.querySelector<HTMLButtonElement>('#restart');
  if (restart) {restart.onclick = () => start();if(online?.active)restart.remove();}
  if(online?.active)ui.querySelector('#overlay h2')!.textContent='CONTROLS PAUSED · ROOM CONTINUES';
  const mm = document.querySelector<HTMLButtonElement>('#main-menu');
  if (mm)
    mm.onclick = () => {
      if(online?.active){leaveOnline();return;}
      createCars(true);
      menu();
    };
}
function resume() {
  if (state === 'inspect') {
    state = 'playing';
    orbit.enabled = false;
    hud();
    sound.pause(false);
    return;
  }
  if (state !== 'paused') return;
  document.getElementById('overlay')?.remove();
  state = resumeState as typeof state;
  if(online?.active && ['playing','countdown'].includes(state))hud();
  if (resumeState === 'menu') menu();
  sound.pause(false);
  if (resumeState === 'wrecked') orbit.enabled = true;
  lastFrame = performance.now();
}
function applyQuality() {
  qualityScale =
    settings.quality === 'ultra'
      ? 1
      : settings.quality === 'high'
        ? 0.85
        : 0.65;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5) * qualityScale);
  renderer.setSize(innerWidth, innerHeight);
  composer.setPixelRatio(Math.min(devicePixelRatio, 1.5) * qualityScale);
  composer.setSize(innerWidth, innerHeight);
  if (quarry) {
    quarry.sun.shadow.mapSize.setScalar(
      settings.quality === 'ultra' ? 4096 : 2048,
    );
    quarry.sun.shadow.map?.dispose();
    quarry.sun.shadow.map = null;
    quarry.sun.shadow.needsUpdate = true;
  }
  staticShadows?.setQuality(settings.quality);
  vehicleFire?.setQuality(settings.quality);
  ao.enabled = settings.quality !== 'medium';
  reflections.enabled = settings.quality !== 'medium';
  reflections.interval = settings.quality === 'ultra' ? 3 : 6;
  renderer.shadowMap.enabled = settings.quality !== 'medium';
}
function fullScreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}
function recover() {
  if(online?.active){online.network.recover();return;}
  const p = cars[0];
  if (!p) return;
  if (mode === 'playground') {
    p.place(
      p.current.x,
      p.current.z,
      Math.atan2(p.forward.x, p.forward.z),
      true,
    );
    toast('CAR REPAIRED');
  } else if (mode === 'race') {
    const index = (p.nextCheckpoint + 23) % 24;
    const at = CHECKPOINTS[index],
      to = CHECKPOINTS[p.nextCheckpoint];
    p.place(at.x, at.z, Math.atan2(to.x - at.x, to.z - at.z));
    p.penalty += 5;
    toast('RECOVERED · +5 SECONDS');
  } else {
    if (p.health === 0) return;
    p.health = Math.max(1, p.health - 8);
    const dist = Math.hypot(p.current.x, p.current.z);
    p.place(
      p.current.x * (dist > 38 ? 38 / dist : 1),
      p.current.z * (dist > 38 ? 38 / dist : 1),
      Math.atan2(-p.current.x, -p.current.z),
    );
    toast('RECOVERED · CONDITION −8%');
  }
}
function input(): Input {
  if (testInput) return testInput;
  let throttle = keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0,
    brake = 0;
  let steer =
    (keys.has('KeyA') || keys.has('ArrowRight') ? -1 : 0) +
    (keys.has('KeyD') || keys.has('ArrowLeft') ? 1 : 0);
  let handbrake = keys.has('Space');
  const reverse = keys.has('KeyS') || keys.has('ArrowDown');
  if (reverse) {
    if (cars[0].speed > 1) brake = 1;
    else throttle = -0.6;
  }
  const pad = navigator.getGamepads?.().find((p) => p?.connected);
  if (pad) {
    if (Math.abs(pad.axes[0]) > 0.12) steer = pad.axes[0];
    throttle = Math.max(throttle, pad.buttons[7]?.value ?? 0);
    if ((pad.buttons[6]?.value ?? 0) > 0.05) {
      if (cars[0].speed > 1) brake = pad.buttons[6].value;
      else throttle = -pad.buttons[6].value * 0.6;
    }
    handbrake ||= pad.buttons[0]?.pressed ?? false;
  }
  return { throttle, steer, brake, handbrake };
}
function ai(car: Vehicle, dt: number): Input {
  if(car.health<=0||car.finished)return {throttle:0,steer:0,brake:1,handbrake:false};
  const yaw=Math.atan2(car.forward.x,car.forward.z);
  if(mode==='race'){
    let nearest=Infinity;
    for(let k=0;k<100;k++){const p=trackPoint(k/100);nearest=Math.min(nearest,Math.hypot(car.current.x-p.x,car.current.z-p.z));}
    car.offTrackTime=nearest>14?car.offTrackTime+dt:0;
    if(car.offTrackTime>7||car.rollTime>4){
      const prev=CHECKPOINTS[(car.nextCheckpoint+23)%24],next=CHECKPOINTS[car.nextCheckpoint];
      car.place(prev.x,prev.z,Math.atan2(next.x-prev.x,next.z-prev.z));car.offTrackTime=0;car.penalty+=5;drivers.memory.delete(car.id);
    }
  }else if(car.rollTime>5){car.place(car.current.x,car.current.z,yaw);car.health=Math.max(1,car.health-7);car.penalty+=5;drivers.memory.delete(car.id);}
  return drivers.update(car,cars,mode,dt,()=>{
    const ray=(angle:number)=>{
      const dir={x:Math.sin(yaw+angle),y:0,z:Math.cos(yaw+angle)};
      const start={x:car.current.x+dir.x*2.5,y:Math.max(car.current.y,landscapeHeight(car.current.x,car.current.z)+.55),z:car.current.z+dir.z*2.5};
      const hit=physics.castRay(new R.Ray(start,dir),24,true,undefined,undefined,undefined,car.body,c=>!cars.some(v=>v.collider.handle===c.handle||v.roof.handle===c.handle));
      return hit?hit.timeOfImpact:24;
    };
    return {front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};
  });
}
function rankRace() {
  return [...cars].sort((a, b) =>
    a.finished && b.finished
      ? a.finishTime - b.finishTime
      : a.finished
        ? -1
        : b.finished
          ? 1
          : b.passed - a.passed ||
            a.current.distanceTo(
              new T.Vector3(
                CHECKPOINTS[a.nextCheckpoint].x,
                0,
                CHECKPOINTS[a.nextCheckpoint].z,
              ),
            ) -
              b.current.distanceTo(
                new T.Vector3(
                  CHECKPOINTS[b.nextCheckpoint].x,
                  0,
                  CHECKPOINTS[b.nextCheckpoint].z,
                ),
              ),
  );
}
function finish(title: string) {
  if(demo){if(state==='result')return;resultTitle=title;state='result';demoRestart=8;cars.forEach(c=>c.render(1));updateHud();return;}
  resultTitle = title;
  state = 'result';
  sound.pause(true);
  const ordered = online?.active ? (online.network.snapshot?.ranking??[]).map(id=>cars.find(c=>c.id===id)!).filter(Boolean) : mode === 'derby' ? derbyOrder(cars) : rankRace();
  const rank = ordered.findIndex(isPlayer) + 1;
  saved.best ??= {};
  const score =
    mode === 'derby' ? cars[0].inflicted : elapsed + cars[0].penalty;
  if (
    !online?.active && (mode !== 'race' || cars[0].finished) &&
    (!saved.best[mode] ||
      (mode === 'derby' ? score > saved.best[mode] : score < saved.best[mode]))
  )
    saved.best[mode] = score;
  persist();
  if (!online?.active && cars[0].health <= 0) {
    state = 'wrecked'; wreckHold = 5;
    sound.pause(false);
    keys.clear(); testInput = null; accumulator = 0;
    for (const car of cars) { car.input = {throttle:0,steer:0,brake:1,handbrake:false}; car.render(1); }
    const player = cars[0];
    const offset = player.wreckParts.inspectionOffset(player.currentQ);
    camera.position.copy(player.current).add(offset);
    camera.position.y=Math.max(camera.position.y,landscapeHeight(camera.position.x,camera.position.z)+1.2);
    camera.fov = 52; camera.updateProjectionMatrix();
    orbit.target.copy(player.current); orbit.enabled = true; orbit.update();
    ui.innerHTML = '<div class="wreck-note"><strong>WRECKED OUT</strong><span>DRAG TO LOOK AROUND &middot; SCROLL TO ZOOM</span><span>RETURNING TO QUARRY IN <b id="wreck-count">5</b></span></div>';
    return;
  }
  ui.innerHTML = `<div class="overlay"><div class="dialog"><div class="eyebrow">${modes[mode].label} / RESULTS</div><h2>${title}</h2><p>Finished ${rank} of ${cars.length} · ${Math.ceil(cars[0].health)}% condition<br>${mode === 'derby' ? Math.round(cars[0].inflicted) + ' damage inflicted' : formatTime(elapsed + cars[0].penalty) + ' including recovery penalties'}</p>${ordered.map((c, i) => `<div class="results-row ${isPlayer(c) ? 'player' : ''}"><span>${String(i + 1).padStart(2, '0')} &nbsp; ${isPlayer(c) ? 'YOU' : DEFINITIONS[c.kind].name + ' #' + c.id}</span><span>${mode === 'derby' ? Math.ceil(c.health) + '%' : c.finished ? formatTime(c.finishTime) : 'LAP ' + Math.min(3, c.lap)}</span></div>`).join('')}<button class="primary" id="again">RUN IT BACK ↗</button><button class="small-button" id="back">RETURN TO QUARRY</button></div></div>`;
  document.querySelector<HTMLButtonElement>('#again')!.onclick = () => start();
  document.querySelector<HTMLButtonElement>('#back')!.onclick = () => {
    if(online?.active){leaveOnline();return;}
    createCars(true);
    menu();
  };
  if(online?.active && !online.network.isHost){const b=document.querySelector<HTMLButtonElement>('#again')!;b.disabled=true;b.textContent='WAITING FOR HOST REMATCH';}
}
function step(dt: number) {
  if(online?.active)return;
  if (state === 'countdown') {
    countdown -= dt;
    if (countdown <= 0) {
      state = 'playing';
      toast(mode === 'derby' ? 'MAKE AN IMPACT' : 'GREEN LIGHT', 2);
    }
    return;
  }
  if (state !== 'playing') return;
  elapsed += dt;
  for (const c of cars) {
    c.input = c.id === 0 && !autopilot && !demo ? input() : ai(c, dt);
    c.preStep(dt);
  }
  physics.step(events);
  for (const c of cars) c.postStep(dt, elapsed);
  events.drainContactForceEvents((e) => {
    const h1 = e.collider1(),
      h2 = e.collider2();
    const key = Math.min(h1, h2) + ':' + Math.max(h1, h2);
    if (elapsed - (lastImpact.get(key) ?? -100) < 0.28) return;
    const damage =
      damageFromImpulse(e.totalForceMagnitude() * dt) *
      (mode === 'race' ? 0.45 : 1);
    if (damage < 0.3) return;
    const a = cars.find(
        (c) => c.collider.handle === h1 || c.roof.handle === h1,
      ),
      b = cars.find((c) => c.collider.handle === h2 || c.roof.handle === h2);
    if (!a && !b) return;
    lastImpact.set(key, elapsed);
    collisions++;
    const point = new T.Vector3().copy((a ?? b)!.current);
    const co1 = physics.getCollider(h1),
      co2 = physics.getCollider(h2);
    if (co1 && co2)
      physics.contactPair(co1, co2, (m) => {
        if (m.numSolverContacts() > 0) point.copy(m.solverContactPoint(0));
      });
    const va = a?.velocity ?? new T.Vector3(),
      vb = b?.velocity ?? new T.Vector3();
    if (a) {
      a.hit(point, vb.clone().sub(va).normalize(), damage, elapsed);
      if (b) b.inflicted += damage;
    }
    if (b) {
      b.hit(point, va.clone().sub(vb).normalize(), damage, elapsed);
      if (a) a.inflicted += damage;
    }
    sound.impact(damage, point, !!(a?.impactEffects.glass || b?.impactEffects.glass), !!(a?.impactEffects.debris || b?.impactEffects.debris));
    if (a?.id === 0 || b?.id === 0)
      toast(damage > 12 ? 'HEAVY IMPACT' : 'CONTACT', 0.8);
  });
  for (const c of cars) {
    if (Math.hypot(c.current.x, c.current.z) > 255 || c.current.y < -8) {
      if (c.id === 0 && !demo) recover();
      else c.place(0, 0, 0);
    }
    if (mode === 'race' && !c.finished) {
      const check = advanceCheckpoint(
        c.current.x,
        c.current.z,
        c.nextCheckpoint,
        c.checkpointDistance,
      );
      c.checkpointDistance = check.distance;
      if (check.passed) {
        c.passed++;
        c.nextCheckpoint = (c.nextCheckpoint + 1) % 24;
        c.checkpointDistance = Infinity;
        if (c.nextCheckpoint === 1) {
          c.lap++;
          if (c.lap > 3) {
            c.finished = true;
            c.finishTime = elapsed + c.penalty;
            if (c.id === 0 && !demo) finish('FINISH LINE');
          }
        }
      }
    }
  }
  if (!demo && mode === 'race' && cars[0].health <= 0) finish('RETIRED · DAMAGE');
  if (mode === 'derby') {
    const alive = cars.filter((c) => c.health > 0);
    if (!demo && cars[0].health <= 0) finish('WRECKED OUT');
    else if (alive.length <= 1) finish('LAST CAR STANDING');
    else if (elapsed >= 300) finish('TIME’S UP');
  }
  if(demo&&mode==='race'&&(cars.every(c=>c.finished||c.health<=0)||elapsed>=600))finish('RACE COMPLETE');
  fx.update(dt);
}
function updateCamera(dt: number) {
  const p = demo?(cars.find(c=>c.id===director.followed)??cars[0]):cars[0];
  if (!p) return;
  quarry.sun.position.copy(p.root.position).addScaledVector(DAYLIGHT_DIRECTION, DAYLIGHT_DISTANCE);
  quarry.sun.target.position.copy(p.root.position);
  if(demo){cameraImpactOffset.set(0,0,0);if(state!=='paused')director.update(cars,camera,orbit,dt,mode==='race');return;}
  if (state === 'inspect' || state === 'wrecked' || state === 'paused' && resumeState === 'wrecked') {
    cameraImpactOffset.set(0,0,0);
    orbit.update();
    return;
  }
  if (state === 'menu' || state === 'lobby') {
    cameraImpactOffset.set(0,0,0);
    const a = 1.5 + Math.sin(clock * 0.055) * 0.12;
    const target = p.current.clone().add(new T.Vector3(0, 0.1, 0));
    camera.position.set(
      target.x + Math.sin(a) * 7.7,
      target.y + 1.8,
      target.z + Math.cos(a) * 7.7,
    );
    camera.lookAt(target.x - 2.15, target.y + 0.12, target.z);
    return;
  }
  const f = new T.Vector3(0, 0, 1).applyQuaternion(p.root.quaternion);
  f.y = 0;
  f.normalize();
  const target = p.root.position.clone();
  const desired = hood
    ? target
        .clone()
        .addScaledVector(f, 1.35)
        .add(new T.Vector3(0, 0.58, 0))
    : target
        .clone()
        .addScaledVector(f, -7.4 - Math.abs(p.speed) * 0.04)
        .add(new T.Vector3(0, 2.65, 0));
  const cameraGround = Math.max(scenerySurfaceHeight(desired.x, desired.z), quarryExtensionHeight(desired.x, desired.z) ?? -Infinity, quarryWestWallHeight(desired.x, desired.z) ?? -Infinity);
  desired.y = Math.max(desired.y, cameraGround + 0.65);
  camera.position.sub(cameraImpactOffset);
  camera.position.lerp(desired, 1 - Math.exp(-dt * (hood ? 25 : 5)));
  const look = target
    .clone()
    .addScaledVector(f, hood ? 22 : 4)
    .add(new T.Vector3(0, 0.5, 0));
  camera.lookAt(look);
  const response = p.impactResponse.step(state === 'playing' ? dt : 0);
  cameraImpactOffset.copy(response.offset).multiplyScalar(hood ? .65 : 1);
  camera.position.add(cameraImpactOffset);
  camera.rotateZ(response.roll * (hood ? .6 : 1));
  camera.rotateX(response.pitch);
  camera.fov = T.MathUtils.damp(
    camera.fov,
    hood ? 66 : 52 + Math.min(8, Math.abs(p.speed) * 0.2),
    3,
    dt,
  );
  camera.updateProjectionMatrix();
}
function frame(now: number) {
  requestAnimationFrame(frame);
  const raw = (now - lastFrame) / 1000;
  const dt = Math.min(0.05, raw);
  lastFrame = now;
  clock += dt;
  if (!physics || state === 'loading') return;
  // Include long stalls in the sustained benchmark, including event restarts.
  if(capturedFrames&&capturedFrames.length<50_000&&Number.isFinite(raw)&&raw>0)capturedFrames.push(raw*1000);
  if (raw < 1) {
    frames.push(raw * 1000);
    if (frames.length > 600) frames.shift();
  }
  if(online?.active) {
    if(state==='playing' && online.network.connected)online.network.setInput(input());else online.network.setInput({throttle:0,steer:0,brake:1,handbrake:false});
    const s=online.network.sample();if(s){online.apply(s,dt);quarry.applyProps(s.props);elapsed=s.elapsed;countdown=s.countdown;}
    accumulator+=dt;let n=0;while(accumulator>=1/60 && n++<4){physics.step();fx.update(1/60);accumulator-=1/60;}
    const net=document.getElementById('network-status');if(net)net.textContent=online.network.connected?`ROOM ${online.network.room} · ${online.network.latency} MS`:online.network.reconnecting?'RECONNECTING · CONTROLS CLEARED':`${online.network.disconnectReason} · ESC TO LEAVE`;
  } else if (['playing', 'countdown'].includes(state)) {
    accumulator += dt;
    let n = 0;
    while (accumulator >= 1 / 60 && n++ < 4) {
      step(1 / 60);
      accumulator -= 1 / 60;
    }
    for (const c of cars) c.render(state === 'wrecked' ? 1 : accumulator / (1 / 60));
  }
  if (state === 'wrecked') {
    fx.update(dt);
    wreckHold = Math.max(0, wreckHold - dt);
    text('wreck-count', String(Math.ceil(wreckHold)));
    if (wreckHold === 0) { createCars(true); menu(); }
  }
  if(demo&&state==='result'){demoRestart=Math.max(0,demoRestart-dt);fx.update(dt);if(demoRestart===0){state='loading';void start(true);}}
  updateCamera(dt);
  for(const car of cars){car.wreckParts.pose(['playing','countdown'].includes(state)?dt:0,car.speed);car.wreckParts.wheelsPose();}
  const effectsActive=['playing','countdown','wrecked'].includes(state)||(demo&&state==='result');
  vehicleFire?.update(cars,effectsActive?dt:0,camera);
  if(effectsActive){sound.update(cars,camera,dt,state==='wrecked');if(vehicleFire)sound.thermal(vehicleFire.audio,vehicleFire.bursts);}
  quarry.update(camera);
  if(mode==='race'&&cars[0]) {
    const p=CHECKPOINTS[cars[0].nextCheckpoint],ahead=CHECKPOINTS[(cars[0].nextCheckpoint+1)%24];
    quarry.checkpoint.position.set(p.x,terrainHeight(p.x,p.z),p.z);
    quarry.checkpoint.rotation.y=Math.atan2(ahead.x-p.x,ahead.z-p.z);
  }
  renderer.info.reset();
  if (staticShadows) {
    for (const car of cars) staticShadows.bindReceivers(car.root);
    staticShadows.prepare(renderer);
  }
  if (cars[0]) reflections.update(cars[0].root);
  renderer.shadowMap.needsUpdate = true;
  composer.render();
  hudTime += dt;
  if (hudTime > 0.12) {
    hudTime = 0;
    updateHud();
  }
  if (
    benchmarkStart &&
    now - benchmarkStart > (benchmarkSamples.length + 1) * 10000
  ) {
    benchmarkSamples.push({
      time: (now - benchmarkStart) / 1000,
      fps: 1000 / (frames.reduce((a, b) => a + b, 0) / frames.length),
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
      heap: (performance as any).memory?.usedJSHeapSize ?? 0,
    });
  }
}
addEventListener('keydown', (e) => {
  if(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement)return;
  if(state==='lobby')return;
  if (
    ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
      e.code,
    )
  )
    e.preventDefault();
  if (e.repeat) return;
  if (e.code === 'Escape') {
    state === 'paused' || state === 'inspect' ? resume() : pause();
    return;
  }
  if (e.code === 'KeyF') fullScreen();
  if (e.code === 'KeyM') sound.mute();
  if (demo&&e.code==='Space'){e.preventDefault();state==='paused'?resume():pause();return;}
  if(demo&&(e.code==='BracketLeft'||e.code==='BracketRight'))director.cycleCar(cars,e.code==='BracketLeft'?-1:1);
  if (e.code === 'KeyC') {if(demo)director.cycleView();else hood = !hood;}
  if (!demo && e.code === 'KeyR' && state === 'playing') recover();
  if (!online?.active && e.code === 'KeyT' && mode === 'playground' && state === 'playing') {
    traffic = !traffic;
    start();
  }
  if (!online?.active && e.code === 'KeyI' && mode === 'playground') {
    if (state === 'inspect') resume();
    else if (state === 'playing') {
      state = 'inspect';
      sound.pause(true);
      orbit.enabled = true;
      orbit.target.copy(cars[0].current);
      ui.innerHTML =
        '<div class="inspect-note">DRAG TO ORBIT · SCROLL TO ZOOM · I / ESC TO RETURN</div>';
    }
  }
  if (state === 'playing' || state === 'countdown') keys.add(e.code);
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => {
  keys.clear();online?.network.clearInput();
  if(preparingEvent)preparationInterrupted=true;
  if ((['playing', 'countdown', 'wrecked'].includes(state)||demo&&state==='result')) pause();
});
document.addEventListener('visibilitychange', () => {
  if(document.hidden&&preparingEvent){preparationInterrupted=true;keys.clear();}
  if (document.hidden && (['playing', 'countdown', 'wrecked'].includes(state)||demo&&state==='result')) pause();
});
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  if ((['playing', 'countdown', 'wrecked'].includes(state)||demo&&state==='result')) pause();
  toast('Graphics context lost. Reload to restore.', 20);
});
canvas.addEventListener('webglcontextrestored', () => {
  // Render-target contents are lost with the context, unlike source HDR data.
  if (environmentTarget && scene.background instanceof T.Texture) {
    const generator = new T.PMREMGenerator(renderer);
    try {
      // A fresh PMREMGenerator needs to allocate its own filtering planes.
      // Passing an old target here skips that initialization in Three r181.
      const replacement = generator.fromEquirectangular(scene.background);
      scene.environment = replacement.texture;
      environmentTarget.dispose();
      environmentTarget = replacement;
    } finally {
      generator.dispose();
    }
  }
  reflections.invalidate();
  staticShadows?.invalidate();
  if (quarry) quarry.sun.shadow.needsUpdate = true;
});
async function boot() {
  loading('PREPARING THE QUARRY');
  await R.init();
  physics = new R.World({ x: 0, y: -9.81, z: 0 });
  physics.timestep = 1 / 60;
  events = new R.EventQueue(true);
  fx = new Effects(scene, physics);
  vehicleFire = new VehicleFire(scene,(p,n,type,force)=>fx.emit(p,n,type,force));
  vehicleFire.setQuality(settings.quality);
  quarry = new Quarry(scene, physics);
  online=new OnlineView(scene,physics,fx,sound,()=>cars,next=>{cars=next;});
  onlineUI=new OnlineUI(ui,online.network,{connect:connectOnline,leave:leaveOnline});
  online.network.addEventListener('snapshot',receiveOnline);
  online.network.addEventListener('connected',()=>{const url=new URL(location.href);url.searchParams.set('room',online.network.room);history.replaceState(null,'',url);sound.pause(!['playing','countdown'].includes(state));});
  online.network.addEventListener('error',e=>{const message=(e as CustomEvent<string>).detail;onlineUI.message(message);toast(message,8);});
  online.network.addEventListener('disconnected',e=>{keys.clear();online.network.clearInput();sound.pause(true);onlineUI.message((e as CustomEvent<string>).detail);toast(online.network.reconnecting?'Connection lost · reconnecting':online.network.disconnectReason+' · press Escape to leave',8);});
  const prepared = await Promise.all([
    loadCars(loading),
    environment(renderer, scene),
    prepareArenaFloor(),
    prepareNorthForestFloor(),
    prepareCircuitSurface(),
    quarry.trees(),
    onlineUI.configure(),
  ]);
  environmentTarget = prepared[1];
  staticShadows = new StaticQuarryShadows(scene, new Set<T.Object3D>([
    quarry.derbyWalls, quarry.checkpoint, ...quarry.props.map(prop => prop.mesh),
  ]));
  createCars(true);
  staticShadows.bindReceivers(scene);
  applyQuality();
  loading('WARMING LIGHTING AND REFLECTIONS');
  void sound.preload().catch(()=>{}); // A failed prefetch is retried on Start.
  // Queue programs together instead of waiting for each shader during the first
  // visible frame. Match the composer's offscreen output to avoid extra variants.
  await warmPrograms(true);
  menu();
  if(new URL(location.href).searchParams.has('room'))onlineUI.show();
  (window as any).__quarry = {
    get northForest() { return northForestDiagnostics(camera); },
    get northRidge() { return northRidgeDiagnostics(camera); },
    get cameraPose() { return { position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), target: orbit.target.toArray(), fov: camera.fov, aspect: camera.aspect }; },
    get network(){return {active:online.active,connected:online.network.connected,id:online.network.id,room:online.network.room,snapshot:online.network.snapshot};},
    connectOnline,leaveOnline,
    startOnline:(m:Mode)=>online.network.start(m),
    get state() {
      return state;
    },
    get mode() {
      return mode;
    },
    get cars() {
      return cars.map((c) => ({
        id: c.id,
        kind: c.kind,
        health: c.health,
        speed: c.speed,
        position: c.current.toArray(),
        passed: c.passed,
        lap: c.lap,
        next: c.nextCheckpoint,
        inflicted: c.inflicted,
      }));
    },
    get daylight() {
      return {sunDirection: quarry.sun.position.clone().sub(quarry.sun.target.position).normalize().toArray(), sun: quarry.sun.intensity,
        sunColor: quarry.sun.color.getHex(), sky: scene.environmentIntensity,
        ambient: (scene.children.find(o => o instanceof T.HemisphereLight) as T.HemisphereLight)?.intensity,
        tone: renderer.toneMapping === T.AgXToneMapping ? 'agx' : 'aces',
        backgroundRotation: scene.backgroundRotation.toArray(), environmentRotation: scene.environmentRotation.toArray(),
        fog: (scene.fog as T.FogExp2).density, exposure: renderer.toneMappingExposure,
        nearShadowSize: quarry.sun.shadow.mapSize.toArray(), nearShadowExtent: quarry.sun.shadow.camera.right-quarry.sun.shadow.camera.left,
        staticShadows: staticShadows?.stats};
    },
    get impactState() { const p=cars[0];return p?{offset:{...p.impactResponse.offset},velocity:{...p.impactResponse.velocity},roll:p.impactResponse.roll,pitch:p.impactResponse.pitch,effects:{...p.impactEffects}}:null; },
    get audioState() { return {state:sound.ctx?.state,muted:sound.muted,master:sound.master?.gain.value,voices:sound.activeVoices,buffers:sound.buffers.size,levels:{...sound.levels}}; },
    get fireState() { return vehicleFire?.stats; },
    seedFireTest:(seed:number)=>{
      vehicleFire?.dispose();let randomState=seed>>>0;
      vehicleFire=new VehicleFire(scene,(p,n,t,f)=>fx.emit(p,n,t,f),()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;});
      vehicleFire.setQuality(settings.quality);
    },
    simulateFire:(seconds:number)=>{
      for(let i=0;i<Math.min(60,Math.max(0,seconds))*60;i++){
        vehicleFire?.update(cars,1/60,camera);
        if(vehicleFire?.bursts.length){sound.thermal(vehicleFire.audio,vehicleFire.bursts);return true;}
      }
      return false;
    },
    get fireAudio() { return [...sound.loops].map(([id,loops])=>({id,layers:[...loops].filter(([name])=>name.startsWith('fire-')).map(([name,l])=>({name,level:l.gain.gain.value,position:[l.pan.positionX.value,l.pan.positionY.value,l.pan.positionZ.value]}))})); },
    get stats() {
      const times = [...frames].sort((a, b) => a - b);
      return {
        elapsed,
        collisions,
        drawCalls: renderer.info.render.calls,
        reflectionUpdates: reflections.updates,
        staticShadows: staticShadows?.stats,
        triangles: renderer.info.render.triangles,
        geometry: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        meanMs: frames.reduce((a, b) => a + b, 0) / frames.length,
        p95: times[Math.floor(times.length * 0.95)],
        audio: sound.buffers.size,
        activeParticles: fx.particles.filter(p=>p.life>0).length,
        debris: fx.debris.length,
        voices: sound.activeVoices,
        loops: sound.loops.size,
        thermal: vehicleFire?.stats,
        state,
        benchmarkSamples,
      };
    },
    start: async (m: Mode) => {
      mode = m;
      await start(false);
    },
    startDemo:async(m:Mode='derby')=>{mode=m==='race'?'race':'derby';await start(true);},
    get demo(){return {active:demo,view:director.view,shot:director.activeView,followed:director.followed,manual:director.manual,restart:demoRestart};},
    get aiState(){return [...drivers.memory].map(([id,m])=>({id,...m}));},
    demoCamera:(view:DemoCamera)=>director.select(view),
    followCar:(id:number)=>director.follow(id),
    autopilot: (v: boolean) => {
      autopilot = v;
    },
    resume,
    pause,
    recover,
    menu: () => {
      createCars(true);
      menu();
    },
    setQuality: (v: string) => {
      settings.quality = v;
      applyQuality();
    },
    lighting: (v:{fog?:number;sun?:number;sky?:number;exposure?:number;ambient?:number;tone?:string;staticShadows?:boolean})=>{
      if(v.staticShadows!==undefined && staticShadows)staticShadows.enabled=v.staticShadows;
      if(v.fog!==undefined)(scene.fog as T.FogExp2).density=v.fog;
      if(v.sun!==undefined)quarry.sun.intensity=v.sun;
      if(v.sky!==undefined)scene.environmentIntensity=v.sky;
      if(v.exposure!==undefined)renderer.toneMappingExposure=v.exposure;
      if(v.ambient!==undefined)scene.children.forEach(o=>{if(o instanceof T.HemisphereLight)o.intensity=v.ambient!;});
      if(v.tone)renderer.toneMapping=v.tone==='agx'?T.AgXToneMapping:T.ACESFilmicToneMapping;
      reflections.update(cars[0].root,true);
    },
    benchmark: () => {
      benchmarkStart = performance.now();
      benchmarkSamples.length = 0;
      capturedFrames=[];
    },
    endBenchmark:()=>{const report={samples:[...benchmarkSamples],frames:capturedFrames??[]};benchmarkStart=0;capturedFrames=null;return report;},
    setTime: (v: number) => {
      elapsed = v;
    },
    damage: (id: number, amount: number, side = 'front') => {
      const c = cars[id],
        d = new T.Vector3(
          side === 'left' ? -1 : side === 'right' ? 1 : 0,
          side === 'roof' ? .55 : 0.1,
          side === 'rear' ? -2 : side === 'front' ? 2 : 0,
        ).applyQuaternion(c.currentQ);
      c.hit(
        c.current.clone().add(d),
        d.clone().negate().normalize(),
        amount,
        elapsed,
      );
    },
    teleport: (id: number, x: number, z: number, yaw = 0) =>
      cars[id].place(x, z, yaw),
    input: (value: Input) => {
      cars[0].input = value;
    },
    captureCamera: (p: number[], look: number[]) => {
      state = 'inspect';
      orbit.enabled = false;
      camera.position.fromArray(p);
      orbit.target.fromArray(look);
      document.getElementById('overlay')?.remove();
      camera.lookAt(new T.Vector3().fromArray(look));
    },
    simulate: (seconds: number) => {
      for (let i = 0; i < seconds * 60; i++) step(1 / 60);
      updateHud();
    },
    checkpoint: (id: number) => {
      const c = cars[id],
        p = CHECKPOINTS[c.nextCheckpoint];
      c.place(p.x, p.z, 0);
    },
    mute: () => sound.mute(),
    inspect: () =>
      cars.map((c) => ({
        id: c.id,
        panels: c.panels.length,
        burn: c.wreckFinish.soot.value,
        loose: c.wreckParts.assemblies.filter(a=>a.loose>0&&a.members.some(p=>p.mesh.visible)).map(a=>({name:a.name,loose:a.loose})),
        wheelDamage: Array.from(c.wreckParts.wheelDamage),
        detached: c.panels.filter((p) => !p.visible).length,
        glass: c.glass.filter((p) => !p.visible).length,
        position: c.current.toArray(),
        steer: c.steering,
        forward: c.forward.toArray(),
        health: c.health,
      })),
    velocity: (id: number, x: number, y: number, z: number) =>
      cars[id].body.setLinvel({ x, y, z }, true),
    setHealth: (id: number, h: number) => {
      cars[id].health = h;
    },
    keyboardInput: () => input(),
    clearTestInput: () => { testInput = null; },
    setInput: (v: Input) => {
      testInput = v;
    },
    get result() {
      return resultTitle;
    },
  };
}
async function warmPrograms(includeStatic=false) {
  const previousTarget=renderer.getRenderTarget();
  renderer.setRenderTarget(composer.readBuffer);
  try {
    const pending=[renderer.compileAsync(scene,camera)];
    if(includeStatic&&staticShadows)pending.push(renderer.compileAsync(staticShadows.casterScene,staticShadows.camera));
    await Promise.all(pending);
  } finally { renderer.setRenderTarget(previousTarget); }
}
requestAnimationFrame(frame);
boot().catch((e) => {
  console.error(e);
  loading('COULD NOT LOAD — ' + String(e));
});
