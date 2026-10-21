import {restoreDrumBlastBytes} from './drum-blast-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPropFiresPrevious,restorePropFiresBytes,verifyPropFiresRevision} from './prop-fires-invariants';
const source=(file:string)=>restoreDrumBlastBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PropFires preserves every prior fixture, vehicle asset, venue art and history input',verifyPropFiresRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/prop-fires/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePropFiresBytes(file,bytes),readPropFiresPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePropFiresBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePropFiresBytes('src/unknown.ts',unknown),unknown);
});
