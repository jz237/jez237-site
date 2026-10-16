import {createOnlinePeer} from './online-peer.js';
import {onlineToken,onlineGuestSetup,onlinePlayerInput,validateOnlineDescriptor} from './online-race-protocol.js';
import {readWindowFrame,interpolateWindowFrame,windowRacerHudSpeed} from './player-window-presentation.js';
import {nativeRaceNotice,nativeRaceDisplayWinner} from './native-race-notice.js';
import {createInputSampler} from './player-input.js';
import {gameplayKey} from './control-bindings.js';
import {fullPlayerViewport} from './player-window-protocol.js';
import {mountTouchControls} from './touch-controls.js';
import {readSave} from './race-records.js';
import {getCourse} from './courses.js';
import {createGamepadRumble,updateGamepadRumble,resetGamepadRumble} from './gamepad-rumble.js';
import {Soundscape} from './audio.js';

const $=id=>document.getElementById(id),saved=readSave(localStorage),audio=new Soundscape(),haptics=createGamepadRumble();audio.setOptions(saved.audio);
const sample=createInputSampler(()=>saved.controls),touch=mountTouchControls({onCamera:()=>viewer?.camera()});
for(const option of $('guestRider').options)if(saved.names?.[Number(option.value)])option.textContent=saved.names[Number(option.value)];
$('guestRider').value=String(saved.versus?.rider??2);
let peer=null,role=null,peerNonce=0,hostFrame=null,hostPort=null,hostCapability=null,hostGeneration=0,hostPhase='standby',guestSetup=null,
 viewer=null,descriptor=null,course=null,generation=0,frames=[],keys={},inputSequence=0,commandSequence=0,lastInputAt=0,lastFrameAt=0,
 guestLoaded=false,initNonce=0,stalePaused=false,padPause=false,padCamera=false,primePad=true,lastCue=0,drag=null,lastHostFrame=null;
