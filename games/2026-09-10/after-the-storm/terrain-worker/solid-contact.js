import {HULL_PROBES,hullProbeOffset} from './hull-probes.js?v=4580da672e07';

// Unit-mass rigid-body approximation of the reference's distributed hull.
// A nose contact rotates the craft as well as moving its centre. Applying the
// full nose velocity correction to the centre alone creates enormous jumps.
const mean=f=>HULL_PROBES.reduce((sum,p)=>sum+f(p),0)/HULL_PROBES.length;
export const HULL_INERTIA=Object.freeze({pitch:mean(p=>p.y*p.y+p.z*p.z),yaw:mean(p=>p.x*p.x+p.z*p.z),roll:mean(p=>p.x*p.x+p.y*p.y)});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;

function worldAngularVelocity(r){
 const h=r.hydro,sh=Math.sin(r.heading),ch=Math.cos(r.heading),sp=Math.sin(h.pitch),cp=Math.cos(h.pitch);
 const pitch=h.pitchVelocity||0,yaw=r.yawVelocity||0,roll=h.rollVelocity||0;
 // Y-X-Z Euler derivatives: heading rotates about world Y, pitch about the
 // yawed X axis, and roll about the hull's forward axis. Body-axis impulse
 // components cannot be stored directly as these Euler rates.
 return {x:pitch*ch+roll*sh*cp,y:yaw-roll*sp,z:-pitch*sh+roll*ch*cp};
}

function eulerRates(r,world){
 const sh=Math.sin(r.heading),ch=Math.cos(r.heading),sp=Math.sin(r.hydro.pitch),cp=Math.cos(r.hydro.pitch);
 const pitch=world.x*ch-world.z*sh;
 // The modern pressure solver keeps pitch away from gimbal lock. A collapsed
 // external fixture still gets bounded finite rates at the singular pose.
 const roll=Math.abs(cp)>1e-5?(world.x*sh+world.z*ch)/cp:0;
 return {pitch,yaw:world.y+roll*sp,roll};
}

function contactMass(r,normal,offset){
 const h=r.hydro,pose={heading:r.heading,pitch:h.pitch,roll:h.roll};
 const right=hullProbeOffset({x:1,y:0,z:0},pose),up=hullProbeOffset({x:0,y:1,z:0},pose),forward=hullProbeOffset({x:0,y:0,z:1},pose);
 const torque={x:offset.y*normal.z-offset.z*normal.y,y:offset.z*normal.x-offset.x*normal.z,z:offset.x*normal.y-offset.y*normal.x};
 const pitch=dot(torque,right),yaw=dot(torque,up),roll=dot(torque,forward);
 const angular={x:right.x*pitch/HULL_INERTIA.pitch+up.x*yaw/HULL_INERTIA.yaw+forward.x*roll/HULL_INERTIA.roll,y:right.y*pitch/HULL_INERTIA.pitch+up.y*yaw/HULL_INERTIA.yaw+forward.y*roll/HULL_INERTIA.roll,z:right.z*pitch/HULL_INERTIA.pitch+up.z*yaw/HULL_INERTIA.yaw+forward.z*roll/HULL_INERTIA.roll};
 return {torque,angular,k:1+dot(torque,angular)};
}

export function solidContactVelocity(r,normal,offset){
 const omega=worldAngularVelocity(r),torque={x:offset.y*normal.z-offset.z*normal.y,y:offset.z*normal.x-offset.x*normal.z,z:offset.x*normal.y-offset.y*normal.x};
 return r.vx*normal.x+r.hydro.vy*normal.y+r.vz*normal.z+dot(omega,torque);
}

export function projectSolidContact(r,normal,offset,penetration){
 const h=r.hydro,m=contactMass(r,normal,offset),j=Math.max(0,penetration)/m.k;
 const omega=worldAngularVelocity(r),inward=r.vx*normal.x+h.vy*normal.y+r.vz*normal.z+dot(omega,m.torque);
 const correction=eulerRates(r,m.angular);
 r.x+=normal.x*j;h.y+=normal.y*j;r.z+=normal.z*j;
 h.pitch+=correction.pitch*j;r.heading+=correction.yaw*j;h.roll+=correction.roll*j;
 if(inward<0){const impulse=-inward/m.k;
  r.vx+=normal.x*impulse;h.vy+=normal.y*impulse;r.vz+=normal.z*impulse;
  omega.x+=m.angular.x*impulse;omega.y+=m.angular.y*impulse;omega.z+=m.angular.z*impulse;
 }
 const rates=eulerRates(r,omega);h.pitchVelocity=rates.pitch;r.yawVelocity=rates.yaw;h.rollVelocity=rates.roll;
 return Math.max(0,-inward);
}
