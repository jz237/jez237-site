import {createSourceTwilightCourse,TWILIGHT_NATIVE_GEOMETRY as G,twilightRampsForSelection,twilightHazardsForSelection} from './source-twilight-course.js';
import {TWILIGHT_RACE_OBJECTS} from './source-twilight-race-objects.js';
import {twilightAnchors} from './source-twilight-navigation.js';
import {createSourceBuoyLayout} from './source-buoy-progress.js';
import {clippedVolume,clippedVolumes} from './clipped-volumes.js';
import {polygonDistance} from './classic-courses.js';
import {samplePolyline} from './courses.js';
const S=.025,xyz=p=>p.map(v=>v*S);

/** Original ordinary City geometry with separately authored inspection paths.
 * The original game has no Normal route; callers must choose Hard or above. */
export function nativeTwilightRaceScene(base){
 if(base.sourceWaterCourseIndex!==6)return base;
 const difficulty=base.difficulty??0;
 if(!Number.isInteger(difficulty)||difficulty<1||difficulty>3)throw new RangeError('Twilight has no original Normal race route; select Hard, Expert or Reverse');
 const source=createSourceTwilightCourse(polygonDistance),rows=G.racePrimaryByClass;
 const sourceBuoyLayout=createSourceBuoyLayout({rows:rows[difficulty],courseIndex:6,scale:S,reverse:difficulty===3});
 const cycle=[];let index=sourceBuoyLayout.finishSourceRow;
 do{const n=sourceBuoyLayout.nodes[index];cycle.push(n);index=n.nextSourceRow;
  if(cycle.length>64)throw new RangeError('Invalid Twilight primary cycle');
 }while(index!==sourceBuoyLayout.finishSourceRow);
 // The southern wall ends at z=-210 opposite a narrow quay. Keep the
 // inspection path south of the wall, then north of that quay, in both
 // directions. These steering targets never alter the collision geometry.
 const corner=[[55,-215],[46,-218],[32,-218],[28,-211],[27,-200],[20,-197],[0,-194]];
 const anchors=twilightAnchors[difficulty].flatMap((p,i)=>{
  if(difficulty===3){if(i===4)return [...corner].reverse().map(p=>[...p]);if(i===5||i===6)return [];}
  else {const start=difficulty===2?51:50,end=53;if(i===start)return corner.map(p=>[...p]);if(i>start&&i<=end)return [];}
  return [[...p]];
 });
 const gates=cycle.filter(n=>n.enabled).map(n=>({...n,bx:n.x,bz:n.z,
  side:n.classification===0?1:n.classification===1?-1:0,width:n.halfWidthNative*S||20,offset:0}));
 const sourceVisibleGateIndices=Object.fromEntries(gates.map((n,i)=>[n.sourceRow,i]));
 function geometryForPlayers(players=1){
  if(![1,2].includes(players))throw new RangeError('Select one or two Twilight racers');
  const selected=TWILIGHT_RACE_OBJECTS[difficulty];
  const volumes=selected.planes.map((p,i)=>clippedVolume({id:'twilight-race-solid-'+i,kind:'quay',origin:xyz(p.slice(0,3)),
   axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:xyz(p.slice(12,15)),flag:p[15]}));
  const ramps=twilightRampsForSelection({difficulty,playerCount:players}).map(r=>{
   const o=selected.objects.find(o=>o.kind===1&&o.position.every((n,i)=>Math.abs(n*S-[r.x,r.y,r.z][i])<1e-6));
   if(!o)throw new RangeError('Twilight ramp does not match selected original object');
   const contactVolumes=volumes.slice(o.planeStart,o.planeStart+o.planeCount);
   contactVolumes.forEach(v=>{v.kind='ramp';v.rampId=r.id;});
   return {...r,sourceIndex:o.index,contactVolumes};
  });
  const rocks=twilightHazardsForSelection({difficulty,playerCount:players});
  const nativeCourseLayout={version:1,courseIndex:6,rings:[],volumes:ramps.flatMap(o=>{
   const row=selected.objects[o.sourceIndex];return o.contactVolumes.map((v,i)=>({id:v.id,sourceIndex:o.sourceIndex,planeIndex:row.planeStart+i}));
  })};
  return {sourceCollisionPlayerCount:players,sourceShores:source.sourceShores,shoreContacts:source.shoreContacts,
   staticSurfaces:source.staticSurfaces,sourceFloor:source.sourceFloor,landGround:source.landGround,ground:source.ground,renderGround:source.renderGround,
   quayOutlines:source.quayOutlines,rocks,ramps,raceRamps:ramps,contactVolumes:clippedVolumes(volumes),nativeCourseLayout};
 }
 return {id:base.id,sky:base.sky,water:base.water,storm:base.storm,tag:base.tag,laps:base.laps,
  sourceWaterCourseIndex:6,waterModelRevision:base.waterModelRevision,difficulty,reverse:difficulty===3,
  name:'Twilight City',theme:'city',description:'Source canal walls, finite quays and class-selected jumps.',
  sourceMetadata:{nativeCourseIndex:6,referenceRevision:'USA Rev1',nativeScale:S,sourceNativeClassByDifficulty:[0,1,2,2],nativeNormalRoutePresent:false},
  layoutRevision:106,nativeSceneCourseIndex:6,nativeSceneMode:'race',anchors,route:samplePolyline(anchors,384),routeInterpolation:'linear',
  sourceRouteRowsByClass:rows,sourceBuoyLayout,sourceVisibleGateIndices,gates,
  authoredBackground:source.authoredBackground,geometryForPlayers,...geometryForPlayers(1),
  sourceObjectSelection:{singlePlayerIncludesStunt:false,samePlayerCountTables:true},sourceDynamicsReady:true,dynamicObjectsForPlayers:()=>[],
  hazardsForPlayers:players=>geometryForPlayers(players).rocks,
  boundaryMetadata:{sourceClosed:true,sourceOrderIsPolygon:true},
  rings:[],resistance:[],boundary:undefined,closedAreas:[],requiredPassage:false,passage:null,stuntLayout:undefined};
}
