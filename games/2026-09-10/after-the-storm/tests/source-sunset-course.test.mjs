import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceSunsetCourse,SUNSET_NATIVE_GEOMETRY,sunsetSourceSelection,sunsetRampsForSelection,
 sunsetHazardsForSelection,sunsetMarkerSpheresForSelection,sunsetFixedSphereOrderForSelection,sunsetRollersForSelection} from '../source-sunset-course.js';
import {SUNSET_NATIVE_BOXES,sunsetFixedVolumes,sunsetRampVolumes,sunsetContactVolumes} from '../source-sunset-boxes.js';
import {volumeContact} from '../clipped-volumes.js';

// Independent source numeric observations; no ROM or private artifact is read.
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
const course=options=>createSourceSunsetCourse(polygonDistance,options);
const direction=degrees=>{const phase=Math.trunc(degrees*4096/360)&4095,a=phase*Math.PI*2/4096;return [Math.sin(a),Math.cos(a),phase];};
const buoyRows=[
 [[-473,-2756,1,196],[-1347,-4504,6,209],[-2778,-4847,7,324],[-3050,-3850,7,0],[-2460,-2105,0,0],[-3239,351,7,0],[-2616,1561,6,3],[-1833,4787,7,78],[743,4893,6,90],[2567,4746,1,89],[3920,3020,7,213],[2714,2677,7,270],[1848,2902,6,225],[624,2245,7,220]],
 [[-473,-2756,1,196],[-1347,-4504,6,209],[-2778,-4847,7,324],[-3050,-3850,7,0],[-2684,-1956,0,0],[-2873,313,7,0],[-2849,1603,6,3],[-1833,4787,1,78],[-343,4681,6,90],[1165,4809,1,90],[2453,4710,0,90],[3920,3020,7,213],[2730,2759,7,270],[1848,2902,6,225],[624,2245,7,220]],
 [[-473,-2756,1,196],[-1347,-4504,6,209],[-2778,-4847,7,324],[-3050,-3850,7,0],[-2961,-1856,0,0],[-2795,227,7,0],[-2929,1589,6,3],[-1833,4787,7,78],[-1400,4537,1,90],[-343,4681,6,90],[1167,4600,7,90],[2453,4710,0,90],[3920,3020,7,213],[2750,2850,7,270],[1848,2902,6,225],[624,2245,7,220]],
 [[624,2245,7,44],[1848,2902,0,119],[2742,2856,7,89],[2453,4710,0,270],[1174,4476,1,264],[-348,4722,0,273],[-1400,4522,1,270],[-2929,1589,0,174],[-2760,214,7,182],[-3050,-3850,1,170],[-1327,-4513,0,348],[-494,-2761,1,359]]
];

test('four primary classes retain 14/15/16/12 buoy centers, colors and quantized headings',()=>{
 const c=course();assert.deepEqual(c.sourceRouteRowsByClass.map(q=>q.length),[41,42,43,50]);
 buoyRows.forEach((rows,d)=>{
  assert.equal(c.buoysByClass[d].length,rows.length);
  rows.forEach(([x,z,type,heading],i)=>{
   const q=c.buoysByClass[d][i],[tx,tz,phase]=direction(heading);
   close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.phase4096,phase);assert.equal(q.nativeHeading,heading);
   assert.equal(q.nativeType,type);assert.equal(q.side,[0,6].includes(type)?1:-1);assert.deepEqual(c.sourceRouteRowsByClass[d][q.sourceRow],[x,z,type,heading]);
   assert.equal(q.width,undefined,'no finite colored-pass span is inferred');
  });
 });
 assert.equal(c.sourceMetadata.sourceNavRowsAreDrivingAnchors,false);
});

