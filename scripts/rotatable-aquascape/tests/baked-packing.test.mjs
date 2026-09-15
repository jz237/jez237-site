import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DataUtils} from 'three';
import {packIrradiance} from '../lib/BakedFieldPacking.ts';

const meta=JSON.parse(readFileSync(new URL('../public/lighting/diffuse-probes.json',import.meta.url)));
const binary=readFileSync(new URL('../public/lighting/diffuse-probes.bin',import.meta.url));
const data=new Float32Array(binary.buffer,binary.byteOffset,binary.byteLength/4);
test('three-slab irradiance retains every original directional coefficient at identical precision',()=>{
 const [nx,ny,nz]=meta.dimensions,packed=packIrradiance(data,nx,ny,nz);
 assert.equal(packed.length,data.length*.75);
 for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)
  for(let c=0;c<3;c++)for(let k=0;k<4;k++)
   assert.equal(packed[((z*ny+y)*nx*3+c*nx+x)*4+k],DataUtils.toHalfFloat(data[((z*ny+y)*nx*4+k*nx+x)*4+c]));
 assert.throws(()=>packIrradiance(data,2,2,2),/size/);
});
test('trilinear filtering preserves irradiance between probes and at every volume boundary',()=>{
 const [nx,ny,nz]=meta.dimensions,packed=packIrradiance(data,nx,ny,nz);
 const sample=(x,y,z,c,k,original)=>{
  x=Math.max(0,Math.min(nx-1,x));y=Math.max(0,Math.min(ny-1,y));z=Math.max(0,Math.min(nz-1,z));
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);let result=0;
  for(let dz=0;dz<2;dz++)for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
   const px=Math.min(nx-1,ix+dx),py=Math.min(ny-1,iy+dy),pz=Math.min(nz-1,iz+dz);
   const weight=(dx?x-ix:1-x+ix)*(dy?y-iy:1-y+iy)*(dz?z-iz:1-z+iz);
   const bits=original?DataUtils.toHalfFloat(data[((pz*ny+py)*nx*4+k*nx+px)*4+c]):packed[((pz*ny+py)*nx*3+c*nx+px)*4+k];
   result+=DataUtils.fromHalfFloat(bits)*weight;
  }
  return result;
 };
 for(const x of [-1,0,.3,nx/2,nx-1,nx])for(const y of [0,.7,ny/2,ny])for(const z of [0,.1,nz/2,nz])
  for(let c=0;c<3;c++)for(let k=0;k<4;k++)assert.equal(sample(x,y,z,c,k,false),sample(x,y,z,c,k,true));
});
