import {prepareNativeScaledEulerMatrix,prepareNativeScaledBasisMatrix} from './native-widget-transform.js';
import {nativeSineTableWords} from './native-math-tables.js';
import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),countOffset=0x801d06b8-0x801cf060;
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function scalar(w){b.setUint32(0,w);const v=b.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite actor matrix input');return v;}
function circular(v){while(v>=360){const next=F(v-360);if(next===v)throw new RangeError('Original actor angle loop cannot advance');v=next;}while(v<0){const next=F(v+360);if(next===v)throw new RangeError('Original actor angle loop cannot advance');v=next;}return v;}

/**9D96C numeric root transform, including49C9C/48A88 and actual used-counter
 *increment. Matrix writes target the selected retained graphics buffer/slot;
 *the host must apply even partial writes to that existing matrix. Two original
 *display-list words become an explicit bind effect, not executable commands.
 */
export function prepareNativePresentationActorRootMatrix(input){
 const pool=input?.actorWordsF060,actorIndex=input?.actorIndex,bufferIndex=input?.bufferIndex;
 if(!Array.isArray(pool)||pool.length!==NATIVE_PRESENTATION_ACTOR_WORDS||pool.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained actorWordsF060');
 if(!Number.isInteger(actorIndex)||actorIndex<0||actorIndex>=30||![0,1].includes(bufferIndex))throw new RangeError('Invalid actor matrix selection');
 const actorWordsF060=[...pool],matrixIndex=pool[countOffset/4]|0,base=actorIndex*47;
 if(matrixIndex<0||matrixIndex>=192)throw new RangeError('Actor matrix allocation outside buffer');
 const get=o=>scalar(pool[base+o/4]),vector=o=>({x:get(o),y:get(o+4),z:get(o+8)});
 let matrix;
 if(pool[base+0xb8/4]===0){
  const type=pool[base];let yaw=get(0x18);
  if([1,2,3,4,5,6,12,13].includes(type))yaw=F(-F(yaw-90));else if(type>=7&&type<=10)yaw=F(90-yaw);
  const anglesDegrees={x:circular(get(0x20)),y:circular(yaw),z:circular(get(0x1c))};
  matrix=prepareNativeScaledEulerMatrix({anglesDegrees,positionNative:vector(0xc),scale:input.scale,sineTableWords4350:input.sineTableWords4350??nativeSineTableWords()});
 }else matrix=prepareNativeScaledBasisMatrix({forwardNative:vector(0x30),upNative:vector(0x3c),positionNative:vector(0xc),scale:get(0x48)});
 const operations=matrix.operations.filter(o=>o.kind!=='scratchFloatWrite').map(o=>({kind:'presentationActorMatrixWrite',bufferIndex,matrixIndex,
  byteOffset:o.kind==='matrixWordWrite'?o.wordIndex*4:o.byteOffset,width:o.kind==='matrixWordWrite'?4:2,value:o.value}));
 operations.push({kind:'presentationActorMatrixBind',bufferIndex,matrixIndex,actorIndex});
 actorWordsF060[countOffset/4]=(matrixIndex+1)>>>0;operations.push({kind:'presentationActorWrite',byteOffset:countOffset,width:4,value:matrixIndex+1});
 return freeze({actorWordsF060,operations,matrixWords:matrix.matrixWords,diagnostic:{actorIndex,bufferIndex,matrixIndex,matrixComplete:matrix.complete,graphicsExecuted:false}});
}
