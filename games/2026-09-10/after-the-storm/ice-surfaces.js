import {HULL_PATCHES} from './hydrodynamics.js';
import {polygonDistance} from './classic-courses.js';
// Ice sheets have a shared world-space outline and top elevation.
export function iceSurfaceAt(course,x,z){return (course.iceSheets||[]).find(p=>polygonDistance(p.outline,x,z)<=0)||null;}
export function iceContact(course,r){const p=iceSurfaceAt(course,r.x,r.z);return p&&r.hydro.y<=p.height+.8&&r.hydro.vy<3?p:null;}
export function supportOnIce(r,p,dt,surface){
 const h=r.hydro;h.y=p.height+.22;h.vy=0;h.wet=0;h.intake=0;h.bowWet=h.sternWet=h.portWet=h.starboardWet=0;h.airborne=false;h.airTime=0;h.drag=0;h.load=1;h.impact=0;h.pitch*=Math.exp(-dt*8);h.roll*=Math.exp(-dt*6);h.pitchVelocity=h.rollVelocity=0;h.diveRemaining=0;
 let water=0;const fx=Math.sin(r.heading),fz=Math.cos(r.heading);
 for(let i=0;i<h.patches.length;i++){const q=h.patches[i],patch=HULL_PATCHES[i];q.wet=0;q.force=0;if(surface){q.water=surface(r.x+fx*patch.z+fz*patch.x,r.z+fz*patch.z-fx*patch.x);water+=q.water*patch.weight;}}
 if(surface){h.waterVelocity=dt>0?(water-h.waterHeight)/dt:0;h.waterHeight=water;h.initialized=true;}

 const friction=Math.exp(-.09*dt);r.vx*=friction;r.vz*=friction;
}
