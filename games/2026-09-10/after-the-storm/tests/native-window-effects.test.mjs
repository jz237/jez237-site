import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {captureWindowFrame,readWindowFrame,readWindowEffects,packWindowEffects} from '../player-window-presentation.js';
import {encodeOnlinePacket,decodeOnlinePacket} from '../online-race-codec.js';

test("Player 2's frames carry the host's view1 original effects, packed for the window and the online codec",async()=>{
 const views=[null,null];
 const s=createRace({mode:'versus',physics:'native',course:getCourse('amber',1),difficulty:1,rider:0,secondRider:2,nativeSceneEffects:{onDisplay:(p,view)=>{views[view]=p;}}});
 for(let i=0;i<300;i++)stepRace(s,[{throttle:1,steer:.3},{throttle:1,steer:-.3}],1/30);
 const draws=views[1].draws;assert.ok(draws.length>0);
 const water={wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)};
 const packed=packWindowEffects(draws),frame={...captureWindowFrame(s,water),nativeEffects:packed};
 const read=readWindowFrame(structuredClone(frame));assert.ok(read,'frame with effects is accepted');
 assert.equal(read.nativeEffects.length,draws.length);
 read.nativeEffects.forEach((d,i)=>{
  const o=draws[i];assert.deepEqual([d.family,d.textureFrame,d.depthTest],[o.family,o.textureFrame,o.depthTest]);
  assert.deepEqual(d.positions,o.positions.map(Math.fround));assert.deepEqual(d.uvs,o.uvs.map(Math.fround));
  // Original vertex colors and alphas are 8-bit; the byte form keeps them to within half a step.
  d.colors.forEach((c,k)=>assert.ok(Math.abs(c-o.colors[k])<=.5/255+1e-9));d.alphas.forEach((a,k)=>assert.ok(Math.abs(a-o.alphas[k])<=.5/255+1e-9));
 });
 // Online: the same frame survives the bounded binary codec.
 const bytes=await encodeOnlinePacket({frame});const back=await decodeOnlinePacket(bytes);
 assert.deepEqual(readWindowFrame(back.frame).nativeEffects,read.nativeEffects);assert.ok(bytes.length<64*1024,'compact online packet: '+bytes.length);
 assert.equal(readWindowFrame({...frame,nativeEffects:{...packed,draws:[[7,0,1,3],...packed.draws.slice(1)]}}),null);
 assert.equal(readWindowFrame({...frame,nativeEffects:{...packed,alphas:packed.alphas.slice(1)}}),null);
 assert.equal(readWindowEffects({...packed,positions:Array.from(packed.positions)}),null);
 assert.equal(readWindowFrame(captureWindowFrame(s,water)).nativeEffects,undefined,'frames without effects stay unchanged');
});
