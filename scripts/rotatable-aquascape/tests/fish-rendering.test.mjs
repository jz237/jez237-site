import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {Tetra3D} from '../lib/Tetra3D.ts';
test('hidden fish retain their phase and resume with the same complete body and fin geometry',()=>{
 const texture=new T.Texture(),visible=new Tetra3D(texture,.37,false),hidden=new Tetra3D(texture,.37,false);
 const buffers=f=>f.group.children.filter(o=>o instanceof T.Mesh).map(o=>o.geometry.getAttribute('position'));
 const initial=buffers(hidden).map(p=>p.version);hidden.group.visible=false;
 for(let i=0;i<120;i++){const effort=.3+.2*Math.sin(i*.1);for(const fish of [visible,hidden])fish.update(i/60,effort,texture,.65,.5,1,1/60,.6);}
 assert.deepEqual(buffers(hidden).map(p=>p.version),initial);
 hidden.group.visible=true;
 for(const fish of [visible,hidden])fish.update(2,.5,texture,.65,.5,1,1/60,.6);
 buffers(hidden).forEach((p,i)=>assert.deepEqual(p.array,buffers(visible)[i].array));
 const membranes=hidden.group.children.filter(o=>o instanceof T.Mesh&&o.material.transparent);
 assert.ok(membranes.length>=5);for(const mesh of membranes){assert.equal(mesh.material.side,T.DoubleSide);assert.equal(mesh.material.forceSinglePass,true);}
 visible.dispose();hidden.dispose();texture.dispose();
});
