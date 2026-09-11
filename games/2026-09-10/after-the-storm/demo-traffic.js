// Local traffic awareness changes controls only; hull motion and wake lift
// remain the same simulation used by the player.
export function demoTrafficInput(s,r,input){
 const c={...input};
 if(s.time<r.grid*.32)return {...c,throttle:0,brake:true};
 if(r.wipeout||r.hydro.airborne)return c;
 const fx=Math.sin(r.heading),fz=Math.cos(r.heading);
 let limit=Infinity;
 for(const q of s.racers){
  if(q===r||q.dq||q.finishTime!==null)continue;
  const dx=q.x-r.x,dz=q.z-r.z,ahead=dx*fx+dz*fz,side=dx*fz-dz*fx;
  if(ahead<=0||ahead>45)continue;
  // Do not queue behind racers on a different leg across an island.
  if([.33,.66].some(t=>s.course.ground(r.x+dx*t,r.z+dz*t)>-.8))continue;
  const closingSide=(q.vx-r.vx)*fz-(q.vz-r.vz)*fx;
  const projectedSide=side+closingSide*Math.min(.7,ahead/Math.max(4,r.speed));
  // A clear adjacent line permits a pass; a crossing or lead ski gets room.
  if(Math.min(Math.abs(side),Math.abs(projectedSide))>6.5)continue;
  const leaderSpeed=Math.max(0,q.vx*fx+q.vz*fz),gap=9+r.speed*.8;
  limit=Math.min(limit,Math.max(3,leaderSpeed+(ahead-gap)*.85));
 }
 if(Number.isFinite(limit)){
  c.throttle=Math.min(c.throttle??0,Math.max(0,Math.min(1,.46+(limit-r.speed)*.14)));
  c.brake=!!c.brake||r.speed>limit+3;
 }
 return c;
}
