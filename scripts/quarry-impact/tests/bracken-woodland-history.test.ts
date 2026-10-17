import {restoreAshfordPaddockBytes} from './ashford-paddock-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrackenWoodlandPrevious,restoreBrackenWoodlandBytes,verifyBrackenWoodlandRevision} from './bracken-woodland-invariants';
const source=(file:string)=>restoreAshfordPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BrackenWoodland preserves every prior fixture, vehicle asset, control and camera input',verifyBrackenWoodlandRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bracken-woodland/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrackenWoodlandBytes(file,bytes),readBrackenWoodlandPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrackenWoodlandBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrackenWoodlandBytes('src/unknown.ts',unknown),unknown);
});
