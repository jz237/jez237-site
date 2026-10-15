import {PLAYER_WINDOW_VERSION,envelope,validEnvelope,validHandshake,connectionToken,createWindowInputMailbox,LINK_STALE_MS} from './player-window-protocol.js';

export function createPlayerWindowHost({window:win=globalThis.window,now=()=>performance.now(),onChange=()=>{},onFallback=()=>{},onTick=()=>{},onCommand=()=>{},onFocus=()=>{}}={}){
 const session=connectionToken(win.crypto),capability=connectionToken(win.crypto),mailbox=createWindowInputMailbox();
 let child=null,port=null,generation=0,descriptor=null,ready=false,lastPing=-Infinity,openedAt=0,focused=false,visible=false,commandSequence=-1,inFlight=false,pending=null,frameSequence=0,status='';
 const post=(type,data={})=>{try{port?.postMessage(envelope(session,generation,type,data));return !!port;}catch{fallback('Player 2 connection ended.');return false;}};
 const flush=()=>{if(!ready||inFlight||!pending)return;const frame=pending;pending=null;inFlight=true;post('frame',{sequence:++frameSequence,frame});};
 function clearLink(){port?.close();port=null;ready=false;focused=false;visible=false;inFlight=false;pending=null;mailbox.reset();}
 function fallback(reason){if(!child&&!port)return;clearLink();child=null;status=reason;onFallback(reason);onChange();}
 function requestHandshake(){
  // window.open can return the still-open named view after a stale-link
  // fallback. That document does not reload or repeat its initial hello.
  try{child?.postMessage({type:'player-window-reconnect',version:PLAYER_WINDOW_VERSION,session,capability},win.location.origin);}
  catch{fallback('Player 2 connection ended.');}
 }
 function init(){if(descriptor){ready=false;inFlight=false;pending=null;mailbox.reset();commandSequence=-1;post('init',{descriptor});}else post('standby',{label:'Choose a two-player course on Player 1.'});}
 function receive(message){
  if(!validEnvelope(message,session,generation))return;
  const time=now();
  if(message.type==='heartbeat'){
   if(typeof message.focused!=='boolean'||typeof message.visible!=='boolean')return;
   lastPing=time;const nextFocus=!!descriptor&&message.focused,changed=focused!==nextFocus||visible!==message.visible;focused=nextFocus;visible=message.visible;if(changed){mailbox.clear();onFocus(focused);}if(visible&&ready)onTick(time);return;
  }
  if(message.type==='ready'){ready=true;lastPing=time;status='Player 2 connected';onChange();flush();return;}
  if(message.type==='input'){if(focused)mailbox.accept(message,time);return;}
  if(message.type==='ack'){if(message.sequence===frameSequence){inFlight=false;flush();}return;}
  if(message.type==='command'){
   if(!focused||!Number.isSafeInteger(message.sequence)||message.sequence<=commandSequence)return;
   const c=message.command;if(!c||!(c.kind==='pause'&&typeof c.paused==='boolean'||c.kind==='camera'&&[0,1].includes(c.player)))return;
   commandSequence=message.sequence;onCommand(c);return;
  }
  if(message.type==='error')fallback('Player 2 could not prepare its view. Split screen is available.');
  if(message.type==='closed')fallback('Player 2 window closed. The race is paused.');
 }
 function handshake(event){
  if(!child||event.source!==child||event.origin!==win.location.origin||!validHandshake(event.data,session,capability))return;
  clearLink();const channel=new win.MessageChannel();port=channel.port1;port.onmessage=e=>receive(e.data);port.start?.();lastPing=now();openedAt=now();
  child.postMessage({type:'player-window-bind',version:PLAYER_WINDOW_VERSION,session,capability},win.location.origin,[channel.port2]);init();
 }
 win.addEventListener('message',handshake);
 return {
  // Only call from a real in-product click/keyboard activation.
  open(){
   if(child&&!child.closed){child.focus();if(!port||!ready)requestHandshake();return !!child;}
   const url=new URL('./player-window.html',win.location.href);url.hash=new URLSearchParams({session,capability}).toString();
   try{child=win.open(url.href,'after-storm-p2-'+session,'popup,width=1280,height=720');}catch{child=null;}
   if(!child){status='Player 2 window was blocked. Allow it, then use Open Player 2.';onChange();return false;}
   openedAt=now();lastPing=openedAt;status='Preparing Player 2…';onChange();requestHandshake();return !!child;
  },
  begin(value){generation++;descriptor=value;ready=false;lastPing=now();openedAt=now();init();onChange();},
  standby(label='Menus are on Player 1.'){descriptor=null;ready=false;focused=false;pending=null;inFlight=false;mailbox.reset();post('standby',{label});},
  publish(frame){if(!child||!ready)return;pending=frame;flush();},
  configure(graphics){if(descriptor)descriptor={...descriptor,graphics};post('graphics',{graphics});},
  preferences(value){if(descriptor)descriptor={...descriptor,...value};post('preferences',{preferences:value});},
  poll(){
   if(!child)return;const time=now();if(child.closed){fallback('Player 2 window closed. The race is paused.');return;}
   // A bound black menu/replay view is an established connection, not a course
   // loader. It can remain in standby indefinitely while heartbeats are fresh.
   const loading=!port||!!descriptor&&!ready;
   if(loading&&time-openedAt>20000)fallback('Player 2 did not finish loading. Split screen is available.');
   else if(port&&!loading&&time-lastPing>LINK_STALE_MS)fallback('Player 2 connection lost. The race is paused.');
  },
  remoteControls(){return mailbox.sample(now());},
  clearInput(){mailbox.clear();post('clear-input');},
  dispose(){win.removeEventListener('message',handshake);post('host-closed');clearLink();try{child?.close();}catch{}child=null;},
  get attached(){return !!child&&!child.closed;},get ready(){return ready;},get holding(){return !!child&&!!descriptor&&!ready;},get remoteFocused(){return focused&&now()-lastPing<LINK_STALE_MS;},
  get participating(){return !!child&&(!ready&&!!descriptor&&now()-openedAt<20000||now()-openedAt<1500||focused&&now()-lastPing<LINK_STALE_MS);},
  get status(){return status;},get generation(){return generation;},get session(){return session;}
 };
}
