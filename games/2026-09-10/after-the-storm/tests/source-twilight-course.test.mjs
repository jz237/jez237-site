import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceTwilightCourse,TWILIGHT_NATIVE_GEOMETRY,twilightSourceSelection,twilightHazardsForSelection,twilightRampsForSelection} from '../source-twilight-course.js';

// Independent raw numeric observations from the local USA Rev1 reference.
// Tests require neither the source ROM nor an original graphics asset.
const S=.025;
const close=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
function polygonDistance(points,x,z){
 let inside=false,distance=Infinity;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[j],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));
  distance=Math.min(distance,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t));
  if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside?-distance:distance;
}
const course=options=>createSourceTwilightCourse(polygonDistance,options);
const direction=degrees=>{const a=(Math.trunc(degrees*4096/360)&4095)*Math.PI*2/4096;return [Math.sin(a),Math.cos(a)];};
const forwardBuoys=[[-1500,-3000,7,0],[-2250,-1000,7,0],[-2500,750,7,0],[-2500,2500,7,0],[-1250,5250,7,45],[1000,5250,7,90],[2750,5000,7,135],[3500,-2500,6,146],[4750,-3750,7,135],[6000,-5000,6,135],[6700,-7050,6,180],[6750,-8500,7,225],[5565,-8155,7,269],[2646,-8223,7,272],[-500,-7750,7,315]];
const reverseBuoys=[[-500,-7750,1,163],[2646,-8086,7,90],[5565,-8155,7,90],[6750,-8500,1,46],[6700,-7050,0,0],[6000,-5000,0,318],[4750,-3750,1,312],[3523,-2250,0,325],[2319,1942,6,0],[2506,4791,7,315],[990,5072,6,270],[-1249,4936,7,239],[-2500,2500,6,180],[-2528,814,7,180],[-1839,-1400,7,180],[-1290,-2904,7,180]];

test('all visible race centers, sides and native headings survive with explicit Normal fallback',()=>{
 const c=course();assert.deepEqual(c.buoysByClass.map(q=>q.length),[15,15,15,16]);
 for(let d=0;d<4;d++)for(const [i,[x,z,type,heading]] of (d===3?reverseBuoys:forwardBuoys).entries()){
  const q=c.buoysByClass[d][i],[tx,tz]=direction(heading);
  close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);
  assert.equal(q.nativeType,type);assert.equal(q.nativeHeading,heading);assert.equal(q.side,[0,6].includes(type)?1:-1);
  assert.equal(q.width,undefined,'a source navigation offset does not establish a finite buoy span');
  assert.ok(q.sourceRow>=0);
 }
 assert.deepEqual(c.sourceRawPrimaryRouteRowsByClass.map(q=>q.length),[0,38,41,43]);
 assert.deepEqual(c.sourceRouteRowsByClass.map(q=>q.length),[38,38,41,43]);
 assert.deepEqual(c.sourceRouteRowsByClass[0],c.sourceRouteRowsByClass[1]);
 assert.notEqual(c.sourceRouteRowsByClass[0],c.sourceRouteRowsByClass[1]);
 assert.equal(c.recordMetadataByClass[0].requestedDifficulty,0);
 assert.equal(c.recordMetadataByClass[0].nativeClass,1);
 assert.equal(c.recordMetadataByClass[0].browserFallback,true);
 assert.equal(c.recordMetadataByClass[0].fallbackPolicy,'native-hard-for-browser-normal');
 assert.match(c.recordMetadataByClass[0].recordLayoutId,/normal-hard-fallback/);
 assert.equal(c.sourceMetadata.nativeNormalRoutePresent,false);
});

test('original primary and secondary route variants remain separately available',()=>{
 const c=course(),changed=d=>c.sourceRouteRowsByClass[d].flatMap((q,i)=>q.every((v,k)=>v===c.sourceSecondaryRouteRowsByClass[d][i][k])?[]:[i]);
 assert.equal(changed(1).length,10);assert.equal(changed(2).length,13);assert.equal(changed(3).length,0);
 assert.deepEqual(c.sourceRouteRowsByClass[1][2],[-75,-2771,11,0]);
 assert.deepEqual(c.sourceSecondaryRouteRowsByClass[1][2],[-2180,1102,11,0]);
 assert.deepEqual(c.sourceRawSecondaryRouteRowsByClass[0],[]);
 for(let d=0;d<4;d++){
  const finish=c.finishGatesByClass[d];close(finish.x,(d===3?-250:-200)*S);close(finish.z,-6250*S);
  assert.equal(finish.width,12.5);assert.equal(finish.nativeHeading,d===3?180:0);
 }
});

