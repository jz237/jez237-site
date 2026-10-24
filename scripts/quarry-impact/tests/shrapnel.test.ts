import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SHRAPNEL,shrapnelDamage} from '../src/damage-handling';
test('flying debris hurts with its mass and speed; slow pieces do nothing',()=>{
 assert.equal(shrapnelDamage(12,SHRAPNEL.min-.1),0,'too slow');
 assert.ok(Math.abs(shrapnelDamage(12,12)-12*144*SHRAPNEL.k)<1e-9);
 assert.ok(shrapnelDamage(12,20)>shrapnelDamage(12,12)&&shrapnelDamage(24,12)>shrapnelDamage(12,12),'faster and heavier hurt more');
 assert.equal(shrapnelDamage(500,40),SHRAPNEL.max,'capped');
 assert.equal(shrapnelDamage(Number.NaN,20),0);assert.equal(shrapnelDamage(0,20),0);
});
test('a debris piece striking a car dents it along the blow, offline only, once per piece and car each half second',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('if(!online?.active&&!!a!==!!b){const car=(a??b)!,parent=physics.getCollider(a?h2:h1)?.parent(),piece=parent?fx.debris.find(d=>d.body.handle===parent.handle):undefined;'));
 assert.ok(main.includes('if(damage>0&&elapsed-(shrapnelAt.get(k)??-1e9)>=SHRAPNEL.gap){shrapnelAt.set(k,elapsed);shrapnelHits++;'));
 assert.ok(main.includes('car.hit(point.clone(),(a?scarDirection.clone():scarDirection.clone().negate()),damage,elapsed,false);'),'along the piece\'s motion');
 assert.ok(main.includes("if(car.id===0&&!demo&&damage>=SHRAPNEL.toast)toast('HIT BY FLYING DEBRIS',1.2,1);"));
 assert.ok(main.includes('shrapnelAt.clear();shrapnelHits=0;'),'reset each event');
});
