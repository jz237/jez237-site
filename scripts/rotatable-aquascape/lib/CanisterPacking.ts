import * as T from 'three';
export type PackedRing={position:T.Vector3;rotation:T.Quaternion;axis:T.Vector3};
const radius=.105,halfHeight=.095;
export const ringExtent=(axis:T.Vector3,direction:T.Vector3)=>Math.abs(axis.dot(direction))*halfHeight+Math.sqrt(Math.max(0,direction.lengthSq()-axis.dot(direction)**2))*radius;
/** Every separating direction uses exact support of the solid outer cylinder.
 * Treating the hollow bore as solid gives conservative, nonintersecting poses. */
export function ringAxes(a:PackedRing,b:PackedRing){
 const axes=[a.axis,b.axis,new T.Vector3().crossVectors(a.axis,b.axis),a.position.clone().sub(b.position).setY(0)];
 for(const ring of [a,b])for(let i=0;i<8;i++)axes.push(new T.Vector3(Math.cos(i*Math.PI/8),0,Math.sin(i*Math.PI/8)).applyQuaternion(ring.rotation));
 return axes.filter(v=>v.lengthSq()>1e-10).map(v=>v.clone().normalize());
}
export function ringSeparation(a:PackedRing,b:PackedRing){
 const delta=a.position.clone().sub(b.position);
 return Math.max(...ringAxes(a,b).map(n=>Math.abs(delta.dot(n))-ringExtent(a.axis,n)-ringExtent(b.axis,n)));
}
/** Upper end of the vertical collision interval, or null for a clear column. */
function contactHeight(a:PackedRing,b:PackedRing){
 let low=-Infinity,high=Infinity;
 for(const n of ringAxes(a,b)){
  const extent=ringExtent(a.axis,n)+ringExtent(b.axis,n),offset=(a.position.x-b.position.x)*n.x-b.position.y*n.y+(a.position.z-b.position.z)*n.z;
  if(Math.abs(n.y)<1e-9){if(Math.abs(offset)>extent)return null;continue;}
  const p=(-extent-offset)/n.y,q=(extent-offset)/n.y;low=Math.max(low,Math.min(p,q));high=Math.min(high,Math.max(p,q));if(low>high)return null;
 }
 return high;
}
export function packCanisterMedia(count=126){
 let seed=64129;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const result:PackedRing[]=[],up=new T.Vector3(0,1,0);
 for(let i=0;i<count;i++){
  let best:PackedRing|null=null,score=Infinity;
  for(let attempt=0;attempt<32;attempt++){
   const angle=random()*Math.PI*2,r=.905*Math.sqrt(random()),rotation=new T.Quaternion().setFromEuler(new T.Euler(random()*Math.PI,random()*Math.PI*2,random()*Math.PI));
   const ring={position:new T.Vector3(Math.cos(angle)*r,0,Math.sin(angle)*r),rotation,axis:up.clone().applyQuaternion(rotation)};
   let y=ringExtent(ring.axis,up)+.0003;
   for(const other of result){if(Math.hypot(ring.position.x-other.position.x,ring.position.z-other.position.z)>.284)continue;const contact=contactHeight(ring,other);if(contact!==null)y=Math.max(y,contact+.0003);}
   ring.position.y=y;const top=y+ringExtent(ring.axis,up),candidate=top+random()*.012;
   if(candidate<score){best=ring;score=candidate;}
  }
  result.push(best!);
 }
 return result;
}
