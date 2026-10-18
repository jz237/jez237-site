import {nativeHullAudioPrefix,nativeContactImmersion,nativeContactAudioMaterials} from './native-contact-audio.js';
import {nativeImpactAudioPacket} from './native-impact-audio.js';
import {prepareNativeAudioChannel} from './native-audio-channels.js';
import {nativeRaceBodyFields} from './native-race-body-fields.js';
import {queryNativeWaterField} from './native-water-field.js';
import {prepareNativeRiderWaterAudio,prepareNativeActorAudioFields} from './native-audio-packet.js';
import {createOriginalEngineChannels,applyOriginalEngineCommands} from './original-engine-sound.js';
import {createOriginalEffectPoll} from './original-effect-poll.js';
import {consumeNativeRaceAudio} from './native-race-audio-consumer.js';
import {prepareNativeAudioEvent} from './native-audio-events.js';
import {freshNativeAnnouncer,prepareNativeAnnouncer,advanceNativeRaceAnnouncer} from './native-announcer.js';
import {resetNativeRaceAudioTimers} from './native-audio-transition.js';
import {prepareNativeAudioMode} from './native-audio-mode.js';
const F=Math.fround;
const channelEntries=new Set(['800bfdd0','800bfde4','800bfe70','800bfef8','800bffac','800bfd34','800bfd68','800bffcc']);
const voiceEntries=new Set(['c32a0','c3320','c338c','c33c8','c3408','c3464','c36f8','c3500','c3524','c377c']);

