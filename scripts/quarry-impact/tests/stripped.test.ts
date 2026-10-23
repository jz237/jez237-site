import test from 'node:test';
import assert from 'node:assert/strict';
import {STRIPPED,strippedLabel} from '../src/derby-moments';
test('the crowd hears once when a car is stripped, and once more at a bare shell',()=>{
 assert.equal(strippedLabel(STRIPPED.first-1,STRIPPED.first),`STRIPPED · ${STRIPPED.first} PARTS GONE`);
 assert.equal(strippedLabel(STRIPPED.first,STRIPPED.first+1),'','no repeat');
 assert.equal(strippedLabel(STRIPPED.shell-1,STRIPPED.shell),`BARE SHELL · ${STRIPPED.shell} PARTS GONE`);
 assert.equal(strippedLabel(2,STRIPPED.shell+1),`BARE SHELL · ${STRIPPED.shell+1} PARTS GONE`,'a big jump goes straight to the shell');
 assert.equal(strippedLabel(STRIPPED.shell,STRIPPED.first),'','a repair says nothing');
 assert.equal(strippedLabel(NaN,9),'');assert.equal(strippedLabel(0,STRIPPED.first-1),'');
});
