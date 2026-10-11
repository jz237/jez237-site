/**
 * A small, self-contained bloom pass.
 *
 * Deliberately hand-rolled rather than pulled from three's example modules:
 * the whole app is vendored, and this needs to be about 150 lines of
 * bright-pass plus separable blur, not a general-purpose effect composer.
 *
 * Restraint is the point. The bloom exists to let the sun glint come off the
 * water and the night road network breathe; if it is washing out the relief,
 * it is turned up too far.
 */

import { createClouds } from './clouds.js?v=philly-2026100901';

const QUAD_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BRIGHT_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform sampler2D uScene;
  uniform float uThreshold;
  uniform float uKnee;
  varying vec2 vUv;

  void main() {
    vec3 c = texture2D(uScene, vUv).rgb;
    float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
    // Soft knee so a bright hillside eases into the bloom instead of popping.
    float w = clamp((luma - uThreshold) / max(uKnee, 1e-4), 0.0, 1.0);
    gl_FragColor = vec4(c * w * w, 1.0);
  }
`;

const BLUR_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform sampler2D uInput;
  uniform vec2 uDirection;   // texel-sized step
  varying vec2 vUv;

  void main() {
    // 9-tap gaussian folded into 5 bilinear samples.
    vec3 sum = texture2D(uInput, vUv).rgb * 0.227027;
    vec2 o1 = uDirection * 1.3846153846;
    vec2 o2 = uDirection * 3.2307692308;
    sum += texture2D(uInput, vUv + o1).rgb * 0.3162162162;
    sum += texture2D(uInput, vUv - o1).rgb * 0.3162162162;
    sum += texture2D(uInput, vUv + o2).rgb * 0.0702702703;
    sum += texture2D(uInput, vUv - o2).rgb * 0.0702702703;
    gl_FragColor = vec4(sum, 1.0);
  }
`;

// Contact shading is low-frequency. Evaluate the expensive geometry samples at
// half resolution, then upsample only between pixels on the same depth surface.
const CONTACT_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform highp sampler2D uDepth;
  uniform mat4 uInverseProjection;
  uniform vec2 uTexel;
  uniform float uRadius;
  varying vec2 vUv;
  vec3 viewPosition(vec2 uv){
    float depth=textureLod(uDepth,uv,0.0).r;
    vec4 view=uInverseProjection*vec4(uv*2.0-1.0,depth*2.0-1.0,1.0);
    return view.xyz/view.w;
  }
  void main(){
    vec3 center=viewPosition(vUv);
    vec3 gradient=cross(dFdx(center),dFdy(center));
    vec3 normal=gradient/max(length(gradient),1e-8);
    if(dot(normal,-center)<0.0)normal=-normal;
    if(textureLod(uDepth,vUv,0.0).r>=.999999){gl_FragColor=vec4(0.0);return;}
    float radius=clamp(uRadius/max(1.0,-center.z)/uTexel.y,2.0,40.0);
    float occlusion=0.0;
    for(int i=0;i<16;i++){
      float angle=float(i)*2.39996;
      vec2 offset=vec2(cos(angle),sin(angle))*radius*sqrt((float(i)+.5)/16.0)*uTexel;
      vec3 delta=viewPosition(clamp(vUv+offset,.001,.999))-center;
      float len=length(delta);
      occlusion+=max(0.0,dot(normal,delta/max(len,.001))-.08)
        *(1.0-smoothstep(uRadius*.4,uRadius*2.0,len));
    }
    gl_FragColor=vec4(min(.48,occlusion*.14),0.0,0.0,1.0);
  }
