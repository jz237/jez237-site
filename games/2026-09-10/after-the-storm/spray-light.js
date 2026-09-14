import {weatherUniforms,cloudGLSL} from './weather-light.js';
export const sprayUniforms=weatherUniforms;
// Forward scattering catches the sun through a plume; cloud cover and a soft
// sky fill keep the same droplets readable when viewed from the shadow side.
export const sprayLightingGLSL=cloudGLSL+`
vec3 litSpray(vec3 p){vec3 view=normalize(cameraPosition-p),sun=normalize(weatherSun);float forward=pow(max(0.,dot(-view,sun)),10.);float glint=pow(max(0.,dot(view,sun)),48.);float light=cloudVisibility(p);return mix(vec3(.28,.39,.43),vec3(.69,.82,.84),light)+vec3(1.,.83,.57)*light*(forward*.8+glint*.35);}`;
export const sprayVertex=`attribute float alpha,size;varying float a;varying vec3 sprayP;void main(){a=alpha;sprayP=position;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(size*300./max(1.,-p.z),1.,40.);}`;
export const sprayFragment=sprayLightingGLSL+`varying float a;varying vec3 sprayP;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float density=exp(-r*r*3.)*(1.-r);gl_FragColor=vec4(litSpray(sprayP),a*density);#include <tonemapping_fragment>
#include <colorspace_fragment>}`.replace(';#include',';\n#include');
