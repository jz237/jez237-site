import {HULL_PATCHES} from './hydrodynamics.js';
// Experimental open sea: a rigid-body personal watercraft on the FFT ocean.
// Twelve hull points carry hydrostatic pressure, planing lift and slamming
// damping against the true wave surface (height and vertical speed from the
// CPU spectrum mirror). A pump jet pushes through a steerable nozzle, so the
// craft only turns under throttle; the rider banks into turns and shifts
// weight fore and aft. Everything is in SI units at 120 Hz substeps.
// It fills the same racer and hydro fields as the modern model, so the view,
// camera, spray, wake and audio keep working unchanged.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const G=9.81,RHO=1025,AIR=1.2,SUBSTEP=1/120,DRAFT=.245;
export const OPEN_SEA_CRAFT=Object.freeze({
 mass:380,// ski 300 kg plus rider
 inertia:Object.freeze({pitch:330,roll:105,yaw:360}),
 area:1.69,// planing bottom; floats the craft about 0.22 m deep at its hull points
 hullDepth:.62,// hull points are fully submerged below this depth
 damping:1350,// N s/m per m² of wet bottom: heave damping ratio about 0.45
 lift:Object.freeze({base:.008,trim:.42,max:.16,wetLength:.15}),// planing lift per wet point; full chord below wetLength
 friction:.0045,// wetted-surface skin friction, sides included
 hump:Object.freeze({drag:.17,speed:5.5,width:2.6}),// displacement wave drag before planing
 airDrag:.62,// C_d A, ski and rider
 lateral:Object.freeze({linear:1250,quadratic:420,yawShare:.34,carve:700}),
 thrust:4800,jetSpeed:36,nozzle:.45,nozzleArm:1.4,
 centre:Object.freeze({z:-.12}),// centre of gravity, slightly aft of the hull points' centre
 thrustDepth:.16
});
const C=OPEN_SEA_CRAFT,AREAS=HULL_PATCHES.map(p=>p.weight*C.area);

/** Fresh open-sea state for a racer, floating level on the surface below it. */
export function createOpenSeaCraft(){return {initialized:false,bestAir:0,vy:0,yawRate:0,pitchRate:0,rollRate:0,remainder:0,airTime:0,flightPeak:0,thrust:0,lift:0,support:0,slip:0};}

/** Step one racer through `dt` seconds. `sea.sample(x,z)` returns the FFT
 * surface {h,ht} about `sea.level` at `time`; earlier substeps extrapolate it
 * back with its own rate of change. Returns {landing, capsized}. */
export function stepOpenSeaCraft(r,c,dt,time,sea,stats=null){
 const q=r.openSea??=createOpenSeaCraft(),h=r.hydro;
 const surface=(x,z,at)=>{const s=sea.sample(x,z);return {y:sea.level+s.h-s.ht*(time-at),v:s.ht};};
 if(!q.initialized){
  q.initialized=true;const s=surface(r.x,r.z,time);
  h.y=s.y+.025;h.pitch=h.roll=h.vy=h.pitchVelocity=h.rollVelocity=0;h.waterHeight=s.y;h.initialized=true;
 }
 let landing=false,capsized=false,impact=0;
 q.remainder+=dt;const steps=Math.max(0,Math.floor(q.remainder/SUBSTEP+1e-9));q.remainder-=steps*SUBSTEP;
 for(let k=0;k<steps;k++){
  const at=time-q.remainder-(steps-1-k)*SUBSTEP;
  const result=substep(r,q,h,c,at,surface,stats);
  if(result.landing){landing=true;impact=Math.max(impact,result.impact);}
  capsized||=result.capsized;
 }
 r.speed=Math.hypot(r.vx,r.vz);
 if(landing)h.impact=Math.max(h.impact,impact);
 return {landing,capsized};
}

