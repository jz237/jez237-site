const axes=['x','y','z'],bits=new DataView(new ArrayBuffer(4));

/** AC184/AD418 read body44/48/4C and5C/60/64. The latter are the last
 * physical tick's movement direction, not forward, speed or Euler rotation.
 * Startup reads the actual fresh hull; frame sampling waits for completion.
 * No source tick, normalization, extrapolation or rendered pose is introduced.
 */
export function nativeCourseActorBodyPoseWords(adapter,{startup=false}={}){
 if(typeof startup!=='boolean')throw new TypeError('Actor body startup must be explicit boolean');
 const hull=adapter?.hull;
 if(!hull||adapter.pendingFrameCompletion||adapter.sampledHullTick!==null||
   !Number.isInteger(hull.ticks)||hull.ticks<0||hull.ticks%5!==0)
  throw new TypeError('Course actors require an unsampled physical frame boundary');
 if(startup){
  if(hull.ticks!==0||adapter.logicalFrames!==0||adapter.frame!==null||adapter.lastControls!==null)
   throw new TypeError('Course actor startup requires the fresh physical body');
 }else if(!adapter.frame||!adapter.lastFrame||!Number.isInteger(adapter.logicalFrames)||adapter.logicalFrames<1)
  throw new TypeError('Course actors require a completed physical frame');
 if(!Number.isFinite(hull.scale)||hull.scale<=0)throw new RangeError('Invalid actor body world scale');
 const pose=[];
 for(const [vector,scale]of [[hull.center,hull.scale],[hull.motionDirection,1]])for(const axis of axes){
  const value=vector?.[axis]/scale;
  if(!Number.isFinite(value)||!Number.isFinite(Math.fround(value)))throw new RangeError('Nonfinite actor body pose');
  bits.setFloat32(0,value);pose.push(bits.getUint32(0));
 }
 return Object.freeze(pose);
}
