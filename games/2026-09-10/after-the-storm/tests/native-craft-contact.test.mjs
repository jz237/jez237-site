import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeCraftContactState,createNativeCraftContactStates,resetNativeCraftContactState,refreshNativeCraftContactState,
 applyNativeCraftContacts,nativeCraftContactSnapshot} from '../native-craft-contact.js';
import {createNativeImpactState,nativeImpactSnapshot,recordNativeImpact} from '../native-impact-state.js';

const zero=()=>({x:0,y:0,z:0}),v=(x=0,y=0,z=0)=>({x,y,z});
const scales=[1,.025,.05],axes=['x','y','z'];
const scaled=(p,s)=>({x:p.x*s,y:p.y*s,z:p.z*s});
// These twelve points are an independently authored, asymmetric numeric test
// shape. They are not source geometry, animation records or captured ROM data.
function hull({center=zero(),forward=v(0,0,1),up=v(0,1,0),scale=1,tick=0}={}){
 return {scale,ticks:tick,center:scaled(center,scale),frame:{forward:{...forward},up:{...up},right:v(1,0,0)},
  points:Array.from({length:12},(_,i)=>({position:scaled(v(center.x+i-5,center.y+i%3-1,center.z+i*1.25-8),scale),
   velocity:zero(),damping:.625})),velocity:zero(),motionVelocity:v(7,8,9),motionDirection:v(0,0,1)};
}
function entry(options){const h=hull(options);return {hull:h,contactState:createNativeCraftContactState(h),impacts:createNativeImpactState()};}
function move(e,center,tick){
 const old=e.hull.center,next=scaled(center,e.hull.scale);
 for(const p of e.hull.points)for(const k of axes)p.position[k]+=next[k]-old[k];
 e.hull.center=next;e.hull.ticks=tick;
 refreshNativeCraftContactState(e.contactState,e.hull);
}
function approaching({scale=1,previousX=30,currentX=20}={}){
 const a=entry({scale}),b=entry({scale,center:v(previousX,0,0)});
 move(a,zero(),1);move(b,v(currentX,0,0),1);return [a,b];
}

test('batch creation returns independent states in input order, including an empty batch',()=>{
 assert.deepEqual(createNativeCraftContactStates([]),[]);
 const a=hull({center:v(100,0,0)}),b=hull({center:v(-100,0,0),tick:5});
 const states=createNativeCraftContactStates([a,b]);
 assert.equal(states.length,2);assert.notEqual(states[0],states[1]);
 assert.equal(nativeCraftContactSnapshot(states[0]).positionsNative[0].x,100);
 assert.equal(nativeCraftContactSnapshot(states[1]).positionsNative[0].x,-100);
 assert.equal(nativeCraftContactSnapshot(states[1]).tick,5);
 assert.throws(()=>createNativeCraftContactStates(Array(5).fill(a)),/four/);
});

test('a later preowned hull rejects a batch without reserving the earlier valid hull',()=>{
 const a=hull(),b=hull({center:v(20,0,0)}),owned=createNativeCraftContactState(b);
 const before=nativeCraftContactSnapshot(owned);
 assert.throws(()=>createNativeCraftContactStates([a,b]),/already/);
 assert.deepEqual(nativeCraftContactSnapshot(owned),before);
 assert.ok(createNativeCraftContactState(a),'the initially unowned hull remains creatable');
});

test('a duplicate hull rejects the batch before reserving that hull',()=>{
 const a=hull();assert.throws(()=>createNativeCraftContactStates([a,a]),/distinct/);
 assert.ok(createNativeCraftContactState(a));
});

test('later invalid numeric inputs or proxy overflow cannot poison an earlier valid hull',()=>{
 for(const corrupt of [b=>{b.points[11].position.y=NaN;},b=>{b.points[11].velocity.z=Infinity;},
  b=>{b.center.x=1e100;},b=>{b.frame.forward.z=1e100;},b=>{b.center.x=3e38;b.frame.up.x=1e38;}]){
  const a=hull(),b=hull({center:v(20,0,0)}),before=structuredClone(a);corrupt(b);
  assert.throws(()=>createNativeCraftContactStates([a,b]),/finite|float32/);
  assert.deepEqual(a,before);assert.ok(createNativeCraftContactState(a));
 }
});

