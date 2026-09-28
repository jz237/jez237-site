/** Independent plane/triangle stem measurements from the shipped GLBs. No
 * renderer, image decode, Blender process or authored radius metadata is used.
 */
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { readForestFile, forestHash, decodeForestGLB } from './north-forest-edge-audit';
import { terrainGeometry } from '../src/quarry-layout';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';

type Segment=[T.Vector3,T.Vector3];
function stemSection(wood:T.Mesh[],y:number){
  const segments:Segment[]=[],a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
  for(const mesh of wood){
    const p=mesh.geometry.getAttribute('position'),index=mesh.geometry.index;
    for(let i=0;i<(index?.count??p.count);i+=3){
      for(const [k,v]of [a,b,c].entries())v.fromBufferAttribute(p,index?index.getX(i+k):i+k).applyMatrix4(mesh.matrixWorld);
      if(y<Math.min(a.y,b.y,c.y)||y>Math.max(a.y,b.y,c.y))continue;
      const points:T.Vector3[]=[];
      for(const [from,to]of [[a,b],[b,c],[c,a]])if((from.y<=y&&to.y>y)||(to.y<=y&&from.y>y))points.push(from.clone().lerp(to,(y-from.y)/(to.y-from.y)));
      if(points.length===2&&points[0].distanceToSquared(points[1])>1e-20)segments.push([points[0],points[1]]);
    }
  }
  // Weld UV/normal seams for connected cross-sections. The tolerance is one
  // micrometre in a normalized tree (~20 micrometres at runtime), not a contact allowance.
  const nodes=new Map<string,{point:T.Vector3;neighbors:Set<string>}>();
  const key=(p:T.Vector3)=>`${Math.round(p.x*1e6)},${Math.round(p.z*1e6)}`;
  for(const [a,b] of segments){const ka=key(a),kb=key(b);if(ka===kb)continue;for(const [k,p]of [[ka,a],[kb,b]] as const)if(!nodes.has(k))nodes.set(k,{point:p,neighbors:new Set()});nodes.get(ka)!.neighbors.add(kb);nodes.get(kb)!.neighbors.add(ka);}
  const seen=new Set<string>(),components:{vertices:number;center:number[];minRadius:number;maxRadius:number;closed:boolean;segments:Segment[]}[]=[];
  for(const start of nodes.keys()){
    if(seen.has(start))continue;const queue=[start],points:T.Vector3[]=[],keys=new Set<string>();let closed=true;
    while(queue.length){const at=queue.pop()!;if(seen.has(at))continue;seen.add(at);keys.add(at);const node=nodes.get(at)!;points.push(node.point);closed&&=node.neighbors.size===2;for(const next of node.neighbors)if(!seen.has(next))queue.push(next);}
    if(points.length<3)continue;
    const bounds=new T.Box3().setFromPoints(points),center=bounds.getCenter(new T.Vector3()),radii=points.map(p=>Math.hypot(p.x,p.z));
    components.push({vertices:points.length,center:[center.x,center.z],minRadius:Math.min(...radii),maxRadius:Math.max(...radii),closed,segments:segments.filter(([a,b])=>keys.has(key(a))&&keys.has(key(b)))});
  }
  components.sort((a,b)=>Math.hypot(...a.center)-Math.hypot(...b.center));
  if(!components.length)throw new Error(`No actual wood cross-section at normalizedY=${y}`);
  return {selected:components[0],componentCount:components.length};
}

