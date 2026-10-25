import * as T from 'three';

/** Gravel roost (offline): a driven tyre spinning faster than the ground under it (ROOST.spin m/s of wheelspin and more)
 * flings stones off its tread behind it — ROOST.rate a second per tyre at ROOST.full m/s of spin, fewer below. A stone
 * leaves the tread at about ROOST.fling of the spin speed, rising ROOST.rise of that, fans out ROOST.fan either side, falls
 * under gravity and skips along the ground losing ROOST.skip of its speed at each bounce, then lies there for the rest of
 * its ROOST.life seconds and sinks away. Mud throws clods instead: bigger, darker, and they stick where they land. None on
 * asphalt. At most ROOST.max in the air or on the ground at once (the oldest go first). With about ROOST.grit.share of the
 * stones goes a puff of grit and dust along the same line (drawn by the effects), so the throw reads as a spray. */
export const ROOST={spin:2.5,full:10,rate:36,fling:.85,rise:[.3,.7],fan:.35,skip:.3,life:1.8,sink:.35,max:320,
  size:{gravel:[.03,.065],mud:[.05,.1]},tint:{gravel:0x6c645a,mud:0x3f3026},grit:{share:.55,size:.36,speed:.8,life:[.5,.95],tint:{gravel:0xa89c86,mud:0x5a4636}}} as const;
export type RoostSurface='gravel'|'mud';
const GRAVITY=9.81;

/** Stones a second off one tyre spinning at this many m/s (signed: + is the tread running forward over the ground). */
export function roostRate(spin:number,surface:string){
  const s=Number.isFinite(spin)?spin-ROOST.spin:0;if(surface==='asphalt'||!(s>0))return 0;
  return ROOST.rate*Math.min(1,s/(ROOST.full-ROOST.spin));
}
/** The speed (m/s) a stone leaves the tread at for this much wheelspin, before its rise and fan. */
export function roostSpeed(spin:number){return Math.max(0,ROOST.fling*Math.min(Number.isFinite(spin)?spin:0,ROOST.full*2));}

type Stone={p:T.Vector3;v:T.Vector3;age:number;size:number;floor:number;stuck:boolean;mud:boolean;spin:T.Vector3;turn:T.Euler};

export class GravelRoost {
  readonly mesh:T.InstancedMesh;
  readonly stones:Stone[]=[];
  thrown=0;
  private cursor=0;
  private readonly dummy=new T.Object3D();
  private readonly colour=new T.Color();
  constructor(parent:T.Object3D,private readonly ground:(x:number,z:number)=>number){
    this.mesh=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({roughness:.92,metalness:0,flatShading:true}),ROOST.max);
    this.mesh.name='gravel_roost';this.mesh.count=0;this.mesh.frustumCulled=false;this.mesh.castShadow=false;this.mesh.receiveShadow=true;
    this.mesh.instanceColor=new T.InstancedBufferAttribute(new Float32Array(ROOST.max*3),3);
    parent.add(this.mesh);
  }
  /** Throws one stone from the ground at `at` (a tyre's contact patch), `back` the horizontal unit direction the tread runs
   * off behind it; the stone comes down on the ground at the height `at` stands above the ground function there. */
  throw(at:T.Vector3,back:T.Vector3,spin:number,surface:RoostSurface,random=Math.random):Stone|null{
    const speed=roostSpeed(spin);if(!(speed>0))return null;
    const side=(random()*2-1)*ROOST.fan,rise=ROOST.rise[0]+random()*(ROOST.rise[1]-ROOST.rise[0]),[lo,hi]=ROOST.size[surface];
    const v=new T.Vector3(back.x-back.z*side,0,back.z+back.x*side).normalize().multiplyScalar(speed*(.7+random()*.45));v.y=speed*rise;
    const size=lo+random()*(hi-lo),stone:Stone={p:at.clone(),v,age:0,size,floor:at.y-this.ground(at.x,at.z),stuck:false,mud:surface==='mud',
      spin:new T.Vector3(random()-.5,random()-.5,random()-.5).multiplyScalar(30),turn:new T.Euler(random()*6,random()*6,random()*6)};
    const n=this.cursor++%ROOST.max;this.stones[n]=stone;this.thrown++;
    this.colour.setHex(ROOST.tint[surface]).multiplyScalar(.75+random()*.4).toArray(this.mesh.instanceColor!.array,n*3);this.mesh.instanceColor!.needsUpdate=true;
    stone.p.y+=size*.5;if(stone.mud)stone.spin.multiplyScalar(.4);
    return stone;
  }
  step(dt:number){
    if(!(dt>0))return;
    let shown=0;
    for(let n=0;n<this.stones.length;n++){
      const s=this.stones[n];if(!s||s.age>=ROOST.life)continue;
      s.age+=dt;
      if(!s.stuck){
        s.v.y-=GRAVITY*dt;s.p.addScaledVector(s.v,dt);s.turn.x+=s.spin.x*dt;s.turn.y+=s.spin.y*dt;s.turn.z+=s.spin.z*dt;
        const floor=this.ground(s.p.x,s.p.z)+s.floor+s.size*.5;
        if(s.p.y<=floor){
          s.p.y=floor;
          if(s.mud||Math.abs(s.v.y)<1.2){s.stuck=true;s.v.set(0,0,0);}
          else{s.v.y=-s.v.y*ROOST.skip;s.v.x*=1-ROOST.skip;s.v.z*=1-ROOST.skip;s.spin.multiplyScalar(.5);}
        }
      }
      const left=ROOST.life-s.age,scale=s.size*Math.min(1,left/ROOST.sink);
      this.dummy.position.copy(s.p);if(left<ROOST.sink)this.dummy.position.y-=s.size*(1-left/ROOST.sink);
      this.dummy.rotation.copy(s.turn);this.dummy.scale.set(scale,scale*.7,scale*.85);this.dummy.updateMatrix();
      this.mesh.setMatrixAt(n,this.dummy.matrix);shown=n+1;
    }
    // Spent stones sit at zero scale; draw up to the last live one.
    for(let n=0;n<shown;n++){const s=this.stones[n];if(!s||s.age>=ROOST.life){this.dummy.scale.setScalar(0);this.dummy.updateMatrix();this.mesh.setMatrixAt(n,this.dummy.matrix);}}
    this.mesh.count=shown;this.mesh.instanceMatrix.needsUpdate=true;
  }
  /** Stones still in the air (not yet landed and spent). */
  get flying(){let n=0;for(const s of this.stones)if(s&&!s.stuck&&s.age<ROOST.life)n++;return n;}
  reset(){this.stones.length=0;this.cursor=0;this.mesh.count=0;}
}
