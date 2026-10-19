import {nativePhaseSine} from './native-math-tables.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** DFC48 numeric auxiliary motion for types1/2/3, including DF128, DF38C and
 * DEEC4. Type3 drives the original introduction's spherical camera paths;
 * type1 handles its Cartesian shot. Type2 reverses eye/target attachment.
 * The source sine table and truncated phase indices preserve angle wrapping.
 * Call after script and course effects, before copying/basing the main camera.
 * Other camera types need their own motion branch and are rejected here.
 */
export function prepareNativeCameraAuxiliaryMotion({hudWords7788,cameraIndex=0}={}){
 if(![0,1].includes(cameraIndex))throw new RangeError('Invalid auxiliary camera index');
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!Number.isInteger(v)||v<0||v>0xffffffff))
  throw new RangeError('Supply canonical hudWords7788[1442]');
 const hud=[...hudWords7788],operations=[],base=0x7e98+cameraIndex*0xe0,at=o=>(base+o-0x7788)/4,type=hud[at(0)];
 if(![1,2,3].includes(type))throw new RangeError('Unsupported auxiliary camera motion type');
 const get=o=>number(hud[at(o)]);
 function put(offset,value){if(!Number.isFinite(F(value)))throw new RangeError('Nonfinite auxiliary camera result');const valueWord=bits(F(value));hud[at(offset)]=valueWord;operations.push({kind:'hudWrite',byteOffset:base+offset-0x7788,width:4,value:valueWord});}
 const smooth=(a,target,rate)=>F(a+F(F(target-a)*rate));
 if(type===1){
  for(let i=0;i<3;i++){
   put(4+i*4,smooth(get(4+i*4),get(0x5c+i*4),get(0x68)));
   put(0x10+i*4,smooth(get(0x10+i*4),get(0x6c+i*4),get(0x78)));
  }
 }else{
  for(const [current,target,rate]of [[0x70,0x74,0x78],[0x7c,0x80,0x84],[0x88,0x8c,0x90]])put(current,smooth(get(current),get(target),get(rate)));
  const phase=degrees=>{const v=F(F(degrees*4096)/360);if(!Number.isFinite(v)||v< -2147483648||v>=2147483648)throw new RangeError('Auxiliary camera phase exceeds source conversion range');return Math.trunc(v);};
  const azimuth=phase(F(get(0x68)+get(0x7c))),elevation=phase(F(get(0x6c)+get(0x88))),radius=get(0x70);
  const cosElevation=nativePhaseSine((elevation+1024)&4095),horizontal=F(radius*cosElevation);
  const offset=[F(nativePhaseSine((azimuth+1024)&4095)*horizontal),F(nativePhaseSine(elevation&4095)*radius),F(nativePhaseSine(azimuth&4095)*horizontal)];
  for(let i=0;i<3;i++){
   const point=get(0x5c+i*4);
   put((type===2?4:0x10)+i*4,point);
   put((type===2?0x10:4)+i*4,F(offset[i]+point));
  }
 }
 for(let i=0;i<3;i++)put(0x1c+i*4,smooth(get(0x1c+i*4),get(0x28+i*4),get(0x34)));
 put(0x38,smooth(get(0x38),get(0x3c),get(0x40)));
 for(let i=0;i<2;i++)put(0x44+i*4,smooth(get(0x44+i*4),get(0x4c+i*4),get(0x54+i*4)));
 return freeze({operations,hudWords7788:hud,diagnostic:{cameraIndex,type,mainCameraCopied:false,graphicsExecuted:false}});
}
