import {restoreLodgedDebrisBytes} from './lodged-debris-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCvJointsPrevious,restoreCvJointsBytes,verifyCvJointsRevision} from './cv-joints-invariants';
const source=(file:string)=>restoreLodgedDebrisBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CvJoints preserves every prior fixture, vehicle asset, venue art and history input',verifyCvJointsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cv-joints/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCvJointsBytes(file,bytes),readCvJointsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCvJointsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCvJointsBytes('src/unknown.ts',unknown),unknown);
});
