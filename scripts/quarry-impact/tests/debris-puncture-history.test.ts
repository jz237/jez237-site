import {restoreFailureCrowdBytes} from './failure-crowd-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDebrisPuncturePrevious,restoreDebrisPunctureBytes,verifyDebrisPunctureRevision} from './debris-puncture-invariants';
const source=(file:string)=>restoreFailureCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DebrisPuncture preserves every prior fixture, vehicle asset, venue art and history input',verifyDebrisPunctureRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/debris-puncture/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDebrisPunctureBytes(file,bytes),readDebrisPuncturePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDebrisPunctureBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDebrisPunctureBytes('src/unknown.ts',unknown),unknown);
});
