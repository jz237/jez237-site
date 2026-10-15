// Numeric reconstruction of the ordinary primary judge/lap/timing routine.
// Gate geometry and the final legal-progress metric have separate source
// consumers. Actual input/body/history, global state and table data are explicit;
// no reset, HUD lap, race-clock epoch, audio playback or source RNG is inferred.
import {createNativePrimaryGateState,prepareNativePrimaryGateJudge} from './native-primary-gate-judge.js';
import {createNativePrimaryStandingsLayout,createNativePrimaryStandingsState,prepareNativePrimaryStandings} from './native-primary-standings.js';
import {prepareNativePrimaryRaceClock} from './native-primary-race-clock.js';

const F=Math.fround,layouts=new WeakSet(),I0=-2147483648,I1=2147483647;
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=I0,max=I1){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${n} must fit finite float32`);return F(v);}
function point(p,n){record(p,n);return {x:scalar(p.x,n+'.x'),z:scalar(p.z,n+'.z')};}
function words(v,count,n){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires ${count} retained words`);return v.map((x,i)=>integer(x,`${n}[${i}]`));}
function frozen(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(frozen);Object.freeze(v);}return v;}
function family(v){if(!['primary','secondary','tertiary'].includes(v))throw new RangeError('Supply retained recordFamily');return v;}
const add=(a,b)=>F(F(a)+F(b)),sub=(a,b)=>F(F(a)-F(b)),mul=(a,b)=>F(F(a)*F(b)),sum=(a,b)=>(a+b)|0;
const intFields=['lap2938','place293c','progressRow2940','nextPrimary2944','side2954','armed2958','gateResult2960',
 'power2a64','lapMisses2a68','totalMisses2a6c','displayPower2a70','record2c24','gateTimer2c28','finished2c2c',
 'splitDelta2c30','splitState2c34','splitTimer2c38','lapFlag2c40','postJudgeSourceRow2c48','powerChanged2c4c',
 'legalLapCounter2c58','finishSide2c5c'];

/** Each overlapping native span has ONE array owner. gateFlags2964 includes
 *2968 at index1; missWords2a74 includes its flag and nine lap miss slots;
 * timingWords2a9c spans through2c20 and owns checkpoint/lap/best/total/history
 * words. No parallel scalar timer aliases are retained. Bounds reject an
 * invalid prepared write rather than spilling into unrelated source memory.
 */
export function createNativePrimaryRaceState(value){
 const s=record(value,'retained primary race state'),out=Object.fromEntries(intFields.map(k=>[k,integer(s[k],k)]));
 return frozen({...out,gateFlags2964:words(s.gateFlags2964,64,'gateFlags2964'),
  missWords2a74:words(s.missWords2a74,10,'missWords2a74'),timingWords2a9c:words(s.timingWords2a9c,98,'timingWords2a9c'),
  metric2c64:scalar(s.metric2c64,'metric2c64'),projectionDistance39a0:scalar(s.projectionDistance39a0,'projectionDistance39a0'),
  recordFamily:family(s.recordFamily)});
}
function regionRows(v,name){
 if(!Array.isArray(v)||v.length>64)throw new RangeError(`Expected bounded ${name}`);
 return v.map(row=>{if(!Array.isArray(row)||row.length!==4)throw new RangeError(`Expected four ${name} bounds`);
  const a=row.map(x=>scalar(x,name));if(a[0]>=a[1]||a[2]>a[3])throw new RangeError('Remove sentinel/reversed region rows');return a;});
}

/** Full raw primary order, fixed endpoint geometry and exact source axes are
 * required. Node centers alone can be replaced by the actual contact-displaced
 * current centers. LinksA0/A8 are primary links, not AI avatar-route links.
 */
