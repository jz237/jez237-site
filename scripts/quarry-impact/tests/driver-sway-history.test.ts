import {restoreRoofKnockBytes} from './roof-knock-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDriverSwayPrevious,restoreDriverSwayBytes,verifyDriverSwayRevision} from './driver-sway-invariants';
const source=(file:string)=>restoreRoofKnockBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DriverSway preserves every prior fixture, vehicle asset, venue art and history input',verifyDriverSwayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driver-sway/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDriverSwayBytes(file,bytes),readDriverSwayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDriverSwayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDriverSwayBytes('src/unknown.ts',unknown),unknown);
});
