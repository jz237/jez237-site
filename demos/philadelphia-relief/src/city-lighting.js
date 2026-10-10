// Local shadow rendering retains the building vertex shader: terrain exaggeration,
// streamed tier growth, historical filtering and landmark heights stay aligned.
export const CLOUD_NOISE = /* glsl */ `
float cityHash(vec3 p) {
  p = fract(p * .1031); p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float cityNoise(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(cityHash(i),cityHash(i+vec3(1,0,0)),f.x),
    mix(cityHash(i+vec3(0,1,0)),cityHash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(cityHash(i+vec3(0,0,1)),cityHash(i+vec3(1,0,1)),f.x),
    mix(cityHash(i+vec3(0,1,1)),cityHash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float cloudField(vec3 p, float time, float coverage, float base) {
  vec3 q=(p-vec3(time*9.0,base,time*3.5))/700.0;
  float shape=cityNoise(q*vec3(1.0,.65,1.0))*.62
    +cityNoise(q*2.07+17.0)*.27+cityNoise(q*4.13+37.0)*.11;
  float h=(p.y-base)/850.0;
  float envelope=smoothstep(0.0,.16,h)*(1.0-smoothstep(.55,1.0,h));
  float weather=cityNoise(vec3(q.x*.32,0.0,q.z*.32));
  float threshold=.72-coverage*.32+(1.0-weather)*.16;
  return smoothstep(threshold,threshold+.16,shape)*envelope;
}
`;

export const CITY_LIGHT_GLSL = /* glsl */ `
uniform sampler2D uCityShadow;
uniform mat4 uCityShadowMatrix;
uniform float uCityShadowOn;
uniform vec2 uCityShadowTexel;
uniform float uCityTime;
uniform float uCloudCoverage;
uniform float uCloudBase;
${CLOUD_NOISE}
float citySunVisibility(vec3 p, vec3 n, vec3 sun) {
  float visibility=1.0;
  if(uCityShadowOn>.001) {
    vec4 sc=uCityShadowMatrix*vec4(p+n*.75,1.0);
    vec3 q=sc.xyz/sc.w;
    if(all(greaterThan(q,vec3(.001)))&&all(lessThan(q,vec3(.999)))) {
      float sum=0.0;
      float bias=.00012+.00035*(1.0-max(0.0,dot(n,sun)));
      for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++) {
        float depth=texture2D(uCityShadow,q.xy+vec2(float(x),float(y))*uCityShadowTexel).r;
        sum+=step(q.z-bias,depth);
      }
      float edge=smoothstep(0.0,.08,min(min(q.x,1.0-q.x),min(q.y,1.0-q.y)));
      visibility=mix(1.0,sum/9.0,edge*uCityShadowOn);
    }
  }
  if(uCloudCoverage>.01&&sun.y>.06&&p.y<uCloudBase) {
    vec3 hit=p+sun*((uCloudBase+350.0-p.y)/sun.y);
    visibility*=1.0-cloudField(hit,uCityTime,uCloudCoverage,uCloudBase)*.48;
  }
  return visibility;
}
`;

const DEPTH_FRAGMENT = /* glsl */ `
uniform vec4 uLocalBounds; uniform float uLocalClip; uniform float uEraYear;
varying vec3 vWorld; varying float vYear;
#ifdef ARCHITECTURAL_STUDY
uniform vec4 uStudyBounds;
#endif
void main() {
  if(uLocalClip>.5&&vWorld.x>uLocalBounds.x&&vWorld.x<uLocalBounds.z
    &&vWorld.z>uLocalBounds.y&&vWorld.z<uLocalBounds.w) discard;
  #ifdef ARCHITECTURAL_STUDY
  if(vWorld.x>uStudyBounds.x&&vWorld.x<uStudyBounds.z
    &&vWorld.z>uStudyBounds.y&&vWorld.z<uStudyBounds.w) discard;
  #endif
  if(uEraYear<9000.0&&(vYear<1.0||vYear>uEraYear)) discard;
  gl_FragColor=vec4(1.0);
}`;

export function createCityUniforms(THREE) {
  return {
    uCityShadow: {value:null}, uCityShadowMatrix: {value:new THREE.Matrix4()},
    uCityShadowOn: {value:0}, uCityShadowTexel: {value:new THREE.Vector2(1/2048,1/2048)},
    uCityTime: {value:0}, uCloudCoverage: {value:0}, uCloudBase: {value:1600},
  };
}

