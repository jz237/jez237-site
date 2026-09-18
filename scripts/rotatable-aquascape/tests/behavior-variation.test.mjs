import test from 'node:test';
import assert from 'node:assert/strict';
import {behaviorSeed,behaviorRandom,freshBehaviorSeed} from '../lib/BehaviorVariation.ts';
import {createSchoolRoute,advanceSchoolRoute} from '../lib/SchoolRoute.ts';
test('independent session streams replay for QA but vary between visits',()=>{
 const seeds=Array.from({length:8},freshBehaviorSeed);assert.equal(new Set(seeds).size,8);
 const sample=s=>Array.from({length:5},(_,i)=>{const r=behaviorRandom(behaviorSeed(s,i));return [r(),r(),r()];});
 assert.deepEqual(sample(237),sample(237));assert.notDeepEqual(sample(237),sample(238));assert.equal(new Set(sample(237).map(x=>x[0])).size,5);
 const starts=seeds.map(createSchoolRoute);assert.ok(new Set(starts.map(s=>s.time)).size>1);
 for(const s of starts){const before=structuredClone(s);advanceSchoolRoute(s,0,[]);assert.deepEqual(s,before);}
});