test('ordinary finish, Stunt start and native checkpoint admission metadata stay distinct',()=>{
 const c=course();c.finishGatesByClass.forEach((q,d)=>{
  close(q.x,200*S);close(q.z,900*S);assert.equal(q.width,12.5);assert.equal(q.nativeHeading,d===3?360:180);close(q.tx,0);close(q.tz,d===3?1:-1);
 });
 close(c.stuntLayout.startGate.x,120*S);close(c.stuntLayout.startGate.z,764*S);
 assert.equal(c.sourceOrdinaryProgress.forwardCheckpointSide,0);assert.equal(c.sourceOrdinaryProgress.checkpointSlackNative,1200);
 assert.deepEqual(c.sourceOrdinaryProgress.regionsNative,[[-30000,-1800,-30000,3950],[-30000,30000,3950,30000],[-1800,30000,-30000,3950]]);
 assert.equal(sunsetSourceSelection({difficulty:3}).reverse,true);assert.equal(sunsetSourceSelection({mode:'stunt',difficulty:0}).nativeClass,2);
 assert.equal(sunsetSourceSelection({mode:'stunt',playerCount:2}).nativeModeReachable,false,'the native Stunt menu selects one player');
});

test('distinct player companions yield 63 versus 47 real shoreline edges, including changed main shore',()=>{
 const c=course(),one=c.geometryForPlayers(1),two=c.geometryForPlayers(2);
 assert.equal(one.shoreContacts.edges.length,63);assert.equal(two.shoreContacts.edges.length,47);
 assert.deepEqual(one.sourceShores.map(q=>q.sourceEdgeCount),[49,7,7]);assert.deepEqual(two.sourceShores.map(q=>q.sourceEdgeCount),[47]);
 assert.ok([...one.sourceShores,...two.sourceShores].every(q=>q.sourceClosed&&q.outline.length===q.sourceEdgeCount));
 assert.ok(one.sourceShores[0].outline.some(([x,z])=>x===-740*S&&z===320*S));
 assert.ok(!two.sourceShores[0].outline.some(([x,z])=>x===-740*S&&z===320*S));
 assert.ok(two.sourceShores[0].outline.some(([x,z])=>x===-925*S&&z===296*S));
 assert.deepEqual(one.sourceShores[1].outline[0],[-3648*S,-2658*S]);
 assert.equal(one.sourceMooredCraft.length,2);assert.equal(two.sourceMooredCraft.length,0);assert.ok(one.sourceMooredCraft.every(q=>q.sourceStatic&&q.sourceHeight===null));
 assert.deepEqual(c.mooredBoats,[],'old invented bobbing-craft animation is not attached');
 assert.equal(c.boundary,undefined);assert.equal(c.stuntLayout.boundary,undefined);assert.equal(c.boundaryMarkers.length,81);
 assert.deepEqual(c.boundaryMarkers[0],[1201*S,1167*S]);assert.deepEqual(c.boundaryMarkers[80],[1101*S,667*S]);assert.equal(c.boundaryMetadata.nativeCourseOutRuleRecovered,true);assert.equal(c.boundaryMetadata.nativeCourseOutRuntimeAdmitted,false);
});

test('source shoreline normals retain independently observed water-side directions',()=>{
 const c=course(),fixtures=[[1,[-740,1320],[-740,320],[1,0]],[8,[-1650,-4410],[-1675,-4580],[.9893590212,-.1454939991]],
  [15,[3323,3715],[3225,3670],[.4172930121,-.9087719917]],[46,[-3648,-2658],[-3725,-2843],[.9232249856,-.3842610121]]];
 for(const [index,a,b,n]of fixtures){
  const shore=c.sourceShores.find(q=>q.sourceLineIndices.includes(index)),i=shore.sourceLineIndices.indexOf(index),p=shore.outline[i],q=shore.outline[(i+1)%shore.outline.length];
  assert.ok((p[0]===a[0]*S&&p[1]===a[1]*S)||(p[0]===b[0]*S&&p[1]===b[1]*S));
  const edge=c.shoreContacts.edges.find(e=>e.a===p&&e.b===q);assert.ok(edge);close(edge.normal.x,n[0],1e-6);close(edge.normal.z,n[1],1e-6);
 }
});

