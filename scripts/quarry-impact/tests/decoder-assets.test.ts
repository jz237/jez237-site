import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
test('public Draco runtime dependencies match the pinned Three decoder distribution',()=>{
 for(const file of ['draco_decoder.wasm','draco_wasm_wrapper.js','draco_decoder.js']){
 const released=readFileSync(new URL('../public/models/draco/'+file,import.meta.url));
 const pinned=readFileSync(new URL('../node_modules/three/examples/jsm/libs/draco/gltf/'+file,import.meta.url));
 assert.equal(createHash('sha256').update(released).digest('hex'),createHash('sha256').update(pinned).digest('hex'),file);
 }
});
