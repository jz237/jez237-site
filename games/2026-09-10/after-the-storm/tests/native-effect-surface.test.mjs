import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {raceWaterHeight} from '../race-water.js';
import {liftNativeEffectsToSurface} from '../native-effect-surface.js';

test('original wake, spray and splash draw on the rendered water without changing the source presentation',()=>{
 let last=null;const s=createRace({mode:'time',physics:'native',course:getCourse('amber',1),difficulty:1,nativeSceneEffects:{onDisplay:p=>{last=p;}}});
 const r=s.racers[0],pilot=createNativeRacePilot({course:s.course}),height=(x,z)=>raceWaterHeight(s.raceWater,x,z);
 let before=0,checked=0;
 for(let i=0;i<600;i++){
  stepRace(s,()=>pilot.input(s,r),1/30);
  if(i<150||i%30||!last)continue;
  const copy=structuredClone(last),lifted=liftNativeEffectsToSurface(last,height);
  assert.deepEqual(last,copy,'source presentation is untouched');
  last.draws.forEach((d,k)=>{
   const out=lifted.draws[k];
   for(let v=0;v<d.positions.length;v+=3){
    const w=height(d.positions[v],d.positions[v+2]);
    if(['wake','spray','splash'].includes(d.family)){if(d.positions[v+1]<w)before++;assert.ok(out.positions[v+1]>=w+.03-1e-9);checked++;
     assert.equal(out.positions[v],d.positions[v]);assert.equal(out.positions[v+2],d.positions[v+2]);}
    else assert.equal(out,d,'droplets keep their source geometry');
   }
  });
 }
 assert.ok(checked>1000&&before>checked/4,`the source plane leaves many vertices under the rendered water (${before}/${checked})`);
 assert.equal(liftNativeEffectsToSurface(null,height),null);
 assert.throws(()=>liftNativeEffectsToSurface({draws:[]},null),/rendered water/);
});
