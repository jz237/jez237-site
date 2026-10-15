// Numeric F1CFC warning/retirement. Raw caller-owned race/HUD words remain the
// only retained owners; geometry/body inputs are actual source read views.
const F=Math.fround,BASE=0x1f94,RACE_WORDS=1693,HUD_BASE=0x7788,HUD_WORDS=1442;
const data=new DataView(new ArrayBuffer(4));
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${n} must fit finite float32`);return F(v);}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);return Array.from(v,x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function point(v){record(v,'actual body positionNativeXZ');return {x:scalar(v.x,'position.x'),z:scalar(v.z,'position.z')};}
function asFloat(bits){data.setUint32(0,bits,false);return data.getFloat32(0,false);}
function asBits(value){data.setFloat32(0,scalar(value,'retirement metric'),false);return data.getUint32(0,false);}
function context(raceWords1f94){return {race:words(raceWords1f94,'raceWords1f94',RACE_WORDS),operations:[]};}
const rowBase=i=>0x2938+i*0x378;
const read=(c,address)=>c.race[(address-BASE)/4];
const signed=(c,address)=>read(c,address)|0;
function recordWrite(c,racer,address,value){
 const bits=value>>>0,index=(rowBase(racer)+address-BASE)/4;c.race[index]=bits;
 c.operations.push({kind:'recordWordWrite',racerIndex:racer,wordIndex:address/4,value:bits});
}
function raceWrite(c,address,value){const wordIndex=(address-BASE)/4,bits=value>>>0;c.race[wordIndex]=bits;c.operations.push({kind:'raceWordWrite',wordIndex,value:bits});}

/** Exact numeric74264 query on supplied native XZ. Course0 uses the source's
 * F32 sum-of-squares, F32 square root and inclusive radius7700. Other courses
 * use the actual1f80 allowed rectangles, with their sentinel removed, in source
 * order. This is distinct from the1f84 coarse regions. No course bounds are
 * invented. The finite F32 input domain and64-row API bound are explicit.
 */
export function nativeRaceOutsideAllowedRegion(positionNativeXZ,input){
 record(input,'source allowed-region query');const p=point(positionNativeXZ),course=integer(input.courseIndex,'courseIndex');
 if(course===0){const squared=F(F(p.x*p.x)+F(p.z*p.z));return !(F(Math.sqrt(squared))<=7700);}
 const rows=input.allowedRegionsNative;
 if(!Array.isArray(rows)||rows.length>64)throw new RangeError('Supply bounded actual1f80 allowedRegionsNative');
 for(const row of rows){
  if(!Array.isArray(row)||row.length!==4)throw new RangeError('Expected four allowed-region bounds');
  const r=Array.from(row,v=>scalar(v,'allowed-region bound'));
  if(r[0]===r[1])throw new RangeError('Remove the source allowed-region sentinel');
  if(r[0]<=p.x&&p.x<=r[1]&&r[2]<=p.z&&p.z<=r[3])return false;
 }
 return true;
}

function retirement(c,input){
 record(input,'actual retirement context');const main=integer(input.main638,'main638');
 if(main!==1)return {applied:false};
 const racer=integer(input.racerIndex,'racerIndex',0,3),mode=integer(input.mode620,'mode620'),base=rowBase(racer);
 const status=mode===11&&signed(c,base+0x2c4)<1?2:signed(c,base+0x19c)<599999?1:2;
 recordWrite(c,racer,0x2ec,status);
 if(mode!==1||status!==2){
  const bits=read(c,0x39b4),metric=scalar(asFloat(bits),'retained dqMetric39b4'),next=F(metric+10000);
  // Copy the actual source bits to the record, preserving a signed zero.
  recordWrite(c,racer,0x32c,bits);raceWrite(c,0x39b4,asBits(next));
 }
 return {applied:true,racerIndex:racer,record2c24:status};
}

/** Full bounded762D0 retirement, including real status and shared DQ metric
 * writes. main638 is read first; mode/racer are unnecessary when main!=1.
 * The mode11 time word is canonical timing[88]; total time is timing[14].
 * It does not invent actor/results/scene completion. Returns partial writes
 * only, with no separate status/metric/timing state owner.
 */
export function prepareNativeRaceRetirement(raceWords1f94,input){
 const c=context(raceWords1f94),diagnostic=retirement(c,input);return freeze({operations:c.operations,diagnostic});
}

/** Full F1CFC call. Source mode620 and configured players1/2 are explicit.
 * Inside-span words/flags/limits derive from canonical raceWords1f94[1693]
 * and hudWords7788[1442]. Body inputs use source-slot order and may omit fields
 * that the actual branch does not read: positionNativeXZ for queried racers,
 * field16d0 except on course8, actorState only for active eligible warnings.
 * The LHU72e gate is missesEnabled72e; configuredLaps728 is NOT read here.
 * Human selectors may alias and their loops observe previous same-call writes.
 *
 * Ordered operations share the existing recordWordWrite/audioEntry contract;
 * raceWordWrite.wordIndex is relative1f94 for canonical shared39b4 updates.
 * Audio entry arguments preserve source register bits. Playback is external;
 * no arbitrary callback runs while preparing numeric state. Retirement helper
 * calls are already expanded and recorded only in diagnostic.numericCalls.
 * No HUD word, source clock, main/phase, actor or physical craft is mutated.
 */
export function prepareNativeRaceBoundaryWarning(value){
 record(value,'source boundary-warning sample');const c=context(value.raceWords1f94),hud=words(value.hudWords7788,'hudWords7788',HUD_WORDS),g=record(value.globals,'source warning globals');
 const mode=integer(g.mode620,'mode620'),players=integer(g.players,'players',1,2),diagnostic={versusSuppressed:false,queries:[],numericCalls:[],racers:[]};
 const human=which=>integer(which===0?g.primaryHumanIndex:g.secondaryHumanIndex,which===0?'primaryHumanIndex':'secondaryHumanIndex',0,3);
 const done=i=>signed(c,rowBase(i)+0x2f4)!==0||signed(c,rowBase(i)+0x2ec)!==0;
 if(mode===1)diagnostic.versusSuppressed=done(human(0))||done(human(1));
 for(let player=0;player<players;player++){
  const racer=human(player),base=rowBase(racer),racerDiagnostic={playerIndex:player,racerIndex:racer,skipped:null};diagnostic.racers.push(racerDiagnostic);
  // Actual source status read precedes finish; skipped racers need no body.
  if(signed(c,base+0x2ec)!==0||signed(c,base+0x2f4)!==0){racerDiagnostic.skipped='finished-or-status';continue;}
  const bodies=value.bodiesBySlot;
  if(!Array.isArray(bodies)||bodies.length>4)throw new RangeError('Supply actual bodiesBySlot');
  const body=record(bodies[racer],'selected source body'),position=point(body.positionNativeXZ),course=integer(g.courseIndex,'courseIndex');
  const prolonged=course===8?false:integer(body.field16d0,'body.field16d0')>=81;
  // The source calls74264 even when the body16D0 alternative is already true.
  const outside=nativeRaceOutsideAllowedRegion(position,{courseIndex:course,allowedRegionsNative:value.allowedRegionsNative});
  diagnostic.queries.push({racerIndex:racer,positionNativeXZ:position,outside});
  let eligible=false;
  if((outside||prolonged)&&!diagnostic.versusSuppressed)eligible=integer(g.missesEnabled72e,'missesEnabled72e',0,65535)!==0;
  Object.assign(racerDiagnostic,{outside,field16d0Eligible:prolonged,eligible});
  const active=signed(c,base+0x2e4)!==0;
  if(active){
   if(!eligible){recordWrite(c,racer,0x2e4,0);continue;}
   const actor=integer(body.actorState,'body.actorState');
   if(actor===23||actor===7){racerDiagnostic.skipped='frozen-actor';continue;}
   let counter=signed(c,base+0x2e8);
   if(counter>0){
    const limit=hud[(0x8b5c-HUD_BASE)/4]|0;
    if(counter<=limit){
     const bias=prolonged?128:0;
     if(counter===limit||counter%20===0){
      const argument=(Math.trunc(counter/20)+bias-(counter===limit?0:1))|0;
      c.operations.push({kind:'audioEntry',consumer:'800c37f4',arguments:[10,argument>>>0]});
      counter=signed(c,base+0x2e8);
     }
    }
    recordWrite(c,racer,0x2e8,(counter-1)|0);
   }else if(counter===0){
    diagnostic.numericCalls.push({consumer:'800762d0',racerIndex:racer,operationIndex:c.operations.length,prepared:true});
    retirement(c,{racerIndex:racer,main638:g.main638,mode620:g.mode620});
   }
  }else if(eligible){
   recordWrite(c,racer,0x2e4,1);recordWrite(c,racer,0x2e8,((hud[(0x8b5c-HUD_BASE)/4]|0)+20)|0);
  }
 }
 return freeze({operations:c.operations,diagnostic});
}
