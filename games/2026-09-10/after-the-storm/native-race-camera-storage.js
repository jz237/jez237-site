// The water scheduler and ordinary HUD consumers share these actual numeric
// fields of the canonical80227C80+i*10C camera records. Projection parameters
// stay explicit browser metadata; no duplicate eye/target/basis is retained.
import {readNativeWaterFollowCamera,nativeWaterFollowProfile} from './native-water-schedule.js';
const F=Math.fround,bits=new DataView(new ArrayBuffer(4)),hi=a=>(a-0x7788)/4;
const fields={eyeNative:[0x4c,0x50,0x54],forward:[0x64,0x68,0x6c],up:[0x70,0x74,0x78],
 targetNative:[0x7c,0x80,0x84],horizontalForward:[0xf0,0xf4]};
export function createNativeRaceCameraStorage({players,readState,commit}={}){
 if(![1,2].includes(players)||typeof readState!=='function'||typeof commit!=='function')throw new TypeError('Expected canonical camera owner');
 let metadata=null;
 function scalar(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError('Camera values must fit float32');return F(v);}
 function word(v){bits.setFloat32(0,scalar(v));return bits.getUint32(0);}
 function number(w){bits.setUint32(0,w);return bits.getFloat32(0);}
 const followFields={lagXZ:[0x74,0x78],radiusNative:[0xa4],pitchDegrees:[0xbc],fovDegrees:[0x38],datumNative:[0x68]};
 let followInitialized=false;
 function followWrites(follows){
  if(!Array.isArray(follows)||follows.length!==players)throw new RangeError('Follow count must match human views');
  return follows.flatMap((value,index)=>{
   const state=readNativeWaterFollowCamera(value),base=0x7e98+index*0xe0;
   return Object.entries(followFields).flatMap(([key,offsets])=>offsets.map((offset,j)=>({kind:'hudWrite',byteOffset:base+offset-0x7788,width:4,value:word(Array.isArray(state[key])?state[key][j]:state[key])})));
  });
 }
 return Object.freeze({
  initializeFollow(follows){
   if(followInitialized)throw new Error('Source follow storage is already initialized');
   const operations=followWrites(follows),hud=readState().hudWords7788;
   follows.forEach((state,index)=>{
    const camera=0x7c80+index*0x10c,aux=0x7e98+index*0xe0,profile=nativeWaterFollowProfile(state.zoomIndex);
    const put=(a,value)=>operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:value>>>0});
    // Explicit fresh web initialization of the ordinary type5 numeric subset.
    // Targets/rates match the source template; source input owns subsequent
    // mode, toggle, lift and target changes. No opaque template is copied.
    put(camera+0xec,state.zoomIndex);put(camera+0xfc,word(state.liftOffsetNative));
    put(aux+0xdc,hud[hi(camera+0xf8)]);
    for(const [offset,value]of [[0x3c,profile.fovDegrees],[0xa8,profile.radiusNative],[0xc0,profile.pitchDegrees],[0x40,.2],[0xac,.2],[0xc4,.2]])put(aux+offset,word(value));
   });
   commit(operations);followInitialized=true;
  },
  writeFollow(follows){if(!followInitialized)throw new Error('Source follow storage is not initialized');commit(followWrites(follows));},
  readFollow(){
   if(!followInitialized)throw new Error('Source follow storage is not initialized');
   const hud=readState().hudWords7788;
   return Array.from({length:players},(_,index)=>{
    const camera=0x7c80+index*0x10c,aux=0x7e98+index*0xe0;
    return readNativeWaterFollowCamera({zoomIndex:hud[hi(camera+0xec)]|0,liftOffsetNative:number(hud[hi(camera+0xfc)]),
     ...Object.fromEntries(Object.entries(followFields).map(([key,offsets])=>[key,offsets.length===1?number(hud[hi(aux+offsets[0])]):offsets.map(o=>number(hud[hi(aux+o)]))]))});
   });
  },
  readFollowControls(){
   if(!followInitialized)throw new Error('Source follow storage is not initialized');
   const hud=readState().hudWords7788;
   return Array.from({length:players},(_,index)=>{
    const camera=0x7c80+index*0x10c,aux=0x7e98+index*0xe0,get=o=>number(hud[hi(aux+o)]);
    return {zoomIndex:hud[hi(camera+0xec)]|0,liftOffsetNative:number(hud[hi(camera+0xfc)]),tilt:hud[hi(aux+0xdc)]!==0,
     fovDegrees:get(0x3c),fovResponse:get(0x40),radiusNative:get(0xa8),radiusResponse:get(0xac),pitchDegrees:get(0xc0),pitchResponse:get(0xc4)};
   });
  },
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