export function createCityLighting(THREE, renderer) {
  const uniforms=createCityUniforms(THREE);
  const target=new THREE.WebGLRenderTarget(2048,2048,{minFilter:THREE.NearestFilter,
    magFilter:THREE.NearestFilter,depthBuffer:true,stencilBuffer:false});
  target.depthTexture=new THREE.DepthTexture(2048,2048,THREE.UnsignedIntType);
  uniforms.uCityShadow.value=target.depthTexture;
  const camera=new THREE.OrthographicCamera(-1600,1600,1600,-1600,1,16000);
  const scene=new THREE.Scene(), entries=new Map();
  const bias=new THREE.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
  const focus=new THREE.Vector3(), previous=new THREE.Vector3(Infinity,0,0);
  const oldColor=new THREE.Color(); let age=1, size=2048;
  return {
    uniforms,
    update({group, focusX,focusZ,ground,exaggeration,sunDir,distance,state,quality,dt,time,miniature}) {
      uniforms.uCityTime.value=time;
      uniforms.uCloudCoverage.value=state.lightweight||state.era!=='present'||state.compareMode!=='off'
        ||!group?0:state.cloudCoverage;
      uniforms.uCloudBase.value=1600+miniature*6000;
      const enabled=!!group?.visible&&state.cityShadows&&!state.lightweight
        &&distance<16000&&sunDir.y>.04&&state.compareMode==='off';
      uniforms.uCityShadowOn.value=enabled?1:0;
      if(!enabled)return;
      age+=dt;
      focus.set(focusX,ground*exaggeration+120,focusZ);
      if(age<.1&&focus.distanceToSquared(previous)<1600)return;
      age=0;previous.copy(focus);
      const extent=Math.min(5500,Math.max(650,distance*.72));
      const nextSize=quality==='cinematic'?4096:quality==='performance'?1024:2048;
      if(size!==nextSize){size=nextSize;
    target.setSize(size,size);
    uniforms.uCityShadowTexel.value.set(1/size,1/size);
    }
      camera.left=-extent;camera.right=extent;camera.top=extent;camera.bottom=-extent;
      camera.position.copy(focus).addScaledVector(sunDir,7000);camera.lookAt(focus);
      camera.updateProjectionMatrix();camera.updateMatrixWorld();
      // Snap the light-space origin to texels to avoid crawling edges while panning.
      const texel=2*extent/size, origin=new THREE.Vector3().applyMatrix4(camera.matrixWorldInverse);
      camera.position.addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),
        origin.x-Math.round(origin.x/texel)*texel);
      camera.position.addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1),
        origin.y-Math.round(origin.y/texel)*texel);
      camera.updateMatrixWorld();
      uniforms.uCityShadowMatrix.value.copy(bias).multiply(camera.projectionMatrix)
        .multiply(camera.matrixWorldInverse);

      const seen=new Set();
      group.traverse(source=>{
        if(!source.isMesh||!source.geometry.attributes.aGround||!source.material.uniforms?.uGrow)return;
        seen.add(source); let entry=entries.get(source);
        const defines=JSON.stringify(source.material.defines);
        if(!entry){
          const material=new THREE.ShaderMaterial({vertexShader:source.material.vertexShader,
            fragmentShader:DEPTH_FRAGMENT,uniforms:source.material.uniforms,
            defines:{...source.material.defines},side:THREE.DoubleSide});
          const mesh=new THREE.Mesh(source.geometry,material);mesh.frustumCulled=source.frustumCulled;
          scene.add(mesh);entry={mesh,defines};entries.set(source,entry);
        }
        if(entry.defines!==defines){entry.mesh.material.defines={...source.material.defines};
    entry.mesh.material.needsUpdate=true;
    entry.defines=defines;
    }
        entry.mesh.geometry=source.geometry;entry.mesh.visible=source.visible;
      });
      for(const [source,entry] of entries)if(!seen.has(source)){scene.remove(entry.mesh);
    entry.mesh.material.dispose();
    entries.delete(source);
    }
      const prior=renderer.getRenderTarget(), alpha=renderer.getClearAlpha();renderer.getClearColor(oldColor);
      renderer.setRenderTarget(target);
    renderer.setClearColor(0xffffff,1);
    renderer.clear();
    renderer.render(scene,camera);

      renderer.setClearColor(oldColor,alpha);renderer.setRenderTarget(prior);
    },
    dispose(){for(const e of entries.values())e.mesh.material.dispose();entries.clear();target.dispose();},
  };
}
