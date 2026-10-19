import {prepareNativePresentationActorRootMatrix} from './native-presentation-actor-transform.js';
import {prepareNativeAnimationPartMatrix} from './native-widget-transform.js';
import {nativePresentationAnimationTransform} from './native-presentation-animation-resource.js';
const countOffset=0x801d06b8-0x801cf060;
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function vector(v,name,min,max){if(!v||typeof v!=='object')throw new RangeError(`Missing ${name}`);return Object.fromEntries(['x','y','z'].map(k=>[k,integer(v[k],name,min,max)]));}

/** Shared original draw sequence: one root, followed by sibling E4C60 parts.
 * Each part pushes its matrix, draws the selected resource and pops back to
 * the root. All writes, including incomplete matrices, remain ordered.
 */
export function prepareNativePresentationAnimationParts(input,parts,{materialPreset='actor'}={}){
 if(!['actor','actor-alternate'].includes(materialPreset))throw new RangeError('Invalid actor material preset');
 const {actorIndex,bufferIndex,animation,frame}=input;
 const resourceIndex=integer(input.resourceIndex,'animation resource index',0,32767);
 const root=prepareNativePresentationActorRootMatrix(input),rootMatrixIndex=root.diagnostic.matrixIndex;
 const actorWordsF060=[...root.actorWordsF060],operations=[{kind:'presentationActorMaterial',preset:materialPreset},...root.operations];
 for(const [trackOffset,partOffset]of parts){
  const sample=nativePresentationAnimationTransform(animation,trackOffset,frame),key=integer(sample.transformIndex,'animation frame key',-32768,32767),row=sample.transform;
  if(!row)throw new RangeError('Missing selected animation transform row');
  const matrixIndex=integer(actorWordsF060[countOffset/4]|0,'animation matrix allocation',0,191);
  const matrix=prepareNativeAnimationPartMatrix({forwardUnits:vector(row.forwardUnits,'animation forward',-128,127),upUnits:vector(row.upUnits,'animation up',-128,127),positionNative:vector(row.positionNative,'animation position',-32768,32767),scale:1});
  for(const op of matrix.operations)operations.push({kind:'presentationActorMatrixWrite',bufferIndex,matrixIndex,byteOffset:op.wordIndex*4,width:4,value:op.value});
  operations.push({kind:'presentationActorPartBind',bufferIndex,matrixIndex,actorIndex,parentMatrixIndex:rootMatrixIndex});
  actorWordsF060[countOffset/4]=matrixIndex+1;operations.push({kind:'presentationActorWrite',byteOffset:countOffset,width:4,value:matrixIndex+1});
  operations.push({kind:'presentationActorPartDraw',bufferIndex,actorIndex,resourceIndex,partOffset},{kind:'presentationActorMatrixPop',bufferIndex});
 }
 return freeze({actorWordsF060,operations,diagnostic:{rootMatrixIndex,partCount:parts.length,graphicsExecuted:false}});
}
