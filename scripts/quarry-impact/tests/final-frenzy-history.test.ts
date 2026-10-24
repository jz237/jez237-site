import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFinalFrenzyPrevious,restoreFinalFrenzyBytes,verifyFinalFrenzyRevision} from './final-frenzy-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FinalFrenzy preserves every prior fixture, vehicle asset, venue art and history input',verifyFinalFrenzyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/final-frenzy/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFinalFrenzyBytes(file,bytes),readFinalFrenzyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFinalFrenzyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFinalFrenzyBytes('src/unknown.ts',unknown),unknown);
});
