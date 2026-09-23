import * as T from 'three';

type Surface=(x:number,z:number)=>{point:T.Vector3;normal:T.Vector3}|null;
type Random=()=>number;
/** Tissue follows sampled rock. No independent sphere or planter beneath colonies. */
export function encrustingGarden(x:number,z:number,radius:number,kind:'zoanthid'|'stony',sample:Surface,random:Random,overlay?:Surface){
 const positions:number[]=[],colors:number[]=[],uvs:number[]=[],flex:number[]=[],indices:number[]=[];
 const base=kind==='zoanthid'?new T.Color('#504350'):new T.Color('#3e7569');
 const orange=new T.Color('#d46217'),green=new T.Color('#34774d'),cyan=new T.Color('#1b555c'),mouth=new T.Color('#243643');
 let polypCount=0,tentacleCount=0,attachmentError=0;
 function vertex(p:T.Vector3,c:T.Color,motion=0){const id=positions.length/3;positions.push(p.x,p.y,p.z);colors.push(c.r,c.g,c.b);uvs.push(p.x*3,p.z*3);flex.push(motion);return id;}
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
  const segments=36,rings=kind==='zoanthid'?[[.75,0],[.72,.4],[.86,.87],[1,1],[.93,1.01],[.8,.97],[.66,.9],[.49,.85],[.27,.84],[.12,.85],[0,.83]]:[[1.08,0],[.97,.4],[.82,1],[.65,.72],[.32,.17],[0,.1]];
  const start=positions.length/3;
  for(let k=0;k<rings.length;k++)for(let j=0;j<=segments;j++){
   const angle=j/segments*6.28,rad=r*rings[k][0]*(1+.035*Math.sin(angle*5+phase));
   const h=height*rings[k][1]+Math.sin(angle*12)*r*.045*(k>1&&k<rings.length-2?1:0);
   const c=k<2?base.clone():k<5?rim.clone():inner.clone().lerp(rim,k===7?.34:0).lerp(mouth,k>=rings.length-2?.88:0);
   c.multiplyScalar(.85+.1*Math.cos(angle*24+phase)+.045*Math.sin(angle*43+k*4.3));
   const mouthShape=k>=rings.length-2?.4:1;vertex(point(Math.cos(angle)*rad,h,Math.sin(angle)*rad*mouthShape),c);
   if(k<rings.length-1&&j<segments){const n=start+k*(segments+1)+j;indices.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2);}
  }
  polypCount++;attachmentError=Math.max(attachmentError,center.distanceTo(surface.point));
  if(kind==='stony')continue;
  // Two alternating whorls, with a curved taper to every tip. Roots are fixed.
  for(let j=0;j<24;j++){
   const angle=j/24*6.28+phase,reach=r*(.46+random()*.18),tilt=j%2?.28:-.12;
   const root=new T.Vector3(Math.cos(angle)*r*.97,height*.99,Math.sin(angle)*r*.97),end=new T.Vector3(Math.cos(angle)*(r+reach),height+reach*tilt,Math.sin(angle)*(r+reach));
   const side=new T.Vector3(-Math.sin(angle),0,Math.cos(angle)),up=new T.Vector3().crossVectors(end.clone().sub(root).normalize(),side).normalize();
   const start=positions.length/3,sections=4,sides=5;
   for(let k=0;k<=sections;k++){
    const t=k/sections,c=root.clone().lerp(end,t);c.y+=Math.sin(t*Math.PI)*r*.15;
    const width=r*.085*(1-t*.94);
    for(let l=0;l<=sides;l++){
     const q=l/sides*6.28,p=c.clone().addScaledVector(side,Math.cos(q)*width).addScaledVector(up,Math.sin(q)*width),shade=rim.clone().lerp(new T.Color('#b7c792'),t*.55);
     vertex(point(p.x,p.y,p.z),shade,t*t);
     if(k<sections&&l<sides){const n=start+k*(sides+1)+l;indices.push(n,n+sides+1,n+1,n+1,n+sides+1,n+sides+2);}
    }
   }
   tentacleCount++;
  }
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setAttribute('polypFlex',new T.Float32BufferAttribute(flex,1));geometry.setIndex(indices);geometry.computeVertexNormals();
 return {geometry,polypCount,tentacleCount,attachmentError};
}
export function animatePolypMaterial(material:T.MeshStandardMaterial,clock:{value:number}){
 material.onBeforeCompile=shader=>{shader.uniforms.polypTime=clock;shader.vertexShader='attribute float polypFlex; uniform float polypTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
 float surge=sin(polypTime*1.5+position.x*2.1+position.z*1.7);
 transformed.x+=polypFlex*.0045*surge;
 transformed.z+=polypFlex*.003*sin(polypTime*1.13+position.x*3.7);`);};
 material.customProgramCacheKey=()=> 'rooted-polyp-fringes-v1';
}