export function createNativePrimaryRaceLayout({nodes,regionsNative,fortressRegionsNative}={}){
 if(!Array.isArray(nodes)||nodes.length<1||nodes.length>64)throw new RangeError('Expected1..64 complete primary nodes');
 const copied=nodes.map((value,i)=>{
  const n=record(value,'primary node');if(integer(n.sourceRow,'sourceRow',0,63)!==i)throw new RangeError('Use actual complete raw primary array order');
  return {sourceRow:i,centerNativeXZ:point(n.centerNativeXZ,'center'),forwardXZ:point(n.forwardXZ,'forward'),rightXZ:point(n.rightXZ,'right'),
   endpointANativeXZ:point(n.endpointANativeXZ,'endpointA'),endpointBNativeXZ:point(n.endpointBNativeXZ,'endpointB'),
   halfWidthNative8c:scalar(n.halfWidthNative8c,'halfWidthNative8c'),classification98:integer(n.classification98,'classification98'),
   checkpointFlag9c:integer(n.checkpointFlag9c,'checkpointFlag9c'),enabledC8:integer(n.enabledC8,'enabledC8'),
   nextSourceRowA0:integer(n.nextSourceRowA0,'nextSourceRowA0',0,nodes.length-1),
   previousSourceRowA8:integer(n.previousSourceRowA8,'previousSourceRowA8',0,nodes.length-1),routeGroupC0:integer(n.routeGroupC0,'routeGroupC0')};
 });
 const regions=regionRows(regionsNative,'coarse regions'),fortress=regionRows(fortressRegionsNative,'Fortress regions');
 const standings=createNativePrimaryStandingsLayout({nodes:copied.map(n=>({sourceRow:n.sourceRow,positionNativeXZ:n.centerNativeXZ,
  forwardXZ:n.forwardXZ,nextSourceRow:n.nextSourceRowA0,previousSourceRow:n.previousSourceRowA8,
  classification:n.classification98,routeGroupC0:n.routeGroupC0})),regionsNative:regions,fortressRegionsNative:fortress});
 const layout=frozen({nodes:copied,regionsNative:regions,fortressRegionsNative:fortress,standings});layouts.add(layout);return layout;
}
const globalInts=['primaryHumanIndex','secondaryHumanIndex','players','courseIndex','missLimit8174','noFinish8178','clockStopped817c',
 'event628','state638','mode620','configuredLaps728','difficulty','directionFlag1f90','fortressFlag1fc8','southernLap1fcc',
 'drakeFog1fd0','flag1fc4','flag1fd4','flag1fd8','bestTime1fe0','bestLapFlag2658','recordFlag8a98','ambientD4b00','fortressD8240'];
function globals(value,layout){
 const g=record(value,'source progress globals'),out=Object.fromEntries(globalInts.map(k=>[k,integer(g[k],k)]));
 integer(out.primaryHumanIndex,'primaryHumanIndex',0,3);integer(out.secondaryHumanIndex,'secondaryHumanIndex',0,3);
 integer(out.players,'players',1,2);integer(out.courseIndex,'courseIndex',0,9);
 integer(out.event628,'event628',-32768,32767);
 return {...out,primaryCount:integer(g.primaryCount,'primaryCount',0,layout.nodes.length),
  finishSourceRow:integer(g.finishSourceRow,'finishSourceRow',0,layout.nodes.length-1),
  missesEnabled72e:integer(g.missesEnabled72e,'missesEnabled72e',0,65535),reverse:integer(g.reverse,'reverse',0,65535),
  ...Object.fromEntries(['finishMetric39b0','dqMetric39b4','checkpointSlackNative39c4'].map(k=>[k,scalar(g[k],k)]))};
}
function cue(effects,id,arg){effects.push({kind:'raceCue',arguments:[id,arg>>>0]});}
function dq(s,g){
 if(g.state638!==1)return;
 s.record2c24=g.mode620===11&&s.timingWords2a9c[88]<1?2:s.timingWords2a9c[14]<599999?1:2;
 if(g.mode620!==1||s.record2c24!==2){s.metric2c64=g.dqMetric39b4;g.dqMetric39b4=add(g.dqMetric39b4,10000);}
}
function timing(s,index,value){integer(index,'source timing write index',0,97);s.timingWords2a9c[index]=value|0;}
function currentNodes(layout,value){
 if(value===undefined)return layout.nodes;
 if(!Array.isArray(value)||value.length!==layout.nodes.length)throw new RangeError('Expected complete current primary centers');
 const centers=Array(value.length),seen=new Set();for(const p of value){const i=integer(p?.sourceRow,'current sourceRow',0,value.length-1);
  if(seen.has(i))throw new RangeError('Duplicate current primary center');seen.add(i);centers[i]=point(p,'current primary center');}
 return layout.nodes.map((n,i)=>({...n,centerNativeXZ:centers[i]}));
}
function checkpointFraction(q,node){
 const old=point(q.priorBodyPointNative,'actual prior body pointBE4/BEC'),p=q.positionNativeXZ,c=node.centerNativeXZ,f=node.forwardXZ;
 const distance=a=>Math.abs(add(mul(sub(a.x,c.x),f.x),mul(sub(a.z,c.z),f.z)));
 const now=distance(p),before=distance(old),denominator=add(now,before),value=mul(F(now/denominator),50);
 if(!Number.isFinite(value))throw new RangeError('Source crossing interpolation requires a finite evaluator result');
 return Math.trunc(value)|0;
}
function finishResult(s,g,effects,original,diagnostic){
 const globalWrites=Object.fromEntries(Object.entries(g).filter(([key,v])=>v!==original[key]));
 return frozen({state:s,globalWrites,effects,diagnostic});
}

