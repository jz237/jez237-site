import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWipersPrevious,restoreWipersBytes,verifyWipersRevision} from './wipers-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Wipers preserves every prior fixture, vehicle asset, venue art and history input',verifyWipersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wipers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWipersBytes(file,bytes),readWipersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWipersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWipersBytes('src/unknown.ts',unknown),unknown);
});
