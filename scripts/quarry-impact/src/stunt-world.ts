import * as T from 'three';
import {STUNT_PARK} from './stunt-course';
import {STUNT_LOOP,STUNT_RAMPS,STUNT_BARRIERS,STUNT_SUPPORTS,stuntLoopMesh,stuntRampMesh} from './stunt-layout';
import {freezeSceneryTransforms} from './render-work';
export function createStuntWorld(){
 const root=new T.Group();root.name='alderwick_stunt_park';
 const materials={floor:new T.MeshStandardMaterial({color:0x676f6c,roughness:1}),track:new T.MeshStandardMaterial({color:0x408687,roughness:.8,metalness:.15,side:T.DoubleSide}),ramp:new T.MeshStandardMaterial({color:0xc18b43,roughness:.95}),steel:new T.MeshStandardMaterial({color:0x344b53,roughness:.65,metalness:.5}),concrete:new T.MeshStandardMaterial({color:0xd3cbb3,roughness:.95}),yellow:new T.MeshStandardMaterial({color:0xd9a34c,roughness:.95})};
 const geometries:T.BufferGeometry[]=[],textures:T.Texture[]=[];
 const geometry=(mesh:{positions:Float32Array;indices:Uint32Array;uv?:Float32Array})=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(mesh.positions,3));g.setIndex(new T.BufferAttribute(mesh.indices,1));if(mesh.uv)g.setAttribute('uv',new T.BufferAttribute(mesh.uv,2));g.computeVertexNormals();geometries.push(g);return g;};
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=2400;canvas.height=2100;const ctx=canvas.getContext('2d');
  if(ctx){const scale=5,x=(v:number)=>1200+v*scale,z=(v:number)=>1050-v*scale;ctx.fillStyle='#6b716c';ctx.fillRect(0,0,2400,2100);let seed=2704;
   for(let i=0;i<42000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const px=seed%2400;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#5e6663':'#788079';ctx.fillRect(px,seed%2100,3,3);}
   const line=(points:readonly{x:number;z:number}[],width:number,color:string,closed=false)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(x(p.x),z(p.z)):ctx.moveTo(x(p.x),z(p.z)));if(closed)ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=width*scale;ctx.stroke();};
   ctx.lineJoin='round';line(STUNT_PARK.samples,27,'#d5ccb3',true);line(STUNT_PARK.samples,24,'#424d4d',true);
   const start=STUNT_PARK.practiceSpawn,yaw=start.yaw;
   line([{x:start.x,z:start.z},{x:STUNT_LOOP.x,z:STUNT_LOOP.z}],11,'#384f51');
   line([{x:65,z:-115},{x:65,z:90}],22,'#4b5150');line([{x:125,z:-75},{x:125,z:65}],18,'#4b5150');
   const arrow=(px:number,pz:number,angle:number)=>{ctx.save();ctx.translate(x(px),z(pz));ctx.rotate(angle);ctx.fillStyle='#e2c784';ctx.beginPath();ctx.moveTo(0,-5*scale);ctx.lineTo(3*scale,0);ctx.lineTo(scale,0);ctx.lineTo(scale,5*scale);ctx.lineTo(-scale,5*scale);ctx.lineTo(-scale,0);ctx.lineTo(-3*scale,0);ctx.closePath();ctx.fill();ctx.restore();};
   for(const d of [15,40,65,90,115])arrow(start.x+Math.sin(yaw)*d,start.z+Math.cos(yaw)*d,yaw);
   for(const pz of [-100,-75,-55]){arrow(65,pz,0);if(pz>=-75)arrow(125,pz,0);}
   ctx.fillStyle='#e4d7ae';ctx.textAlign='center';ctx.font='bold 34px sans-serif';ctx.fillText('LOOP / RAVINE RECOMMENDED',x(-70),z(-150));ctx.fillText('JUMP / 80–100 KM/H',x(65),z(-122));ctx.font='bold 23px sans-serif';ctx.fillText('TRAINING RAMPS',x(125),z(-80));
   ctx.fillStyle='#d29f49';for(let row=0;row<10;row++)for(let col=0;col<8;col++)if((row+col)%2===0)ctx.fillRect(x(55+col*2.5),z(-row*2),2.5*scale,2*scale);
   const p=STUNT_PARK.point(0);for(let i=0;i<24;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#ece6d7':'#263432';ctx.fillRect(x(p.x-1+j),z(p.z-12+i+1),scale,scale);}
   const texture=new T.CanvasTexture(canvas);texture.flipY=false;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;textures.push(texture);materials.floor.map=texture;materials.floor.color.set(0xffffff);
  }
 }
 const floorGeometry=new T.PlaneGeometry(480,420);geometries.push(floorGeometry);const floor=new T.Mesh(floorGeometry,materials.floor);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const loop=new T.Mesh(geometry(stuntLoopMesh()),materials.track);loop.name='driveable_helical_loop';loop.castShadow=loop.receiveShadow=true;root.add(loop);
 for(const ramp of STUNT_RAMPS){const mesh=new T.Mesh(geometry(stuntRampMesh(ramp)),materials.ramp);mesh.name=ramp.id;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);}
 const boxGeometry=new T.BoxGeometry();geometries.push(boxGeometry);const batches=new Map<keyof typeof materials,T.Matrix4[]>();
 const box=(x:number,y:number,z:number,half:readonly[number,number,number],finish:keyof typeof materials,yaw=0)=>{const m=new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),yaw),new T.Vector3(...half).multiplyScalar(2));const list=batches.get(finish)??[];list.push(m);batches.set(finish,list);};
 STUNT_BARRIERS.forEach((s,i)=>box(s.x,s.y,s.z,s.half,i%16<8?'concrete':'yellow',s.yaw));STUNT_SUPPORTS.forEach(s=>box(s.x,s.y,s.z,s.half,'steel'));
 // Service buildings sit outside the collision boundary.
 for(const x of [-130,-50,50,130]){box(x,5,200,[27,5,12],'concrete');box(x,10.4,200,[28,.4,13],'steel');}
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='alderwick_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 freezeSceneryTransforms(root);let disposed=false;
 return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
