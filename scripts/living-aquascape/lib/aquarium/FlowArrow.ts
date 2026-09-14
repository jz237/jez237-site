import * as T from 'three';

const forward=new T.Vector3(0,1,0),tangent=new T.Vector3();
/** One rotationally symmetric shaft and arrowhead, readable from every orbit angle. */
export function flowArrowGeometry(length=.22,radius=.055){
 return new T.LatheGeometry([
  [0,-.5],[.30,-.5],[.30,.05],[1,.05],[0,.5]
 ].map(([r,y])=>new T.Vector2(r*radius,y*length)),8);
}
/** Both position and heading use the same arc-length parameter, including endpoints. */
export function placeFlowArrow(object:T.Object3D,curve:T.Curve<T.Vector3>,progress:number){
 curve.getPointAt(progress,object.position);
 curve.getTangentAt(progress,tangent);
 if(tangent.lengthSq()>1e-12)object.quaternion.setFromUnitVectors(forward,tangent.normalize());
}
