import {deflateSync,Inflate} from 'fflate/browser';

/** Opt-in, stateless transport. Each packet can be decoded after reconnect without a baseline.
 * The dictionary and tags are frozen for qiw1; changing their meaning requires a new version. */
export const SNAPSHOT_WIRE='qiw1' as const;
const WORDS=('type snapshot tick elapsed countdown mode phase cars damage ranking members ack props capacity cupSupport cup '+
 'id kind p q v av x y z w health inflicted damageLeft damageRight steering speed rpm gear wheels suspension rotation contact '+
 'input throttle steer brake handbrake passed nextCheckpoint lap finished finishTime penalty repair surface slip components dents '+
 'wheelDamage wheelShift car point direction localPoint localDirection name connected host cupId version rounds round completed '+
 'entries participants votes bot points wins starts lastPoints lastPlace welcome protocol room token pong sent error message '+
 'coupe sedan hatch asphalt gravel race derby playground lobby playing result').split(' ');
const dictionary=new Map(WORDS.map((word,index)=>[word,index]));
const LIMIT=4*1024*1024,HEADER=14,MAX_ITEMS=500_000,MAX_DEPTH=32;
// Tags: null, false, true, int32, float32, float64, UTF-16 string, array, object, dictionary.
function checksum(bytes:Uint8Array){let a=1,b=0;for(let i=0;i<bytes.length;i++){a=(a+bytes[i])%65521;b=(b+a)%65521;}return ((b<<16)|a)>>>0;}
function invalid():never{throw new Error('Invalid qiw1 packet');}

export function encodeSnapshotWire(value:unknown):ArrayBuffer{
 let bytes=new Uint8Array(16384),view=new DataView(bytes.buffer),at=0,items=0;
 const reserve=(n:number)=>{if(at+n>LIMIT)invalid();if(at+n>bytes.length){const grown=new Uint8Array(Math.min(LIMIT,Math.max(at+n,bytes.length*2)));grown.set(bytes);bytes=grown;view=new DataView(bytes.buffer);}};
 const u8=(n:number)=>{reserve(1);bytes[at++]=n;};
 const uint=(n:number)=>{do{const byte=n&127;n>>>=7;u8(byte|(n?128:0));}while(n);};
 const write=(v:unknown,depth:number)=>{
  if(++items>MAX_ITEMS||depth>MAX_DEPTH)invalid();
  if(v===null){u8(0);return;}if(typeof v==='boolean'){u8(v?2:1);return;}
  if(typeof v==='number'){
   if(!Number.isFinite(v))invalid();
   if(!Object.is(v,-0)&&(v|0)===v){u8(3);uint(((v<<1)^(v>>31))>>>0);}
   else if(Math.fround(v)===v){u8(4);reserve(4);view.setFloat32(at,v,true);at+=4;}
   else{u8(5);reserve(8);view.setFloat64(at,v,true);at+=8;}return;
  }
  if(typeof v==='string'){
   const index=dictionary.get(v);if(index!==undefined){u8(9);uint(index);return;}
   // Code units preserve even lone surrogates exactly, as JSON does.
   u8(6);uint(v.length);reserve(v.length*2);for(let i=0;i<v.length;i++){view.setUint16(at,v.charCodeAt(i),true);at+=2;}return;
  }
  if(Array.isArray(v)){u8(7);uint(v.length);for(let i=0;i<v.length;i++)write(v[i]===undefined?null:v[i],depth+1);return;}
  if(v&&typeof v==='object'&&(Object.getPrototypeOf(v)===Object.prototype||Object.getPrototypeOf(v)===null)){
   const entries=Object.entries(v).filter(([,entry])=>entry!==undefined);u8(8);uint(entries.length);
   for(const [key,entry]of entries){write(key,depth+1);write(entry,depth+1);}return;
  }
  invalid();
 };
 write(value,0);const plain=bytes.subarray(0,at),compressed=deflateSync(plain,{level:1});
 const body=compressed.length<plain.length?compressed:plain,packet=new Uint8Array(HEADER+body.length),header=new DataView(packet.buffer);
 packet.set([81,73,87,49,1,body===compressed?1:0]);header.setUint32(6,plain.length,true);header.setUint32(10,checksum(plain),true);packet.set(body,HEADER);return packet.buffer;
}

export function decodeSnapshotWire(packet:ArrayBuffer):unknown{
 if(packet.byteLength<HEADER||packet.byteLength>LIMIT+HEADER)invalid();
 const bytes=new Uint8Array(packet),header=new DataView(packet);
 if(bytes[0]!==81||bytes[1]!==73||bytes[2]!==87||bytes[3]!==49||bytes[4]!==1||bytes[5]>1)invalid();
 const length=header.getUint32(6,true);if(!length||length>LIMIT)invalid();
 const body=bytes.subarray(HEADER);let plain=body;
 if(bytes[5]){
  // Feed small synchronous chunks so a forged expansion cannot allocate or process
  // an entire compression bomb before the declared output limit is checked.
  plain=new Uint8Array(length);let written=0;
  const inflater=new Inflate(chunk=>{if(chunk.length>length-written)invalid();plain.set(chunk,written);written+=chunk.length;});
  if(!body.length)invalid();
  for(let offset=0;offset<body.length;offset+=1024)inflater.push(body.subarray(offset,offset+1024),offset+1024>=body.length);
  if(written!==length)invalid();
 }
 if(plain.length!==length||checksum(plain)!==header.getUint32(10,true))invalid();
 const view=new DataView(plain.buffer,plain.byteOffset,plain.byteLength);let at=0,items=0;
 const need=(n:number)=>{if(n>plain.length-at)invalid();};
 const u8=()=>{need(1);return plain[at++];};
 const uint=()=>{let n=0;for(let shift=0;shift<=28;shift+=7){const byte=u8();if(shift===28&&byte>15)invalid();n|=(byte&127)<<shift;if(!(byte&128))return n>>>0;}return invalid();};
 const read=(depth:number):unknown=>{
  if(++items>MAX_ITEMS||depth>MAX_DEPTH)invalid();const tag=u8();
  if(tag===0)return null;if(tag===1)return false;if(tag===2)return true;
  if(tag===3){const n=uint();return(n>>>1)^-(n&1);}
  if(tag===4||tag===5){const size=tag===4?4:8;need(size);const n=size===4?view.getFloat32(at,true):view.getFloat64(at,true);at+=size;if(!Number.isFinite(n))invalid();return n;}
  if(tag===9){const index=uint();if(index>=WORDS.length)invalid();return WORDS[index];}
  if(tag===6){const n=uint();need(n*2);let s='';for(let i=0;i<n;i++){s+=String.fromCharCode(view.getUint16(at,true));at+=2;}return s;}
  if(tag===7||tag===8){const n=uint();if(n>(MAX_ITEMS-items)/(tag===8?2:1))invalid();
   if(tag===7){const array:unknown[]=[];for(let i=0;i<n;i++)array.push(read(depth+1));return array;}
   const object:Record<string,unknown>={};for(let i=0;i<n;i++){const key=read(depth+1);if(typeof key!=='string'||Object.hasOwn(object,key))invalid();Object.defineProperty(object,key,{value:read(depth+1),enumerable:true,writable:true,configurable:true});}return object;
  }
  return invalid();
 };
 const result=read(0);if(at!==plain.length)invalid();return result;
}
