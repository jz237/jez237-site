import {createSchoolRoute,advanceSchoolRoute,schoolLane} from './SchoolRoute';
import {separateFish} from './FishCollisions';
import * as T from 'three';
import {Tetra3D} from './Tetra3D';
import {createTetraSwim,advanceTetraSwim,tetraBehaviorLabel,type TetraSwim} from './TetraSwimming';
import {waterSurface} from './WaterSurface';
import {plantMotion,depthOcclusion} from './SceneDepth';
import {illumination,type Ecology,type Environment} from './Ecosystem';
export type FishInfo={id:number;species:string;size:number;speed:number;hunger:number;mood:string;preferredDepth:string;energy?:number;reason?:string};
type Swimmer={mesh:T.Mesh<T.PlaneGeometry,T.ShaderMaterial>;x:number;y:number;vx:number;vy:number;targetX:number;targetY:number;size:number;phase:number;depth:number;species:number;turn:number};
const W=1672,H=941;
const vertex='varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';
// Broad, rooted displacement fields move whole stems together, including red plants.
// Positions are authored against the foundation image; no whole-tank wobble.
const fragment=`precision highp float;
uniform sampler2D photograph,macroPhoto;
uniform float time,flow,agitation,day,algae,biomass,macroBlend;
varying vec2 vUv;
float box(vec2 p,vec2 a,vec2 b,float edge){
 vec2 lo=smoothstep(a,a+edge,p),hi=1.0-smoothstep(b-edge,b,p);
 return lo.x*lo.y*hi.x*hi.y;
}
${waterSurface}
${plantMotion}
void main(){
 vec2 p=vUv;
 float tank=box(p,vec2(.168,.292),vec2(.799,.815),.012);
 vec2 drift=plantingOffset(p);
 p+=drift*tank;
 vec3 col=surfaceWater(vUv,texture2D(photograph,p).rgb);
 float leaf=smoothstep(.015,.11,col.g-max(col.r,col.b));
 float shimmer=sin(p.x*140.0+p.y*45.0-time*.4)*sin(p.y*89.0-time*.31);
 float caustic=pow(max(0.0,sin(p.x*115.0+p.y*39.0+time*.48)*sin(p.y*96.0-p.x*25.0-time*.37)),8.0);
 col+=vec3(.55,.75,.72)*(shimmer*.004+caustic*.035*leaf)*tank*day;
 float oldleaf=leaf*tank*(1.0-smoothstep(.3,.65,p.y));
 col=mix(col,col*vec3(.70,.84,.54),clamp(algae*oldleaf*.8,0.0,.6));
 float lamp=box(p,vec2(.215,.867),vec2(.773,.913),.008);
 col*=mix(1.0,.27+day*.73,clamp(tank+lamp,0.0,1.0));
 col=mix(col,texture2D(macroPhoto,vUv).rgb,macroBlend);
 gl_FragColor=vec4(col,1.0);
 #include <colorspace_fragment>
}`;
export class PhotographicScene{
 readonly canvas:HTMLCanvasElement;
 readonly renderer:T.WebGLRenderer;
 readonly scene=new T.Scene();
 readonly camera=new T.OrthographicCamera(-W/2,W/2,H/2,-H/2,-300,400);
 readonly ready:Promise<void>;
 onSelectedFish:((f:FishInfo|null)=>void)|null=null;
 onInspect:((name:string)=>void)|null=null;
 private background:T.Mesh<T.PlaneGeometry,T.ShaderMaterial>;
 private fish:Swimmer[]=[];
 private schoolRoute=createSchoolRoute();
 private tetras=new Map<number,{model:Tetra3D;swim:TetraSwim}>();
 private sprites:T.Texture[]=[];
 private photograph:T.Texture;private macro:T.Texture;
 private flow=new T.Group();private roots=new T.Group();private bubbles=new T.Group();private food=new T.Group();
 private bubbleData:{mesh:T.Mesh;x:number;y:number;originX:number;originY:number;speed:number;phase:number;co2:boolean}[]=[];
 private arrows:{mesh:T.Mesh;path:T.CatmullRomCurve3;phase:number}[]=[];
 private markers:{button:HTMLButtonElement;x:number;y:number;mode:string}[]=[];
 private dust:T.Points;private time=0;private mode='Living';private destroyed=false;private seed=237;private quality='High';
 private zoomTarget=1;private zoomCurrent=1;private centerX=0;private centerY=0;private targetX=0;private targetY=0;
 private pointer:{startX:number;startY:number;cx:number;cy:number;distance:number}|null=null;
 private pointers=new Map<number,{x:number;y:number}>();private pinch=0;private pinchZoom=1;
 private flowPhase=0;private selected:number|null=null;private feeding=0;private lastReport=0;private macroBlend=0;
 constructor(private host:HTMLElement){
 this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 this.renderer.setClearColor(0x050908);this.renderer.outputColorSpace=T.SRGBColorSpace;
 this.canvas=this.renderer.domElement;this.canvas.tabIndex=0;this.canvas.setAttribute('aria-label','Living aquascape. Drag to look around, scroll or pinch to zoom. Arrow keys pan; plus and minus zoom. Select a fish for details.');this.canvas.style.touchAction='none';host.appendChild(this.canvas);
 const loader=new T.TextureLoader();this.photograph=new T.Texture();this.macro=new T.Texture();
 this.background=new T.Mesh(new T.PlaneGeometry(W,H),new T.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{photograph:{value:this.photograph},macroPhoto:{value:this.macro},time:{value:0},flow:{value:.65},agitation:{value:.4},day:{value:1},algae:{value:.04},biomass:{value:1},macroBlend:{value:0}},depthTest:false}));
 this.background.position.z=-10;this.background.renderOrder=-10;this.scene.add(this.background,this.flow,this.roots,this.bubbles,this.food);
 const fill=new T.HemisphereLight(0xdbefff,0x234c35,2.2),key=new T.DirectionalLight(0xeaf5ff,2.1);key.position.set(-100,500,350);this.scene.add(fill,key);
 const photoPromise=loader.loadAsync('./aquascape.png').then(texture=>{if(this.destroyed){texture.dispose();return;}texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=this.renderer.capabilities.getMaxAnisotropy();this.photograph.dispose();this.photograph=texture;this.background.material.uniforms.photograph.value=texture;});
 const macroPromise=loader.loadAsync('./leaf-macro.png').then(texture=>{if(this.destroyed){texture.dispose();return;}texture.colorSpace=T.SRGBColorSpace;this.macro.dispose();this.macro=texture;this.background.material.uniforms.macroPhoto.value=texture;});
 this.ready=Promise.all([photoPromise,macroPromise,this.loadFish()]).then(()=>{});
 this.buildFlow();this.buildRoots();
 const particlePositions=[];for(let i=0;i<80;i++)particlePositions.push(320+this.random()*980-W/2,H/2-(205+this.random()*410),1);
 const dustGeometry=new T.BufferGeometry();dustGeometry.setAttribute('position',new T.Float32BufferAttribute(particlePositions,3));
 this.dust=new T.Points(dustGeometry,new T.PointsMaterial({size:1.1,color:0xc7d7c6,transparent:true,opacity:.18,depthWrite:false}));this.scene.add(this.dust);
 const ringGeometry=new T.RingGeometry(.65,1.15,10);const pearlMaterial=new T.MeshBasicMaterial({color:0xd5eee3,transparent:true,opacity:.45,side:T.DoubleSide,depthWrite:false});
 for(let i=0;i<62;i++){const co2=i<30;const x=co2?1252+this.random()*12:520+this.random()*665,y=co2?602:465+this.random()*150;const mesh=new T.Mesh(ringGeometry,pearlMaterial);mesh.position.copy(this.pos(x,y,3));mesh.scale.setScalar(co2?.7:1);this.bubbles.add(mesh);this.bubbleData.push({mesh,x,y:205+this.random()*(y-205),originX:x,originY:y,speed:co2?10+this.random()*6:14+this.random()*12,phase:this.random()*6,co2});}
 for(const [label,x,y,mode] of [['Plant',458,351,'plants'],['Roots',1000,609,'roots'],['Filter',1463,437,'equipment']] as const){const button=document.createElement('button');button.className='scene-hotspot';button.textContent='+ '+label;button.setAttribute('aria-label','Inspect '+label.toLowerCase());button.onclick=()=>this.onInspect?.(mode);host.appendChild(button);this.markers.push({button,x,y,mode});}
 this.setMode('Living');this.resize();window.addEventListener('resize',this.resize);
 this.canvas.addEventListener('pointerdown',this.down);this.canvas.addEventListener('pointermove',this.move);this.canvas.addEventListener('pointerup',this.up);this.canvas.addEventListener('pointercancel',this.cancel);this.canvas.addEventListener('wheel',this.wheel,{passive:false});
 }
 private random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
 private pos(x:number,y:number,z=2){return new T.Vector3(x-W/2,H/2-y,z);}
 private async loadFish(){
 const image=new Image();image.src='./living-species.png';await image.decode();if(this.destroyed)return;
 for(let cell=0;cell<4;cell++){const cw=image.width/2,ch=image.height/2,canvas=document.createElement('canvas');canvas.width=cw;canvas.height=ch;const context=canvas.getContext('2d')!;context.drawImage(image,(cell%2)*cw,Math.floor(cell/2)*ch,cw,ch,0,0,cw,ch);const pixels=context.getImageData(0,0,cw,ch);let left=cw,top=ch,right=0,bottom=0;
 for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){if(pixels.data[(y*cw+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
 if(right<=left||bottom<=top)throw Error('Fish artwork has no visible pixels');
 const trimmed=document.createElement('canvas');trimmed.width=right-left+1;trimmed.height=bottom-top+1;trimmed.getContext('2d')!.drawImage(canvas,left,top,trimmed.width,trimmed.height,0,0,trimmed.width,trimmed.height);
 const texture=new T.CanvasTexture(trimmed);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;this.sprites.push(texture);
 }
 for(let i=0;i<25;i++){const species=i<16?0:i<22?1:i===22?2:3;
 const size=species===2?105:species===3?38:30+this.random()*11;
 const texture=this.sprites[species],art=texture.image as HTMLCanvasElement,ratio=art.height/art.width;
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{map:{value:texture},time:{value:this.random()*30},activity:{value:1},light:{value:1},opacity:{value:.96},photograph:{value:this.photograph},depth:{value:1},flow:{value:.65},sceneTime:{value:0}},vertexShader:"uniform float time,activity;varying vec2 vUv;varying vec2 sceneUv;void main(){vUv=uv;vec3 p=position;float tail=pow(1.0-uv.x,3.0);p.y+=sin(time*9.0-uv.x*8.0)*tail*1.2*activity;p.y+=sin(time*5.0)*sin(uv.y*3.14159)*.12;vec4 world=modelMatrix*vec4(p,1.0);sceneUv=vec2(world.x/1672.0+.5,world.y/941.0+.5);gl_Position=projectionMatrix*viewMatrix*world;}",fragmentShader:`uniform sampler2D map,photograph;uniform float light,opacity,depth,flow,sceneTime;varying vec2 vUv;varying vec2 sceneUv;
#define time sceneTime
${plantMotion}
${depthOcclusion}
void main(){vec4 c=texture2D(map,vUv);if(c.a<.015)discard;vec2 uv=sceneUv+plantingOffset(sceneUv);float cover=sceneOcclusion(uv,depth);c.rgb*=mix(vec3(.69,.83,.84),vec3(.91,.98,.96),depth)*(.45+light*.55);gl_FragColor=vec4(c.rgb,c.a*opacity*(1.0-cover));
#include <colorspace_fragment>
}`});
 const mesh=new T.Mesh(new T.PlaneGeometry(size,size*ratio,24,6),material);material.side=T.DoubleSide;mesh.renderOrder=3;
 const x=species===3?640+this.random()*560:610+this.random()*610,y=species===3?580+this.random()*30:species===2?420:280+this.random()*235;
 const f={mesh,x,y,vx:(this.random()>.5?1:-1)*18,vy:0,targetX:x,targetY:y,size,phase:this.random()*30,depth:species===3?1:.18+this.random()*.65,species,turn:0};this.fish.push(f);this.scene.add(mesh);
 if(species===0){const model=new Tetra3D(texture,i*.83,i===0),swim=createTetraSwim(237+i*7919);f.size=i===0?48:36+this.random()*8;f.x=860+(i%4)*65;f.y=315+Math.floor(i/4)*38;f.depth=.3+(i%3)*.17;Object.assign(swim,{x:f.x,y:f.y,z:f.depth,elapsed:i*.7,remaining:2+i*.23});swim.brain.seed=723+i*3571;swim.brain.energy=.72+this.random()*.22;swim.brain.hunger=.4+this.random()*.25;this.tetras.set(i,{model,swim});this.scene.add(model.group);}
 }
 }
 private buildFlow(){for(let i=0;i<9;i++){const y=i*6;const path=new T.CatmullRomCurve3([this.pos(1265,228+y),this.pos(1080,268+y),this.pos(770,282+y),this.pos(385,350+y),this.pos(520,553+y),this.pos(1060,565+y),this.pos(1260,463+y),this.pos(1265,228+y)]);
 const line=new T.Line(new T.BufferGeometry().setFromPoints(path.getPoints(100)),new T.LineBasicMaterial({color:i%2?0xc6c6a1:0xa7d0d6,transparent:true,opacity:.28,depthTest:false}));line.renderOrder=6;this.flow.add(line);
 for(let n=0;n<5;n++){const mesh=new T.Mesh(new T.ConeGeometry(1.6,6,3),new T.MeshBasicMaterial({color:i%2?0xe2d4a7:0xc4edf1,transparent:true,opacity:.7,depthTest:false}));mesh.renderOrder=7;this.flow.add(mesh);this.arrows.push({mesh,path,phase:n/5+i*.03});}}
 }
 private buildRoots(){const background=new T.Mesh(new T.PlaneGeometry(600,100),new T.MeshBasicMaterial({color:0x16190c,transparent:true,opacity:.74,depthTest:false}));background.position.copy(this.pos(955,623,3));background.renderOrder=5;this.roots.add(background);
 for(let n=0;n<30;n++){const x=680+this.random()*540,y=578+this.random()*12,points=[this.pos(x,y,5)];let cx=x,cy=y;for(let k=0;k<12;k++){cx+=(this.random()-.5)*13;cy+=5+this.random()*3;points.push(this.pos(cx,cy,5));if(k%3===1){const b=[this.pos(cx,cy,5),this.pos(cx+(this.random()-.5)*35,cy+17,5)];const branch=new T.Line(new T.BufferGeometry().setFromPoints(b),new T.LineBasicMaterial({color:0xab9b6b,transparent:true,opacity:.58,depthTest:false}));branch.renderOrder=8;this.roots.add(branch);}}
 const root=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xddc9a1,transparent:true,opacity:.82,depthTest:false}));root.renderOrder=8;this.roots.add(root);}
 }
 setMode(mode:string){this.mode=mode;this.flow.visible=mode==='Flow';this.roots.visible=mode==='Roots';this.selected=null;this.onSelectedFish?.(null);this.cameraPreset(mode==='Equipment'?'Equipment':mode==='Roots'?'Root zone':mode==='Biology'?'Leaf macro':'Gallery');}
 cameraPreset(name:string){const poses:Record<string,number[]>={'Gallery':[0,0,1],'Aquascape':[-15,30,1.35],'Open water':[235,100,1.8],'Root zone':[115,-125,1.75],'Equipment':[590,25,2],'Leaf macro':[0,0,1]};const p=poses[name]||poses.Gallery;[this.targetX,this.targetY,this.zoomTarget]=p;this.clampCamera();}
 focusPrototype(){this.setMode('Living');this.selected=0;const f=this.fish[0];if(f){this.targetX=f.x-W/2;this.targetY=H/2-f.y;this.zoomTarget=2.4;this.clampCamera();this.report(f,0);}}
 zoom(value:number){this.zoomTarget=T.MathUtils.clamp(value,1,2.4);this.clampCamera();}
 nudge(x:number,y:number){this.targetX+=x;this.targetY+=y;this.clampCamera();}
 private clampCamera(){const aspect=this.host.clientWidth/Math.max(1,this.host.clientHeight),baseHeight=aspect>W/H?W/aspect:H;const halfW=baseHeight*aspect/this.zoomTarget/2,halfH=baseHeight/this.zoomTarget/2;this.targetX=T.MathUtils.clamp(this.targetX,-Math.max(0,W/2-halfW),Math.max(0,W/2-halfW));this.targetY=T.MathUtils.clamp(this.targetY,-Math.max(0,H/2-halfH),Math.max(0,H/2-halfH));}
 setQuality(q:string){this.quality=q;this.resize();}
 selectFish(id:number|null){this.selected=id;if(id===null)this.onSelectedFish?.(null);}
 feedAt(){this.feeding=30;for(let i=0;i<16;i++){const flake=new T.Mesh(new T.CircleGeometry(1.1,5),new T.MeshBasicMaterial({color:0x9b7e42,transparent:true,opacity:.85}));flake.position.copy(this.pos(1000+(this.random()-.5)*180,220+this.random()*25,3));this.food.add(flake);}}
 update(dt:number,s:Ecology,e:Environment,reduced:boolean,paused:boolean){
 dt=Number.isFinite(dt)?Math.max(0,Math.min(dt,.1)):0;const moveDt=reduced||paused?0:dt;this.time+=moveDt;this.flowPhase+=moveDt*.015*e.flow/65;this.feeding=Math.max(0,this.feeding-moveDt);
 if(this.selected===0&&this.fish[0]){this.targetX=this.fish[0].x-W/2;this.targetY=H/2-this.fish[0].y;this.clampCamera();}
 const smooth=reduced?1:Math.min(1,dt*3.2);this.zoomCurrent+=(this.zoomTarget-this.zoomCurrent)*smooth;this.centerX+=(this.targetX-this.centerX)*smooth;this.centerY+=(this.targetY-this.centerY)*smooth;
 this.camera.zoom=this.zoomCurrent;this.camera.position.set(this.centerX,this.centerY,250);this.camera.updateProjectionMatrix();
 this.macroBlend+=((this.mode==='Biology'?1:0)-this.macroBlend)*smooth;const u=this.background.material.uniforms;
 u.time.value=this.time;u.flow.value+=(e.flow/100-u.flow.value)*(1-Math.exp(-dt*4));u.agitation.value+=(e.agitation/100-u.agitation.value)*(1-Math.exp(-dt*4));u.day.value=Math.min(1,illumination(s,e));u.algae.value=s.algae;u.biomass.value=s.biomass;u.macroBlend.value=this.macroBlend;
 this.dust.visible=this.mode!=='Biology';this.bubbles.visible=this.mode!=='Biology';this.food.visible=this.mode!=='Biology';const motes=this.dust.geometry.getAttribute('position') as T.BufferAttribute;
 if(moveDt){for(let n=0;n<motes.count;n++){let x=motes.getX(n),y=motes.getY(n);const upper=y>50;x+=moveDt*(upper?-1:1)*(2+e.flow*.08);y+=Math.sin(this.time*.4+n)*moveDt*.65;if(x<320-W/2)x=1280-W/2;if(x>1280-W/2)x=320-W/2;motes.setXY(n,x,y);}motes.needsUpdate=true;}this.roots.scale.y=.7+s.biomass*.3;this.roots.position.y=(H/2-578)*(1-this.roots.scale.y);
 // Every tetra senses the same pre-step snapshot, avoiding update-order bias.
 const schoolSnapshot=this.fish.map((f,id)=>({id,x:f.x,y:f.y,z:f.depth,vx:f.vx,vy:f.vy,radius:f.size*.68})).filter(f=>this.tetras.has(f.id));
 const schoolGoal=advanceSchoolRoute(this.schoolRoute,moveDt,schoolSnapshot);
 for(const [i,tetra] of this.tetras){const f=this.fish[i]; if(tetra){const swim=tetra.swim;advanceTetraSwim(swim,moveDt,this.feeding>0,s.oxygen<4,{food:this.food.children.map(o=>({id:o.id,z:.65,x:o.position.x+W/2,y:H/2-o.position.y})),neighbors:schoolSnapshot.filter(n=>n.id!==i),schoolGoal:schoolLane(schoolGoal,i)});const eaten=this.food.children.find(o=>o.id===swim.brain.consumedFood);if(eaten instanceof T.Mesh){this.food.remove(eaten);eaten.geometry.dispose();(eaten.material as T.Material).dispose();}swim.brain.consumedFood=null;f.x=swim.x;f.y=swim.y;f.vx=swim.vx;f.vy=swim.vy;f.turn=swim.yaw;f.depth=swim.z;}}
 if(moveDt){const bodies=[...this.tetras].map(([id])=>{const f=this.fish[id];return {id,x:f.x,y:f.y,z:f.depth,radius:f.size*.68};});separateFish(bodies);for(const b of bodies){const f=this.fish[b.id],swim=this.tetras.get(b.id)!.swim;f.x=swim.x=b.x;f.y=swim.y=b.y;f.depth=swim.z=b.z;}}
 for(let i=0;i<this.fish.length;i++){const f=this.fish[i],shrimp=f.species===3,tetra=this.tetras.get(i);f.mesh.visible=this.mode!=='Biology'&&!tetra;
 if(moveDt>0&&!tetra){const bounds=shrimp?[430,1280,563,619]:[350,1290,240,565];if(Math.hypot(f.targetX-f.x,f.targetY-f.y)<45||Math.sin(this.time*.22+f.phase)>.997){f.targetX=bounds[0]+this.random()*(bounds[1]-bounds[0]);f.targetY=bounds[2]+this.random()*(bounds[3]-bounds[2]);}
 if(this.feeding&&!shrimp){f.targetX=1000+Math.sin(f.phase)*80;f.targetY=246+Math.sin(f.phase*2)*20;}
 const hover=!this.feeding&&Math.sin(this.time*.33+f.phase)>.88;let ax=(f.targetX-f.x)*.028,ay=(f.targetY-f.y)*.028;if(hover){f.vx*=Math.exp(-moveDt*1.8);f.vy*=Math.exp(-moveDt*1.8);ax*=.12;ay*=.12;}
 for(const other of this.fish){if(f===other)continue;const dx=other.x-f.x,dy=other.y-f.y,d=Math.hypot(dx,dy);if(d<28&&d>0){ax-=dx*.12;ay-=dy*.12;}else if(d<140&&f.species===other.species&&!shrimp){ax+=dx*.0008+(other.vx-f.vx)*.016;ay+=dy*.0007+(other.vy-f.vy)*.016;}}
 const pace=shrimp?1.1:f.species===2?(this.feeding?17:9):(s.oxygen<4?9:18)*(this.feeding?1.5:1);
 f.vx+=ax*moveDt;f.vy+=ay*moveDt;const speed=Math.hypot(f.vx,f.vy);if(speed>pace){f.vx*=pace/speed;f.vy*=pace/speed;}const thrust=i===0?Math.max(0,Math.cos(f.turn)*(f.vx>=0?1:-1)):1;f.x=T.MathUtils.clamp(f.x+f.vx*moveDt*thrust,bounds[0],bounds[1]);f.y=T.MathUtils.clamp(f.y+f.vy*moveDt*(i===0?.25+.75*thrust:1),bounds[2],bounds[3]);
 }
 if(!tetra){const desired=f.vx>=0?0:Math.PI;f.turn+=(desired-f.turn)*(1-Math.exp(-moveDt*2.4));}
 f.mesh.position.copy(this.pos(f.x,f.y+Math.sin(this.time*1.1+f.phase)*.6,1+f.depth*180));
 f.mesh.rotation.y=f.turn;f.mesh.scale.setScalar(.82+f.depth*.18);
 f.mesh.rotation.z=T.MathUtils.clamp(-f.vy*.008,-.15,.15)*(f.vx>0?1:-1);
 const fu=f.mesh.material.uniforms;fu.time.value=this.time+f.phase;fu.sceneTime.value=this.time;fu.flow.value=u.flow.value;fu.photograph.value=this.photograph;fu.depth.value=f.depth;fu.light.value=u.day.value;fu.activity.value=shrimp?.08:Math.max(.22,Math.hypot(f.vx,f.vy)/18);
 if(tetra){const {model,swim}=tetra;model.group.visible=this.mode!=='Biology';model.group.position.copy(this.pos(f.x,f.y,1+f.depth*180));model.group.rotation.set(0,swim.yaw+swim.depthHeading,swim.pitch,'YXZ');model.group.scale.setScalar(f.size*(.72+f.depth*.48));model.update(this.time,swim.effort,this.photograph,u.flow.value,f.depth,u.day.value,moveDt,swim.pectoralEffort);}

 }
 for(let i=0;i<this.bubbleData.length;i++){const b=this.bubbleData[i];b.mesh.visible=i<(this.quality==='Performance'?24:62)&&(b.co2?e.co2>0&&u.day.value>.1:s.oxygen>8.35);if(moveDt){b.y-=b.speed*moveDt*(b.co2?Math.max(.2,e.co2/24):Math.max(.2,s.oxygen/8));if(b.y<200){b.y=b.originY;b.x=b.originX;}}const rise=(b.originY-b.y)/Math.max(1,b.originY-200);const scale=b.co2?Math.max(.12,.75*(1-rise)):1+rise*.1;b.mesh.scale.setScalar(scale);b.mesh.position.copy(this.pos(b.x+Math.sin(this.time*.6+b.phase)*2+rise*e.flow*.13,b.y,4));}
 for(const a of this.arrows){const t=T.MathUtils.euclideanModulo(this.flowPhase+a.phase,1);a.mesh.position.copy(a.path.getPointAt(t));a.mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),a.path.getTangentAt(t));}
 this.food.children.forEach(o=>{o.position.y-=moveDt*4;});if(this.food.children.length){for(const o of this.food.children.filter(o=>H/2-o.position.y>560)){(o as T.Mesh).geometry.dispose();((o as T.Mesh).material as T.Material).dispose();this.food.remove(o);}}
 if(this.selected!==null&&this.time-this.lastReport>.5){this.lastReport=this.time;const f=this.fish[this.selected];if(f)this.report(f,this.selected);}
 for(const marker of this.markers){const screen=this.pos(marker.x,marker.y,0).project(this.camera);marker.button.style.left=((screen.x+1)*.5*this.host.clientWidth)+'px';marker.button.style.top=((1-screen.y)*.5*this.host.clientHeight)+'px';marker.button.hidden=this.mode!=='Living'||Math.abs(screen.x)>.92||Math.abs(screen.y)>.84;}
 this.renderer.render(this.scene,this.camera);
 }
 private report(f:Swimmer,id:number){const swim=this.tetras.get(id)?.swim;this.onSelectedFish?.({id,species:['Cardinal tetra · 3D school','Harlequin rasbora','Pearl gourami','Amano shrimp'][f.species],size:f.size,speed:Math.hypot(f.vx,f.vy),hunger:swim?swim.brain.hunger:0,energy:swim?swim.brain.energy:undefined,reason:swim?swim.brain.intent.reason:undefined,mood:swim?tetraBehaviorLabel(swim):this.feeding?'Foraging':f.species===3?'Grazing':'Exploring',preferredDepth:swim?((f.y<310?'Upper water':f.y>420?'Lower planting':'Midwater')+' / '+(f.depth>.68?'Near front glass':f.depth<.32?'Back planting':'Tank interior')):f.species===3?'Planted foreground':'Midwater'});}
 private world(clientX:number,clientY:number){const r=this.canvas.getBoundingClientRect(),v=new T.Vector3((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1,0);v.unproject(this.camera);return {x:v.x+W/2,y:H/2-v.y};}
 private down=(event:PointerEvent)=>{this.canvas.setPointerCapture(event.pointerId);this.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});this.pointer={startX:event.clientX,startY:event.clientY,cx:this.targetX,cy:this.targetY,distance:0};if(this.pointers.size===2){const p=[...this.pointers.values()];this.pinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);this.pinchZoom=this.zoomTarget;}};
 private move=(event:PointerEvent)=>{if(!this.pointers.has(event.pointerId))return;this.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(this.pointers.size===2){const p=[...this.pointers.values()];this.zoom(this.pinchZoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/Math.max(1,this.pinch));if(this.pointer)this.pointer.distance=100;return;}if(!this.pointer)return;const dx=event.clientX-this.pointer.startX,dy=event.clientY-this.pointer.startY;this.pointer.distance=Math.hypot(dx,dy);const scale=(this.camera.right-this.camera.left)/(this.host.clientWidth*this.zoomCurrent);this.targetX=this.pointer.cx-dx*scale;this.targetY=this.pointer.cy+dy*scale;this.clampCamera();};
 private up=(event:PointerEvent)=>{if(this.pointer&&this.pointer.distance<8){const p=this.world(event.clientX,event.clientY);let nearest=-1,distance=Infinity;this.fish.forEach((f,i)=>{const d=Math.hypot(p.x-f.x,p.y-f.y);if(d<Math.max(18,f.size*.5)&&d<distance){nearest=i;distance=d;}});if(nearest>=0){this.selected=nearest;this.report(this.fish[nearest],nearest);}else if(p.x>1340&&p.x<1540&&p.y>280&&p.y<720){this.onInspect?.('equipment');}}this.cancel(event);};
 private cancel=(event:PointerEvent)=>{this.pointers.delete(event.pointerId);this.pointer=null;if(this.canvas.hasPointerCapture(event.pointerId))this.canvas.releasePointerCapture(event.pointerId);};
 private wheel=(event:WheelEvent)=>{event.preventDefault();this.zoom(this.zoomTarget*Math.exp(-event.deltaY*.001));};
 resize=()=>{const width=Math.max(1,this.host.clientWidth),height=Math.max(1,this.host.clientHeight),aspect=width/height,viewHeight=aspect>W/H?W/aspect:H;this.camera.left=-viewHeight*aspect/2;this.camera.right=viewHeight*aspect/2;this.camera.top=viewHeight/2;this.camera.bottom=-viewHeight/2;this.camera.updateProjectionMatrix();this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.quality==='Performance'?1:this.quality==='High'?1.5:2));this.renderer.setSize(width,height);this.clampCamera();};
 capture(){this.renderer.render(this.scene,this.camera);const a=document.createElement('a');a.download='living-aquascape.png';a.href=this.canvas.toDataURL('image/png');a.click();}
 dispose(){this.destroyed=true;window.removeEventListener('resize',this.resize);this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointermove',this.move);this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.cancel);this.canvas.removeEventListener('wheel',this.wheel);const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();this.scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Line||o instanceof T.Points){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());this.sprites.forEach(t=>t.dispose());this.photograph.dispose();this.macro.dispose();this.renderer.dispose();this.canvas.remove();this.markers.forEach(m=>m.button.remove());}
}