test('actual fitted pose seeds four native proxies and zero movement, independently of initial velocity',()=>{
 const h=hull({center:v(100,30,-200),forward:v(1,0,0),scale:.025,tick:7});
 h.points.forEach(p=>p.velocity=v(1000,-500,250));
 const state=createNativeCraftContactState(h),s=nativeCraftContactSnapshot(state);
 assert.deepEqual(s.positionsNative,[v(127,32,-200),v(109,32,-200),v(91,32,-200),v(73,32,-200)]);
 assert.deepEqual(s.deltasNative,[zero(),zero(),zero(),zero()]);
 assert.equal(s.tick,7);assert.equal(s.revision,0);assert.equal(s.lastAppliedTick,null);
 assert.equal(Object.keys(state).length,0,'physical caches stay private');
});

test('four frozen overlaps translate all twelve positions and change all four distinct velocity groups',()=>{
 for(const scale of scales){
  const a=entry({scale}),b=entry({scale,center:v(20,0,0)}),before=[a,b].map(e=>structuredClone(e.hull));
  const caches=[a,b].map(e=>nativeCraftContactSnapshot(e.contactState));
  const result=applyNativeCraftContacts([a,b]);
  assert.deepEqual(result.contacts.map(c=>[c.proxyA,c.proxyB]),[[0,0],[1,1],[2,2],[3,3]]);
  for(const c of result.contacts){assert.equal(c.incomingNative,0);assert.equal(c.distanceNative,20);assert.deepEqual(c.halfPushNative,v(-2,0,0));}
  for(let rider=0;rider<2;rider++){
   const e=[a,b][rider],sign=rider?1:-1;
   for(let i=0;i<12;i++){
    // Integer/quarter native coordinates give an independent exact result;
    // adding the world push to an already scaled double rounds differently.
    assert.deepEqual(e.hull.points[i].position,{x:(rider*20+i-5+sign*8)*scale,
     y:(i%3-1)*scale,z:(i*1.25-8)*scale});
    assert.deepEqual(e.hull.points[i].velocity,v(sign*2*scale/.01,0,0));
    assert.equal(e.hull.points[i].damping,.625);
   }
   assert.deepEqual(e.hull.center,before[rider].center);assert.deepEqual(e.hull.frame,before[rider].frame);
   assert.deepEqual(e.hull.motionVelocity,before[rider].motionVelocity);assert.deepEqual(e.hull.motionDirection,before[rider].motionDirection);
   assert.deepEqual(nativeCraftContactSnapshot(e.contactState).positionsNative,caches[rider].positionsNative);
   assert.deepEqual(nativeCraftContactSnapshot(e.contactState).deltasNative,caches[rider].deltasNative);
   assert.equal(e.impacts.racerImpactNative,0,'cold reset does not fabricate an impact');
  }
 }
});

test('incoming is relative cached proxy displacement, with immediate strict maxima and opposite normals',()=>{
 const [a,b]=approaching();
 a.hull.points.forEach(p=>p.velocity=v(40000,0,0));b.hull.points.forEach(p=>p.velocity=v(90000,0,0));
 recordNativeImpact(a.impacts,{channel:'shore',incomingNative:100,normal:v(0,1,0)});
 const {contacts}=applyNativeCraftContacts([a,b]);
 assert.deepEqual(contacts.map(c=>c.incomingNative),[10,10,10,10]);
 assert.deepEqual(contacts.map(c=>[c.recordedA,c.recordedB]),[[true,true],[false,false],[false,false],[false,false]]);
 assert.equal(a.impacts.racerImpactNative,10);assert.equal(b.impacts.racerImpactNative,10);
 assert.deepEqual(a.impacts.normal,v(-1,0,0));assert.deepEqual(b.impacts.normal,v(1,-0,-0));
 assert.equal(a.impacts.shoreImpactNative,100,'own-family max wins the shared normal even below another family');
 assert.equal(a.hull.points[0].velocity.x,39800);assert.equal(b.hull.points[0].velocity.x,90200);
});

