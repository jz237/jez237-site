import test from 'node:test';
import assert from 'node:assert/strict';
import {AdaptiveGraphics} from '../src/adaptive-graphics';
const feed=(g:AdaptiveGraphics,seconds:number,frame:(t:number)=>number)=>{let t=0,changes=0;while(t<seconds){const ms=frame(t);if(g.sample(ms,true))changes++;t+=ms/1000;}return changes;};
test('the opening pile-up’s hitches do not cost the event its detail; a slow machine still steps down',()=>{
  const g=new AdaptiveGraphics();feed(g,4,()=>16.7);
  assert.equal(feed(g,6,t=>(t%.5)<.02?180:16.7),0,'a 180 ms hitch twice a second, smooth between');assert.equal(g.quality,'high');
  assert.equal(feed(g,5,()=>30),1,'sustained slowness');assert.equal(g.quality,'medium');
});
test('a second that is mostly slow is slow, whatever its fast frames',()=>{
  const g=new AdaptiveGraphics();feed(g,4,()=>16.7);let i=0;assert.equal(feed(g,6,()=>i++%3===0?16.7:33),1);assert.equal(g.quality,'medium');
});
