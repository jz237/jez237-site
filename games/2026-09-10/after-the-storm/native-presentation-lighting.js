const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const b=new DataView(new ArrayBuffer(4));
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
function direction(w){b.setUint32(0,w);const v=b.getFloat32(0),n=Math.trunc(v);if(!Number.isFinite(v)||n< -2147483648||n>2147483647)throw new RangeError('Invalid light direction conversion');return n;}

/** Complete916B4 numeric lighting/fog setup and47F90 byte stores. Light
 * padding bytes20..23 retain their previous contents. View is800DAB2C,
 * independent of the camera selector used by actor visibility.
 */
export function prepareNativePresentationLighting(input){
 const bufferIndex=integer(input?.bufferIndex,'lighting buffer',0,1),viewIndex=integer(input.viewIndex,'lighting view',0,1),courseIndex=integer(input.courseIndex,'lighting course',0,11);
 const data=words(input.courseDisplayWordsB058,136,'courseDisplayWordsB058'),base=viewIndex*68,operations=[];
 const read=offset=>data[base+offset/4];
 for(let lightIndex=0;lightIndex<2;lightIndex++){
  const origin=lightIndex===0?0:0xcc,aim=lightIndex===0?0xac:0xfc;
  const ambient=[12,16,20].map(o=>read(origin+o)),diffuse=[0,4,8].map(o=>read(origin+o)),axis=[0,4,8].map(o=>direction(read(aim+o)));
  const write=(byteOffset,value)=>operations.push({kind:'presentationLightByteWrite',bufferIndex,viewIndex,lightIndex,byteOffset,width:1,value:value&255});
  for(const offset of [19,15,11,7,3])write(offset,0);
  for(let i=0;i<3;i++){write(4+i,ambient[i]);write(i,ambient[i]);}
  for(let i=0;i<3;i++){write(12+i,diffuse[i]);write(8+i,diffuse[i]);}
  for(let i=0;i<3;i++)write(16+i,axis[i]);
 }
 let lightCount=1;
 if(courseIndex===6){
  const active=integer(input.aiLightActive78,'AI light activity bits',0,0xffffffff);
  operations.push({kind:'sourceWordWrite',field:'aiContextPointer3c58',value:0x801c3c60+viewIndex*0xe8});
  if(active!==0)lightCount=2;
 }
 operations.push({kind:'presentationLightCount',count:lightCount});
 const bind=(slot,lightIndex,byteOffset)=>operations.push({kind:'presentationLightBind',slot,bufferIndex,viewIndex,lightIndex,byteOffset});
 if(lightCount===2){bind(0,0,8);bind(1,1,8);bind(2,1,0);}
 else{bind(0,courseIndex===6?0:1,8);bind(1,1,0);}
 operations.push({kind:'presentationGraphicsSync'});
 const rgba=[0x48,0x4c,0x50,0x54].map(o=>read(o)&255);
 operations.push({kind:'presentationFogColor',rgba});
 const near=read(0x78)|0,far=read(0x7c)|0,delta=(far-near)|0,numerator=((-near<<8)+128000)|0;
 if(delta===0||(numerator===-2147483648&&delta===-1))throw new RangeError('Original fog division would trap');
 const offset=Math.trunc(numerator/delta),multiplier=Math.trunc(128000/delta),packedWord=((multiplier<<16)|(offset&65535))>>>0;
 operations.push({kind:'presentationFogFactors',packedWord});
 return freeze({operations,diagnostic:{bufferIndex,viewIndex,lightCount,graphicsExecuted:false}});
}
