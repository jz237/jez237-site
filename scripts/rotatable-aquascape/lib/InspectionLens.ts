import * as T from 'three';

/** Crop the original projection instead of moving the eye or enlarging its pixels.
 * Reuses scene geometry, lights and existing reflection/shadow captures. */
export function frameInspectionLens(source:T.PerspectiveCamera,camera:T.PerspectiveCamera,center:T.Vector2,radius:T.Vector2,zoom:number){
 camera.copy(source,false);
 camera.matrixAutoUpdate=false;
 camera.matrixWorld.copy(source.matrixWorld);
 camera.matrixWorldInverse.copy(source.matrixWorldInverse);
 const sx=zoom/(2*radius.x),sy=zoom/(2*radius.y);
 camera.projectionMatrix.copy(source.projectionMatrix).premultiply(new T.Matrix4().set(
  sx,0,0,-(center.x*2-1)*sx,
  0,sy,0,-(center.y*2-1)*sy,
  0,0,1,0,0,0,0,1));
 camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}
