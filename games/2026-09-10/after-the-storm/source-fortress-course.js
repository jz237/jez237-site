import {createSourceFortressTerrain} from './source-fortress-stunt-course.js';
import {FORTRESS_STUNT_GEOMETRY as G} from './source-fortress-stunt-data.js';
import {FORTRESS_RACE_OBJECTS} from './source-fortress-race-objects.js';
import {FORTRESS_NATIVE_ROUTE_ROWS_BY_CLASS as rows} from './source-fortress-rows.js';
import {createSourceBuoyLayout} from './source-buoy-progress.js';
import {sourceBoundarySpheres,orderSourceFixedSpheres} from './source-boundary-spheres.js';
import {clippedVolume,clippedVolumes} from './clipped-volumes.js';
import {polygonDistance} from './classic-courses.js';
import {samplePolyline} from './courses.js';
const S=.025,xyz=p=>p.map(v=>v*S);

/** Ordinary source coordinates, with independently authored driving anchors.
 * Scene construction never advances the canonical objects or gate condition. */
export function nativeFortressRaceScene(base){
 if(base.sourceWaterCourseIndex!==3)return base;
 const difficulty=base.difficulty??0;
 if(!Number.isInteger(difficulty)||difficulty<0||difficulty>3)throw new RangeError('Select a Fortress race class');
 const sourceBuoyLayout=createSourceBuoyLayout({rows:rows[difficulty],courseIndex:3,scale:S,reverse:difficulty===3});
 const cycle=[];let index=sourceBuoyLayout.finishSourceRow;
 do{const n=sourceBuoyLayout.nodes[index];cycle.push(n);index=n.nextSourceRow;
  if(cycle.length>64)throw new RangeError('Invalid Fortress primary cycle');
 }while(index!==sourceBuoyLayout.finishSourceRow);
 const west=[[-109,-35],[-116,-48],[-116,-77],[-90,-99]];
 const east=[[35.675,48.675],[43.45,69.5],[37.475,106.325],[26.5,135.625],[8.65,157.725],[-24.7,172.4]];
 const north=[[-41,181],[-54.575,187.225],[-79,177],[-87.625,146.1],[-91.275,121.75],[-83.775,96.7]];
 const corners=difficulty===0?{1:west,36:east,44:north}:{1:west,35:east,43:north};
 // Reverse retains its hidden guide centers around the northern rock faces.
 // These are inspection targets, not an implementation of the original AI.
 const anchors=difficulty===3?sourceBuoyLayout.nodes.map(n=>{const lateral=n.enabled?(n.classification===0?-3:n.classification===1?3:0):0;
  return [n.x+n.tz*lateral,n.z-n.tx*lateral];}):cycle.flatMap(n=>{const lateral=n.classification===0?-3:n.classification===1?3:0;
  if(n.sourceRow===(difficulty===0?52:51))return [[-89,65],[-90,43]];
  return [[n.x+n.tz*lateral,n.z-n.tx*lateral],...(corners[n.sourceRow]??[])];});
 const gates=cycle.filter(n=>n.enabled).map(n=>({...n,bx:n.x,bz:n.z,
  side:n.classification===0?1:n.classification===1?-1:0,width:n.halfWidthNative*S||20,offset:0}));
 const sourceVisibleGateIndices=Object.fromEntries(gates.map((n,i)=>[n.sourceRow,i]));
 const boundaryMarkers=G.markers.map(xyz),markers=sourceBoundarySpheres(boundaryMarkers,{idPrefix:'fortress-marker-'});
 const hidden=G.hidden.map(([x,y,z],i)=>({id:'fortress-hidden-'+i,x:x*S,y:y*S,z:z*S,r:.625,probeRadius:.3,
  sourceIndex:i,runtimeTag:5,type:'rock',hidden:true,fixed:true,fixedSphere:true,floating:false,absoluteY:true}));
 const hazards=()=>orderSourceFixedSpheres([],markers,hidden),selected=FORTRESS_RACE_OBJECTS[difficulty];
 const volumes=selected.planes.map((p,i)=>clippedVolume({id:'fortress-race-solid-'+i,origin:xyz(p.slice(0,3)),
  axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:xyz(p.slice(12,15)),flag:p[15]}));
 const sourceSolidObjects=selected.objects.filter(q=>[2,6,7].includes(q.kind)).map(q=>{
  const [x,y,z]=xyz(q.position);return {id:'fortress-race-object-'+q.index,sourceIndex:q.index,runtimeKind:q.kind,x,y,z,
   contactVolumes:volumes.slice(q.planeStart,q.planeStart+q.planeCount).map(v=>({...v,kind:q.kind===2?'gate':'timber',sourceObjectIndex:q.index}))};
 });
 const sourceDynamicObjects=selected.objects.filter(q=>q.kind===5).map(q=>{const [x,y,z]=xyz(q.position);return {id:'fortress-race-object-'+q.index,sourceIndex:q.index,runtimeKind:5,x,y,z,radius:q.radius*S};});
 const contactVolumes=clippedVolumes(sourceSolidObjects.flatMap(q=>q.contactVolumes));
 const nativeCourseLayout={version:1,courseIndex:3,rings:[],volumes:sourceSolidObjects.flatMap(q=>q.contactVolumes.map((v,i)=>({id:v.id,sourceIndex:q.sourceIndex,planeIndex:selected.objects[q.sourceIndex].planeStart+i}))),
  floating:sourceDynamicObjects.map(q=>({id:q.id,sourceIndex:q.sourceIndex,radius:q.radius,runtimeKind:q.runtimeKind}))};
 // Carry appearance/selection only. The illustration map's arches, walls and
 // shortcut occupy different coordinates and must not survive this selection.
 return {id:base.id,sky:base.sky,water:base.water,storm:base.storm,tag:base.tag,laps:base.laps,
  sourceWaterCourseIndex:3,waterModelRevision:base.waterModelRevision,difficulty,reverse:difficulty===3,
  ...createSourceFortressTerrain(polygonDistance),name:'Marine Fortress',theme:'fortress',
  description:'Source-aligned fortress circuit with a rising gate and physical floating obstacles.',
  sourceMetadata:{nativeCourseIndex:3,referenceRevision:'USA Rev1',nativeScale:S,sourceNativeClassByDifficulty:[0,1,2,2]},
  layoutRevision:105,nativeSceneCourseIndex:3,nativeSceneMode:'race',anchors,route:samplePolyline(anchors,384),routeInterpolation:'linear',
  sourceRouteRowsByClass:rows,sourceBuoyLayout,sourceVisibleGateIndices,gates,
  sourceSolidObjects,sourceDynamicObjects,contactVolumes,nativeCourseLayout,
  sourceObjectSelection:{singlePlayerIncludesStunt:false},dynamicObjectsForPlayers:()=>[],sourceDynamicsReady:true,
  hazardsForPlayers:players=>{if(![1,2].includes(players))throw new RangeError('Select one or two Fortress racers');return hazards();},
  rocks:hazards(),boundaryMarkers,sourceMarkerSpheres:markers,boundaryMetadata:{sourceOrderIsPolygon:false,sourceMarkerSetClosed:false},
  ramps:[],raceRamps:[],rings:[],resistance:[],boundary:undefined,closedAreas:[],requiredPassage:false,passage:null,stuntLayout:undefined};
}
