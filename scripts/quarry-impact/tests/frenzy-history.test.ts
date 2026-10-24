import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFrenzyPrevious,restoreFrenzyBytes,verifyFrenzyRevision} from './frenzy-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Frenzy preserves every prior fixture, vehicle asset, venue art and history input',verifyFrenzyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/frenzy/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFrenzyBytes(file,bytes),readFrenzyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFrenzyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFrenzyBytes('src/unknown.ts',unknown),unknown);
});
