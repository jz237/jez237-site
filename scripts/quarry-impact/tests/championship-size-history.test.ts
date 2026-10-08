import {restorePinecrestBytes} from './pinecrest-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChampionshipSizePrevious,restoreChampionshipSizeBytes,verifyChampionshipSizeRevision} from './championship-size-invariants';
const source=(file:string)=>restorePinecrestBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ChampionshipSize preserves every prior fixture, vehicle asset, control and camera input',verifyChampionshipSizeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/championship-size/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChampionshipSizeBytes(file,bytes),readChampionshipSizePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChampionshipSizeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChampionshipSizeBytes('src/unknown.ts',unknown),unknown);
});
