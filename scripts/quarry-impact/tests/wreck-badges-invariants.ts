import {restoreBangerCareerBytes} from './banger-career-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wreck-badges/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWreckBadgesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WreckBadges baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWreckBadgesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBangerCareerBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWreckBadgesPrevious(file);
}
export function verifyWreckBadgesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a320243c33fa8551ec29d976f86c4d3e3944db7e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBangerCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWreckBadgesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBangerCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WreckBadges release');
 assert.equal(manifest.previousFixtureCount,5210);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5210);
}
