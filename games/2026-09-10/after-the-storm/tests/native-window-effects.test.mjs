import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {captureWindowFrame,readWindowFrame,readWindowEffects} from '../player-window-presentation.js';

test("Player 2's window frame carries the host's view1 original effects intact and rejects malformed ones",()=>{
 const views=[null,null];
 const s=createRace({mode:'versus',physics:'native',course:getCourse('amber',1),difficulty:1,rider:0,secondRider:2,nativeSceneEffects:{onDisplay:(p,view)=>{views[view]=p;}}});
 for(let i=0;i<300;i++)stepRace(s,[{throttle:1,steer:.3},{throttle:1,steer:-.3}],1/30);
 const draws=views[1].draws;assert.ok(draws.length>0);
 const frame={...captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)}),nativeEffects:draws},read=readWindowFrame(structuredClone(frame));
 assert.ok(read,'frame with effects is accepted');
 assert.deepEqual(read.nativeEffects,draws.map(d=>({family:d.family,textureFrame:d.textureFrame,depthTest:d.depthTest,positions:d.positions,uvs:d.uvs,colors:d.colors,alphas:d.alphas})));
 assert.equal(readWindowFrame({...frame,nativeEffects:[{...draws[0],family:'smoke'}]}),null);
 assert.equal(readWindowFrame({...frame,nativeEffects:[{...draws[0],alphas:draws[0].alphas.slice(1)}]}),null);
 assert.equal(readWindowEffects(Array(257).fill(draws[0])),null);
 assert.ok(readWindowFrame(captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)})).nativeEffects===undefined,'frames without effects stay unchanged');
});
