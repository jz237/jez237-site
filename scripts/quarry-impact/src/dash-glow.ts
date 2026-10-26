import * as T from 'three';

/** Instrument glow (offline). A car's instruments light up as a real car's do: a model's own glowing cluster (the coupes'
 * Dashboard material) shines while the ignition and electrics live — dark once the car is wrecked, its battery gone or its
 * wiring cut, flickering with loose wiring; plain dial faces (a model's Dial material) glow amber (DASH.dial) with the lamps on;
 * and a car with no instruments of its own gets a pair of amber dials, DASH.size m across, on the dash in front of the driver
 * (DASH.drop m below the helmet, DASH.gap m short of what lies ahead, kept DASH.gap m inside the door), lit with the lamps,
 * bright enough to bloom round the driver's head at dusk. With the lamps on, the lit instruments throw a soft amber glow
 * (DASH.halo strong) through the cabin that shows through the windows from any side — two crossed panels inside it, one
 * across the car (DASH.across m wide, set inboard of the instruments) and one along it (DASH.along m), DASH.high m tall — but
 * not in the car the camera sits in. Once a car is badly hurt (under DASH.warn health) a red warning lamp beside its instruments blinks
 * DASH.blink times a second while the electrics live. */
export const DASH={size:[.26,.08],drop:.3,gap:.02,reach:.7,warn:35,blink:2,lamp:.022,glow:6,dial:3,warning:12,halo:.55,across:.7,along:.5,high:.32,amber:0xffa24a,red:0xff2a1a} as const;
/** A model's own lit cluster (emissive), or its plain dial faces. */
export const isCluster=(m:T.Material)=>/^Dashboard(\.\d+)?$/.test(m.name);
export const isDial=(m:T.Material)=>/ Dial$/.test(m.name);
/** The dials' face (a canvas, so only where there is a document): two gauges glowing amber on black. */
function dials(){
  if(typeof document==='undefined')return null;const canvas=document.createElement('canvas');canvas.width=256;canvas.height=80;const g=canvas.getContext('2d');if(!g)return null;
  g.fillStyle='#000';g.fillRect(0,0,256,80);g.strokeStyle='#ffa24a';g.fillStyle='#ffa24a';g.lineWidth=4;
  for(const x of [64,192]){g.beginPath();g.arc(x,42,30,Math.PI*.8,Math.PI*2.2);g.stroke();for(let k=0;k<7;k++){const a=Math.PI*(.8+1.4*k/6);g.fillRect(x+Math.cos(a)*24-1.5,42+Math.sin(a)*24-1.5,3,3);}
    g.beginPath();g.moveTo(x,42);g.lineTo(x+Math.cos(Math.PI*1.3)*26,42+Math.sin(Math.PI*1.3)*26);g.stroke();}
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;return map;
}
/** The cabin glow's soft round falloff. */
function falloff(){
  if(typeof document==='undefined')return null;const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const g=canvas.getContext('2d');if(!g)return null;
  const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.35,'rgba(255,255,255,.45)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;return map;
}
/** Where added dials sit, in the root's frame: in front of the driver (`helmet`, root frame), DASH.drop below it, short of the
 * dash or glass found ahead among `surfaces` (or DASH.reach m ahead if none is found), and kept inside the door beside it. */
