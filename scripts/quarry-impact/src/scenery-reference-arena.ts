import * as T from 'three';
import {GLTFLoader} from './model-loader';
import {texture,url} from './assets';
import {DERBY_ARENA,arenaBarrier} from './derby-arena';
import {landscapeHeight} from './quarry-layout';
import {referenceQuarryGeology} from './scenery-reference-geology';
import replacements from './arena-escarpment-replacements.json';

export class ReferenceArena {
 readonly event=new T.Group();
 readonly lods:T.LOD[]=[];
 private prepared?:Promise<Awaited<ReturnType<GLTFLoader['loadAsync']>>[]>;
 stats={rockSections:0,replacedSurfaces:0,lamps:0,banners:0,props:0};
 constructor(private parent:T.Group){this.event.name='Reference event infrastructure';parent.add(this.event);}
 prepare(){return this.prepared??=Promise.all(['arena-escarpment','arena-industrial'].map(name=>new GLTFLoader().loadAsync(url(`models/${name}.glb`))));}
 async load(){
  const [rock,industrial]=await this.prepare();
  const geology=referenceQuarryGeology();
  rock.scene.updateMatrixWorld(true);
  const sections=new Map<string,Map<string,T.Mesh>>();
  rock.scene.traverse(o=>{
   if(!(o instanceof T.Mesh))return;
   const match=/^ArenaRock_(\d+)_(near|far)/.exec(o.name);if(!match)return;
   const geometry=o.geometry.clone().applyMatrix4(o.matrixWorld);geometry.deleteAttribute('tangent');
   const mesh=new T.Mesh(geometry,geology);mesh.name=o.name;mesh.castShadow=mesh.receiveShadow=true;
   if(!sections.has(match[1]))sections.set(match[1],new Map());sections.get(match[1])!.set(match[2],mesh);
  });
  for(const [name,parts]of sections){
   const near=parts.get('near')!,far=parts.get('far')!;near.geometry.computeBoundingBox();
   const centre=near.geometry.boundingBox!.getCenter(new T.Vector3()),lod=new T.LOD();lod.name='Reference quarry fracture '+name;lod.position.copy(centre);lod.autoUpdate=false;
   for(const [level,mesh]of [near,far].entries()){mesh.geometry.translate(-centre.x,-centre.y,-centre.z);mesh.geometry.computeBoundingSphere();lod.addLevel(mesh,level?230:0,.14);}
   this.parent.add(lod);this.lods.push(lod);
  }
  this.stats.rockSections=this.lods.length;
  for(const item of replacements){
   // Replace the whole copied rock surface so two nearby skins cannot shadow
   // one another. Retained rubble/road/fan meshes and physical proxies stay.
   const original=this.parent.getObjectByName(item.source);if(original){original.visible=false;if(original instanceof T.Mesh)original.castShadow=false;this.stats.replacedSurfaces++;}
   const far=this.parent.getObjectByName(item.source.replace(/near$/,'far'));if(far&&far!==original){far.visible=false;if(far instanceof T.Mesh)far.castShadow=false;}
  }
  industrial.scene.updateMatrixWorld(true);
  const parts:T.Mesh[]=[];
  industrial.scene.traverse(o=>{if(o instanceof T.Mesh){const g=o.geometry.clone().applyMatrix4(o.matrixWorld),m=(o.material as T.MeshStandardMaterial).clone();g.setAttribute('uv1',g.attributes.uv);
   if(m.name==='arena_concrete'){m.map=texture('workyard/concrete_layers_02-diff',1,true);m.normalMap=texture('workyard/concrete_layers_02-normal');m.roughnessMap=texture('workyard/concrete_layers_02-arm');m.roughness=1;m.normalScale.setScalar(.5);}
   if(m.name==='arena_lamps'){m.emissive.setHex(0xffe6ae);m.emissiveIntensity=1.3;}
   const mesh=new T.Mesh(g,m);mesh.name=o.name;parts.push(mesh);}});
  const d=new T.Object3D();
  for(const part of parts.filter(p=>p.name.startsWith('floodlight_'))){
   const mesh=new T.InstancedMesh(part.geometry,part.material,8);mesh.name=part.name;mesh.castShadow=mesh.receiveShadow=true;
   for(let i=0;i<8;i++){const a=(i+.28)/8*Math.PI*2,r=DERBY_ARENA.fenceRadius+2.4,x=DERBY_ARENA.x+Math.sin(a)*r,z=DERBY_ARENA.z+Math.cos(a)*r;
    d.position.set(x,landscapeHeight(x,z),z);d.rotation.set(0,a,0);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);}
   mesh.computeBoundingSphere();this.event.add(mesh);
  }
  this.stats.lamps=8;
  for(const part of parts.filter(p=>p.name.startsWith('rail_'))){
   const mesh=new T.InstancedMesh(part.geometry,part.material,DERBY_ARENA.segments);mesh.name='Arena barrier cap';mesh.castShadow=mesh.receiveShadow=true;
   for(let i=0;i<DERBY_ARENA.segments;i++){const p=arenaBarrier(i);d.position.set(p.x,p.y+1.17,p.z);d.rotation.set(0,p.yaw,0);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);}mesh.computeBoundingSphere();this.event.add(mesh);
  }
  // The quarry's existing authored machinery/containers share geometry/maps.
  // Stay beyond the circuit on its service apron, outside the playable derby.
  const sites=[{source:'workyard-container-0',p:[-46,0,110],yaw:.12},{source:'workyard-container-1',p:[-38,0,111],yaw:.08},
   {source:'workyard-container-2',p:[52,0,113],yaw:-.18},{source:'workyard-container-3',p:[60,0,114],yaw:-.18},
   {source:'workyard-excavator',p:[76,0,112],yaw:2.45},{source:'workyard-workshop',p:[-67,0,112],yaw:Math.PI},
   {source:'workyard-container-4',p:[-42,2.59,110],yaw:.12}];
  for(const site of sites){const original=this.parent.getObjectByName(site.source);if(!original)continue;const clone=original.clone(true);clone.name='Reference service '+site.source;clone.position.fromArray(site.p);clone.position.y+=landscapeHeight(site.p[0],site.p[2]);clone.rotation.set(0,site.yaw,0);if(clone instanceof T.LOD){clone.autoUpdate=false;this.lods.push(clone);}this.event.add(clone);this.stats.props++;}
  for(const part of parts.filter(p=>p.name.startsWith('servicebox_'))){const clone=part.clone();clone.position.set(43,landscapeHeight(43,107),107);clone.castShadow=clone.receiveShadow=true;this.event.add(clone);}
  for(let i=0;i<12;i++){
   const a=(i+.18)/12*Math.PI*2,r=DERBY_ARENA.fenceRadius-.18,x=DERBY_ARENA.x+Math.sin(a)*r,z=DERBY_ARENA.z+Math.cos(a)*r;
   const sign=this.banner(i%3===0?'QUARRY IMPACT':i%3===1?'FULL CONTACT':'BLACKRIDGE MOTOR CLUB',6.3,1.46,i);
   sign.position.set(x,landscapeHeight(x,z)+2.05,z);sign.rotation.y=a+Math.PI;this.event.add(sign);
  }
  const quarrySign=this.banner('QUARRY / IMPACT',24,6,3);quarrySign.position.set(56,26,143);quarrySign.rotation.y=Math.PI+.18;this.parent.add(quarrySign);
  this.stats.banners=13;
 }
 private banner(text:string,width:number,height:number,variant:number){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=512;const c=canvas.getContext('2d')!;
  c.fillStyle='#222725';c.fillRect(0,0,2048,512);c.fillStyle='#b0ada2';
  // Aged canvas, edge stitches and fastening grommets, original typography.
  for(let i=0;i<2200;i++){const x=(Math.sin(i*12.71)*43758.54%1+1)%1*2048,y=(Math.sin(i*28.43)*1238.9%1+1)%1*512;c.globalAlpha=.045;c.fillRect(x,y,1+(i%7),1+(i%3));}
  c.globalAlpha=1;c.strokeStyle='#4d514b';c.lineWidth=3;c.strokeRect(14,14,2020,484);
  c.fillStyle='#e6e3d7';c.textAlign='center';c.font='italic 900 '+(text.length>19?94:126)+'px Arial';c.fillText(text,1024,275);
  c.font='30px Arial';c.fillStyle='#a9aea5';c.fillText('BLACKRIDGE QUARRY  /  MOTOR CLUB 237',1024,364);
  for(const x of [35,2013])for(const y of [35,477]){c.fillStyle='#777970';c.beginPath();c.arc(x,y,10,0,Math.PI*2);c.fill();c.fillStyle='#292d2a';c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill();}
  if(variant%3===1){for(let i=0;i<12;i++){c.fillStyle=i%2?'#dbbf55':'#252722';c.fillRect(i*171,450,171,30);}}
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;
  const mesh=new T.Mesh(new T.PlaneGeometry(width,height,12,4),new T.MeshStandardMaterial({map,roughness:.92,side:T.DoubleSide}));mesh.name='Fictional Quarry Impact banner';mesh.receiveShadow=true;return mesh;
 }
 setMode(derby:boolean,online=false){this.event.visible=derby&&!online;}
 setQuality(quality:string){for(const lod of this.lods)if(lod.name.startsWith('Reference quarry fracture')&&lod.levels[1])lod.levels[1].distance=quality==='ultra'?230:quality==='high'?170:115;}
 update(camera:T.Camera){for(const lod of this.lods)lod.update(camera);}
}
