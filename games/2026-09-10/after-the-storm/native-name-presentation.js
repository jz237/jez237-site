import {prepareNativeEulerMatrix,prepareNativeScaledBasisMatrix,prepareNativeAffineMatrixProduct,prepareNativePackedMatrix} from './native-widget-transform.js';
import {decodeNativeRaceStartTransform} from './native-race-start-transform.js';
const F=Math.fround,U32=0xffffffff,bits=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function float(v){bits.setUint32(0,integer(v,'float word',0,U32));const n=bits.getFloat32(0);if(!Number.isFinite(n))throw new RangeError('Expected finite name-presentation float');return n;}
function word(v){if(!Number.isFinite(F(v)))throw new RangeError('Name-presentation float overflow');bits.setFloat32(0,v);return bits.getUint32(0);}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`Expected ${n}[${count}]`);return Array.from(v,w=>integer(w,n,0,U32));}

/** Complete183C..1BA8 name-wheel projection and crossing dispatcher. Supply
 * the preceding numeric phase's transient motionActive/confirmationPose.
 * Matrices are detached presentation effects; HUD owns previous positions.
 * Numeric49A94/49EB8/48A88/47E78/47EE0 execute here. Water disturbance calls
 * remain ordered effects, with actual float bits and signed-int arguments.
 * This does not draw original glyphs or execute the disturbance callees.
 */
export function prepareNativeNameEntryPresentation(value,phaseFrame,sourceViews={}){
 const scratch=words(value?.nameEntryWords61c4,'nameEntryWords61c4',14),hud=words(value?.hudWords7788,'hudWords7788',1442);
 const read=a=>scratch[(a-0x61c4)/4],previous=a=>hud[(a-0x7788)/4],constant=k=>float(sourceViews[k]);
 const selected=integer(read(0x61c4)|0,'wheel selection',0,15),phase=read(0x61c8)|0,latch=integer(value.scene?.initLatch63c,'initLatch63c');
 if(typeof phaseFrame?.motionActive!=='boolean')throw new TypeError('Expected preceding name-animation motion flag');
 const operations=[],matrices=[];
 const euler=(anglesRadians,positionNative)=>prepareNativeEulerMatrix({anglesRadians,positionNative,sineTableWords4350:sourceViews.sineTableWords4350,anglePeriodWords9254:sourceViews.anglePeriodWords9254});
 const put=(a,v)=>operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v});
 const effect=(consumer,args)=>operations.push({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
 function amplitude(negative){const n=constant('crossingAmplitudeWord61fc'),v=negative?F(0-n):n;return integer(Math.trunc(v),'crossing integer');}
 for(let slot=0;slot<16;slot++){
  const angle=F(float(read(0x61d0))-F(F(slot*constant('wheelPeriodWord62e4'))/16));
  const first=euler({x:0,y:float(0xbe4ccccd),z:angle},{x:0,y:-540,z:0});
  const confirming=phase===4&&slot===selected;
  const second=euler({x:confirming?float(phaseFrame.confirmationPose?.angleWord):0,y:float(0x3fe2a975),
   z:constant(confirming?'confirmTiltWord62e8':'wheelTiltWord62ec')},
   {x:0,y:confirming?float(phaseFrame.confirmationPose?.radiusWord):float(read(0x61cc)),z:0});
  const product=prepareNativeAffineMatrixProduct({leftFloatWords:first.floatWords,rightFloatWords:second.floatWords});
  const scale=prepareNativeScaledBasisMatrix({forwardNative:{x:0,y:0,z:1},upNative:{x:0,y:1,z:0},positionNative:{x:0,y:0,z:0},scale:constant('wheelScaleWord62f0')});
  const decoded=decodeNativeRaceStartTransform(scale),final=prepareNativeAffineMatrixProduct({leftFloatWords:product.floatWords,rightFloatWords:decoded.floatWords}),packed=prepareNativePackedMatrix(final);
  const matrix={kind:'nameEntryMatrix',slot,matrixWords:packed.matrixWords};operations.push(matrix);matrices.push(matrix);
  const [x,y,z]=product.floatWords.slice(12,15),yNow=float(y);
  if(latch===0){
   const yBefore=float(previous(0x8868+slot*4)),crossing=yBefore<0&&yNow>=0?1:yBefore>=0&&yNow<0?2:0;
   if(!phaseFrame.motionActive){if(crossing)effect('8004efb4',[x,z,amplitude(crossing===2)]);}
   else if(slot===selected){if(yNow<0)effect('8004efb4',[x,z,-50]);}
   else if(crossing)effect('8004f1ec',[previous(0x8828+slot*4),previous(0x88a8+slot*4),amplitude(crossing===2),Number(float(x)>=0)]);
  }
  put(0x8828+slot*4,x);put(0x8868+slot*4,y);put(0x88a8+slot*4,z);
 }
 return freeze({operations,matrices,diagnostic:{consumer:'801e183c..801e1ba8',matrixProjectionPending:false,crossingEffectsPending:operations.some(o=>o.kind==='externalCall'),drawingPerformed:false}});
}
