import {restoreReverseRamBytes} from './reverse-ram-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWeakSpotPrevious,restoreWeakSpotBytes,verifyWeakSpotRevision} from './weak-spot-invariants';
const source=(file:string)=>restoreReverseRamBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WeakSpot preserves every prior fixture, vehicle asset, venue art and history input',verifyWeakSpotRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/weak-spot/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWeakSpotBytes(file,bytes),readWeakSpotPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWeakSpotBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWeakSpotBytes('src/unknown.ts',unknown),unknown);
});
