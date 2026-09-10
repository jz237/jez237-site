// Metres, seconds and radians. Water can push the hull upward, but cannot pull it
// down: losing support over a crest naturally becomes a ballistic wave launch.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createHydro(){return {initialized:false,y:0,vy:0,pitch:0,roll:0,pitchVelocity:0,rollVelocity:0,waterHeight:0,waterVelocity:0,wet:1,bowWet:1,sternWet:1,portWet:1,starboardWet:1,intake:1,load:1,airborne:false,launched:false,airTime:0,impact:0,landingId:0,previousSpeed:0,diveRemaining:0,diveUsed:false,onRamp:false};}
export function stepHydro(h,craft,time,dt,surface,{dampen=false,lean=0,dive=false}={}){
 const fx=Math.sin(craft.heading),fz=Math.cos(craft.heading),rx=fz,rz=-fx,speed=Math.hypot(craft.vx||0,craft.vz||0)||Math.abs(craft.speed||0);
 const fore=surface(craft.x+fx*1.30,craft.z+fz*1.30,time),aft=surface(craft.x-fx*1.20,craft.z-fz*1.20,time),port=surface(craft.x-rx*.52,craft.z-rz*.52,time),starboard=surface(craft.x+rx*.52,craft.z+rz*.52,time);
 const water=(fore+aft+port+starboard)/4,planing=clamp((speed-3)/14,0,1),ride=.025+planing*.115;
 if(dive&&h.airborne&&h.vy<0&&!h.diveUsed){h.diveRemaining=1.25;h.diveUsed=true;}h.diveRemaining=Math.max(0,h.diveRemaining-dt);if(!dive&&!h.airborne&&h.diveRemaining===0)h.diveUsed=false;
 const target=water+ride-(h.diveRemaining>0?.95:0);
 if(!h.initialized){h.initialized=true;h.y=target;h.waterHeight=water;h.previousSpeed=speed;}
 const waterVelocity=clamp((water-h.waterHeight)/Math.max(dt,.001),-9,9);h.waterVelocity+=(waterVelocity-h.waterVelocity)*(1-Math.exp(-dt*12));h.waterHeight=water;
 const separation=h.y-target,relative=h.waterVelocity-h.vy;let landing=false;
 h.impact*=Math.exp(-dt*7);
 if(h.launched&&separation<.12){h.launched=false;if(relative>1.5){h.impact=relative;h.landingId++;landing=true;}}
 // Distributed hydrostatic support plus planing lift, with no tensile spring.
 const stiffness=dampen?68:52,damping=dampen?11:6.5;
 let support=separation>.30?0:clamp(9.81-separation*stiffness+relative*damping,0,65);
 h.wet=clamp(1-(h.y-water-ride)/.30,0,1);if(support<.1)h.wet=0;
 // Contact at each end/edge follows the hull attitude, not simply its centre.
 // Account for the running trim so an ordinary planing bow does not count as a jump.
 const runningPitch=-.025-planing*.09,trim=h.pitch-runningPitch;
 h.bowWet=clamp(1-(h.y-trim*1.30-fore-ride)/.30,0,1);
 h.sternWet=clamp(1-(h.y+trim*1.20-aft-ride)/.30,0,1);
 h.portWet=clamp(1-(h.y-h.roll*.52-port-ride)/.30,0,1);
 h.starboardWet=clamp(1-(h.y+h.roll*.52-starboard-ride)/.30,0,1);
 const intakeTarget=Math.min(h.wet,h.sternWet);
 h.intake+=(intakeTarget-h.intake)*(1-Math.exp(-dt*(intakeTarget<h.intake?35:9)));
 h.load=support/9.81;
 h.vy+=(support-9.81)*dt;h.y+=h.vy*dt;
 h.airborne=h.y>water+ride+.30&&h.wet<.08;if(h.airborne)h.launched=true;h.airTime=h.airborne?h.airTime+dt:0;
 // Prevent tunnelling through a fast-rising face at coarse render rates.
 if(h.y<target-.38){h.y=target-.38;h.vy=Math.max(h.vy,h.waterVelocity*.4);}
 const acceleration=clamp((speed-h.previousSpeed)/Math.max(dt,.001),-8,8);h.previousSpeed=speed;
 const wavePitch=-Math.atan2(fore-aft,2.5),waveRoll=Math.atan2(starboard-port,1.04);
 const turn=craft.turn||0;
 const pitchTarget=wavePitch-.025-planing*.09-acceleration*.009+lean*.15;
 const rollTarget=waveRoll+turn*planing*.42;
 if(h.wet>.03){h.pitchVelocity+=(pitchTarget-h.pitch)*dt*26*h.wet;h.rollVelocity+=(rollTarget-h.roll)*dt*32*h.wet;}
 else {h.pitchVelocity+=lean*dt*1.2;h.rollVelocity+=turn*dt*.08;}
 h.pitchVelocity*=Math.exp(-dt*(h.wet>.03?5.8:.45));h.rollVelocity*=Math.exp(-dt*(h.wet>.03?6.5:.6));
 h.pitch=clamp(h.pitch+h.pitchVelocity*dt,-.85,.85);h.roll=clamp(h.roll+h.rollVelocity*dt,-1.1,1.1);
 return {slopeX:-(starboard-port)/1.04*rx-(fore-aft)/2.5*fx,slopeZ:-(starboard-port)/1.04*rz-(fore-aft)/2.5*fz,landing};
}
