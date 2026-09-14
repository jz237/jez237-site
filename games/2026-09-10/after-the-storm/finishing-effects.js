import * as T from './vendor/three.module.js';
import {wave} from './simulation.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function landingEnvelope(impact,speed){
 const energy=clamp((impact-1.5)/10,0,1);

 return {energy,height:.3+energy*1.8,radius:1.3+energy*2.7,life:.55+energy*.4,spray:energy*clamp(speed/16,0,1)};
}
// Expanding, falling water sheets retain the craft's forward momentum. This is
// a visual splash; the shared height field still determines the landing force.
export function makeFinishingEffects(scene){
 const rings=[],N=40;
 for(let j=0;j<8;j++){
  const positions=new Float32Array((N+1)*2*3),indices=[];for(let i=0;i<N;i++){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setIndex(indices);const uv=[];for(let i=0;i<=N;i++)for(let j=0;j<2;j++)uv.push(i/N,j);geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  const material=new T.ShaderMaterial({side:T.DoubleSide,transparent:true,depthWrite:false,uniforms:{opacity:{value:0}},vertexShader:`varying vec2 sheetUV;void main(){sheetUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform float opacity;varying vec2 sheetUV;void main(){float strands=.55+.45*sin(sheetUV.x*239.+sin(sheetUV.y*13.)*1.8);float edge=pow(max(0.,sin(sheetUV.y*3.14159)),.7);float pores=smoothstep(.12,.7,fract(sin(dot(floor(sheetUV*vec2(150.,30.)),vec2(127.1,311.7)))*43758.54));gl_FragColor=vec4(.77,.88,.87,opacity*edge*mix(.3,1.,strands)*mix(.5,1.,pores));}`});
  const mesh=new T.Mesh(geometry,material);mesh.userData.skipRefraction=true;mesh.frustumCulled=false;mesh.visible=false;scene.add(mesh);rings.push({mesh,positions,age:10,life:1});
 }
 const n=280,xyz=new Float32Array(n*3),alphas=new Float32Array(n),sizes=new Float32Array(n),drops=Array.from({length:n},()=>({life:0}));let cursor=0,ringCursor=0,sites=[],previousTime=null;
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(xyz,3));geometry.setAttribute('alpha',new T.BufferAttribute(alphas,1));geometry.setAttribute('size',new T.BufferAttribute(sizes,1));
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:`attribute float alpha,size;varying float a;void main(){a=alpha;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(size*370./max(1.,-p.z),1.,24.);}`,fragmentShader:`varying float a;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(.78,.87,.86,a*(1.-smoothstep(.1,1.,r)));}`});
 const cloud=new T.Points(geometry,material);cloud.frustumCulled=false;cloud.userData.skipRefraction=true;scene.add(cloud);
 const lens=document.createElement('div');lens.setAttribute('aria-hidden','true');Object.assign(lens.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:4,overflow:'hidden'});document.body.append(lens);let lensDrops=[];
 function wetLens(amount,side=0){if(lensDrops.length>14)return;  for(let i=0;i<Math.ceil(amount*8);i++){const d=document.createElement('i'),x=(side?side<0?Math.random()*48:52+Math.random()*48:Math.random()*100),y=25+Math.random()*66,size=7+Math.random()*22;
   Object.assign(d.style,{position:'absolute',left:x+'%',top:y+'%',width:size+'px',height:size*1.25+'px',borderRadius:'48% 50% 55% 45%',background:'radial-gradient(ellipse at 33% 24%,#e0ffff66 0%,#b5dbdf16 30%,#16364433 62%,#ddffff55 79%,transparent 84%)',boxShadow:'inset 0 1px 2px #e3ffff55',opacity:'0'});lens.append(d);lensDrops.push({d,y,age:0,life:.65+Math.random()*.85});
  }
 }
 return {
 reset(course){sites=(course.rocks||[]).filter(p=>!p.type||p.type==='rock').slice(0,32).map(p=>({...p,last:null,cooldown:0}));for(const r of rings)r.mesh.visible=false;for(const p of drops)p.life=0;previousTime=null;lens.replaceChildren();lensDrops=[];},
 sprayHit(amount,side=0){if(amount>.08)wetLens(Math.min(1,amount),side);},
 landing(r,camera,side=0){const e=landingEnvelope(r.hydro.impact,r.speed);if(e.energy<.02)return;
  const ring=rings[ringCursor++%rings.length];Object.assign(ring,e,{age:0,x:r.x,z:r.z,vx:r.vx*.22,vz:r.vz*.22,heading:r.heading});ring.mesh.visible=true;
  if(Math.hypot(camera.x-r.x,camera.z-r.z)>17||e.spray<.25||lensDrops.length>12)return;
  wetLens(e.spray,side);
 },
 update(time,storm,camera,quality){const dt=previousTime===null?0:clamp(time-previousTime,0,.15);previousTime=time;
  for(const ring of rings){if(!ring.mesh.visible)continue;ring.age+=dt;const u=ring.age/ring.life;if(u>=1){ring.mesh.visible=false;continue;}ring.x+=ring.vx*dt;ring.z+=ring.vz*dt;
   ring.mesh.position.set(ring.x,wave(ring.x,ring.z,time,storm)+.04,ring.z);ring.mesh.rotation.y=ring.heading;
   for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,r=(.25+u)*ring.radius,crest=Math.sin(Math.PI*u)*ring.height*(.68+.1*Math.sin(a*11+1.3)+.05*Math.sin(a*23));for(let j=0;j<2;j++){const k=(i*2+j)*3;ring.positions[k]=Math.cos(a)*(r+j*.25);ring.positions[k+1]=j?Math.max(0,crest*.4-.08):crest;ring.positions[k+2]=Math.sin(a)*(r+j*.25)*.75;}}
   ring.mesh.geometry.attributes.position.needsUpdate=true;ring.mesh.material.uniforms.opacity.value=Math.sin(Math.PI*u)*.38;
  }
  // Only an advancing crest at the waterline emits rock spray, not a timer.
  for(const p of sites){if(Math.hypot(camera.x-p.x,camera.z-p.z)>(quality==='low'?65:130))continue;
   const x=p.x-(p.r||2)*.75,z=p.z,surface=wave(x,z,time,storm),rising=dt>0&&p.last!==null?(surface-p.last)/dt:0;p.last=surface;p.cooldown=Math.max(0,p.cooldown-dt);
   if(surface>.2&&rising>.65&&p.cooldown===0&&dt>0){p.cooldown=.8;for(let i=0;i<(quality==='low'?7:16);i++){const drop=drops[cursor++%n],a=Math.random()*6.28,power=clamp(rising,.5,4);Object.assign(drop,{x:x+(Math.random()-.5)*1.3,y:surface,z:z+(Math.random()-.5)*1.3,vx:Math.cos(a)*power,vy:1.5+Math.random()*power,vz:Math.sin(a)*power,life:.5+Math.random()*.5,max:1});}}
  }
  drops.forEach((d,i)=>{if(d.life>0){d.life=Math.max(0,d.life-dt);d.vy-=9.81*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.z+=d.vz*dt;xyz.set([d.x,d.y,d.z],i*3);}alphas[i]=d.life*.6;sizes[i]=.06+d.life*.06;});for(const a of Object.values(geometry.attributes))a.needsUpdate=true;
  lensDrops=lensDrops.filter(p=>{p.age+=dt;if(p.age>=p.life){p.d.remove();return false;}p.d.style.opacity=String(Math.min(1,p.age*20)*(1-p.age/p.life)*.8);p.d.style.transform=`translateY(${p.age*p.age*55}px)`;return true;});
 },
 dispose(){lens.remove();cloud.removeFromParent();geometry.dispose();material.dispose();for(const r of rings){r.mesh.removeFromParent();r.mesh.geometry.dispose();r.mesh.material.dispose();}}
 };
}
