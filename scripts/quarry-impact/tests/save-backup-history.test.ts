import {restoreLightContactBytes} from './light-contact-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSaveBackupPrevious,restoreSaveBackupBytes,verifySaveBackupRevision} from './save-backup-invariants';
const source=(file:string)=>restoreLightContactBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SaveBackup preserves every prior fixture, vehicle asset, control and camera input',verifySaveBackupRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/save-backup/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSaveBackupBytes(file,bytes),readSaveBackupPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSaveBackupBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSaveBackupBytes('src/unknown.ts',unknown),unknown);
});
