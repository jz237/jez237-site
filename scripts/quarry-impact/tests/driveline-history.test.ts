import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDrivelinePrevious,restoreDrivelineBytes,verifyDrivelineRevision} from './driveline-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Driveline preserves every prior fixture, vehicle asset, control and camera input',verifyDrivelineRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driveline/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDrivelineBytes(file,bytes),readDrivelinePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDrivelineBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDrivelineBytes('src/unknown.ts',unknown),unknown);
});
