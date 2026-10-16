// Read-only world-unit camera endpoints for high-resolution and remote views.
// They never become source camera records or feed the physical water owner.
const finite=n=>Number.isFinite(n)&&Math.abs(n)<=1e9;
function triple(value){if(!Array.isArray(value)||value.length!==3||!value.every(finite))throw new TypeError('Invalid camera display vector');return value.map(n=>n===0?0:n);}
export function readNativeCamera(value){
 if(value===null)return null;
 if(!value||!finite(value.fov)||value.fov<=0||value.fov>=180)throw new TypeError('Invalid camera display lens');
 const position=triple(value.position),target=triple(value.target),up=triple(value.up);
 if(Math.hypot(...position.map((v,i)=>v-target[i]))<1e-9||Math.hypot(...up)<1e-9)throw new TypeError('Degenerate camera display');
 const [dx,dy,dz]=position.map((v,i)=>v-target[i]),[ux,uy,uz]=up;
 if(Math.hypot(dy*uz-dz*uy,dz*ux-dx*uz,dx*uy-dy*ux)<1e-9)throw new TypeError('Collinear camera display');
 return {position,target,up,fov:value.fov};
}
export function captureNativeCamera(camera,scale){
 return readNativeCamera({position:camera.eyeNative.map(v=>v*scale),target:camera.targetNative.map(v=>v*scale),up:camera.up,fov:camera.fovDegrees});
}
export function nativeCameraFrame(value,{orbit=0,zoom=8,pitch=.22}={}){
 const camera=readNativeCamera(value),[x,y,z]=camera.position,[tx,ty,tz]=camera.target;
 // Mouse orbit/zoom remain explicit presentation adjustments around the source view.
 const dx=x-tx,dz=z-tz,k=Math.max(.5,Math.min(3,zoom/8)),c=Math.cos(orbit),s=Math.sin(orbit);
 return {position:{x:tx+(dx*c+dz*s)*k,y:ty+(y-ty)*k+(pitch-.22)*Math.hypot(dx,dz),z:tz+(dz*c-dx*s)*k},
  target:{x:tx,y:ty,z:tz},up:camera.up,fov:camera.fov};
}