/** One selected-racer7687c call, after actual76378 scratch selection and before
 * source ranking/record finalization. Call ALL racers in the source ascending
 * order with shared global writes, then rank once. Audio calls return ordered
 * recipes; their separate selector/queue playback is not synthesized.
 */
export function prepareNativePrimaryRaceProgress(layout,state,input){
 if(!layouts.has(layout))throw new TypeError('Expected compiled primary race layout');record(input,'source primary progress sample');
 const s=structuredClone(createNativePrimaryRaceState(state)),g=globals(input.globals,layout),original={...g},effects=[];
 const racer=integer(input.racerIndex,'racerIndex',0,3),human=racer===g.primaryHumanIndex||g.players===2&&racer===g.secondaryHumanIndex;
 const diagnostic={human,earlyReturn:null,gate:null,crossingCorrectionMs:null};
 if(racer===g.primaryHumanIndex)g.bestLapFlag2658=0;
 s.powerChanged2c4c=0;if(s.splitTimer2c38!==0)s.splitTimer2c38=sum(s.splitTimer2c38,-1);
 if(g.courseIndex===4&&g.drakeFog1fd0===0&&human&&s.timingWords2a9c[14]>50000)g.drakeFog1fd0=1;
 if(g.courseIndex===7){if(g.southernLap1fcc>=2)s.recordFamily='tertiary';else if(g.southernLap1fcc>0)s.recordFamily='secondary';}
 if(g.courseIndex===9&&racer===g.secondaryHumanIndex)s.recordFamily='secondary';
 if(g.event628===1&&racer===g.primaryHumanIndex||g.players===2&&g.event628===2&&racer===g.secondaryHumanIndex){
  if(s.record2c24===0)dq(s,g);diagnostic.earlyReturn='selected-racer-event';return finishResult(s,g,effects,original,diagnostic);
 }
 const clock=prepareNativePrimaryRaceClock({main638:g.state638,finished2c2c:s.finished2c2c,record2c24:s.record2c24,
  clockStopped817c:g.clockStopped817c,flag1fd4:g.flag1fd4,courseIndex:g.courseIndex,
  lapMs:s.timingWords2a9c[1],totalMs:s.timingWords2a9c[14],ambientWord:s.timingWords2a9c[2],ambientD4b00:g.ambientD4b00});
 if(clock.advanced){
  timing(s,1,clock.lapMs);timing(s,14,clock.totalMs);
  if(clock.totalLimit){dq(s,g);diagnostic.earlyReturn='total-time-limit';return finishResult(s,g,effects,original,diagnostic);}
  timing(s,2,clock.ambientWord);
 }
 const nodes=currentNodes(layout,input.nodePositionsNative),row=integer(s.nextPrimary2944,'nextPrimary2944',0,nodes.length-1),node=nodes[row];
 const p=point(input.positionNativeXZ,'actual scratch position3780/3788'),q={...input,positionNativeXZ:p};
 const gate=prepareNativePrimaryGateJudge(createNativePrimaryGateState({side2954:s.side2954,armed2958:s.armed2958}),
  {positionNativeXZ:p,selectedNode:node,regionsNative:layout.regionsNative,directionFlag1f90:g.directionFlag1f90,checkpointSlackNative39c4:g.checkpointSlackNative39c4});
 s.side2954=gate.state.side2954;s.armed2958=gate.state.armed2958;s.gateResult2960=0;diagnostic.gate=gate;
 let accepted=false;
 if(s.armed2958!==0&&s.side2954>=0){
  if(s.legalLapCounter2c58!==s.lap2938||node.checkpointFlag9c===1&&!gate.checkpointLimitPassed||
   node.enabledC8!==0&&!gate.regionShared||g.courseIndex===3&&g.mode620!==11&&node.classification98===4&&!gate.regionShared)s.armed2958=0;
  else{
   accepted=true;s.gateTimer2c28=0;
   if(node.checkpointFlag9c===0&&s.finished2c2c===0&&s.record2c24===0){
    const kind=node.classification98,correct=kind===0&&s.side2954===0||kind===1&&s.side2954===1;
    if(correct&&node.enabledC8!==0){
     if(s.power2a64<5){s.power2a64=sum(s.power2a64,1);s.powerChanged2c4c=1;}s.gateResult2960=1;
     if(human)cue(effects,kind===0?0x26:0x27,g.players===2&&racer===g.secondaryHumanIndex?0x80:0);
    }else if((kind===0||kind===1)&&!correct&&g.missesEnabled72e!==0&&g.state638===1&&node.enabledC8!==0){
     if(human){s.lapMisses2a68=sum(s.lapMisses2a68,1);s.totalMisses2a6c=sum(s.totalMisses2a6c,1);}
     if(s.totalMisses2a6c>=g.missLimit8174){s.missWords2a74[0]=1;if(human&&g.missLimit8174===0){dq(s,g);diagnostic.earlyReturn='zero-miss-allowance';return finishResult(s,g,effects,original,diagnostic);}}
     s.gateResult2960=2;
     if(human){let remaining=Math.max(0,sum(g.missLimit8174,-s.totalMisses2a6c));if(g.players===2&&racer===g.secondaryHumanIndex)remaining=sum(remaining,0x80);cue(effects,kind===0?0x29:0x28,remaining);}
    }
   }
   s.nextPrimary2944=node.nextSourceRowA0;if(gate.regionShared)s.postJudgeSourceRow2c48=row;s.side2954=-1;s.armed2958=1;
   if(g.courseIndex===3&&g.difficulty>0&&g.fortressFlag1fc8===0&&s.lap2938>=2&&(g.reverse!==0||node.classification98===6)){
    g.fortressFlag1fc8=1;const object=point(input.gateObjectNativeXZ,'actual gate object position');
    if(!Array.isArray(input.gateCamerasNativeXZ)||input.gateCamerasNativeXZ.length<g.players)throw new RangeError('Expected actual gate-feedback camera positions');
    for(let i=0;i<g.players;i++){const c=point(input.gateCamerasNativeXZ[i],'actual gate camera'),dx=sub(object.x,c.x),dz=sub(object.z,c.z);
     if(add(mul(dx,dx),mul(dz,dz))<16000000){effects.push({kind:'fortressGateCue',arguments:[]});break;}}
   }
  }
 }
 if(accepted&&s.missWords2a74[0]===0&&s.finished2c2c===0&&s.record2c24===0){
  if(g.courseIndex!==0){
   let correction=null;
   if(node.checkpointFlag9c===1&&s.lap2938>0){
    correction=checkpointFraction(q,node);diagnostic.crossingCorrectionMs=correction;
    if(node.classification98===3)timing(s,0,0);
    const elapsed=sum(s.timingWords2a9c[14],-correction);timing(s,8+s.lap2938*8+s.timingWords2a9c[0],elapsed);
    if(g.state638===1&&g.flag1fc4===0&&g.flag1fd8===0&&(row!==g.finishSourceRow||s.lap2938<g.configuredLaps728)){
     if(g.mode620===0&&g.reverse===0&&row===g.finishSourceRow&&s.lap2938<3){
      if(!Array.isArray(input.comparisonTimes)||s.lap2938>=input.comparisonTimes.length)throw new RangeError('Supply actual selected-course comparison times');
      const previous=integer(input.comparisonTimes[s.lap2938],'comparison time');
      if(previous>0){s.splitState2c34=previous<elapsed?1:2;s.splitDelta2c30=previous<elapsed?sum(elapsed,-previous):sum(previous,-elapsed);s.splitTimer2c38=40;}
     }else s.splitState2c34=g.mode620===4||g.mode620===1?10:0;
    }
   }
   if(row===g.finishSourceRow){
    if(s.lap2938>0){
     if(correction===null)throw new RangeError('A reached finish requires its source checkpoint interpolation');
     const lapTime=sum(s.timingWords2a9c[1],-correction);timing(s,1,lapTime);
     if(g.state638===1){
      if(s.lap2938<10){timing(s,4+s.lap2938,lapTime);integer(s.lap2938,'lap miss write index',0,9);s.missWords2a74[s.lap2938]=s.lapMisses2a68;}
      else{for(let j=1;j<9;j++){timing(s,4+j,s.timingWords2a9c[5+j]);s.missWords2a74[j]=s.missWords2a74[j+1];}timing(s,13,lapTime);s.missWords2a74[9]=s.lapMisses2a68;}
      if(lapTime<s.timingWords2a9c[3]){timing(s,3,lapTime);timing(s,4,s.lap2938);}
      if(g.players===1&&racer===g.primaryHumanIndex){
       let arg=0;
       if(s.timingWords2a9c[3]<g.bestTime1fe0){g.bestLapFlag2658=1;if(g.mode620===0&&s.lap2938<g.configuredLaps728)g.recordFlag8a98=1;
        g.bestTime1fe0=s.timingWords2a9c[3];arg=1;}
       else if(g.mode620===0&&s.splitState2c34===2)arg=2;
       if(s.lap2938<g.configuredLaps728)cue(effects,0x21,arg+(g.configuredLaps728===sum(s.lap2938,1)?0x80:0));
      }else if(g.players===2&&human&&s.lap2938<g.configuredLaps728)cue(effects,0x21,g.configuredLaps728===sum(s.lap2938,1)?0x80:0);
     }
     timing(s,1,correction);
     if(g.courseIndex===3&&g.difficulty>0&&g.fortressD8240===0)s.recordFamily='secondary';
     if(g.courseIndex===7&&human&&g.southernLap1fcc<s.lap2938)g.southernLap1fcc=sum(g.southernLap1fcc,1);
     if(human&&s.lap2938<g.configuredLaps728&&s.place293c>=0&&s.place293c<=2)effects.push({kind:'placeCue',arguments:[2-s.place293c]});
     if(g.configuredLaps728<=s.lap2938&&g.noFinish8178===0&&g.flag1fd4===0){
      s.finished2c2c=1;s.metric2c64=g.finishMetric39b0;g.finishMetric39b0=sub(g.finishMetric39b0,10000);
      timing(s,14,0);for(let j=0;j<Math.min(g.configuredLaps728,9);j++)timing(s,14,sum(s.timingWords2a9c[14],s.timingWords2a9c[5+j]));
      if(!human)s.power2a64=0;
     }
    }
    if(g.noFinish8178===0||s.lap2938===0){if(s.lap2938<g.configuredLaps728){s.lap2938=sum(s.lap2938,1);s.legalLapCounter2c58=s.lap2938;}}
    s.lapMisses2a68=0;for(let j=1;j<g.primaryCount;j++)s.gateFlags2964[j]=0;
    if(s.lap2938>1&&s.finished2c2c===0)s.lapFlag2c40=1;
   }
   s.gateFlags2964[row]=1;
  }
 }
 if(s.power2a64!==s.displayPower2a70)s.displayPower2a70=sum(s.displayPower2a70,sum(s.power2a64,-s.displayPower2a70)>0?1:-1);
 const standings=prepareNativePrimaryStandings(layout.standings,createNativePrimaryStandingsState(s),{
  state638:g.state638,courseIndex:g.courseIndex,lap2938:s.lap2938,postJudgeSourceRow2c48:s.postJudgeSourceRow2c48,
  finishSourceRow:g.finishSourceRow,primaryCount:g.primaryCount,positionNativeXZ:p,finished2c2c:s.finished2c2c,record2c24:s.record2c24,
  nodePositionsNative:nodes.map(n=>({sourceRow:n.sourceRow,...n.centerNativeXZ}))});
 Object.assign(s,standings.state);diagnostic.standings=standings.diagnostic;
 return finishResult(s,g,effects,original,diagnostic);
}
