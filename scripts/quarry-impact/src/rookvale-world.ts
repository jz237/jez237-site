import * as T from 'three';
import {ROOKVALE,ROOKVALE_BARRIERS,ROOKVALE_LANES} from './rookvale-course';
import {freezeSceneryTransforms} from './render-work';
export function createRookvaleWorld(){
 const root=new T.Group();root.name='rookvale_freight_yard';
 const materials={concrete:new T.MeshStandardMaterial({color:0xbfc4bd,roughness:.98}),yellow:new T.MeshStandardMaterial({color:0xd6a344,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x35454b,roughness:.7,metalness:.4}),red:new T.MeshStandardMaterial({color:0x934b3e,roughness:.9}),blue:new T.MeshStandardMaterial({color:0x456c78,roughness:.85})};
 const floorMaterial=new T.MeshStandardMaterial({color:0xa28f74,roughness:1}),floorGeometry=new T.BufferGeometry(),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 const {spanX,spanZ}=ROOKVALE.terrain;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2200;canvas.height=1800;const ctx=canvas.getContext('2d');
  if(ctx){
   const scale=5,x=(v:number)=>(v+spanX/2)*scale,z=(v:number)=>(spanZ/2-v)*scale;
   ctx.fillStyle='#a28f74';ctx.fillRect(0,0,canvas.width,canvas.height);let seed=7191;
   for(let i=0;i<40000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const px=seed%canvas.width;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#94826b':'#b2a084';ctx.fillRect(px,seed%canvas.height,3,3);}
   const line=(points:readonly {x:number;z:number}[],width:number,color:string,closed=false)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));if(closed)ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=width*scale;ctx.stroke();};
   ctx.lineJoin='round';line(ROOKVALE.samples,27,'#c6b497',true);line(ROOKVALE.samples,24,'#9c8163',true);
   ctx.save();ctx.beginPath();ctx.rect(0,z(35),canvas.width,canvas.height-z(35));ctx.clip();line(ROOKVALE.samples,24,'#4b5353',true);ctx.restore();
   for(const lane of ROOKVALE_LANES){line(lane.points,lane.width+1,'#c9bc9f');line(lane.points,lane.width,'#4b5353');}
   ctx.setLineDash([4*scale,7*scale]);for(const lane of ROOKVALE_LANES)line(lane.points,.25,'#ddba68');ctx.setLineDash([]);
   // Painted apron edge follows the gradual rise, without an invisible inner wall.
   ctx.strokeStyle='#d4b162';ctx.lineWidth=.3*scale;ctx.setLineDash([2*scale,3*scale]);ctx.strokeRect(x(-66),z(55),132*scale,110*scale);ctx.setLineDash([]);
   ctx.fillStyle='#d2c7aa';ctx.font='bold 60px monospace';ctx.textAlign='center';ctx.fillText('FREIGHT 04',x(0),z(5));
   const start=ROOKVALE.point(0);for(let i=0;i<24;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#e9e3d0':'#283335';ctx.fillRect(x(start.x-1+j),z(start.z-12+i+1),scale,scale);}
   for(let row=1;row<12;row++)for(const lane of [-2.4,2.4]){const p=ROOKVALE.point(-row*7/ROOKVALE.length);ctx.fillStyle='#dfd1ad';ctx.fillRect(x(p.x-2),z(p.z+lane+1),.2*scale,2*scale);}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;floorMaterial.color.set(0xffffff);
  }
 }
 const patch=ROOKVALE.terrainPatch();floorGeometry.setAttribute('position',new T.BufferAttribute(patch.positions,3));floorGeometry.setAttribute('uv',new T.BufferAttribute(patch.uv,2));floorGeometry.setIndex(new T.BufferAttribute(patch.indices,1));floorGeometry.computeVertexNormals();
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='rookvale_loading_apron';floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(finish)??[];batch.push(matrix.clone());batches.set(finish,batch);}
 ROOKVALE_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i%16<8?'concrete':'yellow',s.yaw));
 // Freight buildings, rails and cranes are beyond the containing walls.
 for(const x of [-150,-90,-30,30,90,150]){box(x,5.5,186,48,11,30,'blue');box(x,11.4,186,50,.8,32,'steel');for(const dx of [-15,0,15]){box(x+dx,3.2,170.9,10,6.4,.2,'steel');box(x+dx,6.6,170.7,10,.25,.3,'yellow');}}
 for(let x=-165;x<=165;x+=30)for(let row=0;row<2;row++){const z=-181-row*14;box(x,2.5,z,26,5,11,row?'blue':'red');for(let dx=-12;dx<=12;dx+=3)box(x+dx,2.5,z+5.6,.15,5,.15,'steel');}
 for(const side of [-1,1]){
  const x=side*218;for(const dx of [-2,2])box(x+dx,.16,0,.2,.3,310,'steel');for(let z=-150;z<=150;z+=4)box(x,.06,z,6,.12,.5,'concrete');
  for(const z of [-85,85]){box(x,13,z,1.3,26,1.3,'yellow');box(x-side*12,26,z,28,1.2,2,'yellow');box(x-side*24,22,z,.15,8,.15,'steel');box(x-side*24,18,z,2,.6,1,'steel');}
 }
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='rookvale_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=ROOKVALE_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
