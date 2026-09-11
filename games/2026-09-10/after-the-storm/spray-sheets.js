import * as T from './vendor/three.module.js';
import {sprayLaunch} from './hull-spray.js';
// Short ballistic sheets peel from each immersed chine; droplets and fine mist
// continue beyond the sheet. All inherit actual hull velocity and side loading.
export function makeSpraySheets(scene){const segments=10,positions=new Float32Array((segments+1)*2*3*2),uvs=new Float32Array((segments+1)*2*2*2),indices=[];
 for(let side=0;side<2;side++)for(let j=0;j<=segments;j++)for(let k=0;k<2;k++){const i=(side*(segments+1)*2+j*2+k);uvs.set([k,j/segments],i*2);if(j<segments&&k===0)indices.push(i,i+1,i+2,i+1,i+3,i+2);}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('uv',new T.BufferAttribute(uvs,2));geometry.setIndex(indices);
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{opacity:{value:0},time:{value:0},storm:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform float opacity,time,storm;varying vec2 vUv;void main(){float edge=sin(vUv.x*3.14159),fade=pow(1.-vUv.y,1.5);float streak=.7+.3*sin(vUv.y*53.-time*31.+vUv.x*17.);gl_FragColor=vec4(mix(vec3(.76,.87,.85),vec3(.45,.60,.62),storm),opacity*edge*fade*streak);}`});
 const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;mesh.userData.skipRefraction=true;mesh.renderOrder=3;scene.add(mesh);
 return {mesh,update(r,time,storm){material.uniforms.time.value=time;material.uniforms.storm.value=storm;const power=Math.min(1,r.speed/20);material.uniforms.opacity.value=power*.52;mesh.visible=r.hydro.wet>.05&&r.speed>3;
  for(let side=0;side<2;side++){const sign=side?1:-1,q=sprayLaunch(r,'chine',sign,()=>.5),contact=sign>0?r.hydro.starboardWet:r.hydro.portWet,rx=Math.cos(r.heading),rz=-Math.sin(r.heading);
   for(let j=0;j<=segments;j++){const age=j/segments*.32,width=(.035+age*.9)*contact;for(let k=0;k<2;k++){const spread=(k-.5)*width,index=(side*(segments+1)*2+j*2+k)*3;positions.set([q.x+(q.vx-r.vx)*age+rx*spread,q.y+q.vy*age-4.905*age*age,q.z+(q.vz-r.vz)*age+rz*spread],index);}}
  }geometry.attributes.position.needsUpdate=true;
 },dispose(){scene.remove(mesh);geometry.dispose();material.dispose();}};
}
