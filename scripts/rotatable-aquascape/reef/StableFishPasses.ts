import * as T from 'three';

/** Three's transparent DoubleSide path draws every fish membrane twice, back
 * faces then front faces, switching shader programs between the two. Submit
 * the same two passes as one draw: a winding-reversed copy of the membrane with
 * flipped normals precedes the original under front-face culling, so the copy
 * shows exactly the back faces and the original the front faces, each in its
 * native triangle order, shaded as the BackSide/FrontSide pair shaded them.
 * Transparent sorting still uses each fin's own depth.
 */
const folded=new WeakMap<T.BufferGeometry,T.BufferGeometry>();
type Attribute=T.BufferAttribute|T.InterleavedBufferAttribute;
function doubled(source:Attribute,flip:boolean){
 const {count,itemSize}=source,Array=(source.array as Float32Array).constructor as Float32ArrayConstructor;
 const target=new T.BufferAttribute(new Array(count*2*itemSize),itemSize,source.normalized);
 // Normals (and tangent directions) turn over on the copy, as FLIP_SIDED did.
 const flipped=flip?Math.min(itemSize,3):0;
 for(let i=0;i<count;i++)for(let c=0;c<itemSize;c++){const value=source.getComponent(i,c);target.setComponent(i,c,c<flipped?-value:value);target.setComponent(i+count,c,value);}
 return target;
}
function foldPasses(geometry:T.BufferGeometry){
 let result=folded.get(geometry);if(result)return result;
 const count=geometry.getAttribute('position').count,index=geometry.index,triangles=(index?.count??count)/3;
 result=new T.BufferGeometry();result.name=geometry.name;result.userData=geometry.userData;
 const flips=(name:string)=>name==='normal'||name==='tangent';
 for(const [name,attribute] of Object.entries(geometry.attributes))result.setAttribute(name,doubled(attribute,flips(name)));
 for(const [name,targets] of Object.entries(geometry.morphAttributes))(result.morphAttributes as Record<string,Attribute[]>)[name]=targets.map(target=>doubled(target,flips(name)));
 result.morphTargetsRelative=geometry.morphTargetsRelative;
 // Vertices [0,count) are the flipped copy, drawn first with reversed winding;
 // [count,2*count) are the original membrane, drawn second as it was.
 const order=new (count*2>65535?Uint32Array:Uint16Array)(triangles*6),vertex=(i:number)=>index?index.getX(i):i;
 for(let t=0;t<triangles;t++){const a=vertex(t*3),b=vertex(t*3+1),c=vertex(t*3+2);
  order.set([a,c,b],t*3);order.set([a+count,b+count,c+count],(triangles+t)*3);}
 result.setIndex(new T.BufferAttribute(order,1));
 if(!geometry.boundingSphere)geometry.computeBoundingSphere();
 if(!geometry.boundingBox)geometry.computeBoundingBox();
 result.boundingSphere=geometry.boundingSphere!.clone();result.boundingBox=geometry.boundingBox!.clone();
 folded.set(geometry,result);
 return result;
}
export function stabilizeFishPasses(root:T.Object3D){
 const materials=new Map<T.Material,T.Material>(),geometries=new Set<T.BufferGeometry>();
 let meshes=0;
 root.traverse(object=>{
  if(!(object instanceof T.Mesh)||object.name!=='fin'||object instanceof T.SkinnedMesh||object instanceof T.InstancedMesh||Array.isArray(object.material))return;
  const source=object.material,geometry=object.geometry;
  if(!source.transparent||source.side!==T.DoubleSide||source.forceSinglePass||geometry.groups.length||geometry.drawRange.start!==0||geometry.drawRange.count!==Infinity)return;
  // This optimization is for the fish membranes, which do not write depth or
  // use transmission. Leave other transparent surfaces on their native path.
  if(source.depthWrite||(source as T.MeshPhysicalMaterial).transmission>0)return;
  let material=materials.get(source);
  if(!material){
   const single=source.clone();single.side=T.FrontSide;
   single.onBeforeCompile=source.onBeforeCompile;
   single.customProgramCacheKey=source.customProgramCacheKey;
   materials.set(source,material=single);
  }
  object.geometry=foldPasses(geometry);object.material=material;geometries.add(object.geometry);meshes++;
 });
 return {meshes,materials:materials.size,geometries:geometries.size};
}
