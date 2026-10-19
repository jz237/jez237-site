import {restoreThornbyHillBytes} from './thornby-hill-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPipitCarPrevious,restorePipitCarBytes,verifyPipitCarRevision} from './pipit-car-invariants';
const source=(file:string)=>restoreThornbyHillBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PipitCar preserves every prior fixture, vehicle asset, venue art and history input',verifyPipitCarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pipit-car/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePipitCarBytes(file,bytes),readPipitCarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePipitCarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePipitCarBytes('src/unknown.ts',unknown),unknown);
});
