import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourcePortCourse,PORT_NATIVE_GEOMETRY,portSourceSelection,portRampsForSelection,portDynamicObjectsForSelection} from '../source-port-course.js';
import {PORT_NATIVE_BOXES,portRampProfile,portFixedVolumes,portRampVolumes,portContactVolumes} from '../source-port-boxes.js';
import {volumeContact} from '../clipped-volumes.js';

// Independent numeric observations from the user's USA Rev1 reference.
// These tests have no ROM, original artwork, or private-file dependency.
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
const course=options=>createSourcePortCourse(polygonDistance,options);
const direction=degrees=>{const phase=Math.trunc(degrees*4096/360)&4095,a=phase*Math.PI*2/4096;return [Math.sin(a),Math.cos(a),phase];};
const normalBuoys=[[-5000,-750,0,180],[-4750,-2500,1,180],[-4167,-3681,7,158],[-3195,-4756,1,90],[-1166,966,0,312],[-1450,1750,0,0],[-1450,2750,0,0],[-5000,5250,0,180]];
const harderBuoys=[...normalBuoys.slice(0,7),[-4496,5382,0,180],[-4439,4516,1,182]];
const reverseBuoys=[[-4618,4486,1,1],[-4000,5346,0,20],[-1450,2750,6,180],[-1450,1750,6,180],[-1331,739,6,125],[-3195,-4756,7,269],[-4167,-3681,7,329],[-4750,-2500,1,349],[-5000,-750,0,353]];

test('four primary classes preserve 8/9/9/9 colored buoys and native quantized headings',()=>{
 const c=course();assert.deepEqual(c.sourceRouteRowsByClass.map(q=>q.length),[45,46,46,55]);
 const fixtures=[normalBuoys,harderBuoys,harderBuoys,reverseBuoys];
 fixtures.forEach((rows,d)=>{
  assert.equal(c.buoysByClass[d].length,rows.length);
  rows.forEach(([x,z,type,heading],i)=>{
   const buoy=c.buoysByClass[d][i],[tx,tz,phase]=direction(heading);
   close(buoy.x,x*S);close(buoy.z,z*S);close(buoy.tx,tx);close(buoy.tz,tz);
   assert.equal(buoy.side,[0,6].includes(type)?1:-1);assert.equal(buoy.nativeType,type);assert.equal(buoy.phase4096,phase);
   assert.deepEqual(c.sourceRouteRowsByClass[d][buoy.sourceRow],[x,z,type,heading]);
   assert.equal(buoy.width,undefined,'a finite colored-pass span has not been recovered');
  });
 });
 assert.deepEqual(c.sourceSecondaryRouteRowsByClass.map(q=>q.length),[45,46,46,55]);
 assert.deepEqual(c.sourceSecondaryRouteRowsByClass[0],c.sourceRouteRowsByClass[0]);
 assert.notDeepEqual(c.sourceSecondaryRouteRowsByClass[1],c.sourceRouteRowsByClass[1],'secondary AI routes are not substituted for the primary progression path');
 assert.deepEqual(c.sourceRouteRowsByClass[3][54],[-4562,2294,11,0]);
 assert.equal(c.sourceMetadata.sourceNavRowsAreDrivingAnchors,false);
});

test('ordinary finishes, directional admission metadata, and Stunt start remain distinct',()=>{
 const c=course();
 c.finishGatesByClass.forEach((q,i)=>{
  close(q.x,-4576*S);close(q.z,3248*S);assert.equal(q.width,12.5);
  assert.equal(q.nativeHeading,i===3?360:180);close(q.tx,0);close(q.tz,i===3?1:-1);
 });
 close(c.stuntLayout.startGate.x,-4552*S);close(c.stuntLayout.startGate.z,104*S);assert.equal(c.stuntLayout.startGate.nativeHeading,180);
 assert.equal(c.sourceOrdinaryProgress.forward1f90,1);assert.equal(c.sourceOrdinaryProgress.reverse1f90,0);assert.equal(c.sourceOrdinaryProgress.checkpointSlackNative,256);
 assert.deepEqual(c.sourceOrdinaryProgress.regionsNative,[[-30000,-600,-30000,-1250],[-3750,30000,-3250,27500],[-3750,30000,-30000,-1250],[-30000,-2000,-3250,27500]]);
});

