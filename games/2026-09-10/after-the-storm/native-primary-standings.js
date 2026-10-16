// Independent numeric reconstruction of the post-judge legal-lap/progress
// tail. Primary gate awards, actual lap/finish/timing, rank sorting and course
// table loading remain separate producers. No body or clock is advanced here.
const F=Math.fround,layouts=new WeakSet();
function integer(n,name,min=-2147483648,max=2147483647){if(!Number.isInteger(n)||n<min||n>max)throw new RangeError(`Invalid ${name}`);return n||0;}
function scalar(n,name){if(!Number.isFinite(n)||!Number.isFinite(F(n)))throw new TypeError(`${name} must fit finite float32`);return F(n);}
function point(p,name){if(!p||typeof p!=='object')throw new TypeError(`Expected ${name}`);return {x:scalar(p.x,name+'.x'),z:scalar(p.z,name+'.z')};}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const add=(a,b)=>scalar(a+b,'sum'),sub=(a,b)=>scalar(a-b,'difference'),mul=(a,b)=>scalar(a*b,'product'),div=(a,b)=>scalar(a/b,'quotient');
function regions(rows,name){
 if(!Array.isArray(rows)||rows.length>64)throw new RangeError(`Expected bounded ${name}`);
 return rows.map(row=>{
  if(!Array.isArray(row)||row.length!==4)throw new TypeError(`Expected four ${name} bounds`);
  const r=row.map(n=>scalar(n,name));
  if(r[0]>=r[1]||r[2]>r[3])throw new RangeError('Remove sentinel or reversed region rows');return r;
 });
}
const contains=(r,p)=>r[0]<=p.x&&p.x<=r[1]&&r[2]<=p.z&&p.z<=r[3];
function containing(rows,p){let first=-1,last=-1;for(let i=0;i<rows.length;i++)if(contains(rows[i],p)){if(first<0)first=i;else last=i;}return [first,last];}
function shareRegion(rows,a,b){const x=containing(rows,a),y=containing(rows,b);return x.some(i=>i>=0&&y.includes(i));}
function plane(p,node,center){const dz=sub(p.z,center.z),dx=sub(p.x,center.x);return add(mul(node.forwardXZ.z,dz),mul(dx,node.forwardXZ.x));}

/** Source ARRAY order, including excluded/unrendered nodes. sourceRow must be
 * its actual raw row index. All coordinates are NATIVE, with explicit primary
 * nextA0/previousA8 links, classification and routeGroupC0. These are not the
 * avatar navigation links. Pass the selected original coarse regions and
 * Fortress alternate-region list with sentinels removed. Current displaced
 * buoy centers may be injected at sample time; no endpoint is used here.
 */
export function createNativePrimaryStandingsLayout({nodes,regionsNative,fortressRegionsNative}={}){
 if(!Array.isArray(nodes)||nodes.length<1||nodes.length>64)throw new RangeError('Expected1..64 primary nodes');
 const copied=nodes.map((n,i)=>{
  if(integer(n?.sourceRow,'sourceRow',0,63)!==i)throw new RangeError('Use complete raw primary array order');
  return {sourceRow:i,positionNativeXZ:point(n.positionNativeXZ,'node position'),forwardXZ:point(n.forwardXZ,'node forward'),
   nextSourceRow:integer(n.nextSourceRow,'nextSourceRow',0,nodes.length-1),previousSourceRow:integer(n.previousSourceRow,'previousSourceRow',0,nodes.length-1),
   classification:integer(n.classification,'classification'),routeGroupC0:integer(n.routeGroupC0,'routeGroupC0')};
 });
 const layout=freeze({nodes:copied,regionsNative:regions(regionsNative,'coarse regions'),fortressRegionsNative:regions(fortressRegionsNative,'Fortress regions')});
 layouts.add(layout);return layout;
}

/** Explicit retained fields only. This does not initialize legal lap history
 * from a HUD lap or substitute a default ranking metric.
 */
export function createNativePrimaryStandingsState(s){
 if(!s||typeof s!=='object')throw new TypeError('Expected retained primary standings');
 return freeze({legalLapCounter2c58:integer(s.legalLapCounter2c58,'legalLapCounter2c58'),finishSide2c5c:integer(s.finishSide2c5c,'finishSide2c5c'),
  progressRow2940:integer(s.progressRow2940,'progressRow2940'),metric2c64:scalar(s.metric2c64,'metric2c64'),projectionDistance39a0:scalar(s.projectionDistance39a0,'projectionDistance39a0')});
}
function centers(layout,supplied){
 if(supplied===undefined)return layout.nodes.map(n=>n.positionNativeXZ);
 if(!Array.isArray(supplied)||supplied.length!==layout.nodes.length)throw new RangeError('Expected complete current primary centers');
 const result=Array(layout.nodes.length),seen=new Set();
 for(const n of supplied){const i=integer(n?.sourceRow,'current sourceRow',0,result.length-1);if(seen.has(i))throw new RangeError('Duplicate current primary center');seen.add(i);result[i]=point(n,'current primary center');}
 return result;
}

