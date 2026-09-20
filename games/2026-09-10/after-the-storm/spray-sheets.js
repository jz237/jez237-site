import * as T from './vendor/three.module.js';
import {sprayLaunch} from './hull-spray.js';
import {carveLoad} from './contact-cues.js';
import {sprayUniforms,sprayLightingGLSL} from './spray-light.js';
// Emissions retain world momentum while the hull turns away from the sheet.
export function sheetPoint(q,age,u){const fan=(u-.5)*(.10+age*q.fan),lift=Math.sin(u*Math.PI)*age*q.fan*.30;return [q.x+q.vx*age+q.rx*fan,q.y+q.vy*age-4.905*age*age+lift,q.z+q.vz*age+q.rz*fan];}
export function makeSpraySheets(scene){
 const rows=22,columns=6,vertices=rows*columns*2,positions=new Float32Array(vertices*3),uvs=new Float32Array(vertices*2),loads=new Float32Array(vertices),indices=[];
 for(let side=0;side<2;side++)for(let j=0;j<rows;j++)for(let k=0;k<columns;k++){const i=side*rows*columns+j*columns+k;uvs.set([k/(columns-1),j/(rows-1)],i*2);if(j<rows-1&&k<columns-1)indices.push(i,i+1,i+columns,i+1,i+columns+1,i+columns);}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('uv',new T.BufferAttribute(uvs,2));geometry.setAttribute('load',new T.BufferAttribute(loads,1));geometry.setIndex(indices);
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{...sprayUniforms,sheetTime:{value:0}},vertexShader:`attribute float load;varying vec2 vUv;varying vec3 sheetP;varying float wet;void main(){vUv=uv;sheetP=position;wet=load;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:sprayLightingGLSL+`
 uniform float sheetTime;varying vec2 vUv;varying vec3 sheetP;varying float wet;
 void main(){float edge=pow(max(0.,sin(vUv.x*3.14159)),.45),age=vUv.y;
 float tears=cloudNoise(vec2(vUv.x*17.+sheetTime*1.7,age*27.-sheetTime*6.));
 float intact=1.-smoothstep(.25,.80,age),holes=mix(1.,smoothstep(.35,.66,tears),smoothstep(.22,.88,age));
 float foam=smoothstep(.5,.9,age)*.45+pow(abs(vUv.x-.5)*2.,6.)*.32;
 vec3 color=mix(vec3(.19,.40,.43),litSpray(sheetP),.72+foam*.28);
 float alpha=wet*edge*pow(1.-age,1.15)*holes*(.58+foam+intact*.20);
 if(alpha<.006)discard;gl_FragColor=vec4(color,alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;mesh.userData.skipRefraction=true;mesh.renderOrder=3;scene.add(mesh);const histories=[[],[]];let previous=-Infinity;
 return {mesh,update(r,time){
  if(time<previous||time-previous>1){histories.forEach(h=>h.length=0);previous=-Infinity;}
  if(time-previous>=.025){for(let side=0;side<2;side++){const sign=side?1:-1,q=sprayLaunch(r,'chine',sign,()=>.5),contact=sign>0?r.hydro.starboardWet:r.hydro.portWet;
   const carve=carveLoad(r,sign);
   histories[side].unshift({...q,time,rx:Math.cos(r.heading)*sign,rz:-Math.sin(r.heading)*sign,fan:1.3+Math.min(1,r.speed/28)*2+carve*4.5,load:r.hydro.airborne?0:Math.min(1,Math.min(1,r.speed/18)*Math.max(0,contact??r.hydro.wet??0)*.72+carve*.55)});histories[side].length=Math.min(rows,histories[side].length);
  }previous=time;}
  material.uniforms.sheetTime.value=time;mesh.visible=histories.some(h=>h.some(q=>q.load>.1&&time-q.time<.6));
  for(let side=0;side<2;side++)for(let j=0;j<rows;j++){const q=histories[side][Math.min(j,histories[side].length-1)];if(!q)continue;const age=Math.min(.65,Math.max(0,time-q.time));for(let k=0;k<columns;k++){const i=side*rows*columns+j*columns+k;positions.set(sheetPoint(q,age,k/(columns-1)),i*3);loads[i]=q.load*Math.max(0,1-age/.65);}}
  geometry.attributes.position.needsUpdate=true;geometry.attributes.load.needsUpdate=true;
 },dispose(){scene.remove(mesh);geometry.dispose();material.dispose();}};
}
