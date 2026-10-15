import {nativeRaceLookupAngle} from './native-race-direction-warning.js';
import {NATIVE_ANGLE_TABLE_WORDS,nativePhaseSine} from './native-math-tables.js';

// Numeric735EC initialization of the primary/secondary/tertiary route family.
// Raw loaded records are inputs; unwritten words retain their exact bits.
// This is initialization data, never a second mutable live buoy-array owner.
const F=Math.fround,WORDS=65;
const bits=new DataView(new ArrayBuffer(4));
const integer=(v,n,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;};
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function float(v){bits.setUint32(0,v);const n=bits.getFloat32(0);if(!Number.isFinite(n))throw new RangeError('Initialization requires finite source floats');return n;}
function word(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Initialization float must fit binary32');bits.setFloat32(0,v);return bits.getUint32(0);}

export function prepareNativePrimaryInitialization({recordWordsBySourceRow,primaryCount=recordWordsBySourceRow?.length,
 courseIndex,mode620,finishSourceRow,angleTableWords6f08}={}){
 if(!Array.isArray(recordWordsBySourceRow)||recordWordsBySourceRow.length>64)throw new RangeError('Supply at most64 retained primary records');
 const records=recordWordsBySourceRow.map(row=>{
  if(!Array.isArray(row)||row.length!==WORDS)throw new RangeError('Each source primary record requires65 unsigned words');
  return row.map(v=>integer(v,'primary word',0,0xffffffff));
 });
 integer(primaryCount,'primaryCount',0,records.length);integer(courseIndex,'courseIndex',0,11);
 integer(mode620,'mode620',-2147483648,2147483647);integer(finishSourceRow,'finishSourceRow',0,63);
 const written=new Set();
 const read=(i,a)=>records[i][a/4],signed=(i,a)=>read(i,a)|0,f=(i,a)=>float(read(i,a));
 const put=(i,a,v)=>{records[i][a/4]=v>>>0;written.add(i*WORDS+a/4);};
 const sf=(i,a,v)=>put(i,a,word(v));
 const link=(i,a)=>integer(signed(i,a),'active primary link',0,primaryCount-1);
 function following(i,accept){let target=link(i,0xb4),remaining=primaryCount-1;
  while(!accept(signed(target,0xc0))&&remaining>0){target=link(target,0xb4);remaining--;}
  return target;
 }
 for(let i=0;i<primaryCount;i++){
  sf(i,4,0);put(i,0,read(i,0x24));put(i,8,read(i,0x28));put(link(i,0xb4),0xb8,i);
 }
 for(let i=0;i<primaryCount;i++){
  const next=link(i,0xb4),previous=link(i,0xb8);
  put(i,0xac,next);put(i,0xa0,next);put(i,0xb0,previous);put(i,0xa8,previous);
  for(let group=0;group<4;group++){put(i,0xcc+group*4,next);put(i,0xf4+group*4,previous);}
 }
 for(let i=0;i<primaryCount;i++)if(signed(i,0xc0)<2){
  const target=following(i,g=>g<2);put(i,0xa0,target);put(target,0xa8,i);
 }
 for(let i=0;i<primaryCount;i++)if(signed(i,0xc0)!==1){
  const target=following(i,g=>g!==1);put(i,0xac,target);put(target,0xb0,i);
 }
 for(let group=0;group<4;group++){
  const accepted=g=>g===0||g===2||g===group+3;
  for(let i=0;i<primaryCount;i++)if(accepted(signed(i,0xc0))){
   const target=following(i,accepted);put(i,0xcc+group*4,target);put(target,0xf4+group*4,i);
  }
 }
 for(let i=0;i<primaryCount;i++){
  const kind=signed(i,0x98),checkpoint=Number([2,3,5].includes(kind));
  const enabled=Number(signed(i,0xc0)<2&&signed(i,0xbc)===0&&[0,1,2,3].includes(kind));
  put(i,0x9c,checkpoint);put(i,0xc4,enabled);put(i,0xc8,enabled);
  for(let a=0x3c;a<=0x5c;a+=4)put(i,a,0);
  const tangentX=f(i,0x74),tangentZ=F(-f(i,0x70));
  const rightX=kind===0?F(-tangentX):kind===1?tangentX:0;
  const rightZ=kind===0?F(-tangentZ):kind===1?tangentZ:0;
  sf(i,0x78,tangentX);sf(i,0x7c,tangentZ);sf(i,0x80,rightX);sf(i,0x84,rightZ);
  const half=kind===2?800:kind===3?(courseIndex===0&&mode620!==11?370:500):[8,9].includes(kind)?400:0;
  sf(i,0x8c,half);
  const x=f(i,0),z=f(i,8),next=link(i,0xa0),routeNext=link(i,0xac),previous=link(i,0xb0);
  let dx=F(f(next,0)-x),dz=F(f(next,8)-z);
  sf(i,0x88,F(Math.sqrt(F(F(dx*dx)+F(dz*dz)))));
  dx=F(f(routeNext,0)-x);dz=F(f(routeNext,8)-z);
  const length=F(Math.sqrt(F(F(dx*dx)+F(dz*dz))));sf(i,0x90,length);
  if(length>0){dx=F(dx/length);dz=F(dz/length);}
  let turn=F(nativeRaceLookupAngle(F(F(dx*tangentX)+F(dz*tangentZ)),angleTableWords6f08)*2);
  if(kind===0)turn=F(360-turn);sf(i,0x94,turn);
  dx=F(x-f(previous,0));dz=F(z-f(previous,8));
  const before=F(Math.sqrt(F(F(dx*dx)+F(dz*dz))));
  if(before>0){dx=F(dx/before);dz=F(dz/before);}
  sf(i,0xe4,dx);sf(i,0xe8,dz);
  sf(i,0xec,kind===0?F(-dz):kind===1?dz:0);
  sf(i,0xf0,kind===0?dx:kind===1?F(-dx):0);
  const offsetX=kind===4?1:F(rightX*-142),offsetZ=kind===4?1:F(rightZ*-142);
  const ax=F(x+F(tangentX*half)),az=F(z+F(tangentZ*half));
  sf(i,0x2c,ax);sf(i,0x0c,ax);sf(i,0x10,courseIndex===7&&i===finishSourceRow?-110:0);
  sf(i,0x1c,courseIndex===7&&i===finishSourceRow?-160:0);sf(i,0x30,az);sf(i,0x14,az);
  const bx=F(x-F(tangentX*half)),bz=F(z-F(tangentZ*half));
  sf(i,0x60,F(x+offsetX));sf(i,0x68,F(z+offsetZ));sf(i,0x34,bx);sf(i,0x18,bx);
  sf(i,0x64,46);sf(i,0x38,bz);sf(i,0x20,bz);
 }
 return freeze({recordWordsBySourceRow:records,writeFootprint:[...written].sort((a,b)=>a-b)});
}

/** Row-loading numeric fields from71E70 followed by the complete735EC call.
 * Four-short rows and optional retained records are explicit. New WEB records
 * default to zero before the source loading writes; no opaque loaded-art or
 * cold-memory equality is implied. Source sine initialization is reconstructed.
 */
export function createNativePrimaryCourseData({rows,courseIndex,mode620=0,initialRecordWordsBySourceRow}={}){
 if(!Array.isArray(rows)||rows.length<1||rows.length>64)throw new RangeError('Supply1..64 source rows without the sentinel');
 integer(courseIndex,'courseIndex',0,11);integer(mode620,'mode620',-2147483648,2147483647);
 const records=initialRecordWordsBySourceRow??rows.map(()=>Array(WORDS).fill(0));
 if(!Array.isArray(records)||records.length!==rows.length)throw new RangeError('Loaded record count must match the source rows');
 const loaded=records.map(row=>{
  if(!Array.isArray(row)||row.length!==WORDS)throw new RangeError('Supply complete65-word retained records');
  return row.map(v=>integer(v,'loaded word',0,0xffffffff));
 });
 let finishSourceRow=0;
 rows.forEach((row,i)=>{
  if(!Array.isArray(row)||row.length!==4)throw new RangeError('Source rows require four signed shorts');
  row.forEach(v=>integer(v,'source row short',-32768,32767));const [x,z,type,heading]=row;
  integer(type,'source type',0,32);if(heading===-1)throw new RangeError('Remove the source sentinel');
  const kind=[1,5,7,10,13,16,19,22].includes(type)?1:type===2?2:type===3?3:
   [8,11,14,17,20,23].includes(type)?4:type>=24?type-18:0;
  let group=[6,7,8,24,25,29,30,31,32].includes(type)?1:type>=9&&type<=23?Math.floor((type-9)/3)+2:0;
  if(type===26||type===27)group=courseIndex===0?(type===27?1:0):2;
  const phase=Math.trunc(F(F(heading/360)*4096));
  const r=loaded[i],sf=(a,v)=>{r[a/4]=word(v);};
  sf(0x24,x);sf(0x28,z);r[0x98/4]=kind;r[0xb4/4]=(i+1)%rows.length;r[0xa4/4]=0xffffffff;
  r[0xbc/4]=Number(type===4||type===5);r[0xc0/4]=group;sf(0x6c,heading);
  sf(0x70,nativePhaseSine(phase));sf(0x74,nativePhaseSine(phase+1024));
  if(kind===3)finishSourceRow=i;
 });
 const prepared=prepareNativePrimaryInitialization({recordWordsBySourceRow:loaded,courseIndex,mode620,finishSourceRow,
  angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS});
 const nodes=prepared.recordWordsBySourceRow.map((r,sourceRow)=>{
  const f=a=>float(r[a/4]),s=a=>r[a/4]|0,pair=(a,b)=>({x:f(a),z:f(b)});
  return {sourceRow,referenceNativeXZ:pair(0x24,0x28),centerNativeXZ:pair(0,8),forwardXZ:pair(0x70,0x74),rightXZ:pair(0x80,0x84),
   endpointANativeXZ:pair(0x0c,0x14),endpointBNativeXZ:pair(0x18,0x20),halfWidthNative8c:f(0x8c),length88:f(0x88),
   classification98:s(0x98),checkpointFlag9c:s(0x9c),enabledC8:s(0xc8),nextSourceRowA0:s(0xa0),
   // The reset API's historical B4 name denotes the actualB4 word. B8 is
   // the raw inverse link; it must not be substituted for that source read.
   previousSourceRowA8:s(0xa8),previousSourceRowB4:s(0xb4),alternateNextSourceRowA4:s(0xa4),routeGroupC0:s(0xc0)};
 });
 return freeze({nodes,finishSourceRow,recordWordsBySourceRow:prepared.recordWordsBySourceRow,
  provenance:{initialization:'source71E70 row fields then735EC numeric graph/geometry',freshUnwrittenWords:'explicit web zero policy'}});
}
