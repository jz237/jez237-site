import {routeDistance} from './courses.js';
// Deterministic dry-bank placement. All props stay outside race lines and the
// measured shore; physical terrain and authored obstacles remain authoritative.
export function planVenueDressing(course){
 let seed=[...course.id].reduce((n,c)=>n+c.charCodeAt(0),319);
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const floor=course.renderGround||course.ground,urban=['port','city'].includes(course.theme),cold=course.theme==='ice';
 const plan={rocks:[],plants:[],logs:[],reeds:[],bollards:[],lamps:[]};
 for(let gz=-330;gz<=330;gz+=11)for(let gx=-330;gx<=330;gx+=11){
  const x=gx+(rand()-.5)*9,z=gz+(rand()-.5)*9,y=floor(x,z),distance=routeDistance(course,x,z);
  if(y<.45||y>45||distance<15||distance>115)continue;
  if((course.ramps||[]).some(r=>Math.hypot(x-r.x,z-r.z)<Math.max(r.width,r.length)*.8+5))continue;
  const slope=Math.hypot(floor(x+1,z)-floor(x-1,z),floor(x,z+1)-floor(x,z-1))*.5;
  const reach=urban?18:8;const shore=Math.min(floor(x+reach,z),floor(x-reach,z),floor(x,z+reach),floor(x,z-reach))<.2;
  const clump=Math.sin(x*.073+Math.sin(z*.049)*2)*Math.cos(z*.061);
  const p={x,y,z,angle:rand()*6.283,scale:.65+rand()*.9,tint:rand()};
  if(!urban&&slope<1.4&&clump>-.4&&plan.rocks.length<300)plan.rocks.push({...p,scale:cold?1.2+rand()*3.3:.35+rand()**2*2.1});
  if(!cold&&!urban&&slope<.8&&y<22&&clump>-.25&&plan.plants.length<320)plan.plants.push(p);
  if(!cold&&!urban&&shore&&slope<.55&&plan.logs.length<18&&rand()<.4)plan.logs.push({...p,scale:.6+rand()*.8});
  if(course.theme==='lake'&&shore&&slope<.8&&plan.reeds.length<110)plan.reeds.push({...p,scale:1.1+rand()});
  if(urban&&shore&&y>1.2&&slope<.1&&plan.bollards.length<48){
   plan.bollards.push(p);if(plan.bollards.length%4===0)plan.lamps.push(p);
  }
 }
 return plan;
}
