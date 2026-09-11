import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const root=new URL('../',import.meta.url);
const metadata=JSON.parse(readFileSync(new URL('public/lighting/diffuse-probes.json',root),'utf8'));
const binary=readFileSync(new URL('public/lighting/diffuse-probes.bin',root));
const hash=value=>createHash('sha256').update(value).digest('hex');

test('indirect-light field matches the geometry/material sources used to bake it',()=>{
 assert.equal(metadata.version,1);
 assert.ok(Object.keys(metadata.sourceHashes).length>=6);
 for(const [file,expected] of Object.entries(metadata.sourceHashes)){
  const current=readFileSync(new URL(file,root),'utf8').replaceAll('\r\n','\n');
  assert.equal(hash(current),expected,`${file} changed: re-export and bake indirect lighting`);
 }
 assert.equal(hash(binary),metadata.binarySHA256);
});

test('packed directional field contains finite spatially varying irradiance',()=>{
 const [nx,ny,nz]=metadata.dimensions;
 assert.ok([nx,ny,nz].every(n=>Number.isInteger(n)&&n>1&&n<128));
 assert.equal(binary.length,nx*ny*nz*4*4*4);
 assert.equal(binary.length,metadata.bytes);
 let minimum=Infinity,maximum=-Infinity;
 for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx*4;x++){
  const base=((z*ny+y)*nx*4+x)*16;
  for(let c=0;c<3;c++){
   const value=binary.readFloatLE(base+c*4);assert.ok(Number.isFinite(value));
   if(x<nx){assert.ok(value>=0);minimum=Math.min(minimum,value);maximum=Math.max(maximum,value);}
  }
  assert.equal(binary.readFloatLE(base+12),0);
 }
 assert.ok(maximum-minimum>.05,'field must contain calculated spatial variation');
});
