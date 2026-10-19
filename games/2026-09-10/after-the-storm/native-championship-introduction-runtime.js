import {createNativeRaceState,prepareNativeRaceStateOperations,prepareNativeChampionshipSelectionFrameUpdate,
 prepareNativeRaceWidgetAdvance,prepareNativeRaceFadeAdvance,prepareNativeRaceFadePropertiesUpdate,
 prepareNativeRaceFadeSlotsResetUpdate,prepareNativeMenuReturnUpdate,prepareNativeRaceMainConfigurationUpdate} from './native-race-state.js';
import {prepareNativeChampionshipIntroductionPanel,prepareNativeChampionshipIntroductionDisplayEntry,
 prepareNativeChampionshipIntroductionPostDisplay,prepareNativeChampionshipIntroductionDisplayTail,
 prepareNativeChampionshipIntroductionExit} from './native-championship-introduction-control.js';
import {prepareNativeWidgetPresentation,nativeWidgetDrawView} from './native-widget-presentation.js';
import {stepNativeAIRandom} from './native-ai-initialization.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const defaults={matrixTargets:'slots',slotTemplateWords6c50:Array(11).fill(0),
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],
 rotationWord6c80:0x40490fdb,rotationWord6c84:0x40490fdb,bounceWord6c88:0x3f333333};

/** Original main8 overlay/GUI/display portion AFTER physical scene updates.
 * It owns no physical ticking, resource loading or GPU execution. A race
 * handoff contains the already-executed9345C configuration; the next loader
 * must consume that configuration rather than call9345C a second time.
 * All state is detached until the host commits the complete scene frame.
 */
export function prepareNativeChampionshipIntroductionPhase(state,sourceViews={}){
 let current=createNativeRaceState(state),handoff=null,rngCalls=0;
 if(current.scene.main638!==8||![30,31].includes(current.scene.gameStateAb24)||current.scene.mode608!==4)
  throw new RangeError('Championship introduction requires main8 state30/31 and mode4');
 const views={...defaults,...sourceViews},operations=[],effects=[],presentation=[];
 function append(q){current=q.state;operations.push(...q.operations);effects.push(...q.effects);return q;}
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);return append({...q,operations:ops});}
 const update=append(prepareNativeChampionshipSelectionFrameUpdate(current,views));
 const widgets=prepareNativeRaceWidgetAdvance(current,views),widgetPresentation=prepareNativeWidgetPresentation(widgets.effects);
 current=widgets.state;operations.push(...widgets.operations);effects.push(...widgetPresentation.operations.filter(o=>o.kind!=='widgetMatrix'));
 append(prepareNativeRaceFadeAdvance(current,views));
 const prefix=prepareNativeChampionshipIntroductionDisplayEntry(current);apply(prefix.operations);
 const draw={kind:prefix.drawKind,panelStage:prefix.panelStage,widgets:prefix.drawKind==='black'?[]:nativeWidgetDrawView(widgets.state.hudWords7788,widgetPresentation)};
 function dispatch(ops){
  for(const op of ops){
   if(op.kind!=='externalCall'){apply([op]);continue;}
   const args=op.arguments;
   switch(op.consumer){
    case '802c6e9c':dispatch(prepareNativeChampionshipIntroductionExit(current).operations);break;
    case '801e6fb0':append(prepareNativeRaceFadePropertiesUpdate(current,{fadeTemplateWords6cc0:views.fadeTemplateWords6cc0,type:args[0],rate:args[1],selector:args[2]}));break;
    case '801e6a4c':append(prepareNativeRaceFadeSlotsResetUpdate(current,{slotTemplateWords6c50:views.slotTemplateWords6c50}));break;
    case '80047e50':{
     const rng=stepNativeAIRandom(current.scene.rngState4640);rngCalls++;
     apply([{kind:'sourceWordWrite',field:'rngState4640',value:rng.rngState}]);break;
    }
    case '801eb91c':{
     append(prepareNativeMenuReturnUpdate(current,'championship',views));
     handoff={destination:'introduction',consumer:'801eb91c'};break;
    }
    case '8009345c':{
     const configuration=append(prepareNativeRaceMainConfigurationUpdate(current,views));
     handoff={destination:'race',consumer:'8009345c',configuration,configurationEffectsPending:false};break;
    }
    default:apply([op]);
   }
  }
 }
 if(prefix.drawKind!=='black'){
  if(prefix.panelStage!==null){
   apply(prepareNativeChampionshipIntroductionPanel(current).operations);
   presentation.push({consumer:prefix.panelStage===0?'i3:802c5d54':'i3:802c6344',numericControlsExecuted:true,graphicsExecuted:false});
   draw.panelWords=[...current.championshipIntroPanelWords6f64];
  }
  // Panel drawing observes its just-updated opacity; controls observe the new
  // skip latch even on the frame it becomes enabled. Exit changes occur later.
  dispatch(prepareNativeChampionshipIntroductionPostDisplay(current).operations);
  dispatch(prepareNativeChampionshipIntroductionDisplayTail(current).operations);
 }
 return freeze({state:current,operations,effects,presentation,draw,handoff,
  diagnostic:{resetScores:update.diagnostic.resetScores,rngCalls,physicalWorldUpdated:false,graphicsExecuted:false,
   pendingDisplayConsumers:prefix.drawKind==='black'?['80093c44']:['8009328c',...presentation.map(p=>p.consumer)],recordsPersisted:false}});
}
