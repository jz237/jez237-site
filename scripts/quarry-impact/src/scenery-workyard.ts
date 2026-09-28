import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {url,texture} from './assets';
import {landscapeHeight} from './quarry-layout';
import {dressWorkyardGround} from './scenery-workyard-ground';

export const WORKYARD_PLACEMENTS=[
  ...Array.from({length:5},(_,i)=>({id:'container-'+i,asset:'container',p:[-63+i*7,0,59],yaw:0})),
  {id:'excavator',asset:'excavator',p:[62,landscapeHeight(62,-42),-42],yaw:-.8},
  {id:'conveyor',asset:'conveyor',p:[-62,5.5,-56],yaw:0,roll:-.18},
  {id:'workshop',asset:'workshop',p:[-54,0,-39],yaw:0},
  ...Array.from({length:3},(_,i)=>({id:'silo-'+i,asset:'silo',p:[-74+i*8,0,-50],yaw:0})),
];
export async function loadWorkyard(parent:T.Group,barriers:T.Group) {
  const [model,maps]=await Promise.all([
    new GLTFLoader().loadAsync(url('models/quarry-workyard.glb')),
    Promise.all(['container_side','rusty_painted_metal','concrete_layers_02'].flatMap(id=>['diff','normal','arm'].map(async kind=>{
      const t=await new T.TextureLoader().loadAsync(url(`assets/workyard/${id}-${kind}.jpg`));t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;if(kind==='diff')t.colorSpace=T.SRGBColorSpace;return [`${id}-${kind}`,t] as const;
    }))),
  ]);
  const textures=new Map<string,T.Texture>(maps),materials=new Map<string,T.MeshStandardMaterial>(),parts=new Map<string,T.Mesh[]>();
  const material=(source:T.MeshStandardMaterial)=>{
    if(materials.has(source.name))return materials.get(source.name)!;
    const m=source.clone();m.vertexColors=true;m.side=T.DoubleSide;
    const asset=m.name==='yard_paint'?'container_side':['yard_yellow','yard_rust','yard_steel'].includes(m.name)?'rusty_painted_metal':m.name==='yard_concrete'?'concrete_layers_02':null;
    if(asset){
      m.map=textures.get(asset+'-diff')!;m.normalMap=textures.get(asset+'-normal')!;m.roughnessMap=textures.get(asset+'-arm')!;m.aoMap=textures.get(asset+'-arm')!;m.aoMapIntensity=.45;
      m.normalScale.setScalar(m.name==='yard_concrete'?.6:.26);m.roughness=1;m.metalness=m.name==='yard_steel'?.64:.04;
      if(m.name!=='yard_concrete'){
        m.color.setHex(m.name==='yard_yellow'?0xbfa057:m.name==='yard_rust'?0x8d5936:m.name==='yard_steel'?0x737773:0x7b8674);
        m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
#ifdef USE_MAP
float yardLuma=dot(sampledDiffuseColor.rgb,vec3(.2126,.7152,.0722));
diffuseColor.rgb=diffuse*(.12+mix(vec3(yardLuma),sampledDiffuseColor.rgb,.12)*2.6);
#endif`);};m.customProgramCacheKey=()=> 'workyard-painted-photo-1';
      }else{m.color.setHex(0xa3a092);}
    }
    if(m.name==='yard_cladding'){
      m.map=texture('cladding_diff',1,true);m.normalMap=texture('cladding_nor_gl');m.roughnessMap=texture('cladding_arm');m.normalScale.setScalar(.38);m.color.setHex(0xb5bbae);m.roughness=1;m.metalness=.10;
      m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
#ifdef USE_MAP
diffuseColor.rgb=diffuse*(vec3(.14)+sampledDiffuseColor.rgb*1.35);
#endif`);};m.customProgramCacheKey=()=> 'workyard-cladding-photo-1';
    }
    if(m.name==='yard_glass'){m.color.setHex(0x53626a);m.roughness=.12;m.metalness=.08;m.envMapIntensity=.9;m.transparent=true;m.opacity=.47;m.depthWrite=false;}
    if(m.name==='yard_rubber'){m.color.setHex(0x373b37);m.roughness=.96;}
    materials.set(m.name,m);return m;
  };
  model.scene.updateMatrixWorld(true);
  model.scene.traverse(o=>{
    if(!(o instanceof T.Mesh))return;
    const match=/^(\w+)_LOD([01])_/.exec(o.name);if(!match)return;
    const key=match[1]+'-'+match[2],g=o.geometry.clone().applyMatrix4(o.matrixWorld);
    if(g.attributes.uv&&!g.attributes.uv1)g.setAttribute('uv1',g.attributes.uv);
    const mesh=new T.Mesh(g,material(o.material as T.MeshStandardMaterial));mesh.name=o.name;mesh.castShadow=true;mesh.receiveShadow=true;
    if(!parts.has(key))parts.set(key,[]);parts.get(key)!.push(mesh);
  });
  const lods:T.LOD[]=[];
  for(const item of WORKYARD_PLACEMENTS){
    const lod=new T.LOD();lod.name='workyard-'+item.id;lod.position.fromArray(item.p);lod.rotation.y=item.yaw;lod.rotation.z='roll'in item?item.roll!:0;lod.autoUpdate=false;
    let paint:T.MeshStandardMaterial|undefined;
    if(item.asset==='container'){
      const source=materials.get('yard_paint')!;paint=source.clone();paint.onBeforeCompile=source.onBeforeCompile;paint.customProgramCacheKey=source.customProgramCacheKey;
      paint.color.setHex([0x7b8674,0xa57d66,0x84919a][Number(item.id.split('-')[1])%3]);
    }
    for(const level of [0,1]){const group=new T.Group();for(const part of parts.get(item.asset+'-'+level)??[]){const clone=part.clone();if(paint&&(part.material as T.Material).name==='yard_paint')clone.material=paint;group.add(clone);}lod.addLevel(group,level?65:0,.18);}
    parent.add(lod);lods.push(lod);
  }
  // Supports remain at the exact original conveyor-leg positions.
  const support=new T.InstancedMesh(new T.BoxGeometry(.15,4.4,.15),materials.get('yard_steel'),4),d=new T.Object3D();let n=0;
  for(const x of [-71,-54])for(const z of [-57.3,-54.7]){d.position.set(x,2.2,z);d.updateMatrix();support.setMatrixAt(n++,d.matrix);}support.castShadow=true;support.receiveShadow=true;parent.add(support);
  // Original 66 barrier positions, orientation, height and collision are kept.
  for(const old of [...barriers.children]){barriers.remove(old);if(old instanceof T.Mesh)old.geometry.dispose();}
  for(const part of parts.get('barrier-0')??[]){
    const mesh=new T.InstancedMesh(part.geometry,part.material,66);mesh.name='workyard-arena-'+(part.material as T.Material).name;mesh.castShadow=true;mesh.receiveShadow=true;
    for(let i=0;i<66;i++){const a=i/66*Math.PI*2;d.position.set(Math.sin(a)*46,0,Math.cos(a)*46);d.rotation.set(0,a,0);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);}mesh.computeBoundingSphere();barriers.add(mesh);
  }
  const ground=dressWorkyardGround(parent);
  parent.userData.workyard={placements:WORKYARD_PLACEMENTS.length,materials:materials.size,ground};
  return lods;
}

