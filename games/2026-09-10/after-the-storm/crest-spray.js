import * as T from './vendor/three.module.js';
import {wave,waterLevel} from './simulation.js';
import {crestEmission} from './immersion-model.js';
import {weatherUniforms,cloudGLSL} from './weather-light.js';
export function makeCrestSpray(scene){
 const n=1000,particles=Array.from({length:n},()=>({life:0})),xyz=new Float32Array(n*3),alpha=new Float32Array(n),size=new Float32Array(n);let cursor=0,emitted=0,previous=null,emission=0,phase=0;
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(xyz,3));geo.setAttribute('opacity',new T.BufferAttribute(alpha,1));geo.setAttribute('size',new T.BufferAttribute(size,1));
 const mat=new T.ShaderMaterial({uniforms:weatherUniforms,transparent:true,depthWrite:false,vertexShader:`attribute float opacity,size;varying float a;varying vec3 sprayP;void main(){a=opacity;sprayP=position;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(size*400./max(1.,-p.z),1.,32.);}`,fragmentShader:cloudGLSL+`varying float a;varying vec3 sprayP;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;vec3 color=mix(vec3(.38,.47,.49),vec3(.88,.94,.92),cloudVisibility(sprayP));gl_FragColor=vec4(color,a*exp(-r*r*3.)*(1.-r));}`});
 const mesh=new T.Points(geo,mat);mesh.userData.skipRefraction=true;mesh.frustumCulled=false;scene.add(mesh);
 return {mesh,stats:{alive:0,emitted:0},reset(){previous=null;emitted=0;emission=0;phase=0;for(const p of particles)p.life=0;},update(t,storm,camera,quality){const dt=previous===null?0:Math.max(0,Math.min(.2,t-previous));previous=t;emission+=dt;
  if(emission>.12){const elapsed=emission;emission=0;const count=quality==='low'?48:quality==='medium'?80:112;
   for(let i=0;i<count;i++){const a=(i+phase)*2.399963,r=8+Math.sqrt((i+.5)/count)*85,x=camera.x+Math.cos(a)*r,z=camera.z+Math.sin(a)*r,h=wave(x,z,t,storm),f=wave(x+1,z,t,storm),b=wave(x-1,z,t,storm),l=wave(x,z-1,t,storm),rr=wave(x,z+1,t,storm),energy=crestEmission(h-waterLevel.value,f-waterLevel.value,b-waterLevel.value,l-waterLevel.value,rr-waterLevel.value,elapsed);
    if(energy<.003)continue;for(let k=0;k<Math.min(24,6+Math.ceil(energy*220));k++){const p=particles[cursor++%n],life=.7+Math.random()*.65;emitted++;Object.assign(p,{x:x+(Math.random()-.5)*1.5,y:h+.06,z:z+(Math.random()-.5)*1.5,vx:1+storm*3+(b-f)*.6,vy:.5+energy*8+Math.random()*.7,vz:-.4-storm*1.2+(l-rr)*.6,life,max:life});}
   }phase+=.37;
  }
  particles.forEach((p,i)=>{if(p.life>0){p.life=Math.max(0,p.life-dt);p.vy-=dt*2.3;p.vx+=dt*(.5+storm);p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;xyz.set([p.x,p.y,p.z],i*3);}alpha[i]=p.life>0?Math.sin(Math.PI*p.life/p.max)*.55:0;size[i]=p.life>0?.11+(1-p.life/p.max)*.30:0;});for(const a of Object.values(geo.attributes))a.needsUpdate=true;this.stats={alive:particles.filter(p=>p.life>0).length,emitted};
 },dispose(){mesh.removeFromParent();geo.dispose();mat.dispose();}};
}
