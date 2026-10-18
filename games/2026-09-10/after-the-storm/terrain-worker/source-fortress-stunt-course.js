import {FORTRESS_STUNT_GEOMETRY as G} from './source-fortress-stunt-data.js?v=0de61eeb1bd1';
import {facetedSurface} from './faceted-surfaces.js?v=0de61eeb1bd1';
import {clippedVolume,clippedVolumes} from './clipped-volumes.js?v=0de61eeb1bd1';
import {shoreLines} from './shore-contact.js?v=0de61eeb1bd1';
import {sourceBoundarySpheres,orderSourceFixedSpheres} from './source-boundary-spheres.js?v=0de61eeb1bd1';
const S=.025,xyz=p=>p.map(v=>v*S);
const direction=heading=>{const a=(Math.trunc(heading*4096/360)&4095)*Math.PI*2/4096;return {tx:Math.sin(a),tz:Math.cos(a)};};

// Authored inspection route; source checkpoint admission remains independent.
export const fortressStuntNavigation={anchors:[
 [-89.275,21.825],[-100,-32],[-116,-48],[-116,-77],[-90,-99],[-69.275,-110.6],
 [-48,-100],[-50.9,-74.675],[-34.825,-57.6],[-12.25,-34.45],[18.65,-44.35],
 [66,-42],[89,-23],[96.775,-6.075],[88,16],[83.025,16.95],[55,19],
 [37.35,15.35],[35.675,48.675],[43.45,69.5],[37.475,106.325],[26.5,135.625],
 [8.65,157.725],[-24.7,172.4],[-41,181],[-44.4,191.025],[-54.575,187.225],
 [-79,177],[-87.625,146.1],[-91.275,121.75],[-83.775,96.7],[-89,58],[-89.275,21.825]
]};

/** Shared source-aligned Fortress terrain. Rock overhangs and
 * vertical faces are separate meshes: baking their tops into a heightfield
 * would fill the navigable water beneath them with false solid terrain. */
