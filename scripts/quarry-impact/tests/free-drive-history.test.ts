import {restoreStuntBytes} from './stunt-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFreeDrivePrevious,restoreFreeDriveBytes,verifyFreeDriveRevision} from './free-drive-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FreeDrive preserves every prior fixture, vehicle asset, control and camera input',verifyFreeDriveRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/free-drive/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreStuntBytes(file,source(file));assert.deepEqual(restoreFreeDriveBytes(file,bytes),readFreeDrivePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFreeDriveBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFreeDriveBytes('src/unknown.ts',unknown),unknown);
});
