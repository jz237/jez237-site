// Independent numeric reconstruction of primary-route buoy mechanics. This is
// separate from route admission, generic fixed spheres and generic floaters.
// It contains no original executable, artwork, model or animation data.
//
// Object state uses native units and binary32 stores. Hull state uses world
// positions and world units/second. A point-velocity increment is native
// displacement *scale/.01; an OBJECT velocity is displacement per .05 seconds.
// The caller owns the five hull ticks, shared rider order, water update, judge,
// pause/main-state guard, and one subsequent buoy-motion call per logical frame.

export const SOURCE_PRIMARY_BUOY_POINT_STEP=.01;
export const SOURCE_PRIMARY_BUOY_MOTION_STEP=.05;
const F=Math.fround,H=SOURCE_PRIMARY_BUOY_POINT_STEP,T=SOURCE_PRIMARY_BUOY_MOTION_STEP;
const AXES=['x','y','z'],GROUPS=[[4,5,3],[11,10,9]],CRAFT_SHARE=F(.3);
const owners=new WeakSet();
const vector=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vector(p.x,p.y,p.z);
const times=(p,s)=>vector(p.x*s,p.y*s,p.z*s);

function finite(n,name){if(!Number.isFinite(n)||!Number.isFinite(F(n)))throw new TypeError(name+' must be finite binary32');return F(n);}
function vec(p,name){if(!p||!AXES.every(k=>Number.isFinite(p[k])))throw new TypeError(name+' must have finite x, y and z');return p;}
function nativeVec(p,name){vec(p,name);return vector(...AXES.map(k=>finite(p[k],name+'.'+k)));}
function flag(v,name){if(typeof v!=='boolean')throw new TypeError(name+' must be boolean');return v;}
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid '+name);return v;}
function checked(state){
 if(!owners.has(state))throw new TypeError('Expected a primary buoy state');
 for(const n of state.nodes){
  nativeVec(n.positionNative,'buoy position');nativeVec(n.velocityNative,'buoy velocity');
  finite(n.anchorNative?.x,'anchor x');finite(n.anchorNative?.z,'anchor z');
  if(!Array.isArray(n.endpointsNative)||n.endpointsNative.length!==2)throw new TypeError('Expected two fixed endpoints');
  n.endpointsNative.forEach(p=>nativeVec(p,'fixed endpoint'));
  flag(n.fixed,'fixed');flag(n.physicsEnabled,'physicsEnabled');flag(n.renderEnabled,'renderEnabled');
  integer(n.classification,'classification',0,14);
 }
 return state;
}

/**
 * Initialize from createSourceBuoyLayout metadata. Nodes retain source ARRAY
 * order; sourceRow is identity rather than a sort key. enabled initializes two
 * separate mutable flags: physicsEnabled (contact/motion) and renderEnabled
 * (the source route/render admission flag). Later changes must be explicit.
 *
 * Dynamic center starts at authored X/Z with Y=0 and zero velocity. An original
 * countdown/water history is not synthesized. Existing exact source axes may
 * be injected into the layout; its heading/sine fallback is not bit exact.
 */
export function createSourcePrimaryBuoys(layout){
 if(!layout||!Number.isFinite(layout.scale)||layout.scale<=0||!Array.isArray(layout.nodes)||layout.nodes.length>64)
  throw new TypeError('Expected a source buoy layout with at most 64 primary nodes');
 const scale=layout.scale,courseIndex=integer(layout.courseIndex,'courseIndex',0,9),seen=new Set();
 const nodes=layout.nodes.map((n,sourceIndex)=>{
  const sourceRow=integer(n.sourceRow,'sourceRow',0,65535);
  if(seen.has(sourceRow))throw new RangeError('Duplicate sourceRow');seen.add(sourceRow);
  const x=finite(n.x/scale,'node x'),z=finite(n.z/scale,'node z'),tx=finite(n.tx,'node tx'),tz=finite(n.tz,'node tz');
  if(Math.abs(tx*tx+tz*tz-1)>.002)throw new RangeError('Expected unit source axes');
  const classification=integer(n.classification,'classification',0,14),fixed=flag(n.checkpoint,'checkpoint');
  const enabled=flag(n.enabled,'enabled'),half=finite(n.halfWidthNative,'halfWidthNative');
  if(half<0)throw new RangeError('Negative half width');
  const dx=F(tz*half),dz=F(-tx*half),southernFinish=courseIndex===7&&sourceRow===layout.finishSourceRow;
  return {sourceIndex,sourceRow,classification,fixed,physicsEnabled:enabled,renderEnabled:enabled,
   positionNative:vector(x,0,z),velocityNative:vector(),anchorNative:{x,z},
   endpointsNative:[vector(F(x+dx),southernFinish?-110:0,F(z+dz)),vector(F(x-dx),southernFinish?-160:0,F(z-dz))]};
 });
 const state={scale,courseIndex,nodes:Object.freeze(nodes),motionFrames:0,
  diagnostics:Object.freeze({candidateOrder:'descending primary array; endpoint 1 then 2',candidateGrid:false,
   arithmetic:'binary32 native stores; host sqrt rounded to binary32',
   initialHistory:'authored center Y0 and velocity0; countdown/water/activation history supplied by caller',
   coincidentCenter:'unresolved; no fabricated normal',fullNativeRuntime:false})};
 owners.add(state);return state;
}

