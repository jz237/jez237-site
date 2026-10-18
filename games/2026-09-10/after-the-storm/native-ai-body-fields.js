// Input-stage snapshot of the actual preceding hull/controller/contact owners.
// No renderer pose, HUD speed, human device or guessed actor is sampled here.
const F=Math.fround,axes=['x','y','z'];
const vector=(p,scale=1)=>Object.fromEntries(axes.map(k=>[k,F(p[k]/scale)]));

/** The first non-driving input reads only B50,1578 and16F4. Original62E50
 * clears B50 at631E4 and16F4 at63208, and stores1.0 to1578 at6323C.
 * This is an explicit fresh-body reset, not a synthetic completed frame or a
 * restored driving snapshot. All subsequent input uses nativeAIBodyFields.
 */
export function nativeAIStartupBodyFields(adapter,phase650){
 if(!Number.isInteger(phase650)||phase650< -2147483648||phase650>2147483647||phase650===3)
  throw new RangeError('AI startup input requires a non-driving source phase');
 if(!adapter?.riderLifecycle||adapter.riderLifecycle.state.phase!=='ready'||adapter.logicalFrames!==0||
    adapter.hull?.ticks!==0||adapter.frame!==null||adapter.lastControls!==null||adapter.pendingFrameCompletion||adapter.sampledHullTick!==null)
  throw new TypeError('AI startup input requires a fresh unsampled physical rider');
 if(adapter.controlState.heldButtons!==0||adapter.actionState.override!==0)
  throw new RangeError('AI startup input requires the source-cleared button and action owners');
 return {heldButtons:adapter.controlState.heldButtons,powerFactor:1,action16f4:adapter.actionState.override};
}

/** Read before this rider's next common61184 preparation. The source15DC
 * value is exactly the inverse of the preceding controller's mute branch;
 * it remains true while coasting with neither A nor Z held. AI motion5C is
 * the last hull tick's direction, not forward or outer-frame displacement.
 * Startup needs its own source initialization; this reader never invents a
 * first input/power/contact state. Returned vectors are detached snapshots.
 */
export function nativeAIBodyFields(adapter){
 if(!adapter?.frame||adapter.pendingFrameCompletion||adapter.logicalFrames<1||
    !adapter.lastControls||!adapter.riderLifecycle||adapter.riderLifecycle.state.phase!=='ready')
  throw new TypeError('AI body samples require a completed native rider frame');
 if(adapter.sampledHullTick!==null)throw new Error('AI body samples precede the next control latch');
 const {hull,lastControls:controls,lastFrame,water,actionState,riderLifecycle}=adapter;
 const {state}=riderLifecycle;
 return {
  positionNative:vector(hull.center,hull.scale),motionDirection:vector(hull.motionDirection),
  forwardNative:vector(hull.frame.forward),rightNative:vector(hull.frame.right),bodyUpY:F(hull.frame.up.y),
  steeringDegrees:F(water.profile.steeringDegrees),actorState:state.actorState,
  pendingActorState:state.pendingActor,animationFrame:state.animationFrame,
  priorControlActive:!controls.muted,markedBox15de:Number(lastFrame.impacts.markedBox),
  fieldC7c:adapter.wetState.wetFlagC7c,floorImpactNative:F(lastFrame.impacts.floorImpactNative),
  impactNormalNative:vector(lastFrame.impacts.normal),rawXNative:controls.rawXNative,rawYNative:controls.rawYNative,
  heldButtons:controls.heldButtons,powerFactor:F(controls.powerFactor),frameSpeedNative:F(lastFrame.frameSpeedNative),
  action16f4:actionState.override,actionState16d4:actionState.turnCount16d4,
 };
}
