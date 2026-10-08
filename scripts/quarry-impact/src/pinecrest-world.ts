import * as T from 'three';
import {PINECREST,PINECREST_SOLIDS,pinecrestTerrainPatch} from './pinecrest-course';
import {freezeSceneryTransforms} from './render-work';
/** Original wooded ridge circuit with gravel hills and a paved starting straight. All reachable barriers share the physics records. */
export function createPinecrestWorld(){
 const root=new T.Group();root.name='pinecrest_ridge';
 const materials={concrete:new T.MeshStandardMaterial({color:0xb9b9af,roughness:.96}),stripe:new T.MeshStandardMaterial({color:0x486957,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x313b44,roughness:.7,metalness:.35}),grass:new T.MeshStandardMaterial({color:0x6f7551,roughness:1}),seat:new T.MeshStandardMaterial({color:0x9da6b2,roughness:.8})};
 const groundMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.92}),groundGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1820;const ctx=canvas.getContext('2d');
  if(ctx){
   ctx.fillStyle='#73764d';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=917;
   for(let i=0;i<35000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%2048;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#7b7c54':'#656d49';ctx.fillRect(x,seed%1820,3,3);}
   const scale=canvas.width/360,x=(v:number)=>(v+180)*scale,z=(v:number)=>(160-v)*canvas.height/320;
   const route=()=>{ctx.beginPath();PINECREST.samples.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));ctx.closePath();};
   ctx.lineJoin='round';route();ctx.strokeStyle='#a39574';ctx.lineWidth=30*scale;ctx.stroke();
   route();ctx.strokeStyle='#e3ddd0';ctx.lineWidth=25.5*scale;ctx.stroke();ctx.setLineDash([3*scale,3*scale]);ctx.strokeStyle='#486957';ctx.stroke();ctx.setLineDash([]);
   route();ctx.strokeStyle='#927455';ctx.lineWidth=24*scale;ctx.stroke();
   ctx.save();ctx.beginPath();ctx.rect(0,z(-65),canvas.width,canvas.height-z(-65));ctx.clip();route();ctx.strokeStyle='#393e40';ctx.stroke();ctx.restore();
   const start=PINECREST.point(0);for(let i=0;i<24;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#deddd3':'#25292c';ctx.fillRect(x(start.x-1+j),z(start.z-12+i+1),scale,scale);}
   for(let row=1;row<12;row++)for(const lane of [-2.4,2.4]){const p=PINECREST.point(-row*7/PINECREST.length);ctx.fillStyle='#b6b7b1';ctx.fillRect(x(p.x-2),z(p.z+lane+1),.2*scale,2*scale);}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);groundMaterial.map=texture;
  }
 }else groundMaterial.color.set(0x66704e);
 const patch=pinecrestTerrainPatch();groundGeometry.setAttribute('position',new T.BufferAttribute(patch.positions,3));groundGeometry.setAttribute('uv',new T.BufferAttribute(patch.uv,2));groundGeometry.setIndex(new T.BufferAttribute(patch.indices,1));groundGeometry.computeVertexNormals();
 const floor=new T.Mesh(groundGeometry,groundMaterial);floor.name='pinecrest_ground';floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>();
 const matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,material:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(material)??[];batch.push(matrix.clone());batches.set(material,batch);}
 for(const s of PINECREST_SOLIDS)box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,s.material,s.yaw);
 // Spectator terraces and pit garages stay outside the continuous barrier.
 for(let row=0;row<5;row++){const h=.6+row*.55,z=-127-row*2;box(0,h/2,z,150,h,2,'concrete');for(let x=-70;x<=70;x+=3)box(x,h+.2,z,2.2,.2,.65,'seat');}
 box(0,5.6,-134,158,.25,14,'steel');for(const x of [-75,-25,25,75])box(x,2.8,-140,.2,5.6,.2,'steel');
 for(let x=-65;x<=65;x+=26){box(x,2.2,-150,23,4.4,12,'stripe');box(x,4.5,-150,24,.2,13,'steel');for(const dx of [-7,0,7])box(x+dx,1.8,-143.9,5,3.4,.15,'seat');}
 const trunks=new T.CylinderGeometry(.3,.45,1,5),crowns=new T.ConeGeometry(1,1,7),trees: {x:number;z:number}[]=[];
 for(let x=-160;x<=160;x+=16)for(const z of [-155,143]){if(z<0&&Math.abs(x)<85)continue;trees.push({x,z});}
 for(let z=-110;z<=115;z+=16)for(const x of [-165,165])trees.push({x,z});
 for(const [geometry,material,offset,scale]of [[trunks,materials.steel,2,new T.Vector3(1,4,1)],[crowns,materials.grass,5,new T.Vector3(4,8,4)]] as const){const mesh=new T.InstancedMesh(geometry,material,trees.length);trees.forEach((tree,i)=>{matrix.compose(new T.Vector3(tree.x,PINECREST.height(tree.x,tree.z)+offset,tree.z),new T.Quaternion(),scale);mesh.setMatrixAt(i,matrix);});mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='pinecrest_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=PINECREST_SOLIDS;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});groundGeometry.dispose();boxGeometry.dispose();trunks.dispose();crowns.dispose();groundMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
