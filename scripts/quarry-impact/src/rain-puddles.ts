import * as T from 'three';
import type {ArenaLayout} from './derby-arena';
import type {Puddle} from './puddle-splashes';
/** Rain puddles (offline rain, derby arenas): RAIN_PUDDLES.count puddles of standing water lie on the arena floor,
 * RAIN_PUDDLES.radius m across their long axis and squashed to RAIN_PUDDLES.aspect, scattered between RAIN_PUDDLES.inner of
 * the arena's radius (clear of an island and of each other by RAIN_PUDDLES.gap m). They start at RAIN_PUDDLES.start of their
 * size, the rain having already been falling, and fill out over RAIN_PUDDLES.fill s. They are ordinary puddles to the rest
 * of the game: wheels splash through them and ripple them. */
export const RAIN_PUDDLES={count:10,radius:[1.8,3.6],aspect:[.5,1],inner:[.2,.82],gap:2,start:.6,fill:60,level:.025,tries:240} as const;
export type LaidPuddle={puddle:Puddle;variations:number[]};
/** A small repeatable random sequence (mulberry32). */
export function seeded(seed:number){let a=(Number.isFinite(seed)?Math.floor(seed):0)>>>0;return()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const inside=(o:readonly {x:number;z:number}[],x:number,z:number)=>{let r=false;for(let i=0,j=o.length-1;i<o.length;j=i++){const a=o[i],b=o[j];if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)r=!r;}return r;};
/** Where this event's puddles lie on the arena floor (repeatable for a seed); ids start at 1000, clear of a venue's own. */
export function layRainPuddles(layout:ArenaLayout,height:(x:number,z:number)=>number,seed:number):LaidPuddle[]{
  const random=seeded(seed),out:LaidPuddle[]=[],R=RAIN_PUDDLES,between=(r:readonly number[])=>r[0]+random()*(r[1]-r[0]);
  for(let n=0;n<R.tries&&out.length<R.count;n++){
    const radius=between(R.radius),aspect=between(R.aspect),a=random()*Math.PI*2,d=layout.radius*between(R.inner);
    const x=layout.x+Math.sin(a)*d,z=layout.z+Math.cos(a)*d;
    // On the floor, inside an outline arena's walls with room to spare, off an island, clear of the others.
    if(layout.outline&&![0,1,2,3,4,5].every(k=>inside(layout.outline!,x+Math.sin(k*1.047)*(radius+1.5),z+Math.cos(k*1.047)*(radius+1.5))))continue;
    if(!layout.outline&&d+radius>layout.radius-2)continue;
    if(layout.island&&Math.hypot(x-layout.x,z-layout.z)<layout.island+radius+2)continue;
    if(out.some(o=>Math.hypot(o.puddle.x-x,o.puddle.z-z)<o.puddle.radius+radius+R.gap))continue;
    const y=height(x,z);if(!Number.isFinite(y))continue;
    const variations=Array.from({length:33},random);
    out.push({puddle:{id:1000+out.length,x,z,level:y+R.level,radius,aspect,phases:[variations[0],variations[7],variations[14],variations[21]]},variations});
  }
  return out;
}
/** The puddles' water on the floor, filling out while the rain lasts. */
export class RainPuddles{
  readonly list:Puddle[]=[];
  readonly group=new T.Group();
  fill=0;
  private full:number[]=[];
  private meshes:T.Mesh[]=[];
  constructor(parent:T.Object3D,private geometry:(radius:number,variations:number[],wet:boolean)=>T.BufferGeometry,private water:T.Material,private wet:T.Material){this.group.name='rain_puddles';parent.add(this.group);}
  lay(laid:readonly LaidPuddle[]){
    this.clear();
    for(const {puddle,variations} of laid){
      for(const [wet,material,lift] of [[true,this.wet,0],[false,this.water,.004]] as const){
        const mesh=new T.Mesh(this.geometry(puddle.radius,variations,wet),material);mesh.name=wet?'rain_puddle_damp':'rain_puddle';
        mesh.rotation.x=-Math.PI/2;mesh.position.set(puddle.x,puddle.level+lift,puddle.z);mesh.receiveShadow=true;mesh.renderOrder=1;
        this.group.add(mesh);this.meshes.push(mesh);
      }
      this.full.push(puddle.radius);this.list.push(puddle);
    }
    this.fill=RAIN_PUDDLES.start;this.apply();
  }
  /** While it rains the puddles fill out; they keep their size once it stops. */
  update(dt:number,raining:boolean){
    if(!this.list.length||!raining||!(dt>0))return;const before=this.fill;
    this.fill=Math.min(1,this.fill+Math.min(.1,dt)/RAIN_PUDDLES.fill);if(this.fill!==before)this.apply();
  }
  private apply(){
    this.list.forEach((p,i)=>{p.radius=this.full[i]*this.fill;for(const m of [this.meshes[i*2],this.meshes[i*2+1]])m.scale.set(this.fill,p.aspect*this.fill,1);});
  }
  clear(){for(const m of this.meshes){m.removeFromParent();m.geometry.dispose();}this.meshes.length=0;this.full.length=0;this.list.length=0;this.fill=0;}
  dispose(){this.clear();this.group.removeFromParent();}
}
