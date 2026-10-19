import {prepareNativePresentationActorDisplayUpdate} from './native-race-state.js';
import {prepareNativeActorPresentation} from './native-actor-presentation.js';

/** Prepare the canonical actor update and both retained rendering buffers as
 * one detached result. The host installs state and presentation together only
 * after the renderer accepts all geometry/material bindings. No source clock,
 * motion, GPU work or mutable owner is advanced by this function.
 */
export function prepareNativeActorDisplayFrame(state,buffers,input,{worldScale}={}){
 const update=prepareNativePresentationActorDisplayUpdate(state,input);
 const presentation=prepareNativeActorPresentation(buffers,update.effects,{worldScale});
 return Object.freeze({...update,presentation});
}
