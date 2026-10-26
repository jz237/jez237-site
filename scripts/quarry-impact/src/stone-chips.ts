import * as T from 'three';

/** Stone chips (offline rivals, by age): an old banger's windscreen carries an old chip that was never filled — from CHIP.age
 * of its age, on CHIP.share of them a bullseye low in one corner of the screen (CHIP.low of the way up, CHIP.out of the way
 * out), its cracks running out CHIP.reach of the way a blow's would (the glass shader's own crack, drawn smaller), faint
 * (CHIP.level). Each car its own corner. The next real blow to the screen cracks it from where that lands, full size. Uses
 * the screen's own shader: no draw call. */
export const CHIP={age:.4,share:.4,low:.2,out:.62,reach:[.36,.5],level:[.16,.24]} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*83.11+salt*17.39)*43758.5453)%1;
export type Chip={side:-1|1;reach:number;level:number};
/** Car `id` of this age: the side its chip is on, how far its cracks run and how plain it shows (null: a clean screen). */
export function chipFor(id:number,age:number):Chip|null{
  const n=Number.isFinite(id)?id:0;
  if(!(age>=CHIP.age)||hash(n,1)>=CHIP.share)return null;
  return {side:hash(n,2)<.5?-1:1,reach:CHIP.reach[0]+(CHIP.reach[1]-CHIP.reach[0])*hash(n,3),level:CHIP.level[0]+(CHIP.level[1]-CHIP.level[0])*hash(n,4)};
}
/** Where on a windscreen (in its own geometry's frame) the chip sits: the vertex nearest CHIP.low of the way up and CHIP.out of
 * the way out to `side` (−1 the car's left) as the car sees it (`toCar`: the geometry's frame to the car's), so it lies on the
 * glass whichever way the mesh was authored. */
export function chipPoint(geometry:T.BufferGeometry,toCar:T.Matrix4,side:number,target=new T.Vector3()){
  const pos=geometry.attributes.position,v=new T.Vector3(),box=new T.Box3();
  for(let i=0;i<pos.count;i++)box.expandByPoint(v.fromBufferAttribute(pos,i).applyMatrix4(toCar));
  const c=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3()),wantX=c.x+(side<0?-1:1)*size.x*.5*CHIP.out,wantY=box.min.y+size.y*CHIP.low;
  let best=Infinity;
  for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(toCar);const d=(v.x-wantX)**2+(v.y-wantY)**2;if(d<best){best=d;target.fromBufferAttribute(pos,i);}}
  return target;
}
