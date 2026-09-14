import test from 'node:test';import assert from 'node:assert/strict';
import {planTreeline,TREELINE} from '../treeline-plan.js';
import {coveHeight,noise} from '../lake-shape.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
// a stand-in for bathy.shoreDistance on the analytic cove: march toward the water
function shoreDistance(x,z){let best=1e9;for(let a=0;a<6.283;a+=.52)for(let r=2;r<220;r+=4){if(coveHeight(x+Math.cos(a)*r,z+Math.sin(a)*r)<0){best=Math.min(best,r);break;}}return best;}
test('the tree line stands on land: a band along the water and a serrated line on the crests, deterministic per seed',()=>{
 const plan=planTreeline({height:coveHeight,shoreDistance,span:560,random:rng(7),noise,samples:20000});
 assert.ok(plan.shore.length>200&&plan.shore.length<=TREELINE.budget.shore,'shore band '+plan.shore.length);
 assert.ok(plan.crest.length>40&&plan.crest.length<=TREELINE.budget.crest,'crests '+plan.crest.length);
 for(const p of plan.shore){assert.ok(coveHeight(p.x,p.z)>=.6,'on land');const d=shoreDistance(p.x,p.z);assert.ok(d>=TREELINE.shoreBand[0]-4&&d<=TREELINE.shoreBand[1]+4,'near the water: '+d);assert.ok(p.h>=6&&p.h<=TREELINE.heights.shore[1],'height '+p.h);}
 for(const p of plan.crest){assert.ok(coveHeight(p.x,p.z)>=TREELINE.crestMin,'high ground');assert.ok(p.h>=TREELINE.heights.crest[0]&&p.h<=TREELINE.heights.crest[1]);}
 const again=planTreeline({height:coveHeight,shoreDistance,span:560,random:rng(7),noise,samples:20000});
 assert.deepEqual(again.shore.slice(0,5),plan.shore.slice(0,5),'same seed, same trees');
 const meanShore=plan.shore.reduce((s,p)=>s+p.h,0)/plan.shore.length,meanCrest=plan.crest.reduce((s,p)=>s+p.h,0)/plan.crest.length;
 assert.ok(meanCrest>meanShore,'the crests carry the tallest trees so the skyline serrates');
});
