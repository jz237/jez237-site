import test from 'node:test';import assert from 'node:assert/strict';
import {defaultControls,readControls,drivingInput} from '../src/driving-controls';
test('reversed keyboard defaults refresh revision 10 while retaining custom controls',()=>{
 const d=defaultControls();assert.equal(d.keyboardDefaults,11);
 for(const key of ['KeyA','ArrowLeft'])assert.equal(drivingInput(d,new Set([key]),[],0).steer,1);
 for(const key of ['KeyD','ArrowRight'])assert.equal(drivingInput(d,new Set([key]),[],0).steer,-1);
 const old={...d,keyboardDefaults:10,keys:{...d.keys,left:['KeyA','ArrowLeft'],right:['KeyD','ArrowRight']},center:.2};
 const migrated=readControls(JSON.stringify(old));assert.deepEqual(migrated.keys,d.keys);assert.equal(migrated.center,.2);assert.deepEqual(readControls(JSON.stringify(migrated)),migrated);
 const custom={...old,keys:{...old.keys,left:['KeyJ'],right:['KeyL']}};assert.deepEqual(readControls(JSON.stringify(custom)).keys,custom.keys);
});
