// The second rod: a bottom rig parked in a holder while you fish another rod. Pure, node-tested:
// what can be parked (a circle-hook bait resting on the bottom), the soak, a bite on the parked
// bait with a pickup window before the fish drops it, the tip bounce that shows it, and the
// hand-over when you grab the rod. The mesh, the glow stick and the bell live in angling.js and main.js.
export const HOLDER={pickupSeconds:9,bounceSeconds:4.5};
export function createHolder(){return {rod:null,bite:null,soak:0};}
export function canPark(s){return !!s&&s.phase==='retrieve'&&!!s.circle&&!!s.onBottom&&!s.reeling;}
export function parkRod(h,{rigIndex,rig,lure,bait,lineOut,t}){if(h.rod||!bait)return false;h.rod={rigIndex,rig,lure,bait:{x:bait.x,y:bait.y,z:bait.z},lineOut,parkedAt:t};h.bite=null;h.soak=0;return true;}
// what the fish see: a dead-sticked bait on the bottom
export function holderTarget(h){if(!h.rod)return null;const b=h.rod.bait;return {x:b.x,y:b.y,z:b.z,speed:0,family:'bait',technique:'dead stick',inWater:true,onSurface:false,holder:true};}
export function holderBite(h,fish,t){if(!h.rod||h.bite)return false;h.bite={fish,at:t};return true;}
export function stepHolder(h,dt,t){if(!h.rod)return null;h.soak+=dt;if(h.bite&&t-h.bite.at>HOLDER.pickupSeconds){const fish=h.bite.fish;h.bite=null;return {type:'holder_dropped',fish};}return null;}
export function takeHolder(h){if(!h.rod)return null;const out={...h.rod,bite:h.bite};h.rod=null;h.bite=null;h.soak=0;return out;}
// the tip in radians: a ringing bounce that dies over a few seconds
export function tipBounce(h,t){if(!h.bite)return 0;const a=t-h.bite.at;if(a<0||a>HOLDER.bounceSeconds)return 0;return Math.sin(a*22)*Math.exp(-a*.9)*.07;}
export function holderSnapshot(h,t){return h.rod?{rig:h.rod.rig,lure:h.rod.lure,bait:[+h.rod.bait.x.toFixed(2),+h.rod.bait.y.toFixed(2),+h.rod.bait.z.toFixed(2)],lineOut:+h.rod.lineOut.toFixed(1),soak:+h.soak.toFixed(1),bite:!!h.bite,biteAge:h.bite?+(t-h.bite.at).toFixed(1):0,bounce:+tipBounce(h,t).toFixed(3)}:null;}
export function holderLine(snap){if(!snap)return '';if(snap.bite)return 'HOLDER ROD · fish on the bait — grab it (H)';const m=Math.floor(snap.soak/60),s=Math.floor(snap.soak%60);return `Holder · ${snap.lure||'bait'} soaking ${m}:${String(s).padStart(2,'0')} · H to grab`;}
