import * as T from 'three';
/** Working lamps for low-light moods: headlamp lenses and tail lamps glow (brighter tails
 * under braking) and a soft additive pool of light sits on the road ahead. Lamp meshes are
 * found by their material names (Headlight / Lens; Brakelight / Tail Lens) and their position
 * along the car, so every model works without per-car tables. Off by default. */
/** A lamp knocked off, or dented past this much damage, is smashed and stays dark. */
export const LAMP_BREAK=10;
/** Tail lamp glow: lit for the mood (running) or braking with the lamps on, and braking in daylight, bright enough to read in sun. */
export const TAIL_GLOW={running:1.1,braking:3.2,daylightBraking:3} as const;
/** Reversing lamps glow white at REVERSE_GLOW while the car backs up faster than REVERSE_SPEED m/s (offline), day or night. */
export const REVERSE_GLOW=2.6,REVERSE_SPEED=.6;
/** Hazard lights (offline): a wrecked car with its electrics still working flashes its amber indicators, HAZARD.on s lit
 * in every HAZARD.period s, at HAZARD.glow; an end of the car built without indicators gets an amber lens fitted
 * HAZARD.outset m outboard of each lamp there. */
export const HAZARD={period:.8,on:.42,glow:4,outset:.13,width:.09,height:.06,depth:.012,proud:.006} as const;
/** Rear fog lamp (offline): in the rain a single bright red lamp glows at FOG.glow in the rear bumper on the driver's side,
 * FOG.drop m below that side's tail lamp, FOG.width by FOG.height m, set FOG.proud m out from the bumper skin there (the
 * tail lamp's own face where no bumper is found within FOG.reach m of it). It is out with its tail lamp or its bumper. */
export const FOG={glow:2.4,drop:.17,width:.12,height:.05,depth:.014,proud:.006,reach:.35,minX:.25} as const;
/** Whether the hazards are lit at this moment (seconds) for a car whose flasher started at `phase`. */
export const hazardLit=(time:number,phase=0)=>Number.isFinite(time)&&((time+phase)%HAZARD.period+HAZARD.period)%HAZARD.period<HAZARD.on;
/** A smashed lamp's lens goes dark (its colour times shade) and dull (roughness at least rough): an empty socket and shards. */
export const BROKEN_LENS={shade:.3,rough:.85} as const;
/** Rain (offline): drivers run their lamps in the gloom, lenses and tails lit as at dusk, but the pool of light on the
 * road is only RAIN_LIGHTS.pool as strong against the daylight. */
export const RAIN_LIGHTS={pool:.45} as const;
/** Rain (offline): each side's headlamp beam shows in the falling rain as a faint cone of light, RAIN_BEAMS.length m long and
 * RAIN_BEAMS.spread m across at its far end, dipped RAIN_BEAMS.dip rad, fading along its length and at its edges, at the
 * strength the caller gives (RAIN_BEAMS.strength in rain, 0 hides it); a side with every lamp smashed throws none. */
export const RAIN_BEAMS={length:9,spread:1.1,dip:.06,strength:.3} as const;
/** Tail glow (offline): the same rain or dust lights up red behind each side's tail lamps, a short cone TAIL_GLOW_BEAM.length
 * m long and TAIL_GLOW_BEAM.spread m across, at TAIL_GLOW_BEAM.running of the beams' strength with the lamps on and full
 * (TAIL_GLOW_BEAM.braking) on the brakes; a side with every tail lamp smashed throws none. */
export const TAIL_GLOW_BEAM={length:4.2,spread:.8,running:.5,braking:1.6,color:0xff2410} as const;
/** A lens reaching past LAMP_BAR.span m either side of the middle is a pair of lamps under one cover: it shines from both
 * ends, LAMP_BAR.inset m in from each. */
