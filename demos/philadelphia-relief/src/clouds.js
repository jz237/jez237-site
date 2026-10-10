import { CLOUD_NOISE } from './city-lighting.js?v=philly-2026100901';

const VERTEX=/* glsl */ `varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`;
const FRAGMENT=/* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uDepth;
uniform mat4 uInverseProjection,uCameraWorld;
uniform vec3 uCamera,uSun,uSunColor,uSkyColor;
uniform float uTime,uCoverage,uBase,uSteps,uNight;
${CLOUD_NOISE}
void main(){
  gl_FragColor=vec4(0.0);
  if(uCoverage<.01)return;
  vec4 view=uInverseProjection*vec4(vUv*2.0-1.0,1.0,1.0);
  vec3 ray=normalize(mat3(uCameraWorld)*(view.xyz/view.w));
  if(abs(ray.y)<.005)return;
  float ta=(uBase-uCamera.y)/ray.y,tb=(uBase+850.0-uCamera.y)/ray.y;
  float start=max(0.0,min(ta,tb)),end=min(42000.0,max(ta,tb));
  float depth=texture2D(uDepth,vUv).r;
  if(depth<.999999){vec4 p=uInverseProjection*vec4(vUv*2.0-1.0,depth*2.0-1.0,1.0);
    end=min(end,length(p.xyz/p.w));
    }
  if(end<=start)return;
  float stepSize=(end-start)/uSteps;
  // Fixed pixel jitter breaks bands; no temporal noise or sparkling cloud edges.
  float jitter=cityHash(vec3(floor(gl_FragCoord.xy),.73));
  float transmission=1.0;vec3 scattering=vec3(0.0);
  float towardSun=max(0.0,dot(ray,uSun));
  float phase=.65+.45*pow(towardSun,6.0)+1.4*pow(towardSun,48.0);
  for(int i=0;i<64;i++){
    if(float(i)>=uSteps||transmission<.015)break;
    vec3 p=uCamera+ray*(start+(float(i)+jitter)*stepSize);
    float density=cloudField(p,uTime,uCoverage,uBase);
    if(density<.003)continue;
    float lightDepth=cloudField(p+uSun*110.0,uTime,uCoverage,uBase)*110.0
      +cloudField(p+uSun*300.0,uTime,uCoverage,uBase)*190.0
      +cloudField(p+uSun*600.0,uTime,uCoverage,uBase)*300.0;
    float light=exp(-lightDepth*.007);
    float height=clamp((p.y-uBase)/850.0,0.0,1.0);
    vec3 ambient=mix(vec3(.22,.29,.40),vec3(.58,.66,.76),height);
    vec3 incident=ambient*mix(1.0,.09,uNight)
      +uSunColor*light*phase*mix(1.15,.025,uNight);
    float opacity=1.0-exp(-density*stepSize*.009);
    scattering+=transmission*opacity*incident;
    transmission*=1.0-opacity;
  }
  float alpha=1.0-transmission;
  float haze=1.0-exp(-start/45000.0);
  vec3 color=scattering/max(alpha,.0001);
  color=mix(color,uSkyColor,haze*.5);
  gl_FragColor=vec4(color,alpha*(1.0-smoothstep(25000.0,42000.0,start)));
}`;

export function createClouds(THREE,renderer,depthTexture){
  const target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:false,
    minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
  const uniforms={uDepth:{value:depthTexture},uInverseProjection:{value:new THREE.Matrix4()},
    uCameraWorld:{value:new THREE.Matrix4()},uCamera:{value:new THREE.Vector3()},
    uSun:{value:new THREE.Vector3()},uSunColor:{value:new THREE.Vector3()},
    uSkyColor:{value:new THREE.Vector3()},
    uTime:{value:0},uCoverage:{value:0},uBase:{value:1600},uSteps:{value:24},uNight:{value:0}};
  const material=new THREE.ShaderMaterial({vertexShader:VERTEX,fragmentShader:FRAGMENT,uniforms,
    depthWrite:false,depthTest:false});
  const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material),scene=new THREE.Scene();
  scene.add(quad);const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  return {
    texture:target.texture,
    setSize(w,h){target.setSize(Math.max(1,Math.floor(w/2)),Math.max(1,Math.floor(h/2)));},
    render(view,sky,lighting,quality){
      uniforms.uInverseProjection.value.copy(view.projectionMatrixInverse);
      uniforms.uCameraWorld.value.copy(view.matrixWorld);uniforms.uCamera.value.copy(view.position);
      uniforms.uSun.value.copy(sky.uSunDir.value);uniforms.uSunColor.value.copy(sky.uSunColor.value);
      uniforms.uSkyColor.value.copy(sky.uHorizon.value);uniforms.uNight.value=sky.uNight.value;
      uniforms.uTime.value=lighting.uCityTime.value;uniforms.uCoverage.value=lighting.uCloudCoverage.value;
      uniforms.uBase.value=lighting.uCloudBase.value;
      uniforms.uSteps.value=quality==='cinematic'?64:quality==='performance'?24:48;
      const prior=renderer.getRenderTarget();renderer.setRenderTarget(target);
      renderer.render(scene,camera);renderer.setRenderTarget(prior);
    },
    dispose(){target.dispose();quad.geometry.dispose();material.dispose();},
  };
}
