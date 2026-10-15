import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceSunnyCourse,SUNNY_NATIVE_GEOMETRY,sunnySourceSelection,sunnyRampsForSelection,sunnyHazardsForSelection,sunnyDecorationsForSelection} from '../source-sunny-course.js';
import {SUNNY_NATIVE_BOXES,sunnyRampVolumes,sunnyContactVolumes} from '../source-sunny-boxes.js';
import {volumeContact} from '../clipped-volumes.js';

// Independent raw numeric observations from the user's USA Rev1 reference.
// No ROM, original artwork, or private extraction files are required at runtime.
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
const course=options=>createSourceSunnyCourse(polygonDistance,options);
const direction=degrees=>{const a=(Math.trunc(degrees*4096/360)&4095)*Math.PI*2/4096;return [Math.sin(a),Math.cos(a)];};
const buoyRows=[
 [[2032,1220,1,90],[4486,1051,6,90],[6320,-950,7,226],[4730,-1240,7,273],[3203,-780,6,270],[1540,-1440,1,270],[-160,-1000,6,267],[-1029,-1152,7,270],[-3662,-984,6,269],[-5078,-1181,7,270],[-6236,952,7,49],[-5013,1055,1,90],[-3276,768,6,90]],
 [[2032,1220,1,90],[4486,1051,6,90],[6320,-950,7,226],[4710,-980,1,270],[3220,-982,0,270],[1540,-1440,1,270],[-160,-1140,0,270],[-1000,-1230,7,270],[-3642,-1193,0,270],[-5070,-940,7,270],[-6247,933,7,37],[-5013,1055,1,90],[-3301,972,6,90]],
 [[2032,1220,1,90],[4486,1051,6,90],[6320,-950,7,226],[4710,-980,1,270],[3220,-982,0,270],[1540,-1440,1,270],[-160,-1140,0,270],[-1000,-1230,7,270],[-3642,-1193,6,270],[-5070,-940,7,270],[-6385,751,7,37],[-4995,814,1,90],[-3254,1112,6,90]],
 [[-3282,1118,6,269],[-5004,786,7,246],[-5093,-967,7,92],[-3642,-1208,6,90],[-996,-1227,7,92],[-149,-1149,6,89],[1548,-1453,7,88],[3208,-983,6,86],[4714,-986,7,90],[4457,1061,0,265],[2003,1229,7,271]]
];

test('four classes retain every visible source center, side and quantized heading',()=>{
 const c=course();assert.deepEqual(c.buoysByClass.map(q=>q.length),[13,13,13,11]);
 assert.deepEqual(c.sourceRouteRowsByClass.map(q=>q.length),[59,55,57,55]);
 buoyRows.forEach((rows,difficulty)=>rows.forEach(([x,z,type,heading],i)=>{
  const q=c.buoysByClass[difficulty][i],[tx,tz]=direction(heading);
  close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);
  assert.equal(q.nativeType,type);assert.equal(q.nativeHeading,heading);assert.equal(q.side,[0,6].includes(type)?1:-1);
  assert.equal(q.width,undefined,'142 native is not a recovered finite colored-buoy span');
  assert.deepEqual(c.sourceRouteRowsByClass[difficulty][q.sourceRow],[x,z,type,heading]);
 }));
 assert.deepEqual(c.sourceMetadata.sourceNativeClassByDifficulty,[0,1,2,2]);
 assert.ok(c.recordMetadataByClass.every(q=>!q.browserFallback));
});

test('Sunny ordinary finishes keep the1000 native fullspan, including Reverse',()=>{
 const c=course();
 for(let i=0;i<4;i++){
  const q=c.finishGatesByClass[i],[tx,tz]=direction(i===3?270:90);
  close(q.x,(i===3?-1821:-1790)*S);close(q.z,(i===3?831:780)*S);
  close(q.tx,tx);close(q.tz,tz);assert.equal(q.width,12.5);assert.equal(q.side,0);
 }
 assert.equal(c.stuntLayout.startGate.width,12.5);
});

