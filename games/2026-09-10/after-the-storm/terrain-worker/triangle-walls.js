import {HULL_PROBES,hullProbeOffset} from './hull-probes.js?v=44ffcceb5a94';
import {projectSolidContact} from './solid-contact.js?v=44ffcceb5a94';

const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const point=p=>({x:p[0],y:p[1],z:p[2]});

// Finite source side faces are independent of an authored terrain height map.
// Spatial bins retain vertical triangles, whose X/Z projection has zero area.
export function triangleWalls(rows){
 const faces=rows.map(({vertices,normal})=>{
  const [a,b,c]=vertices.map(point),u=sub(b,a),v=sub(c,a),uu=dot(u,u),uv=dot(u,v),vv=dot(v,v),det=uu*vv-uv*uv;
  if(det<1e-12)throw new Error('Degenerate wall triangle');
  const length=Math.hypot(...normal),n={x:normal[0]/length,y:normal[1]/length,z:normal[2]/length};
  if(!Number.isFinite(n.x+n.y+n.z))throw new Error('Invalid wall normal');
  return {vertices,a,u,v,uu,uv,vv,det,normal:n};
 });
 const size=8,bins=new Map();
 for(const face of faces){const vertices=face.vertices;
  for(let x=Math.floor(Math.min(...vertices.map(v=>v[0]))/size);x<=Math.floor(Math.max(...vertices.map(v=>v[0]))/size);x++)
  for(let z=Math.floor(Math.min(...vertices.map(v=>v[2]))/size);z<=Math.floor(Math.max(...vertices.map(v=>v[2]))/size);z++){
   const key=x+','+z;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(face);
  }
 }
 return {triangles:rows.map(q=>q.vertices),query(a,b){
  const found=new Set();
  for(let x=Math.floor(Math.min(a.x,b.x)/size);x<=Math.floor(Math.max(a.x,b.x)/size);x++)
  for(let z=Math.floor(Math.min(a.z,b.z)/size);z<=Math.floor(Math.max(a.z,b.z)/size);z++)for(const face of bins.get(x+','+z)||[])found.add(face);
  return found;
 }};
}

function inside(face,p){
 const d=sub(p,face.a),du=dot(d,face.u),dv=dot(d,face.v),u=(du*face.vv-dv*face.uv)/face.det,v=(dv*face.uu-du*face.uv)/face.det;
 return u>=-1e-7&&v>=-1e-7&&u+v<=1+1e-7;
}

export function wallContact(face,previous,current){
 const normal=face.normal,d=dot(sub(current,face.a),normal),old=dot(sub(previous,face.a),normal);
 if(d>.006)return null;
 const crossing=old>=0&&d<0;
 if(d<-.4&&!crossing)return null;
 const projected={x:current.x-normal.x*d,y:current.y-normal.y*d,z:current.z-normal.z*d};
 // Outside the native contact band, the sweep itself must cross the finite
 // triangle. A low endpoint behind the wall cannot turn an above-wall flight
 // into a collision merely because its final plane projection is inside.
 if(d<-.4||!inside(face,projected)){
  if(!crossing)return null;
  const t=old/(old-d),p={x:previous.x+(current.x-previous.x)*t,y:previous.y+(current.y-previous.y)*t,z:previous.z+(current.z-previous.z)*t};
  if(!inside(face,p))return null;
 }
 return {normal,penetration:Math.max(0,-d)};
}

export function constrainTriangleWalls(walls,r,oldX,oldZ,oldY,oldPose){
 if(!walls)return 0;
 let impact=0;
 for(let iteration=0;iteration<6;iteration++){
  const pose={heading:r.heading,pitch:r.hydro.pitch,roll:r.hydro.roll};let deepest=null;
  for(const probe of HULL_PROBES){
   const offset=hullProbeOffset(probe,pose),before=hullProbeOffset(probe,oldPose);
   const current={x:r.x+offset.x,y:r.hydro.y+offset.y,z:r.z+offset.z},previous={x:oldX+before.x,y:oldY+before.y,z:oldZ+before.z};
   for(const face of walls.query(previous,current)){
    const hit=wallContact(face,previous,current);if(hit&&(!deepest||hit.penetration>deepest.penetration))deepest={...hit,offset};
   }
  }
  if(!deepest)break;
  impact=Math.max(impact,projectSolidContact(r,deepest.normal,deepest.offset,deepest.penetration));
  if(deepest.penetration<.001)break;
 }
 return impact;
}
