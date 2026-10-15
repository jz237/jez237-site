import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {createNativeHull} from '../native-hull.js';
import {createNativeImpactState,recordNativeImpact,resetNativeImpacts} from '../native-impact-state.js';
import {createNativeWaterField,queryNativeWaterField,locateNativeWaterCell} from '../native-water-field.js';
import {SOURCE_PRIMARY_BUOY_POINT_STEP,SOURCE_PRIMARY_BUOY_MOTION_STEP,createSourcePrimaryBuoys,
 collideSourcePrimaryBuoys,stepSourcePrimaryBuoys,snapshotSourcePrimaryBuoys} from '../source-primary-buoys.js';

const S=.025,H=.01,F=Math.fround;
const v=(x=0,y=0,z=0)=>({x,y,z});
const world=p=>v(p.x*S,p.y*S,p.z*S);
const worldVelocity=p=>v(p.x*S/H,p.y*S/H,p.z*S/H);
const far=v(10000,10000,10000);
const close=(a,b,e=1e-11)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const near=(a,b,e)=>{for(const k of ['x','y','z'])close(a[k],b[k],e);};
const state=(rows=[[0,0,6,0]],options={})=>createSourcePrimaryBuoys(createSourceBuoyLayout({rows,courseIndex:1,...options}));
const craft=(velocity=v(-7,0,0))=>createNativeHull({velocity:worldVelocity(velocity)});
const collide=(s,h,probe,context={})=>collideSourcePrimaryBuoys(s,h,{probes:[world(probe),far],...context});

test('initial source flags, fixed endpoint axes and authored Y0 are distinct from equilibrium',()=>{
 const layout=createSourceBuoyLayout({courseIndex:1,rows:[[100,200,6,0],[200,300,7,90],[400,500,2,180],[600,700,3,270],
  [800,900,4,0],[1000,1100,9,0],[1200,1300,8,0]]}),s=createSourcePrimaryBuoys(layout);
 assert.equal(SOURCE_PRIMARY_BUOY_POINT_STEP,.01);assert.equal(SOURCE_PRIMARY_BUOY_MOTION_STEP,.05);
 assert.deepEqual(s.nodes.map(n=>[n.classification,n.fixed,n.physicsEnabled,n.renderEnabled]),
  [[0,false,true,true],[1,false,true,true],[2,true,true,true],[3,true,true,true],[0,false,false,false],[0,false,false,false],[4,false,false,false]]);
 assert.deepEqual(s.nodes[0].positionNative,v(100,0,200));assert.deepEqual(s.nodes[0].velocityNative,v());
 assert.deepEqual(s.nodes[2].endpointsNative,[v(-400,0,500),v(1200,0,500)]);
 assert.deepEqual(s.nodes[3].endpointsNative,[v(600,0,1200),v(600,0,200)]);
 s.nodes[0].positionNative.x=99;assert.equal(layout.nodes[0].x,100*S);assert.equal(s.nodes[0].anchorNative.x,100);
 assert.ok(Object.isFrozen(s.nodes));assert.equal(s.diagnostics.candidateGrid,false);
});

test('Dolphin finish half width is mode-dependent and Southern finish endpoints stay absolute',()=>{
 const race=state([[4000,1000,3,180]],{courseIndex:0}),stunt=state([[4000,1000,3,180]],{courseIndex:0,mode:'stunt'});
 assert.equal(race.nodes[0].endpointsNative[0].x,3630);assert.equal(stunt.nodes[0].endpointsNative[0].x,3500);
 const southern=state([[4000,1000,3,180],[0,0,6,0]],{courseIndex:7});
 assert.deepEqual(southern.nodes[0].endpointsNative,[v(3500,-110,1000),v(4500,-160,1000)]);
 const before=structuredClone(southern.nodes[0]);stepSourcePrimaryBuoys(southern,{queryNative:()=>-300});
 assert.deepEqual(southern.nodes[0],before);
});

