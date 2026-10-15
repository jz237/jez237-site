import test from 'node:test';
import assert from 'node:assert/strict';
import {NATIVE_RIDER_ROLES,NATIVE_RIDER_LINKS,NATIVE_RIDER_ORDINARY_TYPES,
  nativeRiderTargetsFromPose,prepareNativeRiderRest,projectNativeRiderTargets,solveNativeRiderLinks,
  createNativeArticulatedRider,stepNativeArticulatedRider} from '../native-articulated-rider.js';
import {createNativeRiderControlState,prepareNativeRiderControls,finishNativeRiderControls} from '../native-rider-controls.js';

const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>({...p});
const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const vectorClose=(a,b,e=1e-10)=>['x','y','z'].forEach(k=>close(a[k],b[k],e));
const translated=(pose,d)=>pose.map(p=>vec(p.x+d.x,p.y+d.y,p.z+d.z));
const center=vec(),up=vec(0,1,0),allFree=Array(19).fill(1),zeros=()=>Array.from({length:19},()=>vec());
// Independently authored bent rider, with no source animation/rest assets.
const authored=()=>[
  vec(0,1.6,-.15),vec(0,1.35,-.15),vec(0,.9,-.25),
  vec(-.22,1.27,-.15),vec(-.3,1.1,.1),vec(-.28,.92,.35),vec(-.28,.92,.4375),
  vec(-.13,.75,-.35),vec(-.28,.45,-.08),vec(-.26,.1,-.5),vec(-.26,.1,-.25),
  vec(.22,1.27,-.15),vec(.3,1.1,.1),vec(.28,.92,.35),vec(.28,.92,.4375),
  vec(.13,.75,-.35),vec(.28,.45,-.08),vec(.26,.1,-.5),vec(.26,.1,-.25)
];
const project=(options={})=>projectNativeRiderTargets({positions:authored(),targets:authored(),
  storedDeltas:zeros(),center,up,types:allFree,...options});
const anchors=pose=>({2:pose[6],3:pose[14]});
const total=p=>p.reduce((v,q)=>vec(v.x+q.x,v.y+q.y,v.z+q.z),vec());

test('authored anatomical targets and rest setup are explicit, ordered and independent',()=>{
  const p=authored(),pose=Object.fromEntries(NATIVE_RIDER_ROLES.map((name,i)=>[name,p[i]]));
  const mapped=nativeRiderTargetsFromPose(pose),rest=prepareNativeRiderRest(mapped);
  assert.equal(mapped.length,19);assert.equal(rest.length,22);
  close(rest[0],.25);close(rest[8],.0875);close(rest[18],.25);
  assert.ok(Object.isFrozen(rest)&&Object.isFrozen(NATIVE_RIDER_LINKS[0]));
  mapped[2].y=999;assert.equal(pose.torsoRoot.y,.9);
  assert.throws(()=>nativeRiderTargetsFromPose({}),/headTip/);
  assert.throws(()=>createNativeArticulatedRider(),/nineteen/);
});

test('horizontal target projection follows targets exactly while up retains forty percent',()=>{
  const p=authored(),goal=translated(p,vec(.4,.5,-.3));
  const actual=project({positions:p,targets:goal});
  for(let i=0;i<19;i++)vectorClose(actual[i],vec(p[i].x+.4,p[i].y+.2,p[i].z-.3));
  assert.deepEqual(p,authored(),'the pure projection must not mutate caller inputs');
});

test('only a negative stored-up displacement contributes the separate sixty percent history term',()=>{
  const p=authored(),history=zeros();history[2].y=-.2;history[3].y=.2;history[4].x=20;
  const actual=project({storedDeltas:history});
  close(actual[2].y,p[2].y-.12);vectorClose(actual[3],p[3]);vectorClose(actual[4],p[4]);
});

test('manipulation adds to history before the negative-up test, matching the raw joint consumer',()=>{
  const p=authored(),goal=p.map(copy),history=zeros(),manipulation=zeros();
  p[2]=vec(5,40,7);goal[2]=vec(5,45.01806640625,7);
  history[2].y=.5;manipulation[2].y=Math.fround(-1.1);
  // B changes old-up+.5 to approximately−.6 BEFORE the sign test. The raw
  // binary32 result is41.64722442626953 native; the world kernel uses JS math.
  const result=project({positions:p,targets:goal,storedDeltas:history,manipulationDeltas:manipulation,scale:1});
  close(result[2].y,40+.4*(45.01806640625-40)+.6*(.5+Math.fround(-1.1)));
  close(result[2].y,41.64722442626953,2**-18); // One binary32 ULP at this native magnitude.
  const without=project({positions:p,targets:goal,storedDeltas:history,scale:1});
  assert.ok(Math.abs(result[2].y-(without[2].y+.6*manipulation[2].y))>.2,
    'adding a post-projection impulse would bypass the source sign test');
  assert.equal(history[2].y,.5);assert.equal(manipulation[2].y,Math.fround(-1.1));
});

