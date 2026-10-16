import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeWidgetPresentation,nativeWidgetDrawView} from '../native-widget-presentation.js';
import {prepareNativeScaledBasisMatrix,prepareNativeEulerMatrix} from '../native-widget-transform.js';
import {decodeNativeRaceStartTransform} from '../native-race-start-transform.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {prepareNativeRaceWidgetAdvance,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {prepareNativeRaceFadeSlotInitialization} from '../native-race-fade-initialization.js';
const decode=m=>decodeNativeRaceStartTransform({matrixWords:m.matrixWords}).floatWords;
const bits=v=>{const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,v);return d.getUint32(0);};
const zero={x:0,y:0,z:0};
test('scaled basis preserves quantized scale and translation; degenerate axes retain partial writes',()=>{
 const input={forwardNative:{x:0,y:0,z:1},upNative:{x:0,y:1,z:0},positionNative:{x:12.5,y:-3,z:7},scale:2};
 const r=prepareNativeScaledBasisMatrix(input);
 assert.deepEqual(decode(r),[2,0,0,0,0,2,0,0,0,0,2,0,12.5,-3,7,1].map(bits));
 const partial=prepareNativeScaledBasisMatrix({...input,upNative:input.forwardNative});
 assert.equal(partial.complete,false);assert.equal(partial.matrixWords,null);assert.equal(partial.operations.length,4);
 assert.equal(prepareNativeScaledBasisMatrix({forwardNative:zero}).operations.length,0);
});
test('Euler lookup retains negative-angle truncation and packs identity translation exactly',()=>{
 const input={anglesRadians:zero,positionNative:{x:2,y:-4,z:8},sineTableWords4350:nativeSineTableWords(),anglePeriodWords9254:Array(3).fill(0x40c90fdc)};
 assert.deepEqual(decode(prepareNativeEulerMatrix(input)),[1,0,0,0,0,1,0,0,0,0,1,0,2,-4,8,1].map(bits));
 const r=prepareNativeEulerMatrix({...input,anglesRadians:{x:-.001,y:0,z:0}});
 assert.equal(r.diagnostic.sineIndices[0],0);
});
test('logical slots resolve real banner trajectories and skip freshly allocated draw slots',()=>{
 let s={scene:{players:1,racerCount:1,mode608:0,activity624:-1},raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0)};
 s.raceWords1f94[(0x2650-0x1f94)/4]=1;
 s=prepareNativeRaceStateOperations(s,prepareNativeRaceFadeSlotInitialization({hudWords7788:s.hudWords7788,slotTemplateWords6c50:Array(11).fill(0),type:1,selector:0}).operations).state;
 assert.deepEqual(nativeWidgetDrawView(s.hudWords7788,{operations:[]}),[]);
 const input={matrixTargets:'slots',slotTemplateWords6c50:Array(11).fill(0)};
 for(let frame=0;frame<54;frame++){
  const raw=prepareNativeRaceWidgetAdvance(s,{frameBufferBase:0x81000000,slotTemplateWords6c50:Array(11).fill(0)});
  const logical=prepareNativeRaceWidgetAdvance(s,input);
  assert.deepEqual(logical.state,raw.state);
  const p=prepareNativeWidgetPresentation(logical.effects),draw=nativeWidgetDrawView(logical.state.hudWords7788,p);
  assert.ok(draw.every(w=>w.matrix===null||w.matrix.length===16));
  if(frame===0)assert.equal(draw[0].kind,1);
  if(frame===16)assert.deepEqual(draw,[]);
  s=logical.state;
 }
 assert.deepEqual(nativeWidgetDrawView(s.hudWords7788,{operations:[]}),[]);
});
test('presentation rejects guest addresses and malformed matrices without mutating effects',()=>{
 const effects=[{kind:'externalCall',consumer:'80048a88',arguments:[0x81000900,...[0,0,1,0,1,0,0,0,0,1].map(bits)]}];
 const before=structuredClone(effects);assert.throws(()=>prepareNativeWidgetPresentation(effects),/logical/);assert.deepEqual(effects,before);
 effects[0].arguments[0]={kind:'widgetMatrixTarget',index:0};effects[0].arguments[3]=0;
 assert.throws(()=>prepareNativeWidgetPresentation(effects),/Incomplete/);
 const sound={kind:'externalCall',consumer:'800c30bc',arguments:[1]};
 assert.deepEqual(prepareNativeWidgetPresentation([sound]).operations,[sound]);
});
