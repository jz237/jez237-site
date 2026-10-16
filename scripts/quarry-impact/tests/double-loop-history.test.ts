import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDoubleLoopPrevious,restoreDoubleLoopBytes,verifyDoubleLoopRevision} from './double-loop-invariants';
const source=(file:string)=>restoreAlderwickShowgroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DoubleLoop preserves every prior fixture, vehicle asset, control and camera input',verifyDoubleLoopRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/double-loop/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDoubleLoopBytes(file,bytes),readDoubleLoopPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDoubleLoopBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDoubleLoopBytes('src/unknown.ts',unknown),unknown);
});

import {restoreAlderwickShowgroundBytes} from './alderwick-showground-invariants';
