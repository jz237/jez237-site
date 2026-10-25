import {restoreTyreHeatBytes} from './tyre-heat-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrakeHeatPrevious,restoreBrakeHeatBytes,verifyBrakeHeatRevision} from './brake-heat-invariants';
const source=(file:string)=>restoreTyreHeatBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BrakeHeat preserves every prior fixture, vehicle asset, venue art and history input',verifyBrakeHeatRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/brake-heat/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrakeHeatBytes(file,bytes),readBrakeHeatPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrakeHeatBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrakeHeatBytes('src/unknown.ts',unknown),unknown);
});
