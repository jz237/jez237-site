import {createNativeRaceState,prepareNativeRaceStateOperations,prepareNativeChampionshipScoreUpdate,
 prepareNativeChampionshipStandingsInitializationUpdate,prepareNativeChampionshipStandingsInputUpdate,
 prepareNativeRaceWidgetAdvance,prepareNativeRaceFadeAdvance,prepareNativeMenuReturnUpdate,
 prepareNativeRaceMenuInitializationUpdate,prepareNativeRaceWaterSceneInitialization,
 prepareNativeCourseDisplayInitializationUpdate,prepareNativeMenuCameraInitializationUpdate} from './native-race-state.js';
import {prepareNativeChampionshipStandingsUpdate,prepareNativeChampionshipStandingsOffsets,
 prepareNativeChampionshipStandingsDisplayEntry,prepareNativeChampionshipStandingsPostDisplay,
 prepareNativeChampionshipStandingsSaveCheck} from './native-championship-standings.js';
import {prepareNativeWidgetPresentation,nativeWidgetDrawView} from './native-widget-presentation.js';
import {NATIVE_TITLE_MENU_DATA} from './native-title-menu-data.js';
import {prepareNativeChampionshipStandingsPresentation} from './native-championship-standings-presentation.js';
const constants={matrixTargets:'slots',slotTemplateWords6c50:Array(11).fill(0),
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],
 rotationWord6c80:0x40490fdb,rotationWord6c84:0x40490fdb,bounceWord6c88:0x3f333333};
const destinations=new Map([['801eb180','title'],['801eb91c','championship'],['801ecb98','ending'],['801ec944','gameover']]);
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** Main9's926F4 entry preparation, before input/camera/water frame updates.
 * Only latched state52 initializes: water at datum0, course display, cameras.
 * It retains the latch for5800 scoring and the first black display to consume.
 * The host must install waterScene and graphics effects together with state;
 * this function does not advance or mutate a live field or physical world.
 */
export function prepareNativeChampionshipStandingsSceneEntry(state,sourceViews={}){
 const current=createNativeRaceState(state),scene=current.scene;
 if(scene.main638!==9||![52,53].includes(scene.gameStateAb24)||!Number.isInteger(scene.initLatch63c))throw new RangeError('Standings scene entry requires main9 state52/53 and its latch');
 if(scene.initLatch63c===0||scene.gameStateAb24===53)return freeze({state:current,waterScene:null,effects:[],
  diagnostic:{initializers:[],liveSceneUpdated:false}});
 const water=prepareNativeRaceWaterSceneInitialization(current,{datumNative:0});
 const display=prepareNativeCourseDisplayInitializationUpdate(water.state,{courseRows9964:sourceViews.courseRows9964,waterExtent2498:water.waterScene.setupWords[0x78]});
 const camera=prepareNativeMenuCameraInitializationUpdate(display.state,{...sourceViews.menuCamera,datumNative:water.waterScene.datumNative});
 return freeze({state:camera.state,waterScene:water.waterScene,
  effects:[...water.waterScene.operations.filter(o=>o.kind==='waterGraphicsWrite'),...display.effects,...camera.effects],
  diagnostic:{initializers:['8004f9e0','8008e4b0','801dda24'],liveSceneUpdated:false}});
}

export function nativeChampionshipStandingsView(state){
 const m=state.championshipMenuWords7a00,p=state.profileWordsB330;
 if(!Array.isArray(m)||m.length!==68||!Array.isArray(p)||![50,52].includes(p.length))throw new RangeError('Supply retained championship standings owners');
 const half=a=>((state.hudWords7788[(a-0x7788)>>>2]>>>(a%4?0:16))&65535)<<16>>16;
 return freeze({active:[52,53].includes(state.scene.gameStateAb24),exiting:state.scene.gameStateAb24===53,
  phase:state.scene.field640,canConfirm:state.scene.gameStateAb24===52&&(state.scene.field640===2&&state.scene.field644>=30||state.scene.field640===5&&(m[67]|0)>=5),
  xRound:m[0]>>16,xTotal:m[65]>>16,outcome:m[64]|0,destination:m[66]|0,round:p[1]|0,
  roundOrder:[...state.roundOrderE718],totalOrder:[...state.racerOrderA9dc],
  totals:p.slice(4,8).map(v=>v|0),awards:p.slice(8+(p[1]|0)*4,12+(p[1]|0)*4).map(v=>v|0),
  fade:{kind:half(0x8a10),stage:half(0x8a12),active:half(0x8a14),completion:half(0x8a16),
   rgba:[half(0x8a20),half(0x8a22),half(0x8a24),half(0x8a26)]}});
}

