import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceBoundarySpheres,orderSourceFixedSpheres,createSourceFixedSphereGrid,sourceFixedSphereContact,collideSourceFixedSpheres} from '../source-boundary-spheres.js';
import {sunsetFixedSphereOrderForSelection} from '../source-sunset-course.js';
const S=.025,H=.01;
const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const vec=(x=0,y=0,z=0)=>({x,y,z});
const compare=(a,b)=>{for(const k of ['x','y','z'])close(a[k],b[k]);};
const sphere=(id,x=0,y=0,z=0)=>({id,x,y,z,r:25*S,probeRadius:12*S,fixed:true,fixedSphere:true});
function hull(center=vec(),velocity=vec()){
 return {scale:S,center:{...center},frame:{up:vec(0,1,0),forward:vec(0,0,1)},
  points:Array.from({length:12},(_,i)=>({position:vec(center.x+i*S,center.y,center.z),velocity:{...velocity}}))};
}
const far=vec(100,100,100);

test('marker spheres preserve storage order without a closing segment or duplicate artwork',()=>{
 const points=[[0,0],[2,1],[0,0]],a=sourceBoundarySpheres(points,{idPrefix:'test-'});
 assert.equal(a.length,3);assert.deepEqual(a.map(q=>q.id),['test-0','test-1','test-2']);assert.deepEqual(a.map(q=>[q.x,q.z]),points);
 assert.ok(a.every(q=>q.sourceBoundaryMarker&&q.sourceFixedSphere&&q.runtimeTag===1&&q.hidden&&q.fixedSphere&&q.absoluteY&&!q.followsWaterDatum&&q.y===0&&q.r===.625));a.forEach(q=>close(q.probeRadius,.3));
 points[0][0]=999;assert.equal(a[0].x,0);assert.notEqual(a[0],a[2]);
});

test('Southern-style markers follow only the supplied datum; ordinary markers remain absolute zero',()=>{
 const points=[[1,2]],fixed=sourceBoundarySpheres(points,{waterDatum:-3.75}),tide=sourceBoundarySpheres(points,{waterDatum:-3.75,tideFollowing:true});
 assert.equal(fixed[0].y,0);assert.equal(tide[0].y,-3.75);assert.equal(tide[0].absoluteY,false);assert.equal(tide[0].followsWaterDatum,true);assert.equal(tide[0].floating,false);
});

test('ordered families retain distinct colliders even at identical centers',()=>{
 const visible=[{...sphere('v'),runtimeTag:2}],markers=sourceBoundarySpheres([[0,0]],{idPrefix:'m'}),hidden=[{...sphere('h'),runtimeTag:5}];
 const ordered=orderSourceFixedSpheres(visible,markers,hidden);assert.equal(ordered.length,3);assert.deepEqual(ordered.map(q=>q.id),['v','m0','h']);
 assert.deepEqual(ordered.map(q=>q.sourceSphereFamily),['generic-xz','marker','hidden-xyz']);assert.deepEqual(ordered.map(q=>q.sourceColliderIndex),[0,1,2]);assert.ok(ordered.every(q=>q.sourceFixedSphere));
 ordered[0].x=99;assert.equal(visible[0].x,0);
});

test('Sunset source4x4 grid reproduces raw normal and Hard candidate ordering',()=>{
 const normal=createSourceFixedSphereGrid(sunsetFixedSphereOrderForSelection()),hard=createSourceFixedSphereGrid(sunsetFixedSphereOrderForSelection({difficulty:1}));
 assert.deepEqual([...normal.query(1231*S,1140*S)].reverse(),[80,79,78,3,2,1,0]);
 assert.deepEqual([...hard.query(1231*S,1140*S)].reverse(),[96,95,94,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]);
 assert.equal(normal.truncated,false);assert.ok(Object.isFrozen(normal)&&Object.isFrozen(normal.cells[0]));
});

test('source candidate indexing truncates near the minimum and caps shared lists at511',()=>{
 const grid=createSourceFixedSphereGrid([sphere('a')]);assert.deepEqual(grid.query(grid.min[0]-.001,0),grid.cells[2]);
 assert.deepEqual(grid.query(-100,-100),[]);assert.deepEqual(createSourceFixedSphereGrid([]).query(0,0),[]);
 const packed=createSourceFixedSphereGrid(Array.from({length:256},(_,i)=>sphere(i)));assert.equal(packed.entries,511);assert.equal(packed.truncated,true);
});

test('strict37-native contact geometry has full penetration and no sphere recoil',()=>{
 const q=sphere('a');assert.equal(sourceFixedSphereContact(q,vec(37*S,0,0)),null);assert.equal(sourceFixedSphereContact(q,vec(0,37*S,0)),null);
 const hit=sourceFixedSphereContact(q,vec(30*S,0,0));close(hit.penetrationNative,7);compare(hit.normal,vec(1,0,0));compare(hit.translation,vec(7*S,0,0));compare(hit.pointDeltaVelocity,vec(7*S/H,0,0));
 compare(q,vec());
});

test('exact Sunset marker fixture shifts all12 points and kicks front3 before hull integration',()=>{
 const grid=createSourceFixedSphereGrid(sunsetFixedSphereOrderForSelection()),center=vec(1231*S,-2*S,1140*S),craft=hull(center,vec(-2*S/H,0,0)),before=structuredClone(craft),spheres=structuredClone(grid.spheres);
 const result=collideSourceFixedSpheres(grid,craft,{probes:[vec(1231*S,0,1167*S),far]});
 assert.equal(result.contacts.length,1);const hit=result.contacts[0];assert.equal(hit.id,'sunset-marker-sphere-0');assert.equal(hit.sourceColliderIndex,0);assert.deepEqual(hit.pointIndices,[4,5,3]);close(hit.normalSpeedNative,2);
 close(result.impactState.maximum,2*S/H);compare(result.impactState.normal,vec(1,0,0));
 for(let i=0;i<12;i++){
  compare(craft.points[i].position,vec(before.points[i].position.x+7*S,before.points[i].position.y,before.points[i].position.z));
  compare(craft.points[i].velocity,vec((-2+([3,4,5].includes(i)?7:0))*S/H,0,0));
 }
 assert.deepEqual(grid.spheres,spheres);assert.deepEqual(craft.center,before.center);assert.deepEqual(craft.frame,before.frame);
});

