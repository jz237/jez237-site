import {DRAKE_STUNT_GEOMETRY as G} from './source-drake-stunt-data.js?v=edc570968f5a';
import {facetedSurface} from './faceted-surfaces.js?v=edc570968f5a';
import {clippedVolume,clippedVolumes} from './clipped-volumes.js?v=edc570968f5a';
import {shoreLines} from './shore-contact.js?v=edc570968f5a';
import {orderSourceFixedSpheres} from './source-boundary-spheres.js?v=edc570968f5a';
const S=.025,xyz=p=>p.map(v=>v*S);
const direction=heading=>{const a=(Math.trunc(heading*4096/360)&4095)*Math.PI*2/4096;return {tx:Math.sin(a),tz:Math.cos(a)};};

// Authored inspection helm path; it does not decide source progress or scoring.
export const drakeStuntNavigation={anchors:[
 [108.4,70.975],[100.95,36.975],[113.75,-3.425],[97.1,-39.1],[106.525,-71.425],
 [101,-98],[78.375,-101.525],[54.275,-89.65],[27.425,-92.3],[1.45,-98.875],
 [-23.2,-95.25],[-49.625,-104.575],[-78.025,-104.5],[-100.775,-89.75],[-102.125,-79.45],
 [-104,-60],[-103.575,-42.325],[-103.575,2.675],[-103.575,47.675],[-100,80],
 [-87.075,105.1],[-80,125.35],[-53.1,127.025],[-20,125],
 [10.2,121.025],[30.45,123.55],[49.3,114.375],[82,107],[108.4,70.975]
]};

/** Shared original lake geometry. Woodland and
 * bank elevations beyond the finite source shallows are authored scenery. */
export function createSourceDrakeTerrain(polygonDistance){
 if(typeof polygonDistance!=='function')throw new TypeError('Expected signed polygon distance');
 const staticSurfaces=G.floors.map(q=>facetedSurface(q.id,q.triangles.map(t=>t.map(xyz)),{kind:'sand',sourcePlaneIndices:[...q.indices]}));
 const sourceFloor=(x,z)=>{let y=null;for(const q of staticSurfaces){const h=q.heightAt(x,z);if(h!==null&&(y===null||h>y))y=h;}return y;};
 const sourceShores=G.shores.map(q=>({id:q.id,outline:q.points.map(xyz),kind:'sand',sourceClosed:q.sourceClosed,
  waterInside:q.waterInside,sourceEdgeCount:q.indices.length,sourceLineIndices:[...q.indices],solidInteriorDefined:q.sourceClosed}));
 const ground=(x,z)=>Math.max(-8,sourceFloor(x,z)??-8);
 const renderGround=(x,z)=>{
  const finite=sourceFloor(x,z);if(finite!==null)return finite;
  let y=-8;
  for(const shore of sourceShores){const distance=polygonDistance(shore.outline,x,z),land=shore.waterInside?distance:-distance;
   if(land>=0)y=Math.max(y,.45+Math.min(shore.waterInside?24:8,land*.35));
  }
  return y;
 };
 return {sourceShores,shoreContacts:shoreLines(sourceShores),staticSurfaces,sourceFloor,ground,landGround:ground,renderGround,
  authoredBackground:{seabedHeight:-8,status:'Authored bank elevations on the land side of closed source shore outlines.'}};
}
/** Solo Stunt uses64 loaded rows:3 ramps,16 rings and45 of48 raw reeds. */
export function createSourceDrakeStuntCourse(polygonDistance){
 const terrain=createSourceDrakeTerrain(polygonDistance);
 const fixed=G.fixed.map(([x,z,tag],i)=>({id:'drake-fixed-'+i,x:x*S,y:0,z:z*S,r:.625,probeRadius:.3,
  sourceIndex:i,runtimeTag:tag,type:'post',hidden:false,fixed:true,fixedSphere:true,floating:false,absoluteY:true}));
 const hazards=()=>orderSourceFixedSpheres(fixed);
 const volumes=G.planes.map((p,i)=>clippedVolume({id:'drake-stunt-solid-'+i,kind:'ramp',origin:xyz(p.slice(0,3)),
  axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:xyz(p.slice(12,15)),flag:p[15]}));
 const ramps=G.ramps.map((q,i)=>{
  const id='drake-stunt-ramp-'+i,contactVolumes=volumes.slice(q.planeStart,q.planeStart+q.planeCount).map(v=>({...v,rampId:id}));
  const vertices=contactVolumes.flatMap(v=>v.vertices),[x,y,z]=xyz(q.position),[tx,tz]=q.forward;
  const along=vertices.map(p=>(p[0]-x)*tx+(p[2]-z)*tz),across=vertices.map(p=>(p[0]-x)*tz-(p[2]-z)*tx);
  return {id,name:'DRAKE JUMP '+(i+1),x,y,z,tx,tz,sourceIndex:q.index,sourceCourseIndex:4,sourceVolumeProfile:true,
   sourceFamily:'stunt',sourceNativeClass:2,fixed:true,floating:false,absoluteY:true,
   width:Math.max(...across)-Math.min(...across),length:Math.max(...along)-Math.min(...along),height:Math.max(...vertices.map(p=>p[1])),contactVolumes};
 });
 const contactVolumesForRamps=selected=>clippedVolumes(selected.flatMap(r=>r.contactVolumes));
 const rings=G.rings.map(([x,y,z,variant,order,heading],i)=>({x:x*S,y:y*S,z:z*S,...direction(heading),sourceIndex:i,variant,order,
  type:'water',radius:2.8,depth:.8,probeHeight:.2,floating:false,absoluteY:true}));
 const sourceStaticObjects=G.objects.filter(q=>[3,4].includes(q.kind)).map(q=>{
  const [x,y,z]=xyz(q.position);return {id:'drake-reeds-'+q.index,sourceIndex:q.index,runtimeKind:q.kind,x,y,z,visual:'reeds'};
 });
 const gates=G.gates.map(q=>({...q})),checkpoints=[...gates.slice(1),gates[0]].map((q,i)=>({...q,section:i,limit:G.checkpointSeconds[i]}));
 const anchors=drakeStuntNavigation.anchors.map(p=>[...p]);
 return {name:'Drake Lake',theme:'lake',tag:'04 / DRAKE LAKE',layoutRevision:1,
  description:'Source-aligned lake Stunt course with three jumps, sixteen rings and original reed placements.',
  sourceMetadata:{nativeCourseIndex:4,referenceRevision:'USA Rev1',nativeScale:S,sourceCollisionPlaneCount:22,sourceShoreSegmentCount:72,sourceStuntNativeClass:2},
  anchors,routeInterpolation:'linear',navigationDriver:'source-layout',stuntLayout:{anchors,routeInterpolation:'linear',driver:'source-layout',
   startGate:{...gates[0]},rocks:hazards(),ramps,rings,checkpoints,sourceNativeClass:2},
  ...terrain,
  sourceObjectSelection:{singlePlayerIncludesStunt:true,stuntFixedSphereCount:13,stuntNativeClass:2},
  hazardsForPlayers:players=>{if(players!==1)throw new RangeError('Drake native Stunt scene is solo');return hazards();},
  sourceStaticObjects,contactVolumesForRamps,boundaryMetadata:{sourceOrderIsPolygon:false},resistance:[],raceRamps:[]};
}
