import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWindowMistPrevious,restoreWindowMistBytes,verifyWindowMistRevision} from './window-mist-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WindowMist preserves every prior fixture, vehicle asset, venue art and history input',verifyWindowMistRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/window-mist/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWindowMistBytes(file,bytes),readWindowMistPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWindowMistBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWindowMistBytes('src/unknown.ts',unknown),unknown);
});
