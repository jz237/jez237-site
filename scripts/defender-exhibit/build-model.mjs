import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {mkdirSync,writeFileSync} from 'node:fs';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS,EXTMeshoptCompression} from '@gltf-transform/extensions';
import {dedup,weld,reorder} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';
import {buildDetailedCabinet} from './model-detail.mjs';
globalThis.FileReader=class {readAsArrayBuffer(b){b.arrayBuffer().then(x=>{this.result=x;this.onloadend?.();});} readAsDataURL(b){b.arrayBuffer().then(x=>{this.result='data:application/octet-stream;base64,'+Buffer.from(x).toString('base64');this.onloadend?.();});}};
for(const robotron of [false,true]){
const root=buildDetailedCabinet(robotron);
mkdirSync('public',{recursive:true});
const glb=await new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true});
await MeshoptEncoder.ready;await MeshoptDecoder.ready;const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});const doc=await io.readBinary(new Uint8Array(glb));await doc.transform(dedup(),weld(),reorder({encoder:MeshoptEncoder,target:'size'}));doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.FILTER});const optimized=await io.writeBinary(doc);writeFileSync(robotron?'public/robotron-cabinet.glb':'public/cabinet.glb',optimized);
let meshes=0,triangles=0;root.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;}});
console.log(JSON.stringify({bytes:optimized.byteLength,uncompressedBytes:glb.byteLength,assemblies:root.children.length,meshes,triangles}));

}
