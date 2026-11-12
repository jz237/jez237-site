// Run with the directory containing @gltf-transform/*, meshoptimizer and draco3dgltf.
// Retains authored topology, node names, materials and original fallback models.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.resolve(process.argv[2]??path.join(root,'tools/asset-optimizer'),'package.json'));
const get=async name=>import(pathToFileURL(require.resolve(name)).href);
const {NodeIO}=await get('@gltf-transform/core');
const {ALL_EXTENSIONS,EXTMeshoptCompression}=await get('@gltf-transform/extensions');
const {reorder,quantize}=await get('@gltf-transform/functions');
const {MeshoptEncoder,MeshoptDecoder}=await get('meshoptimizer');
const draco=require('draco3dgltf');
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder':await draco.createDecoderModule(),
  'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder,
});
const folder=path.join(root,'public/models/packed');
const previous=JSON.parse(await fs.readFile(path.join(root,'src/packed-models.json'),'utf8'));
const names=['fir-medium-a','fir-medium-b','fir-medium-c','quarry-north-fir-0','quarry-north-fir-1','quarry-north-fir-2'];
const output={},report=[];
for(const name of names){
  const doc=await io.read(path.join(root,'public/models',name+'.glb'));
  const before=doc.getRoot().listMeshes().map(m=>({name:m.getName(),triangles:m.listPrimitives().reduce((n,p)=>n+(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3,0)}));
  // Keep shared embedded texture bytes at their existing content-addressed paths.
  for(const texture of doc.getRoot().listTextures()){
    const bytes=texture.getImage();
    const hash=createHash('sha256').update(bytes).digest('hex');
    const ext=({'image/png':'png','image/jpeg':'jpg','image/webp':'webp'})[texture.getMimeType()];
    assert(ext,'Supported authored texture');
    const uri='textures/'+hash.slice(0,24)+'.'+ext;
    await fs.mkdir(path.join(folder,'textures'),{recursive:true});
    await fs.writeFile(path.join(folder,uri),bytes);
    texture.setURI(uri);
  }
  for(const extension of doc.getRoot().listExtensionsUsed())if(extension.extensionName==='KHR_draco_mesh_compression')extension.dispose();
  // 16-bit positions keep sub-millimetre precision on these tree-sized meshes.
  // No simplification: retain every triangle, branch, needle and LOD.
  await doc.transform(reorder({encoder:MeshoptEncoder}),quantize({quantizePosition:16,quantizeNormal:12,quantizeTexcoord:14,quantizeColor:12}));
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.QUANTIZE});
  const jsonDoc=await io.writeJSON(doc);
  const decoded=await io.readJSON(jsonDoc);
  const after=decoded.getRoot().listMeshes().map(m=>({name:m.getName(),triangles:m.listPrimitives().reduce((n,p)=>n+(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3,0)}));
  assert.deepEqual(after,before,'Mesh names and triangle counts must survive encoding');
  const json=jsonDoc.json,resource=json.buffers[0].uri,bin=Buffer.from(jsonDoc.resources[resource]);
  delete json.buffers[0].uri;
  let body=Buffer.from(JSON.stringify(json));body=Buffer.concat([body,Buffer.alloc((4-body.length%4)%4,32)]);
  const binary=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);
  const head=Buffer.alloc(20);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+body.length+binary.length,8);head.writeUInt32LE(body.length,12);head.writeUInt32LE(0x4e4f534a,16);
  const binHead=Buffer.alloc(8);binHead.writeUInt32LE(binary.length);binHead.writeUInt32LE(0x004e4942,4);
  const bytes=gzipSync(Buffer.concat([head,body,binHead,binary]),{level:9});
  const file=name+'-meshopt-'+createHash('sha256').update(bytes).digest('hex').slice(0,12)+'.glb.gz';
  const previousBytes=(await fs.stat(path.join(folder,previous[name+'.glb']))).size;
  if(bytes.length<previousBytes){await fs.writeFile(path.join(folder,file),bytes);output[name+'.glb']=file;}
  report.push({name,previousBytes,bytes:Math.min(previousBytes,bytes.length),optimized:bytes.length<previousBytes,triangles:before.reduce((n,m)=>n+m.triangles,0)});
  console.log(JSON.stringify(report.at(-1)));
}
await fs.writeFile(path.join(root,'src/optimized-models.json'),JSON.stringify(output,null,2)+'\n');
await fs.writeFile(path.join(root,'source/loading-models.json'),JSON.stringify({method:'Meshopt with 16-bit positions, 12-bit normals, 14-bit UVs; no triangle reduction; original assets retained',models:report},null,2)+'\n');