// Engine/contact/rider owner for the admitted one-human and two-human races.
// Fresh web sessions explicitly start packet storage/motion at zero, in racing
// audio mode7 with muted channels. Source status effects enable them. This is
// not an emulation of retained cartridge mixer state or nearest-rival
// channel2 routing. Original music keeps its separate presentation owner.
export function createNativeRaceContactAudio({players,courseIndex,difficultyWord=0}){
 if(![1,2].includes(players))throw new RangeError('Contact audio requires one or two human racers');
 if(!Number.isInteger(difficultyWord)||difficultyWord<0||difficultyWord>2)throw new RangeError('Contact audio requires a source difficulty');
 let materials=nativeContactAudioMaterials(courseIndex),audioMode=7,frame=0,timerFrame=0,pairedImpact=0,pairedVariant=0,announcer=freshNativeAnnouncer();
 let globals={raceMode:players-1,courseIndex,primaryMuted:1,secondaryMuted:1,alternateEngine:0,
  rankDelay:0,primaryStart:0,secondaryStart:0,primaryPitchBits:0,secondaryPitchBits:0,rivalPitchBits:0,
  primaryFlag:0,primaryCompanionFlag:0,primaryLastPlace:0,secondaryFlag:0,secondaryCompanionFlag:0,secondaryLastPlace:0,
  engineGate7ca0:0,primaryPowerByte:0,secondaryPowerByte:0,riderEvent7ca4:0,
  primaryPlaceByte:0,secondaryPlaceByte:0,rankPlaceWord:0,eventGate7cb8:0,field7c98:0,eventLatch7ca8:0,
  delay7cd8:0,delay7cd4:0,delay7cec:0,delay7cf0:0,counter7cf4:0,
  stage7dc8:0,musicSelection:0,tempoDelay7ce0:0,delay7cdc:0,resultFlag7dd0:0,alternateCue7cb0:0,
  splitFlag7c90:0,cueBase7e05:255,creditsTrack7dd4:0,creditsCounter7e18:0,creditsField7e14:0,difficultyWord,
  delay7ce4:0,delayedCue7e1c:0};
 let engineChannels=createOriginalEngineChannels(players).map((c,i)=>({...c,volume:F(60/127),pan:players===2?(i?127:0):64}));
 const packets=[Array(32).fill(0),Array(32).fill(0)],motion=Array.from({length:players},()=>({speed:0,vertical:0})),queue=[];
 const riderWater=Array.from({length:players},()=>({bodyC84:0,bodyC86:0}));
 const effectPoll=createOriginalEffectPoll();
 let emitted=0,dropped=0;
 function enqueue(command,player){
  // Continuous engine controls retain their latest state, not a render queue.
  // Limit transient backlog when rendering is suspended.
  if(queue.length===64){queue.shift();dropped++;}
  queue.push({frame,player,consumer:command.consumer,arguments:[...command.arguments]});emitted++;
 }
 const jitter=()=>((Math.imul(frame,1664525)+1013904223)>>>0);
 const retain=context=>{for(const key of Object.keys(globals))globals[key]=context[key];};
 function submit(command,player=0){
  if(voiceEntries.has(command.consumer)){
   const next=prepareNativeAnnouncer(announcer,command,{...globals,audioMode});announcer=next.state;
   for(const raw of next.commands)submit(raw,player);return;
  }
  if(command.consumer==='c37f4'){
   const next=prepareNativeAudioEvent(command.arguments[0]|0,command.arguments[1],{...globals,audioMode,random4562c:jitter()});
   retain(next.context);for(const raw of next.commands)submit(raw,player);return;
  }
  if(command.consumer==='c37c0'){globals.delay7ce4=command.arguments[1]|0;globals.delayedCue7e1c=command.arguments[0]|0;return;}
  if(command.consumer==='c538c'&&command.arguments[0]===0x01000c00&&command.arguments[1]===0){enqueue(command,player);return;}
  if(effectPoll.submit({...command,frame,player},globals.raceMode))return;
  if(command.consumer==='c53d4'&&[0x06000700,0x06000c00,0x06000c01].includes(command.arguments[0]))enqueue(command,player);
 }
 return {
  beforeFrame(next){
   if(!Number.isInteger(next)||next!==timerFrame+1||next!==frame+1)throw new RangeError('Announcer requires successive outer game frames');
   timerFrame=next;
   const result=advanceNativeRaceAnnouncer(announcer,{...globals,audioMode,paused7cc4:0,random4562c:jitter()});
   announcer=result.state;retain(result.context);
   for(const command of result.commands)submit(command);
  },
  applyEffects(effects){
   for(const effect of effects){
    // Source start-control emits audioEntry, separately from channel calls.
    // C21F4 and the supplied ROM initialize7CA0/7CB8 tozero. Event voices
    // enter the same priority slot as rank, power and rider-water commentary.
    if(effect.consumer==='800c37f4'&&['audioEntry','externalCall'].includes(effect.kind)){
     const next=prepareNativeAudioEvent(effect.arguments[0],effect.arguments[1]??0,{...globals,audioMode,random4562c:jitter()});
     retain(next.context);for(const command of next.commands)submit(command);
     continue;
    }
    if(effect.kind!=='externalCall')continue;
    const {consumer,arguments:args}=effect;
    if(consumer==='800c1f60'){
     const reset=resetNativeRaceAudioTimers(consumer,args[0]|0,announcer,{...globals,audioMode});
     announcer=reset.state;retain(reset.context);
     globals.delay7cdc=0;
     if((args[0]|0)!==((audioMode<<24)>>24)||args[0]!==1&&args[0]!==10)globals.delay7ce4=0;
     if(reset.stopAnnouncer)enqueue({consumer:'c538c',arguments:[0x01000c00,0]},0);
    }
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
     const next=prepareNativeAudioMode(args[0]|0,args[1]>>>0,announcer,{...globals,...materials,audioMode,random4562c:jitter()});
     announcer=next.state;audioMode=next.context.audioMode;retain(next.context);
     materials=Object.fromEntries(['surfaceCode','markedBoxCode','floorCode'].map(k=>[k,next.context[k]]));
     for(const command of next.commands)submit(command);
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
    // Only human channels are admitted. The rival-only inputs satisfy the
    // prepared kernel's structural validation and are never read on this path.
    // The original RNG is mixed-audio-derived. Use a separate reproducible web
    // jitter pattern here; it neither claims that RNG nor consumes gameplay RNG.
    const result=consumeNativeRaceAudio(packet,{...globals,...context,...materials,audioMode,pairedImpact,pairedVariant,random4562c:jitter(),
     rivalPanByte:0,rivalControlByte:0,rivalGate7de8:0,rivalPitchMultiplierBits:0,rivalGainBits:0});
    retain(result.context);pairedImpact=result.context.pairedImpact;pairedVariant=result.context.pairedVariant;
    engineChannels=applyOriginalEngineCommands(engineChannels,result.commands);
    // The rider tail acknowledges event/water-entry latches and commits the
    // prior-speed byte only after the impact consumer has read it.
    packets[player]=result.packet;
    for(const command of result.commands)submit(command,player);
   }
   for(const command of effectPoll.poll())enqueue(command,command.player);
  },
  drain(){return queue.splice(0);},
  clearPendingSounds(){effectPoll.clear();queue.length=0;announcer.delay=announcer.delayedHold=0;globals.delay7ce4=0;},
  engineChannels(){return globals.alternateEngine!==0?null:engineChannels.map((c,i)=>({...c,enabled:c.enabled&&audioMode===7&&globals[i?'secondaryMuted':'primaryMuted']===0}));},
  snapshot(){return {scope:'source-human-race-audio-and-announcer-controls; browser-audio-jitter-poll-phase-and-smoothing',frame,timerFrame,audioMode,globals:{...globals},announcer:{...announcer},
   engineChannels:engineChannels.map(c=>({...c})),effectPoll:effectPoll.snapshot(),riderPoll:effectPoll.riderSnapshot(),
   packets:packets.map(p=>p.slice()),motion:motion.map(m=>({...m})),riderWater:riderWater.map(w=>({...w})),pending:queue.length,emitted,dropped};}
 };
}