`;

const COMPOSITE_FRAGMENT = /* glsl */ `
  // Reconstructing kilometre-scale positions from perspective depth needs full
  // precision. mediump can round depth to 1 or overflow at the regional view,
  // producing bands and invalid normals on GPUs that use native half floats.
  precision highp float;
  uniform sampler2D uScene;
  uniform sampler2D uBloom;
  uniform float uIntensity;
  uniform float uVignette;
  uniform highp sampler2D uDepth;
  uniform mat4 uInverseProjection;
  uniform mat4 uProjection;
  uniform vec2 uTexel;
  uniform float uContact;
  uniform sampler2D uContactMap;
  uniform vec2 uEffectSize;
  uniform sampler2D uClouds;
  uniform float uCloudsOn;
  uniform float uCloudBase;
  uniform float uCameraHeight;
  uniform vec3 uViewWorldY;
  uniform float uReflections;
  varying vec2 vUv;

  vec3 viewPosition(vec2 uv) {
    float depth = textureLod(uDepth, uv, 0.0).r;
    vec4 view = uInverseProjection * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    return view.xyz / view.w;
  }
  void main() {
    vec3 scene = texture2D(uScene, vUv).rgb;
    vec3 color = scene;
    float pane=1.0-texture2D(uScene,vUv).a;
    vec3 surface=viewPosition(vUv);
    vec3 surfaceNormal=vec3(0.0,0.0,1.0);
    if(uReflections>.5){
      vec3 surfaceGradient=cross(dFdx(surface),dFdy(surface));
      surfaceNormal=surfaceGradient/max(length(surfaceGradient),1e-8);
      if(dot(surfaceNormal,-surface)<0.0)surfaceNormal=-surfaceNormal;
    }
    if(uReflections>.5&&pane>.02&&textureLod(uDepth,vUv,0.0).r<.999999){
      vec3 start=surface;
      vec3 normal=surfaceNormal;
      vec3 ray=reflect(normalize(start),normal);
      vec3 probe=start+normal*1.2+ray*2.0;
      for(int i=0;i<28;i++){
        probe+=ray*(1.5+float(i)*.8);
        vec4 clip=uProjection*vec4(probe,1.0);
        vec2 uv=clip.xy/clip.w*.5+.5;
        if(clip.w<=0.0||any(lessThan(uv,vec2(.005)))||any(greaterThan(uv,vec2(.995))))break;
        float gap=viewPosition(uv).z-probe.z;
        if(gap>0.0&&gap<2.0+float(i)*.16&&textureLod(uDepth,uv,0.0).r<.999999){
          float edge=smoothstep(0.0,.08,min(min(uv.x,1.0-uv.x),min(uv.y,1.0-uv.y)));
          float confidence=smoothstep(8.0,24.0,length(probe-start));
          color=mix(color,textureLod(uScene,uv,0.0).rgb,pane*.28*edge*confidence);
          break;
        }
      }
    }
    if (uIntensity > 0.0) color += texture2D(uBloom, vUv).rgb * uIntensity;
    // Bilateral upsampling rejects the other side of building silhouettes.
    if (uContact > .001 && textureLod(uDepth, vUv, 0.0).r < .999999) {
      vec2 pixel=vUv*uEffectSize-.5,base=floor(pixel),blend=fract(pixel);
      float occlusion=0.0,weight=0.0;
      for(int x=0;x<2;x++)for(int y=0;y<2;y++){
        vec2 uv=clamp((base+vec2(float(x),float(y))+.5)/uEffectSize,0.0,1.0);
        vec2 w=mix(1.0-blend,blend,vec2(float(x),float(y)));
        float difference=abs(viewPosition(uv).z-surface.z);
        float depthWeight=exp(-difference/max(.08,abs(surface.z)*.002));
        float tapWeight=w.x*w.y*depthWeight;
        occlusion+=textureLod(uContactMap,uv,0.0).r*tapWeight;weight+=tapWeight;
      }
      color*=1.0-occlusion/max(weight,.001)*uContact;
    }

    // A ray with both endpoints below the cloud deck cannot cross it. Most
    // close-up street pixels therefore need no cloud/depth upsampling taps.
    float surfaceHeight=uCameraHeight+dot(uViewWorldY,surface);
    bool belowClouds=uCameraHeight<uCloudBase&&surfaceHeight<uCloudBase
      &&textureLod(uDepth,vUv,0.0).r<.999999;
    if(uCloudsOn>.5&&!belowClouds){
      vec4 cloud=vec4(0.0);float weight=0.0;
      float centerDepth=textureLod(uDepth,vUv,0.0).r;
      // When looking down through the deck, small depth differences between
      // roofs below it cannot occlude clouds. Rejecting those taps punches
      // subpixel building-shaped holes through otherwise continuous clouds.
      bool clearCloudPath=uCameraHeight>uCloudBase&&surfaceHeight<uCloudBase;
      vec2 pixel=vUv*uEffectSize-.5,base=floor(pixel),blend=fract(pixel);
      for(int x=0;x<2;x++)for(int y=0;y<2;y++){
        vec2 uv=clamp((base+vec2(float(x),float(y))+.5)/uEffectSize,0.0,1.0);
        vec2 bilinear=mix(1.0-blend,blend,vec2(float(x),float(y)));
        float w=bilinear.x*bilinear.y;
        if(!clearCloudPath)w*=step(abs(textureLod(uDepth,uv,0.0).r-centerDepth),.00001);
        cloud+=textureLod(uClouds,uv,0.0)*w;weight+=w;
      }
      cloud/=max(weight,.001);
      color=color*(1.0-cloud.a)+cloud.rgb;
    }
    // A whisper of vignette to settle the frame; never enough to read as one.
    vec2 d = vUv - 0.5;
    float vig = 1.0 - uVignette * dot(d, d) * 1.35;
    color *= clamp(vig, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createPostFX(THREE, renderer) {
  const quadScene = new THREE.Scene();
  const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(quadGeometry, null);
  quad.frustumCulled = false;
  quadScene.add(quad);

  const rtOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
    depthBuffer: true,
    stencilBuffer: false,
  };

  const sceneRT = new THREE.WebGLRenderTarget(1, 1, rtOptions);
  sceneRT.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);
  const clouds = createClouds(THREE, renderer, sceneRT.depthTexture);
  const brightRT = new THREE.WebGLRenderTarget(1, 1, { ...rtOptions, depthBuffer: false });
  const blurRT = new THREE.WebGLRenderTarget(1, 1, { ...rtOptions, depthBuffer: false });
  const contactRT = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter, type: THREE.UnsignedByteType, depthBuffer: false });
  const contactMat = new THREE.ShaderMaterial({uniforms:{
    uDepth:{value:sceneRT.depthTexture},uInverseProjection:{value:new THREE.Matrix4()},
    uTexel:{value:new THREE.Vector2(1,1)},uRadius:{value:25}},
  vertexShader:QUAD_VERTEX,fragmentShader:CONTACT_FRAGMENT,depthTest:false,depthWrite:false});

  const brightMat = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: sceneRT.texture },
      uThreshold: { value: 0.72 },
      uKnee: { value: 0.45 },
    },
    vertexShader: QUAD_VERTEX,
    fragmentShader: BRIGHT_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });

  const blurMat = new THREE.ShaderMaterial({
    uniforms: {
      uInput: { value: null },
      uDirection: { value: new THREE.Vector2() },
    },
    vertexShader: QUAD_VERTEX,
    fragmentShader: BLUR_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });

  const compositeMat = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: sceneRT.texture },
      uBloom: { value: blurRT.texture },
      uIntensity: { value: 0.38 },
      uVignette: { value: 0.5 },
      uDepth: { value: sceneRT.depthTexture },
      uInverseProjection: { value: new THREE.Matrix4() },
      uProjection: { value: new THREE.Matrix4() },
      uReflections: { value: 1 },
      uTexel: { value: new THREE.Vector2(1, 1) },
      uContact: { value: 0 },
      uContactMap: { value: contactRT.texture },
      uEffectSize: { value: new THREE.Vector2(1,1) },
      uClouds: { value: clouds.texture }, uCloudsOn: { value: 0 },
      uCloudBase: { value: 1600 }, uCameraHeight: { value: 0 },
      uViewWorldY: { value: new THREE.Vector3(0,1,0) },
    },
    vertexShader: QUAD_VERTEX,
    fragmentShader: COMPOSITE_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });

  let width = 1;
  let height = 1;
  let bloomWidth = 1;
  let bloomHeight = 1;
  // Two Gaussian blurs convolve to another Gaussian whose variance is the
  // sum of theirs. The former 1.0 + 1.7 pass pairs are therefore represented
  // by one pair at sqrt(1^2 + 1.7^2), preserving the same soft radius while
  // removing two full bloom-buffer draws and their memory traffic.
  const combinedBlurScale = Math.hypot(1, 1.7);

  function draw(material, target) {
    quad.material = material;
    renderer.setRenderTarget(target || null);
    renderer.render(quadScene, quadCamera);
  }

  return {
    get renderTarget() {
      return sceneRT;
    },

    setSize(w, h, pixelRatio) {
      width = Math.max(1, Math.floor(w * pixelRatio));
      height = Math.max(1, Math.floor(h * pixelRatio));
      // Bloom at quarter resolution: cheap, and a wide soft glow is exactly
      // what a low-resolution blur produces anyway.
      bloomWidth = Math.max(1, Math.floor(width / 4));
      bloomHeight = Math.max(1, Math.floor(height / 4));
      sceneRT.setSize(width, height);
      clouds.setSize(width,height);
      contactRT.setSize(Math.max(1,Math.floor(width/2)),Math.max(1,Math.floor(height/2)));
      compositeMat.uniforms.uEffectSize.value.set(contactRT.width,contactRT.height);
      brightRT.setSize(bloomWidth, bloomHeight);
      blurRT.setSize(bloomWidth, bloomHeight);
    },

    setPresentation(camera, enabled, amount) {
      const u = compositeMat.uniforms;
      u.uInverseProjection.value.copy(camera.projectionMatrixInverse);
      u.uProjection.value.copy(camera.projectionMatrix);
      u.uTexel.value.set(1 / width, 1 / height);
      u.uContact.value = enabled ? 1 : 0;
      contactMat.uniforms.uInverseProjection.value.copy(camera.projectionMatrixInverse);
      contactMat.uniforms.uTexel.value.set(1/width,1/height);
      contactMat.uniforms.uRadius.value = 22 + amount * 350;
    },

    setIntensity(value) {
      compositeMat.uniforms.uIntensity.value = value;
    },

    renderClouds(camera,sky,lighting,quality) {
      const u=compositeMat.uniforms,e=camera.matrixWorld.elements;
      u.uReflections.value=quality==='performance'?0:1;
      u.uCloudBase.value=lighting.uCloudBase.value;
      u.uCameraHeight.value=camera.position.y;
      u.uViewWorldY.value.set(e[1],e[5],e[9]);
      const on=lighting.uCloudCoverage.value>.01;
      compositeMat.uniforms.uCloudsOn.value=on?1:0;
      if(on)clouds.render(camera,sky,lighting,quality);
    },

    setVignette(value) {
      compositeMat.uniforms.uVignette.value = value;
    },

    setThreshold(value) {
      brightMat.uniforms.uThreshold.value = value;
    },

    /** Run bright-pass + blur + composite over an already-rendered sceneRT. */
    composite(lightweight = false) {
      if (lightweight) {
        const u = compositeMat.uniforms, intensity = u.uIntensity.value, contact = u.uContact.value;
        const reflections=u.uReflections.value;
        u.uIntensity.value = 0; u.uContact.value = 0;u.uReflections.value=0;
        draw(compositeMat, null);
        u.uIntensity.value = intensity; u.uContact.value = contact;u.uReflections.value=reflections;
        return;
      }
      if(compositeMat.uniforms.uContact.value>.001)draw(contactMat,contactRT);
      if (compositeMat.uniforms.uIntensity.value === 0) {
        draw(compositeMat, null);
        return;
      }
      draw(brightMat, brightRT);

      blurMat.uniforms.uInput.value = brightRT.texture;
      blurMat.uniforms.uDirection.value.set(combinedBlurScale / bloomWidth, 0);
      draw(blurMat, blurRT);

      blurMat.uniforms.uInput.value = blurRT.texture;
      blurMat.uniforms.uDirection.value.set(0, combinedBlurScale / bloomHeight);
      draw(blurMat, brightRT);

      compositeMat.uniforms.uBloom.value = brightRT.texture;
      draw(compositeMat, null);
    },

    dispose() {
      clouds.dispose();
      sceneRT.dispose();
      brightRT.dispose();
      blurRT.dispose();
      contactRT.dispose();contactMat.dispose();
      quadGeometry.dispose();
      brightMat.dispose();
      blurMat.dispose();
      compositeMat.dispose();
    },
  };
}
