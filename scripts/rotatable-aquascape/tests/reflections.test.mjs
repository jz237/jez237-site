import test from 'node:test';
import assert from 'node:assert/strict';
import {PlaneGeometry} from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReflectionPool} from '../lib/ReflectionPool.ts';

const mirror=()=>new Reflector(new PlaneGeometry(1,1),{textureWidth:16,textureHeight:16});
const dispose=surface=>{surface.geometry.dispose();surface.dispose();};

test('mutually visible mirrors capture once each without recursively rendering the scene',()=>{
 const pool=new ReflectionPool(),a=mirror(),b=mirror(),captures=[];
 a.onBeforeRender=()=>{captures.push('a');b.onBeforeRender();};
 b.onBeforeRender=()=>{captures.push('b');a.onBeforeRender();};
 pool.add(a);pool.add(b);
 a.onBeforeRender();b.onBeforeRender();
 assert.deepEqual(captures,['a','b']);
 dispose(a);dispose(b);
});

test('a failed reflection capture does not leave the other mirrors permanently frozen',()=>{
 const pool=new ReflectionPool(),a=mirror(),b=mirror();let captures=0;
 a.onBeforeRender=()=>{throw new Error('capture failure');};
 b.onBeforeRender=()=>{captures++;};
 pool.add(a);pool.add(b);
 assert.throws(()=>a.onBeforeRender(),/capture failure/);
 b.onBeforeRender();assert.equal(captures,1);
 dispose(a);dispose(b);
});
