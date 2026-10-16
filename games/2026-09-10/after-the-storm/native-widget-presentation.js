import {prepareNativeScaledBasisMatrix,prepareNativeEulerMatrix} from './native-widget-transform.js';
import {prepareNativeRaceStartTransform,decodeNativeRaceStartTransform} from './native-race-start-transform.js';
import {nativeSineTableWords} from './native-math-tables.js';
const view=new DataView(new ArrayBuffer(4));
function float(v){if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid widget matrix argument');view.setUint32(0,v);const n=view.getFloat32(0);if(!Number.isFinite(n))throw new RangeError('Nonfinite widget matrix argument');return n;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const vector=(a,i)=>({x:float(a[i]),y:float(a[i+1]),z:float(a[i+2])});

/** Resolve actual widget matrix recipes into detached numeric presentation
 * values. Logical targets identify the modern renderer's five matrix slots.
 * Native RAM addresses are deliberately not accepted in this adapter. Matrix
 * preparation and decoding finish before anything is returned for commit.
 * Audio and other effects remain ordered dependencies for their consumers. */
export function prepareNativeWidgetPresentation(effects){
 if(!Array.isArray(effects))throw new TypeError('Expected ordered widget effects');
 const operations=[];
 for(const effect of effects){
  if(effect.kind!=='externalCall'||!['80048a88','80048854','80049a94'].includes(effect.consumer)){operations.push(structuredClone(effect));continue;}
  const a=effect.arguments,n=effect.consumer==='80049a94'?8:11;
  if(!Array.isArray(a)||a.length!==n)throw new RangeError('Invalid widget matrix argument count');
  const target=a[0];
  if(target?.kind!=='widgetMatrixTarget'||!Number.isInteger(target.index)||target.index<0||target.index>=5)throw new RangeError('Expected a logical widget matrix slot');
  let matrix;
  if(effect.consumer==='80048a88')matrix=prepareNativeScaledBasisMatrix({forwardNative:vector(a,1),upNative:vector(a,4),positionNative:vector(a,7),scale:float(a[10])});
  else{
   if(a[1]!==null)throw new RangeError('Widget scratch matrix must be caller-local');
   if(effect.consumer==='80048854')matrix=prepareNativeRaceStartTransform({forwardNative:vector(a,2),upNative:vector(a,5),positionNative:vector(a,8)});
   else matrix=prepareNativeEulerMatrix({anglesRadians:vector(a,2),positionNative:vector(a,5),
    sineTableWords4350:nativeSineTableWords(),anglePeriodWords9254:[0x40c90fdc,0x40c90fdc,0x40c90fdc]});
  }
  // Every actual widget call has nondegenerate fixed axes or Euler input.
  // Reject incomplete output rather than invent unvisited destination words.
  if(!matrix.complete)throw new RangeError('Incomplete widget matrix');
  const decoded=decodeNativeRaceStartTransform({matrixWords:matrix.matrixWords});
  operations.push({kind:'widgetMatrix',index:target.index,matrixWords:matrix.matrixWords,floatWords:decoded.floatWords});
 }
 return freeze({operations});
}

/** Read-only, high-resolution drawing data from the completed canonical HUD
 * and that frame's resolved matrices. Source5554 skips slots whose draw flag
 * is0, including widgets allocated during this very update. Settled banners
 * and the bouncing retirement panel use their integer rectangle positions.
 * The original art/texture/display-list commands are not copied. */
export function nativeWidgetDrawView(hudWords7788,presentation){
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442)throw new RangeError('Expected retained HUD1442');
 const words=Array.from(hudWords7788,v=>{if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid HUD word');return v;});
 const half=a=>(words[(a-0x7788)>>>2]>>>(a%4?0:16))&65535,word=a=>words[(a-0x7788)/4]|0;
 const matrices=new Map();
 for(const op of presentation.operations)if(op.kind==='widgetMatrix')matrices.set(op.index,op);
 const widgets=[];
 for(let slot=0;slot<5;slot++){
  const b=0x8930+slot*44,kind=half(b),stage=half(b+2);
  if(!half(b+6)||kind<1||kind>4)continue;
  const transformed=kind===3||(kind===1||kind===2)&&stage!==1,index=half(b+4);
  const matrix=transformed?matrices.get(index):null;
  if(transformed&&!matrix)throw new RangeError('Missing completed widget matrix');
  widgets.push({slot,kind,stage,selector:word(b+40),x:word(b+8),y:word(b+12),
   matrix:matrix?matrix.floatWords.map(float):null,colourPhase:word(b+32)});
 }
 return freeze(widgets);
}
