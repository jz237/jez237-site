import test from 'node:test';import assert from 'node:assert/strict';
import {replayName,ReplayLibrary} from '../src/replay-library';
import {verifyReplayLibraryRevision} from './replay-library-invariants';
test('unavailable replay storage rejects without touching the recording',async()=>{const library=new ReplayLibrary(null as any);await assert.rejects(library.list(),/storage is unavailable/);await assert.rejects(library.rename('absent','x'),/storage is unavailable/);});
test('recording names are bounded and never blank after control characters are removed',()=>{assert.equal(replayName(' \0\n\t '),'Untitled replay');assert.equal(replayName('a'.repeat(100)).length,80);assert.equal(replayName('  Derby ★  '),'Derby ★');});
test('replay library keeps the preceding runtime recoverable',verifyReplayLibraryRevision);
