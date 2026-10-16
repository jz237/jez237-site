import test from 'node:test';
import assert from 'node:assert/strict';
import {CombatScoreboard,eventDerbyOrder} from '../src/event-rules';
import {derbyEndReason,DERBY_FORMATS} from '../src/derby-policy';
import type {CombatMotion} from '../src/combat-feats';
const motion=(id:number,z:number,vz:number):CombatMotion=>({id,x:0,z,yaw:0,speed:Math.abs(vz),vx:0,vz,angular:0,up:1,grounded:4,health:100});
test('survival awards retaliation bonuses without promoting a wreck over a surviving opponent',()=>{
 const board=new CombatScoreboard(),moving=[motion(0,0,8),motion(1,5,-8),motion(2,20,0)];board.enableRivals(3);
 board.sample(moving,0);board.hit(1,0,100,90,0);board.sample(moving,.1);assert.equal(board.rival(0),1);
 board.hit(0,1,100,90,.1);board.contact(moving[0],moving[1],10,.1);
 assert.equal(board.get(0).rivalHits,1);assert.equal(board.get(0).bonus,50);
 const field=[{id:0,health:0,inflicted:10},{id:1,health:20,inflicted:0},{id:2,health:50,inflicted:0}];
 assert.notEqual(eventDerbyOrder(field,false,board)[0].id,0);assert.equal(eventDerbyOrder(field,true,board)[0].id,0);
 assert.equal(DERBY_FORMATS.survival.respawns,false);assert.equal(derbyEndReason('survival',field,10,60),null);
 field[1].health=0;assert.equal(derbyEndReason('survival',field,11,60),'elimination');
 board.reset();assert.equal(board.rivals,null);assert.equal(board.points(0),0);
});
