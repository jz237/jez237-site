import {restoreBodyCrushBytes} from './body-crush-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSlowPuncturePrevious,restoreSlowPunctureBytes,verifySlowPunctureRevision} from './slow-puncture-invariants';
const source=(file:string)=>restoreBodyCrushBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SlowPuncture preserves every prior fixture, vehicle asset, venue art and history input',verifySlowPunctureRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/slow-puncture/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSlowPunctureBytes(file,bytes),readSlowPuncturePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSlowPunctureBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSlowPunctureBytes('src/unknown.ts',unknown),unknown);
});
