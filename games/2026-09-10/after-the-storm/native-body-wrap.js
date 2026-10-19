import {prepareNativeBodyBoundaryDrift} from './native-body-boundary-drift.js';
import {prepareNativeBodyTranslation} from './native-body-translation.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,n,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid '+n);return v;}
function words(a,n,name){if(!Array.isArray(a)||a.length!==n)throw new RangeError('Supply '+name);return a.map(v=>integer(v,name,0,0xffffffff));}
function number(w){b.setUint32(0,w);const v=b.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite wrap field');return v;}
function bits(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite wrap field');b.setFloat32(0,v);return b.getUint32(0);}

/** Camera portion of65C18. Only the selected human eye X/Z moves. Follow
 * lag, target, orientation and the other camera retain their original words. */
export function prepareNativeBodyWrapCamera(input){
 const hud=words(input?.hudWords7788,1442,'hudWords7788'),slot=integer(input.racerIndex,'racerIndex',0,3),
  primary=integer(input.primaryHumanIndex,'primaryHumanIndex',0,3),players=integer(input.players,'players',1,2),operations=[];
 let camera=null;
 if(slot===primary)camera=integer(input.displayCamera3930,'first wrap camera',0,1);
 else if(players===2&&slot===integer(input.secondaryHumanIndex,'secondaryHumanIndex',0,3))camera=integer(input.displayCamera3934,'second wrap camera',0,1);
 if(camera!==null)for(const [offset,axis]of [[0x4c,'x'],[0x54,'z']]){
  const delta=number(bits(input.driftNative?.[axis])),wordIndex=(0x7c80+camera*0x10c+offset-0x7788)/4,
   value=bits(F(number(hud[wordIndex])+delta));
  hud[wordIndex]=value;operations.push({kind:'hudWrite',byteOffset:wordIndex*4,width:4,value});
 }
 return freeze({hudWords7788:hud,operations,cameraIndex:camera});
}

/** Complete65C18..65DDC boundary stage, including whole618F4.
 * Prepare both actual owners together before the remaining displacement,
 * contact and actor work. No source frame is advanced and no GPU is touched.
 * HUD camera selectors are read only for the human branch that uses them.
 */
export function prepareNativeBodyWrap(input){
 const body=words(input?.bodyWords,1478,'physical bodyWords'),hud=words(input.hudWords7788,1442,'hudWords7788'),
  slot=integer(input.racerIndex,'racerIndex',0,3),primary=integer(input.primaryHumanIndex,'primaryHumanIndex',0,3),players=integer(input.players,'players',1,2),operations=[];
 const drift=prepareNativeBodyBoundaryDrift({boundsWords24ac:input.boundsWords24ac,positionNativeXZ:{x:number(body[0x44/4]),z:number(body[0x4c/4])}});
 const addBody=w=>{body[w.byteOffset/4]=w.value;operations.push({kind:'bodyWordWrite',racerIndex:slot,...w});};
 drift.bodyWordWrites.forEach(addBody);
 const camera=prepareNativeBodyWrapCamera({...input,hudWords7788:hud,driftNative:drift.driftNative});
 for(const op of camera.operations){hud[op.byteOffset/4]=op.value;operations.push(op);}
 const moved=prepareNativeBodyTranslation({bodyWords:body,deltaNative:{x:drift.driftNative.x,y:0,z:drift.driftNative.z}});
 moved.bodyWordWrites.forEach(addBody);
 return freeze({bodyWords:body,hudWords7788:hud,operations,driftNative:drift.driftNative,diagnostic:{cameraIndex:camera.cameraIndex,remainingPhysicalWorkExecuted:false}});
}
