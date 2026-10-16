import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultControls,readControls,drivingInput} from '../src/driving-controls';
test('fresh and previously saved standard controls use reversed keyboard steering',()=>{
 for(const revision of [undefined,10,11,12]){
  const saved={...defaultControls(),keyboardDefaults:revision,deadzone:.25,keys:{...defaultControls().keys,left:['KeyA','ArrowLeft'],right:['KeyD','ArrowRight']}};
  const c=readControls(JSON.stringify(saved));
  assert.equal(c.keyboardDefaults,13);assert.equal(c.deadzone,.25);
  for(const key of ['KeyA','ArrowLeft'])assert.equal(drivingInput(c,new Set([key]),[],0).steer,1);
  for(const key of ['KeyD','ArrowRight'])assert.equal(drivingInput(c,new Set([key]),[],0).steer,-1);
  assert.deepEqual(readControls(JSON.stringify(c)),c);
 }
 assert.deepEqual(readControls().keys,defaultControls().keys);
});
test('custom bindings and subsequent explicit remapping remain intact',()=>{
 const custom=defaultControls();custom.keys.left=['KeyJ'];custom.keys.right=['KeyL'];
 assert.deepEqual(readControls(JSON.stringify({...custom,keyboardDefaults:11})).keys,custom.keys);
 const intentional=defaultControls();intentional.keys.left=['KeyA','ArrowLeft'];intentional.keys.right=['KeyD','ArrowRight'];
 assert.deepEqual(readControls(JSON.stringify(intentional)).keys,intentional.keys);
});
