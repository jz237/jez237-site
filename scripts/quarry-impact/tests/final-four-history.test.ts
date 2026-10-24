import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFinalFourPrevious,restoreFinalFourBytes,verifyFinalFourRevision} from './final-four-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FinalFour preserves every prior fixture, vehicle asset, venue art and history input',verifyFinalFourRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/final-four/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFinalFourBytes(file,bytes),readFinalFourPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFinalFourBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFinalFourBytes('src/unknown.ts',unknown),unknown);
});