test('player-specific shore data preserves 117/109 edges and the open 29-edge coast',()=>{
 const c=course(),one=c.geometryForPlayers(1),two=c.geometryForPlayers(2);
 assert.equal(one.shoreContacts.edges.length,117);assert.equal(two.shoreContacts.edges.length,109);
 assert.equal(one.sourceShores.length,10);assert.equal(two.sourceShores.length,8);
 assert.deepEqual(c.sourceMetadata.sourceShoreSegmentCounts,[117,109]);
 for(const g of [one,two]){
  const open=g.sourceShores.filter(q=>q.sourceClosed===false);assert.equal(open.length,1);assert.equal(open[0].outline.length,30);assert.equal(open[0].sourceEdgeCount,29);
  assert.deepEqual(open[0].outline[0],[-2000*S,200*S]);assert.deepEqual(open[0].outline[29],[-1900*S,100*S]);
  assert.equal(g.shoreContacts.edges.filter(q=>q.id===open[0].id).length,29);
  assert.ok(!g.shoreContacts.edges.some(e=>e.a===open[0].outline[29]&&e.b===open[0].outline[0]),'no synthetic closing shore');
 }
 const removed=['port-block--5900--150','port-block--5900--4150'];
 for(const id of removed){assert.ok(one.sourceShores.some(q=>q.id===id));assert.ok(!two.sourceShores.some(q=>q.id===id));}
 const oneClosed=one.sourceShores.filter(q=>q.sourceClosed).map(q=>q.sourceEdgeCount).sort((a,b)=>a-b);
 assert.deepEqual(oneClosed,[4,4,4,4,4,4,4,28,32]);
 assert.equal(c.boundary,undefined);assert.equal(c.stuntLayout.boundary,undefined);
 assert.equal(c.boundaryMarkers.length,51);assert.deepEqual(c.boundaryMarkers[0],[-6000*S,-1750*S]);assert.deepEqual(c.boundaryMarkers[50],[-6000*S,-1250*S]);
 assert.deepEqual(c.boundaryMarkers.slice(0,3),[[-6000,-1750],[-6000,-2750],[-6000,-2250]].map(q=>q.map(v=>v*S)),'storage order is retained even where it backtracks');
 assert.equal(c.boundaryMetadata.sourceOrderIsPolygon,false);assert.equal(c.boundaryMetadata.cyclicOrderInferred,false);
});

test('independent shore normals face the source water side in both player layouts',()=>{
 const c=course();
 const fixtures=[
  [1,1,[4100,-450],[4500,-450],[0,1]],
  [1,5,[2600,-4750],[-1000,-4750],[0,-1]],
  [1,8,[-1900,4000],[-1900,100],[1,0]],
  [1,43,[-2000,200],[550,200],[0,1]],
  [1,74,[2600,-5550],[2700,-5650],[Math.SQRT1_2,Math.SQRT1_2]],
  [2,1,[3700,-5650],[5300,-4050],[-Math.SQRT1_2,Math.SQRT1_2]],
  [2,10,[2600,-4750],[-1000,-4750],[0,-1]],
  [2,19,[-1900,4000],[-1900,100],[1,0]],
  [2,41,[-2000,200],[550,200],[0,1]]
 ];
 for(const [players,line,a,b,n] of fixtures){
  const g=c.geometryForPlayers(players),shore=g.sourceShores.find(q=>q.sourceLineIndices.includes(line)),i=shore.sourceLineIndices.indexOf(line),p=shore.outline[i],q=shore.outline[(i+1)%shore.outline.length];
  assert.ok((p[0]===a[0]*S&&p[1]===a[1]*S)||(p[0]===b[0]*S&&p[1]===b[1]*S));
  const edge=g.shoreContacts.edges.find(e=>e.a===p&&e.b===q);assert.ok(edge);close(edge.normal.x,n[0],1e-6);close(edge.normal.z,n[1],1e-6);
 }
});

