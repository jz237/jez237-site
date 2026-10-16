// Reconstructed80092938: three28-byte menu input records, separate from
// per-rider61708 input selection. All state is returned detached from input.
const WORDS=21;
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function bytes(v,name,length){if(!Array.isArray(v)||v.length!==length)throw new RangeError(`${name} requires ${length} bytes`);return Array.from(v,n=>integer(n,name,0,255));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Complete8004A208. Clear only connected ten-byte device records, retaining
 * the source byte/halfword store order. The last axis reads the just-cleared
 * byte, so every written value is zero; no OS sampling or menu-record reset
 * takes place here. High mask bits do not address additional controllers. */
export function prepareNativeDeviceReset(input){
 const mask=integer(input?.connectedMask4340,'connected mask',0,255),operations=[];
 for(let port=0;port<4;port++)if(mask&(1<<port))for(const [offset,width]of [[9,1],[6,2],[4,2],[2,2],[0,2],[8,1]])
  operations.push({kind:'deviceInputWrite',byteOffset:port*10+offset,width,value:0});
 return freeze({operations});
}

/** Numeric8004A2F0..A394 portion after OS controller reads. The connected
 * mask chooses which device records receive fresh held/pressed/released and
 * prior-held fields; disconnected records remain byte-for-byte unchanged.
 * Raw browser/gamepad sampling is a host boundary, not emulated N64 I/O. */
export function prepareNativeDeviceSample(input){
 if(!Array.isArray(input?.deviceBytes4308)||input.deviceBytes4308.length!==4)throw new RangeError('Expected four device records');
 const records=Array.from(input.deviceBytes4308,v=>bytes(v,'device record',10)),mask=integer(input.connectedMask4340,'connected mask',0,255),operations=[];
 function put(port,offset,width,value){
  value=width===2?value&65535:value&255;
  operations.push({kind:'deviceInputWrite',byteOffset:port*10+offset,width,value});
  for(let i=0;i<width;i++)records[port][offset+i]=(value>>>((width-i-1)*8))&255;
 }
 for(let port=0;port<4;port++)if(mask&(1<<port)){
  const raw=input.rawControllers?.[port],held=integer(raw?.heldButtons,'held buttons',0,65535),
   x=integer(raw.rawXNative,'raw X',-128,127),y=integer(raw.rawYNative,'raw Y',-128,127),
   old=(records[port][0]<<8)|records[port][1],changed=held^old;
  put(port,6,2,old);put(port,2,2,held&changed);put(port,4,2,old&changed);
  put(port,0,2,held);put(port,8,1,x);put(port,9,1,y);
 }
 return freeze({deviceBytes4308:records,operations});
}

/** Device4308 records are already sampled: held/pressed/released fields and
 * signed axes are not regenerated from rider controls. Count0 selects the
 * supplied neutral record; one device feeds both player menu records. The
 * third record starts from device0 and ORs the UPDATED second record's held
 * and pressed halfwords when two or more controllers exist. It keeps device0
 * axes and release fields. Preserve preceding10-byte snapshots and counters.
 * Store recipes retain the actual unaligned-copy writes, including repeated
 * aligned stores; no callback or memory mutation occurs during preparation.
 */
export function prepareNativeMenuInput(input){
 const retained=input?.menuWordsE658;
 if(!Array.isArray(retained)||retained.length!==WORDS)throw new RangeError('menuWordsE658 requires21 words');
 const memory=new DataView(new ArrayBuffer(WORDS*4));
 Array.from(retained,(v,i)=>memory.setUint32(i*4,integer(v,'menu word',0,0xffffffff)));
 const count=integer(input.controllerCount4344,'controllerCount4344',0,4),operations=[];
 const tx=integer(input.thresholdXb400,'thresholdXb400',-128,127),ty=integer(input.thresholdYb401,'thresholdYb401',-128,127);
 const devices=new Map();
 function device(index){
  if(count===0)return bytes(input.neutralBytesAb10,'neutralBytesAb10',10);
  const port=integer(input.controllerPorts4330?.[index],'controller port',0,3);
  if(!devices.has(port))devices.set(port,bytes(input.deviceBytes4308?.[port],'device record',10));
  return devices.get(port);
 }
 function put(offset,width,value){
  value=width===4?value>>>0:value&((1<<(width*8))-1);
  operations.push({kind:'menuInputWrite',byteOffset:offset,width,value});
  for(let i=0;i<width;i++)memory.setUint8(offset+i,(value>>>((width-i-1)*8))&255);
 }
 const half=o=>memory.getUint16(o),word=o=>memory.getInt32(o);
 function axis(base,offset,threshold,positive,negative,counter){
  const value=memory.getInt8(base+offset),prior=memory.getInt8(base+offset+10);
  let mask,crossed;
  if(value>=threshold){mask=positive;crossed=prior<threshold;}
  else if(value<=-threshold){mask=negative;crossed=prior>-threshold;}
  else return;
  if(crossed){put(base+counter,4,0);put(base+2,2,half(base+2)|mask);}
  else{const next=(word(base+counter)+1)|0;put(base,2,half(base)|mask);put(base+counter,4,next);}
 }
 for(let slot=0;slot<3;slot++){
  const base=slot*28,prior0=memory.getUint32(base),prior1=memory.getUint32(base+4),priorTail=half(base+8);
  put(base+10,2,prior0>>>16);put(base+12,2,prior0&65535);
  put(base+14,2,prior1>>>16);put(base+16,2,prior1&65535);put(base+18,2,priorTail);
  const record=device(slot===1&&count>=2?1:0),recordWord=i=>((record[i]<<24)|(record[i+1]<<16)|(record[i+2]<<8)|record[i+3])>>>0;
  for(const offset of [0,4]){const value=recordWord(offset);put(base+offset,4,value);put(base+offset,4,value);}
  put(base+8,2,(record[8]<<8)|record[9]);
  if(slot===2&&count>=2){put(base,2,half(base)|half(28));put(base+2,2,half(base+2)|half(30));}
  axis(base,8,tx,0x100,0x200,20);axis(base,9,ty,0x800,0x400,24);
 }
 return freeze({menuWordsE658:Array.from({length:WORDS},(_,i)=>memory.getUint32(i*4)),operations});
}
