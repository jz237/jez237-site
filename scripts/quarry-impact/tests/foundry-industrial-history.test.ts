import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFoundryIndustrialPrevious,restoreFoundryIndustrialBytes,verifyFoundryIndustrialRevision} from './foundry-industrial-invariants';
const source=(file:string)=>restoreFoundryApronBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FoundryIndustrial preserves every prior fixture, vehicle asset, control and camera input',verifyFoundryIndustrialRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/foundry-industrial/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFoundryIndustrialBytes(file,bytes),readFoundryIndustrialPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFoundryIndustrialBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFoundryIndustrialBytes('src/unknown.ts',unknown),unknown);
});

import {restoreFoundryApronBytes} from './foundry-apron-invariants';
