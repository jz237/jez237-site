import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withRaceNumbers} from '../src/race-numbers';
import {newLayer,LIVERY_LIMIT} from '../src/livery-data';
test('a rival without a number gets a white roundel with its number on both doors and the roof',()=>{
 const l=withRaceNumbers([],7)!;
 assert.equal(l.length,6);assert.deepEqual(l.filter(x=>x.shape==='number').map(x=>x.face).sort(),['left','right','top']);
 assert.ok(l.filter(x=>x.shape==='number').every(x=>x.text==='7'));assert.equal(l.filter(x=>x.shape==='circle').length,3);
 const own=[newLayer('stripe','left')];assert.equal(withRaceNumbers(own,3)!.length,7,'added on top of its own livery');
});
test('an own number or lettering, a full livery or a bad number leaves the livery alone',()=>{
 assert.equal(withRaceNumbers([newLayer('number','left')],3),null);assert.equal(withRaceNumbers([newLayer('text','top')],3),null);
 assert.equal(withRaceNumbers(Array.from({length:LIVERY_LIMIT-2},()=>newLayer('stripe','left')),3),null,'no room');
 assert.equal(withRaceNumbers([],0),null);assert.equal(withRaceNumbers([],1.5),null);
 assert.ok(readFileSync(new URL('../src/main.ts',import.meta.url),'utf8').includes("if(!attract&&!online?.active&&i>0&&mode==='derby'){const numbered=withRaceNumbers(car.setup.livery,i+1);if(numbered)car.livery.set(numbered);}"),'derby rivals only, offline; the player keeps their own livery');
});
