import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FRENZY} from '../src/derby-driving';
test('in a scored derby\'s final-stunts window the drivers go at it in a frenzy, whatever the number of cars left',()=>{
 const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(src.includes('frenzyOverride??Math.max(frenzyFactor(cars.filter(c=>c.health>0).length),scoreDerby()&&finalStunts(eventRemaining())?FRENZY.factor:1)'));
 assert.ok(FRENZY.factor>1);
});
