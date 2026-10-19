import {prepareNativeRiderWaterAudio} from './native-audio-packet.js';
const F=Math.fround;

/** 662E0..6633C runs after the completed rider pose, before water evolution.
 * The physical body owns C84/C86 for every racer. Audio only consumes them.
 * Reached queries use joint2 and the original scalar plane, never render height.
 */
export function prepareNativeRiderWaterState(previous,{actorState,jointWorld,scale,queryNative}={}){
 let point6b4Native,waterQueryNative;
 if(actorState===23||actorState===5){
  if(!Number.isFinite(scale)||scale<=0||!jointWorld)throw new TypeError('Rider water needs actual joint2 and world scale');
  point6b4Native=Object.fromEntries(['x','y','z'].map(k=>{
   const v=F(jointWorld[k]/scale);if(!Number.isFinite(v))throw new RangeError('Nonfinite rider water joint2');return [k,v];
  }));
  if(typeof queryNative!=='function')throw new TypeError('Rider water needs the source plane query');
  waterQueryNative=queryNative(point6b4Native.x,point6b4Native.z);
 }
 return Object.freeze(prepareNativeRiderWaterAudio(previous?.bodyC86,{actorC54:actorState,point6b4Native,waterQueryNative}));
}
