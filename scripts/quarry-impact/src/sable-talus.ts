import * as T from 'three';
/** Jointed sedimentary blocks: continuous deformation keeps the six face seams
 * closed, while offset bedding and chipped corners avoid identical gemstones. */
export function createTalusGeometry(variant:number){
 const geometry=new T.BoxGeometry(2,2,2,4,3,4),p=geometry.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  const radius=Math.hypot(x,y,z),round=1-.28*(radius-1);
  const bedding=Math.sin(y*8+variant*1.7)*.055;
  const chip=Math.sin(x*5.3+y*3.7+z*4.9+variant*2.3)*.045;
  p.setXYZ(i,x*(round+chip)+bedding*(1-Math.abs(x)*.35),y*(round+chip)*(.84+variant*.035),z*(round+chip)-bedding*.45);
 }
 // The face UVs preserve directional rock grain; triangles remain shared within
 // each fracture face, yielding broad planes with softened, irregular edges.
 geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}
