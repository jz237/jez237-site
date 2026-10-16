// Numeric65C18 contact counter and final HUD posture. These read the actual
// completed hull/contact/actor owners; rider joints and display speed are not
// source body fields. New web adapters explicitly start the counter at0.
const F=Math.fround;
function integer(v,n){if(!Number.isInteger(v)||v< -2147483648||v>2147483647)throw new RangeError(`Invalid ${n}`);return v;}
export function nextNativeDryContactFrames(previous,{anyWet,impacts}={}){
 integer(previous,'dry-contact counter16d0');
 if(typeof anyWet!=='boolean'||!impacts||typeof impacts.markedBox!=='boolean')throw new TypeError('Supply actual wet/contact owners');
 for(const k of ['floorImpactNative','boxImpactNative','shoreImpactNative'])
  if(!Number.isFinite(impacts[k]))throw new TypeError('Supply finite native contact impacts');
 return !anyWet&&(impacts.floorImpactNative!==0||impacts.boxImpactNative!==0&&!impacts.markedBox||impacts.shoreImpactNative!==0)?(previous+1)|0:0;
}
export function nativeBodyHudPosture(actorState,physicalMode){
 integer(actorState,'actorC54');integer(physicalMode,'physicalMode157c');
 return actorState===23?2:actorState===24?1:actorState===7?(physicalMode===0?2:1):0;
}
export function nativeRaceBodyFields(adapter){
 if(!adapter?.frame||adapter.pendingFrameCompletion||!adapter.lastFrame||adapter.logicalFrames<1)
  throw new TypeError('Source race samples require a completed native outer frame');
 const scale=adapter.hull.scale,toNative=p=>Object.fromEntries(['x','y','z'].map(k=>[k,F(p[k]/scale)]));
 const position=toNative(adapter.hull.center),previous=toNative(adapter.frame.startCenter),profile=adapter.water.profile;
 const displacement=['x','y','z'].map(k=>F(position[k]-previous[k]));
 return {positionNative:position,positionNativeXZ:{x:position.x,z:position.z},priorBodyPointNative:previous,
  forwardXZ:{x:F(adapter.hull.frame.forward.x),z:F(adapter.hull.frame.forward.z)},
  speedB90Native:F(Math.sqrt(F(F(F(displacement[0]*displacement[0])+F(displacement[1]*displacement[1]))+F(displacement[2]*displacement[2])))),
  // F23A0 calls B98 "speed", but it is the actual applied jet force.
  frameSpeedB98:F(adapter.water.forceNative),speedBbc:F(profile.contactForceNative),
  speedBc0:F(F(profile.peakForceNative)*F(profile.lowSpeedForceRatio)),
  field16d0:integer(adapter.dryContactFrames16d0,'dry-contact counter16d0'),
  actorState:adapter.lastFrame.actorState,
  field15c0:nativeBodyHudPosture(adapter.lastFrame.actorState,adapter.riderLifecycle?.physicalMode??0)};
}

