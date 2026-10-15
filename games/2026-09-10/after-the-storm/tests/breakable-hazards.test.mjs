import test from 'node:test';
import assert from 'node:assert/strict';
import {createBreakableState,captureBreakableState,hazardBroken,hitBreakable,sourceBreakThreshold,approachNormalSpeed,breakableEvents,fragmentPose,
 SOURCE_BREAK_STABILITY,MAX_BROKEN_HAZARDS,MAX_FRAGMENT_EVENTS,MAX_FRAGMENT_LIFETIME,FRAGMENT_GRAVITY} from '../breakable-hazards.js';

const ice=(id='ice-0',rule={threshold:2.5})=>({id,x:12,y:-.4,z:-30,r:1.25,type:'ice',breakable:rule});
const hit=(state,hazard,extra={})=>hitBreakable(state,hazard,{normalSpeed:3,riderIndex:0,time:4,...extra});
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`);

test('impact uses only approach velocity along the sphere normal, including vertical contacts',()=>{
 assert.equal(approachNormalSpeed({x:10,z:30},{x:-1,z:0}),10);
 assert.equal(approachNormalSpeed({x:10,z:30},{x:-20,z:0}),10);
 assert.equal(approachNormalSpeed({x:0,z:30},{x:-1,z:0}),0);
 assert.equal(approachNormalSpeed({x:-10,z:30},{x:-1,z:0}),0);
 assert.equal(approachNormalSpeed({x:0,y:-6,z:0},{x:0,y:1,z:0}),6);
 close(approachNormalSpeed({x:-3,y:-4,z:0},{x:3,y:4,z:0}),5);
 for(const [velocity,normal] of [[null,{x:1,z:0}],[{x:3,z:0},null],[{x:3,z:0},{x:0,z:0}],[{x:NaN,z:0},{x:1,z:0}],[{x:3,z:0},{x:Infinity,z:0}]])assert.equal(approachNormalSpeed(velocity,normal),0);
 const state=createBreakableState(),hazard=ice();
 assert.equal(hit(state,hazard,{normalSpeed:approachNormalSpeed({x:0,z:30},{x:-1,z:0})}),null);
 assert.ok(hit(state,hazard,{normalSpeed:approachNormalSpeed({x:3,z:30},{x:-1,z:0})}));
});

test('normal impact must reach the explicit threshold; weak hits do not accumulate damage',()=>{
 const state=createBreakableState(),hazard=ice();
 for(let time=0;time<4;time+=.05)assert.equal(hit(state,hazard,{normalSpeed:2.499,time}),null);
 assert.equal(hazardBroken(state,hazard),false);
 for(const normalSpeed of [0,-4,NaN,Infinity,'3'])assert.equal(hit(state,hazard,{normalSpeed}),null);
 const event=hit(state,hazard,{normalSpeed:2.5});assert.ok(event);assert.equal(event.normalSpeed,2.5);assert.equal(event.threshold,2.5);
 assert.equal(hazardBroken(state,hazard),true);
});

test('source ordinal thresholds require an explicit mapping and use stance factors',()=>{
 assert.deepEqual(SOURCE_BREAK_STABILITY,[9.5,10,9,8]);
 assert.deepEqual([0,1,2,3].map(index=>sourceBreakThreshold(index)),[2.375,2.5,2.25,2]);
 assert.equal(sourceBreakThreshold(0,null,1),4.75);
 for(const [pose,factor] of [['handstand',.1],['backwards',.15],['stand',.2],['standing',.2],['somersault',.2],[8,.1],[9,.15],[17,.2]])close(sourceBreakThreshold(1,pose),2.5*factor);
 for(const pose of [null,'normal','flip','left','right','dive',22])assert.equal(sourceBreakThreshold(1,pose),2.5);
 for(const index of [-1,4,1.2,null,undefined,'0',NaN])assert.equal(sourceBreakThreshold(index),null);
 for(const scale of [0,-1,NaN,Infinity,'1',101])assert.equal(sourceBreakThreshold(0,null,scale),null);
 const noMapping=ice('no-map',{});assert.equal(hit(createBreakableState(),noMapping,{riderIndex:0,normalSpeed:100}),null);
 const mapped=ice('mapped',{sourceIndexByRider:[3,null,0,1],nativeVelocityScale:.5}),state=createBreakableState();
 assert.equal(hit(state,mapped,{riderIndex:1,normalSpeed:100}),null);assert.equal(hit(state,mapped,{riderIndex:2,normalSpeed:2.3}),null);
 assert.equal(hit(state,mapped,{riderIndex:0,normalSpeed:2})?.threshold,2);
 const direct=ice('source',{sourceIndex:0,nativeVelocityScale:1});assert.equal(hit(createBreakableState(),direct,{normalSpeed:4.75})?.threshold,4.75);
});

test('the current pose lowers an explicitly configured normal-pose threshold',()=>{
 for(const [pose,threshold] of [['handstand',.25],['backwards',.375],['stand',.5],['somersault',.5]]){
  const state=createBreakableState(),hazard=ice(pose);
  assert.equal(hit(state,hazard,{pose,normalSpeed:threshold-.001}),null);
  close(hit(state,hazard,{pose,normalSpeed:threshold}).threshold,threshold);
 }
});

test('one racer breaks an obstacle once for every racer and equivalent hazard descriptor',()=>{
 const state=createBreakableState(),hazard=ice(),event=hit(state,hazard,{riderIndex:1});
 assert.ok(event);assert.equal(event.riderIndex,1);
 const clone={...hazard,x:999};assert.equal(hazardBroken(state,clone),true);
 for(const riderIndex of [0,1,2,3])assert.equal(hit(state,clone,{riderIndex,time:4.1}),null);
 assert.equal(breakableEvents(state,4.1).length,1);assert.equal(hazardBroken(state,ice('other')),false);
 // Numeric and string ids remain distinct, including duplicate coordinates.
 const numeric=ice(1),text=ice('1');assert.ok(hit(state,numeric));assert.equal(hazardBroken(state,text),false);assert.ok(hit(state,text));
});

test('debris expiry, clock rewind and caller lap changes never restore broken collision',()=>{
 const state=createBreakableState(),hazard=ice();hit(state,hazard);
 assert.equal(breakableEvents(state,4+MAX_FRAGMENT_LIFETIME).length,0);
 assert.equal(hazardBroken(state,hazard),true);assert.equal(hit(state,hazard,{time:100}),null);
 assert.equal(breakableEvents(state,0).length,0);assert.equal(hazardBroken(state,{...hazard,lap:2}),true);
 const freshRace=createBreakableState();assert.equal(hazardBroken(freshRace,hazard),false);assert.ok(hit(freshRace,hazard));
});

test('break snapshots use authored XYZ and do not modify or later follow the hazard',()=>{
 const state=createBreakableState(),hazard=ice(),before=structuredClone(hazard),event=hit(state,hazard);
 assert.deepEqual(hazard,before);assert.deepEqual(event.center,{x:12,y:-.4,z:-30});
 hazard.x=200;hazard.y=100;hazard.z=300;assert.deepEqual(event.center,{x:12,y:-.4,z:-30});
 assert.ok(Object.isFrozen(event)&&Object.isFrozen(event.center)&&Object.isFrozen(event.fragments));
 assert.throws(()=>event.center.x=0,TypeError);assert.throws(()=>event.fragments[0].velocity.x=0,TypeError);
 const list=breakableEvents(state,4);list.length=0;assert.equal(breakableEvents(state,4).length,1);
 const atDatum=ice('default-y');delete atDatum.y;assert.equal(hit(createBreakableState(),atDatum).center.y,0);
});

test('each break produces eight deterministic, finite, independently varied fragment descriptors',()=>{
 const hazard=ice(),a=hit(createBreakableState(),hazard),b=hit(createBreakableState(),{...hazard});
 assert.deepEqual(a,b);assert.equal(a.fragments.length,8);assert.equal(new Set(a.fragments.map(f=>f.id)).size,8);
 const directions=new Set();for(const fragment of a.fragments){
  assert.ok(Object.isFrozen(fragment));assert.ok(fragment.lifetime>0&&fragment.lifetime<=MAX_FRAGMENT_LIFETIME);
  assert.ok(fragment.scale>0&&fragment.scale<hazard.r);
  for(const vector of [fragment.offset,fragment.velocity,fragment.rotation,fragment.angularVelocity])for(const value of Object.values(vector))assert.ok(Number.isFinite(value));
  assert.ok(fragment.velocity.y>=4&&fragment.velocity.y<=9.5);directions.add(Math.atan2(fragment.velocity.x,fragment.velocity.z).toFixed(4));
 }
 assert.equal(directions.size,8);assert.ok(a.lifetime<=MAX_FRAGMENT_LIFETIME);
 const other=hit(createBreakableState(),ice('other'));assert.notDeepEqual(other.fragments,a.fragments);
});

test('fragment playback is analytic, expires, and does not mutate shared state',()=>{
 const event=hit(createBreakableState(),ice()),fragment=event.fragments[0],time=event.time+.2,a=fragmentPose(event,fragment,time);
 close(a.x,event.center.x+fragment.offset.x+fragment.velocity.x*.2);
 close(a.y,event.center.y+fragment.offset.y+fragment.velocity.y*.2-FRAGMENT_GRAVITY*.2*.2*.5);
 close(a.rz,fragment.rotation.z+fragment.angularVelocity.z*.2);assert.equal(a.opacity,1);
 // Prior render frequency has no effect on a later sample.
 for(let elapsed=0;elapsed<.2;elapsed+=1/144)fragmentPose(event,fragment,event.time+elapsed);
 assert.deepEqual(fragmentPose(event,fragment,time),a);
 assert.equal(fragmentPose(event,fragment,event.time-.1),null);assert.equal(fragmentPose(event,fragment,event.time+fragment.lifetime),null);
 assert.equal(fragmentPose(event,fragment,Infinity),null);assert.equal(fragmentPose(event,{...fragment},time),null);
 assert.equal(fragmentPose(null,fragment,time),null);assert.equal(fragmentPose({fragments:[fragment],time:4},fragment,time),null);
 const fading=fragmentPose(event,fragment,event.time+fragment.lifetime-.09);close(fading.opacity,.5);
});

test('recent effects are bounded independently of persistent global broken state',()=>{
 const state=createBreakableState();
 for(let i=0;i<MAX_BROKEN_HAZARDS;i++)assert.ok(hit(state,ice('many-'+i),{time:4+i*.0001}));
 const events=breakableEvents(state,4.1);assert.equal(events.length,MAX_FRAGMENT_EVENTS);assert.equal(events.flatMap(e=>e.fragments).length,16);
 assert.equal(events[0].hazardId,'many-'+(MAX_BROKEN_HAZARDS-2));
 assert.equal(hazardBroken(state,ice('many-0')),true);assert.equal(hazardBroken(state,ice('many-'+(MAX_BROKEN_HAZARDS-1))),true);
 assert.equal(hit(state,ice('over-cap'),{time:4.1}),null);assert.equal(breakableEvents(state,10).length,0);assert.equal(hazardBroken(state,ice('many-0')),true);
});

test('malformed inputs cannot create or erase a break',()=>{
 const state=createBreakableState();
 for(const hazard of [null,{},ice(''),ice('x'.repeat(161)),ice(NaN),{...ice(),x:NaN},{...ice(),y:Infinity},{...ice(),z:'0'},{...ice(),r:0},{...ice(),r:1001},ice('bad',{threshold:null}),ice('bad',{threshold:-1}),ice('bad',{sourceIndexByRider:[4]}),ice('bad',{sourceIndex:0,nativeVelocityScale:null})])assert.equal(hit(state,hazard),null);
 for(const extra of [{time:-1},{time:NaN},{time:Infinity},{time:1e10},{normalSpeed:NaN},{normalSpeed:1e5}])assert.equal(hit(state,ice(),extra),null);
 assert.equal(hitBreakable({},ice(),{normalSpeed:3,time:4}),null);assert.equal(hitBreakable(state,ice()),null);assert.equal(hitBreakable(state,ice(),null),null);
 assert.equal(hazardBroken(null,ice()),false);assert.deepEqual(breakableEvents({},4),[]);assert.deepEqual(breakableEvents(state,NaN),[]);
 assert.ok(hit(state,ice('valid'),{time:10}));assert.equal(hit(state,ice('late'),{time:9}),null);assert.equal(hazardBroken(state,ice('valid')),true);
});

test('replay captures preserve intact and broken frames independently of future live impacts',()=>{
 const live=createBreakableState(),first=ice('first'),second=ice('second'),intact=captureBreakableState(live,3);
 assert.ok(intact&&Object.isFrozen(intact));assert.notEqual(intact,live);assert.deepEqual(Object.keys(intact),[]);
 const event=hit(live,first),broken=captureBreakableState(live,4.1);
 assert.equal(hazardBroken(intact,first),false);assert.equal(hazardBroken(broken,first),true);
 assert.equal(hazardBroken(broken,second),false);assert.equal(breakableEvents(intact,4.1).length,0);
 assert.equal(breakableEvents(broken,4.1)[0],event);
 hit(live,second,{time:5});assert.equal(hazardBroken(live,second),true);
 assert.equal(hazardBroken(intact,first),false);assert.equal(hazardBroken(intact,second),false);
 assert.equal(hazardBroken(broken,second),false);assert.equal(breakableEvents(broken,4.1)[0],event);
});

test('captured fragments survive live expiry and read-only replay queries can rewind repeatedly',()=>{
 const live=createBreakableState(),hazard=ice(),event=hit(live,hazard),time=event.time+.2;
 const capture=captureBreakableState(live,time),fragment=event.fragments[0],pose=fragmentPose(event,fragment,time);
 assert.ok(pose);assert.equal(breakableEvents(capture,time)[0],event);
 assert.equal(breakableEvents(live,100).length,0,'the live renderer prunes its expired events');
 assert.equal(breakableEvents(capture,100).length,0,'expired pieces are not shown at a later replay time');
 for(let i=0;i<3;i++){
  assert.equal(breakableEvents(capture,time)[0],event,'later queries cannot prune an earlier captured frame');
  assert.deepEqual(fragmentPose(breakableEvents(capture,time)[0],fragment,time),pose);
  assert.equal(breakableEvents(capture,event.time+event.lifetime).length,0);
 }
 assert.equal(hazardBroken(capture,hazard),true);assert.equal(hazardBroken(live,hazard),true);
});

test('read-only replay captures cannot accept impacts, gain broken IDs or mutate live state',()=>{
 const live=createBreakableState(),first=ice('first'),later=ice('later');hit(live,first);
 const capture=captureBreakableState(live),events=breakableEvents(capture,4);
 assert.equal(hit(capture,later,{normalSpeed:100,time:4}),null);assert.equal(hit(capture,later,{normalSpeed:100,time:5}),null);
 assert.equal(hazardBroken(capture,later),false);assert.equal(hazardBroken(live,later),false);
 assert.deepEqual(breakableEvents(capture,4),events);assert.equal(breakableEvents(live,4).length,1);
 assert.throws(()=>capture.broken=new Set(),TypeError);
 assert.throws(()=>capture.events=[],TypeError);
 const list=breakableEvents(capture,4);list.length=0;assert.equal(breakableEvents(capture,4).length,1);
 const recaptured=captureBreakableState(capture,4.1);assert.ok(recaptured);assert.equal(hazardBroken(recaptured,first),true);
 assert.equal(hit(recaptured,later),null);assert.equal(breakableEvents(recaptured,4.1)[0],events[0]);
});

test('each capture retains bounded IDs and at most sixteen pieces without duplicating frozen debris',()=>{
 const live=createBreakableState(),captures=[];
 for(let i=0;i<MAX_BROKEN_HAZARDS;i++){
  hit(live,ice('capture-'+i),{time:4+i*.0001});
  const capture=captureBreakableState(live);captures.push(capture);
  const liveEvents=breakableEvents(live,4+i*.0001),capturedEvents=breakableEvents(capture,4+i*.0001);
  assert.ok(capturedEvents.length<=MAX_FRAGMENT_EVENTS);assert.ok(capturedEvents.flatMap(event=>event.fragments).length<=16);
  for(let j=0;j<capturedEvents.length;j++)assert.equal(capturedEvents[j],liveEvents[j],'captures retain immutable event references instead of copying meshes or trajectories');
 }
 assert.equal(hazardBroken(captures[0],ice('capture-0')),true);assert.equal(hazardBroken(captures[0],ice('capture-1')),false);
 assert.equal(hazardBroken(captures.at(-1),ice('capture-'+(MAX_BROKEN_HAZARDS-1))),true);
 assert.equal(hit(live,ice('over-limit'),{time:5}),null);assert.equal(hazardBroken(captureBreakableState(live),ice('over-limit')),false);
 const quiet=captureBreakableState(live,10);assert.equal(breakableEvents(quiet,10).length,0);
 assert.equal(hazardBroken(quiet,ice('capture-0')),true);
 assert.equal(breakableEvents(captures[0],4).length,1,'later capture allocation never evicts earlier captures');
 for(const invalid of [null,{},structuredClone(captures[0]),1])assert.equal(captureBreakableState(invalid),null);
 for(const time of [-1,NaN,Infinity,1e10,3])assert.equal(captureBreakableState(live,time),null);
});
