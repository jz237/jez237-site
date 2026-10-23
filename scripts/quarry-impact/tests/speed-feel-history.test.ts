import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSpeedFeelPrevious,restoreSpeedFeelBytes,verifySpeedFeelRevision} from './speed-feel-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SpeedFeel preserves every prior fixture, vehicle asset, venue art and history input',verifySpeedFeelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/speed-feel/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSpeedFeelBytes(file,bytes),readSpeedFeelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSpeedFeelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSpeedFeelBytes('src/unknown.ts',unknown),unknown);
});
