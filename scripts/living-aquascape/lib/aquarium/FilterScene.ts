import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export const filterParts=[
 {name:'Canister & base',role:'A sealed pressure vessel',text:'The outer canister holds the media stack and keeps the water path sealed. The removable base supports the baskets; the open section here is a viewing cutaway.'},
 {name:'Coarse foam',role:'First mechanical stage',text:'Incoming water travels down the side channel and rises through coarse foam. Large debris is trapped before it reaches the finer layers.'},
 {name:'Fine foam',role:'Smaller suspended particles',text:'A finer sponge catches smaller particles. Trapped debris increases resistance, so circulation gradually falls as the filter becomes dirty.'},
 {name:'Ceramic bio-media',role:'Surface area for biofilm',text:'Water and dissolved oxygen pass around porous ceramic rings. Biofilms on wetted surfaces help convert ammonia to nitrite and then nitrate; the rings do not sterilize the water.'},
 {name:'Polishing pad',role:'Final particle capture',text:'The upper pad catches fine particles before the water reaches the pump. Media order varies between filter designs; this exhibit uses a bottom-to-top flow path.'},
 {name:'Head seal & clamps',role:'Keep the canister watertight',text:'An O-ring seals the joint between the head and canister. The perimeter clamps retain the head. The seal must sit cleanly in its groove.'},
 {name:'Impeller & rotor',role:'The moving pump assembly',text:'A magnetic rotor turns the impeller on a stationary shaft. The impeller accelerates water into the outlet chamber. The motor windings sit outside the wet rotor chamber.'},
 {name:'Motor head',role:'Drive and water passages',text:'The head houses the motor, impeller chamber and return passage. Its cutaway exposes the copper-colored windings and wet rotor well. The rotor animation is slowed for inspection.'},
 {name:'Valves & hose block',role:'Inlet and return connections',text:'The inlet feeds the down-channel; the outlet receives water from the pump. Isolation levers close the connections for servicing. Never operate a real filter dry.'},
 {name:'Intake & return hoses',role:'Complete the circuit',text:'The intake strainer draws water from the aquarium. Filtered water returns through the other hose and lily outlet. The arrows show circulation, not a calibrated fluid simulation.'}
];
export class FilterScene{
 readonly renderer:T.WebGLRenderer;private scene=new T.Scene();private camera=new T.PerspectiveCamera(38,1,.1,100);private controls:OrbitControls;private groups:T.Group[]=[];private rotor=new T.Group();private shell:T.Mesh;private topShell:T.Mesh;private materials:T.MeshStandardMaterial[]=[];private flow=new T.Group();private dots:T.Mesh[]=[];private path:T.CatmullRomCurve3;private explosion=0;private target=0;private tick=0;private request=0;private observer:ResizeObserver;private environment:T.WebGLRenderTarget;private pointerStart={x:0,y:0};private dead=false;private selected=3;private rotation=false;private running=true;
 constructor(private host:HTMLElement,private onPick:(id:number)=>void,private reduced=false){
 this.renderer=new T.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.setClearColor(0x06100f);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.3;host.appendChild(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','3D canister filter. Drag to orbit, scroll or pinch to zoom. Select components with the parts list.');this.renderer.domElement.setAttribute('role','img');
 const pmrem=new T.PMREMGenerator(this.renderer),room=new RoomEnvironment();this.environment=pmrem.fromScene(room,.04);this.scene.environment=this.environment.texture;room.dispose();pmrem.dispose();
 this.camera.position.set(7,5,10);this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,2.2,0);this.controls.enableDamping=!reduced;this.controls.minDistance=6;this.controls.maxDistance=22;this.controls.maxPolarAngle=Math.PI*.85;
 this.scene.add(new T.HemisphereLight(0xc8ede3,0x173025,2));const key=new T.DirectionalLight(0xd2f9ff,4);key.position.set(4,8,5);this.scene.add(key);const rim=new T.PointLight(0xffc06c,35);rim.position.set(-4,4,-2);this.scene.add(rim);
 const metal=this.mat(0x798e90,.27,.86),dark=this.mat(0x122c2c,.4,.35),rubber=this.mat(0x111918,.8,0),gold=this.mat(0xc9a36b,.4,.6),cyan=this.mat(0x59bcd3,.3,.25),ceramic=this.mat(0xc4b9a0,.85,0);
 for(let i=0;i<10;i++){const g=new T.Group();g.userData.part=i;this.groups.push(g);this.scene.add(g);}
 const cylinder=(r:number,h:number,material:T.Material,g:T.Object3D,y:number)=>{const m=new T.Mesh(new T.CylinderGeometry(r,r,h,64),material);m.position.y=y;g.add(m);return m;};
 const ring=(r:number,t:number,material:T.Material,g:T.Object3D,y:number)=>{const m=new T.Mesh(new T.TorusGeometry(r,t,12,72),material);m.rotation.x=Math.PI/2;m.position.y=y;g.add(m);return m;};
 const tube=(points:number[][],r:number,mat:T.Material,g:T.Object3D)=>{const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p as [number,number,number])));const m=new T.Mesh(new T.TubeGeometry(path,64,r,12,false),mat);g.add(m);return path;};
 cylinder(1.45,.24,metal,this.groups[0],.12);cylinder(1.30,.12,dark,this.groups[0],.3);ring(1.39,.07,metal,this.groups[0],3.66);
 const shellMaterial=metal.clone();shellMaterial.side=T.DoubleSide;this.materials.push(shellMaterial);this.shell=new T.Mesh(new T.CylinderGeometry(1.39,1.39,3.3,80,1,true,.65,Math.PI*1.35),shellMaterial);this.shell.position.y=1.98;this.groups[0].add(this.shell);
 // Fine etched horizontal rings and support feet.
 for(const y of [.42,3.45])ring(1.40,.025,metal,this.groups[0],y);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;const foot=cylinder(.18,.18,rubber,this.groups[0],0);foot.position.x=Math.cos(a)*1.08;foot.position.z=Math.sin(a)*1.08;}
 const texture=(color:string,seed:number)=>{const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle=color;ctx.fillRect(0,0,128,128);let n=seed;for(let i=0;i<2000;i++){n=(Math.imul(n,1664525)+1013904223)>>>0;const x=n%128;n=(Math.imul(n,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#07100f88':'#ffffff22';ctx.beginPath();ctx.arc(x,n%128,seed===4?1:2,0,Math.PI*2);ctx.fill();}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;};
 const heights=[0,.78,1.45,2.19,3.05];
 for(const i of [1,2,3,4]){const g=this.groups[i],y=heights[i];ring(1.13,.045,metal,g,y-.25);ring(1.13,.045,dark,g,y+.25);cylinder(1.1,.06,dark,g,y-.28);
 for(let j=0;j<18;j++){const a=j/18*Math.PI*2,m=new T.Mesh(new T.BoxGeometry(.026,.5,.04),dark);m.position.set(Math.cos(a)*1.13,y,Math.sin(a)*1.13);g.add(m);}
 if(i!==3){const m=this.mat(i===1?0x33494a:i===2?0x416473:0xd3d0b6,.97,0);m.map=texture(i===1?'#33494a':i===2?'#416473':'#d3d0b6',i);cylinder(1.06,.44,m,g,y);}
 else{for(let layer=0;layer<3;layer++)for(let j=0;j<26;j++){const a=j*2.399,r=.90*Math.sqrt((j+.5)/26),m=new T.Mesh(new T.TorusGeometry(.105,.047,7,12),ceramic);m.position.set(Math.cos(a)*r,y-.17+layer*.17,Math.sin(a)*r);m.rotation.set(j*.6,layer*.8,j*.4);g.add(m);}}
 }
 ring(1.30,.065,rubber,this.groups[5],3.75);
 for(let i=0;i<4;i++){const a=i*Math.PI/2+.25;const clamp=new T.Mesh(new T.BoxGeometry(.17,.55,.18),metal);clamp.position.set(Math.cos(a)*1.44,3.75,Math.sin(a)*1.44);clamp.rotation.y=-a;this.groups[5].add(clamp);}
 this.rotor.position.y=4.15;this.groups[6].add(this.rotor);cylinder(.20,.66,dark,this.rotor,0);cylinder(.50,.08,cyan,this.rotor,-.26);
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const blade=new T.Mesh(new T.BoxGeometry(.35,.16,.05),cyan);blade.position.set(Math.cos(a)*.3,-.18,Math.sin(a)*.3);blade.rotation.y=-a+.35;this.rotor.add(blade);}cylinder(.04,.93,ceramic,this.groups[6],4.15);
 this.topShell=new T.Mesh(new T.CylinderGeometry(1.43,1.43,.7,64,1,true,.65,Math.PI*1.35),dark);this.topShell.position.y=4.15;this.groups[7].add(this.topShell);ring(1.4,.09,metal,this.groups[7],4.51);
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const coil=new T.Mesh(new T.TorusGeometry(.14,.055,8,16),gold);coil.position.set(Math.cos(a)*.72,4.22,Math.sin(a)*.72);coil.rotation.y=-a;this.groups[7].add(coil);}
 const cap=cylinder(1.34,.10,metal,this.groups[7],4.6);cap.material=metal;
 for(const [x,mat] of [[-.55,gold],[.55,cyan]] as const){const valve=cylinder(.18,.55,mat,this.groups[8],4.98);valve.position.x=x;const lever=new T.Mesh(new T.BoxGeometry(.55,.09,.17),dark);lever.position.set(x,5.2,0);this.groups[8].add(lever);}
 tube([[-.55,5.25,0],[-.7,5.8,0],[-2.5,5.6,0],[-2.8,3.8,0]],.10,gold,this.groups[9]);tube([[.55,5.25,0],[.7,5.9,0],[2.4,5.7,0],[2.8,4.1,0]],.10,cyan,this.groups[9]);
 const strainer=cylinder(.2,.65,dark,this.groups[9],3.65);strainer.position.x=-2.8;for(let i=0;i<6;i++){const rr=ring(.21,.02,gold,this.groups[9],3.4+i*.1);rr.position.x=-2.8;}
 const mouth=new T.Mesh(new T.ConeGeometry(.33,.55,32,1,true),cyan);mouth.rotation.z=Math.PI*.7;mouth.position.set(2.85,3.95,0);this.groups[9].add(mouth);
 // An exposed inlet down-channel feeds the plenum beneath the media stack.
 tube([[-.55,4.8,-.35],[-1.17,3.5,-.35],[-1.17,.42,-.35],[0,.4,0]],.055,gold,this.groups[0]);
 this.path=tube([[-2.8,3.5,.2],[-2.6,5.55,.2],[-.55,5.6,.2],[-1.17,3.6,.2],[-1.17,.40,.2],[0,.4,.2],[0,1.4,.2],[0,3.2,.2],[0,4.1,.2],[.55,5.5,.2],[2.4,5.6,.2],[2.85,4,.2]],.017,new T.MeshBasicMaterial({color:0x65cbe0,transparent:true,opacity:.30}),this.flow);this.scene.add(this.flow);
 const dotGeo=new T.SphereGeometry(.047,8,6);for(let i=0;i<45;i++){const dot=new T.Mesh(dotGeo,new T.MeshBasicMaterial({color:i<20?0xe5b66e:0x76deef}));this.dots.push(dot);this.flow.add(dot);}
 const grid=new T.GridHelper(14,28,0x31534d,0x102623);grid.position.y=-.04;this.scene.add(grid);
 const floor=new T.Mesh(new T.CircleGeometry(6,80),this.mat(0x091512,.65,.25));floor.rotation.x=-Math.PI/2;floor.position.y=-.05;this.scene.add(floor);
 this.renderer.domElement.addEventListener('pointerdown',this.down);this.renderer.domElement.addEventListener('pointerup',this.up);this.observer=new ResizeObserver(this.resize);this.observer.observe(host);this.resize();this.select(3);
 let previous=performance.now();const loop=(now:number)=>{if(this.dead)return;const dt=Math.max(0,Math.min(.05,(now-previous)/1000));previous=now;if(this.running&&!this.reduced)this.tick+=dt;this.explosion+=(this.target-this.explosion)*(this.reduced?1:1-Math.exp(-dt*5));this.groups.forEach((g,i)=>{g.position.y=this.explosion*i*.43;});this.rotor.rotation.y=this.tick*4;this.flow.visible=this.running&&this.explosion<.08;this.dots.forEach((d,i)=>d.position.copy(this.path.getPointAt((this.tick*.09+i/45)%1)));this.controls.autoRotate=this.rotation&&!this.reduced;this.controls.autoRotateSpeed=.6;this.controls.update();this.renderer.render(this.scene,this.camera);this.request=requestAnimationFrame(loop);};this.request=requestAnimationFrame(loop);
 }
 private mat(color:number,roughness:number,metalness:number){const m=new T.MeshStandardMaterial({color,roughness,metalness});this.materials.push(m);return m;}
 setExplode(value:number){this.target=value;this.controls.target.y=2.2+value*2.5;this.camera.position.set(7,5+value*2,10+value*4);}
 setCutaway(cut:boolean){this.shell.visible=cut;this.topShell.visible=cut; // Cutaway exposes the front; ghost view removes the housing entirely.
 }
 setFlow(on:boolean){this.running=on;}
 setRotate(on:boolean){this.rotation=on;}
 reset(){this.camera.position.set(7,5+this.target*2,10+this.target*4);this.controls.target.set(0,2.2+this.target*2.5,0);this.controls.update();}
 select(id:number){this.selected=id;this.groups.forEach((g,i)=>g.traverse(o=>{if(o instanceof T.Mesh){if(!o.userData.originalMaterial)o.userData.originalMaterial=o.material;if(o.userData.highlight){o.material.dispose();o.userData.highlight=false;}o.material=o.userData.originalMaterial;if(i===id&&o.material instanceof T.MeshStandardMaterial){o.material=o.material.clone();o.material.emissive.set(0x438978);o.material.emissiveIntensity=.28;o.userData.highlight=true;}}}));}
 private resize=()=>{const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.camera.aspect=w/h;this.camera.zoom=w/h<.9?.70:1;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h);};
 private down=(e:PointerEvent)=>{this.pointerStart={x:e.clientX,y:e.clientY};};
 private up=(e:PointerEvent)=>{if(Math.hypot(e.clientX-this.pointerStart.x,e.clientY-this.pointerStart.y)>5)return;const rect=this.renderer.domElement.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),this.camera);const hit=ray.intersectObjects(this.groups,true).find(h=>h.object.visible);if(!hit)return;let object:T.Object3D|null=hit.object;while(object&&object.userData.part===undefined)object=object.parent;if(object)this.onPick(object.userData.part);};
 dispose(){this.dead=true;cancelAnimationFrame(this.request);this.observer.disconnect();this.controls.dispose();this.renderer.domElement.removeEventListener('pointerdown',this.down);this.renderer.domElement.removeEventListener('pointerup',this.up);const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();this.scene.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of [o.material,o.userData.originalMaterial].flat()){if(m){materials.add(m);if(m.map)textures.add(m.map);}}}});this.materials.forEach(m=>materials.add(m));geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());this.environment.dispose();this.renderer.dispose();this.renderer.domElement.remove();}
}
