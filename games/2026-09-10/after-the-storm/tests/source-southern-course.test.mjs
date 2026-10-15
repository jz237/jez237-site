import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceSouthernCourse} from '../source-southern-course.js';

// Independent numeric observations from the local USA Rev1 reference. These
// fixtures use raw visible centers, not the previous illustrated-map fit.
const S=.025;
const close=(actual,expected,epsilon=1e-9)=>assert.ok(Math.abs(actual-expected)<epsilon,`${actual} != ${expected}`);
function polygonDistance(points,x,z){
 let inside=false,distance=Infinity;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[j],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));
  distance=Math.min(distance,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t));
  if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside?-distance:distance;
}
const course=()=>createSourceSouthernCourse(polygonDistance);
const direction=degrees=>{const angle=(Math.trunc(degrees*4096/360)&4095)*2*Math.PI/4096;return [Math.sin(angle),Math.cos(angle)];};
const nativeBuoys=[
 [[4000,-2500,0,183],[3750,-4500,7,180],[1280,-6165,7,303],[-958,-4318,7,304],[-2039,-3574,6,326],[-3150,-2750,7,311],[-3282,424,7,17],[-1500,2500,6,34],[-1353,5487,7,35],[3861,4002,1,180],[3582,2979,6,180]],
 [[4000,-2500,0,183],[3750,-4500,7,180],[1280,-6165,7,304],[-342,-4423,6,303],[-1719,-3521,7,303],[-3426,-2632,6,311],[-3282,424,7,17],[-1150,2736,6,45],[-1353,5487,7,35],[3861,4002,7,180],[3658,2940,6,180]],
 [[4000,-2500,0,183],[3750,-4500,7,180],[1280,-6165,7,299],[-680,-4259,7,306],[-2172,-3633,6,326],[-3359,-2418,7,332],[-3282,424,7,17],[-2578,991,7,22],[-1150,2736,6,34],[-1353,5487,7,35],[4068,4047,7,180],[3900,3000,6,180]],
 [[3900,3000,6,358],[3846,4067,7,355],[-1353,5487,6,190],[-1477,2886,6,208],[-2711,714,7,201],[-3808,-1619,7,162],[-3150,-2750,6,111],[-1913,-3235,7,126],[-1012,-4048,6,130],[1280,-6165,7,127],[3750,-4500,7,352],[4099,-2510,6,351]]
];

test('four classes retain every source buoy center, side and quantized heading',()=>{
 const c=course();assert.deepEqual(c.buoysByClass.map(q=>q.length),[11,11,12,12]);
 nativeBuoys.forEach((rows,difficulty)=>rows.forEach(([x,z,type,heading],i)=>{
  const buoy=c.buoysByClass[difficulty][i],[tx,tz]=direction(heading);
  close(buoy.x,x*S);close(buoy.z,z*S);close(buoy.tx,tx);close(buoy.tz,tz);
  assert.equal(buoy.nativeHeading,heading);assert.equal(buoy.nativeType,type);assert.equal(buoy.side,[0,6].includes(type)?1:-1);
  assert.equal(buoy.width,undefined,'no invented finite colored-buoy span');
  for(const shore of c.sourceShores)assert.ok(polygonDistance(shore.outline,buoy.x,buoy.z)>0);
 }));
 assert.deepEqual(c.sourceRouteRowsByClass.map(q=>q.length),[47,52,49,45]);
});

test('all ordinary finishes use source center and finite width, with Reverse heading360',()=>{
 const c=course();
 for(let i=0;i<4;i++){
  const gate=c.finishGatesByClass[i],[tx,tz]=direction(i===3?360:180);
  assert.equal(gate.x,100);assert.equal(gate.z,25);assert.equal(gate.width,12.5);assert.equal(gate.side,0);
  close(gate.tx,tx);close(gate.tz,tz);assert.equal(gate.nativeHeading,i===3?360:180);
 }
});

