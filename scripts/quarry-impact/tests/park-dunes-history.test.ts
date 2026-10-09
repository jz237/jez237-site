import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readParkDunesPrevious,restoreParkDunesBytes,verifyParkDunesRevision} from './park-dunes-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ParkDunes preserves every prior fixture, vehicle asset, control and camera input',verifyParkDunesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/park-dunes/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreParkDunesBytes(file,bytes),readParkDunesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreParkDunesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreParkDunesBytes('src/unknown.ts',unknown),unknown);
});
