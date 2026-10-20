import {restoreWreckReportBytes} from './wreck-report-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHighlightsPrevious,restoreHighlightsBytes,verifyHighlightsRevision} from './highlights-invariants';
const source=(file:string)=>restoreWreckReportBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Highlights preserves every prior fixture, vehicle asset, venue art and history input',verifyHighlightsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/highlights/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHighlightsBytes(file,bytes),readHighlightsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHighlightsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHighlightsBytes('src/unknown.ts',unknown),unknown);
});
