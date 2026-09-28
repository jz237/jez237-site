import * as T from 'three';
import {waterGeometry} from './PondGeometry.js';
export class PondWater{
 constructor(scene,camera,clock){
  this.scene=scene;this.camera=camera;this.clock=clock;this.reflectionCamera=new T.PerspectiveCamera();this.reflection=new T.WebGLRenderTarget(1024,768,{type:T.HalfFloatType});this.refraction=new T.WebGLRenderTarget(1280,720,{type:T.HalfFloatType});this.events=Array.from({length:32},()=>new T.Vector4(0,0,-100,0));this.index=0;this.wakeTimer=0;this.fallTimer=0;
  this.uniforms={time:clock,reflection:{value:this.reflection.texture},refraction:{value:this.refraction.texture},size:{value:new T.Vector2(1280,720)},reflectionMatrix:{value:new T.Matrix4()},eye:{value:new T.Vector3()},sun:{value:new T.Vector3(-.6,.8,.3).normalize()},ripples:{value:this.events},evening:{value:0},cascade:{value:new T.Vector2(6,-5)}};
  this.mesh=new T.Mesh(waterGeometry(),new T.ShaderMaterial({uniforms:this.uniforms,vertexShader:`varying vec3 world;varying vec4 reflected;varying float depth;attribute float pondDepth;uniform float time;uniform mat4 reflectionMatrix;void main(){vec3 p=position;float shore=smoothstep(0.,.5,pondDepth);p.y+=shore*(sin(p.x*2.1+p.z*1.5+time*.9)*.009+sin(p.z*3.7-p.x*1.3-time*.7)*.005);vec4 wp=modelMatrix*vec4(p,1.);world=wp.xyz;depth=pondDepth;reflected=reflectionMatrix*wp;gl_Position=projectionMatrix*viewMatrix*wp;}`,fragmentShader:`
   uniform float time,evening;uniform sampler2D reflection,refraction;uniform vec2 size,cascade;uniform vec3 eye,sun;uniform vec4 ripples[32];varying vec3 world;varying vec4 reflected;varying float depth;
   void main(){vec2 p=world.xz;
    vec2 slope=vec2(.055*cos(p.x*2.1+p.y*1.5+time*.9)+.021*cos(p.x*5.3-p.y*2.7-time*1.3)+.012*cos(p.x*13.1+p.y*8.2+time*1.8),.046*cos(p.y*3.7-p.x*1.3-time*.7)+.019*cos(p.y*6.2+p.x*3.6+time*1.1)+.013*cos(p.y*12.3-p.x*7.8-time*1.7));
    float sparkle=0.;for(int i=0;i<32;i++){float age=time-ripples[i].z;if(age>0.&&age<6.){vec2 delta=p-ripples[i].xy;float d=length(delta);float front=d-age*.72;float fade=exp(-age*.70)*(1.-smoothstep(4.,6.,age));float ring=sin(front*29.)*exp(-front*front*11.)*fade*ripples[i].w;slope+=delta/max(d,.01)*ring*.12;sparkle+=max(0.,ring)*.012;}}
    float fallDist=length(p-cascade);slope+=normalize(p-cascade+.001)*sin(fallDist*28.-time*5.)*exp(-fallDist*1.4)*.055;
    vec3 normal=normalize(vec3(-slope.x,1.,-slope.y)),view=normalize(eye-world);float fresnel=.065+.67*pow(1.-max(0.,dot(view,normal)),4.);
    vec2 screen=gl_FragCoord.xy/size+slope*.032;vec3 below=texture2D(refraction,clamp(screen,.001,.999)).rgb;
    vec2 mirror=clamp(reflected.xy/reflected.w+slope*.052,.002,.998);vec2 blur=vec2(.0011,.0014);vec3 reflectedColor=texture2D(reflection,mirror).rgb*.40;
    reflectedColor+=(texture2D(reflection,mirror+blur).rgb+texture2D(reflection,mirror-blur).rgb+texture2D(reflection,mirror+vec2(blur.x,-blur.y)).rgb+texture2D(reflection,mirror+vec2(-blur.x,blur.y)).rgb)*.15;
    reflectedColor=reflectedColor/(vec3(1.)+reflectedColor*.13);
    vec3 trans=exp(-vec3(.20,.072,.085)*depth);below=below*trans+vec3(.055,.18,.14)*(1.-trans);
    vec3 color=mix(below,reflectedColor,clamp(fresnel,.065,.72));
    float spec=pow(max(0.,dot(normal,normalize(sun+view))),210.);color+=vec3(1.,.9,.7)*spec*.8+sparkle;
    float foam=exp(-fallDist*fallDist*2.8)*pow(.5+.5*sin(p.x*52.+sin(p.y*47.-time*2.5)),8.);color=mix(color,vec3(.66,.78,.69),foam*.38);
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`}));this.mesh.name='Living pond surface';this.mesh.renderOrder=1;scene.add(this.mesh);
 }
 ripple(x,z,strength=1){this.events[this.index++%32].set(x,z,this.clock.value,strength);}
 update(dt,fish,cascade){this.uniforms.cascade.value.set(cascade.x,cascade.z);this.wakeTimer+=dt;this.fallTimer+=dt;if(this.wakeTimer>.5){this.wakeTimer=0;for(const f of fish)if(f.position.y>-.6){const strength=(1+f.position.y/.65)*.36;this.ripple(f.position.x+Math.cos(f.yaw)*.28*f.size,f.position.z-Math.sin(f.yaw)*.28*f.size,strength);}}if(this.fallTimer>.9){this.fallTimer=0;this.ripple(cascade.x,cascade.z+.15,.24);}}
 resize(w,h){this.refraction.setSize(w,h);this.reflection.setSize(Math.min(1600,w),Math.min(1100,h));this.uniforms.size.value.set(w,h);}
 capture(renderer){const old=renderer.getRenderTarget(),clip=renderer.clippingPlanes;this.mesh.visible=false;renderer.setRenderTarget(this.refraction);renderer.clear();renderer.render(this.scene,this.camera);
  const mirror=this.reflectionCamera;mirror.copy(this.camera);mirror.position.y=-this.camera.position.y;const target=this.camera.getWorldDirection(new T.Vector3()).add(this.camera.position);target.y=-target.y;mirror.up.copy(this.camera.up);mirror.up.y=-mirror.up.y;mirror.lookAt(target);mirror.updateMatrixWorld(true);
  this.uniforms.reflectionMatrix.value.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);
  renderer.clippingPlanes=[new T.Plane(new T.Vector3(0,1,0),-.04)];renderer.setRenderTarget(this.reflection);renderer.clear();renderer.render(this.scene,mirror);renderer.clippingPlanes=clip;renderer.setRenderTarget(old);this.mesh.visible=true;this.uniforms.eye.value.copy(this.camera.position);
 }
}
