import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuthoredNativeActionPoses} from '../authored-native-action-poses.js';
import {createNativeHull} from '../native-hull.js';
import {NATIVE_RIDER_LINKS} from '../native-articulated-rider.js';
import {authoredNativeRiderTargets} from '../authored-native-rider.js';
import {riderPose} from '../rider-pose.js';

const AXES=['x','y','z'],copy=p=>({...p}),vec=(x=0,y=0,z=0)=>({x,y,z});
const distance=(a,b)=>Math.hypot(...AXES.map(k=>a[k]-b[k]));
const REST=authoredNativeRiderTargets(riderPose('',0,0),createNativeHull()).map(p=>Object.fromEntries(AXES.map(k=>[k,p[k]/.025])));
const provider=(scale=.025,rest=REST)=>createAuthoredNativeActionPoses({scale,restTargetsLocal:rest});
const q=(actorState,animationFrame,extra={})=>({actorState,animationFrame,hull:createNativeHull(),...extra});
function near(a,b,e=1e-9){assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);}
function point(a,b,e=1e-9){AXES.forEach(k=>near(a[k],b[k],e));}
function world(p,hull){
 const {right:r,up:u,forward:f}=hull.frame;
 return Object.fromEntries(AXES.map(k=>[k,hull.center[k]+hull.scale*(r[k]*p.x+u[k]*p.y+f[k]*p.z)]));
}

test('recovered descriptor bounds and actor17 next38 stop do not become a new private animation clock',()=>{
 const p=provider();
 for(const [actor,last]of [[8,55],[9,88],[17,60]])for(const frame of [0,1,last-1,last,last+1,last+100,1.99]){
  const evaluated=Math.min(last,Math.floor(frame)),expected=evaluated===last||actor===17&&evaluated===37?-1:evaluated+1;
  const a=p.evaluate(q(actor,frame));assert.equal(a.evaluatedAnimationFrame,evaluated);assert.equal(a.nextAnimationFrame,expected);
  assert.deepEqual(p.evaluate(q(actor,frame)),a,'same sample is independent of call count');
 }
 assert.equal(p.evaluate(q(17,37)).nextAnimationFrame,-1);
 assert.equal(p.evaluate(q(17,38)).nextAnimationFrame,39,'the source equality stop is not an invented upper clamp at37');
 assert.equal(p.evaluate(q(17,40)).nextAnimationFrame,41,'source alternate release jump remains playable');
 assert.equal(p.evaluate(q(8,1)).nextAnimationFrame,2,'seeking backwards does not retain the previous terminal sample');
});

test('actor10 consumes the actual choice and recovered49-frame wrapper, including start26 and restart1',()=>{
 const p=provider();
 for(const [choice,frame,next]of [[0,24,25],[1,24,-1],[2,24,-1],[3,24,25],
  [0,48,-1],[1,48,1],[2,48,-1],[3,48,-1],[1,26,27],[1,100,1]]){
  const a=p.evaluate(q(10,frame,{idleChoice16c4:choice}));assert.equal(a.nextAnimationFrame,next);assert.equal(a.evaluatedAnimationFrame,Math.min(48,frame));
 }
 assert.throws(()=>p.evaluate(q(10,1)),/actual idleChoice16c4/);
 assert.throws(()=>p.evaluate(q(10,1,{idleChoice16c4:4})),/actual idleChoice16c4/);
 assert.notDeepEqual(p.evaluate(q(10,12,{idleChoice16c4:0})).targets,p.evaluate(q(10,12,{idleChoice16c4:1})).targets);
});

test('actor25 samples authored4/8 by actual16cc and always returns0 regardless of stored frame',()=>{
 const p=provider();
 for(const alternate16cc of [0,1,65535]){
  const first=p.evaluate(q(25,0,{alternate16cc}));
  assert.equal(first.evaluatedAnimationFrame,alternate16cc===0?4:8);assert.equal(first.nextAnimationFrame,0);
  for(const animationFrame of [1,4,8,37,1000])assert.deepEqual(p.evaluate(q(25,animationFrame,{alternate16cc})),first);
 }
 assert.notDeepEqual(p.evaluate(q(25,0,{alternate16cc:0})).targets,p.evaluate(q(25,0,{alternate16cc:1})).targets);
 assert.throws(()=>p.evaluate(q(25,0)),/actual alternate16cc/);
});