test('20 closed sandbar edges and29 open coast edges retain source water normals',()=>{
 const c=course();assert.deepEqual(c.sourceShores.map(q=>q.sourceEdgeCount),[20,29]);
 assert.deepEqual(c.sourceShores.map(q=>q.sourceClosed),[true,false]);
 assert.equal(c.shoreContacts.edges.length,49);
 const coast=c.sourceShores[1];assert.equal(coast.outline.length,30);assert.equal(coast.solidInteriorDefined,false);
 assert.deepEqual(coast.outline[0],[-14549*S,3865*S]);assert.deepEqual(coast.outline[29],[15600*S,-1000*S]);
 assert.ok(!c.shoreContacts.edges.some(q=>q.a===coast.outline[29]&&q.b===coast.outline[0]),'no closing coast contact');
 const fixtures=[
  [1,[-5750,25],[-5700,75],[-.7071070075,.7071070075]],
  [8,[5300,-175],[-5300,-175],[0,-1]],
  [21,[-8102,400],[-8591,522],[-.242069006,-.970259011]],
  [41,[15600,-1000],[13636,-1000],[0,-1]],
  [43,[7800,-867],[7800,530],[-1,0]]
 ];
 for(const [line,a,b,n] of fixtures){
  const shore=c.sourceShores.find(q=>q.sourceLineIndices.includes(line)),i=shore.sourceLineIndices.indexOf(line),p=shore.outline[i],q=shore.outline[(i+1)%shore.outline.length];
  assert.ok((p[0]===a[0]*S&&p[1]===a[1]*S)||(p[0]===b[0]*S&&p[1]===b[1]*S));
  const edge=c.shoreContacts.edges.find(e=>e.a===p&&e.b===q);assert.ok(edge);close(edge.normal.x,n[0],1e-6);close(edge.normal.z,n[1],1e-6);
 }
 assert.equal(c.boundary,undefined,'neither openchain is silently filled as a gameplay polygon');
 assert.equal(c.stuntLayout.boundary,undefined);
 assert.equal(c.boundaryMarkers.length,39);assert.deepEqual(c.boundaryMarkers[0],[6800*S,-2000*S]);assert.deepEqual(c.boundaryMarkers[38],[-6999*S,399*S]);
 assert.equal(c.boundaryMetadata.sourceMarkerChainClosed,false);assert.equal(c.boundaryMetadata.nativeCourseOutRuleRecovered,false);
});

test('231 finite upward sand faces match independent source grid samples',()=>{
 const c=course();assert.equal(c.iceSheets,undefined);assert.equal(c.staticSurfaces.length,1);
 const floor=c.staticSurfaces[0];assert.equal(floor.triangles.length,231);assert.equal(floor.sourcePlaneIndices.length,231);
 assert.equal(c.sourceMetadata.sourceCollisionPlaneCount,231);
 for(const [x,z,y]of [[0,0,20],[0,-1100,-50],[-6200,0,-43.0000547090],[-5700,500,-34.3099001545],[5500,-500,-28.6416108094],[6200,1700,3.4323869213]])close(c.sourceFloor(x*S,z*S),y*S,.001);
 assert.equal(c.sourceFloor(0,-1700*S),null,'no infinite fallback extends a finite collision face');
 assert.equal(c.sourceFloor(1000,1000),null);assert.equal(c.ground(1000,1000),-8);
 for(const tri of floor.triangles){
  assert.ok(tri.flat().every(Number.isFinite));
  const center=[0,1,2].map(k=>tri.reduce((sum,p)=>sum+p[k],0)/3),height=floor.heightAt(center[0],center[2]);
  assert.notEqual(height,null);assert.ok(height>=center[1]-1e-7);
 }
 close(c.ground(0,0),.5);assert.equal(c.landGround(0,0),-8);
 c.authoredBackground.visualSandHeight=4;
 close(c.renderGround(0,0),4);assert.equal(c.ground(0,0),.5,'visual sand is separate from physical source floor');
 assert.equal(c.sourceWaterMetadata.lapTide,false);
});

