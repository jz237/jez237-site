import * as T from '../aquaclear-studio/vendor/three.module.js';
import {seeded} from './finishes.js?v=2';
const clamp=T.MathUtils.clamp,TAU=Math.PI*2;
// Visual units, not a hydraulic rating. The sheet stays above the actual plastic
// lip, then follows a ballistic arc to the current aquarium surface.
export function returnProfile(flow,level){
 const delivery=clamp(flow,0,1),edgeY=2.966,edgeZ=1.795,g=5.2,vy=.23,vz=.52+.52*Math.sqrt(delivery);
 const drop=Math.max(.012,edgeY-level),fallTime=(Math.sqrt(vy*vy+2*g*drop)-vy)/g;
 return {edgeY,edgeZ,fallTime,impactZ:edgeZ+vz*fallTime,drop,vz,vy,g,delivery};
}
export function sheetPoint(u,v,time,profile){
 const p=profile,lip=.52,width=2.2*Math.min(1,Math.sqrt(p.delivery/.35)),ripple=Math.sin(u*37-time*3.7+v*5)*.007+Math.sin(u*73+v*13-time*5.2)*.003;
 let y,z,fall=0;if(v<lip){const a=v/lip;z=.18+(p.edgeZ-.18)*a;y=a<.73?3.17-.1*(a/.73):3.07-(3.07-p.edgeY)*((a-.73)/.27);}
 else{fall=(v-lip)/(1-lip);const t=fall*p.fallTime;z=p.edgeZ+p.vz*t;y=p.edgeY-p.vy*t-.5*p.g*t*t;}
 const edgeWobble=.012*Math.sin(v*24-time*4.3)+.006*Math.sin(v*53+time*2.7);
 return [.35+(u-.5)*(width*(1-.065*fall)+edgeWobble),y+ripple*(.35+.65*fall)*Math.sin(v*Math.PI),z+ripple*fall*1.3*Math.sin(v*Math.PI)];
}
export function buildWater(parent){
 const group=new T.Group();parent.add(group);const dummy=new T.Object3D(),r=seeded(2447),placeholder=new T.MeshBasicMaterial({color:'#7eabae',transparent:true,opacity:.3,depthWrite:false});
 const mesh=(g,m,p=[0,0,0])=>{const o=new T.Mesh(g,m);o.position.set(...p);o.frustumCulled=false;group.add(o);return o;};
 const surface=mesh(new T.PlaneGeometry(5.98,2.48,96,48),placeholder,[0,2.6,1.98]);surface.rotation.x=-Math.PI/2;
 const chamber=mesh(new T.PlaneGeometry(3.46,1.6,42,24),placeholder,[0,3.34,-.3]);chamber.rotation.x=-Math.PI/2;
 const sheetGeo=new T.PlaneGeometry(1,1,64,112),sheet=mesh(sheetGeo,placeholder);const surfaceBase=surface.geometry.attributes.position.array.slice(),chamberBase=chamber.geometry.attributes.position.array.slice();
 const impactUniforms={time:{value:0},power:{value:0}};
 const frothMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:impactUniforms,
  vertexShader:`varying vec2 vUv;varying float seed;void main(){vUv=uv;seed=instanceMatrix[3].x*13.+instanceMatrix[3].z*7.;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform float power;varying vec2 vUv;varying float seed;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed)*43758.5453);}void main(){vec2 p=(vUv-.5)*2.;float d=length(p),rim=1.-smoothstep(.72,1.,d);vec2 cell=fract(vUv*4.)-.5;float bubble=1.-smoothstep(.25,.45,length(cell));float grain=h(floor(vUv*4.));float alpha=rim*(.18+bubble*.46)*(.45+grain*.55)*power;gl_FragColor=vec4(vec3(.80,.91,.89),alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }`});
 const foam=new T.InstancedMesh(new T.PlaneGeometry(1,1),frothMat,190);foam.frustumCulled=false;group.add(foam);
 const bubbleMat=new T.MeshPhysicalMaterial({color:'#c2e1dc',metalness:0,roughness:.10,clearcoat:1,transparent:true,opacity:.28,depthWrite:false});
 const bubbles=new T.InstancedMesh(new T.SphereGeometry(1,8,6),bubbleMat,160);bubbles.frustumCulled=false;group.add(bubbles);
 const sprayMat=new T.MeshPhysicalMaterial({color:'#d9eee9',metalness:0,roughness:.035,clearcoat:1,transparent:true,opacity:.55,depthWrite:false});
 const spray=new T.InstancedMesh(new T.SphereGeometry(1,8,6),sprayMat,85);spray.frustumCulled=false;group.add(spray);
 const seeds=Array.from({length:190},()=>({x:r(),z:r(),phase:r(),size:r(),speed:.7+r()*.6}));
 // A subtle tint on the submerged sides provides depth without an opaque blue box.
 const volumeMat=new T.MeshBasicMaterial({color:'#1d6876',transparent:true,opacity:.055,depthWrite:false,side:T.DoubleSide});
 const volume=mesh(new T.BoxGeometry(5.98,1,2.48),volumeMat,[0,1.3,1.98]);volume.renderOrder=-2;
 const causticMat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{time:impactUniforms.time,power:impactUniforms.power},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform float time,power;varying vec2 vUv;vec2 hash(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}void main(){vec2 p=vUv*vec2(12.,6.);p+=vec2(sin(p.y*1.4+time*.37),cos(p.x*1.2-time*.31))*.6;vec2 i=floor(p),f=fract(p);float a=8.,b=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y)),j=hash(i+g);vec2 q=g+.5+.33*sin(time*.45+6.283*j)-f;float d=dot(q,q);if(d<a){b=a;a=d;}else b=min(b,d);}float lines=pow(1.-smoothstep(.015,.22,b-a),2.);float edge=smoothstep(0.,.08,min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y)));gl_FragColor=vec4(.28,.43,.40,lines*.10*edge*(.5+.5*power));}`});
 const caustics=new T.Mesh(new T.PlaneGeometry(5.95,2.45),causticMat);caustics.rotation.x=-Math.PI/2;caustics.position.set(0,.184,1.98);parent.parent.add(caustics);
 let profile=returnProfile(.6,2.592),currentTime=0,currentFlow=0,sheetVisible=false;
 function update(s,visible){group.visible=visible;caustics.visible=visible;currentTime=s.time;currentFlow=s.flow;profile=returnProfile(s.flow,s.aquariumLevel);impactUniforms.time.value=s.time;impactUniforms.power.value=s.flow;surface.position.y=s.aquariumLevel;chamber.position.y=s.level;
  volume.position.y=(.19+s.aquariumLevel)/2;volume.scale.y=Math.max(.01,s.aquariumLevel-.19);
  const waveScale=.18+.82*s.flow,footprint=Math.min(1,Math.sqrt(s.flow/.35));
  for(const [o,base,isTank]of [[surface,surfaceBase,true],[chamber,chamberBase,false]]){const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=base[i*3],y=base[i*3+1],z=-y+(isTank?1.98:-.3),dx=Math.max(Math.abs(x-.35)-.92*footprint,0),distance=Math.hypot(dx,(z-profile.impactZ)*1.15),impact=Math.exp(-distance*2.5)*s.flow;
    const waves=Math.sin(x*4.3+z*2.7-s.time*1.6)*.004+Math.sin(x*-3.1+z*6.2+s.time*1.8)*.003;
    const wake=isTank?Math.sin(distance*28-s.time*7)*impact*.012+Math.sin(x*19+s.time*3.1)*Math.sin(z*23-s.time*4.7)*impact*.003:0;
    a.setZ(i,waves*waveScale+wake);}a.needsUpdate=true;o.geometry.computeVertexNormals();}
  const a=sheetGeo.attributes.position,uv=sheetGeo.attributes.uv;sheetVisible=s.flow>.004;sheet.visible=sheetVisible;for(let i=0;i<a.count;i++){const p=sheetPoint(uv.getX(i),1-uv.getY(i),s.time,profile);a.setXYZ(i,...p);}a.needsUpdate=true;sheetGeo.computeVertexNormals();
  for(let i=0;i<190;i++){const v=seeds[i],t=(s.travel*.31*v.speed+v.phase)%1,spread=.12+t*.55,drift=Math.sin(t*4+v.phase*TAU)*.08;dummy.position.set(.35+(v.x-.5)*2.07*footprint+drift,s.aquariumLevel+.014+Math.sin(v.x*17-s.time*6)*.004*s.flow,profile.impactZ+v.z*spread+t*.25-.08);dummy.rotation.set(-Math.PI/2,0,v.phase*TAU+t);const size=(.022+v.size*.085)*Math.sqrt(s.flow)*(1-t*.72);dummy.scale.set(size*(1+t),size*.7,1);dummy.updateMatrix();foam.setMatrixAt(i,dummy.matrix);}foam.instanceMatrix.needsUpdate=true;foam.visible=s.flow>.01;
  for(let i=0;i<160;i++){const v=seeds[i],t=(s.travel*.43*v.speed+v.phase)%1,depth=Math.sin(t*Math.PI)*(.10+profile.drop*.18);dummy.position.set(.35+(v.x-.5)*2.07*footprint+Math.sin(t*8+v.z*TAU)*t*.11,s.aquariumLevel-.025-depth,profile.impactZ+v.z*.1+t*.58);dummy.rotation.set(0,0,0);const size=(.004+v.size*.014)*(1-t*.4);dummy.scale.set(size,size*1.15,size);dummy.updateMatrix();bubbles.setMatrixAt(i,dummy.matrix);}bubbles.instanceMatrix.needsUpdate=true;bubbles.visible=s.flow>.01;
  for(let i=0;i<85;i++){const v=seeds[i],t=(s.travel*1.3*v.speed+v.phase)%1,life=.22+v.size*.15,vy=.22+v.size*.8*Math.sqrt(profile.drop),age=t*life;dummy.position.set(.35+(v.x-.5)*2.12*footprint+(v.z-.5)*t*.22,s.aquariumLevel+.012+Math.max(0,vy*age-2.7*age*age),profile.impactZ+(v.z-.5)*.12+t*.18);dummy.rotation.set(.2,0,(v.x-.5)*.6);const size=(.003+v.size*.007)*Math.sqrt(s.flow);dummy.scale.set(size,size*(1.2+t),size);dummy.updateMatrix();spray.setMatrixAt(i,dummy.matrix);}spray.instanceMatrix.needsUpdate=true;spray.visible=s.flow>.08;
 }
 return{group,surface,chamber,sheet,caustics,update,snapshot:()=>({time:currentTime,delivery:currentFlow,impactZ:profile.impactZ,drop:profile.drop,fallTime:profile.fallTime,sheetVisible,waterfall:'lip-following-ballistic-sheet',foamParticles:190,bubbles:160,spray:85})};
}