test('movable response uses the checked binary32 30/70 split and distinct velocity clocks',()=>{
 const s=state(),h=craft(),before=structuredClone(h),records=[];
 const hit=collide(s,h,v(50,0,0),{recordImpact:q=>records.push(q)}).contacts[0];
 assert.equal(hit.channel,'primaryBuoy');assert.equal(hit.radiusNative,62);assert.equal(hit.penetrationNative,12);
 assert.equal(hit.craftDepthNative,3.6000001430511475);assert.equal(hit.incomingNative,7);
 assert.deepEqual(s.nodes[0].positionNative,v(-8.399999618530273,0,0));
 assert.deepEqual(s.nodes[0].velocityNative,v(-8.399999618530273,0,0));
 for(let i=0;i<12;i++){
  const position=v(F(before.points[i].position.x/S+hit.craftDepthNative)*S,before.points[i].position.y,before.points[i].position.z);
  near(h.points[i].position,position);near(h.points[i].velocity,worldVelocity(v([3,4,5].includes(i)?-3.3999998569488525:-7,0,0)));
 }
 assert.deepEqual(h.center,before.center);assert.deepEqual(h.frame,before.frame);
 assert.deepEqual(records,[{channel:'primaryBuoy',incomingNative:7,normal:v(1,0,0)}]);
 const snap=snapshotSourcePrimaryBuoys(s)[0];near(snap.velocity,v(-4.199999809265137,0,0));
 close(h.points[4].velocity.x-before.points[4].velocity.x,3.6000001430511475*S/H);
});

test('oblique contact matches independently checked source arithmetic and absolute point velocity',()=>{
 const s=state(),h=craft(v(-7,-2,1));s.nodes[0].velocityNative=v(100,200,300);
 const hit=collide(s,h,v(-30,24,32)).contacts[0];
 assert.deepEqual(hit.normal,v(-.5999999642372131,.47999998927116394,.6399999856948853));
 assert.deepEqual(hit.translationNative,v(-2.1599998474121094,1.7280000448226929,2.30400013923645));
 assert.equal(hit.incomingNative,-3.8799996376037598);
 assert.deepEqual(s.nodes[0].positionNative,v(5.039999485015869,-4.031999588012695,-5.375999450683594));
 assert.deepEqual(s.nodes[0].anchorNative,{x:0,z:0});
});

test('two latched source probes use different triples and see immediate shared buoy recoil',()=>{
 const s=state(),h=craft(),before=structuredClone(h);
 const result=collideSourcePrimaryBuoys(s,h,{probes:[world(v(50,0,0)),world(v(-50,0,0))]});
 assert.deepEqual(result.contacts.map(q=>q.pointIndices),[[4,5,3],[11,10,9]]);
 assert.deepEqual(result.contacts.map(q=>q.craftDepthNative),[3.6000001430511475,6.120000839233398]);
 assert.deepEqual(result.contacts.map(q=>q.probeNative),[v(50,0,0),v(-50,0,0)]);
 assert.deepEqual(s.nodes[0].positionNative,v(5.880001068115234,0,0));
 assert.deepEqual(s.nodes[0].velocityNative,v(5.880001068115234,0,0));
 const expectedX=[-14.520000457763672,-2.520000696182251,9.479999542236328,-14.520000457763672,-2.520000696182251,
  9.479999542236328,-14.520000457763672,9.479999542236328,-2.520000696182251,-14.520000457763672,9.479999542236328,-2.520000696182251];
 for(let i=0;i<12;i++){
  close(h.points[i].position.x,expectedX[i]*S);
  close(h.points[i].velocity.x,([3,4,5].includes(i)?-3.3999998569488525:[9,10,11].includes(i)?-13.120000839233398:-7)*S/H);
 }
 assert.deepEqual(h.center,before.center);assert.deepEqual(h.frame,before.frame);
});

