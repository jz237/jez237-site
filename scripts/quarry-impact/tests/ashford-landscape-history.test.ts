import {restoreAshfordRoadWearBytes} from './ashford-road-wear-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAshfordLandscapePrevious,restoreAshfordLandscapeBytes,verifyAshfordLandscapeRevision} from './ashford-landscape-invariants';
const source=(file:string)=>restoreAshfordRoadWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AshfordLandscape preserves every prior fixture, vehicle asset, control and camera input',verifyAshfordLandscapeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ashford-landscape/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAshfordLandscapeBytes(file,bytes),readAshfordLandscapePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAshfordLandscapeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAshfordLandscapeBytes('src/unknown.ts',unknown),unknown);
});
