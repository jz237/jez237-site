const F=Math.fround;
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native contact audio integer');return v;}
function float(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Invalid native contact audio float');return F(v);}
function trunc(v){if(v< -2147483648||v>=2147483648)throw new RangeError('Native audio conversion exceeds signed32');return Math.trunc(v);}
const signed=v=>(v<<24)>>24;

// C21F4's racing-mode material selection, C2720..C2768. The selected source
// course index is independent of browser course names and weather settings.
// These are numeric command codes; original samples and mixer are separate.
export function nativeContactAudioMaterials(courseIndex){
 integer(courseIndex,0,8);
 return {surfaceCode:[32,52,52,52,48,52,36,52,60][courseIndex],
  markedBoxCode:[48,44,44,52,48,56,48,44,60][courseIndex],
  floorCode:courseIndex===3?52:0};
}

// First four bytes of52480, ending before525C8. All values are completed
// source body/record fields. In particular C78/C7E must not be guessed from
// renderer splash particles or the browser's airborne flag.
export function nativeContactMotionBytes({frameSpeedNative,verticalFrameB7c,bodyC78,wetFlagC7c,landingC7e}){
 const speed=float(frameSpeedNative),vertical=float(verticalFrameB7c);
 if(speed<0)throw new RangeError('Native frame speed must be nonnegative');
 integer(bodyC78,-2147483648,2147483647);
 integer(wetFlagC7c,0,65535);integer(landingC7e,0,65535);
 let wet=wetFlagC7c;
 if(landingC7e!==0){
  const value=(trunc(F(vertical*-3))+Math.imul(bodyC78,10))|0;
  wet=value<0?1:Math.min(127,value);
 }
 return {speed:trunc(F(speed*F(1.4399999380111694)))&255,wet:wet&255};
}

export function nativeHullAudioPrefix(input){
 const {record2c8,bodyBfc}=input,lateralMotion=float(bodyBfc),motion=nativeContactMotionBytes(input);
 integer(record2c8,-2147483648,2147483647);
 return [motion.speed,
  trunc(F(F(record2c8)*F(.4444444477558136)))&255,
  Math.max(-15,Math.min(15,trunc(F(lateralMotion*5))))&255,motion.wet];
}

//52480's byteF uses4D30C at the midpoint of source points90/D0. The caller
// supplies that normalized physics query, never the rendered water height.
export function nativeContactImmersion({waterQueryNative,point90YNative,pointD0YNative}){
 const midpoint=F(F(float(point90YNative)+float(pointD0YNative))*.5);
 return Math.max(0,Math.min(127,trunc(F(F(F(float(waterQueryNative)-midpoint)-7)*20))));
}

// C010C's C042C..C0608 wet-transition slice. It runs BEFORE the impact
// consumer and establishes packet7, which gates marked-box contact sounds.
// Other engine/voice branches and the end-of-frame packet31 write are not
// executed here. Captured leaf commands do not play or synthesize audio.
export function consumeNativeWetAudio(input,{raceMode,channel,mixerLane}){
 if(!Array.isArray(input)||input.length!==32)throw new TypeError('Expected32 audio packet bytes');
 const packet=input.map(v=>integer(v,0,255)),commands=[];
 integer(raceMode,-2147483648,2147483647);integer(channel,0,2);integer(mixerLane,0,255);
 const byte=i=>signed(packet[i]),emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 if(byte(7)!==0){packet[10]=packet[11]=0;}
 else if(raceMode!==2&&channel<2){const timer=(packet[10]<<8|packet[11])+1;packet[10]=(timer>>>8)&255;packet[11]=timer&255;}
 let control;
 if(byte(7)===byte(3))control=127-Math.trunc(byte(15)/4);
 else if(byte(3)===0){packet[7]=0;control=0;}
 else{
  const wet=byte(3),lane=(mixerLane+2)&255;
  if(wet>=101)emit('bffec',lane,11,(Math.trunc(wet/2)+60)&255);
  else if(wet>=81)emit('bffec',lane,12,(Math.trunc(wet/2)+75)&255);
  else if(wet>=41||wet>=11&&byte(31)>=31)emit('bffec',lane,13,(Math.trunc(wet/2)+86)&255);
  else if(wet>=11)emit('bffec',lane,14,(wet+80)&255);
  packet[3]=packet[7]=1;control=255;
 }
 emit('c53d4',0x06000006|(mixerLane<<8),signed(control));
 return {packet,commands};
}