/** One prepared post-judge tail. The caller supplies real lap2938 and the row
 * stored at2c48 by the earlier primary judge, not AI navigation2948. Legal
 * finish-plane history updates before the source progress projection. Main
 * state!=1/course0 resets row/metric/distance while retaining legal history.
 * Finished/DQ records still update legal history and the selected progress row,
 * but retain prior metric/distance. Scheduling and earlier finish assignment
 * remain external. Supply actual current centers after hull contact and before
 * the source primary-motion pass; complete source initialization is not run.
 */
export function prepareNativePrimaryStandings(layout,state,input){
 if(!layouts.has(layout))throw new TypeError('Expected compiled primary standings layout');
 const next={...createNativePrimaryStandingsState(state)};
 if(!input||typeof input!=='object')throw new TypeError('Expected prepared primary sample');
 const main=integer(input.state638,'state638'),course=integer(input.courseIndex,'courseIndex',0,9);
 if(main!==1||course===0){
  next.progressRow2940=0;next.metric2c64=0;next.projectionDistance39a0=0;
  return freeze({state:next,diagnostic:{active:false,metricWritten:true}});
 }
 const nodes=layout.nodes,positions=centers(layout,input.nodePositionsNative),p=point(input.positionNativeXZ,'craft position');
 const row=integer(input.postJudgeSourceRow2c48,'postJudgeSourceRow2c48',0,nodes.length-1),finish=integer(input.finishSourceRow,'finishSourceRow',0,nodes.length-1);
 const count=integer(input.primaryCount,'primaryCount',0,nodes.length),lap=integer(input.lap2938,'lap2938');
 let neighbor=row,near=false;
 for(let i=0;i<(course===2?5:2);i++){if(neighbor===finish)near=true;neighbor=nodes[neighbor].nextSourceRow;}
 const finishSide=Number(plane(p,nodes[finish],positions[finish])>0),shared=shareRegion(layout.regionsNative,p,positions[finish]);
 if(shared&&near){
  if(finishSide!==0&&next.finishSide2c5c===0&&next.legalLapCounter2c58<lap)next.legalLapCounter2c58=(next.legalLapCounter2c58+1)|0;
  else if(finishSide===0&&next.finishSide2c5c!==0&&next.legalLapCounter2c58> -50)next.legalLapCounter2c58=(next.legalLapCounter2c58-1)|0;
 }
 next.finishSide2c5c=finishSide;
 let selected=row,length=0,projection=0,selectedPlane=null;const walked=[];
 for(let i=0;i<count;i++){
  const n=nodes[selected],center=positions[selected];walked.push(selected);selectedPlane=plane(p,n,center);
  if(selectedPlane>0){
   let origin=selected;
   if(course===3&&n.classification===4&&n.routeGroupC0===1&&layout.fortressRegionsNative.some(r=>contains(r,p)))origin=n.previousSourceRow;
   let dx=sub(positions[n.nextSourceRow].x,positions[origin].x),dz=sub(positions[n.nextSourceRow].z,positions[origin].z);
   length=scalar(Math.sqrt(add(mul(dx,dx),mul(dz,dz))),'segment length');
   if(length>0){dx=div(dx,length);dz=div(dz,length);}
   // Source retains the craft-to-SELECTED-node delta when the special branch
   // changes only the segment's reference origin to its previous node.
   projection=add(mul(sub(p.x,center.x),dx),mul(sub(p.z,center.z),dz));break;
  }
  selected=n.previousSourceRow;
 }
 next.progressRow2940=selected;
 let fraction=length>0?div(projection,length):0;if(fraction>=1)fraction=1;
 const finished=integer(input.finished2c2c,'finished2c2c'),write=finished===0&&integer(input.record2c24,'record2c24')===0;
 if(write){
  const whole=(Math.imul(next.legalLapCounter2c58,1000)+Math.imul(selected,10))|0;
  next.metric2c64=add(F(whole),fraction);next.projectionDistance39a0=projection;
 }
 return freeze({state:next,diagnostic:{active:true,finishRegionShared:shared,nearFinish:near,finishPlaneSide:finishSide,
  walkedRows:walked,testedPlaneNative:selectedPlane,segmentLengthNative:length,projectionNative:projection,fractionNative:fraction,metricWritten:write}});
}

