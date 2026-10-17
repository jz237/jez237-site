import * as T from 'three';
import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
/** Original club garages, spectator activity and service yard beyond the south wall. */
export function createAshfordPaddock(){
 const root=new T.Group();root.name='ashford_paddock';
 const geometry=new T.BoxGeometry(),material=new T.MeshStandardMaterial({roughness:.88}),obj=new T.Object3D(),rows:{matrix:T.Matrix4;color:T.Color}[]=[];
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,color:number)=>{obj.position.set(x,y,z);obj.rotation.set(0,0,0);obj.scale.set(w,h,d);obj.updateMatrix();rows.push({matrix:obj.matrix.clone(),color:new T.Color(color)});};
 // Reuse the existing garage faces, adding shutters, windows and service equipment.
 for(let i=0;i<6;i++){
  const x=-65+i*26;
  for(const dx of [-7,0,7]){
   for(let line=0;line<10;line++)box(x+dx,.3+line*.32,-128.79,4.8,.035,.025,0x657584);
   box(x+dx,3.2,-128.72,4.4,.32,.04,0x263f4d);box(x+dx,3.2,-128.68,.07,.34,.04,0xd0c6a5);
   for(const side of [-1,1])box(x+dx+side*2.6,1.7,-128.65,.13,3.5,.2,0xd0c4a3);
  }
  box(x,4.7,-135,4,.35,6,0x7d8b92);box(x,5.15,-135,2,.6,3,0x394f60);
  box(x-8,.6,-124.8,2.5,1.2,1,0x9e583d);for(let j=0;j<3;j++)box(x-8,.3+j*.3,-124.26,2.2,.035,.05,0xd4bf93);
  for(const dx of [7,9]){box(x+dx,.65,-124.5,.65,1.3,.65,0x996c34);box(x+dx,.95,-124.15,.67,.16,.04,0xd6c595);}
  // Parked transporter behind each bay, with chassis, cab and split windscreen.
  box(x,2,-151,18,3.5,5.6,i%2?0x76878a:0xc0b79e);box(x,3.85,-151,18.3,.2,5.9,0x3f5765);
  box(x+11,1.6,-151,4.4,3.2,5.2,0x345571);box(x+11,2.5,-148.35,3.7,1.2,.06,0x293f45);box(x+11,2.5,-148.3,.08,1.25,.07,0xbdbfae);
  for(const dx of [-6,5,11])for(const dz of [-2.9,2.9])box(x+dx,.65,-151+dz,1.5,1.3,.5,0x283238);
 }
 // Safe rear approach: perimeter railing and light poles remain behind the garages.
 for(let x=-84;x<=84;x+=12){box(x,1,-165,.15,2,.15,0x707d7c);if(x<84)for(const y of [.6,1.4])box(x+6,y,-165,12,.08,.08,0x707d7c);}
 for(const x of [-84,-42,42,84]){box(x,5,-159,.2,10,.2,0x5b6970);box(x,10,-159,4,.2,.4,0x64767a);for(const dx of [-1.5,0,1.5])box(x+dx,9.8,-158.7,.8,.65,.3,0xd7d8b9);}
 // Speakers and brackets on the existing terrace roof.
 for(const x of [-65,-32,0,32,65]){box(x,5,-105.7,.75,1.1,.65,0x24343d);box(x,5.45,-106.4,.12,.3,1.5,0x53656c);}
 for(const x of [-20,20])box(x,7,-106,.18,3,.18,0x53656c);
 for(const x of [-16,16])box(x,5.4,-128.7,.15,1.8,.15,0x53656c);
 const mesh=new T.InstancedMesh(geometry,material,rows.length);mesh.name='ashford_pit_details';rows.forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
 // Extend only decorative ground behind the old plane; no drivable surface changes.
 const apronGeometry=new T.PlaneGeometry(340,60),apronMaterial=new T.MeshStandardMaterial({color:0x73764d,roughness:1}),apron=new T.Mesh(apronGeometry,apronMaterial);apron.name='ashford_service_apron';apron.rotation.x=-Math.PI/2;apron.position.set(0,0,-180);apron.receiveShadow=true;root.add(apron);
 const places:SpectatorPlace[]=[];
 for(let row=0;row<5;row++)for(let i=0;i<47;i++){if((i*13+row*7)%11===0)continue;places.push({x:-70+i*3,y:.6+row*.55,z:-107-row*2,yaw:0,seated:true});}
 const crowd=createVenueCrowd(places);root.add(crowd.root);crowd.root.children.forEach(o=>{o.castShadow=false;});
 const signs:{geometry:T.PlaneGeometry;material:T.MeshStandardMaterial;texture:T.CanvasTexture}[]=[];
 if(typeof document!=='undefined')for(const [text,x,y,z,width]of [['ASHFORD / BRAKES ARE A SUGGESTION',0,7.5,-106,42],['PIT LANE / EXCUSES REPAIRED HERE',0,6,-128.5,35]]as const){
  const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=192;const ctx=canvas.getContext('2d');if(!ctx)continue;ctx.fillStyle='#28465d';ctx.fillRect(0,0,1536,192);ctx.fillStyle='#eee1bb';ctx.font='bold 76px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,768,96,1480);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const geometry=new T.PlaneGeometry(width,width/12),material=new T.MeshStandardMaterial({map:texture,roughness:1,side:T.DoubleSide}),sign=new T.Mesh(geometry,material);sign.position.set(x,y,z);root.add(sign);signs.push({geometry,material,texture});
 }
 root.userData.spectatorCount=places.length;
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;crowd.dispose();root.removeFromParent();mesh.dispose();geometry.dispose();material.dispose();apronGeometry.dispose();apronMaterial.dispose();signs.forEach(s=>{s.geometry.dispose();s.material.dispose();s.texture.dispose();});root.clear();}};
}
