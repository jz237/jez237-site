import {restoreProgramWarmupBytes} from './program-warmup-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSableSettlingWorksPrevious,restoreSableSettlingWorksBytes,verifySableSettlingWorksRevision} from './sable-settling-works-invariants';
const source=(file:string)=>restoreProgramWarmupBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SableSettlingWorks preserves every prior fixture, vehicle asset, control and camera input',verifySableSettlingWorksRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sable-settling-works/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSableSettlingWorksBytes(file,bytes),readSableSettlingWorksPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSableSettlingWorksBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSableSettlingWorksBytes('src/unknown.ts',unknown),unknown);
});