test('all59 source shoreline segments form four closed solid polygons',()=>{
 const c=course();assert.deepEqual(c.sourceShores.map(q=>q.sourceEdgeCount),[45,6,4,4]);
 assert.ok(c.sourceShores.every(q=>q.sourceClosed&&!q.waterInside));
 const cabin=c.sourceShores.find(q=>q.id==='boat-stern-cabin');
 assert.deepEqual(cabin.outline,[[125,-4550],[125,-4300],[200,-4200],[375,-4200],[450,-4300],[450,-4550]].map(p=>p.map(v=>v*S)));
 assert.ok(polygonDistance(c.sourceShores[0].outline,0,0)<0);
 assert.ok(polygonDistance(cabin.outline,290*S,-4400*S)<0);
 assert.ok(polygonDistance(cabin.outline,318*S,-4966*S)>0,'ring3 is outside the stern blocker');
});

test('static floors preserve287 upward planes without applying Glacier ice handling',()=>{
 const c=course();assert.equal(c.iceSheets,undefined);
 assert.deepEqual(c.staticSurfaces.map(p=>[p.kind,p.triangles.length]),[['reef',215],['reef',70],['ship',2]]);
 assert.equal(c.orientedContactPlanes.length,18);
 assert.equal(c.orientedContactPlanes.filter(q=>Math.abs(q.normal[1])<1e-6).length,14);
 assert.equal(c.orientedContactPlanes.filter(q=>q.normal[1]<-1e-6).length,4);
 assert.equal(c.sourceMetadata.sourceCollisionPlaneCount,305);
 for(const floor of c.staticSurfaces)for(const triangle of floor.triangles){
  assert.ok(triangle.flat().every(Number.isFinite));
  const center=[0,1,2].map(k=>triangle.reduce((sum,p)=>sum+p[k],0)/3);
  const sampled=floor.heightAt(center[0],center[2]);assert.notEqual(sampled,null);assert.ok(sampled>=center[1]-1e-7);
 }
 // Independent native collision-grid samples; integer reconstruction error is
 // below .00728 native, so allow1mm in conditional world coordinates.
 for(const [x,z,y]of [[3500,-5000,-155.7618009574],[3000,5000,-98.2314977857],[-3000,-1000,-100.7027039860],[-3500,-1500,-162.8040547725],[287.5,-5350,-12.5000256695]])close(c.sourceFloor(x*S,z*S),y*S,.001);
 assert.equal(c.sourceFloor(318*S,-4966*S),null,'no invented solid deck under ring3');
 assert.equal(c.sourceFloor(1000,1000),null);
});

test('ground shares exact source floors and keeps authored background explicit',()=>{
 const c=course(),x=3500*S,z=-5000*S;
 close(c.ground(x,z),c.sourceFloor(x,z));close(c.renderGround(x,z),c.ground(x,z));
 assert.equal(c.authoredBackground.seabedHeight,-8);assert.ok(c.authoredBackground.status.includes('Authored'));
 assert.equal(c.ground(1000,1000),-8);assert.equal(c.landGround(1000,1000),-8);
 assert.equal(c.ground(318*S,-4966*S),-8,'low boat deck is a separate visual descriptor');
 assert.ok(c.landGround(0,0)>0);
});

