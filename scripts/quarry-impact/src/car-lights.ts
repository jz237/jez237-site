import * as T from 'three';
/** Working lamps for low-light moods: headlamp lenses and tail lamps glow (brighter tails
 * under braking) and a soft additive pool of light sits on the road ahead. Lamp meshes are
 * found by their material names (Headlight / Lens; Brakelight / Tail Lens) and their position
 * along the car, so every model works without per-car tables. Off by default. */
/** A lamp knocked off, or dented past this much damage, is smashed and stays dark. */
export const LAMP_BREAK=10;
/** Tail lamp glow: lit for the mood (running) or braking with the lamps on, and braking in daylight, bright enough to read in sun. */
export const TAIL_GLOW={running:1.1,braking:3.2,daylightBraking:3} as const;
/** A smashed lamp's lens goes dark (its colour times shade) and dull (roughness at least rough): an empty socket and shards. */
export const BROKEN_LENS={shade:.3,rough:.85} as const;
/** Rain (offline): drivers run their lamps in the gloom, lenses and tails lit as at dusk, but the pool of light on the
 * road is only RAIN_LIGHTS.pool as strong against the daylight. */
export const RAIN_LIGHTS={pool:.45} as const;
const HEAD=/headlight|(^|\s)lens$/i,TAIL=/brakelight|tail lens/i,NOT_HEAD=/tail|amber|reverse|indicator|signal|brake/i;
let poolTexture:T.Texture|null=null;
function lightPool(){
 if(poolTexture||typeof document==='undefined')return poolTexture;
 const c=document.createElement('canvas');c.width=128;c.height=256;const ctx=c.getContext('2d');if(!ctx)return null;
 // A soft elliptical beam that fades to nothing well inside the texture edges.
 ctx.translate(64,26);ctx.scale(1,3.4);const g=ctx.createRadialGradient(0,0,2,0,0,60);g.addColorStop(0,'rgba(255,238,200,0.95)');g.addColorStop(.4,'rgba(255,228,175,0.42)');g.addColorStop(.75,'rgba(255,222,165,0.12)');g.addColorStop(1,'rgba(255,220,160,0)');
 ctx.fillStyle=g;ctx.fillRect(-64,-8,128,72);
 // Fade in from the car's end (the top rows) so the pool has no hard edge where it starts under the bumper.
 ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='destination-in';const fade=ctx.createLinearGradient(0,0,0,56);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(1,'rgba(0,0,0,1)');ctx.fillStyle=fade;ctx.fillRect(0,0,128,256);
 poolTexture=new T.CanvasTexture(c);poolTexture.colorSpace=T.SRGBColorSpace;return poolTexture;
}
/** A crushed front knocks the lamps askew: the pool of light swings toward the more crushed corner and falls short. */
export const HEADLIGHT_AIM={yaw:.4,short:.45} as const;
export function headlightAim(front:number,left:number,right:number){
 const c=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0)),f=c(front);
 return{yaw:(c(right)-c(left))*HEADLIGHT_AIM.yaw*(.5+f)+(f>0?HEADLIGHT_AIM.yaw*.25*f*(c(right)>=c(left)?1:-1):0),reach:1-HEADLIGHT_AIM.short*f};
}
export type CarLights={readonly head:number;readonly tail:number;readonly working:number;readonly lit:boolean;
 /** Lamps on or off, braking, and the road pool's strength 0–1 (1 at dusk). */
 set(on:boolean,braking?:boolean,pool?:number):void;aim(yaw:number,reach:number):void;dispose():void;
 /** Told where a lamp is when it first breaks (its lens centre in the world), head or tail. */
 onSmash?:(at:T.Vector3,kind:'head'|'tail')=>void;
 /** A lamp mesh, for QA. */
 lamp(kind:'head'|'tail',index:number):T.Mesh|undefined};
