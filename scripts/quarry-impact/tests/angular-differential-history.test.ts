import {restoreAngularAssistsBytes} from './angular-assists-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAngularDifferentialPrevious,restoreAngularDifferentialBytes,verifyAngularDifferentialRevision} from './angular-differential-invariants';
const source=(file:string)=>restoreAngularAssistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AngularDifferential preserves every prior fixture, vehicle asset, control and camera input',verifyAngularDifferentialRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/angular-differential/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAngularDifferentialBytes(file,bytes),readAngularDifferentialPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAngularDifferentialBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAngularDifferentialBytes('src/unknown.ts',unknown),unknown);
});
