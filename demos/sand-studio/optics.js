import * as T from '../aquaclear-studio/vendor/three.module.js';
import {WATER_GLSL} from '../filter-runtime/water-glsl.js?v=1';
// One depth-guarded scene capture: modest refraction preserves readable grains.
// The surface adds shared ripples, a mirrored studio, caustic light and a contact line.
export function createOptics(renderer,scene,camera,model){
 const target=new T.WebGLRenderTarget(1,1,{type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType});
 target.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
 const common={image:{value:target.texture},depth:{value:target.depthTexture},time:{value:0},flow:{value:1},near:{value:camera.near},far:{value:camera.far}};
 for(const [mesh,surface]of model.opticalSurfaces){mesh.material=new T.ShaderMaterial({uniforms:{...common,surface:{value:surface}},transparent:true,depthWrite:false,side:T.DoubleSide,
 vertexShader:`varying vec3 w,n;varying vec4 projected;void main(){vec4 p=modelMatrix*vec4(position,1.);w=p.xyz;n=normalize(mat3(modelMatrix)*normal);projected=projectionMatrix*viewMatrix*p;gl_Position=projected;}`,
 fragmentShader:`uniform sampler2D image,depth;uniform float time,flow,surface,near,far;varying vec3 w,n;varying vec4 projected;
 ${WATER_GLSL}
 float distanceZ(float d){return near*far/(far-d*(far-near));}
 void main(){vec2 p=w.xz;vec2 grad=hrSlope(p,time,flow)*surface;vec3 V=normalize(cameraPosition-w);vec3 base=normalize(n);if(dot(base,V)<0.)base=-base;vec3 N=normalize(base+vec3(-grad.x,0.,-grad.y));
  float fresnel=.02+.98*pow(1.-abs(dot(N,V)),5.);vec2 uv=projected.xy/projected.w*.5+.5;vec2 bend=(surface>.5?grad*.022:N.xz*.0018);
  vec2 q=clamp(uv+bend,vec2(.002),vec2(.998));if(texture2D(depth,q).r<gl_FragCoord.z-.0001)q=uv;vec4 behind=texture2D(image,q);
  vec2 px=1.5/vec2(textureSize(depth,0));float here=distanceZ(gl_FragCoord.z);float d=clamp((distanceZ(texture2D(depth,q).r)*2.+distanceZ(texture2D(depth,q+vec2(px.x,0.)).r)+distanceZ(texture2D(depth,q-vec2(px.x,0.)).r)+distanceZ(texture2D(depth,q+vec2(0.,px.y)).r)+distanceZ(texture2D(depth,q-vec2(0.,px.y)).r))/6.-here,0.,2.4);
  vec3 transmission=hrAbsorb(behind.rgb,d*.55);
  float ca=hrCaustic(p+grad*d*2.,time)*surface*behind.a*(1.-exp(-d*6.))*exp(-d*.8);
  transmission+=transmission*ca*1.5+vec3(.45,.7,.68)*ca*.07;
  vec3 H=normalize(V+normalize(vec3(-.4,1.,.65)));float nh=max(0.,dot(N,H));float spec=(pow(nh,420.)*1.5+pow(nh,48.)*.05)*surface+pow(nh,190.)*.25*(1.-surface);
  float contact=surface*behind.a*(1.-smoothstep(.0,.05,d));
  float visibility=.07+fresnel*.16;float coverage=behind.a*(surface>.5?.9:.28);float alpha=coverage+(1.-coverage)*visibility;
  vec3 tint=mix(vec3(.045,.21,.25),vec3(.2,.4,.42),fresnel);
  vec3 color=(transmission*coverage+tint*visibility*(1.-coverage))/max(alpha,.001);
  float mirror=clamp(fresnel*1.15,0.,.9)*surface;color=mix(color,hrStudio(reflect(-V,N)),mirror);alpha=max(alpha,mirror);
  color+=spec+contact*vec3(.42,.56,.55)*.22;
  gl_FragColor=vec4(color,clamp(alpha+spec+contact*.15,0.,.97));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});}
 const size=new T.Vector2();let captures=0;
 return {capture(s){if(!model.waterVisible())return;renderer.getSize(size);const width=Math.min(1280,Math.round(size.x*.9)),height=Math.max(1,Math.round(width*size.y/size.x));if(target.width!==width||target.height!==height)target.setSize(width,height);common.time.value=s.time;common.flow.value=s.velocity/100;const hidden=model.opticalHidden,visibility=hidden.map(o=>o.visible),previous=renderer.getRenderTarget(),color=renderer.getClearColor(new T.Color()),alpha=renderer.getClearAlpha(),tone=renderer.toneMapping,shadows=renderer.shadowMap.autoUpdate;
 try{hidden.forEach(o=>o.visible=false);renderer.setRenderTarget(target);renderer.setClearColor('#172c33',0);renderer.toneMapping=T.NoToneMapping;renderer.shadowMap.autoUpdate=false;renderer.clear();renderer.render(scene,camera);captures++;}finally{hidden.forEach((o,i)=>o.visible=visibility[i]);renderer.setRenderTarget(previous);renderer.setClearColor(color,alpha);renderer.toneMapping=tone;renderer.shadowMap.autoUpdate=shadows;}
 },snapshot:()=>({captures,width:target.width,height:target.height,refraction:'depth-guarded'}),dispose(){target.dispose();}};
}
