import {restoreSumpCrackBytes} from './sump-crack-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCargoSpillPrevious,restoreCargoSpillBytes,verifyCargoSpillRevision} from './cargo-spill-invariants';
const source=(file:string)=>restoreSumpCrackBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CargoSpill preserves every prior fixture, vehicle asset, venue art and history input',verifyCargoSpillRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cargo-spill/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCargoSpillBytes(file,bytes),readCargoSpillPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCargoSpillBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCargoSpillBytes('src/unknown.ts',unknown),unknown);
});