test('class-visible spheres and four fixed XYZ spheres use exact player and Stunt families',()=>{
 const c=course();assert.deepEqual(c.obstaclesByClass.map(q=>q.length),[43,46,48,48]);
 for(let d=0;d<4;d++){
  const one=c.hazardsForPlayers(1,-3,{difficulty:d}),two=c.hazardsForPlayers(2,4,{difficulty:d});
  assert.deepEqual(one,two);assert.equal(one.filter(q=>!q.hidden).length,[0,3,5,5][d]);
  assert.ok(one.every(q=>q.sourceFixedSphere&&q.fixedSphere&&q.fixed&&!q.followsWaterDatum&&q.r===.625));one.forEach(q=>close(q.probeRadius,.3));
  const markers=one.filter(q=>q.sourceBoundaryMarker);assert.equal(markers.length,39);assert.deepEqual(markers.map(q=>[q.x,q.z]),c.boundaryMarkers);
  assert.ok(markers.every(q=>q.hidden&&q.runtimeTag===1&&q.absoluteY&&q.y===0));
  assert.ok(one.slice([0,3,5,5][d],[0,3,5,5][d]+39).every(q=>q.sourceBoundaryMarker));assert.ok(one.slice(-4).every(q=>q.runtimeTag===5));
 }
 const fixed=c.obstacles.filter(q=>q.runtimeTag===5);assert.deepEqual(fixed.map(q=>[q.x,q.y,q.z]),[[7582,23,292],[7483,18,659],[-7136,20,779],[-7272,13,424]].map(q=>q.map(v=>v*S)));
 assert.ok(fixed.every(q=>q.runtimeTag===5));
 assert.deepEqual(c.obstaclesByClass[1].filter(q=>!q.hidden).map(q=>[q.x,q.z]),[[-2332,-1648],[-2332,-1136],[-2332,-613]].map(q=>q.map(v=>v*S)));
 assert.equal(c.obstaclesByClass[3].filter(q=>q.runtimeTag===3).length,2,'City-specific Reverse exclusion does not affect Sunny');
 const stunt=c.hazardsForPlayers.call({...c,difficulty:0,stunt:true},1);
 assert.equal(stunt.length,47);assert.equal(stunt.filter(q=>!q.hidden).length,4);assert.ok(stunt.filter(q=>!q.hidden).every(q=>q.runtimeTag===3));assert.equal(stunt.filter(q=>q.sourceBoundaryMarker).length,39);
 assert.deepEqual(stunt.slice(0,4).map(q=>[q.x,q.z]),[[-3060,-1415],[-3379,-897],[-3385,-1434],[-3080,-904]].map(q=>q.map(v=>v*S)));
 assert.equal(c.sourceObjectSelection.movingSphereCount,0);
});

test('sixteen static render-only placements are active in1P including Stunt and absent in2P',()=>{
 const c=course(),one=sunnyDecorationsForSelection(),two=sunnyDecorationsForSelection({playerCount:2});
 assert.equal(one.length,16);assert.deepEqual(two,[]);assert.equal(sunnyDecorationsForSelection({mode:'stunt'}).length,16);
 assert.deepEqual(one[0].nativeXYZ,[3350,20,0]);assert.equal(one[0].sourceType,10);assert.equal(one[0].sourceVariant,0);
 assert.deepEqual(one[15].nativeXYZ,[-3500,20,100]);assert.equal(one[15].sourceVariant,8);
 assert.ok(one.every(q=>q.runtimeKind===11&&!q.collision&&q.fixed&&q.visualIdentity==='unassigned-modern-decoration'));
 assert.deepEqual(c.sourceObjectSelection.genericFiveShortCounts,[16,16]);assert.deepEqual(c.sourceObjectSelection.activeRenderOnlyCounts,[16,0]);
 assert.equal(c.decorationsForPlayers.call({...c,stunt:true},1).length,16);assert.equal(c.decorationsForPlayers(2).length,0);
});

