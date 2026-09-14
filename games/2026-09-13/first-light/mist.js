// First-light mist: a drifting sheet of noise-alpha fog hovering just above the water around the
// camera, thickest in the calm half hour around sunrise and gone once the sun climbs or the wind rises.
import * as T from './vendor/three.module.js';
const smooth=(a,b,v)=>{const x=Math.max(0,Math.min(1,(v-a)/(b-a)));return x*x*(3-2*x);};
export function makeMist(scene){
 const u={time:{value:0},strength:{value:0},tint:{value:new T.Color(.85,.86,.84)},eye:{value:new T.Vector3()}};
 const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:u,vertexShader:`varying vec3 wp;void main(){wp=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);}`,
  fragmentShader:`uniform float time,strength;uniform vec3 tint,eye;varying vec3 wp;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){vec2 p=wp.xz*.045+vec2(time*.012,-time*.007);float n=noise(p)*.55+noise(p*2.7+time*.01)*.3+noise(p*6.1)*.15;
 float d=length(wp.xz-eye.xz);float band=smoothstep(6.,40.,d)*(1.-smoothstep(110.,230.,d));
 float a=smoothstep(.40,.80,n)*band*strength*.30;
 gl_FragColor=vec4(tint,a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>}`});
 // Every sheet stays below the seated eye (0.62 m) so the mist is something you look down onto, never a veil over the sky.
 const layers=[];for(let i=0;i<3;i++){const m=new T.Mesh(new T.PlaneGeometry(520,520),mat);m.rotation.x=-Math.PI/2;m.position.y=.12+i*.16;m.renderOrder=3;m.userData.skipRefraction=true;m.userData.skipReflection=true;m.frustumCulled=false;scene.add(m);layers.push(m);}
 return {layers,update(t,eye,elevation,wind,palette){u.time.value=t;u.eye.value.copy(eye);const dawn=smooth(-7,-1,elevation)*(1-smooth(5,14,elevation));u.strength.value=dawn*(1-smooth(.15,.5,wind));u.tint.value.setRGB(palette.fogColor[0]*1.05,palette.fogColor[1]*1.05,palette.fogColor[2]*1.02);for(const m of layers){m.position.x=eye.x;m.position.z=eye.z;m.visible=u.strength.value>.01;}}};
}
