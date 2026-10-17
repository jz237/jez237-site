import {restoreBrackenWoodlandBytes} from './bracken-woodland-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrackenPaddockPrevious,restoreBrackenPaddockBytes,verifyBrackenPaddockRevision} from './bracken-paddock-invariants';
const source=(file:string)=>restoreBrackenWoodlandBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BrackenPaddock preserves every prior fixture, vehicle asset, control and camera input',verifyBrackenPaddockRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bracken-paddock/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrackenPaddockBytes(file,bytes),readBrackenPaddockPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrackenPaddockBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrackenPaddockBytes('src/unknown.ts',unknown),unknown);
});
