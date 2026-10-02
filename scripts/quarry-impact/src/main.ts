import {engineStatus} from './engine-condition';
import {drivingObstacleClearance} from './driving-probe';
import {vehicleContact} from './vehicle-contact';
import {CAR_KINDS} from './rules';
import {DEMO_KEY,readDemoOptions,showDemoSetup,nextDemoMode,demoCarKind} from './demo-session';
import {restoreOnlineProgress,onlineEventLabel} from './online-events';
import type {OnlineSelection} from './online-livery';
import {copyOnlineSetup} from './online-setup';
import {frameGarage} from './garage-camera';
import type {LiveryFace} from './livery';
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
import {prepareReferenceFloor} from './scenery-reference-floor';
import {CHASE_VIEW,chaseComposition,QUARRY_DAYLIGHT} from './quarry-art-direction';
import {drawInstruments} from './instruments';
import {drawQuarryMap} from './quarry-minimap';
import { prepareCircuitSurface } from './scenery-circuit-material';
import { Quarry } from './world';
import { Vehicle, type Input } from './vehicle';
import { Effects } from './effects';
import { VehicleFire } from './vehicle-fire';
import {PuddleSplashes} from './puddle-splashes';
import {DERBY_ARENA} from './derby-arena';
import {structuralDamage,impactAudioSeverity} from './bodywork-response';
import {VehicleThermalState} from './vehicle-thermal-state';
import {unitNoise} from './vehicle-fire-profile';
import {DrivingBrain} from './driving-brain';
import {cameraObstruction} from './demo-camera-visibility';
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
  terrainHeight,
  type Mode,
  type CarKind,
} from './rules';
import { GARAGE_KEY, readGarage, type Setup } from './garage';
import { showGarage } from './garage-ui';
import { SessionTelemetry } from './session-telemetry';
import { CHALLENGES, challengeValue, formatChallengeValue, type Challenge } from './challenges';
import { PROFILE_KEY, readProfile, settleRun, type Award } from './progression';
import { showDriverProfile, awardText, MEDALS } from './profile-ui';
import {EVENT_KEY,readEventOptions,circuitRoute,raceGridSlot,derbyGridSlot,checkRoute,lapProgress,CombatScoreboard,eventDerbyOrder,stepScoreRespawns} from './event-rules';
import {showEventSetup} from './event-ui';
import {ReplayRecorder,readReplayFile,type ReplayDocument} from './replay-data';
import {ReplayScene,captureReplayFrame} from './replay-scene';
import {ReplayStudio} from './replay-studio';
import {showReplayLibrary} from './replay-library-ui';
import {WaypointRace,WAYPOINTS} from './waypoint-race';
import {WaypointMarkers} from './waypoint-markers';
import {directionForCar,RACE_NAMES} from './event-rules';
import {CONTROLS_KEY,readControls,drivingInput,keyLabel} from './driving-controls';
import {mountDrivingControls} from './driving-controls-ui';
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
  performance: saved.performance === true,
  engine: saved.engine ?? 0.72,
  effects: saved.effects ?? 0.8,
  ambience: saved.ambience ?? 0.45,
};
let drivingControls=readControls();
try{drivingControls=readControls(localStorage.getItem(CONTROLS_KEY));}catch{}
let garage=readGarage();
try { garage=readGarage(localStorage.getItem(GARAGE_KEY)); } catch {}
let garageFace:LiveryFace='right';
let garageOpen=false,profileOpen=false,eventSetupOpen=false;
let eventOptions=readEventOptions();
try{eventOptions=readEventOptions(localStorage.getItem(EVENT_KEY));}catch{}
const combat=new CombatScoreboard();
const eventFrameTimes:number[]=[];
const customEvent=()=>!activeChallenge&&!online?.active;
let waypointRace:WaypointRace|null=null,waypointMarkers:WaypointMarkers|undefined;
const onlineRules=()=>online?.active?online.network.snapshot?.event?.rules:undefined;
const raceFormat=()=>onlineRules()?.race??(customEvent()?eventOptions.race:'laps');
const raceDirection=(id=0)=>directionForCar(raceFormat()==='laps'?(onlineRules()?.direction??(customEvent()?eventOptions.direction:'forward')):'forward',id);
const raceRoute=(id=0)=>waypointRace?.get(id).nav?.route??circuitRoute(raceDirection(id));
const scoreDerby=()=>mode==='derby'&&(online?.active?onlineRules()?.derby==='score':customEvent()&&eventOptions.derby==='score');
const derbyRanking=()=>online?.active?online.network.snapshot!.ranking.map(id=>cars.find(c=>c.id===id)!):eventDerbyOrder(cars,scoreDerby(),combat);
const eventDuration=()=>activeChallenge?.limit??(demo?demoOptions.duration:online?.active?onlineRules()?.duration??300:eventOptions.duration);
function openEventSetup(){eventSetupOpen=true;keys.clear();showEventSetup(ui,eventOptions,()=>{eventSetupOpen=false;menu();},()=>{try{localStorage.setItem(EVENT_KEY,JSON.stringify(eventOptions));return true;}catch{return false;}});}
let profile=readProfile();
try{profile=readProfile(localStorage.getItem(PROFILE_KEY));}catch{}
let profileStorageWarning='';
let activeChallenge:Challenge|undefined;
let telemetry:SessionTelemetry|null=null,runId='',runSettled=true,lastAward:Award|null=null;
const raceLaps=()=>online?.active?onlineRules()?.laps??3:activeChallenge?.laps??(demo?demoOptions.laps:eventOptions.laps);
function bankRun(completed:boolean){
  if(!telemetry||runSettled||demo||online?.active)return;
  runSettled=true;
  const run=telemetry.stats;run.completed=completed;
  lastAward=settleRun(profile,runId,run,activeChallenge);
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));profileStorageWarning='';}catch{profileStorageWarning='Progress is available for this session, but browser storage could not save it.';}
}
function openProfile(){
  profileOpen=true;keys.clear();
  showDriverProfile(ui,profile,{close:()=>{profileOpen=false;menu();},start:challenge=>{profileOpen=false;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void start(false);}},profileStorageWarning);
}
let recorder:ReplayRecorder|null=null,lastReplay:ReplayDocument|null=null,replayEpochs:number[]=[];
let closeReplayLibrary:(()=>void)|null=null;
let studio:ReplayStudio|null=null,studioRestore:(()=>void)|null=null;
function captureReplay(force=false){if(recorder&&!studio&&!online?.active)recorder.capture(elapsed,()=>captureReplayFrame(cars,quarry.props,replayEpochs),force);}
function archiveReplay(){
  if(!recorder)return;captureReplay(true);if(recorder.frames.length>1)lastReplay=recorder.document();
  for(const car of cars)car.onVisualEvent=undefined;recorder=null;
}
function beginReplay(){
  lastReplay=null;replayEpochs=cars.map(()=>0);
  recorder=new ReplayRecorder({version:1,mode,reverse:mode==='race'&&customEvent()&&eventOptions.direction==='reverse',cars:cars.map(c=>({id:c.id,kind:c.kind,setup:{...structuredClone(c.setup),paint:c.paintColor.getHex()}})),props:quarry.props.length,created:new Date().toISOString()});
  cars.forEach((car,i)=>car.onVisualEvent=e=>{if(e.kind==='jump'||e.kind==='repair')replayEpochs[i]++;recorder?.event(i,elapsed,e);});
  cars.forEach(c=>c.render(1));captureReplay(true);
}
function closeStudio(){const restore=studioRestore;studio=null;studioRestore=null;restore?.();}
function openStudio(photo=false,document?:ReplayDocument,savedName?:string){
  if(studio||online?.active||preparingEvent)return;
  captureReplay(true);const doc=photo?null:document??recorder?.document()??lastReplay;
  if(!photo&&(!doc||doc.frames.length<2))return;
  if(doc&&doc.meta.props!==quarry.props.length)throw Error('This replay uses a different quarry layout.');
  const returnState=state,returnMode=mode,oldCars=cars,oldNodes=Array.from(ui.childNodes);
  const savedCamera={p:camera.position.clone(),q:camera.quaternion.clone(),fov:camera.fov,exposure:renderer.toneMappingExposure,target:orbit.target.clone(),enabled:orbit.enabled,pan:orbit.enablePan,max:orbit.maxDistance,min:orbit.minDistance};
  const hidden:Array<[T.Object3D,boolean]>=[];const view=doc?new ReplayScene(doc,scene,physics,quarry.props):null;
  const hide=(o:T.Object3D|undefined)=>{if(o){hidden.push([o,o.visible]);o.visible=false;}};
  keys.clear();sound.pause(true);state='studio';
  if(doc){
    for(const car of oldCars)hide(car.root);for(const prop of quarry.props)hide(prop.mesh);
    for(const o of [fx.points,fx.marks,...fx.debris.map(d=>d.mesh),vehicleFire?.mesh,...(vehicleFire?.lights??[]),puddleSplashes?.spray,puddleSplashes?.rings])hide(o);
    // Ground evidence belongs to the live run, not the replay timeline.
    hide(fx.evidence.mesh);
    cars=view!.cars;mode=doc.meta.mode;quarry.setMode(mode,false);view!.props.forEach(p=>staticShadows?.bindReceivers(p));
  }
  hide(quarry.checkpoint);
  studioRestore=()=>{view?.dispose();cars=oldCars;mode=returnMode;hidden.forEach(([o,v])=>o.visible=v);setQuarryMode();ui.replaceChildren(...oldNodes);if(closeReplayLibrary)ui.querySelector<HTMLInputElement>('#library-search')?.focus();state=returnState;camera.position.copy(savedCamera.p);camera.quaternion.copy(savedCamera.q);camera.fov=savedCamera.fov;camera.updateProjectionMatrix();renderer.toneMappingExposure=savedCamera.exposure;orbit.target.copy(savedCamera.target);orbit.enabled=savedCamera.enabled;orbit.enablePan=savedCamera.pan;orbit.maxDistance=savedCamera.max;orbit.minDistance=savedCamera.min;lastFrame=performance.now();accumulator=0;sound.pause(!['playing','countdown','menu'].includes(returnState));};
  studio=new ReplayStudio(ui,cars,doc,time=>view?.seek(time),closeStudio,savedCamera.exposure,savedName);
}
function studioButtons(container:Element|null){
  if(!container||online?.active)return;
  const photo=document.createElement('button');photo.className='small-button studio-link';photo.id='photo-mode';photo.textContent='PHOTO MODE';photo.onclick=()=>openStudio(true);container.append(photo);
  const replay=document.createElement('button');replay.className='small-button studio-link';replay.id='replay-mode';replay.textContent='WATCH REPLAY';replay.disabled=(recorder?.frames.length??lastReplay?.frames.length??0)<2;replay.onclick=()=>openStudio();container.append(replay);
}
function replayMenu(){
  const footer=ui.querySelector('.footer>div');if(!footer)return;
  const library=document.createElement('button');library.id='replay-library-open';library.textContent='REPLAY LIBRARY';library.onclick=()=>{if(closeReplayLibrary)return;keys.clear();closeReplayLibrary=showReplayLibrary(ui,(doc,name)=>{openStudio(false,doc,name);lastReplay=doc;watch.disabled=false;},()=>{closeReplayLibrary=null;library.focus();});};footer.prepend(library);
  const watch=document.createElement('button');watch.id='replay-last';watch.textContent='LAST REPLAY';watch.disabled=!lastReplay;watch.onclick=()=>openStudio();footer.prepend(watch);
  const load=document.createElement('button');load.id='replay-open';load.textContent='OPEN REPLAY';footer.prepend(load);
  load.onclick=()=>{const input=document.createElement('input');input.type='file';input.accept='.qir';input.hidden=true;input.id='replay-file';ui.append(input);input.oncancel=()=>input.remove();input.onchange=async()=>{const file=input.files?.[0];if(!file)return;load.disabled=true;load.textContent='OPENING…';try{const doc=await readReplayFile(file);openStudio(false,doc);lastReplay=doc;watch.disabled=false;}catch(error){let note=ui.querySelector('#replay-message');if(!note){note=document.createElement('p');note.id='replay-message';note.className='last-award';ui.querySelector('.intro')?.append(note);}note.textContent=error instanceof Error?error.message:'Replay could not be opened.';}finally{load.disabled=false;load.textContent='OPEN REPLAY';input.remove();}};input.click();};
}
const cameraImpactOffset = new T.Vector3();
const sound = new Sound();
let vehicleFire:VehicleFire | undefined;
let puddleSplashes:PuddleSplashes|undefined;
const drivers=new DrivingBrain(DERBY_ARENA),director=new DemoDirector(DERBY_ARENA,(from,to,car)=>cameraObstruction(physics,from,to,car.body,true));
let demo=false,demoRestart=0,demoHudHidden=false;
let demoOptions=readDemoOptions();try{demoOptions=readDemoOptions(localStorage.getItem(DEMO_KEY));}catch{}
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
    | 'inspect'
    | 'studio' = 'loading';
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
renderer.toneMappingExposure = QUARRY_DAYLIGHT.exposure;
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
function setQuarryMode(){quarry.setMode(mode,!!online?.active);}
function openGarage() {
  garageOpen=true;garageFace='right';keys.clear();
  showGarage(ui,kind,garage.cars[kind],{
    preview:(setup:Setup)=>{cars[0]?.setPaint(setup.paint,setup.trim);cars[0]?.livery.set(setup.livery);},
    view:face=>{garageFace=face;},
    save:car=>{garage.cars[kind]=car;try{localStorage.setItem(GARAGE_KEY,JSON.stringify(garage));return true;}catch{return false;}},
    close:()=>{garageOpen=false;createCars(true);menu();},
  });
}
function menu() {
  archiveReplay();bankRun(false);telemetry=null;activeChallenge=undefined;
  garageOpen=false;profileOpen=false;eventSetupOpen=false;
  demo=false;demoRestart=0;demoHudHidden=false;ui.classList.remove('demo-clean');director.reset();orbit.maxDistance=22;orbit.enablePan=true;
  if (online?.active) online.disconnect();
  state = 'menu';
  wreckHold = 0;
  keys.clear(); testInput = null;
  orbit.enabled = false;
  sound.pause(false);
  setQuarryMode();
  ui.innerHTML = `<div class="menu"><div class="topbar"><div class="brand"><i></i> BLACKRIDGE MOTOR CLUB</div><div class="location">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / &nbsp; DRY TRACK</div></div><div class="intro"><div class="eyebrow">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving ground.<br>Take the long way home — if it still runs.</p><div class="car-picker">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button data-car="${k}" class="${k === kind ? 'active' : ''}">${DEFINITIONS[k].name}</button>`).join('')}</div><div class="spec">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div class="menu-bottom">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class="mode-card ${m === mode ? 'active' : ''}" data-mode="${m}"><span class="number">0${i + 1} / ${m === 'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : 'EXPLORATION'}</span><strong>${modes[m].label}</strong><small>${m==='race'?`${RACE_NAMES[eventOptions.race]} · ${eventOptions.laps} ${eventOptions.race==='laps'?(eventOptions.laps===1?'lap':'laps')+' · '+eventOptions.direction:eventOptions.laps===1?'round':'rounds'} · ${eventOptions.field} cars`:m==='derby'?`${eventOptions.derby==='score'?'Score derby · respawns':'Last car standing'} · ${eventOptions.field} cars`:modes[m].description}</small></button>`).join('')}<button class="primary" id="start">${modes[mode].button}<span>↗</span></button></div><div class="footer"><span>${CAR_KINDS.length} MACHINES &nbsp; · &nbsp; ONE QUARRY &nbsp; · &nbsp; NO PRISTINE FINISHES</span><div><a href="./licenses/CREDITS.md" target="_blank" rel="noopener">CREDITS</a><button id="settings">SETTINGS</button><button id="fullscreen">FULLSCREEN ↗</button></div></div></div>`;
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
  replayMenu();
  const garageButton=document.createElement('button');garageButton.id='garage';garageButton.className='small-button';garageButton.textContent='GARAGE & TUNING';garageButton.onclick=openGarage;ui.querySelector('.intro')!.append(garageButton);
  const profileButton=document.createElement('button');profileButton.id='driver-profile';profileButton.className='small-button';profileButton.textContent='DRIVER PROFILE & CHALLENGES';profileButton.onclick=openProfile;ui.querySelector('.intro')!.append(profileButton);
  if(lastAward?.qualified){const note=document.createElement('p');note.className='last-award';note.textContent=awardText(lastAward);ui.querySelector('.intro')!.append(note);}
  const eventButton=document.createElement('button');eventButton.id='event-setup';eventButton.className='small-button';eventButton.textContent=`EVENT RULES · ${eventOptions.field} CARS`;eventButton.onclick=openEventSetup;ui.querySelector('.intro')!.append(eventButton);
  const watch=document.createElement('button');watch.id='watch-demo';watch.className='small-button';watch.textContent='WATCH DEMO ▷';
  watch.onclick=()=>{if(mode==='playground')mode='derby';void start(true);};
  ui.querySelector('.intro')!.append(watch);
  const demoSetup=document.createElement('button');demoSetup.className='small-button';demoSetup.id='demo-options';demoSetup.textContent='DEMO OPTIONS';demoSetup.onclick=()=>{eventSetupOpen=true;showDemoSetup(ui,demoOptions,kind,value=>{try{localStorage.setItem(DEMO_KEY,JSON.stringify(value));return true;}catch{return false;}},()=>{eventSetupOpen=false;},()=>{if(mode==='playground')mode='derby';void start(true);});};ui.querySelector('.intro')!.append(demoSetup);
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
async function connectOnline(endpoint:string,room:string,name:string,loadout?:OnlineSelection) {
  archiveReplay();waypointRace=null;bankRun(false);telemetry=null;activeChallenge=undefined;lastAward=null;
  demo=false;
  await sound.init();online.reset();online.active=true;onlinePhase='';
  try {online.network.connect({endpoint,room,name,kind:loadout?.kind??kind,setup:loadout?.setup??copyOnlineSetup(garage.cars[kind].setup),livery:loadout?.livery??garage.cars[loadout?.kind??kind].setup.livery});}catch(error){online.active=false;throw error;}
}
function receiveOnline() {
  const s=online.network.snapshot;if(!online.active||!s)return;
  online.receive(s);elapsed=s.elapsed;countdown=s.countdown;mode=s.mode;
  waypointRace=s.event?.waypoints?new WaypointRace(s.event.rules.race as 'ordered'|'free'|'random',s.event.rules.laps,s.event.seed):null;
  if(s.event)restoreOnlineProgress(s.event,waypointRace,combat);else combat.reset();
  const changed=onlinePhase!==s.phase;onlinePhase=s.phase;
  if(s.phase==='lobby') {
    state='lobby';orbit.enabled=false;onlineUI.lobby(s,changed);return;
  }
  kind=cars[0].kind;setQuarryMode();
  if(changed) {
    if(s.phase==='result') {
      finish(s.ranking[0]===online.network.id?'EVENT WINNER':mode==='race'?'RACE COMPLETE':'DERBY COMPLETE');
    }else if(state==='paused') resumeState=s.phase;
    else {state=s.phase;orbit.enabled=false;hud();sound.pause(false);}
  }
  if(s.phase==='result') {
    onlineUI.results(s);
  }
}
function createCars(attract = false) {
  archiveReplay();bankRun(false);
  drivers.reset();combat.reset();waypointRace=!attract&&mode==='race'&&raceFormat()!=='laps'?new WaypointRace(raceFormat() as 'ordered'|'free'|'random',raceLaps(),Math.floor(Math.random()*0xffffffff)):null;
  sound.clearCars();
  vehicleFire?.reset();
  puddleSplashes?.reset();
  for (const c of cars) c.dispose();
  cars = [];
  fx.reset();
  quarry.resetProps();
  lastImpact.clear();
  collisions = 0;
  const count = attract ? 1 : mode === 'playground' ? ((activeChallenge?activeChallenge.traffic:traffic) ? 5 : 1) : activeChallenge?8:demo?demoOptions.field:eventOptions.field;
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
      demo&&!attract?demoCarKind(i,kind,demoOptions.lineup):i === 0 ? kind : activeChallenge?(['coupe','sedan','hatch']as CarKind[])[i%3]:CAR_KINDS[i%CAR_KINDS.length];
    const setup=i===0 && (attract || !demo) && !activeChallenge ? garage.cars[type].setup : undefined;
    const car = new Vehicle(i, type, setup?.paint ?? colors[i%colors.length], scene, physics, fx, setup);
    car.waters=quarry.puddles;
    if(mode==='derby'&&!online?.active)car.arenaSurface=DERBY_ARENA;
    cars.push(car);
    if (attract) car.place(0, -13, 0.65);
    else if (mode === 'derby') {
      const spawn=derbyGridSlot(i,count,DERBY_ARENA);
      car.place(spawn.x,spawn.z,spawn.yaw);
    } else if (mode === 'race') {
      const spawn=raceGridSlot(i,customEvent()&&raceFormat()==='laps'?eventOptions.direction:'forward');
      car.place(spawn.x,spawn.z,spawn.yaw);
      car.nextCheckpoint=spawn.next;car.passed=waypointRace?0:spawn.passed;
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
  if(preparingEvent)return;
  bankRun(false);telemetry=null;
  if(watch)activeChallenge=undefined;
  demo=watch;demoRestart=0;director.reset();if(watch)director.select(demoOptions.camera);keys.clear();testInput=null;
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
  setQuarryMode();
  createCars();
  for(const car of cars)staticShadows?.bindReceivers(car.root);
  await warmPrograms();
  elapsed = 0;eventFrameTimes.length=0;
  countdown = mode === 'playground' ? 0 : 3.5;
  accumulator = 0;
  state = countdown ? 'countdown' : 'playing';
  orbit.enabled = false;
  setQuarryMode();
  cameraImpactOffset.set(0,0,0);
  camera.position.copy(cars[0].current).add(new T.Vector3(0, 4, -8));
  hud();
  sound.pause(false);
  telemetry=watch?null:new SessionTelemetry();runId=crypto.randomUUID();runSettled=false;lastAward=null;
  beginReplay();
  preparingEvent=false;
  if(preparationInterrupted||document.hidden)pause();
}
function hud() {
  ui.innerHTML = `<div class="hud"><div class="hud-top"><div><div class="eyebrow">BLACKRIDGE / ${mode === 'race' ? 'CIRCUIT 01' : 'QUARRY FLOOR'}</div><div class="hud-title">${modes[mode].label}</div></div><div class="event-stats"><div><span id="event-label">${mode === 'derby' ? 'REMAINING' : mode === 'race' ? 'POSITION' : 'FREE DRIVE'}</span><strong id="event-value">${cars.length} / ${cars.length}</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? 'TIME LEFT' : 'SESSION'}</span><strong id="time-value">05:00</strong></div><button class="small-button" id="pause">Ⅱ</button></div></div><canvas class="minimap" id="map" width="400" height="400"></canvas><div class="status"><div class="status-row"><span>${DEFINITIONS[kind].name}</span><b id="health">100%</b></div><div class="condition"><b id="health-bar" style="width:100%"></b></div><div class="subsystems"><span id="engine-status">ENGINE OK</span><span id="steer-status">STEERING OK</span><span id="surface">GRAVEL</span></div></div><div class="speed"><strong id="speed">0</strong> <span>KM/H</span><small id="gear">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class="rpm"><b id="rpm-bar"></b></div></div><div class="controls"><kbd>${['throttle','reverse','left','right'].map(a=>keyLabel(drivingControls.keys[a as 'throttle'][0])).join(' ')}</kbd> DRIVE <kbd>${keyLabel(drivingControls.keys.handbrake[0])}</kbd> HANDBRAKE <kbd>C</kbd> CAMERA <kbd>R</kbd> RECOVER ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT <kbd>T</kbd> TRAFFIC' : ''}</div><div class="center-message" id="countdown"></div><div id="toast"></div></div>`;
  document.querySelector<HTMLButtonElement>('#pause')!.onclick = () => pause();
  const instruments=document.createElement('canvas');instruments.id='instruments';instruments.width=400;instruments.height=450;instruments.className='instruments';ui.querySelector('.hud')!.append(instruments);
  if(scoreDerby())ui.querySelector('.hud-title')!.textContent='SCORE DERBY';
  if(mode==='race'&&customEvent())ui.querySelector('.hud-title')!.textContent=waypointRace?RACE_NAMES[eventOptions.race].toUpperCase():`QUARRY CIRCUIT · ${eventOptions.direction.toUpperCase()}`;
  if(onlineRules())ui.querySelector('.hud-title')!.textContent=onlineEventLabel(mode,onlineRules()!).toUpperCase();
  if(waypointRace)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="waypoint-status" id="waypoint-status"></div>');
  if(settings.performance)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="performance-readout" id="performance-readout"></div>');
  if(activeChallenge){ui.querySelector('.hud-title')!.textContent=activeChallenge.title.toUpperCase();ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="challenge-live"><strong id="challenge-score"></strong><span id="challenge-target"></span></div>');}
  if(demo)demoHud();
  if(online?.active)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="network-status" id="network-status"></div>');
}
function demoHud(){
  ui.querySelector('.hud-title')!.textContent='LIVE DEMO / '+modes[mode].label;
  ui.querySelector('.controls')!.innerHTML='<kbd>C</kbd> CAMERA <kbd>[</kbd><kbd>]</kbd> CAR <kbd>SPACE</kbd> PAUSE · FREE ORBIT: DRAG / SCROLL';
  ui.querySelector('.status-row > span')!.id='follow-name';
  ui.querySelector('.hud')!.insertAdjacentHTML('beforeend',`<div class="demo-toolbar"><label>VIEW<select id="demo-camera">${Object.entries(DEMO_CAMERAS).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label>FOLLOW<select id="demo-car"><option value="auto">Director chooses</option>${cars.map(c=>`<option value="${c.id}">#${c.id+1} ${DEFINITIONS[c.kind].name}</option>`).join('')}</select></label><label>EVENT<select id="demo-event"><option value="derby">Demolition derby</option><option value="race">Quarry circuit</option></select></label><button class="small-button" id="demo-next">NEXT EVENT</button><button class="small-button" id="demo-hide">HIDE HUD · H</button><button class="small-button" id="demo-exit">EXIT DEMO</button></div>`);
  const view=document.querySelector<HTMLSelectElement>('#demo-camera')!;view.value=director.view;view.onchange=()=>director.select(view.value as DemoCamera);
  const follow=document.querySelector<HTMLSelectElement>('#demo-car')!;follow.onchange=()=>{if(follow.value==='auto'){director.manual=false;director.select('director');view.value='director';}else director.follow(+follow.value);};
  const event=document.querySelector<HTMLSelectElement>('#demo-event')!;event.value=mode;event.onchange=()=>{mode=event.value as Mode;void start(true);};
  document.querySelector<HTMLButtonElement>('#demo-next')!.onclick=()=>{mode=mode==='race'?'derby':'race';void start(true);};
  document.querySelector<HTMLButtonElement>('#demo-hide')!.onclick=()=>{demoHudHidden=!demoHudHidden;ui.classList.toggle('demo-clean',demoHudHidden);};
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
  const instruments=document.querySelector<HTMLCanvasElement>('#instruments');if(instruments)drawInstruments(instruments,player.speed,player.rpm,player.gear,player.health);
  text(
    'gear',
    `GEAR ${player.gear === 0 ? 'R' : player.gear}  /  ${Math.round(player.rpm)} RPM`,
  );
  document.getElementById('rpm-bar')!.style.width =
    clamp((player.rpm / 7000) * 100, 0, 100) + '%';
  text('surface', player.surface.toUpperCase());
  text('engine-status', engineStatus(player.health,player.engineDamage));
  text(
    'steer-status',
    Math.abs(player.damageLeft - player.damageRight) > 16
      ? 'STEERING PULL'
      : 'STEERING OK',
  );
  if(demo&&mode==='race')for(const car of cars){const option=ui.querySelector<HTMLOptionElement>(`#demo-car option[value="${car.id}"]`);if(option)option.textContent=`#${car.id+1} ${DEFINITIONS[car.kind].name} · ${car.finished?'FINISHED':car.health<=0?'RETIRED':waypointRace?'STATIONS '+car.passed+'/'+raceLaps()*6:'LAP '+Math.min(raceLaps(),car.lap)+'/'+raceLaps()}`;}
  const remaining = Math.max(0, eventDuration() - elapsed);
  if(settings.performance&&eventFrameTimes.length){const sample=eventFrameTimes.slice(-300).sort((a,b)=>a-b),mean=sample.reduce((a,b)=>a+b,0)/sample.length;text('performance-readout',`${cars.length} CARS · ${Math.round(1000/mean)} FPS · P95 ${Math.round(sample[Math.floor((sample.length-1)*.95)])} ms`);}
  if(scoreDerby()){text('event-label','SCORE / POSITION');const respawn=combat.get(player.id).respawnAt;if(player.health<=0&&respawn>0)toast(elapsed<respawn?`WRECKED · RESPAWN IN ${Math.ceil(respawn-elapsed)}s`:'WAITING FOR A CLEAR SPAWN',.4);}
  if(activeChallenge&&telemetry){text('challenge-score',formatChallengeValue(activeChallenge,challengeValue(activeChallenge,telemetry.stats)));text('challenge-target',`BRONZE ${formatChallengeValue(activeChallenge,activeChallenge.medals[0])} · ${Math.ceil(remaining)}s LEFT · STOCK CAR / NO RECOVERY`);}
  text(
    'time-value',
    mode === 'derby'
      ? formatTime(remaining)
      : mode === 'race'
        ? player.finished?`FINISHED · ${formatTime(player.finishTime)}`:`${waypointRace?'ROUND ':''}${Math.min(raceLaps(), player.lap)} / ${raceLaps()} · ${formatTime(elapsed + player.penalty)}`
        : formatTime(elapsed),
  );
  text(
    'event-value',
    mode === 'derby'
      ? scoreDerby()?`${combat.points(player.id)} PTS · #${derbyRanking().indexOf(player)+1}`:cars.filter((c) => c.health > 0).length + ' / '+cars.length
      : mode === 'race'
        ? `${online?.active?(online.network.snapshot?.ranking.indexOf(online.network.id)??0)+1:rankRace().indexOf(player) + 1} / ${cars.length}`
        : traffic
          ? 'TRAFFIC ON'
          : 'SOLO',
  );
  document.getElementById('countdown')!.innerHTML =
    state === 'countdown'
      ? `<strong>${Math.ceil(countdown)}</strong><p>${mode === 'derby' ? 'SURVIVE THE IMPACT' : 'FIND YOUR LINE'}</p>`
      : demo&&state==='result'?`<p>${resultTitle}</p><p>${Number.isFinite(demoRestart)?'NEXT EVENT IN '+Math.ceil(demoRestart):'EVENT COMPLETE · CHOOSE NEXT EVENT OR EXIT'}</p>`:'';
  if (!demo&&player.rollTime > 2) toast('OVERTURNED — PRESS R TO RECOVER', 1);
  if(waypointRace){const progress=waypointRace.get(player.id),available=waypointRace.available(player.id);text('waypoint-status',progress.finished?'WAYPOINT RUN FINISHED':`STATIONS ${progress.visited.size} / 5 · ${available.length>1?'CHOOSE '+available.join(' / '):available[0]===0?'RETURN TO FINISH':'NEXT STATION '+available[0]}`);}
  if (!demo&&mode === 'race'&&!waypointRace) {
    const target = raceRoute(player.id)[player.nextCheckpoint];
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
  const canvas=document.querySelector<HTMLCanvasElement>('#map');
  if(canvas)drawQuarryMap(canvas,cars,quarry.arenaLayout,mode,demo?director.followed:online?.active?online.network.id:0,waypointRace?waypointRace.available(demo?director.followed:online?.active?online.network.id:0).map(i=>WAYPOINTS[i]):[]);
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
  ui.insertAdjacentHTML('beforeend', `<div class="overlay" id="overlay"><div class="dialog"><div class="eyebrow">BLACKRIDGE MOTOR CLUB</div><h2>${settingsOnly ? 'SETTINGS' : 'TAKE A BREATHER'}</h2><div class="settings-row"><label for="quality">Graphics</label><select id="quality"><option value="ultra">Ultra</option><option value="high">High</option><option value="medium">Medium</option></select></div>${(['engine', 'effects', 'ambience'] as const).map((k) => `<div class="settings-row"><label for="${k}-volume">${k[0].toUpperCase() + k.slice(1)}</label><input id="${k}-volume" type="range" min="0" max="1" step=".05" value="${settings[k]}"></div>`).join('')}<div class="settings-row"><label for="performance">Performance display</label><input type="checkbox" id="performance" ${settings.performance?'checked':''}></div><p>${demo?'C camera · [ / ] choose car<br>Space / Escape pause · M mute · F fullscreen<br>Free orbit: drag to look around, scroll to zoom':"Driving keys and gamepad: expand controls below<br>C camera · R recover · M mute · F fullscreen · Escape pause"+(mode === 'playground' ? '<br>I inspect wreck · T toggle traffic · R repair' : '')}</p><button class="primary" id="resume">${resumeState === 'menu' ? 'BACK' : 'RESUME'}</button>${resumeState !== 'menu' ? '<button class="small-button" id="restart">RESTART EVENT</button><button class="small-button" id="main-menu">RETURN TO QUARRY</button>' : ''}</div></div>`);
  document.querySelector<HTMLInputElement>('#performance')!.onchange=e=>{settings.performance=(e.target as HTMLInputElement).checked;persist();};
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
  mountDrivingControls(ui.querySelector<HTMLElement>('#overlay .dialog')!,drivingControls,()=>{try{localStorage.setItem(CONTROLS_KEY,JSON.stringify(drivingControls));return true;}catch{return false;}});
  studioButtons(ui.querySelector('#overlay .dialog'));
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
  if(['playing','countdown'].includes(state))hud();
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
  puddleSplashes?.setQuality(settings.quality);
  quarry?.referenceArena.setQuality(settings.quality);
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
  if(activeChallenge){toast('CHALLENGE RULE: NO RECOVERIES',2);return;}
  telemetry?.recover();
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
    const at = raceRoute(p.id)[index],
      to = raceRoute(p.id)[p.nextCheckpoint];
    p.place(at.x, at.z, Math.atan2(to.x - at.x, to.z - at.z));
    p.penalty += 5;
    toast('RECOVERED · +5 SECONDS');
  } else {
    if (p.health === 0) return;
    p.health = Math.max(1, p.health - 8);
    const arena=quarry.arenaLayout,dx=p.current.x-arena.x,dz=p.current.z-arena.z,dist=Math.hypot(dx,dz),limit=arena.radius-8;
    p.place(
      arena.x+dx*(dist>limit?limit/dist:1),
      arena.z+dz*(dist>limit?limit/dist:1),
      Math.atan2(-dx,-dz),
    );
    toast('RECOVERED · CONDITION −8%');
  }
}
function input(): Input {
  if (testInput) return testInput;
  return drivingInput(drivingControls,keys,navigator.getGamepads?.()??[],cars[0]?.speed??0);
}
function ai(car: Vehicle, dt: number): Input {
  if(car.health<=0||(car.finished&&mode!=='race'))return {throttle:0,steer:0,brake:1,handbrake:false};
  const yaw=Math.atan2(car.forward.x,car.forward.z);
  if(mode==='race'){
    if(waypointRace)car.nextCheckpoint=waypointRace.navigation(car.id,car.current).next;
    let nearest=Infinity;
    for(let k=0;k<100;k++){const p=trackPoint(k/100);nearest=Math.min(nearest,Math.hypot(car.current.x-p.x,car.current.z-p.z));}
    car.offTrackTime=nearest>14?car.offTrackTime+dt:0;
    if(car.offTrackTime>7||car.rollTime>4){
      const prev=raceRoute(car.id)[(car.nextCheckpoint+23)%24],next=raceRoute(car.id)[car.nextCheckpoint];
      car.place(prev.x,prev.z,Math.atan2(next.x-prev.x,next.z-prev.z));car.offTrackTime=0;car.penalty+=5;drivers.memory.delete(car.id);
    }
  }else if(car.rollTime>5){car.place(car.current.x,car.current.z,yaw);car.health=Math.max(1,car.health-7);car.penalty+=5;drivers.memory.delete(car.id);}
  return drivers.update(car,cars,mode,dt,()=>{
    const ray=(angle:number)=>{
      const dir={x:Math.sin(yaw+angle),y:0,z:Math.cos(yaw+angle)};
      const start={x:car.current.x,y:Math.max(car.current.y,landscapeHeight(car.current.x,car.current.z)+.55),z:car.current.z};
      const hit=physics.castRay(new R.Ray(start,dir),24,true,undefined,undefined,undefined,car.body,c=>!cars.some(v=>v.body.handle===c.parent()?.handle));
      return hit?drivingObstacleClearance(car,angle,hit.timeOfImpact):24;
    };
    return {front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};
  },raceRoute(car.id));
}
function rankRace() {
  if(waypointRace)return [...cars].sort((a,b)=>a.finished&&b.finished?a.finishTime-b.finishTime:a.finished?-1:b.finished?1:b.passed-a.passed||waypointRace!.remainingDistance(a.id,a.current)-waypointRace!.remainingDistance(b.id,b.current)||a.id-b.id);
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
                raceRoute(a.id)[a.nextCheckpoint].x,
                0,
                raceRoute(a.id)[a.nextCheckpoint].z,
              ),
            ) -
              b.current.distanceTo(
                new T.Vector3(
                  raceRoute(b.id)[b.nextCheckpoint].x,
                  0,
                  raceRoute(b.id)[b.nextCheckpoint].z,
                ),
              ),
  );
}
function finish(title: string) {
  if(!demo&&['result','wrecked'].includes(state))return;
  cars.forEach(c=>c.render(1));captureReplay(true);
  if(demo){if(state==='result')return;resultTitle=title;state='result';demoRestart=demoOptions.loop==='stop'?Infinity:8;cars.forEach(c=>c.render(1));updateHud();return;}
  resultTitle = title;
  state = 'result';
  sound.pause(true);
  const ordered = online?.active ? (online.network.snapshot?.ranking??[]).map(id=>cars.find(c=>c.id===id)!).filter(Boolean) : mode === 'derby' ? derbyRanking() : rankRace();
  const rank = ordered.findIndex(isPlayer) + 1;
  if(telemetry){Object.assign(telemetry.stats,{seconds:elapsed+cars[0].penalty,health:cars[0].health,rank:mode==='playground'?0:rank,won:mode!=='playground'&&rank===1&&(scoreDerby()||cars[0].health>0),finished:cars[0].finished,checkpoints:cars[0].passed});bankRun(true);}
  if(activeChallenge&&telemetry){
    const medal=lastAward?.medal??0;
    const detail=activeChallenge.mode==='race'&&!cars[0].finished?'Race not finished':formatChallengeValue(activeChallenge,challengeValue(activeChallenge,telemetry.stats));
    ui.innerHTML=`<div class="overlay"><section class="dialog challenge-result" aria-label="Challenge result"><div class="eyebrow">${activeChallenge.title.toUpperCase()} / CHALLENGE</div><h2>${medal?MEDALS[medal]+' MEDAL':'TRY AGAIN'}</h2><p>${detail} · ${Math.ceil(cars[0].health)}% condition</p><p>${activeChallenge.description}</p><p class="award-summary">${awardText(lastAward)}</p><p>${profileStorageWarning}</p><button id="challenge-retry" class="primary">RETRY CHALLENGE ↗</button><button id="challenge-board" class="small-button">CHALLENGE BOARD</button><button id="challenge-menu" class="small-button">RETURN TO QUARRY</button></section></div>`;
    studioButtons(ui.querySelector('.challenge-result'));
    ui.querySelector<HTMLButtonElement>('#challenge-retry')!.onclick=()=>{void start(false);};
    ui.querySelector<HTMLButtonElement>('#challenge-board')!.onclick=()=>{createCars(true);menu();openProfile();};
    ui.querySelector<HTMLButtonElement>('#challenge-menu')!.onclick=()=>{createCars(true);menu();};
    return;
  }
  saved.best ??= {};
  const score =
    mode === 'derby' ? scoreDerby()?combat.points(cars[0].id):cars[0].inflicted : elapsed + cars[0].penalty;
  const bestKey=mode==='race'?`race:${raceFormat()==='laps'?(customEvent()?eventOptions.direction:'forward'):raceFormat()}:${raceLaps()}:${cars.length}`:scoreDerby()?`score-derby:${eventDuration()}:${cars.length}`:mode;
  if (
    !online?.active && !(mode==='race'&&raceFormat()==='random') && (mode !== 'race' || cars[0].finished) &&
    (!saved.best[bestKey] ||
      (mode === 'derby' ? score > saved.best[bestKey] : score < saved.best[bestKey]))
  )
    saved.best[bestKey] = score;
  persist();
  if (!online?.active && cars[0].health <= 0 && !scoreDerby()) {
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
  ui.innerHTML = `<div class="overlay"><div class="dialog"><div class="eyebrow">${modes[mode].label} / RESULTS</div><h2>${title}</h2><p>Finished ${rank} of ${cars.length} · ${Math.ceil(cars[0].health)}% condition<br>${mode === 'derby' ? scoreDerby()?combat.points(cars[0].id)+' points · '+combat.get(cars[0].id).knockouts+' knockouts':Math.round(cars[0].inflicted) + ' damage inflicted' : formatTime(elapsed + cars[0].penalty) + ' including recovery penalties'}</p>${ordered.map((c, i) => `<div class="results-row ${isPlayer(c) ? 'player' : ''}"><span>${String(i + 1).padStart(2, '0')} &nbsp; ${isPlayer(c) ? 'YOU' : DEFINITIONS[c.kind].name + ' #' + c.id}</span><span>${mode === 'derby' ? scoreDerby()?combat.points(c.id)+' PTS':Math.ceil(c.health) + '%' : c.finished ? formatTime(c.finishTime) : (waypointRace?'STATIONS '+c.passed:'LAP '+Math.min(raceLaps(), c.lap))}</span></div>`).join('')}<p class="award-summary">${awardText(lastAward)}</p><button class="primary" id="again">RUN IT BACK ↗</button><button class="small-button" id="back">RETURN TO QUARRY</button></div></div>`;
  studioButtons(ui.querySelector('.dialog'));
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
  if(demo||autopilot||testInput)telemetry=null;
  for (const c of cars) {
    c.input = c.id === 0 && !autopilot && !demo ? input() : ai(c, dt);
    c.preStep(dt);
  }
  physics.step(events);
  for (const c of cars) c.postStep(dt, elapsed);
  events.drainContactForceEvents((e) => {
    const h1 = e.collider1(),
      h2 = e.collider2();
    const {a,b,key}=vehicleContact(physics,cars,h1,h2);
    if (elapsed - (lastImpact.get(key) ?? -100) < 0.28) return;
    if (!a && !b) return;
    const point = new T.Vector3().copy((a ?? b)!.current);
    const normal=new T.Vector3();
    const co1 = physics.getCollider(h1),
      co2 = physics.getCollider(h2);
    if (co1 && co2)
      physics.contactPair(co1, co2, (m) => {
        if (m.numSolverContacts() > 0){point.copy(m.solverContactPoint(0));normal.copy(m.normal());}
      });
    const va = a?.velocity ?? new T.Vector3(),
      vb = b?.velocity ?? new T.Vector3();
    const relative=vb.clone().sub(va),closing=normal.lengthSq()>.5?Math.abs(relative.dot(normal)):relative.length(),impulse=e.totalForceMagnitude()*dt;
    const damage=structuralDamage(impulse,closing)*(mode==='race'?.45:1);
    if(closing<.65||impulse<1500)return;
    lastImpact.set(key,elapsed);collisions++;
    if (a) {
      const before=a.health;
      a.hit(point,vb.clone().sub(va).normalize(),damage,elapsed,false,b?.paintColor);
      if (b){b.inflicted += before-a.health;combat.hit(b.id,a.id,before,a.health,elapsed);}
      if(b?.id===0)telemetry?.impact(a.id,before,a.health);
    }
    if (b) {
      const before=b.health;
      b.hit(point,va.clone().sub(vb).normalize(),damage,elapsed,false,a?.paintColor);
      if (a){a.inflicted += before-b.health;combat.hit(a.id,b.id,before,b.health,elapsed);}
      if(a?.id===0)telemetry?.impact(b.id,before,b.health);
    }
    sound.impact(impactAudioSeverity(impulse),point,!!(a?.impactEffects.glass||b?.impactEffects.glass),!!(a?.impactEffects.debris||b?.impactEffects.debris));
    if (a?.id === 0 || b?.id === 0)
      toast(damage > 12 ? 'HEAVY IMPACT' : 'CONTACT', 0.8);
  });
  if(scoreDerby())stepScoreRespawns(combat,cars,elapsed,eventDuration(),DERBY_ARENA,id=>{drivers.memory.delete(id);telemetry?.resetOpponent(id);if(id===0)telemetry?.recover();});
  if(telemetry){const p=cars[0];telemetry.sample(dt,{speed:p.speed,lateral:p.velocity.dot(p.right),grounded:[0,1,2,3].filter(i=>p.controller.wheelIsInContact(i)).length,height:p.current.y-landscapeHeight(p.current.x,p.current.z)-.89,health:p.health,checkpoints:p.passed});telemetry.stats.rank=mode==='playground'?0:(mode==='derby'?derbyRanking():rankRace()).indexOf(cars[0])+1;}
  for (const c of cars) {
    if (Math.hypot(c.current.x, c.current.z) > 255 || c.current.y < -8) {
      if(c.id===0&&activeChallenge){finish('OUT OF BOUNDS');return;}
      if (c.id === 0 && !demo) recover();
      else c.place(0, 0, 0);
    }
    if(mode==='race'&&waypointRace){
      const reached=waypointRace.sample(c.id,c.current),progress=waypointRace.get(c.id);c.passed=progress.passed;c.lap=progress.round+1;
      if(reached&&c.id===0&&!demo)toast(reached.finished?'ALL STATIONS COMPLETE':reached.id===0?'ROUND COMPLETE':`STATION ${reached.id} COLLECTED`,1.2);
      if(progress.finished&&!c.finished){c.finished=true;c.finishTime=elapsed+c.penalty;if(c.id===0&&!demo)finish('WAYPOINT FINISH');}
      if(c.id===0&&!demo)c.nextCheckpoint=waypointRace.navigation(c.id,c.current).next;
    } else if (mode === 'race') {
      const check = checkRoute(
        raceRoute(c.id),c.current.x,
        c.current.z,
        c.nextCheckpoint,
        c.checkpointDistance,
      );
      c.checkpointDistance = check.distance;
      if (check.passed) {
        if(!c.finished)c.passed++;
        c.nextCheckpoint = (c.nextCheckpoint + 1) % 24;
        c.checkpointDistance = Infinity;
        if(c.finished)continue; // Keep AI rolling beyond the finish without changing its result.
        const progress=lapProgress(c.passed,raceLaps());c.lap=progress.lap;
        if(progress.finished){
          c.finished=true;c.finishTime=elapsed+c.penalty;
          if(c.id===0&&!demo)finish('FINISH LINE');
        }
      }
    }
  }
  if (!demo && mode === 'race' && cars[0].health <= 0) finish('RETIRED · DAMAGE');
  if (mode === 'derby') {
    const alive = cars.filter((c) => c.health > 0);
    if(scoreDerby()){if(elapsed>=eventDuration())finish('TIME’S UP');}
    else if (!demo && cars[0].health <= 0) finish('WRECKED OUT');
    else if (alive.length <= 1 && activeChallenge?.metric!=='condition') finish('LAST CAR STANDING');
    else if (elapsed >= eventDuration()) finish('TIME’S UP');
  }
  if(activeChallenge&&state==='playing'&&(elapsed+cars[0].penalty>=activeChallenge.limit||cars[0].health<=0))finish('CHALLENGE COMPLETE');
  if(demo&&mode==='race'&&(cars.every(c=>c.finished||c.health<=0)||elapsed>=Math.max(600,raceLaps()*150)))finish('RACE COMPLETE');
  fx.update(dt);
}
function updateCamera(dt: number) {
  const p = demo?(cars.find(c=>c.id===director.followed)??cars[0]):cars[0];
  if (!p) return;
  if(!garageOpen){camera.up.set(0,1,0);if(camera.view?.enabled)camera.clearViewOffset();}
  if(studio){studio.updateCamera(camera,orbit,renderer);return;}
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
    if(garageOpen){frameGarage(camera,p.current,p.currentQ,garageFace,innerWidth,innerHeight);return;}
    const a=1.5+Math.sin(clock*.055)*.12,target=p.current.clone().add(new T.Vector3(0,.1,0));
    camera.position.set(target.x+Math.sin(a)*7.7,target.y+1.8,target.z+Math.cos(a)*7.7);
    camera.lookAt(target.x-2.15,target.y+.12,target.z);
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
    : chaseComposition(target,f,p.speed).position;
  const cameraGround = Math.max(scenerySurfaceHeight(desired.x, desired.z), quarryExtensionHeight(desired.x, desired.z) ?? -Infinity, quarryWestWallHeight(desired.x, desired.z) ?? -Infinity);
  desired.y = Math.max(desired.y, cameraGround + 0.65);
  camera.position.sub(cameraImpactOffset);
  camera.position.lerp(desired, 1 - Math.exp(-dt * (hood ? 25 : 5)));
  const look = hood ? target.clone().addScaledVector(f,22).add(new T.Vector3(0,.5,0)) : chaseComposition(target,f,p.speed).target;
  camera.lookAt(look);
  const response = p.impactResponse.step(state === 'playing' ? dt : 0);
  cameraImpactOffset.copy(response.offset).multiplyScalar(hood ? .65 : 1);
  camera.position.add(cameraImpactOffset);
  camera.rotateZ(response.roll * (hood ? .6 : 1));
  camera.rotateX(response.pitch);
  camera.fov = T.MathUtils.damp(
    camera.fov,
    hood ? 66 : CHASE_VIEW.fov + Math.min(5, Math.abs(p.speed) * 0.12),
    3,
    dt,
  );
  camera.updateProjectionMatrix();
}
function frame(now: number) {
  requestAnimationFrame(frame);
  const raw = (now - lastFrame) / 1000;
  if(state==='playing'&&Number.isFinite(raw)&&raw>0){eventFrameTimes.push(raw*1000);if(eventFrameTimes.length>300)eventFrameTimes.shift();}
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
  if(studio){studio.update(dt);}
  else if(online?.active) {
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
  if(demo&&state==='result'){demoRestart=Math.max(0,demoRestart-dt);fx.update(dt);if(demoRestart===0){const next=nextDemoMode(mode,demoOptions.loop);if(next){mode=next;state='loading';void start(true);}}}
  updateCamera(dt);
  if(!studio)for(const car of cars){car.wreckParts.pose(['playing','countdown'].includes(state)?dt:0,car.speed);car.wreckParts.wheelsPose();car.syncSuspension();}
  const effectsActive=['playing','countdown','wrecked'].includes(state)||(demo&&state==='result');
  if(!studio)vehicleFire?.update(cars,effectsActive?dt:0,camera);
  if(!studio)puddleSplashes?.update(cars,quarry.puddles,effectsActive?dt:0,state==='playing');
  if(!studio&&state==='playing')captureReplay();
  if(effectsActive){sound.update(cars,camera,dt,state==='wrecked');if(vehicleFire)sound.thermal(vehicleFire.audio,vehicleFire.bursts);}
  quarry.update(camera);
  waypointMarkers??=new WaypointMarkers(scene);waypointMarkers.update(waypointRace,demo?director.followed:online?.active?online.network.id:0,!studio&&mode==='race'&&['playing','countdown','paused','result'].includes(state));
  if(waypointRace)quarry.checkpoint.visible=false;
  if(!studio&&!waypointRace&&mode==='race'&&cars[0]) {
    const followed=demo?cars.find(c=>c.id===director.followed)??cars[0]:cars[0],p=raceRoute(followed.id)[followed.nextCheckpoint],ahead=raceRoute(followed.id)[(followed.nextCheckpoint+1)%24];
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
  studio?.capture(canvas);
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
  if(studio){if(e.code==='Escape'){e.preventDefault();closeStudio();}else if(e.code==='KeyH'&&!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){e.preventDefault();studio.toggleHud();}else if(e.code==='Space'&&!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){e.preventDefault();studio.togglePlay();}else if((e.code==='ArrowLeft'||e.code==='ArrowRight')&&!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){e.preventDefault();studio.seek(studio.time+(e.code==='ArrowLeft'?-1:1)*(e.shiftKey?1:.05));}return;}
  if(e.code==='KeyP'&&['playing','countdown'].includes(state)&&!online?.active){e.preventDefault();pause();openStudio(true);return;}
  if(closeReplayLibrary){if(e.code==='Escape'){e.preventDefault();closeReplayLibrary();}return;}
  if(eventSetupOpen){if(e.code==='Escape'){eventSetupOpen=false;menu();}return;}
  if(profileOpen){if(e.code==='Escape'){profileOpen=false;menu();}return;}
  if(garageOpen){if(e.code==='Escape'){garageOpen=false;createCars(true);menu();}return;}
  if(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement)return;
  if(state==='lobby')return;
  if (
    (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)||Object.values(drivingControls.keys).some(binding=>binding.includes(e.code)))
  )
    e.preventDefault();
  if (e.repeat) return;
  if (e.code === 'Escape') {
    state === 'paused' || state === 'inspect' ? resume() : pause();
    return;
  }
  if (e.code === 'KeyF') fullScreen();
  if (e.code === 'KeyM') sound.mute();
  if(demo&&e.code==='KeyH'){demoHudHidden=!demoHudHidden;ui.classList.toggle('demo-clean',demoHudHidden);return;}
  if (demo&&e.code==='Space'){e.preventDefault();state==='paused'?resume():pause();return;}
  if(demo&&(e.code==='BracketLeft'||e.code==='BracketRight'))director.cycleCar(cars,e.code==='BracketLeft'?-1:1);
  if (e.code === 'KeyC') {if(demo)director.cycleView();else hood = !hood;}
  if (!demo && e.code === 'KeyR' && state === 'playing') recover();
  if (!activeChallenge && !online?.active && e.code === 'KeyT' && mode === 'playground' && state === 'playing') {
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
  puddleSplashes=new PuddleSplashes(scene);puddleSplashes.setQuality(settings.quality);
  quarry = new Quarry(scene, physics);
  online=new OnlineView(scene,physics,fx,sound,()=>cars,next=>{cars=next;});
  onlineUI=new OnlineUI(ui,online.network,{connect:connectOnline,leave:leaveOnline,loadout:(car=kind)=>({kind:car,setup:copyOnlineSetup(garage.cars[car].setup),livery:garage.cars[car].setup.livery})});
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
    VehicleFire.loadBaked(),
    prepareReferenceFloor(),
  ]);
  environmentTarget = prepared[1];
  vehicleFire.useBaked();
  setQuarryMode();
  staticShadows = new StaticQuarryShadows(scene, new Set<T.Object3D>([
    ...quarry.modeScenery, quarry.checkpoint, ...quarry.props.map(prop => prop.mesh),
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
    get eventRules(){return{...eventOptions,score:scoreDerby(),field:cars.length,combat:Array.from(combat.records)};},
    get progression(){return{profile,run:telemetry?.stats,challenge:activeChallenge?.id,settled:runSettled,lastAward};},
    get garageSetup() { return {kind, saved:garage.cars[kind], active:cars[0]?.specification}; },
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
    get splashState(){return puddleSplashes?.stats;},
    get surfaceState(){return{ground:fx.evidence.stats,cars:cars.map(c=>({id:c.id,...c.surfaceFinish.stats,scraping:c.scraping,paintVertices:c.panels.reduce((sum,p)=>sum+Array.from(p.geometry.attributes.transferPaint.array).filter((v,i)=>i%4===3&&v>0).length,0),wheels:Array.from(c.wreckParts.wheelDamage,(damage,i)=>({damage,rest:c.controller.wheelSuspensionRestLength(i),stiffness:c.controller.wheelSuspensionStiffness(i),brake:c.controller.wheelBrake(i),steering:c.controller.wheelSteering(i),contact:c.tireContacts[i].active.value,load:c.tireContacts[i].load.value}))}))};},
    get puddles(){return quarry.puddles;},
    get arenaState(){return{...quarry.arenaLayout,expanded:quarry.arenaPhysics.expanded,enabledWalls:quarry.arenaPhysics.walls.filter(c=>c.isEnabled()).length};},
    get artDirection(){return{composition:CHASE_VIEW,scenery:quarry.referenceArena.stats};},
    seedFireTest:(seed:number)=>{
      vehicleFire?.dispose();let randomState=seed>>>0;
      vehicleFire=new VehicleFire(scene,(p,n,t,f)=>fx.emit(p,n,t,f),()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;});
      vehicleFire.setQuality(settings.quality);
    },
    seedFireStress:()=>{
      // Explicit QA fixture for the maximum effects budget; unused by gameplay.
      vehicleFire?.update(cars,0,camera);
      const seeds=Array.from({length:8192},(_,i)=>i/8192).filter(s=>unitNoise(s)<.24&&unitNoise(s+9.37)>=.12&&unitNoise(s+2.13)>.3);
      if(vehicleFire)for(const [id,e]of vehicleFire.emitters){
        e.state=new VehicleThermalState(e.car.health,seeds[id%seeds.length]);e.state.advance(e.car.health,1/60,0,e.car.damageZones,e.profile.engineZone,e.profile.waterCooled);
        Object.assign(e.state,{fuelTime:600}); // Hold the maximum load during QA only.
      }
    },
    simulateSplashes:(seconds:number)=>{for(let i=0;i<Math.min(2,seconds)*60;i++)puddleSplashes?.update(cars,quarry.puddles,1/60,true);},
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
    damage: (id: number, amount: number, side = 'front',paint?:number) => {
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
        false,paint===undefined?undefined:new T.Color(paint),
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
        p = raceRoute()[c.nextCheckpoint];
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