test('the same marker fixture is still source index16 after the Hard visible family',()=>{
 const grid=createSourceFixedSphereGrid(sunsetFixedSphereOrderForSelection({difficulty:1})),craft=hull(vec(1231*S,-2*S,1140*S));
 const result=collideSourceFixedSpheres(grid,craft,{probes:[vec(1231*S,0,1167*S),far]});assert.equal(result.contacts[0].sourceColliderIndex,16);close(result.contacts[0].penetrationNative,7);
});

test('vertical marker hits resolve at30native, while37native is an exact miss',()=>{
 const grid=createSourceFixedSphereGrid(sunsetFixedSphereOrderForSelection()),craft=hull(vec(1201*S,28*S,1140*S),vec(0,-2*S/H,0));
 const hit=collideSourceFixedSpheres(grid,craft,{probes:[vec(1201*S,30*S,1167*S),far]}).contacts[0];compare(hit.normal,vec(0,1,0));close(hit.penetrationNative,7);
 const miss=hull(vec(1201*S,35*S,1140*S));assert.equal(collideSourceFixedSpheres(grid,miss,{probes:[vec(1201*S,37*S,1167*S),far]}).contacts.length,0);
});

test('descending priority stops after one hit per probe even when main point velocity separates',()=>{
 const grid=createSourceFixedSphereGrid([sphere('lower'),sphere('higher')]),craft=hull(vec(),vec(2,0,0)),impact={maximum:9,normal:vec(0,1,0)};
 const result=collideSourceFixedSpheres(grid,craft,{probes:[vec(30*S,0,0),far],impactState:impact});assert.equal(result.contacts.length,1);assert.equal(result.contacts[0].id,'higher');assert.ok(result.contacts[0].normalSpeed<0);
 assert.equal(impact.maximum,9);compare(impact.normal,vec(0,1,0));close(craft.points[4].velocity.x,2+7*S/H);
});

test('both derived probes stay latched despite common hull translation',()=>{
 const grid=createSourceFixedSphereGrid([sphere('middle',0,2*S,9*S)]),craft=hull();
 const result=collideSourceFixedSpheres(grid,craft);assert.equal(result.contacts.length,2);assert.deepEqual(result.contacts.map(q=>q.pointIndices),[[4,5,3],[11,10,9]]);
 compare(result.contacts[0].probe,vec(0,2*S,27*S));compare(result.contacts[1].probe,vec(0,2*S,-9*S));
 compare(result.contacts[0].normal,vec(0,0,1));compare(result.contacts[1].normal,vec(0,0,-1));close(result.contacts[0].penetrationNative,19);close(result.contacts[1].penetrationNative,19);
 close(craft.points[0].position.z,0);close(craft.points[4].velocity.z,19*S/H);close(craft.points[11].velocity.z,-19*S/H);
});

test('Y may change with Southern tide while XZ mutation requires rebuilding the grid',()=>{
 const markers=sourceBoundarySpheres([[0,0]],{tideFollowing:true}),grid=createSourceFixedSphereGrid(markers);
 markers[0].y=-2.5;assert.ok(sourceFixedSphereContact(markers[0],vec(30*S,-2.5,0)));
 const craft=hull(vec(0,-2.5,0));assert.equal(collideSourceFixedSpheres(grid,craft,{probes:[vec(30*S,-2.5,0),far]}).contacts.length,1);
 markers[0].x=1;assert.throws(()=>grid.query(0,0),/rebuild/);
});

test('coincident-center undefined direction is explicit and leaves the hull finite',()=>{
 const grid=createSourceFixedSphereGrid([sphere('a')]),craft=hull(),before=structuredClone(craft),result=collideSourceFixedSpheres(grid,craft,{probes:[vec(),far]});
 assert.equal(result.contacts.length,0);assert.equal(result.unresolved.length,1);assert.equal(result.unresolved[0].status,'coincident-center');assert.deepEqual(craft,before);
});

test('invalid geometry, scale and unsupported collision phases are rejected',()=>{
 assert.throws(()=>sourceBoundarySpheres([[NaN,0]]),TypeError);assert.throws(()=>sourceBoundarySpheres([],{waterDatum:NaN}),TypeError);assert.throws(()=>sourceBoundarySpheres([],{scale:0}),RangeError);
 assert.throws(()=>orderSourceFixedSpheres(null),TypeError);assert.throws(()=>createSourceFixedSphereGrid([sphere('bad',NaN)]),TypeError);
 assert.throws(()=>createSourceFixedSphereGrid([{...sphere('ice'),r:50*S,breakable:{}}]),RangeError);assert.throws(()=>createSourceFixedSphereGrid([{...sphere('moving'),fixed:false}]),RangeError);
 const grid=createSourceFixedSphereGrid([sphere('a')]);assert.throws(()=>collideSourceFixedSpheres(grid,{...hull(),scale:1}),TypeError);assert.throws(()=>collideSourceFixedSpheres(grid,hull(),{probes:[vec()]}),TypeError);
 assert.throws(()=>sourceFixedSphereContact(sphere('a'),vec(NaN,0,0)),TypeError);
});