test('derived probes read cached center/frame despite earlier common point nudges',()=>{
 const s=state([[0,9,6,0]]),h=craft(),center=structuredClone(h.center);s.nodes[0].positionNative.y=2;
 for(const p of h.points)p.position.x+=100;
 const result=collideSourcePrimaryBuoys(s,h);
 assert.equal(result.contacts.length,2);assert.deepEqual(result.contacts[0].probeNative,v(0,2,27));
 assert.deepEqual(result.contacts[1].probeNative,v(0,2,-9));assert.deepEqual(h.center,center);
 assert.ok(h.points.every(p=>p.position.x>99));
});

test('fixed checkpoints ignore physics flag, test endpoint1 first and use full separation',()=>{
 for(const [type,radius]of [[2,62],[3,92]]){
  const s=state([[0,0,type,0]]),n=s.nodes[0],h=craft();n.physicsEnabled=false;n.renderEnabled=false;
  n.endpointsNative=[v(),v(20,0,0)];
  const before=structuredClone(n),hit=collide(s,h,v(50,0,0)).contacts[0];
  assert.equal(hit.endpoint,0);assert.equal(hit.radiusNative,radius);assert.equal(hit.craftDepthNative,radius-50);
  assert.equal(hit.channel,'fixedSphere');assert.deepEqual(n,before);close(h.points[4].velocity.x,(-7+radius-50)*S/H);
 }
});

test('sphere boundary equality is a miss in horizontal and vertical directions',()=>{
 for(const type of [6,2,3])for(const axis of ['x','y','z']){
  const s=state([[0,0,type,0]]),radius=type===3?92:62;s.nodes[0].endpointsNative=[v(),far];
  assert.equal(collide(s,craft(),{...v(),[axis]:radius}).contacts.length,0);
  assert.equal(collide(s,craft(),{...v(),[axis]:F(radius-.001)}).contacts.length,1);
 }
});

test('descending array priority is independent of sourceRow, distance and render flag',()=>{
 const layout=createSourceBuoyLayout({courseIndex:1,nodes:[
  {sourceRow:99,x:0,z:0,tx:0,tz:1,classification:0},
  {sourceRow:1,x:10*S,z:0,tx:0,tz:1,classification:1}]}),s=createSourcePrimaryBuoys(layout);
 s.nodes[1].renderEnabled=false;
 const hit=collide(s,craft(),v(20,0,0)).contacts[0];assert.equal(hit.sourceIndex,1);assert.equal(hit.sourceRow,1);
 const next=createSourcePrimaryBuoys(layout);next.nodes[1].physicsEnabled=false;
 assert.equal(collide(next,craft(),v(20,0,0)).contacts[0].sourceRow,99);
});

test('outgoing overlaps still add penetration but do not raise a frame impact maximum',()=>{
 const s=state(),h=craft(v(7,0,0)),impacts=createNativeImpactState();
 const hit=collide(s,h,v(50,0,0),{recordImpact:q=>recordNativeImpact(impacts,q)}).contacts[0];
 assert.equal(hit.incomingNative,-7);assert.equal(impacts.primaryBuoyImpactNative,0);assert.deepEqual(impacts.normal,v());
 close(h.points[4].velocity.x,10.600000381469727*S/H);
});

test('separate frame impact maxima preserve traversal normal across primary and fixed contacts',()=>{
 const s=state([[0,0,6,0],[1000,1000,2,0]]),h=craft(),impacts=createNativeImpactState();
 s.nodes[1].endpointsNative=[v(0,500,0),v(1000,500,1000)];
 h.points[11].velocity=worldVelocity(v(0,-2,0));
 const record=q=>recordNativeImpact(impacts,q),result=collideSourcePrimaryBuoys(s,h,{probes:[world(v(50,0,0)),world(v(0,550,0))],recordImpact:record});
 assert.deepEqual(result.contacts.map(q=>q.channel),['primaryBuoy','fixedSphere']);
 assert.equal(impacts.primaryBuoyImpactNative,7);assert.equal(impacts.fixedSphereImpactNative,2);assert.deepEqual(impacts.normal,v(0,1,0));
 record({channel:'primaryBuoy',incomingNative:7,normal:v(0,0,1)});assert.deepEqual(impacts.normal,v(0,1,0));
 resetNativeImpacts(impacts);assert.equal(impacts.primaryBuoyImpactNative,0);assert.equal(impacts.fixedSphereImpactNative,0);
});

