import * as T from 'three';
import {SABLE} from './sable-course';
const hash=(n:number)=>{const v=Math.sin(n*127.13+31.7)*43758.5453;return v-Math.floor(v);};
/** Low desert scrub and gravel fans, grouped into patches rather than a uniform grid. */
export function createSableGroundcover(){
 const root=new T.Group();root.name='sable-groundcover';
 const positions:number[]=[],colors:number[]=[];
 // Each shrub has a branching silhouette with narrow, tapered leaf clusters.
 function blade(x:number,z:number,angle:number,height:number,width:number){
  const dx=Math.cos(angle),dz=Math.sin(angle),sx=-dz*width,sz=dx*width;
  const vertices=[[x-sx,0,z-sz],[x+sx,0,z+sz],[x+dx*.22,height*.65,z+dz*.22],[x+dx*.22,height*.65,z+dz*.22],[x+sx*.3,height*.38,z+sz*.3],[x+dx*.35,height,z+dz*.35]];
  for(let i=0;i<vertices.length;i++){positions.push(...vertices[i]);const t=i%3===2?.8:.5;colors.push(.35*t,.39*t,.22*t);}
 }
 for(let i=0;i<18;i++){const angle=i*2.39996,r=.28*Math.sqrt(hash(i+1));blade(Math.cos(angle)*r,Math.sin(angle)*r,angle,.3+hash(i+20)*.65,.025+hash(i+40)*.055);}
 const shrubGeometry=new T.BufferGeometry();shrubGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));shrubGeometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));shrubGeometry.computeVertexNormals();
 const shrubMaterial=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:1});
 const pebbleGeometry=new T.IcosahedronGeometry(1,0),pebbleMaterial=new T.MeshStandardMaterial({color:0x8b7861,roughness:1,flatShading:true});
 const shrubTransforms:T.Matrix4[]=[],pebbleTransforms:T.Matrix4[]=[],placements:{x:number;z:number;radius:number;kind:string}[]=[];
 const dummy=new T.Object3D(),patchPositions:number[]=[],patchColors:number[]=[],patchIndices:number[]=[];
 for(let c=0;c<115;c++){
  const x=(hash(c*7+101)-.5)*420,z=-83+hash(c*7+102)*246;
  const radius=3+hash(c*7+103)*7;
  if(SABLE.distance(x,z)<24+radius)continue;
  // Keep the centre of the bowl open, with denser cover on its slopes and northern banks.
  if(Math.abs(x)<55&&z<35&&hash(c+177)<.8)continue;
  const base=patchPositions.length/3;patchPositions.push(x,SABLE.height(x,z)+.025,z);patchColors.push(.28,.25,.17);
  for(let j=0;j<=16;j++){const a=j%16/16*Math.PI*2,r=radius*(.75+.25*hash(c*19+j%16));const px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;patchPositions.push(px,SABLE.height(px,pz)+.025,pz);patchColors.push(.58,.49,.32);if(j<16)patchIndices.push(base,base+j+2,base+j+1);}
  for(let j=0;j<23;j++){
   const n=c*101+j,a=hash(n+204)*Math.PI*2,r=Math.sqrt(hash(n+505))*radius*.85,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;
   const size=.5+hash(n+906)*1.1;
   if(SABLE.distance(px,pz)<23+size)continue;
   dummy.position.set(px,SABLE.height(px,pz),pz);dummy.rotation.set(0,hash(n+800)*6.28,0);dummy.scale.setScalar(size);dummy.updateMatrix();shrubTransforms.push(dummy.matrix.clone());placements.push({x:px,z:pz,radius:size,kind:'scrub'});
  }
  for(let j=0;j<35;j++){
   const n=c*151+j,a=hash(n+601)*Math.PI*2,r=Math.sqrt(hash(n+907))*radius,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r,size=.08+Math.pow(hash(n+909),3)*.6;
   dummy.position.set(px,SABLE.height(px,pz)+size*.2,pz);dummy.rotation.set(hash(n+901),hash(n+912)*6.28,hash(n+915));dummy.scale.set(size,size*.5,size*.8);dummy.updateMatrix();pebbleTransforms.push(dummy.matrix.clone());placements.push({x:px,z:pz,radius:size,kind:'gravel'});
  }
 }
 const patchGeometry=new T.BufferGeometry();patchGeometry.setAttribute('position',new T.Float32BufferAttribute(patchPositions,3));patchGeometry.setAttribute('color',new T.Float32BufferAttribute(patchColors,3));patchGeometry.setIndex(patchIndices);patchGeometry.computeVertexNormals();
 const patchMaterial=new T.MeshStandardMaterial({vertexColors:true,transparent:true,opacity:.22,depthWrite:false,roughness:1});const patches=new T.Mesh(patchGeometry,patchMaterial);patches.name='weathered-scrub-beds';patches.receiveShadow=true;root.add(patches);
 for(const [name,g,m,transforms] of [['sagebrush',shrubGeometry,shrubMaterial,shrubTransforms],['gravel-fans',pebbleGeometry,pebbleMaterial,pebbleTransforms]] as const){const mesh=new T.InstancedMesh(g,m,transforms.length);transforms.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.name=name;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.placements=placements;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});for(const r of [shrubGeometry,pebbleGeometry,patchGeometry,shrubMaterial,pebbleMaterial,patchMaterial])r.dispose();root.clear();}};
}
