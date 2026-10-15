import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceNativeContacts} from '../source-native-contacts.js';
import {createNativeHull,stepNativeHull} from '../native-hull.js';
import {applyNativeRaceContact,createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';
import {clippedVolume,clippedVolumes} from '../clipped-volumes.js';
import {triangleWalls} from '../triangle-walls.js';
import {createSourceFixedSphereGrid,collideSourceFixedSpheres} from '../source-boundary-spheres.js';
import {createNativeWaterField} from '../native-water-field.js';
import {createNativeWaterCellSurface} from '../native-water.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {polygonDistance} from '../classic-courses.js';
import {createSourcePortCourse} from '../source-port-course.js';
import {createSourceSunsetCourse} from '../source-sunset-course.js';
import {createNativeImpactState,recordNativeImpact,nativeImpactSnapshot} from '../native-impact-state.js';

const S=.025,v=(x=0,y=0,z=0)=>({x,y,z}),close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const vecClose=(a,b,e=1e-10)=>['x','y','z'].forEach(k=>close(a[k],b[k],e));
const floor=(height=0)=>({id:'analytic-floor',sourcePlaneIndices:[7],triangles:[[[-2,height,-2],[2,height,-2],[-2,height,2]]]});
const shore=()=>({id:'finite-bank',a:[0,0],b:[0,10],tx:0,tz:1,length:10,normal:v(1,0,0)});
const topBox=(id='box',flag=0)=>clippedVolume({id,flag,origin:[0,0,0],axes:[[0,1,0],[1,0,0],[0,0,1]],spans:[2,2,2]});
function isolate(index,position,velocity=v()){
  const h=createNativeHull();for(const p of h.points){p.position=v(100,100,100);p.velocity=v();}
  h.points[index].position={...position};h.points[index].velocity={...velocity};return h;
}
function context(hull,logicalFrame=0,calls=[]){return {logicalFrame,substep:hull.ticks%5,applyContact(hit){
  calls.push(structuredClone(hit));return applyNativeRaceContact(hull,hit);
}};}

test('finite shore uses strict band/endpoints, incoming velocity, and no swept supplement',()=>{
  const hooks=createSourceNativeContacts({shoreContacts:{edges:[shore()]}});
  for(const [x,z,velocity,contact]of [[-.1,5,-3,true],[0,5,-3,false],[-.4,5,-3,false],[-.401,5,-3,false],
    [-.1,0,-3,false],[-.1,10,-3,false],[-.1,5,3,false]]){
    const h=isolate(0,v(x,3,z),v(velocity)),before=structuredClone(h);hooks.shore(h,context(h));
    assert.equal(hooks.diagnostics(h).total.shore,contact?1:0);
    close(h.points[0].velocity.x,contact?0:velocity);
    close(h.points[0].position.x,contact?0:x);
    close(h.points[11].position.x-before.points[11].position.x,contact?.1:0);
    assert.equal(h.points[0].position.y,3,'no height restriction on a 2D shore');
  }
});

test('one shore contact translates all12 positions and changes only one velocity',()=>{
  const h=isolate(0,v(-.1,0,5),v(-12));for(let i=1;i<12;i++)h.points[i].velocity=v(-12);
  const hooks=createSourceNativeContacts({shoreContacts:{edges:[shore()]}}),before=h.points.map(p=>({...p.position}));
  hooks.shore(h,context(h));
  for(let i=0;i<12;i++){
    vecClose(h.points[i].position,v(before[i].x+.1,before[i].y,before[i].z));
    vecClose(h.points[i].velocity,v(i===0?0:-12));
  }
  close(h.velocity.x,-11); // A rigid-body projection would incorrectly give0.
  close(hooks.diagnostics(h).last[0].report.shoreImpactNative,12*.01/S);
});

test('available source line/plane indices remain usable by explicit candidate providers',()=>{
  const hooks=createSourceNativeContacts({sourceShores:[{id:'finite-bank',sourceLineIndices:[99]}],
    shoreContacts:{edges:[shore()]},staticSurfaces:[floor()]});
  assert.equal(hooks.geometry.shore[0].sourceIndex,99);assert.equal(hooks.geometry.floor[0].sourceIndex,7);
});

test('finite triangle floors include0 and16native depth, without deep/extension catches',()=>{
  const hooks=createSourceNativeContacts({staticSurfaces:[floor()]});
  for(const [position,contact]of [[v(0,0,0),true],[v(0,-.4,0),true],[v(0,-.40001,0),false],
    [v(0,.00001,0),false],[v(3,-.1,0),false],[v(-2,-.1,-2),false]]){
    const h=isolate(0,position,v(0,-2));hooks.floor(h,context(h));
    assert.equal(hooks.diagnostics(h).total.floor,contact?1:0);
    close(h.points[0].velocity.y,contact?0:-2);close(h.points[0].position.y,contact?0:position.y);
  }
  const outgoing=isolate(0,v(0,-.1,0),v(0,2));hooks.floor(outgoing,context(outgoing));
  close(outgoing.points[0].position.y,-.1);close(outgoing.points[0].velocity.y,2);
});

test('inclined finite floor uses normal distance rather than vertical height penetration',()=>{
  const n=v(0,.8,-.6),plane={id:'incline',triangles:[[[-2,-1.5,-2],[2,-1.5,-2],[-2,1.5,2]]]};
  // Surface y=.75z, sample lies.1m inward along its unit normal.
  const h=isolate(0,v(0,-.08,.06),v(0,-4,3)),hooks=createSourceNativeContacts({staticSurfaces:[plane]});
  const before=h.points.map(p=>({...p.position}));hooks.floor(h,context(h));
  vecClose(h.points[0].position,v());vecClose(h.points[0].velocity,v());
  for(let i=1;i<12;i++)vecClose(h.points[i].position,v(before[i].x,before[i].y+.08,before[i].z-.06));
  const hit=hooks.diagnostics(h).last[0];close(hit.penetration,.1);close(hit.report.floorImpactNative,5*.01/S);
  assert.equal(hooks.geometry.floor[0].normalOrigin,'derived-upward-triangle');vecClose(hooks.geometry.floor[0].normal,n);
});

test('finite contactWalls use floor phase and allow upper-point side contact',()=>{
  const rows=[{id:'wall',sourceIndex:19,vertices:[[0,0,0],[0,4,0],[0,0,4]],normal:[1,0,0]}];
  const hooks=createSourceNativeContacts({contactWalls:triangleWalls(rows),orientedContactPlanes:rows});
  const h=isolate(8,v(-.1,1,1),v(-3));hooks.floor(h,context(h));
  close(h.points[8].position.x,0);close(h.points[8].velocity.x,0);
  assert.equal(hooks.diagnostics(h).last[0].sourceIndex,19);
  const above=isolate(8,v(-.1,5,1),v(-3));hooks.floor(above,context(above));
  assert.equal(hooks.diagnostics(above).total.floor,0);
});

test('flat finite legacy outline remains explicitly authored and supports concave boundaries',()=>{
  const sheet={id:'outline',height:0,outline:[[0,0],[3,0],[3,1],[1,1],[1,3],[0,3]]};
  const hooks=createSourceNativeContacts({iceSheets:[sheet]});
  for(const [point,contact]of [[v(.5,-.1,2),true],[v(2,-.1,2),false],[v(3,-.1,.5),true]]){
    const h=isolate(0,point,v(0,-1));hooks.floor(h,context(h));assert.equal(hooks.diagnostics(h).total.floor,contact?1:0);
  }
  assert.equal(hooks.geometry.floor[0].normalOrigin,'authored-flat-outline');
});

test('box predicates retain skew dual axes and apply full outgoing response',()=>{
  const volume=clippedVolume({id:'skew-ramp',origin:[0,0,0],axes:[[0,1,0],[1,0,0],[0,.6,.8]],spans:[2,2,2],flag:1});
  const hooks=createSourceNativeContacts({contactVolumes:clippedVolumes([volume])});
  const h=isolate(0,v(-1,-.1,-1.175),v(0,2)),before=h.points.map(p=>({...p.position}));
  hooks.boxes(h,context(h));
  close(h.points[0].position.y,0);close(h.points[0].velocity.y,0);
  for(let i=1;i<12;i++)close(h.points[i].position.y-before[i].y,.1);
  const hit=hooks.diagnostics(h).last[0];assert.equal(hit.id,'skew-ramp');assert.equal(hit.report.markedBox,true);close(hit.report.boxImpactNative,0);
});

test('box face ties and half-open bounds preserve exclusions1/8/11 only for non-upward faces',()=>{
  const hooks=createSourceNativeContacts({contactVolumes:[topBox()]});
  for(const index of [0,1,8,11]){
    const side=isolate(index,v(-.1,-1,-1),v(-2));hooks.boxes(side,context(side));
    assert.equal(hooks.diagnostics(side).total.boxes,[1,8,11].includes(index)?0:1);
    const top=isolate(index,v(-1,-.1,-1),v(0,-2));hooks.boxes(top,context(top));
    assert.equal(hooks.diagnostics(top).total.boxes,1);
  }
  // Axis0(upward) wins equal.1 distances over axis1; opposite span edge is excluded.
  const tie=isolate(8,v(-.1,-.1,-1),v(0,-2));hooks.boxes(tie,context(tie));
  assert.equal(hooks.diagnostics(tie).total.boxes,1);close(tie.points[8].velocity.y,0);
  const far=isolate(0,v(-1,-2,-1),v(0,2));hooks.boxes(far,context(far));assert.equal(hooks.diagnostics(far).total.boxes,0);
});

test('boxes visit reverse volume order then point11to0, with flagged40percent impact only',()=>{
  const hooks=createSourceNativeContacts({contactVolumes:[topBox('first'),topBox('last',1)]}),h=createNativeHull();
  for(const p of h.points){p.position=v(-1,-.1,-1);p.velocity=v(0,-2);}
  hooks.boxes(h,context(h));const hits=hooks.diagnostics(h).last;
  assert.deepEqual(hits.map(q=>q.id),[...Array(12).fill('last'),...Array(12).fill('first')]);
  assert.deepEqual(hits.slice(0,12).map(q=>q.pointIndex),Array.from({length:12},(_,i)=>11-i));
  close(hits[0].report.boxImpactNative,2*.01/S*.4);
  assert.ok(hits.slice(0,12).every(q=>q.report.markedBox));
  assert.ok(h.points.every(p=>Math.abs(p.position.y)<1e-12&&p.velocity.y===0));
});

test('explicit candidate providers select/order prepared records without an inferred source grid',()=>{
  const seen=[],hooks=createSourceNativeContacts({staticSurfaces:[floor(),{...floor(),id:'second'}]},
    {candidateSelectors:{floor:({pointIndex,allCandidates})=>{seen.push(pointIndex);return [allCandidates[1],0];}}});
  const h=isolate(0,v(0,-.1,0),v(0,-2));hooks.floor(h,context(h));
  assert.deepEqual(seen,Array.from({length:12},(_,i)=>11-i));assert.equal(hooks.diagnostics(h).last[0].id,'second');
  assert.match(hooks.provenance.defaultCandidateSelection,/not the original grid/);
  assert.equal(hooks.diagnostics(h).provenance,hooks.provenance);assert.equal(hooks.provenance.candidateOverrides.floor,true);
  assert.match(hooks.provenance.finitePlaneClipping,/double precision/);
  const invalid=createSourceNativeContacts({staticSurfaces:[floor()]},{candidateSelectors:{floor:()=>[88]}});
  assert.throws(()=>invalid.floor(createNativeHull(),context(createNativeHull())),/unknown record/);
});

test('native16unit band scales with hull units even across a reconstruction-bin boundary',()=>{
  const hooks=createSourceNativeContacts({shoreContacts:{edges:[shore()]}},{scale:.05});
  const h=createNativeHull({scale:.05});for(const p of h.points){p.position=v(100,100,100);p.velocity=v();}
  h.points[0].position=v(-.7,0,5);h.points[0].velocity=v(-2);hooks.shore(h,context(h));
  close(h.points[0].position.x,0);close(hooks.diagnostics(h).last[0].report.shoreImpactNative,.4);
});

test('fixed-sphere hook exactly delegates cached-probe/grid response and three-point kicks',()=>{
  const sphere={id:'front',x:-.5,y:.05,z:.675,r:25*S,fixed:true},grid=createSourceFixedSphereGrid([sphere]);
  const hooks=createSourceNativeContacts({}, {fixedSphereGrid:grid}),wrapped=createNativeHull(),direct=createNativeHull();
  wrapped.points[4].velocity.x=direct.points[4].velocity.x=-5;
  const expected=collideSourceFixedSpheres(grid,direct);hooks.fixedSpheres(wrapped,context(wrapped));
  assert.deepEqual(wrapped,direct);const hit=hooks.diagnostics(wrapped);
  close(hit.fixedImpact.maximum,5);assert.equal(hit.total.fixedSpheres,expected.contacts.length);
  assert.equal(hit.provenance.fixedSphereGrid.provided,true);assert.equal(hit.provenance.fixedSphereGrid.entries,grid.entries);
  assert.deepEqual(wrapped.points.filter(p=>p.velocity.x>0).map(p=>wrapped.points.indexOf(p)),[3,4,5]);
  for(const i of [0,1,2,6,7,8,9,10,11])close(wrapped.points[i].velocity.x,0);
});

test('fixed sphere grid admission remains center-based rather than an invented per-probe rescue',()=>{
  // The front probe overlaps, but bodyX0 is beyond this single-sphere grid's
  // X maximum-.175. The original coarse center query therefore selects none.
  const grid=createSourceFixedSphereGrid([{id:'outside-center-grid',x:-.8,y:.05,z:.675,r:25*S,fixed:true}]);
  const hooks=createSourceNativeContacts({}, {fixedSphereGrid:grid}),h=createNativeHull(),before=structuredClone(h);
  hooks.fixedSpheres(h,context(h));assert.deepEqual(h,before);assert.equal(hooks.diagnostics(h).total.fixedSpheres,0);
});

test('fixed-sphere contacts report C3c in native point-velocity units without a floor impact',()=>{
  const grid=createSourceFixedSphereGrid([{id:'front',x:-.5,y:.05,z:.675,r:25*S,fixed:true}]);
  const hooks=createSourceNativeContacts({}, {fixedSphereGrid:grid}),h=createNativeHull(),impacts=createNativeImpactState(),reports=[];
  h.points[4].velocity=v(-5);
  hooks.fixedSpheres(h,{...context(h),recordImpact:hit=>{reports.push(structuredClone(hit));recordNativeImpact(impacts,hit);}});
  assert.ok(reports.length>0);assert.ok(reports.every(q=>q.channel==='fixedSphere'));
  close(impacts.fixedSphereImpactNative,2);assert.equal(impacts.floorImpactNative,0);
  assert.deepEqual(nativeImpactSnapshot(impacts).normal,reports[0].normal);
  close(hooks.diagnostics(h).fixedImpact.maximum,5); // legacy diagnostic is WORLD speed, not native2.
});

test('fixed impact latches for five ticks, resets next frame and remains independent per hull',()=>{
  const grid=createSourceFixedSphereGrid([{id:'front',x:-.5,y:.05,z:.675,r:25*S,fixed:true}]);
  const hooks=createSourceNativeContacts({}, {fixedSphereGrid:grid}),a=createNativeHull(),b=createNativeHull();
  a.points[4].velocity.x=-5;b.points[4].velocity.x=-2;
  hooks.fixedSpheres(a,context(a));hooks.fixedSpheres(b,context(b));
  close(hooks.diagnostics(a).fixedImpact.maximum,5);close(hooks.diagnostics(b).fixedImpact.maximum,2);
  a.ticks=1;a.points[4].velocity.x=-1;hooks.fixedSpheres(a,context(a,0));close(hooks.diagnostics(a).fixedImpact.maximum,5);
  a.ticks=5;a.points[4].velocity.x=-.5;hooks.fixedSpheres(a,context(a,1));close(hooks.diagnostics(a).fixedImpact.maximum,.5);
  close(hooks.diagnostics(b).fixedImpact.maximum,2);
});

test('coincident sphere direction is explicit and live sphere Y stays caller-owned',()=>{
  const sphere={id:'coincident',x:0,y:.05,z:.675,r:25*S,fixed:true},grid=createSourceFixedSphereGrid([sphere]);
  const hooks=createSourceNativeContacts({}, {fixedSphereGrid:grid}),h=createNativeHull();
  hooks.fixedSpheres(h,context(h));assert.ok(hooks.diagnostics(h).fixedUnresolved.some(q=>q.probeIndex===0));
  assert.ok(h.points.every(p=>Object.values(p.position).every(Number.isFinite)));
  sphere.y=30;const fresh=createNativeHull();hooks.fixedSpheres(fresh,context(fresh));assert.equal(hooks.diagnostics(fresh).total.fixedSpheres,0);
  sphere.x=1;assert.throws(()=>hooks.fixedSpheres(createNativeHull(),context(createNativeHull())),/rebuild/);
});

test('common floor depenetration is excluded from persistent native integration velocity',()=>{
  // Compare equivalent point response at a plane translated with the complete
  // initial hull. All geometry-relative depths/velocities remain identical.
  const run=offset=>{
    const h=createNativeHull({position:v(0,offset,0),velocity:v(0,-2)}),hooks=createSourceNativeContacts({staticSurfaces:[floor(offset)]});
    stepNativeHull(h,.01,{beforeIntegrate:craft=>hooks.floor(craft,context(craft))});return h;
  };
  const a=run(0),b=run(3);vecClose(a.velocity,b.velocity);for(let i=0;i<12;i++)vecClose(a.points[i].velocity,b.points[i].velocity);
  close(b.center.y-a.center.y,3);
  // Contact must not convert the.175m common push into upward point velocities.
  assert.ok(a.velocity.y<0);
});

test('adapter executes all supplied phases after water and leaves dynamic/primary hooks external',()=>{
  const hooks=createSourceNativeContacts({staticSurfaces:[floor()]}),order=[];
  const contacts={...hooks};for(const phase of ['shore','floor','boxes','fixedSpheres'])contacts[phase]=(h,c)=>{order.push(phase);return hooks[phase](h,c);};
  contacts.dynamicPlanes=()=>order.push('dynamicPlanes')&&undefined;contacts.racingBuoys=()=>order.push('racingBuoys')&&undefined;
  contacts.primarySpheres=()=>order.push('primarySpheres')&&undefined;
  const a=createNativeRaceAdapter({surface:(x,z)=>{order.push('water');return -100;},contacts,
    position:v(0,.17,0),jointWorld:h=>v(h.center.x,h.center.y+1,h.center.z)});
  stepNativeRaceAdapter(a,.01,{});
  assert.deepEqual(order,[...Array(12).fill('water'),'shore','floor','boxes','dynamicPlanes','racingBuoys','fixedSpheres','primarySpheres']);
  assert.ok(a.contactWindow.floorImpactNative>0);assert.ok(hooks.diagnostics(a.hull).total.floor>0);
  assert.equal(hooks.dynamicPlanes,undefined);assert.equal(hooks.racingBuoys,undefined);assert.equal(hooks.primarySpheres,undefined);
});

test('raw field pressure and finite static contact compose in a runnable fixed-step adapter',()=>{
  const field=createNativeWaterField(),hooks=createSourceNativeContacts({staticSurfaces:[floor(-.05)]});
  const run=hz=>{
    const a=createNativeRaceAdapter({position:v(-.4,.015,-.4),surface:createNativeWaterCellSurface(field),contacts:hooks,
      jointWorld:h=>v(h.center.x,h.center.y+1,h.center.z)});
    for(let i=0;i<hz/2;i++)stepNativeRaceAdapter(a,1/hz,{throttle:true});return a;
  };
  const a=run(50),b=run(100);vecClose(a.hull.center,b.hull.center,1e-9);vecClose(a.hull.velocity,b.hull.velocity,1e-9);
  assert.equal(a.hull.ticks,50);assert.ok(Object.values(a.hull.center).every(Number.isFinite));assert.equal(field.patchUpdates,0);
  assert.ok(hooks.diagnostics(a.hull).total.floor>0);assert.ok(hooks.diagnostics(b.hull).total.floor>0);
});

test('prepared live source course geometry constructs without touching live course objects',()=>{
  for(const id of ['greyhaven','tempest']){
    const race=createRace({course:getCourse(id),seaState:'calm'}),course=race.course,normal=course.staticSurfaces?.[0]?.triangles?.[0]?.map(p=>[...p]);
    const hooks=createSourceNativeContacts(course,{fixedSphereGrid:race.sourceSphereGrid});
    assert.equal(hooks.provenance.scale,S);assert.ok(Object.isFrozen(hooks.geometry.floor));
    assert.ok(hooks.geometry.shore.length>0&&hooks.geometry.floor.length>0);
    if(normal)assert.deepEqual(course.staticSurfaces[0].triangles[0],normal);
    assert.equal(hooks.diagnostics(createNativeHull()),null);
  }
});

test('isolated Port/Sunset modules retain real player-selected shores and finite boxes before live integration',()=>{
  for(const create of [createSourcePortCourse,createSourceSunsetCourse])for(const playerCount of [1,2]){
    const base=create(polygonDistance),selection={playerCount},geometry=base.geometryForPlayers(playerCount),
      ramps=base.rampsForSelection(selection),course={...base,...geometry,ramps};
    course.contactVolumes=course.contactVolumesForRamps(ramps,selection);
    const hooks=createSourceNativeContacts(course);
    assert.equal(hooks.geometry.shore.length,create===createSourcePortCourse?(playerCount===1?117:109):(playerCount===1?63:47));
    assert.ok(hooks.geometry.boxes.length>0,'must exercise source fixed/ramp volumes');
    if(create===createSourcePortCourse)assert.equal(hooks.geometry.floor.length,0,'Port has no active source3D floor grid');
    else assert.ok(hooks.geometry.floor.length>0);
  }
});

test('unsupported geometry, scale, selector and context fail explicitly',()=>{
  assert.throws(()=>createSourceNativeContacts(null),TypeError);assert.throws(()=>createSourceNativeContacts({},{scale:0}),RangeError);
  assert.throws(()=>createSourceNativeContacts({staticSurfaces:[{heightAt:()=>0}]}),/requires triangles/);
  assert.throws(()=>createSourceNativeContacts({staticSurfaces:[{triangles:[[[0,0,0],[0,1,0],[0,2,0]]]}]}),/Degenerate/);
  assert.throws(()=>createSourceNativeContacts({},{candidateSelectors:{dynamicPlanes:()=>[]}}),/Unsupported/);
  assert.throws(()=>createSourceNativeContacts({contactVolumes:[{origin:[0,0,0],axes:[[0,1,0],[0,1,0],[0,0,1]],spans:[1,1,1]}]}),/Collapsed/);
  const hooks=createSourceNativeContacts({});assert.throws(()=>hooks.floor(createNativeHull(),{}),/context/);
  const badScale=createNativeHull({scale:.05});assert.throws(()=>hooks.floor(badScale,context(badScale)),/contact scale/);
});
