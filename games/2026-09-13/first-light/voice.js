// Ray's voice at runtime. Pure picking rules (no immediate repeat per event, one line at a time,
// a short cooldown, higher-priority lines interrupt lower ones) and a thin player: HTMLAudio clips
// from assets/voice, with the browser's speech synthesis as the fallback when a clip is missing
// or blocked, and silence when the volume is off. Nothing here throws on a missing file.
import {RAY,PRIORITY,lineFile} from './voice-lines.js';
export function createVoiceState(){return {last:{},busyUntil:0,busyPriority:0,spokenAt:{},count:0,log:[]};}
// pick a variant that is not the one used last time for this event
export function pickVariant(pool,last,random=Math.random){if(!pool||!pool.length)return -1;if(pool.length===1)return 0;let i=Math.floor(random()*pool.length);if(i===last)i=(i+1+Math.floor(random()*(pool.length-1)))%pool.length;return i;}
// should this event speak now? minGap: the same event will not repeat inside this many seconds
const MIN_GAP={slack:6,overload:4,bite:2,bait_showing:180,check_line:30,follow:8};
export function decide(state,event,t,seconds=2.2){
 if(!RAY[event])return null;const pr=PRIORITY[event]||1;
 const gap=MIN_GAP[event]||0;if(gap&&state.spokenAt[event]!==undefined&&t-state.spokenAt[event]<gap)return null;
 if(t<state.busyUntil&&pr<=state.busyPriority)return null; // someone is talking and outranks this
 const n=pickVariant(RAY[event],state.last[event]);if(n<0)return null;
 state.last[event]=n;state.spokenAt[event]=t;state.busyUntil=t+seconds;state.busyPriority=pr;state.count++;state.log.push({t:+t.toFixed(2),event,n});if(state.log.length>60)state.log.shift();
 return {event,n,text:RAY[event][n],file:lineFile(event,n),priority:pr};
}
// the player: clips cached once loaded; a clip that fails falls back to speech synthesis
export function createVoice({base='./',volume=.8,enabled=true,now=()=>performance.now()/1000}={}){
 const state=createVoiceState();const cache=new Map();let current=null,vol=volume,on=enabled,failed=0,synthUsed=0;
 function clip(file){if(cache.has(file))return cache.get(file);const a=new Audio(base+file);a.preload='auto';cache.set(file,a);return a;}
 function synth(text){try{if(!('speechSynthesis' in globalThis))return false;const u=new SpeechSynthesisUtterance(text);u.rate=.95;u.pitch=.85;u.volume=vol;speechSynthesis.cancel();speechSynthesis.speak(u);synthUsed++;return true;}catch{return false;}}
 function say(event,{force=false}={}){
  if(!on||vol<=0)return null;const t=now();const d=decide(state,event,t);if(!d)return null;
  if(current){try{current.pause();current.currentTime=0;}catch{}}
  const a=clip(d.file);a.volume=vol;current=a;
  const p=a.play();if(p&&p.catch)p.catch(()=>{failed++;synth(d.text);});
  a.onerror=()=>{failed++;synth(d.text);};
  return d;
 }
 let pendingId=null;
 function speak({id,text,file,seconds=null,priority=6,queued=false}){
  if(!on||vol<=0)return null;if(queued&&pendingId!==id)return null;const t=now();const secs=seconds||Math.max(2,Math.min(12,.42*text.split(/\s+/).length));
  if(t<state.busyUntil&&!queued){pendingId=id;setTimeout(()=>speak({id,text,file,seconds,priority,queued:true}),Math.max(0,(state.busyUntil-t)*1000+120));return null;}
  pendingId=null;state.busyUntil=t+secs;state.busyPriority=priority;state.count++;state.log.push({t:+t.toFixed(2),event:id,n:0});if(state.log.length>60)state.log.shift();
  if(current){try{current.pause();current.currentTime=0;}catch{}}
  const a=clip(file);a.volume=vol;current=a;const p=a.play();if(p&&p.catch)p.catch(()=>{failed++;synth(text);});a.onerror=()=>{failed++;synth(text);};
  return {event:id,text,file,seconds:secs};
 }
 return {say,speak,state,setVolume(v){vol=Math.max(0,Math.min(1,v));},setEnabled(v){on=!!v;},stats:()=>({count:state.count,failed,synthUsed,log:state.log.slice(-12)}),preload(events){for(const ev of events)for(let i=0;i<(RAY[ev]||[]).length;i++)clip(lineFile(ev,i));}};
}
