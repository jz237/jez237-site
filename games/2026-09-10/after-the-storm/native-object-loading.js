// Generic-object portion71E70:72EBC..73278. The enclosing loader selects the
// three row pointers and resets its counts earlier. This reached subsection
// preserves all unrelated object words and the supplied prefix/counts.
const view=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function bits(v){view.setFloat32(0,v);return view.getUint32(0);}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function rows(v,n){if(!Array.isArray(v))throw new TypeError(`Supply selected ${n} without its sentinel`);return v;}
function row(v,n,length){if(!Array.isArray(v)||v.length!==length)throw new RangeError(`Supply ${n}[${length}]`);v.forEach(x=>integer(x,n,-32768,32767));if(v[length-1]===-1)throw new RangeError('Remove the source row sentinel');return v;}

/** Load selected ramps, then optional rings, then generic objects. Ramps write
 * their slot BEFORE class filtering, including a rejected last row. Generic
 * rows filter before any store; raw7 maps to a ring without changing the ring
 * total or its retained ordinal. Actual6-short ring rows set both.
 *
 * Each group stops after accepting its64th overall slot. The source can then
 * overwrite adjacent storage if a later group has another accepted row. This
 * bounded API rejects such an out-of-span write atomically. It does not silently
 * drop later groups. Row selection, earlier count resets, primary/fixed-sphere
 * loading and744EC initialization are separate source stages.
 */
export function prepareNativeObjectLoading(input){
 const raw=input?.objectWordsC940;if(!Array.isArray(raw)||raw.length!==3136)throw new RangeError('Supply objectWordsC940[3136]');
 const objects=raw.map(v=>integer(v,'object word',0,0xffffffff));
 let count=integer(input.objectCountFa40,'objectCountFa40',0,64),rings=integer(input.ringCountB134,'ringCountB134');
 const difficulty=integer(input.difficulty,'difficulty'),mode=integer(input.mode620,'mode620'),players=integer(input.players,'players',1,2),
  override=integer(input.rampFilterOverride8254,'rampFilterOverride8254'),forceRings=integer(input.forceStunt824c,'forceStunt824c');
 const diagnostic={ramps:[],rings:[],generic:[]};
 const slot=()=>{if(count>=64)throw new RangeError('Source generic-object storage overflow');return count*49;};
 const set=(base,offset,value)=>{objects[base+offset/4]=value>>>0;};
 const sf=(base,offset,value)=>set(base,offset,bits(value));
 for(const [index,rawRow]of rows(input.rampRows,'rampRows').entries()){
  const [x,z,variant,motion,heading]=row(rawRow,'ramp row',5),base=slot();
  set(base,0x4c,1);sf(base,0x28,0);sf(base,0x24,x);sf(base,0x2c,z);
  set(base,0x50,variant);set(base,0x58,motion);sf(base,0x48,heading);
  const accepted=override!==0||!(variant===2&&difficulty===1||variant===3&&difficulty===2);
  diagnostic.ramps.push({sourceRow:index,objectIndex:count,accepted});
  if(accepted&&++count>=64)break;
 }
 if(mode===11||forceRings!==0)for(const [index,rawRow]of rows(input.ringRows,'ringRows').entries()){
  const [x,y,z,variant,ordinal,heading]=row(rawRow,'ring row',6),base=slot();
  set(base,0x4c,8);sf(base,0x24,x);sf(base,0x28,y);sf(base,0x2c,z);
  set(base,0x50,variant);set(base,0xc0,ordinal);sf(base,0x48,heading);
  diagnostic.rings.push({sourceRow:index,objectIndex:count});rings=(rings+1)|0;
  if(++count>=64)break;
 }
 for(const [index,rawRow]of rows(input.genericRows,'genericRows').entries()){
  const [x,y,z,type,heading]=row(rawRow,'generic row',5);
  const accepted=type>=1&&type<=21&&!(type===3&&difficulty<2||type===5&&difficulty<1||type===6&&difficulty<2||type>=10&&players===2);
  diagnostic.generic.push({sourceRow:index,objectIndex:count,accepted});if(!accepted)continue;
  const base=slot();set(base,0x4c,type>=10?11:type+1);
  if(type>=10)set(base,0x50,type-10);
  sf(base,0x24,x);sf(base,0x28,y);sf(base,0x2c,z);sf(base,0x48,heading);
  if(++count>=64)break;
 }
 return freeze({objectWordsC940:objects,objectCountFa40:count,ringCountB134:rings,diagnostic});
}
