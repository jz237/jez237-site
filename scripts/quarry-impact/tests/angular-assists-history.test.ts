import {restoreOnlineAngularDriveBytes} from './online-angular-drive-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAngularAssistsPrevious,restoreAngularAssistsBytes,verifyAngularAssistsRevision} from './angular-assists-invariants';
const source=(file:string)=>restoreOnlineAngularDriveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AngularAssists preserves every prior fixture, vehicle asset, control and camera input',verifyAngularAssistsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/angular-assists/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAngularAssistsBytes(file,bytes),readAngularAssistsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAngularAssistsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAngularAssistsBytes('src/unknown.ts',unknown),unknown);
});
