import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGlassRainPrevious,restoreGlassRainBytes,verifyGlassRainRevision} from './glass-rain-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('GlassRain preserves every prior fixture, vehicle asset, venue art and history input',verifyGlassRainRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/glass-rain/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGlassRainBytes(file,bytes),readGlassRainPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGlassRainBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGlassRainBytes('src/unknown.ts',unknown),unknown);
});
