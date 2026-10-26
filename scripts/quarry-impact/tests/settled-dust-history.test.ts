import {restoreMudFlapsBytes} from './mud-flaps-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSettledDustPrevious,restoreSettledDustBytes,verifySettledDustRevision} from './settled-dust-invariants';
const source=(file:string)=>restoreMudFlapsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SettledDust preserves every prior fixture, vehicle asset, venue art and history input',verifySettledDustRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/settled-dust/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSettledDustBytes(file,bytes),readSettledDustPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSettledDustBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSettledDustBytes('src/unknown.ts',unknown),unknown);
});