test('both player layouts share32 finite floor faces without extending them into an infinite land top',()=>{
 const c=course();assert.equal(c.iceSheets,undefined);assert.deepEqual(c.sourceMetadata.sourceCollisionPlaneCountsByPlayer,[32,32]);assert.equal(c.staticSurfaces.length,1);assert.equal(c.staticSurfaces[0].triangles.length,32);
 const samples=[[-1600,-3300,5.43498475005],[-1500,-3000,29.1992376288],[-1500,-2500,40.650340612],[-1200,-2200,14.8848573779],[-1000,-1500,51.0469067548],[-800,-1000,55.6430626827],[-600,-300,9.5945419705],[-500,500,14.5680303649],[-900,1200,79.8887153491],[-500,1200,12.0100368099]];
 for(const n of [1,2]){
  const g=c.geometryForPlayers(n);for(const [x,z,y]of samples)close(g.sourceFloor(x*S,z*S),y*S,.00005);
  assert.equal(g.sourceFloor(-300*S,1600*S),null);assert.equal(g.sourceFloor(1000,1000),null);assert.equal(g.ground(1000,1000),-8);
  assert.equal(g.sourceFloor(-1800*S,0),null);assert.equal(g.ground(-1800*S,0),-8);assert.equal(g.renderGround(-1800*S,0),3.2);
 }
 c.authoredBackground.visualLandHeight=5;assert.equal(c.renderGround(-1800*S,0),5);assert.equal(c.ground(-1800*S,0),-8);
 assert.equal(c.sourceFloor(-3725*S,-2500*S),null,'no filled boat collision deck is invented');
});

test('one ordinary jump and two Stunt jumps use the actual six finite volumes atY−24',()=>{
 const c=course();for(let d=0;d<4;d++){
  assert.equal(c.raceRampsByClass[d].length,1);const ramp=c.raceRampsByClass[d][0];assert.deepEqual(ramp.nativeRow,[-2796,-1652,0,0,360]);
  assert.equal(ramp.width,37.5);close(ramp.y,-24*S);assert.equal(ramp.contactVolumes.length,6);assert.ok(ramp.absoluteY&&ramp.fixed&&!ramp.floating);
  assert.equal(c.contactVolumesForRamps([ramp]).volumes.length,8);assert.equal(c.geometryForPlayers(2).contactVolumesForRamps([ramp]).volumes.length,6);
 }
 assert.deepEqual(c.stuntLayout.ramps.map(q=>q.nativeRow),[[-2898,-2202,0,0,2],[-1312,5070,0,0,89]]);
 assert.ok(c.stuntLayout.ramps.every(q=>q.sourceNativeClass===2&&q.width===37.5&&q.y===-24*S));
 assert.equal(c.contactVolumesForRamps(c.stuntLayout.ramps).volumes.length,14);assert.equal(c.geometryForPlayers(2).contactVolumesForRamps(c.stuntLayout.ramps).volumes.length,12);
 const first=c.raceRamps[0].contactVolumes[0];close(first.origin[0],-2046*S);close(first.origin[1],-22*S);close(first.origin[2],-1653*S);close(first.axes[0][2],-.3162280023097992);close(first.axes[0][1],.9486830234527588);
 assert.equal(first.sourceRecordAddress,'0x800d6cf0');assert.equal(first.flag,1);assert.equal(SUNSET_NATIVE_BOXES.rampProfiles.length,6);
 assert.ok(Math.abs(SUNSET_NATIVE_BOXES.rampProfiles[1].axes[0].reduce((sum,v,i)=>sum+v*SUNSET_NATIVE_BOXES.rampProfiles[1].axes[1][i],0))>.002,'nonorthogonal source intervals remain intact');
});

