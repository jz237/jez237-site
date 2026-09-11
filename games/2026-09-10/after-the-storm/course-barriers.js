import {waterLevel} from './simulation.js';
import {polygonDistance} from './classic-courses.js';
// Finite raised walls: a ski can clear the top or dive below the underside.
// Dimensions are shared with the visible mesh; metres in world coordinates.
export function barrierCollision(barriers,x,y,z,radius=.85,hullHeight=1.1){
 for(const b of barriers||[]){const localY=y-(b.floating?waterLevel.value:0);if(b.outline){if(polygonDistance(b.outline,x,z)<radius&&localY<b.top&&localY+hullHeight>b.bottom)return true;continue;}for(const p of barrierPiles(b))if(Math.hypot(x-p.x,z-p.z)<p.radius+radius&&y<p.top&&y+hullHeight>p.bottom)return true;const dx=x-b.x,dz=z-b.z,along=dx*b.tx+dz*b.tz,across=-dx*b.tz+dz*b.tx;
  if(Math.abs(along)<b.length/2+radius&&Math.abs(across)<b.depth/2+radius&&localY<b.top&&localY+hullHeight>b.bottom)return true;
 }return false;
}
export function barrierCamera(barriers,target,desired){
 let clear={...target};for(let i=1;i<=64;i++){const t=i/64,q={x:target.x+(desired.x-target.x)*t,y:target.y+(desired.y-target.y)*t,z:target.z+(desired.z-target.z)*t};if(barrierCollision(barriers,q.x,q.y,q.z,.25,.25))return clear;clear=q;}return desired;
}

const pileCache=new WeakMap();
export function barrierPiles(b){
 if(!b.pileSpacing||b.outline)return [];
 if(pileCache.has(b))return pileCache.get(b);
 const count=Math.ceil(b.length/b.pileSpacing),out=[];
 for(let i=0;i<=count;i++)for(const side of [-1,1]){const along=-b.length/2+b.length*i/count,across=side*(b.depth/2-.45);out.push({x:b.x+b.tx*along-b.tz*across,z:b.z+b.tz*along+b.tx*across,radius:.42,bottom:-12,top:b.bottom});}
 pileCache.set(b,out);return out;
}
