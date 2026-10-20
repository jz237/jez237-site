import {restoreBlownDampersBytes} from './blown-dampers-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPartShowersPrevious,restorePartShowersBytes,verifyPartShowersRevision} from './part-showers-invariants';
const source=(file:string)=>restoreBlownDampersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PartShowers preserves every prior fixture, vehicle asset, venue art and history input',verifyPartShowersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/part-showers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePartShowersBytes(file,bytes),readPartShowersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePartShowersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePartShowersBytes('src/unknown.ts',unknown),unknown);
});