test('26 tide-following hidden spheres exist in both players with two extra fixed1P mast bases',()=>{
 const c=course(),one=c.hazardsForPlayers(1,-2.5),two=c.hazardsForPlayers(2,-2.5);
 assert.equal(one.length,28);assert.equal(two.length,26);assert.equal(new Set(one.map(q=>q.id)).size,28);
 assert.equal(c.obstaclesByPlayerCount[1].length,28);assert.equal(c.obstaclesByPlayerCount[2].length,26);
 assert.deepEqual(c.sourceObjectSelection.tideFollowingTag4Counts,[26,26]);
 assert.deepEqual(c.sourceObjectSelection.fixedXYZTag5Counts,[2,0]);assert.equal(c.sourceObjectSelection.singlePlayerIncludesStunt,true);
 for(const sphere of one){assert.equal(sphere.hidden,true);assert.equal(sphere.fixedSphere,true);assert.equal(sphere.r,.625);assert.equal(sphere.probeRadius,.3);}
 assert.ok(two.every(q=>q.runtimeTag===4&&q.followsWaterDatum&&q.y===-2.5));
 const fixed=one.filter(q=>q.runtimeTag===5);assert.deepEqual(fixed.map(q=>[q.x,q.y,q.z]),[[290,-50,-5060],[290,-50,-4760]].map(p=>p.map(v=>v*S)));
 assert.ok(fixed.every(q=>!q.followsWaterDatum));
 assert.deepEqual([two[0].x,two[0].z],[-455*S,4962*S]);assert.deepEqual([two[25].x,two[25].z],[-1990*S,1400*S]);
 assert.ok(two.some(q=>q.x===290*S&&q.z===-5060*S),'2P retains the distinct tide-following mast position');
 assert.ok(c.tideFollowingSpheres.every(q=>q.y===0),'selecting datum does not mutate the course template');
 assert.throws(()=>c.hazardsForPlayers(3),RangeError);assert.throws(()=>c.hazardsForPlayers(1,NaN),TypeError);
});

test('ten source rings have absolute heights, finite proximity dimensions and native order',()=>{
 const rings=course().stuntLayout.rings;
 const raw=[[4202,0,-1624,180],[4001,0,-3245,180],[4315,0,-4658,180],[318,60,-4966,312],[-2346,60,1054,31],[-1237,60,2733,39],[2696,60,6369,73],[4021,60,5827,137],[3862,60,3967,180],[4362,60,2679,180]];
 assert.equal(rings.length,10);
 raw.forEach(([x,y,z,heading],i)=>{
  const q=rings[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.y,y*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);
  assert.equal(q.order,i);assert.equal(q.floating,false);assert.equal(q.absoluteY,true);assert.equal(q.radius,2.8);assert.equal(q.depth,.8);assert.equal(q.probeHeight,.2);
 });
});

test('only raw2/raw3 nodes award Stunt progress with20/15/20/15 source allowances',()=>{
 const s=course().stuntLayout;
 assert.deepEqual(s.checkpoints.map(q=>q.sourceRow),[1,2,5,0]);
 assert.deepEqual(s.checkpoints.map(q=>q.limit),[20,15,20,15]);assert.deepEqual(s.timerSeconds,[20,15,20,15]);
 const raw=[[2497,-6596,271,20],[-3358,-1589,323,20],[1702,5628,39,20],[4000,1000,179,12.5]];
 raw.forEach(([x,z,heading,width],i)=>{const q=s.checkpoints[i],[tx,tz]=direction(heading);close(q.x,x*S);close(q.z,z*S);close(q.tx,tx);close(q.tz,tz);assert.equal(q.width,width);});
 assert.deepEqual(s.sourceGuideRows,[3,4]);assert.equal(s.sourceRouteRows[3][2],8);assert.equal(s.sourceRouteRows[4][2],8);
 assert.equal(s.startGate.nativeHeading,179);
});

