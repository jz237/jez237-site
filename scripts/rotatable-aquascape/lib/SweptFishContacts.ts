import * as T from 'three';
import type {Obstacle} from './TankSpace.ts';
/** Stop a fast fish at the first solid contact along its swept body path.
 * A broad AABB rejection keeps distant branch envelopes inexpensive. */
export function sweepHardscape(from:T.Vector3,to:T.Vector3,obstacles:Obstacle[],bodyRadius=.23){
 const dx=to.x-from.x,dy=to.y-from.y,dz=to.z-from.z,length2=dx*dx+dy*dy+dz*dz;
 if(length2<1e-12)return to;
 let fraction=1;
 for(const {center:c,radius} of obstacles){
  const r=radius+bodyRadius;
  if(c.x+r<Math.min(from.x,to.x)||c.x-r>Math.max(from.x,to.x)||c.y+r<Math.min(from.y,to.y)||c.y-r>Math.max(from.y,to.y)||c.z+r<Math.min(from.z,to.z)||c.z-r>Math.max(from.z,to.z))continue;
  const x=from.x-c.x,y=from.y-c.y,z=from.z-c.z,outside=x*x+y*y+z*z-r*r;
  if(outside<=0)continue; // Existing contact solver handles overlap; allow escape.
  const projection=x*dx+y*dy+z*dz,discriminant=projection*projection-length2*outside;
  if(projection>=0||discriminant<0)continue;
  const entry=(-projection-Math.sqrt(discriminant))/length2;
  if(entry>=0&&entry<fraction)fraction=Math.max(0,entry-.0001/Math.sqrt(length2));
 }
 if(fraction<1)to.set(from.x+dx*fraction,from.y+dy*fraction,from.z+dz*fraction);
 return to;
}