test('twelve absolute rings and CP5/10/16/0 retain15/15/15/10 source limits',()=>{
 const s=course().stuntLayout;
 const rows=[[445,60,1298,90],[3254,60,980,90],[5272,60,1130,90],[4458,60,-1399,270],[2453,60,-894,270],[1383,60,-1427,270],[-3087,60,-1144,270],[-3393,60,-1148,270],[-5426,60,-707,270],[-4881,60,774,90],[-3578,60,1266,90],[-2882,60,795,90]];
 assert.equal(s.rings.length,12);
 rows.forEach(([x,y,z,heading],i)=>{const q=s.rings[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.y,y*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.order,i);assert.equal(q.floating,false);assert.equal(q.absoluteY,true);assert.equal(q.radius,2.8);assert.equal(q.depth,.8);assert.equal(q.probeHeight,.2);});
 assert.deepEqual(s.checkpoints.map(q=>q.sourceRow),[5,10,16,0]);assert.deepEqual(s.checkpoints.map(q=>q.limit),[15,15,15,10]);assert.deepEqual(s.timerSeconds,[15,15,15,10]);
 [[6402,-9,180,20],[64,-1176,270,20],[-5956,51,0,20],[-1790,780,90,12.5]].forEach(([x,z,heading,width],i)=>{const q=s.checkpoints[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.width,width);});
 assert.equal(s.sourceRouteRows.length,20);assert.equal(s.sourceGuideRows.length,16);assert.ok(s.sourceGuideRows.every(i=>[9,11].includes(s.sourceRouteRows[i][2])));
 assert.equal(s.sourceNativeClass,2);assert.equal(sunnySourceSelection({mode:'stunt',difficulty:0}).nativeClass,2);
});

test('ordinary races have no ramp while Stunt uses six finite volumes at nativeY−24',()=>{
 const c=course();assert.ok(c.raceRampsByClass.every(q=>q.length===0));assert.deepEqual(c.raceRamps,[]);
 assert.equal(c.stuntLayout.ramps.length,1);const ramp=c.stuntLayout.ramps[0];
 assert.deepEqual(ramp.nativeRow,[-619,-1065,0,0,270]);close(ramp.x,-619*S);close(ramp.y,-24*S);close(ramp.z,-1065*S);
 assert.equal(ramp.sourceVariant,0);assert.equal(ramp.sourceNativeClass,2);assert.equal(ramp.sourcePhysicsFlag,0);
 assert.equal(ramp.width,37.5);assert.equal(ramp.floating,false);assert.equal(ramp.sourceVolumeProfile,true);assert.equal(ramp.contactVolumes.length,6);
 const solids=c.contactVolumesForRamps(c.stuntLayout.ramps);assert.equal(solids.volumes.length,6);assert.equal(c.contactVolumesForRamps([]).volumes.length,0);
 assert.ok(solids.volumes.every(q=>q.flag===1&&q.kind==='ramp'));
 const first=solids.volumes[0];close(first.origin[0],-618*S);close(first.origin[1],-22*S);close(first.origin[2],-315*S);
 close(first.bounds.min[2],-1815*S);close(first.bounds.max[2],-315*S);
 const hit=volumeContact(first,[-400*S,-100*S,-1065*S]);assert.ok(hit);close(hit.normal.x,.3162280023097992);close(hit.normal.y,.9486830234527588);
 close(hit.penetration,(-218*.3162280023097992+78*.9486830234527588)*S);
 assert.equal(volumeContact(first,[-400*S,-100*S,-314*S]),null,'finite width excludes points beyond the side');
 assert.equal(SUNNY_NATIVE_BOXES.fixed.length,0);assert.equal(SUNNY_NATIVE_BOXES.rampProfiles.length,6);
 assert.deepEqual(SUNNY_NATIVE_BOXES.rampProfiles[1].origin,[-750,-127,-737]);
 assert.ok(Math.abs(SUNNY_NATIVE_BOXES.rampProfiles[1].axes[0].reduce((sum,v,i)=>sum+v*SUNNY_NATIVE_BOXES.rampProfiles[1].axes[1][i],0))>.002,'source axes must not be orthogonalized');
 assert.deepEqual(sunnyRampsForSelection({mode:'stunt',playerCount:1}),sunnyRampsForSelection({mode:'stunt',playerCount:2}));
 assert.equal(c.sourceState8Override.ramps.length,2);assert.equal(c.sourceState8Override.spheres.length,2,'special-state tables stay separate from live selections');
});

