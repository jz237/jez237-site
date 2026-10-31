import * as T from '../aquaclear-studio/vendor/three.module.js';
import {annulus} from '../sand-studio/mechanics.js?v=2';
const TAU=Math.PI*2,V=(...p)=>new T.Vector3(...p);
// Periodic, bounded plumes: wall bubbles rise more slowly; no CFD claim.
export function bubblePosition(seed,phase,level){
 const t=(seed.h+phase*seed.speed*(1-.48*seed.r*seed.r))%1;
 const y=1.25+t*Math.max(.05,level-1.25),limit=y<3.25?1.08:y<4.65?1.08-(y-3.25)/1.4*.67:.41;
 const plume=seed.a+Math.sin(t*9+phase*.31+seed.h*6)*.28;
 const spread=.28+.65*(1-Math.exp(-t*8)),r=Math.min(limit*.94,seed.r*limit*spread+.055*Math.sin(t*19+seed.a));
 return [Math.cos(plume)*r,y,Math.sin(plume)*r];
}
export function foamHeight(r,a,s){
 const crown=Math.min(6.08,s.foamTop),edge=5.18+s.cup*.99;
 const fold=.045*Math.sin(a*3+s.phase*.6)+.025*Math.sin(a*7-s.phase*.31);
 const turn=T.MathUtils.smoothstep(r,.35+fold,.66+fold);
 const wave=(Math.sin(a*3+s.phase*.73)+Math.sin(a*7-s.phase*.36))*.035;
 return crown*(1-turn)+(Math.max(edge+.018,5.23)) *turn+wave*Math.sin(Math.PI*r/.85)+.007*Math.sin(a*37+r*140-s.phase*1.3)*Math.sin(r*76-a*13);
}
function cellTexture(){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),im=ctx.createImageData(256,256);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){let d1=1e5,d2=1e5;const u=x/256*13,v=y/256*13,ix=Math.floor(u),iy=Math.floor(v);for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const gx=ix+i,gy=iy+j,h=(gx%13+13)%13,k=(gy%13+13)%13;const px=gx+.5+.32*Math.sin(h*8.3+k*7.1),py=gy+.5+.32*Math.cos(h*5.7+k*9.3),d=(u-px)**2+(v-py)**2;if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}const edge=Math.exp(-(Math.sqrt(d2)-Math.sqrt(d1))*24),q=(y*256+x)*4;im.data[q]=im.data[q+1]=im.data[q+2]=Math.round(130+edge*120);im.data[q+3]=255;}ctx.putImageData(im,0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,3);return t;
}
export function refineAcrylic(glass){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#777';x.fillRect(0,0,512,512);x.strokeStyle='#939393';x.lineWidth=.4;for(let i=0;i<95;i++){const a=(i*197)%512,b=(i*83)%512;x.beginPath();x.moveTo(a,b);x.lineTo(a+5+(i%15),b+(i%5)*.3);x.stroke();}const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;
 glass.roughnessMap=map;glass.roughness=.18;glass.clearcoat=1;glass.clearcoatRoughness=.06;glass.ior=1.49;glass.transmission=.12;glass.thickness=.035;
 glass.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`float edge=pow(1.-abs(dot(normal,normalize(vViewPosition))),3.);diffuseColor.a*=.55+edge*2.3;\n#include <opaque_fragment>`);};glass.customProgramCacheKey=()=> 'skimmer-acrylic-v2';
}
export function addRefinements({groups,liquids,glass,plastic,metal,ceramic,rotor,foamMat,cupMat}){
 const {body,cone,neck,cup,pump}=groups,wet=new T.Group();liquids.add(wet);const cupWet=new T.Group();cup.add(cupWet);const mechanics=new T.Group();pump.add(mechanics);const dummy=new T.Object3D();
 const mesh=(g,geometry,material,p=[0,0,0])=>{const o=new T.Mesh(geometry,material);o.position.set(...p);g.add(o);return o;};
 const rimMat=glass.clone();rimMat.opacity=.34;rimMat.transmission=0;
 for(const [g,outer,inner,y]of [[body,1.1,1.065,.42],[body,1.1,1.065,3.25],[cone,.42,.392,4.65],[neck,.42,.392,5.77],[cup,1.01,.975,6.2]])mesh(g,annulus(outer,inner,.028),rimMat,[0,y,0]);
 // Exposed wall edges retain real radial thickness in the section study.
 const sectionEdges=new T.Group();body.add(sectionEdges);for(const x of [-1.083,1.083])mesh(sectionEdges,new T.BoxGeometry(.034,2.83,.028),rimMat,[x,1.835,0]);
 const texture=cellTexture(),film=foamMat.clone();film.map=texture;film.bumpMap=texture;film.bumpScale=.008;film.opacity=.46;film.roughness=.27;film.side=T.DoubleSide;
 const capCells=new T.InstancedMesh(new T.SphereGeometry(1,9,6),foamMat,480);capCells.frustumCulled=false;wet.add(capCells);
 const capGeo=new T.PlaneGeometry(1,1,96,18),cap=mesh(wet,capGeo,film);cap.frustumCulled=false;
 const cp=capGeo.attributes.position,capBase=new Float32Array(cp.array);
 const skinMat=film.clone();skinMat.opacity=.25;
 const skinGeo=new T.CylinderGeometry(1,1,1,64,24,true),skin=mesh(wet,skinGeo,skinMat);skin.frustumCulled=false;const sp=skinGeo.attributes.position,sbase=new Float32Array(sp.array);
 const surfaceMat=new T.MeshPhysicalMaterial({color:'#392716',roughness:.11,metalness:.12,clearcoat:1,clearcoatRoughness:.05,side:T.DoubleSide});
 const surfaceGeo=new T.RingGeometry(.45,.973,96,12);surfaceGeo.rotateX(-Math.PI/2);const surface=mesh(cupWet,surfaceGeo,surfaceMat),base=new Float32Array(surfaceGeo.attributes.position.array);
 const flecks=new T.InstancedMesh(new T.SphereGeometry(1,8,6),film,160);flecks.frustumCulled=false;cupWet.add(flecks);
 const residueMat=new T.MeshStandardMaterial({color:'#47351b',transparent:true,opacity:.16,roughness:.74,side:T.DoubleSide,depthWrite:false});residueMat.alphaMap=texture.clone();const residue=mesh(cup,new T.CylinderGeometry(.974,.974,.8,72,1,true),residueMat,[0,5.61,0]);
 // Downward films and droplets show drainage independently of upward foam motion.
 const drainage=new T.InstancedMesh(new T.SphereGeometry(1,7,5),new T.MeshPhysicalMaterial({color:'#c8dac5',transparent:true,opacity:.65,roughness:.1,metalness:.1,depthWrite:false}),96);drainage.frustumCulled=false;wet.add(drainage);
 const strands=[];for(let i=0;i<12;i++){const a=i/12*TAU,points=[];for(let j=0;j<10;j++)points.push(V(Math.cos(a)*.395,4.7+j*.105,Math.sin(a)*.395));const o=mesh(wet,new T.TubeGeometry(new T.CatmullRomCurve3(points),20,.0025,4,false),new T.MeshBasicMaterial({color:'#b3cbb9',transparent:true,opacity:.3,depthWrite:false}));strands.push(o);}
 // Original schematic wet-rotor section: fixed shaft, two bushes, magnet sleeve and volute.
 const axis=(r,h,z,m)=>{const o=mesh(mechanics,new T.CylinderGeometry(r,r,h,32),m,[-1.8,.8,z]);o.rotation.x=Math.PI/2;return o;};
 axis(.028,1.08,-.08,ceramic);axis(.09,.09,-.48,ceramic);axis(.085,.07,.43,ceramic);
 const magnet=axis(.17,.5,-.19,new T.MeshStandardMaterial({color:'#3d4445',metalness:.3,roughness:.45}));
 for(const z of [-.46,.05]){const o=mesh(mechanics,annulus(.195,.06,.055),ceramic,[-1.8,.8,z]);o.rotation.x=Math.PI/2;}
 const volutePoints=[];for(let i=0;i<60;i++){const t=i/59*TAU*.86,r=.325+.075*i/59;volutePoints.push(V(-1.8+Math.cos(t)*r,.8+Math.sin(t)*r,.28));}mesh(mechanics,new T.TubeGeometry(new T.CatmullRomCurve3(volutePoints),64,.029,8,false),plastic);
 const bearingLabel=mesh(mechanics,new T.TorusGeometry(.09,.015,8,32),metal,[-1.8,.8,.48]);
 const mix=new T.InstancedMesh(new T.SphereGeometry(.012,6,5),new T.MeshBasicMaterial({color:'#d9e8d9',transparent:true,opacity:.7}),180);mix.frustumCulled=false;mechanics.add(mix);
 let diagnostics={},last=-1;
 return {render(state,s){
  const active=state.mode!=='macro'&&state.explode<.02;wet.visible=active;cupWet.visible=active&&s.cup>.001;sectionEdges.visible=state.mode!=='assembled';mechanics.visible=state.mode==='cutaway'&&state.mechanics;magnet.rotation.z=-s.phase*13;mix.visible=s.airflow>3;surfaceMat.color.copy(cupMat.color).multiplyScalar(.65);residue.material.opacity=.08+s.neckFilm*.7;
  cap.visible=capCells.visible=s.production;skin.visible=s.foam>.04;drainage.visible=state.drainage&&s.foam>.08&&s.delivery>.02;strands.forEach(o=>{o.visible=drainage.visible&&s.level<5.4;o.material.opacity=.12+s.wetness*.25;});
  if(last!==s.time&&state.mode!=='macro'){last=s.time;
   for(let i=0;i<480;i++){const t=(i/480+s.phase*.055)%1,a=i*2.4,r=.22+t*.59,y=foamHeight(r,a,s);dummy.position.set(Math.cos(a)*r,y+.008,Math.sin(a)*r);const size=(.019+(i%7)*.003)*(1-T.MathUtils.smoothstep(t,.76,1));dummy.scale.set(size,size*.68,size);dummy.updateMatrix();capCells.setMatrixAt(i,dummy.matrix);}capCells.instanceMatrix.needsUpdate=true;
   for(let i=0;i<cp.count;i++){const a=(capBase[i*3]+.5)*TAU,r=(capBase[i*3+1]+.5)*.84;const radial=r*(1+.035*Math.sin(a*5+s.phase*.35));cp.setXYZ(i,Math.cos(a)*radial,foamHeight(r,a,s),Math.sin(a)*radial);}cp.needsUpdate=true;capGeo.computeVertexNormals();
   const top=Math.min(5.76,s.foamTop),bottom=Math.min(s.level,top);for(let i=0;i<sp.count;i++){const t=sbase[i*3+1]+.5,y=bottom+t*(top-bottom),r=(y<3.25?1.08:y<4.65?1.08-(y-3.25)/1.4*.67:.395);const a=Math.atan2(sbase[i*3+2],sbase[i*3]);const ripple=1+.017*Math.sin(a*8+y*14-s.phase*.7);sp.setXYZ(i,sbase[i*3]*r*ripple,y,sbase[i*3+2]*r*ripple);}sp.needsUpdate=true;skinGeo.computeVertexNormals();film.map.offset.y=-s.phase*.025;
   const pos=surfaceGeo.attributes.position;for(let i=0;i<pos.count;i++){const x=base[i*3],z=base[i*3+2],r=Math.hypot(x,z);pos.setXYZ(i,x,5.18+s.cup*.99+.004*Math.sin(r*27-s.time*1.8)+.003*Math.sin(x*17+z*12+s.time),z);}pos.needsUpdate=true;surfaceGeo.computeVertexNormals();
   for(let i=0;i<160;i++){const a=i*2.4+s.time*.015,r=.51+((i*37)%100)/100*.41;dummy.position.set(Math.cos(a)*r,5.19+s.cup*.99+.003*Math.sin(s.time+i),Math.sin(a)*r);const size=.014+(i%9)*.003;dummy.scale.set(size*1.6,size*.3,size);dummy.updateMatrix();flecks.setMatrixAt(i,dummy.matrix);}flecks.instanceMatrix.needsUpdate=true;flecks.count=Math.round(160*Math.min(1,s.cup*5));
   for(let i=0;i<96;i++){const t=(s.time*(.13+s.wetness*.18)+i/96)%1,a=i*2.4,r=.32+(i%7)*.01;const high=Math.min(5.73,s.foamTop),low=Math.max(4.35,s.level);dummy.position.set(Math.cos(a)*r,high-t*Math.max(.02,high-low),Math.sin(a)*r);dummy.scale.set(.005,.012+.025*s.wetness,.005);dummy.updateMatrix();drainage.setMatrixAt(i,dummy.matrix);}drainage.instanceMatrix.needsUpdate=true;
   for(let i=0;i<180;i++){const t=(i/180+s.phase*.4)%1,a=t*TAU*2+i*.9,r=.07+t*.24;dummy.position.set(-1.8+Math.cos(a)*r,.8+Math.sin(a)*r,.38);dummy.scale.setScalar(.45+(i%7)/7);dummy.updateMatrix();mix.setMatrixAt(i,dummy.matrix);}mix.instanceMatrix.needsUpdate=true;
  }
  diagnostics={connectedFoam:active&&cap.visible,foamSkin:active&&skin.visible,cupSurface:cupWet.visible,drainage:active&&drainage.visible,wetRotor:mechanics.visible,refinementTime:last};
 },snapshot:()=>({...diagnostics}),reset(){last=-1;}};
}
