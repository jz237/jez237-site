import {prepareNativeRaceMenuInputAdvance,prepareNativeContinuationMenuInitializationUpdate,
 prepareNativeContinuationMenuInputUpdate,prepareNativeRaceWidgetAdvance,prepareNativeRaceFadeAdvance,
 prepareNativeRaceStateOperations} from './native-race-state.js';
import {prepareNativeContinuationMenuPostDisplay} from './native-continuation-menu.js';
import {prepareNativeWidgetPresentation,nativeWidgetDrawView} from './native-widget-presentation.js';

const constants={matrixTargets:'slots',slotTemplateWords6c50:Array(11).fill(0),
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],
 rotationWord6c80:0x40490fdb,rotationWord6c84:0x40490fdb,bounceWord6c88:0x3f333333};
const destinations=new Map([['8009345c','retry'],['801ebd28','rider'],['801ebfe4','course'],['801eb180','title'],['801eb91c','championship']]);

export function nativeContinuationMenuView(state){
 const words=state.continuationMenuWords61e0,data=state.continuationDataWords60f0;
 const half=a=>((state.hudWords7788[(a-0x7788)>>>2]>>>(a%4?0:16))&65535)<<16>>16;
 return {active:[80,81].includes(state.scene.gameStateAb24),exiting:state.scene.gameStateAb24===81,
  phase:words?.[0]??0,xA:(words?.[1]??0)|0,xB:(words?.[2]??0)|0,count:words?.[3]??0,selection:data?.[0]??0,
  fade:{kind:half(0x8a10),stage:half(0x8a12),completion:half(0x8a16),y:half(0x8a28),x:half(0x8a2a)}};
}

/** One original20Hz update, then the numeric5924 display suffix. Modern
 * drawing replaces GPU calls; no display-list address is synthesized. Save
 * calls remain effects. The host must stop this menu when handoff is returned.
 * Only ordinary solo result state80/81 is admitted by the browser boundary. */
export function prepareNativeContinuationMenuFrame(state,rawControllers){
 if(![80,81].includes(state.scene.gameStateAb24)||state.scene.mode608!==0)
  throw new RangeError('Continuation menu requires admitted solo state80/81');
 if(!Array.isArray(rawControllers)||rawControllers.length<1||rawControllers.length>2)
  throw new RangeError('Supply one or two menu controllers');
 const count=rawControllers.length,sample=prepareNativeRaceMenuInputAdvance(state,{rawControllers,controllerCount4344:count,
  connectedMask4340:(1<<count)-1,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35});
 const init=prepareNativeContinuationMenuInitializationUpdate(sample.state),widget=prepareNativeRaceWidgetAdvance(init.state,constants);
 const presentation=prepareNativeWidgetPresentation(widget.effects),fade=prepareNativeRaceFadeAdvance(widget.state,constants);
 let current=fade.state;
 const operations=[...sample.operations,...init.operations,...widget.operations,...fade.operations];
 const effects=[...sample.effects,...init.effects,...presentation.operations.filter(op=>op.kind!=='widgetMatrix'),...fade.effects];
 const draw=nativeContinuationMenuView(current),widgets=nativeWidgetDrawView(widget.state.hudWords7788,presentation);
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);current=q.state;operations.push(...ops);effects.push(...q.effects);}
 const first=current.scene.initLatch63c!==0&&current.scene.gameStateAb24===80&&![50,57,100].includes(current.scene.previousGameState634);
 if(current.scene.initLatch63c!==0)apply([{kind:'sourceWordWrite',field:'initLatch63c',value:0}]);
 if(first)apply([{kind:'externalCall',consumer:'800c6ad0',arguments:[0]}]);
 else{
  apply([{kind:'sourceWordWrite',field:'fieldAb2c',value:0}]);
  for(const op of prepareNativeContinuationMenuPostDisplay(current).operations){
   if(op.kind==='externalCall'&&op.consumer==='802c5f60')apply(prepareNativeContinuationMenuInputUpdate(current,constants,{expandExit:true}).operations);
   else apply([op]);
  }
 }
 const target=effects.find(op=>op.kind==='externalCall'&&destinations.has(op.consumer));
 return {state:current,operations,effects,draw,widgets,view:nativeContinuationMenuView(current),
  handoff:target?{destination:destinations.get(target.consumer),consumer:target.consumer,returnState:current.scene.returnState630}:null,
  diagnostic:{originalNumericControl:true,modernPresentation:true,firstEntry:first,recordsPersisted:false,targetInitializerExecuted:false}};
}
