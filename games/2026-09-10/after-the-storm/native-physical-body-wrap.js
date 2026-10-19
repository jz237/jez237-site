import {prepareNativeBodyBoundaryDrift} from './native-body-boundary-drift.js';
const F=Math.fround,axes=['x','y','z'],applied=new WeakMap();
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite physical wrap position');return F(v);}

/** Adapt618F4 to the host's authored physical rig, at65C18 before kinematics.
 * The host retains nineteen rider and six auxiliary positions; its history
 * targets are reconstructed from those positions on the next solve. Authored
 * animation targets are regenerated in the translated hull frame. It has no
 * three raw eighteen-joint pose blocks, so this is not raw body-memory parity.
 * Stored deltas, velocities, orientation, rest lengths, contact proxies and
 * the160C spray reference are deliberately NOT positions translated by this
 * bridge. All affected owners are prepared before the canonical camera commit.
 */
export function prepareNativePhysicalBodyWrap(adapter,{anchorState,boundsWords24ac,previousCameraPositionNative}={}){
 const hull=adapter?.hull,frame=adapter?.frame;
 if(!hull||!frame||hull.ticks%5!==0||adapter.sampledHullTick!==null||
  !(adapter.pendingFrameCompletion||frame.simulationState===0&&adapter.preparedHullTick===hull.ticks)||
  applied.get(adapter)?.frame===frame)throw new Error('Physical wrap requires an unwrapped body completion boundary');
 const scale=hull.scale,tick=hull.ticks,logicalFrame=adapter.logicalFrames;
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError('Invalid physical wrap scale');
 const {driftNative}=prepareNativeBodyBoundaryDrift({boundsWords24ac,positionNativeXZ:{x:hull.center.x/scale,z:hull.center.z/scale}});
 const moved=driftNative.x!==0||driftNative.z!==0,writes=[];
 const translate=(point,units)=>Object.fromEntries(axes.map(k=>{
  const value=point?.[k],delta=k==='y'?0:driftNative[k];finite(value/units);
  // Existing physical solvers use browser doubles. Keep unchanged axes and
  // ordinary frames exact; apply source binary32 addition on crossed axes.
  return [k,delta===0?value:finite(F(finite(value/units)+delta))*units];
 }));
 const stage=(owner,key,units)=>writes.push([owner,key,translate(owner[key],units)]);
 if(moved){
  if(hull.points?.length!==12||adapter.articulatedRider?.points?.length!==19||anchorState?.points?.length!==6)
   throw new TypeError('Physical wrap requires the complete authored hull and rider rig');
  for(const p of [...adapter.articulatedRider.points,...anchorState.points])stage(p,'position',scale);
  for(const key of [2,3])stage(anchorState.anchors,key,scale);
  stage(adapter.articulatedRider,'jointWorld',scale);
  for(const p of hull.points)stage(p,'position',scale);
  stage(adapter.lastFrame,'referencePositionNative',1);
  stage(hull,'center',scale);stage(frame,'startCenter',scale);
  if(frame.prepared.jointWorld)writes.push([frame,'prepared',Object.freeze({...frame.prepared,
   jointWorld:Object.freeze(translate(frame.prepared.jointWorld,scale))})]);
 }
 const previousCameraPosition=moved&&previousCameraPositionNative!==undefined?translate(previousCameraPositionNative,1):previousCameraPositionNative;
 let committed=false;
 return Object.freeze({driftNative,previousCameraPositionNative:previousCameraPosition,moved,
  commit(){
   if(committed||adapter.frame!==frame||adapter.logicalFrames!==logicalFrame||hull.ticks!==tick||applied.get(adapter)?.frame===frame)
    throw new Error('Physical wrap transaction is stale or already applied');
   for(const [owner,key,value]of writes)owner[key]=value;
   applied.set(adapter,{frame,driftNative});committed=true;
   return driftNative;
  }});
}

/** Actual applied BF0/BF4, available only after that body's completion. */
export function captureNativePhysicalBoundaryDrift(adapter){
 const q=applied.get(adapter);
 if(!q||q.frame!==adapter.frame||adapter.pendingFrameCompletion||adapter.preparedHullTick===adapter.hull.ticks||
  adapter.sampledHullTick!==null||adapter.inactiveTicks!==0||adapter.hull.ticks%5!==0)
  throw new Error('Boundary drift requires a completed wrapped body');
 return q.driftNative;
}
