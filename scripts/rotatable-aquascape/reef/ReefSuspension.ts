import * as T from 'three';

/** Sparse suspended motes give water depth without an opaque haze. Motion is
 * artistic circulation, driven by the shared pauseable clock, not fluid physics. */
export function reefSuspension(clock:{value:number},daylight:{value:number}){
 let seed=23092355;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const positions=new Float32Array(360*3),traits=new Float32Array(360*2);
 for(let i=0;i<360;i++){
  positions.set([(random()-.5)*9.6,.42+random()*4.75,(random()-.5)*4.2],i*3);
  traits.set([random()*Math.PI*2,.72+random()*.6],i*2);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('traits',new T.BufferAttribute(traits,2));
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{reefTime:clock,daylight},
  vertexShader:`attribute vec2 traits;uniform float reefTime;varying float lightAmount;
   void main(){
    vec3 p=position;
    p.x=mod(p.x+4.8+reefTime*.012*traits.y+.06*sin(reefTime*.17+traits.x),9.6)-4.8;
    p.y=.42+mod(p.y-.42-reefTime*.009*traits.y,4.75);
    p.z=mod(p.z+2.1+reefTime*.004+.04*sin(reefTime*.13+traits.x),4.2)-2.1;
    vec4 viewPosition=modelViewMatrix*vec4(p,1.);
    gl_Position=projectionMatrix*viewPosition;
    gl_PointSize=clamp(27.*traits.y/max(1.,-viewPosition.z),.7,2.3);
    lightAmount=(.16+.12*traits.y)*(.40+.60*smoothstep(.4,5.1,p.y));
   }`,
  fragmentShader:`uniform float daylight;varying float lightAmount;
   void main(){vec2 q=gl_PointCoord*2.-1.;float r=length(q);
    float alpha=exp(-3.5*r*r)*(1.-smoothstep(.55,1.,r))*lightAmount*daylight;
    gl_FragColor=vec4(.38,.57,.78,alpha);
   }`});
 const particles=new T.Points(geometry,material);particles.name='Waterborne particles';particles.frustumCulled=false;
 return particles;
}
