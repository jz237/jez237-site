import {PLAYER_WINDOW_VERSION,envelope,validEnvelope,normalizeWindowControls} from './player-window-protocol.js';
import {readWindowFrame,interpolateWindowFrame} from './player-window-presentation.js';
import {createInputSampler} from './player-input.js';
import {gameplayKey} from './control-bindings.js';
import {createGamepadRumble,updateGamepadRumble,resetGamepadRumble} from './gamepad-rumble.js';
import {createPlayerWindowRenderer} from './player-window-renderer.js';

const $=id=>document.getElementById(id),params=new URLSearchParams(location.hash.slice(1)),session=params.get('session'),capability=params.get('capability');
let port=null,generation=0,descriptor=null,viewer=null,keys={},frames=[],lastPacketAt=-Infinity,inputSequence=0,commandSequence=0,disposed=false,standby=true,lastHeartbeat=0,lastInput=0,primeButtons=true;
const haptics=createGamepadRumble(),sample=createInputSampler(()=>descriptor?.controls),padPause=[false,false],padCamera=[false,false];
const send=(type,data={})=>{try{port?.postMessage(envelope(session,generation,type,data));}catch{hold('Primary window connection ended.');}};
function hold(label){standby=true;keys={};resetGamepadRumble(haptics);$('standby').hidden=false;$('hud').hidden=true;$('message').textContent=label;}
function clearInput(reprime=false){keys={};if(reprime)primeButtons=true;resetGamepadRumble(haptics);}
function command(c){send('command',{sequence:++commandSequence,command:c});}
function pauseRequest(){const frame=frames.at(-1)?.frame;if(frame)command({kind:'pause',paused:frame.phase!=='paused'});}
function heartbeat(){send('heartbeat',{focused:document.hasFocus(),visible:document.visibilityState==='visible'});}
function receive(m){
 if(!validEnvelope(m,session))return;
 if(m.type==='init'){
  if(m.generation<generation)return;generation=m.generation;descriptor=m.descriptor;frames=[];inputSequence=0;commandSequence=0;clearInput(true);hold('Preparing the course…');
  try{viewer??=createPlayerWindowRenderer($('sea'));viewer.init(descriptor);const first=readWindowFrame(descriptor.initialFrame);if(!first)throw new Error('Missing first player frame.');viewer.draw(first);standby=false;lastPacketAt=performance.now();send('ready');heartbeat();}catch(e){hold('Player 2 view could not load. Continue in split screen on Player 1.');send('error',{code:'renderer-setup'});console.error(e);}return;
 }
 if(m.generation!==generation)return;
 if(m.type==='frame'){
  const frame=readWindowFrame(m.frame);send('ack',{sequence:m.sequence});
  if(!frame){hold('Invalid presentation data. Return to Player 1.');send('error',{code:'invalid-frame'});return;}
  if(frames.length&&m.sequence<=frames.at(-1).sequence)return;
  lastPacketAt=performance.now();frames.push({sequence:m.sequence,frame,at:lastPacketAt});if(frames.length>2)frames.shift();standby=false;return;
 }
 if(m.type==='standby'){hold(typeof m.label==='string'?m.label.slice(0,180):'Menus are on Player 1.');frames=[];return;}
 if(m.type==='clear-input'){clearInput();return;}
 if(m.type==='graphics'){viewer?.graphics(m.graphics);return;}
 if(m.type==='preferences'){descriptor={...descriptor,...m.preferences};clearInput();return;}
 if(m.type==='host-closed'){hold('Primary window closed.');dispose();}
}
function bind(e){
 const m=e.data;if(e.origin!==location.origin||e.source!==window.opener||m?.type!=='player-window-bind'||m.version!==PLAYER_WINDOW_VERSION||m.session!==session||m.capability!==capability||!e.ports[0])return;
 port?.close();port=e.ports[0];port.onmessage=e=>receive(e.data);port.start();heartbeat();
}
window.addEventListener('message',bind);
function dispose(){if(disposed)return;disposed=true;send('closed');clearInput();port?.close();viewer?.dispose();window.removeEventListener('message',bind);}
window.addEventListener('pagehide',dispose);
for(const type of ['focus','blur'])window.addEventListener(type,()=>{clearInput(true);heartbeat();});
document.addEventListener('visibilitychange',()=>{clearInput();heartbeat();});
window.addEventListener('keydown',e=>{
 if(standby||!descriptor||e.target.closest?.('button,input,select,textarea')||!gameplayKey(e.code,descriptor.controls,true)||e.metaKey||e.altKey)return;e.preventDefault();keys[e.code]=true;
});window.addEventListener('keyup',e=>keys[e.code]=false);
let drag=null;const canvas=$('sea');canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);canvas.focus();});canvas.addEventListener('pointermove',e=>{if(drag){viewer?.orbit(e.clientX-drag[0],e.clientY-drag[1]);drag=[e.clientX,e.clientY];}});for(const type of ['pointerup','pointercancel'])canvas.addEventListener(type,()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();viewer?.zoom(e.deltaY);},{passive:false});
$('pause').onclick=pauseRequest;$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('message').textContent='Use your browser fullscreen shortcut.';}};
function frame(now){
 if(disposed)return;requestAnimationFrame(frame);
 if(now-lastHeartbeat>30){heartbeat();lastHeartbeat=now;}
 const latest=frames.at(-1),focused=document.hasFocus()&&document.visibilityState==='visible',pads=navigator.getGamepads?.()||[];
 if(focused&&descriptor&&!standby&&now-lastInput>15){
  const controls=sample(keys,{},pads,true);
  controls.forEach((c,i)=>{if(!primeButtons&&c.pause&&!padPause[i])pauseRequest();if(!primeButtons&&c.camera&&!padCamera[i]){if(i===1)viewer?.camera();else command({kind:'camera',player:0});}padPause[i]=c.pause;padCamera[i]=c.camera;});primeButtons=false;
  send('input',{sequence:++inputSequence,controls:normalizeWindowControls(controls)});lastInput=now;
 }
 if(standby||!latest){updateGamepadRumble(haptics,null,pads,descriptor?.rumble,now);return;}
 if(now-lastPacketAt>700){hold('Primary window is not responding. Resume from Player 1.');return;}
 const a=frames[0],b=latest,renderTime=Math.min(b.frame.time,a.frame.time+Math.max(0,(now-b.at)/1000)),f=interpolateWindowFrame(a.frame,b.frame,renderTime);
 viewer.draw(f);$('standby').hidden=false;
 if(f.phase==='results'){hold('Race finished. Results and the next course are on Player 1.');return;}
 $('standby').hidden=true;$('hud').hidden=false;const r=f.racers[1];
 $('title').textContent='P2 · '+(descriptor.names?.[r.id]||'Rider '+(r.id+1))+(f.freeRide?' · FREE RIDE':' · LAP '+Math.min(r.lap,descriptor.laps)+'/'+descriptor.laps);
 $('status').textContent=r.wipeout?'WIPEOUT · TAP THROTTLE TO REMOUNT':f.time-r.eventTime<2?r.event:'';
 $('power').textContent=f.freeRide?r.stunt.score+' pts · '+r.stunt.rings+' rings':'POWER '+r.power+'/5 · MISSES '+r.misses+'/5';$('speed').textContent=Math.round(r.speed*3.6)+' km/h';$('notice').textContent=f.phase==='paused'?'RACE PAUSED':f.phase==='countdown'?String(Math.ceil(f.countdown)):'';$('pause').textContent=f.phase==='paused'?'Resume both':'Pause both';
 updateGamepadRumble(haptics,focused?{mode:'versus',phase:f.phase,time:f.time,racers:f.racers}:null,pads,descriptor.rumble,now);
}
if(!/^[a-f0-9]{32}$/.test(session??'')||!/^[a-f0-9]{32}$/.test(capability??'')||!window.opener)hold('Open Player 2 from the two-player display menu.');
else{window.opener.postMessage({type:'player-window-hello',version:PLAYER_WINDOW_VERSION,session,capability},location.origin);requestAnimationFrame(frame);}
// Read-only telemetry in this presentation page; no input/progress shortcuts.
Object.defineProperty(window,'__stormPlayerQA',{value:Object.freeze({snapshot:()=>({generation,standby,sequence:frames.at(-1)?.sequence??0,time:frames.at(-1)?.frame.time??0,phase:frames.at(-1)?.frame.phase??'standby',focused:document.hasFocus(),visible:document.visibilityState,renderer:viewer?.details,racers:frames.at(-1)?.frame.racers.map(r=>({player:r.player,x:r.x,z:r.z,throttle:r.throttle,speed:r.speed}))})})});
