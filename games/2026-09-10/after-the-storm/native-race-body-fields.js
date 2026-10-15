// Numeric65C18 contact counter and final HUD posture. These read the actual
// completed hull/contact/actor owners; rider joints and display speed are not
// source body fields. New web adapters explicitly start the counter at0.
const F=Math.fround;
function integer(v,n){if(!Number.isInteger(v)||v< -2147483648||v>2147483647)throw new RangeError(`Invalid ${n}`);return v;}
export function nextNativeDryContactFrames(previous,{anyWet,impacts}={}){
 integer(previous,'dry-contact counter16d0');
 if(typeof anyWet!=='boolean'||!impacts||typeof impacts.markedBox!=='boolean')throw new TypeError('Supply actual wet/contact owners');
 for(const k of ['floorImpactNative','boxImpactNative','shoreImpactNative'])
  if(!Number.isFinite(impacts[k]))throw new TypeError('Supply finite native contact impacts');
 return !anyWet&&(impacts.floorImpactNative!==0||impacts.boxImpactNative!==0&&!impacts.markedBox||impacts.shoreImpactNative!==0)?(previous+1)|0:0;
}
export function nativeBodyHudPosture(actorState,physicalMode){
 integer(actorState,'actorC54');integer(physicalMode,'physicalMode157c');
 return actorState===23?2:actorState===24?1:actorState===7?(physicalMode===0?2:1):0;
}
export function nativeRaceBodyFields(adapter){
 if(!adapter?.frame||adapter.pendingFrameCompletion||!adapter.lastFrame||adapter.logicalFrames<1)
  throw new TypeError('Source race samples require a completed native outer frame');
 const scale=adapter.hull.scale,toNative=p=>Object.fromEntries(['x','y','z'].map(k=>[k,F(p[k]/scale)]));
 const position=toNative(adapter.hull.center),previous=toNative(adapter.frame.startCenter),profile=adapter.water.profile;
 const displacement=['x','y','z'].map(k=>F(position[k]-previous[k]));
 return {positionNative:position,positionNativeXZ:{x:position.x,z:position.z},priorBodyPointNative:previous,
  forwardXZ:{x:F(adapter.hull.frame.forward.x),z:F(adapter.hull.frame.forward.z)},
  speedB90Native:F(Math.sqrt(F(F(F(displacement[0]*displacement[0])+F(displacement[1]*displacement[1]))+F(displacement[2]*displacement[2])))),
  // F23A0 calls B98 "speed", but it is the actual applied jet force.
  frameSpeedB98:F(adapter.water.forceNative),speedBbc:F(profile.contactForceNative),
  speedBc0:F(F(profile.peakForceNative)*F(profile.lowSpeedForceRatio)),
  field16d0:integer(adapter.dryContactFrames16d0,'dry-contact counter16d0'),
  actorState:adapter.lastFrame.actorState,
  field15c0:nativeBodyHudPosture(adapter.lastFrame.actorState,adapter.riderLifecycle?.physicalMode??0)};
}
