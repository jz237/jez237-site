import {onlinePlayerInput,onlineGuestSetup,ONLINE_LINK_STALE_MS} from './online-race-protocol.js';
import {createWindowInputMailbox,neutralWindowControls} from './player-window-protocol.js';

export function embeddedOnlineCapability(win=globalThis.window){
 if(win.parent===win||!new URL(win.location.href).searchParams.has('onlineHost'))return null;
 const value=new URLSearchParams(new URL(win.location.href).hash.slice(1)).get('onlineBridge');return /^[a-f0-9]{32}$/.test(value??'')?value:null;
}
// Same-origin iframe transport adapter. The surrounding lobby owns WebRTC;
// this existing game remains the ONLY race, water and collision authority.
export function createOnlineHostBridge({capability,window:win=globalThis.window,now=()=>performance.now(),onChange=()=>{},onFallback=()=>{},onCommand=()=>{},onReconnect=()=>{},onSetup=()=>{}}={}){
 if(!/^[a-f0-9]{32}$/.test(capability??''))throw new TypeError('Invalid online host capability');
 const mailbox=createWindowInputMailbox();let port=null,connection=null,connected=false,loaded=false,stale=false,generation=0,descriptor=null,
  lastHeartbeat=now(),beganAt=now(),lastFrameAt=-Infinity,lastSentPhase=null,inFlight=false,disposed=false,status='Connecting online player…',commandSequence=-1;
 const post=(type,data={})=>{try{port?.postMessage({type,...data});return !!port;}catch{return false;}};
 function unavailable(reason){mailbox.clear();inFlight=false;if(!stale){stale=true;status=reason;onFallback(reason);onChange();}}
 function receive(m){
  if(!m||typeof m!=='object')return;
  if(m.type==='link'){
   if(typeof m.connected!=='boolean'||typeof m.connection!=='string'||!/^[a-f0-9]{32}$/.test(m.connection))return;
   const fresh=connection!==m.connection;connection=m.connection;connected=m.connected;lastHeartbeat=now();
   if(fresh){loaded=false;commandSequence=-1;mailbox.reset();inFlight=false;stale=false;status='Online player connected';if(descriptor)onReconnect();}
   if(!connected)unavailable('Online connection interrupted. Both riders are paused.');
   else{stale=false;status=loaded?'Online player connected':'Preparing online player…';onChange();}return;
  }
  if(m.type==='setup'){const setup=onlineGuestSetup(m.setup);if(setup)onSetup(setup);return;}
  if(m.type==='frame-ack'){if(m.generation===generation)inFlight=false;return;}
  if(m.type==='heartbeat'){lastHeartbeat=now();if(connected&&stale){stale=false;status='Online player reconnected. Resume when ready.';onChange();}return;}
  if(m.type==='ready'&&m.generation===generation){loaded=true;lastHeartbeat=now();stale=false;status='Online player connected';onChange();return;}
  if(m.type==='input'&&m.generation===generation&&connected&&loaded&&!stale){
   const control=onlinePlayerInput(m.control);if(control)mailbox.accept({sequence:m.sequence,controls:[neutralWindowControls()[0],control]},now());return;
  }
  if(m.type==='pause'&&m.generation===generation&&connected&&Number.isSafeInteger(m.sequence)&&m.sequence>commandSequence&&typeof m.paused==='boolean'){
   commandSequence=m.sequence;mailbox.clear();onCommand({kind:'pause',paused:m.paused});return;
  }
  if(m.type==='leave'){connected=false;unavailable('Player 2 left. Both riders are paused.');}
  if(m.type==='host-pause'&&typeof m.paused==='boolean'){mailbox.clear();onCommand({kind:'pause',paused:m.paused});}
 }
 function bind(event){
  const m=event.data;if(disposed||event.source!==win.parent||event.origin!==win.location.origin||m?.type!=='ats-online-host-bind'||m.capability!==capability||!event.ports?.[0])return;
  port?.close();port=event.ports[0];port.onmessage=e=>receive(e.data);port.start?.();post('bound');
 }
 win.addEventListener('message',bind);
 win.parent.postMessage({type:'ats-online-host-hello',capability},win.location.origin);
 return {online:true,
  open(){if(!connected)post('show-connection');return connected;},
  begin(value){generation++;descriptor=value;loaded=false;stale=false;beganAt=now();lastHeartbeat=now();lastFrameAt=-Infinity;lastSentPhase=null;inFlight=false;commandSequence=-1;mailbox.reset();post('init',{generation,descriptor});onChange();},
  standby(label='Host is choosing a race.'){descriptor=null;loaded=false;inFlight=false;mailbox.reset();post('standby',{label});},
  publish(frame){if(!connected||!loaded||stale||inFlight||now()-lastFrameAt<50)return;lastFrameAt=now();lastSentPhase=frame.phase;inFlight=true;if(!post('frame',{generation,frame}))inFlight=false;},
  configure(){},preferences(){},clearInput(){mailbox.clear();lastFrameAt=-Infinity;},remoteControls(){return connected&&loaded&&!stale?mailbox.sample(now()):neutralWindowControls();},
  poll(){
   if(disposed||!descriptor)return;
   if(!connected)unavailable('Online connection interrupted. Both riders are paused.');
   else if(!loaded&&now()-beganAt>60000)unavailable('Player 2 is still preparing. Both riders are paused.');
   else if(loaded&&now()-lastHeartbeat>ONLINE_LINK_STALE_MS)unavailable('Player 2 stopped responding. Both riders are paused.');
  },
  dispose(){disposed=true;post('leave');port?.close();port=null;mailbox.reset();win.removeEventListener('message',bind);},
  get attached(){return !disposed;},get ready(){return connected&&loaded&&!stale;},get holding(){return !!descriptor&&(!connected||!loaded||stale);},
  get wantsFrame(){return connected&&loaded&&!stale&&!inFlight&&now()-lastFrameAt>=(['paused','results'].includes(lastSentPhase)?1000:50);},get remoteFocused(){return false;},
  get participating(){try{return connected&&win.parent.document.visibilityState==='visible';}catch{return false;}},get connected(){return connected;},
  get status(){return status;},get generation(){return generation;}
 };
}
