// What the eye sees under the surface besides the world: suspended particulate drifting in a box
// around the camera, and light shafts as a screen-space overlay of radial streaks from the sun's
// projected position, strongest just below the surface and gone at depth or at night.
import * as T from './vendor/three.module.js';
export function makeUnderwaterFx(scene){
 const N=900,box=14,pos=new Float32Array(N*3),seed=new Float32Array(N);for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*box;pos[i*3+1]=(Math.random()-.5)*box;pos[i*3+2]=(Math.random()-.5)*box;seed[i]=Math.random();}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));geo.setAttribute('seed',new T.BufferAttribute(seed,1));
 const pu={time:{value:0},center:{value:new T.Vector3()},tint:{value:new T.Color(.8,.86,.8)},fade:{value:0},pixelRatio:{value:1}};
 const pm=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:pu,vertexShader:`attribute float seed;uniform float time,pixelRatio;uniform vec3 center;varying float a;void main(){vec3 p=position;p.x+=sin(time*.21+seed*6.28)*.35;p.y+=sin(time*.13+seed*9.1)*.2;p.z+=cos(time*.17+seed*4.4)*.35;p=center+(mod(p-center+7.,14.)-7.);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float d=max(.4,-mv.z);gl_PointSize=(.8+seed*1.6)*pixelRatio*16./d;a=smoothstep(11.,2.,d)*(.22+seed*.3);}`,fragmentShader:`uniform vec3 tint;uniform float fade;varying float a;void main(){vec2 uv=gl_PointCoord-.5;float d=dot(uv,uv)*4.;if(d>1.)discard;gl_FragColor=vec4(tint,a*fade*(1.-d)*(1.-d));}`});
 const points=new T.Points(geo,pm);points.frustumCulled=false;points.userData.skipRefraction=true;points.userData.skipReflection=true;points.visible=false;scene.add(points);
 const su={sunScreen:{value:new T.Vector2(.5,1.2)},strength:{value:0},time:{value:0},tint:{value:new T.Color(1,.95,.8)}};
 const shafts=new T.Mesh(new T.PlaneGeometry(2,2),new T.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,blending:T.AdditiveBlending,uniforms:su,vertexShader:'varying vec2 uvP;void main(){uvP=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`uniform vec2 sunScreen;uniform float strength,time;uniform vec3 tint;varying vec2 uvP;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){vec2 d=uvP-sunScreen;float r=length(d);float ang=atan(d.y,d.x);float beams=noise(vec2(ang*7.,time*.05))*.6+noise(vec2(ang*23.+3.,time*.08))*.4;float rays=pow(beams,2.2)*smoothstep(1.3,.15,r)*smoothstep(.0,.35,uvP.y);gl_FragColor=vec4(tint*rays*strength,1.);}`}));
 const overlay=new T.Scene();overlay.add(shafts);const ortho=new T.Camera();
 return {points,update(t,camera,underwater,depth,sunDir,sunUp,pixelRatio,quality){
   pu.time.value=t;pu.pixelRatio.value=pixelRatio;points.visible=underwater&&quality!=='saver';pu.center.value.copy(camera.position);pu.fade.value=underwater?1:0;
   const s=new T.Vector3(sunDir.x,sunDir.y,sunDir.z).multiplyScalar(500).add(camera.position).project(camera);su.sunScreen.value.set(s.x*.5+.5,s.y*.5+.5);
   const facing=s.z<1?1:0;su.strength.value=underwater?Math.max(0,sunUp)*(1-Math.min(1,depth/6))*.55*facing:0;su.time.value=t;},
  render(renderer){if(su.strength.value<=.01)return;const auto=renderer.autoClear;renderer.autoClear=false;renderer.render(overlay,ortho);renderer.autoClear=auto;}};
}
