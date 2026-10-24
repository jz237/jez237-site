import {HULL_PATCHES} from './hydrodynamics.js';
// Experimental open sea: a personal watercraft on the FFT ocean, modelled with
// nonlinear planing strip theory (after Zarnick). The V hull is cut into
// sections along its length; each section's port and starboard halves carry
// buoyancy and the momentum of the water they push aside. Lift is the rate at
// which a section's added mass grows as it sinks into the surface, so it acts
// only while the water closes on the hull: impacts give their energy to the
// sea instead of springing back. Trim and ride height come out of that
// balance, and a banked hull tilts its planing lift into the turn. A pump jet
// pushes through a steerable nozzle, so the craft turns under power or by
// leaning. SI units at 240 Hz substeps. It fills the same racer and hydro
// fields as the modern model, so the view, camera, spray, wake and audio keep
// working unchanged.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
const G=9.81,RHO=1025,AIR=1.2,SUBSTEP=1/240,KEEL=.245,HALF_PI=Math.PI/2;
export const OPEN_SEA_CRAFT=Object.freeze({
 mass:380,// ski 300 kg plus rider
 inertia:Object.freeze({pitch:300,roll:95,yaw:330}),
 centre:-.38,// longitudinal centre of gravity (m forward of midships)
 // Hull: keel 0.245 m below the ride point, transom to bow, chine half-beam and
 // deadrise tapering into a raised (rockered) bow.
 hull:Object.freeze({transom:-1.45,bow:1.55,stations:24,samples:7,chine:.46,bowChine:.12,deadrise:21,bowDeadrise:40,rocker:.22,rockerFrom:.6,depth:.6,bowRelief:.35}),
 addedMass:.8,// Wagner wedge added-mass factor
 crossflow:.7,// nonlinear crossflow drag coefficient
 radiation:900,// linear wave-radiation damping, N s/m per m² of wetted beam
 friction:.004,// skin friction on the wetted surface, spray drag included
 hump:Object.freeze({drag:.11,speed:4.8,width:2.4}),// displacement wave drag before planing
 airDrag:.62,// C_d A of ski and rider
 side:Object.freeze({lift:.12,quadratic:1.2,bank:.85,carve:150}),// keel and chine side lift; banked planing lift; inside chine carving
 thrust:Object.freeze({static:4800,jetSpeed:36,nozzle:.45,z:-1.6,depth:.18,idleDrag:.004}),// idleDrag: C_d A of the idling pump and intake grate
 intake:-.95,
 rider:Object.freeze({trim:300,bank:.85,balance:2800,damping:420,authority:3200,air:900,airAuthority:260})
});
const C=OPEN_SEA_CRAFT,H=C.hull,STATIONS=Array.from({length:H.stations},(_,i)=>{
 const dz=(H.bow-H.transom)/H.stations,z=H.transom+(i+.5)*dz,bow=smooth(.3,H.bow,z),u=Math.max(0,(z-H.rockerFrom)/(H.bow-H.rockerFrom));
 return Object.freeze({z,dz,chine:H.chine-(H.chine-H.bowChine)*bow,deadrise:(H.deadrise+(H.bowDeadrise-H.deadrise)*smooth(.2,H.bow,z))*Math.PI/180,
  rocker:H.rocker*u*u,rockerSlope:2*H.rocker*u/(H.bow-H.rockerFrom),
  // Water escapes round the narrow bow (3D relief), unlike a 2D strip.
  relief:1-H.bowRelief*smooth(0,H.bow,z)});
});
const INTAKE=STATIONS.reduce((best,s,i)=>Math.abs(s.z-C.intake)<Math.abs(STATIONS[best].z-C.intake)?i:best,0);
// The surface is sampled at a few points along the keel and interpolated.
const SAMPLE_Z=Array.from({length:H.samples},(_,i)=>H.transom+(H.bow-H.transom)*i/(H.samples-1));
const PATCH_STATION=HULL_PATCHES.map(p=>STATIONS.reduce((best,s,i)=>Math.abs(s.z-p.z)<Math.abs(STATIONS[best].z-p.z)?i:best,0));

