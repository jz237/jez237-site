import * as T from './vendor/three.module.js';
import {makeBathymetry} from './bathymetry.js';
import {makeSky,skyPalette} from './sky.js';
import {makeLake,makeLakeBed,shared,skyColors} from './lake-surface.js';
import {makeCover} from './cover.js';
import {makeShoreScenery} from './shore-scenery.js';
import {makeKayak} from './kayak.js';
import {createLook,lookDrag,lookStick,updateAnglerCamera} from './angler-camera.js';
import {playerInput} from './player-input.js';
import {mountTouchControls} from './touch-controls.js';
import {mountHud} from './hud.js';
import {loadSettings,saveSettings} from './options.js';
import {adaptiveQuality} from './adaptive-quality.js';
import {frameElapsed} from './frame-clock.js';
import {installQA} from './qa.js';
import {createClock,stepClock,skipToHour,setHour,hourOfDay,formatClock,formatDate,dayOfYear} from './game-clock.js';
import {sunDirection,sunEvents} from './sun-position.js';
import {sampleSwell,windAmplitude} from './lake-waves.js';
import {impactHeight,addImpact} from './surface-impulses.js';
import {wakeHeight} from './wake-field.js';
import {waterLevel} from './land-materials.js';
import {worldFromFrame,halfWidth} from './lake-shape.js';
import {waterTempF,seasonOptics} from './season.js';
import {makeMist} from './mist.js';
export const VERSION='0.1.0';
const $=id=>document.getElementById(id),canvas=$('lake');
const settings=loadSettings();
const hud=mountHud({
 onStart:()=>start(),onQuality:q=>{settings.quality=q;saveSettings(settings);applyQuality(q==='auto'?'high':q);adapt.memory={};},
 onSteady:v=>{settings.steadyCamera=v;saveSettings(settings);},onFov:v=>{settings.fov=v;saveSettings(settings);camera.fov=v;camera.updateProjectionMatrix();},
 onRate:r=>{setRate(r);settings.timeRate=r==='real'?'real':Number(r);saveSettings(settings);},
 onWeather:w=>{setWeather(w);settings.weather=w;saveSettings(settings);},
 onSkip:h=>{const target=skipToHour(clock,h);hud.toast('Skipping to '+formatClock(target));},
 onLenses:()=>setPolarized(!polarizedTarget),onMenu:()=>toggleMenu(),onHour:h=>setHour(clock,h)
});
let renderer;try{renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch(e){hud.error('WebGL 2 is needed for this lake. Try a current browser with hardware acceleration enabled.');throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.shadowMap.autoUpdate=false;
const scene=new T.Scene();scene.fog=new T.FogExp2(0xb4c2c6,.0016);
const camera=new T.PerspectiveCamera(settings.fov,innerWidth/innerHeight,.08,1800);
const sun=new T.DirectionalLight(0xffe1aa,3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:1,far:700});sun.shadow.bias=-.0003;sun.shadow.normalBias=.15;scene.add(sun);scene.add(sun.target);
const ambient=new T.HemisphereLight(0xbad6e0,0x4c4636,1);scene.add(ambient);
const bathy=makeBathymetry(512);
const sky=makeSky(scene);const envScene=new T.Scene();envScene.add(sky.mesh.clone());const pmrem=new T.PMREMGenerator(renderer);let environment=null,envElevation=-999,envCloud=-1;
function refreshEnvironment(elevation,cloud){if(Math.abs(elevation-envElevation)<1.5&&Math.abs(cloud-envCloud)<.15)return;envElevation=elevation;envCloud=cloud;if(environment)environment.dispose();environment=pmrem.fromScene(envScene,.04,.1,2000);scene.environment=environment.texture;}
const mist=makeMist(scene);const bed=makeLakeBed(scene,bathy,300),cover=makeCover(scene,bathy),shore=makeShoreScenery(scene,bathy),kayak=makeKayak(scene);
let quality=settings.quality==='auto'?'high':settings.quality;
const lake=makeLake(renderer,scene,camera,bathy,quality);
// --- weather and wind (smoothed toward a preset)
const WEATHER={calm:{wind:.06,from:225,cloud:.14,rain:0,label:'Calm, a little mist'},breeze:{wind:.42,from:235,cloud:.38,rain:0,label:'Light breeze from the south-west'},overcast:{wind:.22,from:160,cloud:.82,rain:0,label:'Overcast and still'},rain:{wind:.36,from:120,cloud:.94,rain:.9,label:'Rain from the east'}};
const weather={wind:.06,from:225,cloud:.14,rain:0},weatherTarget={...WEATHER.calm};let weatherName='calm';
function setWeather(name){if(!WEATHER[name])return;weatherName=name;Object.assign(weatherTarget,WEATHER[name]);$('weather').value=name;}
function setWind(ms,fromDeg){weatherTarget.wind=Math.max(0,Math.min(1,ms/8));if(fromDeg!==undefined)weatherTarget.from=fromDeg;}
const windDirRad=fromDeg=>{const t=(fromDeg+180)*Math.PI/180;return Math.atan2(-Math.cos(t),Math.sin(t));};
const compass=d=>['N','NE','E','SE','S','SW','W','NW'][Math.round(((d%360)+360)%360/45)%8];
// --- clock: first light today by default
const events=sunEvents(Date.now());
const clock=createClock({start:(events.sunrise||Date.now())-25*60000,rate:settings.timeRate==='real'?1:Number(settings.timeRate)||4,mode:settings.timeRate==='real'?'real':'sim'});
function setRate(r){if(r==='real'){clock.mode='real';}else{clock.mode='sim';clock.rate=Number(r)||4;}$('rate').value=String(r);}
// --- state
let mode='menu',keys={},pressed={},simTime=0,last=performance.now(),touch=null,polarized=0,polarizedTarget=settings.polarized?1:0,cameraMode='surface';
const look=createLook();let drag=null,dragMoved=0,frameSum=0,frameCount=0,adaptClock=0,saverToggle=0;const adapt={memory:{}};
const fetchAt=(x,z)=>Math.max(0,Math.min(1,bathy.openness(x,z)/110));
const surface=(x,z,t)=>waterLevel.value+sampleSwell(x,z,t,shared.windAmp.value*fetchAt(x,z),shared.windDir.value)+impactHeight(x,z,t)+wakeHeight(x,z,t);
const env={windMs:0,windDir:0,time:0,surface,depth:(x,z)=>bathy.depth(x,z),ripple:(x,z,r,a)=>lake.addRipple(x,z,r,a)};
{const p=worldFromFrame(150,halfWidth(150,1)*.42),aim=worldFromFrame(120,-halfWidth(120,-1)+12);kayak.place(p.x,p.z,Math.atan2(aim.x-p.x,aim.z-p.z));kayak.state.anchored=true;}
function applyQuality(q){quality=q;lake.setQuality(q);const ratio=q==='high'?Math.min(devicePixelRatio,1.5):q==='medium'?1:.75;renderer.setPixelRatio(ratio);renderer.setSize(innerWidth,innerHeight);lake.resize();renderer.shadowMap.enabled=q==='high'||q==='medium';sun.shadow.mapSize.set(q==='high'?2048:1024,q==='high'?2048:1024);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}
function setPolarized(v){polarizedTarget=v?1:0;settings.polarized=!!v;saveSettings(settings);hud.setLenses(!!v);hud.toast(v?'Polarized lenses on':'Lenses off');}
function setCamera(name){cameraMode=name;}
function toggleMenu(){if(mode==='playing'){mode='menu';keys={};touch?.setActive(false);hud.showMenu({eyebrow:'AT ANCHOR',title:'Take a<br>breath',description:'The lake keeps moving while the menu is open.',button:'Back to the water'});}else start();}
function start(){mode='playing';hud.hideMenu();keys={};touch?.setActive(true);canvas.focus();if(settings.hint){hud.toast('Drag to look · W/S paddle · A/D turn · Space anchor · P lenses · tap the water to toss a pebble',6500);}}
// --- input
canvas.tabIndex=0;
window.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT'||e.target.tagName==='INPUT')return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(!e.repeat)pressed[e.code]=true;keys[e.code]=true;});
window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>{keys={};drag=null;});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys={};drag=null;}});
canvas.addEventListener('pointerdown',e=>{if(e.button>0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY};dragMoved=0;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;dragMoved+=Math.hypot(dx,dy);lookDrag(look,dx,dy);});
function endDrag(e){if(!drag||e.pointerId!==drag.id)return;const tap=dragMoved<8;drag=null;if(tap&&mode==='playing')tossPebble(e.clientX,e.clientY);}
canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',()=>{drag=null;});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);lake.resize();});
const ray=new T.Raycaster(),plane=new T.Plane(new T.Vector3(0,1,0),0),hit=new T.Vector3();
function tossPebble(cx,cy){ray.setFromCamera(new T.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),camera);if(!ray.ray.intersectPlane(plane,hit))return;const d=Math.hypot(hit.x-kayak.state.x,hit.z-kayak.state.z);if(d>45||bathy.depth(hit.x,hit.z)<=0)return;addRipple(hit.x,hit.z,'pebble');}
function addRipple(x,z,kind='pebble'){const k={pebble:[.13,.012,2.4],splash:[.3,.03,3.4],dimple:[.08,-.004,0],boil:[.5,.02,2.2]}[kind]||[.15,.012,2.4];lake.addRipple(x,z,k[0],k[1]);if(k[2])addImpact(x,z,simTime,k[2]);}
touch=mountTouchControls({onTap:what=>{if(what==='anchor')pressed.Space=true;else if(what==='lenses')setPolarized(!polarizedTarget);else if(what==='menu')toggleMenu();}});touch.setLeftHanded(settings.touchLeft);
// --- per-frame simulation
let conditionsClock=0,lastElevation=0;
function step(dt){
 stepClock(clock,dt);simTime+=dt;
 const k=1-Math.exp(-dt*.25);for(const key of ['wind','cloud','rain'])weather[key]+=(weatherTarget[key]-weather[key])*k;weather.from+=(weatherTarget.from-weather.from)*k;
 shared.time.value=simTime;shared.wind.value=weather.wind;shared.windAmp.value=windAmplitude(weather.wind);shared.windDir.value=windDirRad(weather.from);shared.rain.value=weather.rain;
 env.windMs=weather.wind*8;env.windDir=shared.windDir.value;env.time=simTime;
 const sd=sunDirection(clock.ms);lastElevation=sd.elevation;const palette=skyPalette(sd.elevation,weather.cloud);sky.apply(palette,sd,sd.elevation,weather.cloud);
 sun.position.set(kayak.state.x+sd.x*320,Math.max(12,sd.y*320),kayak.state.z+sd.z*320);sun.target.position.set(kayak.state.x,0,kayak.state.z);sun.intensity=palette.sunIntensity;sun.color.setRGB(...palette.sunColor);sun.visible=palette.sunIntensity>.01;
 ambient.intensity=palette.ambientIntensity;ambient.color.setRGB(...palette.horizon).multiplyScalar(1.15);ambient.groundColor.setRGB(.26,.23,.17);
 scene.fog.color.setRGB(...palette.fogColor);scene.fog.density=palette.fogDensity;scene.environmentIntensity=.35+.45*(1-palette.night);
 sky.mesh.position.copy(camera.position);refreshEnvironment(sd.elevation,weather.cloud);mist.update(simTime,camera.position,sd.elevation,weather.wind,palette);
 const pad=navigator.getGamepads?.()?.[0]||null,input=playerInput(keys,pad,touch.keys());
 if(pad){lookStick(look,input.lookX,input.lookY,dt);if(input.padLenses&&!pressed._padLenses){setPolarized(!polarizedTarget);}pressed._padLenses=input.padLenses;if(input.padAnchor&&!pressed._padAnchor)pressed.Space=true;pressed._padAnchor=input.padAnchor;if(input.padMenu&&!pressed._padMenu)toggleMenu();pressed._padMenu=input.padMenu;}
 if(pressed.KeyP){setPolarized(!polarizedTarget);}if(pressed.Escape)toggleMenu();if(pressed.Digit1)hud.toast('Skipping to '+formatClock(skipToHour(clock,5.4)));if(pressed.Digit2)hud.toast('Skipping to '+formatClock(skipToHour(clock,18.9)));if(pressed.Digit3)hud.toast('Skipping to '+formatClock(skipToHour(clock,22)));
 if(pressed.KeyT){const order=['real','1','4','12'],next=order[(order.indexOf(String(settings.timeRate))+1)%order.length];setRate(next);settings.timeRate=next==='real'?'real':Number(next);saveSettings(settings);hud.toast(next==='real'?'Real time':'Time runs at '+next+'×');}
 const control=mode==='playing'?{paddle:input.paddle,turn:input.turn,anchorToggle:!!pressed.Space}:{paddle:0,turn:0,anchorToggle:false};
 if(mode==='playing'&&pressed.Space)hud.toast(kayak.state.anchored?'Anchor up':'Anchor down');
 kayak.step(dt,control,env);pressed={};
 if(mode==='menu'){look.targetYaw=Math.sin(simTime*.05)*.35;look.targetPitch=-.06;}
 polarized+=(polarizedTarget-polarized)*(1-Math.exp(-dt*3.5));lake.setPolarized(polarized);
 lake.update(dt,kayak.state.x,kayak.state.z);cover.update(simTime,surface);shore.update(simTime,weather.wind,quality,camera.position);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;updateAnglerCamera(camera,kayak.state,look,dt,{steady:settings.steadyCamera||reduced?1:0});
 if(cameraMode==='shore'){const p=worldFromFrame(150,halfWidth(150,1)+3);camera.position.set(p.x,2.2,p.z);camera.lookAt(kayak.state.x,0,kayak.state.z);}else if(cameraMode==='under'){camera.position.y=-1.2;}
 conditionsClock+=dt;if(conditionsClock>.25){conditionsClock=0;const ev=sunEvents(clock.ms);const doy=dayOfYear(clock.ms);const optics=seasonOptics(doy,weather.rain);lake.setProfile(optics);
  hud.setConditions({time:formatClock(clock.ms),date:formatDate(clock.ms)+(clock.mode==='real'?' · live':' · '+clock.rate+'×'),wind:Math.round(env.windMs*2.237)+' mph '+compass(weather.from)+' · '+WEATHER[weatherName].label,water:Math.round(waterTempF(doy))+'°F · '+(optics.profile==='lakeClear'?'clear':optics.profile==='lakeStained'?'stained':optics.profile==='lakeBloom'?'algae bloom':'green'),sun:ev.sunrise?'Sunrise '+formatClock(ev.sunrise)+' · Sunset '+formatClock(ev.sunset):'',hour:hourOfDay(clock.ms)});}
 hud.tick();
}
let shadowFrame=0;function render(){renderer.shadowMap.needsUpdate=renderer.shadowMap.enabled&&(shadowFrame++%4===0);lake.render(camera);}
function frame(now){requestAnimationFrame(frame);const raw=frameElapsed((now-last)/1000);last=now;
 if(quality==='saver'&&(saverToggle^=1)){pendingDt+=raw;return;}const dt=Math.min(raw+pendingDt,.05);pendingDt=0;
 step(dt);render();
 if(raw<.25&&!document.hidden){frameSum+=raw;frameCount++;adaptClock+=raw;}if(adaptClock>8){const fps=frameCount/frameSum;if(settings.quality==='auto'){const next=adaptiveQuality(adapt.memory,quality,fps,8);if(next!==quality){applyQuality(next);hud.toast('Graphics: '+next);}}frameSum=frameCount=adaptClock=0;lastFps=fps;}
}
let pendingDt=0,lastFps=0;
const app={step,render,renderer,version:VERSION,start,setQuality:q=>{applyQuality(q);settings.quality=q;},setHour:h=>setHour(clock,h),setRate,setWind,setWeather,setCamera,addRipple,setPolarized,
 forceSize:(w,h)=>{renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();lake.resize();},
 debug:()=>({scene,bed,cover,shore,kayak,lake,sky,camera,sun,mist,ambient}),stats:()=>({fps:lastFps,quality,tris:renderer.info.render.triangles,calls:renderer.info.render.calls,programs:renderer.info.programs?.length,scenery:shore.counts,cover:cover.features.length}),
 state:()=>({mode,clock:{ms:clock.ms,rate:clock.rate,mode:clock.mode,local:formatClock(clock.ms)},sunElevation:lastElevation,weather:{...weather,name:weatherName},kayak:{...kayak.state},polarized,camera:camera.position.toArray(),depthUnderKayak:bathy.depth(kayak.state.x,kayak.state.z)})};
installQA(app);
hud.setSettings(settings);setWeather(settings.weather);Object.assign(weather,WEATHER[settings.weather]);setRate(settings.timeRate==='real'?'real':String(settings.timeRate||4));
hud.showMenu({});
try{applyQuality(quality);step(.016);renderer.compile(scene,camera);render();$('start').disabled=false;$('start').textContent='Paddle out';requestAnimationFrame(frame);}catch(e){hud.error('The lake could not load: '+e.message);console.error(e);}
