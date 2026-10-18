import {DOLPHIN_STUNT_GEOMETRY as G} from './source-dolphin-stunt-data.js?v=6fdabd848c37';
import {facetedSurface} from './faceted-surfaces.js?v=6fdabd848c37';
import {clippedVolume,clippedVolumes} from './clipped-volumes.js?v=6fdabd848c37';
import {shoreLines} from './shore-contact.js?v=6fdabd848c37';
import {sourceBoundarySpheres,orderSourceFixedSpheres} from './source-boundary-spheres.js?v=6fdabd848c37';
const S=.025,xyz=p=>p.map(v=>v*S);
const direction=heading=>{const a=(Math.trunc(heading*4096/360)&4095)*Math.PI*2/4096;return {tx:Math.sin(a),tz:Math.cos(a)};};

// Authored inspection steering, not source AI or checkpoint admission rules.
export const dolphinStuntNavigation={anchors:[
 [-45,85],[-2.975,69.025],[28.325,58.7],[52.375,51],[91.75,36.95],
 [115,30],[131.625,17.2],[143.75,-4.575],[143.625,-33.15],[129.075,-60.95],
 [115,-86],[107.7,-106.25],[85,-123],[62.5,-123.8],[2.3,-123.8],[-60.175,-123.8],
 [-90,-116],[-103.075,-93.1],[-125.925,-58.1],[-151.65,-22.025],
 [-151.625,16.6],[-142,48],[-119.275,80.675],[-94,89],[-72.9,90.35],[-50,85]
]};

/** Solo native Stunt display. Native support retains original float32 floor,
 * shore and fixed-sphere owners; these surfaces only align detailed scenery.
 * Heights inside closed shore outlines are authored tropical scenery, since
 * the height-independent shoreline records do not establish mountain heights.
 */
