/** Deterministic development exporter. Runtime consumes only numeric geometry
 * and a lossless R-channel profile; no image loader, gzip or Three is required. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=b=>createHash('sha256').update(b).digest('hex');

export function createCircuitGripProfile(base,redMask){
  const width=2048,height=128;
  if(base.rows.length!==361||base.lane.positions.length!==722*3||redMask.length!==width*height*4)throw new Error('Unexpected frozen circuit layout/mask dimensions');
  const vertices=[];
  for(let i=0;i<722;i++){
    const x=base.lane.positions[i*3],z=base.lane.positions[i*3+2],row=base.rows[Math.floor(i/2)];
    vertices.push(x,z,Math.fround(row.s),Math.fround((x-row.center.x)*row.lateral.x+(z-row.center.z)*row.lateral.z));
  }
  const redRuns=[];let value=-1,count=0;
  for(let x=0;x<width;x++)for(let y=0;y<height;y++){
    const next=redMask[(y*width+x)*4];
    if(next===value)count++;else{if(count)redRuns.push(count,value);value=next;count=1;}
  }
  redRuns.push(count,value);
  return {version:1,segments:360,vertices,pavedCells:base.cells.filter(c=>c.asphalt&&!c.authoredGravel).map(c=>c.cell),
    mask:{width,height,lengthMetres:Math.fround(base.lengthMetres),lateralMinimum:-10,lateralMaximum:10,threshold:127.5,columnMajor:true,redRuns}};
}

export function exportCircuitGrip(projectRoot=root){
  const read=p=>fs.readFileSync(path.join(projectRoot,p));
  const basePath='source/circuit-surface-base.json',manifest=JSON.parse(read('source/circuit-surface-manifest.json'));
  const baseBytes=read(basePath),maskBytes=read(manifest.output),mask=gunzipSync(maskBytes);
  if(sha(baseBytes)!==manifest.baseSha256||sha(maskBytes)!==manifest.gzipSha256||sha(mask)!==manifest.rawSha256)throw new Error('Accepted mask/base provenance mismatch');
  const profile=createCircuitGripProfile(JSON.parse(baseBytes),mask),bytes=Buffer.from(JSON.stringify(profile)+'\n');
  const output='src/circuit-grip-profile.json';fs.writeFileSync(path.join(projectRoot,output),bytes);
  const evidence={version:1,generator:'tools/export-circuit-grip.mjs',output,bytes:bytes.length,sha256:sha(bytes),base:basePath,baseSha256:sha(baseBytes),
    mask:manifest.output,maskSha256:sha(maskBytes),rawMaskSha256:sha(mask),
    policy:'Physical asphalt is the base-resolution, bilinearly sampled authored R channel >= 0.5 inside an existing paved lane triangle. Camera mip level, shader micro-grain and G/B/A appearance do not change grip. Both U endpoints repeat; V clamps.',
    vertices:722,triangles:720,pavedCells:profile.pavedCells.length,decodedRedBytes:2048*128,runPairs:profile.mask.redRuns.length/2,
    runtime:'Synchronous numeric RLE expansion once; no image/async I/O/Three dependency. Geometry and render assets are unchanged.'};
  fs.writeFileSync(path.join(projectRoot,'source/circuit-grip-manifest.json'),JSON.stringify(evidence,null,2)+'\n');
  return evidence;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(exportCircuitGrip(),null,2));
