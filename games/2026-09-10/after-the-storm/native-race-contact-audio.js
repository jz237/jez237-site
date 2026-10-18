import {nativeHullAudioPrefix,nativeContactImmersion,nativeContactAudioMaterials,consumeNativeWetAudio} from './native-contact-audio.js';
import {nativeImpactAudioPacket,consumeNativeImpactAudio} from './native-impact-audio.js';
import {prepareNativeAudioChannel} from './native-audio-channels.js';
import {nativeRaceBodyFields} from './native-race-body-fields.js';
import {queryNativeWaterField} from './native-water-field.js';
import {prepareNativeRiderWaterAudio,prepareNativeActorAudioFields} from './native-audio-packet.js';
import {prepareNativeEngineEnvelope,consumeNativeEngineAudio} from './native-engine-audio.js';
import {createOriginalEngineChannels,applyOriginalEngineCommands} from './original-engine-sound.js';
const F=Math.fround;
const channelEntries=new Set(['800bfdd0','800bfde4','800bfe70','800bfef8','800bffac','800bfd34','800bfd68','800bffcc']);

// Engine/contact owner for the admitted one-human and two-human browser races.
// Fresh web sessions explicitly start packet storage/motion at zero, in racing
// audio mode7 with muted channels. Source status effects enable them. This is
// not an emulation of retained cartridge mixer/voice state or nearest-rival
// channel2 routing. Original music keeps its separate presentation owner.
export function createNativeRaceContactAudio({players,courseIndex}){
 if(![1,2].includes(players))throw new RangeError('Contact audio requires one or two human racers');
 let materials=nativeContactAudioMaterials(courseIndex),audioMode=7,frame=0,pairedImpact=0,pairedVariant=0;
 let globals={raceMode:players-1,courseIndex,primaryMuted:1,secondaryMuted:1,alternateEngine:0,
  rankDelay:0,primaryStart:0,secondaryStart:0,primaryPitchBits:0,secondaryPitchBits:0,rivalPitchBits:0,
  primaryFlag:0,primaryCompanionFlag:0,primaryLastPlace:0,secondaryFlag:0,secondaryCompanionFlag:0,secondaryLastPlace:0,
  engineGate7ca0:0,primaryPowerByte:0,secondaryPowerByte:0};
 let engineChannels=createOriginalEngineChannels(players).map((c,i)=>({...c,volume:F(60/127),pan:players===2?(i?127:0):64}));
 const packets=[Array(32).fill(0),Array(32).fill(0)],motion=Array.from({length:players},()=>({speed:0,vertical:0})),queue=[];
 const riderWater=Array.from({length:players},()=>({bodyC84:0,bodyC86:0}));
 let emitted=0,dropped=0;
 function enqueue(command,player){
  // Continuous engine controls retain their latest state, not a render queue.
  // Limit transient backlog when rendering is suspended.
  if(command.consumer!=='bffec'&&!(command.consumer==='c53d4'&&command.arguments[0]===0x06000700))return;
  if(queue.length===64){queue.shift();dropped++;}
  queue.push({frame,player,consumer:command.consumer,arguments:[...command.arguments]});emitted++;
 }
 return {
  applyEffects(effects){
   for(const effect of effects){
    // Source start-control emits audioEntry, separately from channel calls.
    // C21F4 and the supplied ROM initialize7CA0/7CB8 tozero; this browser owner
    // has no voice-muting7CB8 override. Other C37F4 voice/timer work is separate.
    if(effect.consumer==='800c37f4'&&['audioEntry','externalCall'].includes(effect.kind)){
     if(audioMode===7&&effect.arguments[0]===0x23)globals.engineGate7ca0=1;
     continue;
    }
    if(effect.kind!=='externalCall')continue;
    const {consumer,arguments:args}=effect;
    if(channelEntries.has(consumer)){
     const stop=['800bfd34','800bfd68','800bffcc'].includes(consumer);
     const index=stop?(consumer==='800bfd34'?0:1):args[0]===0x80192610?0:args[0]===0x80192630?1:-1;
     if(index<0)throw new RangeError('Unknown source audio packet address');
     const next=prepareNativeAudioChannel(consumer,packets[index],globals);
     packets[index]=next.packet;globals=next.globals;
     engineChannels=applyOriginalEngineCommands(engineChannels,next.commands);
    }else if(consumer==='800c1f60'){
     // The racing-mode branch stops both engines without changing audioMode.
     if(audioMode===7)globals.primaryMuted=globals.secondaryMuted=1;
    }else if(consumer==='800c21f4'){
     const mode=args[0]|0,previous=audioMode;
     globals.engineGate7ca0=0;
     if(mode!==previous||mode!==1&&mode!==10){
      audioMode=(mode<<24)>>24;globals.primaryMuted=globals.secondaryMuted=1;
      if(mode===0){globals.raceMode=0;globals.courseIndex=0;}
      else if(mode===1&&previous!==10)globals.raceMode=args[1]|0;
      else if(mode===7){globals.courseIndex=args[1]|0;materials=nativeContactAudioMaterials(globals.courseIndex);}
     }
    }
   }
  },
  advance(adapters,field,records){
   const {recordFlags318,recordMotion2c8,recordPower12c,recordPlace4,sprayLeft1c5c,sprayRight1c60}=records??{};
   if(adapters.length!==players||[recordFlags318,recordMotion2c8,recordPower12c,recordPlace4,sprayLeft1c5c,sprayRight1c60].some(values=>
    !Array.isArray(values)||values.length!==players||values.some(v=>!Number.isInteger(v)||v< -2147483648||v>2147483647)))
    throw new RangeError('Contact audio needs every admitted human body and source record');
   const next=adapters[0].logicalFrames;
   if(next===frame)return;
   if(next!==frame+1||adapters.some(a=>a.logicalFrames!==next||a.pendingFrameCompletion))throw new RangeError('Contact audio requires successive completed physics frames');
   frame=next;
   for(let player=0;player<players;player++){
    const adapter=adapters[player],body=nativeRaceBodyFields(adapter),wet=adapter.wetState;
    const actorC54=adapter.lastFrame.actorState;
    let point6b4Native,waterQueryNative;
    if(actorC54===23||actorC54===5){
     const joint=adapter.articulatedRider?.jointWorld;
     if(!joint)throw new TypeError('Rider water audio requires the completed physical joint2');
     point6b4Native=Object.fromEntries(['x','y','z'].map(k=>[k,F(joint[k]/adapter.hull.scale)]));
     waterQueryNative=queryNativeWaterField(field,point6b4Native.x,point6b4Native.z).sourcePlaneQueryNative;
    }
    riderWater[player]=prepareNativeRiderWaterAudio(riderWater[player].bodyC86,{actorC54,point6b4Native,waterQueryNative});
    if(adapter.frame.simulationState!==0)motion[player]={speed:body.speedB90Native,vertical:F(body.positionNative.y-body.priorBodyPointNative.y)};
    const packet=packets[player],prefix=nativeHullAudioPrefix({frameSpeedNative:motion[player].speed,verticalFrameB7c:motion[player].vertical,
     record2c8:recordMotion2c8[player],bodyBfc:adapter.hull.lateralMotionBfc,
     bodyC78:wet.wetCountC78,wetFlagC7c:wet.wetFlagC7c,landingC7e:wet.landingC7e});
    // The completed physical lifecycle owns1608 (crash countdown). Controls
    // retain the raw B56 buttons even if the force engine mask was suppressed.
    const actorAudio=prepareNativeActorAudioFields({buttonsB56:adapter.frame.controls?.heldButtons,
     actorC54,animationC58:adapter.lastFrame.animationFrame,body1608:adapter.riderLifecycle?.state.crashCountdown},packet[28]);
    const points=[0,2].map(i=>Object.fromEntries(['x','y','z'].map(k=>[k,F(adapter.hull.points[i].position[k]/adapter.hull.scale)])));
    const query=queryNativeWaterField(field,F(F(points[0].x+points[1].x)*.5),F(F(points[0].z+points[1].z)*.5));
    for(let i=0;i<4;i++)packet[i]=prefix[i];
    packet[4]=actorAudio.buttonByte;packet[21]=actorAudio.riderEvent;packet[28]=actorAudio.animationEvent;
    packet[14]=recordPower12c[player]&255;packet[25]=recordPlace4[player]&255;
    packet[16]=1;packet[17]=Math.max(sprayLeft1c5c[player],sprayRight1c60[player])&255;
    packet[24]=Number(riderWater[player].bodyC84===0&&riderWater[player].bodyC86===1);
    packet[15]=nativeContactImmersion({waterQueryNative:query.sourcePlaneQueryNative,point90YNative:points[0].y,pointD0YNative:points[1].y});
    const impact=nativeImpactAudioPacket({impacts:adapter.impacts,objectHitKind16d8:adapter.objectHitKind16d8,
     frameSpeedNative:motion[player].speed,recordFlag318:recordFlags318[player]},packet[18]);
    packet[18]=impact.type;packet[19]=impact.strength;packet[20]=impact.trigger;packet[27]=adapter.hull.rider;
    // C118C/C11CC and C010C gate consumption, not52480 packet production.
    // Mode4's separate rider-water cue is outside this contact subset.
    if(audioMode!==7||globals[player===0?'primaryMuted':'secondaryMuted']!==0)continue;
    const context={raceMode:globals.raceMode,channel:player,mixerLane:player===0?0:3};
    const prepared=prepareNativeEngineEnvelope(packet),landing=consumeNativeWetAudio(prepared.packet,context);
    // Only human channels are admitted. The rival-only inputs satisfy the
    // prepared kernel's structural validation and are never read on this path.
    // The original RNG is mixed-audio-derived. Use a separate reproducible web
    // jitter pattern here; it neither claims that RNG nor consumes gameplay RNG.
    const jitter=(Math.imul(frame,1664525)+1013904223)>>>0;
    const engine=consumeNativeEngineAudio(landing.packet,{...globals,...context,random4562c:jitter,
     rivalPanByte:0,rivalControlByte:0,rivalGate7de8:0,rivalPitchMultiplierBits:0,rivalGainBits:0},prepared.envelope);
    for(const key of Object.keys(globals))globals[key]=engine.context[key];
    engineChannels=applyOriginalEngineCommands(engineChannels,[...landing.commands,...engine.commands]);
    const hit=consumeNativeImpactAudio(engine.packet,{...context,...materials,pairedImpact,pairedVariant});
    pairedImpact=hit.context.pairedImpact;pairedVariant=hit.context.pairedVariant;
    packets[player]=hit.packet;
    // End of C010C: impacts above read the PRIOR frame's speed byte.
    packets[player][31]=packets[player][0];
    for(const command of [...landing.commands,...engine.commands,...hit.commands])enqueue(command,player);
   }
  },
  drain(){return queue.splice(0);},
  engineChannels(){return globals.alternateEngine!==0?null:engineChannels.map((c,i)=>({...c,enabled:c.enabled&&audioMode===7&&globals[i?'secondaryMuted':'primaryMuted']===0}));},
  snapshot(){return {scope:'source-engine-and-contact-controls; browser-audio-jitter-and-smoothing',frame,audioMode,globals:{...globals},
   engineChannels:engineChannels.map(c=>({...c})),
   packets:packets.map(p=>p.slice()),motion:motion.map(m=>({...m})),riderWater:riderWater.map(w=>({...w})),pending:queue.length,emitted,dropped};}
 };
}
