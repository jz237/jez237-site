// Read-only asset audit. Usage: node tools/quarry-cut-asset-audit.mjs after-final
// QUARRY_CUT_OUTPUT chooses the report root (default outputs/quarry-cut).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const phase=process.argv[2] || process.env.QUARRY_CUT_PHASE || 'current';
assert.match(phase,/^[a-z0-9][a-z0-9_-]*$/i);
const output=path.resolve(root,process.env.QUARRY_CUT_OUTPUT || 'outputs/quarry-cut',phase,'asset-audit.json');
const tolerance=.0001; // 0.1 mm: catches the prototype's 48 mm mixed-LOD crack.
const report={phase,file:'public/models/quarry-cut.glb',toleranceMetres:tolerance,meshes:[],perimeters:[],joins:[],bounds:[],errors:[]};
const check=(condition,message)=>{if(!condition)report.errors.push(message);};
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const radial=p=>Math.hypot(p[0]/1.08,p[2]);
const unique=rows=>[...new Map(rows.map(p=>[p.join(','),p])).values()];
const nearestDistance=(p,rows)=>rows.reduce((min,q)=>Math.min(min,distance(p,q)),Infinity);
const pointSetGap=(a,b)=>Math.max(...a.map(p=>nearestDistance(p,b)));
function segmentDistance(p,a,b){
  const d=b.map((v,i)=>v-a[i]),den=d.reduce((sum,v)=>sum+v*v,0);
  const t=den?Math.max(0,Math.min(1,d.reduce((sum,v,i)=>sum+(p[i]-a[i])*v,0)/den)):0;
  return distance(p,a.map((v,i)=>v+d[i]*t));
}
function polylineGap(a,b){
  return Math.max(...a.map(p=>b.slice(1).reduce((min,v,i)=>Math.min(min,segmentDistance(p,b[i],v)),Infinity)));
}
function bounds(points){
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(const p of points)for(let i=0;i<3;i++){min[i]=Math.min(min[i],p[i]);max[i]=Math.max(max[i],p[i]);}
  return {min,max};
}

