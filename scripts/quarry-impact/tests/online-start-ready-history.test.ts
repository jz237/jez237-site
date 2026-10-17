import {restoreOnlineStartPreparationBytes} from './online-start-preparation-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineStartReadyPrevious,restoreOnlineStartReadyBytes,verifyOnlineStartReadyRevision} from './online-start-ready-invariants';
const source=(file:string)=>restoreOnlineStartPreparationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineStartReady preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineStartReadyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-start-ready/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineStartReadyBytes(file,bytes),readOnlineStartReadyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineStartReadyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineStartReadyBytes('src/unknown.ts',unknown),unknown);
});
