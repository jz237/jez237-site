import * as T from 'three';

/** Temporary attachment-only BVH. Keeps the original triangles and exact ray
 * intersections while avoiding a full rock scan for every tiny living foot. */
export function rockRayIndex(mesh:T.Mesh){
 const p=mesh.geometry.getAttribute('position'),index=mesh.geometry.index!;
 type Node={box:T.Box3;left?:Node;right?:Node;triangles?:number[]};
 const bounds=new Float64Array(index.count/3*6),center=new Float64Array(index.count),v=new T.Vector3();
 for(let triangle=0;triangle<index.count/3;triangle++){
  const box=new T.Box3();for(let k=0;k<3;k++)box.expandByPoint(v.fromBufferAttribute(p,index.getX(triangle*3+k)));
  bounds.set([...box.min.toArray(),...box.max.toArray()],triangle*6);box.getCenter(v);center.set(v.toArray(),triangle*3);
 }
 const build=(triangles:number[]):Node=>{
  const box=new T.Box3();for(const i of triangles){box.expandByPoint(v.fromArray(bounds,i*6));box.expandByPoint(v.fromArray(bounds,i*6+3));}
  if(triangles.length<=24)return {box,triangles};
  const size=box.getSize(new T.Vector3()),axis=size.x>size.y?(size.x>size.z?0:2):(size.y>size.z?1:2);
  triangles.sort((a,b)=>center[a*3+axis]-center[b*3+axis]);const middle=Math.floor(triangles.length/2);
  return {box,left:build(triangles.slice(0,middle)),right:build(triangles.slice(middle))};
 };
 const root=build(Array.from({length:index.count/3},(_,i)=>i)),ray=new T.Ray(),entry=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),hit=new T.Vector3();
 return (origin:T.Vector3,direction:T.Vector3,far:number)=>{
  ray.set(origin,direction);let closest=far,result:{point:T.Vector3;face:{normal:T.Vector3};object:T.Mesh}|undefined;
  const visit=(node:Node)=>{
   if(!ray.intersectBox(node.box,entry)||(!node.box.containsPoint(origin)&&entry.distanceToSquared(origin)>closest*closest))return;
   if(node.triangles){for(const i of node.triangles){a.fromBufferAttribute(p,index.getX(i*3));b.fromBufferAttribute(p,index.getX(i*3+1));c.fromBufferAttribute(p,index.getX(i*3+2));
    if(!ray.intersectTriangle(a,b,c,true,hit))continue;const distance=hit.distanceTo(origin);if(distance>closest)continue;
    closest=distance;result={point:hit.clone(),face:{normal:new T.Vector3().subVectors(b,a).cross(new T.Vector3().subVectors(c,a)).normalize()},object:mesh};
   }}else{visit(node.left!);visit(node.right!);}
  };
  visit(root);return result;
 };
}