test('78 exact shore edges form two solid islands and one outer water boundary',()=>{
 const c=course();assert.deepEqual(c.sourceShores.map(q=>q.sourceEdgeCount),[24,15,39]);
 assert.deepEqual(c.sourceShores.map(q=>q.waterInside),[false,false,true]);
 assert.equal(c.shoreContacts.edges.length,78);assert.equal(c.boundary.length,39);
 assert.equal(c.boundaryMetadata.cyclicOrderInferred,false);
 assert.equal(c.boundaryMetadata.sourceOrderIsPolygon,true);
 const bounds=k=>[Math.min(...c.boundary.map(q=>q[k])),Math.max(...c.boundary.map(q=>q[k]))];
 assert.deepEqual(bounds(0),[-3482*S,7200*S]);assert.deepEqual(bounds(1),[-9000*S,5400*S]);
 // Positive edge normal must always face source water, including the outer
 // boundary where the correct orientation is opposite to an island outline.
 for(const edge of c.shoreContacts.edges){
  const polygon=c.sourceShores.find(q=>q.id===edge.id),x=(edge.a[0]+edge.b[0])/2,z=(edge.a[1]+edge.b[1])/2;
  const water=polygonDistance(polygon.outline,x+edge.normal.x*.01,z+edge.normal.z*.01);
  const solid=polygonDistance(polygon.outline,x-edge.normal.x*.01,z-edge.normal.z*.01);
  assert.ok(polygon.waterInside?water<0&&solid>0:water>0&&solid<0,edge.id);
 }
 assert.ok(polygonDistance(c.boundary,0,-1500*S)<0);
 assert.equal(c.sourceFloor(0,-1500*S),null,'the central channel is open water');
});

test('sixteen finite source floors preserve submerged slopes and source grid samples',()=>{
 const c=course();assert.deepEqual(c.staticSurfaces.map(q=>q.triangles.length),[4,12]);
 assert.equal(c.sourceMetadata.sourceCollisionPlaneCount,16);assert.equal(c.iceSheets,undefined);
 for(const [x,z,y] of [[1700,4500,28.333540848680514],[2000,4500,18.33349024764759],[1600,0,-3.9999516977712375],[1800,-900,17.114570701527594],[2500,-2000,20],[2600,-2500,-4.000012075557191]])close(c.sourceFloor(x*S,z*S),y*S,1e-6);
 assert.equal(c.sourceFloor(0,-950*S),null,'the crossbar is a separate finite solid, not a floor heightfield');
 assert.equal(c.sourceFloor(1400*S,-7900*S),null);
 assert.equal(c.sourceFloor(1000,1000),null);
 for(const p of c.staticSurfaces)for(const tri of p.triangles){
  const center=[0,1,2].map(k=>tri.reduce((sum,v)=>sum+v[k],0)/3);
  close(p.heightAt(center[0],center[2]),center[1],1e-6);
 }
 assert.equal(c.landGround(25,0),-8,'shore outlines do not fabricate continuous physical island floors');
 assert.equal(c.authoredBackground.quayHeight,2.5);
 assert.match(c.authoredBackground.status,/Authored/);
 assert.equal(c.sourceWaterMetadata.lapTide,false);
});

test('class and Stunt selection keeps fixed visible spheres and player families exact',()=>{
 const c=course();assert.deepEqual(c.obstaclesByClass.map(q=>q.length),[10,10,16,10]);
 for(let d=0;d<4;d++){
  const one=c.hazardsForPlayers(1,-3,{difficulty:d}),two=c.hazardsForPlayers(2,5,{difficulty:d});
  assert.deepEqual(one,two);assert.equal(one.length,[10,10,16,10][d]);
  assert.ok(one.every(q=>q.fixed&&q.fixedSphere&&q.y===0&&!q.hidden&&!q.followsWaterDatum&&q.r===.625&&q.probeRadius===.3));
  assert.ok(one.every(q=>q.runtimeTag===2||q.runtimeTag===3));
 }
 assert.deepEqual(c.obstaclesByClass[0].map(q=>q.runtimeTag),Array(10).fill(2));
 assert.equal(c.obstaclesByClass[2].filter(q=>q.runtimeTag===3).length,6);
 const stunt=c.hazardsForPlayers(1,0,{mode:'stunt',difficulty:0});assert.equal(stunt.length,27);
 assert.equal(stunt.filter(q=>q.runtimeTag===3).length,14);
 assert.deepEqual([stunt[0].x,stunt[0].y,stunt[0].z],[2101*S,0,1862*S]);
 assert.deepEqual([stunt[26].x,stunt[26].y,stunt[26].z],[4120*S,0,-8800*S]);
 assert.equal(c.hazardsForPlayers.call({...c,difficulty:2},2).length,16);
 assert.equal(c.hazardsForPlayers.call({...c,difficulty:0,stunt:true},1).length,27,'host calls after stuntCourse use its forced class2 family');
 assert.deepEqual(c.sourceObjectSelection.fixedXYZCounts,[0,0]);
 assert.equal(c.sourceObjectSelection.movingSphereCount,0);
 assert.throws(()=>c.hazardsForPlayers(3),RangeError);assert.throws(()=>c.hazardsForPlayers(1,NaN),TypeError);
 assert.throws(()=>twilightHazardsForSelection({difficulty:4}),RangeError);
});

