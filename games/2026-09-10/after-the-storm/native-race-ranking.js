// Independent numeric reconstruction of the ordinary79528 standings blocks.
// Source timer/primary-tail metric and finish producers run BEFORE this phase.
// No initialization, timing, judging, ranking UI, scoring or race admission is
// inferred. Order3990 is distinct from the source setup/grid order26c0.
const F=Math.fround,MIN=-2147483648,MAX=2147483647;
const integerFields=['place293c','finished2c2c','record2c24','reconciled2c3c','finishTime2ad4'];
function integer(value,name,min=MIN,max=MAX){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from${min} to${max}`);
 return value||0;
}
function metric(value){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError('metric2c64 must fit finite native float32');
 return F(value);
}
function record(value,index){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`Expected source record${index}`);
 return {metric2c64:metric(value.metric2c64),...Object.fromEntries(integerFields.map(k=>[k,integer(value[k],`record${index}.${k}`)]))};
}
function freeze(value){
 if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;
}
function copyState(state){
 if(!state||!Array.isArray(state.records)||state.records.length<1||state.records.length>4)
  throw new RangeError('Provide one to four ordered source record slots');
 if(!Array.isArray(state.orderByPlace)||state.orderByPlace.length!==state.records.length)
  throw new RangeError('orderByPlace must retain one word per supplied source slot');
 return {orderByPlace:state.orderByPlace.map((v,i)=>integer(v,`orderByPlace[${i}]`)),records:state.records.map(record)};
}
function gates(state,{activity624,mainState638,mode620,racerCount}={}){
 integer(activity624,'activity624',-32768,32767);integer(mainState638,'mainState638');integer(mode620,'mode620');
 integer(racerCount,'racerCount',0,state.records.length);
 return {activity624,mainState638,mode620,racerCount};
}
function sourceTruncatedMetric(value){
 // Source trunc.w.s followed by cvt.s.w. Invalid conversion/FCSR outcomes are
 // outside this finite bounded contract, not sanitized to a plausible value.
 if(value<MIN||value>=2147483648)throw new RangeError('Finish metric trunc.w.s is outside supported signed32 conversion');
 return F(Math.trunc(value)||0);
}

/** Copy explicit retained source slots. NO order/rank/time/finish defaults are
 * supplied. records is in source racer-index order (capacity1..4); racerCount
 * on each call chooses the active prefix. Trailing supplied slots are retained.
 * metric2c64 is a native F32 ranking value from the external primary tail;
 * all other fields are signed32 source words. Source places are ZERO based.
 * Prior order words may be arbitrary signed32: active sorting overwrites only
 * its prefix before reading it. No previous permutation is invented/required.
 */
export function createNativeRaceRankingState(state){return freeze(copyState(state));}

/** Detached mutable finite-number snapshot. Structured cloning preserves any
 * signed-zero metric; standard JSON is not an original float-bit codec.
 */
export function nativeRaceRankingSnapshot(state){return copyState(state);}

/** The separate main1/mode4 finish reconciliation BEFORE ordinary sorting.
 * activity624 is the actual signed16 source gate; only-1 executes the phase.
 * This phase does NOT inspect phase650 or flag1fd4. primaryHumanIndex is the
 * actual selected source slot and can differ from zero. Record293c values are
 * OLD places: this phase never changes them or orderByPlace.
 *
 * Newly finished, record2c24==0, reconciled2c3c==0 slots are visited ascending.
 * Set their latch, then compare each other eligible finished slot ascending.
 * A lower metric AND lower signed finish time moves the other metric into
 * this slot and stores F32(trunc.signed32(oldMetric)) in the other slot. This
 * is intentionally not an ordinary float swap. The alternative equal-time
 * branch may increment the other's time with signed32 wrap, using OLD places
 * and excluding primaryHumanIndex. Later comparisons see earlier mutations.
 */
export function prepareNativeRaceFinishMetrics(state,options={}){
 const next=copyState(state),g=gates(next,options),n=g.racerCount;
 const applied=g.activity624===-1&&g.mainState638===1&&g.mode620===4;
 const processed=[],metricSwaps=[],timeIncrements=[];
 if(applied&&n>0){
  const primary=integer(options.primaryHumanIndex,'primaryHumanIndex',0,next.records.length-1);
  for(let i=0;i<n;i++){
   const own=next.records[i];
   if(own.finished2c2c===0||own.record2c24!==0||own.reconciled2c3c!==0)continue;
   own.reconciled2c3c=1;processed.push(i);
   for(let j=0;j<n;j++){
    const other=next.records[j];
    if(j===i||other.finished2c2c===0||other.record2c24!==0)continue;
    if(own.metric2c64<other.metric2c64&&own.finishTime2ad4<other.finishTime2ad4){
     const previous=own.metric2c64,displaced=sourceTruncatedMetric(previous);
     own.metric2c64=other.metric2c64;other.metric2c64=displaced;
     metricSwaps.push({racerA:i,racerB:j,metricABefore:previous,metricAAfter:own.metric2c64,metricBAfter:displaced});
     continue;
    }
    if(own.finishTime2ad4===other.finishTime2ad4&&own.place293c<other.place293c&&j!==primary){
     const before=other.finishTime2ad4;other.finishTime2ad4=(before+1)|0;
     timeIncrements.push({processingRacer:i,racerIndex:j,before,after:other.finishTime2ad4});
    }
   }
  }
 }
 return freeze({state:next,applied,diagnostic:{processed,metricSwaps,timeIncrements}});
}

/** Ordinary rank sort on ALREADY reconciled metrics. The exact source gates
 * are activity624==-1, mainState638==1, flag1fd4==0, phase650==3, mode6201/4.
 * Disabled gates retain all fields. An enabled zero-count phase makes no writes.
 *
 * Reset order prefix to0..count-1, then nested ascending i/j comparisons swap
 * immediately when metric[order[i]]<metric[order[j]]. Comparison is strict F32;
 * equal keys do not swap directly but CAN move past each other after another
 * swap. Do not replace this with a stable sort or a tie-break by previous place.
 * Finally place293c[order[place]]=place; every other record field is retained.
 */
export function prepareNativeRaceRanking(state,options={}){
 const next=copyState(state),g=gates(next,options),n=g.racerCount;
 const phase=integer(options.phase650,'phase650'),flag=integer(options.flag1fd4,'flag1fd4');
 const applied=g.activity624===-1&&g.mainState638===1&&flag===0&&phase===3&&(g.mode620===1||g.mode620===4);
 const swaps=[];let comparisons=0;
 if(applied){
  for(let i=0;i<n;i++)next.orderByPlace[i]=i;
  for(let i=0;i<n-1;i++)for(let j=i+1;j<n;j++){
   const a=next.orderByPlace[i],b=next.orderByPlace[j];comparisons++;
   if(next.records[a].metric2c64<next.records[b].metric2c64){
    next.orderByPlace[i]=b;next.orderByPlace[j]=a;swaps.push({placeA:i,placeB:j,racerA:a,racerB:b});
   }
  }
  for(let place=0;place<n;place++)next.records[next.orderByPlace[place]].place293c=place;
 }
 return freeze({state:next,applied,diagnostic:{comparisons,swaps}});
}

/** Compose the two numeric phases in their source order, after ALL ascending
 * timer/primary-tail calls. This does not execute interleaved persistent record
 * saving, later split feedback, versus final-time override/flag1fd4, or UI work.
 * The caller retains those fields/owners. Input is never partially committed if
 * either preparation rejects; only this detached returned state may be applied.
 */
export function prepareNativeRaceStandings(state,options={}){
 const finish=prepareNativeRaceFinishMetrics(state,options),ranking=prepareNativeRaceRanking(finish.state,options);
 return freeze({state:ranking.state,finishMetrics:{applied:finish.applied,diagnostic:finish.diagnostic},
  ranking:{applied:ranking.applied,diagnostic:ranking.diagnostic}});
}
