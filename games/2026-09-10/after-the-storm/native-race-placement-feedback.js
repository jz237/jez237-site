// Original placement/easing numeric consumer. All retained display fields stay
// in the existing canonical HUD span; source records and physical bodies are
// read views. This prepares source-call updates without drawing or callbacks.
const F=Math.fround,MIN=-2147483648,MAX=2147483647,HUD_BASE=0x7788,RACE_BASE=0x1f94;
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${n} must fit finite float32`);return F(v);}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);
 return Array.from(v,x=>integer(x,`${n} word`,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function context(v){record(v,'placement-feedback sample');record(v.scene,'source placement scene');return {value:v,scene:{...v.scene},
 hud:words(v.hudWords7788,'hudWords7788',1442),race:null,operations:[],positionQueries:[]};}
const h=(c,a)=>c.hud[(a-HUD_BASE)/4]|0;
function write(c,a,v){const value=v>>>0;c.hud[(a-HUD_BASE)/4]=value;c.operations.push({kind:'hudWrite',byteOffset:a-HUD_BASE,width:4,value});}
function race(c,a){c.race??=words(c.value.raceWords1f94,'raceWords1f94',1693);return c.race[(a-RACE_BASE)/4]|0;}
const r=(c,slot,offset)=>race(c,0x2938+slot*0x378+offset);
const s=(c,key,min=MIN,max=MAX)=>integer(c.scene[key],`scene.${key}`,min,max);
const abs32=v=>v<0?(-v)|0:v;
const sign=v=>v>0?1:v<0?-1:0;
function body(c,slot){const v=c.value.bodiesBySlot;if(!Array.isArray(v)||v.length>4)throw new RangeError('Supply actual bodiesBySlot');return record(v[slot],'source placement body');}
function position(c,slot){const p=record(body(c,slot).positionNativeXZ,'body.positionNativeXZ');return {x:scalar(p.x,'body.position.x'),z:scalar(p.z,'body.position.z')};}
function human(c,view){return s(c,view===0?'primaryHumanIndex':'secondaryHumanIndex',0,3);}
function rowEasing(c,base){
 let target=h(c,base+12),current=h(c,base+4),delta=(target-current)|0;
 if(target!==current){
  const magnitude=abs32(delta);
  if(magnitude<5){write(c,base+4,target);write(c,base+8,0);}
  else{
   write(c,base+4,(current+Math.imul(sign(delta),4))|0);
   write(c,base+8,delta<0?0:magnitude<16?Math.trunc(magnitude/2):8);
  }
 }else write(c,base+8,0);
 target=h(c,base+8);current=h(c,base);delta=(target-current)|0;
 if(target!==current)write(c,base,abs32(delta)<3?target:(current+Math.imul(sign(delta),2))|0);
}
function bodyEasing(c,slot){
 const flag=integer(body(c,slot).field15c0,'body.field15c0'),targetAddress=0x8dd8+slot*4,
  currentAddress=0x8dc8+slot*4,rateAddress=0x8de8+slot*4;
 if(flag===2)write(c,targetAddress,-15);
 else if(flag===1)write(c,targetAddress,-5);
 else{write(c,rateAddress,1);write(c,targetAddress,0);}
 const target=h(c,targetAddress),current=h(c,currentAddress);
 if(current===target)return;
 const delta=(target-current)|0,magnitude=abs32(delta),rate=(h(c,rateAddress)+1)|0;
 write(c,rateAddress,rate);
 write(c,currentAddress,delta>0?(current+1)|0:rate<magnitude?(current-rate)|0:target);
 if(h(c,currentAddress)===target)write(c,rateAddress,1);
}
function pulse(c,view,slot,base){
 if(h(c,base)===h(c,base+8)&&h(c,base+4)===h(c,base+12)&&race(c,0x1fd4)===0&&r(c,slot,0x2f4)===0){
  const selected=human(c,view);
  if(r(c,slot,0x320)===r(c,selected,0x320)&&r(c,slot,4)===((r(c,selected,4)+1)|0)&&
    r(c,slot,0x310)===r(c,selected,0x310)&&s(c,'phase650')===3){
   const a=position(c,selected),b=position(c,slot),x=F(a.x-b.x),z=F(a.z-b.z),distance=F(Math.sqrt(F(F(x*x)+F(z*z))));
   c.positionQueries.push({viewIndex:view,racerIndex:slot,selectedHumanIndex:selected,distanceNative:distance});
   if(distance<512)write(c,base+16,((h(c,base+16)+(distance<256?2:1))|0)&7);
  }
 }
 const current=h(c,base+16);
 if(current!==0){const next=(current+1)|0;write(c,base+16,next);if(next>=8)write(c,base+16,0);}
}
function placeChange(c){
 if(h(c,0x8a9c)===1){write(c,0x8a9c,2);write(c,0x8dfc,4);}
 const target=h(c,0x8dfc);let current=h(c,0x8df8);
 if(target!==current){current=(current+sign((target-current)|0))|0;write(c,0x8df8,current);}
 if(target===current){write(c,0x8a9c,current>0?3:0);write(c,0x8dfc,0);}
}

/** Complete originalF8DD0..F9520, once per actual source call. scene contains
 * actual players/racerCount, conditional primary/secondary human selectors
 * and phase650. Positive configured bounds are two views/four racers;
 * nonpositive source counts skip their loops. All bodies in the active racer
 * prefix supply signed field15c0. Their actual44/4c positionNativeXZ is read
 * only for the original settled-row/next-place/same-progress distance branch.
 * No actor-state, velocity, camera or fallback position is substituted.
 *
 * Canonical source places/finish/legal-lap/nearest-row/versus flag are read
 * directly from raceWords1f94[1693]. hudWords7788[1442] alone owns row8d28
 * histories,8dc8/8dd8/8de8 arrays and8a9c/8df8/8dfc place-change state. Incoming
 * signed histories retain source wrap and duplicate stores. A new proximity
 * pulse and a place-change transition advance further in the same call.
 *
 * Returns only ordered width4 HUD bit patches and detached diagnostics.
 * Nothing renders or mutates input, physical bodies, records, RNG or clocks.
 * These are source frame counts, independent of high-resolution rendering.
 */
export function prepareNativeRacePlacementFeedback(value){
 const c=context(value),players=s(c,'players'),count=s(c,'racerCount');
 if(players>2||count>4)throw new RangeError('Source placement views/racers exceed2/4');
 for(let view=0;view<players;view++){
  for(let slot=0;slot<count;slot++)write(c,0x8d28+view*0x50+slot*0x14+12,Math.imul(r(c,slot,4),24));
  for(let slot=0;slot<count;slot++)if(r(c,human(c,view),4)<r(c,slot,4)){
   const at=0x8d28+view*0x50+slot*0x14+12;write(c,at,(h(c,at)+4)|0);
  }
  for(let slot=0;slot<count;slot++)rowEasing(c,0x8d28+view*0x50+slot*0x14);
 }
 for(let slot=0;slot<count;slot++)bodyEasing(c,slot);
 for(let view=0;view<players;view++)for(let slot=0;slot<count;slot++)pulse(c,view,slot,0x8d28+view*0x50+slot*0x14);
 placeChange(c);
 return freeze({operations:c.operations,diagnostic:{activeViews:Math.max(0,players),activeRacers:Math.max(0,count),positionQueries:c.positionQueries}});
}
