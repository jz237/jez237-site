import {restoreSableGroundcoverBytes} from './sable-groundcover-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSableDetailPrevious,restoreSableDetailBytes,verifySableDetailRevision} from './sable-detail-invariants';
const source=(file:string)=>restoreSableGroundcoverBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SableDetail preserves every prior fixture, vehicle asset, control and camera input',verifySableDetailRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sable-detail/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSableDetailBytes(file,bytes),readSableDetailPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSableDetailBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSableDetailBytes('src/unknown.ts',unknown),unknown);
});
