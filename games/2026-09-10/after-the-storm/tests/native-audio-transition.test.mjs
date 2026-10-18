import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resetNativeRaceAudioTimers} from '../native-audio-transition.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-audio-transition-reference.json',import.meta.url)));
test('original transition executions clear only their owned race timers and voice latches',()=>{
 for(const c of reference.cases)assert.deepEqual(resetNativeRaceAudioTimers(c.consumer,c.mode,c.input,c.context),c.expected,JSON.stringify(c));
});
