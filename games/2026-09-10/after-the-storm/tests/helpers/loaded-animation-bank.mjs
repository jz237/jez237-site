// Serialize the synthetic animation resources in the original-code fixtures.
// Unread components in motion-only fixtures are explicit authored zeros.
export function loadedAnimationBank(animations){
 const baseAddress=0x81000000,writes=[];let size=0;
 const allocate=n=>{const at=size;size=(size+n+3)&~3;return at;};
 const put=(at,width,value)=>writes.push([at,width,value]);
 const indices=Object.keys(animations).map(Number),min=Math.min(...indices),max=Math.max(...indices),table=allocate((max-min+1)*4)-min*4;
 for(const [index,animation]of Object.entries(animations)){
  const offsets=Object.keys(animation.tracks).map(Number),descriptor=allocate(Math.max(...offsets)+4);
  put(table+Number(index)*4,4,baseAddress+descriptor);put(descriptor,2,animation.frameCount);
  const keys=Object.keys(animation.transforms).map(Number),low=Math.min(...keys),high=Math.max(...keys),rows=allocate((high-low+1)*12)-low*12;
  put(descriptor+4,4,baseAddress+rows);
  for(const [key,row]of Object.entries(animation.transforms)){
   const at=rows+Number(key)*12;
   for(const [i,axis]of ['x','y','z'].entries()){put(at+i*2,2,row.positionNative?.[axis]??0);put(at+6+i,1,row.forwardUnits?.[axis]??0);put(at+9+i,1,row.upUnits?.[axis]??0);}
  }
  for(const offset of offsets){
   const track=animation.tracks[offset],frames=Object.keys(track).map(Number),first=Math.min(...frames),last=Math.max(...frames),pointer=allocate((last-first+1)*2)-first*2;
   put(descriptor+offset,4,baseAddress+pointer);for(const frame of frames)put(pointer+frame*2,2,track[frame]);
  }
 }
 const loadedBytes=new Uint8Array(size),view=new DataView(loadedBytes.buffer);
 for(const [at,width,value]of writes){if(width===4)view.setUint32(at,value);else if(width===2)view.setInt16(at,value);else view.setInt8(at,value);}
 return {loadedBytes,baseAddress,animationTableAddress:baseAddress+table};
}
