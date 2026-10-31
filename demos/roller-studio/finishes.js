import * as T from '../aquaclear-studio/vendor/three.module.js';
const seeded=()=>{let n=12643;return()=>((n=(n*1664525+1013904223)>>>0)/4294967296);};
// A nonwoven mat: overlapping curved fibers, clumps and small voids, not a grid.
export function textile(){
 const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d'),r=seeded();x.fillStyle='#d5d2bf';x.fillRect(0,0,1024,1024);
 for(let i=0;i<2800;i++){const a=r()*1024,b=r()*1024,rad=2+r()*9;x.fillStyle=`rgba(105,99,75,${.025+r()*.05})`;x.beginPath();x.ellipse(a,b,rad,rad*.55,r()*6.28,0,6.28);x.fill();}
 for(let i=0;i<33000;i++){const a=r()*1024,b=r()*1024,ang=r()*6.28,len=4+r()*40,dx=Math.cos(ang)*len,dy=Math.sin(ang)*len;x.strokeStyle=r()>.28?'rgba(255,253,232,.38)':'rgba(91,87,66,.19)';x.lineWidth=.45+r()*1.2;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(a+dx*.5+dy*.17,b+dy*.5-dx*.17,a+dx,b+dy);x.stroke();}
 const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.anisotropy=8;tex.colorSpace=T.SRGBColorSpace;return tex;
}
export function webFinish(material,loading,travel,length){
 material.roughness=.88;material.bumpScale=.028;
 material.onBeforeCompile=s=>{Object.assign(s.uniforms,{webLoading:loading,webTravel:travel,webLength:length});s.vertexShader='varying vec2 fleeceUV;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfleeceUV=uv;');s.fragmentShader=`uniform float webLoading,webTravel,webLength;varying vec2 fleeceUV;
 float fh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float fn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(fh(i),fh(i+vec2(1,0)),f.x),mix(fh(i+vec2(0,1)),fh(i+vec2(1,1)),f.x),f.y);}
 `+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float webT=fleeceUV.y/webLength;vec2 materialUV=vec2(fleeceUV.x*1.8,fleeceUV.y-webTravel);float wetZone=smoothstep(.12,.27,webT);float wasteZone=smoothstep(.62,.86,webT);float cloud=fn(materialUV*6.)*.55+fn(materialUV*17.)*.3+fn(materialUV*43.)*.15;float fleck=smoothstep(.68,.84,fn(materialUV*120.));float soil=wetZone*mix(webLoading*.8,.9,wasteZone);vec3 dirt=mix(vec3(.23,.14,.045),vec3(.50,.37,.15),cloud);diffuseColor.rgb=mix(diffuseColor.rgb,dirt,clamp(soil*(.45+cloud*.9)+fleck*soil*.25,0.,.96));diffuseColor.rgb*=1.-wetZone*.08;
 `);s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 roughnessFactor=mix(.92,.48,smoothstep(.15,.28,fleeceUV.y/webLength))+.05*fn(vec2(fleeceUV.x*20.,fleeceUV.y*20.-webTravel*20.));`);};material.customProgramCacheKey=()=> 'roller-nonwoven-v2';
}
// Broad, uneven staining on the used roll reads at normal viewing distance;
// the fiber map supplies the smaller surface detail underneath it.
export function usedRollFinish(material){
 material.roughness=.72;material.bumpScale=.032;
 material.onBeforeCompile=s=>{s.vertexShader='varying vec2 rollUV;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nrollUV=uv;');s.fragmentShader='varying vec2 rollUV;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float stainPatch=sin(rollUV.x*49.+sin(rollUV.y*19.)*2.)*sin(rollUV.y*31.+sin(rollUV.x*21.)*1.4);float speck=fract(sin(dot(floor(rollUV*vec2(340.,210.)),vec2(12.9898,78.233)))*43758.5453);diffuseColor.rgb*=.80+.28*stainPatch;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.11,.075,.025),smoothstep(.91,.995,speck)*.45);`);};material.customProgramCacheKey=()=> 'roller-loaded-roll-v2';
}
export function addSurfaceDetail({web,spools,porcelain,steel,groups,mesh,box,torus}){
 const r=seeded(),fuzzGeo=new T.BufferGeometry(),fuzzPos=new Float32Array(1100*6);fuzzGeo.setAttribute('position',new T.BufferAttribute(fuzzPos,3));const fuzz=new T.LineSegments(fuzzGeo,new T.LineBasicMaterial({color:'#eee9cf',transparent:true,opacity:.34}));fuzz.frustumCulled=false;web.add(fuzz);const fibers=Array.from({length:1100},()=>({d:r()*16,z:(r()-.5)*1.8,len:.008+r()*.025,side:r()>.5?1:-1}));
 const trapped=new T.InstancedMesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({color:'#77603a',roughness:.65}),260),dummy=new T.Object3D();trapped.frustumCulled=false;web.add(trapped);const dirt=Array.from({length:260},()=>({d:r()*16,z:(r()-.5)*1.73,size:.005+r()*.012,a:r()*6.28}));
 const surface=new T.Group();groups.housing.add(surface);for(const x of [-1.83,1.83])for(const z of [-1.13,1.13])for(const y of [.58,3.42]){const o=mesh(surface,new T.CylinderGeometry(.038,.038,.018,6),steel,[x,y,z],[Math.PI/2,0,0]);box(surface,.038,.007,.009,[x,y,z+(z>0?.011:-.011)],new T.MeshStandardMaterial({color:'#243339'}));}
 // Fixed bearings contrast with one asymmetric index stripe on each rotating cap.
 for(let i=0;i<2;i++){const spool=spools[i],x=i?1.34:-1.34;torus(groups.housing,.16,.018,[x,4.25,1.12],steel);box(spool.rot,.065,.21,.018,[0,.12,1.222],new T.MeshStandardMaterial({color:'#f5bd56',roughness:.4,metalness:.15}));box(spool.rot,.044,.07,.018,[.12,-.11,1.221],new T.MeshStandardMaterial({color:'#222b2b'}));}
 let last='';
 return {update(s,path,length){const key=s.travel+':'+length;if(last===key)return;last=key;for(let i=0;i<fibers.length;i++){const f=fibers[i],d=((f.d+s.travel)%length),u=d/length,p=path.getPointAt(u),tan=path.getTangentAt(u),normal=new T.Vector3(-tan.y,tan.x,0);p.addScaledVector(normal,.006);p.z=f.z;const k=i*6;fuzzPos[k]=p.x;fuzzPos[k+1]=p.y;fuzzPos[k+2]=p.z;fuzzPos[k+3]=p.x+tan.x*f.len;fuzzPos[k+4]=p.y+tan.y*f.len;fuzzPos[k+5]=p.z+f.len*f.side;}fuzzGeo.attributes.position.needsUpdate=true;
 for(let i=0;i<dirt.length;i++){const f=dirt[i],u=((f.d+s.travel)%length)/length,p=path.getPointAt(u),tan=path.getTangentAt(u),n=new T.Vector3(-tan.y,tan.x,0);p.addScaledVector(n,.014);p.z=f.z;dummy.position.copy(p);dummy.rotation.set(f.a,f.a*.3,f.a);const size=u>.32&&u<.98?f.size:0;dummy.scale.set(size,size*.7,size*.4);dummy.updateMatrix();trapped.setMatrixAt(i,dummy.matrix);}trapped.instanceMatrix.needsUpdate=true;},snapshot:()=>({surfaceFibers:1100,attachedFlecks:260})};
}
