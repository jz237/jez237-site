import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readOpposingAIPrevious,restoreOpposingAIBytes,verifyOpposingAIRevision} from './opposing-ai-invariants';
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');

test('opposing traffic preserves the exact published predecessor, full physics/art/backend and every earlier fixture byte',verifyOpposingAIRevision);

test('opposing-AI restoration composes with later leaves while the settled camera and contact pipeline remain exact',()=>{
 const current=readFileSync(new URL('../src/driving-brain.ts',import.meta.url));
 assert.deepEqual(restoreOpposingAIBytes('src/driving-brain.ts',current),readOpposingAIPrevious('src/driving-brain.ts'));
 const unrelated=Buffer.from('not a captured revision');assert.deepEqual(restoreOpposingAIBytes('src/driving-brain.ts',unrelated),unrelated);
 for(const [file,expected] of Object.entries({
  "src/main.ts": "885634a7b49e51ca65499b51955f085f574da5915d0433fcd31d452e6aca3436",
  "src/demo-director.ts": "a02914faeda262ed08e87f0a1f25706e588dcefb0abc042a120333ad1000fbf8",
  "src/vehicle-physics.ts": "f4ff63df9c4aafc755b4e71809637c0efccca9e0185bf56ef894b970b67713a4",
  "src/vehicle-contact.ts": "1142c83a2711b4da2e6d39e432cbf3c306e1a5aa43f3b7156ee8f924d4e40f06",
  "src/impact-adjudication.ts": "18ef8d0a1c13a2ec7d430216aba51a0d3c95ae10885287258f0b3348ebcf3d77",
  "multiplayer/simulation.ts": "9ccfc0e38c3dcda855222189871bdadb6d6cd097a24ccf975a4a2b630731ecd4"
}))assert.equal(hash(restoreOpposingAIBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file);
});
