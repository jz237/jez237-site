import {prepareNativeRaceMenuInputAdvance,prepareNativeResultsMenuInitializationUpdate,
 prepareNativeRaceStateOperations,prepareNativeRaceMenuInitializationUpdate} from './native-race-state.js';
import {prepareNativeResultsMenuInput} from './native-results-menu.js';

export function nativeResultsMenuView(state){
 const words=state.resultsMenuWords6d30;
 return {active:state.scene.gameStateAb24===50&&state.scene.mode608===0,
  phase:words?.[0]??0,xA:(words?.[1]??0)|0,xB:(words?.[2]??0)|0,delay:(words?.[3]??0)|0};
}

/** Browser boundary for the normal solo results menu. Original numeric
 * initialization precedes modern drawing; input follows drawing. Ordinary
 * first entry skips input like5B74. No GPU return pointers are synthesized.
 * NumericC830 initializes game80; its following menu loop remains separate.
 */
export function prepareNativeResultsMenuFrame(state,rawControllers){
 if(state.scene.gameStateAb24!==50||state.scene.mode608!==0)throw new RangeError('Results menu requires admitted solo result state50');
 if(!Array.isArray(rawControllers)||rawControllers.length<1||rawControllers.length>2)throw new RangeError('Supply one or two menu controllers');
 const count=rawControllers.length,sample=prepareNativeRaceMenuInputAdvance(state,{rawControllers,controllerCount4344:count,
  connectedMask4340:(1<<count)-1,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35});
 const init=prepareNativeResultsMenuInitializationUpdate(sample.state),draw=nativeResultsMenuView(init.state);
 let current=init.state;const operations=[...sample.operations,...init.operations],effects=[...sample.effects,...init.effects];
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);current=q.state;operations.push(...ops);effects.push(...q.effects);}
 const first=current.scene.initLatch63c!==0&&current.scene.previousGameState634!==100;
 if(current.scene.initLatch63c!==0)apply([{kind:'sourceWordWrite',field:'initLatch63c',value:0}]);
 if(!first){
  apply([{kind:'sourceWordWrite',field:'fieldAb2c',value:0}]);
  for(const op of prepareNativeResultsMenuInput(current).operations){
   if(op.kind==='externalCall'&&op.consumer==='801ec830')apply(prepareNativeRaceMenuInitializationUpdate(current,{consumer:op.consumer},
    {slotTemplateWords6c50:Array(11).fill(0)}).operations);
   else apply([op]);
  }
 }
 return {state:current,operations,effects,draw,view:nativeResultsMenuView(current),
  diagnostic:{originalNumericControl:true,modernPresentation:true,firstEntry:first,nextMenuLoopExecuted:false,recordsPersisted:false}};
}
