import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGravelRoostPrevious,restoreGravelRoostBytes,verifyGravelRoostRevision} from './gravel-roost-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('GravelRoost preserves every prior fixture, vehicle asset, venue art and history input',verifyGravelRoostRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/gravel-roost/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGravelRoostBytes(file,bytes),readGravelRoostPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGravelRoostBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGravelRoostBytes('src/unknown.ts',unknown),unknown);
});
