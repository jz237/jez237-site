import {restoreWipersBytes} from './wipers-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEngineShakePrevious,restoreEngineShakeBytes,verifyEngineShakeRevision} from './engine-shake-invariants';
const source=(file:string)=>restoreWipersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('EngineShake preserves every prior fixture, vehicle asset, venue art and history input',verifyEngineShakeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/engine-shake/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEngineShakeBytes(file,bytes),readEngineShakePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEngineShakeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEngineShakeBytes('src/unknown.ts',unknown),unknown);
});
