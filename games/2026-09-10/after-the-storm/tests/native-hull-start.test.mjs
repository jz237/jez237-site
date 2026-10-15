import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeHullStart} from '../native-hull-start.js';
import {prepareNativeRaceStartTransform} from '../native-race-start-transform.js';
import {prepareNativeHullStartFromPose,createNativeHullFromStart,createNativeHull,stepNativeHull} from '../native-hull.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';

const F=Math.fround;
const local=[[-12,-7,-36],[0,14,-36],[12,-7,-36],[-12,-7,36],[0,14,36],[12,-7,36],[-12,-7,12],[12,-7,12],[0,14,12],[-12,-7,-12],[12,-7,-12],[0,14,-12]].map(([x,y,z])=>({x,y,z}));
const identity=[0x10000,0,1,0,0,0x10000,0,1,0,0,0,0,0,0,0,0];
const input=()=>({matrixWords:identity,localPointsNative:local,dampingInner:.67,dampingOuter:.57,constraint20:.4});
const near=(a,b,e=1e-6)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('identity packed startup preserves source point order and refits its physical axes',()=>{
 const prepared=prepareNativeHullStart(input());
 assert.deepEqual(prepared.centerNative,{x:0,y:0,z:0});assert.deepEqual(prepared.pointsNative,local);
 assert.deepEqual(prepared.frameNative,{forward:{x:0,y:0,z:1},up:{x:0,y:1,z:0},right:{x:1,y:0,z:0}});
 assert.deepEqual(prepared.yawFrame,{field1434:0,field1438:1,field143c:1,field1440:-0});
 assert.equal(prepared.restLengthsNative.length,66);assert.equal(prepared.pairCoefficientsNative.length,66);
 assert.deepEqual(prepared.proxyCentersNative,[27,9,-9,-27].map(z=>({x:0,y:2,z})));
 near(prepared.restLengthsNative[0],Math.hypot(12,21));
 assert.ok(Object.isFrozen(prepared)&&Object.isFrozen(prepared.pointsNative[0]));
});

test('quantized source transform is used before point fitting, rest and radius damping',()=>{
 const pose={positionNative:{x:.123,y:-17.999,z:7.777},forwardNative:{x:2,y:.3,z:3},upNative:{x:0,y:1,z:0}};
 const packed=prepareNativeRaceStartTransform(pose),prepared=prepareNativeHullStart({...input(),matrixWords:packed.matrixWords});
 assert.notEqual(prepared.centerNative.x,F(pose.positionNative.x));
 near(Math.hypot(...Object.values(prepared.frameNative.forward)),1);
 near(Math.hypot(...Object.values(prepared.frameNative.right)),1);
 assert.equal(prepared.pairExtremaNative.minimum,Math.min(...prepared.restLengthsNative));
 assert.equal(prepared.pairExtremaNative.maximum,Math.max(...prepared.restLengthsNative));
 assert.ok(prepared.damping.every(n=>n>=F(.57)-1e-6&&n<=F(.67)+1e-6));
 assert.notEqual(prepared.restLengthsNative[0],prepareNativeHullStart(input()).restLengthsNative[0]);
});

test('separately transformed descending centroid differs from an averaged world cloud',()=>{
 const points=local.map(p=>({x:F(p.x+7.3),y:p.y-9,z:F(p.z+2.1)}));
 const matrix=prepareNativeRaceStartTransform({positionNative:{x:30000.123,y:-17.999,z:-30000.001},forwardNative:{x:1,y:.5,z:-3},upNative:{x:1,y:2,z:1}});
 const start=prepareNativeHullStart({...input(),matrixWords:matrix.matrixWords,localPointsNative:points});
 // The previous hull constructor averaged its world points in JS doubles.
 const average=Object.fromEntries(['x','y','z'].map(k=>[k,start.pointsNative.reduce((sum,p)=>sum+p[k],0)/12]));
 assert.notDeepEqual(start.centerNative,average);
});

test('vertical source forward retains actual yaw and reads it only on that branch',()=>{
 const retained={field1434:.6,field1438:.8,field143c:.8,field1440:-.6};
 const packed=prepareNativeRaceStartTransform({positionNative:{x:0,y:0,z:0},forwardNative:{x:0,y:1,z:0},upNative:{x:0,y:0,z:1}});
 assert.throws(()=>prepareNativeHullStart({...input(),matrixWords:packed.matrixWords}),/retained yaw/);
 const out=prepareNativeHullStart({...input(),matrixWords:packed.matrixWords,retainedYawFrame:retained});
 assert.deepEqual(out.yawFrame,Object.fromEntries(Object.entries(retained).map(([k,v])=>[k,F(v)])));
 const unread=new Proxy({},{get(){throw Error('Unreached retained field');}});
 assert.doesNotThrow(()=>prepareNativeHullStart({...input(),retainedYawFrame:unread}));
});

