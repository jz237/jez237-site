import * as T from 'three';
import {FOUNDRY_BARRIERS,FOUNDRY_OUTLINE,foundryHeight,foundryPatch,foundrySurface} from './foundry-arena';
import {freezeSceneryTransforms} from './render-work';
export function createFoundryWorld(){
 const root=new T.Group();root.name='foundry_breaker_yard';
 const materials={concrete:new T.MeshStandardMaterial({color:0xb9b6a9,roughness:.96}),yellow:new T.MeshStandardMaterial({color:0xd8a93e,roughness:.85}),steel:new T.MeshStandardMaterial({color:0x334446,roughness:.7,metalness:.45}),rust:new T.MeshStandardMaterial({color:0x905644,roughness:.9,metalness:.15}),roof:new T.MeshStandardMaterial({color:0x646e6c,roughness:.9})};
 const floorMaterial=new T.MeshStandardMaterial({color:0x666866,roughness:1}),floorGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 const p=foundryPatch();floorGeometry.setAttribute('position',new T.BufferAttribute(p.positions,3));floorGeometry.setAttribute('uv',new T.BufferAttribute(p.uv,2));floorGeometry.setIndex(new T.BufferAttribute(p.indices,1));floorGeometry.computeVertexNormals();
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d');
  if(ctx){
   const scale=1024/160;ctx.fillStyle='#687361';ctx.fillRect(0,0,1024,1024);
   ctx.save();ctx.beginPath();FOUNDRY_OUTLINE.forEach((p,i)=>i?ctx.lineTo(512+p.x*scale,512-p.z*scale):ctx.moveTo(512+p.x*scale,512-p.z*scale));ctx.closePath();ctx.clip();ctx.fillStyle='#6a706c';ctx.fillRect(0,0,1024,1024);
   ctx.fillStyle='#a78e70';ctx.beginPath();for(const [i,p]of [{x:-80,z:36},{x:80,z:-12},{x:80,z:-36},{x:-80,z:12}].entries())i?ctx.lineTo(512+p.x*scale,512-p.z*scale):ctx.moveTo(512+p.x*scale,512-p.z*scale);ctx.closePath();ctx.fill();
   let seed=911;for(let i=0;i<32000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%1024;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%1024;const gravel=foundrySurface((x-512)/scale,(512-y)/scale)==='gravel';ctx.fillStyle=gravel?(i%2?'#b7a180':'#968067'):(i%2?'#747a75':'#5c6460');ctx.fillRect(x,y,2,2);}
   ctx.strokeStyle='#444c49';ctx.lineWidth=.1*scale;for(let x=-48;x<=48;x+=12){ctx.beginPath();ctx.moveTo(512+x*scale,512-49*scale);ctx.lineTo(512+x*scale,512+49*scale);ctx.stroke();}for(let z=-40;z<=40;z+=10){ctx.beginPath();ctx.moveTo(512-57*scale,512-z*scale);ctx.lineTo(512+57*scale,512-z*scale);ctx.stroke();}
   // Loading-bank edges and starting boxes are road markings, not extra collision geometry.
   ctx.strokeStyle='#d8bc64';ctx.lineWidth=.25*scale;ctx.setLineDash([2*scale,1.5*scale]);for(const x of [-38,38]){ctx.beginPath();ctx.moveTo(512+x*scale,512-46*scale);ctx.lineTo(512+x*scale,512+46*scale);ctx.stroke();}ctx.setLineDash([]);
   ctx.strokeStyle='#dfd4b4';ctx.lineWidth=.13*scale;for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ctx.save();ctx.translate(512+Math.sin(a)*34*scale,512-Math.cos(a)*34*scale);ctx.rotate(a);ctx.strokeRect(-1.3*scale,-2.8*scale,2.6*scale,5.6*scale);ctx.restore();}ctx.restore();
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;floorMaterial.color.set(0xffffff);
  }
 }
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='foundry_terrain';floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(finish)??[];batch.push(matrix.clone());batches.set(finish,batch);}
 FOUNDRY_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i%6<2?'yellow':'concrete',s.yaw));
 // Industrial scenery stays beyond the containing wall and every usable driving surface.
 box(0,8,-67,78,16,19,'rust');box(0,16.4,-67,81,.8,21,'roof');
 for(let x=-35;x<=35;x+=10){box(x,6,-57.3,7,12,.25,'steel');box(x,13,-57.1,7,1,.3,'yellow');}
 for(const side of [-1,1])for(let row=0;row<3;row++){const x=side*(65+row*4),y=foundryHeight(x,0);for(const z of [-26,-8,10,28]){box(x,y+1.4,z,2.8,2.8,12,row%2?'steel':'rust');for(let dz=-5;dz<=5;dz+=2)box(x-side*1.45,y+1.4,z+dz,.08,2.5,.18,'roof');}}
 // A gantry marks the open south end without spanning the play area.
 for(const x of [-37,37]){box(x,10,62,1.8,20,2,'yellow');box(x,2,62,5,4,5,'concrete');}box(0,20,62,78,2,2,'yellow');box(12,18.3,62,6,1.4,4,'steel');box(12,14,62,.15,7,.15,'steel');box(12,10.4,62,1,.8,.8,'rust');
 for(const x of [-60,60])for(const z of [-49,49]){const y=foundryHeight(x,z);box(x,y+8,z,.3,16,.3,'steel');box(x,y+16,z,4,.6,1,'concrete');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='foundry_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=FOUNDRY_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