test('coincident centers are explicit unresolved stops without invented normals or mutation',()=>{
 const s=state([[0,0,6,0],[0,0,7,0]]),h=craft(),beforeH=structuredClone(h),before=structuredClone(s.nodes);
 const result=collide(s,h,v());assert.equal(result.contacts.length,0);assert.equal(result.unresolved.length,1);
 assert.equal(result.unresolved[0].sourceIndex,1);assert.equal(result.unresolved[0].status,'coincident-center');
 assert.equal(result.unresolved[0].normal,undefined);assert.deepEqual(s.nodes,before);assert.deepEqual(h,beforeH);
});

test('one shared buoy state exposes first-rider recoil to later riders',()=>{
 const s=state();const first=collide(s,craft(),v(50,0,0)).contacts[0],second=collide(s,craft(),v(50,0,0)).contacts[0];
 assert.equal(first.penetrationNative,12);assert.equal(second.penetrationNative,3.5999984741210938);
 assert.equal(s.motionFrames,0);assert.ok(s.nodes[0].positionNative.x<-8.39);
});

test('explicit source motion starts at Y0 and matches checked capped-buoyancy samples',()=>{
 const s=state(),positions=[],velocities=[];
 for(let i=0;i<4;i++){stepSourcePrimaryBuoys(s,{queryNative:()=>0});positions.push(s.nodes[0].positionNative.y);velocities.push(s.nodes[0].velocityNative.y);}
 assert.deepEqual(positions,[6,17.399999618530273,31.439998626708984,43.64399719238281]);
 assert.deepEqual(velocities,[6,11.399999618530273,14.039999961853027,12.204000473022461]);assert.equal(s.motionFrames,4);
});

test('source motion queries old XZ in ascending order and retains source double coefficients',()=>{
 const s=state([[2,3,6,0],[102,103,7,0]]),n=s.nodes[0],queries=[];
 n.positionNative=v(8,25,-6);n.velocityNative=v(.5,1,F(-.7));
 const queryNative=(x,z)=>{queries.push([x,z]);return 0;};
 for(let i=0;i<4;i++)stepSourcePrimaryBuoys(s,{queryNative});
 assert.deepEqual(queries.slice(0,2),[[8,-6],[102,103]]);
 assert.deepEqual(n.positionNative,v(8.972489356994629,34.30839920043945,-7.308016300201416));
 assert.deepEqual(n.velocityNative,v(.10376990586519241,1.4244004487991333,-.12518224120140076));
});

test('source query includes datum once and fixed/physics-disabled states do not move',()=>{
 const s=state([[0,0,6,0],[100,100,3,0],[200,200,7,0]]);
 s.nodes[0].positionNative.y=-70;s.nodes[2].physicsEnabled=false;
 const untouched=structuredClone(s.nodes.slice(1));let queries=0;
 for(let i=0;i<4;i++)stepSourcePrimaryBuoys(s,{queryNative:()=>{queries++;return -100;}});
 assert.equal(queries,4);assert.deepEqual(s.nodes[0].positionNative,v(0,-70,0));assert.deepEqual(s.nodes[0].velocityNative,v());
 assert.deepEqual(s.nodes.slice(1),untouched);
});