export function attachCarLights(root:T.Object3D,halfLength:number):CarLights{
 root.updateMatrixWorld(true);
 const inverse=root.matrixWorld.clone().invert(),centre=new T.Vector3(),box=new T.Box3();
 // The road under the car (its lowest point, the tyres) in the root's space: the pool of light lies just above it.
 const floor=new T.Box3().setFromObject(root).min.y-root.getWorldPosition(new T.Vector3()).y,poolY=(Number.isFinite(floor)?floor:0)+.06;
 const heads:T.Mesh[]=[],tails:T.Mesh[]=[];
 root.traverse(o=>{
  if(!(o instanceof T.Mesh)||Array.isArray(o.material))return;const name=(o.material as T.Material).name??'';
  box.setFromObject(o).getCenter(centre);centre.applyMatrix4(inverse);
  if(HEAD.test(name)&&!NOT_HEAD.test(name)&&centre.z>halfLength*.35)heads.push(o);
  else if(TAIL.test(name)&&centre.z< -halfLength*.35)tails.push(o);
 });
 // Each car gets its own lamp materials so one car's lights never switch another's.
 const owned:T.Material[]=[];
 const own=(mesh:T.Mesh,color:number)=>{const m=(mesh.material as T.MeshStandardMaterial).clone();m.emissive=new T.Color(color);m.emissiveIntensity=0;mesh.material=m;owned.push(m);return m;};
 const headMats=heads.map(m=>own(m,0xfff1d0)),tailMats=tails.map(m=>own(m,0xff2a1a));
 const pool=lightPool(),poolMaterial=new T.MeshBasicMaterial({map:pool,color:0xffffff,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),poolGeometry=new T.PlaneGeometry(4.6,11);
 const poolMesh=new T.Mesh(poolGeometry,poolMaterial);poolMesh.name='car_light_pool';poolMesh.rotation.x=-Math.PI/2;poolMesh.position.set(0,poolY,halfLength+5.2);poolMesh.renderOrder=2;poolMesh.visible=false;poolMesh.frustumCulled=true;
 if(pool&&heads.length)root.add(poolMesh);
 let lit=false,brake=false,broken=-1,level=1;
 const smashed=(m:T.Mesh)=>!m.visible||(m.userData.damage??0)>LAMP_BREAK;
 const api:CarLights={head:heads.length,tail:tails.length,get working(){return heads.filter(m=>!smashed(m)).length;},get lit(){return lit;},
  set(on,braking=false,pool=1){
   const strength=Number.isFinite(pool)?Math.max(0,Math.min(1,pool)):1;
   let mask=0;heads.forEach((m,i)=>{if(smashed(m))mask|=1<<i;});tails.forEach((m,i)=>{if(smashed(m))mask|=1<<(i+16);});
   // A lamp that has just broken leaves its pieces where it was.
   if(broken>=0&&api.onSmash)for(const [list,shift,kind] of [[heads,0,'head'],[tails,16,'tail']] as const)list.forEach((m,i)=>{if(mask&1<<(i+shift)&&!(broken&1<<(i+shift)))api.onSmash!(box.setFromObject(m).getCenter(new T.Vector3()),kind);});
   // and its lens goes dark and dull, once.
   if(broken>=0)for(const [list,shift] of [[headMats,0],[tailMats,16]] as const)list.forEach((m,i)=>{if(mask&1<<(i+shift)&&!(broken&1<<(i+shift))){m.color.multiplyScalar(BROKEN_LENS.shade);m.roughness=Math.max(m.roughness,BROKEN_LENS.rough);}});
   if(on===lit&&braking===brake&&mask===broken&&strength===level)return;
   const intact=heads.length?heads.filter((_,i)=>!(mask&1<<i)).length/heads.length:0;
   headMats.forEach((m,i)=>{m.emissiveIntensity=on&&!(mask&1<<i)?2.4:0;});
   poolMesh.visible=on&&!!pool&&intact>0;poolMaterial.opacity=on?.38*intact*strength:0;
   tailMats.forEach((m,i)=>{m.emissiveIntensity=mask&1<<(i+16)?0:on?(braking?TAIL_GLOW.braking:TAIL_GLOW.running):(braking?TAIL_GLOW.daylightBraking:0);});
   lit=on;brake=braking;broken=mask;level=strength;
  },
  aim(yaw,reach){
   const y=Number.isFinite(yaw)?yaw:0,r=Math.max(.3,Math.min(1,Number.isFinite(reach)?reach:1)),d=halfLength+5.2*r;
   poolMesh.rotation.set(-Math.PI/2,0,y);poolMesh.scale.set(1,r,1);poolMesh.position.set(Math.sin(y)*(d-halfLength),poolY,halfLength+Math.cos(y)*(d-halfLength));
  },
  lamp(kind,index){return (kind==='head'?heads:tails)[index];},
  dispose(){poolMesh.removeFromParent();poolGeometry.dispose();poolMaterial.dispose();for(const m of owned)m.dispose();}};
 return api;
}
