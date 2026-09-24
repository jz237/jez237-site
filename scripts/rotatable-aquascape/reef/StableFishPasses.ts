import * as T from 'three';

/** Three's transparent DoubleSide path switches sides and invalidates the
 * material twice on every draw. Keep those same back/front draws as adjacent
 * groups on the same object, with stable materials and shared vertex buffers.
 * Transparent sorting uses object depth/id, so each pair stays in native order.
 */
export function stabilizeFishPasses(root:T.Object3D){
 const materials=new Map<T.Material,T.Material[]>(),geometries=new Map<T.BufferGeometry,T.BufferGeometry>();
 let meshes=0;
 root.traverse(object=>{
  if(!(object instanceof T.Mesh)||object.name!=='fin'||object instanceof T.SkinnedMesh||object instanceof T.InstancedMesh||Array.isArray(object.material))return;
  const source=object.material,geometry=object.geometry;
  if(!source.transparent||source.side!==T.DoubleSide||source.forceSinglePass||geometry.groups.length||geometry.drawRange.start!==0||geometry.drawRange.count!==Infinity)return;
  // This optimization is for the fish membranes, which do not write depth or
  // use transmission. Leave other transparent surfaces on their native path.
  if(source.depthWrite||(source as T.MeshPhysicalMaterial).transmission>0)return;
  let pair=materials.get(source);
  if(!pair){
   pair=[T.BackSide,T.FrontSide].map(side=>{
    const material=source.clone();material.side=side;
    material.onBeforeCompile=source.onBeforeCompile;
    material.customProgramCacheKey=source.customProgramCacheKey;
    return material;
   });
   materials.set(source,pair);
  }
  let grouped=geometries.get(geometry);
  if(!grouped){
   grouped=new T.BufferGeometry();grouped.name=geometry.name;
   grouped.setIndex(geometry.index);
   for(const name of Object.keys(geometry.attributes))grouped.setAttribute(name,geometry.getAttribute(name));
   grouped.morphAttributes=geometry.morphAttributes;grouped.morphTargetsRelative=geometry.morphTargetsRelative;
   grouped.boundingBox=geometry.boundingBox;grouped.boundingSphere=geometry.boundingSphere;
   grouped.userData=geometry.userData;
   const count=geometry.index?.count??geometry.getAttribute('position').count;
   grouped.addGroup(0,count,0);grouped.addGroup(0,count,1);
   geometries.set(geometry,grouped);
  }
  object.geometry=grouped;object.material=pair;meshes++;
 });
 return {meshes,materials:materials.size*2,geometries:geometries.size};
}
