import {decodeNativeRaceStartTransform} from './native-race-start-transform.js';
const BYTES=0xb2f0,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){if(Array.isArray(v)){for(const x of v)if(x&&typeof x==='object')freeze(x);}else Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,n,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
// Copied every live frame: a fresh packed array keeps the validation cheap.
function bytes(a){if(!Array.isArray(a)||a.length!==BYTES)throw new RangeError('Supply B2F0-byte scene buffer');const r=[];for(let i=0;i<BYTES;i++){const v=a[i];if(!Number.isInteger(v)||v<0||v>255)throw new RangeError('Invalid scene buffer byte');r.push(v);}return r;}
function buffers(value){if(!Array.isArray(value)||value.length!==2)throw new RangeError('Supply both retained scene graphics buffers');return value.map(bytes);}
const float=w=>{b.setUint32(0,w);return b.getFloat32(0);},identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
const rgba=a=>{if(!Array.isArray(a)||a.length!==4)throw new RangeError('Supply four effect color bytes');return a.map(v=>integer(v,'effect color byte',0,255));};
// Numeric quad at source01051540, drawn by01051580. Original texture artwork
// is deliberately separate: these coordinates support authored high-res maps.
const splashVertices=[[-16,-16,0,0,2048],[16,-16,0,2048,2048],[16,16,0,2048,0],[-16,16,0,0,0]].map(v=>({position:v.slice(0,3),st:v.slice(3),alpha:255}));

/** Retain original vertex/matrix bytes and consume prepared renderer effects.
 * Geometry is detached, scaled once into world units, and kept in draw order.
 * FC129825/FF33FFFF selects texture*environment RGB and texture*shade alpha;
 * BB000001/80008000 supplies half-scale texture coordinates. Source preset
 * disables culling, fog and lighting. This decodes geometry, not RDP pixels.
 * See the original GBI definitions:
 * https://ultra64.ca/files/documentation/online-manuals/man/header/gbi.htm
 */
export function prepareNativeEffectPresentation(value,operations,{worldScale}={}){
 const graphicsBuffers=buffers(value);if(!Array.isArray(operations))throw new TypeError('Supply ordered effect renderer operations');
 if(!Number.isFinite(worldScale)||worldScale<=0)throw new RangeError('Supply positive effect world scale');
 const draws=[];let color=null,texture=null,mode=null,matrix=identity(),cache=null,listOpen=false;
 function selected(i){return graphicsBuffers[integer(i,'effect buffer',0,1)];}
 function write(i,at,width,v){const target=selected(i);integer(at,'effect byte offset',0,BYTES-width);if(at%width)throw new RangeError('Invalid effect byte alignment');integer(v,'effect byte value',0,width===1?255:65535);if(width===2)target[at]=v>>>8;target[at+width-1]=v&255;}
 function packed(i,index){const a=selected(i),offset=0x4140+integer(index,'effect matrix index',0,453)*64,words=Array.from({length:16},(_,j)=>{const p=offset+j*4;return ((a[p]<<24)|(a[p+1]<<16)|(a[p+2]<<8)|a[p+3])>>>0;});return decodeNativeRaceStartTransform({matrixWords:words}).floatWords.map(float);}
 function multiply(a,c){return Array.from({length:16},(_,i)=>{const col=i>>>2,row=i&3;let v=0;for(let k=0;k<4;k++)v+=a[k*4+row]*c[col*4+k];return v;});}
 function load(i,offset,count){const a=selected(i);integer(count,'effect vertex count',1,16);integer(offset,'effect vertex offset',0,BYTES-count*16);if(offset%16)throw new RangeError('Invalid effect vertex alignment');
  const short=p=>((a[p]<<8|a[p+1])<<16)>>16;
  return Array.from({length:count},(_,j)=>{const p=offset+j*16;return {position:[short(p),short(p+2),short(p+4)],st:[short(p+8),short(p+10)],alpha:a[p+15]};});
 }
 function draw(vertices,indices){
  if(!color||!texture||!mode)throw new RangeError('Effect draw requires material and texture state');
  if(!Array.isArray(indices)||![3,4].includes(indices.length))throw new RangeError('Invalid effect primitive');indices.forEach(i=>integer(i,'effect vertex index',0,vertices.length-1));
  const expanded=indices.length===3?indices:[indices[0],indices[1],indices[2],indices[0],indices[2],indices[3]],positions=[],uvs=[],colors=[],alphas=[];
  for(const index of expanded){const v=vertices[index],p=v.position;
   for(let axis=0;axis<3;axis++){const n=(matrix[axis]*p[0]+matrix[4+axis]*p[1]+matrix[8+axis]*p[2]+matrix[12+axis])*worldScale;if(!Number.isFinite(n))throw new RangeError('Nonfinite effect world position');positions.push(n);}
   uvs.push(v.st[0]/2048,1-v.st[1]/(texture.family==='wake'?4096:2048));colors.push(...color.slice(0,3).map(v=>v/255));alphas.push(v.alpha/255);
  }
  draws.push({...texture,depthTest:mode==='surface',positions,uvs,colors,alphas});
 }
 for(const op of operations){
  switch(op.kind){
   case 'presentationEffectVertexWrite':if(![1,2].includes(op.width))throw new RangeError('Invalid effect vertex width');write(op.bufferIndex,op.byteOffset,op.width,op.value);break;
   case 'presentationSceneMatrixWrite':if(op.width!==2)throw new RangeError('Invalid effect matrix width');write(op.bufferIndex,0x4140+integer(op.matrixIndex,'effect matrix index',0,453)*64+integer(op.byteOffset,'effect matrix offset',0,62),2,op.value);break;
   case 'presentationEffectListBegin':
    if(listOpen)throw new RangeError('Nested effect draw list');selected(op.bufferIndex);integer(op.byteOffset,'effect list offset',0,0x4140-8);if(op.byteOffset%8)throw new RangeError('Invalid effect list alignment');listOpen=true;cache=null;color=null;texture=null;mode=null;matrix=identity();break;
   case 'presentationEffectListEnd':if(!listOpen)throw new RangeError('Effect list end without begin');listOpen=false;break;
   case 'presentationEffectPipeline':if(!['surface','droplet'].includes(op.mode))throw new RangeError('Invalid effect pipeline');mode=op.mode;if(mode==='surface')matrix=identity();break;
   case 'presentationEffectColor':color=rgba(op.rgba);break;
   case 'presentationTransientMaterial':color=rgba(op.rgba);mode='surface';break;
   case 'presentationEffectTexture':{
    const counts={spray:4,splash:7,wake:4,droplet:1};if(!Object.hasOwn(counts,op.family))throw new RangeError('Invalid effect texture family');integer(op.textureFrame,'effect texture frame',0,counts[op.family]-1);texture={family:op.family,textureFrame:op.textureFrame};break;
   }
   case 'presentationEffectVertices':cache=load(op.bufferIndex,op.byteOffset,op.vertexCount);break;
   case 'presentationEffectPrimitive':if(!cache)throw new RangeError('Effect primitive requires loaded vertices');draw(cache,op.indices);break;
   case 'presentationSceneMatrixBind':{const m=packed(op.bufferIndex,op.matrixIndex);if(op.mode==='load')matrix=m;else if(op.mode==='multiply')matrix=multiply(matrix,m);else throw new RangeError('Invalid effect matrix binding');break;}
   case 'presentationTransientDraw':integer(op.slot,'transient slot',0,7);integer(op.textureFrame,'transient frame',0,6);texture={family:'splash',textureFrame:op.textureFrame};draw(splashVertices,[3,0,1,2]);break;
   default:throw new RangeError(`Unsupported effect renderer operation ${op.kind}`);
  }
 }
 if(listOpen)throw new RangeError('Unfinished effect draw list');
 return freeze({graphicsBuffers,draws,diagnostic:{triangles:draws.reduce((n,d)=>n+d.positions.length/9,0),graphicsExecuted:false}});
}
