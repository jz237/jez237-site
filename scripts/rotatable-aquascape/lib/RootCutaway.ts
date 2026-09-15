import {rootLeafCurrent,setRootLeafMotion} from './RootLeafCurrent.ts';
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {buildRootSystem} from './RootAnatomy.ts';
import {leafSurfaceMaps} from './LeafSurface.ts';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);

/** Optional teaching specimen. Only the exposed blades flex; grains and buried roots stay fixed. */
export function buildRootCutaway(time={value:0},flow={value:1}){
 const group=new T.Group();let seed=817;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const top=(x:number,z:number)=>3.28+.035*Math.sin(x*2.3+z*1.8)+.022*Math.sin(z*7+x*4);
 const rockMaterial=new T.MeshStandardMaterial({roughness:.92});
 rockMaterial.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 grainLocal;').replace('#include <begin_vertex>','#include <begin_vertex>\ngrainLocal=position;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 grainLocal;').replace('#include <color_fragment>',`#include <color_fragment>
   float grit=fract(sin(dot(floor(grainLocal*90.),vec3(12.9898,78.233,45.164)))*43758.5453);
   float mottling=.76+.24*sin(grainLocal.x*13.+grainLocal.z*11.)*sin(grainLocal.y*17.);
   diffuseColor.rgb*=mottling*(.82+.18*grit);`);
 };
 rockMaterial.customProgramCacheKey=()=> 'root-gravel-grain-v1';
 // The solid back of this section ends behind the exposed roots; grains form its irregular front.
 const body=new T.Mesh(new T.BoxGeometry(4.9,1.92,1.95,1,1,1),new T.MeshStandardMaterial({color:0x211a12,roughness:1}));body.position.set(0,2.20,-.025);group.add(body);
 const dummy=new T.Object3D(),mineralColors=[0xb3a787,0xd1c8ae,0x91866d,0x625940,0x403e32,0xc8baa0].map(c=>new T.Color(c));
 const grainGeometry=new T.IcosahedronGeometry(1,1),p=grainGeometry.getAttribute('position');
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=1+.08*Math.sin(x*19+y*13+z*17);p.setXYZ(i,x*r,y*r,z*r);}grainGeometry.computeVertexNormals();
 const placements:{position:T.Vector3;scale:T.Vector3;rotation:T.Euler;color:T.Color}[]=[];
 const grain=(x:number,y:number,z:number,r:number,pale=false)=>{
  const shade=.018+random()*.042;
  placements.push({position:V(x,y,z),scale:V(r*(.85+random()*.35),r*(.63+random()*.38),r*(.8+random()*.4)),rotation:new T.Euler(random()*6,random()*6,random()*6),color:pale?mineralColors[Math.floor(random()*mineralColors.length)]:new T.Color().setRGB(shade,shade*.76,shade*.50)});
 };
 // Dense cut faces, staggered to avoid a rectangular bead grid.
 for(let row=0;row<29;row++)for(let col=0;col<77;col++){
  const x=-2.43+(col+(row%2)*.5)*.063+(random()-.5)*.060,y=1.29+row*.068+(random()-.5)*.065;
  grain(x,y,.985+random()*.05,.028+random()*.025,y>top(x,1)-.21||random()<.055);
 }
 for(let row=0;row<29;row++)for(let col=0;col<31;col++)for(const side of [-1,1]){
  const z=-.96+col*.064+(random()-.5)*.02,y=1.29+row*.068;grain(side*(2.43+random()*.02),y,z,.03+random()*.024,y>top(side*2.4,z)-.21);
 }
 for(let x=-2.4;x<2.4;x+=.084)for(let z=-.91;z<1.10;z+=.088)grain(x+(random()-.5)*.035,top(x,z),z,.042+random()*.022,true);
 for(let i=0;i<2700;i++)grain((random()-.5)*4.84,1.30+random()*1.9,1.012+random()*.025,.006+random()*.012,random()<.07);
 const grains=new T.InstancedMesh(grainGeometry,rockMaterial,placements.length);
 placements.forEach((g,i)=>{dummy.position.copy(g.position);dummy.scale.copy(g.scale);dummy.rotation.copy(g.rotation);dummy.updateMatrix();grains.setMatrixAt(i,dummy.matrix);grains.setColorAt(i,g.color);});grains.instanceMatrix.needsUpdate=true;group.add(grains);
 const maps=leafSurfaceMaps('sword');group.userData.ownedTextures=Object.values(maps);
 const leafMat=new T.MeshStandardMaterial({color:0x709b29,map:maps.color,bumpMap:maps.bump,bumpScale:.012,roughnessMap:maps.roughness,roughness:.83,side:T.DoubleSide});
 rootLeafCurrent(leafMat,time,flow);
 const leafPieces:T.BufferGeometry[]=[],veinPieces:T.BufferGeometry[]=[];
 for(const [x,z,size,grassy] of [[-.95,1.035,1,0],[1.16,1.02,.76,1]]){
  const crown=V(x,top(x,z),z),roots=buildRootSystem(grassy?381:733);roots.position.copy(crown);roots.scale.set(size*.98,size*1.04,.75);group.add(roots);
  for(let i=0;i<(grassy?17:11);i++){
   const a=i*2.399,reach=(.35+random()*.55)*size,high=(.8+random()*.68)*size,width=(grassy?.045:.16+random()*.085)*size;
   const positions:number[]=[],uv:number[]=[],indices:number[]=[],mid:T.Vector3[]=[];
   const side=V(Math.cos(a),0,-Math.sin(a));
   for(let j=0;j<=28;j++){
    const t=j/28,center=crown.clone().add(V(Math.sin(a)*reach*t*t,high*(t-.12*t*t),Math.cos(a)*reach*t*t)),w=width*Math.pow(Math.sin(Math.PI*t),.85)*(t<.18?.15+.85*t/.18:1);mid.push(center);
    for(let k=0;k<=8;k++){const u=k/8*2-1,point=center.clone().addScaledVector(side,u*w);point.y+=Math.abs(u)*w*.22+Math.sin(t*17+i)*u*u*.022;positions.push(point.x,point.y,point.z);uv.push(k/8,t);if(j<28&&k<8){const n=j*9+k;indices.push(n,n+9,n+1,n+1,n+9,n+10);}}
   }
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
   const phase=i*1.73+x*.63,speed=.72+(i%5)*.09,amplitude=grassy?.050:.032;
   setRootLeafMotion(g,crown.y,phase,speed,amplitude);leafPieces.push(g);
   const vein=new T.TubeGeometry(new T.CatmullRomCurve3(mid),24,grassy?.002:.004,5,false);setRootLeafMotion(vein,crown.y,phase,speed,amplitude);veinPieces.push(vein);
   const stalk=new T.Mesh(new T.ConeGeometry(.025*size,.25*size,7),new T.MeshStandardMaterial({color:0x95995b,roughness:.78}));stalk.position.copy(crown).add(V(Math.sin(a)*.028,.09,Math.cos(a)*.028));group.add(stalk);
  }
 }
 const leaves=mergeGeometries(leafPieces)!,veins=mergeGeometries(veinPieces)!;leafPieces.forEach(g=>g.dispose());veinPieces.forEach(g=>g.dispose());const veinMat=new T.MeshStandardMaterial({color:0x899d43,roughness:.8});rootLeafCurrent(veinMat,time,flow);group.add(new T.Mesh(leaves,leafMat),new T.Mesh(veins,veinMat));
 // Curled detritus fragments lie on the gravel, with visible central ribs.
 const debris=new T.Group(),debrisMat=new T.MeshStandardMaterial({color:0x72502a,roughness:.97,side:T.DoubleSide});
 for(let i=0;i<11;i++){
  const g=new T.PlaneGeometry(.15+random()*.2,.12+random()*.17,5,5),p=g.getAttribute('position');
  for(let j=0;j<p.count;j++){const x=p.getX(j),y=p.getY(j);p.setZ(j,Math.abs(x)*.3+.022*Math.sin(y*35+i));}g.computeVertexNormals();const m=new T.Mesh(g,debrisMat);const x=(random()-.5)*4.5,z=.4+random()*.65;m.position.set(x,top(x,z)+.07,z);m.rotation.set(-Math.PI/2,0,random()*6);debris.add(m);
 }group.add(debris);
 const light=new T.DirectionalLight(0xfff3d4,2.0);light.position.set(-2,7,5);light.target.position.set(0,2.6,0);group.add(light,light.target);group.add(new T.HemisphereLight(0xcceaf0,0x45351f,.6));
 group.userData.reference='roots-below-gravel-gpt-v1.png';return group;
}
