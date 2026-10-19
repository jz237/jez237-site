import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeEffectPresentation as prepare} from '../native-effect-presentation.js';
const fixture=name=>JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/'+name+'.json.gz',import.meta.url))));
const hash=a=>createHash('sha256').update(Buffer.from(a)).digest('hex');
const blank=()=>[Array(0xb2f0).fill(0),Array(0xb2f0).fill(0)];
const rendererOps=ops=>ops.filter(o=>o.kind.startsWith('presentation')&&!['presentationEffectWrite','presentationEffectControlWrite'].includes(o.kind));
const material=[{kind:'presentationEffectPipeline',mode:'surface'},{kind:'presentationEffectColor',rgba:[64,128,255,3]},{kind:'presentationEffectTexture',family:'spray',textureFrame:2}];

test('initializer retains untouched graphics bytes and installs original texture coordinates in both buffers',()=>{
 const e=fixture('native-presentation-effects-initialization');
 for(const c of e.cases){const q=prepare([e.baseGraphicsBytes,e.baseGraphicsBytes],rendererOps(c.operations),{worldScale:.01});assert.deepEqual(q.graphicsBuffers.map(hash),c.graphicsSHA256);assert.deepEqual(q.draws,[]);}
});

test('retained byte consumer matches both complete original frame buffers, including twenty carried frames',()=>{
 const e=fixture('native-presentation-effects-frame');let previous;
 for(const [i,c]of e.cases.entries()){
  const buffers=i>64?previous.graphicsBuffers:c.baseGraphicsBytes,before=structuredClone(buffers);
  previous=prepare(buffers,rendererOps(c.operations),{worldScale:.01});
  assert.deepEqual(previous.graphicsBuffers.map(hash),c.graphicsSHA256,'case '+i);assert.deepEqual(previous.draws,[]);assert.deepEqual(buffers,before);
 }
});

test('whole display consumer preserves original matrix regions and every ordered texture, primitive and depth mode',()=>{
 const e=fixture('native-presentation-effects-display');
 for(const [i,c]of e.cases.entries()){
  const q=prepare([e.baseGraphicsBytes,e.baseGraphicsBytes],rendererOps(c.operations),{worldScale:.01});
  assert.deepEqual(q.graphicsBuffers.map(b=>hash(b.slice(0x4140))),c.matrixRegionSHA256,'case '+i);
  let family,textureFrame,depthTest;const expected=[];
  for(const o of c.operations){
   if(o.kind==='presentationEffectPipeline')depthTest=o.mode==='surface';
   if(o.kind==='presentationEffectTexture')({family,textureFrame}=o);
   if(o.kind==='presentationEffectPrimitive')expected.push({family,textureFrame,depthTest,vertices:o.indices.length===3?3:6});
   if(o.kind==='presentationTransientDraw')expected.push({family:'splash',textureFrame:o.textureFrame,depthTest:true,vertices:6});
  }
  assert.deepEqual(q.draws.map(d=>({family:d.family,textureFrame:d.textureFrame,depthTest:d.depthTest,vertices:d.positions.length/3})),expected);
  assert.equal(q.diagnostic.triangles,expected.reduce((n,d)=>n+d.vertices/3,0));assert.equal(q.diagnostic.graphicsExecuted,false);
 }
});

test('signed vertices, half-scale UVs, environment RGB and shade alpha survive without vertex RGB contamination',()=>{
 const a=blank(),b=Buffer.alloc(48),positions=[[-300,20,11],[52,-74,6],[4,31,-92]],st=[[0,0],[2048,0],[0,4096]];
 positions.forEach((p,i)=>{p.forEach((v,j)=>b.writeInt16BE(v,i*16+j*2));st[i].forEach((v,j)=>b.writeInt16BE(v,i*16+8+j*2));b[i*16+12]=231;b[i*16+15]=[255,128,0][i];});a[1].splice(0x91c0,48,...b);
 const ops=[...material,{kind:'presentationEffectTexture',family:'wake',textureFrame:3},{kind:'presentationEffectVertices',bufferIndex:1,byteOffset:0x91c0,vertexCount:3},{kind:'presentationEffectPrimitive',indices:[0,1,2]}];
 const q=prepare(a,ops,{worldScale:.5}),d=q.draws[0];
 assert.deepEqual(d.positions,positions.flat().map(v=>v*.5));assert.deepEqual(d.uvs,[0,1,1,1,0,0]);assert.deepEqual(d.colors,[64/255,128/255,1,64/255,128/255,1,64/255,128/255,1]);assert.deepEqual(d.alphas,[1,128/255,0]);
 assert.ok(Object.isFrozen(q.draws[0].positions));assert.notEqual(q.graphicsBuffers[1],a[1]);
});

test('transient load then scale uses retained packed matrices, including unwritten coincident-camera matrices',()=>{
 const e=fixture('native-transient-display');
 for(const c of e.cases){
  const q=prepare([e.baseGraphicsBytes,e.baseGraphicsBytes],rendererOps(c.operations),{worldScale:.125});
  assert.deepEqual(q.graphicsBuffers.map(hash),c.graphicsSHA256);
  let load,scale,drawIndex=0;
  function matrix(o){const b=Buffer.from(q.graphicsBuffers[o.bufferIndex]),at=0x4140+o.matrixIndex*64;return Array.from({length:16},(_,i)=>Math.fround(b.readInt16BE(at+i*2)+b.readUInt16BE(at+32+i*2)/65536));}
  for(const o of c.operations){
   if(o.kind==='presentationSceneMatrixBind'){if(o.mode==='load')load=matrix(o);else scale=matrix(o);}
   if(o.kind!=='presentationTransientDraw')continue;
   const vertices=[[-16,16,0],[-16,-16,0],[16,-16,0],[-16,16,0],[16,-16,0],[16,16,0]],expected=[];
   for(const p of vertices){const v=[...p,1],scaled=Array.from({length:4},(_,r)=>v.reduce((n,x,j)=>n+x*scale[j*4+r],0));for(let r=0;r<3;r++)expected.push(scaled.reduce((n,x,j)=>n+x*load[j*4+r],0)*.125);}
   const d=q.draws[drawIndex++];d.positions.forEach((v,i)=>assert.ok(Math.abs(v-expected[i])<=Math.max(1,Math.abs(v))*1e-12));
  }
  assert.equal(drawIndex,q.draws.length);
 }
});

test('late malformed renderer data leaves retained buffers and operations unchanged',()=>{
 const buffers=blank(),write={kind:'presentationEffectVertexWrite',bufferIndex:0,byteOffset:0x51c0,width:2,value:123},before=structuredClone(buffers);
 for(const bad of [
  {kind:'presentationEffectVertexWrite',bufferIndex:1,byteOffset:0xb2f0,width:2,value:0},
  {kind:'presentationSceneMatrixWrite',bufferIndex:0,matrixIndex:0,byteOffset:1,width:2,value:0},
  {kind:'presentationEffectTexture',family:'wake',textureFrame:4},
  {kind:'presentationEffectVertices',bufferIndex:0,byteOffset:0xb2e0,vertexCount:2},
  {kind:'presentationEffectPrimitive',indices:[0,1,2]},
  {kind:'presentationEffectListBegin',bufferIndex:0,byteOffset:0},
  {kind:'sourceWordWrite',field:'matrixCountE950',value:0}
 ]){const ops=[write,bad],saved=structuredClone(ops);assert.throws(()=>prepare(buffers,ops,{worldScale:1}));assert.deepEqual(buffers,before);assert.deepEqual(ops,saved);}
});
