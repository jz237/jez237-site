import {prepareNativeRaceMenuInputAdvance,prepareNativeRaceStateOperations,prepareNativeRaceMenuInitializationUpdate} from './native-race-state.js';
import {prepareNativeStuntRecordMenuInitialization,prepareNativeStuntRecordMenuInput} from './native-stunt-record-menu.js';
const hi=a=>(a-0x7788)/4;
export function nativeStuntRecordMenuView(state){
 const h=state.hudWords7788;
 return {active:state.scene.gameStateAb24===57&&state.scene.mode608===11,phase:h[hi(0x88f0)]>>>0,
  delay:h[hi(0x88f4)]|0,xA:h[hi(0x88f8)]|0,xB:h[hi(0x88fc)]|0};
}

/** Numeric update before modern drawing, then display latch writes and input.
 * Original matrix/viewport/GPU calls are replaced by high-resolution HTML. */
export function prepareNativeStuntRecordMenuFrame(state,rawControllers){
 if(state.scene.gameStateAb24!==57||state.scene.mode608!==11)throw new RangeError('Stunt records require admitted Stunt state57');
 if(!Array.isArray(rawControllers)||rawControllers.length<1||rawControllers.length>2)throw new RangeError('Supply one or two menu controllers');
 const count=rawControllers.length,sample=prepareNativeRaceMenuInputAdvance(state,{rawControllers,controllerCount4344:count,
  connectedMask4340:(1<<count)-1,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35});
 let current=sample.state;const operations=[...sample.operations],effects=[...sample.effects];
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);current=q.state;operations.push(...ops);effects.push(...q.effects);}
 apply(prepareNativeStuntRecordMenuInitialization(current).operations);const draw=nativeStuntRecordMenuView(current);
 if(current.scene.initLatch63c!==0)apply([{kind:'sourceWordWrite',field:'initLatch63c',value:0}]);
 apply([{kind:'sourceWordWrite',field:'fieldAb2c',value:0}]);
 for(const op of prepareNativeStuntRecordMenuInput(current).operations){
  if(op.kind==='externalCall'&&op.consumer==='801ec830')apply(prepareNativeRaceMenuInitializationUpdate(current,{consumer:op.consumer},
   {slotTemplateWords6c50:Array(11).fill(0)}).operations);
  else apply([op]);
 }
 return {state:current,operations,effects,draw,view:nativeStuntRecordMenuView(current),
  diagnostic:{originalNumericControl:true,modernPresentation:true,recordsPersisted:false}};
}
