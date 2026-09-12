import * as T from 'three';
/** Runtime tuning preserves the authored geometry and its baked illumination. */
export function calmSwordLeaves(scene:T.Object3D){
 scene.traverse(object=>{
  if(!(object instanceof T.InstancedMesh)||object.userData.calmGroundCurrent)return;
  const species=object.userData.plantSpecies,motion=object.geometry.getAttribute('leafMotion'),roots=object.geometry.getAttribute('plantRoot'),flex=object.geometry.getAttribute('plantFlex');
  if(!roots||!flex)return;
  const matrix=new T.Matrix4(),position=new T.Vector3();
  for(let i=0;i<object.count;i++){
   object.getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);
   // Sheltered carpet, grass and low leaves barely stir. Preserve the shared
   // stem bend so leaves and petioles remain connected higher in the plant.
   const low=species==='carpet'||species==='grass'?1:1-T.MathUtils.smoothstep(position.y-roots.getY(i),.12,.65);
   if(motion){motion.setY(i,motion.getY(i)*(species==='sword'?.28:1)*T.MathUtils.lerp(1,.10,low));motion.setZ(i,motion.getZ(i)*(species==='sword'?.60:1)*T.MathUtils.lerp(1,.48,low));motion.needsUpdate=true;}
   // Ground-cover plants have no separate tall stems to keep in sync.
   if(species==='carpet'||species==='grass')flex.setX(i,flex.getX(i)*.12);
  }
  flex.needsUpdate=true;object.userData.calmGroundCurrent=true;
 });
}
