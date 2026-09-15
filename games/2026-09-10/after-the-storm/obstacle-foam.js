import * as T from './vendor/three.module.js';
import {wave} from './simulation.js';
import {barrierPiles} from './course-barriers.js';
// Bounded ribbons follow the shared surface around fixed rocks and pilings.
export function makeObstacleFoam(root,course){
 const obstacles=[...(course.rocks||[]).filter(o=>!o.type||o.type==='rock').map(o=>({...o})),...(course.crossbars||[]).flatMap(barrierPiles).filter(o=>o.bottom<.2).map(o=>({...o,r:o.radius}))];
 const limit=24,triangles=[0,2,1,2,3,1],positions=new Float32Array(limit*24*6*3),strength=new Float32Array(limit*24*6),geometry=new T.BufferGeometry();
 geometry.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));geometry.setAttribute('strength',new T.BufferAttribute(strength,1).setUsage(T.DynamicDrawUsage));
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},tint:{value:new T.Color(0xc5d9cf)}},vertexShader:'attribute float strength;varying float alpha;varying vec2 worldXZ;void main(){alpha=strength;worldXZ=position.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform float time;uniform vec3 tint;varying float alpha;varying vec2 worldXZ;void main(){float breakup=.5+.5*sin(worldXZ.x*8.+sin(worldXZ.y*5.-time)*2.);float a=alpha*smoothstep(.16,.72,breakup);if(a<.015)discard;gl_FragColor=vec4(tint,a);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
 const mesh=new T.Mesh(geometry,material);mesh.userData.dynamic=true;mesh.userData.skipRefraction=true;mesh.frustumCulled=false;root.add(mesh);let last=-Infinity;
 return {update(time,storm,camera,quality){if(time<last)last=-Infinity;if(time-last<1/15)return;last=time;material.uniforms.time.value=time;material.uniforms.tint.value.setScalar(.85-storm*.22);let k=0,count=0;const segments=quality==='low'?12:quality==='medium'?16:24;
 for(const o of obstacles){if(!camera||Math.hypot(o.x-camera.x,o.z-camera.z)>65||count>=(quality==='low'?12:limit))continue;count++;
 const center=wave(o.x,o.z,time,storm),ahead=wave(o.x-1.5,o.z-2,time,storm),surge=Math.min(1,Math.abs(center-ahead)*1.7+.08);
 // Sample each ring vertex once, then share it between adjacent triangles.
 const ring=o.foamRing??=(new Float32Array(25*2*4));
 for(let j=0;j<=segments;j++)for(let edge=0;edge<2;edge++){
  const a=j/segments*Math.PI*2,swirl=Math.sin(a*3-time*.7+o.x)*.12,radius=o.r+.12+edge*(.25+surge*.9+swirl),x=o.x+Math.cos(a)*radius,z=o.z+Math.sin(a)*radius,y=wave(x,z,time,storm),v=(j*2+edge)*4;
  ring[v]=x;ring[v+1]=y+.045;ring[v+2]=z;ring[v+3]=((course.renderGround||course.ground)(x,z)<y-.03?1:0)*(edge?.015:.42)*surge*(.4+.6*(.5+.5*Math.sin(a*2-time*.65+o.z)));
 }
 for(let j=0;j<segments;j++)for(const corner of triangles){const v=(j*2+corner)*4;positions[k*3]=ring[v];positions[k*3+1]=ring[v+1];positions[k*3+2]=ring[v+2];strength[k++]=ring[v+3];}

 }
 geometry.setDrawRange(0,k);geometry.attributes.position.needsUpdate=true;geometry.attributes.strength.needsUpdate=true;
 },dispose(){mesh.removeFromParent();geometry.dispose();material.dispose();}};
}
