import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAlderwickShowgroundPrevious,restoreAlderwickShowgroundBytes,verifyAlderwickShowgroundRevision} from './alderwick-showground-invariants';
const source=(file:string)=>restorePursuitReachBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AlderwickShowground preserves every prior fixture, vehicle asset, control and camera input',verifyAlderwickShowgroundRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/alderwick-showground/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAlderwickShowgroundBytes(file,bytes),readAlderwickShowgroundPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAlderwickShowgroundBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAlderwickShowgroundBytes('src/unknown.ts',unknown),unknown);
});

import {restorePursuitReachBytes} from './pursuit-reach-invariants';
