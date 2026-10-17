import * as T from 'three';
import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
/** Temporary club-racing facilities fitted around the working freight yard. */
export function createRookvaleRaceVenue(){
 const root=new T.Group();root.name='rookvale_race_venue';
 const geometry=new T.BoxGeometry(),material=new T.MeshStandardMaterial({roughness:.88});
 const object=new T.Object3D(),rows:{matrix:T.Matrix4;color:T.Color}[]=[],places:SpectatorPlace[]=[];
 function box(x:number,y:number,z:number,w:number,h:number,d:number,color:number){object.position.set(x,y,z);object.quaternion.identity();object.scale.set(w,h,d);object.updateMatrix();rows.push({matrix:object.matrix.clone(),color:new T.Color(color)});}
 const steel=0x38494b,wood=0x97866c,cream=0xd6c9aa,red=0xa04f3e,yellow=0xc9a24e;
 // Narrow modular terraces between the wall and railway. Treads rise away from the track.
 for(const side of [-1,1])for(const center of [-120,120]){
  for(let row=0;row<3;row++){
   const x=side*(207.3+row*1.25),y=2.25+row*.65;
   box(x,y-.12,center,1.2,.24,30,wood);
   for(const dz of [-14,-7,0,7,14])box(x,(y-.24)/2,center+dz,.13,y-.24,.13,steel);
   for(let seat=0;seat<16;seat++){if((seat+row)%7===0)continue;places.push({x,y,z:center-13.5+seat*1.8,yaw:-side*Math.PI/2,seated:true});}
  }
  box(side*210.6,4.5,center,.1,.1,30,cream);
  for(const dz of [-15,-7.5,0,7.5,15])box(side*210.6,3.1,center+dz,.1,2.8,.1,steel);
  // Clearly supported striped canopy and end railings.
  for(const dx of [206.8,210.7])for(const dz of [-15,15])box(side*dx,3.1,center+dz,.14,6.2,.14,steel);
  for(let panel=0;panel<10;panel++)box(side*208.8,6.25,center-13.5+panel*3,4.7,.12,3,panel%2?cream:red);
  for(const dz of [-15,15])for(const y of [3.9,4.5])box(side*208.8,y,center+dz,4,.08,.08,cream);
 }
 // Container-top viewing decks above the south freight stacks.
 for(const x of [-105,105]){
  box(x,5.15,-181,25,.3,9,wood);
  for(const dz of [-185,-177]){box(x,6.25,dz,25,.08,.08,cream);for(let dx=-12;dx<=12;dx+=4)box(x+dx,5.7,dz,.1,1.1,.1,steel);}
  for(const dx of [-12,12])box(x+dx,6.25,-181,.08,.08,8,cream);
  for(let row=0;row<2;row++)for(let seat=0;seat<12;seat++)places.push({x:x-10.5+seat*1.9,y:5.3,z:-179-row*2,yaw:0,seated:false});
 }
 // Club timing box on a scaffold, in the gap ahead of the container stacks.
 for(const x of [-3.2,3.2])for(const z of [-172,-168])box(x,3.5,z,.22,7,.22,steel);
 box(0,7,-170,7.4,.3,4.6,steel);box(0,8.6,-170,7,3,4,cream);
 box(0,8.8,-167.96,6.3,1.5,.08,0x344f57);for(const x of [-2,0,2])box(x,8.8,-167.89,.1,1.5,.1,steel);
 box(0,10.22,-170,8,.2,5.2,red);box(0,7.1,-167.86,6.8,.35,.12,yellow);
 for(let i=0;i<14;i++)box(-4.5,1+i*.44,-171,1.5,.18,.8,wood);
 for(const x of [-5.3,-3.7])box(x,3.6,-171,.1,7.2,.1,steel);
 // Four corner pennant masts give spectators recognizable turn landmarks.
 for(const side of [-1,1])for(const z of [-155,155]){box(side*209,5.5,z,.18,11,.18,cream);box(side*210.4,9.8,z,2.7,1.7,.06,z<0?red:yellow);}
 const mesh=new T.InstancedMesh(geometry,material,rows.length);mesh.name='rookvale_race_facilities';rows.forEach((r,i)=>{mesh.setMatrixAt(i,r.matrix);mesh.setColorAt(i,r.color);});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
 const crowd=createVenueCrowd(places);crowd.root.name='rookvale_race_crowd';for(const child of crowd.root.children)child.castShadow=false;root.add(crowd.root);root.userData.spectatorCount=places.length;
 const banners:{geometry:T.PlaneGeometry;material:T.MeshBasicMaterial;texture:T.CanvasTexture;mesh:T.InstancedMesh}[]=[];
 if(typeof document!=='undefined')for(const [index,label]of ['BENT FREIGHT / WE DELIVER MOST OF IT','ROOKVALE MOTOR CLUB','DENTAL PLAN / BODY REPAIRS','MISPLACED CARGO / FOUND YOUR LIMIT'].entries()){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const ctx=canvas.getContext('2d');if(!ctx)continue;
  ctx.fillStyle=index%2?'#ad503b':'#294a50';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#e8d8aa';ctx.fillRect(0,0,1024,7);ctx.fillRect(0,121,1024,7);ctx.font='bold 40px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,512,65,980);
  for(let j=0;j<130;j++){ctx.fillStyle=j%2?'#d0bb9425':'#27353330';ctx.fillRect((j*193)%1024,(j*43)%128,4+j%18,1+j%3);}
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const geo=new T.PlaneGeometry(25,1.55),mat=new T.MeshBasicMaterial({map:texture}),batch=new T.InstancedMesh(geo,mat,6);batch.name='rookvale_wall_banner_'+index;
  for(let i=0;i<6;i++){const north=i>=3;object.position.set(-155+index*27+(i%3)*110,1.12,north?164.48:-164.48);object.rotation.set(0,north?Math.PI:0,0);object.scale.set(1,1,1);object.updateMatrix();batch.setMatrixAt(i,object.matrix);}
  batch.computeBoundingSphere();root.add(batch);banners.push({geometry:geo,material:mat,texture,mesh:batch});
 }
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;crowd.dispose();mesh.dispose();geometry.dispose();material.dispose();banners.forEach(b=>{b.mesh.dispose();b.geometry.dispose();b.material.dispose();b.texture.dispose();});root.removeFromParent();root.clear();}};
}
