import {identifyGeometry,polypNotes} from './ReefIdentification.ts';
import * as T from 'three';

type Surface=(x:number,z:number)=>{point:T.Vector3;normal:T.Vector3}|null;
type Random=()=>number;
/** Tissue follows sampled rock. No independent sphere or planter beneath colonies. */
export function encrustingGarden(x:number,z:number,radius:number,kind:'zoanthid'|'stony',sample:Surface,random:Random,overlay?:Surface){
 const positions:number[]=[],colors:number[]=[],uvs:number[]=[],flex:number[]=[],phases:number[]=[],indices:number[]=[],seams:[number,number][]=[];
 const base=kind==='zoanthid'?new T.Color('#504350'):new T.Color('#3e7569');
 const orange=new T.Color('#d46217'),green=new T.Color('#34774d'),cyan=new T.Color('#1b555c'),mouth=new T.Color('#243643');
 let polypCount=0,tentacleCount=0,attachmentError=0;
 function vertex(p:T.Vector3,c:T.Color,motion=0,phase=0){const id=positions.length/3;positions.push(p.x,p.y,p.z);colors.push(c.r,c.g,c.b);uvs.push(p.x*3,p.z*3);flex.push(motion);phases.push(phase);return id;}
 // Hexagonal packing with individual offsets and sizes avoids phyllotaxis spirals.
 const pitch=kind==='zoanthid'?.105:.068,spread=radius*.86;
 for(let row=-Math.ceil(spread/pitch);row<=Math.ceil(spread/pitch);row++)for(let col=-Math.ceil(spread/pitch);col<=Math.ceil(spread/pitch);col++){
  const dx=(col+(row%2)*.5)*pitch+(random()-.5)*pitch*.22,dz=row*pitch*.866+(random()-.5)*pitch*.22,a=Math.atan2(dz,dx);
  if(Math.hypot(dx,dz)>spread*(1+.09*Math.sin(a*5+.7)))continue;
  let surface=sample(x+dx,z+dz);if(!surface||surface.normal.y<.25)continue;
  // Added thin living tissue may raise an existing polyp's attachment, but must
  // not change acceptance/RNG draws and erase or reshuffle established gardens.
  const cover=overlay?.(x+dx,z+dz);if(cover&&cover.point.y>surface.point.y&&cover.point.y-surface.point.y<.12)surface=cover;
  const center=surface.point.clone().addScaledVector(surface.normal,.003),normal=surface.normal.clone();
  const tangent=new T.Vector3(1,0,0).addScaledVector(normal,-normal.x).normalize(),bitangent=new T.Vector3().crossVectors(tangent,normal).normalize();
  const point=(u:number,h:number,v:number)=>center.clone().addScaledVector(tangent,u).addScaledVector(normal,h).addScaledVector(bitangent,v);
  const r=(kind==='zoanthid'?.046:.034)*(.79+random()*.3),height=(kind==='zoanthid'?.03:.009)*(.65+random()*.6),phase=random()*6.28;
  const rim=(kind==='zoanthid'?(random()<.72?orange:green):green).clone().multiplyScalar(.8+random()*.32);
  const inner=(kind==='zoanthid'?cyan:base).clone().multiplyScalar(.75+random()*.4);
  // Interleaved warm oral discs and cool skirts echo the mixed small colonies
  // in the reference; variation uses the existing phase, not more RNG draws.
  if(kind==='zoanthid'&&phase>2.1&&phase<5.65){
   rim.copy(phase<3.8?cyan:green).multiplyScalar(1.05+.10*Math.sin(phase*3));
   inner.set(phase<4.5?'#cb7c24':'#a77e35').multiplyScalar(.8+.13*Math.sin(phase*2.7));
  }
  // A fleshy rolled margin and an inset oral slit replace the thin flat disc.
  // The lower column stays fixed against its original rock attachment.
  const soft=kind==='zoanthid',segments=36,rings=soft?[[.75,0],[.71,.35],[.79,.73],[.93,.96],[1,1.03],[.96,1.08],[.87,1.06],[.77,.96],[.61,.87],[.43,.84],[.24,.86],[.13,.8],[.07,.57],[0,.55]]:[[1.08,0],[.97,.4],[.82,1],[.65,.72],[.32,.17],[0,.1]];
  const start=positions.length/3;
  for(let k=0;k<rings.length-(soft?1:0);k++)for(let j=0;j<=segments;j++){
   const angle=j/segments*(soft?Math.PI*2:6.28),rad=r*rings[k][0]*(1+(soft&&k>1?.065:.035)*Math.sin(angle*5+phase));
   const fold=soft&&k>1?r*.075*Math.sin(angle*3+phase)*Math.sin(Math.PI*Math.min(1,rings[k][0])):0;
   const h=height*rings[k][1]+fold+Math.sin(angle*12+(soft?phase:0))*r*(soft?.035:.045)*(k>1&&k<rings.length-2?1:0);
   const c=k<2?base.clone():k<(soft?7:5)?rim.clone():inner.clone().lerp(rim,k===(soft?9:7)?.34:0).lerp(mouth,k>=rings.length-2?(soft?.94:.88):0);
   c.multiplyScalar(soft?.88+.06*Math.cos(angle*24+phase)+.055*Math.sin(angle*7+phase*1.7+k*.6):.85+.1*Math.cos(angle*24+phase)+.045*Math.sin(angle*43+k*4.3));
   const mouthShape=k>=rings.length-(soft?3:2)?(soft?.34:.4):1;vertex(point(Math.cos(angle)*rad,h,Math.sin(angle)*rad*mouthShape),c,soft&&k>2?.08*rings[k][0]:0,phase);
   if(soft&&j===segments)seams.push([start+k*(segments+1),start+k*(segments+1)+segments]);
   if(k<rings.length-(soft?2:1)&&j<segments){const n=start+k*(segments+1)+j;indices.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2);}
  }
  if(soft){const center=vertex(point(0,height*.55,0),mouth,0,phase),last=start+(rings.length-2)*(segments+1);for(let j=0;j<segments;j++)indices.push(last+j,center,last+j+1);}
  polypCount++;attachmentError=Math.max(attachmentError,center.distanceTo(surface.point));
  if(kind==='stony')continue;
  // Two alternating whorls, with a curved taper to every tip. Roots are fixed.
  for(let j=0;j<24;j++){
   const angle=j/24*Math.PI*2+phase,reach=r*(.46+random()*.18)*.8,tilt=(j%2?.22:-.16)+.16*Math.sin(phase+j*2.3);
   const root=new T.Vector3(Math.cos(angle)*r*.97,height*1.02,Math.sin(angle)*r*.97),end=new T.Vector3(Math.cos(angle)*(r+reach),height+reach*tilt,Math.sin(angle)*(r+reach));
   const side=new T.Vector3(-Math.sin(angle),0,Math.cos(angle));
   const control=root.clone().lerp(end,.5).addScaledVector(side,r*.12*Math.sin(phase*1.7+j*2.1));control.y+=r*(.20+.07*Math.sin(j*1.9+phase));
   const curve=new T.QuadraticBezierCurve3(root,control,end);
   const start=positions.length/3,sections=5,sides=7;
   for(let k=0;k<=sections;k++){
    const t=k/sections,c=curve.getPoint(t),axis=curve.getTangent(t),lateral=side.clone().addScaledVector(axis,-side.dot(axis)).normalize(),up=new T.Vector3().crossVectors(axis,lateral).normalize();
    const width=r*.083*(.24+.76*Math.pow(1-t, .65));
    for(let l=0;l<=sides;l++){
     const q=l/sides*Math.PI*2,p=c.clone().addScaledVector(lateral,Math.cos(q)*width).addScaledVector(up,Math.sin(q)*width),shade=rim.clone().lerp(new T.Color('#aca77e'),t*.23).multiplyScalar(.91+.075*Math.sin(j*2.7+phase+t*4));
     vertex(point(p.x,p.y,p.z),shade,t*t,phase);
     if(k<sections&&l<sides){const n=start+k*(sides+1)+l;indices.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1);}
    }
    seams.push([start+k*(sides+1),start+k*(sides+1)+sides]);
   }
   const tip=vertex(point(end.x,end.y,end.z),rim.clone().multiplyScalar(.94),1,phase);
   for(let l=0;l<sides;l++){const n=start+sections*(sides+1)+l;indices.push(n,n+1,tip);}
   tentacleCount++;
  }
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setAttribute('polypFlex',new T.Float32BufferAttribute(flex,1));geometry.setAttribute('polypPhase',new T.Float32BufferAttribute(phases,1));geometry.setIndex(indices);geometry.computeVertexNormals();
 const normals=geometry.getAttribute('normal'),average=new T.Vector3();
 for(const [a,b] of seams){average.set(normals.getX(a)+normals.getX(b),normals.getY(a)+normals.getY(b),normals.getZ(a)+normals.getZ(b)).normalize();normals.setXYZ(a,average.x,average.y,average.z);normals.setXYZ(b,average.x,average.y,average.z);}
 identifyGeometry(geometry,polypNotes[kind]);return {geometry,polypCount,tentacleCount,attachmentError};
}
export function animatePolypMaterial(material:T.MeshStandardMaterial,clock:{value:number}){
 material.onBeforeCompile=shader=>{shader.uniforms.polypTime=clock;shader.vertexShader='attribute float polypFlex; attribute float polypPhase; uniform float polypTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
 float surge=sin(polypTime*1.25+position.x*2.1+position.z*1.7);
 float flutter=sin(polypTime*(1.65+.18*sin(polypPhase))+polypPhase);
 transformed.x+=polypFlex*.0036*(surge*.7+flutter*.3);
 transformed.z+=polypFlex*.0025*sin(polypTime*1.13+polypPhase*.7+position.x*3.7);`);};
 material.customProgramCacheKey=()=> 'rooted-polyp-fringes-v2';
}