test('inactive 3D grids produce no fabricated finite floors or filled open coast',()=>{
 const c=course();assert.equal(c.iceSheets,undefined);assert.deepEqual(c.sourceMetadata.activeGrid3DByPlayerCount,[0,0]);
 for(const players of [1,2]){
  const g=c.geometryForPlayers(players);assert.deepEqual(g.staticSurfaces,[]);
  for(const [x,z] of [[0,0],[4300,-650],[-5700,50],[100000,-100000]]){
   assert.equal(g.sourceFloor(x*S,z*S),null);assert.equal(g.ground(x*S,z*S),-8);assert.equal(g.landGround(x*S,z*S),-8);
  }
  assert.equal(g.renderGround(4300*S,-650*S),2.5,'closed visual quay top is explicitly authored');
  assert.equal(g.renderGround(-3000*S,3000*S),-8,'the open coast is not filled into a visual or physical polygon');
 }
 assert.equal(c.geometryForPlayers(1).renderGround(-5700*S,50*S),2.5);
 assert.equal(c.geometryForPlayers(2).renderGround(-5700*S,50*S),-8,'two removed western blocks also disappear from visual height policy');
 c.authoredBackground.visualQuayHeight=4;assert.equal(c.renderGround(4300*S,-650*S),4);assert.equal(c.ground(4300*S,-650*S),-8);
});

test('three ordinary jumps select the five-volume 500/1000/1500/500 native-width profiles',()=>{
 const c=course(),rows=[[-900,4550,0,0,0],[-1250,4950,0,0,0],[-2100,5350,0,0,0]],addresses=['0x800d73b0','0x800d7270','0x800d7130','0x800d73b0'];
 for(let d=0;d<4;d++){
  const ramps=c.raceRampsByClass[d];assert.equal(ramps.length,3);assert.deepEqual(ramps.map(q=>q.nativeRow),rows);
  assert.ok(ramps.every(q=>q.width===[12.5,25,37.5,12.5][d]&&q.y===0&&q.absoluteY&&q.fixed&&!q.floating&&q.sourcePhysicsFlag===0));
  assert.ok(ramps.every(q=>q.contactVolumes.length===5&&q.contactVolumes[0].sourceRecordAddress===addresses[d]));
  assert.equal(c.contactVolumesForRamps(ramps).volumes.length,[17,15,17,17][d]);
  assert.deepEqual(portRampsForSelection({difficulty:d,playerCount:1}),portRampsForSelection({difficulty:d,playerCount:2}));
 }
 const first=c.raceRamps[0].contactVolumes[0];
 close(first.origin[0],-650*S);close(first.origin[1],-24*S);close(first.origin[2],5195*S);
 close(first.axes[0][1],-.8091040253639221);close(first.axes[0][2],.5876650214195251);close(first.spans[2],12.5);
 assert.ok(Math.abs(PORT_NATIVE_BOXES.profiles[0][0].axes[0].reduce((sum,v,i)=>sum+v*PORT_NATIVE_BOXES.profiles[0][0].axes[1][i],0))>.002,'slightly nonorthogonal projection axes must remain intact');
 assert.deepEqual(PORT_NATIVE_BOXES.profiles[2][1].origin,[-750,81,-507]);
 assert.deepEqual(PORT_NATIVE_BOXES.profiles[2][4].origin,[750,-63,398]);
 assert.equal(portRampProfile(2,{reverse:true}),PORT_NATIVE_BOXES.profiles[0]);
});

test('supplementary class solids have finite height and exact source extents',()=>{
 const normal=portFixedVolumes(),hard=portFixedVolumes({nativeClass:1}),expert=portFixedVolumes({nativeClass:2});
 assert.equal(hard.length,0);assert.deepEqual(normal.map(q=>q.sourceRecordAddress),['0x800d7770','0x800d77b0']);assert.deepEqual(expert.map(q=>q.sourceRecordAddress),['0x800d76f0','0x800d7730']);
 const fixtures=[
  [normal[0],[700,-100,-150],[1400,250,-100]],
  [normal[1],[-950,-100,-4500],[-900,250,-3900]],
  [expert[0],[1400,-100,450],[1600,550,1150]],
  [expert[1],[-950,-100,-5350],[-750,550,-4750]]
 ];
 for(const [solid,low,high] of fixtures){
  low.forEach((v,i)=>close(solid.bounds.min[i],v*S));high.forEach((v,i)=>close(solid.bounds.max[i],v*S));
  assert.ok(volumeContact(solid,low.map((v,i)=>(v+high[i])*S/2)));
  assert.equal(volumeContact(solid,[(low[0]+high[0])*S/2,(high[1]+1)*S,(low[2]+high[2])*S/2]),null,'no infinite vertical extrusion');
 }
 assert.deepEqual(portFixedVolumes({nativeClass:2,stunt:true}).map(q=>q.sourceRecordAddress),['0x800d7770','0x800d77b0']);
});