test('native variant filtering selects four ramps and the correct narrow or wide volume',()=>{
 const c=course();assert.deepEqual(c.raceRampsByClass.map(q=>q.map(r=>r.sourceVariant)),[[0,1,1,3],[0,1,1,3],[0,1,1,2],[0,1,1,2]]);
 assert.deepEqual(c.raceRampsByClass[1].map(q=>q.sourceIndex),[0,1,2,4]);
 assert.deepEqual(c.raceRampsByClass[2].map(q=>q.sourceIndex),[0,1,2,3]);
 assert.equal(c.raceRampsByClass[1][1].sourceRecordAddress,'0x800d7530');
 assert.equal(c.raceRampsByClass[2][1].sourceRecordAddress,'0x800d74f0');
 assert.equal(c.raceRampsByClass[1][1].width,10);assert.equal(c.raceRampsByClass[2][1].width,5);
 assert.deepEqual(c.raceRampsByClass[1][3].nativeRow,[-50,-1605,3,0,0]);
 assert.deepEqual(c.raceRampsByClass[2][3].nativeRow,[-50,-2455,2,0,0]);
 assert.deepEqual(c.stuntLayout.ramps.map(q=>q.nativeRow),[[2350,2405,0,0,180],[5105,-7950,1,0,270],[2205,-7950,1,0,270],[-50,-3200,2,0,0]]);
 assert.equal(TWILIGHT_NATIVE_GEOMETRY.stuntRamps.length,5,'omitted authored row remains available as source metadata');
 for(const q of [...c.raceRampsByClass.flat(),...c.stuntLayout.ramps]){
  assert.equal(q.y,0);assert.equal(q.sourcePhysicsFlag,0);assert.equal(q.sourceVolumeProfile,true);
  assert.equal(q.contactVolumes.length,1);assert.equal(q.contactVolumes[0].flag,1);
  assert.equal(q.floating,false);assert.equal(q.absoluteY,true);
 }
 assert.deepEqual(twilightRampsForSelection({difficulty:3,playerCount:1}),twilightRampsForSelection({difficulty:3,playerCount:2}));
 assert.equal(c.contactVolumesForRamps(c.stuntLayout.ramps).volumes.length,8);
 assert.equal(c.crossbars,undefined);assert.equal(c.passage,undefined,'no approximate city passage physics');
});

test('all seventeen fixed rings retain negative heights, headings and duplicate branch orders',()=>{
 const rows=[[-50,-120,-1600,0,0,360],[-50,-120,-1400,0,1,0],[-50,-120,-1200,0,2,0],[-2660,60,1707,0,3,0],[-2475,60,2544,0,4,0],[-2551,60,3489,0,5,0],[-50,60,-599,0,3,0],[-96,60,1017,0,4,359],[139,60,3331,0,5,1],[2377,220,1800,0,6,180],[3947,60,-3322,0,7,135],[4914,60,-3683,0,8,135],[5466,60,-4510,0,9,135],[6482,60,-4926,0,10,135],[6517,60,-6197,0,11,180],[4500,220,-7918,0,12,270],[1600,220,-7950,0,13,272]];
 const rings=course().stuntLayout.rings;assert.equal(rings.length,17);
 rows.forEach(([x,y,z,variant,order,heading],i)=>{
  const q=rings[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.y,y*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);
  assert.equal(q.variant,variant);assert.equal(q.order,order);assert.equal(q.sourceIndex,i);
  assert.equal(q.radius,2.8);assert.equal(q.depth,.8);assert.equal(q.probeHeight,.2);assert.equal(q.absoluteY,true);assert.equal(q.floating,false);
  assert.notEqual(q.type,'dive','the source uses the same proximity predicate for submerged rings, with no added dive-state restriction');
 });
 assert.deepEqual(rings.filter(q=>q.order===3).map(q=>q.sourceIndex),[3,6]);
 assert.deepEqual(rings.filter(q=>q.order===4).map(q=>q.sourceIndex),[4,7]);
 assert.deepEqual(rings.filter(q=>q.order===5).map(q=>q.sourceIndex),[5,8]);
 assert.equal(new Set(rings.map(q=>q.order)).size,14);
});