export function dashPoint(root:T.Object3D,helmet:T.Vector3,surfaces:readonly T.Mesh[]){
  root.updateMatrixWorld(true);const ray=new T.Raycaster(),hits:T.Intersection[]=[];
  const room=(from:T.Vector3,along:T.Vector3)=>{ray.set(from.clone().applyMatrix4(root.matrixWorld),along.clone().transformDirection(root.matrixWorld));ray.far=1.5;hits.length=0;
    for(const m of surfaces)m.raycast(ray,hits);return hits.reduce((d,h)=>Math.min(d,h.distance),Infinity);};
  const from=new T.Vector3(helmet.x,helmet.y-DASH.drop,helmet.z),ahead=room(from,new T.Vector3(0,0,1));
  from.z+=Number.isFinite(ahead)?Math.max(.15,Math.min(DASH.reach,ahead-DASH.gap)):DASH.reach;
  const out=Math.sign(helmet.x)||-1,side=room(from,new T.Vector3(out,0,0)),inset=DASH.size[0]/2+DASH.gap;
  if(Number.isFinite(side)&&side<inset)from.x-=out*(inset-side);
  return from;
}
type Lit={material:T.MeshStandardMaterial;base:number};
export class DashGlow{
  readonly clusters:Lit[]=[];readonly faces:T.MeshStandardMaterial[]=[];readonly dials:T.Mesh|null=null;readonly lamp:T.Mesh;readonly halo=new T.Group();inCar=false;
  /** `meshes` are the car's own (its model's instruments are found among them); `at` is where added dials would sit. */
  constructor(root:T.Object3D,at:T.Vector3,meshes:readonly T.Mesh[]){
    const seen=new Set<T.Material>(),box=new T.Box3(),inv=root.matrixWorld.clone().invert();
    for(const m of meshes){
      const material=m.material;if(Array.isArray(material)||!(material instanceof T.MeshStandardMaterial)||!(isCluster(material)||isDial(material)))continue;
      m.geometry.computeBoundingBox();box.union(m.geometry.boundingBox!.clone().applyMatrix4(inv.clone().multiply(m.matrixWorld)));
      if(seen.has(material))continue;seen.add(material);
      if(isCluster(material))this.clusters.push({material,base:material.emissiveIntensity});
      else{material.emissive.setHex(DASH.amber);material.emissiveIntensity=0;this.faces.push(material);}
    }
    this.lamp=new T.Mesh(new T.CircleGeometry(DASH.lamp,10).rotateY(Math.PI),new T.MeshBasicMaterial({name:'Warning lamp',color:new T.Color(DASH.red).multiplyScalar(DASH.warning),transparent:true,blending:T.AdditiveBlending,depthWrite:false}));
    this.lamp.name='dash_warning';this.lamp.visible=false;this.lamp.renderOrder=2;root.add(this.lamp);
    const glow=new T.MeshBasicMaterial({name:'Instrument halo',map:falloff(),color:DASH.amber,opacity:DASH.halo,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide});
    const across=new T.Mesh(new T.PlaneGeometry(DASH.across,DASH.high),glow),along=new T.Mesh(new T.PlaneGeometry(DASH.along,DASH.high).rotateY(Math.PI/2),glow);
    for(const m of [across,along]){m.renderOrder=2;this.halo.add(m);}this.halo.name='dash_halo';this.halo.visible=false;root.add(this.halo);
    // The glow fills the cabin inboard of the instruments (`x` their middle, the car's middle at 0) and back towards the driver.
    const place=(x:number,y:number,z:number)=>{this.halo.position.set(x,y,z);across.position.x=Math.max(-.2,Math.min(.2,-x));along.position.z=-DASH.along/2;};
    if(seen.size){
      // Beside the model's own instruments, on their driver-facing side.
      const c=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());this.lamp.position.set(c.x+(c.x<=0?1:-1)*(size.x/2+DASH.lamp*2),c.y,box.min.z-.01);place(c.x,c.y,box.min.z);
    }else{
      const map=dials();
      this.dials=new T.Mesh(new T.PlaneGeometry(DASH.size[0],DASH.size[1]).rotateY(Math.PI),new T.MeshBasicMaterial({name:'Instrument glow',...(map?{map}:{}),color:map?new T.Color(1,1,1).multiplyScalar(DASH.glow):new T.Color(DASH.amber),transparent:true,blending:T.AdditiveBlending,depthWrite:false}));
      this.dials.name='dash_glow';this.dials.position.copy(at);this.dials.visible=false;this.dials.renderOrder=2;root.add(this.dials);
      this.lamp.position.set(at.x+(at.x<=0?1:-1)*(DASH.size[0]/2+DASH.lamp*2),at.y,at.z);place(at.x,at.y+DASH.size[1]/2,at.z);
    }
  }
  /** `live`: ignition and electrics working (not flickering off); `lamps`: the lamps switched on; at this health and moment (s). */
  update(live:boolean,lamps:boolean,health:number,time:number){
    for(const c of this.clusters)c.material.emissiveIntensity=live?c.base:0;
    for(const f of this.faces)f.emissiveIntensity=live&&lamps?DASH.dial:0;
    if(this.dials)this.dials.visible=live&&lamps;
    this.halo.visible=live&&lamps&&!this.inCar;
    this.lamp.visible=live&&health<DASH.warn&&Math.floor((Number.isFinite(time)?time:0)*DASH.blink*2)%2===0;
  }
  /** The camera sits in this car (or not): its cabin glow would wash over the view. */
  seat(inCar:boolean){this.inCar=inCar;if(inCar)this.halo.visible=false;}
  /** Lit right now: the cluster, the dial faces or the added dials. */
  get lit(){return this.clusters.some(c=>c.material.emissiveIntensity>0)||this.faces.some(f=>f.emissiveIntensity>0)||!!this.dials?.visible;}
  dispose(){
    for(const c of this.clusters)c.material.emissiveIntensity=c.base;for(const f of this.faces)f.emissiveIntensity=0;
    if(this.dials){this.dials.removeFromParent();this.dials.geometry.dispose();const m=this.dials.material as T.MeshBasicMaterial;m.map?.dispose();m.dispose();}
    this.lamp.removeFromParent();this.lamp.geometry.dispose();(this.lamp.material as T.Material).dispose();
    this.halo.removeFromParent();const h=(this.halo.children[0] as T.Mesh).material as T.MeshBasicMaterial;h.map?.dispose();h.dispose();for(const m of this.halo.children)(m as T.Mesh).geometry.dispose();
  }
}