test('sixteen isolated perpendicular proxy pairs address exactly their three source point indices',()=>{
 const offsets=[27,9,-9,-27],expectedGroups=[[4,5,3],[8,7,6],[11,10,9],[1,2,0]];
 for(let pa=0;pa<4;pa++)for(let pb=0;pb<4;pb++){
  // Perpendicular centerlines separated20 vertically: every neighboring
  // proxy is sqrt(20²+18²)>24 away, isolating exactly the chosen pair.
  const a=entry(),b=entry({center:v(-offsets[pb],20,offsets[pa]),forward:v(1,0,0)});
  const {contacts}=applyNativeCraftContacts([a,b]);
  assert.equal(contacts.length,1);assert.deepEqual([contacts[0].proxyA,contacts[0].proxyB],[pa,pb]);
  for(let i=0;i<12;i++){
   assert.deepEqual(a.hull.points[i].velocity,v(0,expectedGroups[pa].includes(i)?-200:0,0));
   assert.deepEqual(b.hull.points[i].velocity,v(0,expectedGroups[pb].includes(i)?200:0,0));
  }
 }
});

test('equal prior maximum preserves one craft normal while the other craft records the same contact',()=>{
 const [a,b]=approaching();
 recordNativeImpact(a.impacts,{channel:'racer',incomingNative:10,normal:v(0,1,0)});
 const {contacts}=applyNativeCraftContacts([a,b]);
 assert.equal(contacts[0].recordedA,false);assert.equal(contacts[0].recordedB,true);
 assert.deepEqual(a.impacts.normal,v(0,1,0));assert.deepEqual(b.impacts.normal,v(1,-0,-0));
});

test('separating overlaps receive full geometric response without a positive impact',()=>{
 const [a,b]=approaching({previousX:10}),before=a.hull.points.map(p=>({...p.position}));
 const {contacts}=applyNativeCraftContacts([a,b]);
 assert.deepEqual(contacts.map(c=>c.incomingNative),[-10,-10,-10,-10]);
 assert.ok(contacts.every(c=>!c.recordedA&&!c.recordedB));
 assert.deepEqual(a.hull.points[0].position,v(before[0].x-8,before[0].y,before[0].z));
 assert.equal(a.hull.points[0].velocity.x,-200);assert.equal(a.impacts.racerImpactNative,0);
});

test('refresh captures rotating endpoint movement and uses float32 up-plus-up before center',()=>{
 const e=entry();e.hull.frame.forward=v(1,0,0);e.hull.ticks=1;
 refreshNativeCraftContactState(e.contactState,e.hull);
 const s=nativeCraftContactSnapshot(e.contactState);
 assert.deepEqual(s.positionsNative,[v(27,2,0),v(9,2,0),v(-9,2,0),v(-27,2,0)]);
 assert.deepEqual(s.deltasNative,[v(27,0,-27),v(9,0,-9),v(-9,0,9),v(-27,0,27)]);
 // Synthetic rounding discriminator: center+(.75+.75) rounds to16777218;
 // two separate center+.75 additions would both round back to16777216.
 const r=entry({center:v(16777216,0,0),up:v(.75,1,0)});
 assert.ok(nativeCraftContactSnapshot(r.contactState).positionsNative.every(p=>p.x===16777218));
});

test('strict24 sphere boundary and full XYZ distance reject equality and elevated misses',()=>{
 for(const [separation,count]of [[23.999998092651367,4],[24,0],[24.000001907348633,0]]){
  assert.equal(applyNativeCraftContacts([entry(),entry({center:v(separation,0,0)})]).contacts.length,count);
 }
 assert.equal(applyNativeCraftContacts([entry(),entry({center:v(20,15,0)})]).contacts.length,0);
});

test('center78 broadphase is inclusive but the next float32 center is excluded',()=>{
 const denominator=Math.sqrt(733),fx=27/denominator,fy=2/denominator;
 function pair(x){return [entry({forward:v(fx,-fy,0),up:v(fy,fx,0)}),
  entry({center:v(x,0,0),forward:v(fx,fy,0),up:v(-fy,fx,0)})];}
 const admitted=applyNativeCraftContacts(pair(78));
 assert.equal(admitted.contacts.length,1);assert.ok(admitted.contacts[0].distanceNative<24);
 assert.equal(applyNativeCraftContacts(pair(78.00000762939453)).contacts.length,0);
});

