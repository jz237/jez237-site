import {restoreCinderbankSurroundingsBytes} from './cinderbank-surroundings-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineRuleDraftPrevious,restoreOnlineRuleDraftBytes,verifyOnlineRuleDraftRevision} from './online-rule-draft-invariants';
const source=(file:string)=>restoreCinderbankSurroundingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineRuleDraft preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineRuleDraftRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-rule-draft/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineRuleDraftBytes(file,bytes),readOnlineRuleDraftPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineRuleDraftBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineRuleDraftBytes('src/unknown.ts',unknown),unknown);
});
