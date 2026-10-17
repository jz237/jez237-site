function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native audio channel field');return v;}
function packetCopy(input){if(!Array.isArray(input)||input.length!==32)throw new TypeError('Expected32 native audio packet bytes');return input.map(v=>integer(v,0,255));}

// BFD9C resets selected bytes only. Cooldown, prior impact type and prior speed
// survive; clearing the entire packet changes the first sound after a restart.
export function resetNativeAudioPacket(input){
 const packet=packetCopy(input);
 for(const i of [0x1d,8,9,0x13,0x12,0x11,4,6,0x19])packet[i]=0;
 packet[7]=packet[3]=1;return packet;
}

const integerFields=['raceMode','courseIndex','primaryMuted','secondaryMuted','alternateEngine',
 'rankDelay','primaryStart','secondaryStart'];
const byteFields=['primaryFlag','primaryCompanionFlag','primaryLastPlace','secondaryFlag','secondaryCompanionFlag','secondaryLastPlace'];
const pitchFields=['primaryPitchBits','secondaryPitchBits','rivalPitchBits'];
const entries=new Set(['800bfdd0','800bfde4','800bfe70','800bfef8','800bffac','800bfd34','800bfd68','800bffcc']);

// Complete channel start/stop entry bodies, with the caller-selected packet.
// BFE70 may start the secondary channel using its ORIGINAL packet argument;
// selecting a mixer channel does not select which packet gets reset.
// All mixer calls are returned in order as raw command/argument bits. This
// neither loads sample banks nor executes C21F4's broader audio-mode lifecycle.
export function prepareNativeAudioChannel(entry,input,context){
 if(!entries.has(entry))throw new RangeError('Unsupported native audio channel entry');
 let packet=packetCopy(input);const globals={...context},commands=[];
 for(const key of integerFields)integer(globals[key],-2147483648,2147483647);
 for(const key of byteFields)integer(globals[key],0,255);
 for(const key of pitchFields)integer(globals[key],0,0xffffffff);
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 const float=(command,bits)=>emit('800c538c',command,bits);
 const byte=(command,value)=>emit('800c53d4',command,value);
 const primary=enable=>{
  if(enable){globals.primaryMuted=0;globals.rankDelay=400;}
  globals.alternateEngine=0;globals.primaryStart=0;
  float(0x01000000,0x3f800000);float(0x01000200,0x3f800000);
  float(0x04000000,0x3dcccccd);byte(0x06000000,1);
  packet=resetNativeAudioPacket(packet);globals.primaryPitchBits=0;
  globals.primaryFlag=globals.primaryCompanionFlag=0;globals.primaryLastPlace=255;
 };
 const secondary=()=>{
  if(globals.raceMode===2)return;
  globals.secondaryMuted=0;globals.secondaryStart=0;
  float(0x01000300,0x3f800000);float(0x04000300,0x3dcccccd);
  byte(0x06000300,1);float(0x01000200,0x3f800000);
  packet=resetNativeAudioPacket(packet);globals.secondaryFlag=globals.secondaryCompanionFlag=0;
  globals.secondaryLastPlace=255;globals.secondaryPitchBits=globals.rivalPitchBits=0;
 };
 if(entry==='800bfdd0')primary(true);
 else if(entry==='800bfde4')primary(false);
 else if(entry==='800bfe70'){
  if(globals.courseIndex!==0)secondary();
  else{
   globals.primaryMuted=0;globals.alternateEngine=1;
   float(0x01000200,0x3f800000);packet=resetNativeAudioPacket(packet);
   globals.primaryPitchBits=0;globals.primaryFlag=0;globals.primaryLastPlace=255;
  }
 }else if(entry==='800bfef8'||entry==='800bffac')secondary();
 else if(entry==='800bfd34'){globals.primaryMuted=1;byte(0x06000004,0xffffffff);}
 else{globals.secondaryMuted=1;byte(0x06000304,0xffffffff);}
 return {packet,globals,commands};
}
