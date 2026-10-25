import {restoreBailSeenBytes} from './bail-seen-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readShredTrailPrevious,restoreShredTrailBytes,verifyShredTrailRevision} from './shred-trail-invariants';
const source=(file:string)=>restoreBailSeenBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ShredTrail preserves every prior fixture, vehicle asset, venue art and history input',verifyShredTrailRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shred-trail/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreShredTrailBytes(file,bytes),readShredTrailPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreShredTrailBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreShredTrailBytes('src/unknown.ts',unknown),unknown);
});
