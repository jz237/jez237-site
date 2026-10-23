import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMassSharePrevious,restoreMassShareBytes,verifyMassShareRevision} from './mass-share-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('MassShare preserves every prior fixture, vehicle asset, venue art and history input',verifyMassShareRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/mass-share/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMassShareBytes(file,bytes),readMassSharePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMassShareBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMassShareBytes('src/unknown.ts',unknown),unknown);
});
