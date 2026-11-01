import * as T from '../aquaclear-studio/vendor/three.module.js';

// Small, deterministic material maps. They are generated locally, never fetched.
export function createFinishes(){
 const maps=new Map();
 function grain(kind){if(maps.has(kind))return maps.get(kind);const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),im=ctx.createImageData(256,256);let seed=7341;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){const n=random(),weave=Math.sin(x*Math.PI/3)*Math.cos(y*Math.PI/3),brushed=Math.sin(y*2.3)+Math.sin(y*.57);const v=kind==='steel'?130+brushed*21+n*14:kind==='cloth'?132+weave*46+n*30:kind==='rubber'?118+n*80:140+n*55;const i=(y*256+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}
  ctx.putImageData(im,0,0);const texture=new T.CanvasTexture(c);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(kind==='cloth'?4:3,3);texture.anisotropy=4;maps.set(kind,texture);return texture;
 }
 return (color,kind='dark',extra={})=>new T.MeshPhysicalMaterial({color,side:T.DoubleSide,roughness:kind==='rubber'?.77:kind==='cloth'?.94:kind==='steel'?.3:.46,metalness:kind==='steel'?.85:.025,clearcoat:kind==='dark'?.2:0,clearcoatRoughness:.42,bumpMap:grain(kind),bumpScale:kind==='cloth'?.018:kind==='rubber'?.006:kind==='steel'?.0015:.003,roughnessMap:grain(kind),...extra});
}

// A single depth-guarded scene capture is shared by quartz and water. Light
// mode uses the same visible surface highlights without an extra render pass.
export function createOpticalMaterials(clock){
 const shared={clock,sceneMap:{value:null},depthMap:{value:null},captureOn:{value:0}};
 const material=kind=>new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{...shared,kind:{value:kind}},
 vertexShader:`varying vec3 worldPoint,worldNormal,localPoint;varying vec4 screenPoint;
 void main(){vec4 w=modelMatrix*vec4(position,1.);worldPoint=w.xyz;worldNormal=normalize(mat3(modelMatrix)*normal);localPoint=position;screenPoint=projectionMatrix*viewMatrix*w;gl_Position=screenPoint;}`,
 fragmentShader:`uniform sampler2D sceneMap,depthMap;uniform float clock,kind,captureOn;varying vec3 worldPoint,worldNormal,localPoint;varying vec4 screenPoint;
 float noise(vec3 p){return sin(p.x+sin(p.z*1.7))*cos(p.y*.8+sin(p.x*.6));}
 void main(){vec3 N=normalize(worldNormal),V=normalize(cameraPosition-worldPoint);if(dot(N,V)<0.)N=-N;
 float wet=step(.5,kind),t=clock*1.7;vec3 q=localPoint*vec3(8.,20.,20.)-vec3(t*2.,t*.3,0.);
 float wave=noise(q)+.35*noise(q*2.2+vec3(t*.5));float relief=wave*.0012*wet;
 vec3 a=dFdx(worldPoint),b=dFdy(worldPoint),r1=cross(b,N),r2=cross(N,a);float det=dot(a,r1);
 if(abs(det)>.0000001)N=normalize(abs(det)*N-sign(det)*(dFdx(relief)*r1+dFdy(relief)*r2));
 float facing=abs(dot(N,V)),fresnel=.035+.965*pow(1.-facing,4.);
 vec3 R=reflect(-V,N);float broad=pow(max(dot(R,normalize(vec3(-.6,.8,1.))),0.),32.);float strip=pow(max(dot(R,normalize(vec3(.2,.7,-.9))),0.),110.);
 vec2 uv=screenPoint.xy/screenPoint.w*.5+.5,bend=(mat3(viewMatrix)*N).xy*mix(.0015,.002,wet);vec2 sampleUV=clamp(uv+bend,vec2(.001),vec2(.999));
 vec4 background=vec4(0.);if(captureOn>.5){if(texture2D(depthMap,sampleUV).r<gl_FragCoord.z-.0001)sampleUV=uv;background=texture2D(sceneMap,sampleUV);background.a*=(1.-step(.99999,texture2D(depthMap,sampleUV).r))*mix(.7,.4,wet);}
 float streak=pow(max(0.,wave*.55),8.)*wet;float density=mix(.055,.16,wet)+fresnel*.3+streak*.16;
 vec3 tint=mix(vec3(.39,.63,.64),vec3(.06,.31,.42),wet);float alpha=background.a*(1.-density)+density;
 vec3 color=(background.rgb*background.a*(1.-density)+tint*density)/max(alpha,.001);
 color+=vec3(.72,.9,.96)*(broad*(.15+.5*fresnel)+strip*.55+streak*.2);
 gl_FragColor=vec4(color,clamp(alpha,0.,.94));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 const quartz=material(0),water=material(1);let captureCount=0,target,size=new T.Vector2();
 return {quartz,water,capture(renderer,scene,camera,meshes,enabled){shared.captureOn.value=enabled?1:0;if(!enabled)return;
  if(!target){target=new T.WebGLRenderTarget(1,1,{type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType});target.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);shared.sceneMap.value=target.texture;shared.depthMap.value=target.depthTexture;}
  renderer.getSize(size);const w=Math.max(1,Math.min(1400,Math.round(size.x*.9))),h=Math.max(1,Math.round(w*size.y/size.x));if(target.width!==w||target.height!==h)target.setSize(w,h);
  const visible=meshes.map(m=>m.visible),oldTarget=renderer.getRenderTarget(),tone=renderer.toneMapping,shadowAuto=renderer.shadowMap.autoUpdate;
  try{meshes.forEach(m=>m.visible=false);renderer.toneMapping=T.NoToneMapping;renderer.shadowMap.autoUpdate=false;renderer.setRenderTarget(target);renderer.clear();renderer.render(scene,camera);captureCount++;}
  finally{meshes.forEach((m,i)=>m.visible=visible[i]);renderer.setRenderTarget(oldTarget);renderer.toneMapping=tone;renderer.shadowMap.autoUpdate=shadowAuto;}
 },snapshot:()=>({captures:captureCount,refraction:shared.captureOn.value>0,resolution:target?[target.width,target.height]:[0,0]})};
}
