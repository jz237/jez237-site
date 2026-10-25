import * as T from 'three';
/** Wet-road reflections (offline rain): every lit headlamp (and lit or braking tail lamp) lays a streak of its light across
 * the wet road toward the camera, REFLECT.length m long and REFLECT.width m wide, fading along its length and with distance
 * from the camera (gone by REFLECT.far m). Warm white for heads at REFLECT.head, red for tails at REFLECT.tail. One draw. */
export const REFLECT={length:3.4,width:.3,far:45,head:.45,tail:.26,max:160} as const;
export type Glow={x:number;y:number;z:number;tail:boolean};
/** A streak's brightness for a lamp this far (m) from the camera: full close by, gone by REFLECT.far, nothing right underfoot. */
export const streakFade=(distance:number)=>!(distance>=1)?0:Math.max(0,1-distance/REFLECT.far);
let streak:T.DataTexture|null=null;
/** Bright at the lamp's end (v = 1, the strip's origin end), fading away along the streak and toward its edges. */
function streakTexture(){
  if(streak)return streak;const w=8,h=32,d=new Uint8Array(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=Math.round(255*Math.pow(y/(h-1),1.6)*Math.sin(Math.PI*(x+.5)/w)),i=(y*w+x)*4;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;}
  streak=new T.DataTexture(d,w,h);streak.magFilter=streak.minFilter=T.LinearFilter;streak.needsUpdate=true;return streak;
}
export function createWetReflections(scene:T.Object3D){
  // A unit strip lying on the ground, from its lamp end at the origin out along +z.
  const geometry=new T.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(0,0,.5);
  const material=new T.MeshBasicMaterial({map:streakTexture(),transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
  const mesh=new T.InstancedMesh(geometry,material,REFLECT.max);mesh.name='wet_reflections';mesh.frustumCulled=false;mesh.count=0;mesh.renderOrder=2;scene.add(mesh);
  const m=new T.Matrix4(),q=new T.Quaternion(),up=new T.Vector3(0,1,0),p=new T.Vector3(),s=new T.Vector3(REFLECT.width,1,REFLECT.length),c=new T.Color(),warm=new T.Color(0xfff0d2),red=new T.Color(0xff2a1a);
  return{
    mesh,
    /** Lay the streaks for these lamps (world positions) toward the camera, on the ground. */
    update(glows:readonly Glow[],camera:T.Camera,ground:(x:number,z:number)=>number){
      let n=0;const cam=camera.position;
      for(const g of glows){
        if(n>=REFLECT.max)break;const dx=cam.x-g.x,dz=cam.z-g.z,fade=streakFade(Math.hypot(dx,dz));if(fade<=0)continue;
        const y=ground(g.x,g.z);p.set(g.x,(Number.isFinite(y)?y:g.y-.6)+.02,g.z);q.setFromAxisAngle(up,Math.atan2(dx,dz));
        mesh.setMatrixAt(n,m.compose(p,q,s));mesh.setColorAt(n,c.copy(g.tail?red:warm).multiplyScalar((g.tail?REFLECT.tail:REFLECT.head)*fade));n++;
      }
      mesh.count=n;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    },
    clear(){mesh.count=0;},
    dispose(){mesh.removeFromParent();geometry.dispose();material.dispose();mesh.dispose();}};
}
