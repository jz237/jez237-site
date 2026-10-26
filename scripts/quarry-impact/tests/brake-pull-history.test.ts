import {restoreRottenHangersBytes} from './rotten-hangers-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrakePullPrevious,restoreBrakePullBytes,verifyBrakePullRevision} from './brake-pull-invariants';
const source=(file:string)=>restoreRottenHangersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BrakePull preserves every prior fixture, vehicle asset, venue art and history input',verifyBrakePullRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/brake-pull/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrakePullBytes(file,bytes),readBrakePullPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrakePullBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrakePullBytes('src/unknown.ts',unknown),unknown);
});
