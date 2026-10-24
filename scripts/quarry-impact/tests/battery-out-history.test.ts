import {restoreReportBatteryBytes} from './report-battery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBatteryOutPrevious,restoreBatteryOutBytes,verifyBatteryOutRevision} from './battery-out-invariants';
const source=(file:string)=>restoreReportBatteryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BatteryOut preserves every prior fixture, vehicle asset, venue art and history input',verifyBatteryOutRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/battery-out/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBatteryOutBytes(file,bytes),readBatteryOutPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBatteryOutBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBatteryOutBytes('src/unknown.ts',unknown),unknown);
});
