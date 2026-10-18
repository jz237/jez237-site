// Original6A748 ring contacts. The complete shared object array stays in raw
// source order; type8 is a ring. Collection and fade words are integer bits.
const F=Math.fround,BASE=0x1f94,WORDS=49,view=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function finite(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${n}`);return F(v);}
function float(v){view.setUint32(0,v);return finite(view.getFloat32(0),'ring float');}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`Supply ${n}[${count}]`);return v.map(x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Reached after79528 and before7DBC0 in6E3A8. The caller owns activity/mode
 * gating. Only the primary human is sampled, using body44/48/4C plus8 on Y.
 * Award enqueue and audio remain ordered recipes, not immediate score changes.
 * Reset6AACC and object loading are separate; this never resets retained state.
 */
export function prepareNativeStuntRings({raceWords1f94,objectWordsC940,globals},input={}){
 const race=words(raceWords1f94,'raceWords1f94',1693),operations=[],diagnostic={collectedRows:[],fadedRows:[]};
 const primary=integer(globals?.primaryHumanIndex,'primaryHumanIndex',0,3),record=primary*222;
 if(race[(0x2c2c-BASE)/4+record]!==0||race[(0x2c24-BASE)/4+record]!==0)return freeze({operations,diagnostic});
 const count=integer(globals.objectCountFa40,'objectCountFa40',-2147483648,64);
 if(count<=0)return freeze({operations,diagnostic});
 const objects=words(objectWordsC940,'objectWordsC940',64*WORDS),p=input.primaryBodyPositionNative;
 const body={x:finite(p?.x,'primary body44'),y:F(finite(p?.y,'primary body48')+8),z:finite(p?.z,'primary body4c')};
 const read=(row,offset)=>objects[row*WORDS+offset/4];
 let nextOrdinal,streak,ringCount;
 for(let row=0;row<count;row++){
  if(read(row,0x4c)!==8)continue;
  if(read(row,0xbc)!==0){
   const age=read(row,0x6c)|0;
   if(age<255){operations.push({kind:'objectWordWrite',wordIndex:row*WORDS+0x6c/4,value:(age+1)>>>0});diagnostic.fadedRows.push(row);}
   continue;
  }
  const dx=F(body.x-float(read(row,0))),dz=F(body.z-float(read(row,8))),dy=F(body.y-float(read(row,4)));
  const slab=F(F(float(read(row,0x30))*dx)+F(dz*float(read(row,0x34))));
  if(Math.abs(slab)>32)continue;
  const radial=F(F(float(read(row,0x38))*dx)+F(dz*float(read(row,0x3c))));
  const radius=F(Math.sqrt(F(F(radial*radial)+F(dy*dy))));
  if(!(radius<112))continue;
  if(nextOrdinal===undefined){
   nextOrdinal=integer(globals.ringNext0cb0,'ringNext0cb0');streak=integer(globals.ringStreak0cb4,'ringStreak0cb4');
   ringCount=race[(0x292c-BASE)/4]|0;
  }
  const ordinal=read(row,0xc0)|0;
  streak=nextOrdinal===ordinal?(streak+1)|0:1;nextOrdinal=(ordinal+1)|0;ringCount=(ringCount+1)|0;
  operations.push({kind:'objectWordWrite',wordIndex:row*WORDS+0xbc/4,value:1},
   {kind:'sourceWordWrite',field:'ringNext0cb0',value:nextOrdinal>>>0},{kind:'sourceWordWrite',field:'ringStreak0cb4',value:streak>>>0},
   {kind:'raceWordWrite',wordIndex:(0x292c-BASE)/4,value:ringCount>>>0},
   {kind:'stuntAwardEnqueue',award:{kind:'ring',points:(Math.imul((streak-1)|0,50)+50)|0,finish:false}},
   {kind:'externalCall',consumer:'800c3628',arguments:[streak>>>0]});
  diagnostic.collectedRows.push(row);
 }
 return freeze({operations,diagnostic});
}