export function createSourceDolphinStuntCourse(polygonDistance){
 if(typeof polygonDistance!=='function')throw new TypeError('Expected signed polygon distance');
 const staticSurfaces=G.floors.map(q=>facetedSurface(q.id,q.triangles.map(t=>t.map(xyz)),{kind:'sand',sourcePlaneIndices:[...q.indices]}));
 const sourceFloor=(x,z)=>{let y=null;for(const q of staticSurfaces){const h=q.heightAt(x,z);if(h!==null&&(y===null||h>y))y=h;}return y;};
 const sourceShores=G.shores.map(q=>({id:q.id,outline:q.points.map(xyz),kind:'sand',sourceClosed:q.sourceClosed,
  waterInside:q.waterInside,sourceEdgeCount:q.indices.length,sourceLineIndices:[...q.indices],solidInteriorDefined:q.sourceClosed}));
 const ground=(x,z)=>Math.max(-8,sourceFloor(x,z)??-8);
 const renderGround=(x,z)=>{let y=ground(x,z);for(const q of sourceShores)if(q.sourceClosed&&!q.waterInside){const distance=polygonDistance(q.outline,x,z);if(distance<=0)y=Math.max(y,.55+Math.min(5,-distance*.4));}return y;};
 const boundaryMarkers=G.markers.map(xyz),markers=sourceBoundarySpheres(boundaryMarkers,{idPrefix:'dolphin-marker-'});
 const visible=G.fixed.map(([x,z,tag],i)=>({id:'dolphin-fixed-'+i,x:x*S,y:0,z:z*S,r:.625,probeRadius:.3,
  sourceIndex:i,runtimeTag:tag,type:tag===4?'post':'ball',hidden:tag===0,fixed:true,fixedSphere:true,floating:false,absoluteY:true}));
 const hidden=G.hidden.map(([x,y,z],i)=>({id:'dolphin-hidden-'+i,x:x*S,y:y*S,z:z*S,r:.625,probeRadius:.3,
  sourceIndex:i,runtimeTag:5,type:'rock',hidden:true,fixed:true,fixedSphere:true,floating:false,absoluteY:true}));
 const hazards=()=>orderSourceFixedSpheres(visible,markers,hidden);
 const volumes=G.planes.map((p,i)=>clippedVolume({id:'dolphin-stunt-solid-'+i,kind:'ramp',origin:xyz(p.slice(0,3)),
  axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:xyz(p.slice(12,15)),flag:p[15]}));
 const ramps=G.ramps.map((q,i)=>{
  const id='dolphin-stunt-ramp-'+i,contactVolumes=volumes.slice(q.planeStart,q.planeStart+q.planeCount).map(v=>({...v,rampId:id}));
  const vertices=contactVolumes.flatMap(v=>v.vertices),[x,y,z]=xyz(q.position),[tx,tz]=q.forward;
  const along=vertices.map(p=>(p[0]-x)*tx+(p[2]-z)*tz),across=vertices.map(p=>(p[0]-x)*tz-(p[2]-z)*tx);
  return {id,name:'PARK JUMP '+(i+1),x,y,z,tx,tz,sourceIndex:q.index,sourceCourseIndex:0,sourceVolumeProfile:true,
   sourceFamily:'stunt',sourceNativeClass:2,fixed:true,floating:false,absoluteY:true,
   width:Math.max(...across)-Math.min(...across),length:Math.max(...along)-Math.min(...along),height:Math.max(...vertices.map(p=>p[1])),contactVolumes};
 });
 const contactVolumesForRamps=selected=>clippedVolumes(selected.flatMap(r=>r.contactVolumes));
 const rings=G.rings.map(([x,y,z,variant,order,heading],i)=>({x:x*S,y:y*S,z:z*S,...direction(heading),sourceIndex:i,variant,order,
  type:'water',radius:2.8,depth:.8,probeHeight:.2,floating:false,absoluteY:true}));
 const gates=G.gates.map(q=>({...q})),checkpoints=[...gates.slice(1),gates[0]].map((q,i)=>({...q,section:i,limit:G.checkpointSeconds[i]}));
 const anchors=dolphinStuntNavigation.anchors.map(p=>[...p]);
 const sourceDecorations=G.generic.map(([x,y,z,type,heading],i)=>({id:'dolphin-decoration-'+i,x:x*S,y:y*S,z:z*S,...direction(heading),
  sourceIndex:i,sourceType:type,sourceVariant:type-10,runtimeKind:11,fixed:true,collision:false,visualIdentity:'authored-beach-furniture'}));
 return {name:'Dolphin Park',theme:'park',tag:'00 / DOLPHIN PARK',layoutRevision:2,
  description:'Source-aligned tropical Stunt course with four jumps and ten rings.',
  sourceMetadata:{nativeCourseIndex:0,referenceRevision:'USA Rev1',nativeScale:S,sourceCollisionPlaneCount:100,sourceShoreSegmentCount:55,sourceStuntNativeClass:2},
  anchors,routeInterpolation:'linear',navigationDriver:'source-layout',stuntLayout:{anchors,routeInterpolation:'linear',driver:'source-layout',
   startGate:{...gates[0]},rocks:hazards(),ramps,rings,checkpoints,sourceNativeClass:2},
  sourceShores,shoreContacts:shoreLines(sourceShores),staticSurfaces,sourceFloor,ground,landGround:ground,renderGround,
  authoredBackground:{seabedHeight:-8,status:'Authored island elevation inside closed shore outlines; finite source shallows remain unchanged.'},
  sourceObjectSelection:{singlePlayerIncludesStunt:true,stuntFixedSphereCount:205,stuntNativeClass:2},
  hazardsForPlayers:players=>{if(players!==1)throw new RangeError('Dolphin native Stunt scene is solo');return hazards();},
  boundaryMarkers,sourceMarkerSpheres:markers,sourceDecorations,contactVolumesForRamps,
  // Authored deck spans link the measured post clusters. They supply scenery,
  // not an invented physical roof or a second set of collision planes.
  sceneryDecks:{height:2.75,width:1.9,path:[[11.25,-50],[11.25,2.125],[4.125,8.75],[-17.75,8.75],[-27.5,17.375],[-27.5,48.875],[-27.5,60.5]],
   branches:[[[11.25,-5],[17.5,-5]],[[-27.5,27.5],[-21.25,27.5]],[[-27.5,42.5],[-33.75,42.5]]],
   platforms:[[17.5,-5,8.5,6],[-11.25,2.5,6,8.5],[-21.25,27.5,8.5,6],[-33.75,42.5,8.5,6],[-27.5,57.025,4,4]]},
  boundaryMetadata:{sourceOrderIsPolygon:false,sourceMarkerSetClosed:false},resistance:[],raceRamps:[]};
}
