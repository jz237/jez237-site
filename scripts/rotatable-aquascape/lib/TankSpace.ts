import * as T from 'three';
export const fishPosition=(x:number,y:number,z:number)=>new T.Vector3((x-940)*.014,(550-y)*.014+.65,(z-.5)*2.52+.25);
export const fishCoordinates=(p:T.Vector3)=>({x:p.x/.014+940,y:550-(p.y-.65)/.014,z:(p.z-.25)/2.52+.5});
export type Obstacle={center:T.Vector3;radius:number};
/** Resolve hardscape contact in world units, independent of the viewing camera. */
export function clearHardscape(p:T.Vector3,obstacles:Obstacle[],bodyRadius=.23){
 for(let pass=0;pass<8;pass++){
  let touched=false;
  for(const obstacle of obstacles){
   const clearance=obstacle.radius+bodyRadius,limit=clearance-1e-7;
   const dx=p.x-obstacle.center.x,dy=p.y-obstacle.center.y,dz=p.z-obstacle.center.z;
   // Reject distant spheres before allocating a vector or taking a square root.
   // Retain the original distance/contact calculation for every possible hit.
   if(Math.abs(dx)>limit+1e-10||Math.abs(dy)>limit+1e-10||Math.abs(dz)>limit+1e-10)continue;
   const delta=p.clone().sub(obstacle.center),dist=delta.length();
   if(dist<limit){if(dist<.001)delta.set(0,1,0);else delta.divideScalar(dist);p.copy(obstacle.center).addScaledVector(delta,clearance+.0001);touched=true;}
  }
  if(!touched)break;
 }
 return p;
}
/** Fit a curved leaf inside the glass, including a small allowance for its sway. */
const leafBounds=new WeakMap<T.BufferAttribute,{version:number;box:T.Box3}>(),leafWorldBounds=new T.Box3();
export function fitLeaf(dummy:T.Object3D,positions:T.BufferAttribute,motionAllowance=.14){
 let cached=leafBounds.get(positions);
 if(!cached||cached.version!==positions.version){cached={version:positions.version,box:new T.Box3().setFromBufferAttribute(positions)};leafBounds.set(positions,cached);}
 leafWorldBounds.copy(cached.box).applyMatrix4(dummy.matrix);
 // Most leaves are far from the glass. An enclosing box entirely inside the
 // allowed volume proves the original per-vertex fit would leave them unchanged.
 const margin=motionAllowance+1e-10;
 if(leafWorldBounds.min.x-margin>=-4.96&&leafWorldBounds.max.x+margin<=4.96&&leafWorldBounds.min.z-margin>=-2.20&&leafWorldBounds.max.z+margin<=2.20&&leafWorldBounds.max.y+margin<=5.25)return;
 let scale=1;const root=dummy.position,point=new T.Vector3();
 for(let i=0;i<positions.count;i++){
  point.fromBufferAttribute(positions,i).applyMatrix4(dummy.matrix).sub(root);
  for(const [axis,bound] of [['x',4.96],['z',2.20],['y',5.25]] as const){
   const d=point[axis],origin=root[axis];
   if(d>0)scale=Math.min(scale,(bound-origin)/(d+motionAllowance));
   if(d<0&&axis!=='y')scale=Math.min(scale,(-bound-origin)/(d-motionAllowance));
  }
 }
 if(scale<1){dummy.scale.multiplyScalar(Math.max(.02,scale));dummy.updateMatrix();}
}
