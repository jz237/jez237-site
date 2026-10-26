import {restoreBlisteredPaintBytes} from './blistered-paint-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWashMePrevious,restoreWashMeBytes,verifyWashMeRevision} from './wash-me-invariants';
const source=(file:string)=>restoreBlisteredPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WashMe preserves every prior fixture, vehicle asset, venue art and history input',verifyWashMeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wash-me/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWashMeBytes(file,bytes),readWashMePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWashMeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWashMeBytes('src/unknown.ts',unknown),unknown);
});
