import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDemoRowPrevious,restoreDemoRowBytes,verifyDemoRowRevision} from './demo-row-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DemoRow preserves every prior fixture, vehicle asset, venue art and history input',verifyDemoRowRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/demo-row/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDemoRowBytes(file,bytes),readDemoRowPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDemoRowBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDemoRowBytes('src/unknown.ts',unknown),unknown);
});
