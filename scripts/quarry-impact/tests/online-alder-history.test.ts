import {restoreOnlineLoadoutDraftBytes} from './online-loadout-draft-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineAlderPrevious,restoreOnlineAlderBytes,verifyOnlineAlderRevision} from './online-alder-invariants';
const source=(file:string)=>restoreOnlineLoadoutDraftBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineAlder preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineAlderRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-alder/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineAlderBytes(file,bytes),readOnlineAlderPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineAlderBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineAlderBytes('src/unknown.ts',unknown),unknown);
});
