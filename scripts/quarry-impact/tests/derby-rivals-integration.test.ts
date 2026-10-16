import {derbyRecordPrefix} from '../src/derby-policy';
import test from 'node:test';import assert from 'node:assert/strict';
import {CombatScoreboard} from '../src/event-rules';
import {OnlineEvent,DEFAULT_ONLINE_EVENT,validOnlineEventState} from '../src/online-events';
import type {CombatMotion} from '../src/combat-feats';
const motion=(id:number,z:number,vz:number):CombatMotion=>({id,x:0,z,yaw:0,speed:Math.abs(vz),vx:0,vz,angular:0,up:1,grounded:4,health:100});
const cars=[motion(0,0,8),motion(1,5,-8),motion(2,20,0)];
const strike=(b:CombatScoreboard,a:number,v:number,time:number,damage=5)=>{b.hit(a,v,100,100-damage,time);b.contact(cars[a],cars[v],damage,time)};
test('reciprocal contact order cannot create a first-frame rival bonus; later attacking hits score once',()=>{
 for(const order of [[0,1],[1,0]]){const b=new CombatScoreboard();b.enableRivals(3);b.sample(cars,0);for(const a of order)strike(b,a,1-a,0);assert.equal(b.get(0).rivalHits,undefined);assert.equal(b.get(1).rivalHits,undefined);
 b.sample(cars,.1);assert.equal(b.rival(0),1);strike(b,0,1,.1);assert.equal(b.get(0).rivalHits,1);assert.equal(b.points(0),45);strike(b,0,1,.2);assert.equal(b.get(0).rivalHits,1);assert.equal(b.points(0),50);
 b.sample(cars,2.2);strike(b,0,1,2.2);assert.equal(b.get(0).rivalHits,2);assert.equal(b.points(0),90);
 }
});
test('lethal rival hit retains pre-impact eligibility, awards one knockout and clears on reset',()=>{
 const b=new CombatScoreboard();b.enableRivals(3);b.hit(1,0,100,90,0);b.sample(cars,1);b.hit(0,1,5,0,1);b.contact(cars[0],{...cars[1],health:5},5,1);
 assert.equal(b.get(0).knockouts,1);assert.equal(b.get(0).rivalHits,1);assert.equal(b.points(0),140);
 b.hit(0,1,5,0,1.1);assert.equal(b.get(0).knockouts,1);b.sample(cars.map(c=>c.id===1?{...c,health:0}:c),1.1);assert.equal(b.rival(0),null);
 b.respawn(1);b.sample(cars,5);assert.equal(b.rival(0),1);b.reset();assert.equal(b.rivals,null);assert.equal(b.points(0),0);
});
test('both scored formats round-trip optional rivals and reject forged bonus totals; legacy stays unchanged',()=>{
 for(const derby of ['score','score-no-respawn']as const){const event=new OnlineEvent('derby',{...DEFAULT_ONLINE_EVENT,derby,duration:60},7);const old=event.snapshot(3);assert.equal(old.rivals,undefined);assert.equal(validOnlineEventState(old,'derby',3),true);
 event.combat.enableRivals(3);event.combat.hit(1,0,100,90,0);event.combat.sample(cars,1);strike(event.combat,0,1,1);const state=event.snapshot(3);assert.equal(validOnlineEventState(state,'derby',3),true);
 const copy=new OnlineEvent('derby',event.rules,7);copy.restore(state,3);assert.deepEqual(copy.snapshot(3),state);copy.combat.sample(cars,1.5);strike(copy.combat,0,1,1.5);assert.equal(copy.combat.get(0).rivalHits,1,'Cooldown survives restore');
 const forged=structuredClone(state);forged.combat![0].rivalHits=0;forged.combat![0].bonus=10;assert.equal(validOnlineEventState(forged,'derby',3),false,'Rival popup must correspond to an awarded rival hit');
 const bad=structuredClone(state);bad.combat![0].bonus!++;assert.equal(validOnlineEventState(bad,'derby',3),false);const noState=structuredClone(state);delete noState.rivals;assert.equal(validOnlineEventState(noState,'derby',3),false);
 copy.restore(old,3);assert.equal(copy.combat.rivals,null);assert.deepEqual(copy.snapshot(3),old);
 }
});

test('rival scores have separate personal record categories while legacy formats retain keys',()=>{assert.equal(derbyRecordPrefix('score'),'score-derby-v2');assert.equal(derbyRecordPrefix('score',true),'score-derby-v3');assert.equal(derbyRecordPrefix('score-no-respawn',true),'score-elimination-v2');assert.equal(derbyRecordPrefix('survival',true),'derby');});
