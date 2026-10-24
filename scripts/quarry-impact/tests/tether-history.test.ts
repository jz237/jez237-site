import {restorePileUpBytes} from './pile-up-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTetherPrevious,restoreTetherBytes,verifyTetherRevision} from './tether-invariants';
const source=(file:string)=>restorePileUpBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Tether preserves every prior fixture, vehicle asset, venue art and history input',verifyTetherRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tether/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTetherBytes(file,bytes),readTetherPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTetherBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTetherBytes('src/unknown.ts',unknown),unknown);
});
