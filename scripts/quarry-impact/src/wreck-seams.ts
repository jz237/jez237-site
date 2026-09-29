import * as T from 'three';

/** The exported skin was partitioned by triangle centroids. Align its narrow
 * cut strips before subdivision so a raised hood has a straight sheet edge,
 * rather than exposing a row of tiny triangle teeth. Shared cuts use the same
 * model-space plane on both members. Authored UVs and normals are retained. */
export function alignWreckSeams(root:T.Group){
 root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert();
 root.traverse(o=>{
  if(!(o instanceof T.Mesh)||!/^panel_(hood\d*|front_fender_[LR]|bumper_front)$/.test(o.name))return;
  const matrix=new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld),back=matrix.clone().invert();
  const p=o.geometry.attributes.position,v=new T.Vector3();
  for(let i=0;i<p.count;i++){
   v.fromBufferAttribute(p,i).applyMatrix4(matrix);
   if(Math.abs(v.y-.66)<.038)v.y=.66;
   if(v.y>=.66&&Math.abs(Math.abs(v.x)-.72)<.04)v.x=Math.sign(v.x)*.72;
   v.applyMatrix4(back);p.setXYZ(i,v.x,v.y,v.z);
  }
  p.needsUpdate=true;o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();
 });
}
