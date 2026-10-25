import {restoreWakeDustBytes} from './wake-dust-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTowStrapsPrevious,restoreTowStrapsBytes,verifyTowStrapsRevision} from './tow-straps-invariants';
const source=(file:string)=>restoreWakeDustBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TowStraps preserves every prior fixture, vehicle asset, venue art and history input',verifyTowStrapsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tow-straps/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTowStrapsBytes(file,bytes),readTowStrapsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTowStrapsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTowStrapsBytes('src/unknown.ts',unknown),unknown);
});
