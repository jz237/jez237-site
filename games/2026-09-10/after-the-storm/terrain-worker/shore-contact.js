import {HULL_PROBES,hullProbeOffset} from './hull-probes.js?v=c69bdfad4cd7';
import {projectSolidContact,solidContactVelocity} from './solid-contact.js?v=c69bdfad4cd7';

// Source shore edges constrain horizontal hull points at every height. They
// are separate from water datum, the finite 3D floors and visual land heights.
export function shoreLines(polygons){
 const edges=[],bins=new Map(),size=8;
 for(const polygon of polygons){
  const p=polygon.outline,area=p.reduce((sum,a,i)=>{const b=p[(i+1)%p.length];return sum+a[0]*b[1]-b[0]*a[1];},0);
  const sign=(area>0?1:-1)*(polygon.waterInside?-1:1),count=polygon.sourceClosed===false?p.length-1:p.length;
  for(let i=0;i<count;i++){
   const a=p[i],b=p[(i+1)%p.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
   if(length<1e-8)continue;
   const edge={a,b,length,tx:dx/length,tz:dz/length,normal:{x:sign*dz/length,y:0,z:-sign*dx/length},id:polygon.id};edges.push(edge);
   for(let x=Math.floor((Math.min(a[0],b[0])-.4)/size);x<=Math.floor((Math.max(a[0],b[0])+.4)/size);x++)
   for(let z=Math.floor((Math.min(a[1],b[1])-.4)/size);z<=Math.floor((Math.max(a[1],b[1])+.4)/size);z++){
    const key=x+','+z;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(edge);
   }
  }
 }
 return {edges,query(a,b){const found=new Set();
  for(let x=Math.floor(Math.min(a.x,b.x)/size);x<=Math.floor(Math.max(a.x,b.x)/size);x++)
  for(let z=Math.floor(Math.min(a.z,b.z)/size);z<=Math.floor(Math.max(a.z,b.z)/size);z++)for(const edge of bins.get(x+','+z)||[])found.add(edge);
  return found;
 }};
}

export function shoreContact(edge,previous,current){
 const {normal:n,a,tx,tz,length}=edge,d=(current.x-a[0])*n.x+(current.z-a[1])*n.z;
 if(d>=0)return null;
 const old=(previous.x-a[0])*n.x+(previous.z-a[1])*n.z,crossing=old>=0;
 if(d<=-.4&&!crossing)return null;
 let along=(current.x-a[0])*tx+(current.z-a[1])*tz;
 // A sweep supplements the native contact band for the browser's60Hz step.
 // It must cross the finite edge, never an extension of its supporting line.
 if(d<=-.4||along<=0||along>=length){
  if(!crossing)return null;
  const f=old/(old-d),x=previous.x+(current.x-previous.x)*f,z=previous.z+(current.z-previous.z)*f;
  along=(x-a[0])*tx+(z-a[1])*tz;if(along<=0||along>=length)return null;
 }
 return {normal:n,penetration:-d};
}

export function constrainShoreLines(shores,r,oldX,oldZ,oldPose){
 if(!shores)return 0;
 let impact=0;
 for(let iteration=0;iteration<6;iteration++){
  const pose={heading:r.heading,pitch:r.hydro.pitch,roll:r.hydro.roll};let deepest=null;
  for(const probe of HULL_PROBES){
   const offset=hullProbeOffset(probe,pose),before=hullProbeOffset(probe,oldPose),p={x:r.x+offset.x,z:r.z+offset.z},old={x:oldX+before.x,z:oldZ+before.z};
   for(const edge of shores.query(old,p)){
    const contact=shoreContact(edge,old,p);
    if(contact&&solidContactVelocity(r,contact.normal,offset)<0&&(!deepest||contact.penetration>deepest.penetration))deepest={...contact,offset};
   }
  }
  if(!deepest)break;
  impact=Math.max(impact,projectSolidContact(r,deepest.normal,deepest.offset,deepest.penetration));
  if(deepest.penetration<.001)break;
 }
 return impact;
}
