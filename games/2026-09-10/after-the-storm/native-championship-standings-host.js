import {createNativeRaceState,prepareNativeRaceStateOperations,prepareNativeRaceDeviceSampleUpdate,
 prepareNativeRaceMenuInputUpdate,prepareNativeMenuCameraFrameUpdate,prepareNativeSpecialWaterFrameUpdate,prepareNativeSceneGraphicsFrameUpdate} from './native-race-state.js';
import {prepareNativeChampionshipStandingsSceneEntry,prepareNativeChampionshipStandingsPhase} from './native-championship-standings-runtime.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** One original main9 outer frame, prepared without mutating live field/state.
 * Device sampling precedes scene setup, while adaptation follows it. Camera,
 * water and display cadence precede standings/GUI updates; input clock follows
 * the final display. The host commits this state and its water frame together.
 *6A264 retains its independent scene workspace;8E794 GPU submission remains
 * a presentation boundary.
 */
export function prepareNativeChampionshipStandingsFrame(state,{rawControllers=[],waterDatumNative,waterExtentNative}={},sourceViews={}){
 let current=createNativeRaceState(state);
 if(current.scene.main638!==9||![52,53].includes(current.scene.gameStateAb24)||current.scene.mode608!==4)
  throw new RangeError('Standings host requires main9 championship state52/53');
 if(!Array.isArray(rawControllers)||rawControllers.length>current.scene.players)throw new RangeError('Supply connected menu controllers');
 const count=rawControllers.length,input={rawControllers,controllerCount4344:count,connectedMask4340:(1<<count)-1,
  controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35};
 const effects=[],stages=[];
 function append(q){current=q.state;effects.push(...q.effects);return q;}
 function apply(operations){return append(prepareNativeRaceStateOperations(current,operations));}
 apply([{kind:'graphicsBufferAdvance'}]);
 stages.push('8004a2b4');append(prepareNativeRaceDeviceSampleUpdate(current,input));
 stages.push('8006a264');append(prepareNativeSceneGraphicsFrameUpdate(current));
 if(current.scene.initLatch63c!==0)stages.push('800926f4');
 const entry=prepareNativeChampionshipStandingsSceneEntry(current,sourceViews);append(entry);
 stages.push('80092938');append(prepareNativeRaceMenuInputUpdate(current,input));
 const datumNative=entry.waterScene?.datumNative??waterDatumNative,extentNative=entry.waterScene?.setupWords[0x78]??waterExtentNative;
 stages.push('801dde48');append(prepareNativeMenuCameraFrameUpdate(current,{datumNative,bufferIndex:current.graphicsCorners.renderBufferIndex}));
 stages.push('80051238');const water=prepareNativeSpecialWaterFrameUpdate(current,{extentNative,sineLookup:sourceViews.sineLookup});current=water.state;
 stages.push('8008e794');apply([{kind:'sourceWordWrite',field:'toggleD9914',value:(current.scene.toggleD9914+1)&3}]);
 stages.push('802c5800','801e5470','801eafb4','801e71a8');const phase=append(prepareNativeChampionshipStandingsPhase(current,
  {...sourceViews,connectedMask4340:input.connectedMask4340}));
 apply([{kind:'sourceWordWrite',field:'inputTick1960',value:(current.scene.inputTick1960+1)>>>0}]);
 return freeze({state:current,waterScene:entry.waterScene,waterOperations:water.effects,effects,stages,
  draw:phase.draw,view:phase.view,handoff:phase.handoff,
  diagnostic:{scoreInvocations:phase.diagnostic.scoreInvocations,physicalWorldUpdated:false,graphicsExecuted:false,
   pendingGraphicsConsumers:['8008e794','80050204'],recordsPersisted:false}});
}
