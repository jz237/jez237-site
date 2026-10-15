import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceFloatingObjects,stepSourceFloatingObjects,sourceFloatingSphereContact,collideSourceFloatingObjects,
 SOURCE_FLOATING_FRAME_STEP,SOURCE_FLOATING_POINT_STEP,SOURCE_FLOATING_CRAFT_SHARE} from '../source-floating-objects.js';
import {portDynamicObjectsForSelection} from '../source-port-course.js';

// Independently recovered numeric oracles: object update once/logical frame,
// craft contact each physics substep, and float32 .3 / .7 penetration split.
const S=.025,F=.05,H=.01,A=.30000001192092896;
const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const vec=(x=0,y=0,z=0)=>({x,y,z});
const compare=(a,b,e=1e-10)=>{for(const axis of ['x','y','z'])close(a[axis],b[axis],e);};
const definition=(overrides={})=>({id:'float',x:0,y:0,z:0,runtimeKind:9,sourcePhysicsFlag:4,sourceCollisionKind:2,radius:25*S,...overrides});
function hull(velocity=vec()){
 return {scale:S,center:vec(),frame:{up:vec(0,1,0),forward:vec(0,0,1)},
  points:Array.from({length:12},(_,i)=>({position:vec(i*S,0,0),velocity:{...velocity}}))};
}
const far=vec(100,100,100);

test('Port supplies twelve independent floating states for every class/player/Stunt selection',()=>{
 for(const playerCount of [1,2])for(const difficulty of [0,1,2,3])for(const mode of ['race','stunt']){
  const definitions=portDynamicObjectsForSelection({playerCount,difficulty,mode}),state=createSourceFloatingObjects(definitions);
  assert.equal(state.objects.length,12);assert.equal(state.frames,0);assert.equal(state.simulationTime,0);
  assert.equal(state.objects[0].sourcePlayerCount,playerCount);assert.equal(state.objects[0].sourceNativeClass,mode==='stunt'?0:Math.min(difficulty,2));
  compare(state.objects[0].position,vec(3600*S,0,600*S));compare(state.objects[11].position,vec(-4850*S,0,-5150*S));
  assert.ok(state.objects.every(q=>q.radius===.625&&q.runtimeKind===9&&q.sourcePhysicsFlag===4&&q.sourceCollisionKind===2));
  definitions[0].x=999;assert.equal(state.objects[0].position.x,3600*S);
 }
 const a=createSourceFloatingObjects([definition()]),b=createSourceFloatingObjects([definition()]);a.objects[0].position.x=999;
 assert.equal(b.objects[0].position.x,0);assert.ok(Object.isFrozen(a.objects),'candidate order cannot be accidentally reordered');
});

test('one logical update applies recovered springs, damping, gravity and lift before integration',()=>{
 const state=createSourceFloatingObjects([definition({x:10*S,y:-20*S,z:-30*S,anchorX:0,anchorZ:0,sourceVelocityNativePerUpdate:[2,-2,-1]})]);
 stepSourceFloatingObjects(state,.05,{surface:0});
 const q=state.objects[0];
 // Native: vx=.9*2+.001*(-10)=1.79, vz=.9*(-1)+.001*30=-.87.
 // vy=.8*(-2)-4+.3*20=.4; positions add those native velocities once.
 compare(q.velocity,vec(1.79*S/F,.4*S/F,-.87*S/F));
 compare(q.position,vec(11.79*S,-19.6*S,-30.87*S));
 assert.equal(state.frames,1);assert.equal(state.stepsLast,1);close(state.simulationTime,.05);
 assert.equal(SOURCE_FLOATING_FRAME_STEP,F);assert.equal(SOURCE_FLOATING_POINT_STEP,H);assert.equal(SOURCE_FLOATING_CRAFT_SHARE,A);
});

