import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readKingswellClubhousePrevious,restoreKingswellClubhouseBytes,verifyKingswellClubhouseRevision} from './kingswell-clubhouse-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('KingswellClubhouse preserves every prior fixture, vehicle asset, control and camera input',verifyKingswellClubhouseRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/kingswell-clubhouse/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreKingswellClubhouseBytes(file,bytes),readKingswellClubhousePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreKingswellClubhouseBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreKingswellClubhouseBytes('src/unknown.ts',unknown),unknown);
});
