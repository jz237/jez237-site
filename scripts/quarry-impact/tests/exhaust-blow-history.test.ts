import {restoreDiffBreakBytes} from './diff-break-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExhaustBlowPrevious,restoreExhaustBlowBytes,verifyExhaustBlowRevision} from './exhaust-blow-invariants';
const source=(file:string)=>restoreDiffBreakBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ExhaustBlow preserves every prior fixture, vehicle asset, venue art and history input',verifyExhaustBlowRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/exhaust-blow/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExhaustBlowBytes(file,bytes),readExhaustBlowPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExhaustBlowBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExhaustBlowBytes('src/unknown.ts',unknown),unknown);
});
