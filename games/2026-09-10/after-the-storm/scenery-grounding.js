import * as T from './vendor/three.module.js';

// Seat decorative rocks in the visible heightfield. This never changes the
// collision surface or the source obstacle placements used by the race.
export function groundedRockMatrix(geometry,floor,{x,z,angle=0},scale,embed=.12){
 const center=floor(x,z),normal=new T.Vector3(-(floor(x+1,z)-floor(x-1,z))/2,1,-(floor(x,z+1)-floor(x,z-1))/2).normalize();
 const up=new T.Vector3(0,1,0),rotation=new T.Quaternion().setFromUnitVectors(up,normal);
 rotation.multiply(new T.Quaternion().setFromAxisAngle(up,angle));
 const stretch=new T.Vector3(...scale),point=new T.Vector3(),positions=geometry.attributes.position;
 let height=center-embed;
 // Tilting follows the local slope; the underside samples also accommodate
 // curved banks, embedding the mesh instead of leaving a visible air gap.
 for(let i=0;i<positions.count;i++)if(positions.getY(i)<=0){
  point.fromBufferAttribute(positions,i).multiply(stretch).applyQuaternion(rotation);
  height=Math.min(height,floor(x+point.x,z+point.z)-point.y-embed);
 }
 return new T.Matrix4().compose(new T.Vector3(x,height,z),rotation,stretch);
}
