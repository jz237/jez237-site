import {restoreShockwaveBytes} from './shockwave-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAllArenaPropsPrevious,restoreAllArenaPropsBytes,verifyAllArenaPropsRevision} from './all-arena-props-invariants';
const source=(file:string)=>restoreShockwaveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AllArenaProps preserves every prior fixture, vehicle asset, venue art and history input',verifyAllArenaPropsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/all-arena-props/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAllArenaPropsBytes(file,bytes),readAllArenaPropsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAllArenaPropsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAllArenaPropsBytes('src/unknown.ts',unknown),unknown);
});