test('lift is capped at thirty native depth and never supplies upward force above water',()=>{
 const deep=createSourceFloatingObjects([definition({y:-100*S})]),dry=createSourceFloatingObjects([definition({y:10*S})]);
 stepSourceFloatingObjects(deep,F,{surface:0});stepSourceFloatingObjects(dry,F,{surface:0});
 compare(deep.objects[0].velocity,vec(0,5*S/F,0));close(deep.objects[0].position.y,-95*S);
 compare(dry.objects[0].velocity,vec(0,-4*S/F,0));close(dry.objects[0].position.y,6*S);
 const shifted=createSourceFloatingObjects([definition({y:-10*S})]);stepSourceFloatingObjects(shifted,F,{surface:10*S});
 close(shifted.objects[0].velocity.y,2*S/F);close(shifted.objects[0].position.y,-8*S);
});

test('flat-water equilibrium and a displaced anchor converge without freezing or clamping',()=>{
 const state=createSourceFloatingObjects([definition({x:50*S,anchorX:0})]);
 for(let i=0;i<80;i++)stepSourceFloatingObjects(state,1,{surface:0});
 close(state.objects[0].position.x,0,2e-7);close(state.objects[0].velocity.x,0,2e-7);
 close(state.objects[0].position.y,-(4/.3)*S,1e-10);close(state.objects[0].velocity.y,0,1e-10);
 assert.equal(state.frames,1600);
});

test('50ms accumulation gives identical trajectories at 20/60/100Hz and samples endpoint logical times',()=>{
 const make=()=>createSourceFloatingObjects([definition({x:.2,y:-.1,z:1,anchorX:0,anchorZ:0})]);
 const a=make(),b=make(),c=make(),surface=(x,z,time)=>Math.sin(time*2)+x*.01-z*.02;
 for(let i=0;i<200;i++)stepSourceFloatingObjects(a,1/20,{surface});
 for(let i=0;i<600;i++)stepSourceFloatingObjects(b,1/60,{surface});
 for(let i=0;i<1000;i++)stepSourceFloatingObjects(c,1/100,{surface});
 assert.equal(a.frames,200);assert.equal(b.frames,200);assert.equal(c.frames,200);
 assert.deepEqual(a.objects,b.objects);assert.deepEqual(a.objects,c.objects);
 const sampleTimes=[],d=make();stepSourceFloatingObjects(d,.04,{surface:(x,z,t)=>{sampleTimes.push(t);return 0;}});assert.equal(d.frames,0);
 stepSourceFloatingObjects(d,.06,{surface:(x,z,t)=>{sampleTimes.push(t);return 0;}});assert.deepEqual(sampleTimes,[.05,.1]);
});

test('the external activity gate freezes motion without accumulating paused wall time',()=>{
 const state=createSourceFloatingObjects([definition()]);stepSourceFloatingObjects(state,.04,{surface:0});
 const before=structuredClone(state);stepSourceFloatingObjects(state,1,{active:false});assert.deepEqual(state,before);
 stepSourceFloatingObjects(state,.01,{surface:0});assert.equal(state.frames,1);close(state.objects[0].position.y,-4*S);
});

test('adapter boundary runs five craft/contact phases before one free-object update',()=>{
 const state=createSourceFloatingObjects([definition({y:-20*S})]),order=[];
 stepSourceFloatingObjects(state,.1,{surface:(x,z,time)=>{order.push('wave:'+time);return 0;},
  beforeObjectUpdate:(s,clock)=>{assert.equal(s.frames,clock.frame-1);assert.equal(clock.physicsSteps,5);for(let i=0;i<clock.physicsSteps;i++)order.push('craft:'+clock.frame+':'+i);},
  afterObjectUpdate:(s,clock)=>{assert.equal(s.frames,clock.frame);order.push('objects:'+clock.frame);}});
 assert.deepEqual(order,['craft:1:0','craft:1:1','craft:1:2','craft:1:3','craft:1:4','wave:0.05','objects:1','craft:2:0','craft:2:1','craft:2:2','craft:2:3','craft:2:4','wave:0.1','objects:2']);
});

