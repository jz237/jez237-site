import * as T from 'three';
/** Tune motion after planting so authored leaf shape, clearance and baked lighting stay intact. */
export function calmSwordLeaves(scene:T.Object3D){
 scene.traverse(object=>{
  if(!(object instanceof T.InstancedMesh)||object.userData.plantSpecies!=='sword'||object.userData.calmSword)return;
  const motion=object.geometry.getAttribute('leafMotion');if(!motion)return;
  for(let i=0;i<motion.count;i++){motion.setY(i,motion.getY(i)*.28);motion.setZ(i,motion.getZ(i)*.60);}
  motion.needsUpdate=true;object.userData.calmSword=true;
 });
}
