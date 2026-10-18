import {restoreLinnetCarBytes} from './linnet-car-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTordalCarPrevious,restoreTordalCarBytes,verifyTordalCarRevision} from './tordal-car-invariants';
const source=(file:string)=>restoreLinnetCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TordalCar preserves every prior fixture, vehicle asset, control and camera input',verifyTordalCarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tordal-car/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTordalCarBytes(file,bytes),readTordalCarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTordalCarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTordalCarBytes('src/unknown.ts',unknown),unknown);
});
