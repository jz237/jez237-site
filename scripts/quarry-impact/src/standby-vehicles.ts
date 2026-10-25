import * as T from 'three';
import type {ArenaLayout} from './derby-arena';
import type {CarKind} from './rules';
/** Standby vehicles (offline derbies, round arenas): a recovery truck and a fire tender wait between the arena wall and the
 * fence, half way across, parked along it at the north and south of the bowl (clear of the marshals' posts on the
 * diagonals), each with a light bar on its roof flashing its two colours in turn (STANDBY.flash s each) the whole event.
 * Both stand taller than the wall: the recovery truck's tow boom rises behind its cab (STANDBY.boom) with an amber beacon
 * at its tip, and the fire tender has its light mast up (STANDBY.mast), two floodlights at the top turned on the arena and
 * its beacons above them. Only where that gap is at least STANDBY.gap m wide. Models only: no physics. */
export const STANDBY={gap:3.2,ring:.5,flash:.28,glow:4,bar:{width:1,height:.08,depth:.22,lift:.05},boom:{length:3.2,tilt:.62,width:.16,back:.45,color:0xe2b11c,beacon:.17},
  mast:{height:3.4,radius:.05,flood:3.2,beacon:.12},
  vehicles:[{kind:'utility' as CarKind,color:0xe9e4d6,angle:0,lamps:[0xffa21a,0xffa21a],name:'recovery'},{kind:'van' as CarKind,color:0xb3170f,angle:Math.PI,lamps:[0xff2418,0x2860ff],name:'fire'}]} as const;
export type StandbyPost={x:number;y:number;z:number;yaw:number;kind:CarKind;color:number;lamps:readonly [number,number];name:string};
/** Where the standby vehicles park round a round arena (none for an outline arena or too narrow a gap). */
export function standbyPosts(arena:ArenaLayout,ground:(x:number,z:number)=>number):StandbyPost[]{
  if(arena.outline||!(arena.fenceRadius-arena.radius>=STANDBY.gap))return [];
  const r=arena.radius+(arena.fenceRadius-arena.radius)*STANDBY.ring;
  return STANDBY.vehicles.map(v=>{const x=arena.x+Math.sin(v.angle)*r,z=arena.z+Math.cos(v.angle)*r,y=ground(x,z);
    // Parked along the ring: facing round it.
    return {x,y:Number.isFinite(y)?y:0,z,yaw:Math.atan2(Math.cos(v.angle),-Math.sin(v.angle)),kind:v.kind,color:v.color,lamps:v.lamps,name:v.name};});
}
/** Which half of a light bar is lit at this moment (seconds): 0, then 1, in turn. */
export const beaconHalf=(time:number)=>Number.isFinite(time)?Math.floor(time/STANDBY.flash)%2:0;
/** The standby vehicles for an arena, built from car models (`model(kind, colour)`), with their light bars. */
export function createStandby(parent:T.Object3D,posts:readonly StandbyPost[],model:(kind:CarKind,color:number)=>T.Object3D,centre=new T.Vector3()){
  const group=new T.Group();group.name='standby_vehicles';parent.add(group);
  const geometry=new T.BoxGeometry(STANDBY.bar.width/2,STANDBY.bar.height,STANDBY.bar.depth),owned:T.Material[]=[];const halves:T.MeshStandardMaterial[][]=[];
  for(const post of posts){
    const car=model(post.kind,post.color);car.name='standby_'+post.name;car.position.set(post.x,post.y,post.z);car.rotation.y=post.yaw;
    car.updateMatrixWorld(true);const top=new T.Box3().setFromObject(car).max.y-post.y;
    const bar=new T.Group();bar.name='light_bar';bar.position.set(0,top+STANDBY.bar.lift,0);car.add(bar);
    const pair:T.MeshStandardMaterial[]=post.lamps.map((color,i)=>{const material=new T.MeshStandardMaterial({color,roughness:.3,emissive:new T.Color(color),emissiveIntensity:0,name:'Beacon'});owned.push(material);
      const lamp=new T.Mesh(geometry,material);lamp.position.x=(i?1:-1)*STANDBY.bar.width/4;bar.add(lamp);return material;});
    halves.push(pair);group.add(car);
    const box=new T.Box3().setFromObject(car),rear=box.min.clone().sub(car.position),steel=new T.MeshStandardMaterial({color:post.name==='fire'?0xc9c9c4:STANDBY.boom.color,roughness:.5,metalness:post.name==='fire'?.6:.2,name:'Standby steel'});owned.push(steel);
    const beacon=(color:number,at:T.Vector3,on:T.Object3D,radius:number=STANDBY.mast.beacon)=>{const material=new T.MeshStandardMaterial({color,roughness:.3,emissive:new T.Color(color),emissiveIntensity:0,name:'Beacon'});owned.push(material);
      const lamp=new T.Mesh(new T.SphereGeometry(radius,12,8),material);lamp.position.copy(at);on.add(lamp);return material;};
    if(post.name==='recovery'){
      // The tow boom (safety yellow), up and back from the bed behind the cab, an amber beacon at its tip.
      const B=STANDBY.boom,boom=new T.Group();boom.name='tow_boom';boom.position.set(0,top*.55,rear.z+B.back);boom.rotation.x=B.tilt;car.add(boom);
      const arm=new T.Mesh(new T.BoxGeometry(B.width,B.width,B.length).translate(0,0,-B.length/2),steel);boom.add(arm);
      pair.push(beacon(post.lamps[0],new T.Vector3(0,B.width,-B.length),boom,B.beacon));
    }else{
      // The light mast, up from the roof at the back, floodlights on the arena and the beacons above them.
      const M=STANDBY.mast,mast=new T.Group();mast.name='light_mast';mast.position.set(0,top,rear.z+.6);car.add(mast);
      mast.add(new T.Mesh(new T.CylinderGeometry(M.radius,M.radius*1.4,M.height,10).translate(0,M.height/2,0),steel));
      const head=new T.Group();head.position.y=M.height;mast.add(head);car.updateMatrixWorld(true);head.lookAt(centre.x,head.getWorldPosition(new T.Vector3()).y-1.2,centre.z);
      const flood=new T.MeshStandardMaterial({color:0xf4f1e6,roughness:.2,emissive:new T.Color(0xfff6dc),emissiveIntensity:M.flood,name:'Floodlight'});owned.push(flood);
      for(const x of [-.32,.32]){const lamp=new T.Mesh(new T.BoxGeometry(.34,.24,.12),flood);lamp.position.set(x,0,.08);head.add(lamp);}
      pair.push(beacon(post.lamps[0],new T.Vector3(-.16,.28,0),head),beacon(post.lamps[1],new T.Vector3(.16,.28,0),head));
    }
  }
  return{group,count:posts.length,
    /** Flash the light bars, alternating halves. */
    update(time:number){const lit=beaconHalf(time);for(const pair of halves)pair.forEach((m,i)=>{m.emissiveIntensity=i%2===lit?STANDBY.glow:.15;});},
    dispose(){group.removeFromParent();geometry.dispose();for(const m of owned)m.dispose();}};
}
