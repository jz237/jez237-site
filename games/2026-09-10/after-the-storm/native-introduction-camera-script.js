import {NATIVE_INTRODUCTION_CAMERA_SCRIPTS} from './native-introduction-camera-data.js';
import {prepareNativeCameraPathSample} from './native-camera-path.js';
const HUD=0x80227788;
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,n,min=0,max=0xffffffff){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid introduction script ${n}`);return v;}

/** Complete DFCB8 with every callback used by the11 introduction sequences.
 * Commands are decoded numeric data, resolved through explicit source resource
 * IDs. Every callback runs before duration/cursor processing on that frame.
 * Zero-duration setup commands continue immediately; -2 holds indefinitely.
 * All auxiliary targets, spline counters and cursors share retained HUD words.
 * This does not run DFC48 smoothing, course actors, environment effects or GPU.
 */
export function prepareNativeIntroductionCameraScript({hudWords7788,cameraIndex=0,resources=NATIVE_INTRODUCTION_CAMERA_SCRIPTS}={}){
 integer(cameraIndex,'cameraIndex',0,1);
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!Number.isInteger(v)||v<0||v>0xffffffff))
  throw new RangeError('Supply canonical hudWords7788[1442]');
 const hud=[...hudWords7788],operations=[],callbacks=[],s=0x80228058+cameraIndex*0x38;
 function index(a){integer(a,'owner address',HUD,HUD+hud.length*4-4);if((a-HUD)%4)throw new RangeError('Unaligned introduction script owner');return (a-HUD)/4;}
 const read=a=>hud[index(a)];
 function write(a,v){integer(v,'word');hud[index(a)]=v;operations.push({kind:'hudWrite',byteOffset:a-HUD,width:4,value:v});}
 function copyTemplate(argument,type,count){
  const t=resources.templates?.[argument];
  if(t?.type!==type||!Array.isArray(t.words)||t.words.length!==count)throw new RangeError('Missing introduction camera template');
  const aux=read(s);write(aux,type);t.words.forEach((v,i)=>write(aux+4+i*4,v));
 }
 function resetPaths(count){
  integer(count,'reset count',2,4);const base=read(s+12),remainder=count&3;
  const row=i=>{write(base+i*8+4,0);write(base+i*8,0);};
  for(let i=0;i<remainder;i++)row(i);
  for(let i=remainder;i<count;i+=4)for(const j of [1,2,3,0])row(i+j);
 }
 function samples(argument,vectorCount,scalar){
  const outputs=[],base=read(s+12);let descriptor=argument;
  for(let i=0;i<vectorCount+Number(scalar);i++){
   const dimensions=i<vectorCount?3:1,p=resources.paths?.[descriptor];
   if(p?.channels?.length!==dimensions)throw new RangeError('Missing introduction camera path descriptor');
   const target=base+i*8,q=prepareNativeCameraPathSample({...p,frame:read(target)|0,segment:read(target+4)|0});
   for(const op of q.operations)if(op.kind==='pathStateWrite')write(target+op.wordIndex*4,op.value);
   outputs.push(q.outputWords);descriptor+=(dimensions+2)*4;
  }
  return outputs;
 }
 function command(consumer,argument){
  if(consumer==='801dfe58'){copyTemplate(argument,3,36);return;}
  if(consumer==='801dfe10'){copyTemplate(argument,1,30);return;}
  if(consumer==='801dfdf0'){resetPaths(argument);return;}
  if(!['801dff5c','801e01cc','801e0218','801e0264','801e02b4'].includes(consumer))throw new RangeError('Unsupported introduction camera callback');
  const vectorCount=['801e0218','801e02b4'].includes(consumer)?3:2,scalar=['801e0264','801e02b4'].includes(consumer);
  const values=samples(argument,vectorCount,scalar),aux=read(s);
  const xyz=(offsets,words)=>offsets.forEach((offset,i)=>write(aux+offset,words[i]));
  if(consumer==='801dff5c'){
   xyz([0x5c,0x60,0x64],values[0]);xyz([0x6c,0x70,0x74],values[1]);
  }else{
   xyz([0x5c,0x60,0x64],values[1]);xyz([0x74,0x80,0x8c],values[0]);
   if(vectorCount===3)xyz([0x28,0x2c,0x30],values[2]);
   if(scalar)write(aux+0x3c,values[vectorCount][0]);
  }
 }
 const visited=new Set();
 for(;;){
  const cursor=read(s+4);if(cursor===0)break;
  if(visited.has(cursor))throw new RangeError('Cyclic zero-duration introduction script');visited.add(cursor);
  const row=resources.commands?.[cursor];if(!row)throw new RangeError('Missing introduction camera script command');
  integer(row.duration,'duration',-2147483648,2147483647);integer(row.argument,'argument');
  if(row.consumer!==null){callbacks.push({consumer:row.consumer,argument:row.argument,cursor,counter:read(s+8)|0});command(row.consumer,row.argument);}
  if(row.duration===0){write(s+4,(read(s+4)+12)>>>0);continue;}
  if(row.duration===-1){write(s+8,0);write(s+4,0);break;}
  const counter=(read(s+8)+1)|0;write(s+8,counter>>>0);
  if(row.duration===-2||counter<row.duration){write(s+4,cursor);break;}
  write(s+8,0);write(s+4,(cursor+12)>>>0);break;
 }
 return freeze({operations,hudWords7788:hud,callbacks,diagnostic:{cameraIndex,commandsVisited:visited.size,
  cameraSmoothed:false,courseEffectsExecuted:false,graphicsExecuted:false}});
}
