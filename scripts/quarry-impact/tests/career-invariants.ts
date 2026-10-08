import {restoreSaveBackupBytes,verifySaveBackupRevision} from './save-backup-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/career/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCareerPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Career baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCareerBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSaveBackupBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCareerPrevious(file);
}
export function verifyCareerRevision(){
 verifySaveBackupRevision();
 const manifest=revision();assert.equal(manifest.baseline,'b71e09fb3a338b8dbb5ed9afeb10e6ab912c31d1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSaveBackupBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCareerBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSaveBackupBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Career release');
 assert.equal(manifest.previousFixtureCount,1096);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1096);
}
