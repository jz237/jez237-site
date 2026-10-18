// Source783AC geometry and checkpoint slice78B44..7903C. Terminal finish,
// lap/visited flags and unlock checks follow separately. No ordinary-buoy
// anchor offset, region sharing, direction switch or checkpoint slack applies.
import {nativeStuntCheckpointTime} from './native-stunt-scoring.js';
const F=Math.fround,BASE=0x1f94;
const bits=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid finite ${n}`);return F(v);}
function point(p,n){return {x:scalar(p?.x,`${n}.x`),z:scalar(p?.z,`${n}.z`)};}
const add=(a,b)=>scalar(F(a+b),'sum'),sub=(a,b)=>scalar(F(a-b),'difference'),mul=(a,b)=>scalar(F(a*b),'product');
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function float(v){bits.setUint32(0,v,false);return scalar(bits.getFloat32(0,false),'retained scratch');}

/** Actual selected primary node, canonical scratch3780/3788 and record words
 * are required. apertureAxisXZ reads78/7C, NOT passing right80/84; endpoint B
 * is18/20, NOT endpoint A. Even finished/DQ riders can advance the route here,
 * but their crossing never grants time or resets repeats.
 *
 * The caller has already executed prelude and move scoring. This consumer
 * returns continueFinish for the later terminal-finish/lap branch; a crossing
 * alone does not finish the run. Nonfinish refill bytes are the actual selected
 * course's table row, indexed by the retained checkpoint index before increment.
 */
export function prepareNativeStuntCheckpoint({raceWords1f94,globals},input={}){
 if(!Array.isArray(raceWords1f94)||raceWords1f94.length!==1693)throw new RangeError('Supply canonical raceWords1f94');
 const race=raceWords1f94.map(v=>integer(v,'race word',0,0xffffffff)),operations=[];
 const slot=integer(input.racerIndex,'racerIndex',0,3),base=0x2938+slot*0x378;
 const read=a=>race[(a-BASE)/4]|0;
 function write(a,v){const wordIndex=(a-BASE)/4;race[wordIndex]=v>>>0;operations.push({kind:'raceWordWrite',wordIndex,value:v>>>0});}
 const n=input.selectedNode,row=integer(n?.sourceRow,'sourceRow',0,63);
 if(row!==read(base+0x0c))throw new RangeError('Selected node must match canonical nextPrimary2944');
 const center=point(n.centerNativeXZ,'center'),forward=point(n.forwardXZ,'forward70/74'),flag=integer(n.checkpointFlag9c,'checkpointFlag9c');
 const p={x:float(race[(0x3780-BASE)/4]),z:float(race[(0x3788-BASE)/4])};
 let aperture=null,projection=null;
 if(flag===1){
  const axis=point(n.apertureAxisXZ,'aperture78/7c'),endpoint=point(n.endpointBNativeXZ,'endpointB18/20');
  projection=add(mul(axis.x,sub(p.x,endpoint.x)),mul(sub(p.z,endpoint.z),axis.z));
  aperture=projection>=0;
  if(aperture){const half=scalar(n.halfWidthNative8c,'halfWidth8c');aperture=projection<=add(half,half);}
 }
 let x=sub(p.x,center.x),z=sub(p.z,center.z),length=scalar(Math.sqrt(add(mul(x,x),mul(z,z))),'distance');
 if(length>0){x=scalar(F(x/length),'unitX');z=scalar(F(z/length),'unitZ');}
 const dot=add(mul(forward.x,x),mul(forward.z,z)),cross=sub(mul(forward.z,x),mul(forward.x,z));
 if(read(base+0x1c)===-1&&dot>0)write(base+0x1c,cross>=0?1:0);
 else if(dot<=0)write(base+0x1c,-1);
 if(read(base+0x20)===0&&read(base+0x1c)===-1)write(base+0x20,1);
 write(base+0x28,0);
 let crossed=false;
 if(read(base+0x20)!==0&&read(base+0x1c)>=0){
  if(flag===1&&!aperture){write(base+0x20,0);write(base+0x2f0,1);}
  else{crossed=true;write(base+0x2f0,0);}
 }
 if(crossed){write(base+0x1c,-1);write(base+0x20,1);write(base+0x0c,integer(n.nextSourceRowA0,'nextSourceRowA0',0,63));}
 const continueFinish=crossed&&read(base+0x2f4)===0&&read(base+0x2ec)===0;
 const diagnostic={crossed,continueFinish,sourceRow:row,aperture,projectionNative:projection,forwardDot:dot,crossingOffsetNative:null,timePoints:0};
 if(continueFinish&&flag===1&&read(base)>0){
  const finish=row===integer(globals?.finishSourceRow,'finishSourceRow',0,63),old=point(input.priorBodyPointNativeXZ,'priorBodyBE4/BEC');
  if(!finish)for(const a of [0x39e4,0x39e0,0x39dc,0x39d8])write(a,0);
  const plane=q=>add(mul(forward.x,sub(q.x,center.x)),mul(sub(q.z,center.z),forward.z));
  const timing=nativeStuntCheckpointTime({currentPlaneDistance:plane(p),previousPlaneDistance:plane(old),remainingClockNative:read(base+0x2c4)});
  const cp=read(base+0x164),offset=(0x184+(read(base)<<5)+(cp<<2))|0;
  if(offset<0||offset>0x374)throw new RangeError('Checkpoint time write escapes the selected record');
  write(base+offset,(read(base+0x19c)-timing.crossingOffsetNative)|0);write(base+0x334,0);
  if(timing.points>0)operations.push({kind:'stuntAwardEnqueue',award:{kind:'time',points:timing.points,finish}});
  if(finish)write(0x39d4,timing.points);
  else{
   const seconds=input.checkpointSecondsByIndex;
   if(!Array.isArray(seconds)||cp<0||cp>=seconds.length)throw new RangeError('Supply the source checkpoint refill byte at the actual index');
   write(base+0x2c4,integer(seconds[cp],'checkpoint seconds',0,255)*1000);
   operations.push({kind:'hudWrite',byteOffset:0x8a94-0x7788,width:4,value:20},
    {kind:'externalCall',consumer:'800c37f4',arguments:[51,0]});
  }
  write(base+0x164,(cp+1)|0);
  if(integer(n.classification98,'classification98')===3)write(base+0x164,0);
  diagnostic.crossingOffsetNative=timing.crossingOffsetNative;diagnostic.timePoints=timing.points;
 }
 return freeze({operations,diagnostic});
}
