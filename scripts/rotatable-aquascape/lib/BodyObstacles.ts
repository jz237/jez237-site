import type {BodySphere} from './GrazerCollision.ts';
import type {Obstacle} from './TankSpace';

/** Conservative whole-body rejection before individual sphere pairs. The body
 * and obstacles remain live inputs; no stale pose or scenery cache is involved. */
export function bodyObstacleCandidates(body:readonly BodySphere[],obstacles:readonly Obstacle[],margin=0){
 let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
 for(const {center:c,radius:r} of body){minX=Math.min(minX,c.x-r);minY=Math.min(minY,c.y-r);minZ=Math.min(minZ,c.z-r);maxX=Math.max(maxX,c.x+r);maxY=Math.max(maxY,c.y+r);maxZ=Math.max(maxZ,c.z+r);}
 const result:Obstacle[]=[];
 for(const o of obstacles){
  const r=o.radius+margin+1e-10,c=o.center;
  if(c.x+r<minX||c.x-r>maxX||c.y+r<minY||c.y-r>maxY||c.z+r<minZ||c.z-r>maxZ)continue;
  result.push(o);
 }
 return result;
}
