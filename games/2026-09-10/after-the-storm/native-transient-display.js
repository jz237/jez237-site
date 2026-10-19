import {NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
import {prepareNativeRaceStartTransform} from './native-race-start-transform.js';
import {prepareNativePackedMatrix} from './native-widget-transform.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite transient transform');return F(v);}
const number=w=>{b.setUint32(0,w);return finite(b.getFloat32(0));},bits=v=>{b.setFloat32(0,finite(v));return b.getUint32(0);};
const xyz=v=>Object.fromEntries(['x','y','z'].map((k,i)=>[k,v[i]]));

/** Complete AF798 numeric display preparation. Its shared 801AE950 matrix
 * allocator is distinct from the actor allocator. Matrices address offset4140
 * in the selected B2F0-byte buffer. Partial 48854 writes retain old bytes.
 * Original command groups become explicit material, matrix-bind and quad-draw
 * requests; these never execute a guest display list or change output resolution.
 */
export function prepareNativeTransientDisplay(input){
 const pool=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),control=words(input.effectControlWords6d60,22,'effectControlWords6d60'),
  bufferIndex=integer(input.bufferIndex,'scene graphics buffer',0,1),view=integer(input.fieldAb2c,'transient display view',-2147483648,2147483647),
  cameraIndex=integer(view===0?input.displayCamera3930:input.displayCamera3934,'transient display camera',0,1),operations=[];
 let matrixCountE950=integer(input.matrixCountE950,'shared scene matrix count',0,2147483647),hud,drawn=0;const incompleteSlots=[];
 const f=a=>number(pool[(a-0x790)/4]),rgba=[0x6d84,0x6d88,0x6d8c].map(a=>control[(a-0x6d60)/4]&255).concat(255);
 operations.push({kind:'presentationTransientMaterial',rgba});
 function matrix(q){
  for(const o of q.operations)if(o.kind==='matrixHalfwordWrite'){
   integer(0x4140+matrixCountE950*64+o.byteOffset,'scene matrix buffer offset',0,0xb2f0-2);
   operations.push({kind:'presentationSceneMatrixWrite',bufferIndex,matrixIndex:matrixCountE950,byteOffset:o.byteOffset,width:2,value:o.value});
  }
 }
 function bind(mode){
  integer(0x4140+matrixCountE950*64,'scene matrix binding offset',0,0xb2f0-64);
  operations.push({kind:'presentationSceneMatrixBind',bufferIndex,matrixIndex:matrixCountE950,mode});
  matrixCountE950++;operations.push({kind:'sourceWordWrite',field:'matrixCountE950',value:matrixCountE950});
 }
 for(let slot=0;slot<8;slot++){
  const row=0x7a18+slot*24;if(pool[(row-0x790)/4]===0)continue;
  hud??=words(input.hudWords7788,1442,'hudWords7788');
  const position=[f(row+8),f(row+12),f(row+16)],eye=[0x4c,0x50,0x54].map(o=>number(hud[(0x7c80+cameraIndex*0x10c+o-0x7788)/4])),
   forward=eye.map((v,i)=>finite(F(v-position[i]))),up=forward[0]===0&&forward[2]===0?[0,0,1]:[0,1,0],
   facing=prepareNativeRaceStartTransform({forwardNative:xyz(forward),upNative:xyz(up),positionNative:xyz(position)});
  matrix(facing);if(!facing.complete)incompleteSlots.push(slot);bind('load');
  // EE91C/EDD90: uniform diagonal scale, homogeneous1, descending high/low
  // halfword packing. The shared packer preserves the original store order.
  const scale=f(row+20),floatWords=Array(16).fill(0);for(const i of [0,5,10])floatWords[i]=bits(scale);floatWords[15]=bits(1);
  matrix(prepareNativePackedMatrix({floatWords}));bind('multiply');
  const age=pool[(row+4-0x790)/4],textureFrame=age>=1&&age<=7?age-1:0;
  operations.push({kind:'presentationTransientDraw',slot,textureFrame});drawn++;
 }
 return freeze({matrixCountE950,operations,diagnostic:{cameraIndex,drawn,incompleteSlots,nativeCommandBytes:32+drawn*80,graphicsExecuted:false}});
}
