import {prepareNativeObjectFloatTransform,prepareNativeObjectVectorTransform} from './native-object-transform.js';
const F=Math.fround,view=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`Supply ${n}[${count}]`);return Array.from(v,w=>integer(w,n,0,0xffffffff));}
function float(w){view.setUint32(0,integer(w,'object update word',0,0xffffffff));const v=view.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite object update float');return v;}
function word(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Invalid object update result');view.setFloat32(0,v);return view.getUint32(0);}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Full numeric6E0F4 after free object motion and Southern fixed-sphere Y.
 * Broken ice hides/ages even with motion58=0. Nonzero motion updates matrices;
 * ring spin uses ordinal parity and a single wrap, while an opened Fortress
 * gate rises6 until its pre-update Y reaches128. No clamp is added.
 *
 * Only collision-plane ORIGINS are transformed here. Their directions and
 * metadata, ring contact axes, and separate packed matrices remain unchanged.
 * The caller supplies readonly templates. Source out-of-span plane writes
 * reject atomically; retained storage beyond the declared spans is not modeled.
 */
export function prepareNativeObjectUpdate(input){
 const objects=words(input?.objectWordsC940,'objectWordsC940',3136),planes=words(input.collisionPlaneWordsFd78,'collisionPlaneWordsFd78',512),
  count=integer(input.objectCountFa40,'objectCountFa40',-2147483648,64),diagnostic={hiddenIceRows:[],matrixRows:[],planeOrigins:[]};
 for(let i=0;i<count;i++){
  const b=i*49,get=a=>objects[b+a/4],put=(a,v)=>objects[b+a/4]=v>>>0,f=a=>float(get(a)),sf=(a,v)=>put(a,word(v)),kind=get(0x4c)|0;
  if(kind===10&&get(0xbc)!==0){put(0x54,0);const age=get(0x6c)|0;if(age<255)put(0x6c,age+1);diagnostic.hiddenIceRows.push(i);}
  if(get(0x58)===0)continue;
  if(kind===2&&integer(input.fortressFlag1fc8,'fortressFlag1fc8')!==0&&f(4)<128)sf(4,F(f(4)+6));
  if(kind===8){
   let angle=F(f(0x14)+(get(0xc0)&1?4:-4));
   if(get(0xc0)&1){if(angle>=360)angle=F(angle-360);}else if(angle<0)angle=F(angle+360);
   sf(0x14,angle);
  }
  const transformed=prepareNativeObjectFloatTransform({anglesDegrees:{x:f(0xc),y:f(0x10),z:f(0x14)},positionNative:{x:f(0),y:f(4),z:f(8)},sineTableWords4350:input.sineTableWords4350});
  objects.splice(b+0x74/4,16,...transformed.floatWords);diagnostic.matrixRows.push(i);
  const planeCount=get(0x68)|0;
  for(let j=0;j<planeCount;j++){
   const index=(get(0x64)|0)+j;if(index<0||index>=32)throw new RangeError('Source collision-plane storage overflow');
   const address=get(0x60)+j*64,template=input.planeTemplatesByAddress?.[address];
   if(!Array.isArray(template)||template.length!==16)throw new RangeError(`Supply plane template ${address.toString(16)}[16]`);
   const origin=prepareNativeObjectVectorTransform({floatWords:transformed.floatWords,vectorNative:{x:float(template[0]),y:float(template[1]),z:float(template[2])},directionOnly:false});
   planes.splice(index*16,3,...origin.words);diagnostic.planeOrigins.push({objectIndex:i,planeIndex:index});
  }
 }
 return freeze({objectWordsC940:objects,collisionPlaneWordsFd78:planes,diagnostic});
}