try {
  const data=await fs.readFile(path.join(root,report.file));
  report.bytes=data.length;report.sha256=createHash('sha256').update(data).digest('hex');
  assert.equal(data.readUInt32LE(0),0x46546c67,'GLB header');
  assert.equal(data.readUInt32LE(4),2,'GLB version');
  assert.equal(data.readUInt32LE(8),data.length,'GLB total length');
  let gltf,binary;
  for(let offset=12;offset<data.length;){
    const size=data.readUInt32LE(offset),type=data.readUInt32LE(offset+4);
    const payload=data.subarray(offset+8,offset+8+size);
    if(type===0x4e4f534a)gltf=JSON.parse(payload.toString());
    if(type===0x004e4942)binary=payload;
    offset+=size+8;
  }
  assert.ok(gltf&&binary,'JSON and BIN chunks required');
  const formats={5120:[1,'readInt8'],5121:[1,'readUInt8'],5122:[2,'readInt16LE'],5123:[2,'readUInt16LE'],5125:[4,'readUInt32LE'],5126:[4,'readFloatLE']};
  const widths={SCALAR:1,VEC2:2,VEC3:3,VEC4:4};
  function accessor(index){
    const a=gltf.accessors[index],view=gltf.bufferViews[a.bufferView];
    assert.ok(!a.sparse,'Sparse accessors unsupported by this exporter audit');
    const [size,method]=formats[a.componentType] || [],width=widths[a.type];
    assert.ok(size&&width,'Supported accessor format required');
    const offset=(view.byteOffset||0)+(a.byteOffset||0),stride=view.byteStride||size*width;
    const rows=Array.from({length:a.count},(_,i)=>Array.from({length:width},(_,j)=>binary[method](offset+i*stride+j*size)));
    assert.ok(rows.every(row=>row.every(Number.isFinite)),`Nonfinite accessor ${index}`);
    return rows;
  }
  report.meshNodes=gltf.nodes.filter(n=>n.mesh!==undefined).length;
  report.totalNodes=gltf.nodes.length;report.materials=gltf.materials?.length||0;
  report.images=gltf.images?.length||0;report.textures=gltf.textures?.length||0;
  check(report.meshNodes===12,`Expected 12 mesh nodes, found ${report.meshNodes}`);
  check(report.materials===2,`Expected two material groups, found ${report.materials}`);
  check(report.images===0&&report.textures===0,'Cut asset must reuse runtime maps without embedding textures');
  const meshes=new Map(),groups=new Map();
  for(const node of gltf.nodes){
    for(const [key,identity] of Object.entries({translation:[0,0,0],scale:[1,1,1],rotation:[0,0,0,1],matrix:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]})){
      const actual=node[key]||identity;
      check(actual.length===identity.length&&actual.every((v,i)=>Math.abs(v-identity[i])<1e-7),`${node.name}: nonidentity ${key}`);
    }
    if(node.mesh===undefined)continue;
    const match=/^Cut(Rock|Rubble)_([0-2])_(near|far)$/.exec(node.name);
    assert.ok(match,`Unexpected node ${node.name}`);
    assert.ok(!meshes.has(node.name),`Duplicate node ${node.name}`);
    const primitives=gltf.meshes[node.mesh].primitives;
    assert.equal(primitives.length,1,`${node.name}: one primitive/material expected`);
    const primitive=primitives[0],attributes=primitive.attributes;
    for(const key of ['POSITION','NORMAL','TEXCOORD_0','COLOR_0'])assert.ok(key in attributes,`${node.name}: missing ${key}`);
    const values=Object.fromEntries(Object.entries(attributes).map(([key,index])=>[key,accessor(index)]));
    const positions=values.POSITION,indices=accessor(primitive.indices);
    check(indices.length%3===0,`${node.name}: incomplete triangle`);
    check(indices.every(([index])=>index>=0&&index<positions.length),`${node.name}: index outside vertex array`);
    for(const key of ['NORMAL','TEXCOORD_0','COLOR_0'])check(values[key].length===positions.length,`${node.name}: mismatched ${key} count`);
    const materialGroup=`${match[2]}_${match[3]}`;
    if(!groups.has(materialGroup))groups.set(materialGroup,new Set());
    groups.get(materialGroup).add(primitive.material);
    const mesh={name:node.name,part:match[1],section:Number(match[2]),level:match[3],positions:unique(positions),values,bounds:bounds(positions)};
    meshes.set(node.name,mesh);
    report.meshes.push({name:node.name,vertices:positions.length,triangles:indices.length/3,bounds:mesh.bounds,material:primitive.material});
  }
  check(groups.size===6&&[...groups.values()].every(group=>group.size===2),'Every section/LOD must retain two material groups');
  const base=JSON.parse(await fs.readFile(path.join(root,'source/models/quarry-cut-base.json'),'utf8'));
  report.baseSha256=createHash('sha256').update(await fs.readFile(path.join(root,'source/models/quarry-cut-base.json'))).digest('hex');
  assert.equal(base.rows.length,31,'Frozen radial rows');
  assert.equal(base.rows[0].length,22,'Frozen angular columns');
  for(let section=0;section<3;section++){
    for(const level of ['near','far']){
      const mesh=meshes.get(`CutRock_${section}_${level}`);assert.ok(mesh,'Missing rock section/LOD');
      const left=section*7,right=left+7,expected=[];
      for(const row of [0,30])for(let col=left;col<=right;col++)expected.push(base.rows[row][col].p);
      if(section===0)for(let row=0;row<=30;row++)expected.push(base.rows[row][0].p);
      if(section===2)for(let row=0;row<=30;row++)expected.push(base.rows[row][21].p);
      const maximum=pointSetGap(expected,mesh.positions);
      report.perimeters.push({section,level,frozenPerimeterMaxErrorMetres:maximum});
      check(maximum<=tolerance,`Section ${section}/${level}: frozen perimeter changed ${maximum} m`);
    }
    const near=meshes.get(`CutRock_${section}_near`).bounds,far=meshes.get(`CutRock_${section}_far`).bounds;
    report.bounds.push({section,near,far,maxNearFarExtentDifference:Math.max(...['min','max'].flatMap(key=>near[key].map((v,i)=>Math.abs(v-far[key][i]))))});
  }
  function edge(section,level,angle){
    return meshes.get(`CutRock_${section}_${level}`).positions
      .filter(p=>Math.abs(Math.atan2(p[0]/1.08,p[2])*180/Math.PI-angle)<.0001)
      .sort((a,b)=>radial(a)-radial(b));
  }
  for(const [left,angle] of [[0,125],[1,132]]){
    for(const level of ['near','far']){
      const a=edge(left,level,angle),b=edge(left+1,level,angle);
      assert.ok(a.length>2&&b.length>2,`Missing ${angle}° ${level} edge`);
      const gap=Math.max(pointSetGap(a,b),pointSetGap(b,a));
      report.joins.push({angle,leftLevel:level,rightLevel:level,leftVertices:a.length,rightVertices:b.length,maxGapMetres:gap});
      check(gap<=tolerance,`${angle}° ${level}/${level} seam differs by ${gap} m`);
    }
    for(const [leftLevel,rightLevel] of [['near','far'],['far','near']]){
      const a=edge(left,leftLevel,angle),b=edge(left+1,rightLevel,angle);
      const gap=Math.max(polylineGap(a,b),polylineGap(b,a));
      report.joins.push({angle,leftLevel,rightLevel,leftVertices:a.length,rightVertices:b.length,maxGapMetres:gap});
      check(gap<=tolerance,`${angle}° ${leftLevel}/${rightLevel} can open ${gap} m during independent LOD switching`);
    }
  }
  report.triangles=Object.fromEntries(['near','far'].map(level=>[level,report.meshes.filter(m=>m.name.endsWith('_'+level)).reduce((sum,m)=>sum+m.triangles,0)]));
}catch(error){report.errors.push(String(error));}
report.passed=report.errors.length===0;
await fs.mkdir(path.dirname(output),{recursive:true});
await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,sha256:report.sha256,bytes:report.bytes,meshNodes:report.meshNodes,materials:report.materials,images:report.images,triangles:report.triangles,joins:report.joins,errors:report.errors,output},null,2));
if(!report.passed)process.exitCode=1;
