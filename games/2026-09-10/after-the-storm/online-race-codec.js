// Bounded binary snapshots preserve the existing detached water/pose arrays.
// Data channels carry small fragments, never a growing queue of JSON arrays.
export const ONLINE_PACKET_LIMIT=1024*1024;
export const ONLINE_CHUNK_BYTES=16*1024;
const HEADER_LIMIT=128*1024,MAGIC=0x41545331,CHUNK_HEADER=16;
const types={i16:Int16Array,u16:Uint16Array,u8:Uint8Array,f32:Float32Array};
const names=new Map(Object.entries(types).map(([k,v])=>[v,k]));
const little=new Uint8Array(new Uint16Array([1]).buffer)[0]===1;
function bytesLE(view){
 const bytes=new Uint8Array(view.buffer,view.byteOffset,view.byteLength).slice();
 if(!little&&view.BYTES_PER_ELEMENT>1)for(let i=0;i<bytes.length;i+=view.BYTES_PER_ELEMENT)bytes.subarray(i,i+view.BYTES_PER_ELEMENT).reverse();
 return bytes;
}
export function packOnlineValue(value){
 const buffers=[],parts=[];let total=0;
 const json=JSON.stringify({data:value,buffers},(_key,v)=>{
  if(ArrayBuffer.isView(v)){
   const type=names.get(v.constructor);if(!type||buffers.length>=16)throw new RangeError('Unsupported online array');
   const data=bytesLE(v);total+=data.length;if(total>ONLINE_PACKET_LIMIT)throw new RangeError('Online arrays are too large');
   const index=buffers.length;buffers.push({type,length:v.length,bytes:data.length});parts.push(data);return {$atsBuffer:index};
  }
  return v;
 });
 const header=new TextEncoder().encode(json);if(header.length>HEADER_LIMIT||4+header.length+total>ONLINE_PACKET_LIMIT)throw new RangeError('Online packet is too large');
 const out=new Uint8Array(4+header.length+total);new DataView(out.buffer).setUint32(0,header.length,true);out.set(header,4);
 let offset=4+header.length;for(const part of parts){out.set(part,offset);offset+=part.length;}return out;
}
export function unpackOnlineValue(bytes){
 if(!(bytes instanceof Uint8Array)||bytes.length<4||bytes.length>ONLINE_PACKET_LIMIT)throw new RangeError('Invalid online packet length');
 const length=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(0,true);
 if(length>HEADER_LIMIT||length+4>bytes.length)throw new RangeError('Invalid online header');
 const header=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(4,4+length)));
 if(!header||!Array.isArray(header.buffers)||header.buffers.length>16)throw new TypeError('Invalid online buffers');
 let offset=4+length;
 const buffers=header.buffers.map(info=>{
  const C=types[info?.type];if(!C||!Number.isSafeInteger(info.length)||info.length<0||info.bytes!==info.length*C.BYTES_PER_ELEMENT||offset+info.bytes>bytes.length)throw new RangeError('Invalid online array bounds');
  const data=bytes.slice(offset,offset+info.bytes);offset+=info.bytes;
  if(!little&&C.BYTES_PER_ELEMENT>1)for(let i=0;i<data.length;i+=C.BYTES_PER_ELEMENT)data.subarray(i,i+C.BYTES_PER_ELEMENT).reverse();
  return new C(data.buffer);
 });
 if(offset!==bytes.length)throw new RangeError('Unexpected online payload bytes');
 let visited=0;
 function restore(v,depth=0){
  if(++visited>32000||depth>48)throw new RangeError('Online object is too complex');
  if(!v||typeof v!=='object')return v;
  if(Object.hasOwn(v,'$atsBuffer')){if(Object.keys(v).length!==1||!Number.isInteger(v.$atsBuffer)||v.$atsBuffer<0||v.$atsBuffer>=buffers.length)throw new RangeError('Invalid online array reference');return buffers[v.$atsBuffer];}
  for(const k of Object.keys(v)){if(['__proto__','prototype','constructor'].includes(k))throw new TypeError('Invalid online property');v[k]=restore(v[k],depth+1);}return v;
 }
 return restore(header.data);
}
async function readBounded(stream,limit){
 const reader=stream.getReader(),parts=[];let length=0;
 try{while(true){const q=await reader.read();if(q.done)break;length+=q.value.length;if(length>limit){await reader.cancel();throw new RangeError('Online decompression limit exceeded');}parts.push(q.value);}}
 finally{reader.releaseLock();}
 const out=new Uint8Array(length);let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;
}
export async function encodeOnlinePacket(value){
 const raw=packOnlineValue(value),compressed=await readBounded(new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip')),ONLINE_PACKET_LIMIT);
 const out=new Uint8Array(compressed.length+1);out[0]=1;out.set(compressed,1);return out;
}
export async function decodeOnlinePacket(bytes){
 if(!(bytes instanceof Uint8Array)||bytes.length<2||bytes.length>ONLINE_PACKET_LIMIT||bytes[0]!==1)throw new RangeError('Invalid compressed online packet');
 return unpackOnlineValue(await readBounded(new Blob([bytes.subarray(1)]).stream().pipeThrough(new DecompressionStream('gzip')),ONLINE_PACKET_LIMIT));
}
export function onlinePacketChunks(packet,sequence){
 if(!(packet instanceof Uint8Array)||packet.length<1||packet.length>ONLINE_PACKET_LIMIT||!Number.isInteger(sequence)||sequence<1||sequence>0xffffffff)throw new RangeError('Invalid online fragment source');
 const count=Math.ceil(packet.length/ONLINE_CHUNK_BYTES),parts=[];
 for(let i=0;i<count;i++){const data=packet.subarray(i*ONLINE_CHUNK_BYTES,(i+1)*ONLINE_CHUNK_BYTES),part=new Uint8Array(CHUNK_HEADER+data.length),v=new DataView(part.buffer);
  v.setUint32(0,MAGIC);v.setUint32(4,sequence);v.setUint16(8,i);v.setUint16(10,count);v.setUint32(12,packet.length);part.set(data,CHUNK_HEADER);parts.push(part);}
 return parts;
}
export function createOnlineReassembler({now=()=>performance.now(),timeoutMs=1500}={}){
 const pending=new Map();let completed=0;
 return {push(value){
  if(!(value instanceof ArrayBuffer)&&!(value instanceof Uint8Array))throw new TypeError('Online fragments must be binary');
  const bytes=value instanceof Uint8Array?value:new Uint8Array(value);
  if(bytes.length<CHUNK_HEADER+1||bytes.length>CHUNK_HEADER+ONLINE_CHUNK_BYTES)throw new RangeError('Invalid fragment length');
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.length),sequence=v.getUint32(4),index=v.getUint16(8),count=v.getUint16(10),total=v.getUint32(12);
  if(v.getUint32(0)!==MAGIC||!sequence||!total||total>ONLINE_PACKET_LIMIT||count!==Math.ceil(total/ONLINE_CHUNK_BYTES)||index>=count||bytes.length!==CHUNK_HEADER+Math.min(ONLINE_CHUNK_BYTES,total-index*ONLINE_CHUNK_BYTES))throw new RangeError('Invalid online fragment');
  if(sequence<=completed)return null;
  const time=now();for(const [id,q]of pending)if(time-q.at>timeoutMs)pending.delete(id);
  let q=pending.get(sequence);
  if(!q){
   if(pending.size>=2){const oldest=Math.min(...pending.keys());if(sequence<oldest)return null;pending.delete(oldest);}
   q={at:time,total,count,parts:new Map()};pending.set(sequence,q);
  }
  if(q.total!==total||q.count!==count)throw new RangeError('Conflicting online fragments');
  q.parts.set(index,bytes.slice(CHUNK_HEADER));if(q.parts.size!==count)return null;
  const packet=new Uint8Array(total);for(let i=0;i<count;i++)packet.set(q.parts.get(i),i*ONLINE_CHUNK_BYTES);
  completed=sequence;for(const id of pending.keys())if(id<=sequence)pending.delete(id);
  return {sequence,packet};
 },reset(){pending.clear();completed=0;},get pending(){return pending.size;}};
}
