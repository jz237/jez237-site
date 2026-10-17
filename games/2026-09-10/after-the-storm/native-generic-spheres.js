// Original generic sphere phase: runtime9 floating objects and runtime10 ice.
// This numeric kernel uses native coordinates, binary32 stores and native
// point displacement per10ms. It does not advance water, objects or clocks.
// The owner supplies the two already-latched probes and the frame's C50 state.
const F=Math.fround,groups=[[4,5,3],[11,10,9]],owners=new WeakSet();
const copy=v=>[...v];
function scalar(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(name+' must be finite binary32');return F(v);}
function vector(v,name){if(!Array.isArray(v)||v.length!==3)throw new TypeError(name+' requires XYZ');return v.map(n=>scalar(n,name));}
function owned(state){if(!owners.has(state))throw new TypeError('Expected native generic sphere state');}

export function createNativeGenericSpheres(definitions){
 if(!Array.isArray(definitions))throw new TypeError('Expected selected generic definitions');
 const nodes=definitions.map(q=>{
  if(!q||![9,10].includes(q.kind))throw new RangeError('Only verified runtime kinds9 and10 are supported');
  const radius=scalar(q.radius??(q.kind===10?50:25),'radius');
  if(radius!==(q.kind===10?50:25))throw new RangeError('Unsupported source sphere radius');
  if(q.broken!==undefined&&typeof q.broken!=='boolean')throw new TypeError('broken must be boolean');
  return {kind:q.kind,position:vector(q.position,'position'),velocity:vector(q.velocity??[0,0,0],'velocity'),radius,broken:q.broken??false};
 });
 const state={nodes:Object.freeze(nodes)};owners.add(state);return state;
}

/** One/two probes in original front/rear order; passing one probes the front
 * leaf only. Both positions remain latched despite common hull translations.
 * impact={maximum,normal,hitKind} belongs to the racer and persists across its
 * five substeps. stabilityNative is prepared body16a0, including actor scaling.
 * Returned fragment events describe the original effect call's six floats;
 * they do not claim to reproduce the fragment pool or its random evolution. */
export function collideNativeGenericSpheres(state,hull,{probesNative,stabilityNative,impact}={}){
 owned(state);
 if(!hull||!Array.isArray(hull.positions)||!Array.isArray(hull.velocities)||hull.positions.length!==12||hull.velocities.length!==12)throw new TypeError('Expected twelve native hull points');
 const positions=hull.positions.map(p=>vector(p,'point position')),velocities=hull.velocities.map(p=>vector(p,'point velocity'));
 if(!Array.isArray(probesNative)||probesNative.length<1||probesNative.length>2)throw new TypeError('Expected one or two latched probes');
 const probes=probesNative.map(p=>vector(p,'probe')),stability=scalar(stabilityNative,'prepared stability');
 if(stability<0||!impact||scalar(impact.maximum,'impact maximum')<0||!Number.isInteger(impact.hitKind))throw new TypeError('Expected prepared stability and retained frame impact');
 vector(impact.normal,'impact normal');
 hull.positions=positions;hull.velocities=velocities;impact.maximum=F(impact.maximum);
 const contacts=[],unresolved=[],fragmentEvents=[];
 for(let probeIndex=0;probeIndex<probes.length;probeIndex++)for(let index=state.nodes.length-1;index>=0;index--){
  const n=state.nodes[index];if(n.kind===10&&n.broken)continue;
  const delta=probes[probeIndex].map((v,k)=>F(v-n.position[k])),radius=F(n.radius+12),radius2=F(radius*radius);
  const horizontal=F(F(delta[0]*delta[0])+F(delta[2]*delta[2])),squared=F(horizontal+F(delta[1]*delta[1]));
  if(horizontal>radius2||squared>=radius2)continue;
  if(squared===0){unresolved.push({index,probeIndex,reason:'coincident-center'});break;}
  const distance=F(Math.sqrt(squared)),inverse=F(1/distance),normal=delta.map(v=>F(v*inverse));
  const depth=F(radius-distance),craftDepth=n.kind===10?depth:F(depth*F(.3)),translation=normal.map(v=>F(v*craftDepth));
  if(n.kind===9){
   const remainder=F(depth-craftDepth),recoil=normal.map(v=>F(remainder*v));
   n.position=n.position.map((v,k)=>F(v-recoil[k]));n.velocity=n.velocity.map((v,k)=>F(v-recoil[k]));
  }
  impact.hitKind=n.kind===10?1:0;
  const indices=groups[probeIndex],velocity=hull.velocities[indices[0]],incoming=F(F(F(-normal[0]*velocity[0])-F(normal[1]*velocity[1]))-F(normal[2]*velocity[2]));
  let broke=false;
  if(impact.maximum<incoming){
   if(n.kind===10&&F(stability*.5)<=incoming){
    impact.hitKind=2;n.broken=true;broke=true;
    fragmentEvents.push({position:copy(n.position),velocity:copy(velocity)});
   }
   impact.maximum=incoming;impact.normal=copy(normal);
  }
  for(const i of indices)hull.velocities[i]=hull.velocities[i].map((v,k)=>F(v+translation[k]));
  hull.positions=hull.positions.map(p=>p.map((v,k)=>F(v+translation[k])));
  contacts.push({index,probeIndex,kind:n.kind,normal,incoming,translation,depth,broke});break;
 }
 return {contacts,unresolved,fragmentEvents};
}

export function snapshotNativeGenericSpheres(state){owned(state);return state.nodes.map(n=>({...n,position:copy(n.position),velocity:copy(n.velocity)}));}
