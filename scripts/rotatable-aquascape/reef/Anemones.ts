import * as T from 'three';
import {anemoneFlowGLSL} from './AnemoneFlow.ts';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

type Random=()=>number;
// A shallow radial disc with folded tissue and a recessed oral center.
function discPoint(t:number,a:number,scale:number,host=0){
 const q=a+host*1.73,edge=t*t;
 const r=.65*t*(1+.085*Math.sin(q*3)+.045*Math.cos(q*5));
 const fold=edge*(.105*Math.sin(q*2+.5)+.055*Math.cos(q*3-1.1))+.065*t*Math.cos(q);
 return new T.Vector3(Math.cos(a)*r*scale,
  (.07*(1-t*t)-.025-.12*Math.exp(-((t/.13)**2))+fold+.009*Math.sin(a*18+t*12)*Math.sin(Math.PI*t))*scale,
  Math.sin(a)*r*(.35+.56*T.MathUtils.smoothstep(t,0,.25))*scale);
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
  for(let j=0;j<cp.count;j++){const a=Math.atan2(cp.getZ(j),cp.getX(j)),rib=1+.055*Math.sin(a*7+cp.getY(j)*4)+.022*Math.sin(a*17);const t=cp.getY(j)/(columnTop-footY)+.5,edge=discPoint(1,a,scale,k);cp.setXYZ(j,T.MathUtils.lerp(cp.getX(j)*rib,edge.x,t*t),cp.getY(j)+t*t*(edge.y+.025*scale),T.MathUtils.lerp(cp.getZ(j)*rib,edge.z,t*t));}
  column.computeVertexNormals();column.translate(center.x,(columnTop+footY)/2,center.z);flesh(column,base.clone().multiplyScalar(.82));
  const dp:number[]=[],dc:number[]=[],duv:number[]=[],di:number[]=[],discRings=20,discSides=64;
  for(let layer=0;layer<2;layer++)for(let row=0;row<=discRings;row++)for(let j=0;j<=discSides;j++){
   const t=row/discRings,a=j/discSides*Math.PI*2,point=discPoint(t,a,scale,k);if(layer)point.y-= (.15-.115*t)*scale;point.add(center);
   dp.push(point.x,point.y,point.z);const c=base.clone().lerp(shaft,.18+.10*Math.sin(a*18+t*12)).multiplyScalar(layer?.65:.55+.45*T.MathUtils.smoothstep(t,.02,.17));dc.push(c.r,c.g,c.b);duv.push(Math.cos(a)*t,Math.sin(a)*t);
   if(row&&j){const n=layer*(discRings+1)*(discSides+1)+row*(discSides+1)+j,tri:number[]=[];if(row>1)tri.push(n-discSides-2,n-discSides-1,n-1);tri.push(n-discSides-1,n,n-1);if(layer)for(let k=0;k<tri.length;k+=3)[tri[k+1],tri[k+2]]=[tri[k+2],tri[k+1]];di.push(...tri);}
  }
  const lower=(discRings+1)*(discSides+1);for(let j=0;j<discSides;j++){const a=discRings*(discSides+1)+j;di.push(a,a+lower,a+1,a+1,a+lower,a+lower+1);}
  const disc=new T.BufferGeometry();disc.setAttribute('position',new T.Float32BufferAttribute(dp,3));disc.setAttribute('uv',new T.Float32BufferAttribute(duv,2));disc.setIndex(di);disc.computeVertexNormals();flesh(disc,base);disc.setAttribute('color',new T.Float32BufferAttribute(dc,3));
  for(let i=0;i<180;i++){
   const angle=i*2.399963+choose(-.14,.14),radial=Math.sqrt((i+.8)/180),r=(.23+.40*radial)*scale;
   const root=center.clone().add(discPoint(r/(.65*scale),angle,scale,k));root.y-=.012*scale;
   // Regional folds guide neighboring strands, while individuals keep different
   // lengths and tip directions. Reuse the same four random draws per strand.
   const length=choose(.39,.85)*scale*(.88+.22*radial),phase=choose(0,6.28),radius=choose(.019,.032)*scale;
   const sector=angle+k*1.73,spread=(.17+.31*radial)*scale*(1+.22*Math.sin(sector*2));
   const height=length*(.97-.23*radial)*(.88+.16*Math.cos(sector*2+.5));
   const curl=.115*scale*Math.sin(phase),sweep=.15*scale;
   const end=root.clone().add(new T.Vector3(Math.cos(angle)*spread+sweep-Math.sin(angle)*curl,height,Math.sin(angle)*spread+Math.cos(angle)*curl+.025*scale));
   const c1=root.clone().add(new T.Vector3(Math.cos(angle)*spread*.13,length*.44,Math.sin(angle)*spread*.13));
   // A finite, individually angled end handle avoids identical radial fans and
   // sharp hooks. Axes and shading below are rebuilt from the actual curve.
   const tipDirection=new T.Vector3(Math.cos(angle)*spread+sweep*.55-Math.sin(angle)*curl*1.7,length*(.28-.33*radial+.22*Math.sin(phase)),Math.sin(angle)*spread+Math.cos(angle)*curl*1.7).normalize();
   const c2=end.clone().addScaledVector(tipDirection,-(.27*length+.025*scale));
   // Some strands remain slender, others carry an inflated distal lobe. Tissue
   // color varies by region and individual without consuming extra scene RNG.
   const inflation=.20+.48*(.5+.5*Math.sin(phase*2.7+angle))**2;
   const pigment=.5+.5*Math.sin(phase*1.9+sector*.7);
   const localShaft=shaft.clone().lerp(new T.Color(k===2?'#98728f':'#9b874d'),pigment*.46);
   const localTip=tip.clone().lerp(new T.Color(k===2?'#cfbecd':'#d4c589'),(.5+.5*Math.sin(phase*3.1))*.34);
   c1.add(new T.Vector3(-Math.sin(angle),0,Math.cos(angle)).multiplyScalar(.035*scale*Math.sin(phase*1.7)));
   const curve=new T.CubicBezierCurve3(root,c1,c2,end),steps=18,sides=8,frames=curve.computeFrenetFrames(steps,false),arcLength=curve.getLength();
   // The cap's length follows its radius, not a fixed fraction of a long shaft.
   // This keeps a fleshy hemispherical end rather than an elongated pointed beak.
   const capSpan=radius*.88*(.44+inflation)/arcLength,capStart=1-capSpan;
   const g=new T.BufferGeometry(),positions:number[]=[],colors:number[]=[],uv:number[]=[],flex:number[]=[],axes:number[]=[],indices:number[]=[];
   for(let j=0;j<=steps;j++){
    const t=j<=14?j/14*capStart:capStart+capSpan*[.38,.70,.92,1][j-15],point=curve.getPointAt(t),shaftT=Math.min(t,capStart);
    // Smooth taper with a gently inflated end, then a continuous rounded closure.
    const width=radius*.88*(1-.56*shaftT+inflation*Math.exp(-(((shaftT-capStart)/.09)**2)))*(1+.07*Math.sin(shaftT*9+phase)*Math.sin(Math.PI*shaftT))*Math.sqrt(Math.max(0,1-(Math.max(0,t-capStart)/capSpan)**2));
    const color=base.clone().lerp(localShaft,T.MathUtils.smoothstep(t,0,.32)).lerp(localTip,T.MathUtils.smoothstep(t,.83,1)).multiplyScalar(.82+.19*Math.sin(phase)*Math.sin(t*2.6));
    const tangent=curve.getTangentAt(t),sum=Math.abs(tangent.x)+Math.abs(tangent.y)+Math.abs(tangent.z);let ax=tangent.x/sum,ay=tangent.y/sum;
    if(tangent.z<0){const oldX=ax;ax=(1-Math.abs(ay))*(ax>=0?1:-1);ay=(1-Math.abs(oldX))*(ay>=0?1:-1);}
    for(let a=0;a<=sides;a++){
     const theta=a/sides*Math.PI*2,frame=t*steps,lo=Math.min(steps-1,Math.floor(frame)),mix=frame-lo,n=frames.normals[lo].clone().lerp(frames.normals[lo+1],mix).normalize(),b=frames.binormals[lo].clone().lerp(frames.binormals[lo+1],mix).normalize(),co=Math.cos(theta),si=Math.sin(theta);
     positions.push(point.x+width*(n.x*co+b.x*si),point.y+width*(n.y*co+b.y*si),point.z+width*(n.z*co+b.z*si));
     const stripe=1+.045*Math.sin(theta*3+phase+t*3)+.018*Math.cos(theta*2-t*17+phase);colors.push(color.r*stripe,color.g*stripe,color.b*stripe);uv.push(t,a/sides);flex.push(t,phase,arcLength,scale);axes.push(Math.round(ax*32767),Math.round(ay*32767));
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
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.70,metalness:0});
 material.onBeforeCompile=shader=>{
  shader.uniforms.reefTime=clock;
  shader.vertexShader=`uniform float reefTime; attribute vec4 anemoneFlex; attribute vec2 anemoneAxis; varying vec4 anemoneSkin;\n${anemoneFlowGLSL}\n`+shader.vertexShader;
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
   transformed.x+=tissueBend.x;transformed.z+=tissueBend.y;
   anemoneSkin=vec4(position,anemoneFlex.w>0.?1.+tissueT:0.);`);
  // Rest-space pigmentation moves with the skin, rather than sliding through it
  // or changing with the camera. Filter fine detail as its screen footprint shrinks.
  shader.fragmentShader='varying vec4 anemoneSkin;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec3 skinP=anemoneSkin.xyz;
   float mottling=sin(skinP.x*43.+sin(skinP.y*27.))*sin(skinP.z*37.-skinP.y*31.);
   vec2 grainPhase=vec2(skinP.x*227.+skinP.z*143.,skinP.y*191.-skinP.z*173.);
   vec2 grainFootprint=fwidth(grainPhase);
   float fineMask=1.-smoothstep(1.,3.14159,grainFootprint.x+grainFootprint.y);
   float granules=sin(grainPhase.x)*sin(grainPhase.y);
   diffuseColor.rgb*=1.+.055*mottling+.025*granules*fineMask;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
   #if NUM_DIR_LIGHTS > 0
   float tissueRim=1.-abs(dot(normal,geometryViewDir));
   float backlight=pow(clamp(dot(-normal,directionalLights[0].direction)*.5+.5,0.,1.),2.);
   float thinTip=smoothstep(1.40,1.95,anemoneSkin.w);
   outgoingLight+=diffuseColor.rgb*backlight*(.018+.055*tissueRim+.035*thinTip);
   #endif
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> 'reef-anemone-pigmented-tissue-v4';
 const mesh=new T.Mesh(geometry,material);mesh.name='Rooted flowing anemones';mesh.receiveShadow=true;
 return {mesh,tentacles};
}
