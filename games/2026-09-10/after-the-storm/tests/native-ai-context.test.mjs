import test from 'node:test';
import assert from 'node:assert/strict';
import {selectNativeAIContext,prepareNativeAIContext} from '../native-ai-context.js';
import {createNativeAIRoute} from '../native-ai-route.js';
import {createNativeAITargetTable} from '../native-ai-target.js';

const input=(extra={})=>({state638:1,mode620:4,courseIndex:6,difficulty:0,reverse:false,avatar:0,recordFamily:'tertiary',
 cityVariant98c8:2,cityRouteFlag74:0,finished2c2c:0,positionNative:{x:10000,y:0,z:10000},navigationSourceRow:0,...extra});
function tables(courseIndex){return Object.fromEntries(['primary','secondary','tertiary'].map((family,f)=>{
 const groups=[[0,0,0,0],[0,3,4,0],[3,4,5,6]][f];
 const nodes=groups.map((routeGroup,i)=>({sourceRow:i,x:i*25,z:f*50,tx:0,tz:1,classification:(i+3*f)%15,routeGroup,halfWidthNative:0,suppressed:false}));
 return [family,createNativeAITargetTable({route:createNativeAIRoute({nodes,courseIndex,family}),nodes})];
}));}

test('setup state and mode1 force primary before any course-specific selector reads',()=>{
 assert.deepEqual(selectNativeAIContext({state638:21,cityRouteFlag74:-7}),{family:'primary',cityRouteFlag74:-7});
 assert.deepEqual(selectNativeAIContext({state638:1,mode620:1,cityRouteFlag74:9}),{family:'primary',cityRouteFlag74:9});
});
test('ordinary courses retain the record family without substituting a human judge route',()=>{
 for(const courseIndex of[0,1,2,3,4,7,8])for(const recordFamily of['primary','secondary','tertiary']){
  assert.deepEqual(selectNativeAIContext(input({courseIndex,recordFamily})),{family:recordFamily,cityRouteFlag74:0});
 }
 assert.throws(()=>selectNativeAIContext(input({courseIndex:1,recordFamily:null})),/recordFamily/);
});
test('Port selects avatar1 secondary except at source difficulty2, independently of slot or retained family',()=>{
 for(const avatar of[0,1,2,3])for(const difficulty of[0,1,2]){
  const r=selectNativeAIContext(input({courseIndex:5,avatar,difficulty,cityRouteFlag74:17}));
  assert.equal(r.family,avatar===1&&difficulty!==2?'secondary':'primary');assert.equal(r.cityRouteFlag74,17);
 }
 assert.equal(selectNativeAIContext(input({courseIndex:5,avatar:2,difficulty:undefined})).family,'primary');
});
test('City variants other than2 return before position, finish and retained flag changes',()=>{
 for(const [cityVariant98c8,expected]of[[0,'secondary'],[1,'primary'],[-1,'primary'],[3,'primary']]){
  const r=selectNativeAIContext(input({cityVariant98c8,positionNative:null,finished2c2c:undefined,cityRouteFlag74:2}));
  assert.deepEqual(r,{family:expected,cityRouteFlag74:2});
 }
});
test('Reverse City retains the record family and skips its ordinary variant/position/finish policy',()=>{
 const r=selectNativeAIContext(input({reverse:true,recordFamily:'tertiary',cityVariant98c8:undefined,positionNative:null,finished2c2c:undefined,cityRouteFlag74:-1}));
 assert.deepEqual(r,{family:'tertiary',cityRouteFlag74:-1});
});
test('City ordinary route flag follows five native regions and retains state between them',()=>{
 let flag=0;
 for(const [positionNative,expected]of[
  [{x:0,y:200,z:0},1],[{x:10000,y:0,z:10000},1],[{x:0,y:0,z:-1200},0],
  [{x:0,y:200,z:4800},1],[{x:1800,y:0,z:-8000},0],[{x:1000,y:200,z:-8000},1]
 ]){
  const r=selectNativeAIContext(input({positionNative,cityRouteFlag74:flag}));
  assert.equal(r.cityRouteFlag74,expected);assert.equal(r.family,expected===1?'primary':'secondary');flag=r.cityRouteFlag74;
 }
});
test('City boundaries are open and native float32 rounding precedes the height comparison',()=>{
 const cases=[
  [{x:-1000,y:0,z:-1200},1],[{x:500,y:0,z:-1200},1],[{x:0,y:80,z:-1200},1],
  [{x:0,y:79.9999999,z:-1200},1],[{x:0,y:79.999,z:-1200},0],
  [{x:0,y:0,z:-1500},1],[{x:0,y:0,z:-1000},1],
  [{x:1500,y:0,z:-8000},1],[{x:1500.001,y:0,z:-8000},0],
  [{x:1800,y:80,z:-8000},1],[{x:1800,y:0,z:-8400},1],[{x:1800,y:0,z:-7400},1]
 ];
 for(const [positionNative,expected]of cases)assert.equal(selectNativeAIContext(input({cityRouteFlag74:1,positionNative})).cityRouteFlag74,expected);
});
test('City retained nonboolean words stay exact and finished override applies after region writes',()=>{
 assert.deepEqual(selectNativeAIContext(input({cityRouteFlag74:-2147483648})),{family:'secondary',cityRouteFlag74:-2147483648});
 assert.deepEqual(selectNativeAIContext(input({cityRouteFlag74:2,positionNative:{x:0,y:0,z:0},finished2c2c:-1})),{family:'secondary',cityRouteFlag74:1});
});
test('selected context refreshes the compiled family window without advancing persistent navigation',()=>{
 const set=tables(5),q=input({courseIndex:5,avatar:1,navigationSourceRow:2}),before=structuredClone({set,q});
 const r=prepareNativeAIContext(set,q);
 assert.equal(r.table,set.secondary);assert.equal(r.window.avatar,1);assert.equal(r.window.navigationSourceRow,2);assert.equal(r.window.targetSourceRow,2);
 assert.equal(r.window.navigationClassification,5);assert.equal(r.window.nextSourceRow,3);assert.equal(r.window.previousSourceRow,0);
 assert.equal(q.recordFamily,'tertiary');assert.ok(Object.isFrozen(r)&&Object.isFrozen(r.selection));assert.deepEqual({set,q},before);
});
test('missing family, foreign table and invalid row fail without committing route-flag changes',()=>{
 const set=tables(6),q=input({positionNative:{x:0,y:0,z:0}}),before=structuredClone({set,q});
 assert.throws(()=>prepareNativeAIContext({...set,primary:null},q),/Missing selected/);
 assert.throws(()=>prepareNativeAIContext(tables(5),q),/match source course/);
 assert.throws(()=>prepareNativeAIContext(set,{...q,navigationSourceRow:99}),/Unknown/);
 assert.throws(()=>prepareNativeAIContext({...set,primary:{...set.primary}},q),/compiled/);
 assert.deepEqual({set,q},before);
});
