const F=Math.fround;
const signed=v=>(v<<24)>>24;
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native engine audio integer');return v;}
function copy(input){if(!Array.isArray(input)||input.length!==32)throw new TypeError('Expected32 native audio packet bytes');return input.map(v=>integer(v,0,255));}
const view=new DataView(new ArrayBuffer(4));
function fromBits(v){integer(v,0,0xffffffff);view.setUint32(0,v);const n=view.getFloat32(0);if(!Number.isFinite(n))throw new RangeError('Invalid native engine audio float');return n;}
function bits(v){view.setFloat32(0,v);return view.getUint32(0);}
// Functional pitch/envelope tables. The two irregular speed entries are in
// the original table; smoothing them changes the engine's response.
const pitch=[.5,.52,.54,.56,.58,.6,.62,.64,.66,.68,.7,.71,.72,.73,.74,.75,.76,.77,.78,.79,
 .8,.84,.88,.92,.96,1,1.02,1.04,1.06,1.08,1.1,1.12,1.14,1.16,1.18,1.2,1.22,1.24,1.26,1.28,
 1.3,1.33,1.36,1.4,1.44,1.47,1.5,1.52,1.55,1.57,1.6,1.64,1.68,1.71,1.74,1.77,1.8,1.83,1.85,1.88,
 1.9,1.91,1.92,1.93,1.94,1.95,1.96,1.97,1.98,1.999,2.02,2.04,2.06,2.08,2.1,2.12,2.14,2.16,2.18,2.2,
 2.22,2.24,2.26,2.28,2.3,2.32,2.34,2.36,2.38,2.3,2.32,2.34,2.36,2.38,2.4,2.42,2.44,2.46,2.48,2.5].map(F);
const boostIndex=[0,1,2,3,4,5,6,7,8,9,10,11,12,14,16,18,20,24,26,28,30,40,50,60,70,80,70,50,20,0];
const boostGain=[.01,.01,.02,.03,.04,.06,.1,.12,.14,.16,.18,.2,.3,.35,.4,.45,.49,.5,.52,.58,.65,.7,.75,.8,.85,.9,.96,.97,.98,1].map(F);
const pitchKeys=['primaryPitchBits','secondaryPitchBits','rivalPitchBits'];

// C0380..C042C runs before the wet transition. Its returned stack envelope
// must be retained across that transition and passed to the engine slice.
export function prepareNativeEngineEnvelope(input){
 const packet=copy(input),byte=i=>signed(packet[i]);
 if(byte(21)!==0)packet[4]=0;
 if(byte(0)<30)packet[8]=70;
 if(byte(8)<byte(1))packet[8]=(packet[8]+1)&255;
 else if(byte(1)<byte(8))packet[8]=(packet[8]-1)&255;
 return {packet,envelope:{volume:Math.trunc(byte(8)/3)+96,speedIndex:byte(0)}};
}

