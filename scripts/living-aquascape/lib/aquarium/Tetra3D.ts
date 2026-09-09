import * as T from 'three';
import {bendTetra,swimPhase,type FinKind} from './TetraKinematics';
import {plantMotion,depthOcclusion} from './SceneDepth';

/** One authored, rounded tetra prototype; dimensions are relative to body length. */
export class Tetra3D {
 readonly group=new T.Group();
 private meshes:T.Mesh[]=[];
 private phase=0;
 private fins=new Map<T.Mesh,{kind:FinKind;side:number}>();
 private originals=new Map<T.BufferGeometry,Float32Array>();
 private shaders:{uniforms:Record<string,T.IUniform>}[]=[];
 private eyes:T.Mesh[]=[];
 constructor(texture:T.Texture){
  const skin=new T.MeshPhysicalMaterial({map:texture,roughness:.43,metalness:.12,clearcoat:.35,clearcoatRoughness:.25});
  const fin=skin.clone();fin.transparent=true;fin.opacity=.65;fin.alphaTest=.12;fin.side=T.DoubleSide;fin.depthWrite=false;fin.roughness=.55;
  const pectoral=fin.clone();pectoral.map=null;pectoral.color.set(0xb8d2c8);pectoral.opacity=.48;pectoral.alphaTest=.01;
  // Elliptical cross-sections are joined into a continuous, closed body.
  const profile=[[-.32,.025],[-.26,.041],[-.14,.073],[0,.106],[.14,.115],[.27,.101],[.37,.075],[.445,.038],[.49,.003]];
  const pos:number[]=[],uv:number[]=[],idx:number[]=[];
  const rings=65,sides=32;
  for(let i=0;i<rings;i++){const x=-.32+i/(rings-1)*.81;let k=0;while(k<profile.length-2&&profile[k+1][0]<x)k++;const a=profile[k],b=profile[k+1],t=T.MathUtils.smoothstep(x,a[0],b[0]),radius=T.MathUtils.lerp(a[1],b[1],t);
   for(let j=0;j<=sides;j++){const theta=j/sides*Math.PI*2,y=-.035+Math.cos(theta)*radius,z=Math.sin(theta)*radius*.52;pos.push(x,y,z);uv.push(x+.5,.5+y/.45);if(i<rings-1&&j<sides){const n=i*(sides+1)+j;idx.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1);}}
  }
  for(const [ring,x] of [[0,-.32],[rings-1,.49]]){const center=pos.length/3;pos.push(x,-.035,0);uv.push(x+.5,.5-.035/.45);for(let j=0;j<sides;j++){const a=ring*(sides+1)+j,b=a+1;if(ring===0)idx.push(center,b,a);else idx.push(center,a,b);}}
  const body=new T.BufferGeometry();body.setAttribute('position',new T.Float32BufferAttribute(pos,3));body.setAttribute('uv',new T.Float32BufferAttribute(uv,2));body.setIndex(idx);body.computeVertexNormals();this.add(body,skin);
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
  this.group.traverse(object=>{if(object instanceof T.Mesh){object.renderOrder=3;const material=object.material as T.MeshPhysicalMaterial;material.onBeforeCompile=shader=>{shader.uniforms.photograph={value:texture};shader.uniforms.flow={value:.65};shader.uniforms.sceneTime={value:0};shader.uniforms.depth={value:.55};shader.uniforms.daylight={value:1};shader.vertexShader='varying vec2 sceneUv;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvec4 scenePosition=modelMatrix*vec4(transformed,1.0);sceneUv=vec2(scenePosition.x/1672.0+.5,scenePosition.y/941.0+.5);');shader.fragmentShader='uniform sampler2D photograph;uniform float flow,sceneTime,depth,daylight;varying vec2 sceneUv;\n#define time sceneTime\n'+plantMotion+depthOcclusion+'\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>','gl_FragColor.rgb*=.35+.65*daylight;gl_FragColor.a*=1.0-sceneOcclusion(sceneUv+plantingOffset(sceneUv),depth);if(gl_FragColor.a<.08)discard;\n#include <dithering_fragment>');this.shaders.push(shader);};material.customProgramCacheKey=()=> 'tetra-depth-v1';}});
 }
 private add(geometry:T.BufferGeometry,material:T.MeshPhysicalMaterial,kind:FinKind='body',side=1){const mesh=new T.Mesh(geometry,material);this.meshes.push(mesh);this.fins.set(mesh,{kind,side});this.originals.set(geometry,new Float32Array(geometry.getAttribute('position').array));this.group.add(mesh);}
 update(time:number,activity:number,photo:T.Texture,flow:number,depth:number,daylight:number,dt:number){
  this.phase=swimPhase(this.phase,dt,activity);
  for(const mesh of this.meshes){const p=mesh.geometry.getAttribute('position') as T.BufferAttribute,rest=this.originals.get(mesh.geometry)!;for(let i=0;i<p.count;i++){const x=rest[i*3],y=rest[i*3+1],z=rest[i*3+2],fin=this.fins.get(mesh)!;const position=bendTetra(x,y,z,this.phase,activity,fin.kind,fin.side);p.setXYZ(i,...position);}p.needsUpdate=true;mesh.geometry.computeVertexNormals();}
  for(const shader of this.shaders){shader.uniforms.photograph.value=photo;shader.uniforms.sceneTime.value=time;shader.uniforms.flow.value=flow;shader.uniforms.depth.value=depth;shader.uniforms.daylight.value=daylight;}
 }
 dispose(){const materials=new Set<T.Material>();this.group.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();materials.add(o.material as T.Material);}});materials.forEach(m=>m.dispose());}
}
