import {restoreAshfordLandscapeBytes} from './ashford-landscape-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAshfordPaddockPrevious,restoreAshfordPaddockBytes,verifyAshfordPaddockRevision} from './ashford-paddock-invariants';
const source=(file:string)=>restoreAshfordLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AshfordPaddock preserves every prior fixture, vehicle asset, control and camera input',verifyAshfordPaddockRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ashford-paddock/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAshfordPaddockBytes(file,bytes),readAshfordPaddockPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAshfordPaddockBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAshfordPaddockBytes('src/unknown.ts',unknown),unknown);
});
