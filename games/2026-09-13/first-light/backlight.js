// Backlight, shared by every material that faces the low sun: the direction to the sun and how
// strongly a surface between the eye and the sun goes to silhouette (1 at first light, 0 by
// mid-morning). Foliage (botany.js) and the far bank (land-materials.js) read the same two
// uniforms, so the skyline, its trees and the ground under them all darken together.
import * as T from './vendor/three.module.js';
export const backlight={sunDir:{value:new T.Vector3(0,1,0)},amount:{value:0}};
export function setBacklight(dir,amount){backlight.sunDir.value.set(dir.x,dir.y,dir.z).normalize();backlight.amount.value=Math.max(0,Math.min(1,amount));}
// the GLSL term: fades the albedo toward a dark blue-teal tenth (air between the eye and a distant tree is never black) for fragments that sit between the eye and the sun
export const BACKLIT_GLSL=`{vec3 sv=normalize((viewMatrix*vec4(backlitSunDir,0.)).xyz);float toward=dot(normalize(-vViewPosition),sv);float k=smoothstep(.1,.85,toward)*backlitAmount;diffuseColor.rgb*=mix(vec3(1.),vec3(.26,.36,.44),k);}`;
export const BACKLIT_UNIFORMS='uniform vec3 backlitSunDir;uniform float backlitAmount;';
