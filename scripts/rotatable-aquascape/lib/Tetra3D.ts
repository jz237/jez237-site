import * as T from 'three';
import {FeedingBite} from './FeedingBite.ts';
import {swimPhase,type FinKind} from './TetraKinematics.ts';
import {createTetraDeformation} from './TetraDeformation.ts';
import {createNormalUpdater} from './DeformedNormals.ts';
import {createTetraMaterials,type TetraMaterials} from './TetraMaterials.ts';
import {FishRespiration} from './FishRespiration.ts';


/** One authored, rounded tetra prototype; dimensions are relative to body length. */
export class Tetra3D {
 readonly group=new T.Group();
 private meshes:T.Mesh[]=[];
 private phase=0;
 private pectoralPhase=0;
 private lastPose=[NaN,NaN,NaN,NaN,NaN,NaN];
 private feedingBite=new FeedingBite();
 bite(){this.feedingBite.trigger();}
 private breathing:FishRespiration;
 private materials:TetraMaterials;private breathAttribute!:T.BufferAttribute;private disposed=false;
 private fins=new Map<T.Mesh,{kind:FinKind;side:number}>();
 private normalUpdates=new Map<T.BufferGeometry,()=>void>();
 private deformers=new Map<T.BufferGeometry,ReturnType<typeof createTetraDeformation>>();
 private shaders:{uniforms:Record<string,T.IUniform>}[]=[];
 private eyes:T.Mesh[]=[];
 get eyeMeshes():readonly T.Mesh[]{return this.eyes;}
 constructor(texture:T.Texture,phaseOffset=0,detailed=true,sharedMaterials?:TetraMaterials){
  this.phase=phaseOffset;this.pectoralPhase=phaseOffset*1.7;
  this.breathing=new FishRespiration(phaseOffset,1.25);
  this.materials=sharedMaterials??createTetraMaterials(texture);this.materials.references++;
  const {skin,fin,pectoral}=this.materials;
  // Elliptical cross-sections are joined into a continuous, closed body.
  const profile=[[-.32,.025],[-.26,.041],[-.14,.073],[0,.106],[.14,.115],[.27,.101],[.37,.075],[.445,.038],[.49,.003]];
  const pos:number[]=[],uv:number[]=[],idx:number[]=[];
  const rings=detailed?65:33,sides=detailed?32:16;
  for(let i=0;i<rings;i++){const x=-.32+i/(rings-1)*.81;let k=0;while(k<profile.length-2&&profile[k+1][0]<x)k++;const a=profile[k],b=profile[k+1],t=T.MathUtils.smoothstep(x,a[0],b[0]),radius=T.MathUtils.lerp(a[1],b[1],t);
   for(let j=0;j<=sides;j++){const theta=j/sides*Math.PI*2,y=-.035+Math.cos(theta)*radius,z=Math.sin(theta)*radius*.52;pos.push(x,y,z);uv.push(x+.5,.5+y/.45);if(i<rings-1&&j<sides){const n=i*(sides+1)+j;idx.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1);}}
  }
  for(const [ring,x] of [[0,-.32],[rings-1,.49]]){const center=pos.length/3;pos.push(x,-.035,0);uv.push(x+.5,.5-.035/.45);for(let j=0;j<sides;j++){const a=ring*(sides+1)+j,b=a+1;if(ring===0)idx.push(center,b,a);else idx.push(center,a,b);}}
  const body=new T.BufferGeometry();body.setAttribute('position',new T.Float32BufferAttribute(pos,3));body.setAttribute('tetraRest',new T.Float32BufferAttribute(pos,3));this.breathAttribute=new T.Float32BufferAttribute(new Float32Array(pos.length/3),1);this.breathAttribute.setUsage(T.DynamicDrawUsage);body.setAttribute('tetraBreath',this.breathAttribute);body.setAttribute('uv',new T.Float32BufferAttribute(uv,2));body.setIndex(idx);body.computeVertexNormals();this.add(body,skin);
  const membrane=(points:number[][],kind:FinKind,side=1)=>{const positions:number[]=[],coords:number[]=[];
   // Subdivide each membrane so fin rays can flex instead of moving as a rigid triangle.
   for(let t=1;t<points.length-1;t++){const a=points[0],b=points[t],c=points[t+1],n=7;
    const emit=(u:number,v:number)=>{const w=1-u-v,x=a[0]*w+b[0]*u+c[0]*v,y=a[1]*w+b[1]*u+c[1]*v,z=(a[2]||0)*w+(b[2]||0)*u+(c[2]||0)*v;positions.push(x,y,z);coords.push(x+.5,.5+y/.45);};
    for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){emit(i/n,j/n);emit((i+1)/n,j/n);emit(i/n,(j+1)/n);if(i+j<n-1){emit((i+1)/n,j/n);emit((i+1)/n,(j+1)/n);emit(i/n,(j+1)/n);}}
   }
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(coords,2));g.computeVertexNormals();this.add(g,kind==='pectoral'?pectoral:fin,kind,side);
  };
  membrane([[-.30,-.035],[-.495,.12],[-.43,.015],[-.395,-.035],[-.43,-.09],[-.495,-.185]],'tail');
  membrane([[-.10,.056],[-.065,.22],[.10,.07]],'dorsal');
  membrane([[-.23,-.079],[-.12,-.21],[.005,-.141],[.12,-.13]],'anal');
  for(const side of [-1,1])membrane([[.25,-.055,side*.049],[.05,-.17,side*.10],[.18,-.10,side*.022]],'pectoral',side);
  const iris=new T.MeshPhysicalMaterial({color:0x63998a,roughness:.25,metalness:.3});const pupil=new T.MeshPhysicalMaterial({color:0x020605,roughness:.16,clearcoat:1});
  for(const side of [-1,1]){const eye=new T.Mesh(new T.SphereGeometry(.027,16,12),iris);eye.scale.set(1,1,.45);eye.position.set(.426,-.022,side*.034);this.group.add(eye);this.eyes.push(eye);const center=new T.Mesh(new T.SphereGeometry(.018,16,12),pupil);center.scale.set(1,1,.3);center.position.set(.426,-.022,side*.047);this.group.add(center);this.eyes.push(center);}

 }
 private add(geometry:T.BufferGeometry,material:T.MeshPhysicalMaterial,kind:FinKind='body',side=1){
  // A fin is one thin membrane, not a transparent volume needing a back/front pair.
  if(kind!=='body')material.forceSinglePass=true;
  const mesh=new T.Mesh(geometry,material);this.meshes.push(mesh);this.fins.set(mesh,{kind,side});const rest=new Float32Array(geometry.getAttribute('position').array);this.deformers.set(geometry,createTetraDeformation(rest,kind,side));this.normalUpdates.set(geometry,createNormalUpdater(geometry));(geometry.getAttribute('position') as T.BufferAttribute).setUsage(T.DynamicDrawUsage);(geometry.getAttribute('normal') as T.BufferAttribute).setUsage(T.DynamicDrawUsage);this.group.add(mesh);}
 update(time:number,activity:number,photo:T.Texture,flow:number,depth:number,daylight:number,dt:number,pectoralEffort=.35,courtship=false){
  this.phase=swimPhase(this.phase,dt,activity,courtship);
  this.pectoralPhase+=dt*(5+pectoralEffort*13);
  this.breathing.update(dt,activity);this.feedingBite.update(dt);const {gill}=this.breathing,mouth=Math.max(this.breathing.mouth,this.feedingBite.value*2.4);
  // Keep the biological clock running in isolated lessons, without uploading invisible bodies.
  if(!this.group.visible)return;
  if(this.lastPose[0]!==this.phase||this.lastPose[1]!==activity||this.lastPose[2]!==this.pectoralPhase||this.lastPose[3]!==pectoralEffort||this.lastPose[4]!==gill||this.lastPose[5]!==mouth){
   if(this.lastPose[4]!==gill){(this.breathAttribute.array as Float32Array).fill(gill);this.breathAttribute.needsUpdate=true;}
   for(const mesh of this.meshes){const p=mesh.geometry.getAttribute('position') as T.BufferAttribute;this.deformers.get(mesh.geometry)!(p.array as Float32Array,this.phase,activity,this.pectoralPhase,pectoralEffort,gill,mouth);p.needsUpdate=true;this.normalUpdates.get(mesh.geometry)!();}
   this.lastPose[0]=this.phase;this.lastPose[1]=activity;this.lastPose[2]=this.pectoralPhase;this.lastPose[3]=pectoralEffort;
   this.lastPose[4]=gill;this.lastPose[5]=mouth;
  }
  for(const shader of this.shaders){shader.uniforms.photograph.value=photo;shader.uniforms.sceneTime.value=time;shader.uniforms.flow.value=flow;shader.uniforms.depth.value=depth;shader.uniforms.daylight.value=daylight;}
 }
 dispose(){if(this.disposed)return;this.disposed=true;const shared=new Set([this.materials.skin,this.materials.fin,this.materials.pectoral]);const materials=new Set<T.Material>();this.group.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();materials.add(o.material as T.Material);}});materials.forEach(m=>{if(!shared.has(m as T.MeshPhysicalMaterial))m.dispose();});if(--this.materials.references===0)shared.forEach(m=>m.dispose());}
}

