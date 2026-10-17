import {nativeHullAudioPrefix,nativeContactImmersion,nativeContactAudioMaterials,consumeNativeWetAudio} from './native-contact-audio.js';
import {nativeImpactAudioPacket,consumeNativeImpactAudio} from './native-impact-audio.js';
import {prepareNativeAudioChannel} from './native-audio-channels.js';
import {nativeRaceBodyFields} from './native-race-body-fields.js';
import {queryNativeWaterField} from './native-water-field.js';
const F=Math.fround;
const channelEntries=new Set(['800bfdd0','800bfde4','800bfe70','800bfef8','800bffac','800bfd34','800bfd68','800bffcc']);

// Contact-only owner for the admitted one-human and two-human browser races.
// Fresh web sessions explicitly start packet storage/motion at zero, in racing
// audio mode7 with muted channels. Source status effects enable them. This is
// not an emulation of retained cartridge mixer/voice state or nearest-rival
// channel2 routing; ordinary engine sound and music keep their existing owners.
export function createNativeRaceContactAudio({players,courseIndex}){
 if(![1,2].includes(players))throw new RangeError('Contact audio requires one or two human racers');
 let materials=nativeContactAudioMaterials(courseIndex),audioMode=7,frame=0,pairedImpact=0,pairedVariant=0;
 let globals={raceMode:players-1,courseIndex,primaryMuted:1,secondaryMuted:1,alternateEngine:0,
  rankDelay:0,primaryStart:0,secondaryStart:0,primaryPitchBits:0,secondaryPitchBits:0,rivalPitchBits:0,
  primaryFlag:0,primaryCompanionFlag:0,primaryLastPlace:0,secondaryFlag:0,secondaryCompanionFlag:0,secondaryLastPlace:0};
 const packets=[Array(32).fill(0),Array(32).fill(0)],motion=Array.from({length:players},()=>({speed:0,vertical:0})),queue=[];
 let emitted=0,dropped=0;
 function enqueue(command,player){
  // Engine-water controls remain captured by the kernels; this backend only
  // presents transient contacts. Limit backlog when rendering is suspended.
  if(command.consumer!=='bffec'&&!(command.consumer==='c53d4'&&command.arguments[0]===0x06000700))return;
  if(queue.length===64){queue.shift();dropped++;}
  queue.push({frame,player,consumer:command.consumer,arguments:[...command.arguments]});emitted++;
 }
 return {
  applyEffects(effects){
   for(const effect of effects){
    if(effect.kind!=='externalCall')continue;
    const {consumer,arguments:args}=effect;
    if(channelEntries.has(consumer)){
     const stop=['800bfd34','800bfd68','800bffcc'].includes(consumer);
     const index=stop?(consumer==='800bfd34'?0:1):args[0]===0x80192610?0:args[0]===0x80192630?1:-1;
     if(index<0)throw new RangeError('Unknown source audio packet address');
     const next=prepareNativeAudioChannel(consumer,packets[index],globals);
     packets[index]=next.packet;globals=next.globals;
    }else if(consumer==='800c1f60'){
     // The racing-mode branch stops both engines without changing audioMode.
     if(audioMode===7)globals.primaryMuted=globals.secondaryMuted=1;
    }else if(consumer==='800c21f4'){
     const mode=args[0]|0,previous=audioMode;
     if(mode!==previous||mode!==1&&mode!==10){
      audioMode=(mode<<24)>>24;globals.primaryMuted=globals.secondaryMuted=1;
      if(mode===0){globals.raceMode=0;globals.courseIndex=0;}
      else if(mode===1&&previous!==10)globals.raceMode=args[1]|0;
      else if(mode===7){globals.courseIndex=args[1]|0;materials=nativeContactAudioMaterials(globals.courseIndex);}
     }
    }
   }
  },
  advance(adapters,field,recordFlags318,recordMotion2c8){
   if(adapters.length!==players||recordFlags318.length!==players||!Array.isArray(recordMotion2c8)||recordMotion2c8.length!==players)throw new RangeError('Contact audio needs every admitted human body and source record');
   const next=adapters[0].logicalFrames;
   if(next===frame)return;
   if(next!==frame+1||adapters.some(a=>a.logicalFrames!==next||a.pendingFrameCompletion))throw new RangeError('Contact audio requires successive completed physics frames');
   frame=next;
   for(let player=0;player<players;player++){
    const adapter=adapters[player],body=nativeRaceBodyFields(adapter),wet=adapter.wetState;
    if(adapter.frame.simulationState!==0)motion[player]={speed:body.speedB90Native,vertical:F(body.positionNative.y-body.priorBodyPointNative.y)};
    const packet=packets[player],prefix=nativeHullAudioPrefix({frameSpeedNative:motion[player].speed,verticalFrameB7c:motion[player].vertical,
     record2c8:recordMotion2c8[player],bodyBfc:adapter.hull.lateralMotionBfc,
     bodyC78:wet.wetCountC78,wetFlagC7c:wet.wetFlagC7c,landingC7e:wet.landingC7e});
    const points=[0,2].map(i=>Object.fromEntries(['x','y','z'].map(k=>[k,F(adapter.hull.points[i].position[k]/adapter.hull.scale)])));
    const query=queryNativeWaterField(field,F(F(points[0].x+points[1].x)*.5),F(F(points[0].z+points[1].z)*.5));
    for(let i=0;i<4;i++)packet[i]=prefix[i];
    packet[15]=nativeContactImmersion({waterQueryNative:query.sourcePlaneQueryNative,point90YNative:points[0].y,pointD0YNative:points[1].y});
    const impact=nativeImpactAudioPacket({impacts:adapter.impacts,objectHitKind16d8:adapter.objectHitKind16d8,
     frameSpeedNative:motion[player].speed,recordFlag318:recordFlags318[player]},packet[18]);
    packet[18]=impact.type;packet[19]=impact.strength;packet[20]=impact.trigger;packet[27]=adapter.hull.rider;
    // C118C/C11CC and C010C gate consumption, not52480 packet production.
    // Mode4's separate rider-water cue is outside this contact subset.
    if(audioMode!==7||globals[player===0?'primaryMuted':'secondaryMuted']!==0)continue;
    const context={raceMode:globals.raceMode,channel:player,mixerLane:player===0?0:3};
    const landing=consumeNativeWetAudio(packet,context);
    const hit=consumeNativeImpactAudio(landing.packet,{...context,...materials,pairedImpact,pairedVariant});
    pairedImpact=hit.context.pairedImpact;pairedVariant=hit.context.pairedVariant;
    packets[player]=hit.packet;
    // End of C010C: impacts above read the PRIOR frame's speed byte.
    packets[player][31]=packets[player][0];
    for(const command of [...landing.commands,...hit.commands])enqueue(command,player);
   }
  },
  drain(){return queue.splice(0);},
  snapshot(){return {scope:'source-contact-timing; authored-sample-backend',frame,audioMode,globals:{...globals},
   packets:packets.map(p=>p.slice()),motion:motion.map(m=>({...m})),pending:queue.length,emitted,dropped};}
 };
}
