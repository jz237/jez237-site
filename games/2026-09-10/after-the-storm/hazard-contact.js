import {SPHERE_PROBES,hullProbeOffset} from './hull-probes.js';

// Sweep both derived body-axis probes against a fixed sphere. Source radius12
// becomes .3m under the same .025 scale as the reconstructed venue.
// Keeping the sweep avoids tunnelling through a block between simulation ticks.
export function hullHazardContact(hazard,r,oldX,oldZ,oldY,{oldPose=null,dt=0}={}){
 const radius=hazard.r+(hazard.probeRadius??.3),fx=Math.sin(r.heading),fz=Math.cos(r.heading),h=r.hydro;
 const pose={heading:r.heading,pitch:h.pitch,roll:h.roll};
 let first=null;
 for(const patch of SPHERE_PROBES){
  const current=hullProbeOffset(patch,pose),previous=hullProbeOffset(patch,oldPose||pose);
  const dx=r.x-oldX+current.x-previous.x,dy=h.y-oldY+current.y-previous.y,dz=r.z-oldZ+current.z-previous.z,length=dx*dx+dy*dy+dz*dz;
  const px=oldX+previous.x-hazard.x,py=oldY+previous.y-(hazard.y??0),pz=oldZ+previous.z-hazard.z;
  const c=px*px+py*py+pz*pz-radius*radius;
  let t=0;
  if(c>0){
   if(length<1e-12)continue;
   const b=px*dx+py*dy+pz*dz,discriminant=b*b-length*c;
   if(b>=0||discriminant<0)continue;
   t=(-b-Math.sqrt(discriminant))/length;
   if(t<0||t>1)continue;
  }
  const x=px+dx*t,y=py+dy*t,z=pz+dz*t,dist=Math.hypot(x,y,z);
  const normal=dist>1e-8?{x:x/dist,y:y/dist,z:z/dist}:{x:-fx,y:0,z:-fz};
  const depth=Math.max(0,radius-dist);
  if(!first||t<first.t||t===first.t&&depth>first.depth)first={t,depth,normal,velocity:dt>0?{x:dx/dt,y:dy/dt,z:dz/dt}:null};
 }
 return first;
}

// The breaking contact still resolves normally. Destruction only removes
// subsequent contacts, including the other player's contacts in this tick.
export function resolveHazardContact(r,contact,oldX,oldZ,oldY){
 const {normal:n,t,depth}=contact,h=r.hydro;
 r.x=oldX+(r.x-oldX)*t+n.x*(depth+.002);
 r.z=oldZ+(r.z-oldZ)*t+n.z*(depth+.002);
 h.y=oldY+(h.y-oldY)*t+n.y*(depth+.002);
 const into=r.vx*n.x+h.vy*n.y+r.vz*n.z;
 if(into<0){r.vx-=n.x*into*1.25;r.vz-=n.z*into*1.25;h.vy-=n.y*into*1.25;}
 r.speed=Math.hypot(r.vx,r.vz);
}
