import test from 'node:test';
import assert from 'node:assert/strict';
import {queryNativeSupportFloor as floor,queryNativeSupportBoxes as boxes} from '../native-support-queries.js';
import {prepareNativeRetirementSupportProbe as probe} from '../native-race-body-fields.js';
const plane=(height=0)=>[0,height,0,0,1,0,1,0,0,0,0,1,-1,0,-1,-100];
const grid=()=>({originX3b44:-128,width3b4c:256,originZ3b50:-128,depth3b58:256,axisOrder3b40:0,
 shiftX3b70:6,shiftZ3b78:6,rowBitsX3b60:2,rowBitsZ3b68:2,cellHalfwords:Array(16).fill(0),listHalfwords:[65535,1,0],planes:[plane()]});
const box=(origin=0)=>[origin,origin,origin,1,0,0,0,1,0,0,0,1,40,60,80,0];
const p=(x,y,z)=>({x,y,z});

test('source grid starts at the runtime list offset plus one and stops on the first zero-depth hit',()=>{
 const g=grid();g.planes.push(plane(8));g.listHalfwords=[65535,1,2,0];
 assert.deepEqual(floor(p(-20,0,-20),g),{penetrationNative:0,normalNative:{x:0,y:1,z:0}});
 g.listHalfwords=[65535,2,1,0];assert.equal(floor(p(-20,0,-20),g).penetrationNative,8);
 g.listHalfwords=[65535,0];assert.equal(floor(p(-20,0,-20),g).normalNative,null);
});

test('grid orientation, fractional truncation and source shift masking choose the original cell',()=>{
 const g=grid();g.planes.push(plane(8));g.listHalfwords=[999,1,0,2,0];g.cellHalfwords[1]=2;
 assert.equal(floor(p(-20,-1,-100),g).normalNative,null,'outside triangle even in selected grid cell');
 // Relax clipping solely in this synthetic fixture, keeping asymmetric cells.
 for(const q of g.planes){q[15]=-1000;}
 assert.equal(floor(p(-20,-1,-100),g).penetrationNative,9);
 g.axisOrder3b40=-1;assert.equal(floor(p(-20,-1,-100),g).penetrationNative,1);
 g.shiftX3b70+=32;g.shiftZ3b78+=32;assert.equal(floor(p(-20,-1,-100),g).penetrationNative,1);
 assert.equal(floor(p(-128.9,-1,-1),g).penetrationNative,9,'truncate before origin subtraction selects swapped cell1');
 assert.equal(floor(p(-129,-1,-1),{originX3b44:-128}).normalNative,null,'unreached grid fields stay lazy');
});

test('floor clips keep their strict anchor edge, inclusive far edge and inclusive depth16',()=>{
 const g=grid();
 for(const [point,hit]of [[p(0,-8,0),false],[p(-50,-8,-50),true],[p(-51,-8,-50),false],
  [p(1,-8,-20),false],[p(-20,-8,1),false],[p(-20,-16,-20),true],[p(-20,-17,-20),false],[p(-20,1,-20),false]]){
  assert.equal(floor(point,g).normalNative!==null,hit,JSON.stringify(point));
 }
 assert.throws(()=>floor(p(-20,-1,-20),{...g,listHalfwords:[0]}),/candidate/);
});

test('box query visits last row first and chooses the nearest original face with stable ties',()=>{
 const g={count0578:2,rows:[box(),box(5)]};
 assert.equal(boxes(p(-1,-20,-30),g).penetrationNative,6);
 g.rows.reverse();assert.equal(boxes(p(-1,-20,-30),g).penetrationNative,1);
 const one={count0578:1,rows:[box()]};
 assert.deepEqual(boxes(p(-20,-20,-20),one).normalNative,{x:1,y:0,z:0});
 const negative=boxes(p(-39,-30,-40),one);assert.equal(negative.penetrationNative,1);
 assert.equal(negative.normalNative.x,-1);assert.ok(Object.is(negative.normalNative.y,-0));
 assert.equal(boxes(p(-40,-30,-40),one).normalNative,null,'far interval endpoint excluded');
 assert.equal(boxes(p(0,-30,-40),one).penetrationNative,0,'near interval endpoint included');
 assert.equal(boxes(p(0,0,0),{count0578:0}).normalNative,null);
});

test('complete support scan runs floor and box queries against original-layout geometry',()=>{
 const geometry={floor:grid(),boxes:{count0578:1,rows:[box(5)]}},input={point90Native:p(-20,10,-20),datum2458:0,geometry};
 const before=structuredClone(input),out=probe(input);
 assert.equal(out.supported,true);assert.deepEqual(out.operations.map(q=>[q.consumer,q.returnValue]),[['8007f448',0],['8007fae4',5]]);
 assert.deepEqual(input,before);
 geometry.boxes.count0578=0;
 assert.deepEqual(probe(input).operations.map(q=>[q.consumer,q.positionNative.y,q.returnValue]),[
  ['8007f448',0,0],['8007fae4',0,0],['8007f448',-16,16]]);
 assert.throws(()=>probe({...input,queryReturns:[1]}),/not both/);
});
