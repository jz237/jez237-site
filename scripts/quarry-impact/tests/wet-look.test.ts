import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {applyWetLook} from '../src/wet-look';
test('rain darkens and glosses venue ground, leaves other meshes alone, and restores exactly',()=>{
 const root=new T.Group(),road=new T.Mesh(new T.PlaneGeometry(),new T.MeshStandardMaterial({color:0x808080,roughness:.95})),car=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial({color:0xff0000,roughness:.4}));
 road.name='ashcombe-lanes-v1_ground';car.name='panel_door';root.add(road,car);
 assert.equal(applyWetLook(root,true),1);const m=road.material as T.MeshStandardMaterial;assert.ok(m.roughness<.5);assert.ok(m.color.r<.5*.85);
 assert.equal((car.material as T.MeshStandardMaterial).roughness,.4);
 applyWetLook(root,true);assert.ok(Math.abs(m.roughness-.475)<1e-9,'idempotent');
 applyWetLook(root,false);assert.equal(m.roughness,.95);assert.equal(m.color.getHex(),0x808080);assert.equal(applyWetLook(undefined,true),0);
});
