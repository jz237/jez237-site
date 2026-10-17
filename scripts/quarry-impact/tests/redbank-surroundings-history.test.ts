import {restoreBrackenPaddockBytes} from './bracken-paddock-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRedbankSurroundingsPrevious,restoreRedbankSurroundingsBytes,verifyRedbankSurroundingsRevision} from './redbank-surroundings-invariants';
const source=(file:string)=>restoreBrackenPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RedbankSurroundings preserves every prior fixture, vehicle asset, control and camera input',verifyRedbankSurroundingsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/redbank-surroundings/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRedbankSurroundingsBytes(file,bytes),readRedbankSurroundingsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRedbankSurroundingsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRedbankSurroundingsBytes('src/unknown.ts',unknown),unknown);
});
