import {restoreSableBytes} from './sable-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFreightSpeedPrevious,restoreFreightSpeedBytes,verifyFreightSpeedRevision} from './freight-speed-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FreightSpeed preserves every prior fixture, vehicle asset, control and camera input',verifyFreightSpeedRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/freight-speed/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreSableBytes(file,source(file));assert.deepEqual(restoreFreightSpeedBytes(file,bytes),readFreightSpeedPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFreightSpeedBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFreightSpeedBytes('src/unknown.ts',unknown),unknown);
});
