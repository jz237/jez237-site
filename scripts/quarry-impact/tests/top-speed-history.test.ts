import {restoreFinalTwoBytes} from './final-two-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTopSpeedPrevious,restoreTopSpeedBytes,verifyTopSpeedRevision} from './top-speed-invariants';
const source=(file:string)=>restoreFinalTwoBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TopSpeed preserves every prior fixture, vehicle asset, venue art and history input',verifyTopSpeedRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/top-speed/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTopSpeedBytes(file,bytes),readTopSpeedPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTopSpeedBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTopSpeedBytes('src/unknown.ts',unknown),unknown);
});
