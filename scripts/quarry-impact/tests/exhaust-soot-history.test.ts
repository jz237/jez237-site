import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExhaustSootPrevious,restoreExhaustSootBytes,verifyExhaustSootRevision} from './exhaust-soot-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ExhaustSoot preserves every prior fixture, vehicle asset, venue art and history input',verifyExhaustSootRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/exhaust-soot/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExhaustSootBytes(file,bytes),readExhaustSootPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExhaustSootBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExhaustSootBytes('src/unknown.ts',unknown),unknown);
});