test('single-player crossbars retain finite overhead clearances and are entirely absent in2P',()=>{
 const bars=sunsetFixedVolumes();assert.equal(bars.length,2);assert.deepEqual(sunsetFixedVolumes({playerCount:2}),[]);
 const fixtures=[[[ -3625,90,592],[-1985,116,792]], [[-3645,90,-2608],[-2005,116,-2408]]];
 bars.forEach((q,i)=>{
  assert.equal(q.sourceRecordAddress,['0x800d77f0','0x800d7830'][i]);assert.equal(q.flag,0);
  const [low,high]=fixtures[i];low.forEach((v,k)=>close(q.bounds.min[k],v*S));high.forEach((v,k)=>close(q.bounds.max[k],v*S));
  const x=(low[0]+high[0])/2,z=(low[2]+high[2])/2;assert.ok(volumeContact(q,[x*S,100*S,z*S]));assert.equal(volumeContact(q,[x*S,89*S,z*S]),null);assert.equal(volumeContact(q,[x*S,117*S,z*S]),null);
 });
});

test('six fixedXYZ spheres and16 class-selected visible spheres do not become moving props',()=>{
 const c=course();assert.deepEqual(c.obstaclesByClass.map(q=>q.length),[6,22,22,22]);
 const fixed=[[-3050,0,4823],[-2775,0,5085],[4416,0,4103],[4416,0,3723],[-1955,0,-5808],[-1575,0,-5808]];
 for(let d=0;d<4;d++)for(const players of [1,2]){
  const a=c.hazardsForPlayers(players,100,{difficulty:d});assert.equal(a.filter(q=>!q.hidden).length,d===0?0:16);
  assert.deepEqual(a.filter(q=>q.runtimeTag===5).map(q=>[q.x,q.y,q.z]),fixed.map(p=>p.map(v=>v*S)));
  assert.ok(a.every(q=>q.fixed&&q.fixedSphere&&q.absoluteY&&!q.floating&&!q.followsWaterDatum&&q.y===0&&q.r===.625&&q.probeRadius===.3));
 }
 const stunt=sunsetHazardsForSelection({mode:'stunt'});assert.equal(stunt.length,6);assert.ok(stunt.every(q=>q.runtimeTag===5));
 assert.deepEqual(c.sourceMovingObjects,[]);assert.deepEqual(c.sourceObjectSelection.genericFiveShortCounts,[0,0]);assert.equal(c.sourceDynamicsReady,false);
 assert.deepEqual(c.sourceState8Override.ramps,[[-3038,1044,0,0,4]]);
});

test('81 marker spheres are a separate colliding family in exact visible→marker→hidden source order',()=>{
 const c=course();for(const mode of ['race','stunt'])for(const playerCount of [1,2]){
  const markers=sunsetMarkerSpheresForSelection({mode,playerCount,difficulty:2});assert.equal(markers.length,81);
  assert.ok(markers.every(q=>q.hidden&&q.sourceBoundaryMarker&&q.runtimeTag===1&&q.fixedSphere&&q.absoluteY&&q.y===0&&q.r===.625&&q.probeRadius===.3));
  assert.deepEqual(markers.map(q=>[q.x,q.z]),c.boundaryMarkers);
 }
 const normal=sunsetFixedSphereOrderForSelection(),hard=sunsetFixedSphereOrderForSelection({difficulty:1});assert.equal(normal.length,87);assert.equal(hard.length,103);
 assert.equal(normal[0].runtimeTag,1);assert.equal(normal[81].runtimeTag,5);assert.equal(hard[0].runtimeTag,2);assert.equal(hard[16].runtimeTag,1);assert.equal(hard[97].runtimeTag,5);
 assert.deepEqual(hard.map(q=>q.sourceColliderIndex),Array.from({length:103},(_,i)=>i));
 const first=normal[0];assert.deepEqual([first.x,first.y,first.z],[1201*S,0,1167*S]);
 close(first.r+first.probeRadius-Math.hypot(1231*S-first.x,first.y,1167*S-first.z),7*S);
 close(Math.hypot(1238*S-first.x,0,0),first.r+first.probeRadius);
 assert.ok(c.markerSpheresForPlayers(1,99).every(q=>q.y===0),'Sunset marker centers stay absolute even when a foreign datum is supplied');
});

