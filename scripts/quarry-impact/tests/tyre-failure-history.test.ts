import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {readTyreFailurePrevious,verifyTyreFailureRevision} from './tyre-failure-invariants';
import {restoreDemoRecoveryBytes,verifyDemoRecoveryRevision} from './demo-recovery-invariants';
import {restoreIronfieldBytes} from './ironfield-invariants';

test('tyre release preserves the published camera source and all preceding guarded input bytes',()=>{
 verifyTyreFailureRevision();verifyDemoRecoveryRevision();
 // This layer must sit after the camera fix rather than accidentally restore
 // the pre-comfort director alongside the old physics reference.
 // Remove only the later venue sampler; the published comfort camera hash
 // remains unchanged and still guards every orientation/recovery decision.
 const camera=restoreIronfieldBytes('src/demo-director.ts',readFileSync(new URL('../src/demo-director.ts',import.meta.url)));
 const cameraRevision=JSON.parse(readFileSync(new URL('./fixtures/demo-recovery/revision.json',import.meta.url),'utf8'));
 assert.equal(createHash('sha256').update(camera).digest('hex'),cameraRevision.files['src/demo-director.ts'].after);
 const previousBridge=readTyreFailurePrevious('tests/demo-recovery-invariants.ts');
 assert.ok(previousBridge.includes(Buffer.from('verifyDemoRecoveryRevision')));
 assert.ok(!previousBridge.includes(Buffer.from('tyre-failure-invariants')));
});

test('frozen pre-tyre kernel includes the complete unchanged physics graph from both earlier releases',()=>{
 const folder=new URL('./fixtures/tyre-failure/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('previous-kernel.json',folder),'utf8'));
 const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
 assert.equal(manifest.revision,'2e641fea22272631c1dad949f8a14f5814c95b20');
 assert.equal(hash(gunzipSync(readFileSync(new URL('previous-kernel.mjs.gz',folder)))),manifest.bundleSHA256);
 assert.equal(Object.keys(manifest.sources).length,8);
 for(const [source,expected]of Object.entries<string>(manifest.sources)){
  const path=source.replace(/^\.\//,''),current=readFileSync(new URL('../'+path,import.meta.url));
  assert.equal(hash(restoreDemoRecoveryBytes(path,current)),expected,path+' restores exactly to the independently bundled physics source');
 }
});
