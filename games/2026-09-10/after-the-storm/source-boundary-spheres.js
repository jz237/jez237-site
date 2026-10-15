// Independent source marker/fixed-sphere mechanics. Marker artwork remains a
// separate course concern. These colliders are spheres, not a course-out wall.
// Positions and radii use world units. The conditional point-velocity mapping
// is native displacement *scale/.01 seconds; caller owns the five-step clock.
// This clean double-precision reconstruction does not claim native bit identity.
export const SOURCE_FIXED_SPHERE_POINT_STEP=.01;
const POINT=SOURCE_FIXED_SPHERE_POINT_STEP,AXES=['x','y','z'],GROUPS=[[4,5,3],[11,10,9]];
const copy=p=>({x:p.x,y:p.y,z:p.z});
function finite(value,name){if(!Number.isFinite(value))throw new TypeError(name+' must be finite');return value;}
function vector(p,name){if(!p||!AXES.every(k=>Number.isFinite(p[k])))throw new TypeError(name+' must have finite x, y and z');return p;}
function positiveScale(scale){finite(scale,'scale');if(scale<=0)throw new RangeError('scale must be positive');return scale;}

/** markerWorldXZ is the actual marker list, with no inferred closing segment. */
export function sourceBoundarySpheres(markerWorldXZ,{idPrefix='source-marker-',waterDatum=0,tideFollowing=false,scale=.025}={}){
 positiveScale(scale);finite(waterDatum,'waterDatum');
 if(typeof tideFollowing!=='boolean'||typeof idPrefix!=='string'||!idPrefix)throw new TypeError('Invalid marker options');
 if(!Array.isArray(markerWorldXZ)||markerWorldXZ.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)))throw new TypeError('Expected finite world XZ marker rows');
 return markerWorldXZ.map(([x,z],sourceIndex)=>({id:idPrefix+sourceIndex,x,y:tideFollowing?waterDatum:0,z,r:25*scale,probeRadius:12*scale,
  sourceIndex,runtimeTag:1,sourceBoundaryMarker:true,sourceFixedSphere:true,sourceSphereFamily:'marker',
  type:'boundary',hidden:true,fixed:true,fixedSphere:true,floating:false,absoluteY:!tideFollowing,followsWaterDatum:tideFollowing,
  sourceRenderClassification:'boundary-marker-artwork-rendered-separately'}));
}

/** Preserve source list priority and duplicate centers across distinct families. */
export function orderSourceFixedSpheres(visible=[],markers=[],hidden=[]){
 const result=[];
 for(const [rows,family]of [[visible,'generic-xz'],[markers,'marker'],[hidden,'hidden-xyz']]){
  if(!Array.isArray(rows))throw new TypeError('Fixed sphere families must be arrays');
  for(const q of rows){
   if(!q||typeof q!=='object')throw new TypeError('Invalid fixed sphere');
   result.push({...q,sourceFixedSphere:true,sourceSphereFamily:family,sourceColliderIndex:result.length});
  }
 }
 return result;
}

function sphereValid(q,scale){
 vector(q,'sphere');const radius=q.r??q.radius;
 if(q.breakable||q.fixed===false||!Number.isFinite(radius)||Math.abs(radius/scale-25)>1e-8)throw new RangeError('Expected a fixed radius-25 native sphere');
 return radius;
}

/**
 * Static XZ grid for the COMPLETE visible→marker→hidden sphere list. The source
 * expands bounds/cell admissions by25 native, appends candidates ascending,
 * and caps all cell-list storage at511 entries. Y can follow a course datum;
 * changing XZ requires rebuilding this grid. Breakables/dynamic objects belong
 * to separate source collision phases and must not enter this fixed grid.
 */
export function createSourceFixedSphereGrid(orderedSpheres,{scale=.025}={}){
 positiveScale(scale);
 if(!Array.isArray(orderedSpheres)||orderedSpheres.length>256)throw new RangeError('Expected at most256 fixed spheres');
 orderedSpheres.forEach(q=>sphereValid(q,scale));
 const spheres=Object.freeze([...orderedSpheres]),snapshot=spheres.map(q=>[q.x,q.z]),cells=Array.from({length:16},()=>[]),pad=25*scale;
 const min=spheres.length?[Math.min(...spheres.map(q=>q.x))-pad,Math.min(...spheres.map(q=>q.z))-pad]:[0,0];
 const max=spheres.length?[Math.max(...spheres.map(q=>q.x))+pad,Math.max(...spheres.map(q=>q.z))+pad]:[0,0];
 const size=[max[0]-min[0],max[1]-min[1]],cell=[size[0]/4,size[1]/4];let entries=0,truncated=false;
 if(spheres.length)for(let x=0;x<4;x++)for(let z=0;z<4;z++){
  const lowX=min[0]+x*cell[0],lowZ=min[1]+z*cell[1];
  spheres.forEach((q,i)=>{if(lowX-pad<=q.x&&q.x<=lowX+cell[0]+pad&&lowZ-pad<=q.z&&q.z<=lowZ+cell[1]+pad){
   if(entries<511){cells[x*4+z].push(i);entries++;}else truncated=true;
  }});
 }
 cells.forEach(Object.freeze);Object.freeze(cells);
 return Object.freeze({spheres,scale,min:Object.freeze(min),size:Object.freeze(size),cells,entries,truncated,
  query(x,z){
   finite(x,'query x');finite(z,'query z');
   if(!spheres.length)return [];
   if(spheres.some((q,i)=>q.x!==snapshot[i][0]||q.z!==snapshot[i][1]))throw new Error('Fixed sphere XZ changed; rebuild its source grid');
   // The observed C conversion truncates toward zero, including just below
   // the minimum. An additional polygon or floor test would alter that rule.
   const ix=Math.trunc((x-min[0])/size[0]*4),iz=Math.trunc((z-min[1])/size[1]*4);
   return ix>=0&&ix<4&&iz>=0&&iz<4?cells[ix*4+iz]:[];
  }});
}

