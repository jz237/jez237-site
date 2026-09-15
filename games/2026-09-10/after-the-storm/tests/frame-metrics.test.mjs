import test from 'node:test';
import assert from 'node:assert/strict';
import {recordFrame} from '../frame-metrics.js';
test('steady rendering reports real throughput and a bounded rolling window',()=>{
 const m={};for(let i=0;i<600;i++)recordFrame(m,1000/60,8);
 assert.equal(m.samples.length,240);assert.equal(m.summary.fps,60);assert.equal(m.summary.cpuP95,8);
});
test('slow frames count, while hidden-tab suspensions reset the measurement',()=>{
 const m={};for(let i=0;i<120;i++)recordFrame(m,i%10===0?50:1000/60,12);
 assert.ok(m.summary.fps<55);assert.equal(m.summary.frameP95,50);
 assert.equal(recordFrame(m,1000,2,false),null);assert.equal(m.samples.length,0);
 for(let i=0;i<60;i++)recordFrame(m,1000/30,15);
 assert.equal(m.summary.fps,30);recordFrame(m,16,4,false);assert.equal(m.summary,null);
});
test('visible long stalls remain in throughput rather than being discarded',()=>{
 const m={};for(let i=0;i<59;i++)recordFrame(m,16,4);recordFrame(m,600,400);
 assert.equal(m.summary.frames,60);assert.ok(m.summary.fps<40);
});
