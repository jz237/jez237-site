// Original DDA24/DDAB8 type5 initialization for the main8 course introduction.
// Source addresses identify camera-script resources; they are not executable
// browser pointers. The script runner must resolve them to decoded resources.
import {NATIVE_MENU_CAMERA_DATA,copyNativeMenuCamera,writeNativeMenuCameraBasis} from './native-menu-camera-initialization.js';
const F=Math.fround,bits=new DataView(new ArrayBuffer(4)),hi=a=>(a-0x7788)/4;
const word=v=>{bits.setFloat32(0,F(v));return bits.getUint32(0);};
const number=v=>{bits.setUint32(0,v);return bits.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const scripts=[0x80223a30,null,0x80223f7c,0x80224060,0x802241e0,0x802242c0,0x80224430,0x802245b4,0x802246b4];
const sunnyScripts=[0x80223d38,0x80224944,0x80224b14];
function integer(v,n,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid introduction camera ${n}`);return v;}

/** Complete numeric initialization, including DFD94, E0F8C and E0FF0.
 * Type5 becomes scripted type6. Only cursor+4 and its timer+8 are initialized;
 * auxiliary pointer+0 and the warm auxiliary camera are retained. Overwriting
 * them with a generic menu template would change the original first frame.
 * This prepares both graphics-buffer matrix requests, but does not run the
 * camera script, physical scene, water or GPU. Requires an initialized warm
 * auxiliary basis from the preceding scene or the source bootstrap.
 */
export function prepareNativeIntroductionCameraInitialization(input){
 const {players,main638,courseIndex,difficulty,datumNative,hudWords7788}=input??{};
 if(main638!==8)throw new RangeError('Introduction camera initialization requires main8');
 integer(players,'players',1,2);integer(courseIndex,'courseIndex',0,8);integer(difficulty,'difficulty',0,2);
 integer(datumNative,'datumNative',-2147483648,2147483647);
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!Number.isInteger(v)||v<0||v>0xffffffff))
  throw new RangeError('Supply canonical hudWords7788[1442]');
 for(let i=0;i<players;i++)if(hudWords7788[hi(0x7c80+i*0x10c)]!==5)throw new RangeError('Introduction entry requires selected type5 cameras');
 const far=F(input.farPlane5f88??NATIVE_MENU_CAMERA_DATA.farPlane5f88);
 if(!Number.isFinite(far)||far<=10)throw new RangeError('Invalid introduction camera far plane');
 const hud=[...hudWords7788],operations=[],scriptAddress=courseIndex===1?sunnyScripts[difficulty]:scripts[courseIndex];
 const write=(a,v)=>{hud[hi(a)]=v>>>0;operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});};
 const put=(a,v)=>{if(!Number.isFinite(F(v)))throw new RangeError('Nonfinite introduction camera result');write(a,word(v));};
 const get=a=>number(hud[hi(a)]);
 for(let cameraIndex=0;cameraIndex<players;cameraIndex++){
  const c=0x7c80+cameraIndex*0x10c,a=0x7e98+cameraIndex*0xe0,s=0x8058+cameraIndex*0x38;
  put(c+0x9c,10);put(c+0xa0,far);put(0x8108,datumNative);
  write(c,6);write(s+4,scriptAddress);write(s+8,0);
  copyNativeMenuCamera({write,hud},c,a);writeNativeMenuCameraBasis({get,put},c);
  operations.push({kind:'cameraMatrixRequest',bufferIndex:0,cameraIndex},{kind:'cameraMatrixRequest',bufferIndex:1,cameraIndex});
 }
 return freeze({operations,hudWords7788:hud,diagnostic:{cameraCount:players,selectedType:5,type:6,scriptAddress,
  scriptExecuted:false,graphicsExecuted:false,liveSceneUpdated:false}});
}
