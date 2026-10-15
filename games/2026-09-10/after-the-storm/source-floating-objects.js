// Independent numeric reconstruction of runtime-kind 9 floating spheres.
// Input definitions are selected by the course; Port's twelve objects survive
// every class, player count and Stunt selection. Other runtime sphere kinds,
// original graphics, the wavefield and complete craft physics are external.
//
// Positions/radii are world units, velocities are world units per second.
// Native object velocity is displacement per LOGICAL FRAME, whereas craft
// point velocity is displacement per PHYSICS SUBSTEP. With the conditional
// .025 metres/native and .05s frame / .01s substep assumptions, their conversion
// factors are .5 and 2.5 respectively. These are separate physical clocks.
// Source logical ordering is observed; its wall-clock/SI mapping is conditional.
// Math uses clean double precision, without claiming bit-exact native floats.

export const SOURCE_FLOATING_FRAME_STEP=.05;
export const SOURCE_FLOATING_POINT_STEP=.01;
export const SOURCE_FLOATING_CRAFT_SHARE=Math.fround(.3);
export const SOURCE_FLOATING_COEFFICIENTS=Object.freeze({
 horizontalRetention:.9,anchorSpring:.001,verticalRetention:.8,
 gravityNativePerUpdate:-4,depthLift:.3,liftDepthCapNative:30,
 radiusNative:25,probeRadiusNative:12
});
const FRAME=SOURCE_FLOATING_FRAME_STEP,POINT=SOURCE_FLOATING_POINT_STEP;
const GROUPS=Object.freeze([Object.freeze([4,5,3]),Object.freeze([11,10,9])]);
const states=new WeakSet();
const vector=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vector(p.x,p.y,p.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function finite(value,name){if(!Number.isFinite(value))throw new TypeError(name+' must be finite');return value;}
function finiteVector(value,name){
 if(!value||![value.x,value.y,value.z].every(Number.isFinite))throw new TypeError(name+' must have finite x, y and z');
 return value;
}
function stateOf(state){if(!states.has(state))throw new TypeError('Expected a source floating-object state');return state;}

/** Definitions use the Port course's world-coordinate dynamic-object shape. */
export function createSourceFloatingObjects(definitions,{scale=.025}={}){
 if(!Array.isArray(definitions))throw new TypeError('Floating definitions must be an array');
 finite(scale,'scale');if(scale<=0)throw new RangeError('scale must be positive');
 const ids=new Set(),objects=definitions.map((q,index)=>{
  if(!q||typeof q!=='object')throw new TypeError('Invalid floating definition');
  const id=q.id??index;if((typeof id!=='string'&& !Number.isSafeInteger(id))||ids.has(id))throw new TypeError('Floating ids must be unique strings or safe integers');ids.add(id);
  for(const [name,expected]of Object.entries({runtimeKind:9,sourcePhysicsFlag:4,sourceCollisionKind:2}))if(q[name]!==undefined&&q[name]!==expected)throw new RangeError('Unsupported floating '+name);
  const position=vector(q.x,q.y,q.z);finiteVector(position,'position');
  const anchor={x:finite(q.anchorX??q.x,'anchorX'),z:finite(q.anchorZ??q.z,'anchorZ')};
  const nativeVelocity=q.sourceVelocityNativePerUpdate??[0,0,0];
  if(!Array.isArray(nativeVelocity)||nativeVelocity.length!==3||!nativeVelocity.every(Number.isFinite))throw new TypeError('Native object velocity must have three finite components');
  const velocity=vector(...nativeVelocity.map(v=>v*scale/FRAME));finiteVector(velocity,'velocity');
  const radius=q.radius??25*scale;
  if(!Number.isFinite(radius)||radius<=0||Math.abs(radius/scale-25)>1e-8)throw new RangeError('Runtime-kind 9 radius must be 25 native units');
  return {id,index,sourceIndex:q.sourceIndex??index,sourcePlayerCount:q.sourcePlayerCount,sourceNativeClass:q.sourceNativeClass,
   runtimeKind:9,sourcePhysicsFlag:4,sourceCollisionKind:2,position,velocity,anchor,radius,
   nativeHeading:finite(q.nativeHeading??0,'nativeHeading')};
 });
 const state={remainder:0,frames:0,simulationTime:0,stepsLast:0};
 // The order is the source candidate order. Motion ascends; contacts descend.
 Object.defineProperties(state,{scale:{value:scale,enumerable:true},objects:{value:Object.freeze(objects),enumerable:true}});
 states.add(state);return state;
}

function motionStep(state,surface,time){
 const s=state.scale,k=SOURCE_FLOATING_COEFFICIENTS;
 // Stage each result so an invalid external surface value cannot leave half
 // the objects advanced. The sampler is a pure world-space wave-height query.
 const updates=state.objects.map(object=>{
  const p=finiteVector(object.position,'object position'),v=finiteVector(object.velocity,'object velocity'),a=object.anchor;
  finite(a.x,'anchorX');finite(a.z,'anchorZ');
  const wave=finite(typeof surface==='function'?surface(p.x,p.z,time,object):surface,'surface height');
  const vx=k.horizontalRetention*v.x+k.anchorSpring*(a.x-p.x)/FRAME;
  const vz=k.horizontalRetention*v.z+k.anchorSpring*(a.z-p.z)/FRAME;
  const vy=k.verticalRetention*v.y+(k.gravityNativePerUpdate*s+k.depthLift*clamp(wave-p.y,0,k.liftDepthCapNative*s))/FRAME;
  const velocity=vector(vx,vy,vz),position=vector(p.x+vx*FRAME,p.y+vy*FRAME,p.z+vz*FRAME);
  finiteVector(velocity,'updated velocity');finiteVector(position,'updated position');return {velocity,position};
 });
 updates.forEach((q,i)=>{Object.assign(state.objects[i].velocity,q.velocity);Object.assign(state.objects[i].position,q.position);});
}

/**
 * Accumulate render dt and advance exactly one free-object update per 50ms.
 * Supply a finite world-space surface height or surface(x,z,time,object).
 * active is the external native object-update gate, not an inferred pause flag.
 * Inactive elapsed time is ignored; an existing fractional step stays pending.
 *
 * beforeObjectUpdate(state,clock) is the adapter's ordering boundary. Source
 * performs all five craft substeps (each in descending racer order), updates
 * water, then advances these objects once. Call collideSourceFloatingObjects
 * during the craft contact phase, before each hull integration. This scheduler
 * does not advance craft, invent a wavefield, or perform contacts automatically.
 */
export function stepSourceFloatingObjects(state,dt,{surface,active=true,beforeObjectUpdate,afterObjectUpdate}={}){
 stateOf(state);finite(dt,'dt');if(dt<0||dt>1)throw new RangeError('dt must be from 0 to 1 second');
 if(typeof active!=='boolean')throw new TypeError('active must be boolean');
 for(const [name,callback]of Object.entries({beforeObjectUpdate,afterObjectUpdate}))if(callback!==undefined&&typeof callback!=='function')throw new TypeError(name+' must be a function');
 if(active&&typeof surface!=='function')finite(surface,'surface');
 state.stepsLast=0;if(!active)return state;
 state.remainder+=dt;
 while(state.remainder+1e-12>=FRAME){
  const frame=state.frames+1,time=frame*FRAME,clock=Object.freeze({frame,time,frameStep:FRAME,pointStep:POINT,physicsSteps:5});
  if(beforeObjectUpdate)beforeObjectUpdate(state,clock);
  motionStep(state,surface,time);
  state.remainder=Math.max(0,state.remainder-FRAME);state.frames=frame;state.simulationTime=time;state.stepsLast++;
  if(afterObjectUpdate)afterObjectUpdate(state,clock);
 }
 return state;
}

/** Pure contact geometry and unit conversion; no craft or object mutation. */
export function sourceFloatingSphereContact(state,objectIndex,probe){
 stateOf(state);finiteVector(probe,'probe');
 if(!Number.isInteger(objectIndex)||objectIndex<0||objectIndex>=state.objects.length)throw new RangeError('Invalid floating object index');
 const object=state.objects[objectIndex],p=finiteVector(object.position,'object position');
 if(!Number.isFinite(object.radius)||object.radius<=0)throw new TypeError('Object radius must be finite and positive');
 const dx=probe.x-p.x,dy=probe.y-p.y,dz=probe.z-p.z,extent=object.radius+12*state.scale,distance=Math.hypot(dx,dy,dz);
 if(distance>=extent)return null;
 // Native divides by zero here. Expose its undefined direction instead of
 // fabricating a normal, moving a craft, or allowing NaN into persistent state.
 if(distance===0)return {status:'coincident-center',objectIndex,id:object.id,probe:copy(probe),penetration:extent,unresolved:true};
 const normal=vector(dx/distance,dy/distance,dz/distance),penetration=extent-distance,craftDepth=penetration*SOURCE_FLOATING_CRAFT_SHARE,objectDepth=penetration-craftDepth;
 const craftTranslation=vector(normal.x*craftDepth,normal.y*craftDepth,normal.z*craftDepth);
 const objectTranslation=vector(-normal.x*objectDepth,-normal.y*objectDepth,-normal.z*objectDepth);
 return {status:'contact',objectIndex,id:object.id,probe:copy(probe),normal,penetration,penetrationNative:penetration/state.scale,
  craftTranslation,objectTranslation,
  craftPointDeltaVelocity:vector(craftTranslation.x/POINT,craftTranslation.y/POINT,craftTranslation.z/POINT),
  objectDeltaVelocity:vector(objectTranslation.x/FRAME,objectTranslation.y/FRAME,objectTranslation.z/FRAME)};
}

function probeSnapshot(hull,scale,probes){
 if(probes!==undefined){
  if(!Array.isArray(probes)||probes.length!==2)throw new TypeError('Expected two latched sphere probes');
  return probes.map(p=>copy(finiteVector(p,'probe')));
 }
 const center=finiteVector(hull.center,'hull center'),up=finiteVector(hull.frame?.up,'hull up'),forward=finiteVector(hull.frame?.forward,'hull forward');
 return [27,-9].map(z=>vector(center.x+scale*(2*up.x+z*forward.x),center.y+scale*(2*up.y+z*forward.y),center.z+scale*(2*up.z+z*forward.z)));
}

/**
 * Resolve the source runtime-kind 9 sphere phase for a twelve-point hull.
 * Each latched probe visits objects in descending source order and returns at
 * its FIRST overlap. Object position/recoil change immediately; the second
 * probe retains its original cached position. Separating overlaps still resolve.
 *
 * impactState, if supplied, represents the external per-logical-frame C50 max:
 * {maximum: worldSpeed, normal: vector|null, hitKind: 0}. The caller resets it
 * at frame preparation and shares it across all five substeps of that hull.
 * The kernel changes point XYZ/velocities only. It does not fit center/frame,
 * refresh cached probe positions, or modify progress, engine or control state.
 */
export function collideSourceFloatingObjects(state,hull,{probes,impactState={maximum:0,normal:null,hitKind:0}}={}){
 stateOf(state);
 if(!hull||!Array.isArray(hull.points)||hull.points.length!==12||hull.scale!==state.scale)throw new TypeError('Expected a twelve-point hull with matching scale');
 for(const point of hull.points){finiteVector(point.position,'hull point position');finiteVector(point.velocity,'hull point velocity');}
 if(!impactState||!Number.isFinite(impactState.maximum)||impactState.maximum<0)throw new TypeError('Impact maximum must be finite and nonnegative');
 const snapshot=probeSnapshot(hull,state.scale,probes),contacts=[],unresolved=[];
 for(let probeIndex=0;probeIndex<2;probeIndex++){
  for(let i=state.objects.length-1;i>=0;i--){
   const hit=sourceFloatingSphereContact(state,i,snapshot[probeIndex]);if(!hit)continue;
   if(hit.unresolved){unresolved.push({...hit,probeIndex});break;}
   const object=state.objects[i],indices=GROUPS[probeIndex],normalSpeed=finite(-dot(hit.normal,hull.points[indices[0]].velocity),'normal speed');
   finiteVector(object.velocity,'object velocity');
   const objectPosition=copy(object.position),objectVelocity=copy(object.velocity);
   const pointUpdates=hull.points.map((point,index)=>({position:copy(point.position),velocity:copy(point.velocity)}));
   for(const axis of ['x','y','z']){
    objectPosition[axis]+=hit.objectTranslation[axis];objectVelocity[axis]+=hit.objectDeltaVelocity[axis];
    for(const index of indices)pointUpdates[index].velocity[axis]+=hit.craftPointDeltaVelocity[axis];
    for(const point of pointUpdates)point.position[axis]+=hit.craftTranslation[axis];
   }
   finiteVector(objectPosition,'corrected object position');finiteVector(objectVelocity,'corrected object velocity');
   for(const point of pointUpdates){finiteVector(point.position,'corrected hull position');finiteVector(point.velocity,'corrected hull velocity');}
   impactState.hitKind=0;
   if(normalSpeed>impactState.maximum){impactState.maximum=normalSpeed;impactState.normal=copy(hit.normal);}
   Object.assign(object.position,objectPosition);Object.assign(object.velocity,objectVelocity);
   pointUpdates.forEach((point,i)=>{Object.assign(hull.points[i].position,point.position);Object.assign(hull.points[i].velocity,point.velocity);});
   contacts.push({...hit,probeIndex,pointIndices:[...indices],normalSpeed,normalSpeedNative:normalSpeed*POINT/state.scale});break;
  }
 }
 return {contacts,unresolved,impactState};
}
