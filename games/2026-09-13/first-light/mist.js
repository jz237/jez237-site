// First-light mist: a drifting sheet of noise-alpha fog hovering just above the water around the
// camera, thickest in the calm half hour around sunrise and gone once the sun climbs or the wind rises.
import * as T from './vendor/three.module.js';
const smooth=(a,b,v)=>{const x=Math.max(0,Math.min(1,(v-a)/(b-a)));return x*x*(3-2*x);};
// a mist bank: a soft sprite over the water, brighter when the sun is behind it
// A bank of mist: a low lens of vapour whose top edge is ragged and whose body is drawn out into long
// horizontal tendrils, so it reads as the wisps that lie on a lake at first light rather than a soft
// ellipse. Four seeds give neighbouring banks different shapes.
function bankTexture(seed=0){const W=512,H=192,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');const img=g.createImageData(W,H);const d=img.data;
 const hash=(x,y)=>{const s=Math.sin(x*127.1+y*311.7+seed*17.3)*43758.5453;return s-Math.floor(s);};const smooth=(v)=>v*v*(3-2*v);
 const n2=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);const a=hash(ix,iy),b=hash(ix+1,iy),cc=hash(ix,iy+1),dd=hash(ix+1,iy+1);return (a+(b-a)*fx)+((cc+(dd-cc)*fx)-(a+(b-a)*fx))*fy;};
 const fbm=(x,y)=>n2(x,y)*.5+n2(x*2.1+3,y*2.1)*.3+n2(x*4.3+7,y*4.3)*.2;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const u=x/W*2-1,v=y/H*2-1;
  // the lens, drawn out sideways; tendrils are long in x and short in y
  const ell=Math.max(0,1-(u*u*.9+v*v*2.6));
  const body=fbm(x/70,y/16)*.55+fbm(x/22,y/7)*.45;
  // a ragged top: the upper boundary wanders with a low-frequency noise and frays with a high one
  const edge=-.15+.5*n2(x/48+seed,.5)+.2*n2(x/9,seed*3.1);
  const top=v<0?1-Math.pow(Math.max(0,(-v-edge)/(1.05-edge)),.55):1;
  const tendril=Math.pow(Math.max(0,body-.22),.8)*1.35;
  const a=Math.pow(ell,1.1)*Math.min(1,tendril)*Math.max(0,top)*(1-Math.max(0,v)*.3);
  const i=(y*W+x)*4;d[i]=d[i+1]=d[i+2]=255;d[i+3]=Math.round(255*Math.min(1,a));}
 g.putImageData(img,0,0);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
export function makeMist(scene,{banks:bankSpots=[]}={}){
 const bankTexs=bankSpots.length?[0,1,2,3].map(k=>bankTexture(k)):[];const banks=bankSpots.map((b,i)=>{const m=new T.SpriteMaterial({map:bankTexs[i%4],transparent:true,depthWrite:false,opacity:0,color:0xffffff});const s=new T.Sprite(m);s.position.set(b.x,b.y||1.1,b.z);s.scale.set(b.w||50,b.h||3,1);s.renderOrder=4;s.userData.skipRefraction=true;s.userData.skipReflection=true;s.userData.phase=i*1.7;scene.add(s);return s;});
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
 return {layers,banks,update(t,eye,elevation,wind,palette,sunDir=null){u.time.value=t;u.eye.value.copy(eye);const dawn=smooth(-7,-1,elevation)*(1-smooth(5,14,elevation));u.strength.value=dawn*1.3*(1-smooth(.15,.5,wind));const mc=palette.mistColor||palette.fogColor;u.tint.value.setRGB(mc[0]*1.05,mc[1]*1.05,mc[2]*1.02);for(const m of layers){m.position.x=eye.x;m.position.z=eye.z;m.visible=u.strength.value>.01&&!m.userData.forceHidden;}
   // the banks: strongest in the calm dawn, glowing where the low sun is behind them
   const bankStrength=1.8*smooth(-8,-2,elevation)*(1-smooth(7,20,elevation))*(1-smooth(.2,.55,wind));
   for(const s of banks){const dx=s.position.x-eye.x,dz=s.position.z-eye.z,dl=Math.hypot(dx,dz)||1;const toward=sunDir?Math.max(0,(dx/dl)*sunDir.x+(dz/dl)*sunDir.z):0;const glow=.35+.65*toward*toward;
    s.material.opacity=bankStrength*(.55+.25*Math.sin(t*.05+s.userData.phase))*.85;s.material.color.setRGB(mc[0]*(.9+.5*glow),mc[1]*(.9+.42*glow),mc[2]*(.9+.3*glow));s.visible=s.material.opacity>.01;s.position.y=(s.userData.baseY??(s.userData.baseY=s.position.y))+.15*Math.sin(t*.07+s.userData.phase);}}};
}
