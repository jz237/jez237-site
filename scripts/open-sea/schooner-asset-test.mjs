import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';

const asset=new URL('../../demos/open-sea/assets/',import.meta.url);
const metadata=JSON.parse(fs.readFileSync(new URL('schooner.json',asset)));
const compressed=fs.readFileSync(new URL('schooner.bin.gz',asset)),buffer=zlib.gunzipSync(compressed);
assert.equal(metadata.version,2);assert.equal(metadata.vertexStride,44);
let vertices=0,triangles=0,occluded=0,minimumAO=1;
const regions=[];
for(const [name,g] of Object.entries(metadata.groups)){
 assert.equal(g.indexCount%3,0);assert.equal(g.vertexOffset%4,0);assert.equal(g.indexOffset%4,0);
 for(const [start,length] of [[g.vertexOffset,g.vertexCount*44],[g.indexOffset,g.indexCount*4]]){
  assert.ok(start>=0&&start+length<=buffer.length,`${name}: buffer bounds`);regions.push([start,start+length]);
 }
 const deforming=/^(sail|boom)-/.test(name);
 for(let i=0;i<g.vertexCount;i++){
  const v=Array.from({length:11},(_,k)=>buffer.readFloatLE(g.vertexOffset+i*44+k*4));
  assert.ok(v.every(Number.isFinite),`${name}: finite vertex ${i}`);
  assert.ok(Math.abs(Math.hypot(...v.slice(3,6))-1)<.003,`${name}: unit normal ${i}`);
  assert.ok(Number.isInteger(v[8])&&v[8]>=0&&v[8]<=20,`${name}: material ${i}`);
  assert.ok(v[10]>=.39999&&v[10]<=1,`${name}: ambient visibility ${i}`);
  if(deforming)assert.equal(v[10],1,`${name}: static AO must not follow moving cloth/booms`);
  if(v[10]<.98)occluded++;minimumAO=Math.min(minimumAO,v[10]);
 }
 for(let i=0;i<g.indexCount;i++)assert.ok(buffer.readUInt32LE(g.indexOffset+i*4)<g.vertexCount,`${name}: index ${i}`);
 vertices+=g.vertexCount;triangles+=g.indexCount/3;
}
regions.sort((a,b)=>a[0]-b[0]);assert.equal(regions[0][0],0);
for(let i=1;i<regions.length;i++)assert.equal(regions[i][0],regions[i-1][1],'No overlapping or unused buffer regions');
assert.equal(regions.at(-1)[1],buffer.length);assert.ok(occluded>1000,'Geometry contact shading must actually be present');
console.log(JSON.stringify({vertices,triangles,compressedBytes:compressed.length,rawBytes:buffer.length,occludedVertices:occluded,minimumAO,groups:regions.length/2},null,2));
