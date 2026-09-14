import * as T from './vendor/three.module.js';
import {createRunoff,stepRunoff} from './shore-runoff.js';
import {wave,waterLevel} from './simulation.js';
import {cloudMaterial} from './weather-light.js';
export function makeShoreWash(scene){
 const n=49,cell=2,span=(n-1)*cell,geometry=new T.PlaneGeometry(span,span,n-1,n-1);geometry.rotateX(-Math.PI/2);const p=geometry.attributes.position,depth=new Float32Array(n*n);geometry.setAttribute('washDepth',new T.BufferAttribute(depth,1));
 const rockUniform={value:Array.from({length:48},()=>new T.Vector4(1e6,1e6,0,0))};
 const mat=new T.MeshStandardMaterial({color:0x6d9290,roughness:.10,metalness:.08,transparent:true,opacity:.32,depthWrite:false,side:T.DoubleSide});
 mat.onBeforeCompile=s=>{s.uniforms.washRocks=rockUniform;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute float washDepth;varying float filmDepth;varying vec2 washXZ;').replace('#include <begin_vertex>','#include <begin_vertex>\nfilmDepth=washDepth;washXZ=(modelMatrix*vec4(transformed,1.)).xz;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float filmDepth;varying vec2 washXZ;uniform vec4 washRocks[48];').replace('#include <color_fragment>',`#include <color_fragment>
 for(int i=0;i<48;i++){if(distance(washXZ,washRocks[i].xy)<washRocks[i].z)discard;}
 float coverage=smoothstep(.004,.038,filmDepth);if(coverage<.02)discard;diffuseColor.a*=coverage;diffuseColor.rgb=mix(vec3(.32,.43,.37),diffuseColor.rgb,smoothstep(.015,.1,filmDepth));`);};cloudMaterial(mat);
 const mesh=new T.Mesh(geometry,mat);mesh.userData.skipRefraction=true;mesh.frustumCulled=false;mesh.renderOrder=2;scene.add(mesh);let grid=null,ground=null,terrainGround=null,cx=1e6,cz=1e6,acc=0,previous=null;
 function shift(x,z){const nx=Math.floor(x/12)*12,nz=Math.floor(z/12)*12,old=grid,ox=cx,oz=cz;cx=nx;cz=nz;const bed=new Float32Array(n*n);for(let i=0;i<bed.length;i++){const x=cx+p.getX(i),z=cz+p.getZ(i);bed[i]=ground(x,z);}grid=createRunoff(n,cell,bed);
  if(old)for(let i=0;i<bed.length;i++){const ix=Math.round((cx+p.getX(i)-ox+span/2)/cell),iz=Math.round((cz+p.getZ(i)-oz+span/2)/cell);if(ix>=0&&ix<n&&iz>=0&&iz<n)grid.water[i]=old.water[iz*n+ix];}
  mesh.position.set(cx,0,cz);
 }
 return {mesh,stats:{wetCells:0,volume:0},reset(course){const terrain=course.renderGround||course.ground,rocks=(course.rocks||[]).filter(r=>!r.type||r.type==='rock');terrainGround=terrain;rockUniform.value.forEach((v,i)=>{const r=rocks[i];v.set(r?.x??1e6,r?.z??1e6,(r?.r??0)*1.08,0);});ground=(x,z)=>{let h=terrain(x,z);for(const r of rocks){const d=Math.hypot(x-r.x,z-r.z);if(d<r.r)h=Math.max(h,waterLevel.value+Math.sqrt(1-(d/r.r)**2)*r.r*.55);}return h;};grid=null;cx=cz=1e6;previous=null;acc=0;},update(t,storm,camera,quality){if(!ground)return;const dt=previous===null?0:Math.max(0,Math.min(.3,t-previous));previous=t;acc+=dt;if(Math.abs(camera.x-cx)>16||Math.abs(camera.z-cz)>16)shift(camera.x,camera.z);if(acc<1/15)return;const elapsed=acc;acc=0;
  // The 9x9 forcing grid samples actual waves, then interpolates onto the finer wash.
  const forcing=new Float32Array(81);for(let z=0;z<9;z++)for(let x=0;x<9;x++)forcing[z*9+x]=wave(cx-span/2+x*span/8,cz-span/2+z*span/8,t,storm);
  const sea=new Float32Array(n*n);for(let i=0;i<sea.length;i++){const x=i%n/(n-1)*8,z=Math.floor(i/n)/(n-1)*8,ix=Math.min(7,Math.floor(x)),iz=Math.min(7,Math.floor(z)),u=x-ix,v=z-iz;sea[i]=(forcing[iz*9+ix]*(1-u)+forcing[iz*9+ix+1]*u)*(1-v)+(forcing[(iz+1)*9+ix]*(1-u)+forcing[(iz+1)*9+ix+1]*u)*v;if(grid.bed[i]<waterLevel.value-.8||grid.bed[i]>waterLevel.value+2.8)sea[i]=-100;}
  const steps=Math.max(1,Math.ceil(elapsed/(1/30)));for(let j=0;j<steps;j++)stepRunoff(grid,elapsed/steps,{sea});
  for(let i=0;i<depth.length;i++){const y=grid.bed[i],d=grid.water[i];const base=terrainGround(cx+p.getX(i),cz+p.getZ(i));p.setY(i,base+d+.02);depth[i]=y>waterLevel.value-.5&&y<waterLevel.value+2.8?d:0;}p.needsUpdate=true;geometry.attributes.washDepth.needsUpdate=true;geometry.computeVertexNormals();this.stats={wetCells:depth.filter(d=>d>.01).length,volume:+(grid.water.reduce((a,b)=>a+b,0)*cell*cell).toFixed(2),maxDepth:+Math.max(...grid.water).toFixed(3)};
 },dispose(){mesh.removeFromParent();geometry.dispose();mat.dispose();}};
}
