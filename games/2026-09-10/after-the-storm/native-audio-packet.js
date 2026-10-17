import {nativeHullAudioPrefix,nativeContactImmersion} from './native-contact-audio.js';
import {nativeImpactAudioPacket} from './native-impact-audio.js';
const F=Math.fround;
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native audio packet field');return v;}
const word=v=>integer(v,-2147483648,2147483647),half=v=>integer(v,0,65535);
function point(p){
 if(!p||!['x','y','z'].every(k=>Number.isFinite(p[k])&&Number.isFinite(F(p[k]))))throw new TypeError('Supply actual native audio query points');
 return Object.fromEntries(['x','y','z'].map(k=>[k,F(p[k])]));
}

//624CC,62724..62774. BFC is the XZ velocity projected onto the normalized
// horizontal right axis, not an Euler pitch angle. A vertical right axis
// retains BFC; the source does not substitute zero at the singularity.
export function prepareNativeAudioLateralMotion(previous,{velocity50Native,right84Native}){
 const right=point(right84Native),velocity=point({...velocity50Native,y:0});
 if(!Number.isFinite(previous)||!Number.isFinite(F(previous)))throw new RangeError('Supply retained BFC');
 const horizontal=F(1-F(right.y*right.y));
 return horizontal>0?F(F(F(velocity.x*right.x)+F(velocity.z*right.z))/F(Math.sqrt(horizontal))):F(previous);
}

//65C18,662E0..6633C, after the physical rider solve. Only falling actor23
// and actor5 query joint2 (body6B4). Equality is dry. C84 is the prior C86,
// independently of hull wet/landing flags; inactive actor branches read no point.
export function prepareNativeRiderWaterAudio(previous,{actorC54,point6b4Native,waterQueryNative}){
 const bodyC84=half(previous),actor=word(actorC54);
 if(actor!==23&&actor!==5)return {bodyC84,bodyC86:0};
 const p=point(point6b4Native);
 if(!Number.isFinite(waterQueryNative)||!Number.isFinite(F(waterQueryNative)))throw new TypeError('Supply actual native rider water query');
 return {bodyC84,bodyC86:Number(p.y<F(waterQueryNative))};
}

//52480's raw throttle and actor fields.1608 is the physical crash countdown.
// An animation event stays latched until its consumer acknowledges it.
export function prepareNativeActorAudioFields(input,previousAnimationEvent){
 const buttons=half(input.buttonsB56),actor=word(input.actorC54),frame=word(input.animationC58),crash=half(input.body1608);
 integer(previousAnimationEvent,0,255);
 return {buttonByte:Number((buttons&0xa000)!==0),
  animationEvent:actor===7&&frame===58?1:previousAnimationEvent,
  riderEvent:crash!==0||actor===23||actor===7&&frame<56?2:actor===24?1:0};
}

// Complete52480 producer. Inputs are source body, record and rider fields;
// offsets remain explicit where their gameplay meaning is not established.
// The supplied4D30C return is a normalized physics query at the returned XZ
// midpoint. Neither rendered height nor an inferred rider pose is a substitute.
// Consumers retain their timers/latches in the packet between producer calls.
export function prepareNativeHullAudioPacket(input,previous){
 if(!Array.isArray(previous)||previous.length!==32)throw new TypeError('Expected32 retained audio packet bytes');
 const packet=previous.map(v=>integer(v,0,255)),p0=point(input.point90Native),p2=point(input.pointD0Native);
 const actorAudio=prepareNativeActorAudioFields(input,packet[28]);
 const prior=half(input.bodyC84),current=half(input.bodyC86);
 const power=word(input.record12c),place=word(input.place4),rider=word(input.riderB68);
 const countA=word(input.rider1c5c),countB=word(input.rider1c60);
 const prefix=nativeHullAudioPrefix(input);for(let i=0;i<4;i++)packet[i]=prefix[i];
 packet[4]=actorAudio.buttonByte;
 // The producer only SETS this event. Consumer acknowledgement owns clearing.
 packet[28]=actorAudio.animationEvent;
 packet[15]=nativeContactImmersion({waterQueryNative:input.waterQueryNative,point90YNative:p0.y,pointD0YNative:p2.y});
 packet[24]=prior===0&&current===1?1:0;
 packet[14]=power&255;
 const impact=nativeImpactAudioPacket(input,packet[18]);
 packet[18]=impact.type;packet[19]=impact.strength;packet[20]=impact.trigger;
 packet[17]=Math.max(countA,countB)&255;packet[16]=1;
 packet[25]=place&255;packet[27]=rider&255;
 packet[21]=actorAudio.riderEvent;
 return {packet,waterQueryPositionNative:{x:F(F(p0.x+p2.x)*.5),z:F(F(p0.z+p2.z)*.5)}};
}
