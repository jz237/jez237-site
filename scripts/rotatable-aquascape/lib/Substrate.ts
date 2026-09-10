import * as T from 'three';

/** A shared, irregular boundary keeps the sand and encroaching carpet in agreement. */
export function sandChannel(z:number){
 const center=1.5+Math.sin(z*1.05)*.65,width=.42+(z+2.2)*.16;
 return {left:center-width+Math.sin(z*8.1)*.055+Math.sin(z*22.3+.8)*.025,right:center+width+Math.sin(z*6.4+.5)*.075+Math.sin(z*19.7)*.023};
}

export function buildAquariumSubstrate(scene:T.Scene,height:(x:number,z:number)=>number,time:{value:number}){
 let seed=823713;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const material=(sand:boolean)=>{
  const canvas=document.createElement('canvas'),bump=document.createElement('canvas');canvas.width=canvas.height=bump.width=bump.height=1024;
  const ctx=canvas.getContext('2d')!,relief=bump.getContext('2d')!;
  ctx.fillStyle=sand?'#9a8d73':'#292a21';ctx.fillRect(0,0,1024,1024);relief.fillStyle='#454545';relief.fillRect(0,0,1024,1024);
  const palette=sand?['#baad91','#a4967e','#c5b99e','#92836b','#d0c4a9','#756c59']:['#373629','#444033','#24261e','#514938','#31352a'];
  for(let i=0;i<22000;i++){
   const x=random()*1024,y=random()*1024,r=sand?1.4+random()*3.0:2.2+random()*5.1,aspect=.65+random()*.35,angle=random()*Math.PI;
   ctx.fillStyle=palette[Math.floor(random()*palette.length)];ctx.beginPath();ctx.ellipse(x,y,r,r*aspect,angle,0,Math.PI*2);ctx.fill();
   const gradient=relief.createRadialGradient(x-r*.2,y-r*.25,0,x,y,r);gradient.addColorStop(0,'#d0d0d0');gradient.addColorStop(.7,'#929292');gradient.addColorStop(1,'#454545');relief.fillStyle=gradient;relief.beginPath();relief.ellipse(x,y,r,r*aspect,angle,0,Math.PI*2);relief.fill();
  }
  const map=new T.CanvasTexture(canvas),bumpMap=new T.CanvasTexture(bump);map.colorSpace=T.SRGBColorSpace;
  for(const texture of [map,bumpMap]){texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=8;}
  const mat=new T.MeshStandardMaterial({map,bumpMap,bumpScale:sand?.016:.03,roughness:.96});
  mat.onBeforeCompile=shader=>{
   shader.uniforms.waterTime=time;shader.vertexShader='varying vec3 substrateWorld;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nsubstrateWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
   shader.fragmentShader='uniform float waterTime;varying vec3 substrateWorld;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`float ca=sin(substrateWorld.x*7.+sin(substrateWorld.z*5.+waterTime*.31)*1.9+waterTime*.42)*sin(substrateWorld.z*8.-waterTime*.37+sin(substrateWorld.x*4.)*1.6);outgoingLight+=diffuseColor.rgb*pow(max(0.,ca),12.)*.24;\n#include <opaque_fragment>`);
  };
  return mat;
 };
 const soil=material(false),sand=material(true);
 const terrain=new T.PlaneGeometry(10.12,4.64,110,55);terrain.rotateX(-Math.PI/2);
 const positions=terrain.getAttribute('position') as T.BufferAttribute,uv=terrain.getAttribute('uv') as T.BufferAttribute;
 for(let i=0;i<positions.count;i++){const x=positions.getX(i),z=positions.getZ(i);positions.setY(i,height(x,z)+(random()-.5)*.003);uv.setXY(i,x/2.2,z/2.2);}
 terrain.computeVertexNormals();const ground=new T.Mesh(terrain,soil);ground.receiveShadow=true;scene.add(ground);
 const layer=new T.Mesh(new T.BoxGeometry(10.13,.32,4.64),soil);layer.position.y=.17;layer.receiveShadow=true;scene.add(layer);
 const p:number[]=[],tex:number[]=[],indices:number[]=[];
 for(let j=0;j<=96;j++){
  const z=2.29-j/96*4.5,{left,right}=sandChannel(z);
  for(let k=0;k<=20;k++){
   const x=T.MathUtils.lerp(left,right,k/20);p.push(x,height(x,z)+.027+.005*Math.sin(x*21+z*17),z);tex.push(x/2.2,z/2.2);
   if(j<96&&k<20){const n=j*21+k;indices.push(n,n+1,n+21,n+1,n+22,n+21);}
  }
 }
 const path=new T.BufferGeometry();path.setAttribute('position',new T.Float32BufferAttribute(p,3));path.setAttribute('uv',new T.Float32BufferAttribute(tex,2));path.setIndex(indices);path.computeVertexNormals();
 const pathMesh=new T.Mesh(path,sand);pathMesh.receiveShadow=true;scene.add(pathMesh);

 const dummy=new T.Object3D(),grainGeometry=new T.IcosahedronGeometry(1,0),grainMaterial=new T.MeshStandardMaterial({roughness:.93});
 const quartz=new T.InstancedMesh(grainGeometry,grainMaterial,12000),soilGrains=new T.InstancedMesh(grainGeometry,grainMaterial,2700);
 const quartzColors=['#bdb298','#d0c4a9','#9c947d','#afa48c','#817c68'].map(c=>new T.Color(c));
 const soilColors=['#292c22','#39392c','#4a4434','#5e5541'].map(c=>new T.Color(c));
 for(let i=0;i<quartz.count;i++){
  const z=-2.18+random()*4.45,{left,right}=sandChannel(z),x=T.MathUtils.lerp(left-.09,right+.09,random()),s=.003+random()**2*.008;
  const inSand=x>left&&x<right;
  dummy.position.set(x,height(x,z)+(inSand?.026:.0013)+s*.35,z);dummy.rotation.set(random()*3,random()*6.28,random()*3);dummy.scale.set(s,s*.73,s*(.75+random()*.45));dummy.updateMatrix();quartz.setMatrixAt(i,dummy.matrix);quartz.setColorAt(i,quartzColors[i%quartzColors.length]);
 }
 for(let i=0;i<soilGrains.count;i++){
  const z=-2.18+random()*4.45,{left,right}=sandChannel(z),side=random()<.5?-1:1;
  const x=i<2100?(side<0?left:right)+side*(random()*.32-.10):(random()-.5)*9.95,s=.009+random()**2*.016;
  const inSand=x>left&&x<right;
  dummy.position.set(x,height(x,z)+(inSand?.023:0)+s*.5,z);dummy.rotation.set(random()*3,random()*6.28,random()*3);dummy.scale.set(s,s*.8,s*(.7+random()*.5));dummy.updateMatrix();soilGrains.setMatrixAt(i,dummy.matrix);soilGrains.setColorAt(i,soilColors[i%soilColors.length]);
 }
 for(const grains of [quartz,soilGrains]){grains.castShadow=true;grains.receiveShadow=true;grains.computeBoundingSphere();scene.add(grains);}
}
