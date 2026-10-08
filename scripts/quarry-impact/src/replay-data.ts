import {isArenaId,resolveArenaId,type ArenaId} from './arena-id';
import {validEngineStall} from './engine-stall';
import {normalizeSetup,type Setup} from './garage';
import {isCarKind,type CarKind,type Mode} from './rules';
import {isCourseId,resolveCourseId,type CourseId} from './course-id';
export const REPLAY_STRIDE=56,REPLAY_HZ=20,REPLAY_MAX_SECONDS=1800,REPLAY_MAX_BYTES=192*1024*1024;
export type VisualEvent={kind:'hit'|'repair'|'jump';pose:number[];point?:number[];direction?:number[];damage?:number;health?:number;paint?:number;scar?:boolean};
export type ReplayEvent=VisualEvent&{time:number;car:number};
export type ReplayCar={id:number;kind:CarKind;setup:Setup};
export type ReplayMeta={version:1;mode:Mode;reverse:boolean;cars:ReplayCar[];props:number;created:string;tyreModel?:1;engineModel?:1;courseId?:CourseId;arenaId?:ArenaId};
/** Resolve without adding a property to historical metadata or accepting a
 * saved-preference fallback for an explicitly unsupported recording. */
export function replayCourseId(meta:Pick<ReplayMeta,'mode'|'courseId'|'arenaId'>):CourseId{
  if(meta.courseId!==undefined&&!isCourseId(meta.courseId))throw Error('This replay uses an unsupported course.');
  if(meta.arenaId!==undefined&&!isArenaId(meta.arenaId))throw Error('This replay uses an unsupported arena.');
  if(meta.arenaId!==undefined&&(meta.mode!=='derby'||resolveCourseId(meta.courseId)!=='quarry-v1'))throw Error('This arena supports demolition events only.');
  const id=resolveCourseId(meta.courseId);
  if(id!=='quarry-v1'&&meta.mode!=='race'&&meta.mode!=='playground')throw Error('This course supports circuit races and free drive only.');
  return id;
}
/** QIR1 legacy poses retain 56 floats. Model 1 also records four contact
 * planes, loads and contact flags so replayed flat patches match live tyres.
 * Engine model 1 adds one restart counter; omitted models keep old strides. */
