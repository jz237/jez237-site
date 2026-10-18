const F=Math.fround;
const float=v=>{if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError('Supply finite source spray fields');return F(v);};
const word=v=>{if(!Number.isInteger(v)||v< -2147483648||v>2147483647)throw new RangeError('Supply source spray integers');return v;};
const vector=v=>Object.fromEntries(['x','y','z'].map(k=>[k,float(v?.[k])]));
const length2=(x,z)=>F(Math.sqrt(F(F(x*x)+F(z*z))));
const length3=v=>F(Math.sqrt(F(F(F(v.x*v.x)+F(v.y*v.y))+F(v.z*v.z))));

// Human AE210 input branch. The normalized4D30C query is supplied at the
// physical center's XZ. C4C is the original floor-impact maximum.
export function prepareNativeSprayPhysicalInputs(input){
 const position=vector(input.positionNative),velocity=vector(input.frameDisplacementNative),forward=vector(input.forwardNative);
 const right=vector(input.rightNative),reference=vector(input.referenceVelocityNative),tick=vector(input.tickDisplacementNative);
 const floor=float(input.floorImpactNative),waterQuery=float(input.waterQueryNative),course=word(input.courseIndex),alternate=word(input.alternate16cc);
 if(floor<0||alternate<0||alternate>65535)throw new RangeError('Invalid source spray body field');
 position.y=F(position.y-8);
 const special=Number([0,1,2,6,7].includes(course)&&floor>0&&F(waterQuery+4)<position.y);
 if(alternate!==0)position.y=F(position.y+2);
 let water=waterQuery;
 if(special){position.y=F(position.y-2);water=F(position.y+12);}
 const difference=Object.fromEntries(['x','y','z'].map(k=>[k,F(reference[k]-tick[k])])),horizontal=length2(-right.x,-right.z);
 let lateral=horizontal>0?F(F(velocity.x*F(-right.x/horizontal))+F(velocity.z*F(-right.z/horizontal))):length2(velocity.x,velocity.z);
 if(lateral<0)lateral=-lateral;
 return {position,velocity,forward,speed:length3(velocity),lateral,referenceMotion:length3(difference),water,special};
}

//801EDBD4 preserves the previous shared output on a zero-length camera axis.
export function normalizeNativeSprayCamera(previous,forward){
 const p=vector(previous),v=vector(forward),length=length3(v);
 return length>0?Object.fromEntries(['x','y','z'].map(k=>[k,F(v[k]/length)])):p;
}

//6A264 runs at the start of922E4, before physical/world processing.
export function nextNativeSprayFrameCounter(previous,activity624){
 word(previous);word(activity624);return activity624===-1?(previous+1)|0:previous;
}

//624CC,62774..62830: displacement of the physical point27 units forward
// and2 units above the center. AE210 compares this with the last hull tick's
// center displacement; the five-tick rider reference is a different field.
export function prepareNativeSprayMotion(previousPoint,{center,up,forward}){
 const old=vector(previousPoint),c=vector(center),u=vector(up),f=vector(forward);
 const point=Object.fromEntries(['x','y','z'].map(k=>[k,F(F(f[k]*27)+F(c[k]+F(u[k]+u[k])))]));
 return {point,velocity:Object.fromEntries(['x','y','z'].map(k=>[k,F(point[k]-old[k])]))};
}