function geometry(n,probe){
 if(!n.fixed&&!n.physicsEnabled)return null;
 const radius=n.fixed&&n.classification===3?92:62,centers=n.fixed?n.endpointsNative:[n.positionNative];
 for(let endpoint=0;endpoint<centers.length;endpoint++){
  const c=centers[endpoint],d=vector(F(probe.x-c.x),F(probe.y-c.y),F(probe.z-c.z));
  const horizontal=F(F(d.x*d.x)+F(d.z*d.z)),squared=F(horizontal+F(d.y*d.y));
  if((n.fixed?horizontal>=radius*radius:horizontal>radius*radius)||squared>=radius*radius)continue;
  if(squared===0)return {status:'coincident-center',unresolved:true,endpoint:n.fixed?endpoint:null,radiusNative:radius};
  const distance=F(Math.sqrt(squared)),inverse=F(1/distance),normal=vector(...AXES.map(k=>F(d[k]*inverse)));
  const penetrationNative=F(radius-distance),craftDepthNative=n.fixed?penetrationNative:F(penetrationNative*CRAFT_SHARE);
  const translationNative=vector(...AXES.map(k=>F(craftDepthNative*normal[k])));
  const buoyDepth=n.fixed?0:F(penetrationNative-craftDepthNative);
  const buoyTranslationNative=vector(...AXES.map(k=>F(-F(buoyDepth*normal[k]))));
  return {status:'contact',endpoint:n.fixed?endpoint:null,radiusNative:radius,normal,penetrationNative,craftDepthNative,translationNative,buoyTranslationNative};
 }
 return null;
}

function probesFor(hull,probes,scale){
 if(probes!==undefined){
  if(!Array.isArray(probes)||probes.length!==2)throw new TypeError('Expected two latched world probes');
  return probes.map(p=>nativeVec(times(vec(p,'probe'),1/scale),'probe native'));
 }
 const c=vec(hull.center,'latched hull center'),u=nativeVec(hull.frame?.up,'latched up'),f=nativeVec(hull.frame?.forward,'latched forward');
 // This only reads the cached frame/center. It never fits them from translated
 // points, including after an earlier shore/floor/box phase common nudge.
 const center=nativeVec(times(c,1/scale),'center native');
 return [27,-9].map(z=>vector(...AXES.map(k=>F(F(z*f[k])+F(center[k]+F(u[k]+u[k]))))));
}

/**
 * One primary-buoy contact phase, after boxes and before generic fixed spheres.
 * Both probes are latched before either response. Every probe scans descending
 * primary array indices and stops at its first overlap. Only THREE velocities
 * change, while ALL twelve point positions receive the common translation.
 * It does not rebuild center/frame/probes or apply an inward-only projection.
 *
 * Optional context.probes are WORLD positions. Optional recordImpact receives
 * {channel:'primaryBuoy'|'fixedSphere',incomingNative,normal}. It owns each
 * family's frame maximum/shared normal; reset it at frame preparation, not here.
 */
