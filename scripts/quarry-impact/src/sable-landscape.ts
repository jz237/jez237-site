import * as T from 'three';
import {SABLE} from './sable-course';
const smooth=(a:number,b:number,x:number)=>T.MathUtils.smoothstep(x,a,b);
const hash=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
function noise(x:number,z:number){const ix=Math.floor(x),iz=Math.floor(z),fx=smooth(0,1,x-ix),fz=smooth(0,1,z-iz);return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix,iz),hash(ix+1,iz),fx),T.MathUtils.lerp(hash(ix,iz+1),hash(ix+1,iz+1),fx),fz);}
/** Canyon landscape: a continuous apron and eroded cliff mesh, no physics changes. */
export function createSableLandscape(){
 const root=new T.Group();root.name='sable-continuous-canyon';
 const segments=256,rings=38,vertices:number[]=[],colors:number[]=[],indices:number[]=[];
 for(let ring=0;ring<rings;ring++)for(let i=0;i<=segments;i++){
  const angle=i/segments*Math.PI*2,dx=Math.cos(angle),dz=Math.sin(angle);
  const edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),distance=ring*7;
  const r=edge+distance,x=dx*r,z=dz*r;
  const erosion=noise(x*.027,z*.027),broad=.65*noise(x*.014+7,z*.014-2)+.35*noise(x*.037,z*.037),fine=noise(x*.12,z*.12);
  const cliffStart=18+erosion*24,cliffRise=smooth(cliffStart,cliffStart+20,distance);
  // Southern paddock opens into a broad valley; the northern route is enclosed by cliffs.
  const valley=.25+.75*smooth(-.9,-.25,dz),height=(36+48*broad)*valley;
  const shelves=Math.sin(distance*.31+erosion*5)*2.4+Math.sin(distance*.69+angle*9)*1.2-12*Math.pow(noise(x*.065,z*.065),3);
  const rubble=(fine-.5)*3*smooth(0,14,distance)*(1-cliffRise*.65);
  const y=SABLE.height(dx*edge,dz*edge)-.06+cliffRise*height+shelves*cliffRise+rubble+smooth(100,250,distance)*18;
  vertices.push(x,y,z);
  const band=.86+.09*Math.sin(y*.7+erosion*3)+.06*(fine-.5);
  const color=new T.Color().setRGB(.32,.20,.115).multiplyScalar(band*(.92+broad*.17));colors.push(color.r,color.g,color.b);
  if(ring<rings-1&&i<segments){const n=ring*(segments+1)+i;indices.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2);}
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.97,side:T.DoubleSide});
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 canyonWorld;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncanyonWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
  shader.fragmentShader=`varying vec3 canyonWorld;
float canyonHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float canyonNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(canyonHash(i),canyonHash(i+vec3(1,0,0)),f.x),mix(canyonHash(i+vec3(0,1,0)),canyonHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(canyonHash(i+vec3(0,0,1)),canyonHash(i+vec3(1,0,1)),f.x),mix(canyonHash(i+vec3(0,1,1)),canyonHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
`+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float grain=canyonNoise(canyonWorld*2.7);float patches=canyonNoise(canyonWorld*.17);float layers=sin(canyonWorld.y*1.1+patches*2.5);
diffuseColor.rgb*=.82+.22*grain+.12*patches+.05*layers;`);
 };
 material.customProgramCacheKey=()=> 'sable-canyon-prototype-1';
 const mesh=new T.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
 // Talus fans break up the flat apron with irregular, clustered rock silhouettes.
 const rockGeometry=new T.IcosahedronGeometry(1,1),rockMaterial=new T.MeshStandardMaterial({color:0x78604a,roughness:1,flatShading:true});
 const rockPositions=rockGeometry.attributes.position;for(let i=0;i<rockPositions.count;i++){const x=rockPositions.getX(i),y=rockPositions.getY(i),z=rockPositions.getZ(i),n=.82+.32*hash(x*8,z*8+y);rockPositions.setXYZ(i,x*n,y*n,z*n);}rockGeometry.computeVertexNormals();
 const rocks=new T.InstancedMesh(rockGeometry,rockMaterial,420),dummy=new T.Object3D();
 for(let i=0;i<420;i++){
  const cluster=Math.floor(i/14),angle=cluster/30*Math.PI*2+(hash(i,3)-.5)*.11,dx=Math.cos(angle),dz=Math.sin(angle);
  const edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),r=edge+2+hash(i,5)*19,x=dx*r,z=dz*r;
  const size=.55+Math.pow(hash(i,9),3)*4.8;dummy.position.set(x,SABLE.height(dx*edge,dz*edge)+size*.25,z);dummy.rotation.set(hash(i,4),hash(i,7)*6,hash(i,8));dummy.scale.set(size*1.5,size*.8,size);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);rocks.setColorAt(i,new T.Color().setHSL(.075+hash(i,10)*.025,.19,.25+hash(i,11)*.16));
 }
 rocks.castShadow=rocks.receiveShadow=true;rocks.computeBoundingSphere();root.add(rocks);
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();geometry.dispose();material.dispose();rocks.dispose();rockGeometry.dispose();rockMaterial.dispose();root.clear();}};
}
