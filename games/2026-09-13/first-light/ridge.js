// The ridges behind the tree line: two rings of hills far outside the cove, a serrated skyline
// from layered noise, coloured by distance the way air does it (the far ring is nearly the sky's
// own purple, the near one darker and warmer toward the sun). They ignore the scene fog, which
// at a kilometre would paint them peach, and they sit in the planar reflection. Sky-locked to the
// camera in x/z like the sky sphere, so they never parallax against the real shore.
import * as T from './vendor/three.module.js';
import {noise} from './lake-shape.js';
// pure: the skyline height of a ring at an angle, in metres above the water
export function ridgeHeight(angle,{radius=1000,base=40,relief=110,seed=0}={}){
 const a=angle;const n=noise(Math.cos(a)*2.3+seed*7.1,Math.sin(a)*2.3)*.55+noise(Math.cos(a)*6.1+seed*3.3,Math.sin(a)*6.1)*.3+noise(Math.cos(a)*15+seed,Math.sin(a)*15)*.15;
 const peaks=Math.pow(Math.max(0,n),1.35);
 return base+relief*peaks;
}
export const RINGS=[
 {radius:1500,base:70,relief:150,seed:3,far:1},
 {radius:1000,base:40,relief:100,seed:11,far:.55}
];
function ringGeometry(r){
 const N=180;const pos=[],uv=[],idx=[];
 for(let i=0;i<=N;i++){const a=i/N*Math.PI*2;const x=Math.cos(a)*r.radius,z=Math.sin(a)*r.radius;const h=ridgeHeight(a,r);
  pos.push(x,-30,z, x,h,z);uv.push(i/N,0, i/N,1);
  if(i<N){const b=i*2;idx.push(b,b+2,b+1, b+1,b+2,b+3);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeBoundingSphere();return g;
}
export function makeRidge(scene){
 const root=new T.Group();scene.add(root);
 const u={colorAway:{value:new T.Color(.2,.15,.35)},colorSun:{value:new T.Color(.5,.3,.3)},sunDir:{value:new T.Vector3(0,1,0)},haze:{value:.5},skyLow:{value:new T.Color(.5,.3,.4)}};
 const mats=RINGS.map(r=>new T.ShaderMaterial({uniforms:{...u,far:{value:r.far}},side:T.DoubleSide,depthWrite:true,vertexShader:`varying vec3 wp;varying float vh;void main(){wp=(modelMatrix*vec4(position,1.)).xyz;vh=uv.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform vec3 colorAway,colorSun,sunDir,skyLow;uniform float haze,far;varying vec3 wp;varying float vh;
void main(){vec3 d=normalize(vec3(wp.x-cameraPosition.x,0.,wp.z-cameraPosition.z));float az=.5+.5*dot(d,normalize(vec3(sunDir.x,0.,sunDir.z)+vec3(1e-4)));
 vec3 c=mix(colorAway,colorSun,pow(az,3.));
 // aerial perspective: the far ring melts into the low sky, the crest a touch lighter than the foot
 c=mix(c,skyLow,haze*far);c*=mix(.85,1.05,vh);
 gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`}));
 const meshes=RINGS.map((r,i)=>{const m=new T.Mesh(ringGeometry(r),mats[i]);m.frustumCulled=false;m.userData.skipReflection=false;m.renderOrder=-5;root.add(m);return m;});
 return {root,meshes,
  // palette: the sky palette of the hour; sunDir: unit vector to the sun
  update(eye,palette,sunDir,elevation){root.position.set(eye.x,0,eye.z);
   const lowSun=Math.max(0,Math.min(1,1-(elevation-2)/18)),night=palette.night||0;
   const z=palette.zenith,h=palette.horizon;
   // away from the sun the hills are the zenith's purple pulled down a little; toward it they warm toward the horizon band
   u.colorAway.value.setRGB(z[0]*.9+.01,z[1]*.8+.01,z[2]*.9+.02);
   u.colorSun.value.setRGB(h[0]*.45+z[0]*.4,h[1]*.35+z[1]*.4,h[2]*.35+z[2]*.5);
   u.skyLow.value.setRGB(h[0]*.5+z[0]*.5,h[1]*.5+z[1]*.5,h[2]*.5+z[2]*.5);
   u.haze.value=.35+.25*lowSun;
   u.sunDir.value.set(sunDir.x,sunDir.y,sunDir.z).normalize();
   for(const m of meshes)m.visible=night<.98;}};
}