/** Standings portion of an original20Hz frame AFTER controller sampling and
 * the common camera/water updates. Main9 in922E4 does NOT invoke86148/665B0
 * navigation/hulls or6E3A8 judging/object motion. The caller must not step the
 * ordinary race world here.5800 precedes5470/AFB4/71A8 and5C1C display.
 *
 * The score is scheduled only by the original entry predicate, whose latch
 * the first display clears. Draw snapshots precede input. Target initializers
 * expand before the main638 save test. Required body/resource/audio/save
 * effects remain ordered host responsibilities. Original GPU transforms are
 * explicit presentation boundaries; the scalar panel offset is projected.
 */
export function prepareNativeChampionshipStandingsPhase(state,sourceViews={}){
 if(![52,53].includes(state.scene.gameStateAb24)||state.scene.main638!==9||state.scene.mode608!==4)
  throw new RangeError('Championship standings phase requires state52/53, main9 and mode4');
 let current=createNativeRaceState(state),handoff=null,scoreInvocations=0;
 const views={...constants,...NATIVE_TITLE_MENU_DATA,...sourceViews},operations=[],effects=[],presentation=[];
 function append(q){current=q.state;operations.push(...q.operations);effects.push(...q.effects);}
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);append({...q,operations:ops});}
 for(const op of prepareNativeChampionshipStandingsUpdate(current).operations){
  if(op.consumer==='80094acc'){append(prepareNativeChampionshipScoreUpdate(current));scoreInvocations++;}
  else if(op.consumer==='802c5a98')append(prepareNativeChampionshipStandingsInitializationUpdate(current));
  else{
   apply(prepareNativeChampionshipStandingsOffsets(current).operations);
   presentation.push({consumer:'802c5850',panelOffsetProjected:true,graphicsExecuted:false});
  }
 }
 const widget=prepareNativeRaceWidgetAdvance(current,views),widgetPresentation=prepareNativeWidgetPresentation(widget.effects);
 current=widget.state;operations.push(...widget.operations);effects.push(...widgetPresentation.operations.filter(o=>o.kind!=='widgetMatrix'));
 append(prepareNativeRaceFadeAdvance(current,views));
 const prefix=prepareNativeChampionshipStandingsDisplayEntry(current);apply(prefix.operations);
 const draw={kind:prefix.drawKind,view:nativeChampionshipStandingsView(current),
  layout:prefix.drawKind==='black'?null:prepareNativeChampionshipStandingsPresentation(current,views),
  widgets:prefix.drawKind==='black'?[]:nativeWidgetDrawView(widget.state.hudWords7788,widgetPresentation)};
 function dispatch(ops){
  for(const op of ops){
   if(op.kind==='externalCall'&&op.consumer==='802c6cc4'){
    dispatch(prepareNativeChampionshipStandingsInputUpdate(current,views,{expandExit:true}).operations);
   }else if(op.kind==='externalCall'&&destinations.has(op.consumer)){
    if(handoff)throw new RangeError('Multiple championship standings handoffs');
    handoff={consumer:op.consumer,destination:destinations.get(op.consumer)};
    append(handoff.destination==='gameover'?prepareNativeRaceMenuInitializationUpdate(current,{consumer:op.consumer},views):
     prepareNativeMenuReturnUpdate(current,handoff.destination,views));
   }else apply([op]);
  }
 }
 if(prefix.drawKind!=='black'){
  presentation.push({consumer:'802c5dc0',semanticLayoutPrepared:true,graphicsExecuted:false});
  dispatch(prepareNativeChampionshipStandingsPostDisplay(current).operations);
  apply(prepareNativeChampionshipStandingsSaveCheck(current).operations);
 }
 return freeze({state:current,operations,effects,presentation,draw,view:nativeChampionshipStandingsView(current),handoff,
  diagnostic:{firstEntry:prefix.diagnostic.firstEntry,scoreInvocations,targetInitializerExecuted:handoff!==null,
   inputCameraWaterRequiredBeforePhase:true,physicalWorldUpdated:false,graphicsExecuted:false,recordsPersisted:false}});
}
