import {restoreThunderBytes} from './thunder-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMarshalsPrevious,restoreMarshalsBytes,verifyMarshalsRevision} from './marshals-invariants';
const source=(file:string)=>restoreThunderBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Marshals preserves every prior fixture, vehicle asset, venue art and history input',verifyMarshalsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/marshals/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMarshalsBytes(file,bytes),readMarshalsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMarshalsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMarshalsBytes('src/unknown.ts',unknown),unknown);
});
