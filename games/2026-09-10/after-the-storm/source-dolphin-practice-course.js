import {createSourceDolphinStuntCourse} from './source-dolphin-stunt-course.js';
import {DOLPHIN_PRACTICE_ROWS as rows} from './source-dolphin-practice-rows.js';
import {DOLPHIN_PRACTICE_OBJECTS as objects} from './source-dolphin-practice-objects.js';
import {createSourceBuoyLayout} from './source-buoy-progress.js';
import {clippedVolume,clippedVolumes} from './clipped-volumes.js';
import {polygonDistance} from './classic-courses.js';
import {samplePolyline} from './courses.js';
const S=.025,xyz=p=>p.map(v=>v*S);

/** Prepared solo ordinary geometry; live Practice mode admission is separate.
 * Only floor/shore/pier scenery is shared with Stunt, never its rings or jumps. */
export function nativeDolphinPracticeScene(base){
 if(base.sourceWaterCourseIndex!==0)throw new RangeError('Select Dolphin Park');
 if((base.difficulty??0)!==0||base.reverse)throw new RangeError('Prepared Dolphin Practice uses the forward Normal selection');
 const source=createSourceDolphinStuntCourse(polygonDistance);
 const sourceBuoyLayout=createSourceBuoyLayout({rows,courseIndex:0,scale:S});
 const gates=sourceBuoyLayout.nodes.filter(n=>n.enabled).map(n=>({...n,bx:n.x,bz:n.z,side:0,width:n.halfWidthNative*S,offset:0}));
 const sourceVisibleGateIndices=Object.fromEntries(gates.map((n,i)=>[n.sourceRow,i]));
 // Source navigation guides supply scenery spacing. Practice imposes no
 // authored circuit or lap completion; human controls remain unrestricted.
 const anchors=rows.filter(r=>r[2]===3||r[2]===8).map(([x,z])=>[x*S,z*S]);
 const volumes=objects.planes.map((p,i)=>clippedVolume({id:'dolphin-practice-solid-'+i,kind:'ramp',origin:xyz(p.slice(0,3)),
  axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:xyz(p.slice(12,15)),flag:p[15]}));
 const ramps=objects.objects.filter(o=>o.kind===1).map((o,i)=>{
  const id='dolphin-practice-ramp-'+i,contactVolumes=volumes.slice(o.planeStart,o.planeStart+o.planeCount);
  contactVolumes.forEach(v=>v.rampId=id);
  const vertices=contactVolumes.flatMap(v=>v.vertices),[x,y,z]=xyz(o.position),[tx,tz]=o.forward;
  const along=vertices.map(p=>(p[0]-x)*tx+(p[2]-z)*tz),across=vertices.map(p=>(p[0]-x)*tz-(p[2]-z)*tx);
  return {id,name:'PARK JUMP '+(i+1),x,y,z,tx,tz,sourceIndex:o.index,sourceCourseIndex:0,sourceVolumeProfile:true,
   sourceFamily:'ordinary',sourceNativeClass:0,fixed:true,floating:false,absoluteY:true,
   width:Math.max(...across)-Math.min(...across),length:Math.max(...along)-Math.min(...along),height:Math.max(...vertices.map(p=>p[1])),contactVolumes};
 });
 const geometryForPlayers=(players=1)=>{
  if(players!==1)throw new RangeError('Prepared Dolphin Practice geometry is solo');
  return {sourceCollisionPlayerCount:1,sourceShores:source.sourceShores,shoreContacts:source.shoreContacts,
   staticSurfaces:source.staticSurfaces,sourceFloor:source.sourceFloor,ground:source.ground,landGround:source.landGround,renderGround:source.renderGround,
   boundaryMarkers:source.boundaryMarkers,sourceMarkerSpheres:source.sourceMarkerSpheres,sourceDecorations:source.sourceDecorations,
   sceneryDecks:source.sceneryDecks,rocks:source.hazardsForPlayers(1),ramps,raceRamps:ramps,contactVolumes:clippedVolumes(volumes)};
 };
 const nativeCourseLayout={version:1,courseIndex:0,rings:[],volumes:ramps.flatMap(r=>{
  const o=objects.objects[r.sourceIndex];return r.contactVolumes.map((v,i)=>({id:v.id,sourceIndex:r.sourceIndex,planeIndex:o.planeStart+i}));
 })};
 return {id:base.id,name:'Dolphin Park',theme:'park',sky:base.sky,water:base.water,storm:base.storm,tag:base.tag,laps:base.laps,
  description:'Original solo Practice shore, shallows, pier and two jumps.',sourceWaterCourseIndex:0,waterModelRevision:base.waterModelRevision,
  difficulty:0,reverse:false,layoutRevision:103,nativeSceneCourseIndex:0,nativeSceneMode:'practice',
  sourceMetadata:{nativeCourseIndex:0,referenceRevision:'USA Rev1',nativeScale:S,sourceNativeClassByDifficulty:[0,1,2,2]},
  anchors,route:samplePolyline(anchors,384),routeInterpolation:'linear',sourceRouteRowsByClass:[rows,rows,rows,[]],
  sourceBuoyLayout,sourceVisibleGateIndices,gates,nativeCourseLayout,geometryForPlayers,...geometryForPlayers(1),
  authoredBackground:source.authoredBackground,sourceObjectSelection:{singlePlayerIncludesStunt:false},
  sourceDynamicsReady:true,dynamicObjectsForPlayers:()=>[],hazardsForPlayers:players=>geometryForPlayers(players).rocks,
  boundaryMetadata:source.boundaryMetadata,rings:[],resistance:[],boundary:undefined,closedAreas:[],requiredPassage:false};
}
