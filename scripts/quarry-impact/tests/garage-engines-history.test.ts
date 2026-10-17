import {restoreClubEnginesBytes} from './club-engines-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGarageEnginesPrevious,restoreGarageEnginesBytes,verifyGarageEnginesRevision} from './garage-engines-invariants';
const source=(file:string)=>restoreClubEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('GarageEngines preserves every prior fixture, vehicle asset, control and camera input',verifyGarageEnginesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/garage-engines/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGarageEnginesBytes(file,bytes),readGarageEnginesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGarageEnginesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGarageEnginesBytes('src/unknown.ts',unknown),unknown);
});
