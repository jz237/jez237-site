import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExhaustFlamesPrevious,restoreExhaustFlamesBytes,verifyExhaustFlamesRevision} from './exhaust-flames-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ExhaustFlames preserves every prior fixture, vehicle asset, venue art and history input',verifyExhaustFlamesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/exhaust-flames/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExhaustFlamesBytes(file,bytes),readExhaustFlamesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExhaustFlamesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExhaustFlamesBytes('src/unknown.ts',unknown),unknown);
});
