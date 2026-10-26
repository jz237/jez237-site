import {restoreSparkLightBytes} from './spark-light-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStrutPunchPrevious,restoreStrutPunchBytes,verifyStrutPunchRevision} from './strut-punch-invariants';
const source=(file:string)=>restoreSparkLightBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('StrutPunch preserves every prior fixture, vehicle asset, venue art and history input',verifyStrutPunchRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/strut-punch/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStrutPunchBytes(file,bytes),readStrutPunchPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStrutPunchBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStrutPunchBytes('src/unknown.ts',unknown),unknown);
});
