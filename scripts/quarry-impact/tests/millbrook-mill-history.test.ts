import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMillbrookMillPrevious,restoreMillbrookMillBytes,verifyMillbrookMillRevision} from './millbrook-mill-invariants';
const source=(file:string)=>restoreGraniteViaductBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MillbrookMill preserves every prior fixture, vehicle asset, control and camera input',verifyMillbrookMillRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/millbrook-mill/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMillbrookMillBytes(file,bytes),readMillbrookMillPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMillbrookMillBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMillbrookMillBytes('src/unknown.ts',unknown),unknown);
});

import {restoreGraniteViaductBytes} from './granite-viaduct-invariants';