test('class masks preserve the three prominent rollers plus the actual ordinary crossing generators',()=>{
 const c=course();assert.deepEqual(c.sourceRollersByClass.map(q=>q.length),[4,5,5,5]);assert.equal(c.sourceStuntRollers.length,3);
 const rows=[[1000,500,270,180,60,16,14,64,16,2,0,1,0],[900,-500,270,180,60,16,14,64,24,2,0,1,0],[800,-1500,270,180,60,16,14,64,32,2,0,1,0]];
 rows.forEach((row,i)=>{
  const q=c.sourceStuntRollers[i];assert.deepEqual(q.nativeRow,row);close(q.x,row[0]*S);close(q.z,row[1]*S);assert.equal(q.amplitudeNative,60);assert.equal(q.amplitudeWorld,1.5);
  close(q.crestStepNativeXZ[0],0);close(q.crestStepNativeXZ[1],-64);close(q.travelStepNativeXZ[0],-64);close(q.travelStepNativeXZ[1],0);
  assert.equal(q.crestSamples,16);assert.equal(q.travelSamples,14);assert.equal(q.phaseSpacingIndex,256);assert.equal(q.phaseAdvanceIndex,[-64,-96,-128][i]);assert.equal(q.cycleIndex,4096);assert.equal(q.windowStartIndex,0);assert.equal(q.windowEndIndex,2048);
  assert.ok(q.requiresNativeWaterLattice&&q.integrationReady);
 });
 assert.deepEqual(c.sourceRollersByClass[0].map(q=>q.sourceIndex),[0,1,2,3]);assert.deepEqual(c.sourceRollersByClass[1].map(q=>q.sourceIndex),[0,1,2,3,4]);
 assert.deepEqual(c.sourceRollersByClass[0][3].nativeRow,[-3650,2500,180,70,40,28,32,64,24,2,0,2,0]);
 assert.deepEqual(c.sourceRollersByClass[1][4].nativeRow,[-1000,4800,110,20,60,32,50,64,24,2,0,1,1]);
 assert.deepEqual(sunsetRollersForSelection({playerCount:1,difficulty:2}),sunsetRollersForSelection({playerCount:2,difficulty:2}));
 assert.equal(c.sourceWaterMetadata.rollerLatticeIntegrated,false);assert.equal(c.sourceWaterMetadata.lapTide,false);
});

test('nine rings retain absolute source heights and CP4/5/7/0 with15/15/10/10 limits',()=>{
 const s=course().stuntLayout,rows=[[131,60,-346,180],[-159,60,-1402,180],[-737,60,-2402,214],[-1472,60,-3516,203],[-2904,200,-1056,0],[-2904,100,-730,0],[1770,60,3160,239],[1213,60,2200,221],[94,60,1784,226]];
 assert.equal(s.rings.length,9);rows.forEach(([x,y,z,heading],i)=>{
  const q=s.rings[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.y,y*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.order,i);assert.equal(q.radius,2.8);assert.equal(q.depth,.8);assert.equal(q.probeHeight,.2);assert.ok(q.absoluteY&&!q.floating);
 });
 assert.deepEqual(s.checkpoints.map(q=>q.sourceRow),[4,5,7,0]);assert.deepEqual(s.checkpoints.map(q=>q.limit),[15,15,10,10]);assert.deepEqual(s.timerSeconds,[15,15,10,10]);
 [[-2887,-4374,1,20],[-2877,3092,1,20],[2712,4956,90,20],[120,764,180,12.5]].forEach(([x,z,heading,width],i)=>{
  const q=s.checkpoints[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.width,width);
 });
 assert.deepEqual(s.sourceGuideRows,[1,2,3,6,8,9]);assert.ok(s.sourceGuideRows.every(i=>s.sourceRouteRows[i][2]===8));assert.equal(s.sourceNativeClass,2);
});

