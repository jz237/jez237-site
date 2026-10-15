// A second presentation never owns a race. Messages contain bounded input or
// display data, scoped to one host and one fresh race generation.
export const PLAYER_WINDOW_VERSION=1;
export const INPUT_STALE_MS=250;
export const LINK_STALE_MS=1800;
const finite=(n,min=-1e9,max=1e9)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const token=s=>typeof s==='string'&&/^[a-f0-9]{32}$/.test(s);
export function connectionToken(crypto=globalThis.crypto){const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);return Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');}
export function validEnvelope(m,session,generation){return plain(m)&&m.version===PLAYER_WINDOW_VERSION&&token(m.session)&&m.session===session&&Number.isSafeInteger(m.generation)&&m.generation>=0&&(generation===undefined||m.generation===generation);}
export function envelope(session,generation,type,data={}){return {version:PLAYER_WINDOW_VERSION,session,generation,type,...data};}
export function validHandshake(m,session,capability){return plain(m)&&m.type==='player-window-hello'&&m.version===PLAYER_WINDOW_VERSION&&m.session===session&&m.capability===capability&&token(session)&&token(capability);}
const tricks=new Set(['','flip','left','right','stand','handstand','backwards','somersault']);
const bools=['brake','rescue','slide','dampen','dive'];
export function normalizeWindowControls(pair){
 if(!Array.isArray(pair)||pair.length!==2)return null;
 const out=[];
 for(const p of pair){
  if(!plain(p)||!finite(p.throttle,0,1)||!finite(p.steer,-1,1)||!finite(p.lean??0,-1,1)||!tricks.has(p.trick??''))return null;
  if(bools.some(k=>p[k]!==undefined&&typeof p[k]!=='boolean'))return null;
  out.push({throttle:p.throttle,steer:p.steer,lean:p.lean??0,trick:p.trick??'',...Object.fromEntries(bools.map(k=>[k,!!p[k]]))});
 }
 return out;
}
export const neutralWindowControls=()=>normalizeWindowControls([{throttle:0,steer:0},{throttle:0,steer:0}]);
export function createWindowInputMailbox(){
 let seq=-1,at=-Infinity,controls=neutralWindowControls();
 return {accept(message,now){const next=normalizeWindowControls(message.controls);if(!next||!Number.isSafeInteger(message.sequence)||message.sequence<=seq||!finite(now,0))return false;seq=message.sequence;at=now;controls=next;return true;},
  sample(now){return now>=at&&now-at<=INPUT_STALE_MS?controls:neutralWindowControls();},
  clear(){at=-Infinity;controls=neutralWindowControls();},reset(){seq=-1;at=-Infinity;controls=neutralWindowControls();},get ageAt(){return at;}};
}
// A clock shared by local and remote wake requests. Consuming the same elapsed
// interval twice cannot accelerate physics, even with two 144 Hz monitors.
export function createWindowPumpClock(now=0){let last=now;return {reset(now){last=now;},elapsed(now,active=true){if(!finite(now,0)||now<last)return 0;const dt=(now-last)/1000;last=now;return active?Math.min(dt,1):0;}};}
export function fullPlayerViewport(width,height){
 width=Math.max(1,Math.floor(width));height=Math.max(1,Math.floor(height));
 const w=Math.max(1,Math.min(width,Math.floor(height*16/9))),h=Math.max(1,Math.min(height,Math.floor(w*9/16)));
 return {x:Math.floor((width-w)/2),y:Math.floor((height-h)/2),width:w,height:h};
}
export function validDisplaySize(value){return plain(value)&&Number.isInteger(value.width)&&Number.isInteger(value.height)&&value.width>=1&&value.height>=1&&value.width<=8192&&value.height<=8192&&value.width*value.height<=16777216;}