function bounded(v,n,min,max){integer(v,n);if(v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function frozen(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(frozen);Object.freeze(v);}return v;}
function float(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${n}`);return F(v);}

/** Numeric5DD04 downward support scan. The actual point90 and signed datum2458
 * are inputs. Each reached7F448/7FAE4 return is supplied in source call order;
 * the functions that select and query collision geometry are separate producers.
 * No renderer height or boolean retirement approximation is consumed. Missing
 * reached returns reject; no external callback runs during preparation.
 */
export function prepareNativeRetirementSupportProbe(value){
 const p=value?.point90Native;if(!p)throw new TypeError('Supply actual point90Native');
 const x=float(p.x,'point90.x'),z=float(p.z,'point90.z'),lower=F((integer(value.datum2458,'datum2458')-50)|0);
 let y=F(float(p.y,'point90.y')-10),index=0;const operations=[];
 while(lower<y){
  for(const consumer of ['8007f448','8007fae4']){
   const result=float(value.queryReturns?.[index++],'actual support query return');
   operations.push({kind:'supportProbeQuery',consumer,positionNative:{x,y,z},returnValue:result});
   if(result!==0)return frozen({supported:true,operations});
  }
  const next=F(y-16);if(next===y)throw new RangeError('Source support height does not progress');y=next;
 }
 return frozen({supported:false,operations});
}

/** Result-code subsection5E0A8..5E3E0 of5DE24, under its retained16C8<0 gate.
 * Caller supplies canonical source race/profile views and actual body16C8
 * words. Only returned bodyResultCodeWrite operations may update those bodies;
 * no second retained body or race owner is constructed. Aliased human slots
 * deliberately retain duplicate source writes and their order.
 *
 * One contiguous resultTableWords47fc view supplies overlapping effect47FC,
 * solo4800 and versus4818 tables. Reads are branch-lazy. The surrounding
 * physical-prefix arithmetic and zero-simulation dispatch remain caller-owned.
 */
export function prepareNativeRaceResultCodeSelection(value){
 if(!value||typeof value!=='object')throw new TypeError('Supply source result selection');
 const index=bounded(value.racerIndex,'racerIndex',0,3),operations=[];
 const current=integer(value.bodyResultCodes16c8?.[index],'actual body16c8');
 if(current>=0)return frozen({operations,diagnostic:{selected:false,reason:'retained-code'}});
 const scene=value.scene??{},g=k=>integer(scene[k],`scene.${k}`),human=k=>bounded(g(k),k,0,3);
 let race;
 function word(address){
  if(!race){const raw=value.raceWords1f94;
   if(!Array.isArray(raw)||raw.length!==1693)throw new RangeError('Supply canonical raceWords1f94');
   race=raw;
  }
  const bits=race[(address-0x1f94)/4];if(!Number.isInteger(bits)||bits<0||bits>0xffffffff)throw new RangeError('Invalid canonical race word');
  return bits|0;
 }
 const rec=(slot,offset)=>word(0x2938+slot*0x378+offset);
 function table(address){
  const raw=value.resultTableWords47fc,at=(address-0x47fc)/4;
  if(!Array.isArray(raw)||!Number.isInteger(at)||at<0||at>=raw.length)throw new RangeError('Supply reached resultTableWords47fc');
  const bits=raw[at];if(!Number.isInteger(bits)||bits<0||bits>0xffffffff)throw new RangeError('Invalid result table word');return bits|0;
 }
 function write(slot,code){operations.push({kind:'bodyResultCodeWrite',racerIndex:slot,value:code>>>0});}
 if(rec(index,0x2f4)!==0){
  const mode=g('mode620');
  if(mode===0)write(index,word(0x2650)===1?6:3);
  else if(mode===11){const place=word(0x2928);write(index,place===0?3:place===1?1:2);}
  else if(g('players')===1){
   const profile=value.profileWordsB330;
   if(!Array.isArray(profile)||profile.length!==52)throw new RangeError('Supply extended canonical profileWordsB330');
   const bits=profile[50+(index>>>1)];if(!Number.isInteger(bits)||bits<0||bits>0xffffffff)throw new RangeError('Invalid rider flag word');
   const qualified=(bits>>>(index&1?0:16))&65535;
   if(qualified===0)write(index,4);
   else{const code=table(0x4800+rec(index,4)*4);write(index,code);if(code===4)write(index,3);}
  }else{
   const primary=human('primaryHumanIndex'),secondary=human('secondaryHumanIndex');
   if(rec(primary,0x2f4)!==0&&rec(secondary,0x2f4)!==0&&rec(primary,0x19c)===rec(secondary,0x19c)){
    write(secondary,3);write(primary,3);
   }else{write(primary,table(0x4818+rec(primary,4)*4));write(secondary,table(0x4818+rec(secondary,4)*4));}
  }
 }else if(rec(index,0x2ec)!==0&&g('simulation648')!==1){
  if(g('players')===1){const probe=prepareNativeRetirementSupportProbe(value.supportProbe);
   operations.push(...probe.operations);write(index,probe.supported?4:5);
  }else{
   const primary=human('primaryHumanIndex'),secondary=human('secondaryHumanIndex');
   if(rec(primary,0x2ec)!==0&&rec(secondary,0x2ec)!==0){write(secondary,3);write(primary,3);}
   else if(index===primary){write(primary,4);write(secondary,1);}
   else{write(primary,1);write(secondary,4);}
  }
 }else{const effect=g('resultEffect393c');if(effect!==0)write(index,table(0x47fc+effect*4));}
 return frozen({operations,diagnostic:{selected:operations.some(o=>o.kind==='bodyResultCodeWrite')}});
}
