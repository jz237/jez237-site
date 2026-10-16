import * as T from 'three';
/** Original county-show machinery outside the arena wall. Shared geometry and
 * instancing keep the extra detail independent of the number of derby cars. */
export function createWrenfordPitLandmarks(){
 const root=new T.Group();root.name='wrenford_pit_landmarks';
 const mats={leaf:new T.MeshStandardMaterial({color:0x52633c,roughness:1}),grass:new T.MeshStandardMaterial({color:0x69704b,roughness:1}),rust:new T.MeshStandardMaterial({color:0x9d5435,roughness:.9}),cream:new T.MeshStandardMaterial({color:0xd4c7a1,roughness:.85}),steel:new T.MeshStandardMaterial({color:0x303b36,roughness:.7,metalness:.45}),rubber:new T.MeshStandardMaterial({color:0x242724,roughness:1}),yellow:new T.MeshStandardMaterial({color:0xcba94a,roughness:.8}),water:new T.MeshStandardMaterial({color:0x627c74,roughness:.6,metalness:.25})};
 const geometry={hill:new T.SphereGeometry(1,16,8),box:new T.BoxGeometry(),cylinder:new T.CylinderGeometry(1,1,1,16),cone:new T.ConeGeometry(1,1,16)};
 const treeGeometry:T.BufferGeometry[]=[],treeMaterials:T.Material[]=[],treeTextures:T.Texture[]=[],treePoints:{x:number;z:number;size:number}[]=[];
 const batches=new Map<string,T.Matrix4[]>(),temp=new T.Object3D();
 function part(shape:keyof typeof geometry,finish:keyof typeof mats,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){temp.position.set(x,y,z);temp.rotation.set(rx,ry,rz);temp.scale.set(w,h,d);temp.updateMatrix();const key=shape+':'+finish,list=batches.get(key)??[];list.push(temp.matrix.clone());batches.set(key,list);}
 function bar(finish:keyof typeof mats,a:T.Vector3,b:T.Vector3,width:number){temp.position.copy(a).add(b).multiplyScalar(.5);temp.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());temp.scale.set(width,a.distanceTo(b),width);temp.updateMatrix();const key='box:'+finish,list=batches.get(key)??[];list.push(temp.matrix.clone());batches.set(key,list);}
 // Elevated water tank: weathered panels, ladder, roof cap and cross-braced legs.
 const x=-62,z=-8;
 for(const dx of [-2,2])for(const dz of [-2,2]){part('box','steel',x+dx,7,z+dz,.24,14,.24);part('box','cream',x+dx,.25,z+dz,1.1,.5,1.1);}
 for(const side of [-1,1])for(let row=0;row<3;row++){const y=1+row*4;bar('rust',new T.Vector3(x-2,y,z+side*2),new T.Vector3(x+2,y+4,z+side*2),.13);bar('rust',new T.Vector3(x-2,y+4,z+side*2),new T.Vector3(x+2,y,z+side*2),.13);}
 part('cylinder','water',x,16,z,3.4,5,3.4);part('cone','steel',x,19,z,3.65,1.2,3.65);part('cylinder','rust',x,13.5,z,3.48,.15,3.48);part('cylinder','cream',x,18.5,z,3.48,.14,3.48);
 for(let i=0;i<16;i++){const a=i*Math.PI/8;part('box','rust',x+Math.sin(a)*3.42,16,z+Math.cos(a)*3.42,.06,4.8,.06);}
 for(const dx of [-.45,.45])part('box','steel',x+dx,9,z+3.7,.08,18,.08);for(let y=.6;y<18;y+=.45)part('box','cream',x,y,z+3.7,.95,.055,.08);
 // Recovery crane in a service-gate gap; boom and hanging hook stay outside wall.
 const cx=8,cz=62;part('box','yellow',cx,1.2,cz,3.8,1.6,7);part('box','steel',cx,1.9,cz,4,.25,7.2);
 for(const side of [-1,1])for(const dz of [-2.3,2.3]){part('cylinder','rubber',cx+side*2,1,cz+dz,1, .55,1,0,0,Math.PI/2);part('cylinder','cream',cx+side*2.3,1,cz+dz,.5,.08,.5,0,0,Math.PI/2);}
 part('box','cream',cx,3,cz+1.9,3.4,2.3,2.5);part('box','water',cx,3.2,cz+3.17,2.9,1.2,.06);part('box','yellow',cx,4.3,cz+1.9,3.7,.22,2.8);
 part('cylinder','rust',cx,2.4,cz-1.5,1.5,.7,1.5);
 const a=new T.Vector3(cx,3,cz-1.5),b=new T.Vector3(cx,13,cz-11);bar('yellow',a,b,.65);bar('steel',new T.Vector3(cx,3.8,cz+.2),new T.Vector3(cx,9,cz-7),.25);bar('steel',b,new T.Vector3(cx,6,cz-11),.055);part('box','rust',cx,5.6,cz-11,.4,.8,.3);part('box','rust',cx+.22,5.25,cz-11,.65,.14,.3);
 for(const side of [-1,1]){part('box','steel',cx+side*3,1.2,cz-1,3,.2,.3);part('box','yellow',cx+side*4.4,.65,cz-1,.2,1.2,.2);part('box','cream',cx+side*4.4,.1,cz-1,.8,.2,.8);}
 // Tall pennant masts and stacked tyre/barrel stations frame the service gates.
 for(let i=0;i<4;i++){const angle=i*Math.PI/2+.12,px=Math.sin(angle)*59,pz=Math.cos(angle)*59;part('box','steel',px,5.2,pz,.12,10.4,.12);for(let n=0;n<3;n++)part('box',n%2?'cream':'rust',px+1,9.6-n*.65,pz,1.8,.4,.06,0,angle);
 for(let n=0;n<5;n++){const tx=px+Math.cos(angle)*(n-2)*.9,tz=pz-Math.sin(angle)*(n-2)*.9;part('cylinder','rubber',tx,.6,tz,.55,1.2,.55);part('cylinder','yellow',tx,.65,tz,.56,.14,.56);}}
 // Rolling farmland and irregular tree groups close the horizon beyond the showground.
 for(let i=0;i<16;i++){const a=i*Math.PI/8,r=166+(i%3)*12;part('hill','grass',Math.sin(a)*r,-3,Math.cos(a)*r,40+(i%4)*7,10+(i%3)*4,37+(i%5)*5);}
 for(let i=0;i<96;i++){const a=i*Math.PI/48+.025*Math.sin(i*7),r=108+(i%5)*7,tx=Math.sin(a)*r,tz=Math.cos(a)*r,h=6+(i%7)*.8;treePoints.push({x:tx,z:tz,size:h*1.35});if(typeof document==='undefined'){part('cylinder','rust',tx,h*.35,tz,.24,h*.7,.24);part('cone','leaf',tx,h*.72,tz,2.4+(i%3)*.5,h*.8,2.4+(i%3)*.5);part('cone','leaf',tx,h*1.02,tz,1.8+(i%3)*.35,h*.65,1.8+(i%3)*.35);}}
 if(typeof document!=='undefined')for(const [index,kind,aspect]of [[0,'pine',461/1024],[1,'spruce',402/1024],[2,'maple',712/1024]]as const){
  const points=treePoints.filter((_,i)=>i%3===index),photo=new T.TextureLoader().load(import.meta.env.BASE_URL+'models/'+kind+'.webp');photo.colorSpace=T.SRGBColorSpace;treeTextures.push(photo);
  const material=new T.MeshStandardMaterial({map:photo,alphaTest:.45,roughness:1,color:0xbac4b0,side:T.DoubleSide});treeMaterials.push(material);
  material.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`vec3 center=(modelMatrix*instanceMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;vec3 right=normalize(vec3(viewMatrix[0][0],0.0,viewMatrix[2][0]));vec3 billboard=center+right*position.x*length(instanceMatrix[0].xyz)+vec3(0.0,position.y*length(instanceMatrix[1].xyz),0.0);vec4 mvPosition=viewMatrix*vec4(billboard,1.0);gl_Position=projectionMatrix*mvPosition;`);};material.customProgramCacheKey=()=> 'pit-tree-billboard-v1';
  const geo=new T.PlaneGeometry(aspect,1);geo.translate(0,.5,0);treeGeometry.push(geo);const trees=new T.InstancedMesh(geo,material,points.length);trees.name='wrenford_tree_belt_'+kind;
  points.forEach((p,i)=>{const m=new T.Matrix4().makeScale(p.size,p.size,p.size);m.setPosition(p.x,0,p.z);trees.setMatrixAt(i,m)});trees.computeBoundingSphere();root.add(trees);
 }
 const signGeo=new T.PlaneGeometry(6,2.6),signMat=new T.MeshStandardMaterial({color:0xe4d4a3,roughness:.9,side:T.DoubleSide});let texture:T.CanvasTexture|undefined;
 if(typeof document!=='undefined'){const c=document.createElement('canvas');c.width=768;c.height=320;const ctx=c.getContext('2d');if(ctx){ctx.fillStyle='#263d32';ctx.fillRect(0,0,768,320);ctx.strokeStyle='#c6a259';ctx.lineWidth=12;ctx.strokeRect(10,10,748,300);ctx.fillStyle='#f0dfb0';ctx.textAlign='center';ctx.font='bold 76px sans-serif';ctx.fillText('MUD HAPPENS',384,125);ctx.font='30px sans-serif';ctx.fillText('WRENFORD RECOVERY CREW',384,198);ctx.fillText('WE TOW. YOU EXPLAIN.',384,253);texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;signMat.map=texture;}}
 const sign=new T.Mesh(signGeo,signMat);sign.name='wrenford_recovery_sign';sign.position.set(x+3.6,16,z);sign.rotation.y=Math.PI/2;root.add(sign);
 for(const[key,matrices]of batches){const[shape,finish]=key.split(':')as[keyof typeof geometry,keyof typeof mats];const mesh=new T.InstancedMesh(geometry[shape],mats[finish],matrices.length);mesh.name='wrenford_landmark_'+key;matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.instanceCount=[...batches.values()].reduce((n,v)=>n+v.length,0);let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose()});Object.values(geometry).forEach(g=>g.dispose());Object.values(mats).forEach(m=>m.dispose());signGeo.dispose();signMat.dispose();texture?.dispose();treeGeometry.forEach(g=>g.dispose());treeMaterials.forEach(m=>m.dispose());treeTextures.forEach(t=>t.dispose());root.clear();}};
}