test('only source CP rows1/3/6/0 award progress with20/15/15/15 limits',()=>{
 const s=course().stuntLayout,rows=[[862,4897,90,20],[3524,-2432,135,20],[5795,-7908,272,20],[-187,-5689,0,12.5]];
 assert.deepEqual(s.checkpoints.map(q=>q.sourceRow),[1,3,6,0]);
 assert.deepEqual(s.checkpoints.map(q=>q.limit),[20,15,15,15]);assert.deepEqual(s.timerSeconds,[20,15,15,15]);
 rows.forEach(([x,z,heading,width],i)=>{const q=s.checkpoints[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.width,width);});
 assert.deepEqual(s.sourceGuideRows,[2,4,5,7]);assert.ok(s.sourceGuideRows.every(i=>s.sourceRouteRows[i][2]===8));
 assert.equal(s.startGate.x,-187*S);assert.equal(s.startGate.z,-5689*S);assert.equal(s.startGate.nativeHeading,0);
 assert.equal(s.sourceNativeClass,2);assert.equal(twilightSourceSelection({mode:'stunt',difficulty:0}).browserFallback,false);
});

test('navigation is injected and copied without enabling an unverified course',()=>{
 const none=course();assert.equal(none.integrationReady,false);assert.equal(none.navigation.usable,false);
 assert.deepEqual(none.anchorsByClass,[[],[],[],[]]);assert.deepEqual(none.stuntLayout.anchors,[]);assert.deepEqual(none.stuntLayout.verificationTargets,[]);
 const anchorsByClass=Array.from({length:4},()=>[[-5,-156],[0,-100],[-40,10]]),labels=anchorsByClass.map(q=>q.map(()=>null));
 const stunt={anchorsWorld:[[-4,-142],[-1,-100],[0,0]],verificationTargets:[{kind:'waypoint',x:-1,z:-100,speed:18}],verificationOnePass:true};
 const c=course({anchorsByClass,pilotAnchorsByClass:labels,stuntNavigation:stunt,navigation:{validated:true}});
 assert.equal(c.integrationReady,false);assert.equal(c.navigation.usable,true);assert.equal(c.navigation.validated,false);
 assert.equal(c.stuntLayout.navigation.usable,true);assert.equal(c.stuntLayout.verificationOnePass,true);
 assert.deepEqual(c.anchorsByClass,anchorsByClass);assert.deepEqual(c.stuntLayout.anchors,stunt.anchorsWorld);
 anchorsByClass[0][0][0]=999;stunt.anchorsWorld[0][0]=999;stunt.verificationTargets[0].x=999;
 assert.notEqual(c.anchorsByClass[0][0][0],999);assert.notEqual(c.stuntLayout.anchors[0][0],999);assert.notEqual(c.stuntLayout.verificationTargets[0].x,999);
 assert.throws(()=>createSourceTwilightCourse(),TypeError);
 assert.throws(()=>course({anchorsByClass:[]}),TypeError);
 assert.throws(()=>course({anchorsByClass:Array.from({length:4},()=>[[NaN,0]])}),TypeError);
});

test('exported source numbers and mutable course instances remain isolated',()=>{
 const a=course(),b=course();assert.ok(Object.isFrozen(TWILIGHT_NATIVE_GEOMETRY.rings[0]));
 assert.throws(()=>{TWILIGHT_NATIVE_GEOMETRY.rings[0][0]=999;},TypeError);
 a.boundary[0][0]=999;a.sourceRouteRowsByClass[0][0][0]=999;a.stuntLayout.rings[0].y=999;a.obstacles[0].x=999;
 a.raceRampsByClass[0][0].contactVolumes[0].axes[0][0]=999;
 assert.notEqual(b.boundary[0][0],999);assert.equal(b.sourceRouteRowsByClass[0][0][0],-200);assert.equal(b.stuntLayout.rings[0].y,-3);
 assert.notEqual(b.obstacles[0].x,999);assert.notEqual(b.raceRampsByClass[0][0].contactVolumes[0].axes[0][0],999);
 assert.equal(TWILIGHT_NATIVE_GEOMETRY.rings[0][0],-50);
});
