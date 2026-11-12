import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {importDeep} from './deep-import';
import {verifyLoadingSpeedRevision} from './loading-speed-invariants';
test('loading optimization preserves the preceding runtime and immutable release history',async()=>{
 verifyLoadingSpeedRevision();
 const {restoreDerbyWearBytes}=await importDeep<{restoreDerbyWearBytes:(file:string,bytes:Buffer)=>Buffer}>(new URL('./derby-wear-invariants.ts',import.meta.url));
 const previous=JSON.parse(readFileSync(new URL('./fixtures/derby-wear/revision.json',import.meta.url),'utf8'));
 const bytes=restoreDerbyWearBytes('src/main.ts',readFileSync(new URL('../src/main.ts',import.meta.url)));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),previous.files['src/main.ts'].before);
});
