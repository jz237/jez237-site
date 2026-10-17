import {restoreBodyworkScrapingBytes} from './bodywork-scraping-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvaleFreightPrevious,restoreRookvaleFreightBytes,verifyRookvaleFreightRevision} from './rookvale-freight-invariants';
const source=(file:string)=>restoreBodyworkScrapingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RookvaleFreight preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleFreightRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale-freight/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRookvaleFreightBytes(file,bytes),readRookvaleFreightPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleFreightBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleFreightBytes('src/unknown.ts',unknown),unknown);
});
