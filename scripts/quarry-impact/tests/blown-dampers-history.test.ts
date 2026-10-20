import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBlownDampersPrevious,restoreBlownDampersBytes,verifyBlownDampersRevision} from './blown-dampers-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BlownDampers preserves every prior fixture, vehicle asset, venue art and history input',verifyBlownDampersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/blown-dampers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBlownDampersBytes(file,bytes),readBlownDampersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBlownDampersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBlownDampersBytes('src/unknown.ts',unknown),unknown);
});
