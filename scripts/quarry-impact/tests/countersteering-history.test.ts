import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCountersteeringPrevious,restoreCountersteeringBytes,verifyCountersteeringRevision} from './countersteering-invariants';
const source=(file:string)=>restoreContactScrapingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Countersteering preserves every prior fixture, vehicle asset, control and camera input',verifyCountersteeringRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/countersteering/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCountersteeringBytes(file,bytes),readCountersteeringPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCountersteeringBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCountersteeringBytes('src/unknown.ts',unknown),unknown);
});

import {restoreContactScrapingBytes} from './contact-scraping-invariants';
