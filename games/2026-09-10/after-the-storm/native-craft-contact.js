import {NATIVE_HULL_STEP} from './native-hull.js';
import {nativeImpactSnapshot,recordNativeImpact} from './native-impact-state.js';

// Independent reconstruction of the four-proxy craft contact mechanics. Proxy
// positions/deltas use native float32 units; hull positions use world units and
// point velocities use world units per GAME second. The world scale is a host
// choice. This leaf neither schedules hull ticks nor infers race/main states.
const F=Math.fround,H=NATIVE_HULL_STEP,axes=['x','y','z'];
const along=[27,9,-9,-27],groups=[[4,5,3],[8,7,6],[11,10,9],[1,2,0]];
const states=new WeakMap(),hullStates=new WeakMap();
const EMPTY=Object.freeze({contacts:Object.freeze([])});
const copy=p=>({x:p.x,y:p.y,z:p.z});
const freezeVector=p=>Object.freeze(copy(p));
function owned(state,hull){
 const data=states.get(state);
 if(!data)throw new TypeError('Expected an owned native craft contact state');
 if(hull!==undefined&&data.hull!==hull)throw new TypeError('Craft contact state belongs to another hull');
 return data;
}
function vector(value,name,convert=v=>v){
 if(!value||!axes.every(k=>Number.isFinite(value[k])))throw new TypeError(`${name} must have finite XYZ`);
 const result=Object.fromEntries(axes.map(k=>[k,F(convert(value[k]))]));
 if(!axes.every(k=>Number.isFinite(result[k])))throw new RangeError(`${name} must fit native float32`);
 return result;
}
function hullPose(hull){
 if(!hull||!Number.isFinite(hull.scale)||hull.scale<=0)throw new RangeError('Hull must have a positive finite scale');
 if(!Number.isSafeInteger(hull.ticks)||hull.ticks<0)throw new RangeError('Hull must have a nonnegative physical tick');
 if(!Array.isArray(hull.points)||hull.points.length!==12)throw new TypeError('Craft contact requires twelve hull points');
 return {center:vector(hull.center,'Hull center',v=>v/hull.scale),
  forward:vector(hull.frame?.forward,'Hull forward'),up:vector(hull.frame?.up,'Hull up')};
}
function positions(pose){
 const raised=Object.fromEntries(axes.map(k=>[k,F(pose.center[k]+F(pose.up[k]+pose.up[k]))]));
 const result=along.map(d=>Object.fromEntries(axes.map(k=>[k,F(F(pose.forward[k]*d)+raised[k])])));
 if(result.some(p=>axes.some(k=>!Number.isFinite(p[k]))))throw new RangeError('Craft proxies must fit native float32');
 return result;
}
function pointValues(hull){
 return hull.points.map((point,i)=>({
  position:vector(point?.position,`Hull point${i} position`,v=>v/hull.scale),
  velocity:vector(point?.velocity,`Hull point${i} velocity`,v=>v*H/hull.scale)
 }));
}
function checkOwnerHull(data,hull){
 if(data.scale!==hull.scale)throw new RangeError('Craft contact hull scale changed; create a new owner');
 return hullPose(hull);
}

/** Seed actual fitted proxies and ZERO deltas, as in a source craft reset.
 * A state is opaque, belongs to one hull and cannot be imported from snapshots.
 * Creation does not derive movement from a host's initial velocity. */
export function createNativeCraftContactState(hull){
 return createNativeCraftContactStates([hull])[0];
}

/** Atomic owner creation for a shared world's source-index-ordered hulls.
 * Every identity and numeric cache is checked before ANY hull is registered;
 * a later rejected hull cannot strand an earlier hull behind a lost token.
 * Returns states in the supplied order; an empty batch returns an empty array.
 */
export function createNativeCraftContactStates(hulls){
 if(!Array.isArray(hulls)||hulls.length>4)throw new RangeError('Expected up to four hulls');
 if(new Set(hulls).size!==hulls.length)throw new Error('Craft contact batch hulls must be distinct');
 const prepared=hulls.map(hull=>{
  if(hullStates.has(hull))throw new Error('Hull already has a native craft contact state');
  const pose=hullPose(hull);pointValues(hull);
  return {hull,scale:hull.scale,tick:hull.ticks,revision:0,lastAppliedTick:null,
   positions:positions(pose),deltas:along.map(()=>({x:0,y:0,z:0}))};
 });
 return prepared.map(data=>{
  const state=Object.freeze({});states.set(state,data);hullStates.set(data.hull,state);return state;
 });
}

