import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import * as T from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export async function auditEastBayNormals(){
 const root=fileURLToPath(new URL('../',import.meta.url)),read=(f:string)=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
 const source=read('source/models/quarry-east-bay-apron-normals.json'),base=read('source/models/quarry-east-bay-base.json'),key=(p:number[])=>p.map(Math.fround).join(',');
 const target=new Map<string,number[]>();for(let c=1;c<30;c++)target.set(key(base.rows[6][c].p),source.bands[5][c][1]);
 const bytes=fs.readFileSync(path.join(root,'public/models/quarry-east-bay.glb')),gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');
 const groups=new Map<string,{normal:number[];mesh:string}[]>();let sourceError=0,worstSource:any,spread=0,worstSpread:any,count=0;
 try{gltf.scene.traverse(o=>{if(!(o instanceof T.Mesh)||!/^EastBayRock_[0-2]_(near|far)$/.test(o.name))return;const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;
 for(let i=0;i<p.count;i++){const point=[p.getX(i),p.getY(i),p.getZ(i)],k=key(point),expected=target.get(k);if(!expected)continue;const normal=[n.getX(i),n.getY(i),n.getZ(i)],delta=Math.hypot(...normal.map((v,j)=>v-expected[j]));count++;
 if(delta>sourceError){sourceError=delta;worstSource={point,mesh:o.name,normal,expected};}const a=groups.get(k)??[];a.push({normal,mesh:o.name});groups.set(k,a);
 }});
 for(const [point,entries]of groups)for(let a=0;a<entries.length;a++)for(let b=a+1;b<entries.length;b++){const delta=Math.hypot(...entries[a].normal.map((v,j)=>v-entries[b].normal[j]));if(delta>spread){spread=delta;worstSpread={point,a:entries[a],b:entries[b]};}}
 return {samples:count,points:groups.size,sourceMaximumVectorError:sourceError,sourceMaximumAngleDegrees:2*Math.asin(sourceError/2)*180/Math.PI,incidentMaximumVectorDifference:spread,incidentMaximumAngleDegrees:2*Math.asin(spread/2)*180/Math.PI,worstSource,worstSpread};
 }finally{gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const result=await auditEastBayNormals();const output=process.argv[2]??'outputs/east-bay/candidate3-normal-audit.json';fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}
