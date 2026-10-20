import {restoreAllArenaPropsBytes} from './all-arena-props-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readClassicPropsPrevious,restoreClassicPropsBytes,verifyClassicPropsRevision} from './classic-props-invariants';
const source=(file:string)=>restoreAllArenaPropsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ClassicProps preserves every prior fixture, vehicle asset, venue art and history input',verifyClassicPropsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/classic-props/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreClassicPropsBytes(file,bytes),readClassicPropsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreClassicPropsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreClassicPropsBytes('src/unknown.ts',unknown),unknown);
});
