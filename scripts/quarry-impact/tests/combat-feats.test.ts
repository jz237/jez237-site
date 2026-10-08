import test from 'node:test';
import assert from 'node:assert/strict';
import {CombatFeats,combatMotion,validCombatFeats,type CombatMotion} from '../src/combat-feats';
import {CombatScoreboard} from '../src/event-rules';
import {OnlineEvent,DEFAULT_ONLINE_EVENT,validOnlineEventState} from '../src/online-events';
const motion=(id:number,patch:Partial<CombatMotion>={}):CombatMotion=>({id,x:id*4,z:0,yaw:0,speed:10,vx:10,vz:0,angular:0,up:1,grounded:4,health:100,...patch});
const rotate=(f:CombatFeats,time=1)=>{let awards:ReturnType<CombatFeats['sample']>=[];for(let i=1;i<=60;i++)awards.push(...f.sample([motion(1,{yaw:i*Math.PI/100,angular:1.9})],time+i/60));return awards;};
test('impact tiers award offensive moving contacts once per rival cooldown, without changing actual damage',()=>{
 const board=new CombatScoreboard(),a=motion(0),v=motion(1);
 board.hit(0,1,100,90,1);board.contact(a,v,10,1);board.contact(a,v,20,1.1);assert.equal(board.points(0),35);assert.deepEqual(board.get(0).impacts,[0,1,0]);
 board.contact(a,v,20,3);assert.equal(board.points(0),85);board.contact(a,v,4,5);assert.equal(board.points(0),95);
 for(const bad of [motion(0,{vx:0,speed:0}),motion(0,{vx:-10}),motion(0,{health:0})])board.contact(bad,v,30,9);
 assert.equal(board.points(0),95);assert.equal(board.get(0).damage,10);board.contact(a,v,0,12);assert.equal(board.points(0),95);
});
test('a collision-triggered grounded 90-degree spin awards once, survives restore, and obeys per-rival cooldown',()=>{
 const f=new CombatFeats();f.contact(motion(0),motion(1),5,1);f.sample([motion(1,{yaw:.03,angular:1.9})],1+1/60);
 const copy=new CombatFeats();const saved=f.snapshot();assert.ok(validCombatFeats(saved,2,60));copy.restore(saved);saved.pending[0].turn=1.5;
 const result=rotate(copy,1);assert.equal(result.length,1);assert.equal(result[0].id,0);assert.equal(result[0].award.points,75);
 copy.contact(motion(0),motion(1),5,4);assert.equal(copy.snapshot().pending.length,0);
 copy.contact(motion(0),motion(1),5,12);assert.equal(rotate(copy,12).length,1);
});
test('parked targets, existing donuts, normal turns, rollovers, teleports, dead cars and expired contacts do not earn spins',()=>{
 for(const patch of [{speed:0},{angular:2},{up:0},{grounded:0}]){const f=new CombatFeats();f.contact(motion(0),motion(1,patch),10,1);assert.equal(rotate(f).length,0);}
 for(const patch of [{up:0},{grounded:0},{health:0},{x:100}]){const f=new CombatFeats();f.contact(motion(0),motion(1),10,1);f.sample([motion(1,patch)],1.02);assert.equal(rotate(f).length,0);}
 const slow=new CombatFeats();slow.contact(motion(0),motion(1),10,1);for(let i=1;i<=120;i++)assert.equal(slow.sample([motion(1,{yaw:i*.02,angular:.3})],1+i/60).length,0);
 const late=new CombatFeats();late.contact(motion(0),motion(1),10,1);assert.equal(rotate(late,4).length,0);
 const reset=new CombatFeats();reset.contact(motion(0),motion(1),10,1);reset.remove(1);assert.equal(rotate(reset).length,0);
});
test('score records and pending feats validate, restore independently and preserve old online saves',()=>{
 const e=new OnlineEvent('derby',{...DEFAULT_ONLINE_EVENT,derby:'score',duration:60},9);e.combat.hit(0,1,100,80,1);e.combat.contact(motion(0),motion(1),20,1);
 const state=e.snapshot(2);assert.ok(validOnlineEventState(state,'derby',2));const copy=new OnlineEvent('derby',state.rules,9);copy.restore(state,2);assert.deepEqual(copy.snapshot(2),state);state.combat![0].impacts![2]=99;assert.equal(copy.combat.get(0).impacts![2],1);
 for(const mutate of [(s:any)=>s.combat[0].bonus++, (s:any)=>s.feats.pending[0].attacker=20,(s:any)=>s.feats.pending[0].until=100,(s:any)=>s.feats.cooldowns.push(['hit:0:1',3])]){const invalid=structuredClone(copy.snapshot(2));mutate(invalid);assert.equal(validOnlineEventState(invalid,'derby',2),false);}
 const old=copy.snapshot(2);delete old.feats;for(const row of old.combat!){delete row.bonus;delete row.spins;delete row.impacts;delete row.award;}assert.ok(validOnlineEventState(old,'derby',2));copy.restore(old,2);assert.equal(copy.combat.points(0),20);assert.equal(copy.combat.feats.snapshot().pending.length,0);
 const sample=combatMotion(0,{x:1,z:2},{x:0,y:Math.sin(Math.PI/4),z:0,w:Math.cos(Math.PI/4)},{x:3,z:4},2,100,4);assert.ok(Math.abs(sample.yaw-Math.PI/2)<1e-10);assert.equal(sample.speed,5);assert.equal(sample.up,1);
});