const message=text=>$('onlineMessage').textContent=text;
const postHost=(type,data={})=>{try{hostPort?.postMessage({type,...data});}catch{message('The host view closed. Create a fresh connection.');}};
const activePeer=p=>p&&p===peer;
const currentPhase=()=>role==='host'?hostPhase:frames.at(-1)?.frame.phase??'standby';
function clearInput(){keys={};touch.reset();primePad=true;resetGamepadRumble(haptics);}
function setup(){const rider=Number($('guestRider').value);return onlineGuestSetup({rider,name:$('guestRider').selectedOptions[0].textContent,tune:{engine:0,grip:0,handling:0,...saved.settings[rider]}});}
function sendSetup(){const value=setup();if(role==='guest'&&peer?.connected&&value)peer.sendControl('setup',{setup:value});}
function toolbar(){
 const playing=document.body.classList.contains('in-game');for(const id of ['connectionButton','pauseOnline','leaveOnline'])$(id).hidden=!playing;
 for(const id of ['cameraOnline','soundOnline','qualityOnlineLabel'])$(id).hidden=!(playing&&role==='guest');
 $('pauseOnline').textContent=currentPhase()==='paused'?'Resume both':'Pause both';$('soundOnline').textContent=audio.enabled?'Sound on':'Sound off';
}
function hold(title,text,resume=false){$('onlineHold').hidden=false;$('holdTitle').textContent=title;$('holdMessage').textContent=text;$('holdResume').hidden=!resume;}
function openConnection(){if(document.body.classList.contains('in-game'))requestPause(true);$('onlineLobby').hidden=false;$('returnToRace').hidden=!document.body.classList.contains('in-game');clearInput();}
function returnToRace(){if(!document.body.classList.contains('in-game'))return;$('onlineLobby').hidden=true;clearInput();if(role==='guest')$('onlineSea').focus();}
function requestPause(paused){clearInput();if(role==='host')postHost('host-pause',{paused});else if(peer?.connected&&generation)peer.sendControl('pause',{generation,sequence:++commandSequence,paused});}
function hostLink(){if(peer?.session)postHost('link',{connection:peer.session,connected:peer.connected});if(guestSetup)postHost('setup',{setup:guestSetup});}
function makeHostFrame(){
 if(hostFrame){hostLink();return;}
 hostCapability=onlineToken();hostFrame=document.createElement('iframe');hostFrame.className='host-game';hostFrame.title='Player 1 online race';hostFrame.allow='autoplay; fullscreen; gamepad';hostFrame.style.visibility='hidden';
 const url=new URL('./race.html',location.href);url.searchParams.set('onlineHost','1');for(const key of ['qa','verify','nativePhysics'])if(new URLSearchParams(location.search).has(key))url.searchParams.set(key,'1');
 url.hash=new URLSearchParams({onlineBridge:hostCapability}).toString();hostFrame.src=url.href;document.body.append(hostFrame);
}
window.addEventListener('message',event=>{
 const m=event.data;if(role!=='host'||!hostFrame||event.source!==hostFrame.contentWindow||event.origin!==location.origin||m?.type!=='ats-online-host-hello'||m.capability!==hostCapability)return;
 hostPort?.close();const pair=new MessageChannel();hostPort=pair.port1;hostPort.onmessage=e=>handleHost(e.data);hostPort.start();
 hostFrame.contentWindow.postMessage({type:'ats-online-host-bind',capability:hostCapability},location.origin,[pair.port2]);hostLink();
});
async function handleHost(m){
 if(!m||typeof m!=='object'||role!=='host')return;
 if(m.type==='bound'){hostFrame.style.visibility='visible';document.body.classList.add('in-game');$('onlineLobby').hidden=true;$('onlineHold').hidden=true;toolbar();return;}
 if(m.type==='show-connection'){openConnection();return;}
 if(m.type==='init'){
  const d=validateOnlineDescriptor(m.descriptor);if(!d||!Number.isSafeInteger(m.generation)||m.generation<1){message('The race setup could not be shared. Restart the race.');return;}
  hostGeneration=m.generation;hostPhase=d.initialFrame.phase;toolbar();try{if(!await peer?.sendInit(hostGeneration,d))message('Waiting for the online connection. Reconnect before starting.');}catch{message('The race setup could not be sent. Create a fresh invite.');}return;
 }
 if(m.type==='frame'){
  hostPhase=m.frame.phase;if(new URLSearchParams(location.search).has('qa'))lastHostFrame=m.frame;toolbar();const target=peer;try{await target?.sendFrame(m.generation,m.frame);}catch{message('The network is busy. Both players can pause while it recovers.');}finally{postHost('frame-ack',{generation:m.generation});}return;
 }
 if(m.type==='standby'){hostPhase='standby';peer?.sendControl('standby',{label:m.label});toolbar();return;}if(m.type==='leave')peer?.sendControl('leave');
}
function makePeer(nextRole){
 const old=peer;peer=null;peerNonce++;old?.close();clearInput();guestLoaded=false;frames=[];generation=0;initNonce++;stalePaused=false;role=nextRole;
 if(role!=='host'&&hostFrame){hostPort?.close();hostPort=null;hostFrame.remove();hostFrame=null;}
 if(role==='host'&&viewer){viewer.dispose();viewer=null;descriptor=null;$('onlineSea').hidden=true;$('onlineHud').hidden=true;}
 const nonce=peerNonce;
 const value=createOnlinePeer({role,
  onConnection:connected=>{
   if(nonce!==peerNonce)return;if(role==='host'){hostLink();if(connected)makeHostFrame();}
   else if(connected){document.body.classList.add('in-game');$('onlineLobby').hidden=true;sendSetup();if(guestLoaded)peer.sendControl('ready',{generation});else hold('Connected','The host is choosing a race.');}
   if(!connected&&document.body.classList.contains('in-game')){clearInput();if(role==='guest')hold('Connection interrupted','Both riders will pause. Open Connection to make a fresh invite if it does not recover.');}toolbar();
  },
  onStatus:s=>{if(nonce!==peerNonce)return;$('connectionStatus').textContent=s.connected?'CONNECTED'+(s.rtt===null?'':' · '+s.rtt+' ms'):s.state==='failed'?'CONNECTION FAILED':s.state==='connecting'?'CONNECTING…':'TWO PLAYERS · ONLINE';if(s.state==='failed')message('A direct connection could not be established. Try a fresh invite or another network. Some networks require a relay, which is not enabled.');},
  onError:()=>{if(nonce===peerNonce)message('A connection message could not be used. Refresh both games and create a fresh invite.');},
  onInput:m=>{if(nonce===peerNonce&&role==='host'&&m.generation===hostGeneration)postHost('input',{generation:m.generation,sequence:m.sequence,control:m.control});},
  onFrame:m=>{if(nonce!==peerNonce||role!=='guest'||!guestLoaded||m.generation!==generation)return;const frame=readWindowFrame(m.frame);if(frame)receiveFrame(frame);},
  onControl:m=>{
   if(nonce!==peerNonce)return;if(m.type==='leave'){if(role==='host')postHost('leave');else hold('Host left the race','Open Connection to join another game.');clearInput();return;}
   if(role==='host'){if(m.type==='setup'){const value=onlineGuestSetup(m.setup);if(value){guestSetup=value;postHost('setup',{setup:value});}}else if(['ready','pause','heartbeat'].includes(m.type))postHost(m.type,m);}
   else if(m.type==='init')return initializeGuest(m);else if(m.type==='standby'){guestLoaded=false;frames=[];clearInput();hold('Waiting for the host',typeof m.label==='string'?m.label.slice(0,160):'The host is choosing the next race.');}
  }
 });peer=value;return value;
}
$('createInvite').onclick=async()=>{
 $('createInvite').disabled=true;let target;
 try{target=makePeer('host');message('Preparing a private invite…');const code=await target.invite();if(!activePeer(target))return;const url=new URL(location.href);url.hash=new URLSearchParams({invite:code}).toString();$('inviteLink').value=url.href;$('hostConnection').hidden=false;$('guestConnection').hidden=true;message('Send the invite link to your friend, then paste their return code below.');}
 catch(e){if(!target||activePeer(target))message(e.message);}finally{$('createInvite').disabled=false;}
};
$('joinInvite').onsubmit=async event=>{
 event.preventDefault();$('joinOnline').disabled=true;let target;
 try{audio.start();target=makePeer('guest');message('Preparing your return code…');const code=await target.answer($('friendInvite').value);if(!activePeer(target))return;$('answerCode').value=code;$('guestConnection').hidden=false;$('hostConnection').hidden=true;message('Send this return code to the host. Keep this page open.');}
 catch(e){if(!target||activePeer(target))message(e.message);}finally{$('joinOnline').disabled=false;}
};
$('acceptReturn').onsubmit=async event=>{event.preventDefault();try{message('Connecting the two riders…');if(!peer)throw new Error('Create an invite first.');await peer.acceptAnswer($('returnCode').value);}catch(e){message(e.message);}};
async function copy(id){const input=$(id);try{await navigator.clipboard.writeText(input.value);message('Copied. Send it to your friend.');}catch{input.focus();input.select();message('Select and copy this text, then send it to your friend.');}}
$('copyInvite').onclick=()=>copy('inviteLink');$('copyAnswer').onclick=()=>copy('answerCode');$('guestRider').onchange=sendSetup;
$('connectionButton').onclick=$('holdConnection').onclick=openConnection;$('returnToRace').onclick=returnToRace;
$('pauseOnline').onclick=()=>requestPause(currentPhase()!=='paused');$('holdResume').onclick=()=>requestPause(false);
$('cameraOnline').onclick=()=>viewer?.camera();$('soundOnline').onclick=()=>{audio.start();audio.setOptions({enabled:!audio.enabled});toolbar();};$('leaveOnline').onclick=()=>{peer?.close();location.href='./race';};
function graphics(){const view=fullPlayerViewport(innerWidth,innerHeight),ratio=Math.min(devicePixelRatio||1,2),scale=Math.min(ratio,3840/view.width,2160/view.height);return {width:Math.max(1,Math.floor(view.width*scale)),height:Math.max(1,Math.floor(view.height*scale)),quality:$('qualityOnline').value};}
function resize(){const view=fullPlayerViewport(innerWidth,innerHeight),canvas=$('onlineSea');canvas.style.cssText=`width:${view.width}px;height:${view.height}px;left:${view.x}px;top:${view.y}px`;viewer?.graphics(graphics());clearInput();}
$('qualityOnline').onchange=resize;window.addEventListener('resize',resize);
async function initializeGuest(m){
 const d=validateOnlineDescriptor(m.descriptor);if(!d||!Number.isSafeInteger(m.generation)||m.generation<1||m.generation<generation)throw new TypeError('Invalid online race setup');
 const target=peer,nonce=++initNonce;guestLoaded=false;clearInput();generation=m.generation;frames=[];hold('Preparing the water','Loading your full-resolution view. The race waits for both players.');
 const {createPlayerWindowRenderer}=await import('./player-window-renderer.js');if(nonce!==initNonce||!activePeer(target))return;
 viewer??=createPlayerWindowRenderer($('onlineSea'));descriptor=d;course=getCourse(d.course,d.difficulty);viewer.init({...d,graphics:graphics()});resize();
 const frame=readWindowFrame(d.initialFrame);viewer.draw(frame);receiveFrame(frame);guestLoaded=true;document.body.classList.add('in-game');$('onlineLobby').hidden=true;$('onlineSea').hidden=false;$('onlineHud').hidden=false;peer.sendControl('ready',{generation});$('onlineSea').focus();toolbar();
}
function receiveFrame(frame){
 const previous=frames.at(-1)?.frame;lastFrameAt=performance.now();frames.push({frame,at:lastFrameAt});if(frames.length>2)frames.shift();
 if(frame.nativeLaunchLabel!==undefined){const cue=frame.nativeCountdownCue;if(cue===null)lastCue=-1;else if(cue&&lastCue!=='native:'+cue.sequence){lastCue='native:'+cue.sequence;audio.signal(cue.number===0?'go':'countdown');}}else if(previous?.phase==='countdown'&&frame.phase==='running')audio.signal('go');else if(frame.phase==='countdown'&&Math.ceil(frame.countdown)!==lastCue){lastCue=Math.ceil(frame.countdown);audio.signal('countdown');}
 if(frame.phase==='results'&&previous?.phase!=='results')audio.signal('finish');toolbar();
}
const canvas=$('onlineSea');canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);canvas.focus();});canvas.addEventListener('pointermove',e=>{if(drag){viewer?.orbit(e.clientX-drag[0],e.clientY-drag[1]);drag=[e.clientX,e.clientY];}});
for(const type of ['pointerup','pointercancel'])canvas.addEventListener(type,()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();viewer?.zoom(e.deltaY);},{passive:false});
window.addEventListener('keydown',e=>{if(role!=='guest'||!guestLoaded||e.target.closest?.('input,textarea,select,button')||e.metaKey||e.altKey||!gameplayKey(e.code,saved.controls,false)&&!['Escape','Enter'].includes(e.code))return;e.preventDefault();keys[e.code]=true;if(e.repeat)return;if(e.code==='Escape'||e.code==='Enter')requestPause(currentPhase()!=='paused');});
window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{clearInput();if(document.hidden&&document.body.classList.contains('in-game'))requestPause(true);});
const heartbeat=setInterval(()=>{if(role==='guest'&&peer?.connected)peer.sendControl('heartbeat',{generation});},500);
const time=value=>{if(!Number.isFinite(value))return '—';return Math.floor(value/60)+':'+(value%60).toFixed(3).padStart(6,'0');};
function frame(now){
 requestAnimationFrame(frame);if(role!=='guest')return;
 const latest=frames.at(-1),stale=!peer?.connected||now-lastFrameAt>3500,pads=navigator.getGamepads?.()??[],visible=document.visibilityState==='visible';
 if(guestLoaded&&latest&&stale&&!stalePaused){stalePaused=true;requestPause(true);hold('Connection interrupted','The race pauses while the connection recovers. Open Connection for a fresh invite.');}if(!stale)stalePaused=false;
 const drive=guestLoaded&&latest&&!stale&&visible&&$('onlineLobby').hidden&&['running','countdown'].includes(latest.frame.phase);touch.setActive(!!drive);
 if(drive&&now-lastInputAt>=25){const c=touch.apply(sample(keys,touch.keys(),pads,false));if(!primePad&&c.pause&&!padPause)requestPause(currentPhase()!=='paused');if(!primePad&&c.camera&&!padCamera)viewer?.camera();padPause=c.pause;padCamera=c.camera;primePad=false;const control=onlinePlayerInput(c);if(control)peer.sendInput({generation,sequence:++inputSequence,control});lastInputAt=now;}
 if(!guestLoaded||!latest||!viewer||stale){audio.setRaceMusic({...audio.raceMusicContext,held:true});audio.update(0,0,false,true,0);resetGamepadRumble(haptics);return;}
 const a=frames[0],b=latest,renderTime=Math.min(b.frame.time,a.frame.time+Math.max(0,(now-b.at)/1000)),f=interpolateWindowFrame(a.frame,b.frame,renderTime),r=f.racers[1];
 viewer.draw(f);$('onlineRiderTitle').textContent='P2 · '+(descriptor.names[r.id]||'Rider '+(r.id+1))+(f.freeRide?' · FREE RIDE':' · LAP '+Math.min(r.lap,descriptor.laps)+'/'+descriptor.laps);
 $('onlineProgress').textContent=f.freeRide?r.stunt.rings+' rings · '+r.stunt.score+' points':'POWER '+r.power+'/5 · MISSES '+r.misses+'/5';
 const rival=f.racers[0];$('onlineSession').textContent=f.freeRide?'P1 · '+rival.stunt.rings+' rings · '+rival.stunt.score+' points':'TIME '+time(r.nativeTelemetry?r.raceTime:f.time)+' · P1 '+(rival.dq?'DISQUALIFIED':rival.finishTime!==null?'FINISHED '+time(rival.finishTime):'LAP '+Math.min(rival.lap,descriptor.laps)+'/'+descriptor.laps);
 $('onlineNotice').textContent=f.nativeLaunchLabel|| (f.phase==='countdown'?String(Math.max(1,Math.ceil(f.countdown))):r.wipeout?'WIPEOUT · TAP THROTTLE TO REMOUNT':nativeRaceNotice(r)|| (f.time-r.eventTime<2?r.event:''));$('onlineSpeed').textContent=windowRacerHudSpeed(r)+' km/h';
 if(f.phase==='paused')hold('Race paused','Either player can resume when both are ready.',true);else if(f.phase==='results'){
  const finished=f.racers.filter(q=>q.finishTime!==null&&!q.dq).sort((x,y)=>x.finishTime-y.finishTime),remaining=f.racers.filter(q=>!q.dq),
   winner=r.nativePlace!==undefined?nativeRaceDisplayWinner(f.racers):finished[0]??(remaining.length===1?remaining[0]:null);
  hold(winner?'Player '+(winner.player+1)+' wins':'Race finished',f.racers.map(q=>'P'+(q.player+1)+' · '+(q.dq||time(q.finishTime))).join(' · ')+'. The host can restart or choose another course.');
 }else $('onlineHold').hidden=true;
 const paused=f.phase!=='running'||!visible;audio.setRaceMusic({session:generation,course:descriptor.course,phase:f.phase,place:(Number.isInteger(r.nativePlace)?r.nativePlace+1:(f.racers.filter(q=>q.finishTime!==null&&!q.dq).sort((a,b)=>a.finishTime-b.finishTime).findIndex(q=>q.player===r.player)+1)),disqualified:!!r.dq,held:!visible});audio.update(r.speed*.45,f.weather.storm,false,paused,f.time,r.hydro.wet,null,r.throttle,r.mount==='dolphin');audio.updateRide(r,Math.max(0,f.water.level-course.ground(r.x,r.z)),f.time,paused);audio.updateRivals(r,f.racers,paused);
 updateGamepadRumble(haptics,{mode:'versus',phase:f.phase,time:f.time,racers:[{...r,player:0},{...f.racers[0],player:1}]},pads,saved.rumble,now);
}
const invite=new URLSearchParams(location.hash.slice(1)).get('invite');if(invite){$('friendInvite').value=invite;message('Choose your rider, then make a return code for your friend.');history.replaceState(null,'',location.pathname+location.search);}
resize();toolbar();requestAnimationFrame(frame);window.addEventListener('pagehide',()=>{clearInterval(heartbeat);peer?.close();hostPort?.close();viewer?.dispose();resetGamepadRumble(haptics);audio.ctx?.close();});
function waterHash(frame){const heights=frame?.water.native?.heightQ;if(!heights)return null;let h=2166136261;for(const n of heights){h^=n&65535;h=Math.imul(h,16777619)>>>0;}return h;}
if(new URLSearchParams(location.search).has('qa'))Object.defineProperty(window,'__stormOnlineQA',{value:Object.freeze({snapshot:()=>({role,connected:!!peer?.connected,network:peer?.snapshot(),generation:role==='host'?hostGeneration:generation,phase:currentPhase(),loaded:guestLoaded,host:hostFrame?.contentWindow.__stormQA?.snapshot(),hostWaterHash:waterHash(lastHostFrame),guestWaterHash:waterHash(frames.at(-1)?.frame),guest:frames.at(-1)?.frame?{time:frames.at(-1).frame.time,phase:frames.at(-1).frame.phase,racers:frames.at(-1).frame.racers.map(q=>({player:q.player,x:q.x,z:q.z,speed:q.speed,lap:q.lap,power:q.power,raceTime:q.raceTime,misses:q.misses,dq:q.dq})),waterRevision:frames.at(-1).frame.water.native?.revision}:null,renderer:viewer?.details})})});