/** Original77F5C, after a result has been selected. Reads the actual primary
 * record's A0/A8 links, forward70/74 and initialized segment length88; these
 * are independent of AI navigation and must retain displaced current centers.
 * Writes are ordered against a detached copy of canonical race storage.
 * Finished/DQ times still receive the source upper clamp, but those slots do
 * not receive estimates or participate in place swaps. This is not a clock,
 * sort comparator, finish-flag producer or persistent-storage operation.
 */
export function prepareNativePrimaryResultEstimates({raceWords1f94,scene,primaryRecordWordsBySourceRow,bodyPositionsNativeBySlot}={}){
 if(!Array.isArray(raceWords1f94)||raceWords1f94.length!==1693)throw new RangeError('Expected canonical1693 race words');
 const race=raceWords1f94.map(v=>integer(v,'race word',0,0xffffffff)),operations=[],estimates=[];
 const at=a=>(a-0x1f94)/4,read=a=>race[at(a)]|0;
 const write=(a,v)=>{const wordIndex=at(a),value=v>>>0;race[wordIndex]=value;operations.push({kind:'raceWordWrite',wordIndex,value});};
 if(read(0x1fd4)!==0)return freeze({operations,diagnostic:{skipped:true,estimates}});
 write(0x1fd4,1);
 const count=integer(scene?.racerCount,'racerCount',0,4),record=i=>0x2938+i*0x378;
 const active=i=>read(record(i)+0x2f4)===0&&read(record(i)+0x2ec)===0;
 const records=new Map();
 function node(i){
  if(!Array.isArray(primaryRecordWordsBySourceRow)||primaryRecordWordsBySourceRow.length<1||primaryRecordWordsBySourceRow.length>64)
   throw new RangeError('Supply actual primary records for unfinished racers');
  integer(i,'primary source row',0,primaryRecordWordsBySourceRow.length-1);
  if(!records.has(i)){
   const row=primaryRecordWordsBySourceRow[i];
   if(!Array.isArray(row)||row.length!==65)throw new RangeError('Expected65 words per primary record');
   records.set(i,row.map(v=>integer(v,'primary word',0,0xffffffff)));
  }
  return records.get(i);
 }
 const data=new DataView(new ArrayBuffer(4));
 const f=(n,a)=>{data.setUint32(0,n[a/4]);return scalar(data.getFloat32(0),'primary float');};
 for(let i=0;i<count;i++)if(active(i)){
  const r=record(i),start=read(r+0xc);let row=start,n=node(row),lap=read(r);
  const previous=node(n[0xa8/4]|0),p=point(bodyPositionsNativeBySlot?.[i],'actual body position');
  let projection=add(mul(f(previous,0x74),sub(p.z,f(previous,8))),mul(sub(p.x,f(previous,0)),f(previous,0x70)));
  if(projection<0)projection=0;
  let distance=sub(1,div(projection,f(previous,0x88)));if(distance<0)distance=0;
  distance=mul(distance,20);
  const speed=sub(80,mul(F(read(r+4)),5)),laps=integer(scene?.configuredLaps728,'configuredLaps728');
  const walked=[],seen=new Set();
  while((n[0x98/4]|0)!==3||lap<laps){
   const key=row+':'+lap;
   if(seen.has(key)||walked.length>=65536)throw new RangeError('Unfinished-racer primary walk does not reach a bounded final finish');
   seen.add(key);walked.push(row);
   if((n[0x98/4]|0)===3)lap=(lap+1)|0;
   distance=add(distance,f(n,0x88));row=n[0xa0/4]|0;n=node(row);
  }
  const estimate=add(F(read(r+0x19c)),mul(div(distance,div(speed,F(1.8))),50));
  const time=integer(Math.trunc(estimate),'estimated signed time');write(r+0x19c,time);
  estimates.push({racerIndex:i,startSourceRow:start,walkedRows:walked,remainingDistanceNative:distance,speedNative:speed,time});
 }
 // This is the original nested in-place pass, including clamp timing. A
 // stable/general sort or clamping all slots first changes prepared outcomes.
 for(let i=0;i<count;i++){
  const r=record(i);if(read(r+0x19c)>=600000)write(r+0x19c,599999);
  if(active(i))for(let j=0;j<count;j++)if(active(j)&&j!==i){
   const other=record(j),ownPlace=read(r+4),otherPlace=read(other+4);
   if(ownPlace<otherPlace&&read(other+0x19c)<read(r+0x19c)){write(r+4,otherPlace);write(other+4,ownPlace);}
  }
 }
 if(integer(scene?.courseIndex,'courseIndex',0,11)!==0)
  for(let i=0;i<count;i++)write(0x26c0+i*4,read(record(i)+4));
 return freeze({operations,diagnostic:{skipped:false,estimates}});
}