export async function auditNorthTreeStems(){
  await R.init();
  const data=JSON.parse(readForestFile('src/quarry-north-forest.json').toString()),assets:any[]=[],probes:any[]=[],proxyProbes:any[]=[];
  const world=new R.World({x:0,y:0,z:0});
  const terrain=createSurfaceSampler(terrainGeometry());
  try{
  for(const variant of [0,1,2]){
    const file=`public/models/quarry-north-fir-${variant}.glb`,bytes=readForestFile(file);
    if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length)throw new Error(`Invalid GLB container ${file}`);
    const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString('utf8'));
    const loader=new GLTFLoader().register(()=>({name:'STEM_CPU_IMAGES',loadTexture:async()=>new T.Texture()}));
    const decoded=await decodeForestGLB(bytes),gltf=await loader.parseAsync(decoded.buffer,'');gltf.scene.updateMatrixWorld(true);
    const asset:any={file,sha256:forestHash(bytes),bytes:bytes.length,compression:json.extensionsUsed?.includes('KHR_draco_mesh_compression')?'draco':'none',decodedSHA256:forestHash(decoded),embeddedImages:json.images?.length??0,textureDefinitions:json.textures?.length??0,levels:[]};
    for(const level of ['near','far']){
      const group=gltf.scene.getObjectByName(`NorthFir_${variant}_${level}`);if(!group)throw new Error(`Missing NorthFir_${variant}_${level}`);
      const wood:T.Mesh[]=[],meshes:any[]=[];
      group.traverse(o=>{if(!(o instanceof T.Mesh))return;const mats=Array.isArray(o.material)?o.material:[o.material];
        if(/wood|bark|trunk/i.test(o.name)||mats.some(m=>/wood|bark|trunk/i.test(m.name)))wood.push(o);
        const p=o.geometry.getAttribute('position'),idx=o.geometry.index;let finite=true;for(const attr of Object.values(o.geometry.attributes))for(const n of attr.array)if(!Number.isFinite(n))finite=false;
        let maxIndex=-1;if(idx)for(const n of idx.array)maxIndex=Math.max(maxIndex,n);else maxIndex=p.count-1;
        meshes.push({name:o.name,materials:mats.map(m=>m.name),vertices:p.count,triangles:(idx?.count??p.count)/3,finite,maxIndex});
      });
      if(!wood.length)throw new Error(`No separately identifiable Wood meshes in ${group.name}`);
      const trunks=wood.filter(m=>/trunk/i.test(m.name)),stemMeshes=trunks.length?trunks:wood;
      const box=new T.Box3().setFromObject(group),woodBox=new T.Box3(),stemBox=new T.Box3();for(const m of wood)woodBox.union(new T.Box3().setFromObject(m));for(const m of stemMeshes)stemBox.union(new T.Box3().setFromObject(m));
      asset.levels.push({name:group.name,bounds:{min:box.min.toArray(),max:box.max.toArray()},woodBounds:{min:woodBox.min.toArray(),max:woodBox.max.toArray()},stemBounds:{min:stemBox.min.toArray(),max:stemBox.max.toArray()},stemMeshes:stemMeshes.map(m=>m.name),meshes});
      for(const tree of data.trees.filter((p:any)=>p.variant===variant))for(const heightAboveGround of [.15,.35,.8,1.25,1.7]){
        const heightMetres=heightAboveGround+(tree.seating?.burialHeight??0)+.025;
        const section=stemSection(stemMeshes,heightMetres/tree.height),scale=tree.height*tree.width;
        const maxVisibleRadius=section.selected.maxRadius*scale,minVisibleRadius=section.selected.minRadius*scale;
        const root=data.rootHulls.find((h:any)=>h.variant===variant),hulls=root.parts.map((part:number[])=>{
          const shape=R.ColliderDesc.convexHull(new Float32Array(part.map((n:number,i:number)=>n*tree.height*(i%3===1?1:tree.width))));
          if(!shape)throw new Error(`Invalid root hull for variant${variant}`);return world.createCollider(shape);
        });
        const stem=world.createCollider(R.ColliderDesc.cylinder(tree.trunkHeight/2,tree.trunkRadius).setTranslation(0,tree.trunkHeight/2,0));
        for(let i=0;i<32;i++){
          const angle=i*Math.PI/16,dx=Math.cos(angle),dz=Math.sin(angle);let visible=-Infinity;
          for(const [a,b]of section.selected.segments){const ex=b.x-a.x,ez=b.z-a.z,den=dx*ez-dz*ex;if(Math.abs(den)<1e-12)continue;const r=(a.x*ez-a.z*ex)/den,u=(a.x*dz-a.z*dx)/den;if(r>=0&&u>=-1e-8&&u<=1+1e-8)visible=Math.max(visible,r*scale);}
          if(!Number.isFinite(visible))continue;
          const ray=new R.Ray({x:dx*2,y:heightMetres,z:dz*2},{x:-dx,y:0,z:-dz}),hits=[...hulls,stem].map(c=>c.castRay(ray,2,false)).filter((n):n is number=>n!==null&&n>=0),physical=hits.length?2-Math.min(...hits):0;
          const exposure=(r:number)=>{
            const lx=dx*r,lz=dz*r,x=tree.x+Math.cos(tree.yaw)*lx+Math.sin(tree.yaw)*lz,z=tree.z-Math.sin(tree.yaw)*lx+Math.cos(tree.yaw)*lz;
            return tree.y+heightMetres-(terrain.height(x,z)??Infinity);
          };
          proxyProbes.push({id:tree.id,variant,level,heightAboveGround,heightMetres,angle,visibleRadius:visible,physicalRadius:physical,gap:physical-visible,visibleAboveTerrain:exposure(visible),physicalAboveTerrain:exposure(physical)});
        }
        hulls.forEach((h:R.Collider)=>world.removeCollider(h,false));world.removeCollider(stem,false);
        probes.push({id:tree.id,variant,level,heightAboveGround,heightMetres,cylinderRadius:tree.trunkRadius,maxVisibleRadius,minVisibleRadius,
          penetration:maxVisibleRadius-tree.trunkRadius,emptyGap:tree.trunkRadius-minVisibleRadius,
          center:section.selected.center.map((n:number)=>n*scale),vertices:section.selected.vertices,closed:section.selected.closed,componentCount:section.componentCount});
      }
    }
    assets.push(asset);const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();gltf.scene.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
  }
  }finally{world.free();}
  return {assets,probes,proxyProbes,maximumExposedProxyGap:Math.max(...proxyProbes.filter(p=>p.physicalAboveTerrain>.02).map(p=>p.gap)),maximumExposedProxyPenetration:Math.max(...proxyProbes.filter(p=>p.visibleAboveTerrain>.02).map(p=>-p.gap)),maximumProxyGap:Math.max(...proxyProbes.map(p=>p.gap)),maximumProxyPenetration:Math.max(...proxyProbes.map(p=>-p.gap)),maximumPenetration:Math.max(...probes.map(p=>p.penetration)),maximumEmptyGap:Math.max(...probes.map(p=>p.emptyGap))};
}