export function collideSourcePrimaryBuoys(state,hull,context={}){
 checked(state);const {scale,nodes}=state;
 if(!hull||hull.scale!==scale||!Array.isArray(hull.points)||hull.points.length!==12)throw new TypeError('Expected a twelve-point hull at the buoy scale');
 hull.points.forEach(p=>{vec(p.position,'point position');vec(p.velocity,'point velocity');});
 if(context.recordImpact!==undefined&&typeof context.recordImpact!=='function')throw new TypeError('recordImpact must be a function');
 const probes=probesFor(hull,context.probes,scale),contacts=[],unresolved=[];
 for(let probeIndex=0;probeIndex<2;probeIndex++)for(let j=nodes.length-1;j>=0;j--){
  const node=nodes[j],hit=geometry(node,probes[probeIndex]);if(!hit)continue;
  const identity={sourceIndex:j,sourceRow:node.sourceRow,classification:node.classification,fixed:node.fixed,probeIndex,
   probe:times(probes[probeIndex],scale),probeNative:copy(probes[probeIndex])};
  if(hit.unresolved){unresolved.push({...identity,...hit});break;}
  const indices=GROUPS[probeIndex],main=nativeVec(times(hull.points[indices[0]].velocity,H/scale),'main native velocity'),n=hit.normal;
  const incomingNative=F(F(F(-n.x*main.x)-F(n.y*main.y))-F(n.z*main.z));
  const updated=hull.points.map((p,i)=>({position:vector(...AXES.map(k=>finite(F(p.position[k]/scale)+hit.translationNative[k],'corrected position')*scale)),
   velocity:indices.includes(i)?vector(...AXES.map(k=>finite(F(p.velocity[k]*H/scale)+hit.translationNative[k],'corrected velocity')*scale/H)):copy(p.velocity)}));
  let buoyPosition,buoyVelocity;
  if(!node.fixed){
   buoyPosition=vector(...AXES.map(k=>finite(node.positionNative[k]+hit.buoyTranslationNative[k],'buoy recoil position')));
   buoyVelocity=vector(...AXES.map(k=>finite(node.velocityNative[k]+hit.buoyTranslationNative[k],'buoy recoil velocity')));
  }
  const channel=node.fixed?'fixedSphere':'primaryBuoy';
  if(context.recordImpact)context.recordImpact({channel,incomingNative,normal:copy(n)});
  updated.forEach((p,i)=>{Object.assign(hull.points[i].position,p.position);Object.assign(hull.points[i].velocity,p.velocity);});
  if(!node.fixed){Object.assign(node.positionNative,buoyPosition);Object.assign(node.velocityNative,buoyVelocity);}
  contacts.push({...identity,...hit,channel,incomingNative,pointIndices:[...indices],translation:times(hit.translationNative,scale)});break;
 }
 return {contacts,unresolved};
}

/**
 * Exactly one caller-scheduled 50ms primary motion pass, AFTER water update and
 * adjudication. queryNative(oldX,oldZ) must return the source normalized plane
 * query INCLUDING datum, e.g queryNativeWaterField(...).sourcePlaneQueryNative.
 * renderHeightNative or a generic surface height is a different quantity.
 * The retained .9/.01/.3 coefficients operate in JS doubles before F32 stores.
 */
export function stepSourcePrimaryBuoys(state,{queryNative}={}){
 checked(state);if(typeof queryNative!=='function')throw new TypeError('Expected queryNative(xNative,zNative)');
 const updatedSourceRows=[];
 for(const n of state.nodes){
  if(n.fixed||!n.physicsEnabled)continue;
  const p=n.positionNative,v=n.velocityNative,a=n.anchorNative;
  const vx=finite(.9*v.x+.01*F(a.x-p.x),'motion vx'),vz=finite(.9*v.z+.01*F(a.z-p.z),'motion vz');
  let vy=finite(.9*v.y-3,'motion vy');
  const water=finite(queryNative(p.x,p.z),'source plane query'),d=F(F(water+40)-p.y);
  if(d>0)vy=finite(vy+.3*Math.min(d,30),'buoyant vy');
  const next=vector(finite(p.x+vx,'motion x'),finite(p.y+vy,'motion y'),finite(p.z+vz,'motion z'));
  Object.assign(v,vector(vx,vy,vz));Object.assign(p,next);updatedSourceRows.push(n.sourceRow);
 }
 state.motionFrames++;return {motionFrame:state.motionFrames,updatedSourceRows};
}

/** Copied WORLD presentation/admission state; never substitute the anchor for
 * the moving position. velocityNative remains displacement per50ms, while the
 * additional velocity is world units/second. Neither call advances simulation.
 */
export function snapshotSourcePrimaryBuoys(state){
 checked(state);return state.nodes.map(n=>({sourceIndex:n.sourceIndex,sourceRow:n.sourceRow,classification:n.classification,
  physicsEnabled:n.physicsEnabled,renderEnabled:n.renderEnabled,fixed:n.fixed,position:times(n.positionNative,state.scale),
  endpoints:n.endpointsNative.map(p=>times(p,state.scale)),anchor:{x:n.anchorNative.x*state.scale,z:n.anchorNative.z*state.scale},
  velocityNative:copy(n.velocityNative),velocity:times(n.velocityNative,state.scale/T)}));
}
