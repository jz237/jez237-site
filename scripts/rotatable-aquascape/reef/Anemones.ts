import * as T from 'three';
import {anemoneFlowGLSL} from './AnemoneFlow.ts';
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
  g.setAttribute('color',new T.BufferAttribute(colors,3));g.setAttribute('anemoneAxis',new T.Int16BufferAttribute(new Int16Array(n*2),2,true));g.setAttribute('anemoneFlex',new T.BufferAttribute(new Float32Array(n*4),4));
  parts.push(g);
 }
 for(let k=0;k<3;k++){
  const center=(k<2?hosts[k]:new T.Vector3(3.88,.52,1.73)).clone(),scale=k===0?1:k===1?.63:.46;
  const ground=supportHeight(center);center.y=Math.min(center.y,ground+.22*scale);
  const base=new T.Color(k===2?'#65566b':'#595b3c'),shaft=new T.Color(k===2?'#ad7b99':'#7d8550'),tip=new T.Color(k===2?'#b6c9cf':'#bdd5b3');
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
   const length=choose(.39,.85)*scale*(.88+.22*radial),spread=(.22+.36*radial)*scale,phase=choose(0,6.28),radius=choose(.019,.032)*scale;
   const end=root.clone().add(new T.Vector3(Math.cos(angle)*spread+.15*scale,length*(.94-.28*radial)+.055*scale*Math.sin(phase),Math.sin(angle)*spread+.025*scale));
   const c1=root.clone().add(new T.Vector3(Math.cos(angle)*spread*.12,length*.39,Math.sin(angle)*spread*.12));
   // Keep a finite end handle: nearly coincident control points previously
   // produced sharp hooks and a sudden cap highlight at some random phases.
   const tipDirection=new T.Vector3(end.x-root.x+Math.sin(phase)*.04*scale,length*(.20-.30*radial),end.z-root.z+Math.cos(phase)*.035*scale).normalize();
   const c2=end.clone().addScaledVector(tipDirection,-(.24*length+.025*scale));
   const curve=new T.CubicBezierCurve3(root,c1,c2,end),steps=18,sides=8,frames=curve.computeFrenetFrames(steps,false),arcLength=curve.getLength();
   const g=new T.BufferGeometry(),positions:number[]=[],colors:number[]=[],uv:number[]=[],flex:number[]=[],axes:number[]=[],indices:number[]=[];
   for(let j=0;j<=steps;j++){
    const t=j<=14?j/14*.94:[.965,.985,.997,1][j-15],point=curve.getPointAt(t);
    // Smooth taper with a gently inflated end, then a continuous rounded closure.
    const width=radius*(1-.48*t+(.10+.09*Math.sin(phase)**2)*Math.exp(-(((t-.90)/.065)**2)))*(1+.065*Math.sin(t*9+phase)*Math.sin(Math.PI*t))*Math.sqrt(Math.max(0,1-((Math.max(0,t-.95))/.05)**2));
    const color=base.clone().lerp(shaft,T.MathUtils.smoothstep(t,0,.36)).lerp(tip,T.MathUtils.smoothstep(t,.94,1)).multiplyScalar(.83+.18*Math.sin(phase)*Math.sin(t*2.6));
    const tangent=curve.getTangentAt(t),sum=Math.abs(tangent.x)+Math.abs(tangent.y)+Math.abs(tangent.z);let ax=tangent.x/sum,ay=tangent.y/sum;
    if(tangent.z<0){const oldX=ax;ax=(1-Math.abs(ay))*(ax>=0?1:-1);ay=(1-Math.abs(oldX))*(ay>=0?1:-1);}
    for(let a=0;a<=sides;a++){
     const theta=a/sides*Math.PI*2,frame=t*steps,lo=Math.min(steps-1,Math.floor(frame)),mix=frame-lo,n=frames.normals[lo].clone().lerp(frames.normals[lo+1],mix).normalize(),b=frames.binormals[lo].clone().lerp(frames.binormals[lo+1],mix).normalize(),co=Math.cos(theta),si=Math.sin(theta);
     positions.push(point.x+width*(n.x*co+b.x*si),point.y+width*(n.y*co+b.y*si),point.z+width*(n.z*co+b.z*si));
     const stripe=1+.025*Math.sin(theta*3+phase+t*3);colors.push(color.r*stripe,color.g*stripe,color.b*stripe);uv.push(t,a/sides);flex.push(t,phase,arcLength,scale);axes.push(Math.round(ax*32767),Math.round(ay*32767));
     if(j<steps&&a<sides){const idx=j*(sides+1)+a;indices.push(idx,idx+1,idx+sides+1,idx+1,idx+sides+2,idx+sides+1);}
    }
   }
   g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('anemoneFlex',new T.Float32BufferAttribute(flex,4));g.setAttribute('anemoneAxis',new T.Int16BufferAttribute(axes,2,true));g.setIndex(indices);g.computeVertexNormals();
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
  shader.vertexShader=`uniform float reefTime; attribute vec4 anemoneFlex; attribute vec2 anemoneAxis;\n${anemoneFlowGLSL}\n`+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
   float tissueT=anemoneFlex.x;
   vec4 flow=tissueFlow(tissueT,anemoneFlex.y);
   float flowScale=min(anemoneFlex.w,anemoneFlex.z*.85);
   vec2 tissueBend=flow.xy*tissueT*tissueT*flowScale;
   vec2 derivative=(flow.zw*tissueT*tissueT+2.*tissueT*flow.xy)*flowScale;
   vec3 gradient=tissueAxis(anemoneAxis)/max(.15,anemoneFlex.z);
   vec3 deformation=vec3(derivative.x,0.,derivative.y);
   objectNormal-=gradient*dot(deformation,objectNormal)/max(.25,1.+dot(gradient,deformation));
   objectNormal=normalize(objectNormal);`);
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   transformed.x+=tissueBend.x;transformed.z+=tissueBend.y;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`outgoingLight+=diffuseColor.rgb*pow(1.-abs(dot(normal,geometryViewDir)),2.)*.055;
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> 'reef-anemone-curved-tissue-v3';
 const mesh=new T.Mesh(geometry,material);mesh.name='Rooted flowing anemones';mesh.receiveShadow=true;
 return {mesh,tentacles};
}

