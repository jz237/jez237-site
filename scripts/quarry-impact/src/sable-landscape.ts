import {createTalusGeometry} from './sable-talus';
import {url} from './assets';
import * as T from 'three';
import {SABLE} from './sable-course';
const smooth=(a:number,b:number,x:number)=>T.MathUtils.smoothstep(x,a,b);
const hash=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
function noise(x:number,z:number){const ix=Math.floor(x),iz=Math.floor(z),fx=smooth(0,1,x-ix),fz=smooth(0,1,z-iz);return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix,iz),hash(ix+1,iz),fx),T.MathUtils.lerp(hash(ix,iz+1),hash(ix+1,iz+1),fx),fz);}
/** Continuous outer rock field. The zero-distance edge remains exactly joined
 * to the original driving terrain; only the scenery beyond it is shaped. */
export function sableCliffHeight(x:number,z:number){
 const radius=Math.hypot(x,z);if(radius===0)return SABLE.height(x,z)-.06;
 const dx=x/radius,dz=z/radius,edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),distance=Math.max(0,radius-edge);
 const erosion=noise(x*.027,z*.027),broad=.65*noise(x*.014+7,z*.014-2)+.35*noise(x*.037,z*.037),fine=noise(x*.12,z*.12);
 // Angular fields keep buttresses coherent from foot to crest rather than
 // drawing parallel corrugations through every section of the canyon.
 const buttress=noise(dx*9+11,dz*9-3),recess=noise(dx*17-8,dz*17+5);
 const cliffStart=12+36*(1-buttress)+erosion*8,riseWidth=10+18*recess;
 const cliffRise=smooth(cliffStart,cliffStart+riseWidth,distance);
 const valley=.25+.75*smooth(-.9,-.25,dz),height=(36+48*broad)*valley;
 const lift=cliffRise*height,shift=noise(dx*21+19,dz*21)*7;
 const phase=(lift+shift)/9,fraction=phase-Math.floor(phase);
 const ledge=(Math.floor(phase)+smooth(.18,.82,fraction))*9-shift;
 const joints=noise(x*.075+noise(x*.013,z*.013)*3,z*.075),gully=Math.pow(1-Math.abs(joints*2-1),8);
 const crest=(noise(x*.047+13,z*.047-8)-.5)*15+(fine-.5)*4;
 const rubble=(fine-.5)*3*smooth(0,14,distance)*(1-cliffRise*.65);
 return SABLE.height(dx*edge,dz*edge)-.06+T.MathUtils.lerp(lift,ledge,.45*cliffRise)+(crest-gully*(3+7*broad))*cliffRise+rubble+smooth(100,250,distance)*18;
}
/** Canyon landscape: a continuous apron and eroded cliff mesh, no physics changes. */
export function createSableLandscape(){
 const root=new T.Group();root.name='sable-continuous-canyon';
 const segments=384,rings=54,vertices:number[]=[],colors:number[]=[],indices:number[]=[];
 for(let ring=0;ring<rings;ring++)for(let i=0;i<=segments;i++){
  const angle=i/segments*Math.PI*2,dx=Math.cos(angle),dz=Math.sin(angle);
  const edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),distance=ring*5;
  const r=edge+distance,x=dx*r,z=dz*r;
  const erosion=noise(x*.027,z*.027),broad=.65*noise(x*.014+7,z*.014-2)+.35*noise(x*.037,z*.037),fine=noise(x*.12,z*.12);
  const joints=noise(x*.075+noise(x*.013,z*.013)*3,z*.075);
  const y=sableCliffHeight(x,z);
  vertices.push(x,y,z);
  const band=.9+.1*(fine-.5)+.08*(joints-.5);
  const color=new T.Color().setRGB(.60,.46,.32).multiplyScalar(band*(.92+broad*.17));colors.push(color.r,color.g,color.b);
  if(ring<rings-1&&i<segments){const n=ring*(segments+1)+i;indices.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2);}
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const textures:T.Texture[]=[];
 const photo=typeof document==='undefined'?new T.Texture():new T.TextureLoader().load(url('assets/geology_rock_diff.jpg'));photo.wrapS=photo.wrapT=T.RepeatWrapping;photo.colorSpace=T.SRGBColorSpace;photo.anisotropy=8;textures.push(photo);
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.97,side:T.DoubleSide});
 material.onBeforeCompile=shader=>{
  shader.uniforms.canyonPhoto={value:photo};
  shader.vertexShader='varying vec3 canyonWorld;varying vec3 canyonNormal;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncanyonWorld=(modelMatrix*vec4(transformed,1.0)).xyz;canyonNormal=normalize(mat3(modelMatrix)*normal);');
  shader.fragmentShader=`varying vec3 canyonWorld;varying vec3 canyonNormal;uniform sampler2D canyonPhoto;
float canyonHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float canyonNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(canyonHash(i),canyonHash(i+vec3(1,0,0)),f.x),mix(canyonHash(i+vec3(0,1,0)),canyonHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(canyonHash(i+vec3(0,0,1)),canyonHash(i+vec3(1,0,1)),f.x),mix(canyonHash(i+vec3(0,1,1)),canyonHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
`+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec3 weights=pow(abs(normalize(canyonNormal)),vec3(5.0));weights/=max(dot(weights,vec3(1.0)),.001);
vec3 p=canyonWorld*.085;
vec3 stone=texture2D(canyonPhoto,p.yz).rgb*weights.x+texture2D(canyonPhoto,p.xz).rgb*weights.y+texture2D(canyonPhoto,p.xy).rgb*weights.z;
float patches=canyonNoise(canyonWorld*.075);float runoff=canyonNoise(vec3(canyonWorld.x*.28,canyonWorld.y*.025,canyonWorld.z*.28));
diffuseColor.rgb*=mix(vec3(.65),stone*2.0,.75)*(.86+.25*patches)*(.86+.18*runoff);`);
 };
 material.customProgramCacheKey=()=> 'sable-photo-cliffs-1';
 const mesh=new T.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
 // Talus fans break up the flat apron with irregular, clustered rock silhouettes.
 const rockGeometries=Array.from({length:4},(_,i)=>createTalusGeometry(i));
 const loadRock=(file:string,color=false)=>{const t=typeof document==='undefined'?new T.Texture():new T.TextureLoader().load(url(file));t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;if(color)t.colorSpace=T.SRGBColorSpace;textures.push(t);return t;};
 const rockMaterial=new T.MeshStandardMaterial({color:0xc3a785,roughness:.96,map:photo,normalMap:loadRock('assets/geology_rock_nor_gl.jpg'),normalScale:new T.Vector2(.55,.55),roughnessMap:loadRock('assets/geology_rock_rough.jpg')});
 const rockBatches=rockGeometries.map((g,i)=>{const mesh=new T.InstancedMesh(g,rockMaterial,105);mesh.name='sable-talus-'+i;return mesh;}),dummy=new T.Object3D();
 for(let i=0;i<420;i++){
  const rocks=rockBatches[i%4],instance=Math.floor(i/4);
  const cluster=Math.floor(i/14),angle=cluster/30*Math.PI*2+(hash(i,3)-.5)*.11,dx=Math.cos(angle),dz=Math.sin(angle);
  const edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180),r=edge+2+hash(i,5)*19,x=dx*r,z=dz*r;
  const size=.55+Math.pow(hash(i,9),3)*4.8;dummy.position.set(x,sableCliffHeight(x,z)+size*.25,z);dummy.rotation.set(hash(i,4),hash(i,7)*6,hash(i,8));dummy.scale.set(size*1.5,size*.8,size);dummy.updateMatrix();rocks.setMatrixAt(instance,dummy.matrix);rocks.setColorAt(instance,new T.Color().setHSL(.075+hash(i,10)*.025,.12,.62+hash(i,11)*.20));
 }
 for(const rocks of rockBatches){rocks.castShadow=rocks.receiveShadow=true;rocks.computeBoundingSphere();root.add(rocks);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();geometry.dispose();material.dispose();textures.forEach(t=>t.dispose());rockBatches.forEach(r=>r.dispose());rockGeometries.forEach(g=>g.dispose());rockMaterial.dispose();root.clear();}};
}