test('distance clipping precedes the manipulation/history projection and foot minimum follows it',()=>{
  const p=authored(),goal=p.map(copy),history=zeros(),manipulation=zeros(),types=[...allFree];
  p[2]=vec(5,0,7);goal[2]=vec(5,200,7);history[2].y=.5;manipulation[2].y=Math.fround(-1.1);
  types[9]=4;goal[9].y=-20;manipulation[9].y=-100;
  const result=project({positions:p,targets:goal,storedDeltas:history,manipulationDeltas:manipulation,types,scale:1});
  close(result[2].y,169.63999938964844,2e-6);
  close(result[9].y,.107405);
});

test('fifty native unit cap bounds retained vertical lag instead of limiting target travel',()=>{
  const p=authored(),goal=translated(p,vec(0,10,0));
  const actual=project({targets:goal});
  for(let i=0;i<19;i++)close(actual[i].y,goal[i].y-50*.025*.6);
  const half=project({targets:goal,scale:.0125});
  for(let i=0;i<19;i++)close(half[i].y,goal[i].y-50*.0125*.6);
});

test('fixed targets and two physical anchor types remain distinct from animated hand targets',()=>{
  const p=authored(),types=[...allFree];types[0]=0;types[6]=2;types[14]=3;
  const goal=translated(p,vec(1,1,1)),grips={2:vec(-.5,.8,.9),3:vec(.5,.8,.9)};
  const actual=project({targets:goal,types,anchors:grips});
  vectorClose(actual[0],goal[0]);vectorClose(actual[6],grips[2]);vectorClose(actual[14],grips[3]);
  assert.notDeepEqual(actual[6],goal[6]);
  assert.throws(()=>project({types}),/anchors\[2\]/);
  const manipulation=Array.from({length:19},()=>vec(100,-100,100));
  const withManipulation=project({targets:goal,types,anchors:grips,manipulationDeltas:manipulation});
  for(const i of [0,6,14])vectorClose(withManipulation[i],actual[i]);
});

test('foot projection has two hull-relative minimum heights, without the target distance cap',()=>{
  const p=authored(),types=[...allFree],goal=p.map(copy);
  for(const [i,type] of [[9,4],[10,5]]){types[i]=type;goal[i].y=-10;}
  const actual=project({types,targets:goal});
  close(actual[9].y,.107405*.025);close(actual[10].y,3.107405*.025);
  goal[9].y=10;
  const lifted=project({types,targets:goal});
  close(lifted[9].y,p[9].y+.4*(10-p[9].y));
});

test('target and constraint math follow a rotated hull without using world Y as body up',()=>{
  const transform=p=>vec(-p.y+3,p.x-2,p.z+4),p=authored(),goal=translated(p,vec(.1,.3,-.2));
  const a=project({targets:goal});
  const b=project({positions:p.map(transform),targets:goal.map(transform),
    center:transform(center),up:vec(-1,0,0)});
  for(let i=0;i<19;i++)vectorClose(b[i],transform(a[i]));
  const rest=prepareNativeRiderRest(p),solved=solveNativeRiderLinks(a,rest,{types:allFree});
  const rotated=solveNativeRiderLinks(b,rest,{types:allFree});
  for(let i=0;i<19;i++)vectorClose(rotated[i],transform(solved[i]));
});

test('free link corrections preserve the centroid and reduce a stretched authored shape',()=>{
  const p=authored(),rest=prepareNativeRiderRest(p),stretched=p.map(q=>vec(q.x*1.5,q.y*1.5,q.z*1.5));
  const solved=solveNativeRiderLinks(stretched,rest,{types:allFree});
  vectorClose(total(solved),total(stretched));
  const error=points=>NATIVE_RIDER_LINKS.reduce((sum,[a,b],i)=>sum+Math.abs(Math.hypot(
    points[a].x-points[b].x,points[a].y-points[b].y,points[a].z-points[b].z)-rest[i]),0);
  assert.ok(error(solved)<error(stretched),'eight passes reduce link error without claiming complete convergence');
});

test('exactly eight link passes match the closed form of one mobile endpoint',()=>{
  const p=Array.from({length:19},(_,i)=>vec(i,1,0)),rest=prepareNativeRiderRest(p),types=Array(19).fill(0);
  types[0]=1;p[0].x=-.5;
  const solved=solveNativeRiderLinks(p,rest,{types});
  // Only the first endpoint moves. Per-pass doubled correction contracts the
  // length error by 1-2g, so after eight passes its remaining offset is known.
  const gain=.5/2.7;
  close(solved[0].x,-.5*(1-2*gain)**8);
  for(let i=1;i<19;i++)vectorClose(solved[i],p[i]);
});

