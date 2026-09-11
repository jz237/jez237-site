import * as T from 'three';

// Include the stand, lamp and external glass return. Suspension wires continue upward.
export const aquariumFrame=new T.Box3(new T.Vector3(-5.3,-1,-2.85),new T.Vector3(5.3,6.4,2.7));
export const aquariumTarget=new T.Vector3(0,2.75,0);
export function framingSpace(height:number){return {horizontal:.95,vertical:Math.max(.38,Math.min(.70,1-280/height))};}

export function orbitToward(position:T.Vector3,destination:T.Vector3,amount:number){
 const from=new T.Spherical().setFromVector3(position.clone().sub(aquariumTarget)),to=new T.Spherical().setFromVector3(destination.clone().sub(aquariumTarget));
 from.radius=T.MathUtils.lerp(from.radius,to.radius,amount);from.phi=T.MathUtils.lerp(from.phi,to.phi,amount);from.theta=T.MathUtils.lerp(from.theta,to.theta,amount);
 return new T.Vector3().setFromSpherical(from).add(aquariumTarget);
}

/** Fit the real perspective corners, including the nearer glass and stand. */
export function aquariumFieldOfView(width:number,height:number,position:T.Vector3){
 if(width<=0||height<=0)throw Error('Camera viewport must have positive dimensions');
 const camera=new T.PerspectiveCamera();camera.position.copy(position);camera.lookAt(aquariumTarget);camera.updateMatrixWorld();
 const space=framingSpace(height),aspect=width/height;let slope=0;
 for(const x of [aquariumFrame.min.x,aquariumFrame.max.x])for(const y of [aquariumFrame.min.y,aquariumFrame.max.y])for(const z of [aquariumFrame.min.z,aquariumFrame.max.z]){
  const p=new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse),depth=-p.z;
  if(depth<=0)throw Error('Camera must remain outside the framing volume');
  slope=Math.max(slope,Math.abs(p.x)/(depth*aspect*space.horizontal),Math.abs(p.y)/(depth*space.vertical));
 }
 return T.MathUtils.radToDeg(2*Math.atan(slope));
}
