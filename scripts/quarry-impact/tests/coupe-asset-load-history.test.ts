import {restoreCompletePlayBytes} from './complete-play-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCoupeAssetLoadPrevious,restoreCoupeAssetLoadBytes,verifyCoupeAssetLoadRevision} from './coupe-asset-load-invariants';
const source=(file:string)=>restoreCompletePlayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CoupeAssetLoad preserves every prior fixture, vehicle asset, venue art and history input',verifyCoupeAssetLoadRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/coupe-asset-load/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCoupeAssetLoadBytes(file,bytes),readCoupeAssetLoadPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCoupeAssetLoadBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCoupeAssetLoadBytes('src/unknown.ts',unknown),unknown);
});
