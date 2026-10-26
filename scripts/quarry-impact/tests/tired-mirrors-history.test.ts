import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTiredMirrorsPrevious,restoreTiredMirrorsBytes,verifyTiredMirrorsRevision} from './tired-mirrors-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TiredMirrors preserves every prior fixture, vehicle asset, venue art and history input',verifyTiredMirrorsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tired-mirrors/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTiredMirrorsBytes(file,bytes),readTiredMirrorsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTiredMirrorsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTiredMirrorsBytes('src/unknown.ts',unknown),unknown);
});
