import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTankCreditPrevious,restoreTankCreditBytes,verifyTankCreditRevision} from './tank-credit-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TankCredit preserves every prior fixture, vehicle asset, venue art and history input',verifyTankCreditRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tank-credit/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTankCreditBytes(file,bytes),readTankCreditPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTankCreditBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTankCreditBytes('src/unknown.ts',unknown),unknown);
});
