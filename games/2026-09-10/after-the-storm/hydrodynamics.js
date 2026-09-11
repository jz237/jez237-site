// Distributed pressure model, SI units, integrated at fixed simulation steps.
// Twelve contact patches create lift and moments independently. No force pulls
// the hull toward the water when separated from it.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const HULL_PATCHES=[-1.2,-.4,.4,1.2].flatMap(z=>[-1,0,1].map(side=>({x:side*(Math.abs(z)>1?.36:.48),z,weight:(side===0?.4:.3)/4})));
export function createHydro(){return {initialized:false,y:0,vy:0,pitch:0,roll:0,pitchVelocity:0,rollVelocity:0,waterHeight:0,waterVelocity:0,wet:1,bowWet:1,sternWet:1,portWet:1,starboardWet:1,intake:1,load:1,airborne:false,launched:false,airTime:0,impact:0,landingId:0,previousSpeed:0,diveRemaining:0,diveUsed:false,onRamp:false,patches:HULL_PATCHES.map(()=>({water:0,force:0,wet:0})),compression:0,compressionVelocity:0,drag:0};}
export function stepHydro(h,craft,time,dt,surface,{dampen=false,lean=0,dive=false}={}){
 const fx=Math.sin(craft.heading),fz=Math.cos(craft.heading),rx=fz,rz=-fx,speed=Math.hypot(craft.vx||0,craft.vz||0)||Math.abs(craft.speed||0),planing=clamp((speed-3)/17,0,1);
 if(dive&&h.airborne&&h.vy<0&&!h.diveUsed){h.diveRemaining=1.25;h.diveUsed=true;}h.diveRemaining=Math.max(0,h.diveRemaining-dt);if(!dive&&!h.airborne&&h.diveRemaining===0)h.diveUsed=false;
 let water=0;const heights=HULL_PATCHES.map(p=>{const v=surface(craft.x+fx*p.z+rx*p.x,craft.z+fz*p.z+rz*p.x,time);water+=v*p.weight;return v;});
 if(!h.initialized){h.initialized=true;h.y=water+.025;h.waterHeight=water;h.previousSpeed=speed;heights.forEach((w,i)=>h.patches[i].water=w);}
 const waterVelocity=clamp((water-h.waterHeight)/Math.max(dt,.001),-12,12);h.waterVelocity+=(waterVelocity-h.waterVelocity)*(1-Math.exp(-dt*12));h.waterHeight=water;
 let support=0,pitchMoment=0,rollMoment=0,wet=0,bow=0,stern=0,port=0,starboard=0,relativeSum=0,slamming=0;
 const draft=.245-(h.diveRemaining>0?.95:0),damping=dampen?10:7.2;
 for(let i=0;i<HULL_PATCHES.length;i++){
  const p=HULL_PATCHES[i],q=h.patches[i],pointY=h.y-h.pitch*p.z+h.roll*p.x-draft,depth=heights[i]-pointY;
  const localVelocity=h.vy-h.pitchVelocity*p.z+h.rollVelocity*p.x,wv=clamp((heights[i]-q.water)/dt,-14,14),relative=wv-localVelocity;
  q.water=heights[i];q.wet=clamp(depth/.16,0,1);const immersion=clamp(depth/.22,0,2.6);
  const attack=clamp(.12-h.pitch+lean*.04,0,.5),lift=planing*(2.0+attack*7)*(1+p.z*.45)*q.wet;
  // The immersed patch's relative approach speed controls pressure and slamming.
  q.force=depth>0?clamp(9.81*immersion+relative*damping*q.wet+lift,0,85)*p.weight:0;
  support+=q.force;pitchMoment-=q.force*p.z;rollMoment+=q.force*p.x;
  wet+=q.wet*p.weight;relativeSum+=Math.max(0,relative)*q.wet*p.weight;slamming+=Math.max(0,relative-3)**2*q.wet*p.weight;
  if(p.z>0)bow+=q.wet*p.weight*2;else stern+=q.wet*p.weight*2;
  if(p.x<0)port+=q.wet/4;else if(p.x>0)starboard+=q.wet/4;
 }
 let landing=false;h.impact*=Math.exp(-dt*6);
 if(h.launched&&wet>.18&&relativeSum>1.5){h.launched=false;h.impact=relativeSum/Math.max(.18,wet);h.landingId++;landing=true;}
 h.wet=wet;h.bowWet=bow;h.sternWet=stern;h.portWet=port;h.starboardWet=starboard;
 const intakeTarget=Math.min(stern,wet*1.3);h.intake+=(intakeTarget-h.intake)*(1-Math.exp(-dt*(intakeTarget<h.intake?30:11)));
 h.load=support/9.81;h.vy+=(support-9.81)*dt;h.y+=h.vy*dt;
 const forwardWater=(heights[9]+heights[10]+heights[11])/3,aftWater=(heights[0]+heights[1]+heights[2])/3;
 const portWater=(heights[0]+heights[3]+heights[6]+heights[9])/4,starWater=(heights[2]+heights[5]+heights[8]+heights[11])/4;
 // Rotational inertia and distributed pressure; rider lean supplies a bounded moment.
 const turn=craft.turn||0;pitchMoment+=lean*.6*wet;rollMoment-=turn*planing*1.5*wet;
 h.pitchVelocity+=(pitchMoment/1.6-h.pitchVelocity*(wet*(dampen?5.4:3.8)+.15))*dt;
 h.rollVelocity+=(rollMoment/.46-h.rollVelocity*(wet*(dampen?7:5.6)+.18))*dt;
 h.pitch=clamp(h.pitch+h.pitchVelocity*dt,-1.15,1.15);h.roll=clamp(h.roll+h.rollVelocity*dt,-1.25,1.25);
 h.airborne=wet<.05&&h.y>water+.28;if(h.airborne)h.launched=true;h.airTime=h.airborne?h.airTime+dt:0;
 if(h.y<water-.6&&h.diveRemaining===0){h.y=water-.6;h.vy=Math.max(h.vy,h.waterVelocity*.25);}
 h.drag=slamming*.007+wet*planing*.035;h.previousSpeed=speed;
 const compressTarget=clamp((h.load-1)*.14+h.impact*.045,0,.38);
 h.compressionVelocity+=((compressTarget-h.compression)*95-h.compressionVelocity*15)*dt;h.compression=clamp(h.compression+h.compressionVelocity*dt,0,.38);
 return {slopeX:-(starWater-portWater)/.84*rx-(forwardWater-aftWater)/2.4*fx,slopeZ:-(starWater-portWater)/.84*rz-(forwardWater-aftWater)/2.4*fz,landing};
}
