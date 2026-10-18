import {prepareNativeRecordsBrowserAdvance,prepareNativeRaceWidgetAdvance,prepareNativeRaceFadeAdvance,
 prepareNativeRaceStateOperations,prepareNativeRecordsBrowserPostDisplayUpdate,prepareNativeMenuReturnUpdate,
 prepareNativeRaceMenuInitializationUpdate} from './native-race-state.js';
import {prepareNativeRecordsPresentation} from './native-records-presentation.js';
import {prepareNativeWidgetPresentation,nativeWidgetDrawView} from './native-widget-presentation.js';
import {NATIVE_TITLE_MENU_DATA} from './native-title-menu-data.js';
import {NATIVE_RECORDS_MENU_DATA} from './native-records-menu-data.js';
const constants={matrixTargets:'slots',slotTemplateWords6c50:Array(11).fill(0),
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],
 rotationWord6c80:0x40490fdb,rotationWord6c84:0x40490fdb,bounceWord6c88:0x3f333333};
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
export function nativeRecordsMenuView(state){
 const half=a=>((state.hudWords7788[(a-0x7788)>>>2]>>>(a%4?0:16))&65535)<<16>>16;
 const word=a=>(state.recordsBrowserWords80c0?.[(a-0x80c0)/4]??0)|0;
 return freeze({active:[66,67].includes(state.scene.gameStateAb24),exiting:state.scene.gameStateAb24===67,
  sliding:word(0x80dc)!==0,stage:word(0x80c0),category:word(0x80c4),cursor:word(0x80c8),
  course:word(0x80ec),recordType:word(0x80f0),postRace:word(0x81a4)!==0,
  fade:{kind:half(0x8a10),stage:half(0x8a12),active:half(0x8a14),completion:half(0x8a16),
   rgba:[half(0x8a20),half(0x8a22),half(0x8a24),half(0x8a26)]}});
}

/** Records portion of one original20Hz frame AFTER controller sampling.
 * Unlike the ending, main12 has no intervening physical-world update. This
 * composes5800,5470/AFB4,71A8 and5D24 in order. The entry frame clears black;
 * later frames draw the pre-control layout before accepting input or handing
 * off to the original return initializer. Resource/audio and rider matrix
 * consumers remain host responsibilities. The host retains full resolution.
 */
export function prepareNativeRecordsMenuPhase(state,sourceViews={}){
 if(![66,67].includes(state.scene.gameStateAb24)||state.scene.main638!==12)
  throw new RangeError('Records phase requires state66/67, main12');
 const views={...constants,...NATIVE_TITLE_MENU_DATA,...NATIVE_RECORDS_MENU_DATA,...sourceViews};
 const advance=prepareNativeRecordsBrowserAdvance(state,views),widget=prepareNativeRaceWidgetAdvance(advance.state,views);
 const widgetPresentation=prepareNativeWidgetPresentation(widget.effects),fade=prepareNativeRaceFadeAdvance(widget.state,views);
 let current=fade.state;
 const operations=[...advance.operations,...widget.operations,...fade.operations];
 const effects=[...advance.effects,...widgetPresentation.operations.filter(o=>o.kind!=='widgetMatrix'),...fade.effects];
 const first=current.scene.initLatch63c!==0&&current.scene.gameStateAb24===66;
 function append(q){current=q.state;operations.push(...q.operations);effects.push(...q.effects);}
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);append({...q,operations:ops});}
 if(current.scene.initLatch63c!==0)apply([{kind:'sourceWordWrite',field:'initLatch63c',value:0}]);
 if(!first)apply([{kind:'sourceWordWrite',field:'fieldAb2c',value:0}]);
 let records=null;
 if(!first){const q=prepareNativeRecordsPresentation(current,views);records={...q,commands:[{kind:'clip',x1:8,y1:20,x2:311,y2:219},...q.commands]};}
 const draw={kind:first?'black':'records',view:nativeRecordsMenuView(current),records,
  widgets:first?[]:nativeWidgetDrawView(widget.state.hudWords7788,widgetPresentation)};
 let handoff=null;
 if(!first){
  const post=prepareNativeRecordsBrowserPostDisplayUpdate(current,views,{expandInput:true});
  const target=post.operations.at(-1),destinations={'801eb180':'title','801ec304':'menu60','801ec830':'continuation'};
  if(target?.kind==='externalCall'&&Object.hasOwn(destinations,target.consumer)){
   apply(post.operations.slice(0,-1));
   handoff={destination:destinations[target.consumer],consumer:target.consumer,returnState:current.scene.returnState630};
   append(target.consumer==='801eb180'?prepareNativeMenuReturnUpdate(current,'title',views):
    prepareNativeRaceMenuInitializationUpdate(current,{consumer:target.consumer},views));
  }else append(post);
 }
 return freeze({state:current,operations,effects,draw,view:nativeRecordsMenuView(current),handoff,
  riderPresentation:advance.presentation,
  diagnostic:{originalNumericControl:true,firstEntry:first,targetInitializerExecuted:handoff!==null,
   inputSamplingRequiredBeforePhase:true,physicalWorldUpdated:false,graphicsExecuted:false,recordsPersisted:false}});
}
