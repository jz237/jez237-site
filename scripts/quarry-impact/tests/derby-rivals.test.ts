import test from 'node:test';import assert from 'node:assert/strict';
import {DerbyRivals,validRivalState,RIVAL_HIT_POINTS} from '../src/derby-rivals';
import type {CombatMotion} from '../src/combat-feats';
const motion=(id:number,z:number,vz=0):CombatMotion=>({id,x:0,z,yaw:0,speed:Math.abs(vz),vx:0,vz,angular:0,up:1,grounded:4,health:100});
const living=new Set([0,1,2]);
test('rival tracks greatest incoming damage, holds ties and excludes wrecks without losing event history',()=>{
 const r=new DerbyRivals(3);assert.equal(r.rival(0,living),null);r.record(2,0,10);assert.equal(r.rival(0,living),2);r.record(1,0,10);assert.equal(r.rival(0,living),2);r.record(1,0,1);assert.equal(r.rival(0,living),1);
 assert.equal(r.rival(0,new Set([0,2])),2);assert.equal(r.rival(0,living),1);assert.equal(r.rival(0,new Set([1,2])),null);
});
test('invalid contacts and healing cannot create rivals',()=>{
 const r=new DerbyRivals(3);for(const loss of [0,-1,101,NaN,Infinity])r.record(1,0,loss);r.record(0,0,10);r.record(4,0,10);assert.equal(r.rival(0,living),null);
 r.record(0,1,10);assert.equal(r.rival(0,living),null);assert.equal(r.rival(1,living),0);
});
test('rival bonus requires attacking motion and real damage, with a per-pair cooldown',()=>{
 const r=new DerbyRivals(3),a=motion(0,0,8),b=motion(1,5);r.record(1,0,12);
 assert.equal(r.hit(a,b,3,0,living),0);assert.equal(r.hit({...a,vz:0},b,5,0,living),0);assert.equal(r.hit(a,motion(2,5),5,0,living),0);
 assert.equal(r.hit(a,b,5,0,living),RIVAL_HIT_POINTS);assert.equal(r.hit(a,b,25,1,living),0);assert.equal(r.hit(a,b,5,2,living),RIVAL_HIT_POINTS);
 for(const health of [0,-1,NaN,Infinity])assert.equal(r.hit(a,{...b,health},5,4,living),0);assert.equal(r.hit(a,b,5,4,new Set([0,2])),0);
});
test('restore preserves cooldowns and ties, owns its data, and rejects malformed snapshots atomically',()=>{
 const r=new DerbyRivals(3);r.record(2,0,12);r.record(1,0,11);r.rival(0,living);r.hit(motion(0,0,8),motion(2,5),5,20,living);
 const snapshot=r.snapshot(),copy=new DerbyRivals(3);copy.restore(snapshot,60);assert.deepEqual(copy.snapshot(),snapshot);snapshot.damage[0][2]=999;assert.notDeepEqual(copy.snapshot(),snapshot);
 assert.equal(copy.hit(motion(0,0,8),motion(2,5),5,21,living),0);
 const before=copy.snapshot();for(const invalid of [{...before,damage:[...before.damage,before.damage[0]]},{...before,chosen:[[0,0]]},{...before,cooldowns:[[0,2,9999]]},{...before,count:4}]){assert.throws(()=>copy.restore(invalid,60));assert.deepEqual(copy.snapshot(),before);}
 assert.equal(validRivalState({...before,damage:[[0,2,Infinity]]},60),false);copy.reset();assert.equal(copy.rival(0,living),null);assert.equal(copy.hit(motion(0,0,8),motion(2,5),5,22,living),0);
});
