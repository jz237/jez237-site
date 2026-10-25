import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTyreHissPrevious,restoreTyreHissBytes,verifyTyreHissRevision} from './tyre-hiss-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TyreHiss preserves every prior fixture, vehicle asset, venue art and history input',verifyTyreHissRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tyre-hiss/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTyreHissBytes(file,bytes),readTyreHissPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTyreHissBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTyreHissBytes('src/unknown.ts',unknown),unknown);
});
