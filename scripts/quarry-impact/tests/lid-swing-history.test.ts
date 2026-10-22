import {restoreRoofDuckBytes} from './roof-duck-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLidSwingPrevious,restoreLidSwingBytes,verifyLidSwingRevision} from './lid-swing-invariants';
const source=(file:string)=>restoreRoofDuckBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LidSwing preserves every prior fixture, vehicle asset, venue art and history input',verifyLidSwingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lid-swing/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLidSwingBytes(file,bytes),readLidSwingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLidSwingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLidSwingBytes('src/unknown.ts',unknown),unknown);
});
