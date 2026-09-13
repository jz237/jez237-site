import test from 'node:test';
import assert from 'node:assert/strict';
import {FrameBenchmark,frameProbes} from '../lib/FrameBenchmark.ts';

function fixture(){
 const applied=[],messages=[];let restored=0;
 const benchmark=new FrameBenchmark(mode=>applied.push(mode),()=>restored++,(text,done)=>messages.push({text,done}));
 return {benchmark,applied,messages,get restored(){return restored;}};
}
test('phone test compares independent passes and restores exactly once after completion',()=>{
 const f=fixture();f.benchmark.start(0);f.benchmark.start(10);
 for(let now=100;now<=40000;now+=100)f.benchmark.tick(now);
 assert.deepEqual(f.applied,frameProbes.map(p=>p.mode));
 assert.equal(f.restored,1);assert.equal(f.benchmark.active,false);assert.equal(f.benchmark.mode,'normal');
 const result=f.messages.at(-1);assert.equal(result.done,true);
 for(const probe of frameProbes)assert.ok(result.text.includes(`${probe.label}: 10.0 FPS / 100.0 ms`));
 f.benchmark.cancel();f.benchmark.tick(50000);assert.equal(f.restored,1);
});
test('queued-work warmup is discarded from pass measurements',()=>{
 const f=fixture();f.benchmark.start(0);f.benchmark.tick(500);f.benchmark.tick(1000);
 for(let now=1100;now<=5000;now+=100)f.benchmark.tick(now);
 assert.equal(f.benchmark.results[0],'Full aquarium: 10.0 FPS / 100.0 ms');
});
test('cancellation from reduced image probe restores original state and can restart',()=>{
 const f=fixture();f.benchmark.start(0);
 for(let now=100;now<=30500;now+=100)f.benchmark.tick(now);
 assert.equal(f.benchmark.mode,'pixels');f.benchmark.cancel();
 assert.equal(f.benchmark.mode,'normal');assert.equal(f.restored,1);
 f.benchmark.start(31000);assert.equal(f.benchmark.mode,'normal');assert.equal(f.benchmark.active,true);
});
test('tab interruption and apply errors restore settings rather than leave a reduced view',()=>{
 const f=fixture();f.benchmark.start(0);f.benchmark.tick(2000);assert.equal(f.restored,1);assert.equal(f.benchmark.active,false);
 let restored=0;const broken=new FrameBenchmark(()=>{throw Error('allocation failed');},()=>restored++,()=>{});
 assert.throws(()=>broken.start(0),/allocation failed/);assert.equal(restored,1);assert.equal(broken.active,false);
});
