// One fish's decisions, as a small state machine over a perception of the lure. Pure and
// deterministic given its random stream, so tests and the demo can replay it.
// States: HOLD (on its structure), CRUISE (patrol), INSPECT (follow the lure), STRIKE (commit),
// REFUSE (turn away, cooldown), FLEE (spooked), HOOKED (the fight owns it), RESTING (post-release).
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createFishBrain({id,species,length,home,boldness,random}){
 return {id,species,length,home:{...home},boldness,random,state:'HOLD',stateTime:0,x:home.x,y:home.y,z:home.z,vx:0,vy:0,vz:0,heading:random()*6.283,
  target:null,inspectUntil:0,refuseUntil:-1,fleeUntil:-1,aversion:{},lastDecision:0,strikeReady:0,cruisePhase:random()*6.283,energy:1,caught:0,name:null};
}
// perception: {lure:{x,y,z,speed,family,technique,inWater,onSurface}, clarity, activity, kayak:{x,z}, splash:{x,z,age}|null}
export function stepFishBrain(f,dt,t,p){
 const sp=f.species;f.stateTime+=dt;
 const dx=p.lure?p.lure.x-f.x:1e9,dy=p.lure?p.lure.y-f.y:0,dz=p.lure?p.lure.z-f.z:1e9,dist=Math.hypot(dx,dy,dz);
 const kd=p.kayak?Math.hypot(p.kayak.x-f.x,p.kayak.z-f.z):1e9;
 const bl=f.length;
 // spooking overrides everything except the fight
 if(f.state!=='HOOKED'&&f.state!=='FLEE'){const splashNear=p.splash&&p.splash.age<1.5&&Math.hypot(p.splash.x-f.x,p.splash.z-f.z)<2.2;if(kd<sp.spookRadius*(1-f.boldness*.4)||splashNear){enter(f,'FLEE',t);f.fleeUntil=t+3+f.random()*3;}}
 const detect=p.lure&&p.lure.inWater?(sp.detect.sight*clamp(p.clarity,.4,1.6)+sp.detect.lateral*clamp(p.lure.speed*.9,0,1)):0;
 switch(f.state){
  case 'HOLD':{seek(f,dt,f.home,sp.cruiseBL*bl*.35,.6);if(f.stateTime>6+f.random()*10&&f.random()<.35)enter(f,'CRUISE',t);
   if(canInspect(f,p,dist,detect,t)){enter(f,'INSPECT',t);f.inspectUntil=t+sp.inspectSeconds[0]+f.random()*(sp.inspectSeconds[1]-sp.inspectSeconds[0]);}break;}
  case 'CRUISE':{f.cruisePhase+=dt*.35;const r=6+bl*8;const goal={x:f.home.x+Math.cos(f.cruisePhase)*r,y:f.home.y,z:f.home.z+Math.sin(f.cruisePhase)*r*.6};seek(f,dt,goal,sp.cruiseBL*bl,.8);
   if(f.stateTime>8+f.random()*12)enter(f,'HOLD',t);if(canInspect(f,p,dist,detect,t)){enter(f,'INSPECT',t);f.inspectUntil=t+sp.inspectSeconds[0]+f.random()*(sp.inspectSeconds[1]-sp.inspectSeconds[0]);}break;}
  case 'INSPECT':{if(!p.lure||!p.lure.inWater||dist>detect*1.6){enter(f,'HOLD',t);break;}
   // shadow the lure from below and behind, matching its pace
   const behind={x:p.lure.x-dx/Math.max(dist,.01)*sp.inspectDistance,y:Math.min(p.lure.y-.25,-.2),z:p.lure.z-dz/Math.max(dist,.01)*sp.inspectDistance};
   seek(f,dt,behind,Math.max(sp.cruiseBL*bl*2.2,p.lure.speed*1.1+.3),2.5);
   f.lastDecision+=dt;
   if(f.lastDecision>=.5){f.lastDecision=0;const tech=sp.technique[p.lure.technique]??.8,fam=sp.lureFamily[p.lure.family]??1,av=1-(f.aversion[p.lure.family]||0);
    const moving=p.lure.speed>.08||p.lure.technique==='dead stick'&&p.lure.onSurface;const presentation=tech*fam*(moving?1:.35);
    // the follow: a musky that has tracked the lure to the boat commits when it is still moving there (the figure-eight)
    const boatside=sp.follow&&p.kayak&&Math.hypot(p.lure.x-p.kayak.x,p.lure.z-p.kayak.z)<3&&p.lure.speed>.35?2.6:1;
    const chance=f.boldness*p.activity*presentation*av*.28*boatside;
    if(f.random()<chance){enter(f,'STRIKE',t);f.strikeReady=t+sp.strikeDelay;}
    else if(t>f.inspectUntil){enter(f,'REFUSE',t);f.refuseUntil=t+8+f.random()*12;}}
   break;}
  case 'STRIKE':{if(!p.lure||!p.lure.inWater){enter(f,'HOLD',t);break;}
   seek(f,dt,{x:p.lure.x,y:p.lure.y-.02,z:p.lure.z},sp.burstBL*bl,6);
   if(t>=f.strikeReady&&dist<Math.max(.18,bl*.35)){f.state='BITE';f.stateTime=0;}
   else if(f.stateTime>2.5){enter(f,'REFUSE',t);f.refuseUntil=t+6;}
   break;}
  case 'BITE':break; // the angling layer decides: hooked, or a missed set
  case 'REFUSE':{const away={x:f.x-dx/Math.max(dist,.01)*4,y:f.home.y,z:f.z-dz/Math.max(dist,.01)*4};seek(f,dt,f.stateTime<1.2?away:f.home,sp.cruiseBL*bl*1.5,1.2);if(t>f.refuseUntil)enter(f,'HOLD',t);break;}
  case 'FLEE':{const ax=f.x-(p.kayak?p.kayak.x:f.x-1),az=f.z-(p.kayak?p.kayak.z:f.z-1),ad=Math.hypot(ax,az)||1;seek(f,dt,{x:f.x+ax/ad*5,y:f.home.y-.3,z:f.z+az/ad*5},sp.burstBL*bl*.6,4);if(t>f.fleeUntil)enter(f,'HOLD',t);break;}
  case 'RESTING':{seek(f,dt,f.home,sp.cruiseBL*bl*.5,.8);if(f.stateTime>20)enter(f,'HOLD',t);break;}
  case 'HOOKED':break;
 }
 return f.state;
}
function canInspect(f,p,dist,detect,t){return p.lure&&p.lure.inWater&&dist<detect&&t>f.refuseUntil&&f.random()<(.6+f.boldness*.4)*p.activity;}
function enter(f,state,t){f.state=state;f.stateTime=0;f.lastDecision=0;}
// steer toward a goal at a speed with a turn-rate limit; keeps the fish off the bed and under the surface
function seek(f,dt,goal,speed,accel){const dx=goal.x-f.x,dy=goal.y-f.y,dz=goal.z-f.z,d=Math.hypot(dx,dy,dz);if(d<.05){f.vx*=.9;f.vy*=.9;f.vz*=.9;}else{const k=Math.min(1,accel*dt);f.vx+=(dx/d*speed-f.vx)*k;f.vy+=(dy/d*speed-f.vy)*k;f.vz+=(dz/d*speed-f.vz)*k;}
 f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;if(f.vx*f.vx+f.vz*f.vz>1e-4)f.heading=Math.atan2(f.vx,f.vz);}
export function markEscape(f,family){f.aversion[family]=Math.min(.9,(f.aversion[family]||0)+.25);}
export function decayAversion(f,days){for(const k in f.aversion)f.aversion[k]=Math.max(0,f.aversion[k]-.02*days);}
