import {createSourceDrakeTerrain} from './source-drake-stunt-course.js?v=0de61eeb1bd1';
import {DRAKE_STUNT_GEOMETRY as G} from './source-drake-stunt-data.js?v=0de61eeb1bd1';
import {DRAKE_NATIVE_ROUTE_ROWS_BY_CLASS as rows} from './source-drake-rows.js?v=0de61eeb1bd1';
import {createSourceBuoyLayout} from './source-buoy-progress.js?v=0de61eeb1bd1';
import {polygonDistance} from './classic-courses.js?v=0de61eeb1bd1';
import {samplePolyline} from './courses.js?v=0de61eeb1bd1';
const S=.025;

/** Source-coordinate ordinary scene. The inspection line is authored from
 * the retained human graph; it does not implement or replace the original AI. */
export function nativeDrakeRaceScene(base){
 if(base.sourceWaterCourseIndex!==4)return base;
 const difficulty=base.difficulty??0;
 if(!Number.isInteger(difficulty)||difficulty<0||difficulty>3)throw new RangeError('Select a Drake race class');
 const sourceBuoyLayout=createSourceBuoyLayout({rows:rows[difficulty],courseIndex:4,scale:S,reverse:difficulty===3});
 const cycle=[];let index=sourceBuoyLayout.finishSourceRow;
 do{
  const n=sourceBuoyLayout.nodes[index];cycle.push(n);index=n.nextSourceRow;
  if(cycle.length>64)throw new RangeError('Invalid Drake primary cycle');
 }while(index!==sourceBuoyLayout.finishSourceRow);
 // Expert's human judge omits the hidden corner rows retained by Normal.
 // The inspection helm still needs a line around those physical banks; these
 // waypoints change neither source links nor collision/score state.
 const corners=difficulty===2?{3:[[101,-102]],18:[[-96,-97]],35:[[-96,91]],58:[[103,94]]}:
  difficulty===3?{33:[[-111,-56]]}:{};
 const anchors=cycle.flatMap(n=>{
  const lateral=n.classification===0?-3:n.classification===1?3:0;
  return [[n.x+n.tz*lateral,n.z-n.tx*lateral],...(corners[n.sourceRow]??[])];
 });
 const gates=cycle.filter(n=>n.enabled).map(n=>({...n,bx:n.x,bz:n.z,
  side:n.classification===0?1:n.classification===1?-1:0,width:n.halfWidthNative*S||20,offset:0}));
 const sourceVisibleGateIndices=Object.fromEntries(gates.map((n,i)=>[n.sourceRow,i]));
 const fixed=G.fixed.map(([x,z,tag],i)=>({id:'drake-fixed-'+i,x:x*S,y:0,z:z*S,r:.625,probeRadius:.3,
  sourceIndex:i,runtimeTag:tag,type:'post',hidden:false,fixed:true,fixedSphere:true,floating:false,absoluteY:true}));
 const sourceStaticObjects=G.generic.filter(q=>q[3]===2||q[3]===3&&difficulty>=2).map(([x,y,z,type],sourceIndex)=>({
  id:'drake-race-reeds-'+sourceIndex,sourceIndex,runtimeKind:type+1,x:x*S,y:y*S,z:z*S,visual:'reeds'}));
 return {...base,...createSourceDrakeTerrain(polygonDistance),name:'Drake Lake',theme:'lake',
  description:'Source-aligned freshwater circuit with wooded banks, timber posts and weed beds.',
  sourceMetadata:{nativeCourseIndex:4,referenceRevision:'USA Rev1',nativeScale:S,sourceNativeClassByDifficulty:[0,1,2,2]},
  layoutRevision:105,nativeSceneCourseIndex:4,nativeSceneMode:'race',anchors,route:samplePolyline(anchors,384),routeInterpolation:'linear',
  sourceRouteRowsByClass:rows,sourceBuoyLayout,sourceVisibleGateIndices,gates,
  sourceStaticObjects,nativeCourseLayout:{version:1,courseIndex:4,decorations:sourceStaticObjects.map(({id,sourceIndex,runtimeKind,visual})=>({id,sourceIndex,runtimeKind,visual}))},
  sourceObjectSelection:{singlePlayerIncludesStunt:false},
  hazardsForPlayers:players=>{if(![1,2].includes(players))throw new RangeError('Select one or two Drake racers');return fixed.map(q=>({...q}));},
  rocks:fixed,ramps:[],raceRamps:[],rings:[],resistance:[],boundary:undefined,boundaryMarkers:[],
  closedAreas:[],requiredPassage:false,passage:null,stuntLayout:undefined};
}
