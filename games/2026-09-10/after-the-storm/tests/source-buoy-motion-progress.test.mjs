import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceBuoyLayout,createSourceBuoyProgress,stepSourceBuoyProgress} from '../source-buoy-progress.js';

const world=(x,z)=>({x:x*.025,z:z*.025});
const layout=options=>createSourceBuoyLayout({rows:[[0,0,7,0],[0,1000,7,0]],regionsNative:[[-30000,30000,-30000,30000]],...options});
const state=q=>createSourceBuoyProgress(q,{nextSourceRow:0,armed:true,power:0});

test('moving current center determines the scored side while authored heading and links stay fixed',()=>{
 const q=layout(),before=structuredClone(q),s=state(q),sample={position:world(20,10),lap:1};
 const staticGate=stepSourceBuoyProgress(q,s,sample);
 const moved=stepSourceBuoyProgress(q,s,{...sample,currentNodePosition:world(100,0)});
 assert.equal(staticGate.event.nativeEventCode,1);assert.equal(staticGate.state.power,1);
 assert.equal(moved.event.nativeEventCode,2);assert.equal(moved.state.totalMisses,1);
 assert.equal(moved.state.nextSourceRow,staticGate.state.nextSourceRow);assert.deepEqual(q,before);
 const forward=stepSourceBuoyProgress(q,s,{...sample,currentNodePosition:world(0,100)});
 assert.equal(forward.event,null);assert.equal(forward.diagnostic.rejection,'approach');
});

test('node region lookup follows the dynamic center and never mutates cached layout regions',()=>{
 const q=layout({regionsNative:[[-300,300,-100,100],[500,1000,-100,100]]}),s=state(q),sample={position:world(650,10),lap:1};
 const fixed=stepSourceBuoyProgress(q,s,sample),moved=stepSourceBuoyProgress(q,s,{...sample,currentNodePosition:world(600,0)});
 assert.equal(fixed.diagnostic.rejection,'region');assert.equal(fixed.diagnostic.sharedRegion,false);
 assert.equal(moved.diagnostic.sharedRegion,true);assert.equal(moved.event.nativeEventCode,1);
});

test('checkpoint span retains fixed endpoints when its independent center position is supplied',()=>{
 const q=layout({mode:'stunt',rows:[[0,0,3,0],[0,1000,7,0]]}),s=state(q);
 const result=stepSourceBuoyProgress(q,s,{position:world(800,10),currentNodePosition:world(800,0),lap:1});
 assert.equal(result.diagnostic.spanCoordinateNative,1300);assert.equal(result.diagnostic.spanPass,false);
 assert.equal(result.diagnostic.rejection,'checkpoint-span');assert.equal(result.event,null);
});

test('dynamic position input is finite world X/Z and preserves source state on rejection',()=>{
 const q=layout(),s=state(q),before=structuredClone(s);
 assert.throws(()=>stepSourceBuoyProgress(q,s,{position:world(0,10),currentNodePosition:{x:Infinity,z:0}}),/finite/);
 assert.deepEqual(s,before);
});
