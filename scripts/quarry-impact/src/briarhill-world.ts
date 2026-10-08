import * as T from 'three';
import {BRIARHILL_BARRIERS,briarhillHeight,briarhillPatch} from './briarhill-arena';
import {freezeSceneryTransforms} from './render-work';
export function createBriarhillWorld(){
 const root=new T.Group();root.name='briarhill_dirt_bowl';
 const materials={concrete:new T.MeshStandardMaterial({color:0xd3c8ae,roughness:.98}),red:new T.MeshStandardMaterial({color:0x9b4433,roughness:.95}),steel:new T.MeshStandardMaterial({color:0x394342,roughness:.75,metalness:.3}),seat:new T.MeshStandardMaterial({color:0x718779,roughness:.95})};
 const floorMaterial=new T.MeshStandardMaterial({color:0xb08a60,roughness:1}),floorGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 const p=briarhillPatch();floorGeometry.setAttribute('position',new T.BufferAttribute(p.positions,3));floorGeometry.setAttribute('uv',new T.BufferAttribute(p.uv,2));floorGeometry.setIndex(new T.BufferAttribute(p.indices,1));floorGeometry.computeVertexNormals();
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d');
  if(ctx){
   const scale=1024/160;ctx.fillStyle='#6d7750';ctx.fillRect(0,0,1024,1024);ctx.fillStyle='#b09068';ctx.beginPath();ctx.arc(512,512,59*scale,0,Math.PI*2);ctx.fill();
   let seed=652;for(let i=0;i<24000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%1024;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%1024;ctx.fillStyle=Math.hypot(x-512,y-512)<59*scale?(i%2?'#ba9b75':'#a5845e'):(i%2?'#788354':'#626e46');ctx.fillRect(x,y,2,2);}
   ctx.lineWidth=.18*scale;ctx.strokeStyle='#846548';for(const r of [21,23,26,29,31,39,42,45,48,51]){ctx.beginPath();ctx.arc(512,512,r*scale,.2*r,Math.PI*1.6+.2*r);ctx.stroke();}
   ctx.strokeStyle='#dbcca8';ctx.lineWidth=.15*scale;for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ctx.save();ctx.translate(512+Math.sin(a)*34*scale,512-Math.cos(a)*34*scale);ctx.rotate(a);ctx.strokeRect(-1.3*scale,-2.8*scale,2.6*scale,5.6*scale);ctx.restore();}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;floorMaterial.color.set(0xffffff);
  }
 }
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='briarhill_terrain';floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(finish)??[];batch.push(matrix.clone());batches.set(finish,batch);}
 BRIARHILL_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i%16<8?'concrete':'red',s.yaw));
 // Scenery stays beyond the physical wall; driving space contains only the terrain.
 for(let i=0;i<48;i++){if(i%12<3)continue;const a=i/48*Math.PI*2;
  for(let row=0;row<4;row++){const radius=63+row*2.3,x=Math.sin(a)*radius,z=Math.cos(a)*radius,y=briarhillHeight(x,z),h=.6+row*.7;box(x,y+h/2,z,7,h,2.1,'concrete',a);box(x,y+h+.18,z,6,.3,.65,'seat',a);}
 }
 for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const x=Math.sin(a)*65,z=Math.cos(a)*65,y=briarhillHeight(x,z);box(x,y+7,z,.35,14,.35,'steel',a);box(x,y+14,z,5,.6,1,'concrete',a);}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='briarhill_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=BRIARHILL_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
