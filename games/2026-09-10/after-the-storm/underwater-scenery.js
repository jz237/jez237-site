import {landMaps} from './land-materials.js';
import * as T from './vendor/three.module.js';
import {habitatSites,createSchool,stepSchool,seededRandom,sedimentStrength} from './underwater-life.js';
import {wave} from './simulation.js';

// All scenery participates in the ocean refraction/depth pass, so water itself
// controls visibility and occlusion. No overlay fish or above-water particles.
export function makeUnderwaterScenery(parent,course){
 const root=new T.Group();parent.add(root);
 const ground=course.renderGround||course.ground,sites=habitatSites(course),random=seededRandom(713+course.id.length),geometries=new Set(),materials=new Set(),dummy=new T.Object3D();
 const surges={value:Array.from({length:12},()=>new T.Vector2())};
 const time={value:0},flow={value:.3},cold=course.theme==='ice',lake=course.theme==='lake';
 const material=(color,roughness=.85,metalness=0)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness});materials.add(m);return m;};
 function mesh(g,m,x,y,z,sx=1,sy=1,sz=1){geometries.add(g);const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);root.add(o);return o;}
 const rock=material(0x9ba397,.95);rock.map=landMaps.rock.diff;rock.normalMap=landMaps.rock.nor_gl;rock.normalScale=new T.Vector2(.4,.4);rock.roughnessMap=landMaps.rock.rough;
 const shell=material(0xc9c2a1),timber=material(0x4d4938),rust=material(0x63574a,.8,.25);
 const rockGeo=new T.IcosahedronGeometry(1,1),shellGeo=new T.SphereGeometry(1,8,5),plankGeo=new T.BoxGeometry(1,1,1);
 // Low, partly buried reef clusters with shell beds and dark sheltered gaps.
 for(const [index,p] of sites.entries()){
  for(let j=0;j<9;j++){const x=p.x+(random()-.5)*9,z=p.z+(random()-.5)*9,y=ground(x,z),r=.35+random()*.8;if(y> -2.4)continue;const o=mesh(rockGeo,rock,x,y+.12,z,r,r*.55,r*.8);o.rotation.set(random()*.3,random()*6.28,random()*.3);}
  for(let j=0;j<12;j++){const x=p.x+(random()-.5)*11,z=p.z+(random()-.5)*11;const o=mesh(shellGeo,shell,x,ground(x,z)+.045,z,.09+random()*.08,.045,.12);o.rotation.y=random()*6.28;}
  if(index===1){ // A fallen anchor with stock, shank, curved crown and flukes.
   const x=p.x,z=p.z,y=p.y+.25;mesh(plankGeo,rust,x,y,z,.16,.17,2.6).rotation.y=.4;
   mesh(plankGeo,rust,x-.4,y,z-1,1.5,.13,.14).rotation.y=.4;
   const ring=mesh(new T.TorusGeometry(.25,.045,6,14),rust,x-.48,y,z-1.25);ring.rotation.x=Math.PI/2;
   const crown=mesh(new T.TorusGeometry(.8,.08,6,18,Math.PI),rust,x+.35,y,z+.8);crown.rotation.x=Math.PI/2;
   for(const side of [-1,1])mesh(new T.ConeGeometry(.24,.5,3),rust,x+.35+side*.74,y+.06,z+.65).rotation.z=side*.8;
  }
  if(index===4){ // Broken pier timbers, settled into the seabed.
   for(let j=0;j<7;j++){const x=p.x+j*.7-2,z=p.z+Math.sin(j)*.4;mesh(plankGeo,timber,x,ground(x,z)+.12,z,.5,.15,3+random()).rotation.y=.3;}
   for(const side of [-1,1])mesh(new T.CylinderGeometry(.18,.23,1.1,9),timber,p.x+side*2,p.y+.45,p.z);
  }
  if(index===7){ // Open ribs and broken planking of a small fishing skiff.
   for(let j=0;j<7;j++){const z=p.z-2.7+j*.9,w=Math.sin((j+1)/8*Math.PI)*1.5;
    for(const side of [-1,1]){const rib=mesh(plankGeo,timber,p.x+side*w*.5,p.y+.35,z,w,.13,.13);rib.rotation.z=side*.45;}
   }
   mesh(plankGeo,timber,p.x,p.y+.12,p.z,.16,.18,6.6);
   for(const side of [-1,1])mesh(plankGeo,timber,p.x+side*.9,p.y+.18,p.z,.25,.14,4.2).rotation.y=side*.13;
  }
 }
 // Tapered blades anchored at the floor; the tip bends independently in the surge.
 const bladeGeo=new T.PlaneGeometry(.16,1,1,5);bladeGeo.translate(0,.5,0);const bp=bladeGeo.attributes.position;for(let i=0;i<bp.count;i++)bp.setX(i,bp.getX(i)*(1-bp.getY(i)*.94));bladeGeo.computeVertexNormals();geometries.add(bladeGeo);bladeGeo.setAttribute('habitatIndex',new T.InstancedBufferAttribute(new Float32Array(Array.from({length:sites.length*240},(_,i)=>i%sites.length)),1));
 const grass=material(cold?0x465952:lake?0x486b36:0x3d7656);grass.side=T.DoubleSide;
 grass.onBeforeCompile=s=>{Object.assign(s.uniforms,{reefTime:time,reefFlow:flow,reefSurge:surges});s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float reefTime,reefFlow;uniform vec2 reefSurge[12];attribute float habitatIndex;').replace('#include <begin_vertex>',`#include <begin_vertex>
 vec3 base=(instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
 float bend=sin(reefTime*1.1+base.x*.24+base.z*.17)*(.16+reefFlow*.12);
 vec2 surge=reefSurge[int(habitatIndex)];
 transformed.x+=position.y*position.y*(bend+surge.x*.8);
 transformed.z+=position.y*position.y*(sin(reefTime*.8+base.z*.3)*.14+surge.y*.8);`);};
 const blades=new T.InstancedMesh(bladeGeo,grass,sites.length*240);blades.instanceMatrix.setUsage(T.StaticDrawUsage);root.add(blades);
 for(let i=0;i<blades.count;i++){const p=sites[i%sites.length],a=random()*6.28,r=Math.sqrt(random())*4.5,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r,y=ground(x,z);dummy.position.set(x,y,z);dummy.rotation.set(0,random()*6.28,0);const h=cold?.22:.35+random()*.65;dummy.scale.set(.8+random(),y< -1.8?h:0,1);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);blades.setColorAt(i,new T.Color().setHSL(.28+random()*.10,.3,.3+random()*.2));}blades.instanceMatrix.needsUpdate=true;
 // A connected spindle body plus separate dorsal, tail and pectoral fin surfaces.
 const positions=[],parts=[],indices=[];const vertex=(x,y,z,part=0)=>{positions.push(x,y,z);parts.push(part);return parts.length-1;};
 for(let j=0;j<=12;j++){const z=-.48+j/12*.98,shape=Math.sin(j/12*Math.PI)**.8;for(let k=0;k<10;k++){const a=k/10*6.283;vertex(Math.cos(a)*shape*.105,Math.sin(a)*shape*.17,z);}}
 for(let j=0;j<12;j++)for(let k=0;k<10;k++){const a=j*10+k,b=j*10+(k+1)%10,c=a+10,d=b+10;indices.push(a,b,c,b,d,c);}
 function fin(v,part){const a=v.map(p=>vertex(...p,part));indices.push(a[0],a[1],a[2]);}
 fin([[0,0,-.39],[0,.24,-.70],[0,-.24,-.70]],1);
 for(const side of [-1,1])fin([[side*.068,.035,.32],[side*.068,.065,.28],[side*.085,.015,.28]],5);
 fin([[0,.10,-.18],[0,.31,-.12],[0,.13,.22]],2);
 for(const side of [-1,1])fin([[side*.08,0,.15],[side*.32,-.08,-.04],[side*.09,-.04,-.16]],side<0?3:4);
 const fishGeo=new T.BufferGeometry();fishGeo.setAttribute('position',new T.Float32BufferAttribute(positions,3));fishGeo.setAttribute('finPart',new T.Float32BufferAttribute(parts,1));fishGeo.setIndex(indices);fishGeo.computeVertexNormals();geometries.add(fishGeo);
 const schools=sites.filter((_,i)=>i%2===0).map((p,i)=>createSchool(p,i*137+17,cold?10:18)),fish=schools.flat(),phases=new Float32Array(fish.map(f=>f.phase)),rates=new Float32Array(fish.length);
 fishGeo.setAttribute('fishPhase',new T.InstancedBufferAttribute(phases,1));fishGeo.setAttribute('fishRate',new T.InstancedBufferAttribute(rates,1));
 const silver=material(0xb0c7bf,.3,.55);silver.side=T.DoubleSide;
 silver.onBeforeCompile=s=>{Object.assign(s.uniforms,{reefTime:time});s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float reefTime;attribute float fishPhase,fishRate,finPart;varying float fishBack;varying float eyeMask;').replace('#include <begin_vertex>',`#include <begin_vertex>
 float tail=clamp((.22-position.z)/.92,0.,1.);
 float pulse=fishPhase;
 transformed.x+=sin(pulse+position.z*8.)*tail*tail*.15;
 if(finPart>1.5&&finPart<4.5){transformed.y+=sin(pulse*1.37+finPart*2.)*.045;transformed.x+=sin(pulse*.83+finPart)*.025;}
 fishBack=position.y;eyeMask=step(4.5,finPart);`);
 s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float fishBack;varying float eyeMask;').replace('#include <color_fragment>',`#include <color_fragment>
 diffuseColor.rgb*=mix(vec3(.85,.98,1.),vec3(.20,.36,.34),smoothstep(-.01,.14,fishBack));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.008),eyeMask);`);};
 const fishMesh=new T.InstancedMesh(fishGeo,silver,fish.length);fishMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);root.add(fishMesh);fishMesh.frustumCulled=false;
 // Soft sediment puffs originate at the bed and remain below the surface.
 const count=160,clouds=Array.from({length:count},()=>({life:0})),cloudPositions=new Float32Array(count*3),cloudAlpha=new Float32Array(count),cloudSize=new Float32Array(count);
 const cloudGeo=new T.BufferGeometry();cloudGeo.setAttribute('position',new T.BufferAttribute(cloudPositions,3));cloudGeo.setAttribute('opacity',new T.BufferAttribute(cloudAlpha,1));cloudGeo.setAttribute('size',new T.BufferAttribute(cloudSize,1));geometries.add(cloudGeo);
 const cloudMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{},vertexShader:`attribute float opacity,size;varying float alpha;void main(){alpha=opacity;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(size*600./max(1.,-p.z),1.,90.);}`,fragmentShader:`varying float alpha;void main(){float d=length(gl_PointCoord-.5)*2.;float a=exp(-d*d*4.)*(1.-smoothstep(.7,1.,d))*alpha;gl_FragColor=vec4(.36,.32,.22,a);#include <tonemapping_fragment>\n#include <colorspace_fragment>}`.replace(';#include',';\n#include')});materials.add(cloudMat);
 const cloudMesh=new T.Points(cloudGeo,cloudMat);cloudMesh.frustumCulled=false;root.add(cloudMesh);
 let previous=null,accumulator=0,cursor=0,emission=0;
 return {root,sites,update(t,storm,quality,craft=[]){const dt=previous===null?0:Math.max(0,Math.min(1,t-previous));previous=t;time.value=t;flow.value=storm;accumulator+=dt;
  const surface=(x,z)=>wave(x,z,t,storm);sites.forEach((p,i)=>surges.value[i].set((surface(p.x+1,p.z)-surface(p.x-1,p.z))*.5,(surface(p.x,p.z+1)-surface(p.x,p.z-1))*.5));let steps=0;while(accumulator>=1/30&&steps++<30){for(const school of schools)stepSchool(school,1/30,t,craft,ground,surface);accumulator-=1/30;}
  let i=0;for(const f of fish){dummy.position.set(f.x,f.y,f.z);dummy.rotation.set(f.pitch,f.heading,0,'YXZ');dummy.scale.setScalar(f.size);dummy.updateMatrix();fishMesh.setMatrixAt(i,dummy.matrix);rates[i]=3+f.speed*5;phases[i]+=dt*rates[i];i++;}fishMesh.instanceMatrix.needsUpdate=true;fishGeo.attributes.fishRate.needsUpdate=true;fishGeo.attributes.fishPhase.needsUpdate=true;
  blades.count=Math.floor(sites.length*(quality==='low'?80:quality==='medium'?160:240));
  emission+=dt;if(emission>.09){emission=0;for(const r of craft){const bottom=ground(r.x,r.z),strength=sedimentStrength(r,bottom,surface(r.x,r.z));if(strength<=.01)continue;for(let j=0;j<(quality==='low'?2:4);j++){const c=clouds[cursor++%count];Object.assign(c,{x:r.x+(random()-.5)*1.4,y:bottom+.2,z:r.z+(random()-.5)*1.4,life:1,age:0,power:strength});}}}
  clouds.forEach((c,j)=>{if(c.life>0){c.age+=dt;c.life=Math.max(0,1-c.age/5);c.x+=dt*.16;c.z-=dt*.11;c.y=Math.min(surface(c.x,c.z)-.18,Math.max(ground(c.x,c.z)+.1,c.y+dt*(c.age<1.5?.16:-.07)));cloudPositions.set([c.x,c.y,c.z],j*3);}cloudAlpha[j]=c.life*(c.power||0)*.32;cloudSize[j]=.5+(c.age||0)*.48;});
  for(const a of Object.values(cloudGeo.attributes))a.needsUpdate=true;
 },dispose(){blades.dispose();fishMesh.dispose();root.removeFromParent();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();}};
}
