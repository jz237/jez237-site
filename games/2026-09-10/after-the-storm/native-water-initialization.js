// Independent numeric reconstruction of both source water-noise passes and
// their shared32-bit random history. No original data or startup seed is used.
import {seedNativeWaterNoise,NATIVE_WATER_GRID} from './native-water-field.js';
import {stepNativeAIRandom} from './native-ai-initialization.js';

function integer(value,name,min,max){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`Invalid ${name}`);
 return value||0;
}

/** Prepare the entire128x384 height/velocity replacement and the next shared
 * RNG word together. The caller supplies actual amplitude and800D4640 state;
 * there is no bootstrap seed, skipped-consumer count, camera or phase reset.
 * Even amplitude0 consumes all98,316 draws. Only the LOW15 bits feed noise.
 *
 * The returned immutable arrays are detached preparation. Commit them and the
 * returned RNG word in the same logical initialization step. This is4F790,
 * not the surrounding4F9E0 field-template setup or complete scene startup.
 */
export function prepareNativeWaterInitialization(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Expected explicit water initialization input');
 const amplitudeNative=integer(input.amplitudeNative,'amplitudeNative',0,127);
 let rngState4640=integer(input.rngState4640,'rngState4640',0,0xffffffff);
 const count=NATIVE_WATER_GRID.columns*NATIVE_WATER_GRID.rows;
 // Scratch storage is fully overwritten by the original two-pass kernel.
 const field={heightQ:new Int16Array(count),velocityQ:new Int16Array(count)};
 const {randomCalls:rngCalls}=seedNativeWaterNoise(field,{amplitudeNative,random15:()=>{
  rngState4640=stepNativeAIRandom(rngState4640).rngState;
  return rngState4640&0x7fff;
 }});
 return Object.freeze({heightQ:Object.freeze(Array.from(field.heightQ)),
  velocityQ:Object.freeze(Array.from(field.velocityQ)),rngState4640,rngCalls});
}