test('large incoming displacement does not invent a swept collision',()=>{
 const entries=approaching({previousX:130,currentX:30});
 assert.equal(nativeCraftContactSnapshot(entries[1].contactState).deltasNative[0].x,-100);
 assert.equal(applyNativeCraftContacts(entries).contacts.length,0);
 assert.equal(entries[0].impacts.racerImpactNative,0);
});

test('source-index pair/proxy traversal is stable and a four-craft pass is bounded at96',()=>{
 const e=[0,10,20,30].map(x=>entry({center:v(x,0,0)})),r=applyNativeCraftContacts(e);
 const pairs=[...new Set(r.contacts.map(c=>`${c.racerA},${c.racerB}`))];
 assert.deepEqual(pairs,['0,1','0,2','1,2','1,3','2,3']);
 for(const pair of pairs){
  const indices=r.contacts.filter(c=>`${c.racerA},${c.racerB}`===pair).map(c=>c.proxyA*4+c.proxyB);
  assert.deepEqual(indices,indices.slice().sort((a,b)=>a-b));
 }
 // Deliberately degenerate, finite test axes collapse each craft's four
 // proxies; distinct centers retain valid contact normals. This exercises
 // the consumer's memory bound, not a claim of an ordinary fitted hull pose.
 const max=applyNativeCraftContacts([0,.5,1,1.5].map(x=>entry({center:v(x,0,0),forward:zero()})));
 assert.equal(max.contacts.length,96);assert.ok(Object.isFrozen(max));assert.ok(Object.isFrozen(max.contacts));
 assert.ok(max.contacts.every(c=>Object.isFrozen(c)&&Object.isFrozen(c.normal)&&Object.isFrozen(c.halfPushNative)));
});

test('C40 persists across later substeps and independently of another family shared-normal update',()=>{
 const e=approaching();applyNativeCraftContacts(e);
 recordNativeImpact(e[0].impacts,{channel:'box',incomingNative:2,normal:v(0,1,0)});
 for(let tick=2;tick<=5;tick++){
  move(e[0],zero(),tick);move(e[1],v(20+(tick-1)*.25,0,0),tick);applyNativeCraftContacts(e);
 }
 assert.equal(e[0].impacts.racerImpactNative,10);assert.equal(e[1].impacts.racerImpactNative,10);
 assert.deepEqual(e[0].impacts.normal,v(0,1,0),'smaller/equal racer impacts cannot replace a later family normal');
});

test('clock guards reject stale, duplicate and skipped refreshes; explicit reset reseeds history',()=>{
 const e=entry(),s0=nativeCraftContactSnapshot(e.contactState);
 assert.throws(()=>refreshNativeCraftContactState(e.contactState,e.hull),/exactly one/);
 e.hull.ticks=1;assert.throws(()=>applyNativeCraftContacts([e]),/stale/);
 refreshNativeCraftContactState(e.contactState,e.hull);applyNativeCraftContacts([e]);
 assert.throws(()=>applyNativeCraftContacts([e]),/already applied/);
 assert.throws(()=>refreshNativeCraftContactState(e.contactState,e.hull),/exactly one/);
 e.hull.ticks=3;assert.throws(()=>refreshNativeCraftContactState(e.contactState,e.hull),/exactly one/);
 e.hull.center=v(400,30,-200);resetNativeCraftContactState(e.contactState,e.hull);
 const reset=nativeCraftContactSnapshot(e.contactState);
 assert.equal(reset.tick,3);assert.equal(reset.revision,2);assert.equal(reset.lastAppliedTick,null);
 assert.deepEqual(reset.deltasNative,[zero(),zero(),zero(),zero()]);
 assert.deepEqual(reset.positionsNative[0],v(400,32,-173));
 assert.deepEqual(s0.positionsNative[0],v(0,2,27),'earlier snapshots retain their values');
 assert.equal(applyNativeCraftContacts([e]).contacts.length,0);
});

