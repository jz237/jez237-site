import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readClubCupPrevious,restoreClubCupBytes,verifyClubCupRevision} from './club-cup-invariants';
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');

test('Club Cup preserves recoverable Ironfield source and unchanged physics, assets, camera and earlier revision leaves',verifyClubCupRevision);

test('Club Cup restoration reaches the published Ironfield main while profile and camera modules retain their exact schema and behavior',()=>{
 const current=readFileSync(new URL('../src/main.ts',import.meta.url));
 assert.equal(hash(readClubCupPrevious('src/main.ts')),'ff3a8963ec0391760fd88c2702c126a1eca7e96dd026816e05c05a6ca3918597');
 assert.deepEqual(restoreClubCupBytes('src/main.ts',current),readClubCupPrevious('src/main.ts'));
 const unrelated=Buffer.from('not a captured revision');assert.deepEqual(restoreClubCupBytes('src/main.ts',unrelated),unrelated);
 assert.equal(hash(restoreClubCupBytes('src/progression.ts',readFileSync(new URL('../src/progression.ts',import.meta.url)))),'9077b704442256a153ea66fac84585fcce22a813fb4374a710940bf9c32e3c27');
 assert.equal(hash(restoreClubCupBytes('src/demo-director.ts',readFileSync(new URL('../src/demo-director.ts',import.meta.url)))),'a02914faeda262ed08e87f0a1f25706e588dcefb0abc042a120333ad1000fbf8');
});
