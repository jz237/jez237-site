// Ordinary79528 numeric update, with one owner for every retained record word.
// Physical movement/input run before this phase. Source overlays, persistence,
// profiling and mode11 stunt adjudication remain separate consumers.
import {createNativePrimaryScratchLayout,prepareNativePrimaryScratchContext} from './native-primary-scratch-context.js';
import {createNativePrimaryRaceLayout,prepareNativePrimaryRaceProgress} from './native-primary-race-progress.js';
import {prepareNativeRaceFinishMetrics,prepareNativeRaceRanking} from './native-race-ranking.js';
import {createNativeRaceFinalizationState,prepareNativeRaceRecords,prepareNativeRaceFinalization,
 prepareNativeRacePresentationTail} from './native-race-finalization.js';

const F=Math.fround,MIN=-2147483648,MAX=2147483647,BASE=0x2938,WORDS=0x378/4,layouts=new WeakMap();
const floatBits=new DataView(new ArrayBuffer(4));
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`${n} is outside its native integer range`);return v||0;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${n} must fit finite float32`);return F(v);}
function point3(v,n){record(v,n);return Object.fromEntries(['x','y','z'].map(k=>[k,scalar(v[k],`${n}.${k}`)]));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function asFloat(v){floatBits.setUint32(0,v,false);return floatBits.getFloat32(0,false);}
function asBits(v){floatBits.setFloat32(0,v,false);return floatBits.getUint32(0,false);}
const index=k=>(parseInt(k.slice(-4),16)-BASE)/4;
const intFields=['lap2938','place293c','progressRow2940','nextPrimary2944','side2954','armed2958','gateResult2960',
 'power2a64','lapMisses2a68','totalMisses2a6c','displayPower2a70','record2c24','gateTimer2c28','finished2c2c',
 'splitDelta2c30','splitState2c34','splitTimer2c38','reconciled2c3c','lapFlag2c40','postJudgeSourceRow2c48',
 'powerChanged2c4c','weed2c50','region2c54','legalLapCounter2c58','finishSide2c5c','splitPeer2c74'];
const spans=[['gateFlags2964',64],['missWords2a74',10],['timingWords2a9c',98]];
const families={primary:0x801aee20,secondary:0x801b2f20,tertiary:0x801b7020};
const globalInts=['primaryHumanIndex','secondaryHumanIndex','players','courseIndex','missLimit8174','noFinish8178','clockStopped817c',
 'event628','state638','mode620','configuredLaps728','difficulty','directionFlag1f90','fortressFlag1fc8','southernLap1fcc',
 'drakeFog1fd0','flag1fc4','flag1fd4','flag1fd8','bestTime1fe0','bestLapFlag2658','recordFlag8a98','ambientD4b00','fortressD8240',
 'primaryCount','finishSourceRow','activity624','state650','racerCount','state600','metadataD9b0','metadataCb32c',
 'placeChanged8a9c','finishWait1fdc','recordPlace2650','bestLapFlag2654'];
function copyGlobals(v,slots){
 record(v,'source globals');const g=Object.fromEntries(globalInts.map(k=>[k,integer(v[k],k)]));
 integer(g.primaryHumanIndex,'primaryHumanIndex',0,slots-1);integer(g.secondaryHumanIndex,'secondaryHumanIndex',0,slots-1);
 integer(g.players,'players',1,2);integer(g.courseIndex,'courseIndex',0,9);integer(g.racerCount,'racerCount',0,slots);
 integer(g.activity624,'activity624',-32768,32767);integer(g.event628,'event628',-32768,32767);
 integer(g.primaryCount,'primaryCount',0,64);
 for(const k of ['reverse','missesEnabled72e'])g[k]=integer(v[k],k,0,65535);
 for(const k of ['finishMetric39b0','dqMetric39b4','checkpointSlackNative39c4'])g[k]=scalar(v[k],k);
 return g;
}
function sourceView(s,i,{family=false}={}){
 const w=s.recordWords2938BySlot[i],out=Object.fromEntries(intFields.map(k=>[k,w[index(k)]|0]));
 for(const [k,n]of spans)out[k]=w.slice(index(k),index(k)+n).map(v=>v|0);
 for(const k of ['metric2c64','routeGap2c68'])out[k]=asFloat(w[index(k)]);
 out.projectionDistance39a0=s.projectionDistance39a0BySlot[i];
 if(family){out.recordFamily=Object.keys(families).find(k=>families[k]===w[index('family2c88')]);
  if(out.recordFamily===undefined)throw new RangeError('Active record2c88 requires a known source route-family pointer');}
 return out;
}
function commitView(s,i,v){
 const w=s.recordWords2938BySlot[i];
 for(const k of intFields)if(Object.hasOwn(v,k))w[index(k)]=integer(v[k],k)>>>0;
 for(const [k,n]of spans)if(Object.hasOwn(v,k)){
  if(!Array.isArray(v[k])||v[k].length!==n)throw new RangeError(`Invalid ${k} write span`);
  v[k].forEach((value,j)=>{w[index(k)+j]=integer(value,k)>>>0;});
 }
 for(const k of ['metric2c64','routeGap2c68'])if(Object.hasOwn(v,k))w[index(k)]=asBits(scalar(v[k],k));
 if(Object.hasOwn(v,'projectionDistance39a0'))s.projectionDistance39a0BySlot[i]=scalar(v.projectionDistance39a0,'projectionDistance39a0');
 if(Object.hasOwn(v,'recordFamily')){
  if(!Object.hasOwn(families,v.recordFamily))throw new RangeError('Unknown source route-family write');
  w[index('family2c88')]=families[v.recordFamily];
 }
}
function finalizationView(s){
 return {records:s.recordWords2938BySlot.map((_,i)=>sourceView(s,i)),
  ...Object.fromEntries(['flag1fd4','flag1fd8','placeChanged8a9c','finishWait1fdc','recordPlace2650','bestLapFlag2654'].map(k=>[k,s.globals[k]])),
  ...(s.courseRecords===undefined?{}:{courseRecords:s.courseRecords})};
}
function commitFinalization(s,v){
 v.records.forEach((r,i)=>commitView(s,i,r));
 for(const k of ['flag1fd4','flag1fd8','placeChanged8a9c','finishWait1fdc','recordPlace2650','bestLapFlag2654'])
  if(Object.hasOwn(v,k))s.globals[k]=v[k];
 if(v.courseRecords!==undefined)s.courseRecords=v.courseRecords;
}
function rankingView(s){return {orderByPlace:s.orderByPlace,records:s.recordWords2938BySlot.map((_,i)=>{
 const r=sourceView(s,i);return {...r,finishTime2ad4:r.timingWords2a9c[14]};
})};}
function commitRanking(s,v){
 s.orderByPlace=[...v.orderByPlace];
 v.records.forEach((r,i)=>{commitView(s,i,r);s.recordWords2938BySlot[i][index('timingWords2a9c')+14]=r.finishTime2ad4>>>0;});
}
function context(g){return {activity624:g.activity624,mainState638:g.state638,mode620:g.mode620,racerCount:g.racerCount,
 primaryHumanIndex:g.primaryHumanIndex,secondaryHumanIndex:g.secondaryHumanIndex,phase650:g.state650,flag1fd4:g.flag1fd4,
 playerCountDab28:g.players,state600:g.state600,reverseDab68:g.reverse<<16>>16,
 metadataD9b0:g.metadataD9b0,metadataCb32c:g.metadataCb32c,metadataCb338:g.difficulty};}

/** Canonical full222-word source records, including untouched navigation and
 * unknown words, in source-slot order. Words are unsigned bit patterns; signed
 * integers/F32/pointers are decoded only at leaf boundaries. The source array
 *39a0+i*4 is separate from record2938+i*378 and retained per slot. No scalar
 * timer/finish-time alias or parallel decoded record is persisted. Every
 * global and optional selected-course record table is explicit retained data.
 */
export function createNativePrimaryRacePhaseState(value){
 record(value,'ordinary phase state');const rows=value.recordWords2938BySlot;
 if(!Array.isArray(rows)||rows.length<1||rows.length>4)throw new RangeError('Supply one to four complete source record slots');
 const raw=rows.map((row,i)=>{
  if(!Array.isArray(row)||row.length!==WORDS)throw new RangeError(`recordWords2938BySlot[${i}] requires222 unsigned words`);
  return row.map((v,j)=>integer(v,`recordWords2938BySlot[${i}][${j}]`,0,0xffffffff));
 });
 if(!Array.isArray(value.projectionDistance39a0BySlot)||value.projectionDistance39a0BySlot.length!==rows.length)
  throw new RangeError('Retain one projectionDistance39a0 per source slot');
 if(!Array.isArray(value.orderByPlace)||value.orderByPlace.length!==rows.length)throw new RangeError('Retain one order3990 word per source slot');
 const s={recordWords2938BySlot:raw,projectionDistance39a0BySlot:value.projectionDistance39a0BySlot.map(v=>scalar(v,'projectionDistance39a0')),
  orderByPlace:value.orderByPlace.map(v=>integer(v,'order3990')),globals:copyGlobals(value.globals,rows.length),
  scratchPositionNative:point3(value.scratchPositionNative,'retained scratch3780')};
 if(value.courseRecords!==undefined)s.courseRecords=structuredClone(value.courseRecords);
 // Reuse the table/status validator without creating another persistent owner.
 const checked=createNativeRaceFinalizationState(finalizationView(s));
 if(checked.courseRecords!==undefined)s.courseRecords=structuredClone(checked.courseRecords);
 return freeze(s);
}

/** Detached typed view for adapters and diagnostics. Mutating it never changes
 * the canonical phase state. Unconsumed words remain in the raw snapshot. */
export function nativePrimaryRacePhaseRecord(state,racerIndex){
 const s=createNativePrimaryRacePhaseState(state),i=integer(racerIndex,'racerIndex',0,s.recordWords2938BySlot.length-1);
 return sourceView(s,i,{family:true});
}

/** One immutable selected primary layout supplies BOTH source calls. All nodes
 * include length88 for the later versus gap, exact A0/A8 links and raw order.
 * Current contact-displaced centers may be supplied once per outer phase. */
export function createNativePrimaryRacePhaseLayout(value){
 record(value,'ordinary phase layout');
 const progress=createNativePrimaryRaceLayout(value),scratch=createNativePrimaryScratchLayout(value);
 const primaryRoute={nodes:progress.nodes.map((n,i)=>({length88:scalar(value.nodes[i].length88,'length88'),
  kind98:n.classification98,nextA0:n.nextSourceRowA0}))};
 const layout=freeze({nodes:progress.nodes});layouts.set(layout,{progress,scratch,primaryRoute});return layout;
}

/** All ascending76378→7687c pairs, finish reconciliation, record saving, old
 * place capture, one rank sort, then finalization. Shared global writes reach
 * the next racer immediately. Reconciled total time is committed to canonical
 * timingWords[14] BEFORE record saving. No movement/AI/primary motion is run.
 *
 * samplesBySlot supplies actual bodyPositionNative, alternatePositionNativeXZ
 * when needed, and priorBodyPointNative(+BE4/BEC), without velocity estimates.
 * Inputs nodePositionsNative/gateObjectNativeXZ/gateCamerasNativeXZ are coherent
 * current source snapshots. Comparison splits come from the single selected
 * courseRecords owner; no duplicate comparison-time array is accepted.
 *
 * Effects preserve numeric/audio/overlay call order. Execute the three overlay
 * prelude recipes before prepareNativePrimaryRacePhasePresentationTail with a
 * fresh canonical state: they can mutate flags used by the continuation. The
 * two C58f0 profiling calls and their timing writes are outside this contract.
 * Mode11 is explicitly rejected when active; its stunt routine is separate.
 * Preparation is atomic: the caller's retained state is never mutated.
 */
export function prepareNativePrimaryRacePhase(layout,state,input={}){
 const compiled=layouts.get(layout);if(!compiled)throw new TypeError('Expected compiled ordinary phase layout');
 const next=structuredClone(createNativePrimaryRacePhaseState(state)),g=next.globals;
 const effects=[],diagnostic={racers:[],finishMetrics:null,records:null,ranking:null,finalization:null};
 if(g.activity624!==-1)return freeze({state:next,applied:false,effects,continuation:null,diagnostic});
 if(g.mode620===11)throw new RangeError('Active mode11 requires its separate source stunt phase');
 record(input,'ordinary phase source samples');
 const n=g.racerCount;
 if(n>0&&(!Array.isArray(input.samplesBySlot)||input.samplesBySlot.length<n||input.samplesBySlot.length>next.recordWords2938BySlot.length))
  throw new RangeError('Supply actual source samples for every active racer slot');
 for(let i=0;i<n;i++){
  const sample=record(input.samplesBySlot[i],`samplesBySlot[${i}]`),r=sourceView(next,i,{family:true});
  const scratch=prepareNativePrimaryScratchContext(compiled.scratch,r,{...sample,racerIndex:i,state638:g.state638,
   players:g.players,primaryHumanIndex:g.primaryHumanIndex,secondaryHumanIndex:g.secondaryHumanIndex,
   courseIndex:g.courseIndex,difficulty:g.difficulty,nodePositionsNative:input.nodePositionsNative});
  commitView(next,i,scratch.recordWrites);next.scratchPositionNative={...scratch.positionNative};effects.push(...scratch.effects);
  const progress=prepareNativePrimaryRaceProgress(compiled.progress,sourceView(next,i,{family:true}),{
   racerIndex:i,globals:g,positionNativeXZ:scratch.positionNative,priorBodyPointNative:sample.priorBodyPointNative,
   nodePositionsNative:input.nodePositionsNative,gateObjectNativeXZ:input.gateObjectNativeXZ,gateCamerasNativeXZ:input.gateCamerasNativeXZ,
   comparisonTimes:next.courseRecords===undefined?undefined:[undefined,...next.courseRecords.bestSplits24a0]});
  commitView(next,i,progress.state);Object.assign(g,progress.globalWrites);effects.push(...progress.effects);
  diagnostic.racers.push({racerIndex:i,scratch:scratch.diagnostic,progress:progress.diagnostic});
 }
 const finish=prepareNativeRaceFinishMetrics(rankingView(next),context(g));commitRanking(next,finish.state);
 diagnostic.finishMetrics={applied:finish.applied,...finish.diagnostic};
 const records=prepareNativeRaceRecords(finalizationView(next),context(g));commitFinalization(next,records.state);
 diagnostic.records={applied:records.applied,...records.diagnostic};
 const oldPrimaryPlace293c=sourceView(next,g.primaryHumanIndex).place293c;
 const ranking=prepareNativeRaceRanking(rankingView(next),context(g));commitRanking(next,ranking.state);
 diagnostic.ranking={applied:ranking.applied,...ranking.diagnostic};
 const finalization=prepareNativeRaceFinalization(finalizationView(next),{...context(g),oldPrimaryPlace293c,
  primaryRoute:{...compiled.primaryRoute,traversalBudget:g.primaryCount}});
 commitFinalization(next,finalization.state);effects.push(...finalization.effects);
 diagnostic.finalization=finalization.diagnostic;
 return freeze({state:next,applied:true,effects,continuation:finalization.continuation,diagnostic});
}

/** Call only after the returned prelude overlays have executed. This reads a
 * FRESH canonical snapshot; it does not reuse pre-overlay gate decisions. */
export function prepareNativePrimaryRacePhasePresentationTail(postOverlayState){
 const s=createNativePrimaryRacePhaseState(postOverlayState),g=s.globals;
 return prepareNativeRacePresentationTail({record2c24BySlot:s.recordWords2938BySlot.map((_,i)=>sourceView(s,i).record2c24),
  primaryHumanIndex:g.primaryHumanIndex,secondaryHumanIndex:g.secondaryHumanIndex,playerCountDab28:g.players,state628:g.event628});
}
