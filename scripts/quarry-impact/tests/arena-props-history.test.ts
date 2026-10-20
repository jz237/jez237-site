import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readArenaPropsPrevious,restoreArenaPropsBytes,verifyArenaPropsRevision} from './arena-props-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ArenaProps preserves every prior fixture, vehicle asset, venue art and history input',verifyArenaPropsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/arena-props/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreArenaPropsBytes(file,bytes),readArenaPropsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreArenaPropsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreArenaPropsBytes('src/unknown.ts',unknown),unknown);
});