test('source plane query, rather than rendered height, drives motion on a sloping native cell',()=>{
 const f=createNativeWaterField({datumNative:20}),s=state([[19,7,6,0]]),n=s.nodes[0];
 const cell=locateNativeWaterCell(19,7);[0,32,-16].forEach((h,i)=>{f.heightQ[cell.indices[i]]=h*256;});
 const q=queryNativeWaterField(f,19,7);assert.notEqual(q.sourcePlaneQueryNative,q.renderHeightNative);
 n.positionNative.y=F(q.sourcePlaneQueryNative+30);
 stepSourcePrimaryBuoys(s,{queryNative:(x,z)=>queryNativeWaterField(f,x,z).sourcePlaneQueryNative});
 assert.ok(Math.abs(n.velocityNative.y)<1e-6);assert.ok(Math.abs(q.sourcePlaneQueryNative-q.renderHeightNative)>1);
});

test('collision recoil feeds the next once-per-frame motion without hidden extra ticks',()=>{
 const s=state(),n=s.nodes[0];n.positionNative.y=30;
 collide(s,craft(v(-12,0,0)),v(50,30,0));
 assert.deepEqual(n.positionNative,v(-8.399999618530273,30,0));assert.equal(s.motionFrames,0);
 stepSourcePrimaryBuoys(s,{queryNative:()=>0});
 assert.deepEqual(n.positionNative,v(-15.875999450683594,30,0));assert.deepEqual(n.velocityNative,v(-7.47599983215332,0,0));
 assert.equal(s.motionFrames,1);const before=structuredClone(n);
 for(let i=0;i<100;i++)snapshotSourcePrimaryBuoys(s);assert.deepEqual(n,before);assert.equal(s.motionFrames,1);
});

test('snapshot is detached world state with distinct absolute endpoints and 50ms native velocity',()=>{
 const s=state([[40,80,6,0],[100,200,3,0]]);s.nodes[0].positionNative=v(42,30,76);s.nodes[0].velocityNative=v(2,3,-4);
 s.nodes[0].physicsEnabled=false;s.nodes[0].renderEnabled=true;
 const a=snapshotSourcePrimaryBuoys(s);near(a[0].position,v(1.05,.75,1.9));assert.deepEqual(a[0].velocityNative,v(2,3,-4));
 assert.deepEqual(a[0].velocity,v(1,1.5,-2));assert.deepEqual(a[0].anchor,{x:1,z:2});
 assert.equal(a[0].physicsEnabled,false);assert.equal(a[0].renderEnabled,true);assert.equal(a[1].fixed,true);
 a[0].position.x=999;a[0].velocityNative.y=999;a[1].endpoints[0].z=999;
 assert.deepEqual(s.nodes[0].positionNative,v(42,30,76));assert.equal(s.nodes[0].velocityNative.y,3);assert.equal(s.nodes[1].endpointsNative[0].z,200);
});

test('invalid state, geometry, scale and missing native query fail without a guessed fallback',()=>{
 assert.throws(()=>createSourcePrimaryBuoys(),TypeError);assert.throws(()=>createSourcePrimaryBuoys({nodes:[],scale:0}),TypeError);
 const layout=createSourceBuoyLayout({rows:Array.from({length:65},()=>[0,0,6,0])});assert.throws(()=>createSourcePrimaryBuoys(layout),/64/);
 const s=state();assert.throws(()=>stepSourcePrimaryBuoys(s),TypeError);assert.throws(()=>stepSourcePrimaryBuoys(s,{queryNative:()=>NaN}),TypeError);
 assert.equal(s.motionFrames,0);assert.throws(()=>collideSourcePrimaryBuoys(s,{...craft(),scale:1}),TypeError);
 assert.throws(()=>collideSourcePrimaryBuoys(s,craft(),{probes:[v()]}),TypeError);
 assert.throws(()=>collide(s,craft(),v(),{recordImpact:1}),TypeError);
 s.nodes[0].positionNative.x=NaN;assert.throws(()=>snapshotSourcePrimaryBuoys(s),TypeError);
 assert.throws(()=>snapshotSourcePrimaryBuoys({...s}),TypeError);
});
