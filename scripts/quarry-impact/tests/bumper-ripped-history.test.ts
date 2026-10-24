import {restoreMirrorClipBytes} from './mirror-clip-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBumperRippedPrevious,restoreBumperRippedBytes,verifyBumperRippedRevision} from './bumper-ripped-invariants';
const source=(file:string)=>restoreMirrorClipBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BumperRipped preserves every prior fixture, vehicle asset, venue art and history input',verifyBumperRippedRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bumper-ripped/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBumperRippedBytes(file,bytes),readBumperRippedPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBumperRippedBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBumperRippedBytes('src/unknown.ts',unknown),unknown);
});