test('navigation injection remains unready and cannot replace protected physical targets',()=>{
 const a=course();assert.equal(a.integrationReady,false);assert.equal(a.navigation.usable,false);assert.deepEqual(a.anchorsByClass,[[],[],[],[]]);assert.deepEqual(a.stuntLayout.anchors,[]);
 const anchors=Array.from({length:4},()=>[[0,20],[-60,-100],[-80,100]]),labels=anchors.map(q=>q.map(()=>null));
 const navigation={validated:true,boundary:[[-110,-150],[120,-150],[120,150],[-110,150]]};
 const stunt={anchorsWorld:[[3,19],[-60,-100],[-80,100]],verificationOnePass:true,verificationTargets:[{kind:'waypoint',x:-60,z:-100}],rings:[],ramps:[],checkpoints:[],timerSeconds:[999],startGate:{x:999}};
 const c=course({anchorsByClass:anchors,pilotAnchorsByClass:labels,navigation,stuntNavigation:stunt});
 assert.equal(c.integrationReady,false);assert.equal(c.navigation.validated,false);assert.equal(c.navigation.usable,true);assert.equal(c.sourceDynamicsReady,false);
 assert.equal(c.stuntLayout.rings.length,9);assert.equal(c.stuntLayout.ramps.length,2);assert.deepEqual(c.stuntLayout.timerSeconds,[15,15,10,10]);assert.notEqual(c.stuntLayout.startGate.x,999);
 assert.deepEqual(c.boundary,navigation.boundary);assert.equal(c.shoreContacts.edges.length,63);assert.equal(c.sourceMarkerSpheres.length,81);assert.equal(c.stuntLayout.verificationOnePass,true);
 anchors[0][0][0]=999;navigation.boundary[0][0]=999;stunt.anchorsWorld[0][0]=999;stunt.verificationTargets[0].x=999;
 assert.notEqual(c.anchors[0][0],999);assert.notEqual(c.boundary[0][0],999);assert.notEqual(c.stuntLayout.anchors[0][0],999);assert.notEqual(c.stuntLayout.verificationTargets[0].x,999);
});

test('factories isolate mutable facts and reject invalid geometry/navigation selections',()=>{
 const a=course(),b=course();assert.ok(Object.isFrozen(SUNSET_NATIVE_GEOMETRY.rings[0]));assert.ok(Object.isFrozen(SUNSET_NATIVE_BOXES.rampProfiles[0].axes[0]));
 a.buoysByClass[0][0].x=999;a.sourceMarkerSpheres[0].y=999;a.sourceShoresByPlayerCount[2][0].outline[0][0]=999;a.sourceRollers[0].nativeRow[0]=999;a.stuntLayout.ramps[0].contactVolumes[0].axes[0][0]=999;
 assert.notEqual(b.buoysByClass[0][0].x,999);assert.equal(b.sourceMarkerSpheres[0].y,0);assert.notEqual(b.sourceShoresByPlayerCount[2][0].outline[0][0],999);assert.notEqual(b.sourceRollers[0].nativeRow[0],999);assert.notEqual(b.stuntLayout.ramps[0].contactVolumes[0].axes[0][0],999);
 assert.throws(()=>createSourceSunsetCourse(),TypeError);assert.throws(()=>course({anchorsByClass:[]}),TypeError);assert.throws(()=>course({anchorsByClass:Array.from({length:4},()=>[[NaN,0]])}),TypeError);assert.throws(()=>course({navigation:{boundary:[[0,0],[1,0]]}}),TypeError);
 assert.throws(()=>sunsetSourceSelection({difficulty:4}),RangeError);assert.throws(()=>sunsetMarkerSpheresForSelection({playerCount:3}),RangeError);assert.throws(()=>a.geometryForPlayers(3),RangeError);assert.throws(()=>a.hazardsForPlayers(1,NaN),TypeError);
 assert.throws(()=>sunsetFixedVolumes({playerCount:0}),RangeError);assert.throws(()=>sunsetRampVolumes({x:0,z:0,tx:0,tz:0}),TypeError);assert.throws(()=>sunsetContactVolumes(null),TypeError);
 assert.equal(sunsetRampsForSelection({mode:'stunt'}).length,2);
});
