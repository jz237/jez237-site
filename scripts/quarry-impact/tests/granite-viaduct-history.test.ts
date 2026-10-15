import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGraniteViaductPrevious,restoreGraniteViaductBytes,verifyGraniteViaductRevision} from './granite-viaduct-invariants';
const source=(file:string)=>restoreReservoirIntakeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('GraniteViaduct preserves every prior fixture, vehicle asset, control and camera input',verifyGraniteViaductRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/granite-viaduct/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGraniteViaductBytes(file,bytes),readGraniteViaductPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGraniteViaductBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGraniteViaductBytes('src/unknown.ts',unknown),unknown);
});

import {restoreReservoirIntakeBytes} from './reservoir-intake-invariants';