function substep(r,q,h,c,at,surface,stats){
 const dt=SUBSTEP,fx=Math.sin(r.heading),fz=Math.cos(r.heading),rx=fz,rz=-fx;
 const surge=r.vx*fx+r.vz*fz,sway=r.vx*rx+r.vz*rz,riding=!r.wipeout;
 const throttle=riding?clamp(c.throttle||0,0,1):0,steer=riding?clamp(c.steer||0,-1,1):0,lean=riding?clamp(c.lean||0,-1,1):0;
 const thrustScale=stats?clamp(stats.accel/7.2,.75,1.3):1,jetSpeed=C.jetSpeed*(stats?clamp(stats.speed/24.7,.85,1.2):1);
 const handling=stats?clamp(stats.handling/1.65,.75,1.35):1,grip=stats?clamp(stats.grip/4.5,.6,1.5):1;
 // Hull points: pressure, planing lift and damping.
 let support=0,pitchMoment=0,rollMoment=0,yawMoment=0,lateralForce=0,wetArea=0,wet=0,bow=0,stern=0,port=0,starboard=0,relativeSum=0,liftSum=0,slopeX=0,slopeZ=0;
 const trim=clamp(-h.pitch+.02,-.1,.3);
 const dynamic=.5*RHO*Math.max(0,surge)*Math.max(0,surge);
 let waterSum=0,intakeDepth=0;
 for(let i=0;i<HULL_PATCHES.length;i++){
  const p=HULL_PATCHES[i],a=AREAS[i],px=r.x+fx*p.z+rx*p.x,pz=r.z+fz*p.z+rz*p.x,s=surface(px,pz,at);
  waterSum+=s.y*p.weight;
  const pointY=h.y-h.pitch*p.z+h.roll*p.x-DRAFT,depth=s.y-pointY;
  // The surface under a moving point rises at its own rate plus the hull's run over its slope.
  const pointVelocity=h.vy-h.pitchVelocity*p.z+h.rollVelocity*p.x;
  if(i===1||i===4)intakeDepth+=depth/2;// the pump intake sits under the aft keel
  const pw=clamp(depth/C.lift.wetLength,0,1),patch=h.patches[i];
  let force=0;
  if(depth>0){
   const immersed=Math.min(depth,C.hullDepth);
   const relative=surfaceRate(r,q,i,s,px,pz,at)-pointVelocity;
   // The surface's approach adds to the local angle of attack: planing lift damps heave and pitch.
   const cl=clamp(C.lift.base+C.lift.trim*(trim+relative/Math.max(3,surge)),0,C.lift.max),lift=dynamic*a*cl*pw;
   force=RHO*G*a*immersed+lift+C.damping*a*relative*Math.min(1,depth/.12);
   force=Math.max(0,force);liftSum+=lift;
   relativeSum+=Math.max(0,relative)*pw*p.weight;
   // Sideways resistance: the hull's chines and keel, stronger when banked.
   const arm=p.z-C.centre.z,local=sway+q.yawRate*arm,bite=a*pw*grip*(1+2.2*Math.abs(h.roll))*(1+Math.max(0,surge)/9);
   const side=-(C.lateral.linear*local+C.lateral.quadratic*Math.abs(local)*local)*bite;
   // A banked V hull carries its side load along the whole chine, so the dry bow
   // still shares it: a fraction of the point moment reaches yaw.
   lateralForce+=side;yawMoment+=arm*side*C.lateral.yawShare;
   wetArea+=a*pw;
  }
  patch.water=s.y;patch.force=force/(C.mass*G);patch.wet=pw;
  support+=force;pitchMoment-=force*(p.z-C.centre.z);rollMoment+=force*p.x;
  wet+=pw*p.weight;if(p.z>0)bow+=pw*p.weight*2;else stern+=pw*p.weight*2;if(p.x<0)port+=pw/4;else if(p.x>0)starboard+=pw/4;
 }
 // Wave slope under the hull from its four corner rows.
 const P=h.patches,ahead=(P[9].water+P[10].water+P[11].water)/3,behind=(P[0].water+P[1].water+P[2].water)/3;
 const portSide=(P[0].water+P[3].water+P[6].water+P[9].water)/4,starSide=(P[2].water+P[5].water+P[8].water+P[11].water)/4;
 const along=(ahead-behind)/2.4,across=(starSide-portSide)/.84;
 slopeX=along*fx+across*rx;slopeZ=along*fz+across*rz;
 // Pump jet: fed by the stern intake, thrust falls as the hull approaches the jet's speed.
 // The pump's water column keeps it primed through short skips; longer air ventilates it.
 const intakeTarget=clamp(intakeDepth/.03,0,1);h.intake+=(intakeTarget-h.intake)*(1-Math.exp(-dt*(intakeTarget<h.intake?3.5:14)));
 const thrust=C.thrust*thrustScale*throttle*clamp(1-surge/jetSpeed,0,1.4)*h.intake,nozzle=steer*C.nozzle*handling;
 const reverse=riding&&c.brake&&h.intake>.2?-Math.min(1400,900+300*Math.max(0,surge))*h.intake:0;
 // Drag: skin friction, induced drag of planing lift, displacement hump and air.
 const friction=.5*RHO*surge*Math.abs(surge)*C.friction*wetArea*1.6;
 const induced=liftSum*Math.tan(clamp(trim,0,.3)+.015)*Math.sign(surge);
 const hump=C.mass*G*C.hump.drag*Math.exp(-(((Math.abs(surge)-C.hump.speed)/C.hump.width)**2))*clamp(wet*1.4,0,1)*clamp(Math.abs(surge)/1.5,0,1)*Math.sign(surge);
 const speed=Math.hypot(r.vx,r.vz,h.vy),air=.5*AIR*C.airDrag*speed;
 const forward=(thrust+reverse)*Math.cos(nozzle)-friction-induced-hump;
 const sideways=lateralForce-thrust*Math.sin(nozzle);
 // Buoyancy acts along the surface normal, so a hull runs down a wave face.
 const ax=(forward*fx+sideways*rx-support*slopeX)/C.mass-air*r.vx/C.mass,az=(forward*fz+sideways*rz-support*slopeZ)/C.mass-air*r.vz/C.mass;
 r.vx+=ax*dt;r.vz+=az*dt;
 // Yaw: the nozzle swings the stern; wet hull damps the rotation.
 // A banked, planing hull carves toward its low side.
 yawMoment+=thrust*Math.sin(nozzle)*C.nozzleArm-h.roll*wet*Math.max(0,surge)*C.lateral.carve-q.yawRate*(140+260*wet);
 q.yawRate+=yawMoment/C.inertia.yaw*dt;r.heading+=q.yawRate*dt;
 // Pitch: thrust below the centre of gravity lifts the bow; the rider shifts weight.
 const planing=clamp((surge-4)/10,0,1);
 pitchMoment+=-thrust*C.thrustDepth+lean*(wet>.05?520:200)-h.pitchVelocity*(60+40*wet);
 // Roll: the rider banks into the turn and balances against the hull.
 const bank=-steer*.5*planing*(.3+.7*throttle),balance=riding?clamp((bank-h.roll)*7000-h.rollVelocity*420,-5200,5200):0;
 rollMoment+=balance-h.rollVelocity*(25+40*wet);
 h.vy+=(support/C.mass-G)*dt;h.y+=h.vy*dt;
 h.pitchVelocity+=pitchMoment/C.inertia.pitch*dt;h.rollVelocity+=rollMoment/C.inertia.roll*dt;
 h.pitch=clamp(h.pitch+h.pitchVelocity*dt,-1.4,1.4);h.roll=clamp(h.roll+h.rollVelocity*dt,-1.9,1.9);
 if(Math.abs(h.pitch)===1.4)h.pitchVelocity=0;
 // Move after the forces; position integration happens here, not in the race loop.
 r.x+=r.vx*dt;r.z+=r.vz*dt;
 const water=waterSum;
 h.waterVelocity+=((water-h.waterHeight)/dt-h.waterVelocity)*(1-Math.exp(-dt*12));h.waterHeight=water;
 h.wet=wet;h.bowWet=bow;h.sternWet=stern;h.portWet=port;h.starboardWet=starboard;h.load=support/(C.mass*G);
 q.thrust=thrust;q.lift=liftSum;q.support=support;q.slip=sway;
 // Flight, landings and capsizes.
 const airborne=wet<.04&&h.y>water+.25;
 let landing=false,impact=0;
 if(airborne){q.airTime+=dt;q.flightPeak=Math.max(q.flightPeak,h.y-water);}else if(!h.launched){q.airTime=0;q.flightPeak=0;}
 if(h.launched&&wet>.18){const approach=relativeSum/Math.max(.18,wet);if(approach>1){impact=approach;landing=true;h.landingId++;}h.launched=false;q.bestAir=Math.max(q.bestAir,q.airTime);q.airTime=0;q.flightPeak=0;}
 h.airborne=airborne;if(airborne&&q.airTime>.12)h.launched=true;h.airTime=airborne?q.airTime:0;
 if(h.y<water-1.2){h.y=water-1.2;h.vy=Math.max(h.vy,0);}
 h.drag=wet*planing*.035;h.reengagement=0;
 h.impact*=Math.exp(-dt*6);
 const compressTarget=clamp((h.load-1)*.14+h.impact*.045,0,.38);
 h.compressionVelocity+=((compressTarget-h.compression)*95-h.compressionVelocity*15)*dt;h.compression=clamp(h.compression+h.compressionVelocity*dt,0,.38);
 const capsized=riding&&(Math.abs(h.roll)>1.2||landing&&impact>7&&h.pitch>.55);
 return {landing,impact,capsized};
}

// Vertical speed of the surface under hull point i as the hull runs over it:
// its own rise plus the change along the point's path since the last substep.
function surfaceRate(r,q,i,s,px,pz,at){
 const trail=q.trail??=HULL_PATCHES.map(()=>null),prev=trail[i];
 trail[i]={x:px,z:pz,y:s.y,at};
 if(!prev||at-prev.at<=0||at-prev.at>.05)return s.v;
 return clamp((s.y-prev.y)/(at-prev.at),-14,14);
}

/** Right the hull after a wipeout or rescue: it floats level again where it is. */
export function rightOpenSeaCraft(r){const q=r.openSea;if(!q)return;q.initialized=false;q.yawRate=0;q.trail=null;r.hydro.launched=false;}
