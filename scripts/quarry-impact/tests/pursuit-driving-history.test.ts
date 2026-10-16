import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPursuitDrivingPrevious,restorePursuitDrivingBytes,verifyPursuitDrivingRevision} from './pursuit-driving-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PursuitDriving preserves every prior fixture, vehicle asset, control and camera input',verifyPursuitDrivingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pursuit-driving/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePursuitDrivingBytes(file,bytes),readPursuitDrivingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePursuitDrivingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePursuitDrivingBytes('src/unknown.ts',unknown),unknown);
});
