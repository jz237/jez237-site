import {restoreDemoLightingBytes} from './demo-lighting-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLinnetCarPrevious,restoreLinnetCarBytes,verifyLinnetCarRevision} from './linnet-car-invariants';
const source=(file:string)=>restoreDemoLightingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LinnetCar preserves every prior fixture, vehicle asset, control and camera input',verifyLinnetCarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/linnet-car/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLinnetCarBytes(file,bytes),readLinnetCarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLinnetCarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLinnetCarBytes('src/unknown.ts',unknown),unknown);
});
