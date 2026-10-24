import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrowdFavouritePrevious,restoreCrowdFavouriteBytes,verifyCrowdFavouriteRevision} from './crowd-favourite-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CrowdFavourite preserves every prior fixture, vehicle asset, venue art and history input',verifyCrowdFavouriteRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crowd-favourite/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrowdFavouriteBytes(file,bytes),readCrowdFavouritePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrowdFavouriteBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrowdFavouriteBytes('src/unknown.ts',unknown),unknown);
});
