import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readControlBackupPrevious,restoreControlBackupBytes,verifyControlBackupRevision} from './control-backup-invariants';
const source=(file:string)=>restoreWrenfordPitBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ControlBackup preserves every prior fixture, vehicle asset, control and camera input',verifyControlBackupRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/control-backup/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreControlBackupBytes(file,bytes),readControlBackupPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreControlBackupBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreControlBackupBytes('src/unknown.ts',unknown),unknown);
});

import {restoreWrenfordPitBytes} from './wrenford-pit-invariants';
