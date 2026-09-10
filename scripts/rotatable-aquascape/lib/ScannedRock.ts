import * as T from 'three';

export const rockPlacements=[
 [3,-3.58,.26,2.55,.55,.25], [2,-2.85,-.85,1.34,1.45,.15], [0,-4.12,-1.38,1.3,.7,.1],
 [1,-2.83,1.27,1.18,-.7,0], [4,-1.7,.50,.88,1.0,.1], [2,-.55,-.72,.95,-.8,.25],
 [5,3.74,-.7,1.23,.5,.1], [3,4.2,1.06,.78,-1.2,.12], [1,2.9,-1.77,.72,.1,.1]
] as const;

/** Orient before grounding: tilting a pre-grounded scan buries or floats its base. */
export function shapeScannedRock(source:T.BufferGeometry,size:number,yaw:number,tilt:number){
 const geometry=source.clone();geometry.center();
 geometry.applyMatrix4(new T.Matrix4().makeRotationFromEuler(new T.Euler(tilt,yaw,.15)));
 geometry.computeBoundingBox();const bounds=geometry.boundingBox!,extent=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
 geometry.translate(-center.x,-bounds.min.y,-center.z);const scale=size/Math.max(extent.x,extent.z);geometry.scale(scale,scale,scale);
 geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}