test('navigation injection stays unready and cannot replace source geometry or score targets',()=>{
 const none=course();assert.equal(none.integrationReady,false);assert.equal(none.navigation.usable,false);assert.deepEqual(none.anchorsByClass,[[],[],[],[]]);assert.deepEqual(none.stuntLayout.anchors,[]);
 const anchors=Array.from({length:4},()=>[[-40,20],[20,25],[160,0]]),pilot=anchors.map(q=>q.map(()=>null));
 const navigation={validated:true,boundary:[[-180,-50],[200,-50],[200,80],[-180,80]]};
 const stunt={anchorsWorld:[[-44,19],[12,32],[160,0]],verificationOnePass:true,verificationTargets:[{kind:'waypoint',x:12,z:32}],rings:[],ramps:[],checkpoints:[],timerSeconds:[999],startGate:{x:999}};
 const c=course({anchorsByClass:anchors,pilotAnchorsByClass:pilot,stuntNavigation:stunt,navigation});
 assert.equal(c.integrationReady,false);assert.equal(c.navigation.validated,false);assert.equal(c.navigation.usable,true);assert.equal(c.stuntLayout.verificationOnePass,true);
 assert.equal(c.stuntLayout.rings.length,12);assert.equal(c.stuntLayout.ramps.length,1);assert.deepEqual(c.stuntLayout.timerSeconds,[15,15,15,10]);assert.notEqual(c.stuntLayout.startGate.x,999);
 assert.deepEqual(c.boundary,navigation.boundary);assert.equal(c.shoreContacts.edges.length,49,'authored envelope adds no source shore contacts');
 anchors[0][0][0]=999;navigation.boundary[0][0]=999;stunt.anchorsWorld[0][0]=999;stunt.verificationTargets[0].x=999;
 assert.notEqual(c.anchors[0][0],999);assert.notEqual(c.boundary[0][0],999);assert.notEqual(c.stuntLayout.anchors[0][0],999);assert.notEqual(c.stuntLayout.verificationTargets[0].x,999);
});

test('factories isolate mutable state and reject invalid selections or navigation',()=>{
 const a=course(),b=course();assert.ok(Object.isFrozen(SUNNY_NATIVE_GEOMETRY.rings[0]));assert.ok(Object.isFrozen(SUNNY_NATIVE_BOXES.rampProfiles[0].axes[0]));
 a.sourceRouteRowsByClass[0][0][0]=999;a.buoysByClass[0][0].x=999;a.obstacles[0].y=999;a.sourceShores[0].outline[0][0]=999;a.stuntLayout.ramps[0].contactVolumes[0].axes[0][0]=999;
 assert.equal(b.sourceRouteRowsByClass[0][0][0],-1790);assert.notEqual(b.buoysByClass[0][0].x,999);assert.notEqual(b.obstacles[0].y,999);assert.notEqual(b.sourceShores[0].outline[0][0],999);assert.notEqual(b.stuntLayout.ramps[0].contactVolumes[0].axes[0][0],999);
 assert.throws(()=>createSourceSunnyCourse(),TypeError);assert.throws(()=>course({anchorsByClass:[]}),TypeError);assert.throws(()=>course({anchorsByClass:Array.from({length:4},()=>[[NaN,0]])}),TypeError);
 assert.throws(()=>course({navigation:{boundary:[[0,0],[1,0]]}}),TypeError);assert.throws(()=>sunnySourceSelection({difficulty:4}),RangeError);assert.throws(()=>sunnyHazardsForSelection({playerCount:3}),RangeError);assert.throws(()=>sunnyDecorationsForSelection({playerCount:3}),RangeError);
 assert.throws(()=>a.hazardsForPlayers(1,NaN),TypeError);assert.throws(()=>sunnyRampVolumes({x:0,z:0,tx:0,tz:0}),TypeError);assert.throws(()=>sunnyContactVolumes(null),TypeError);
});
