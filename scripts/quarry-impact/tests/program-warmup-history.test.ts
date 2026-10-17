import {restoreKingswellBandstandsBytes} from './kingswell-bandstands-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readProgramWarmupPrevious,restoreProgramWarmupBytes,verifyProgramWarmupRevision} from './program-warmup-invariants';
const source=(file:string)=>restoreKingswellBandstandsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ProgramWarmup preserves every prior fixture, vehicle asset, control and camera input',verifyProgramWarmupRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/program-warmup/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreProgramWarmupBytes(file,bytes),readProgramWarmupPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreProgramWarmupBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreProgramWarmupBytes('src/unknown.ts',unknown),unknown);
});
