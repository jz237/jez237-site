import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCornerPropsPrevious,restoreCornerPropsBytes,verifyCornerPropsRevision} from './corner-props-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CornerProps preserves every prior fixture, vehicle asset, venue art and history input',verifyCornerPropsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/corner-props/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCornerPropsBytes(file,bytes),readCornerPropsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCornerPropsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCornerPropsBytes('src/unknown.ts',unknown),unknown);
});
