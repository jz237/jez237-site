import * as T from './vendor/three.module.js';

// One mipmapped panorama serves the visible sky, water and environment lighting.
// The procedural atmosphere remains available if the optional image cannot load.
export const panoramaUniforms={skyPanorama:{value:null},panoramaReady:{value:0},skyWarmth:{value:.25}};
try {
 const texture=await new T.TextureLoader().loadAsync(new URL('./assets/sky/coastal-clouds-v2.png',import.meta.url).href);
 texture.colorSpace=T.SRGBColorSpace;texture.wrapS=T.RepeatWrapping;
 texture.minFilter=T.LinearMipmapLinearFilter;texture.anisotropy=4;
 panoramaUniforms.skyPanorama.value=texture;panoramaUniforms.panoramaReady.value=1;
} catch { console.warn('Cloud panorama unavailable; using procedural atmosphere.'); }

export const panoramaGLSL=`
uniform sampler2D skyPanorama;uniform float panoramaReady,skyWarmth;
vec3 panoramaRadiance(vec3 ray,vec3 sun,vec3 horizon,vec3 zenith,float night,float storm){
 vec3 d=normalize(ray);float elevation=asin(clamp(d.y,-1.,1.));
 float azimuth=atan(d.x,d.z)-atan(sun.x,sun.z);
 vec2 uv=vec2(fract(.5+azimuth/6.2831853),clamp(.47+(elevation+.25-asin(clamp(sun.y,-1.,1.)))/3.14159265,.01,.99));
 // Extremely slow coherent drift: one continuous sky, including its reflection.
 uv.x+=sin(weatherTime*.002)*.002;
 vec3 photographic=texture2D(skyPanorama,uv).rgb;
 float pole=smoothstep(.92,1.,abs(d.y));
 photographic=mix(photographic,zenith,pole);
 // Golden light belongs to Sunset Bay; daylight and night retain venue identity.
 vec3 neutral=photographic*vec3(.79,.92,1.12);
 vec3 color=mix(neutral,photographic*vec3(1.14,1.02,.89),skyWarmth)*1.18;
 float luminance=dot(color,vec3(.2126,.7152,.0722));
 color=mix(color,vec3(.27,.34,.41)*(.32+luminance*.75),storm*.67);
 color=mix(color,color*vec3(.20,.29,.48),night*.94);
 return mix(mix(horizon,zenith,pow(max(0.,d.y),.4)),color,panoramaReady);
}`;
