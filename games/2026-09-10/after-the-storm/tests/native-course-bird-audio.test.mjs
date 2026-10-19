import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeCourseBirdAudio as prepare} from '../native-course-bird-motion.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-bird-audio.json.gz',import.meta.url))));
test('bird ambience gate and five ordered queue commands match original BF8C8',()=>{
 assert.equal(e.cases.length,262);assert.equal(e.instructions,2795);
 for(const c of e.cases){const q=prepare(c);assert.deepEqual(q.operations,c.operations);assert.ok(Object.isFrozen(q.operations));}
});
test('bird ambience requires its separate timing word and cannot substitute gameplay RNG',()=>{
 for(const input of [{},{random4562c:-1},{random4562c:2**32},{random4562c:NaN},{rngState4640:0}])assert.throws(()=>prepare(input),/bird audio timing word/);
 assert.equal(prepare({random4562c:1}).operations.length,0);assert.equal(prepare({random4562c:0}).operations.length,5);
});
