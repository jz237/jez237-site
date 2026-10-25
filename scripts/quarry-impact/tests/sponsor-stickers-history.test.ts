import {restoreDriverSwayBytes} from './driver-sway-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSponsorStickersPrevious,restoreSponsorStickersBytes,verifySponsorStickersRevision} from './sponsor-stickers-invariants';
const source=(file:string)=>restoreDriverSwayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SponsorStickers preserves every prior fixture, vehicle asset, venue art and history input',verifySponsorStickersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sponsor-stickers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSponsorStickersBytes(file,bytes),readSponsorStickersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSponsorStickersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSponsorStickersBytes('src/unknown.ts',unknown),unknown);
});
