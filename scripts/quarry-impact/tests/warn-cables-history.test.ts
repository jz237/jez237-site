import {restoreFinalStuntsBytes} from './final-stunts-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWarnCablesPrevious,restoreWarnCablesBytes,verifyWarnCablesRevision} from './warn-cables-invariants';
const source=(file:string)=>restoreFinalStuntsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WarnCables preserves every prior fixture, vehicle asset, venue art and history input',verifyWarnCablesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/warn-cables/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWarnCablesBytes(file,bytes),readWarnCablesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWarnCablesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWarnCablesBytes('src/unknown.ts',unknown),unknown);
});
