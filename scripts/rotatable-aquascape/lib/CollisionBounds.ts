import type {Box3,Vector3} from 'three';

/** Conservative rejection only: a nearby surface still gets its exact test.
 * Avoid vector temporaries, clamping and a square root for each body sphere. */
export function sphereMayReachBox(p:Vector3,r:number,box:Box3){
 r+=1e-12;
 const dx=Math.max(box.min.x-p.x,0,p.x-box.max.x);if(dx>r)return false;
 const dy=Math.max(box.min.y-p.y,0,p.y-box.max.y);if(dy>r)return false;
 const dz=Math.max(box.min.z-p.z,0,p.z-box.max.z);if(dz>r)return false;
 return dx*dx+dy*dy+dz*dz<=r*r;
}

/** Spatial membership is fixed; nearby poses reuse the same candidate list.
 * Cache bounds are cell coordinates, so crossing a cell always gets a new list. */
export class CollisionCandidates<Item>{
 private cached=new Map<string,readonly Item[]>();
 private cells:Map<string,Item[]>;
 constructor(cells:Map<string,Item[]>){this.cells=cells;}
 nearby(p:Vector3,r:number):readonly Item[]{
  const x0=Math.floor((p.x-r)/.5),x1=Math.floor((p.x+r)/.5),y0=Math.floor((p.y-r)/.5),y1=Math.floor((p.y+r)/.5),z0=Math.floor((p.z-r)/.5),z1=Math.floor((p.z+r)/.5);
  const key=`${x0},${x1},${y0},${y1},${z0},${z1}`;
  let result=this.cached.get(key);if(result)return result;
  const found=new Set<Item>();
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(const item of this.cells.get(`${x},${y},${z}`)||[])found.add(item);
  result=[...found];
  if(this.cached.size>=384)this.cached.delete(this.cached.keys().next().value!);
  this.cached.set(key,result);return result;
 }
}