export function workyardFences(parent:T.Group){
  // Fine wire is analytically antialiased; tubular posts/caps and tension rails
  // provide the silhouette. This avoids unstable subpixel mesh wires at speed.
  const material=new T.MeshStandardMaterial({name:'Galvanized quarry chain link',color:0x727d78,metalness:.65,roughness:.62,side:T.DoubleSide,transparent:true,depthWrite:false,alphaTest:.05});
  material.onBeforeCompile=s=>{
    s.vertexShader='varying vec2 vFence;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFence=uv*vec2(3.142,3.25);');
    s.fragmentShader='varying vec2 vFence;\n'+s.fragmentShader;
    s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec2 wire=vec2(vFence.x+vFence.y,vFence.x-vFence.y)/.145;
vec2 edge=abs(fract(wire+.5)-.5);
vec2 aa=max(fwidth(wire),vec2(.0001));
vec2 coverage=1.-smoothstep(vec2(.014)-aa,vec2(.014)+aa,edge);
diffuseColor.a*=max(coverage.x,coverage.y)*.80;`);
  };material.customProgramCacheKey=()=> 'yard-chain-link-filtered-1';
  const count=93,postMaterial=new T.MeshStandardMaterial({name:'Galvanized fence fittings',color:0x72786e,roughness:.57,metalness:.62});
  const posts=new T.InstancedMesh(new T.CylinderGeometry(.037,.037,4,10),postMaterial,count);
  const caps=new T.InstancedMesh(new T.SphereGeometry(.048,8,5),postMaterial,count);
  const panels=new T.InstancedMesh(new T.PlaneGeometry(1,3.25),material,count),rails=new T.InstancedMesh(new T.CylinderGeometry(.013,.013,1,6),postMaterial,count*2),d=new T.Object3D();let k=0;
  for(let i=0;i<100;i++){
    if(i>22&&i<30)continue;const a=i/100*Math.PI*2,b=(i+1)/100*Math.PI*2;
    const x=Math.sin(a)*50,z=Math.cos(a)*50,bx=Math.sin(b)*50,bz=Math.cos(b)*50,length=Math.hypot(bx-x,bz-z),yaw=Math.atan2(bx-x,bz-z);
    d.position.set(x,2,z);d.scale.set(1,1,1);d.quaternion.identity();d.updateMatrix();posts.setMatrixAt(k,d.matrix);d.position.y=4.01;d.updateMatrix();caps.setMatrixAt(k,d.matrix);
    d.position.set((x+bx)/2,2,(z+bz)/2);d.rotation.set(0,yaw+Math.PI/2,0);d.scale.set(length,1,1);d.updateMatrix();panels.setMatrixAt(k,d.matrix);
    for(let j=0;j<2;j++){d.position.y=j?3.3:1.5;d.scale.set(1,length,1);d.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(bx-x,0,bz-z).normalize());d.updateMatrix();rails.setMatrixAt(k*2+j,d.matrix);}k++;
  }
  for(const mesh of [posts,caps,panels,rails]){mesh.name='workyard-fence-'+mesh.material.name;mesh.receiveShadow=true;mesh.castShadow=mesh!==panels;mesh.computeBoundingSphere();parent.add(mesh);}
}
