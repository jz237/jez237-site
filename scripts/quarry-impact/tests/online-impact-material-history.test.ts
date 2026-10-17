import {restoreFenwickServiceBytes} from './fenwick-service-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineImpactMaterialPrevious,restoreOnlineImpactMaterialBytes,verifyOnlineImpactMaterialRevision} from './online-impact-material-invariants';
const source=(file:string)=>restoreFenwickServiceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineImpactMaterial preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineImpactMaterialRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-impact-material/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineImpactMaterialBytes(file,bytes),readOnlineImpactMaterialPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineImpactMaterialBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineImpactMaterialBytes('src/unknown.ts',unknown),unknown);
});