test('ordinary hard grips are preserved through all eight passes and independent rider states',()=>{
  const p=authored(),state=createNativeArticulatedRider({restTargets:p}),other=createNativeArticulatedRider({restTargets:p});
  const target=translated(p,vec(.2,.1,.3));
  stepNativeArticulatedRider(state,{targets:target,historyTargets:p,center,up,anchors:anchors(target)});
  vectorClose(state.points[6].position,target[6]);vectorClose(state.points[14].position,target[14]);
  assert.equal(state.logicalFrames,1);assert.equal(other.logicalFrames,0);
  assert.deepEqual(other.points.map(q=>q.position),p);
  assert.deepEqual(state.points.map(q=>q.type),NATIVE_RIDER_ORDINARY_TYPES);
});

test('physical joint2 output differs from the visual target and history remains caller-owned',()=>{
  const p=authored(),state=createNativeArticulatedRider({restTargets:p}),goal=translated(p,vec(0,.4,0));
  const history=translated(p,vec(.1,-.2,.3));
  stepNativeArticulatedRider(state,{targets:goal,historyTargets:history,center,up,anchors:anchors(goal)});
  vectorClose(state.jointWorld,state.points[2].position);
  assert.ok(Math.abs(state.jointWorld.y-goal[2].y)>.01);
  vectorClose(state.points[2].storedDelta,vec(state.jointWorld.x-history[2].x,
    state.jointWorld.y-history[2].y,state.jointWorld.z-history[2].z));
  state.jointWorld.y=999;assert.notEqual(state.points[2].position.y,999);
});

test('post-hull B preprocessing enters the physical solve, then manipulation is replaced by solved-minus-history',()=>{
  const p=authored(),state=createNativeArticulatedRider({restTargets:p}),other=createNativeArticulatedRider({restTargets:p});
  const controls=createNativeRiderControlState({baseLateralRetention:.85,baseRollBalance:.03});
  const prepared=prepareNativeRiderControls(controls,{heldButtons:0x4000,pressedButtons:0x4000});
  const modified=finishNativeRiderControls(prepared.state,{targets:p,center,up});
  const args={targets:modified.targets,historyTargets:p,center,up,anchors:anchors(p)};
  stepNativeArticulatedRider(state,{...args,manipulationDeltas:modified.manipulationDeltas});
  stepNativeArticulatedRider(other,args);
  assert.ok(state.jointWorld.y<other.jointWorld.y-.001,
    'the extra negative-up term must affect the physical torso rather than just its target');
  for(let i=0;i<19;i++)vectorClose(state.points[i].storedDelta,vec(state.points[i].position.x-p[i].x,
    state.points[i].position.y-p[i].y,state.points[i].position.z-p[i].z));
  const before=structuredClone(state),expected=structuredClone(state);
  const next={targets:p,historyTargets:p,center,up,anchors:anchors(p)};
  const projected=projectNativeRiderTargets({positions:before.points.map(q=>q.position),targets:p,
    storedDeltas:before.points.map(q=>q.storedDelta),types:NATIVE_RIDER_ORDINARY_TYPES,center,up,anchors:anchors(p)});
  const solved=solveNativeRiderLinks(projected,state.restLengths);
  stepNativeArticulatedRider(expected,next);
  for(let i=0;i<19;i++)vectorClose(expected.points[i].position,solved[i]);
});

test('invalid authored inputs and collapsed links fail before mutating the rider',()=>{
  const p=authored(),state=createNativeArticulatedRider({restTargets:p}),before=structuredClone(state);
  assert.throws(()=>stepNativeArticulatedRider(state,{targets:p,center,up,anchors:anchors(p)}),/historyTargets/);
  assert.deepEqual(state,before);
  const collapsed=p.map(copy);collapsed[0]=copy(collapsed[1]);
  assert.throws(()=>solveNativeRiderLinks(collapsed,state.restLengths),/Collapsed/);
  assert.throws(()=>project({up:vec(0,2,0)}),/unit/);
  assert.throws(()=>createNativeArticulatedRider({restTargets:p,restLengths:Array(22).fill(1)}),/not both/);
  assert.throws(()=>createNativeArticulatedRider({restLengths:Array(22).fill(0),positions:p}),/positive/);
  assert.throws(()=>project({types:Array(19).fill(6)}),/integers/);
  assert.throws(()=>stepNativeArticulatedRider(state,{targets:p,historyTargets:p,center,up,
    anchors:anchors(p),manipulationDeltas:zeros().slice(1)}),/manipulationDeltas/);
  const invalid=zeros();invalid[18].z=NaN;
  assert.throws(()=>project({manipulationDeltas:invalid}),/finite/);
  assert.deepEqual(state,before);
});
