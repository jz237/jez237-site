import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BOOM} from '../src/blow-up';
test('a blow-up sets cars close by alight, the first fire-starter credited down the chain',()=>{
 assert.ok(BOOM.ignite>=3&&BOOM.ignite<=8);
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('for(const o of cars){if(o===car||!o.extendedDamage||o.current.distanceTo(at)>BOOM.ignite)continue;o.igniteRequest=true;chainIgnitions++;alightBy.set(o.id,credit?.id??car.id);}'));
 assert.ok(main.includes('blowUps=0;blowUpHold=-1;chainIgnitions=0;'),'reset each event');
});
