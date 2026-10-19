import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeProfileContactMode as prepare} from '../native-race-body-fields.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-profile-contact.json.gz',import.meta.url))));

test('profile contact mode matches every original pre-actor store including subnormal impacts',()=>{
 for(const c of evidence.cases){const before={...c.input},q=prepare(c.input);
  assert.deepEqual(q,{contactMode1602:c.contactMode1602,bodyWrites:c.bodyWrites});assert.deepEqual(c.input,before);
 }
});

test('human profile retains contact state without inspecting an unrelated impact',()=>{
 assert.deepEqual(prepare({profile16ce:0,contactMode1602:2}),{contactMode1602:2,bodyWrites:[]});
 assert.throws(()=>prepare({profile16ce:1,contactMode1602:2,racerImpactC40:NaN}),/racerImpact/);
 assert.equal(prepare({profile16ce:1,contactMode1602:2,racerImpactC40:1e-50}).contactMode1602,0,'comparison follows the float store');
});