test('authored action paths are distinct physical anatomy with a supported inversion, turn and raised spin',()=>{
 const p=provider(),rest=REST.map(v=>world(v,createNativeHull()));
 const inverted=p.evaluate(q(8,30)).targets;
 assert.ok(inverted[0].y<inverted[2].y);assert.ok(inverted[9].y>inverted[2].y);
 point(inverted[6],rest[6]);point(inverted[14],rest[14]);
 const turned=p.evaluate(q(9,46)).targets;assert.ok(turned[0].z<turned[2].z);
 const spin=p.evaluate(q(17,11)).targets;assert.ok(spin[0].z<spin[2].z);
 assert.ok(p.evaluate(q(17,23)).targets[2].y>rest[2].y);
 for(const [actor,frame,extra]of [[8,30,{}],[9,46,{}],[17,23,{}],[10,12,{idleChoice16c4:3}],[25,0,{alternate16cc:0}]]){
  assert.notDeepEqual(p.evaluate(q(actor,frame,extra)).targets,rest,`actor${actor} must evaluate its own authored action`);
 }
 assert.match(p.provenance.geometry,/new authored/);assert.match(p.provenance.compatibility,/not established/);
});

test('all nineteen-role link lengths remain the authored rest lengths throughout each path and jump branch',()=>{
 const p=provider(),hull=createNativeHull(),lengths=NATIVE_RIDER_LINKS.map(([a,b])=>distance(REST[a],REST[b])*.025);
 for(const [actor,last,extra]of [[8,55,{}],[9,88,{}],[17,60,{}],[10,48,{idleChoice16c4:0}],[10,48,{idleChoice16c4:3}],[25,0,{alternate16cc:0}],[25,0,{alternate16cc:1}]]){
  for(let frame=0;frame<=last;frame++){
   const {targets}=p.evaluate(q(actor,frame,{...extra,hull}));
   assert.equal(targets.length,19);assert.ok(targets.every(v=>AXES.every(k=>Number.isFinite(v[k]))));
   NATIVE_RIDER_LINKS.forEach(([a,b],i)=>near(distance(targets[a],targets[b]),lengths[i],3e-6));
  }
 }
});

test('source held positions and jump25→62 /23→40 retain continuous authored geometry',()=>{
 const p=provider();
 const check=(actor,a,b)=>p.evaluate(q(actor,a)).targets.forEach((v,i)=>point(v,p.evaluate(q(actor,b)).targets[i]));
 check(8,30,31);check(9,24,62);check(9,45,46);check(17,23,24);check(17,23,40);
 for(const [actor,last]of [[8,55],[9,88],[17,60]]){
  let previous=p.evaluate(q(actor,0)).targets,maxStep=0;
  for(let f=.25;f<=last;f+=.25){
   const next=p.evaluate(q(actor,f)).targets;
   next.forEach((v,i)=>{maxStep=Math.max(maxStep,distance(v,previous[i]));});previous=next;
  }
  assert.ok(maxStep<.65,`actor${actor} bounded ordinary-frame displacement ${maxStep}`);
 }
});

test('native-local rest lengths are scaled once through actual pitched/rolled hull frames',()=>{
 const base=provider().evaluate(q(8,23)).targets.map(p=>Object.fromEntries(AXES.map(k=>[k,p[k]/.025])));
 for(const scale of [.01,.025,.05,1]){
  const hull=createNativeHull({position:vec(7,-3,11),heading:.6,pitch:.2,roll:-.4,scale});
  const result=provider(scale).evaluate(q(8,23,{hull}));result.targets.forEach((p,i)=>point(p,world(base[i],hull),1e-8));
 }
});

test('current/pending sampling is pure and detached from caller hull/rest arrays and previous outputs',()=>{
 const hull=createNativeHull(),rest=REST.map(copy),p=provider(.025,rest),input=q(9,46,{hull}),before=structuredClone({hull,rest});
 const a=p.evaluate(input),expected=structuredClone(a);p.evaluate(q(17,40));p.evaluate(q(10,48,{idleChoice16c4:1}));
 a.targets[2].y=999;rest[2].y=888;
 assert.deepEqual(p.evaluate(input),expected);assert.deepEqual(hull,before.hull);
 assert.ok(Object.isFrozen(p));assert.ok(Object.isFrozen(p.provenance));
});

test('invalid anatomy, source selectors and hull geometry fail without pose or physics fallback',()=>{
 assert.throws(()=>provider(0),/positive/);assert.throws(()=>provider(.025,REST.slice(1)),/nineteen/);
 const collapsed=REST.map(copy);collapsed[1]=copy(collapsed[2]);assert.throws(()=>provider(.025,collapsed),/Collapsed/);
 const p=provider();assert.throws(()=>p.evaluate(q(22,0)),/Only action actors/);
 assert.throws(()=>p.evaluate(q(8,-1)),/nonnegative/);assert.throws(()=>p.evaluate(q(8,NaN)),/nonnegative/);
 const hull=createNativeHull();hull.frame.up.x=.2;assert.throws(()=>p.evaluate(q(8,1,{hull})),/unit length|orthonormal/);
 assert.throws(()=>p.evaluate(q(25,0,{alternate16cc:65536})),/actual alternate16cc/);
 assert.throws(()=>p.evaluate(q(8,0,{hull:createNativeHull({scale:.05})})),/scales must match/);
});
