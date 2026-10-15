// The water scheduler and ordinary HUD consumers share these actual numeric
// fields of the canonical80227C80+i*10C camera records. Projection parameters
// stay explicit browser metadata; no duplicate eye/target/basis is retained.
const F=Math.fround,bits=new DataView(new ArrayBuffer(4)),hi=a=>(a-0x7788)/4;
const fields={eyeNative:[0x4c,0x50,0x54],forward:[0x64,0x68,0x6c],up:[0x70,0x74,0x78],
 targetNative:[0x7c,0x80,0x84],horizontalForward:[0xf0,0xf4]};
export function createNativeRaceCameraStorage({players,readState,commit}={}){
 if(![1,2].includes(players)||typeof readState!=='function'||typeof commit!=='function')throw new TypeError('Expected canonical camera owner');
 let metadata=null;
 function scalar(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError('Camera values must fit float32');return F(v);}
 function word(v){bits.setFloat32(0,scalar(v));return bits.getUint32(0);}
 function number(w){bits.setUint32(0,w);return bits.getFloat32(0);}
 return Object.freeze({
  write(cameras){
   if(!Array.isArray(cameras)||cameras.length!==players)throw new RangeError('Source camera count must match human views');
   const operations=[],nextMetadata=cameras.map((camera,index)=>{
    const base=0x7c80+index*0x10c;
    for(const [key,offsets]of Object.entries(fields)){
     if(!Array.isArray(camera[key])||camera[key].length!==offsets.length)throw new TypeError('Supply complete numeric source camera basis');
     offsets.forEach((offset,j)=>operations.push({kind:'hudWrite',byteOffset:base+offset-0x7788,width:4,value:word(camera[key][j])}));
    }
    const fovDegrees=scalar(camera.fovDegrees),nearNative=scalar(camera.nearNative),projectionOffset=camera.projectionOffset;
    if(fovDegrees<=0||fovDegrees>=180||nearNative<=0||!Array.isArray(projectionOffset)||projectionOffset.length!==2)throw new RangeError('Invalid source projection metadata');
    return Object.freeze({fovDegrees,nearNative,projectionOffset:Object.freeze(projectionOffset.map(scalar))});
   });
   commit(operations);metadata=nextMetadata;
  },
  read(){
   if(!metadata)throw new Error('Source cameras have not been initialized');
   const hud=readState().hudWords7788;
   return metadata.map((projection,index)=>({...projection,...Object.fromEntries(Object.entries(fields).map(([key,offsets])=>
    [key,offsets.map(offset=>number(hud[hi(0x7c80+index*0x10c+offset)]))]))}));
  }
 });
}