/** Fresh open-sea state for a racer, floating level on the surface below it. */
export function createOpenSeaCraft(){return {initialized:false,bestAir:0,yawRate:0,remainder:0,airTime:0,flightPeak:0,thrust:0,lift:0,support:0,slip:0,
 water:new Float64Array(H.stations),depth:new Float64Array(H.stations),force:new Float64Array(H.stations*2)};}

/** Step one racer through `dt` seconds. `sea.sample(x,z)` returns the FFT
 * surface {h,ht} about `sea.level` at `time`; earlier substeps extrapolate it
 * back with its own rate of change. Returns {landing, capsized}. */
export function stepOpenSeaCraft(r,c,dt,time,sea,stats=null){
 const q=r.openSea??=createOpenSeaCraft(),h=r.hydro;
 const surface=(x,z,at)=>{const s=sea.sample(x,z);return {y:sea.level+s.h-s.ht*(time-at),v:s.ht};};
 if(!q.initialized){
  q.initialized=true;const s=surface(r.x,r.z,time);
  h.y=s.y+.035;h.pitch=h.roll=h.vy=h.pitchVelocity=h.rollVelocity=0;h.waterHeight=s.y;h.initialized=true;h.launched=false;
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
 const U=r.vx*fx+r.vz*fz,sway=r.vx*rx+r.vz*rz,riding=!r.wipeout;
 const throttle=riding?clamp(c.throttle||0,0,1):0,steer=riding?clamp(c.steer||0,-1,1):0,lean=riding?clamp(c.lean||0,-1,1):0;
 const thrustScale=stats?clamp(stats.accel/7.2,.75,1.3):1,jetSpeed=C.thrust.jetSpeed*(stats?clamp(stats.speed/24.7,.85,1.2):1);
 const handling=stats?clamp(stats.handling/1.65,.75,1.35):1,grip=stats?clamp(stats.grip/4.5,.6,1.5):1;
 let lift=0,dynamic=0,buoyancy=0,pitchMoment=0,rollMoment=0,heaveMass=0,pitchMass=0,rollMass=0,induced=0,surfaceArea=0,side=0,yawMoment=0;
 // How the water's forces change with heave and pitch rates (for the implicit
 // solve below): dF/dvy, dF/dω, dM/dvy, dM/dω, and roll damping.
 let forceVy=0,forceW=0,momentVy=0,momentW=0,rollDamping=0;
 let waterSum=0,wetSum=0,bow=0,stern=0,port=0,starboard=0,approach=0,wetStations=0;
 const samples=SAMPLE_Z.map(z=>surface(r.x+fx*z,r.z+fz*z,at)),step=(H.bow-H.transom)/(H.samples-1);
 for(let i=0;i<STATIONS.length;i++){
  const st=STATIONS[i],u=(st.z-H.transom)/step,j=Math.min(H.samples-2,Math.floor(u)),w=u-j,a=samples[j],b=samples[j+1];
  const s={y:a.y+(b.y-a.y)*w,v:a.v+(b.v-a.v)*w},arm=st.z-C.centre;
  const keel=h.y-h.pitch*st.z+st.rocker-KEEL,draft=s.y-keel,incline=clamp(-h.pitch+st.rockerSlope,-.35,.7);
  q.water[i]=s.y;q.depth[i]=draft;waterSum+=s.y;q.force[i*2]=q.force[i*2+1]=0;
  if(draft<=0)continue;
  const d=Math.min(draft,H.depth);let beamWet=0;wetStations++;
  for(let k=0;k<2;k++){
   const sideSign=k?1:-1,tb=Math.tan(clamp(st.deadrise+sideSign*h.roll,.06,1.45)),geometric=d/tb,chineDepth=st.chine*tb;
   const area=geometric<=st.chine?.5*d*geometric:.5*st.chine*chineDepth+st.chine*(d-chineDepth);
   // Wagner pile-up: the spray root runs out ahead of the still-water line.
   const wagner=HALF_PI*geometric,beam=wagner<=st.chine?wagner:st.chine+.25*(wagner-st.chine),beamRate=draft>=H.depth?0:HALF_PI/tb*(wagner<=st.chine?1:.25);
   const added=C.addedMass*RHO*Math.PI/4*beam*beam,addedRate=C.addedMass*RHO*HALF_PI*beam*beamRate;
   const lever=.55*Math.min(beam,st.chine),buoyLever=geometric<=st.chine?geometric/3:.5*st.chine;
   // Penetration speed: the surface rising, the hull falling, and the inclined
   // keel running forward into the water.
   const V=Math.min(7,s.v-(h.vy-h.pitchVelocity*st.z+h.rollVelocity*sideSign*lever)+U*incline);
   const momentum=V>0?(addedRate+C.crossflow*RHO*beam)*V*V*st.relief:0,radiation=C.radiation*Math.min(geometric,st.chine)*V;
   // The entrained water's acceleration as the section runs aft damps pitching
   // with speed. Strip theory only holds it aft of the CG; at a buried bow the
   // same term would drive the pitch, so it is not applied there.
   const munk=arm<0?2*added*U:0,acceleration=-munk*h.pitchVelocity;
   const fb=RHO*G*area,fd=Math.max(-fb,momentum+radiation+acceleration),f=(fb+fd)*st.dz;
   if(fd>-fb){const rate=(V>0?2*(addedRate+C.crossflow*RHO*beam)*V*st.relief:0)+C.radiation*Math.min(geometric,st.chine),perW=(rate*st.z-munk)*st.dz;
    forceVy-=rate*st.dz;forceW+=perW;momentVy+=rate*arm*st.dz;momentW-=perW*arm;rollDamping+=rate*lever*lever*st.dz;}
   buoyancy+=fb*st.dz;dynamic+=Math.max(0,fd)*st.dz;lift+=f;q.force[i*2+k]=f;
   pitchMoment-=f*arm;rollMoment+=sideSign*st.dz*(fb*buoyLever+fd*lever);
   induced+=Math.max(0,fd)*st.dz*clamp(incline,-.12,.5);
   heaveMass+=added*st.dz;pitchMass+=added*st.dz*arm*arm;rollMass+=added*st.dz*lever*lever;
   surfaceArea+=(Math.min(geometric,st.chine)*Math.hypot(1,tb)+(geometric>st.chine?d-chineDepth:0))*st.dz;
   const frac=clamp(Math.min(wagner,st.chine)/st.chine,0,1);beamWet+=Math.min(wagner,st.chine);
   if(k)starboard+=frac/STATIONS.length;else port+=frac/STATIONS.length;
   if(V>0)approach=Math.max(approach,V-U*incline);
  }
  // Keel and chine side lift against sideways slip, strongest at speed.
  const v=sway+q.yawRate*arm,fy=-RHO*grip*(C.side.lift*Math.max(U,2)*beamWet*v+C.side.quadratic*Math.min(d,.4)*v*Math.abs(v))*st.dz;
  side+=fy;yawMoment+=arm*fy;
  const frac=clamp(beamWet/(2*st.chine),0,1);wetSum+=frac/STATIONS.length;if(st.z>0)bow+=frac*2/STATIONS.length;else stern+=frac*2/STATIONS.length;
 }
 const water=waterSum/STATIONS.length;
 // A banked planing hull tilts its lift into the turn.
 side+=-dynamic*Math.sin(h.roll)*C.side.bank;
 // Wave slope under the hull: buoyancy acts along the surface normal.
 const along=(samples[H.samples-1].y-samples[0].y)/(H.bow-H.transom);
 const portWater=surface(r.x-rx*.45-fx*.3,r.z-rz*.45-fz*.3,at).y,starWater=surface(r.x+rx*.45-fx*.3,r.z+rz*.45-fz*.3,at).y,across=(starWater-portWater)/.9;
 const slopeX=along*fx+across*rx,slopeZ=along*fz+across*rz;
 // Pump jet: the intake under the aft keel must be in the water; its water
 // column keeps it primed through short skips, longer air ventilates it.
 const intakeTarget=clamp(q.depth[INTAKE]/.03,0,1);h.intake+=(intakeTarget-h.intake)*(1-Math.exp(-dt*(intakeTarget<h.intake?3.5:14)));
 const thrust=C.thrust.static*thrustScale*throttle*clamp(1-U/jetSpeed,0,1.4)*h.intake,nozzle=steer*C.thrust.nozzle*handling;
 const reverse=riding&&c.brake&&h.intake>.2?-Math.min(1400,900+300*Math.max(0,U))*h.intake:0;
 const friction=.5*RHO*U*Math.abs(U)*C.friction*surfaceArea;
 // Off the throttle the idling pump and intake grate drag the ski off the plane.
 const idle=.5*RHO*U*Math.abs(U)*C.thrust.idleDrag*(1-throttle)*h.intake;
 const hump=C.mass*G*C.hump.drag*Math.exp(-(((Math.abs(U)-C.hump.speed)/C.hump.width)**2))*clamp(wetSum*2,0,1)*clamp(Math.abs(U)/1.5,0,1)*Math.sign(U);
 const speed=Math.hypot(r.vx,r.vz,h.vy),air=.5*AIR*C.airDrag*speed/C.mass;
 const forward=(thrust+reverse)*Math.cos(nozzle)-friction-idle-induced*Math.sign(U||1)-hump;
 const sideways=side-thrust*Math.sin(nozzle);
 r.vx+=((forward*fx+sideways*rx-buoyancy*slopeX)/C.mass-air*r.vx)*dt;
 r.vz+=((forward*fz+sideways*rz-buoyancy*slopeZ)/C.mass-air*r.vz)*dt;
 // Yaw: the nozzle swings the stern; the wetted hull resists and weathervanes.
 // A banked hull's inside chine bites and carves it round, like a ski.
 yawMoment+=thrust*Math.sin(nozzle)*(C.centre-C.thrust.z)-h.roll*Math.max(0,U)*wetSum*C.side.carve*grip-q.yawRate*(40+80*wetSum);
 q.yawRate+=yawMoment/C.inertia.yaw*dt;r.heading+=q.yawRate*dt;
 // Heave, pitch and roll carry the entrained water's added mass.
 const planing=smooth(4,10,U);
 pitchMoment+=-thrust*C.thrust.depth+lean*C.rider.trim-h.pitchVelocity*(wetStations?25:8);
 // In the air the rider shifts their weight to hold the ski's attitude; lean
 // still sets the trim they aim for.
 if(!wetStations&&riding)pitchMoment+=clamp((-(.08-lean*.3)-h.pitch)*C.rider.air-h.pitchVelocity*C.rider.air*.25,-C.rider.airAuthority,C.rider.airAuthority);
 const bank=clamp(-Math.atan(U*q.yawRate/G)*C.rider.bank-steer*.45*planing*(.35+.65*throttle),-.9,.9);
 const balance=riding?clamp((bank-h.roll)*C.rider.balance-h.rollVelocity*C.rider.damping,-C.rider.authority,C.rider.authority):0;
 rollMoment+=balance-h.rollVelocity*(10+30*wetSum);
 // The centre of gravity heaves and the hull pitches about it; h.y is the
 // ride point at midships, which also rises as the hull pitches about the CG.
 // Heave of the centre of gravity and pitch about it, linearly implicit in the
 // water's rate-dependent forces so a slam cannot overshoot within a substep.
 // h.vy is the ride point's speed: the CG's plus pitch rate times its offset.
 const heaveInertia=C.mass+heaveMass,pitchInertia=C.inertia.pitch+pitchMass,rollInertia=C.inertia.roll+rollMass;
 const a11=heaveInertia-dt*forceVy,a12=-heaveInertia*C.centre-dt*forceW,a21=-dt*momentVy,a22=pitchInertia-dt*momentW;
 const b1=dt*(lift-C.mass*G),b2=dt*pitchMoment,det=a11*a22-a12*a21;
 const dVy=(b1*a22-a12*b2)/det,dW=(a11*b2-a21*b1)/det;
 h.vy+=dVy;h.y+=h.vy*dt;h.pitchVelocity+=dW;
 h.rollVelocity+=rollMoment/(rollInertia+dt*rollDamping)*dt;
 h.pitch=clamp(h.pitch+h.pitchVelocity*dt,-1.4,1.4);h.roll=clamp(h.roll+h.rollVelocity*dt,-1.9,1.9);
 if(Math.abs(h.pitch)===1.4)h.pitchVelocity=0;
 r.x+=r.vx*dt;r.z+=r.vz*dt;
 h.waterVelocity+=((water-h.waterHeight)/dt-h.waterVelocity)*(1-Math.exp(-dt*12));h.waterHeight=water;
 h.wet=wetSum;h.bowWet=bow;h.sternWet=stern;h.portWet=port;h.starboardWet=starboard;h.load=lift/(C.mass*G);
 q.thrust=thrust;q.lift=dynamic;q.support=lift;q.slip=sway;
 // The twelve classic hull patches mirror the sections for the view's effects.
 for(let i=0;i<HULL_PATCHES.length;i++){
  const p=HULL_PATCHES[i],j=PATCH_STATION[i],st=STATIONS[j],patch=h.patches[i],k=p.x>0?1:0;
  const local=q.depth[j]-(p.x?Math.abs(p.x)*Math.tan(clamp(st.deadrise+(k?1:-1)*h.roll,.06,1.45)):0);
  patch.water=q.water[j];patch.wet=clamp(local/.06,0,1);patch.force=(p.x?q.force[j*2+k]:q.force[j*2]+q.force[j*2+1])/(C.mass*G);
 }
 // Flight, landings and capsizes.
 const airborne=!wetStations&&h.y>water+.3;
 let landing=false,impact=0;
 if(airborne){q.airTime+=dt;q.flightPeak=Math.max(q.flightPeak,h.y-water);}else if(!h.launched){q.airTime=0;q.flightPeak=0;}
 if(h.launched&&wetSum>.1){if(approach>1){impact=approach;landing=true;h.landingId++;}h.launched=false;q.bestAir=Math.max(q.bestAir,q.airTime);q.airTime=0;q.flightPeak=0;}
 h.airborne=airborne;if(airborne&&q.airTime>.12)h.launched=true;h.airTime=airborne?q.airTime:0;
 if(h.y<water-1.2){h.y=water-1.2;h.vy=Math.max(h.vy,0);}
 h.drag=wetSum*planing*.035;h.reengagement=0;
 h.impact*=Math.exp(-dt*6);
 const compressTarget=clamp((h.load-1)*.14+h.impact*.045,0,.38);
 h.compressionVelocity+=((compressTarget-h.compression)*95-h.compressionVelocity*15)*dt;h.compression=clamp(h.compression+h.compressionVelocity*dt,0,.38);
 const capsized=riding&&(Math.abs(h.roll)>1.25||landing&&impact>7&&h.pitch>.55);
 return {landing,impact,capsized};
}

/** Right the hull after a wipeout or rescue: it floats level again where it is. */
export function rightOpenSeaCraft(r){const q=r.openSea;if(!q)return;q.initialized=false;q.yawRate=0;r.hydro.launched=false;}
