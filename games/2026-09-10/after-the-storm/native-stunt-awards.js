// Numeric ownership of801FB488 and the popup/score portion of801FB514.
// Advance once per SOURCE display-stage call, not per browser render. The
// caller owns that schedule, canonical totals, award eligibility and startup.
// Graphics command emission and the separate bonus-message timers are outside
// this helper; no total changes merely because an award was enqueued.
const F=Math.fround,fields=['type','amount','age','x','y','velocityY','finishOffset'];
const totals=['total','time','ring','trick'],names={1:'time',2:'trick',3:'ring'};
function integer(v,name){if(!Number.isInteger(v)||v< -2147483648||v>2147483647)throw new RangeError(`Invalid ${name}`);return v;}
function copy(value){
 if(!value||!Array.isArray(value.slots)||value.slots.length!==4)throw new TypeError('Supply four retained award slots');
 const slots=value.slots.map((s,i)=>{
  const out=Object.fromEntries(fields.map(k=>[k,integer(s?.[k],`slots[${i}].${k}`)]));
  if(out.type<0||out.type>3)throw new RangeError('Unknown native award type');return out;
 });
 return {slots,pulsePhase:integer(value.pulsePhase,'pulsePhase'),pulseTick:integer(value.pulseTick,'pulseTick'),
  totals:Object.fromEntries(totals.map(k=>[k,integer(value.totals?.[k],`totals.${k}`)]))};
}
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
const cappedAdd=(a,b)=>Math.min((a+b)|0,99999);

/** Explicit fresh web state; not a claim about retained cartridge memory. */
export function freshNativeStuntAwards(){
 return freeze({slots:Array.from({length:4},()=>Object.fromEntries(fields.map(k=>[k,0]))),pulsePhase:0,pulseTick:0,
  totals:{total:0,time:0,ring:0,trick:0}});
}

/** The first empty slot wins; a full queue overwrites slot0. No evicted award
 * is transferred, merged, delayed or rescued. Enqueue resets both pulse words. */
export function enqueueNativeStuntAward(value,{kind,points,finish}={}){
 const type={time:1,trick:2,ring:3}[kind];if(!Number.isInteger(type))throw new RangeError('Unknown native award kind');
 integer(points,'award points');if(typeof finish!=='boolean')throw new TypeError('Supply the source finish flag');
 const state=copy(value),empty=state.slots.findIndex(s=>s.type===0),slot=empty<0?0:empty;
 const replaced=state.slots[slot].type!==0?{...state.slots[slot]}:null;
 state.slots[slot]={type,amount:points,age:0,x:0,y:0,velocityY:-8,finishOffset:finish?-32:0};
 state.pulsePhase=state.pulseTick=0;
 return freeze({state,slot,replaced});
}

/** Positions/alpha describe the popup drawn BEFORE this call's motion and
 * age updates. On the23rd call the award is still drawn, then transferred and
 * its type cleared. Signed32 addition precedes the original upper-only cap. */
export function advanceNativeStuntAwards(value){
 const state=copy(value),display=[],transfers=[];
 const pulseBlend=F(1-F(F((2-state.pulseTick)|0)/2));
 state.pulseTick=(state.pulseTick+1)|0;
 if(state.pulseTick>=2){state.pulseTick=0;state.pulsePhase=(state.pulsePhase+1)&3;}
 for(let slot=0;slot<4;slot++){
  const s=state.slots[slot];if(s.type===0)continue;
  const alpha=(s.age<4?Math.trunc(Math.imul(s.age,255)/4):s.age<20?255:Math.trunc((5865-Math.imul(s.age,255)|0)/4))&255;
  display.push({slot,kind:names[s.type],points:s.amount,alpha,x:s.x,y:s.y,finishOffset:s.finishOffset,age:s.age});
  s.y=(s.y+s.velocityY)|0;
  if(s.velocityY>=-8)s.velocityY=(s.velocityY+1)|0;
  if(s.y>=0){s.y=0;s.velocityY=-10;}
  if(s.velocityY===-10)s.x=(s.x-10)|0;
  s.age=(s.age+1)|0;
  if(s.age>=23){
   const kind=names[s.type];state.totals.total=cappedAdd(state.totals.total,s.amount);
   state.totals[kind]=cappedAdd(state.totals[kind],s.amount);
   transfers.push({slot,kind,points:s.amount,total:state.totals.total,subtotal:state.totals[kind]});s.type=0;
  }
 }
 return freeze({state,display,transfers,pulseBlend});
}

/** Call only when the source world-display stage9328C is reached, after the
 * gameplay update. This combines its45/2 overlay exclusion with FC4D4's
 * main1/activity-1/mode11 gate. Main8 draws other HUD content, but does not
 * advance awards. Rendering the browser view must never call this itself. */
export function displayNativeStuntAwards(value,context){
 const g=Object.fromEntries(['mainState638','activity624','mode620','gameStateDab24','overlayMode8aa4']
  .map(k=>[k,integer(context?.[k],k)]));
 if(g.activity624< -32768||g.activity624>32767)throw new RangeError('activity624 must fit signed16');
 const applied=g.mainState638===1&&g.activity624===-1&&g.mode620===11&&!(g.gameStateDab24===45&&g.overlayMode8aa4===2);
 return applied?freeze({applied,...advanceNativeStuntAwards(value)}):freeze({applied,state:copy(value),display:[],transfers:[],pulseBlend:null});
}
