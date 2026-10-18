import {createSourcePortCourse,PORT_NATIVE_GEOMETRY as G,portRampsForSelection} from './source-port-course.js?v=d5529706860a';
import {PORT_RACE_OBJECTS} from './source-port-race-objects.js?v=d5529706860a';
import {createSourceBuoyLayout} from './source-buoy-progress.js?v=d5529706860a';
import {sourceBoundarySpheres,orderSourceFixedSpheres} from './source-boundary-spheres.js?v=d5529706860a';
import {clippedVolume,clippedVolumes} from './clipped-volumes.js?v=d5529706860a';
import {polygonDistance} from './classic-courses.js?v=d5529706860a';
import {samplePolyline} from './courses.js?v=d5529706860a';
const S=.025,xyz=p=>p.map(v=>v*S);

/** Ordinary Port uses the selected original shoreline and object bank.
 * Inspection anchors are authored steering targets, independent of judging. */
export function nativePortRaceScene(base){
 if(base.sourceWaterCourseIndex!==5)return base;
 const difficulty=base.difficulty??0;
 if(!Number.isInteger(difficulty)||difficulty<0||difficulty>3)throw new RangeError('Select a Port race class');
 const source=createSourcePortCourse(polygonDistance),rows=G.racePrimaryByClass;
 const sourceBuoyLayout=createSourceBuoyLayout({rows:rows[difficulty],courseIndex:5,scale:S,reverse:difficulty===3});
 const cycle=[];let index=sourceBuoyLayout.finishSourceRow;
 do{const n=sourceBuoyLayout.nodes[index];cycle.push(n);index=n.nextSourceRow;
  if(cycle.length>64)throw new RangeError('Invalid Port primary cycle');
 }while(index!==sourceBuoyLayout.finishSourceRow);
 // Branch/checkpoint records can sit on a quay rather than on a driving line.
 // Retain hidden guide centers around the harbour and author a wider turn
 // around the northern peninsula without altering any primary judge record.
 const omitted=new Set(difficulty===0?[32,39,41,42]:difficulty===3?[3,4,21,24]:[41,42]);
 const canal=[[-36.7,-108.5],[-22,-106],[-7,-105],[0,-101],[10,-92],[12,-85],[12,-78],
  [8,-73],[-8,-58],[-8,-47],[-9,-39],[-5,-38],[7,-39],[16,-39],[25,-33],[26,-22],
  [26,-10],[26,-1],[22,7],[15,12],[0,15],[-15,17]];
 const anchors=sourceBuoyLayout.nodes.filter(n=>![8,24].includes(n.nativeType)&&!omitted.has(n.sourceRow)).flatMap(n=>{
  if(difficulty===1||difficulty===2){if(n.sourceRow===9)return canal.map(p=>[...p]);if(n.sourceRow>9&&n.sourceRow<=34)return [];}
  if(difficulty===3){if(n.sourceRow===29)return [...canal].reverse().map(p=>[...p]);if(n.sourceRow>29&&n.sourceRow<=44)return [];}
  const lateral=n.enabled?(n.classification===0?-3:n.classification===1?3:0):0;
  const point=[n.x+n.tz*lateral,n.z-n.tx*lateral];
  if(difficulty!==3&&n.sourceRow===(difficulty===0?38:40))return [point,[-70,164],[-88,167],[-105,155]];
  if(difficulty===3&&n.sourceRow===2)return [point,[-102,156],[-86,167],[-71,163]];
  return [point];
 });
 const gates=cycle.filter(n=>n.enabled).map(n=>({...n,bx:n.x,bz:n.z,
  side:n.classification===0?1:n.classification===1?-1:0,width:n.halfWidthNative*S||20,offset:0}));
 const sourceVisibleGateIndices=Object.fromEntries(gates.map((n,i)=>[n.sourceRow,i]));
 function geometryForPlayers(players=1){
  if(![1,2].includes(players))throw new RangeError('Select one or two Port racers');
  const selected=PORT_RACE_OBJECTS[players][difficulty],boundaryMarkers=selected.markers.map(xyz);
  const markers=sourceBoundarySpheres(boundaryMarkers,{idPrefix:'port-race-marker-'}),rocks=orderSourceFixedSpheres([],markers,[]);
  const volumes=selected.planes.map((p,i)=>clippedVolume({id:'port-race-solid-'+i,kind:'quay',origin:xyz(p.slice(0,3)),
   axes:[p.slice(3,6),p.slice(6,9),p.slice(9,12)],spans:xyz(p.slice(12,15)),flag:p[15]}));
  const ramps=portRampsForSelection({difficulty,playerCount:players}).map(r=>{
   const o=selected.objects.find(o=>o.kind===1&&o.position.every((n,i)=>Math.abs(n*S-[r.x,r.y,r.z][i])<1e-6));
   if(!o)throw new RangeError('Port ramp does not match selected original object');
   const contactVolumes=volumes.slice(o.planeStart,o.planeStart+o.planeCount);
   contactVolumes.forEach(v=>{v.kind='ramp';v.rampId=r.id;});
   return {...r,sourceIndex:o.index,contactVolumes};
  });
  const sourceSolidObjects=selected.objects.filter(o=>[2,6,7].includes(o.kind)).map(o=>{
   const [x,y,z]=xyz(o.position),contactVolumes=volumes.slice(o.planeStart,o.planeStart+o.planeCount);
   contactVolumes.forEach(v=>{v.kind='timber';v.sourceObjectIndex=o.index;});
   return {id:'port-race-object-'+o.index,sourceIndex:o.index,runtimeKind:o.kind,x,y,z,contactVolumes};
  });
  const sourceDynamicObjects=selected.objects.filter(o=>[5,9].includes(o.kind)).map(o=>{
   const [x,y,z]=xyz(o.position);return {id:'port-race-object-'+o.index,sourceIndex:o.index,runtimeKind:o.kind,x,y,z,radius:o.radius*S};
  });
  const nativeCourseLayout={version:1,courseIndex:5,rings:[],volumes:[...ramps,...sourceSolidObjects].flatMap(o=>{
   const row=selected.objects[o.sourceIndex];return o.contactVolumes.map((v,i)=>({id:v.id,sourceIndex:o.sourceIndex,planeIndex:row.planeStart+i}));
  }),floating:sourceDynamicObjects.map(({id,sourceIndex,runtimeKind,radius})=>({id,sourceIndex,runtimeKind,radius}))};
  return {...source.geometryForPlayers(players),boundaryMarkers,sourceMarkerSpheres:markers,rocks,ramps,raceRamps:ramps,
   sourceSolidObjects,sourceDynamicObjects,contactVolumes:clippedVolumes(volumes),nativeCourseLayout};
 }
 return {id:base.id,sky:base.sky,water:base.water,storm:base.storm,tag:base.tag,laps:base.laps,
  sourceWaterCourseIndex:5,waterModelRevision:base.waterModelRevision,difficulty,reverse:difficulty===3,
  name:'Port Blue',theme:'port',description:'Source-aligned harbour circuit with class-selected jumps and mode-selected floating obstacles.',
  sourceMetadata:{nativeCourseIndex:5,referenceRevision:'USA Rev1',nativeScale:S,sourceNativeClassByDifficulty:[0,1,2,2]},
  layoutRevision:107,nativeSceneCourseIndex:5,nativeSceneMode:'race',anchors,route:samplePolyline(anchors,384),routeInterpolation:'linear',
  sourceRouteRowsByClass:rows,sourceBuoyLayout,sourceVisibleGateIndices,gates,
  authoredBackground:source.authoredBackground,geometryForPlayers,...geometryForPlayers(1),
  sourceObjectSelection:{singlePlayerIncludesStunt:false},sourceDynamicsReady:true,dynamicObjectsForPlayers:()=>[],
  hazardsForPlayers:players=>geometryForPlayers(players).rocks,
  boundaryMetadata:{sourceOrderIsPolygon:false,sourceMarkerSetClosed:false},
  rings:[],resistance:[],boundary:undefined,closedAreas:[],requiredPassage:false,passage:null,stuntLayout:undefined};
}
