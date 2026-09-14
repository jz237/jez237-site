// The lake renderer: bed terrain, the water mesh with a full-resolution refraction target (with depth)
// and a mirrored-camera planar reflection, the foam and ripple atlases, and the shared uniforms every
// water-aware shader reads. Structure follows After the Storm's ocean.js; the tuning is a reservoir's.
import * as T from './vendor/three.module.js';
import {lakeVertex} from './lake-vertex.js';
import {lakeFragment} from './lake-fragment.js';
import {lakeUnderFragment} from './lake-under-fragment.js';
import {waterDetail} from './water-detail.js';
import {waterProfile} from './water-profile.js';
import {makeFoamField} from './foam-field.js';
import {wakeGLSL,wakeTrail} from './wake-field.js';
import {swellGLSL} from './lake-waves.js';
import {impactWaves,impactGLSL} from './surface-impulses.js';
import {rippleGLSL,makeRippleField} from './ripple-field.js';
import {configureTerrainMaterial,shoreline,waterLevel,lakeLighting} from './land-materials.js';
import {TERRAIN_SPAN} from './bathymetry.js';
export const shared={seaLevel:waterLevel,time:{value:0},wind:{value:0},windAmp:{value:0},windDir:{value:0},rain:{value:0},focus:{value:new T.Vector4(0,0,0,0)},terrainMap:{value:waterDetail},terrainSpan:{value:TERRAIN_SPAN}};
export const skyColors={night:{value:0},daylight:{value:1},skyHorizon:{value:new T.Color(.66,.77,.86)},skyZenith:{value:new T.Color(.16,.36,.72)},sun:{value:new T.Vector3(0,1,0)},sunColor:{value:new T.Color(1,.9,.7)},fogColor:{value:new T.Color(.7,.78,.84)},fogDensity:{value:.0016}};
export const lakeCommon=`uniform float seaLevel,time,wind,windAmp,rain;uniform vec4 focus;uniform sampler2D terrainMap;uniform float terrainSpan;
${impactGLSL}
${wakeGLSL}
${swellGLSL}
${rippleGLSL}
float fetchAt(vec2 p){return clamp(texture2D(terrainMap,clamp(p/terrainSpan+.5,vec2(0.),vec2(1.))).b*255./110.,0.,1.);}
float height(vec2 p){float amp=windAmp*fetchAt(p);return seaLevel+waveSurface(p,amp).x+impactHeight(p)+wakeHeight(p)+rippleHeight(p);}`;
export function makeTerrainTexture(bathy){const tex=new T.DataTexture(bathy.data,bathy.res,bathy.res,T.RGBAFormat);tex.minFilter=tex.magFilter=T.LinearFilter;tex.wrapS=tex.wrapT=T.ClampToEdgeWrapping;tex.generateMipmaps=false;tex.needsUpdate=true;return tex;}
export function makeLakeBed(scene,bathy,segments=400){
 const geo=new T.PlaneGeometry(bathy.span,bathy.span,segments,segments);geo.rotateX(-Math.PI/2);
 const p=geo.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,bathy.height(p.getX(i),p.getZ(i)));geo.computeVertexNormals();
 const mat=new T.MeshStandardMaterial({color:0xffffff,roughness:.93});configureTerrainMaterial(mat,{waterDetail});
 const mesh=new T.Mesh(geo,mat);mesh.receiveShadow=true;mesh.castShadow=false;scene.add(mesh);return mesh;
}
function waterGeometry(segments){const geo=new T.PlaneGeometry(1500,1500,segments,segments);geo.rotateX(-Math.PI/2);const gp=geo.attributes.position;for(let i=0;i<gp.count;i++){const x=gp.getX(i)/750,z=gp.getZ(i)/750;gp.setX(i,Math.sign(x)*(Math.abs(x)*60+Math.pow(Math.abs(x),4)*690));gp.setZ(i,Math.sign(z)*(Math.abs(z)*60+Math.pow(Math.abs(z),4)*690));}return geo;}
const SEGMENTS={high:288,medium:208,low:144,saver:144},REFLECT={high:1024,medium:640,low:384,saver:384},SKIP={high:1,medium:2,low:3,saver:3};
export function makeLake(renderer,scene,camera,bathy,quality='high'){
 const size=new T.Vector2();renderer.getDrawingBufferSize(size);const floating=renderer.extensions.has('EXT_color_buffer_float');
 const refract=new T.WebGLRenderTarget(size.x,size.y,{depthBuffer:true,type:floating?T.HalfFloatType:T.UnsignedByteType});refract.depthTexture=new T.DepthTexture(size.x,size.y);
 const reflect=new T.WebGLRenderTarget(REFLECT[quality],REFLECT[quality],{depthBuffer:true,type:floating?T.HalfFloatType:T.UnsignedByteType,generateMipmaps:true,minFilter:T.LinearMipmapLinearFilter});
 const mirror=new T.PerspectiveCamera();
 shared.terrainMap.value=makeTerrainTexture(bathy);
 const ripple=makeRippleField(renderer,quality);
 const profile=waterProfile('lake');
 const uniforms={...shared,...ripple.uniforms,underMirror:{value:0},waterScatter:{value:new T.Vector3(...profile.scatter)},waterAbsorption:{value:new T.Vector3(...profile.absorption)},clarity:lakeLighting.clarity,polarized:{value:0},viewportOrigin:{value:new T.Vector2()},viewportSize:{value:size.clone()},night:skyColors.night,skyHorizon:skyColors.skyHorizon,skyZenith:skyColors.skyZenith,sun:skyColors.sun,sunColor:skyColors.sunColor,fogColor:skyColors.fogColor,fogDensity:skyColors.fogDensity,impactWaves:{value:impactWaves.map(w=>new T.Vector4(w.x,w.z,w.time,w.amplitude))},detailMap:{value:waterDetail},wakeHeading:{value:new Float32Array(64)},refraction:{value:refract.texture},reflection:{value:reflect.texture},depthMap:{value:refract.depthTexture},mirrorMatrix:{value:new T.Matrix4()},eye:{value:camera.position},near:{value:camera.near},far:{value:camera.far},wake:{value:Array.from({length:64},()=>new T.Vector4(10000,10000,0,0))}};
 const mat=new T.ShaderMaterial({uniforms,vertexShader:lakeCommon+lakeVertex,fragmentShader:lakeCommon+lakeFragment});
 const matUnder=new T.ShaderMaterial({uniforms,vertexShader:lakeCommon+lakeVertex,fragmentShader:lakeCommon+lakeUnderFragment,side:T.BackSide});
 const water=new T.Mesh(waterGeometry(SEGMENTS[quality]),mat);water.frustumCulled=false;water.userData.isWater=true;scene.add(water);
 let frame=0;const clip=new T.Plane(new T.Vector3(0,1,0),.05),clipUnder=new T.Plane(new T.Vector3(0,-1,0),.05);
 const foam=makeFoamField(renderer,lakeCommon,uniforms);mat.uniforms.foamMap={value:foam.texture};mat.uniforms.foamCenter=foam.center;mat.uniforms.foamSpan=foam.span;
 shoreline.shoreCenter.value=foam.center.value;shoreline.shoreSpan.value=foam.span.value;
 const target=new T.Vector3();
 return {mesh:water,mat,matUnder,refract,reflect,ripple,quality,underwater:false,hooks:{setFog:null},
  setProfile(p){mat.uniforms.waterScatter.value.fromArray(p.scatter);mat.uniforms.waterAbsorption.value.fromArray(p.absorption);if(p.clarity)lakeLighting.clarity.value=p.clarity;},
  setQuality(q){if(q!==this.quality){water.geometry.dispose();water.geometry=waterGeometry(SEGMENTS[q]);reflect.setSize(REFLECT[q],REFLECT[q]);ripple.setQuality(q);}this.quality=q;},
  setPolarized(v){mat.uniforms.polarized.value=v;},
  addRipple(x,z,radius,amplitude){ripple.addImpulse(x,z,radius,amplitude);},
  update(dt,x,z){shared.focus.value.set(x,z,0,0);ripple.update(dt,x,z);foam.update(dt,x,z,this.quality==='saver'?'low':this.quality,240);mat.uniforms.foamMap.value=foam.texture;shoreline.shoreMap.value=foam.texture;shoreline.shoreSpan.value=foam.span.value;
   wakeTrail.forEach((w,i)=>{mat.uniforms.wake.value[i].set(w.x,w.z,w.time,w.power);mat.uniforms.wakeHeading.value[i]=w.heading;});
   impactWaves.forEach((w,i)=>mat.uniforms.impactWaves.value[i].set(w.x,w.z,w.time,w.amplitude));},
  resize(){renderer.getDrawingBufferSize(size);refract.setSize(size.x,size.y);},
  render(viewCamera=camera,outTarget=null){
   lakeLighting.time.value=shared.time.value;lakeLighting.wind.value=shared.wind.value;
   mat.uniforms.eye.value=viewCamera.position;mat.uniforms.near.value=viewCamera.near;mat.uniforms.far.value=viewCamera.far;
   // hysteresis around the waterline so a bobbing eye does not flicker between the two surface shaders
   const eyeY=viewCamera.position.y;if(this.underwater){if(eyeY>waterLevel.value-.005)this.underwater=false;}else if(eyeY<waterLevel.value-.04)this.underwater=true;
   water.material=this.underwater?matUnder:mat;
   const hidden=scene.children.filter(o=>o.userData.skipRefraction&&o.visible);for(const o of hidden)o.visible=false;
   if(this.underwater){
    // from below: the above world through the window (air fog), the underwater world mirrored (water fog) on High
    this.hooks.setFog?.('air');water.visible=false;renderer.setRenderTarget(refract);renderer.render(scene,viewCamera);
    if(this.quality==='high'){this.hooks.setFog?.('water');mirror.copy(viewCamera);mirror.position.y=2*waterLevel.value-viewCamera.position.y;clipUnder.constant=waterLevel.value+.05;viewCamera.getWorldDirection(target);target.add(viewCamera.position);target.y=2*waterLevel.value-target.y;mirror.up.set(0,-1,0);mirror.lookAt(target);mirror.updateMatrixWorld();mat.uniforms.mirrorMatrix.value.multiplyMatrices(mirror.projectionMatrix,mirror.matrixWorldInverse);renderer.clippingPlanes=[clipUnder];renderer.setRenderTarget(reflect);renderer.render(scene,mirror);renderer.clippingPlanes=[];uniforms.underMirror.value=1;}else uniforms.underMirror.value=0;
    this.hooks.setFog?.('water');water.visible=true;for(const o of hidden)o.visible=true;
    renderer.setRenderTarget(outTarget);renderer.getSize(size);renderer.setViewport(0,0,size.x,size.y);mat.uniforms.viewportOrigin.value.set(0,0);renderer.getDrawingBufferSize(mat.uniforms.viewportSize.value);renderer.render(scene,viewCamera);return;
   }
   this.hooks.setFog?.('air');
   water.visible=false;renderer.setRenderTarget(refract);renderer.render(scene,viewCamera);
   if(frame++%SKIP[this.quality]===0){
    const farOff=[];if(this.quality!=='high')scene.traverse(o=>{if(o.userData.skipReflection&&o.visible)farOff.push(o);});for(const o of farOff)o.visible=false;
    mirror.copy(viewCamera);mirror.position.y=2*waterLevel.value-viewCamera.position.y;clip.constant=.05-waterLevel.value;viewCamera.getWorldDirection(target);target.add(viewCamera.position);target.y=2*waterLevel.value-target.y;mirror.up.set(0,-1,0);mirror.lookAt(target);mirror.updateMatrixWorld();
    mat.uniforms.mirrorMatrix.value.multiplyMatrices(mirror.projectionMatrix,mirror.matrixWorldInverse);renderer.clippingPlanes=[clip];renderer.setRenderTarget(reflect);renderer.render(scene,mirror);renderer.clippingPlanes=[];
    for(const o of farOff)o.visible=true;
   }
   water.visible=true;for(const o of hidden)o.visible=true;
   renderer.setRenderTarget(outTarget);renderer.getSize(size);renderer.setViewport(0,0,size.x,size.y);mat.uniforms.viewportOrigin.value.set(0,0);renderer.getDrawingBufferSize(mat.uniforms.viewportSize.value);
   renderer.render(scene,viewCamera);
  },
  dispose(){foam.dispose();ripple.dispose();refract.dispose();reflect.dispose();}};
}
