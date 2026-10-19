import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFeatureBadgesPrevious,restoreFeatureBadgesBytes,verifyFeatureBadgesRevision} from './feature-badges-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FeatureBadges preserves every prior fixture, vehicle asset, venue art and history input',verifyFeatureBadgesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/feature-badges/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFeatureBadgesBytes(file,bytes),readFeatureBadgesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFeatureBadgesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFeatureBadgesBytes('src/unknown.ts',unknown),unknown);
});