test('strict sphere extent is 25+12 native and pure contact exposes both velocity units',()=>{
 const state=createSourceFloatingObjects([definition()]);
 assert.equal(sourceFloatingSphereContact(state,0,vec(37*S,0,0)),null);
 assert.equal(sourceFloatingSphereContact(state,0,vec(0,37*S,0)),null);
 const hit=sourceFloatingSphereContact(state,0,vec(30*S,0,0));assert.equal(hit.status,'contact');close(hit.penetrationNative,7);
 compare(hit.normal,vec(1,0,0));close(hit.craftTranslation.x,7*A*S);close(hit.objectTranslation.x,-7*(1-A)*S);
 close(hit.craftPointDeltaVelocity.x,7*A*S/H);close(hit.objectDeltaVelocity.x,-7*(1-A)*S/F);
 assert.equal(state.objects[0].position.x,0);assert.equal(state.objects[0].velocity.x,0,'pure geometry does not apply recoil');
});

test('contact shifts all twelve points, kicks only the selected three and recoils the object',()=>{
 const state=createSourceFloatingObjects([definition()]),craft=hull(vec(-2*S/H,1,0)),positions=craft.points.map(q=>({...q.position})),cached=structuredClone({center:craft.center,frame:craft.frame});
 const impact={maximum:0,normal:null,hitKind:2},result=collideSourceFloatingObjects(state,craft,{probes:[vec(30*S,0,0),far],impactState:impact});
 assert.equal(result.contacts.length,1);assert.deepEqual(result.contacts[0].pointIndices,[4,5,3]);assert.equal(result.unresolved.length,0);
 close(impact.maximum,2*S/H);compare(impact.normal,vec(1,0,0));assert.equal(impact.hitKind,0);
 for(let i=0;i<12;i++){
  compare(craft.points[i].position,vec(positions[i].x+7*A*S,positions[i].y,positions[i].z));
  compare(craft.points[i].velocity,vec(-2*S/H+([3,4,5].includes(i)?7*A*S/H:0),1,0));
 }
 close(state.objects[0].position.x,-7*(1-A)*S);close(state.objects[0].velocity.x,-7*(1-A)*S/F);
 assert.deepEqual({center:craft.center,frame:craft.frame},cached,'normal hull integration owns the next fitted pose');
 close(result.contacts[0].normalSpeedNative,2);
});

test('first descending overlap wins per probe and separating overlaps still resolve',()=>{
 const state=createSourceFloatingObjects([definition({id:'first'}),definition({id:'last'})]),craft=hull(vec(3*S/H,0,0)),impact={maximum:10,normal:vec(0,1,0),hitKind:2};
 const result=collideSourceFloatingObjects(state,craft,{probes:[vec(30*S,0,0),far],impactState:impact});
 assert.equal(result.contacts[0].id,'last');assert.ok(result.contacts[0].normalSpeed<0);assert.equal(state.objects[0].position.x,0);assert.ok(state.objects[1].position.x<0);
 assert.equal(impact.maximum,10);compare(impact.normal,vec(0,1,0));assert.equal(impact.hitKind,0);
 assert.ok(craft.points[4].velocity.x>3*S/H,'source response is penetration based, not gated by approach speed');
});

test('front then rear probes stay latched while the second sees the first object recoil',()=>{
 const state=createSourceFloatingObjects([definition({y:2*S,z:9*S})]),craft=hull();
 const result=collideSourceFloatingObjects(state,craft);
 assert.equal(result.contacts.length,2);assert.deepEqual(result.contacts.map(q=>q.pointIndices),[[4,5,3],[11,10,9]]);
 compare(result.contacts[0].probe,vec(0,2*S,27*S));compare(result.contacts[1].probe,vec(0,2*S,-9*S));
 compare(result.contacts[0].normal,vec(0,0,1));compare(result.contacts[1].normal,vec(0,0,-1));
 const firstDepth=19,afterFirstZ=9-firstDepth*(1-A),secondDepth=37-Math.abs(-9-afterFirstZ);
 close(result.contacts[0].penetrationNative,firstDepth);close(result.contacts[1].penetrationNative,secondDepth);
 close(state.objects[0].position.z,(afterFirstZ+secondDepth*(1-A))*S);
 close(state.objects[0].velocity.z,(-firstDepth+secondDepth)*(1-A)*S/F);
 close(craft.points[0].position.z,(firstDepth-secondDepth)*A*S);
});

