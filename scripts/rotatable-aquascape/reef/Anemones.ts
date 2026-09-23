import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

type Random=()=>number;
// A shallow radial disc with folded tissue and a recessed oral center.
function discPoint(t:number,a:number,scale:number){
 const r=.65*t*(1+.025*Math.sin(a*3)+.014*Math.cos(a*7));
 return new T.Vector3(Math.cos(a)*r,(.07*(1-t*t)-.025-.12*Math.exp(-((t/.13)**2))+.009*Math.sin(a*18+t*12)*Math.sin(Math.PI*t))*scale,Math.sin(a)*r*(.35+.56*T.MathUtils.smoothstep(t,0,.25))).multiply(new T.Vector3(scale,1,scale));
}

/** The tentacle tip is part of the same closed skin as the shaft, rather than a
 * separate bead. Each ring carries its own root-to-tip attachment coordinate. */
export function buildAnemones(hosts:T.Vector3[],clock:{value:number},random:Random,supportHeight:(center:T.Vector3)=>number){
 const parts:T.BufferGeometry[]=[],choose=(a:number,b:number)=>a+(b-a)*random();
 let tentacles=0;
 function flesh(g:T.BufferGeometry,color:T.Color){
  const n=g.getAttribute('position').count,colors=new Float32Array(n*3);
  for(let i=0;i<n;i++)colors.set([color.r,color.g,color.b],i*3);
  g.setAttribute('color',new T.BufferAttribute(colors,3));g.setAttribute('anemoneFlex',new T.BufferAttribute(new Float32Array(n*4),4));
  parts.push(g);
 }
 for(let k=0;k<3;k++){
  const center=(k<2?hosts[k]:new T.Vector3(3.88,.52,1.73)).clone(),scale=k===0?1:k===1?.63:.46;
  const ground=supportHeight(center);center.y=Math.min(center.y,ground+.22*scale);
  const base=new T.Color(k===2?'#65566b':'#60613a'),shaft=new T.Color(k===2?'#ad7b99':'#73843d'),tip=new T.Color(k===2?'#b6c9cf':'#bacd8a');
  const footY=Math.min(center.y-.10*scale,ground-.025*scale),columnTop=center.y-.025*scale;
  const column=new T.CylinderGeometry(.57*scale,.31*scale,columnTop-footY,32,5,true),cp=column.getAttribute('position');
  for(let j=0;j<cp.count;j++){const a=Math.atan2(cp.getZ(j),cp.getX(j)),rib=1+.055*Math.sin(a*7+cp.getY(j)*4)+.022*Math.sin(a*17);cp.setXYZ(j,cp.getX(j)*rib,cp.getY(j),cp.getZ(j)*rib);}
  column.computeVertexNormals();column.translate(center.x,(columnTop+footY)/2,center.z);flesh(column,base.clone().multiplyScalar(.82));
  const dp:number[]=[],dc:number[]=[],duv:number[]=[],di:number[]=[],discRings=20,discSides=64;
  for(let layer=0;layer<2;layer++)for(let row=0;row<=discRings;row++)for(let j=0;j<=discSides;j++){
   const t=row/discRings,a=j/discSides*Math.PI*2,point=discPoint(t,a,scale);if(layer)point.y=(-.105+.045*t)*scale;point.add(center);
   dp.push(point.x,point.y,point.z);const c=base.clone().lerp(shaft,.18+.10*Math.sin(a*18+t*12)).multiplyScalar(layer?.65:.55+.45*T.MathUtils.smoothstep(t,.02,.17));dc.push(c.r,c.g,c.b);duv.push(Math.cos(a)*t,Math.sin(a)*t);
   if(row&&j){const n=layer*(discRings+1)*(discSides+1)+row*(discSides+1)+j,tri:number[]=[];if(row>1)tri.push(n-discSides-2,n-discSides-1,n-1);tri.push(n-discSides-1,n,n-1);if(layer)for(let k=0;k<tri.length;k+=3)[tri[k+1],tri[k+2]]=[tri[k+2],tri[k+1]];di.push(...tri);}
  }
  const lower=(discRings+1)*(discSides+1);for(let j=0;j<discSides;j++){const a=discRings*(discSides+1)+j;di.push(a,a+lower,a+1,a+1,a+lower,a+lower+1);}
  const disc=new T.BufferGeometry();disc.setAttribute('position',new T.Float32BufferAttribute(dp,3));disc.setAttribute('uv',new T.Float32BufferAttribute(duv,2));disc.setIndex(di);disc.computeVertexNormals();flesh(disc,base);disc.setAttribute('color',new T.Float32BufferAttribute(dc,3));
  for(let i=0;i<180;i++){
   const angle=i*2.399963+choose(-.14,.14),radial=Math.sqrt((i+.8)/180),r=(.23+.40*radial)*scale;
   const root=center.clone().add(discPoint(r/(.65*scale),angle,scale));root.y-=.012*scale;
   const length=choose(.39,.85)*scale*(.88+.22*radial),spread=(.22+.36*radial)*scale,phase=choose(0,6.28),radius=choose(.022,.038)*scale;
   const end=root.clone().add(new T.Vector3(Math.cos(angle)*spread+.15*scale,length*(.94-.28*radial)+.055*scale*Math.sin(phase),Math.sin(angle)*spread+.025*scale));
   const c1=root.clone().add(new T.Vector3(Math.cos(angle)*spread*.12,length*.39,Math.sin(angle)*spread*.12));
   const c2=root.clone().lerp(end,.76);c2.y=root.y+length*(.99-.18*radial);c2.x+=Math.sin(phase)*.11*scale;c2.z+=Math.cos(phase)*.09*scale;
   const curve=new T.CubicBezierCurve3(root,c1,c2,end),steps=18,sides=8,frames=curve.computeFrenetFrames(steps,false);
   const g=new T.BufferGeometry(),positions:number[]=[],colors:number[]=[],uv:number[]=[],flex:number[]=[],indices:number[]=[];
   for(let j=0;j<=steps;j++){
    const t=j<=14?j/14*.94:[.965,.985,.997,1][j-15],point=curve.getPointAt(t);
    // Smooth taper with a gently inflated end, then a continuous rounded closure.
    const width=radius*(1-.40*t+.23*Math.exp(-(((t-.87)/.09)**2)))*Math.sqrt(Math.max(0,1-((Math.max(0,t-.95))/.05)**2));
    const color=base.clone().lerp(shaft,T.MathUtils.smoothstep(t,0,.36)).lerp(tip,T.MathUtils.smoothstep(t,.83,1)).multiplyScalar(.91+.14*Math.sin(phase)*Math.sin(t*2.6));
    for(let a=0;a<=sides;a++){
     const theta=a/sides*Math.PI*2,frame=t*steps,lo=Math.min(steps-1,Math.floor(frame)),mix=frame-lo,n=frames.normals[lo].clone().lerp(frames.normals[lo+1],mix).normalize(),b=frames.binormals[lo].clone().lerp(frames.binormals[lo+1],mix).normalize(),co=Math.cos(theta),si=Math.sin(theta);
     positions.push(point.x+width*(n.x*co+b.x*si),point.y+width*(n.y*co+b.y*si),point.z+width*(n.z*co+b.z*si));
     const stripe=1+.025*Math.sin(theta*3+phase+t*3);colors.push(color.r*stripe,color.g*stripe,color.b*stripe);uv.push(t,a/sides);flex.push(t,phase,length,scale);
     if(j<steps&&a<sides){const idx=j*(sides+1)+a;indices.push(idx,idx+1,idx+sides+1,idx+1,idx+sides+2,idx+sides+1);}
    }
   }
   g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('anemoneFlex',new T.Float32BufferAttribute(flex,4));g.setIndex(indices);g.computeVertexNormals();
   // Weld shading across the UV seam; keep the indexed skin and every ring.
   const normals=g.getAttribute('normal');for(let row=0;row<steps;row++){const a=row*(sides+1),b=a+sides,n=new T.Vector3().fromBufferAttribute(normals,a).add(new T.Vector3().fromBufferAttribute(normals,b)).normalize();normals.setXYZ(a,n.x,n.y,n.z);normals.setXYZ(b,n.x,n.y,n.z);}
   const tipNormal=curve.getTangentAt(1).normalize();for(let a=0;a<=sides;a++)normals.setXYZ(steps*(sides+1)+a,tipNormal.x,tipNormal.y,tipNormal.z);
   parts.push(g);tentacles++;
  }
 }
 // This vertex-colored material never samples UVs; omit unused UV buffers.
 parts.forEach(g=>g.deleteAttribute('uv'));
 const geometry=mergeGeometries(parts,false);parts.forEach(g=>g.dispose());geometry.computeBoundingSphere();geometry.boundingSphere!.radius+=.35;
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:0});
 material.onBeforeCompile=shader=>{
  shader.uniforms.reefTime=clock;
  shader.vertexShader=`uniform float reefTime; attribute vec4 anemoneFlex;
   vec2 tissueFlow(float t,float phase){
    float surge=sin(reefTime*.83-t*.9-phase*.06),eddy=sin(reefTime*1.37+phase-t*2.1);
    return vec2(surge*.18+eddy*.04,cos(reefTime*.79-phase*.07)*.10+sin(reefTime*1.19+phase-t*1.6)*.027);
   }\n`+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   float tissueT=anemoneFlex.x;
   vec2 bend=tissueFlow(tissueT,anemoneFlex.y)*tissueT*tissueT*anemoneFlex.w;
   transformed.x+=bend.x;transformed.z+=bend.y;`);
  shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
   vec2 slope=tissueFlow(anemoneFlex.x,anemoneFlex.y)*2.*anemoneFlex.x*anemoneFlex.w/max(.15,anemoneFlex.z);
   objectNormal.y-=dot(slope,objectNormal.xz);objectNormal=normalize(objectNormal);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`outgoingLight+=diffuseColor.rgb*pow(1.-abs(dot(normal,geometryViewDir)),2.)*.055;
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> 'reef-anemone-radial-disc-v2';
 const mesh=new T.Mesh(geometry,material);mesh.name='Rooted flowing anemones';mesh.receiveShadow=true;
 return {mesh,tentacles};
}

