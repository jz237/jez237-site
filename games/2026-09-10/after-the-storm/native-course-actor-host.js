import {prepareNativeCourseActorAssets} from './native-course-actor-assets.js';
import {prepareNativeCourseActorInitializationUpdate,prepareNativeCourseActorFrameUpdate,prepareNativeCourseDisplayInitializationUpdate} from './native-race-state.js';
import {prepareNativeActorDisplayFrame} from './native-actor-display-frame.js';
import {prepareNativeActorPresentation} from './native-actor-presentation.js';

/** Course actors share the caller's canonical race owner. Resource binding
 * and AC184 startup commit together. AD418 belongs after B2ABC; ADF90 belongs
 * to the display stage. Neither a browser refresh nor this bridge runs clocks,
 * water, AI or audio. The caller supplies actual startup/body/water inputs and
 * installs returned audio effects in order.
 *
 * Display preparation leaves both owners untouched. After accepting all
 * high-resolution geometry, the renderer commits the exact prepared ticket.
 * Any intervening canonical update invalidates it, preventing an old display
 * frame from overwriting newer physics, RNG, input or race progress.
 */
export function createNativeCourseActorHost({readRaceState,commitRaceState,buffers,worldScale}={}){
 if(typeof readRaceState!=='function'||typeof commitRaceState!=='function')throw new TypeError('Course actors require a canonical race owner');
 let presentation=prepareNativeActorPresentation(buffers,[],{worldScale}),binding=null,generation=0;
 const tickets=new WeakMap();
 function read(){
  const state=readRaceState();
  if(!state||typeof state!=='object')throw new TypeError('Supply the canonical race state');
  if(binding){
   if(state.scene?.courseIndex!==binding.courseIndex)throw new Error('Course actor scene changed; recreate its host');
   const words=state.resourceWordsE73c;
   // Static parts and selector mappings are as important as animation tables.
   if(!Array.isArray(words)||words.length!==binding.words.length||words.some((w,i)=>w!==binding.words[i]))throw new Error('Course actor resources changed; recreate its host');
  }
  return state;
 }
 function initialized(){if(!binding)throw new Error('Initialize course actors before their frame stages');return read();}
 return Object.freeze({
  initialize(input,resources,{freshWebScene=false,waterExtent2498}={}){
   if(binding)throw new Error('Course actor startup may run only once');
   if(typeof freshWebScene!=='boolean')throw new TypeError('Fresh web actor allocation must be explicit');
   let state=read();
   if(freshWebScene){
    if(state.resourceWordsE73c!==undefined||state.resourceWordsB538!==undefined)
     throw new Error('Fresh web actor allocation cannot replace retained resources');
    // Explicit new browser storage, not a restored cartridge memory image.
    state={...state,resourceWordsE73c:Array(43).fill(0),resourceWordsB538:Array(8).fill(0),
     scene:{...state.scene,championshipCountAa00:state.scene.championshipCountAa00??0}};
   }
   const assets=prepareNativeCourseActorAssets(state,resources);
   const display=freshWebScene?prepareNativeCourseDisplayInitializationUpdate(assets.state,{waterExtent2498}):null;
   const q=prepareNativeCourseActorInitializationUpdate(display?.state??assets.state,input);
   const nextBinding=Object.freeze({courseIndex:q.state.scene.courseIndex,words:Object.freeze([...q.state.resourceWordsE73c]),animationResources:assets.animationResources});
   commitRaceState(q.state);binding=nextBinding;generation++;
   return Object.freeze({...q,operations:Object.freeze([...assets.operations,...(display?.operations??[]),...q.operations]),
    effects:Object.freeze([...(display?.effects??[]),...q.effects])});
  },
  advanceMotion(input){
   const q=prepareNativeCourseActorFrameUpdate(initialized(),{...input,animationResources:binding.animationResources});
   commitRaceState(q.state);generation++;return q;
  },
  prepareDisplay(input){
   const state=initialized(),q=prepareNativeActorDisplayFrame(state,presentation,{...input,animationResources:binding.animationResources},{worldScale});
   tickets.set(q,{state,generation});return q;
  },
  commitDisplay(ticket){
   const expected=tickets.get(ticket);
   if(!expected)throw new Error('Supply this host\'s uncommitted actor display ticket');
   if(expected.generation!==generation||initialized()!==expected.state)throw new Error('Actor display ticket is stale; prepare it again');
   commitRaceState(ticket.state);presentation=ticket.presentation;generation++;tickets.delete(ticket);
   return ticket;
  },
  presentation:()=>presentation
 });
}
