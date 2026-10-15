// Independently reconstructed numeric F23A0 speed-display producer and ED304
// Math_Rand. These are source display integers, not physical speed/forces.
// Canonical race/HUD storage and the separate external u16 seed stay owned by
// the caller. No original executable, animation, or graphics data is included.

const F=Math.fround,MIN=-2147483648,MAX=2147483647,RACE_BASE=0x1f94,RACE_WORDS=1693,HUD_WORDS=1442;
const raceIndex=address=>(address-RACE_BASE)/4;
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function words(v,count,n){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires ${count} unsigned words`);
 return Array.from(v,(x,i)=>integer(x,`${n}[${i}]`,0,0xffffffff));}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${n} must fit finite float32`);return F(v);}
function finite(v,n){if(!Number.isFinite(v))throw new RangeError(`${n} requires finite source arithmetic; FCSR exceptions are not emulated`);return v;}
function truncate(v){if(!Number.isFinite(v)||v<MIN||v>=2147483648)
 throw new RangeError('Source display conversion must fit finite signed32; FCSR exceptions are not emulated');return Math.trunc(v)|0;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Complete bounded ED304 Math_Rand arithmetic. This u16 seed at80226f00 is
 * distinct from the32-bit SysUtils_Rand/AI initialization RNG. argumentU32 is
 * the actual low32 argument bits. Source writes the new halfword even for a
 * zero argument, and returns arithmetic upper16 of the low32 product.
 * No original boot/reset seed is inferred. The returned write is pending.
 */
export function prepareNativeMathRand(value){
 record(value,'source Math_Rand input');
 const seed=integer(value.seed6f00,'seed6f00',0,65535),argument=integer(value.argumentU32,'argumentU32',0,0xffffffff);
 const next=(seed*5+1)&65535,result=Math.imul(next,argument)>>16;
 return freeze({value:result,operations:[{kind:'sourceHalfwordWrite',field:'seed6f00',value:next}]});
}

/** Complete numeric F23A0 for a prepared source racerCount0..4. state has the
 * canonical raceWords1f94[1693], hudWords7788[1442] and scene.racerCount. Body
 * rows are actual {frameSpeedB98,speedBbc,speedBc0} native source float fields,
 * ordered by source racer slot, never inferred from SI velocity or an avatar.
 * scene.seed6f00 is required only when an upper-speed branch calls Math_Rand.
 * Unused body rows/seed are not read. HUD is retained unchanged and not written.
 *
 * Returns only immutable ordered partial operations plus diagnostics. The
 * caller applies the race words and external halfword to its single owner.
 * In particular,2c04 is stored BEFORE the RNG call, then jitter and optional
 * upper clamp are stored, followed by2c00. Repeated equal stores are retained.
 * This does not execute the enclosing activity gate, other79528 consumers,
 * frame scheduling, rendering, physical dynamics, or FCSR exception behavior.
 */
export function prepareNativeRaceSpeedDisplay(state,input={}){
 record(state,'canonical native race state');record(input,'source body sample');record(state.scene,'source scene');
 const race=words(state.raceWords1f94,RACE_WORDS,'raceWords1f94');
 words(state.hudWords7788,HUD_WORDS,'hudWords7788');
 const count=integer(state.scene.racerCount,'scene.racerCount',0,4),operations=[],samples=[];
 const bodies=count===0?undefined:input.bodyFieldsBySlot;
 if(count>0&&(!Array.isArray(bodies)||bodies.length<count||bodies.length>4))throw new RangeError('Supply actual body fields for every active source racer');
 let seed,seedRead=false,randomDraws=0;
 function write(address,value){const wordIndex=raceIndex(address),bits=value>>>0;race[wordIndex]=bits;operations.push({kind:'raceWordWrite',wordIndex,value:bits});}
 for(let slot=0;slot<count;slot++){
  const row=record(bodies[slot],`bodyFieldsBySlot[${slot}]`),speed=scalar(row.frameSpeedB98,'frameSpeedB98'),
   bbc=scalar(row.speedBbc,'speedBbc'),bc0=scalar(row.speedBc0,'speedBc0');
  const difference=finite(F(bbc-bc0),'speed difference'),threshold=finite(F(bc0-F(difference/5)),'speed threshold'),
   span=finite(F(F(difference*6)/5),'speed span');
  const targetAddress=0x2c04+slot*0x378,currentAddress=0x2c00+slot*0x378,upper=threshold<=speed;
  let target,jitter=null;
  if(upper){
   let fraction=speed;
   if(span>0)fraction=F(F(speed-threshold)/span);
   if(fraction<0)fraction=0;
   if(fraction>1)fraction=1;
   target=truncate(F(fraction*180));write(targetAddress,target);
   if(!seedRead){seed=integer(state.scene.seed6f00,'scene.seed6f00',0,65535);seedRead=true;}
   const draw=prepareNativeMathRand({seed6f00:seed,argumentU32:3});seed=draw.operations[0].value;
   operations.push(draw.operations[0]);randomDraws++;jitter=draw.value*2-2;
   target=(target+jitter)|0;write(targetAddress,target);
   if(target>=181){target=180;write(targetAddress,target);}
  }else{target=truncate(F(F(speed/threshold)*36));write(targetAddress,target);}
  const current=race[raceIndex(currentAddress)]|0,delta=(target-current)|0,absolute=delta<0?(-delta)|0:delta;
  let step=absolute<0?((absolute+3)|0)>>2:absolute>>2;
  if(step<2)step=2;
  if(current<target&&step>=5)step=4;
  const displayed=step<absolute?(current+(delta===0?0:delta>0?1:-1)*step)|0:target;
  write(currentAddress,displayed);
  samples.push({racerIndex:slot,upperBranch:upper,target2c04:target,display2c00:displayed,jitter});
 }
 return freeze({operations,diagnostic:{racerCount:count,randomDraws,samples}});
}
