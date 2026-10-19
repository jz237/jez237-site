import {prepareNativePresentationEffectsInitializationUpdate,prepareNativePresentationEffectsFrameUpdate,prepareNativePresentationEffectsDisplayUpdate} from './native-race-state.js';
import {prepareNativeEffectPresentation} from './native-effect-presentation.js';
import {NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
import {NATIVE_EFFECT_CONTROL_INITIAL_WORDS} from './source-effect-controls.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** Scene effects share the caller's canonical race owner. AE7C4 startup runs
 * after AC184 actors and before893A8 AI. B2ABC belongs where922E4 calls it,
 * after water/object motion and before AD418; B305C follows ADF90 in the
 * display stage. The caller supplies actual bodies, plane queries and clocks.
 *
 * The two B2F0-byte scene buffers are this host's retained vertex/matrix
 * storage, distinct from the actor/AI graphics buffers. Startup and motion
 * vertex writes reach them on commit. A display ticket leaves both owners
 * untouched until the renderer accepts its geometry; any intervening update
 * makes it stale. The extra Dolphin slot is retained effect storage only and
 * is never presented as another physical rider or audio participant.
 */
export function createNativeCourseEffectsHost({readRaceState,commitRaceState,graphicsBuffers,worldScale}={}){
 if(typeof readRaceState!=='function'||typeof commitRaceState!=='function')throw new TypeError('Scene effects require a canonical race owner');
 // Validates both buffers and the scale before any state can change.
 let buffers=prepareNativeEffectPresentation(graphicsBuffers,[],{worldScale}).graphicsBuffers,display=null,initialized=false,generation=0,frames=0,displays=0;
 const tickets=new WeakMap();
 function read(){const state=readRaceState();if(!state||typeof state!=='object')throw new TypeError('Supply the canonical race state');return state;}
 function ready(){if(!initialized)throw new Error('Initialize scene effects before their frame stages');return read();}
 const present=effects=>prepareNativeEffectPresentation(buffers,effects,{worldScale});
 return Object.freeze({
  initialize(input,{freshWebScene=false}={}){
   if(initialized)throw new Error('Scene effect startup may run only once');
   if(typeof freshWebScene!=='boolean')throw new TypeError('Fresh web effect allocation must be explicit');
   let state=read();
   if(freshWebScene){
    if(state.effectWords0790!==undefined||state.effectControlWords6d60!==undefined)throw new Error('Fresh web effect allocation cannot replace retained storage');
    // Explicit new browser effect storage plus the cartridge's loaded control
    // data (palette and latch), not a restored runtime memory image.
    state={...state,effectWords0790:Array(NATIVE_PRESENTATION_EFFECT_WORDS).fill(0),effectControlWords6d60:[...NATIVE_EFFECT_CONTROL_INITIAL_WORDS]};
   }
   const q=prepareNativePresentationEffectsInitializationUpdate(state,input),p=present(q.effects);
   commitRaceState(q.state);buffers=p.graphicsBuffers;initialized=true;generation++;return q;
  },
  advanceMotion(input){
   const q=prepareNativePresentationEffectsFrameUpdate(ready(),input),p=present(q.effects);
   commitRaceState(q.state);buffers=p.graphicsBuffers;generation++;frames++;return q;
  },
  prepareDisplay(input){
   const state=ready(),q=prepareNativePresentationEffectsDisplayUpdate(state,input),ticket=Object.freeze({...q,presentation:present(q.effects)});
   tickets.set(ticket,{state,generation});return ticket;
  },
  commitDisplay(ticket){
   const expected=tickets.get(ticket);
   if(!expected)throw new Error('Supply this host\'s uncommitted effect display ticket');
   if(expected.generation!==generation||ready()!==expected.state)throw new Error('Effect display ticket is stale; prepare it again');
   commitRaceState(ticket.state);buffers=ticket.presentation.graphicsBuffers;display=ticket.presentation;generation++;displays++;tickets.delete(ticket);
   return ticket;
  },
  //52480 reads the preceding B2ABC left/right levels of physical racers.
  // B08F8 writes them only for human slots; the extra actor slot is excluded.
  levels(){
   const s=ready(),count=s.scene.racerCount,word=a=>s.effectWords0790[(a-0x790)/4]|0;
   return Array.from({length:count},(_,i)=>{const entry=0x798+i*0x1c74;return {left:word(entry+0x1c5c),right:word(entry+0x1c60)};});
  },
  presentation:()=>display,
  graphicsBuffers:()=>buffers,
  snapshot(){
   const s=initialized?read():null;
   return freeze({initialized,frames,displays,effectCount:s?s.effectWords0790[0]|0:0,extraActor:s?s.effectWords0790[(0x7a08-0x790)/4]!==0:false,
    draws:display?.draws.length??0,triangles:display?.diagnostic.triangles??0});
  }
 });
}