/** Reset only this proxy history. Caller owns hull/impact/race lifecycle.
 * An arbitrary host teleport is not automatically a source reset. */
export function resetNativeCraftContactState(state,hull){
 const data=owned(state,hull),next=positions(checkOwnerHull(data,hull));pointValues(hull);
 data.positions=next;data.deltas=along.map(()=>({x:0,y:0,z:0}));
 data.tick=hull.ticks;data.revision++;data.lastAppliedTick=null;return state;
}

/** Exactly once AFTER each physical integration/refit. The delta includes
 * rotation and common contact translation. Repeating this on a render refresh
 * would erase actual movement, so duplicate/skipped tick updates are rejected. */
export function refreshNativeCraftContactState(state,hull){
 const data=owned(state,hull),pose=checkOwnerHull(data,hull);
 if(hull.ticks!==data.tick+1)throw new Error('Craft proxies must refresh after exactly one new hull tick');
 const next=positions(pose),deltas=next.map((p,i)=>Object.fromEntries(axes.map(k=>[k,F(p[k]-data.positions[i][k])])));
 if(deltas.some(p=>axes.some(k=>!Number.isFinite(p[k]))))throw new RangeError('Craft proxy movement must fit native float32');
 data.positions=next;data.deltas=deltas;data.tick=hull.ticks;data.revision++;return state;
}

function prepareEntries(entries){
 const seenHulls=new Set(),seenImpacts=new Set();let tick,scale;
 return entries.map((entry,index)=>{
  const {hull,contactState,impacts}=entry??{},data=owned(contactState,hull);
  if(hull!==data.hull)throw new TypeError('Each craft entry must contain its owning hull');
  const pose=checkOwnerHull(data,hull);
  if(seenHulls.has(hull)||seenImpacts.has(impacts))throw new Error('Craft entries must have distinct hulls and impact states');
  seenHulls.add(hull);seenImpacts.add(impacts);
  if(data.tick!==hull.ticks)throw new Error('Craft proxies are stale for their physical hull tick');
  if(data.lastAppliedTick===data.tick)throw new Error('Craft contacts already applied at this physical tick');
  if(index===0){tick=data.tick;scale=data.scale;}
  else if(data.tick!==tick||data.scale!==scale)throw new RangeError('Craft entries must share a tick and world scale');
  const impact=nativeImpactSnapshot(impacts);
  if(!Number.isFinite(impact.racerImpactNative)||!Number.isFinite(F(impact.racerImpactNative)))
   throw new TypeError('Racer impact must be finite native float32');
  return {hull,data,impacts,center:pose.center,points:pointValues(hull),dirty:false,dirtyVelocities:new Set()};
 });
}
function discoveries(entries){
 const events=[];
 for(let a=0;a<entries.length-1;a++)for(let b=a+1;b<entries.length;b++){
  const A=entries[a],B=entries[b],cx=F(A.center.x-B.center.x),cz=F(A.center.z-B.center.z);
  if(F(F(cx*cx)+F(cz*cz))>6084)continue;
  for(let pa=0;pa<4;pa++)for(let pb=0;pb<4;pb++){
   const P=A.data.positions[pa],Q=B.data.positions[pb],dx=F(P.x-Q.x),dz=F(P.z-Q.z);
   const xz=F(F(dx*dx)+F(dz*dz));if(xz>=576)continue;
   const dy=F(P.y-Q.y),distanceSquared=F(xz+F(dy*dy));if(distanceSquared>=576)continue;
   // The original reciprocal-sqrt path has no coincident-center guard. This
   // host explicitly rejects that unsupported/FCSR-dependent state, without
   // inventing a normal. Discovery completes before ANY gameplay mutation.
   if(!(distanceSquared>0))throw new RangeError('Coincident craft proxies are unsupported');
   const distanceNative=F(Math.sqrt(distanceSquared)),inverse=F(1/distanceNative);
   const normal={x:F(dx*inverse),y:F(dy*inverse),z:F(dz*inverse)};
   const va=A.data.deltas[pa],vb=B.data.deltas[pb];
   const vx=F(vb.x-va.x),vy=F(vb.y-va.y),vz=F(vb.z-va.z);
   const incomingNative=F(F(F(vx*normal.x)+F(normal.y*vy))+F(normal.z*vz));
   const half=F(F(24-distanceNative)*.5),halfPushNative=Object.fromEntries(axes.map(k=>[k,F(normal[k]*half)]));
   if(!Number.isFinite(incomingNative)||axes.some(k=>!Number.isFinite(halfPushNative[k]))||
      Math.abs(Math.hypot(normal.x,normal.y,normal.z)-1)>.001)
    throw new RangeError('Craft contact arithmetic must remain finite float32 with a unit normal');
   events.push({racerA:a,racerB:b,proxyA:pa,proxyB:pb,incomingNative,distanceNative,normal,halfPushNative});
  }
 }
 return events;
}
function respond(A,B,event){
 const push=event.halfPushNative;
 for(const q of groups[event.proxyA]){
  const v=A.points[q].velocity;for(const k of axes)v[k]=F(v[k]+push[k]);A.dirtyVelocities.add(q);
 }
 for(const q of groups[event.proxyB]){
  const v=B.points[q].velocity;for(const k of axes)v[k]=F(v[k]-push[k]);B.dirtyVelocities.add(q);
 }
 for(let q=0;q<12;q++)for(const k of axes){
  A.points[q].position[k]=F(A.points[q].position[k]+push[k]);
  B.points[q].position[k]=F(B.points[q].position[k]+F(-push[k]));
 }
 A.dirty=B.dirty=true;
}

