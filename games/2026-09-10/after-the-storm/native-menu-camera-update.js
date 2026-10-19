// Main9/type1 camera frame. Original numeric behavior is reconstructed without
// executing ROM code. The host supplies the active graphics buffer explicitly.
import {copyNativeMenuCamera,writeNativeMenuCameraBasis} from './native-menu-camera-initialization.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),hi=a=>(a-0x7788)/4;
const bits=v=>{b.setFloat32(0,F(v));return b.getUint32(0);};
const number=v=>{b.setUint32(0,v);return b.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** DDE48 -> DDEDC -> DFC48/DF128/DEEC4, E0F8C, 9CB68, 9CCE8,
 * E0FF0. Only the E11B4 matrix producer remains a graphics request.
 * Main9 clears the selected camera's environment flag; the race/ending
 * environment collision paths are different and deliberately rejected here.
 * This advances camera state only, never hulls, course objects or water.
 */
export function prepareNativeMenuCameraUpdate(input){
 const {players,main638,datumNative,bufferIndex,hudWords7788,cameraEnvironmentBytesEaa4}=input??{};
 if(main638!==9)throw new RangeError('Menu camera update requires main638=9');
 if(![1,2].includes(players))throw new RangeError('Supply one or two source cameras');
 if(![0,1].includes(bufferIndex))throw new RangeError('Supply active camera bufferIndex');
 if(!Number.isInteger(datumNative)||datumNative<-2147483648||datumNative>2147483647)throw new RangeError('Supply signed water datumNative');
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!Number.isInteger(v)||v<0||v>0xffffffff))throw new RangeError('Supply canonical hudWords7788[1442]');
 if(!Array.isArray(cameraEnvironmentBytesEaa4)||cameraEnvironmentBytesEaa4.length!==2||cameraEnvironmentBytesEaa4.some(v=>!Number.isInteger(v)||v<0||v>255))throw new RangeError('Supply retained cameraEnvironmentBytesEaa4[2]');
 for(let i=0;i<players;i++){
  const c=0x7c80+i*0x10c,a=0x7e98+i*0xe0;
  if(hudWords7788[hi(c)]!==1||hudWords7788[hi(a)]!==1)throw new RangeError('Only type1 cameras with type1 auxiliaries are supported');
  if(![0,1].includes(hudWords7788[hi(c+0xe8)]))throw new RangeError('Invalid selected camera environment index');
 }
 const hud=[...hudWords7788],flags=[...cameraEnvironmentBytesEaa4],operations=[];
 const write=(a,v)=>{hud[hi(a)]=v>>>0;operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});};
 const put=(a,v)=>{if(!Number.isFinite(F(v)))throw new RangeError('Nonfinite menu camera result');write(a,bits(v));};
 const get=a=>number(hud[hi(a)]);
 const smooth=(current,target,rate)=>F(current+F(F(target-current)*rate));
 for(let cameraIndex=0;cameraIndex<players;cameraIndex++){
  const c=0x7c80+cameraIndex*0x10c,a=0x7e98+cameraIndex*0xe0;
  put(0x8108,datumNative);
  const oldEye=[get(c+0x4c),get(c+0x50),get(c+0x54)];
  // Type1 enters DDEDC's common branch directly. DF128 alternates target
  // and eye components, then DEEC4 smooths up, FOV and projection offsets.
  for(let i=0;i<3;i++){
   put(a+4+i*4,smooth(get(a+4+i*4),get(a+0x5c+i*4),get(a+0x68)));
   put(a+0x10+i*4,smooth(get(a+0x10+i*4),get(a+0x6c+i*4),get(a+0x78)));
  }
  for(let i=0;i<3;i++)put(a+0x1c+i*4,smooth(get(a+0x1c+i*4),get(a+0x28+i*4),get(a+0x34)));
  put(a+0x38,smooth(get(a+0x38),get(a+0x3c),get(a+0x40)));
  for(let i=0;i<2;i++)put(a+0x44+i*4,smooth(get(a+0x44+i*4),get(a+0x4c+i*4),get(a+0x54+i*4)));
  copyNativeMenuCamera({write,hud},c,a);
  // 9CB68 returns zero without side effects. Main9's 9CCE8 clears one byte.
  const index=hud[hi(c+0xe8)];flags[index]=0;
  operations.push({kind:'cameraEnvironmentWrite',byteOffset:index,width:1,value:0});
  oldEye.forEach((v,i)=>put(c+0x58+i*4,F(get(c+0x4c+i*4)-v)));
  writeNativeMenuCameraBasis({get,put},c);
  operations.push({kind:'cameraMatrixRequest',bufferIndex,cameraIndex});
 }
 return freeze({operations,hudWords7788:hud,cameraEnvironmentBytesEaa4:flags,
  diagnostic:{cameraCount:players,type:1,main638:9,graphicsExecuted:false,liveSceneUpdated:false}});
}
