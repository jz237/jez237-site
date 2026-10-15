import {HULL_PATCHES} from './hydrodynamics.js';
import {polygonDistance} from './classic-courses.js';
import {surfaceSample} from './faceted-surfaces.js';
import {HULL_PROBES,hullProbeOffset,wetHullProbes} from './hull-probes.js';
import {projectSolidContact} from './solid-contact.js';
// Shared contact geometry supports the source's inclined coasts as well as
// flat floes. A submerged slope does not suspend water propulsion prematurely.
export function iceSurfaceAt(course,x,z){return (course.staticSurfaces||course.iceSheets||[]).find(p=>p.heightAt?p.heightAt(x,z)!==null:polygonDistance(p.outline,x,z)<=0)||null;}
export function iceContact(course,r){
 const previous=(course.staticSurfaces||course.iceSheets||[]).find(p=>p.triangles&&p.id===r.staticFloorId);
 if(previous)return r.staticFloorExposed?previous:null;
 const p=iceSurfaceAt(course,r.x,r.z);if(!p)return null;
 if(p.triangles)return null; // Facets use swept, distributed hull contact below.
 const q=surfaceSample(p,r.x,r.z),h=r.hydro;
 return q.height>=h.waterHeight-.22&&h.y>=q.height-.18&&h.y<=q.height+.225&&h.vy-(q.sx*r.vx+q.sz*r.vz)<3?p:null;
}
export function supportOnIce(r,p,dt,surface){
 const q=surfaceSample(p,r.x,r.z)||{sx:r.staticSlopeX||0,sz:r.staticSlopeZ||0},h=r.hydro,fx=Math.sin(r.heading),fz=Math.cos(r.heading);
 if(p.triangles){h.vy-=9.81*dt;h.y+=h.vy*dt;}
 else{h.y=q.height+.22;h.vy=q.sx*r.vx+q.sz*r.vz;}
 h.wet=0;h.intake=0;h.bowWet=h.sternWet=h.portWet=h.starboardWet=0;h.airborne=false;h.airTime=0;h.drag=0;h.load=1;h.impact=0;
 const pitch=-Math.atan(q.sx*fx+q.sz*fz),roll=Math.atan(q.sx*fz-q.sz*fx),oldPitch=h.pitch,oldRoll=h.roll;
 h.pitch+=(pitch-h.pitch)*(1-Math.exp(-dt*8));h.roll+=(roll-h.roll)*(1-Math.exp(-dt*6));
 // Rotate about the supporting hull probe, keeping that contact point fixed.
 // Rotating around the centre would lift every probe off a rising surface.
 if(p.triangles)h.y+=(h.pitch-oldPitch)*(r.staticPatchZ||0)-(h.roll-oldRoll)*(r.staticPatchX||0);
 h.pitchVelocity=h.rollVelocity=0;h.diveRemaining=0;
 let water=0;
 for(let i=0;i<h.patches.length;i++){const q=h.patches[i],patch=HULL_PATCHES[i];q.wet=0;q.force=0;if(surface){q.water=surface(r.x+fx*patch.z+fz*patch.x,r.z+fz*patch.z-fx*patch.x);water+=q.water*patch.weight;}}
 if(surface){h.waterVelocity=dt>0?(water-h.waterHeight)/dt:0;h.waterHeight=water;h.initialized=true;}

 if(!p.triangles){const slopeGravity=9.81/(1+q.sx*q.sx+q.sz*q.sz);r.vx-=q.sx*slopeGravity*dt;r.vz-=q.sz*slopeGravity*dt;}
 const friction=Math.exp(-.09*dt);r.vx*=friction;r.vz*=friction;
}

// Resolve the twelve hull probes after water integration and X/Z movement.
// Static floors also constrain a wet hull beneath a passing wave. They only
// suspend water thrust when exposed; submerged skirts are not solid slabs
// extending infinitely upward. A crossing may enter the .4m native contact
// band between ticks, but a hull already far beneath a plane is never snapped.
export function constrainIceFloors(course,r,oldX,oldZ,oldY,oldPose=null,surface=null){
 const floors=(course.staticSurfaces||course.iceSheets||[]).filter(p=>p.triangles),h=r.hydro;
 if(!floors.length)return null;
 const wasAirborne=h.airborne,previous=oldPose||{pitch:h.pitch,roll:h.roll,heading:r.heading};
 let supporting=null,impact=0;
 for(let iteration=0;iteration<6;iteration++){
  const pose={pitch:h.pitch,roll:h.roll,heading:r.heading};
  let deepest=null;
  for(const patch of HULL_PROBES){
   const offset=hullProbeOffset(patch,pose),before=hullProbeOffset(patch,previous);
   const bottom=h.y+offset.y,previousBottom=oldY+before.y;
   for(const floor of floors){const q=floor.sample(r.x+offset.x,r.z+offset.z);if(!q)continue;
    const depth=q.height-bottom,old=floor.sample(oldX+before.x,oldZ+before.z);
    if(depth<-.006||depth>.4&&!(old&&previousBottom>=old.height&&depth>0))continue;
    if(!deepest||depth>deepest.depth)deepest={floor,q,depth,patch,offset};
   }
  }
  if(!deepest)break;
  supporting=deepest;
  const {q,depth}=deepest,length=Math.hypot(q.sx,1,q.sz),nx=-q.sx/length,ny=1/length,nz=-q.sz/length;
  impact=Math.max(impact,projectSolidContact(r,{x:nx,y:ny,z:nz},deepest.offset,Math.max(0,depth)*ny));
  if(depth<.001)break;
 }
 r.staticFloorId=supporting?.floor.id||'';
 if(surface)r.sourceWetCount=wetHullProbes(r,surface);
 r.staticFloorExposed=!!supporting&&(surface?r.sourceWetCount===0:h.patches.every(p=>p.wet<=0));
 if(!supporting){r.onIce='';return null;}
 r.staticSlopeX=supporting.q.sx;r.staticSlopeZ=supporting.q.sz;
 r.staticPatchX=supporting.patch.x;r.staticPatchZ=supporting.patch.z;
 r.onIce=r.staticFloorExposed?r.staticFloorId:'';
 if(wasAirborne&&impact>1.5){h.landingId++;h.impact=impact;}
 h.airborne=false;h.airTime=0;
 return {surface:supporting.floor,landing:wasAirborne&&impact>1.5,impact};
}

// Leaning against a sliding hull cannot turn it, but can upset the rider.
export function stepIceBalance(r,input,dt,onIce){
 const speed=Math.hypot(r.vx,r.vz),steer=Math.max(0,(Math.abs(input.steer||0)-.35)/.65),moving=Math.max(0,Math.min(1,(speed-3)/6));
 const strain=onIce&&!r.wipeout?steer*moving:0;
 r.iceBalance=Math.max(0,Math.min(1.4,(r.iceBalance||0)+dt*(strain>0?strain*(.85+((r.iceBalance||0)>.4?(input.throttle||0)*.45:0)):-1.5)));
 if(onIce){if(strain>0)r.iceLeanSide=Math.sign(input.steer);const target=-(r.iceLeanSide||1)*r.iceBalance*.65;r.hydro.roll+=(target-r.hydro.roll)*(1-Math.exp(-dt*12));}
 return onIce&&r.iceBalance>=1.15;
}
