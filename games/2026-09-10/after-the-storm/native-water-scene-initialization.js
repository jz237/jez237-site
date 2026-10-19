// Source4F9E0 scene-water setup and4E614 generated patch geometry. This is
// independent of the high-resolution ocean mesh. The caller owns applying the
// detached setup, shared RNG/noise replacement and graphics recipes together.
import {nativeWaterFieldParameters} from './native-water-field.js';
import {prepareNativeWaterInitialization} from './native-water-initialization.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const bits=v=>{b.setFloat32(0,F(v));return b.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const edgeTemplates={
 16:[406,817,818,819,820,821,822,0,16,424,816,800,392],
 12:[234,469,470,471,472,473,474,0,12,246,468,456,222],
 10:[165,331,332,333,334,335,336,0,10,175,330,320,155]
};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}

/** Source4F9E0 bounds at801924AC. These six float words belong to water
 * setup, independently of wave noise, patch radius and rendered shorelines.
 * Computing them alone must not reset the sea or consume shared randomness. */
export function nativeWaterWrapBounds(){
 const nx=Math.trunc(F((32768+2048*2)/49152)+.9),nz=Math.trunc(F((32768+2048*2)/F(F(F(Math.sqrt(3))*2)*8192))+.9);
 const right=F(nx*24576-1),left=F(-nx*24576),top=F(F(F(F(Math.sqrt(3))*nz)*8192)-1),bottom=F(F(F(Math.sqrt(3))*(-nz))*8192);
 return Object.freeze([right,left,F(F(right-left)+1),top,bottom,F(F(top-bottom)+1)].map(bits));
}

/** Complete setup around the separate noise consumer. All source numeric and
 * render-buffer writes retain order. setup writes are offsets from2420;
 * coordinate and vertex writes describe generated private simulation geometry.
 * Graphics recipes preserve fields that the original leaves untouched and
 * must not replace or downsample the browser's detailed water mesh.
 */
export function prepareNativeWaterSceneSetup({variant,players,datumNative,amplitudeNative}={}){
 integer(variant,'variant',0,255);integer(players,'players',1,2);
 integer(datumNative,'datumNative',-32768,32767);integer(amplitudeNative,'amplitudeNative',0,127);
 const parameters=nativeWaterFieldParameters({variant,players}),{radius}=parameters,template=edgeTemplates[radius],count=3*radius*(radius+1)+1;
 const operations=[],setupWords={};
 const setup=(byteOffset,value)=>{value>>>=0;setupWords[byteOffset]=value;operations.push({kind:'waterSetupWrite',byteOffset,width:4,value});};
 for(const field of ['restoringShift','couplingShift','dampingShift'])operations.push({kind:'waterShiftWrite',field,value:parameters[field]});
 setup(0x74,radius);
 for(const offset of [0x20,0x34,0x1c,4,0,0x30,0x2c,0x28,0x24,0x18,0x14,0x10,12,8])setup(offset,0);
 template.forEach((v,i)=>setup(0x40+i*4,v));
 for(const [offset,value]of [[0x80,32768],[0x84,32768],[0x88,2048],[0x78,radius*64],[0x7c,count],[0x38,datumNative]])setup(offset,value);
 const coordinates=[],vertices=[];
 for(let v=-radius;v<=radius;v++)for(let u=v<0?-radius:-radius+v;u<=(v<0?radius+v:radius);u++){
  const i=coordinates.length;coordinates.push([u,v]);
  operations.push({kind:'waterCoordinateWrite',byteOffset:i*2,width:1,value:u&255},{kind:'waterCoordinateWrite',byteOffset:i*2+1,width:1,value:v&255});
 }
 for(let v=-radius;v<=radius;v++){
  const width=2*radius-Math.abs(v);
  for(let col=0;col<=width;col++){
   const x=(col-Math.trunc(width/2))*64-(v%2!==0?32:0),index=vertices.length;
   vertices.push([x,0]);operations.push({kind:'waterVertexWrite',byteOffset:index*8+4,width:2,value:x&65535});
  }
 }
 let index=0;
 for(let v=-radius;v<=radius;v++){
  const z=Math.trunc(F(F(F(F(Math.sqrt(3))*64)/2)*v)+(v<0?-.5:.5));
  for(let col=0;col<=2*radius-Math.abs(v);col++,index++){
   vertices[index][1]=z;operations.push({kind:'waterVertexWrite',byteOffset:index*8+6,width:2,value:z&65535});
  }
 }
 operations.push({kind:'waterNoiseInitialization',amplitudeNative});
 // Original float32 intermediates, then double .9 rounding and +/-1 extents.
 const bounds=nativeWaterWrapBounds();
 for(const i of [0,1,3,4,2,5])setup(0x8c+i*4,bounds[i]);
 const graphic=(bufferIndex,byteOffset,width,value)=>operations.push({kind:'waterGraphicsWrite',bufferIndex,byteOffset,width,value});
 for(const bufferIndex of [1,0]){
  const bases=players===2?[0x13d68,0x170d8]:[0x13d68];
  for(const base of bases)for(let vertex=count+5;vertex>=0;vertex--)for(let channel=0;channel<4;channel++)graphic(bufferIndex,base+vertex*16+12+channel,1,channel===3?176:255);
  for(const base of bases){
   const uv=(vertex,offset)=>graphic(bufferIndex,base+vertex*16+offset,2,1024);
   let lower=radius,lowerNext=radius+1,upper=count-radius-1,upperPrevious=count-radius-2,step=radius+2;
   for(let j=0;j<radius;j++){
    uv(count-1-j,10);uv(count-1-j,8);uv(upperPrevious,8);uv(upperPrevious,10);uv(upper,10);uv(upper,8);
    uv(lower,8);uv(lower,10);uv(lowerNext,8);uv(lowerNext,10);uv(radius-1-j,8);uv(radius-1-j,10);
    lower+=step;lowerNext+=step;upper-=step;upperPrevious-=step;step++;
   }
   for(let i=6;i>=1;i--){uv(template[i],10);uv(template[i],8);}
  }
 }
 return freeze({operations,parameters,datumNative,amplitudeNative,setupWords,coordinates,vertices,
  diagnostic:{noiseInitialized:false,forcingPhase47c0Retained:true,graphicsExecuted:false,highResolutionMeshChanged:false}});
}

/** Prepare scene setup and the existing verified full noise/RNG transaction.
 * No mutation occurs here. The host must commit both owners at its actual
 * scene-load boundary; invoking this per frame would wrongly reset the sea.
 */
export function prepareNativeWaterSceneInitialization(input){
 const setup=prepareNativeWaterSceneSetup(input),noise=prepareNativeWaterInitialization(input);
 return freeze({...setup,noise,diagnostic:{...setup.diagnostic,noiseInitialized:true}});
}
