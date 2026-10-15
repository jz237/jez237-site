import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';
import {iceSurfaceAt} from '../ice-surfaces.js';
import {ringHeight} from '../stunts.js';
import {waterLevel} from '../simulation.js';

// Independent numeric observations from the user's local reference, not
// screenshots or the former illustrated-map fit. SI scaling is the shared
// .025 policy; original named-avatar correspondence remains unverified.
const S=.025,close=(actual,expected,epsilon=1e-9)=>assert.ok(Math.abs(actual-expected)<epsilon,`${actual} != ${expected}`);
const forward=[[-4488,1829,6,179],[-3518,-132,7,180],[-4637,-2702,6,181],[4100,-3714,6,0],[3103,-2248,6,330],[2065,-1562,7,323],[1420,-565,6,327],[609,453,7,0],[745,1927,6,353],[1193,2966,6,22],[1659,4606,6,335],[699,4881,7,326],[-101,5646,6,315],[-1217,6099,7,303],[-1892,6672,6,269],[-3816,5849,6,182]];
const reverse=[[-3816,5849,6,27],[-1892,6672,7,115],[-1050,6121,6,123],[298,5744,7,121],[841,4891,6,133],[1948,4381,7,171],[1193,2966,6,188],[745,1927,6,178],[677,504,7,172],[1464,-620,6,146],[2303,-1351,7,126],[3000,-2250,6,131],[3624,-3327,6,173],[-4637,-2702,0,0],[-3518,-132,6,355],[-4438,1893,7,2]];
const direction=degrees=>{const index=Math.trunc(degrees*4096/360)&4095,angle=index*Math.PI*2/4096;return [Math.sin(angle),Math.cos(angle)];};

test('all four source classes retain sixteen visible buoys and the recovered Reverse point',()=>{
 for(const difficulty of [0,1,2,3]){
  const c=getCourse('glacier',difficulty),rows=difficulty===3?reverse:forward;
  assert.equal(c.gates.length,17);assert.equal(c.gates[0].x,-95);assert.equal(c.gates[0].z,97.5);assert.equal(c.gates[0].width,12.5);
  const finishDirection=direction(difficulty===3?360:180);close(c.gates[0].tx,finishDirection[0]);close(c.gates[0].tz,finishDirection[1]);
  rows.forEach(([x,z,type,heading],i)=>{const gate=c.gates[i+1],[tx,tz]=direction(heading);close(gate.bx,x*S);close(gate.bz,z*S);assert.equal(gate.side,[0,6].includes(type)?1:-1);close(gate.tx,tx);close(gate.tz,tz);});
 }
 const c=getCourse('glacier',3),recovered=c.gates.find(g=>Math.abs(g.bx+87.95)<1e-9&&Math.abs(g.bz+3.3)<1e-9);
 assert.ok(recovered);assert.equal(recovered.side,1);
 assert.equal(c.gates.some(g=>Math.abs(g.bx-(-3350*S))<1e-9&&Math.abs(g.bz-(-3850*S))<1e-9),false,'raw4 suppressed guide is not a mandatory buoy');
});

test('twelve breakables,90 physical markers and18 distinct hidden spheres retain source families',()=>{
 for(const difficulty of [0,1,2,3]){
  const c=getCourse('glacier',difficulty),blocks=c.rocks.filter(q=>q.breakable),hidden=c.rocks.filter(q=>q.runtimeTag===5),markers=c.rocks.filter(q=>q.sourceBoundaryMarker);
  assert.equal(c.layoutRevision,5);assert.equal(c.waterModelRevision,1);
  assert.equal(c.rocks.length,120);assert.equal(blocks.length,12);assert.equal(hidden.length,18);assert.equal(markers.length,90);assert.equal(new Set(c.rocks.map(q=>q.id)).size,120);
  for(const q of blocks){assert.equal(q.type,'ice');assert.equal(q.fixed,true);assert.equal(q.fixedSphere,true);close(q.r,50*S);close(q.probeRadius,12*S);assert.equal(q.y,0);}
  for(const q of hidden){assert.equal(q.fixed,true);assert.equal(q.fixedSphere,true);assert.equal(q.breakable,undefined);close(q.r,25*S);close(q.probeRadius,12*S);assert.equal(q.y,0);}
  assert.ok(blocks.every(q=>q.sourceFixedSphere===false&&q.sourceGenericSphere));assert.ok(markers.every(q=>q.sourceFixedSphere&&q.hidden&&q.runtimeTag===1&&q.y===0));
  assert.deepEqual(markers.map(q=>[q.x,q.z]),c.boundaryMarkers);assert.deepEqual(c.rocks.filter(q=>q.sourceFixedSphere).map(q=>q.runtimeTag),[...Array(90).fill(1),...Array(18).fill(5)]);
  assert.ok(hidden.every(q=>!markers.some(m=>m.x===q.x&&m.z===q.z)),'the18 hidden centers are not marker duplicates');
  assert.deepEqual([blocks[0].x,blocks[0].y,blocks[0].z],[1800*S,0,-1350*S]);assert.deepEqual([blocks[11].x,blocks[11].y,blocks[11].z],[-4588*S,0,34*S]);
  assert.deepEqual([hidden[0].x,hidden[0].z],[-4220*S,7157*S]);assert.deepEqual([hidden[17].x,hidden[17].z],[3995*S,-2280*S]);
  assert.equal(c.ramps.length,0,'source has no separate Glacier ramp-object rows');
 }
});

