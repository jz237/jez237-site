import {prepareNativeObjectTransform,prepareNativeObjectVectorTransform} from './native-object-transform.js';
const F=Math.fround,d=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function raw(v,n,length){if(!Array.isArray(v)||v.length!==length)throw new RangeError(`Supply ${n}[${length}]`);return v.map(x=>integer(x,n,0,0xffffffff));}
function float(v){d.setUint32(0,v);const f=d.getFloat32(0);if(!Number.isFinite(f))throw new RangeError('Nonfinite object initialization float');return f;}
function bits(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Invalid object initialization result');d.setFloat32(0,v);return d.getUint32(0);}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Complete numeric744EC over the retained generic object array, including
 * collision-template transforms and the selected course's fixed-plane tail.
 * 71E70 row loading and75274/6AACC scheduling remain caller-owned. No live
 * renderer meshes, original display lists or a second object owner are made.
 *
 * Every template is a source16-word plane keyed by its numeric source address.
 * The caller supplies those selected course resources; only reached templates
 * are read. Packed matrices and collision planes preserve unwritten words.
 * The source has no final-tail overflow protection: unsupported writes outside
 * its32-plane storage reject the whole preparation instead of corrupting state.
 */
export function prepareNativeObjectInitialization(input){
 const objects=raw(input?.objectWordsC940,'objectWordsC940',3136),planes=raw(input.collisionPlaneWordsFd78,'collisionPlaneWordsFd78',512),
  matrices=raw(input.packedObjectMatrixWords0cd0,'packedObjectMatrixWords0cd0',1024);
 const count=integer(input.objectCountFa40,'objectCountFa40',-2147483648,64),course=integer(input.courseIndex,'courseIndex',0,11),players=integer(input.players,'players',1,2);
 const mode=integer(input.mode620,'mode620'),difficulty=integer(input.difficulty,'difficulty'),reverse=integer(input.reverseDab68,'reverseDab68',0,65535),alternate=integer(input.alternate8250,'alternate8250');
 const sine=input.sineTableWords4350;if(!Array.isArray(sine)||sine.length!==4096)throw new RangeError('Supply sineTableWords4350[4096]');
 let planeCount=0;
 function template(address){return raw(input.planeTemplatesByAddress?.[address],`plane template ${address.toString(16)}`,16);}
 function putPlane(values){if(planeCount>=32)throw new RangeError('Source collision-plane storage overflow');planes.splice(planeCount*16,16,...values);planeCount++;}
 function axis(heading){const phase=F(F(heading/360)*4096);if(!Number.isFinite(phase)||phase< -2147483648||phase>=2147483648)throw new RangeError('Unsupported object heading conversion');return Math.trunc(phase)&4095;}
 for(let slot=0;slot<count;slot++){
  const base=slot*49,get=a=>objects[base+a/4],set=(a,v)=>{objects[base+a/4]=v>>>0;},sf=(a,v)=>set(a,bits(v)),f=a=>float(get(a)),kind=get(0x4c)|0,heading=f(0x48);
  set(0,get(0x24));set(4,get(0x28));set(8,get(0x2c));sf(0x10,F(heading+180));
  for(const a of [0x20,0x1c,0x18,0x0c,0x14])set(a,0);
  const phase=axis(heading),right=axis(F(heading+90));
  for(const [a,i]of [[0x30,phase],[0x34,(phase+1024)&4095],[0x38,right],[0x3c,(right+1024)&4095]]){
   const word=integer(sine[i],'sine word',0,0xffffffff);float(word);set(a,word);
  }
  for(const a of [0x40,0x44,0xbc,0x6c,0x70,0xb4,0xb8,0x64,0x68,0x60])set(a,0);
  set(0x54,[3,4,11].includes(kind)?2:kind===8?3:1);
  if(kind!==1)set(0x58,kind===2?3:[5,6,7,9].includes(kind)?4:kind===8?5:0);
  set(0x5c,[1,2,6,7].includes(kind)?1:[5,9].includes(kind)?2:0);
  let build=true;
  const geometry=(address,n,first,second)=>{set(0x60,address);set(0x68,n);set(0xb4,first);set(0xb8,second);set(0x64,planeCount);};
  if(kind===1){
   set(0x6c,20);set(0x70,0);sf(0x18,1);sf(0x1c,-4);set(0x64,planeCount);
   if(course===0)geometry(0x800d6e70,6,0x0d02bde8,0x0d02bdf8);
   else if(course===4&&mode===11)geometry(0x800d6ff0,5,0x0d00e858,0);
   else if(course===5){
    if(difficulty===0||reverse!==0||alternate!==0)geometry(0x800d73b0,5,0x0e010d20,0);
    else if(difficulty===1)geometry(0x800d7270,5,0x0e010c00,0);
    else geometry(0x800d7130,5,0x0e010ae0,0);
   }else if(course===6){
    if(get(0x50)===0||get(0x50)===1&&difficulty===2)geometry(0x800d74f0,1,0x0e00f348,0x0e00f2c0);
    else geometry(0x800d7530,1,0x0e00f460,0x0e00f3d8);
   }else if(course===7)geometry(0x800d7570,3,0x0e01b7d0,0x0e01b660);
   else{geometry(0x800d6cf0,6,0x0101cb08,0x0101cb18);sf(4,-24);}
  }else if(kind===2)geometry(0x800d7630,1,0x0e00d678,0x0e00d5d8);
  else if(kind===5){set(0xb4,0x0e00d720);sf(0x40,50);}
  else if(kind===6)geometry(0x800d7670,1,0x0e00d7c8,0);
  else if(kind===7)geometry(0x800d76b0,1,0x0e00d8a8,0);
  else if(kind===9){set(0xb4,0x0e0109c0);sf(0x40,25);}
  else if(kind===10){set(0xb4,0x0e009808);sf(0x40,50);}
  else if(kind===3||kind===4)set(0xb8,0x0e0098b0);
  else if(kind===8)set(0xb4,0x0101ea48);
  else if(kind===11){
   const selected=input.kind11DisplayListWords,index=get(0x50)|0;
   if(!Array.isArray(selected)||index<0||index>=selected.length)throw new RangeError('Supply selected kind11 display-list table');
   set(0xb8,integer(selected[index],'display-list identity',0,0xffffffff));
  }else build=false;
  if(!build)continue;
  const transformed=prepareNativeObjectTransform({anglesDegrees:{x:f(0xc),y:f(0x10),z:f(0x14)},positionNative:{x:f(0),y:f(4),z:f(8)},sineTableWords4350:sine});
  objects.splice(base+0x74/4,16,...transformed.floatWords);matrices.splice(slot*16,16,...transformed.matrixWords);
  const n=get(0x68)|0;
  for(let j=0;j<n;j++){
   if(n+planeCount>32)break;
   const source=template(get(0x60)+j*64),result=source.slice();
   for(let v=0;v<4;v++){
    const vectorNative=Object.fromEntries(['x','y','z'].map((k,i)=>[k,float(source[v*3+i])]));
    const out=prepareNativeObjectVectorTransform({floatWords:transformed.floatWords,vectorNative,directionOnly:v!==0});
    result.splice(v*3,3,...out.words);
   }
   putPlane(result);
  }
 }
 let start=0,n=0;
 if(course===2&&players===1){start=0x800d77f0;n=2;}
 else if(course===5){if(mode===11||difficulty===0){start=0x800d7770;n=2;}else if(difficulty===2){start=0x800d76f0;n=2;}}
 else if(course===6){start=0x800d7870;n=4;}
 else if(course===7){start=0x800d7970;n=17;}
 for(let i=0;i<n;i++)putPlane(template(start+i*64));
 return freeze({objectWordsC940:objects,collisionPlaneWordsFd78:planes,packedObjectMatrixWords0cd0:matrices,collisionPlaneCount0578:planeCount});
}
