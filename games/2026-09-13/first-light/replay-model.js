// The catch replay: while a fish is on, the recorder keeps the last forty seconds of where it was,
// what it was doing, where the lure was and how tight the line ran; at the landing the buffer is
// frozen with the catch. Playback interpolates the samples in slow motion and a small director
// films the take and the first runs from under the surface, then the fight from the water.
// Pure and node-tested; main.js gives the fish a ghost body and drives the camera.
export const REPLAY={keepSeconds:40,rate:10,slow:.6,underFraction:.42,tail:1.2};
export function createRecorder(){return {samples:[],last:-1,frozen:null};}
export function record(rec,t,s){if(t-rec.last<1/REPLAY.rate-1e-6)return false;rec.last=t;rec.samples.push({t,...s});const cut=t-REPLAY.keepSeconds;while(rec.samples.length&&rec.samples[0].t<cut)rec.samples.shift();return true;}
export function freeze(rec,meta={}){if(rec.samples.length<2)return null;const t0=rec.samples[0].t;const samples=rec.samples.map(s=>({...s,t:s.t-t0}));const r={samples,duration:samples[samples.length-1].t,meta};rec.samples=[];rec.last=-1;rec.frozen=r;return r;}
function angDiff(b,a){const d=b-a;return Math.atan2(Math.sin(d),Math.cos(d));}
export function frameAt(r,t){const s=r.samples;if(t<=0)return {...s[0]};if(t>=r.duration)return {...s[s.length-1]};let i=0;while(i<s.length-2&&s[i+1].t<t)i++;const a=s[i],b=s[i+1];const f=Math.max(0,Math.min(1,(t-a.t)/Math.max(1e-6,b.t-a.t)));const L=(p,q)=>p+(q-p)*f;
 return {t,x:L(a.x,b.x),y:L(a.y,b.y),z:L(a.z,b.z),heading:a.heading+angDiff(b.heading,a.heading)*f,state:f<.5?a.state:b.state,lure:{x:L(a.lure.x,b.lure.x),y:L(a.lure.y,b.lure.y),z:L(a.lure.z,b.lure.z)},tension:L(a.tension||0,b.tension||0)};}
export function shotFor(r,t){return t/Math.max(1e-6,r.duration)<REPLAY.underFraction?'under':'surface';}
// the camera trails the fish along its own direction of travel, a little to one side so the flank
// shows: close and just under the surface for the take; behind and under for the fight, rising to the
// water line only when the fish comes up to jump or thrash
export function replayCamera(r,t,bedAt=null){
 const fr=frameAt(r,t),phase=shotFor(r,t),prev=frameAt(r,Math.max(0,t-.4));let dx=fr.x-prev.x,dz=fr.z-prev.z;const dl=Math.hypot(dx,dz);
 if(dl<.05){dx=-Math.sin(fr.heading);dz=-Math.cos(fr.heading);}else{dx/=dl;dz/=dl;}
 const behind=(d,side)=>({x:fr.x-dx*d+dz*side,z:fr.z-dz*d-dx*side});
 if(phase==='under'){const p=behind(1.25,.6);const bed=bedAt?bedAt(p.x,p.z):-6;const cy=Math.max(bed+.35,Math.min(-.25,fr.y+.12));return {shot:'under',pos:{x:p.x,y:cy,z:p.z},look:{x:fr.x,y:fr.y,z:fr.z},frame:fr};}
 if(fr.y>-.6){const p=behind(3.2,.8);return {shot:'surface',pos:{x:p.x,y:.45,z:p.z},look:{x:fr.x,y:Math.max(fr.y,-.1),z:fr.z},frame:fr};}
 const p=behind(2.4,.9);const bed=bedAt?bedAt(p.x,p.z):-6;const cy=Math.max(bed+.35,Math.min(-.3,fr.y+.55));return {shot:'chase',pos:{x:p.x,y:cy,z:p.z},look:{x:fr.x,y:fr.y,z:fr.z},frame:fr};
}
export function replayLine(r,t,name){const s=shotFor(r,t);return `CATCH REPLAY · ${name} · ${s==='under'?'the take, from below':'the fight'} · ${Math.min(r.duration,t).toFixed(0)} / ${r.duration.toFixed(0)} s · slow`;}
