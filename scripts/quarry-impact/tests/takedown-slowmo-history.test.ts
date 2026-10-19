import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTakedownSlowmoPrevious,restoreTakedownSlowmoBytes,verifyTakedownSlowmoRevision} from './takedown-slowmo-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TakedownSlowmo preserves every prior fixture, vehicle asset, venue art and history input',verifyTakedownSlowmoRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/takedown-slowmo/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTakedownSlowmoBytes(file,bytes),readTakedownSlowmoPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTakedownSlowmoBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTakedownSlowmoBytes('src/unknown.ts',unknown),unknown);
});
