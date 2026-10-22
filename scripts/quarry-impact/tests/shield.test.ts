import test from 'node:test';
import assert from 'node:assert/strict';
import {SHIELD,weakSpotThreat,driveDerby} from '../src/derby-driving';
const me=(weak:{x:number;z:number}|null)=>({id:0,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:60,finished:false,nextCheckpoint:0,surface:'asphalt',weakSpot:weak});
const attacker=(x:number,z:number,vx:number,vz:number)=>{const l=Math.hypot(vx,vz)||1;return{id:1,current:{x,y:0,z},velocity:{x:vx,y:0,z:vz},forward:{x:vx/l,y:0,z:vz/l},right:{x:vz/l,y:0,z:-vx/l},speed:l,health:80,finished:false,nextCheckpoint:0,surface:'asphalt'};};
const memory=()=>({target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:0,phase:'approach',scan:0,clear:{front:30,left:30,right:30,rear:30}}) as never;
test('a rival charging at the broken corner is a threat; one aimed elsewhere, slow or far is not',()=>{
 const weakRight={x:.9,z:0};
 assert.ok(weakSpotThreat(me(weakRight) as never,[me(weakRight) as never,attacker(10,0,-8,0) as never]),'charging at the right flank');
 assert.equal(weakSpotThreat(me(weakRight) as never,[me(weakRight) as never,attacker(-10,0,8,0) as never]),null,'hitting the sound side');
 assert.equal(weakSpotThreat(me(weakRight) as never,[me(weakRight) as never,attacker(10,0,-2,0) as never]),null,'too slow');
 assert.equal(weakSpotThreat(me(weakRight) as never,[me(weakRight) as never,attacker(SHIELD.range+5,0,-9,0) as never]),null,'too far');
 assert.equal(weakSpotThreat(me(null) as never,[me(null) as never,attacker(10,0,-8,0) as never]),null,'nothing to shield');
});
test('under threat the driver turns the broken corner away, either way round',()=>{
 const right=driveDerby(me({x:.9,z:0}) as never,[me({x:.9,z:0}) as never,attacker(10,2,-8,-1.6) as never],memory(),null,1/60);
 const left=driveDerby(me({x:-.9,z:0}) as never,[me({x:-.9,z:0}) as never,attacker(-10,2,8,-1.6) as never],memory(),null,1/60);
 assert.ok(right.throttle===SHIELD.throttle&&left.throttle===SHIELD.throttle&&Math.sign(right.steer)===-Math.sign(left.steer)&&right.steer!==0);
});
