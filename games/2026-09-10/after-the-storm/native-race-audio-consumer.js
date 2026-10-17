import {prepareNativeEngineEnvelope,consumeNativeEngineAudio,consumeNativeSprayAudio} from './native-engine-audio.js';
import {consumeNativeWetAudio} from './native-contact-audio.js';
import {consumeNativeImpactAudio} from './native-impact-audio.js';
const signed=v=>(v<<24)>>24;
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native race audio field');return v;}
function copy(input){if(!Array.isArray(input)||input.length!==32)throw new TypeError('Expected32 native audio packet bytes');return input.map(v=>integer(v,0,255));}

// C1070..C1178 follows the impact consumer. Prior rider-event state suppresses
// repeated voices, while a human water-entry edge is acknowledged separately.
// The prior-speed byte is committed only after every consumer has read it.
export function consumeNativeRiderAudio(input,context){
 const packet=copy(input),g={...context},commands=[],byte=i=>signed(packet[i]);
 integer(g.channel,0,2);integer(g.mixerLane,0,255);integer(g.random4562c,0,0xffffffff);
 integer(g.riderEvent7ca4,-2147483648,2147483647);
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 if(byte(23)===0&&g.channel<2&&byte(21)!==0){
  emit('c317c',g.channel,byte(27)*4+(g.random4562c&1)+(byte(21)===1?2:0));
 }
 packet[23]=packet[21];
 if(byte(21)===2)g.riderEvent7ca4=1;
 if(byte(24)!==0&&g.channel<2){
  emit('bffec',(g.mixerLane+2)&255,1,127);
  emit('c33c8',g.random4562c%3+0x50,10,0x50,0x28);packet[24]=0;
 }
 packet[31]=packet[0];
 return {packet,context:g,commands};
}

// Complete C010C packet consumer, including its outer mode/rank gates.
// This executes the packet logic and captures leaf calls as raw argument bits;
// called voice/mixer functions, audio lifecycle and sample playback are separate.
// Mode4 reads an unwritten caller-stack byte for channel1. A caller must supply
// that retained byte explicitly; no assumed secondary lane is substituted.
export function consumeNativeRaceAudio(input,context){
 let packet=copy(input),g={...context};const commands=[];
 integer(g.audioMode,0,255);integer(g.channel,0,2);
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 if(signed(g.audioMode)===4){
  if(signed(packet[24])!==0&&g.channel<2){
   const lane=g.channel===0?2:(integer(g.retainedMode4LaneByte,0,255)+2)&255;
   emit('bffec',lane,1,127);packet[24]=0;
  }
  return {packet,context:g,commands};
 }
 if(signed(g.audioMode)!==7)return {packet,context:g,commands};
 for(const key of ['raceMode','courseIndex','rankDelay','rankPlaceWord'])integer(g[key],-2147483648,2147483647);
 for(const key of ['primaryPlaceByte','secondaryPlaceByte','primaryLastPlace','secondaryLastPlace'])integer(g[key],0,255);
 integer(g.random4562c,0,0xffffffff);
 const place=signed(packet[25]);
 if(g.raceMode===0&&g.channel===0){
  const prior=signed(packet[26]);
  if(g.rankDelay===0&&place!==prior){
   const improved=place<prior,direct=(g.random4562c&0x30)===0x30;
   emit('c1eb8',improved?12:13);
   emit('c33c8',improved?(direct?0x49-place:(g.random4562c&3)+0x42):
    (direct?place+0x4c:(g.random4562c&1)+0x4b),20,improved?70:60,30);
   g.rankDelay=100;
  }
  g.rankPlaceWord=place;packet[26]=packet[25];
 }else if(g.raceMode===1&&g.channel===0&&place!==signed(g.primaryPlaceByte))emit('c1eb8',12);
 if(g.raceMode===3||g.raceMode===0&&g.courseIndex===0)packet[14]=packet[9]=3;
 g.mixerLane=g.channel===0?0:3;
 if(g.channel<2){
  const current=g.channel===0?'primaryPlaceByte':'secondaryPlaceByte',last=g.channel===0?'primaryLastPlace':'secondaryLastPlace';
  g[current]=packet[25];if(g[current]!==g[last])g[last]=255;
 }
 const prepared=prepareNativeEngineEnvelope(packet);
 const wet=consumeNativeWetAudio(prepared.packet,g);commands.push(...wet.commands);
 const engine=consumeNativeEngineAudio(wet.packet,g,prepared.envelope);g=engine.context;commands.push(...engine.commands);
 const spray=consumeNativeSprayAudio(engine.packet,g);commands.push(...spray.commands);
 const impact=consumeNativeImpactAudio(spray.packet,g);g=impact.context;commands.push(...impact.commands);
 const rider=consumeNativeRiderAudio(impact.packet,g);commands.push(...rider.commands);
 return {packet:rider.packet,context:rider.context,commands};
}
