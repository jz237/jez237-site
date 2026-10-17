import {NATIVE_IMPACT_FIELDS} from './native-impact-state.js';
const F=Math.fround;
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native impact audio integer');return v;}
function scalar(v){if(!Number.isFinite(v)||v<0||!Number.isFinite(F(v)))throw new RangeError('Invalid native impact audio magnitude');return F(v);}

// Original52480,526f8..52954: select the first nonzero contact channel, not
// the strongest one. These are packet bytes, not Web Audio gains or SFX assets.
// Type is retained when neither an impact nor record318 selects a new sound.
export function nativeImpactAudioPacket({impacts,objectHitKind16d8,frameSpeedNative,recordFlag318},previousType){
 integer(previousType,0,255);integer(objectHitKind16d8,-2147483648,2147483647);integer(recordFlag318,-2147483648,2147483647);
 if(!impacts||typeof impacts.markedBox!=='boolean')throw new TypeError('Expected completed native impact fields');
 const values=Object.fromEntries(Object.values(NATIVE_IMPACT_FIELDS).map(k=>[k,scalar(impacts[k])])),speed=scalar(frameSpeedNative);
 const channels=[['racerImpactNative',0x14,19050],['primaryBuoyImpactNative',0x18,6350],
  ['objectImpactNative',objectHitKind16d8===1?0x3c:objectHitKind16d8===2?2:0x1c,6350],
  ['shoreImpactNative',0x1c,234],['floorImpactNative',0x41,234],
  ['boxImpactNative',impacts.markedBox?0x40:0x10,impacts.markedBox?468:234],['fixedSphereImpactNative',0x10,6350]];
 let type=previousType,value=0;
 const selected=channels.find(([key])=>values[key]!==0);
 if(selected){type=selected[1];value=F(values[selected[0]]*selected[2]);}
 else if(recordFlag318!==0){type=0x28;value=F(F(speed*127)/F(55.55555725097656));}
 // TRUNC.W.S precedes the upper clamp. Reject inputs outside its defined
 // signed32 range rather than quietly inventing floating-point trap behavior.
 if(value>=2147483648)throw new RangeError('Native impact audio conversion exceeds signed32');
 return {type,strength:Math.min(127,Math.trunc(value))&255,trigger:1};
}

// C010C's impact consumer, C0D10..C1070. Audio commands are returned as data;
// the outer engine-mode gates, other packet fields and sample mixer are owned
// elsewhere. The packet must retain its prior cooldown/last-type bytes.
export function consumeNativeImpactAudio(input,context){
 if(!Array.isArray(input)||input.length!==32)throw new TypeError('Expected32 audio packet bytes');
 const packet=input.map(v=>integer(v,0,255)),g={...context},commands=[];
 for(const key of ['surfaceCode','markedBoxCode','floorCode','pairedImpact','pairedVariant','mixerLane'])integer(g[key],-2147483648,2147483647);
 integer(g.channel,0,2);integer(g.random4562c,0,0xffffffff);
 const signed=v=>(v<<24)>>24,byte=i=>signed(packet[i]),timer=()=>((packet[12]<<8|packet[13])<<16)>>16;
 const setTimer=n=>{packet[12]=(n>>>8)&255;packet[13]=n&255;};
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args});
 if(timer()>=5&&packet[22]===packet[18])packet[19]=0;
 if(byte(18)===2){emit('c53d4',0x06000700,0x13);packet[19]=packet[18]=0;}
 if(byte(19)!==0){
  const strength=byte(19),speed=byte(31),cooldown=timer();
  const volume=cooldown===0?(speed<16?Math.trunc(strength/2):Math.trunc(strength/4)+(speed<36?64:96)):
   Math.trunc(strength/4)+(speed<16?0:speed<36?32:48);
  packet[19]=volume&255;
  const type=byte(18),variant=byte(20),lane=(g.mixerLane+2)&255;
  let latch=true;
  if(type===0x1c)emit('bffec',lane,(variant+g.surfaceCode)&255,packet[19]);
  else if(type===0x40){if(byte(7)!==0)emit('bffec',lane,(variant+g.markedBoxCode)&255,packet[19]);}
  else if(type===0x41){if(g.floorCode!==0)emit('bffec',lane,(variant+g.floorCode)&255,packet[19]);else latch=false;}
  else emit('bffec',lane,(type+variant)&255,packet[19]);
  if(latch){
   if(type===0x14){
    if(g.channel===0&&byte(19)>100){g.pairedImpact=1;g.pairedVariant=variant;}
    if(g.channel===2&&g.pairedImpact!==0){
     const voice=(byte(27)*4+(g.random4562c&1))>>>0;
     if(g.pairedVariant===0)emit('c3240',voice);
     else if(g.pairedVariant===2)emit('c3270',voice);
     else emit('c317c',0,voice);
     g.pairedImpact=0;
    }
   }else g.pairedImpact=0;
   packet[22]=packet[18];setTimer(8);
  }
  packet[19]=0;
 }
 if(timer()!==0)setTimer(timer()-1);
 return {packet,context:g,commands};
}
