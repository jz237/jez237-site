import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {FeedingBite} from '../lib/FeedingBite.ts';import {Tetra3D} from '../lib/Tetra3D.ts';import {CoryModels} from '../lib/CoryModels.ts';import {AngelfishModel} from '../lib/AngelfishModel.ts';
test('a bite is a single visible pulse, freezes on pause and returns to ordinary breathing',()=>{
 const pulse=new FeedingBite();pulse.update(1);assert.equal(pulse.value,0);pulse.trigger();pulse.update(.05);assert.equal(pulse.value,1);pulse.update(0);assert.equal(pulse.value,1);pulse.update(.14);assert.ok(pulse.value>0&&pulse.value<1);pulse.update(.3);assert.equal(pulse.value,0);
 const texture=new T.Texture(),tetra=new Tetra3D(texture,0,false);tetra.bite();tetra.update(0,.2,texture,0,0,1,.016);assert.ok(tetra.lastPose[5]>2);const held=tetra.meshes[0].geometry.attributes.position.array.slice();tetra.update(0,.2,texture,0,0,1,0);assert.deepEqual(tetra.meshes[0].geometry.attributes.position.array,held);tetra.update(1,.2,texture,0,0,1,.5);assert.ok(tetra.lastPose[5]<=1);
 const angel=new AngelfishModel(new T.Group());angel.bite();angel.update(.016,.2);assert.ok(angel.uniforms.angelMouth.value>2);angel.update(.5,.2);assert.ok(angel.uniforms.angelMouth.value<=1);
 const cory=new CoryModels(2);cory.pose(0,new T.Vector3(),0,0,.568,0,0,0);cory.bite(0);cory.pose(0,new T.Vector3(),0,0,.568,0,0,.016);assert.ok(cory.respiration.getY(0)>3);assert.ok(cory.respiration.getY(1)<=1);cory.pose(0,new T.Vector3(),0,0,.568,0,0,1);assert.ok(cory.respiration.getY(0)<=1);
});

test('angelfish open before contact, close after the confirmed bite, and freeze on pause',()=>{
 const angel=new AngelfishModel(new T.Group());
 angel.update(.016,.2,false,0,.12,1);assert.equal(angel.uniforms.angelMouth.value,2.4);
 angel.update(0,.2,false,0,.12,0);assert.equal(angel.uniforms.angelMouth.value,2.4);
 angel.bite();angel.update(.05,.2,true);assert.equal(angel.uniforms.angelMouth.value,2.4);
 angel.update(.5,.2,true);assert.ok(angel.uniforms.angelMouth.value<=1);
});
