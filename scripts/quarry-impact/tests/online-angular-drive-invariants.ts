import {restoreRecoveryRetryBytes} from './recovery-retry-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-angular-drive/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineAngularDrivePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineAngularDrive baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineAngularDriveBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRecoveryRetryBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineAngularDrivePrevious(file);
}
export function verifyOnlineAngularDriveRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d0d81b10a6e22209e1bf2eca54b0ae8727a48ddc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRecoveryRetryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineAngularDriveBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRecoveryRetryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineAngularDrive release');
 assert.equal(manifest.previousFixtureCount,3784);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3784);
}
