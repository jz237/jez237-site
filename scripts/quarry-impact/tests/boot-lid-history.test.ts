import {restoreDoorCatchBytes} from './door-catch-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBootLidPrevious,restoreBootLidBytes,verifyBootLidRevision} from './boot-lid-invariants';
const source=(file:string)=>restoreDoorCatchBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BootLid preserves every prior fixture, vehicle asset, venue art and history input',verifyBootLidRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/boot-lid/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBootLidBytes(file,bytes),readBootLidPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBootLidBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBootLidBytes('src/unknown.ts',unknown),unknown);
});
