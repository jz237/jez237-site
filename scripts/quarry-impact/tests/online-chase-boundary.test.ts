import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {DEFAULT_ONLINE_EVENT} from '../src/online-events';import {validOnlineSnapshot} from '../src/network-validation';
await R.init();
const humans=new Set(Array.from({length:8},(_,id)=>id));
const simulation=()=>{const s=new Simulation(R,'race',[],8,[],{...DEFAULT_ONLINE_EVENT,laps:1,chase:{version:1,runners:[0,1],duration:60}});s.phase='playing';return s;};
function outside(s:Simulation,id:number){s.cars[id].body.setTranslation({x:300,y:5,z:0},true);s.cars[id].body.setLinvel({x:0,y:0,z:0},true);}
test('a runner leaving the world is caught immediately without repair or teleport',()=>{
 const s=simulation();try{outside(s,0);s.step(humans);assert.equal(s.cars[0].state.health,0);assert.equal(s.cars[0].state.repair,0);assert.ok(s.cars[0].state.p.x>255);assert.equal(s.event!.chase!.session.result(0)?.outcome,'caught');assert.equal(s.phase,'playing');
 outside(s,1);s.step(humans);assert.equal(s.phase,'result');assert.equal(s.event!.chase!.session.winner,'chasers');assert.ok(s.elapsed<1);
 assert.ok(validOnlineSnapshot({...s.snapshot(true),eventSupport:true,chaseSupport:true,members:[],ack:{}}));
 }finally{s.dispose();}
});
test('losing a pursuer never invents a runner escape or terminates the remaining chase',()=>{
 const s=simulation();try{outside(s,2);s.step(humans);assert.equal(s.cars[2].state.health,0);assert.equal(s.phase,'playing');assert.equal(s.event!.chase!.session.winner,null);assert.equal(s.event!.chase!.session.result(0)?.outcome,'running');assert.equal(s.recover(2),false);}finally{s.dispose();}
});
test('a 24-car multi-runner Chase resolves through autonomous escapes rather than a timeout',()=>{
 const s=new Simulation(R,'race',[],24,[],{...DEFAULT_ONLINE_EVENT,laps:1,chase:{version:1,runners:[0,1],duration:60}});
 try{s.phase='playing';for(let i=0;i<3601&&s.phase!=='result';i++)s.step(new Set());
 assert.equal(s.phase,'result');assert.equal(s.event!.chase!.session.winner,'runners');assert.ok(s.elapsed<60);assert.ok(s.event!.chase!.snapshot().results.every(r=>r.outcome==='escaped'));assert.ok(s.cars.every(c=>c.state.repair===0));
 }finally{s.dispose();}
});
