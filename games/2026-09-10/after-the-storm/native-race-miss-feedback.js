// Numeric missed-buoy/power feedback. The source race and HUD spans are the
// retained owners; this module prepares ordered partial writes only.
import {prepareNativeRaceRetirement} from './native-race-boundary-warning.js';

const F=Math.fround,RACE_BASE=0x1f94,RACE_WORDS=1693,HUD_BASE=0x7788,HUD_WORDS=1442;
const bytes=new DataView(new ArrayBuffer(4));
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);return Array.from(v,x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function finite(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${n} must fit finite float32`);return F(v);}
function float(bits,n){bytes.setUint32(0,bits,false);return finite(bytes.getFloat32(0,false),n);}
function bits(value){bytes.setFloat32(0,finite(value,'feedback float write'),false);return bytes.getUint32(0,false);}
const ri=a=>(a-RACE_BASE)/4,hi=a=>(a-HUD_BASE)/4,base=r=>0x2938+r*0x378;
function hudWrite(c,address,value){const word=value>>>0;c.hud[hi(address)]=word;c.operations.push({kind:'hudWrite',byteOffset:address-HUD_BASE,width:4,value:word});}
function floatWrite(c,address,value){hudWrite(c,address,bits(value));}
function recordWrite(c,racer,offset,value){const word=value>>>0;c.race[ri(base(racer)+offset)]=word;c.operations.push({kind:'recordWordWrite',racerIndex:racer,wordIndex:offset/4,value:word});}
const hInt=(c,a)=>c.hud[hi(a)]|0,rInt=(c,r,a)=>c.race[ri(base(r)+a)]|0;
const hFloat=(c,a)=>float(c.hud[hi(a)],`HUD${a.toString(16)}`);
function retire(c,racer,g){
 c.diagnostic.numericCalls.push({consumer:'800762d0',racerIndex:racer,operationIndex:c.operations.length,prepared:true});
 const prepared=prepareNativeRaceRetirement(c.race,{racerIndex:racer,main638:g.main638,mode620:g.mode620});
 for(const op of prepared.operations){
  c.operations.push(op);
  if(op.kind==='recordWordWrite')c.race[ri(base(op.racerIndex))+op.wordIndex]=op.value;
  else if(op.kind==='raceWordWrite')c.race[op.wordIndex]=op.value;
  else throw new RangeError('Unexpected numeric retirement operation');
 }
}
function arrival(c,address,x,y,targetX,targetY){
 floatWrite(c,address,x);floatWrite(c,address+4,y);
 hudWrite(c,address+20,16);
 floatWrite(c,address+8,F(F(F(targetX)-hFloat(c,address))/8));
 floatWrite(c,address+12,F(F(F(targetY)-hFloat(c,address+4))/8));
}
function event(c,view,racer,g,players,minScale){
 const address=0x8c30+view*84,sourceEvent=rInt(c,racer,0x28);
 if(sourceEvent===0)return;
 if(hInt(c,address+24)!==0&&rInt(c,racer,0x13c)!==0)return;
 hudWrite(c,0x8c28,0);hudWrite(c,0x8c2c,0);
 if(sourceEvent===1&&(rInt(c,racer,0x314)!==0||hInt(c,address+52)===3)){
  if(hInt(c,address+52)===3){hudWrite(c,address+52,0);recordWrite(c,racer,0x12c,1);}
  const third=address+56;
  hudWrite(c,address+80,2);floatWrite(c,third+16,players===1?1:minScale);
  const scale=hFloat(c,third+16);
  floatWrite(c,third+8,F(scale*64));floatWrite(c,third+12,F(scale*10));
  floatWrite(c,third,300);floatWrite(c,third+4,players===1?206:view===0?105:215);
  hudWrite(c,third+20,rInt(c,racer,0x12c)<5?12:0);
 }else if(sourceEvent===2){
  const limit=integer(g.missLimit8174,'missLimit8174'),misses=rInt(c,racer,0x134);
  if(limit<misses)return;
  hudWrite(c,address+24,1);
  if(rInt(c,racer,0x12c)>=5)hudWrite(c,address+80,0);
  // Source integer subtraction/multiply/add wraps before conversion to F32.
  const remaining=(limit-misses)|0,targetX=(Math.imul(remaining,14)+(players===1?62:30))|0;
  const targetY=players===1?211:view===0?110:220;
  arrival(c,address,160,players===1?77:view===0?36:146,targetX,targetY);
  if(rInt(c,racer,0x12c)>0&&hInt(c,address+52)!==3){
   const second=address+28;
   hudWrite(c,address+52,3);
   // The source writes the second counter/scale before its two increments.
   floatWrite(c,second,160);floatWrite(c,second+4,players===1?121:view===0?78:188);
   hudWrite(c,second+20,16);floatWrite(c,second+16,1);
   floatWrite(c,second+8,F(F(198-hFloat(c,second))/8));
   floatWrite(c,second+12,F(F(F(targetY)-hFloat(c,second+4))/8));
  }
 }
}
function update(c,address,racer,g,decay,minScale){
 const state=hInt(c,address+24);
 if(state===1||state===3){
  let counter=hInt(c,address+20);
  if(counter<9){
   const x=hFloat(c,address),dx=hFloat(c,address+8),y=hFloat(c,address+4),dy=hFloat(c,address+12);
   floatWrite(c,address,F(x+dx));floatWrite(c,address+4,F(y+dy));
  }
  const scale=F(F(F(counter)+.5)/8.5);floatWrite(c,address+16,scale);
  if(1<scale)floatWrite(c,address+16,1);
  counter=(counter-1)|0;hudWrite(c,address+20,counter);
  if(counter<0){
   hudWrite(c,address+24,0);
   if(state===3)recordWrite(c,racer,0x12c,0);
   else if(rInt(c,racer,0x13c)!==0)retire(c,racer,g);
  }
 }else if(state===2){
  let counter=hInt(c,address+20);
  if(rInt(c,racer,0x12c)<5){counter=(counter-1)|0;hudWrite(c,address+20,counter);if(counter<0)hudWrite(c,address+24,0);}
  else{
   if(counter<255){counter=(counter+1)|0;hudWrite(c,address+20,counter);}
   if(counter>=20){const scale=F(hFloat(c,address+16)-decay);floatWrite(c,address+16,scale);if(scale<minScale)floatWrite(c,address+16,minScale);}
  }
 }
}

/** Complete bounded F0E7C numeric consumer, ending before adjacent F14B4.
 * The canonical raw spans, in unsigned words, remain the only retained state.
 * globals supplies players1/2 and selected source slot indices0..3; signed32
 * missLimit8174/main638/mode620 are required only when their branch reads them.
 * Constants7A44/7A48 come from the retained HUD words, not an invented gauge.
 * Geometry/body/actor input is not read by this original numeric function.
 *
 * All three28-byte HUD subrecords update in the same call as initialization.
 * Event2960 is retained. Aliased humans share actual power/status/metric
 * writes while their view HUD records remain separate. Unknown subrecord
 * states are retained. Integer operations wrap; float arithmetic roundsF32.
 *
 * Returns detached frozen hudWrite/recordWordWrite/raceWordWrite operations.
 * Nested762D0 is already expanded using the real numeric retirement helper;
 * diagnostic.numericCalls must not execute it again. No drawing/audio/clock,
 * body/actor transition or full-tail scheduling is fabricated. Caller cadence
 * and the adjacent drawing entry's retained palette advances stay external.
 * FiniteF32 values are required only for actually read/computed float fields.
 */
export function prepareNativeRaceMissFeedback(value){
 record(value,'source missed-buoy feedback sample');const g=record(value.globals,'source feedback globals');
 const c={race:words(value.raceWords1f94,'raceWords1f94',RACE_WORDS),hud:words(value.hudWords7788,'hudWords7788',HUD_WORDS),
  operations:[],diagnostic:{numericCalls:[],views:[]}};
 const players=integer(g.players,'players',1,2),decay=hFloat(c,0x7a44),minScale=hFloat(c,0x7a48);
 for(let view=0;view<players;view++){
  const racer=integer(view===0?g.primaryHumanIndex:g.secondaryHumanIndex,view===0?'primaryHumanIndex':'secondaryHumanIndex',0,3);
  c.diagnostic.views.push({playerIndex:view,racerIndex:racer,event2960:rInt(c,racer,0x28)});
  event(c,view,racer,g,players,minScale);
  for(let subrecord=0;subrecord<3;subrecord++)update(c,0x8c30+view*84+subrecord*28,racer,g,decay,minScale);
 }
 return freeze({operations:c.operations,diagnostic:c.diagnostic});
}

/** Only the independent canonical counter block inside adjacent F14B4;
 * this is not an implementation of that whole drawing function. Its preceding
 * opaque palette/vertex work reads the RETAINED phase/bank, and its subsequent
 * matrix/display-list work has no return dependency on these numeric writes.
 * drawRecipe is descriptive metadata for an independently authored drawing
 * consumer, not an instruction to execute F14B4 (which would advance twice).
 * No original colors, vertices, matrices, display commands or assets are here.
 *
 * Call once per admitted SOURCE display invocation, not per player view or
 * high-resolution render frame. Original FC4D4 admits it only in main638==1,
 * mode620!=11, course!=0. Its outer9328C shared draw path also has a scene/HUD
 * transition skip. Those caller gates/scheduling remain explicit external
 * responsibilities; activity624 alone controls the counter block itself.
 */
export function prepareNativeRaceMissFeedbackPalette(hudWords7788,input){
 const c={hud:words(hudWords7788,'hudWords7788',HUD_WORDS),operations:[]};
 record(input,'source feedback palette sample');const activity=integer(input.activity624,'activity624',-32768,32767);
 const phase=hInt(c,0x8c28),bank=hInt(c,0x8c2c);
 if(activity===-1){
  const next=(phase+1)|0;hudWrite(c,0x8c28,next);
  if(next>=2){hudWrite(c,0x8c28,0);const advanced=(bank+1)|0;hudWrite(c,0x8c2c,advanced);hudWrite(c,0x8c2c,advanced&3);}
 }
 return freeze({operations:c.operations,drawRecipe:{sourceEntry:'801f14b4',canonicalAdvancePrepared:true,
  graphicsHead:'callerOwned',paletteBeforeAdvance:{phase8c28:phase,bank8c2c:bank}},
  diagnostic:{scope:'canonicalCounterBlockOnly',drawingImplemented:false}});
}
