// Haptic events are observed from actual simulation transitions. Nothing is
// scheduled: the next render update mixes the current event and replaces it.
// Actuator API: https://www.w3.org/TR/gamepad/#gamepadhapticactuator-interface
export const RUMBLE_INTERVAL_MS=100;
export const DEFAULT_RUMBLE_PREFERENCES=Object.freeze({enabled:true,strength:Object.freeze([.25,.25])});
const mixers=new WeakMap(),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const numeric=(v,fallback=0)=>typeof v==='number'&&Number.isFinite(v)?v:fallback;
const clock=()=>globalThis.performance?.now?.()??Date.now();

export function createGamepadRumble(){const mixer=Object.freeze({});mixers.set(mixer,{slots:[null,null],devices:new Map(),race:null,now:0});return mixer;}

function actuatorFor(pad){
 if(!pad||pad.connected===false)return null;
 try{
  const candidates=[pad.vibrationActuator,...(pad.hapticActuators??[])];
  for(const actuator of candidates){if(!actuator)continue;
   const effects=actuator.effects;
   if(typeof actuator.playEffect==='function'&&(effects===undefined||Array.from(effects).includes('dual-rumble')))return {actuator,kind:'dual-rumble'};
   if(typeof actuator.pulse==='function')return {actuator,kind:'pulse'};
  }
 }catch{}return null;
}

function safely(device,store,action){
 const generation=device.generation;
 const rejected=()=>{if(device.generation===generation)device.failedUntil=store.now+1000;};
 try{Promise.resolve(action()).catch(rejected);return true;}catch{rejected();return false;}
}

function stopDevice(device,store){
 device.generation++;if(!device.playing)return;
 device.playing=false;device.until=0;
 // A legacy pulse-only implementation may have no reset. Every emitted pulse
 // lasts at most 80 ms; no delayed work can restart it after cancellation.
 if(typeof device.actuator.reset==='function')safely(device,store,()=>device.actuator.reset());
}

function clear(store){for(const device of store.devices.values())stopDevice(device,store);store.slots=[null,null];store.race=null;}
export function resetGamepadRumble(mixer){const store=mixers.get(mixer);if(store)clear(store);}

function snapshot(racer){return {collision:numeric(racer.collision),landing:numeric(racer.hydro?.landingId),load:numeric(racer.hydro?.load,1),wipeout:!!racer.wipeout};}
function strengthAt(preferences,player){const value=preferences?.strength?.[player];return value===undefined?.25:clamp(numeric(value),0,1);}
function offer(slot,pulse,now){
 if(!slot.pending||slot.pending.expires<=now||pulse.priority>=slot.pending.priority)slot.pending={...pulse,expires:now+180};
}
function observe(slot,racer,now){
 const old=slot.previous,next=snapshot(racer),hydro=racer.hydro??{},speed=Math.max(0,numeric(racer.speed));
 if(next.collision>.05&&(old.collision<=.05||next.collision-old.collision>.15)||next.wipeout&&!old.wipeout){offer(slot,{priority:3,strong:clamp(.55+speed/70,.55,1),weak:.5,duration:80},now);}
 if(next.landing>old.landing&&numeric(hydro.impact)>1.5){const impact=numeric(hydro.impact);offer(slot,{priority:2,strong:clamp(impact/12,.15,.9),weak:clamp(impact/18,.1,.65),duration:80},now);}
 // Hull loading gives each wave a short tactile contact. A steady engine or
 // constant load cannot repeatedly vibrate the pad, even at full throttle.
 if(next.load>1.8&&old.load<=1.8&&speed>7&&numeric(hydro.wet)>.2&&!hydro.airborne&&now-slot.lastChop>=350){offer(slot,{priority:1,strong:clamp((next.load-1)*.12,.1,.35),weak:.06,duration:55},now);slot.lastChop=now;}
 slot.previous=next;
}

function dispatch(device,pulse,strength,store){
 if(store.now-device.last<RUMBLE_INTERVAL_MS-1e-6||store.now<device.failedUntil)return false;
 const duration=Math.min(80,pulse.duration),strong=clamp(pulse.strong*strength,0,1),weak=clamp(pulse.weak*strength,0,1);
 device.last=store.now;device.until=store.now+duration;device.playing=true;
 return safely(device,store,()=>device.kind==='dual-rumble'?device.actuator.playEffect('dual-rumble',{startDelay:0,duration,strongMagnitude:strong,weakMagnitude:weak}):device.actuator.pulse(Math.max(strong,weak),duration));
}

// Call after physics with the requestAnimationFrame timestamp (milliseconds).
// Pass null for menus, instant replay, inspection holds, or a hidden document.
// Browser gamepad array indices remain the same as player-input.js.
export function updateGamepadRumble(mixer,state,pads,preferences=DEFAULT_RUMBLE_PREFERENCES,now=clock()){
 const store=mixers.get(mixer);if(!store)return 0;
 if(!Number.isFinite(now)){clear(store);return 0;}
 if(now<store.now)clear(store);store.now=now;
 const enabled=preferences?.enabled===undefined||preferences.enabled===true;
 if(!enabled||state?.phase!=='running'||state.demoRun||!Array.isArray(state.racers)){clear(store);return 0;}
 if(store.race!==state){clear(store);store.race=state;}
 const count=state.mode==='versus'?2:1,used=new Set();let emitted=0;
 for(let player=0;player<2;player++){
  const racer=player<count?state.racers.find(r=>r.player===player&&r.human!==false)??state.racers[player]:null;
  const target=player<count&&racer&&racer.human!==false&&!racer.dq&&(racer.finishTime===undefined||racer.finishTime===null)?actuatorFor(pads?.[player]):null;
  const strength=strengthAt(preferences,player);let slot=store.slots[player];
  if(!target||strength<=0){if(slot)stopDevice(slot.device,store);store.slots[player]=null;continue;}
  let device=store.devices.get(target.actuator);
  if(!device){device={...target,last:-Infinity,failedUntil:0,playing:false,until:0,generation:0};store.devices.set(target.actuator,device);}
  if(device.until<=now)device.playing=false;used.add(device);
  if(!slot||slot.device!==device||slot.racer!==racer){if(slot&&slot.device!==device)stopDevice(slot.device,store);slot={device,racer,previous:snapshot(racer),pending:null,lastChop:-Infinity};store.slots[player]=slot;continue;}
  observe(slot,racer,now);
  if(slot.pending?.expires<=now)slot.pending=null;
  if(slot.pending&&now-device.last>=RUMBLE_INTERVAL_MS-1e-6&&now>=device.failedUntil){if(dispatch(device,slot.pending,strength,store))emitted++;slot.pending=null;}
 }
 // Keep throttle timestamps through pauses and short disconnects. The small
 // device cache also prevents an accumulation of unplugged controller objects.
 for(const [actuator,device] of store.devices){if(!used.has(device))stopDevice(device,store);if(store.devices.size>8&&!used.has(device))store.devices.delete(actuator);}
 return emitted;
}