export const LAMP_BAR={span:.25,inset:.18} as const;
const HEAD=/headlight|(^|\s)lens$/i,TAIL=/brakelight|tail lens/i,NOT_HEAD=/tail|amber|reverse|indicator|signal|brake/i,REVERSE=/reverse/i,INDICATOR=/indicator|signal|amber|turn ?lamp|blinker/i;
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
export type CarLights={readonly head:number;readonly tail:number;readonly reverse:number;readonly indicator:number;
 /** Rear fog lamp (fitted offline on the driver's side): lit in the rain unless smashed or gone. */
 fog(on:boolean):void;readonly fogLit:boolean;readonly fogLamp:T.Mesh|null;
 /** Hazard lights flashing (a wrecked car), at this moment (seconds). */
 hazards(on:boolean,time:number):void;readonly flashing:boolean;readonly working:number;readonly lit:boolean;
 /** Reversing lamps on while the car backs up. */
 reversing(on:boolean):void;readonly backing:boolean;
 /** Lamps on or off, braking, and the road pool's strength 0–1 (1 at dusk). */
 set(on:boolean,braking?:boolean,pool?:number,beam?:number):void;aim(yaw:number,reach:number):void;dispose():void;
 /** Yellows and clouds the headlamp lenses this far (0–1, once): an old car's lamps shine dimmer and warmer (HAZE). */
 yellow(haze:number):void;
 /** This headlamp's bulb (by index) has gone: its lens stays dark and it lights nothing (an old car's dead bulb). */
 kill(index:number):void;
 /** Loose wiring: while `off`, every lamp on the car is dark, head, tail and brake alike (a flicker, set each frame). */
 flick(off:boolean):void;
 /** Told where a lamp is when it first breaks (its lens centre in the world), head or tail. */
 onSmash?:(at:T.Vector3,kind:'head'|'tail')=>void;
 /** A lamp mesh, for QA. */
 lamp(kind:'head'|'tail',index:number):T.Mesh|undefined;
 /** Push where this car's lamps are shining from now (world space): each side's lit, unsmashed headlamps, and tail lamps
  * while lit or braking, with the way each faces on the ground (dx, dz) and whether the tails are braking. */
 glows(out:{x:number;y:number;z:number;tail:boolean;brake?:boolean;dx?:number;dz?:number}[],root:T.Object3D):void};
/** Yellowed headlamps (offline, an old car's age): the plastic lenses go cloudy and yellow in the sun — HAZE.cloud of the way to
 * HAZE.lens and up to HAZE.rough rough — and the lamps behind them shine HAZE.dim dimmer and HAZE.tint of the way to HAZE.warm, on
 * the road and in the rain alike. */
export const HAZE={dim:.42,tint:.85,warm:0xffb654,cloud:.8,lens:0xd09a30,rough:.45} as const;
/** Lens fitted inboard of each tail lamp on a car built without reversing lamps (offline): REVERSE_FIT m across and
 * high, REVERSE_FIT.inset m in from the tail lamp's middle. */
