import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSyncLodPrevious,restoreSyncLodBytes,verifySyncLodRevision} from './sync-lod-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SyncLod preserves every prior fixture, vehicle asset, venue art and history input',verifySyncLodRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sync-lod/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSyncLodBytes(file,bytes),readSyncLodPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSyncLodBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSyncLodBytes('src/unknown.ts',unknown),unknown);
});
