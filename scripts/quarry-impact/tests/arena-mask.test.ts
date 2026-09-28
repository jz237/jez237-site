import test from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import * as T from 'three';
import { arenaRead } from '../tools/arena-floor-audit';
import { ARENA_MASK_SIZE, ARENA_MASK_BOUNDS, ARENA_MASK_CHANNELS, ARENA_MASK_PATH, loadArenaFloorMask } from '../src/scenery-arena-mask';

const base=JSON.parse(arenaRead('source/arena-floor-base.json').toString());
const water=base.puddles.filter((p:any)=>p.kind==='water').map((p:any)=>{
  const polygon=p.rings.at(-1).points.map((v:number[])=>[v[0],v[2]]) as number[][];
  return {id:p.id,polygon,center:[p.matrix[12],p.matrix[14]],bounds:[Math.min(...polygon.map(p=>p[0])),Math.min(...polygon.map(p=>p[1])),Math.max(...polygon.map(p=>p[0])),Math.max(...polygon.map(p=>p[1]))]};
});
function signedDistance(x:number,z:number,polygon:number[][]){
  let inside=false,distance=Infinity;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const a=polygon[j],b=polygon[i],dx=b[0]-a[0],dz=b[1]-a[1],length=dx*dx+dz*dz;
    if(length){const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/length));distance=Math.min(distance,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t));}
    if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
  }
  return inside?-distance:distance;
}
function sampler(bytes:Uint8Array){
  const size=ARENA_MASK_SIZE,[minX,minZ,maxX,maxZ]=ARENA_MASK_BOUNDS;
  return (x:number,z:number,channel=3)=>{
    // WebGL linear sampling uses texel centres, not pixel corner coordinates.
    const fx=(x-minX)/(maxX-minX)*size-.5,fy=(z-minZ)/(maxZ-minZ)*size-.5,ix=Math.floor(fx),iy=Math.floor(fy),u=fx-ix,v=fy-iy;
    const pixel=(px:number,py:number)=>bytes[(Math.max(0,Math.min(size-1,py))*size+Math.max(0,Math.min(size-1,px)))*4+channel]/255;
    return (pixel(ix,iy)*(1-u)+pixel(ix+1,iy)*u)*(1-v)+(pixel(ix,iy+1)*(1-u)+pixel(ix+1,iy+1)*u)*v;
  };
}

test('arena mask is registered to the twelve actual puddle polygons rather than mirrored or idealized ellipses',()=>{
  const bytes=gunzipSync(arenaRead('public/'+ARENA_MASK_PATH));
  assert.equal(bytes.length,1024*1024*4);assert.equal(ARENA_MASK_SIZE,1024);assert.deepEqual(ARENA_MASK_BOUNDS,[-48,-48,48,48]);
  assert.deepEqual(ARENA_MASK_CHANNELS,['compaction','fineSediment','looseAggregate','wetness']);
  const sample=sampler(bytes);assert.equal(water.length,12);let shores=0,exteriorChecks=0;
  for(const p of water){
    assert.ok(signedDistance(p.center[0],p.center[1],p.polygon)<-.5);
    assert.ok(sample(p.center[0],p.center[1])>=.8,`puddle${p.id} interior must be wet at its actual world position`);
    for(let i=0;i<p.polygon.length-1;i+=12){
      const [x,z]=p.polygon[i];
      // Another overlapping puddle can make this point interior to the union.
      if(water.some(q=>q!==p&&signedDistance(x,z,q.polygon)<-.1))continue;
      const wet=sample(x,z);assert.ok(wet>=.45&&wet<=.84,`puddle${p.id} actual shoreline sample ${i}=${wet}`);shores++;
    }
  }
  assert.ok(shores>=120,'sample all irregular shores, not just central metadata points');
  for(let x=-43;x<=43;x+=1.1)for(let z=-43;z<=43;z+=1.1){
    if(Math.hypot(x,z)>44)continue;
    const nearby=water.filter(p=>x>=p.bounds[0]-1.3&&x<=p.bounds[2]+1.3&&z>=p.bounds[1]-1.3&&z<=p.bounds[3]+1.3);
    if(nearby.every(p=>signedDistance(x,z,p.polygon)>1.3)){
      assert.ok(sample(x,z)<=1/255,'wetness cannot appear beyond the bounded actual puddle margin');exteriorChecks++;
    }
  }
  assert.ok(exteriorChecks>2500);
  for(let i=0;i<360;i++)for(const r of [45,47])for(let c=0;c<4;c++)assert.ok(sample(Math.cos(i*Math.PI/180)*r,Math.sin(i*Math.PI/180)*r,c)<=1/255,'mask must fade to unchanged material before the circle boundary');
});

test('actual mask loader retries failures and shares one linear correctly oriented local DataTexture',async()=>{
  const original=globalThis.fetch,gzip=arenaRead('public/'+ARENA_MASK_PATH),decoded=gunzipSync(gzip);let requests=0;
  globalThis.fetch=async input=>{
    assert.ok(String(input).endsWith(ARENA_MASK_PATH),'mask must come from the bundled local asset path');requests++;
    return requests===1?new Response('not available',{status:404}):new Response(new Uint8Array(gzip),{status:200});
  };
  let texture:T.DataTexture|undefined;
  try{
    await assert.rejects(loadArenaFloorMask(),/404/);
    const first=loadArenaFloorMask(),second=loadArenaFloorMask();assert.equal(first,second,'parallel callers share the same decoding promise');texture=await first;
    assert.equal(await loadArenaFloorMask(),texture);assert.equal(requests,2);
    assert.equal(texture.image.width,1024);assert.equal(texture.image.height,1024);assert.deepEqual(new Uint8Array(texture.image.data.buffer),new Uint8Array(decoded));
    assert.equal(texture.flipY,false);assert.equal(texture.colorSpace,T.NoColorSpace);assert.equal(texture.format,T.RGBAFormat);assert.equal(texture.type,T.UnsignedByteType);
    assert.equal(texture.wrapS,T.ClampToEdgeWrapping);assert.equal(texture.wrapT,T.ClampToEdgeWrapping);assert.equal(texture.magFilter,T.LinearFilter);assert.equal(texture.minFilter,T.LinearMipmapLinearFilter);assert.equal(texture.generateMipmaps,true);
  }finally{globalThis.fetch=original;texture?.dispose();}
});
