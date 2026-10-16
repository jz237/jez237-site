import {foundryHeight} from './foundry-arena';
import * as T from 'three';

/** Original industrial backdrop, entirely outside the playable containment wall. */
export function createFoundryIndustrial(){
 const root=new T.Group();root.name='foundry_industrial_backdrop';
 const materials={steel:new T.MeshStandardMaterial({color:0x394f51,roughness:.72,metalness:.5}),rust:new T.MeshStandardMaterial({color:0x8c4b32,roughness:.92,metalness:.2}),cream:new T.MeshStandardMaterial({color:0xc1b794,roughness:.85}),yellow:new T.MeshStandardMaterial({color:0xd5a039,roughness:.78}),dark:new T.MeshStandardMaterial({color:0x263133,roughness:1}),glass:new T.MeshStandardMaterial({color:0x92c8c7,roughness:.3,metalness:.45}),brick:new T.MeshStandardMaterial({color:0x704c42,roughness:1})};
 type Finish=keyof typeof materials;
 const geometries={box:new T.BoxGeometry(),tube:new T.CylinderGeometry(1,1,1,12),cap:new T.ConeGeometry(1,1,12)};
 const batches=new Map<string,{shape:keyof typeof geometries;finish:Finish;matrices:T.Matrix4[]}>();
 const up=new T.Vector3(0,1,0),identity=new T.Quaternion();
 function piece(shape:keyof typeof geometries,finish:Finish,x:number,y:number,z:number,sx:number,sy:number,sz:number,q=identity){
  const key=shape+'_'+finish;let b=batches.get(key);if(!b){b={shape,finish,matrices:[]};batches.set(key,b);}b.matrices.push(new T.Matrix4().compose(new T.Vector3(x,y,z),q,new T.Vector3(sx,sy,sz)));
 }
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number)=>piece('box',f,x,y,z,w,h,d);
 function beam(f:Finish,a:number[],b:number[],width=.16){const delta=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);piece('box',f,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,delta.length(),width,new T.Quaternion().setFromUnitVectors(up,delta.normalize()));}
 function pipe(f:Finish,a:number[],b:number[],radius=.35){const delta=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);piece('tube',f,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,radius,delta.length(),radius,new T.Quaternion().setFromUnitVectors(up,delta.normalize()));}
 function rail(x:number,z:number,w:number,d:number,y:number){
  for(const side of [-1,1]){for(const h of [.55,1.1]){beam('yellow',[x-w/2,y+h,z+side*d/2],[x+w/2,y+h,z+side*d/2],.07);beam('yellow',[x+side*w/2,y+h,z-d/2],[x+side*w/2,y+h,z+d/2],.07);}}
  for(let dx=-w/2;dx<=w/2+.01;dx+=w/8)for(const side of [-1,1])beam('steel',[x+dx,y,z+side*d/2],[x+dx,y+1.15,z+side*d/2],.09);
 }
 // North melt shop: roof monitors, many window panes, masonry courses and a loading gallery.
 for(let x=-33;x<=33;x+=11){box('steel',x,19,-67,7,5,8);box('dark',x,21.7,-67,8,.5,9);for(let j=-2;j<=2;j++){box('glass',x+j*1.2,19.8,-62.95,.95,1.9,.08);box('cream',x+j*1.2,18.3,-62.85,.98,.18,.1);}}
 for(let y=2;y<16;y+=1.4)for(let x=-37;x<38;x+=4)box('brick',x+(Math.round(y)%2?1:0),y,-57.45,3.85,.12,.08);
 box('steel',0,8,-55.9,78,.32,2);rail(0,-55.9,78,2,8);
 for(let x=-36;x<=36;x+=12){beam('steel',[x,0,-56.5],[x,8,-56.5],.25);beam('steel',[x,5,-57],[x,8,-55],.18);}
 // East processing tower and silos give a visible silhouette over the wall.
 for(const z of [-35,-18,-1,16]){
  const x=80,h=18+(z+35)/17*2;
  piece('tube','cream',x,h/2+4,z,5,h,5);piece('cap','steel',x,h+5.5,z,5.4,3,5.4);
  for(let y=5;y<h+4;y+=3)piece('tube','steel',x,y,z,5.08,.14,5.08);
  for(const dx of [-3.5,3.5])for(const dz of [-3.5,3.5])beam('steel',[x+dx,0,z+dz],[x+dx,5,z+dz],.4);
  for(let y=4;y<h+5;y+=.45)beam('yellow',[x-5.25,y,z-.35],[x-5.25,y,z+.35],.06);
  for(const dz of [-.4,.4])beam('steel',[x-5.25,3,z+dz],[x-5.25,h+5,z+dz],.09);
 }
 // Chimney cluster: bands, access platforms and braced service frames.
 for(const [x,z,h]of [[-29,-84,38],[-12,-84,46],[5,-84,34]]){
  piece('tube','brick',x,h/2,z,2.6,h,2.6);piece('tube','dark',x,h+.05,z,2.8,.4,2.8);
  for(let y=5;y<h;y+=5)piece('tube','cream',x,y,z,2.65,.5,2.65);
  box('steel',x,h*.65,z,8,.3,8);rail(x,z,8,8,h*.65);
 }
 // West pipe rack: exposed ducts, flanges, cross-bracing and overhead walkways.
 for(const x of [-68,-74]){
  for(const z of [-42,-21,0,21,42]){beam('steel',[x,0,z],[x,13,z],.4);beam('rust',[x,2,z],[x,12,z+15],.16);}
  for(const y of [9,11,13]){pipe(y===11?'rust':'cream',[x,y,-43],[x,y,49],.5);for(let z=-40;z<=45;z+=5)pipe('steel',[x,y,z-.09],[x,y,z+.09],.67);}
 }
 for(const z of [-42,-21,0,21,42])beam('yellow',[-76,8,z],[-65,8,z],.3);
 box('dark',-71,7.7,3,10,.25,94);rail(-71,3,10,94,7.7);
 // South loading sheds and gantry bracing; varied scrap shapes remain behind the wall.
 for(const x of [-47,-20,7,34]){
  box('rust',x,6,80,23,12,16);box('steel',x,12.4,80,25,.7,18);
  for(let dx=-10;dx<=10;dx+=1.1)box('cream',x+dx,6,71.9,.07,11.5,.12);
  box('dark',x,4.3,71.75,9,8.5,.15);for(const dx of [-4.6,4.6])box('yellow',x+dx,3,71.5,.3,6,.3);
  for(let j=0;j<6;j++)box('glass',x-7.5+j*3,10.6,71.6,2.2,1.5,.1);
 }
 for(const x of [-37,37]){beam('rust',[x-2,3,62],[x+2,18,62],.23);beam('rust',[x+2,3,62],[x-2,18,62],.23);}
 for(let x=-33;x<34;x+=6){beam('steel',[x,19,61],[x+6,22,61],.18);beam('steel',[x,22,61],[x+6,19,61],.18);}beam('yellow',[-37,22,61],[37,22,61],.3);
 for(let i=0;i<45;i++){const x=-53+i%15*7.5,z=58+Math.floor(i/15)*3.2;const y=1+((i*17)%7)*.18;piece('box',i%3?'rust':'steel',x,y,z,2.5,y*2,1.7,new T.Quaternion().setFromEuler(new T.Euler(.1*(i%3),i*1.7,.12*(i%4))));}
 for(const b of batches.values()){const mesh=new T.InstancedMesh(geometries[b.shape],materials[b.finish],b.matrices.length);b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='foundry_detail_'+b.shape+'_'+b.finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 // Match the old160m terrain boundary, then taper into a broad industrial apron.
 // This is backdrop only; the unchanged arena walls contain every driving route.
 const apronGeometry=new T.PlaneGeometry(320,320,80,80);apronGeometry.rotateX(-Math.PI/2);
 const position=apronGeometry.getAttribute('position'),colors=new Float32Array(position.count*3),color=new T.Color();
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),z=position.getZ(i),edge=Math.max(Math.abs(x),Math.abs(z)),t=Math.max(0,Math.min(1,(edge-90)/60));
  position.setY(i,foundryHeight(x,z)*(1-t)-.03);
  const variation=Math.sin(x*1.13+z*.71)*Math.cos(z*.93-x*.37)*.025;color.setRGB(.23+variation,.25+variation,.18+variation);color.toArray(colors,i*3);
 }
 const apronIndices:number[]=[];const index=apronGeometry.index!;
 for(let i=0;i<index.count;i+=3){const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)];if(ids.some(id=>Math.max(Math.abs(position.getX(id)),Math.abs(position.getZ(id)))>80))apronIndices.push(...ids);}
 apronGeometry.setIndex(apronIndices);
 apronGeometry.setAttribute('color',new T.BufferAttribute(colors,3));apronGeometry.computeVertexNormals();
 const apronMaterial=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:1});const apron=new T.Mesh(apronGeometry,apronMaterial);apron.name='foundry_outer_apron';apron.receiveShadow=true;root.add(apron);
 const signGeometry=new T.PlaneGeometry(1,1),signMaterial=new T.MeshStandardMaterial({color:0xe1c66a,roughness:.9,side:T.DoubleSide});let signTexture:T.CanvasTexture|undefined;
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#233738';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#d8af4d';ctx.lineWidth=14;ctx.strokeRect(12,12,1000,232);ctx.textAlign='center';ctx.fillStyle='#f1d98b';ctx.font='bold 76px sans-serif';ctx.fillText('FOUNDRY BREAKERS',512,112);ctx.font='bold 35px sans-serif';ctx.fillText('PROUDLY RECYCLING YOUR LAP TIMES',512,185);signTexture=new T.CanvasTexture(canvas);signTexture.colorSpace=T.SRGBColorSpace;signMaterial.map=signTexture;signMaterial.color.set(0xffffff);}
 }
 for(const [x,y,z,yaw]of [[0,12,-55.3,0],[0,16,61.4,Math.PI],[-64,14,0,Math.PI/2]]){const sign=new T.Mesh(signGeometry,signMaterial);sign.name='foundry_breakers_sign';sign.position.set(x,y,z);sign.rotation.y=yaw;sign.scale.set(22,5.5,1);root.add(sign);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});apronGeometry.dispose();apronMaterial.dispose();signGeometry.dispose();signMaterial.dispose();signTexture?.dispose();Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());root.clear();}};
}