// B08F8's scalar audio-level dependency chain, through B1998. Inputs are
// AE210's physical values and the original camera/scene controls. Displayed
// particle counts and modern camera positions are not substitutes. Particle
// pools do not feed these levels; their geometry/RNG lifecycle is separate.
// Gated frames RETAIN the prior left/right values, including dry/hidden frames.
export function prepareNativeSprayLevels(previous,input){
 const s={};for(const k of ['wet','dryFrames','cooldown','left','right'])s[k]=word(previous?.[k]);
 for(const k of ['intensity','previousSpeed','previousVertical'])s[k]=float(previous?.[k]);
 const c={...input};for(const k of ['racerIndex','primaryIndex','secondaryIndex','players','scene638','extraRacer','racerCount','frameCounter','record2f4','special'])c[k]=word(c[k]);
 for(const k of ['position','velocity','forward','cameraEye','cameraForward'])c[k]=vector(c[k]);
 for(const k of ['speed','lateral','referenceMotion','water'])c[k]=float(c[k]);
 const human=c.racerIndex===c.primaryIndex||c.players===2&&c.racerIndex===c.secondaryIndex;
 const specialScene=c.scene638===4||c.scene638===10,splitRace=c.players===2&&c.scene638===1;
 const delta=Object.fromEntries(['x','y','z'].map(k=>[k,F(c.position[k]-c.cameraEye[k])]));
 const distance=F(Math.sqrt(F(F(F(delta.x*delta.x)+F(delta.y*delta.y))+F(delta.z*delta.z))));
 let visible=false,detail=0;
 if(splitRace){visible=true;detail=1;}
 else if(distance<800&&distance>16){
  const facing=F(F(F(F(delta.x/distance)*c.cameraForward.x)+F(F(delta.y/distance)*c.cameraForward.y))+F(F(delta.z/distance)*c.cameraForward.z));
  if(c.players===2||F(.707107)<facing){
   visible=true;
   if(specialScene||c.players===1&&c.racerIndex===c.primaryIndex&&c.record2f4!==0)detail=distance<200?3:distance<400?2:1;
   else if(distance<200||c.scene638===0)detail=2;
   else if(distance<400)detail=1;
  }
 }
 if(specialScene)detail=3;
 if(c.extraRacer!==0&&c.racerIndex===c.racerCount&&detail<2)detail=2;
 const forwardLength=length2(c.forward.x,c.forward.z),velocityLength=length2(c.velocity.x,c.velocity.z);
 const alignment=forwardLength<=0||velocityLength<=0?1:F(F(F(F(c.forward.x*c.velocity.x)+F(c.forward.z*c.velocity.z))/forwardLength)/velocityLength);
 const oldWet=s.wet;s.wet=specialScene?1:Number(c.position.y<=c.water);
 const entered=oldWet===0&&s.wet!==0;
 if(s.wet!==0)s.dryFrames=0;else if(s.dryFrames<32767)s.dryFrames=(s.dryFrames+1)|0;
 const speedBase=c.speed<10?F(c.speed*(specialScene?5:3)):F(F(F(c.speed-10)*F(.6))+(specialScene?50:30));
 const jet=specialScene||!human?0:Math.max(0,F(F(F(8-c.speed)*7.5)*c.referenceMotion));
 const change=Math.abs(F(c.speed-s.previousSpeed));
 s.intensity=F(F(F(F(change*1.5)+speedBase)+F(c.lateral+c.lateral))+jet);s.previousSpeed=c.speed;
 let strength=F(F(s.intensity/50)*4);
 if(s.wet===0||!visible)strength=0;
 else if(entered&&Math.abs(c.velocity.y)>1){s.cooldown=0;strength=F(strength+strength);}
 else if(s.previousVertical<0&&c.velocity.y>0)s.cooldown=2;
 else if(s.previousVertical>0&&c.velocity.y<0){s.cooldown=0;strength=F(strength*F(1.2));}
 if(c.special!==0)strength=F(strength*F(1.2));
 s.previousVertical=c.velocity.y;
 if(s.cooldown!==0){s.cooldown=(s.cooldown-1)|0;strength=F(strength*.5);}
 let emit=splitRace?(c.frameCounter&1)===0:detail>1||(c.frameCounter&1)===0;
 if(!entered&&c.position.y<F(c.water-16))emit=false;
 const square=F(alignment*alignment),sine=square<1?F(Math.sqrt(F(1-square))):0;
 const cross=F(F(c.forward.z*c.velocity.x)-F(c.forward.x*c.velocity.z));
 const split=cross>=0?F(F(sine*.5)+.5):F(.5-F(sine*.5));
 const a=F(strength*split),b=F(strength*F(1-split)),leftStrength=F(a+a),rightStrength=F(b+b);
 if(F(.1)<strength&&emit&&detail!==0&&human){
  const level=v=>v>4?Math.min(127,Math.trunc(F(F(v*.125)*127))):0;
  s.left=level(leftStrength);s.right=level(rightStrength);
 }
 return s;
}