export const REVERSE_FIT={width:.1,height:.05,depth:.012,inset:.14,drop:.015,proud:.006,minX:.3} as const;
export function attachCarLights(root:T.Object3D,halfLength:number,options:{fitReverse?:boolean;driverSide?:number}={}):CarLights{
 root.updateMatrixWorld(true);
 const inverse=root.matrixWorld.clone().invert(),centre=new T.Vector3(),box=new T.Box3();
 // The road under the car (its lowest point, the tyres) in the root's space: the pool of light lies just above it.
 const floor=new T.Box3().setFromObject(root).min.y-root.getWorldPosition(new T.Vector3()).y,poolY=(Number.isFinite(floor)?floor:0)+.06;
 const heads:T.Mesh[]=[],tails:T.Mesh[]=[],reverses:T.Mesh[]=[],indicators:T.Mesh[]=[];
 root.traverse(o=>{
  if(!(o instanceof T.Mesh)||Array.isArray(o.material))return;const name=(o.material as T.Material).name??'';
  box.setFromObject(o).getCenter(centre);centre.applyMatrix4(inverse);
  if(HEAD.test(name)&&!NOT_HEAD.test(name)&&centre.z>halfLength*.35)heads.push(o);
  else if(TAIL.test(name)&&centre.z< -halfLength*.35)tails.push(o);
  else if(REVERSE.test(name)&&centre.z< -halfLength*.35)reverses.push(o);
  else if(INDICATOR.test(name)&&Math.abs(centre.z)>halfLength*.35)indicators.push(o);
 });
 // Each car gets its own lamp materials so one car's lights never switch another's.
 const owned:T.Material[]=[];
 // A lamp's own copy of its material keeps the shader work done on the original (clone() drops onBeforeCompile): the
 // lens fracturing, the dirt, wet and dust films.
 const keep=<M extends T.Material>(from:M,to:M)=>{to.onBeforeCompile=from.onBeforeCompile;to.customProgramCacheKey=from.customProgramCacheKey;return to;};
 const own=(mesh:T.Mesh,color:number)=>{const m=keep(mesh.material as T.MeshStandardMaterial,(mesh.material as T.MeshStandardMaterial).clone());m.emissive=new T.Color(color);m.emissiveIntensity=0;mesh.material=m;owned.push(m);return m;};
 const headMats=heads.map(m=>own(m,0xfff1d0)),tailMats=tails.map(m=>own(m,0xff2a1a)),reverseMats=reverses.map(m=>own(m,0xfff6ea));
 const pool=lightPool(),poolMaterial=new T.MeshBasicMaterial({map:pool,color:0xffffff,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),poolGeometry=new T.PlaneGeometry(4.6,11);
 const poolMesh=new T.Mesh(poolGeometry,poolMaterial);poolMesh.name='car_light_pool';poolMesh.rotation.x=-Math.PI/2;poolMesh.position.set(0,poolY,halfLength+5.2);poolMesh.renderOrder=2;poolMesh.visible=false;poolMesh.frustumCulled=true;
 if(pool&&heads.length)root.add(poolMesh);
 // Where each lamp shines from (root space): its middle, or both ends when one lens spans the car.
 const lampPoints=(list:T.Mesh[])=>list.flatMap((m,i)=>{box.setFromObject(m);const lo=box.min.clone().applyMatrix4(inverse),hi=box.max.clone().applyMatrix4(inverse),c=box.getCenter(new T.Vector3()).applyMatrix4(inverse),minX=Math.min(lo.x,hi.x),maxX=Math.max(lo.x,hi.x);
  return minX< -LAMP_BAR.span&&maxX>LAMP_BAR.span?[{i,c:new T.Vector3(minX+LAMP_BAR.inset,c.y,c.z)},{i,c:new T.Vector3(maxX-LAMP_BAR.inset,c.y,c.z)}]:[{i,c}];});
 // A beam per side of the car from its headlamps' middle, for the rain.
 const beamGeometry=new T.ConeGeometry(RAIN_BEAMS.spread,RAIN_BEAMS.length,16,1,true).rotateX(-Math.PI/2).translate(0,0,RAIN_BEAMS.length/2);
 const beamMaterial=new T.ShaderMaterial({uniforms:{strength:{value:0},color:{value:new T.Color(0xfff1d0)}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
  vertexShader:`varying float vAlong;varying vec3 vNormal2;varying vec3 vView;void main(){vAlong=position.z/${RAIN_BEAMS.length}.;vec4 mv=modelViewMatrix*vec4(position,1.);vNormal2=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform float strength;uniform vec3 color;varying float vAlong;varying vec3 vNormal2;varying vec3 vView;void main(){float t=clamp(vAlong,0.,1.),a=strength*pow(1.-t,1.6)*smoothstep(0.,.06,t)*pow(abs(dot(normalize(vNormal2),normalize(vView))),1.3);gl_FragColor=vec4(color*a,a);}`});
 const beams=([-1,1] as const).map(side=>{
  const lamps=lampPoints(heads).filter(l=>Math.sign(l.c.x||1)===side);if(!lamps.length)return null;
  const mesh=new T.Mesh(beamGeometry,beamMaterial);mesh.name='car_light_beam';mesh.position.copy(lamps.reduce((s,l)=>s.add(l.c),new T.Vector3()).multiplyScalar(1/lamps.length));
  mesh.rotation.order='YXZ';mesh.rotation.x=RAIN_BEAMS.dip;mesh.renderOrder=2;mesh.visible=false;root.add(mesh);return {mesh,lamps:lamps.map(l=>l.i)};
 }).filter(b=>b!==null);
 // And a red glow per side behind the tail lamps, for the same rain or dust.
 const tailBeamGeometry=new T.ConeGeometry(TAIL_GLOW_BEAM.spread,TAIL_GLOW_BEAM.length,14,1,true).rotateX(-Math.PI/2).translate(0,0,TAIL_GLOW_BEAM.length/2);
 const tailBeamMaterial=new T.ShaderMaterial({uniforms:{strength:{value:0},color:{value:new T.Color(TAIL_GLOW_BEAM.color)}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
  vertexShader:beamMaterial.vertexShader.replace(`/${RAIN_BEAMS.length}.`,`/${TAIL_GLOW_BEAM.length.toFixed(2)}`),fragmentShader:beamMaterial.fragmentShader});
 const tailBeams=([-1,1] as const).map(side=>{
  const lamps=lampPoints(tails).filter(l=>Math.sign(l.c.x||1)===side);if(!lamps.length)return null;
  const mesh=new T.Mesh(tailBeamGeometry,tailBeamMaterial);mesh.name='car_tail_glow';mesh.position.copy(lamps.reduce((s,l)=>s.add(l.c),new T.Vector3()).multiplyScalar(1/lamps.length));
  mesh.rotation.order='YXZ';mesh.rotation.y=Math.PI;mesh.rotation.x=RAIN_BEAMS.dip;mesh.renderOrder=2;mesh.visible=false;root.add(mesh);return {mesh,lamps:lamps.map(l=>l.i)};
 }).filter(b=>b!==null);
 // Each side's lamps and their middle, for the light they throw.
 const sidesOf=(list:T.Mesh[])=>([-1,1] as const).map(side=>{const ls=lampPoints(list).filter(l=>Math.sign(l.c.x||1)===side);
  return ls.length?{at:ls.reduce((sum,l)=>sum.add(l.c),new T.Vector3()).multiplyScalar(1/ls.length),lamps:ls.map(l=>l.i)}:null;}).filter(b=>b!==null);
 const headSides=sidesOf(heads),tailSides=sidesOf(tails),glowAt=new T.Vector3(),facing=new T.Vector3();let backing=false;
 // A car built without reversing lamps gets a small clear lens fitted inboard of each tail lamp; it goes with that lamp.
 const fitted=new Map<T.Mesh,{tail:T.Mesh;parent:T.Object3D|null}>(),fitGeometry=new T.BoxGeometry(REVERSE_FIT.width,REVERSE_FIT.height,REVERSE_FIT.depth);
 if(options.fitReverse&&!reverses.length)for(const side of tailSides){
  if(Math.abs(side.at.x)<REVERSE_FIT.minX)continue;const tail=tails[side.lamps[0]];let rear=Infinity;
  for(const i of side.lamps){box.setFromObject(tails[i]);for(const z of [box.min.z,box.max.z])rear=Math.min(rear,new T.Vector3(0,0,z).applyMatrix4(inverse).z);}
  const material=new T.MeshStandardMaterial({name:'Reverse lens (fitted)',color:0xd9dcdf,roughness:.15,metalness:.1,emissive:new T.Color(0xfff6ea),emissiveIntensity:0});owned.push(material);reverseMats.push(material);
  const lens=new T.Mesh(fitGeometry,material);lens.name='reverse_lens_fitted';lens.position.set(side.at.x-Math.sign(side.at.x)*REVERSE_FIT.inset,side.at.y-REVERSE_FIT.drop,(Number.isFinite(rear)?rear:side.at.z)-REVERSE_FIT.proud);
  root.add(lens);reverses.push(lens);fitted.set(lens,{tail,parent:tail.parent});
 }
 const reverseSides=sidesOf(reverses);
 // The rear fog lamp: in the bumper below the tail lamp on the driver's side, found by casting in from behind.
 let fogLens:T.Mesh|null=null,fogTail:T.Mesh|null=null,fogTailParent:T.Object3D|null=null,fogPanel:T.Mesh|null=null,fogOn=false;
 const fogSide=options.fitReverse?tailSides.find(side=>Math.sign(side.at.x)===Math.sign(options.driverSide??1)&&Math.abs(side.at.x)>=FOG.minX)??null:null;
 if(fogSide){
  fogTail=tails[fogSide.lamps[0]];fogTailParent=fogTail.parent;let face=Infinity;
  // The tail lamps' back face in the car's own frame, wherever the car stands.
  const toCar=new T.Matrix4();for(const i of fogSide.lamps){const g=tails[i].geometry;if(!g.boundingBox)g.computeBoundingBox();face=Math.min(face,box.copy(g.boundingBox!).applyMatrix4(toCar.multiplyMatrices(inverse,tails[i].matrixWorld)).min.z);}
  const at=new T.Vector3(fogSide.at.x,fogSide.at.y-FOG.drop,(Number.isFinite(face)?face:fogSide.at.z)-FOG.reach),ray=new T.Raycaster(at.clone().applyMatrix4(root.matrixWorld),new T.Vector3(0,0,1).transformDirection(root.matrixWorld),0,FOG.reach*2),hits:T.Intersection[]=[];
  // Straight at each panel: the draw batches take the panels off every layer, which intersectObjects skips.
  root.traverse(o=>{if(o instanceof T.Mesh&&o.name.startsWith('panel_'))o.raycast(ray,hits);});hits.sort((a,b)=>a.distance-b.distance);
  const hit=hits[0];if(hit){fogPanel=hit.object as T.Mesh;at.z=hit.point.clone().applyMatrix4(inverse).z;}else at.z=Number.isFinite(face)?face:fogSide.at.z;
  const material=new T.MeshStandardMaterial({name:'Rear fog lens (fitted)',color:0x8e1610,roughness:.18,metalness:.1,emissive:new T.Color(0xff0000),emissiveIntensity:0});owned.push(material);
  fogLens=new T.Mesh(new T.BoxGeometry(FOG.width,FOG.height,FOG.depth),material);fogLens.name='fog_lens_fitted';fogLens.position.set(at.x,at.y,at.z-FOG.proud);root.add(fogLens);
 }
 const fogOut=()=>!fogLens||!fogTail||!fogTail.visible||fogTail.parent!==fogTailParent||(fogTail.userData.damage??0)>LAMP_BREAK||!!fogPanel&&(!fogPanel.visible||!fogPanel.parent);
 // Indicators: the car's own, plus an amber lens fitted outboard of each lamp at an end built without any.
 // Offline only; each keeps its own look (some glow amber already) between flashes.
 const indicatorMats:T.MeshStandardMaterial[]=[],indicatorBase:{color:T.Color;intensity:number}[]=[];
 if(!options.fitReverse)indicators.length=0;
 for(const m of indicators){const material=keep(m.material as T.MeshStandardMaterial,(m.material as T.MeshStandardMaterial).clone());m.material=material;owned.push(material);indicatorMats.push(material);indicatorBase.push({color:material.emissive?.clone()??new T.Color(0),intensity:material.emissiveIntensity??0});}
 const fitAmber=new T.BoxGeometry(HAZARD.width,HAZARD.height,HAZARD.depth),fittedAmber:{lens:T.Mesh;lamp:T.Mesh;parent:T.Object3D|null}[]=[];
 if(options.fitReverse)for(const [end,list,lampSides] of [[1,heads,headSides],[-1,tails,tailSides]] as const){
  if(indicators.some(m=>Math.sign(box.setFromObject(m).getCenter(centre).applyMatrix4(inverse).z)===end))continue;
  for(const side of lampSides){if(Math.abs(side.at.x)<REVERSE_FIT.minX)continue;const lamp=list[side.lamps[0]];let face=end>0?-Infinity:Infinity;
   for(const i of side.lamps){box.setFromObject(list[i]);for(const z of [box.min.z,box.max.z]){const lz=new T.Vector3(0,0,z).applyMatrix4(inverse).z;face=end>0?Math.max(face,lz):Math.min(face,lz);}}
   const material=new T.MeshStandardMaterial({name:'Indicator lens (fitted)',color:0xd98a2b,roughness:.2,metalness:.1,emissive:new T.Color(0xffa21a),emissiveIntensity:0});owned.push(material);indicatorMats.push(material);indicatorBase.push({color:new T.Color(0xffa21a),intensity:0});
   const lens=new T.Mesh(fitAmber,material);lens.name='indicator_lens_fitted';lens.position.set(side.at.x+Math.sign(side.at.x)*HAZARD.outset,side.at.y,(Number.isFinite(face)?face:side.at.z)+end*HAZARD.proud);
   root.add(lens);indicators.push(lens);fittedAmber.push({lens,lamp,parent:lamp.parent});}
 }
 let flashing=false,flashLit=false;
 // A fitted lens is gone with its tail lamp: smashed, knocked off or left hanging.
 const reverseOut=(m:T.Mesh)=>{const f=fitted.get(m);return f?!f.tail.visible||f.tail.parent!==f.parent||(f.tail.userData.damage??0)>LAMP_BREAK:smashed(m);};
 let lit=false,brake=false,broken=-1,level=1,beamLevel=0,haze=0,dead=0,flickering=false;
 const smashed=(m:T.Mesh)=>!m.visible||(m.userData.damage??0)>LAMP_BREAK;
 const api:CarLights={head:heads.length,tail:tails.length,reverse:reverses.length,indicator:indicators.length,get backing(){return backing;},
  get flashing(){return flashing;},
  get fogLit(){return fogOn;},get fogLamp(){return fogLens;},
  fog(on){if(!fogLens)return;const out=fogOut();fogLens.visible=!(fogTail&&(!fogTail.visible||fogTail.parent!==fogTailParent))&&!(fogPanel&&(!fogPanel.visible||!fogPanel.parent));
   const lit=!!on&&!out;if(lit===fogOn)return;fogOn=lit;(fogLens.material as T.MeshStandardMaterial).emissiveIntensity=lit?FOG.glow:0;},
  hazards(on,time){
   for(const f of fittedAmber)f.lens.visible=f.lamp.visible&&f.lamp.parent===f.parent;
   const lit=!!on&&hazardLit(time);if(!!on===flashing&&lit===flashLit&&!on)return;flashing=!!on;flashLit=lit;
   indicatorMats.forEach((m,i)=>{const f=fittedAmber.find(x=>x.lens===indicators[i]),out=f?!f.lens.visible||(f.lamp.userData.damage??0)>LAMP_BREAK:smashed(indicators[i]),base=indicatorBase[i];
    if(lit&&!out){m.emissive.setHex(0xffa21a);m.emissiveIntensity=HAZARD.glow;}else{m.emissive.copy(base.color);m.emissiveIntensity=out?0:base.intensity;}});
  },
  reversing(on){const lit=!!on;for(const [lens,f] of fitted)lens.visible=f.tail.visible&&f.tail.parent===f.parent;if(lit===backing&&!lit)return;backing=lit;reverseMats.forEach((m,i)=>{m.emissiveIntensity=lit&&!reverseOut(reverses[i])?REVERSE_GLOW:0;});},get working(){return heads.filter(m=>!smashed(m)).length;},get lit(){return lit;},
  set(on,braking=false,poolLevel=1,beam=0){
   if(flickering){on=false;braking=false;}
   const strength=Number.isFinite(poolLevel)?Math.max(0,Math.min(1,poolLevel)):1,shine=Number.isFinite(beam)?Math.max(0,Math.min(1,beam)):0;
   let mask=0;heads.forEach((m,i)=>{if(smashed(m))mask|=1<<i;});tails.forEach((m,i)=>{if(smashed(m))mask|=1<<(i+16);});
   // A lamp that has just broken leaves its pieces where it was.
   if(broken>=0&&api.onSmash)for(const [list,shift,kind] of [[heads,0,'head'],[tails,16,'tail']] as const)list.forEach((m,i)=>{if(mask&1<<(i+shift)&&!(broken&1<<(i+shift)))api.onSmash!(box.setFromObject(m).getCenter(new T.Vector3()),kind);});
   // and its lens goes dark and dull, once.
   if(broken>=0)for(const [list,shift] of [[headMats,0],[tailMats,16]] as const)list.forEach((m,i)=>{if(mask&1<<(i+shift)&&!(broken&1<<(i+shift))){m.color.multiplyScalar(BROKEN_LENS.shade);m.roughness=Math.max(m.roughness,BROKEN_LENS.rough);}});
   if(on===lit&&braking===brake&&mask===broken&&strength===level&&shine===beamLevel)return;
   const intact=heads.length?heads.filter((_,i)=>!((mask|dead)&1<<i)).length/heads.length:0;
   headMats.forEach((m,i)=>{m.emissiveIntensity=on&&!((mask|dead)&1<<i)?2.4*(1-HAZE.dim*haze):0;});
   poolMesh.visible=on&&!!pool&&intact>0;poolMaterial.opacity=on?.38*intact*strength*(1-HAZE.dim*haze):0;
   tailMats.forEach((m,i)=>{m.emissiveIntensity=mask&1<<(i+16)?0:on?(braking?TAIL_GLOW.braking:TAIL_GLOW.running):(braking?TAIL_GLOW.daylightBraking:0);});
   beamMaterial.uniforms.strength.value=shine;for(const b of beams)b.mesh.visible=on&&shine>0&&b.lamps.some(i=>!((mask|dead)&1<<i));
   tailBeamMaterial.uniforms.strength.value=shine*(braking?TAIL_GLOW_BEAM.braking:on?TAIL_GLOW_BEAM.running:0);for(const b of tailBeams)b.mesh.visible=(on||braking)&&shine>0&&b.lamps.some(i=>!(mask&1<<(i+16)));
   lit=on;brake=braking;broken=mask;level=strength;beamLevel=shine;
  },
  yellow(amount){
   const h=Number.isFinite(amount)?Math.max(0,Math.min(1,amount)):0,warm=new T.Color(HAZE.warm),lens=new T.Color(HAZE.lens);haze=h;
   headMats.forEach(m=>{m.emissive.lerp(warm,h*HAZE.tint);m.color.lerp(lens,h*HAZE.cloud);m.roughness=Math.max(m.roughness,HAZE.rough*h);});
   poolMaterial.color.lerp(warm,h*HAZE.tint);beamMaterial.uniforms.color.value.lerp(warm,h*HAZE.tint);level=-1;
  },
  flick(off){if(!!off!==flickering){flickering=!!off;level=-1;}},
  kill(index){if(Number.isInteger(index)&&index>=0&&index<heads.length){dead|=1<<index;level=-1;}},
  aim(yaw,reach){
   const y=Number.isFinite(yaw)?yaw:0,r=Math.max(.3,Math.min(1,Number.isFinite(reach)?reach:1)),d=halfLength+5.2*r;
   poolMesh.rotation.set(-Math.PI/2,0,y);poolMesh.scale.set(1,r,1);poolMesh.position.set(Math.sin(y)*(d-halfLength),poolY,halfLength+Math.cos(y)*(d-halfLength));
   for(const b of beams){b.mesh.rotation.y=y;b.mesh.scale.set(1,1,r);}
  },
  lamp(kind,index){return (kind==='head'?heads:tails)[index];},
  glows(out,root){
   if(!lit&&!brake&&!backing&&!fogOn)return;root.updateMatrixWorld();facing.set(0,0,1).transformDirection(root.matrixWorld).setY(0);if(facing.lengthSq()<1e-6)facing.set(0,0,1);facing.normalize();
   if(lit)for(const side of headSides)if(side.lamps.some(i=>!(broken&1<<i))){glowAt.copy(side.at).applyMatrix4(root.matrixWorld);out.push({x:glowAt.x,y:glowAt.y,z:glowAt.z,tail:false,dx:facing.x,dz:facing.z});}
   if(lit||brake)for(const side of tailSides)if(side.lamps.some(i=>!(broken&1<<(i+16)))){glowAt.copy(side.at).applyMatrix4(root.matrixWorld);out.push({x:glowAt.x,y:glowAt.y,z:glowAt.z,tail:true,brake,dx:-facing.x,dz:-facing.z});}
   // In the rain the fog lamp shines red behind it.
   if(fogOn&&fogLens){glowAt.copy(fogLens.position).applyMatrix4(root.matrixWorld);out.push({x:glowAt.x,y:glowAt.y,z:glowAt.z,tail:true,brake:true,dx:-facing.x,dz:-facing.z});}
   // Backing up, the reversing lamps shine white behind the car.
   if(backing)for(const side of reverseSides)if(side.lamps.some(i=>!reverseOut(reverses[i]))){glowAt.copy(side.at).applyMatrix4(root.matrixWorld);out.push({x:glowAt.x,y:glowAt.y,z:glowAt.z,tail:false,dx:-facing.x,dz:-facing.z});}
  },
  dispose(){fogLens?.removeFromParent();fogLens?.geometry.dispose();for(const lens of fitted.keys())lens.removeFromParent();fitGeometry.dispose();for(const f of fittedAmber)f.lens.removeFromParent();fitAmber.dispose();poolMesh.removeFromParent();poolGeometry.dispose();poolMaterial.dispose();for(const b of beams)b.mesh.removeFromParent();beamGeometry.dispose();beamMaterial.dispose();for(const b of tailBeams)b.mesh.removeFromParent();tailBeamGeometry.dispose();tailBeamMaterial.dispose();for(const m of owned)m.dispose();}};
 return api;
}
