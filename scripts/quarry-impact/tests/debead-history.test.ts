import {restoreTieRodBytes} from './tie-rod-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDebeadPrevious,restoreDebeadBytes,verifyDebeadRevision} from './debead-invariants';
const source=(file:string)=>restoreTieRodBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Debead preserves every prior fixture, vehicle asset, venue art and history input',verifyDebeadRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/debead/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDebeadBytes(file,bytes),readDebeadPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDebeadBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDebeadBytes('src/unknown.ts',unknown),unknown);
});