export const replayCarStride=(meta:Pick<ReplayMeta,'tyreModel'|'engineModel'>)=>REPLAY_STRIDE+(meta.tyreModel===1?24:0)+(meta.engineModel===1?1:0);
export type ReplayFrame={time:number;values:Float32Array};
export type ReplayDocument={meta:ReplayMeta;frames:ReplayFrame[];events:ReplayEvent[];limited:boolean};
export class ReplayRecorder {
  readonly frames:ReplayFrame[]=[];readonly events:ReplayEvent[]=[];limited=false;
  readonly stride:number;
  constructor(readonly meta:ReplayMeta){replayCourseId(meta);this.stride=meta.cars.length*replayCarStride(meta)+meta.props*7;}
  capture(time:number,values:()=>Float32Array,force=false){
    if(this.limited||!Number.isFinite(time)||time<0)return;
    const last=this.frames.at(-1);if(last&&(time<=last.time||!force&&time-last.time<1/REPLAY_HZ-1e-6))return;
    if(time>REPLAY_MAX_SECONDS||this.frames.length>=REPLAY_HZ*REPLAY_MAX_SECONDS+2||(this.frames.length+1)*this.stride*4>REPLAY_MAX_BYTES){this.limited=true;return;}
    const frame=values();if(frame.length!==this.stride||!frame.every(Number.isFinite))throw Error('Invalid replay frame');
    this.frames.push({time,values:frame});
  }
  event(car:number,time:number,event:VisualEvent){
    if(this.limited)return;
    if(time>REPLAY_MAX_SECONDS||this.events.length>=50000){this.limited=true;return;}
    if(!Number.isInteger(car)||car<0||car>=this.meta.cars.length||!Number.isFinite(time)||time<0||time<(this.events.at(-1)?.time??0))return;
    this.events.push({...event,car,time});
  }
  document():ReplayDocument{return {meta:this.meta,frames:this.frames.slice(),events:this.events.slice(),limited:this.limited};}
}
export function replayBracket(frames:readonly ReplayFrame[],time:number){
  if(!frames.length)throw Error('Replay has no frames');
  let lo=0,hi=frames.length-1;
  while(lo<hi){const m=Math.ceil((lo+hi)/2);if(frames[m].time<=time)lo=m;else hi=m-1;}
  const a=frames[lo],b=frames[Math.min(lo+1,frames.length-1)];
  return {a,b,alpha:a===b?0:Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time)))};
}
/** Uncompressed QIR1: 8-byte prefix, bounded UTF-8 header, then packed float frames. */
export function encodeReplay(doc:ReplayDocument):Uint8Array{
  const header=new TextEncoder().encode(JSON.stringify({meta:doc.meta,times:doc.frames.map(f=>f.time),events:doc.events,limited:doc.limited}));
  const floats=doc.frames[0]?.values.length??0,bytes=new Uint8Array(8+header.length+doc.frames.length*floats*4);
  bytes.set([81,73,82,49]);new DataView(bytes.buffer).setUint32(4,header.length,true);bytes.set(header,8);
  let offset=8+header.length;for(const f of doc.frames){bytes.set(new Uint8Array(f.values.buffer,f.values.byteOffset,f.values.byteLength),offset);offset+=f.values.byteLength;}
  return bytes;
}
const fail=()=>{throw Error('This is not a supported Quarry Impact replay.');};
const finiteArray=(v:unknown,n:number,max=1e7):v is number[]=>Array.isArray(v)&&v.length===n&&v.every(x=>typeof x==='number'&&Number.isFinite(x)&&Math.abs(x)<=max);
const validQuaternion=(v:ArrayLike<number>,i:number)=>{const n=v[i]**2+v[i+1]**2+v[i+2]**2+v[i+3]**2;return n>.99&&n<1.01;};
export function decodeReplay(bytes:Uint8Array):ReplayDocument{
  if(bytes.byteLength<8||bytes.byteLength>224*1024*1024||bytes.slice(0,4).join(',')!=='81,73,82,49')return fail();
  const length=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(4,true);if(length>32*1024*1024||length+8>bytes.length)return fail();
  let h:any;try{h=JSON.parse(new TextDecoder().decode(bytes.subarray(8,8+length)));}catch{return fail();}
  const m=h?.meta;if(m?.version!==1||!['race','derby','playground'].includes(m.mode)||typeof m.reverse!=='boolean'||!Array.isArray(m.cars)||m.cars.length<1||m.cars.length>24||!Number.isInteger(m.props)||m.props<0||m.props>256||m.tyreModel!==undefined&&m.tyreModel!==1||m.engineModel!==undefined&&m.engineModel!==1)return fail();
  replayCourseId(m);
  const ids=new Set<number>();const cars:ReplayCar[]=m.cars.map((c:any)=>{if(!Number.isInteger(c.id)||c.id<0||c.id>1000||ids.has(c.id)||!isCarKind(c.kind))return fail();ids.add(c.id);return{id:c.id,kind:c.kind,setup:normalizeSetup(c.setup,c.kind)};});
  if(!Array.isArray(h.times)||h.times.length<1||h.times.length>REPLAY_HZ*REPLAY_MAX_SECONDS+2)return fail();
  let prior=-1;for(const t of h.times){if(typeof t!=='number'||!Number.isFinite(t)||t<0||t>REPLAY_MAX_SECONDS||t<=prior)return fail();prior=t;}
  const carStride=replayCarStride(m),stride=cars.length*carStride+m.props*7,expected=stride*h.times.length*4;if(expected>REPLAY_MAX_BYTES||8+length+expected!==bytes.length)return fail();
  if(!Array.isArray(h.events)||h.events.length>50000)return fail();
  prior=-1;const events:ReplayEvent[]=h.events.map((e:any)=>{
    if(!e||!['hit','repair','jump'].includes(e.kind)||!Number.isInteger(e.car)||e.car<0||e.car>=cars.length||typeof e.time!=='number'||!Number.isFinite(e.time)||e.time<prior||e.time<0||e.time>REPLAY_MAX_SECONDS||(!finiteArray(e.pose,7)||!validQuaternion(e.pose,3)))return fail();prior=e.time;
    const base:ReplayEvent={kind:e.kind,car:e.car,time:e.time,pose:e.pose};
    if(e.kind==='hit'){if(!finiteArray(e.point,3,1000)||!finiteArray(e.direction,3,2)||!Number.isFinite(e.damage)||e.damage<0||e.damage>1000||e.scar!==undefined&&typeof e.scar!=='boolean'||!Number.isFinite(e.health)||e.health<0||e.health>100||e.paint!==undefined&&(!Number.isInteger(e.paint)||e.paint<0||e.paint>0xffffff))return fail();return {...base,point:e.point,direction:e.direction,damage:e.damage,health:e.health,...(e.paint===undefined?{}:{paint:e.paint}),...(e.scar===undefined?{}:{scar:e.scar})};}
    return base;
  });
  const packed=bytes.slice(8+length),values=new Float32Array(packed.buffer);if(!values.every(v=>Number.isFinite(v)&&Math.abs(v)<=1e7))return fail();
  const frames:ReplayFrame[]=h.times.map((time:number,i:number)=>({time,values:values.subarray(i*stride,(i+1)*stride)}));
  for(const f of frames){
    for(let i=0;i<cars.length;i++){
      const o=i*carStride;if(m.engineModel===1&&!validEngineStall(f.values[o+carStride-1]))return fail();if(!validQuaternion(f.values,o+3))return fail();
      for(let j=0;j<4;j++){
        if(!validQuaternion(f.values,o+18+j*8))return fail();
        if(m.tyreModel===1){
          const k=o+REPLAY_STRIDE+j*6,load=f.values[k+4],active=f.values[k+5];
          if(load<0||load>2.500001||(active!==0&&active!==1))return fail();
          if(active&&Math.abs(Math.hypot(f.values[k],f.values[k+1],f.values[k+2])-1)>.001)return fail();
        }
      }
    }
    for(let i=0;i<m.props;i++)if(!validQuaternion(f.values,cars.length*carStride+i*7+3))return fail();
  }
  return {meta:{version:1,mode:m.mode,reverse:m.reverse,cars,props:m.props,created:typeof m.created==='string'?m.created.slice(0,40):'',...(m.tyreModel===1?{tyreModel:1 as const}:{}),...(m.engineModel===1?{engineModel:1 as const}:{}),...(m.courseId===undefined?{}:{courseId:m.courseId}),...(m.arenaId===undefined?{}:{arenaId:m.arenaId})},frames,events,limited:h.limited===true};
}
export async function readReplayFile(file:File):Promise<ReplayDocument>{
  if(file.size>64*1024*1024)throw Error('Replay file exceeds the 64 MB compressed limit.');
  const stream=file.stream().pipeThrough(new DecompressionStream('gzip')),reader=stream.getReader();let total=0;const chunks:Uint8Array[]=[];
  try{for(;;){const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>224*1024*1024){await reader.cancel();throw Error('Replay expands beyond the supported size.');}chunks.push(value);}}finally{reader.releaseLock();}
  const all=new Uint8Array(total);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}return decodeReplay(all);
}
export async function replayFile(doc:ReplayDocument):Promise<Blob>{return new Response(new Blob([encodeReplay(doc) as BlobPart]).stream().pipeThrough(new CompressionStream('gzip'))).blob();}
