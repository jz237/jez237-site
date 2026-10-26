import {restoreStonePingsBytes} from './stone-pings-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWakeDustPrevious,restoreWakeDustBytes,verifyWakeDustRevision} from './wake-dust-invariants';
const source=(file:string)=>restoreStonePingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WakeDust preserves every prior fixture, vehicle asset, venue art and history input',verifyWakeDustRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wake-dust/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWakeDustBytes(file,bytes),readWakeDustPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWakeDustBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWakeDustBytes('src/unknown.ts',unknown),unknown);
});