test('explicit world translation leaves cached proxies stale while broadphase reads the current center',()=>{
 const a=entry(),b=entry({center:v(20,0,0)}),before=nativeCraftContactSnapshot(a.contactState);
 a.hull.center.x+=1000;for(const p of a.hull.points)p.position.x+=1000;
 // Old proxies still overlap, but current body centers fail the coarse test.
 assert.equal(applyNativeCraftContacts([a,b]).contacts.length,0);
 assert.deepEqual(nativeCraftContactSnapshot(a.contactState).positionsNative,before.positionsNative);
 a.hull.ticks=1;refreshNativeCraftContactState(a.contactState,a.hull);
 const after=nativeCraftContactSnapshot(a.contactState);
 assert.ok(after.positionsNative.every(p=>p.x===1000));assert.ok(after.deltasNative.every(p=>p.x===1000));
 assert.ok(before.positionsNative.every(p=>p.x===0));
});

test('disabled application and read-only snapshots cannot consume or mutate physical history',()=>{
 const e=entry(),before=nativeCraftContactSnapshot(e.contactState),h=structuredClone(e.hull);
 assert.deepEqual(applyNativeCraftContacts([e],{enabled:false}),{contacts:[]});
 assert.deepEqual(nativeCraftContactSnapshot(e.contactState),before);assert.deepEqual(e.hull,h);
 assert.ok(Object.isFrozen(before)&&Object.isFrozen(before.positionsNative)&&Object.isFrozen(before.positionsNative[0]));
 assert.throws(()=>{before.positionsNative[0].x=99;},TypeError);
 assert.throws(()=>resetNativeCraftContactState(before,e.hull),/owned/);
 assert.throws(()=>refreshNativeCraftContactState(before,e.hull),/owned/);
 assert.throws(()=>applyNativeCraftContacts([{...e,contactState:before}]),/owned/);
 assert.equal(applyNativeCraftContacts([e]).contacts.length,0);
});

test('late coincident-center discovery rejects the entire pass before contacts mutate gameplay',()=>{
 const e=[entry(),entry({center:v(20,0,0)}),entry()];
 const before=e.map(p=>({hull:structuredClone(p.hull),impact:nativeImpactSnapshot(p.impacts),state:nativeCraftContactSnapshot(p.contactState)}));
 assert.throws(()=>applyNativeCraftContacts(e),/Coincident/);
 e.forEach((p,i)=>{
  assert.deepEqual(p.hull,before[i].hull);assert.deepEqual(nativeImpactSnapshot(p.impacts),before[i].impact);
  assert.deepEqual(nativeCraftContactSnapshot(p.contactState),before[i].state);
 });
});

test('owners, distinct impacts, matching clocks/scales and finite physical inputs are validated before mutation',()=>{
 const a=entry(),b=entry({center:v(20,0,0)}),snapshot=structuredClone(a.hull);
 assert.throws(()=>createNativeCraftContactState(a.hull),/already/);
 assert.throws(()=>resetNativeCraftContactState(a.contactState,b.hull),/another hull/);
 assert.throws(()=>applyNativeCraftContacts([a,{...b,contactState:a.contactState}]),/another hull/);
 assert.throws(()=>applyNativeCraftContacts([a,{...b,impacts:a.impacts}]),/distinct/);
 assert.throws(()=>applyNativeCraftContacts([a,{...b,impacts:{}}]),/impact state/);
 assert.throws(()=>applyNativeCraftContacts([a,entry({scale:.025,center:v(20,0,0)})]),/scale/);
 assert.throws(()=>applyNativeCraftContacts([a,entry({tick:1,center:v(20,0,0)})]),/tick/);
 b.impacts.racerImpactNative=1e100;
 assert.throws(()=>applyNativeCraftContacts([a,b]),/native float32/);b.impacts.racerImpactNative=0;
 b.hull.points[11].velocity.y=NaN;
 assert.throws(()=>applyNativeCraftContacts([a,b]),/finite XYZ/);assert.deepEqual(a.hull,snapshot);
 assert.throws(()=>applyNativeCraftContacts([a],{enabled:1}),/boolean/);
 assert.throws(()=>applyNativeCraftContacts(Array(5).fill(a)),/four/);
 assert.throws(()=>createNativeCraftContactState(hull({scale:0})),/scale/);
 assert.deepEqual(applyNativeCraftContacts([]),{contacts:[]});
});