test('Glacier Stunt uses fourteen fixed-height rings and only the four twenty-second checkpoints',()=>{
 const nativeRings=[[-3742,955],[-4036,-703],[-3938,-2076],[-3811,-3740],[-3403,-4116],[3490,-3338],[2112,-1407],[1485,-518],[922,621],[287,1709],[508,4960],[-273,5558],[-1149,6156],[-1976,6508]];
 const nativeCheckpoints=[[-4383,-3200,20],[3235,-2280,20],[1342,4971,20],[-3519,3217,12.5]];
 for(const difficulty of [0,1,2,3]){
  const state=createRace({mode:'stunt',course:getCourse('glacier',difficulty),difficulty}),c=state.course;
  assert.equal(c.rings.length,14);assert.equal(c.ramps.length,0);assert.equal(c.checkpoints.length,4);assert.equal(state.racers[0].stunt.remaining,20);
  c.rings.forEach((ring,i)=>{close(ring.x,nativeRings[i][0]*S);close(ring.z,nativeRings[i][1]*S);assert.equal(ring.order,i);assert.equal(ring.floating,false);close(ring.y,60*S);close(ring.radius,112*S);close(ring.depth,32*S);close(ring.probeHeight,8*S);});
  c.checkpoints.forEach((checkpoint,i)=>{close(checkpoint.x,nativeCheckpoints[i][0]*S);close(checkpoint.z,nativeCheckpoints[i][1]*S);assert.equal(checkpoint.width,nativeCheckpoints[i][2]);assert.equal(checkpoint.limit,20);});
  for(const [x,z]of [[-2885,-4368],[3404,-4468],[-2708,6453]])assert.equal(c.checkpoints.some(q=>Math.abs(q.x-x*S)<1e-9&&Math.abs(q.z-z*S)<1e-9),false,'raw8 route guide cannot award a checkpoint');
  for(const datum of [-2,0,2]){waterLevel.value=datum;for(const ring of c.rings)assert.equal(ringHeight(ring,c,200,.8),1.5);}
 }
 waterLevel.value=0;
});

test('ten finite faceted floor components retain native northern heights and submerged skirts',()=>{
 const c=getCourse('glacier',2);assert.equal(c.iceSheets.length,10);
 assert.equal(c.iceSheets.reduce((sum,p)=>sum+p.triangles.length,0),124,'independently verified upward collision triangles');
 assert.equal(c.contactWalls.triangles.length,41,'finite vertical side and rear faces complete the 165-plane contact mesh');
 for(const p of c.iceSheets)for(const triangle of p.triangles){
  assert.equal(triangle.length,3);assert.ok(triangle.flat().every(Number.isFinite));
  const [a,b,d]=triangle,area=(b[0]-a[0])*(d[2]-a[2])-(d[0]-a[0])*(b[2]-a[2]);assert.ok(Math.abs(area)>1e-8);
 }
 const samples=[[3000,-4700,30],[3404,-4468,30],[2000,-4700,22.3637591288],[1500,-4700,-36.5397396906]];
 for(const [x,z,y]of samples){const surface=iceSurfaceAt(c,x*S,z*S);assert.ok(surface,`native support ${x},${z}`);close(surface.heightAt(x*S,z*S),y*S,.002);}
 assert.equal(iceSurfaceAt(c,1000*S,-4700*S),null);assert.equal(iceSurfaceAt(c,1000,1000),null);
 assert.equal(c.boundary.length,90);assert.ok(c.boundary.flat().every(Number.isFinite));
 const ys=c.iceSheets.flatMap(p=>p.triangles.flatMap(t=>t.map(v=>v[1])));close(Math.max(...ys),100*S);close(Math.min(...ys),-192*S);
});
