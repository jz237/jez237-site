import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {shrimpCarapace,shrimpPlate,snailBody,ramshornShell,shrimpFan,fanRays,shrimpRostrum} from '../lib/GrazerGeometry.ts';
import {grazerMaterials} from '../lib/GrazerMaterials.ts';

test('sculpted grazer surfaces have finite normals, outward skin and a contacting snail sole',()=>{
 for(const make of [shrimpCarapace,shrimpPlate,snailBody,ramshornShell,shrimpFan,fanRays,shrimpRostrum]){
  const g=make(),p=g.getAttribute('position'),n=g.getAttribute('normal');assert.ok(Array.from(p.array).every(Number.isFinite));assert.ok(Array.from(n.array).every(Number.isFinite));
  if([shrimpCarapace,shrimpPlate,snailBody].includes(make)){
   let volume=0;const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();for(let i=0;i<g.index.count;i+=3){a.fromBufferAttribute(p,g.index.getX(i));b.fromBufferAttribute(p,g.index.getX(i+1));c.fromBufferAttribute(p,g.index.getX(i+2));volume+=a.dot(b.cross(c))/6;}assert.ok(volume>0,'outward closed body');
  }
  if(make===snailBody){g.computeBoundingBox();assert.equal(g.boundingBox.min.y,0);assert.ok(g.boundingBox.max.y>.1);}
  g.dispose();
 }
});
test('generated atlas panels stay separate and membrane detail keeps a single thin-surface pass',()=>{
 const atlas=new T.Texture(),materials=grazerMaterials(atlas);
 for(const [material,column] of [[materials.shell,0],[materials.skin,1],[materials.flesh,2]]){
  const map=material.map;assert.equal(map.source,atlas.source);assert.equal(map.colorSpace,T.SRGBColorSpace);assert.ok(map.offset.x>column/3);assert.ok(map.offset.x+map.repeat.x<(column+1)/3);assert.equal(material.bumpMap.colorSpace,T.NoColorSpace);
 }
 assert.equal(materials.membrane.forceSinglePass,true);assert.equal(materials.membrane.side,T.DoubleSide);assert.ok(materials.membrane.opacity<.7);
 materials.textures.forEach(t=>t.dispose());for(const m of Object.values(materials))if(m instanceof T.Material)m.dispose();
});
