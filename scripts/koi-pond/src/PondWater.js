import * as T from 'three';
import {waterGeometry} from './PondGeometry.js';
export class PondWater{
 constructor(scene,camera,clock){
  this.scene=scene;this.camera=camera;this.clock=clock;this.reflectionCamera=new T.PerspectiveCamera();this.reflection=new T.WebGLRenderTarget(1024,768,{type:T.HalfFloatType});this.refraction=new T.WebGLRenderTarget(1280,720,{type:T.HalfFloatType});this.events=Array.from({length:12},()=>new T.Vector4(0,0,-100,0));this.index=0;this.frame=0;
  this.uniforms={time:clock,reflection:{value:this.reflection.texture},refraction:{value:this.refraction.texture},size:{value:new T.Vector2(1280,720)},reflectionMatrix:{value:new T.Matrix4()},eye:{value:new T.Vector3()},sun:{value:new T.Vector3(-.6,.8,.3).normalize()},ripples:{value:this.events},evening:{value:0}};
  this.mesh=new T.Mesh(waterGeometry(),new T.ShaderMaterial({uniforms:this.uniforms,vertexShader:`varying vec3 world;varying vec4 reflected;uniform mat4 reflectionMatrix;void main(){vec4 wp=modelMatrix*vec4(position,1.);world=wp.xyz;reflected=reflectionMatrix*wp;gl_Position=projectionMatrix*viewMatrix*wp;}`,fragmentShader:`
   uniform float time,evening;uniform sampler2D reflection,refraction;uniform vec2 size;uniform vec3 eye,sun;uniform vec4 ripples[12];varying vec3 world;varying vec4 reflected;
   void main(){vec2 p=world.xz;
    vec2 slope=vec2(.019*cos(p.x*3.6+p.y*2.2+time*.8)+.010*cos(p.x*8.-p.y*3.-time*1.2),.014*cos(p.y*5.2-p.x*1.8+time*.65)+.008*cos(p.y*9.+p.x*3.+time*1.4));
    float sparkle=0.;for(int i=0;i<12;i++){float age=time-ripples[i].z;vec2 delta=p-ripples[i].xy;float d=length(delta);float front=d-age*.64;float fade=exp(-age*.75)*(1.-smoothstep(0.,5.,age))*step(0.,age);float ring=sin(front*36.)*exp(-front*front*7.)*fade*ripples[i].w;slope+=delta/max(d,.01)*ring*.06;sparkle+=max(0.,ring)*.025;}
    vec3 normal=normalize(vec3(-slope.x,1.,-slope.y)),view=normalize(eye-world);float fresnel=.025+.64*pow(1.-max(0.,dot(view,normal)),4.);
    vec2 screen=gl_FragCoord.xy/size+slope*.10;vec3 below=texture2D(refraction,clamp(screen,.001,.999)).rgb;
    vec2 mirror=reflected.xy/reflected.w+slope*.07;vec3 reflectedColor=texture2D(reflection,clamp(mirror,.002,.998)).rgb;
    float depth=1.25-max(0.,length(p/vec2(4.4,3.05))-.53)*.7;
    below=mix(below,vec3(.045,.15,.11),.055*depth);vec3 color=mix(below,reflectedColor,clamp(fresnel,.025,.65));
    float spec=pow(max(0.,dot(normal,normalize(sun+view))),240.);color+=vec3(1.,.88,.64)*spec*.42+sparkle;
    gl_FragColor=vec4(color,1.);#include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`.replace('vec4(color,1.);#include','vec4(color,1.);\n#include')}));
  this.mesh.name='Living pond surface';this.mesh.renderOrder=1;scene.add(this.mesh);
 }
 ripple(x,z,strength=1){this.events[this.index++%12].set(x,z,this.clock.value,strength);}
 resize(w,h){this.refraction.setSize(w,h);this.reflection.setSize(Math.min(1400,w),Math.min(1000,h));this.uniforms.size.value.set(w,h);}
 capture(renderer){
  const old=renderer.getRenderTarget(),clip=renderer.clippingPlanes;this.mesh.visible=false;
  renderer.setRenderTarget(this.refraction);renderer.clear();renderer.render(this.scene,this.camera);
  const mirror=this.reflectionCamera;mirror.copy(this.camera);mirror.position.y=-this.camera.position.y;
  const target=this.camera.getWorldDirection(new T.Vector3()).add(this.camera.position);target.y=-target.y;mirror.up.copy(this.camera.up);mirror.up.y=-mirror.up.y;mirror.lookAt(target);mirror.updateMatrixWorld(true);
  this.uniforms.reflectionMatrix.value.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);
  renderer.clippingPlanes=[new T.Plane(new T.Vector3(0,1,0),-.04)];renderer.setRenderTarget(this.reflection);renderer.clear();renderer.render(this.scene,mirror);
  renderer.clippingPlanes=clip;renderer.setRenderTarget(old);this.mesh.visible=true;this.uniforms.eye.value.copy(this.camera.position);
 }
}
