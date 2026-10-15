// Numeric75310 reset before its terminal EED70 consumer. Course loading,
// primary geometry, physical placement and the terminal HUD/startup are external.
// One raw word span retains tables, records, setup lists and unrelated history.
export const NATIVE_RACE_RESET_WORD_BASE=0x801c1f94;
export const NATIVE_RACE_RESET_WORD_COUNT=(0x3a08-0x1f94)/4;
const F=Math.fround,MIN=-2147483648,MAX=2147483647,layouts=new WeakSet();
const bits=new DataView(new ArrayBuffer(4)),BASE=0x1f94,END=0x3a08;
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${n} must fit finite float32`);return F(v);}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires ${count} unsigned words`);return Array.from(v,x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function point(p,n){record(p,n);return {x:scalar(p.x,n+'.x'),z:scalar(p.z,n+'.z')};}
function toBits(v){bits.setFloat32(0,scalar(v,'reset arithmetic'),false);return bits.getUint32(0,false);}
function copyState(s){record(s,'retained reset state');return {raceWords1f94:words(s.raceWords1f94,'raceWords1f94',NATIVE_RACE_RESET_WORD_COUNT),
 cold8224:integer(s.cold8224,'cold8224'),clockStopped817c:integer(s.clockStopped817c,'clockStopped817c')};}

/** The complete source window1f94..3a04 is ONE owner, including all four222-
 * word records, persistent course tables, setup26c0, rank3990 and projection.
 * Unwritten words retain their exact bits. This is supplied runtime state,
 * never a BSS-zero or default-record initializer. External cold/clock words
 * are separate because their actual addresses are outside this window. */
export function createNativeRaceResetState(value){return freeze(copyState(value));}
export function nativeRaceResetSnapshot(state){return copyState(state);}

/** Complete stored primary rows and selected source numeric tables only.
 * primaryCount on each call chooses an active prefix; an explicitly supplied
 * row may still be read by the source's unguarded finish walk at count0.
 * Reference+24/+28 is distinct from the current contact-displaced center.
 * PreviousB4 is distinct from the ordinary judge's A8 link. */
export function createNativeRaceResetLayout(value){
 record(value,'reset layout');const {nodes}=value;
 if(!Array.isArray(nodes)||nodes.length<1||nodes.length>64)throw new RangeError('Supply1..64 stored source primary rows');
 const copied=Array.from(nodes,(n,i)=>{
  record(n,'reset node');if(integer(n.sourceRow,'sourceRow',0,63)!==i)throw new RangeError('Use complete raw source array order');
  return {sourceRow:i,referenceNativeXZ:point(n.referenceNativeXZ,'reference+24/+28'),
   classification98:integer(n.classification98,'classification98'),checkpointFlag9c:integer(n.checkpointFlag9c,'checkpointFlag9c'),
   nextSourceRowA0:integer(n.nextSourceRowA0,'nextSourceRowA0',0,nodes.length-1),
   alternateNextSourceRowA4:integer(n.alternateNextSourceRowA4,'alternateNextSourceRowA4',-1,nodes.length-1),
   previousSourceRowB4:integer(n.previousSourceRowB4,'previousSourceRowB4',0,nodes.length-1)};
 });
 if(!Array.isArray(value.boundaryNativeXZ)||value.boundaryNativeXZ.length>1024)throw new RangeError('Supply bounded boundary-family coordinates');
 if(!Array.isArray(value.objectKinds4c)||value.objectKinds4c.length>64)throw new RangeError('Supply bounded current runtime object kinds');
 const layout=freeze({nodes:copied,boundaryNativeXZ:Array.from(value.boundaryNativeXZ,p=>point(p,'boundary position')),
  objectKinds4c:Array.from(value.objectKinds4c,k=>integer(k,'object kind4c')),
  checkpointSeconds:integer(value.checkpointSeconds,'selected unsigned first checkpoint byte',0,255),
  checkpointSlackNative:scalar(value.checkpointSlackNative,'selected checkpoint slack'),
  recordTimeTemplateWords:words(value.recordTimeTemplateWords,'actual time template',5),
  stuntTemplateWords:words(value.stuntTemplateWords,'actual score template',4)});
 layouts.add(layout);return layout;
}

/** Full numeric reset before EED70. Source geometry/loading and live scene
 * controls are explicit. The source finish traversal has no guard; this API
 * rejects a nonclosing graph instead of inventing an empty-course route.
 * Fixed source memory bounds reject a spill, including oversized record/table
 * accesses. The returned footprint identifies writes even when bits agree;
 * it is not a claim about intermediate repeated-store instruction order.
 * Apply all numeric writes, then execute the terminal startup recipe before
 * admitting a source-initialized race. No source RNG is consumed here. */
export function prepareNativeRaceReset(layout,state,input){
 if(!layouts.has(layout))throw new TypeError('Expected compiled native reset layout');record(input,'source reset context');
 const next=copyState(state),a=next.raceWords1f94,written=new Set();
 const count=integer(input.primaryCount,'primaryCount',0,layout.nodes.length),racers=integer(input.racerCount,'racerCount',0,4),
  course=integer(input.courseIndex,'courseIndex',0,11),mode=integer(input.mode620,'mode620'),main=integer(input.main638,'main638'),
  finish=integer(input.finishSourceRow,'finishSourceRow',0,layout.nodes.length-1),difficulty=integer(input.difficulty,'difficulty'),
  reverse=integer(input.reverseDab68,'reverseDab68',-32768,32767),special=integer(input.stateE6f8,'stateE6f8'),
  forced=integer(input.forceFirst8228,'forceFirst8228'),primary=integer(input.primaryHumanIndex,'primaryHumanIndex',0,3),
  demo=integer(input.demoOffset5438,'demoOffset5438');
 const at=address=>{if(!Number.isInteger(address)||address<BASE||address>=END||(address-BASE)%4)throw new RangeError('Reset source access outside canonical window');return(address-BASE)/4;};
 const read=address=>a[at(address)],signed=address=>read(address)|0;
 const put=(address,v)=>{const i=at(address);a[i]=v>>>0;written.add(i);};
 const float=(address,v)=>put(address,toBits(v));
 const clear=(start,end)=>{for(let p=start;p<=end;p+=4)put(p,0);};
 const writeRow=(address,row)=>row.forEach((v,j)=>put(address+j*4,v));
 const diagnostic={coldTablesReset:next.cold8224!==0,routeRows:[],main8Cursors:[],recordWrittenCounts:[],forcedOrderIndex:null};
 if(next.cold8224!==0){
  next.cold8224=0;
  for(let i=0;i<9;i++)writeRow(0x220c+i*20,layout.recordTimeTemplateWords);
  for(let i=0;i<3;i++){
   writeRow(0x2374+i*20,layout.recordTimeTemplateWords);writeRow(0x2464+i*20,layout.recordTimeTemplateWords);
  }
  for(let i=0;i<27;i++)put(0x25e4+i*4,0xffffffff);
  for(let i=0;i<9;i++)writeRow(0x2898+i*16,layout.stuntTemplateWords);
  [3,2,1,0].forEach((v,i)=>put(0x26c0+i*4,v));
 }
 put(0x1fc4,0);
 let minX=32767,maxX=-32768,minZ=32767,maxZ=-32768,maxAbs=0;
 const extent=p=>{
  if(p.x<minX)minX=p.x;if(maxX<p.x)maxX=p.x;if(p.z<minZ)minZ=p.z;if(maxZ<p.z)maxZ=p.z;
  const x=p.x<0?-p.x:p.x,z=p.z<0?-p.z:p.z;if(maxAbs<x)maxAbs=x;if(maxAbs<z)maxAbs=z;
 };
 for(let i=0;i<count;i++)extent(layout.nodes[i].referenceNativeXZ);
 layout.boundaryNativeXZ.forEach(extent);
 if(maxAbs<4096){maxAbs=4096;minX=minZ=-4096;maxX=maxZ=4096;}
 for(const [address,value]of [[0x1f94,maxAbs],[0x1f9c,minX],[0x1fa0,maxX],[0x1fa4,minZ],[0x1fa8,maxZ],
  [0x1fac,F(maxX-minX)],[0x1fb0,F(maxZ-minZ)],[0x1f98,F(160/F(maxAbs+maxAbs))],
  [0x1fb4,F(F(maxAbs*F(1.414199948310852))+2048)]])float(address,value);
 for(let i=0;i<count;i++)put(0x3890+i*4,0);
 for(let i=0;i<count;i++){
  const n=layout.nodes[i];for(const row of [n.nextSourceRowA0,n.alternateNextSourceRowA4])
   if(row!==-1)put(0x3890+row*4,(signed(0x3890+row*4)+1)|0);
 }
 for(let i=0;i<count;i++)put(0x3890+i*4,Number(signed(0x3890+i*4)!==1));
 put(0x378c,0);let row=finish,nesting=0;const visited=new Set();
 do{
  if(visited.has(row))throw new RangeError('Source A0 route does not close at its finish');visited.add(row);
  const node=layout.nodes[row];
  if(node.classification98===6){
   if(nesting===0){put(0x3790+diagnostic.routeRows.length*4,row);diagnostic.routeRows.push(row);}
   nesting=(nesting+1)|0;
  }else{
   if(signed(0x3890+row*4)!==0&&nesting>0)nesting=(nesting-1)|0;
   if(nesting===0){put(0x3790+diagnostic.routeRows.length*4,row);diagnostic.routeRows.push(row);}
  }
  row=node.nextSourceRowA0;
 }while(row!==finish);
 put(0x378c,diagnostic.routeRows.length);
 let checkpoints=0;for(let i=0;i<count;i++)if(layout.nodes[i].checkpointFlag9c===1)checkpoints++;
 put(0x1fc0,checkpoints);put(0x3718,racers);
 const ranges=[[0,0x10],[0x1c,0x28],[0x12c,0x19c],[0x1a4,0x2c8],[0x2d0,0x2d0],[0x2d8,0x334],[0x33c,0x33c],[0x350,0x350]];
 for(let i=0;i<racers;i++){
  const base=0x2938+i*0x378,startSize=written.size;
  for(const [lo,hi]of ranges)clear(base+lo,base+hi);
  for(let j=0;j<count;j++)put(base+0x2c+j*4,0);
  put(base+0x1c,-1);put(base+0x12c,course===0||mode===11?5:0);put(base+0x164,mode===11?1:0);
  put(base+0x170,599999);put(base+0x2c4,layout.checkpointSeconds*1000);put(base+0x350,0x801aee20);
  let judge=finish,navigation=finish;
  if(main===8){
   const marker=11+(((i+demo)|0)&3);let found=-1;
   for(let j=0;j<count;j++)if(layout.nodes[j].classification98===marker){found=j;break;}
   const start=found>=0?layout.nodes[found].previousSourceRowB4:finish;
   judge=start;navigation=start;const kind=layout.nodes[start].classification98;
   let budget=count-1;
   if(kind>=2&&budget>0){judge=layout.nodes[start].previousSourceRowB4;
    while(true){budget--;if(layout.nodes[judge].classification98<2||budget<1)break;judge=layout.nodes[judge].previousSourceRowB4;}
   }
   budget=count-1;
   if(kind===1&&budget>0){navigation=layout.nodes[start].previousSourceRowB4;
    while(true){budget--;if(layout.nodes[navigation].classification98!==1||budget<1)break;navigation=layout.nodes[navigation].previousSourceRowB4;}
   }
   diagnostic.main8Cursors.push({racerIndex:i,marker,foundSourceRow:found,startSourceRow:start,judge,navigation});
  }
  put(base+0x0c,judge);put(base+0x310,judge);put(base+0x10,navigation);
  diagnostic.recordWrittenCounts.push(written.size-startSize);
 }
 next.clockStopped817c=1;
 for(const address of [0x1fd8,0x1fd4,0x1fdc,0x1fd0,0x1fcc,0x1fc8,0x2930,0x2928,0x2658,0x2654,0x2650])put(address,0);
 float(0x39c4,layout.checkpointSlackNative);put(0x39b8,difficulty===0?0:difficulty===1?4:5);
 if(course===3){const selected=layout.objectKinds4c.findIndex(v=>v===2);put(0x39c0,selected<0?0:selected);}
 if(mode===11){clear(0x26d0,0x26e4);clear(0x39cc,0x3a04);put(0x292c,0);put(0x39c8,0);}
 float(0x39b0,100000);float(0x39b4,-100000);
 if(reverse===0){put(0x1fe4,read(0x1ff0+course*60));put(0x1fe8,read(0x22c0+course*20));}
 else{put(0x1fe4,read(0x23b0+course*20));put(0x1fe8,0);}
 put(0x1fe0,read(0x1fe8));
 if(special!==0){[3,0,1,2].forEach((v,i)=>put(0x26c0+i*4,v));clear(0x2660,0x26bc);}
 else if(mode===1||course===9)for(let i=0;i<racers;i++)put(0x26c0+i*4,i);
 if(forced!==0){
  const target=(forced-1)|0;let found=0;while(found<racers&&signed(0x26c0+found*4)!==target)found++;
  if(found<racers&&found!==primary){const other=read(0x26c0+primary*4);put(0x26c0+found*4,other);put(0x26c0+primary*4,target);diagnostic.forcedOrderIndex=found;}
 }
 if(course!==0)for(let i=0;i<racers;i++)put(0x293c+i*0x378,read(0x26c0+i*4));
 return freeze({state:next,effects:[{kind:'externalCall',consumer:'startupOverlayEed70'}],
  writeFootprint:{raceWordIndices:[...written].sort((a,b)=>a-b),externalFields:[...(state.cold8224!==0?['cold8224']:[]),'clockStopped817c']},diagnostic});
}
