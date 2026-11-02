// Post: MSAA HDR render -> bloom -> tone map (OutputPass) -> grade/vignette/CA/grain/frost/damage.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {Pass,FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
import {CopyShader} from 'three/addons/shaders/CopyShader.js';

// Water (layer 1) drawn over the finished opaque frame: copy the frame, then draw the water
// meshes sampling that frame's colour and depth (refraction, absorption, reflections).
class WaterPass extends Pass{
  constructor(scene,camera){super();this.scene=scene;this.camera=camera;this.water=null;this.enabled=false;
    this.copy=new FullScreenQuad(new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.clone(CopyShader.uniforms),vertexShader:CopyShader.vertexShader,fragmentShader:CopyShader.fragmentShader,depthTest:false,depthWrite:false}));}
  render(r,writeBuffer,readBuffer){
    r.setRenderTarget(this.renderToScreen?null:writeBuffer);r.clear(true,true,false);
    this.copy.material.uniforms.tDiffuse.value=readBuffer.texture;this.copy.render(r);
    const U=this.water.uniforms;U.tScene.value=readBuffer.texture;U.tDepth.value=readBuffer.depthTexture;
    const bg=this.scene.background,auto=r.autoClear,sh=r.shadowMap.autoUpdate,mask=this.camera.layers.mask;
    this.scene.background=null;r.autoClear=false;r.shadowMap.autoUpdate=false;this.camera.layers.set(1);
    r.render(this.scene,this.camera);
    this.camera.layers.mask=mask;r.shadowMap.autoUpdate=sh;r.autoClear=auto;this.scene.background=bg;}
  dispose(){this.copy.dispose();this.copy.material.dispose();}
}

// Ambient occlusion that ignores particles, glows, water and the sky dome (they would print dark halos).
class GameAO extends GTAOPass{
  _overrideVisibility(){super._overrideVisibility();this._hidden=[];
    this.scene.traverse(o=>{if(o.visible&&o.isMesh&&o.material&&(o.material.transparent||o.material.isShaderMaterial)){o.visible=false;this._hidden.push(o);}});}
  _restoreVisibility(){for(const o of this._hidden)o.visible=true;this._hidden=[];super._restoreVisibility();}
}

const FinalShader={
  uniforms:{tDiffuse:{value:null},uTime:{value:0},uVignette:{value:.32},uCA:{value:0},uGrain:{value:.035},uFrost:{value:0},uHurt:{value:0},uFlash:{value:0},
    uLift:{value:new THREE.Vector3()},uGain:{value:new THREE.Vector3(1,1,1)},uSat:{value:1},uScan:{value:0},uRes:{value:new THREE.Vector2(1,1)},uFade:{value:0}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uVignette,uCA,uGrain,uFrost,uHurt,uFlash,uSat,uScan,uFade;uniform vec3 uLift,uGain;uniform vec2 uRes;varying vec2 vUv;
    float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    void main(){vec2 uv=vUv;vec2 c=uv-.5;float r2=dot(c,c);
      vec3 col;if(uCA>.0005){vec2 o=c*uCA*r2*4.;col=vec3(texture2D(tDiffuse,uv+o).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-o).b);}else col=texture2D(tDiffuse,uv).rgb;
      col=col*uGain+uLift*(1.-col);float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,uSat);
      if(uFrost>0.){vec2 q=uv*vec2(uRes.x/uRes.y,1.);float n=vn(q*7.)*.55+vn(q*23.)*.3+vn(q*61.)*.15;
        float edge=smoothstep(.1,.3,r2+(n-.5)*.14);
        col=mix(col,vec3(.82,.95,1.)*(l*.45+.6),edge*uFrost*.62);
        col=mix(col,vec3(dot(col,vec3(.33)))*vec3(.84,.97,1.14),uFrost*.3);}
      if(uHurt>0.){col=mix(col,vec3(1.,.08,.12),smoothstep(.1,.5,r2)*uHurt*.6);}
      col*=1.-uVignette*smoothstep(.12,.62,r2);
      col+=uFlash*vec3(.85,.95,1.);
      col+=(h(uv*uRes+fract(uTime*7.1)*91.)-.5)*uGrain;
      if(uScan>0.)col*=1.-uScan*.18*(.5+.5*sin(uv.y*uRes.y*3.14159));
      col*=1.-uFade;
      gl_FragColor=vec4(col,1.);}`
};

export function createPost(gl,scene,camera,quality){
  const size=gl.getDrawingBufferSize(new THREE.Vector2());
  const rt=new THREE.WebGLRenderTarget(size.x,size.y,{type:THREE.HalfFloatType,samples:quality==='low'?0:4});
  rt.depthTexture=new THREE.DepthTexture(size.x,size.y);rt.depthTexture.type=THREE.UnsignedIntType;   // read by the water pass
  const composer=new EffectComposer(gl,rt);
  const renderPass=new RenderPass(scene,camera);composer.addPass(renderPass);
  const water=new WaterPass(scene,camera);composer.addPass(water);
  let ao=null;
  if(quality==='ultra'){ao=new GameAO(scene,camera,size.x,size.y);ao.output=GTAOPass.OUTPUT.Default;ao.blendIntensity=.85;
    ao.updateGtaoMaterial({radius:16,distanceExponent:1.6,thickness:6,distanceFallOff:1,scale:1.15,samples:12});ao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:5,rings:2,samples:12});composer.addPass(ao);}
  const bloom=new UnrealBloomPass(new THREE.Vector2(size.x,size.y),.6,.55,.92);composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const final=new ShaderPass(FinalShader);composer.addPass(final);
  const u=final.uniforms;
  return {composer,bloom,final,u,ao,
    setWater(w){water.water=w;water.enabled=!!w;},
    setSize(w,h){composer.setSize(w,h);u.uRes.value.set(w,h);bloom.resolution.set(w,h);},
    setGrade(g){u.uLift.value.set(...g.lift);u.uGain.value.set(...g.gain);u.uSat.value=g.sat;},
    render(){composer.render();}};
}
