import {restoreDriverWaveBytes} from './driver-wave-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDriverBailPrevious,restoreDriverBailBytes,verifyDriverBailRevision} from './driver-bail-invariants';
const source=(file:string)=>restoreDriverWaveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DriverBail preserves every prior fixture, vehicle asset, venue art and history input',verifyDriverBailRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driver-bail/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDriverBailBytes(file,bytes),readDriverBailPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDriverBailBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDriverBailBytes('src/unknown.ts',unknown),unknown);
});
