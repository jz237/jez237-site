// Original type1 menu camera setup, independently reconstructed from numeric
// behavior. Canonical camera/auxiliary storage stays inside hudWords7788.
// The graphics backend consumes matrix requests at their original positions.
const F=Math.fround,view=new DataView(new ArrayBuffer(4)),hi=a=>(a-0x7788)/4;
const bits=v=>{view.setFloat32(0,F(v));return view.getUint32(0);};
const number=v=>{view.setUint32(0,v);return view.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const NATIVE_MENU_CAMERA_DATA=freeze({
 type1Template5a84:[0,0,0,1,1,1,0,0,-1,0,0,-1,1,50,50,1,0,0,0,0,1,1,0,0,0,1,0,1000,1,1],
 farPlane5f88:16138
});
function finite(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${name}`);return F(v);}

/** DDA24 -> DDAB8 for selected type1 cameras, including DF008, E0F8C and
 * E0FF0. This is the path selected by actual championship result entry.
 * datumNative is the already initialized signed water datum2458. It is
 * written to shared8108; it does not translate the fixed template position.
 * Other camera modes need their own original branch and are rejected here.
 * Neither a graphics buffer nor the live scene is advanced by preparation.
 */
export function prepareNativeMenuCameraInitialization(input){
 const {players,datumNative,hudWords7788}=input??{};
 if(![1,2].includes(players))throw new RangeError('Supply one or two source cameras');
 if(!Number.isInteger(datumNative)||datumNative<-2147483648||datumNative>2147483647)throw new RangeError('Supply signed water datumNative');
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!Number.isInteger(v)||v<0||v>0xffffffff))throw new RangeError('Supply canonical hudWords7788[1442]');
 const template=input.type1Template5a84??NATIVE_MENU_CAMERA_DATA.type1Template5a84;
 if(!Array.isArray(template)||template.length!==30)throw new RangeError('Supply type1Template5a84[30]');
 const templateWords=template.map(v=>bits(finite(v,'type1 template'))),far=finite(input.farPlane5f88??NATIVE_MENU_CAMERA_DATA.farPlane5f88,'far plane');
 if(far<=10)throw new RangeError('Far plane must exceed near plane');
 for(let i=0;i<players;i++)if(hudWords7788[hi(0x7c80+i*0x10c)]!==1)throw new RangeError('Only selected type1 menu cameras are supported');
 const hud=[...hudWords7788],operations=[];
 const write=(a,v)=>{hud[hi(a)]=v>>>0;operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});};
 const put=(a,v)=>write(a,bits(finite(v,'camera result'))),get=a=>number(hud[hi(a)]);
 for(let cameraIndex=0;cameraIndex<players;cameraIndex++){
  const c=0x7c80+cameraIndex*0x10c,a=0x7e98+cameraIndex*0xe0;
  put(c+0x9c,10);put(c+0xa0,far);put(0x8108,datumNative);
  write(a,1);templateWords.forEach((w,i)=>write(a+4+i*4,w));
  copyNativeMenuCamera({write,hud},c,a);
  writeNativeMenuCameraBasis({get,put},c);
  operations.push({kind:'cameraMatrixRequest',bufferIndex:0,cameraIndex},{kind:'cameraMatrixRequest',bufferIndex:1,cameraIndex});
 }
 return freeze({operations,hudWords7788:hud,diagnostic:{cameraCount:players,type:1,graphicsExecuted:false,liveSceneUpdated:false}});
}

// Shared ordered numeric helpers; callers own detached storage and validation.
export function copyNativeMenuCamera({write,hud},c,a){
  // E0F8C copies eye, target, up, FOV and projection offsets in this order.
  for(const [from,to]of [[0x10,0x4c],[0x14,0x50],[0x18,0x54],[4,0x7c],[8,0x80],[12,0x84],
   [0x1c,0x70],[0x20,0x74],[0x24,0x78],[0x38,0x88],[0x44,0x94],[0x48,0x98]])write(c+to,hud[hi(a+from)]);
}
export function writeNativeMenuCameraBasis({get,put},c){
 const length=(x,y,z)=>F(Math.sqrt(F(F(F(x*x)+F(y*y))+F(z*z))));
  const delta=[0,1,2].map(i=>F(get(c+0x7c+i*4)-get(c+0x4c+i*4)));
  delta.forEach((v,i)=>put(c+0x64+i*4,v));
  const distance=length(...delta);if(!(distance>0))throw new RangeError('Degenerate menu camera direction');
  const forward=delta.map(v=>F(v/distance));forward.forEach((v,i)=>put(c+0x64+i*4,v));
  const [x,y,z]=forward,horizontal=F(Math.sqrt(F(F(x*x)+F(z*z))));
  if(!(horizontal>0))throw new RangeError('Menu camera needs horizontal direction');
  put(c+0xf4,F(z/horizontal));put(c+0xf0,F(x/horizontal));
  const up=[get(c+0x70),get(c+0x74),get(c+0x78)];
  const magnitude=F(F(F(x*x)+F(y*y))+F(z*z)),dot=F(F(F(x*up[0])+F(y*up[1]))+F(z*up[2]));
  const projection=F(F(-dot)/magnitude),orthogonal=up.map((v,i)=>F(v+F(forward[i]*projection)));
  orthogonal.forEach((v,i)=>put(c+0x70+i*4,v));
  const upLength=length(...orthogonal);if(!(upLength>0))throw new RangeError('Degenerate menu camera up');
  orthogonal.forEach((v,i)=>put(c+0x70+i*4,F(v/upLength)));
  const dx=F(get(c+0x4c)-get(c+0x7c)),dz=F(get(c+0x54)-get(c+0x84));
  put(c+0x8c,F(Math.sqrt(F(F(dx*dx)+F(dz*dz)))));put(c+0x90,F(get(c+0x50)-get(c+0x80)));
}