test('twelve buoyant objects stay dynamic definitions rather than frozen sphere hazards',()=>{
 const c=course(),rows=[[3600,0,600,8,0],[-4100,0,-5200,8,60],[-5000,0,-3350,8,60],[-4850,0,-4100,8,180],[4500,0,-2350,8,90],[4243,0,-1875,8,60],[2850,0,-4100,8,90],[4150,0,-4400,8,270],[-1350,0,-4600,8,150],[-2737,0,-5602,8,15],[-3700,0,-5800,8,90],[-4850,0,-5150,8,240]];
 for(const players of [1,2])for(const mode of ['race','stunt']){
  const objects=c.dynamicObjectsForPlayers(players,{mode,difficulty:3});assert.equal(objects.length,12);
  rows.forEach(([x,y,z,type,heading],i)=>{
   const q=objects[i];assert.deepEqual(q.nativeXYZ,[x,y,z]);close(q.x,x*S);close(q.y,y*S);close(q.z,z*S);close(q.anchorX,x*S);close(q.anchorZ,z*S);
   assert.equal(q.nativeHeading,heading);assert.equal(q.sourceType,type);assert.equal(q.runtimeKind,9);assert.equal(q.sourcePhysicsFlag,4);assert.equal(q.sourceCollisionKind,2);
   assert.equal(q.sourcePlayerCount,players);assert.equal(q.radius,.625);assert.equal(q.probeRadius,.3);assert.ok(q.requiresNativeMotion&&q.floating&&!q.fixed&&!q.fixedSphere&&!q.followsWaterDatum);
  });
  assert.deepEqual(c.hazardsForPlayers(players,10,{mode,difficulty:3}),[]);
 }
 assert.deepEqual(c.obstaclesByClass,[[],[],[],[]]);assert.equal(c.sourceDynamicsReady,false);
 const b=c.sourceBuoyancy;assert.deepEqual([b.horizontalDamping,b.anchorSpring,b.verticalDamping,b.gravityPerUpdate,b.depthLift,b.liftDepthCapNative],[.9,.001,.8,4,.3,30]);assert.equal(b.nativeUnits,true);
 assert.deepEqual(c.sourceState8Override,{ramps:[],spheres:[[4802,-3656,2]]},'the special-state sphere is not silently activated in ordinary or Stunt selections');
});

test('sixteen absolute rings and CP1/4/5/0 retain 15/25/10/15 seconds',()=>{
 const s=course().stuntLayout;
 const rows=[[-4673,-3600,180],[-4192,-4527,149],[-3340,-5040,114],[4675,-4255,32],[4856,-3704,358],[4660,-3148,331],[4402,-2189,358],[4717,-1329,32],[4853,-780,358],[4556,-155,319],[-878,543,276],[-1300,872,311],[-1433,1455,340],[-1904,4660,355],[-1776,5319,4],[-2241,6251,301]];
 assert.equal(s.rings.length,16);rows.forEach(([x,z,heading],i)=>{
  const q=s.rings[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.z,z*S);close(q.y,60*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.order,i);assert.equal(q.radius,2.8);assert.equal(q.depth,.8);assert.equal(q.probeHeight,.2);assert.ok(q.absoluteY&&!q.floating);
 });
 assert.deepEqual(s.checkpoints.map(q=>q.sourceRow),[1,4,5,0]);assert.deepEqual(s.checkpoints.map(q=>q.limit),[15,25,10,15]);assert.deepEqual(s.timerSeconds,[15,25,10,15]);
 [[-2402,-5358,90,20],[-1000,1712,360,20],[-2958,6876,273,20],[-4552,104,180,12.5]].forEach(([x,z,heading,width],i)=>{
  const q=s.checkpoints[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.width,width);
 });
 assert.deepEqual(s.sourceRouteRows,[[-4552,104,3,180],[-2402,-5358,2,90],[-1129,-4481,24,90],[-946,1182,5,304],[-1000,1712,2,360],[-2958,6876,2,273]]);
 assert.deepEqual(s.sourceNonCheckpointRows,[2,3]);assert.equal(s.sourceNativeClass,0);
 for(let d=0;d<4;d++)assert.equal(portSourceSelection({mode:'stunt',difficulty:d}).nativeClass,0);
 const ramps=s.ramps;assert.deepEqual(ramps.map(q=>q.nativeRow),[[-4181,1890,0,0,180],[-5011,3263,0,0,180],[-4067,4940,0,0,180],[-4708,-1612,0,0,180]]);
 assert.ok(ramps.every(q=>q.sourceNativeClass===0&&q.width===12.5));assert.equal(course().contactVolumesForRamps(ramps).volumes.length,22);
 close(ramps[0].contactVolumes[0].origin[0],(-4181-250)*S);close(ramps[0].contactVolumes[0].origin[2],(1890-645)*S);
});

