import * as T from '../aquaclear-studio/vendor/three.module.js';
// Bounded visual detail; no claim of a fluid/oxygen-transfer solution.
export function createWaterDetail(parent){
 const group=new T.Group();parent.add(group);
 const causticMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{clock:{value:0},strength:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform float clock,strength;vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}void main(){vec2 p=vUv*vec2(15.,5.);p+=vec2(sin(p.y*1.4+clock*.7),cos(p.x*.9-clock*.5))*.58;vec2 cell=floor(p),f=fract(p);float first=8.,second=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 seed=hash2(cell+g);vec2 point=.5+.38*sin(seed*6.283+clock*.42);float d=length(g+point-f);if(d<first){second=first;first=d;}else second=min(second,d);}float light=exp(-(second-first)*28.)*.68+exp(-(second-first)*7.)*.18;float edge=smoothstep(0.,.07,min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y)));gl_FragColor=vec4(vec3(.34,.68,.66),light*edge*strength);}`});
 const caustics=new T.Mesh(new T.PlaneGeometry(8.3,2.75),causticMaterial);caustics.rotation.x=-Math.PI/2;caustics.position.y=.153;group.add(caustics);
 const beads=new T.InstancedMesh(new T.SphereGeometry(.025,12,8),new T.MeshPhysicalMaterial({color:'#d2e9e5',roughness:.04,transparent:true,opacity:.34,depthWrite:false,clearcoat:1}),48);group.add(beads);
 const beadPose=new T.Object3D();for(let i=0;i<48;i++){beadPose.position.set(-4.05+(i*.618%1)*8.1,3.28+(i*.414%1)*.27,i%2?-1.397:1.397);beadPose.scale.set(.45+(i%4)*.16,.8+(i%5)*.17,.25);beadPose.updateMatrix();beads.setMatrixAt(i,beadPose.matrix);}
 const tint=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{clock:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform float clock;void main(){float edge=pow(vUv.y,28.);float shimmer=sin(vUv.x*80.+clock*.6)*sin(vUv.x*31.-clock*.4)*.5+.5;vec3 color=mix(vec3(.045,.29,.36),vec3(.32,.64,.65),vUv.y);gl_FragColor=vec4(color,.035+(1.-vUv.y)*.065+edge*(.10+shimmer*.05));}`});
 for(const z of [-1.397,1.397]){const face=new T.Mesh(new T.PlaneGeometry(8.3,3.06),tint);face.position.set(0,1.71,z);group.add(face);}
 const seams=new T.Group();group.add(seams);const lineMat=new T.LineBasicMaterial({color:'#acdcd5',transparent:true,opacity:.28});
 for(const z of [-1.375,1.375]){const points=[];for(let i=0;i<=100;i++)points.push(new T.Vector3(-4.15+i*.083,3.245,z));const line=new T.Line(new T.BufferGeometry().setFromPoints(points),lineMat);seams.add(line);}
 const pop=new T.InstancedMesh(new T.SphereGeometry(.012,8,5),new T.MeshPhysicalMaterial({color:'#b9dfdc',roughness:.12,transparent:true,opacity:.42,depthWrite:false,clearcoat:1}),42);group.add(pop);const o=new T.Object3D();
 const trailPositions=new Float32Array(100*3),colors=new Float32Array(100*3);for(let i=0;i<100;i++){const t=i/99;colors.set([.18+t*.66,.20+t*.47,.19+t*.13],i*3);}
 const trailGeo=new T.BufferGeometry();trailGeo.setAttribute('position',new T.BufferAttribute(trailPositions,3));trailGeo.setAttribute('color',new T.BufferAttribute(colors,3));trailGeo.setDrawRange(0,0);
 const trail=new T.Line(trailGeo,new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.8,depthWrite:false}));trail.frustumCulled=false;group.add(trail);
 let samples=[],lastSample=-1,lastClock=0;
 function update(s,air,position,operation){
  if(s.time<lastClock||!s.track||!operation){samples=[];lastSample=-1;}lastClock=s.time;
  tint.uniforms.clock.value=s.time;
  causticMaterial.uniforms.clock.value=s.time;causticMaterial.uniforms.strength.value=.06+air*.17+(s.waterOn?s.water/100*.035:0);beads.visible=s.mode==='assembled';
  for(const line of seams.children){const a=line.geometry.attributes.position;for(let i=0;i<a.count;i++)a.setY(i,3.245+Math.sin(a.getX(i)*4+s.time*1.8)*.003*air);a.needsUpdate=true;}
  pop.count=Math.floor(42*air);for(let i=0;i<pop.count;i++){const t=(s.time*(.85+(i%5)*.035)+i*.618)%1,flight=Math.max(0,1-t*2.6),x=-1.1+(i%14)/13*2.2,z=i%2?-.62:.62;o.position.set(x+Math.sin(i)*t*.08,3.255+Math.sin(t*Math.PI)*.055,z+Math.cos(i)*t*.07);o.scale.setScalar(flight);o.updateMatrix();pop.setMatrixAt(i,o.matrix);}pop.instanceMatrix.needsUpdate=true;
  if(operation&&s.track&&s.time-lastSample>=.08){samples.push([...position]);if(samples.length>100)samples.shift();lastSample=s.time;}
  for(let i=0;i<samples.length;i++)trailPositions.set(samples[i],i*3);trailGeo.attributes.position.needsUpdate=true;trailGeo.setDrawRange(0,samples.length);trail.visible=operation&&s.track;
 }
 return {update,snapshot:()=>({trailSamples:samples.length,popCount:pop.count,depthGradient:true,causticClock:causticMaterial.uniforms.clock.value,wallBeads:beads.visible?48:0})};
}
