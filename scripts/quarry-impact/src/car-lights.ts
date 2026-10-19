import * as T from 'three';
/** Working lamps for low-light moods: headlamp lenses and tail lamps glow (brighter tails
 * under braking) and a soft additive pool of light sits on the road ahead. Lamp meshes are
 * found by their material names (Headlight / Lens; Brakelight / Tail Lens) and their position
 * along the car, so every model works without per-car tables. Off by default. */
const HEAD=/headlight|(^|\s)lens$/i,TAIL=/brakelight|tail lens/i,NOT_HEAD=/tail|amber|reverse|indicator|signal|brake/i;
let poolTexture:T.Texture|null=null;
function lightPool(){
 if(poolTexture||typeof document==='undefined')return poolTexture;
 const c=document.createElement('canvas');c.width=128;c.height=256;const ctx=c.getContext('2d');if(!ctx)return null;
 // A soft elliptical beam that fades to nothing well inside the texture edges.
 ctx.translate(64,26);ctx.scale(1,3.4);const g=ctx.createRadialGradient(0,0,2,0,0,60);g.addColorStop(0,'rgba(255,238,200,0.95)');g.addColorStop(.4,'rgba(255,228,175,0.42)');g.addColorStop(.75,'rgba(255,222,165,0.12)');g.addColorStop(1,'rgba(255,220,160,0)');
 ctx.fillStyle=g;ctx.fillRect(-64,-8,128,72);poolTexture=new T.CanvasTexture(c);poolTexture.colorSpace=T.SRGBColorSpace;return poolTexture;
}
export type CarLights={readonly head:number;readonly tail:number;set(on:boolean,braking?:boolean):void;dispose():void};
export function attachCarLights(root:T.Object3D,halfLength:number):CarLights{
 root.updateMatrixWorld(true);
 const inverse=root.matrixWorld.clone().invert(),centre=new T.Vector3(),box=new T.Box3();
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
 const poolMesh=new T.Mesh(poolGeometry,poolMaterial);poolMesh.name='car_light_pool';poolMesh.rotation.x=-Math.PI/2;poolMesh.position.set(0,.06,halfLength+5.2);poolMesh.renderOrder=2;poolMesh.visible=false;poolMesh.frustumCulled=true;
 if(pool&&heads.length)root.add(poolMesh);
 let lit=false,brake=false;
 return{head:heads.length,tail:tails.length,
  set(on,braking=false){
   if(on===lit&&braking===brake)return;
   if(on!==lit){for(const m of headMats)m.emissiveIntensity=on?2.4:0;poolMesh.visible=on&&!!pool;poolMaterial.opacity=on?.38:0;}
   for(const m of tailMats)m.emissiveIntensity=on?(braking?3.2:1.1):(braking?.8:0);
   lit=on;brake=braking;
  },
  dispose(){poolMesh.removeFromParent();poolGeometry.dispose();poolMaterial.dispose();for(const m of owned)m.dispose();}};
}
