import {restoreOnlineHostRestoreBytes} from './online-host-restore-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineStartPreparationPrevious,restoreOnlineStartPreparationBytes,verifyOnlineStartPreparationRevision} from './online-start-preparation-invariants';
const source=(file:string)=>restoreOnlineHostRestoreBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineStartPreparation preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineStartPreparationRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-start-preparation/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineStartPreparationBytes(file,bytes),readOnlineStartPreparationPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineStartPreparationBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineStartPreparationBytes('src/unknown.ts',unknown),unknown);
});
