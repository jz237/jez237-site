import {prepareNativeIntroductionCameraScript} from './native-introduction-camera-script.js';
import {prepareNativeIntroductionActors} from './native-presentation-actor-pool.js';
import {prepareNativeCameraAuxiliaryMotion} from './native-camera-auxiliary-motion.js';
import {copyNativeMenuCamera,writeNativeMenuCameraBasis} from './native-menu-camera-initialization.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),hi=a=>(a-0x7788)/4;
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);},bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** Complete main8/type6 DDE48/DDEDC numeric frame: script, actors (including
 * retained pool), auxiliary motion, main-camera copy, environment, velocity,
 * basis and active-buffer matrix request. Does not run the physical scene or
 * the later actor display/cleanup stage. E11B4 remains the GPU boundary.
 */
export function prepareNativeIntroductionCameraUpdate(input){
 const {main638,players,datumNative,bufferIndex,cameraEnvironmentBytesEaa4}=input??{};
 if(main638!==8||![1,2].includes(players)||![0,1].includes(bufferIndex))throw new RangeError('Supply main8 introduction cameras and active buffer');
 if(!Number.isInteger(datumNative)||datumNative< -2147483648||datumNative>2147483647)throw new RangeError('Supply signed water datumNative');
 if(!Array.isArray(input.hudWords7788)||input.hudWords7788.length!==1442||input.hudWords7788.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply canonical hudWords7788[1442]');
 if(!Array.isArray(cameraEnvironmentBytesEaa4)||cameraEnvironmentBytesEaa4.length!==2||cameraEnvironmentBytesEaa4.some(v=>!Number.isInteger(v)||v<0||v>255))throw new RangeError('Supply retained cameraEnvironmentBytesEaa4');
 let hud=[...input.hudWords7788],actorWordsF060=input.actorWordsF060,actorControlWords62c4=input.actorControlWords62c4,rngState4640=input.rngState4640;
 const flags=[...cameraEnvironmentBytesEaa4],operations=[];
 for(let i=0;i<players;i++)if(hud[hi(0x7c80+i*0x10c)]!==6||![0,1].includes(hud[hi(0x7c80+i*0x10c+0xe8)]))throw new RangeError('Supply type6 introduction cameras with valid environment indices');
 const write=(a,w)=>{hud[hi(a)]=w>>>0;operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:w>>>0});};
 const get=a=>number(hud[hi(a)]);
 const put=(a,v)=>{v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite introduction camera result');write(a,bits(v));};
 for(let cameraIndex=0;cameraIndex<players;cameraIndex++){
  const c=0x7c80+cameraIndex*0x10c,a=0x7e98+cameraIndex*0xe0;put(0x8108,datumNative);
  const oldEye=[get(c+0x4c),get(c+0x50),get(c+0x54)];
  const script=prepareNativeIntroductionCameraScript({hudWords7788:hud,cameraIndex,resources:input.scriptResources});hud=[...script.hudWords7788];operations.push(...script.operations);
  const actors=prepareNativeIntroductionActors({...input,hudWords7788:hud,rngState4640,actorWordsF060,actorControlWords62c4,cameraIndex,resources:input.actorResources,scripts:input.scriptResources});
  hud=[...actors.hudWords7788];actorWordsF060=actors.actorWordsF060;actorControlWords62c4=actors.actorControlWords62c4;rngState4640=actors.rngState4640;operations.push(...actors.operations);
  const motion=prepareNativeCameraAuxiliaryMotion({hudWords7788:hud,cameraIndex});hud=[...motion.hudWords7788];operations.push(...motion.operations);
  copyNativeMenuCamera({hud,write},c,a);
  const environment=hud[hi(c+0xe8)];flags[environment]=0;operations.push({kind:'cameraEnvironmentWrite',byteOffset:environment,width:1,value:0});
  oldEye.forEach((v,i)=>put(c+0x58+i*4,F(get(c+0x4c+i*4)-v)));
  writeNativeMenuCameraBasis({get,put},c);operations.push({kind:'cameraMatrixRequest',bufferIndex,cameraIndex});
 }
 return freeze({operations,hudWords7788:hud,actorWordsF060,actorControlWords62c4,rngState4640,cameraEnvironmentBytesEaa4:flags,
  diagnostic:{cameraCount:players,type:6,main638:8,actorsSubmitted:true,graphicsExecuted:false,physicalSceneUpdated:false}});
}
