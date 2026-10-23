import {restoreFastestHitBytes} from './fastest-hit-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDebrisFlingPrevious,restoreDebrisFlingBytes,verifyDebrisFlingRevision} from './debris-fling-invariants';
const source=(file:string)=>restoreFastestHitBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DebrisFling preserves every prior fixture, vehicle asset, venue art and history input',verifyDebrisFlingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/debris-fling/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDebrisFlingBytes(file,bytes),readDebrisFlingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDebrisFlingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDebrisFlingBytes('src/unknown.ts',unknown),unknown);
});
