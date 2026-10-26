import {restoreWornEnginesBytes} from './worn-engines-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDanglersPrevious,restoreDanglersBytes,verifyDanglersRevision} from './danglers-invariants';
const source=(file:string)=>restoreWornEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Danglers preserves every prior fixture, vehicle asset, venue art and history input',verifyDanglersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/danglers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDanglersBytes(file,bytes),readDanglersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDanglersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDanglersBytes('src/unknown.ts',unknown),unknown);
});
