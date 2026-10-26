import * as T from 'three';

/** Exhaust flames (offline): every pop out of the tailpipe — a misfire's backfire, a split exhaust crackling on the
 * overrun, a catching bump start — throws a short tongue of flame out behind the car: an orange cone FLAME.length m
 * long round a hot yellow core, flickering for FLAME.life s as it shrinks away. And an old carburettor car floored through
 * the gears spits one on a high-revving upshift (past SHIFT_FLAME.rpm with the pedal past SHIFT_FLAME.throttle). At most
 * FLAME.pool burn at once (the oldest goes). */
export const FLAME={length:.6,radius:.09,core:.55,life:.16,flicker:.35,pool:12,outer:0xff7a22,inner:0xffe7a0} as const;
export const SHIFT_FLAME={rpm:5200,throttle:.9} as const;
/** A tongue of flame lights its surroundings like a burst of this many sparks (the spark light), FLAME_LIGHT.shift for an
 * upshift's bigger one. */
export const FLAME_LIGHT={pop:10,shift:14} as const;
/** Does this upshift (gear before → now, revs before it, pedal) spit flame from this car? */
export function shiftFlame(before:number,now:number,rpm:number,throttle:number,classic:boolean){
  return classic&&Number.isFinite(before)&&Number.isFinite(now)&&before>=1&&now>before&&Number.isFinite(rpm)&&rpm>=SHIFT_FLAME.rpm&&Number.isFinite(throttle)&&throttle>=SHIFT_FLAME.throttle;
}
/** How big a flame is at this age (s): full at once, shrinking away to nothing at FLAME.life. */
export const flameSize=(age:number)=>Number.isFinite(age)&&age>=0&&age<FLAME.life?1-(age/FLAME.life)**2:0;
// A cone along −z from its base at the origin: the flame leaves the pipe and points out behind.
const cone=(radius:number,length:number)=>new T.ConeGeometry(radius,length,10,1,true).translate(0,-length/2,0).rotateX(Math.PI/2);
type Flame={group:T.Group;outer:T.Mesh;inner:T.Mesh;age:number};
export class ExhaustFlames{
  readonly flames:Flame[]=[];
  flashes=0;
  private cursor=0;
  private readonly look=new T.Matrix4();private readonly up=new T.Vector3(0,1,0);private readonly origin=new T.Vector3();
  constructor(parent:T.Object3D,private random=Math.random){
    const outerGeometry=cone(FLAME.radius,FLAME.length),innerGeometry=cone(FLAME.radius*.5,FLAME.length*FLAME.core);
    const glow=(colour:number,opacity:number)=>new T.MeshBasicMaterial({color:colour,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
    for(let i=0;i<FLAME.pool;i++){const group=new T.Group();group.name='exhaust_flame';group.visible=false;
      const outer=new T.Mesh(outerGeometry,glow(FLAME.outer,.85)),inner=new T.Mesh(innerGeometry,glow(FLAME.inner,.95));outer.frustumCulled=inner.frustumCulled=false;
      group.add(outer,inner);parent.add(group);this.flames.push({group,outer,inner,age:FLAME.life});}
  }
  /** A tongue of flame from the tailpipe at `at`, pointing along `back` (the way out of the pipe), `scale` times as big. */
  flash(at:T.Vector3,back:T.Vector3,scale=1){
    const f=this.flames[this.cursor++%FLAME.pool];f.age=0;f.group.visible=true;f.group.position.copy(at);
    // Turn its −z along the way out of the pipe.
    const dir=back.clone().normalize();if(!Number.isFinite(dir.x)||dir.lengthSq()<.5)dir.set(0,0,-1);
    this.look.lookAt(this.origin,dir,Math.abs(dir.y)>.95?new T.Vector3(1,0,0):this.up);f.group.quaternion.setFromRotationMatrix(this.look);
    f.group.userData.scale=Number.isFinite(scale)?Math.max(.2,scale):1;this.flashes++;this.pose(f);
  }
  step(dt:number){if(!(dt>0))return;for(const f of this.flames){if(!f.group.visible)continue;f.age+=dt;if(f.age>=FLAME.life){f.group.visible=false;continue;}this.pose(f);}}
  private pose(f:Flame){
    const s=flameSize(f.age)*(f.group.userData.scale??1),flicker=1-FLAME.flicker/2+this.random()*FLAME.flicker;
    f.group.scale.set(s,s,s*flicker);(f.outer.material as T.MeshBasicMaterial).opacity=.85*s;(f.inner.material as T.MeshBasicMaterial).opacity=.95*s;
  }
  /** Flames burning now (QA). */
  get burning(){return this.flames.filter(f=>f.group.visible).length;}
  reset(){for(const f of this.flames){f.age=FLAME.life;f.group.visible=false;}}
}
