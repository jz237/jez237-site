import {prepareNativeEndingMenuScrollUpdate,prepareNativeRaceWidgetAdvance,prepareNativeRaceFadeAdvance,
 prepareNativeRaceStateOperations,prepareNativeEndingMenuPostDisplayUpdate,prepareNativeMenuReturnUpdate,
 prepareNativeRaceMenuInitializationUpdate} from './native-race-state.js';
import {prepareNativeEndingPresentation} from './native-ending-presentation.js';
import {prepareNativeWidgetPresentation,nativeWidgetDrawView} from './native-widget-presentation.js';
import {NATIVE_TITLE_MENU_DATA} from './native-title-menu-data.js';

const constants={matrixTargets:'slots',slotTemplateWords6c50:Array(11).fill(0),
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],
 rotationWord6c80:0x40490fdb,rotationWord6c84:0x40490fdb,bounceWord6c88:0x3f333333};
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

export function nativeEndingMenuView(state){
 const half=a=>((state.hudWords7788[(a-0x7788)>>>2]>>>(a%4?0:16))&65535)<<16>>16;
 return freeze({active:[102,103].includes(state.scene.gameStateAb24),exiting:state.scene.gameStateAb24===103,
  ready:(state.endingMenuWords6d50?.[(0x6df4-0x6d50)/4]??0)!==0,
  inputTicks:(state.endingMenuWords6d50?.[(0x6df8-0x6d50)/4]??0)|0,
  fade:{kind:half(0x8a10),stage:half(0x8a12),active:half(0x8a14),completion:half(0x8a16),
   rgba:[half(0x8a20),half(0x8a22),half(0x8a24),half(0x8a26)]}});
}

/** The ending portion of one original20Hz frame, AFTER input sampling and the
 * world's update. Source922E4 continues the physical world before5800 in both
 * states102/103; this function cannot replace that world update. The host must
 * supply its resulting canonical state and consume required effects in order.
 *
 * Advances5800,5470,AFB4,71A8, then prepares5F50 drawing before6C1C input.
 * Semantic high-resolution drawing needs no invented display-list addresses.
 * Draw data retains the pre-control state even when this tick exits the menu.
 * Returned handoffs terminate this phase; resources, audio, matrix helpers,
 * podium rendering and records persistence remain explicit host boundaries.
 */
export function prepareNativeEndingMenuPhase(state,sourceViews={}){
 if(![102,103].includes(state.scene.gameStateAb24)||state.scene.main638!==21||state.scene.mode608!==4)
  throw new RangeError('Ending phase requires championship state102/103, main21');
 const views={...constants,...NATIVE_TITLE_MENU_DATA,...sourceViews};
 const scroll=prepareNativeEndingMenuScrollUpdate(state,views),widget=prepareNativeRaceWidgetAdvance(scroll.state,views);
 const widgetPresentation=prepareNativeWidgetPresentation(widget.effects),fade=prepareNativeRaceFadeAdvance(widget.state,views);
 let current=fade.state;
 const operations=[...scroll.operations,...widget.operations,...fade.operations];
 const effects=[...scroll.effects,...widgetPresentation.operations.filter(op=>op.kind!=='widgetMatrix'),...fade.effects];
 const first=current.scene.initLatch63c!==0&&current.scene.gameStateAb24===102;
 const draw={kind:first?'white':'scene',view:nativeEndingMenuView(current),
  ending:first?null:prepareNativeEndingPresentation(current,views),
  widgets:first?[]:nativeWidgetDrawView(widget.state.hudWords7788,widgetPresentation)};
 function append(q){current=q.state;operations.push(...q.operations);effects.push(...q.effects);}
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);append({...q,operations:ops});}
 if(current.scene.initLatch63c!==0)apply([{kind:'sourceWordWrite',field:'initLatch63c',value:0}]);
 let handoff=null;
 if(!first){
  apply([{kind:'sourceWordWrite',field:'fieldAb2c',value:0}]);
  const post=prepareNativeEndingMenuPostDisplayUpdate(current,views,{expandInput:true});
  const target=post.operations.at(-1);
  if(target?.kind==='externalCall'&&['801eb180','801ec9c8'].includes(target.consumer)){
   apply(post.operations.slice(0,-1));
   handoff={destination:target.consumer==='801eb180'?'title':'records',consumer:target.consumer,returnState:current.scene.returnState630};
   append(handoff.destination==='title'?prepareNativeMenuReturnUpdate(current,'title',views):
    prepareNativeRaceMenuInitializationUpdate(current,{consumer:target.consumer},views));
  }else append(post);
 }
 return freeze({state:current,operations,effects,draw,view:nativeEndingMenuView(current),handoff,
  scrollPresentation:scroll.presentation,
  diagnostic:{originalNumericControl:true,firstEntry:first,targetInitializerExecuted:handoff!==null,
   inputAndWorldUpdateRequiredBeforePhase:true,physicalWorldUpdated:false,graphicsExecuted:false,recordsPersisted:false}});
}