test('shared objects immediately expose recoil to later racers but races have independent state',()=>{
 const definitions=[definition()],shared=createSourceFloatingObjects(definitions),independent=createSourceFloatingObjects(definitions),a=hull(),b=hull();
 const first=collideSourceFloatingObjects(shared,a,{probes:[vec(30*S,0,0),far]}),second=collideSourceFloatingObjects(shared,b,{probes:[vec(30*S,0,0),far]});
 close(first.contacts[0].penetrationNative,7);close(second.contacts[0].penetrationNative,7*A);
 compare(independent.objects[0].position,vec());compare(independent.objects[0].velocity,vec());
 stepSourceFloatingObjects(shared,F,{surface:0});assert.ok(shared.objects[0].position.x<second.contacts[0].objectTranslation.x);
});

test('a coincident center stays explicitly unresolved and never invents a normal',()=>{
 const state=createSourceFloatingObjects([definition({id:'lower',x:-S}),definition({id:'coincident'})]),craft=hull(),before=structuredClone(craft);
 const result=collideSourceFloatingObjects(state,craft,{probes:[vec(),far]});
 assert.deepEqual(result.contacts,[]);assert.equal(result.unresolved.length,1);assert.equal(result.unresolved[0].id,'coincident');assert.equal(result.unresolved[0].status,'coincident-center');
 assert.deepEqual(craft,before);compare(state.objects[1].position,vec());assert.ok(state.objects.every(q=>Object.values(q.position).every(Number.isFinite)));
});

test('surface queries use moving pre-integration coordinates and invalid queries commit no partial update',()=>{
 const state=createSourceFloatingObjects([definition({id:'a',x:10*S,sourceVelocityNativePerUpdate:[2,0,0]}),definition({id:'b',x:20*S})]),samples=[];
 stepSourceFloatingObjects(state,F,{surface:(x,z,time,q)=>{samples.push([x,z,time,q.id]);return 0;}});
 assert.deepEqual(samples,[[10*S,0,F,'a'],[20*S,0,F,'b']]);
 const before=structuredClone(state.objects);assert.throws(()=>stepSourceFloatingObjects(state,F,{surface:(x,z,time,q)=>q.id==='b'?NaN:0}),TypeError);
 assert.deepEqual(state.objects,before);assert.equal(state.frames,1);
});

test('invalid units, unsupported kinds and nonfinite external fields are rejected',()=>{
 assert.throws(()=>createSourceFloatingObjects(null),TypeError);assert.throws(()=>createSourceFloatingObjects([definition()],{scale:0}),RangeError);
 assert.throws(()=>createSourceFloatingObjects([definition(),definition()]),TypeError);assert.throws(()=>createSourceFloatingObjects([definition({runtimeKind:10})]),RangeError);
 assert.throws(()=>createSourceFloatingObjects([definition({sourcePhysicsFlag:0})]),RangeError);assert.throws(()=>createSourceFloatingObjects([definition({radius:50*S})]),RangeError);
 assert.throws(()=>createSourceFloatingObjects([definition({sourceVelocityNativePerUpdate:[1,NaN,0]})]),TypeError);
 const state=createSourceFloatingObjects([definition()]);assert.throws(()=>stepSourceFloatingObjects(state,F),TypeError);assert.throws(()=>stepSourceFloatingObjects(state,-.1,{surface:0}),RangeError);
 assert.throws(()=>stepSourceFloatingObjects(state,2,{surface:0}),RangeError);assert.throws(()=>stepSourceFloatingObjects(state,F,{surface:0,active:1}),TypeError);
 assert.throws(()=>sourceFloatingSphereContact(state,1,vec()),RangeError);assert.throws(()=>sourceFloatingSphereContact(state,0,vec(NaN,0,0)),TypeError);
 assert.throws(()=>collideSourceFloatingObjects(state,{...hull(),scale:1}),TypeError);assert.throws(()=>collideSourceFloatingObjects(state,hull(),{probes:[vec()]}),TypeError);
});