test('navigation injection remains unvalidated and cannot replace physical targets',()=>{
 const empty=course();assert.equal(empty.integrationReady,false);assert.equal(empty.navigation.usable,false);assert.deepEqual(empty.anchorsByClass,[[],[],[],[]]);assert.deepEqual(empty.stuntLayout.anchors,[]);
 const anchors=Array.from({length:4},()=>[[-150,20],[-100,-100],[100,-100]]),pilot=anchors.map(q=>q.map(()=>null));
 const navigation={validated:true,boundary:[[-200,-250],[200,-250],[200,220],[-200,220]]};
 const stunt={anchorsWorld:[[-114,2],[-100,-100],[100,-100]],verificationOnePass:true,verificationTargets:[{kind:'waypoint',x:-100,z:-100}],rings:[],checkpoints:[],ramps:[],timerSeconds:[999],startGate:{x:999}};
 const c=course({anchorsByClass:anchors,pilotAnchorsByClass:pilot,navigation,stuntNavigation:stunt});
 assert.equal(c.integrationReady,false);assert.equal(c.sourceDynamicsReady,false);assert.equal(c.navigation.validated,false);assert.equal(c.navigation.usable,true);
 assert.deepEqual(c.boundary,navigation.boundary);assert.equal(c.shoreContacts.edges.length,117);assert.equal(c.stuntLayout.verificationOnePass,true);
 assert.equal(c.stuntLayout.rings.length,16);assert.equal(c.stuntLayout.ramps.length,4);assert.deepEqual(c.stuntLayout.timerSeconds,[15,25,10,15]);assert.notEqual(c.stuntLayout.startGate.x,999);
 anchors[0][0][0]=999;navigation.boundary[0][0]=999;stunt.anchorsWorld[0][0]=999;stunt.verificationTargets[0].x=999;
 assert.notEqual(c.anchors[0][0],999);assert.notEqual(c.boundary[0][0],999);assert.notEqual(c.stuntLayout.anchors[0][0],999);assert.notEqual(c.stuntLayout.verificationTargets[0].x,999);
});

test('factories isolate mutable geometry and reject invalid selections',()=>{
 const a=course(),b=course();assert.ok(Object.isFrozen(PORT_NATIVE_GEOMETRY.rings[0]));assert.ok(Object.isFrozen(PORT_NATIVE_BOXES.profiles[0][0].axes[0]));
 a.sourceRouteRowsByClass[0][0][0]=999;a.buoysByClass[0][0].x=999;a.sourceShoresByPlayerCount[2][0].outline[0][0]=999;a.sourceDynamicObjects[0].x=999;a.stuntLayout.ramps[0].contactVolumes[0].axes[0][0]=999;
 assert.equal(b.sourceRouteRowsByClass[0][0][0],-4576);assert.notEqual(b.buoysByClass[0][0].x,999);assert.notEqual(b.sourceShoresByPlayerCount[2][0].outline[0][0],999);assert.notEqual(b.sourceDynamicObjects[0].x,999);assert.notEqual(b.stuntLayout.ramps[0].contactVolumes[0].axes[0][0],999);
 assert.throws(()=>createSourcePortCourse(),TypeError);assert.throws(()=>course({anchorsByClass:[]}),TypeError);assert.throws(()=>course({anchorsByClass:Array.from({length:4},()=>[[NaN,0]])}),TypeError);
 assert.throws(()=>course({navigation:{boundary:[[0,0],[1,0]]}}),TypeError);assert.throws(()=>portSourceSelection({difficulty:4}),RangeError);assert.throws(()=>portDynamicObjectsForSelection({playerCount:3}),RangeError);assert.throws(()=>a.geometryForPlayers(3),RangeError);
 assert.throws(()=>a.hazardsForPlayers(1,NaN),TypeError);assert.throws(()=>portRampVolumes({x:0,z:0,tx:0,tz:0}),TypeError);assert.throws(()=>portContactVolumes(null),TypeError);assert.throws(()=>portRampProfile(3),RangeError);
});