/** Independent support extraction from the shipped near Trunk, including the
 * source tool's lexicographic unique ordering for coincident support extrema. */
export async function auditNorthTreeSeating(dataOverride?:{trees:any[];rootSeating:any}){
  const data=dataOverride??JSON.parse(readForestFile('src/quarry-north-forest.json').toString()),terrain=createSurfaceSampler(terrainGeometry()),assets:any[]=[],trees:any[]=[];
  const order=(a:number[],b:number[])=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
  for(const variant of [0,1,2]){
    const file=`public/models/quarry-north-fir-${variant}.glb`,bytes=readForestFile(file),loader=new GLTFLoader().register(()=>({name:'SEATING_CPU_IMAGES',loadTexture:async()=>new T.Texture()}));
    const gltf=await loader.parseAsync((await decodeForestGLB(bytes)).buffer,'');gltf.scene.updateMatrixWorld(true);
    const trunk=gltf.scene.getObjectByName(`NorthFir_${variant}_near_Trunk`) as T.Mesh;if(!(trunk instanceof T.Mesh))throw new Error(`Missing actual near Trunk ${variant}`);
    const attr=trunk.geometry.getAttribute('position'),unique=new Map<string,number[]>(),point=new T.Vector3();
    for(let i=0;i<attr.count;i++){point.fromBufferAttribute(attr,i).applyMatrix4(trunk.matrixWorld);if(point.y<=.012){const p=point.toArray();unique.set(p.join(','),p);}}
    const vertices=[...unique.values()].sort(order),selected=new Map<string,number[]>();if(!vertices.length)throw new Error('Empty low root support cloud');
    for(let direction=0;direction<48;direction++){
      const a=direction*Math.PI/24,dx=Math.cos(a),dz=Math.sin(a);let score=-Infinity,best=vertices[0];
      for(const p of vertices){const candidate=p[0]*dx+p[2]*dz;if(candidate>score){score=candidate;best=p;}}
      selected.set(best.join(','),best);
    }
    const supports=[...selected.values()].sort(order),declared=data.rootSeating.footprints.find((p:any)=>p.variant===variant);
    const distance=(a:number[],b:number[])=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
    const sourceErrors=declared.points.map((p:number[])=>Math.min(...vertices.map(v=>distance(p,v))));
    const supportErrors=Array.from({length:48},(_,i)=>{const a=i*Math.PI/24,dx=Math.cos(a),dz=Math.sin(a);return Math.max(...vertices.map(p=>p[0]*dx+p[2]*dz))-Math.max(...declared.points.map((p:number[])=>p[0]*dx+p[2]*dz));});
    assets.push({file,sha256:forestHash(bytes),variant,vertices:vertices.length,expectedSupports:supports,declaredSupports:declared.points,maximumSourcePointError:Math.max(...sourceErrors),maximumSupportExtentError:Math.max(...supportErrors)});
    for(const tree of data.trees.filter((t:any)=>t.variant===variant)){
      const ground=terrain.height(tree.x,tree.z)!;let expected=ground-.025;
      const place=(p:number[])=>{const x=p[0]*tree.height*tree.width,z=p[2]*tree.height*tree.width;return [tree.x+Math.cos(tree.yaw)*x+Math.sin(tree.yaw)*z,p[1]*tree.height,tree.z-Math.sin(tree.yaw)*x+Math.cos(tree.yaw)*z];};
      for(const p of supports){const [x,y,z]=place(p);expected=Math.min(expected,terrain.height(x,z)!-y-.025);}
      let maxExposed=-Infinity,worst:number[]=[];for(const p of vertices){const [x,y,z]=place(p),exposure=tree.y+y-terrain.height(x,z)!;if(exposure>maxExposed){maxExposed=exposure;worst=p;}}
      const supportExposure=Math.max(...supports.map(p=>{const [x,y,z]=place(p);return tree.y+y-terrain.height(x,z)!;}));
      trees.push({id:tree.id,variant,centerGroundY:ground,centerBaseline:ground-.025,expectedY:expected,actualY:tree.y,error:tree.y-expected,burialHeight:ground-.025-tree.y,maximumLowTrunkExposure:maxExposed,worstLowTrunkPoint:worst,maximumSupportExposure:supportExposure,declared:tree.seating});
    }
    const geometry=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();gltf.scene.traverse(o=>{if(o instanceof T.Mesh){geometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
  }
  return {assets,trees,maximumSeatingError:Math.max(...trees.map(t=>Math.abs(t.error))),maximumSupportExposure:Math.max(...trees.map(t=>t.maximumSupportExposure)),maximumLowTrunkExposure:Math.max(...trees.map(t=>t.maximumLowTrunkExposure)),maximumBurial:Math.max(...trees.map(t=>t.burialHeight))};
}
