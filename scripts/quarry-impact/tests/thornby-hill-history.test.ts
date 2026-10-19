import {restoreRavenhillCarBytes} from './ravenhill-car-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readThornbyHillPrevious,restoreThornbyHillBytes,verifyThornbyHillRevision} from './thornby-hill-invariants';
const source=(file:string)=>restoreRavenhillCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ThornbyHill preserves every prior fixture, vehicle asset, venue art and history input',verifyThornbyHillRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/thornby-hill/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreThornbyHillBytes(file,bytes),readThornbyHillPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreThornbyHillBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreThornbyHillBytes('src/unknown.ts',unknown),unknown);
});
