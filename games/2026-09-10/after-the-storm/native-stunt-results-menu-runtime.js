import {prepareNativeRaceMenuInputAdvance,prepareNativeStuntResultsMenuInitializationUpdate,
 prepareNativeRaceStateOperations,prepareNativeRaceMenuInitializationUpdate,nativeRaceStuntAwardsView} from './native-race-state.js';
import {prepareNativeStuntResultsMenuInput} from './native-stunt-results-menu.js';

export function nativeStuntResultsMenuView(state){
 const words=state.stuntResultsMenuWords5d80;
 return {active:state.scene.gameStateAb24===56&&state.scene.mode608===11,
  phase:words?.[0]??0,delay:(words?.[1]??0)|0,xA:(words?.[2]??0)|0,xB:(words?.[3]??0)|0};
}

/** Browser boundary: source initialization, modern drawing, then source input.
 * The first display clears its latch and requests audio state0 without input.
 * No original graphics pointers are synthesized. The subsequent state57 loop
 * is a separate responsibility from this menu's numeric exit initializer. */
export function prepareNativeStuntResultsMenuFrame(state,rawControllers){
 if(state.scene.gameStateAb24!==56||state.scene.mode608!==11)throw new RangeError('Stunt results require admitted Stunt state56');
 if(!Array.isArray(rawControllers)||rawControllers.length<1||rawControllers.length>2)throw new RangeError('Supply one or two menu controllers');
 const count=rawControllers.length,sample=prepareNativeRaceMenuInputAdvance(state,{rawControllers,controllerCount4344:count,
  connectedMask4340:(1<<count)-1,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35});
 const init=prepareNativeStuntResultsMenuInitializationUpdate(sample.state),draw={...nativeStuntResultsMenuView(init.state),totals:nativeRaceStuntAwardsView(init.state).totals};
 let current=init.state;const operations=[...sample.operations,...init.operations],effects=[...sample.effects,...init.effects];
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);current=q.state;operations.push(...ops);effects.push(...q.effects);}
 const first=current.scene.initLatch63c!==0;
 if(first){apply([{kind:'sourceWordWrite',field:'initLatch63c',value:0},{kind:'externalCall',consumer:'800c6ad0',arguments:[0]}]);}
 else{
  apply([{kind:'sourceWordWrite',field:'fieldAb2c',value:0}]);
  for(const op of prepareNativeStuntResultsMenuInput(current).operations){
   if(op.kind==='externalCall'&&['801ed004','801ec9c8'].includes(op.consumer))apply(prepareNativeRaceMenuInitializationUpdate(current,{consumer:op.consumer},
    {slotTemplateWords6c50:Array(11).fill(0)}).operations);
   else apply([op]);
  }
 }
 return {state:current,operations,effects,draw,view:nativeStuntResultsMenuView(current),
  diagnostic:{originalNumericControl:true,modernPresentation:true,firstEntry:first,nextMenuLoopExecuted:false,recordsPersisted:false}};
}
