import test from 'node:test';import assert from 'node:assert/strict';import {getCourse} from '../courses.js';import {barrierCollision,barrierCamera,barrierUnderside} from '../course-barriers.js';import {createRace,stepRace,aiInput} from '../race-core.js';
test('all four Fortress stone arches have solid roofs and feet around open water',()=>{
 const c=getCourse('citadel');for(let arch=0;arch<4;arch++){const parts=c.crossbars.filter(b=>b.arch===arch),mid=parts[8],foot=parts[0];assert.equal(parts.length,16);assert.equal(barrierCollision(parts,mid.x,0,mid.z),false);assert.equal(barrierCollision(parts,mid.x,mid.bottom,mid.z),true);assert.equal(barrierCollision(parts,foot.x,0,foot.z),true);const camera=barrierCamera(parts,{x:mid.x,y:1,z:mid.z},{x:mid.x,y:12,z:mid.z});assert.ok(camera.y<mid.bottom);}
});
test('every class actually travels under all four southern arches on its outer lap',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){const c=getCourse('citadel',difficulty),s=createRace({course:c,difficulty}),r=s.racers[0],seen=new Set();let hits=0;
 for(let i=0;i<36000&&s.phase!=='results';i++){stepRace(s,aiInput(s,r),1/60);for(const b of c.crossbars){const dx=r.x-b.x,dz=r.z-b.z;if(Math.abs(dx*b.tx+dz*b.tz)<b.length/2&&Math.abs(-dx*b.tz+dz*b.tx)<b.depth/2&&r.hydro.y+1.1<b.bottom){seen.add(r.lap+':'+b.arch);hits+=r.collision>0;}}}
 assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.dq,'');for(let arch=0;arch<4;arch++)assert.ok(seen.has('1:'+arch),'class '+difficulty+' arch '+arch);assert.equal(hits,0);
 }
});

test('arch underside collision stays continuous at the rendered profile joins',()=>{
 const parts=getCourse('citadel').crossbars.filter(b=>b.arch===0);for(let i=0;i<parts.length-1;i++){const a=parts[i],b=parts[i+1];assert.ok(Math.abs(barrierUnderside(a,a.length/2)-barrierUnderside(b,-b.length/2))<1e-9);}
});