test('all ordinary classes and players retain the pier ramp; Stunt adds the raw308 ramp',()=>{
 const c=course();
 for(const rows of [...c.raceRampsByClass,c.raceRampsByPlayerCount[1],c.raceRampsByPlayerCount[2]].map(q=>Array.isArray(q)?q:[q])){
  assert.equal(rows.length,1);assert.deepEqual(rows[0].nativeRow,[-641,3733,0,0,45]);
 }
 assert.deepEqual(c.stuntLayout.ramps.map(q=>q.nativeRow),[[-592,3592,0,0,33],[-1185,-3695,0,0,308]]);
 for(const r of [...c.raceRamps,...c.stuntLayout.ramps]){
  assert.equal(r.y,0);assert.equal(r.floating,false);assert.equal(r.profileValidated,false);assert.equal(r.localCollisionRecords.length,3);
  assert.ok(r.localCollisionRecords.every(q=>q.flags===1));
  assert.equal(r.length,undefined,'no guessed launch profile');assert.equal(r.height,undefined);
 }
 const northwest=c.stuntLayout.ramps[1],[tx,tz]=direction(308);close(northwest.tx,tx);close(northwest.tz,tz);
 assert.deepEqual(northwest.localCollisionRecords[1].origin,[-150*S,100*S,-305*S]);
 close(northwest.localCollisionRecords[1].normal[1],.9408869743347168);
});

test('79 source marker centers use an explicitly inferred cyclic boundary',()=>{
 const c=course(),keys=rows=>new Set(rows.map(q=>q.join(',')));
 assert.equal(c.boundaryMarkers.length,79);assert.equal(c.boundary.length,79);assert.equal(keys(c.boundaryMarkers).size,79);
 assert.deepEqual(keys(c.boundary),keys(c.boundaryMarkers));assert.notDeepEqual(c.boundary,c.boundaryMarkers);
 assert.equal(c.boundaryMetadata.cyclicOrderInferred,true);assert.equal(c.boundaryMetadata.sourceOrderIsPolygon,false);
 assert.equal(c.boundaryMetadata.nativeCourseOutRuleRecovered,false);
 assert.deepEqual(c.boundaryMarkers[0],[125,-137.5]);assert.deepEqual(c.boundaryMarkers[78],[125,25]);
 assert.ok(polygonDistance(c.boundary,0,0)<0);
});

test('ship descriptor retains submerged deck and independent narrow collision parts',()=>{
 const c=course(),boat=c.boat;
 assert.equal(boat.style,'independently-authored');assert.equal(boat.followsWaterDatum,false);
 assert.deepEqual(boat.measuredBounds,{min:[115*S,-200*S,-5475*S],max:[460*S,450*S,-4200*S]});
 assert.equal(boat.decks[0].y,-1.25);assert.equal(boat.decks[0].staticSupport,false);
 assert.deepEqual(boat.masts.map(m=>[m.x,m.z,m.minY,m.maxY]),[[7.25,-126.5,-1.25,5],[7.25,-119,-1.25,11.25]]);
 assert.deepEqual(boat.cabin.roofYRange,[1.875,3.75]);assert.equal(boat.cabin.shoreCollision,true);
 assert.deepEqual(c.sourceWaterDatum.lapTargets,[0,-2.5,-3.75]);assert.equal(c.sourceWaterDatum.perSecondRateValidated,false);
});

test('unvalidated navigation is unusable and factories do not share mutable state',()=>{
 const a=course(),b=course();assert.equal(a.integrationReady,false);assert.equal(a.navigation.usable,false);assert.equal(a.navigation.validated,false);
 assert.deepEqual(a.anchors,[]);assert.ok(a.anchorsByClass.every(q=>q.length===0));assert.deepEqual(a.stuntLayout.anchors,[]);assert.deepEqual(a.stuntLayout.verificationTargets,[]);
 assert.equal(a.stuntLayout.navigation.usable,false);assert.equal(a.sourceMetadata.sourceNavRowsAreDrivingAnchors,false);
 a.boundary[0][0]=999;a.obstacles[0].y=999;a.sourceRouteRowsByClass[0][0][0]=999;a.buoysByClass[0][0].x=999;
 assert.notEqual(b.boundary[0][0],999);assert.notEqual(b.obstacles[0].y,999);assert.equal(b.sourceRouteRowsByClass[0][0][0],4000);assert.equal(b.buoysByClass[0][0].x,100);
 assert.throws(()=>createSourceSouthernCourse(),TypeError);
});
