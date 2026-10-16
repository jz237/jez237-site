import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRotatingImpactPrevious,restoreRotatingImpactBytes,verifyRotatingImpactRevision} from './rotating-impact-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RotatingImpact preserves every prior fixture, vehicle asset, control and camera input',verifyRotatingImpactRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rotating-impact/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRotatingImpactBytes(file,bytes),readRotatingImpactPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRotatingImpactBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRotatingImpactBytes('src/unknown.ts',unknown),unknown);
});
