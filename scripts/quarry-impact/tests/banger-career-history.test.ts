import {restoreCornerPropsBytes} from './corner-props-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBangerCareerPrevious,restoreBangerCareerBytes,verifyBangerCareerRevision} from './banger-career-invariants';
const source=(file:string)=>restoreCornerPropsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BangerCareer preserves every prior fixture, vehicle asset, venue art and history input',verifyBangerCareerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/banger-career/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBangerCareerBytes(file,bytes),readBangerCareerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBangerCareerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBangerCareerBytes('src/unknown.ts',unknown),unknown);
});
