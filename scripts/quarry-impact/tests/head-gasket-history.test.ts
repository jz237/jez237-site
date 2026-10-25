import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHeadGasketPrevious,restoreHeadGasketBytes,verifyHeadGasketRevision} from './head-gasket-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('HeadGasket preserves every prior fixture, vehicle asset, venue art and history input',verifyHeadGasketRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/head-gasket/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHeadGasketBytes(file,bytes),readHeadGasketPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHeadGasketBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHeadGasketBytes('src/unknown.ts',unknown),unknown);
});