/** Pure full-penetration contact, without sphere movement or an approach gate. */
export function sourceFixedSphereContact(sphere,probe,{scale=.025}={}){
 positiveScale(scale);const radius=sphereValid(sphere,scale);vector(probe,'probe');
 const dx=probe.x-sphere.x,dy=probe.y-sphere.y,dz=probe.z-sphere.z,extent=radius+12*scale,distance=Math.hypot(dx,dy,dz);
 if(distance>=extent)return null;
 if(distance===0)return {status:'coincident-center',id:sphere.id,unresolved:true,penetration:extent,probe:copy(probe)};
 const normal={x:dx/distance,y:dy/distance,z:dz/distance},penetration=extent-distance;
 const translation={x:normal.x*penetration,y:normal.y*penetration,z:normal.z*penetration};
 return {status:'contact',id:sphere.id,normal,penetration,penetrationNative:penetration/scale,probe:copy(probe),translation,
  pointDeltaVelocity:{x:translation.x/POINT,y:translation.y/POINT,z:translation.z/POINT}};
}

/**
 * Exact fixed-sphere phase for a prepared twelve-point hull. Query once using
 * its latched center, then visit candidate IDs descending for each latched
 * front(+27)/rear(−9) probe. Stop at the first overlap for each. The source
 * does not move spheres, remove inward velocity, fit a new center/frame, or
 * rebuild probes here. It adds penetration to all12 point XYZ and to THREE
 * point velocities, even when those velocities are separating.
 *
 * impactState is the caller-owned per-logical-frame C3c accumulator:
 * {maximum: worldSpeed, normal: vector|null}. Retain it over five substeps and
 * reset at frame preparation. The source compares each main point's incoming
 * normal speed before that contact's velocity increment. Progress is untouched.
 */
export function collideSourceFixedSpheres(grid,hull,{probes,impactState={maximum:0,normal:null}}={}){
 if(!grid||typeof grid.query!=='function'||!Array.isArray(grid.spheres))throw new TypeError('Expected a source fixed-sphere grid');
 if(!hull||hull.scale!==grid.scale||!Array.isArray(hull.points)||hull.points.length!==12)throw new TypeError('Expected a twelve-point hull with matching scale');
 hull.points.forEach(p=>{vector(p.position,'point position');vector(p.velocity,'point velocity');});
 const center=vector(hull.center,'hull center'),scale=grid.scale;
 if(!impactState||!Number.isFinite(impactState.maximum)||impactState.maximum<0)throw new TypeError('Impact maximum must be finite and nonnegative');
 let snapshot;
 if(probes!==undefined){
  if(!Array.isArray(probes)||probes.length!==2)throw new TypeError('Expected two latched probes');snapshot=probes.map(p=>copy(vector(p,'probe')));
 }else{
  const up=vector(hull.frame?.up,'hull up'),forward=vector(hull.frame?.forward,'hull forward');
  snapshot=[27,-9].map(z=>({x:center.x+scale*(2*up.x+z*forward.x),y:center.y+scale*(2*up.y+z*forward.y),z:center.z+scale*(2*up.z+z*forward.z)}));
 }
 const candidates=grid.query(center.x,center.z),contacts=[],unresolved=[];
 for(let probeIndex=0;probeIndex<2;probeIndex++)for(let j=candidates.length-1;j>=0;j--){
  const sourceColliderIndex=candidates[j],hit=sourceFixedSphereContact(grid.spheres[sourceColliderIndex],snapshot[probeIndex],{scale});if(!hit)continue;
  if(hit.unresolved){unresolved.push({...hit,sourceColliderIndex,probeIndex});break;}
  const indices=GROUPS[probeIndex],main=hull.points[indices[0]].velocity,normalSpeed=finite(-(main.x*hit.normal.x+main.y*hit.normal.y+main.z*hit.normal.z),'normal speed');
  const updates=hull.points.map(p=>({position:copy(p.position),velocity:copy(p.velocity)}));
  for(const axis of AXES){for(const q of updates)q.position[axis]+=hit.translation[axis];for(const i of indices)updates[i].velocity[axis]+=hit.pointDeltaVelocity[axis];}
  updates.forEach(q=>{vector(q.position,'corrected position');vector(q.velocity,'corrected velocity');});
  if(normalSpeed>impactState.maximum){impactState.maximum=normalSpeed;impactState.normal=copy(hit.normal);}
  updates.forEach((q,i)=>{Object.assign(hull.points[i].position,q.position);Object.assign(hull.points[i].velocity,q.velocity);});
  contacts.push({...hit,sourceColliderIndex,probeIndex,pointIndices:[...indices],normalSpeed,normalSpeedNative:normalSpeed*POINT/scale});break;
 }
 return {contacts,unresolved,impactState};
}