export function createSourceFortressTerrain(polygonDistance){
 if(typeof polygonDistance!=='function')throw new TypeError('Expected signed polygon distance');
 const scenerySurfaces=G.floors.map(q=>({id:q.id,kind:'rock',triangles:q.triangles.map(t=>t.map(xyz)),sourcePlaneIndices:[...q.indices]}));
 const staticSurfaces=G.floors.map(q=>{
  const indices=q.indices.filter((_,i)=>q.normals[i][1]>0),triangles=q.triangles.filter((_,i)=>q.normals[i][1]>0).map(t=>t.map(xyz));
  return facetedSurface(q.id,triangles,{kind:'rock',sourcePlaneIndices:indices});
 });
 const sourceFloor=(x,z)=>{let y=null;for(const q of staticSurfaces){const h=q.heightAt(x,z);if(h!==null&&(y===null||h>y))y=h;}return y;};
 const sourceShores=G.shores.map(q=>({id:q.id,outline:q.points.map(xyz),kind:'rock',sourceClosed:q.sourceClosed,
  waterInside:q.waterInside,sourceEdgeCount:q.indices.length,sourceLineIndices:[...q.indices],solidInteriorDefined:q.sourceClosed}));
 // Authored terrain caps finish the two long land silhouettes beside the
 // narrow gate. They are visual polygons only, never added to shore contacts.
 // The four closed rock outlines are deliberately NOT filled: their original
 // finite meshes include undercuts which a heightfield cannot represent.
 const authoredLandOutlines=[
  [...sourceShores[0].outline,[21.375,-.975],[21.375,9.025]],
  [...sourceShores[1].outline,[21.375,24.025]]
 ];
 const renderGround=(x,z)=>{let y=-8;for(const outline of authoredLandOutlines){const distance=polygonDistance(outline,x,z);if(distance<=0)y=Math.max(y,.4+Math.min(2,-distance*.3));}return y;};
 const ground=(x,z)=>Math.max(renderGround(x,z),sourceFloor(x,z)??-8);
 return {sourceShores,shoreContacts:shoreLines(sourceShores),staticSurfaces,scenerySurfaces,sourceFloor,ground,landGround:renderGround,renderGround,
  authoredLandOutlines,authoredBackground:{seabedHeight:-8,status:'Authored terrain caps beside the gate; source rock overhangs remain separate meshes, with no added collision edges.'}};
}
export function createSourceFortressStuntCourse(polygonDistance){
 const terrain=createSourceFortressTerrain(polygonDistance);
 const boundaryMarkers=G.markers.map(xyz),markers=sourceBoundarySpheres(boundaryMarkers,{idPrefix:'fortress-marker-'});
 const hidden=G.hidden.map(([x,y,z],i)=>({id:'fortress-hidden-'+i,x:x*S,y:y*S,z:z*S,r:.625,probeRadius:.3,
  sourceIndex:i,runtimeTag:5,type:'rock',hidden:true,fixed:true,fixedSphere:true,floating:false,absoluteY:true}));
 const hazards=()=>orderSourceFixedSpheres([],markers,hidden);
 const volumes=G.planes.map((p,i)=>clippedVolume({id:'fortress-stunt-solid-'+i,origin:xyz(p.slice(0,3)),
  axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:xyz(p.slice(12,15)),flag:p[15]}));
 const ramps=G.ramps.map((q,i)=>{
  const id='fortress-stunt-ramp-'+i,contactVolumes=volumes.slice(q.planeStart,q.planeStart+q.planeCount).map(v=>({...v,kind:'ramp',rampId:id}));
  const vertices=contactVolumes.flatMap(v=>v.vertices),[x,y,z]=xyz(q.position),[tx,tz]=q.forward;
  const along=vertices.map(p=>(p[0]-x)*tx+(p[2]-z)*tz),across=vertices.map(p=>(p[0]-x)*tz-(p[2]-z)*tx);
  return {id,name:'FORT JUMP '+(i+1),x,y,z,tx,tz,sourceIndex:q.index,sourceCourseIndex:3,sourceVolumeProfile:true,
   sourceFamily:'stunt',sourceNativeClass:2,fixed:true,floating:false,absoluteY:true,
   width:Math.max(...across)-Math.min(...across),length:Math.max(...along)-Math.min(...along),height:Math.max(...vertices.map(p=>p[1])),contactVolumes};
 });
 const sourceSolidObjects=G.objects.filter(q=>[2,6,7].includes(q.kind)).map(q=>{
  const [x,y,z]=xyz(q.position);return {id:'fortress-object-'+q.index,sourceIndex:q.index,runtimeKind:q.kind,x,y,z,
   contactVolumes:volumes.slice(q.planeStart,q.planeStart+q.planeCount).map(v=>({...v,kind:q.kind===2?'gate':'timber',sourceObjectIndex:q.index}))};
 });
 const sourceDynamicObjects=G.objects.filter(q=>q.kind===5).map(q=>{const [x,y,z]=xyz(q.position);return {id:'fortress-object-'+q.index,sourceIndex:q.index,runtimeKind:5,x,y,z,radius:1.25};});
 const contactVolumesForRamps=selected=>clippedVolumes([...selected.flatMap(r=>r.contactVolumes),...sourceSolidObjects.flatMap(q=>q.contactVolumes)]);
 const rings=G.rings.map(([x,y,z,variant,order,heading],i)=>({x:x*S,y:y*S,z:z*S,...direction(heading),sourceIndex:i,variant,order,
  type:'water',radius:2.8,depth:.8,probeHeight:.2,floating:false,absoluteY:true}));
 const gates=G.gates.map(q=>({...q})),checkpoints=[...gates.slice(1),gates[0]].map((q,i)=>({...q,section:i,limit:G.checkpointSeconds[i]}));
 const anchors=fortressStuntNavigation.anchors.map(p=>[...p]);
 return {name:'Marine Fortress',theme:'fortress',tag:'03 / FORTRESS LAKE',layoutRevision:1,
  description:'Source-aligned fortress Stunt layout with fifteen rings and live physical obstacles.',
  sourceMetadata:{nativeCourseIndex:3,referenceRevision:'USA Rev1',nativeScale:S,sourceCollisionPlaneCount:78,sourceShoreSegmentCount:92,sourceStuntNativeClass:2},
  anchors,routeInterpolation:'linear',navigationDriver:'source-layout',stuntLayout:{anchors,routeInterpolation:'linear',driver:'source-layout',
   startGate:{...gates[0]},rocks:hazards(),ramps,rings,checkpoints,sourceNativeClass:2},
  ...terrain,
  sourceObjectSelection:{singlePlayerIncludesStunt:true,stuntFixedSphereCount:112,stuntNativeClass:2},
  hazardsForPlayers:players=>{if(players!==1)throw new RangeError('Fortress native Stunt scene is solo');return hazards();},
  boundaryMarkers,sourceMarkerSpheres:markers,sourceSolidObjects,sourceDynamicObjects,contactVolumesForRamps,
  dynamicObjectsForPlayers:()=>[],sourceDynamicsReady:true,
  boundaryMetadata:{sourceOrderIsPolygon:false,sourceMarkerSetClosed:false},resistance:[],raceRamps:[]};
}
