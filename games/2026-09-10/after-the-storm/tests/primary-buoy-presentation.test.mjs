import test from 'node:test';
import assert from 'node:assert/strict';
import {capturePrimaryBuoyPresentation,samplePrimaryBuoyPresentation} from '../primary-buoy-presentation.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';

const v=(x=0,y=0,z=0)=>({x,y,z});
const node=(x=0)=>({sourceRow:7,classification:0,fixed:false,physicsEnabled:true,renderEnabled:true,position:v(x),endpoints:[v(-1),v(1)],velocityNative:v(99)});

test('display capture detaches points and strips native simulation state',()=>{
 const source=[node()],display=capturePrimaryBuoyPresentation(source);
 assert.equal(display[0].velocityNative,undefined);assert.equal(display[0].physicsEnabled,undefined);
 source[0].position.x=10;source[0].endpoints[0].x=10;assert.equal(display[0].position.x,0);assert.equal(display[0].endpoints[0].x,-1);
 assert.equal(capturePrimaryBuoyPresentation(null),null);
});

test('replay interpolation moves current centers while fixed endpoints and visibility remain discrete',()=>{
 const a=[node(0)],b=[{...node(10),renderEnabled:false}],middle=samplePrimaryBuoyPresentation(a,b,.5);
 assert.equal(middle[0].position.x,5);assert.equal(middle[0].renderEnabled,true);assert.deepEqual(middle[0].endpoints,a[0].endpoints);
 assert.equal(samplePrimaryBuoyPresentation(a,b,1)[0].renderEnabled,false);
 middle[0].endpoints[0].x=5;assert.equal(a[0].endpoints[0].x,-1);
 assert.throws(()=>samplePrimaryBuoyPresentation(a,[{...node(),sourceRow:9}],.5),/identity/);
});

test('instant replay records buoy display history without changing the live buoy state',()=>{
 const state={phase:'running',time:0,racers:[],weather:{},primaryBuoys:[node()],breakables:null};
 const recorder=createRecorder();recordMoment(recorder,state,null);state.time=.05;state.primaryBuoys=[node(10)];recordMoment(recorder,state,null);
 const sample=replaySample({frames:recorder.frames},.025);
 assert.equal(sample.primaryBuoys[0].position.x,5);assert.equal(state.primaryBuoys[0].position.x,10);
 sample.primaryBuoys[0].position.x=99;assert.equal(recorder.frames[0].primaryBuoys[0].position.x,0);
});

test('malformed or unbounded presentation input is rejected',()=>{
 for(const input of [[{...node(),sourceRow:-1}],[node(),node()],[{...node(),position:v(Infinity)}],[{...node(),renderEnabled:1}],Array(65).fill(node())])
  assert.throws(()=>capturePrimaryBuoyPresentation(input));
});
