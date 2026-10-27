import {restoreCoupeAssetLoadBytes} from './coupe-asset-load-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBaldTyresPrevious,restoreBaldTyresBytes,verifyBaldTyresRevision} from './bald-tyres-invariants';
const source=(file:string)=>restoreCoupeAssetLoadBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BaldTyres preserves every prior fixture, vehicle asset, venue art and history input',verifyBaldTyresRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bald-tyres/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBaldTyresBytes(file,bytes),readBaldTyresPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBaldTyresBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBaldTyresBytes('src/unknown.ts',unknown),unknown);
});
