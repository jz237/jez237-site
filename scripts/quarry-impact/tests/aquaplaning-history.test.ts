import {restoreLensSplashBytes} from './lens-splash-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAquaplaningPrevious,restoreAquaplaningBytes,verifyAquaplaningRevision} from './aquaplaning-invariants';
const source=(file:string)=>restoreLensSplashBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Aquaplaning preserves every prior fixture, vehicle asset, venue art and history input',verifyAquaplaningRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/aquaplaning/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAquaplaningBytes(file,bytes),readAquaplaningPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAquaplaningBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAquaplaningBytes('src/unknown.ts',unknown),unknown);
});
