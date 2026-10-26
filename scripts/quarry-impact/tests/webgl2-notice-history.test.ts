import {restoreSmoothDemoBytes} from './smooth-demo-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWebgl2NoticePrevious,restoreWebgl2NoticeBytes,verifyWebgl2NoticeRevision} from './webgl2-notice-invariants';
const source=(file:string)=>restoreSmoothDemoBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Webgl2Notice preserves every prior fixture, vehicle asset, venue art and history input',verifyWebgl2NoticeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/webgl2-notice/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWebgl2NoticeBytes(file,bytes),readWebgl2NoticePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWebgl2NoticeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWebgl2NoticeBytes('src/unknown.ts',unknown),unknown);
});
