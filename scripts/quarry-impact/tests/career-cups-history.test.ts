import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCareerCupsPrevious,restoreCareerCupsBytes,verifyCareerCupsRevision} from './career-cups-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CareerCups preserves every prior fixture, vehicle asset, control and camera input',verifyCareerCupsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/career-cups/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCareerCupsBytes(file,bytes),readCareerCupsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCareerCupsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCareerCupsBytes('src/unknown.ts',unknown),unknown);
});
