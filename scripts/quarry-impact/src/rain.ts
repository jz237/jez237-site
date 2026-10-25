import * as T from 'three';
/** Falling rain: short streaks in a box that follows the camera, wrapping as they fall.
 * One draw call; positions update on the CPU (cheap at this count). Hidden unless active. */
export const RAIN_DROPS=4500;
const SIZE={x:56,y:26,z:56},SPEED=17,LENGTH=.55,WIND={x:-1.6,z:.9};
export function createRain(scene:T.Object3D){
 const positions=new Float32Array(RAIN_DROPS*6),offsets=new Float32Array(RAIN_DROPS*3);
 let seed=97;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<RAIN_DROPS;i++){offsets[i*3]=rand()*SIZE.x;offsets[i*3+1]=rand()*SIZE.y;offsets[i*3+2]=rand()*SIZE.z;}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));
 const material=new T.LineBasicMaterial({color:0xb7c2cc,transparent:true,opacity:.38,depthWrite:false});
 const lines=new T.LineSegments(geometry,material);lines.name='rain';lines.frustumCulled=false;lines.visible=false;lines.renderOrder=3;scene.add(lines);
 let active=false,fall=0,wx=WIND.x,wz=WIND.z,dx=0,dz=0;
 const wrap=(v:number,size:number)=>((v%size)+size)%size;
 return{
  get active(){return active;},
  setActive(on:boolean){active=on;lines.visible=on;},
  /** Slant the rain with a breeze (m/s, x and z), or back to the old slant (null); the drops carry on from where they are. */
  setWind(w:{x:number;z:number}|null){const x=w?w.x:WIND.x,z=w?w.z:WIND.z;dx+=(wx-x)*fall;dz+=(wz-z)*fall;wx=x;wz=z;},
  update(camera:T.Camera,dt:number){
   if(!active)return;fall+=dt;const c=camera.position,ox=c.x-SIZE.x/2,oy=c.y-SIZE.y*.45,oz=c.z-SIZE.z/2;
   for(let i=0;i<RAIN_DROPS;i++){
    const x=ox+wrap(offsets[i*3]+wx*fall+dx-c.x,SIZE.x),y=oy+wrap(offsets[i*3+1]-SPEED*fall-c.y*0,SIZE.y),z=oz+wrap(offsets[i*3+2]+wz*fall+dz-c.z,SIZE.z);
    const k=i*6;positions[k]=x;positions[k+1]=y;positions[k+2]=z;positions[k+3]=x-wx*LENGTH/SPEED;positions[k+4]=y+LENGTH;positions[k+5]=z-wz*LENGTH/SPEED;
   }
   (geometry.attributes.position as T.BufferAttribute).needsUpdate=true;
  },
  dispose(){lines.removeFromParent();geometry.dispose();material.dispose();}};
}
