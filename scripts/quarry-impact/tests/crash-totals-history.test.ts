import {restoreSmashCrashBytes} from './smash-crash-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrashTotalsPrevious,restoreCrashTotalsBytes,verifyCrashTotalsRevision} from './crash-totals-invariants';
const source=(file:string)=>restoreSmashCrashBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CrashTotals preserves every prior fixture, vehicle asset, venue art and history input',verifyCrashTotalsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crash-totals/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrashTotalsBytes(file,bytes),readCrashTotalsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrashTotalsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrashTotalsBytes('src/unknown.ts',unknown),unknown);
});
