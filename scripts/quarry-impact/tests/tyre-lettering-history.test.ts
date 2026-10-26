import {restoreOddWheelsBytes} from './odd-wheels-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTyreLetteringPrevious,restoreTyreLetteringBytes,verifyTyreLetteringRevision} from './tyre-lettering-invariants';
const source=(file:string)=>restoreOddWheelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TyreLettering preserves every prior fixture, vehicle asset, venue art and history input',verifyTyreLetteringRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tyre-lettering/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTyreLetteringBytes(file,bytes),readTyreLetteringPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTyreLetteringBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTyreLetteringBytes('src/unknown.ts',unknown),unknown);
});