test('native initialization rejects bad geometry and nonfinite or incomplete inputs atomically',()=>{
 const original=input(),before=JSON.stringify(original);
 for(const change of [{localPointsNative:Array(12)},{localPointsNative:local.slice(1)},{matrixWords:identity.slice(1)},
  {dampingInner:NaN},{dampingOuter:Infinity},{constraint20:-.1},{localPointsNative:local.map(()=>({x:0,y:0,z:0}))}])assert.throws(()=>prepareNativeHullStart({...original,...change}));
 assert.equal(JSON.stringify(original),before);
});

test('prepared starts populate the existing hull owner once with zero velocity',()=>{
 const prepared=prepareNativeHullStart(input()),hull=createNativeHullFromStart({prepared,scale:.025,rider:2});
 assert.equal(hull.points.length,12);assert.equal(hull.restLengths.length,66);assert.equal(hull.rider,2);
 near(hull.points[0].position.x,-.3,1e-12);near(hull.points[0].position.y,-.175,1e-12);near(hull.points[0].position.z,-.9,1e-12);
 assert.ok(hull.points.every(p=>Object.values(p.velocity).every(v=>v===0)));
 assert.deepEqual(hull.velocity,{x:0,y:0,z:0});assert.deepEqual(hull.motionDirection,{x:0,y:0,z:0});
 assert.deepEqual(hull.frame,prepared.frameNative);assert.deepEqual(hull.yawFrame,prepared.yawFrame);
 for(const key of ['prepared','matrixWords','pointsNative','bodyWords'])assert.equal(Object.hasOwn(hull,key),false);
 hull.points[0].position.x=9;hull.frame.forward.x=.1;hull.restLengths[0]=9;
 assert.equal(prepared.pointsNative[0].x,-12);assert.equal(prepared.frameNative.forward.x,0);assert.notEqual(prepared.restLengthsNative[0],9);
});

test('prepared hull constructor rejects missing or incomplete state instead of using a second constructor',()=>{
 const prepared=prepareNativeHullStart(input());
 for(const value of [null,{}, {...prepared,pointsNative:Array(12)},{...prepared,restLengthsNative:[0]},
  {...prepared,damping:Array(12)},{...prepared,yawFrame:null},{...prepared,frameNative:{}}])assert.throws(()=>createNativeHullFromStart({prepared:value}));
 assert.throws(()=>createNativeHullFromStart({prepared,scale:Infinity}));
});

test('browser pose wrapper retains selected human/computer damping and quantizes the actual spawn',()=>{
 const pose={position:{x:12.3456789,y:1,z:-9.87654321},heading:.713,rider:3,scale:.025};
 const human=prepareNativeHullStartFromPose(pose),computer=prepareNativeHullStartFromPose({...pose,computerProfile:true});
 assert.deepEqual(human.pointsNative,computer.pointsNative);assert.notDeepEqual(human.damping,computer.damping);
 const hull=createNativeHullFromStart({prepared:human,...pose}),old=createNativeHull(pose);
 assert.notDeepEqual(hull.frame,old.frame);assert.notDeepEqual(hull.points,old.points);
 near(hull.center.x,pose.position.x,1e-5);near(hull.center.z,pose.position.z,1e-5);
});

test('adapter uses supplied prepared hull and rejects contradictory initial speed',()=>{
 const prepared=prepareNativeHullStart(input()),adapter=createNativeRaceAdapter({hullStart:prepared,riderIndex:0});
 assert.equal(adapter.hull.initialization.transform,'packed16.16 decode and physical refit');
 assert.deepEqual(adapter.hull.frame,prepared.frameNative);assert.equal(adapter.hull.points[1].damping,prepared.damping[1]);
 assert.throws(()=>createNativeRaceAdapter({hullStart:prepared,velocity:{x:1,y:0,z:0}}),/clears velocity/);
 for(const hullStart of [null,false,0])assert.throws(()=>createNativeRaceAdapter({hullStart}));
});

test('prepared hull yaw follows fitted points while its initialization provenance stays fixed',()=>{
 const prepared=prepareNativeHullStartFromPose({heading:.7}),hull=createNativeHullFromStart({prepared});
 stepNativeHull(hull,.01);
 assert.equal(hull.ticks,1);near(hull.yawFrame.field1434,Math.sin(.7),2e-5);near(hull.yawFrame.field1438,Math.cos(.7),2e-5);
 assert.equal(hull.initialization.transform,'packed16.16 decode and physical refit');
});
