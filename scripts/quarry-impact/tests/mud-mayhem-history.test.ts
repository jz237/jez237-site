import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMudMayhemPrevious,restoreMudMayhemBytes,verifyMudMayhemRevision} from './mud-mayhem-invariants';
const source=(file:string)=>restoreCameraSettingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MudMayhem preserves every prior fixture, vehicle asset, control and camera input',verifyMudMayhemRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/mud-mayhem/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMudMayhemBytes(file,bytes),readMudMayhemPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMudMayhemBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMudMayhemBytes('src/unknown.ts',unknown),unknown);
});

import {restoreCameraSettingsBytes} from './camera-settings-invariants';
