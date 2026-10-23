import {restoreImpactZoneBytes} from './impact-zone-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSmashFirePrevious,restoreSmashFireBytes,verifySmashFireRevision} from './smash-fire-invariants';
const source=(file:string)=>restoreImpactZoneBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SmashFire preserves every prior fixture, vehicle asset, venue art and history input',verifySmashFireRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/smash-fire/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSmashFireBytes(file,bytes),readSmashFirePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSmashFireBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSmashFireBytes('src/unknown.ts',unknown),unknown);
});