/** One GLOBAL pass BEFORE all descending per-racer hull visits. Entries are
 * in source racer-index order, not human-player order. Proxy and center caches
 * stay frozen throughout all pairs; all overlaps respond, even when outgoing.
 * Returns at most96 ordered diagnostics for four craft. Never changes clocks,
 * fitted centers/bases, movement history or the proxy caches themselves.
 * Disabled calls consume nothing. The coordinator owns frame impact resets. */
export function applyNativeCraftContacts(entries,{enabled=true}={}){
 if(!Array.isArray(entries)||entries.length>4)throw new RangeError('Expected up to four craft entries in source-index order');
 if(typeof enabled!=='boolean')throw new TypeError('Craft contact enabled must be boolean');
 if(!enabled||entries.length===0)return EMPTY;
 const prepared=prepareEntries(entries),events=discoveries(prepared);
 for(const event of events){
  const A=prepared[event.racerA],B=prepared[event.racerB],n=event.normal;
  event.recordedA=recordNativeImpact(A.impacts,{channel:'racer',incomingNative:event.incomingNative,normal:n});
  event.recordedB=recordNativeImpact(B.impacts,{channel:'racer',incomingNative:event.incomingNative,
   normal:{x:F(-n.x),y:F(-n.y),z:F(-n.z)}});
  respond(A,B,event);
 }
 // Native work arrays retain F32 values across multiple contacts. Repeated
 // world->native conversions between overlaps would introduce scale rounding.
 for(const entry of prepared){
  if(entry.dirty){
   const {hull,points,data}=entry,s=data.scale;
   for(let i=0;i<12;i++){
    for(const k of axes)hull.points[i].position[k]=points[i].position[k]*s;
    if(entry.dirtyVelocities.has(i))for(const k of axes)hull.points[i].velocity[k]=points[i].velocity[k]*s/H;
   }
   // Convenience mean of point velocities, distinct from latched source
   // movement fields. Preserve motionVelocity/motionDirection and fitted pose.
   hull.velocity=Object.fromEntries(axes.map(k=>[k,hull.points.reduce((sum,p)=>sum+p.velocity[k],0)/12]));
  }
  entry.data.lastAppliedTick=entry.data.tick;
 }
 return Object.freeze({contacts:Object.freeze(events.map(e=>Object.freeze({...e,
  normal:freezeVector(e.normal),halfPushNative:freezeVector(e.halfPushNative)})))});
}

/** Read-only detached diagnostics; snapshots cannot be reset/refreshed/applied.
 * Revision tracks proxy seed/refresh, lastAppliedTick tracks global pass use. */
export function nativeCraftContactSnapshot(state){
 const data=owned(state);
 return Object.freeze({tick:data.tick,revision:data.revision,lastAppliedTick:data.lastAppliedTick,
  positionsNative:Object.freeze(data.positions.map(freezeVector)),deltasNative:Object.freeze(data.deltas.map(freezeVector))});
}
