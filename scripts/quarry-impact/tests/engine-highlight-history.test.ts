import {restoreEngineOutReportBytes} from './engine-out-report-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEngineHighlightPrevious,restoreEngineHighlightBytes,verifyEngineHighlightRevision} from './engine-highlight-invariants';
const source=(file:string)=>restoreEngineOutReportBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('EngineHighlight preserves every prior fixture, vehicle asset, venue art and history input',verifyEngineHighlightRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/engine-highlight/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEngineHighlightBytes(file,bytes),readEngineHighlightPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEngineHighlightBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEngineHighlightBytes('src/unknown.ts',unknown),unknown);
});
