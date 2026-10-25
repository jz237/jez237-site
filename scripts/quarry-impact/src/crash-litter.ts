import * as T from 'three';
/** What a derby leaves on the floor: crumbs of broken glass and chips of smashed lamp lenses, scattered where they broke and left
 * there for the rest of the event (the oldest are recycled once capacity is reached). One instanced draw of small flat chips lying
 * on the ground. Per kind: count chips spread up to spread metres around the break, size the chip edge range (metres). Given
 * the car's centre, the pieces land thrown out from it: the scatter's middle moves throw metres beyond the break, away from the car. */
export const LITTER={capacity:2400,lift:.012,throw:.85,cell:.5,
  glass:{count:42,spread:1.1,size:[.012,.032],color:0xb9d3cf},
  head:{count:14,spread:.55,size:[.016,.04],color:0xe6ecef},
  tail:{count:14,spread:.55,size:[.016,.04],color:0xb3241b},
  // Flakes of the car's own paint off a big hit (every third one bare primer), counted from the hit; min is the damage it takes.
  paint:{count:10,spread:.7,size:[.01,.028],color:0x808080,primer:0x55585c,min:6,most:16},
  rubber:{count:9,spread:.8,size:[.03,.07],color:0x1b1b1b},
} as const;
export type LitterKind='glass'|'head'|'tail'|'paint'|'rubber';
/** A shredding tyre on a car going speed m/s or faster sheds chips lumps of rubber at its wheel every gap seconds. */
export const SHRED_TRAIL={speed:6,gap:.14,chips:2} as const;
export class CrashLitter{
  readonly mesh:T.InstancedMesh;
  private cursor=0;
  // Where each chip lies (x, z) and which floor cell holds it, so wheels can find the litter under them.
  private readonly spot=new Float32Array(LITTER.capacity*2);
  private readonly cellOf=new Int32Array(LITTER.capacity).fill(-1);
  private readonly cells=new Map<number,Set<number>>();
  /** Breaks scattered so far this event, by kind. */
  readonly breaks={glass:0,head:0,tail:0,paint:0,rubber:0};
  /** Where the last scatter landed (its middle, on the ground). */
  readonly last=new T.Vector3();
  private pose=new T.Object3D();
  private tint=new T.Color();
  constructor(scene:T.Scene){
    // A rough, slightly uneven chip, flat on the ground with its face up (wound so its front face looks up).
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute([-.5,0,-.35,-.1,0,.5,.55,0,-.2],3));
    geometry.setAttribute('normal',new T.Float32BufferAttribute([0,1,0,0,1,0,0,1,0],3));geometry.computeBoundingSphere();
    const material=new T.MeshStandardMaterial({roughness:.16,metalness:.08});
    this.mesh=new T.InstancedMesh(geometry,material,LITTER.capacity);this.mesh.name='crash-litter';this.mesh.count=0;this.mesh.frustumCulled=false;this.mesh.receiveShadow=true;
    this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);this.mesh.setColorAt(0,this.tint.setHex(0xffffff));scene.add(this.mesh);
  }
  /** Scatters kind's chips around point (seeded, so the same break scatters the same way), each lying on height(x, z), thrown out
   * away from from (the car's centre) when given; colour and count override the kind's own (paint takes the car's colour). */
  scatter(point:T.Vector3,kind:LitterKind,seed:number,height:(x:number,z:number)=>number,from?:T.Vector3,colour?:number,count?:number){
    if(![point.x,point.y,point.z].every(Number.isFinite))return 0;
    const k=LITTER[kind],dx=from?point.x-from.x:0,dz=from?point.z-from.z:0,d=Math.hypot(dx,dz),cx=point.x+(d>1e-6?dx/d*LITTER.throw:0),cz=point.z+(d>1e-6?dz/d*LITTER.throw:0);let state=(Math.floor(seed*2654435761)^0x9e3779b9)>>>0;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
    // A count asked for (paint, from the hit) is held to 40 so one scatter never floods the floor.
    const n=count===undefined?k.count:Number.isFinite(count)?Math.max(0,Math.min(40,Math.round(count))):0,base=colour??k.color;
    for(let i=0;i<n;i++){
      const angle=random()*Math.PI*2,reach=k.spread*Math.sqrt(random()),x=cx+Math.cos(angle)*reach,z=cz+Math.sin(angle)*reach,ground=height(x,z);
      if(!Number.isFinite(ground))continue;
      const size=k.size[0]+(k.size[1]-k.size[0])*random();
      this.pose.position.set(x,ground+LITTER.lift,z);this.pose.rotation.set((random()-.5)*.25,random()*Math.PI*2,(random()-.5)*.25);this.pose.scale.set(size,1,size*(.7+random()*.6));this.pose.updateMatrix();
      const slot=this.cursor;this.cursor=(this.cursor+1)%LITTER.capacity;this.mesh.setMatrixAt(slot,this.pose.matrix);this.place(slot,x,z);
      this.mesh.setColorAt(slot,this.tint.setHex(kind==='paint'&&i%3===2?LITTER.paint.primer:base).multiplyScalar(.82+random()*.3));this.mesh.count=Math.max(this.mesh.count,slot+1);
    }
    this.mesh.instanceMatrix.needsUpdate=true;if(this.mesh.instanceColor)this.mesh.instanceColor.needsUpdate=true;
    this.last.set(cx,height(cx,cz),cz);this.breaks[kind]++;return n;
  }
  private static cell(x:number,z:number){return (Math.floor(x/LITTER.cell)+32768)*65536+(Math.floor(z/LITTER.cell)+32768);}
  private place(slot:number,x:number,z:number){
    const old=this.cellOf[slot];if(old>=0)this.cells.get(old)?.delete(slot);
    const key=CrashLitter.cell(x,z);let set=this.cells.get(key);if(!set)this.cells.set(key,set=new Set());set.add(slot);this.cellOf[slot]=key;this.spot[slot*2]=x;this.spot[slot*2+1]=z;
  }
  /** How many chips lie within r metres of (x, z) on the floor. */
  under(x:number,z:number,r:number){
    if(!this.cells.size||!(r>0))return 0;let n=0;const reach=Math.ceil(r/LITTER.cell);const cx=Math.floor(x/LITTER.cell),cz=Math.floor(z/LITTER.cell);
    for(let i=-reach;i<=reach;i++)for(let j=-reach;j<=reach;j++){const set=this.cells.get((cx+i+32768)*65536+(cz+j+32768));if(set)for(const slot of set)if(Math.hypot(this.spot[slot*2]-x,this.spot[slot*2+1]-z)<=r)n++;}
    return n;
  }
  reset(){this.cells.clear();this.cellOf.fill(-1);this.cursor=0;this.mesh.count=0;this.breaks.glass=this.breaks.head=this.breaks.tail=this.breaks.paint=this.breaks.rubber=0;}
}
