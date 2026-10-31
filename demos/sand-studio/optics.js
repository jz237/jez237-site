import * as T from '../aquaclear-studio/vendor/three.module.js';
// One depth-guarded scene capture: modest refraction preserves readable grains.
export function createOptics(renderer,scene,camera,model){
 const target=new T.WebGLRenderTarget(1,1,{type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType});
 target.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
 const common={image:{value:target.texture},depth:{value:target.depthTexture},time:{value:0},flow:{value:1},near:{value:camera.near},far:{value:camera.far}};
 for(const [mesh,surface]of model.opticalSurfaces){mesh.material=new T.ShaderMaterial({uniforms:{...common,surface:{value:surface}},transparent:true,depthWrite:false,side:T.DoubleSide,
 vertexShader:`varying vec3 w,n;varying vec4 projected;void main(){vec4 p=modelMatrix*vec4(position,1.);w=p.xyz;n=normalize(mat3(modelMatrix)*normal);projected=projectionMatrix*viewMatrix*p;gl_Position=projected;}`,
 fragmentShader:`uniform sampler2D image,depth;uniform float time,flow,surface,near,far;varying vec3 w,n;varying vec4 projected;
 float height(vec2 p){return (sin(p.x*10.+p.y*7.-time*1.7)*.004+sin(p.x*23.-p.y*16.+time*1.2)*.0015)*(.12+flow*.88);}
 float distanceZ(float d){return near*far/(far-d*(far-near));}
 void main(){vec2 p=w.xz;float e=.015;vec2 grad=vec2(height(p+vec2(e,0))-height(p-vec2(e,0)),height(p+vec2(0,e))-height(p-vec2(0,e)))/(2.*e);vec3 N=normalize(n+vec3(-grad.x,0.,-grad.y)*surface);vec3 V=normalize(cameraPosition-w);float fresnel=.02+.98*pow(1.-abs(dot(N,V)),5.);vec2 uv=projected.xy/projected.w*.5+.5;vec2 bend=(surface>.5?grad*.014:N.xz*.0018);vec2 q=clamp(uv+bend,vec2(.002),vec2(.998));if(texture2D(depth,q).r<gl_FragCoord.z-.0001)q=uv;vec4 behind=texture2D(image,q);float d=clamp(distanceZ(texture2D(depth,q).r)-distanceZ(gl_FragCoord.z),0.,1.8);vec3 absorption=exp(-d*vec3(.12,.035,.02));vec3 transmission=behind.rgb*absorption+vec3(.045,.19,.21)*(1.-absorption);vec3 H=normalize(V+normalize(vec3(-.4,1.,.65)));float spec=pow(max(0.,dot(N,H)),190.)*.6;float wave=pow(max(0.,sin(w.x*18.+w.z*23.-time*1.6)),18.)*.035*flow*surface;float visibility=.095+fresnel*.19+wave;float coverage=behind.a*(surface>.5?.85:.28);float alpha=coverage+(1.-coverage)*visibility;vec3 tint=mix(vec3(.055,.24,.28),vec3(.26,.47,.48),fresnel);vec3 color=(transmission*coverage+tint*visibility*(1.-coverage))/max(alpha,.001);gl_FragColor=vec4(color+spec+wave,clamp(alpha+spec,0.,.96));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});}
 const size=new T.Vector2();let captures=0;
 return {capture(s){if(!model.waterVisible())return;renderer.getSize(size);const width=Math.min(1280,Math.round(size.x*.9)),height=Math.max(1,Math.round(width*size.y/size.x));if(target.width!==width||target.height!==height)target.setSize(width,height);common.time.value=s.time;common.flow.value=s.velocity/100;const hidden=model.opticalHidden,visibility=hidden.map(o=>o.visible),previous=renderer.getRenderTarget(),color=renderer.getClearColor(new T.Color()),alpha=renderer.getClearAlpha(),tone=renderer.toneMapping,shadows=renderer.shadowMap.autoUpdate;
 try{hidden.forEach(o=>o.visible=false);renderer.setRenderTarget(target);renderer.setClearColor('#172c33',0);renderer.toneMapping=T.NoToneMapping;renderer.shadowMap.autoUpdate=false;renderer.clear();renderer.render(scene,camera);captures++;}finally{hidden.forEach((o,i)=>o.visible=visibility[i]);renderer.setRenderTarget(previous);renderer.setClearColor(color,alpha);renderer.toneMapping=tone;renderer.shadowMap.autoUpdate=shadows;}
 },snapshot:()=>({captures,width:target.width,height:target.height,refraction:'depth-guarded'}),dispose(){target.dispose();}};
}