// C0608..C0B90: throttle edges, power announcements and smoothed engine
// commands, AFTER C042C..C0608's wet transition. Calls are captured as raw
// argument bits; this does not execute the sample mixer or synthesize audio.
// engineGate7ca0 retains its source address until its lifecycle is recovered.
export function consumeNativeEngineAudio(input,context,envelope){
 const packet=copy(input),g={...context},commands=[],byte=i=>signed(packet[i]);
 integer(g.channel,0,2);integer(g.mixerLane,0,255);
 for(const key of ['engineGate7ca0','alternateEngine','primaryStart','secondaryStart'])integer(g[key],-2147483648,2147483647);
 integer(g.random4562c,0,0xffffffff);
 for(const key of ['primaryPowerByte','secondaryPowerByte','rivalPanByte','rivalControlByte'])integer(g[key],0,255);
 integer(g.rivalGate7de8,0,65535);
 for(const key of [...pitchKeys,'rivalPitchMultiplierBits','rivalGainBits'])fromBits(g[key]);
 let volume=integer(envelope?.volume,-2147483648,2147483631),speedIndex=integer(envelope?.speedIndex,-2147483648,2147483615);
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 if(byte(7)===0){volume+=16;speedIndex+=32;}
 if(byte(4)===0)packet[5]=255;
 else if(byte(6)===0){
  packet[5]=4;
  if(g.channel<2){
   if(byte(0)===0&&g.engineGate7ca0===0&&g.alternateEngine===0){
    emit('bffec',(g.mixerLane+2)&255,15,127);
    g[g.channel===0?'primaryStart':'secondaryStart']=1;packet[29]=29;
   }else packet[29]=byte(0)<30?20:byte(0)<50?8:4;
  }
 }else if(packet[5]!==0)packet[5]=(packet[5]-1)&255;
 packet[6]=packet[4];
 if(byte(28)!==0){
  if(g.alternateEngine===0){emit('bffec',(g.mixerLane+2)&255,15,(g.random4562c&31)+96);packet[29]=29;}
  else emit('bffec',5,10,127);
  packet[28]=0;
 }
 if(g.channel<2){
  if(byte(9)!==0&&byte(14)===0)packet[9]=0;
  else {if(byte(9)!==byte(14))emit('c36f8',byte(14));packet[9]=packet[14];}
 }
 let target=byte(4)===0?0:byte(14)===5?F(.6):F(byte(14)*F(.1));
 if(g.channel<2)g[g.channel===0?'primaryPowerByte':'secondaryPowerByte']=packet[14];
 speedIndex=Math.max(0,Math.min(99,speedIndex));volume=Math.max(0,Math.min(127,volume));
 const boost=integer(byte(29),0,29);
 target=F(target+pitch[speedIndex]);
 if(boost!==0){volume=127;target=F(target+F(pitch[boostIndex[boost]]*boostGain[boost]));packet[29]=(boost-1)&255;}
 const key=pitchKeys[g.channel],previous=fromBits(g[key]);
 let adjusted=F(F(F(target-previous)/F(2.5))+previous);g[key]=bits(adjusted);
 if(adjusted<F(.8409)){emit('c53d4',0x06000005,-3);adjusted=F(adjusted*F(1.18921));}
 else if(F(1.1892)<adjusted){emit('c53d4',0x06000005,3);adjusted=F(adjusted/F(1.18921));}
 else emit('c53d4',0x06000005,0);
 if(g.channel<2){
  const lane=g.channel===0?0:0x300,jitter=F(F((g.random4562c&15)*F(.002))+F(.97));
  emit('c538c',0x04000000|lane,bits(F(adjusted*jitter)));
  emit('c538c',0x01000000|lane,bits(F(volume/127)));
 }else{
  emit('c00b0',volume,bits(F(adjusted*fromBits(g.rivalPitchMultiplierBits))));
  emit('c538c',0x01000300,bits(F(fromBits(g.rivalGainBits)*F(.8))));
  emit('c538c',0x01000500,g.rivalGainBits);
  emit('c53d4',0x03000300,signed(g.rivalPanByte));
  emit('c53d4',0x03000500,signed(g.rivalPanByte));
  if(g.rivalGate7de8===0)emit('c53d4',0x05000300,signed(g.rivalControlByte));
 }
 return {packet,context:g,commands};
}

// C0B90..C0D10 runs after engine pitch and before impacts. Packet17 is the
// ORIGINAL spray producer's level. Renderer particle counts are not inputs.
export function consumeNativeSprayAudio(input,{channel,mixerLane,alternateEngine,courseIndex,random4562c}){
 const packet=copy(input),byte=i=>signed(packet[i]),commands=[];
 integer(channel,0,2);integer(mixerLane,0,255);integer(alternateEngine,-2147483648,2147483647);
 integer(courseIndex,-2147483648,2147483647);integer(random4562c,0,0xffffffff);
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 if(byte(17)<100&&alternateEngine===1&&byte(0)>20){packet[16]=1;packet[17]=(random4562c&15)+100;}
 if(byte(17)<50||byte(7)===0||channel===2)packet[17]=0;
 if(byte(17)!==0){
  const level=byte(17)-50,lane=(mixerLane+2)&255;
  packet[17]=(level<41?Math.trunc(level/2)+20:level*2-30)&255;
  emit('c538c',0x04000000|(lane<<8),bits(F(F(byte(0)/100)+F(.6))));
  const variant=courseIndex===3||courseIndex===6?random4562c%5:random4562c&3;
  emit('c0044',lane,(byte(16)+variant*4)&255,packet[17]);packet[17]=0;
 }
 return {packet,commands};
}
