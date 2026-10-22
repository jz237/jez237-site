import {restoreStarterBytes} from './starter-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExhaustOffPrevious,restoreExhaustOffBytes,verifyExhaustOffRevision} from './exhaust-off-invariants';
const source=(file:string)=>restoreStarterBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ExhaustOff preserves every prior fixture, vehicle asset, venue art and history input',verifyExhaustOffRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/exhaust-off/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExhaustOffBytes(file,bytes),readExhaustOffPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExhaustOffBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExhaustOffBytes('src/unknown.ts',unknown),unknown);
});
