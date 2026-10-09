import {restoreDrivelineBytes} from './driveline-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCorneringPrevious,restoreCorneringBytes,verifyCorneringRevision} from './cornering-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Cornering preserves every prior fixture, vehicle asset, control and camera input',verifyCorneringRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cornering/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreDrivelineBytes(file,source(file));assert.deepEqual(restoreCorneringBytes(file,bytes),readCorneringPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCorneringBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCorneringBytes('src/unknown.ts',unknown),unknown);
});
