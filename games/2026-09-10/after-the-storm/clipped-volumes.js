import {HULL_PROBES,hullProbeOffset} from './hull-probes.js';
import {projectSolidContact} from './solid-contact.js';

const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vec=p=>Array.isArray(p)?p:[p.x,p.y,p.z];
const upperSideExclusions=new Set([1,8,11]);

// Three source projection intervals describe a finite solid volume. The axes
// need not be exactly perpendicular: solve their intersection rather than
// constructing corners by assuming an orthonormal rotation matrix.
export function clippedVolume({origin,axes,spans,...metadata}){
 if(origin?.length!==3||axes?.length!==3||axes.some(a=>a.length!==3)||spans?.length!==3||
  ![...origin,...axes.flat(),...spans].every(Number.isFinite)||spans.some(v=>v<=0))throw new TypeError('Invalid contact volume');
 const dual=[cross(axes[1],axes[2]),cross(axes[2],axes[0]),cross(axes[0],axes[1])],det=dot(axes[0],dual[0]);
 if(Math.abs(det)<1e-8)throw new TypeError('Collapsed contact volume');
 const vertices=Array.from({length:8},(_,bits)=>origin.map((v,k)=>v-dual.reduce((sum,a,i)=>sum+a[k]*spans[i]*((bits>>i)&1)/det,0)));
 const bounds={min:[0,1,2].map(k=>Math.min(...vertices.map(p=>p[k]))),max:[0,1,2].map(k=>Math.max(...vertices.map(p=>p[k])))};
 // Independently tessellated collision geometry, not source graphics.
 const triangles=[];
 for(let axis=0;axis<3;axis++)for(let end=0;end<2;end++){
  const others=[0,1,2].filter(i=>i!==axis),bits=end<<axis;
  const ids=[bits,bits|(1<<others[0]),bits|(1<<others[0])|(1<<others[1]),bits|(1<<others[1])];
  const normal=axes[axis].map(v=>v*(end?-1:1));
  const [a,b,c]=ids.map(i=>vertices[i]),direction=cross(b.map((v,i)=>v-a[i]),c.map((v,i)=>v-a[i]));
  if(dot(direction,normal)<0)ids.reverse();
  triangles.push([vertices[ids[0]],vertices[ids[1]],vertices[ids[2]]],[vertices[ids[0]],vertices[ids[2]],vertices[ids[3]]]);
 }
 return {...metadata,origin:[...origin],axes:axes.map(a=>[...a]),spans:[...spans],vertices,bounds,triangles};
}

// Exact geometric predicate and face selection of the source volume consumer.
// All upper samples still collide with upward faces; only three of them omit
// side/downward contacts. There is no infinite height or .4m plane band here.
export function volumeContact(volume,point,probeIndex=-1){
 const p=vec(point),difference=volume.origin.map((v,i)=>v-p[i]),coordinates=volume.axes.map(a=>dot(a,difference));
 if(coordinates.some((v,i)=>v<0||v>=volume.spans[i]))return null;
 let depth=Infinity,normal=null;
 for(let i=0;i<3;i++){
  if(coordinates[i]<depth){depth=coordinates[i];normal=volume.axes[i];}
  const opposite=volume.spans[i]-coordinates[i];
  if(opposite<depth){depth=opposite;normal=volume.axes[i].map(v=>v===0?0:-v);}
 }
 if(normal[1]<=0&&upperSideExclusions.has(probeIndex))return null;
 return {normal:{x:normal[0],y:normal[1],z:normal[2]},penetration:depth,volume};
}

export function clippedVolumes(rows){
 const volumes=rows.map(q=>q.vertices?q:clippedVolume(q)),size=8,bins=new Map();
 for(const volume of volumes)for(let x=Math.floor(volume.bounds.min[0]/size);x<=Math.floor(volume.bounds.max[0]/size);x++)
 for(let z=Math.floor(volume.bounds.min[2]/size);z<=Math.floor(volume.bounds.max[2]/size);z++){
  const key=x+','+z;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(volume);
 }
 return {volumes,query(point){return bins.get(Math.floor(point.x/size)+','+Math.floor(point.z/size))||[];}};
}

// The live pressure solver still uses a rigid craft approximation. Preserve
// the source volume and twelve-point predicate while distributing its impulse
// through that craft; the isolated articulated kernel supplies native point
// responses when its remaining rider/wave inputs are ready.
export function constrainClippedVolumes(solids,r){
 if(!solids)return null;
 let impact=0,support=null;
 for(let iteration=0;iteration<8;iteration++){
  const pose={heading:r.heading,pitch:r.hydro.pitch,roll:r.hydro.roll};let deepest=null;
  for(let index=0;index<HULL_PROBES.length;index++){
   const offset=hullProbeOffset(HULL_PROBES[index],pose),point={x:r.x+offset.x,y:r.hydro.y+offset.y,z:r.z+offset.z};
   for(const volume of solids.query(point)){
    const hit=volumeContact(volume,point,index);
    if(hit&&(!deepest||hit.penetration>deepest.penetration))deepest={...hit,offset};
   }
  }
  if(!deepest)break;
  support=deepest;
  const incoming=projectSolidContact(r,deepest.normal,deepest.offset,deepest.penetration);
  // Source soft volumes retain the same normal response, but report only40%
  // of the incoming speed to their impact accumulator (ramps and one reef).
  impact=Math.max(impact,incoming*(deepest.volume.flag?.4:1));
  if(deepest.penetration<.001)break;
 }
 return support?{volume:support.volume,normal:support.normal,impact}:null;
}
