import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

type Random=()=>number;
/** The tentacle tip is part of the same closed skin as the shaft, rather than a
 * separate bead. Each ring carries its own root-to-tip attachment coordinate. */
export function buildAnemones(hosts:T.Vector3[],clock:{value:number},random:Random,supportHeight:(center:T.Vector3)=>number){
 const parts:T.BufferGeometry[]=[],choose=(a:number,b:number)=>a+(b-a)*random();
 let tentacles=0;
 function flesh(g:T.BufferGeometry,color:T.Color){
  const n=g.getAttribute('position').count,colors=new Float32Array(n*3);
  for(let i=0;i<n;i++)colors.set([color.r,color.g,color.b],i*3);
  g.setAttribute('color',new T.BufferAttribute(colors,3));g.setAttribute('anemoneFlex',new T.BufferAttribute(new Float32Array(n*4),4));
  parts.push(g.toNonIndexed());g.dispose();
 }
 for(let k=0;k<3;k++){
  const center=(k<2?hosts[k]:new T.Vector3(3.88,.52,1.73)).clone(),scale=k===0?1:k===1?.63:.46;
  const ground=supportHeight(center);center.y=Math.min(center.y,ground+.22*scale);
  const base=new T.Color(k===2?'#65566b':'#60613a'),shaft=new T.Color(k===2?'#ad7b99':'#859846'),tip=new T.Color(k===2?'#b6c9cf':'#bacd8a');
  const footY=Math.min(center.y-.10*scale,ground-.025*scale),columnTop=center.y-.025*scale;
  const column=new T.CylinderGeometry(.57*scale,.31*scale,columnTop-footY,32,5),cp=column.getAttribute('position');
  for(let j=0;j<cp.count;j++){const a=Math.atan2(cp.getZ(j),cp.getX(j)),rib=1+.055*Math.sin(a*7+cp.getY(j)*4)+.022*Math.sin(a*17);cp.setXYZ(j,cp.getX(j)*rib,cp.getY(j),cp.getZ(j)*rib);}
  column.computeVertexNormals();column.translate(center.x,(columnTop+footY)/2,center.z);flesh(column,base.clone().multiplyScalar(.82));
  const disc=new T.SphereGeometry(.64*scale,32,12);disc.scale(1,.17,.91);disc.translate(center.x,center.y-.025*scale,center.z);flesh(disc,base);
  // A recessed central slit leaves an oral area between the inner tentacles.
  const mouth=new T.SphereGeometry(.095*scale,18,8);mouth.scale(1,.12,.36);mouth.translate(center.x,center.y+.071*scale,center.z);flesh(mouth,base.clone().multiplyScalar(.46));
  for(let i=0;i<180;i++){
   const angle=i*2.399963+choose(-.14,.14),radial=Math.sqrt((i+.8)/180),r=(.14+.49*radial)*scale;
   const root=center.clone().add(new T.Vector3(Math.cos(angle)*r,.035*scale*(1-radial),Math.sin(angle)*r*.91));
   const length=choose(.39,.85)*scale*(.88+.22*radial),spread=(.15+.35*radial)*scale,phase=choose(0,6.28),radius=choose(.022,.038)*scale;
   const end=root.clone().add(new T.Vector3(Math.cos(angle)*spread+.11*scale,length,Math.sin(angle)*spread));
   const c1=root.clone().add(new T.Vector3(Math.cos(angle)*spread*.16,length*.35,Math.sin(angle)*spread*.16));
   const c2=root.clone().lerp(end,.74);c2.x+=Math.sin(phase)*.105*scale;c2.z+=Math.cos(phase)*.07*scale;
   const curve=new T.CatmullRomCurve3([root,c1,c2,end]),steps=18,sides=8,frames=curve.computeFrenetFrames(steps,false);
   const g=new T.BufferGeometry(),positions:number[]=[],colors:number[]=[],uv:number[]=[],flex:number[]=[],indices:number[]=[];
   for(let j=0;j<=steps;j++){
    const t=j<=14?j/14*.94:[.965,.985,.997,1][j-15],point=curve.getPointAt(t);
    // Smooth taper with a gently inflated end, then a continuous rounded closure.
    const width=radius*(1-.29*t+.16*Math.exp(-(((t-.87)/.09)**2)))*Math.sqrt(Math.max(0,1-((Math.max(0,t-.95))/.05)**2));
    const color=base.clone().lerp(shaft,T.MathUtils.smoothstep(t,0,.36)).lerp(tip,T.MathUtils.smoothstep(t,.83,1)).multiplyScalar(.91+.14*Math.sin(phase)*Math.sin(t*2.6));
    for(let a=0;a<=sides;a++){
     const theta=a/sides*Math.PI*2,frame=t*steps,lo=Math.min(steps-1,Math.floor(frame)),mix=frame-lo,n=frames.normals[lo].clone().lerp(frames.normals[lo+1],mix).normalize(),b=frames.binormals[lo].clone().lerp(frames.binormals[lo+1],mix).normalize(),co=Math.cos(theta),si=Math.sin(theta);
     positions.push(point.x+width*(n.x*co+b.x*si),point.y+width*(n.y*co+b.y*si),point.z+width*(n.z*co+b.z*si));
     const stripe=1+.025*Math.sin(theta*3+phase+t*3);colors.push(color.r*stripe,color.g*stripe,color.b*stripe);uv.push(t,a/sides);flex.push(t,phase,length,scale);
     if(j<steps&&a<sides){const idx=j*(sides+1)+a;indices.push(idx,idx+1,idx+sides+1,idx+1,idx+sides+2,idx+sides+1);}
    }
   }
   g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('anemoneFlex',new T.Float32BufferAttribute(flex,4));g.setIndex(indices);g.computeVertexNormals();parts.push(g.toNonIndexed());g.dispose();tentacles++;
  }
 }
 const geometry=mergeGeometries(parts,false);parts.forEach(g=>g.dispose());geometry.computeBoundingSphere();geometry.boundingSphere!.radius+=.35;
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.53,metalness:0});
 material.onBeforeCompile=shader=>{
  shader.uniforms.reefTime=clock;
  shader.vertexShader=`uniform float reefTime; attribute vec4 anemoneFlex;
   vec2 tissueFlow(float t,float phase){
    float surge=sin(reefTime*.96-phase*.08),eddy=sin(reefTime*1.37+phase-t*2.1);
    return vec2(surge*.15+eddy*.035,cos(reefTime*.79-phase*.07)*.10+sin(reefTime*1.19+phase-t*1.6)*.027);
   }\n`+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   float tissueT=anemoneFlex.x;
   vec2 bend=tissueFlow(tissueT,anemoneFlex.y)*tissueT*tissueT*anemoneFlex.w;
   transformed.x+=bend.x;transformed.z+=bend.y;`);
  shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
   vec2 slope=tissueFlow(anemoneFlex.x,anemoneFlex.y)*2.*anemoneFlex.x*anemoneFlex.w/max(.15,anemoneFlex.z);
   objectNormal.y-=dot(slope,objectNormal.xz);objectNormal=normalize(objectNormal);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`outgoingLight+=diffuseColor.rgb*pow(1.-abs(dot(normal,geometryViewDir)),2.)*.12;
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> 'reef-anemone-continuous-skin-v1';
 const mesh=new T.Mesh(geometry,material);mesh.name='Rooted flowing anemones';mesh.receiveShadow=true;
 return {mesh,tentacles};
}

