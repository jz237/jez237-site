// Independent ordinary-race numeric finalization. Call after the real timer /
// primary-tail producers. Record bookkeeping precedes ranking; split feedback
// and versus overrides follow it. Mode11, persistent storage, clock profiling
// and external overlay/audio implementations are outside this module.
const F=Math.fround,MIN=-2147483648,MAX=2147483647;
const recordFields=['lap2938','nextPrimary2944','place293c','finished2c2c','record2c24',
 'splitDelta2c30','splitState2c34','splitTimer2c38','splitPeer2c74'];
function integer(value,name,min=MIN,max=MAX){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} is outside its native integer range`);return value||0;
}
function scalar(value,name){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must fit finite float32`);return F(value);
}
function record(value,name){if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must be an explicit record`);return value;}
function words(value,length,name){
 if(!Array.isArray(value)||value.length!==length)throw new RangeError(`${name} requires ${length} signed words`);
 return value.map((v,i)=>integer(v,`${name}[${i}]`));
}
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
function sourceRecord(value,i){
 const r=record(value,`records[${i}]`);
 return {...Object.fromEntries(recordFields.map(k=>[k,integer(r[k],`records[${i}].${k}`)])),
  timingWords2a9c:words(r.timingWords2a9c,98,`records[${i}].timingWords2a9c`),routeGap2c68:scalar(r.routeGap2c68,'routeGap2c68')};
}
function courseRecords(value){
 record(value,'courseRecords');
 if(!Array.isArray(value.normalTimes1ff0)||value.normalTimes1ff0.length!==3)throw new RangeError('normalTimes1ff0 requires three five-word rows');
 return {fastLap22c0:words(value.fastLap22c0,5,'fastLap22c0'),
  normalTimes1ff0:value.normalTimes1ff0.map((r,i)=>words(r,5,`normalTimes1ff0[${i}]`)),
  reverseTime23b0:words(value.reverseTime23b0,5,'reverseTime23b0'),bestSplits24a0:words(value.bestSplits24a0,9,'bestSplits24a0'),
  recordPlace2660:integer(value.recordPlace2660,'recordPlace2660'),bestLapFlag2690:integer(value.bestLapFlag2690,'bestLapFlag2690')};
}
function copyState(state){
 record(state,'finalization state');
 if(!Array.isArray(state.records)||state.records.length<1||state.records.length>4)throw new RangeError('Provide one to four ordered source record slots');
 const out={records:state.records.map(sourceRecord),...Object.fromEntries(
  ['flag1fd4','flag1fd8','placeChanged8a9c','finishWait1fdc'].map(k=>[k,integer(state[k],k)]))};
 if(state.courseRecords!==undefined){
  out.courseRecords=courseRecords(state.courseRecords);
  out.recordPlace2650=integer(state.recordPlace2650,'recordPlace2650');out.bestLapFlag2654=integer(state.bestLapFlag2654,'bestLapFlag2654');
 }
 return out;
}
function context(state,value){
 record(value,'source context');
 return {activity624:integer(value.activity624,'activity624',-32768,32767),
  mainState638:integer(value.mainState638,'mainState638'),mode620:integer(value.mode620,'mode620'),
  racerCount:integer(value.racerCount,'racerCount',0,state.records.length),
  primaryHumanIndex:integer(value.primaryHumanIndex,'primaryHumanIndex',0,state.records.length-1)};
}
const ordinary=g=>g.activity624===-1&&g.mode620!==11;
const call=(consumer,argument)=>({kind:'externalCall',consumer,...(argument===undefined?{}:{argument})});

/** Explicit retained state only; timingWords2a9c is the canonical signed-word
 * span2a9c..2c20, stopping before status2c24. Index0 is also the current split
 * index, index3 the source best-lap value, and index14 the total/finish time.
 * Do not retain independent scalar aliases for those words. Course tables are
 * an optional SELECTED-COURSE snapshot, required when record writes execute.
 * Setup/grid order and ranking3990 remain owned elsewhere and are never copied
 * into a different order by this module. No reset defaults are inferred. */
export function createNativeRaceFinalizationState(state){return freeze(copyState(state));}
/** Detached numeric copy. Use structured cloning when signed-zero F32 gap
 * provenance matters; ordinary JSON is not a native floating-bit codec. */
export function nativeRaceFinalizationSnapshot(state){return copyState(state);}

/** Run AFTER finish-metric reconciliation and BEFORE old-primary-place capture
 * and rank sorting. The source gates are main1, one player, scene600==0, fresh
 * flag1fd8==0 and the selected primary finished word!=0. There is no DQ or650
 * gate here. reverseDab68 is the actual signed16 word; any nonzero selects the
 * reverse table. Metadata words are supplied without guessed rider/tune names.
 * These are in-memory numeric records, not an implementation of persistence.
 */
export function prepareNativeRaceRecords(state,options){
 const next=copyState(state),g=context(next,options),primary=next.records[g.primaryHumanIndex];
 const players=integer(options.playerCountDab28,'playerCountDab28'),scene=integer(options.state600,'state600');
 const applied=ordinary(g)&&next.flag1fd8===0&&primary.finished2c2c!==0&&g.mainState638===1&&players===1&&scene===0;
 const diagnostic={fastLapImproved:false,insertedPlace:null,reverseImproved:false};
 if(applied){
  if(!next.courseRecords)throw new TypeError('This record branch requires actual selected courseRecords');
  const reverse=integer(options.reverseDab68,'reverseDab68',-32768,32767),tables=next.courseRecords;
  const metadata=[integer(options.metadataD9b0,'metadataD9b0'),integer(options.metadataCb32c,'metadataCb32c'),integer(options.metadataCb338,'metadataCb338')];
  next.flag1fd8=1;
  if(reverse===0){
   const lap=primary.timingWords2a9c[3];
   if(lap<tables.fastLap22c0[0]){
    tables.fastLap22c0.splice(0,4,lap,...metadata);next.bestLapFlag2654=1;diagnostic.fastLapImproved=true;
   }
   const total=primary.timingWords2a9c[14];
   const place=tables.normalTimes1ff0.findIndex(row=>total<row[0]);
   if(place>=0){
    for(let j=2;j>place;j--)tables.normalTimes1ff0[j]=[...tables.normalTimes1ff0[j-1]];
    tables.normalTimes1ff0[place].splice(0,4,total,...metadata);next.recordPlace2650=place+1;diagnostic.insertedPlace=place+1;
    if(place===0)tables.bestSplits24a0=[primary.timingWords2a9c[16],...Array.from({length:8},(_,i)=>primary.timingWords2a9c[24+i*8])];
   }
  }else{
   const total=primary.timingWords2a9c[14];
   if(total<tables.reverseTime23b0[0]){
    tables.reverseTime23b0.splice(0,4,total,...metadata);next.recordPlace2650=1;diagnostic.reverseImproved=true;
   }
  }
  // The source does not clear either global result latch before these copies.
  tables.recordPlace2660=next.recordPlace2650;tables.bestLapFlag2690=next.bestLapFlag2654;
 }
 return freeze({state:next,applied,diagnostic});
}

function timingIndex(r){
 // Source32-bit pointer arithmetic, including the shift to byte offsets.
 // Reject an actual read outside the supplied canonical span; do not clamp.
 const byteOffset=(((r.lap2938<<3)+r.timingWords2a9c[0])<<2),index=byteOffset/4;
 if(index<0||index>=98)throw new RangeError('Dynamic timing read is outside timingWords2a9c');return index;
}
const difference=(a,b)=>(a-b)|0;
const roundedGap=delta=>Math.trunc(((delta+500)|0)/1000)||0;
function sourceRoute(value){
 record(value,'primaryRoute');
 if(!Array.isArray(value.nodes)||value.nodes.length>64)throw new RangeError('primaryRoute requires at most64 source primary nodes');
 const budget=integer(value.traversalBudget,'traversalBudget',MIN,64);
 return {budget,nodes:value.nodes.map((r,i)=>{
  record(r,`primaryRoute.nodes[${i}]`);
  return {length88:scalar(r.length88,'length88'),kind98:integer(r.kind98,'kind98'),nextA0:integer(r.nextA0,'nextA0')};
 })};
}
function routeGap(next,primaryIndex,secondaryIndex,route){
 const p=next.records[primaryIndex],s=next.records[secondaryIndex],primaryLeads=p.place293c<=s.place293c;
 const from=primaryLeads?s:p,to=primaryLeads?p:s;
 let lap=from.lap2938,node=from.nextPrimary2944,total=0,steps=0;
 const reached=()=>lap===to.lap2938&&node===to.nextPrimary2944;
 while(!reached()&&steps<route.budget){
  if(node<0||node>=route.nodes.length)throw new RangeError('Versus gap traversed outside the supplied primary route');
  const row=route.nodes[node];total=scalar(F(total+row.length88),'accumulated route gap');
  if(row.kind98===3)lap=(lap+1)|0;
  node=row.nextA0;steps++;
 }
 // Keep literal source write order, including aliasing selected slots and-0.
 p.routeGap2c68=primaryLeads?-total:total;s.routeGap2c68=primaryLeads?total:-total;
 return {steps,reached:reached(),distanceNative:total};
}

/** Numeric78264 branch, on the ACTUAL PRIMARY route, independent of a racer's
 * navigation/family pointer. Node fields are+88 length,+98kind,+A0next; the
 * caller supplies actual traversalBudget801bb120 (bounded capacity64 here).
 * It accumulatesF32 lengths from the trailing selected human until lap+node
 * match or budget exhaustion, then writes opposite signed native gaps2c68.
 * It never changes primary progression, timing, order3990 or world position.
 */
export function prepareNativeVersusRouteGap(state,options){
 const next=copyState(state),g=context(next,options),applied=ordinary(g)&&g.mainState638===1&&g.mode620===1;
 let diagnostic=null;
 if(applied){const secondary=integer(options.secondaryHumanIndex,'secondaryHumanIndex',0,next.records.length-1);
  diagnostic=routeGap(next,g.primaryHumanIndex,secondary,sourceRoute(options.primaryRoute));}
 return freeze({state:next,applied,diagnostic});
}

/** Run AFTER source sorting, using oldPrimaryPlace293c captured immediately
 * BEFORE that sort. Split marker10 requests feedback using the same index in
 * each compared timing span. Selected primary/secondary slots are explicit.
 * Versus finish uses signed total time and favors the primary on ties; it does
 * NOT rewrite ranking3990. No source phase650/main638 transition is invented.
 * Literal source assignment order is retained if the supplied selected slots
 * alias. finishWait1fdc counts outer invocations, not rendered frames/seconds.
 *
 * Effects preserve synchronous audio/overlay call order. The three overlay
 * prelude calls are external and may change scene/status. Afterwards call
 * prepareNativeRacePresentationTail with a FRESH post-callback snapshot.
 * C58f0 profiling-clock bookkeeping is explicitly outside this numeric state.
 */
export function prepareNativeRaceFinalization(state,options){
 const next=copyState(state),g=context(next,options),applied=ordinary(g),effects=[];
 const diagnostic={splitRecords:[],versusPlacesFinalized:false,versusGap:null};
 if(!applied)return freeze({state:next,applied,effects,continuation:null,diagnostic});
 const primary=g.primaryHumanIndex,p=next.records[primary];
 const secondary=g.mode620===1?integer(options.secondaryHumanIndex,'secondaryHumanIndex',0,next.records.length-1):null;
 const feedback=delta=>effects.push(call('splitFeedbackC3ef4',delta));
 if(g.mode620===4)for(let i=0;i<g.racerCount;i++){
  const own=next.records[i];if(own.splitState2c34!==10)continue;
  const index=timingIndex(own),time=own.timingWords2a9c[index];diagnostic.splitRecords.push(i);
  if(i===primary&&own.place293c>0){
   let peer=0;while(peer<g.racerCount&&next.records[peer].place293c!==((own.place293c-1)|0))peer++;
   if(peer>=next.records.length)throw new RangeError('Split predecessor read is outside supplied source slots');
   const otherTime=next.records[peer].timingWords2a9c[index],delta=difference(time,otherTime);
   if(otherTime<1)own.splitState2c34=0;
   else{own.splitState2c34=1;own.splitDelta2c30=delta;own.splitTimer2c38=40;own.splitPeer2c74=peer;
    if(own.place293c===1)feedback((-roundedGap(delta))|0);}
  }else if(i===primary||own.place293c<=p.place293c)own.splitState2c34=0;
  else{
   const otherTime=p.timingWords2a9c[index];
   if(otherTime<1)own.splitState2c34=0;
   else{own.splitState2c34=1;own.splitDelta2c30=difference(time,otherTime);own.splitTimer2c38=40;
    if(p.place293c===0&&own.place293c===1)feedback(roundedGap(own.splitDelta2c30));}
  }
 }else if(g.mode620===1)for(let i=0;i<g.racerCount;i++){
  const own=next.records[i];if(own.splitState2c34!==10)continue;
  diagnostic.splitRecords.push(i);
  if(own.place293c!==1){own.splitState2c34=0;continue;}
  const index=timingIndex(own),time=own.timingWords2a9c[index],other=i===primary?next.records[secondary]:p;
  const otherTime=other.timingWords2a9c[index],delta=otherTime===0?0:difference(time,otherTime);
  own.splitState2c34=1;own.splitDelta2c30=delta;own.splitTimer2c38=40;
  other.splitState2c34=2;other.splitDelta2c30=delta;other.splitTimer2c38=40;
  feedback((-roundedGap(own.splitDelta2c30))|0);
 }
 if(g.mode620===1&&g.mainState638===1){
  const s=next.records[secondary];
  if(next.flag1fd4===0&&p.finished2c2c!==0&&s.finished2c2c!==0){
   next.flag1fd4=1;diagnostic.versusPlacesFinalized=true;
   if(s.timingWords2a9c[14]<p.timingWords2a9c[14]){p.place293c=1;s.place293c=0;}
   else{p.place293c=0;s.place293c=1;}
  }
  if(next.flag1fd8===0&&(p.finished2c2c!==0||p.record2c24!==0||s.finished2c2c!==0||s.record2c24!==0))next.flag1fd8=1;
 }
 if(g.mode620===4&&integer(options.oldPrimaryPlace293c,'oldPrimaryPlace293c')!==p.place293c)next.placeChanged8a9c=1;
 if(g.mode620===1&&g.mainState638===1)diagnostic.versusGap=routeGap(next,primary,secondary,sourceRoute(options.primaryRoute));
 if(g.mode620===4&&p.finished2c2c!==0&&next.finishWait1fdc<MAX)next.finishWait1fdc=(next.finishWait1fdc+1)|0;
 effects.push(call('overlayFc39c'),call('overlayEf504'),call('overlayF23a0'));
 return freeze({state:next,applied,effects,continuation:'ordinaryPresentationTail',diagnostic});
}

/** Only the continuation after the THREE already-executed overlay calls. Do
 * not cache these flags before those calls. A changed mode/main does not add a
 * new gate in this continuation. Consumers remain ordered external recipes.
 */
export function prepareNativeRacePresentationTail(snapshot){
 record(snapshot,'post-overlay snapshot');
 if(!Array.isArray(snapshot.record2c24BySlot)||snapshot.record2c24BySlot.length<1||snapshot.record2c24BySlot.length>4)
  throw new RangeError('record2c24BySlot requires one to four signed status words');
 const flags=snapshot.record2c24BySlot.map((v,i)=>integer(v,`record2c24BySlot[${i}]`));
 const primary=integer(snapshot.primaryHumanIndex,'primaryHumanIndex',0,flags.length-1),players=integer(snapshot.playerCountDab28,'playerCountDab28');
 let eligible=flags[primary]===0;
 if(eligible&&players===2)eligible=flags[integer(snapshot.secondaryHumanIndex,'secondaryHumanIndex',0,flags.length-1)]===0;
 if(eligible)eligible=integer(snapshot.state628,'state628',-32768,32767)===0;
 return freeze({conditionalCalled:eligible,effects:[...(eligible?[call('overlayF03e0')]:[]),call('overlayF8dd0'),
  call('overlayF9ea0'),call('overlayF0e7c'),call('overlayF1cfc')]});
}
