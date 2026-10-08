import {restoreRedbankBytes,verifyRedbankRevision} from './redbank-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/damage-rules/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDamageRulesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DamageRules baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDamageRulesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRedbankBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDamageRulesPrevious(file);
}
export function verifyDamageRulesRevision(){
 verifyRedbankRevision();
 const manifest=revision();assert.equal(manifest.baseline,'6e96c98e93e29143d1a4f2d181c227a870f228a5');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRedbankBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDamageRulesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRedbankBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DamageRules release');
 assert.equal(manifest.previousFixtureCount,1028);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1028);
}
