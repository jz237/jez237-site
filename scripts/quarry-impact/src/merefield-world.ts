import * as T from 'three';
import {MEREFIELD,MEREFIELD_BARRIERS,MEREFIELD_RUNWAYS} from './merefield-course';
import {freezeSceneryTransforms} from './render-work';
export function createMerefieldWorld(){
 const root=new T.Group();root.name='merefield_airfield';
 const materials={concrete:new T.MeshStandardMaterial({color:0xd3c8ae,roughness:.98}),yellow:new T.MeshStandardMaterial({color:0xd8ab49,roughness:.9}),steel:new T.MeshStandardMaterial({color:0x3c4e55,roughness:.75,metalness:.3}),wall:new T.MeshStandardMaterial({color:0x8a9994,roughness:.95}),glass:new T.MeshStandardMaterial({color:0x43657a,roughness:.35,metalness:.2})};
 const floorMaterial=new T.MeshStandardMaterial({color:0xa39574,roughness:1}),floorGeometry=new T.PlaneGeometry(500,420),boxGeometry=new T.BoxGeometry(),textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2500;canvas.height=2100;const ctx=canvas.getContext('2d');
  if(ctx){
   const scale=5,x=(v:number)=>1250+v*scale,z=(v:number)=>1050-v*scale;
   ctx.fillStyle='#a39574';ctx.fillRect(0,0,2500,2100);let seed=919;
   for(let i=0;i<48000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const px=seed%2500;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#94896c':'#b09f79';ctx.fillRect(px,seed%2100,3,3);}
   const line=(points:readonly {x:number;z:number}[],width:number,color:string,closed=false)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));if(closed)ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=width*scale;ctx.stroke();};
   ctx.lineJoin='round';line(MEREFIELD.samples,27,'#dad1b7',true);line(MEREFIELD.samples,24,'#555a59',true);
   for(const r of MEREFIELD_RUNWAYS){line(r.points,r.width+1,'#d3cbb7');line(r.points,r.width,'#555a59');}
   ctx.setLineDash([6*scale,9*scale]);for(const r of MEREFIELD_RUNWAYS)line(r.points,.35,'#e1decd');ctx.setLineDash([]);
   // Threshold stripes and numbers distinguish the runways from the perimeter race lane.
   ctx.fillStyle='#e1decd';for(const end of [-1,1])for(let i=-4;i<=4;i++)ctx.fillRect(x(end*172-3),z(i*2+1),6*scale,.7*scale);
   ctx.textAlign='center';ctx.font='bold 65px monospace';ctx.fillText('09',x(-152),z(4));ctx.fillText('27',x(152),z(4));
   const start=MEREFIELD.point(0);for(let i=0;i<24;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#ece6d7':'#222e32';ctx.fillRect(x(start.x-1+j),z(start.z-12+i+1),scale,scale);}
   for(let row=1;row<12;row++)for(const lane of [-2.4,2.4]){const p=MEREFIELD.point(-row*7/MEREFIELD.length);ctx.fillStyle='#e1d7bb';ctx.fillRect(x(p.x-2),z(p.z+lane+1),.2*scale,2*scale);}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);floorMaterial.map=texture;floorMaterial.color.set(0xffffff);
  }
 }
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='merefield_runways';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const batches=new Map<keyof typeof materials,T.Matrix4[]>(),matrix=new T.Matrix4(),q=new T.Quaternion();
 function box(x:number,y:number,z:number,w:number,h:number,d:number,finish:keyof typeof materials,yaw=0){q.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const batch=batches.get(finish)??[];batch.push(matrix.clone());batches.set(finish,batch);}
 MEREFIELD_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,i%16<8?'concrete':'yellow',s.yaw));
 // All buildings remain beyond the perimeter wall, leaving freely crossable infields.
 for(const x of [-150,-75,0,75,150]){box(x,7,194,52,14,28,'wall');box(x,14.3,194,55,.6,31,'steel');box(x,5.5,179.9,38,11,.2,'steel');for(let dx=-23;dx<=23;dx+=4)box(x+dx,7,179.7,.18,14,.15,'concrete');}
 box(-237,9,15,13,18,15,'concrete');box(-237,21,15,24,6,24,'glass');box(-237,24.4,15,27,.8,27,'steel');box(-237,28,15,.3,7,.3,'steel');
 for(let x=-180;x<=180;x+=30){box(x,.4,-183,.4,.8,.4,'yellow');box(x,.4,183,.4,.8,.4,'yellow');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='merefield_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.solidRecords=MEREFIELD_BARRIERS;freezeSceneryTransforms(root);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});floorGeometry.dispose();boxGeometry.dispose();floorMaterial.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
