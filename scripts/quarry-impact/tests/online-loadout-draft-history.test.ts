import {restoreCoastalPavilionBytes} from './coastal-pavilion-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineLoadoutDraftPrevious,restoreOnlineLoadoutDraftBytes,verifyOnlineLoadoutDraftRevision} from './online-loadout-draft-invariants';
const source=(file:string)=>restoreCoastalPavilionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineLoadoutDraft preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineLoadoutDraftRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-loadout-draft/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineLoadoutDraftBytes(file,bytes),readOnlineLoadoutDraftPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineLoadoutDraftBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineLoadoutDraftBytes('src/unknown.ts',unknown),unknown);
});
