import {restoreSpeedFeelBytes} from './speed-feel-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSmashHitPrevious,restoreSmashHitBytes,verifySmashHitRevision} from './smash-hit-invariants';
const source=(file:string)=>restoreSpeedFeelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SmashHit preserves every prior fixture, vehicle asset, venue art and history input',verifySmashHitRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/smash-hit/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSmashHitBytes(file,bytes),readSmashHitPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSmashHitBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSmashHitBytes('src/unknown.ts',unknown),unknown);
});
