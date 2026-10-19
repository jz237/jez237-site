import {decodeNativeRaceStartTransform} from './native-race-start-transform.js';
const scratch=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,min,max,name){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid actor presentation ${name}`);return v;}
function arrays(value,length,max,name){if(!Array.isArray(value)||value.length!==2)throw new RangeError(`Supply both actor ${name}`);return value.map(a=>{if(!Array.isArray(a)||a.length!==length)throw new RangeError(`Invalid actor ${name} length`);return Array.from(a,v=>integer(v,0,max,name));});}
const floats=words=>decodeNativeRaceStartTransform({matrixWords:words}).floatWords.map(w=>{scratch.setUint32(0,w);return scratch.getFloat32(0);});
function multiply(a,b){return Array.from({length:16},(_,i)=>{const column=i>>>2,row=i&3;let sum=0;for(let k=0;k<4;k++)sum+=a[k*4+row]*b[column*4+k];return sum;});}

/** Consume the retained actor graphics effects into ordered part draws.
 * Both original matrix/light buffers are required: partial matrix writes and
 * light padding preserve prior contents. Native model coordinates are scaled
 * into world coordinates once, after root/part/retained matrix composition.
 * Geometry remains a separate high-resolution resource selected by each draw.
 */
export function prepareNativeActorPresentation(value,operations,{worldScale}={}){
 const matrixBuffers=arrays(value?.matrixBuffers,192*16,0xffffffff,'matrix buffers'),lightBuffers=arrays(value?.lightBuffers,96,255,'light buffers');
 if(!Array.isArray(operations))throw new TypeError('Supply ordered actor renderer effects');
 if(!Number.isFinite(worldScale)||worldScale<=0)throw new RangeError('Supply positive actor world scale');
 const draws=[],stack=[];let current=null,material=null,surface=null,lightCount=null,bindings=[],fogColor=null,fogFactors=null;
 const buffer=i=>integer(i,0,1,'buffer'),actor=i=>integer(i,0,29,'actor index'),matrix=i=>integer(i,0,191,'matrix index');
 function packed(bufferIndex,matrixIndex){return floats(matrixBuffers[buffer(bufferIndex)].slice(matrix(matrixIndex)*16,matrixIndex*16+16));}
 function lighting(){
  if(lightCount===null||bindings.length!==lightCount+1||bindings.some(v=>!v))throw new RangeError('Actor draw requires complete light bindings');
  return {ambient:bindings[lightCount].color,directional:bindings.slice(0,lightCount).map(v=>({color:v.color,direction:v.direction}))};
 }
 for(const op of operations){
  switch(op.kind){
   case 'presentationActorMatrixWrite':{
    const words=matrixBuffers[buffer(op.bufferIndex)],index=matrix(op.matrixIndex)*16;
    if(op.width!==2&&op.width!==4)throw new RangeError('Invalid actor matrix write width');
    const at=integer(op.byteOffset,0,64-op.width,'matrix offset');if(at%op.width)throw new RangeError('Unaligned actor matrix write');
    const value=integer(op.value,0,op.width===4?0xffffffff:65535,'matrix word'),word=index+(at>>>2);
    if(op.width===4)words[word]=value;else{const shift=(at&2)?0:16;words[word]=((words[word]&~(65535<<shift))|(value<<shift))>>>0;}break;
   }
   case 'presentationActorMatrixBind':
    if(stack.length)throw new RangeError('Actor root replaced with an unfinished part stack');
    current={bufferIndex:buffer(op.bufferIndex),actorIndex:actor(op.actorIndex),rootMatrixIndex:matrix(op.matrixIndex),matrix:packed(op.bufferIndex,op.matrixIndex)};break;
   case 'presentationActorPartBind':
    if(!current||current.bufferIndex!==buffer(op.bufferIndex)||current.actorIndex!==actor(op.actorIndex)||current.rootMatrixIndex!==matrix(op.parentMatrixIndex))throw new RangeError('Actor part has no matching root');
    stack.push(current);current={...current,matrix:multiply(current.matrix,packed(op.bufferIndex,op.matrixIndex))};break;
   case 'presentationActorMatrixPop':
    if(!current||current.bufferIndex!==buffer(op.bufferIndex)||!stack.length)throw new RangeError('Actor matrix stack underflow');current=stack.pop();break;
   case 'presentationActorRetainedMatrixMultiply':
    if(!current||current.bufferIndex!==buffer(op.bufferIndex)||current.actorIndex!==actor(op.actorIndex))throw new RangeError('Retained actor matrix has no matching bind');
    current={...current,matrix:multiply(current.matrix,floats(op.matrixWords))};break;
   case 'presentationActorMaterial':
    if(!['actor','actor-alternate'].includes(op.preset))throw new RangeError('Invalid actor material preset');material=op.preset;surface=null;break;
   case 'presentationActorSurface':
    if(!['actor12-base','actor12-overlay','actor13-final'].includes(op.preset))throw new RangeError('Invalid actor surface preset');surface=op.preset;break;
   case 'presentationLightByteWrite':{
    const bytes=lightBuffers[buffer(op.bufferIndex)],at=integer(op.lightIndex,0,1,'light index')*48+integer(op.viewIndex,0,1,'light view')*24+integer(op.byteOffset,0,23,'light byte offset');
    if(op.width!==1)throw new RangeError('Invalid actor light width');bytes[at]=integer(op.value,0,255,'light byte');break;
   }
   case 'presentationLightCount':lightCount=integer(op.count,1,2,'light count');bindings=Array(lightCount+1).fill(null);break;
   case 'presentationLightBind':{
    if(lightCount===null)throw new RangeError('Actor light bind requires count');
    const slot=integer(op.slot,0,lightCount,'light slot'),bytes=lightBuffers[buffer(op.bufferIndex)],at=integer(op.lightIndex,0,1,'light index')*48+integer(op.viewIndex,0,1,'light view')*24;
    if(op.byteOffset!==(slot===lightCount?0:8))throw new RangeError('Actor light binding has incorrect ambient/diffuse offset');
    const color=bytes.slice(at+op.byteOffset,at+op.byteOffset+3).map(v=>v/255),direction=slot===lightCount?null:bytes.slice(at+16,at+19).map(v=>(v<<24>>24)/127);
    bindings[slot]={color,direction};break;
   }
   case 'presentationFogColor':
    if(!Array.isArray(op.rgba)||op.rgba.length!==4)throw new RangeError('Supply actor fog color');fogColor=op.rgba.map(v=>integer(v,0,255,'fog color'));break;
   case 'presentationFogFactors':{
    const packedWord=integer(op.packedWord,0,0xffffffff,'fog factors');fogFactors={packedWord,multiplier:packedWord>>16,offset:packedWord<<16>>16};break;
   }
   case 'presentationGraphicsSync':break;
   case 'presentationActorPartDraw':{
    if(!current||current.bufferIndex!==buffer(op.bufferIndex)||current.actorIndex!==actor(op.actorIndex))throw new RangeError('Actor draw requires its bound matrix');
    if(!material||!fogColor||!fogFactors)throw new RangeError('Actor draw requires material and fog setup');
    const resourceIndex=integer(op.resourceIndex,0,32767,'draw resource'),partOffset=integer(op.partOffset,8,40,'draw part');if(partOffset%4)throw new RangeError('Unaligned actor part');
    const matrixWorld=current.matrix.map((v,i)=>(i&3)===3?v:v*worldScale);if(matrixWorld.some(v=>!Number.isFinite(v)))throw new RangeError('Nonfinite actor world matrix');
    draws.push({bufferIndex:current.bufferIndex,actorIndex:current.actorIndex,resourceIndex,partOffset,material,surface,matrixWorld,lighting:lighting(),fog:{color:[...fogColor],...fogFactors}});break;
   }
   default:throw new RangeError(`Unsupported actor renderer effect ${op.kind}`);
  }
 }
 if(stack.length)throw new RangeError('Unfinished actor matrix stack');
 return freeze({matrixBuffers,lightBuffers,draws,diagnostic:{parts:draws.length,graphicsExecuted:false}});
}
