import {restoreBonnetSteamBytes} from './bonnet-steam-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/glass-rain/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGlassRainPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GlassRain baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGlassRainBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBonnetSteamBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGlassRainPrevious(file);
}
export function verifyGlassRainRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9340b8c2e6ec2650d1562507ad387228f66acc94');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBonnetSteamBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGlassRainBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBonnetSteamBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GlassRain release');
 assert.equal(manifest.previousFixtureCount,7990);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7990);
}
