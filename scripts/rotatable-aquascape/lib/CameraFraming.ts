import * as T from 'three';

// Separate component bounds avoid reserving empty upper corners above the tank.
// Include the complete plinth and lamp housing; suspension wires continue upward.
export const aquariumFrames=[
 new T.Box3(new T.Vector3(-5.15,.025,-2.44),new T.Vector3(5.15,5.60,2.4)),
 new T.Box3(new T.Vector3(-5.35,-.95,-2.55),new T.Vector3(5.35,.035,2.55)),
 new T.Box3(new T.Vector3(-4.6,6.326,-.475),new T.Vector3(4.6,6.46,.175)),
 new T.Box3(new T.Vector3(3.6,.9,-2.75),new T.Vector3(4.87,5.98,-1.25))
];
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
 for(const frame of aquariumFrames)for(const x of [frame.min.x,frame.max.x])for(const y of [frame.min.y,frame.max.y])for(const z of [frame.min.z,frame.max.z]){
  const p=new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse),depth=-p.z;
  if(depth<=0)throw Error('Camera must remain outside the framing volume');
  slope=Math.max(slope,Math.abs(p.x)/(depth*aspect*space.horizontal),Math.abs(p.y)/(depth*space.vertical));
 }
 return T.MathUtils.radToDeg(2*Math.atan(slope));
}
