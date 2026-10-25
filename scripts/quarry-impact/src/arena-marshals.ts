import * as T from 'three';
import type {ArenaLayout} from './derby-arena';
/** Marshals (offline derbies): MARSHALS.posts hi-vis figures standing out of harm's way, MARSHALS.gap of the way from the
 * barrier to the fence, up on a MARSHALS.stand m post platform to see over the wall, each facing the arena with a flag.
 * A green flag waves for MARSHALS.green s as a heat starts; a red one while a car within MARSHALS.reach m of the post is on
 * fire, a yellow one while one is wrecked or upside down; the chequered flag once the heat is won; otherwise the flag is
 * held down at the side. Cosmetic only. */
export const MARSHALS={posts:4,gap:.5,reach:30,green:3.5,wave:7.5,arm:2.6,stand:.9} as const;
export type MarshalFlag='down'|'green'|'yellow'|'red'|'chequered';
export type Post={x:number;y:number;z:number;yaw:number};
/** Where the posts stand (between barrier and fence, a quarter of the way round from each other): the platform tops.
 * Round arenas only: a yard laid out by an outline has corners a ring of posts could stand inside, so it has none. */
export function marshalPosts(arena:ArenaLayout,ground:(x:number,z:number)=>number):Post[]{
  if(arena.outline)return [];
  const r=arena.radius+(arena.fenceRadius-arena.radius)*MARSHALS.gap;
  return Array.from({length:MARSHALS.posts},(_,i)=>{const a=(i+.5)/MARSHALS.posts*Math.PI*2,x=arena.x+Math.sin(a)*r,z=arena.z+Math.cos(a)*r,y=ground(x,z);
    return {x,y:(Number.isFinite(y)?y:0)+MARSHALS.stand,z,yaw:Math.atan2(arena.x-x,arena.z-z)};});
}
const FLAG_COLOUR={down:0xf2c21b,green:0x1fa84a,yellow:0xf2c21b,red:0xd8261d,chequered:0xffffff} as const;
/** Black and white squares for the chequered flag (built without a canvas). */
let checker:T.DataTexture|null=null;
function chequers(){if(checker)return checker;const w=4,h=3,d=new Uint8Array(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=(x+y)%2?18:240,i=(y*w+x)*4;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;}
  checker=new T.DataTexture(d,w,h);checker.magFilter=checker.minFilter=T.NearestFilter;checker.colorSpace=T.SRGBColorSpace;checker.needsUpdate=true;return checker;}
/** A marshal in orange hi-vis with a white helmet, the flag arm pivoting at the right shoulder (local +z faces the arena). */
export function marshalFigure(){
  const g=new T.Group();g.name='arena_marshal';
  const vest=new T.MeshStandardMaterial({color:0xff6a13,roughness:.7}),dark=new T.MeshStandardMaterial({color:0x23262b,roughness:.85}),skin=new T.MeshStandardMaterial({color:0xc99674,roughness:.8}),helmet=new T.MeshStandardMaterial({color:0xf2f2f0,roughness:.4});
  const part=(geo:T.BufferGeometry,mat:T.Material,x:number,y:number,z:number)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m;};
  // The post platform they stand on (its top at the figure's feet).
  part(new T.BoxGeometry(1,MARSHALS.stand,1),new T.MeshStandardMaterial({color:0x8b8f94,roughness:.9}),0,-MARSHALS.stand/2,0);
  for(const s of [-1,1])part(new T.BoxGeometry(.16,.86,.18),dark,s*.11,.43,0);
  part(new T.BoxGeometry(.46,.62,.26),vest,0,1.17,0);part(new T.SphereGeometry(.12,10,8),skin,0,1.62,0);part(new T.SphereGeometry(.13,10,6,0,Math.PI*2,0,Math.PI/2),helmet,0,1.66,0);
  part(new T.BoxGeometry(.1,.55,.1),vest,-.29,1.12,0);
  const arm=new T.Group();arm.name='marshal_arm';arm.position.set(.29,1.42,0);g.add(arm);
  const sleeve=new T.Mesh(new T.BoxGeometry(.1,.58,.1),vest);sleeve.position.y=-.27;arm.add(sleeve);
  const pole=new T.Mesh(new T.CylinderGeometry(.012,.012,.9,5),dark);pole.position.set(0,-.55,.12);pole.rotation.x=Math.PI/2*.15;arm.add(pole);
  const cloth=new T.Mesh(new T.PlaneGeometry(.5,.36),new T.MeshStandardMaterial({color:FLAG_COLOUR.down,roughness:.8,side:T.DoubleSide}));cloth.name='marshal_flag';cloth.position.set(.25,-.85,.17);arm.add(cloth);
  return g;
}
/** Pose a marshal for a flag at time t (s): down at the side, or raised and waved overhead. */
export function poseMarshal(figure:T.Object3D,flag:MarshalFlag,t:number){
  const arm=figure.getObjectByName('marshal_arm'),cloth=figure.getObjectByName('marshal_flag') as T.Mesh|undefined;if(!arm||!cloth)return;
  const wave=flag!=='down';arm.rotation.set(0,0,wave?MARSHALS.arm+Math.sin((Number.isFinite(t)?t:0)*MARSHALS.wave)*.45:.08);
  const m=cloth.material as T.MeshStandardMaterial,map=flag==='chequered'?chequers():null;if(m.map!==map){m.map=map;m.needsUpdate=true;}
  m.color.setHex(FLAG_COLOUR[flag]);cloth.visible=true;figure.userData.flag=flag;
}
/** The flag a post shows: chequered once the heat is won, green as it starts, red for a car on fire near it, yellow for a
 * wrecked or upside-down one, else down. */
export function marshalFlag(post:Post,elapsed:number,cars:readonly {current:{x:number;z:number};health:number;inverted:number;onFire?:boolean}[],finished=false):MarshalFlag{
  if(finished)return 'chequered';
  if(Number.isFinite(elapsed)&&elapsed>=0&&elapsed<MARSHALS.green)return 'green';
  const near=cars.filter(c=>Math.hypot(c.current.x-post.x,c.current.z-post.z)<=MARSHALS.reach);
  return near.some(c=>c.onFire)?'red':near.some(c=>c.health<=0||c.inverted>.3)?'yellow':'down';
}
