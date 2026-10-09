import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSablePrevious,restoreSableBytes,verifySableRevision} from './sable-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Sable preserves every prior fixture, vehicle asset, control and camera input',verifySableRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sable/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSableBytes(file,bytes),readSablePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSableBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSableBytes('src/unknown.ts',unknown),unknown);
});
