import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('bundled moss shoots have intact source maps and finite nonzero height for placement',()=>{
 const root=new URL('../public/models/moss_01/',import.meta.url);
 const provenance=JSON.parse(readFileSync(new URL('PROVENANCE.json',root),'utf8'));
 for(const file of provenance.files){const bytes=readFileSync(new URL(file.path,root));assert.equal(bytes.length,file.bytes);assert.equal(createHash('md5').update(bytes).digest('hex'),file.md5);}
 const gltf=JSON.parse(readFileSync(new URL('moss_01_2k.gltf',root),'utf8'));
 const buffer=readFileSync(new URL(gltf.buffers[0].uri,root));assert.ok(gltf.meshes.length>=8);
 for(const mesh of gltf.meshes)for(const primitive of mesh.primitives){
  const accessor=gltf.accessors[primitive.attributes.POSITION],view=gltf.bufferViews[accessor.bufferView];
  assert.equal(accessor.componentType,5126);assert.equal(accessor.type,'VEC3');
  const stride=view.byteStride??12,offset=(view.byteOffset??0)+(accessor.byteOffset??0);
  let low=Infinity,high=-Infinity;
  for(let i=0;i<accessor.count;i++)for(let axis=0;axis<3;axis++){
   const value=buffer.readFloatLE(offset+i*stride+axis*4);assert.ok(Number.isFinite(value));if(axis===1){low=Math.min(low,value);high=Math.max(high,value);}
  }
  assert.ok(high-low>1e-5,'normalizing a shoot must not divide by zero');
 }
 const alpha=readFileSync(new URL('textures/moss_01_alpha_2k.png',root));
 assert.equal(alpha.subarray(1,4).toString(),'PNG');assert.equal(alpha.readUInt32BE(16),2048);assert.equal(alpha.readUInt32BE(20),2048);
});
