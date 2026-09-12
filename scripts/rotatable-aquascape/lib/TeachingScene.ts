import * as T from 'three';
import {Tetra3D} from './Tetra3D.ts';
import {lessons,type Lesson} from './LearningContent.ts';
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const basic=(color:number,opacity=1)=>new T.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1});
type Path={curve:T.CatmullRomCurve3;beads:T.InstancedMesh;speed:number;phase:number};
/** Optional teaching geometry. No extra draws or simulation when the mode is closed. */
export class TeachingScene{
 root=new T.Group();mode:Lesson|null=null;step=0;separation=0;night=false;
 onSelect:(step:number)=>void=()=>{};
 onInspect:(specimen:number)=>void=()=>{};
 private housing:T.Object3D[];
 private world:T.Scene;private plants:T.Object3D[];private substrate:T.Object3D[];
 private originals=new Map<T.Object3D,{position:T.Vector3;visible:boolean}>();
 private paths:Path[]=[];private labels:{button:HTMLButtonElement;point:T.Vector3}[]=[];
 private host:HTMLElement;private labelHost:HTMLDivElement;private content=new T.Group();
 private specimen:Tetra3D|null=null;private texture:T.Texture;private leaf:T.InstancedMesh|undefined;
 private labelMatrix=new T.Matrix4();private labelsDirty=true;private labelWidth=0;private labelHeight=0;
 private projected=new T.Vector3();private dummy=new T.Object3D();
 private phase=0;private impeller:T.Group|null=null;private rootStudy:T.Group|null=null;
 private savedVisibility=new Map<T.Object3D,boolean>();
 constructor(world:T.Scene,host:HTMLElement,plants:T.Object3D[],substrate:T.Object3D[],texture:T.Texture,housing:T.Object3D[]=[]){
  this.housing=housing;this.world=world;this.host=host;this.plants=plants;this.substrate=substrate;this.texture=texture;
  for(const o of [...plants,...substrate])this.originals.set(o,{position:o.position.clone(),visible:o.visible});
  world.traverse(o=>{if(o instanceof T.InstancedMesh&&o.userData.plantSpecies==='sword')this.leaf=o;});
  this.labelHost=document.createElement('div');this.labelHost.className='learning-labels';host.append(this.labelHost);
  this.root.add(this.content);world.add(this.root);this.root.visible=false;
 }
 private restore(){for(const [o,v] of this.savedVisibility)o.visible=v;this.savedVisibility.clear();}
 private clear(){
  this.labelsDirty=true;this.restore();this.labelHost.replaceChildren();this.labels=[];this.paths=[];this.impeller=null;this.rootStudy=null;
  this.content.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Line){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});
  this.content.clear();this.specimen=null;
 }
 private add(g:T.BufferGeometry,m:T.Material,p:T.Vector3,parent:T.Object3D=this.content){const mesh=new T.Mesh(g,m);mesh.position.copy(p);parent.add(mesh);return mesh;}
 private tube(points:T.Vector3[],radius:number,color:number,parent:T.Object3D=this.content){return this.add(new T.TubeGeometry(new T.CatmullRomCurve3(points),32,radius,7,false),basic(color),V(0,0,0),parent);}
 private path(points:T.Vector3[],color=0x78d8ee,speed=.12){
  const curve=new T.CatmullRomCurve3(points),line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(100)),new T.LineBasicMaterial({color,transparent:true,opacity:.55}));this.content.add(line);
  const beads=new T.InstancedMesh(new T.SphereGeometry(.052,8,6),basic(color),12);beads.frustumCulled=false;this.content.add(beads);this.paths.push({curve,beads,speed,phase:0});
 }
 private label(text:string,point:T.Vector3,index:number){const button=document.createElement('button');button.textContent=text;button.className='learning-tag';button.setAttribute('aria-label','Inspect '+text);button.onclick=()=>this.onSelect(index);this.labelHost.append(button);this.labels.push({button,point});}
 private roots(origin:T.Vector3,scale=1){
  const group=new T.Group();group.position.copy(origin);group.scale.setScalar(scale);group.userData.rootTemplate=true;this.content.add(group);
  for(let i=0;i<13;i++){const a=i*2.399,x=Math.cos(a)*(.3+i*.025),z=Math.sin(a)*(.18+i*.014),end=V(x*1.3,-.58-(i%4)*.08,z*1.2);
   this.tube([V(0,0,0),V(x*.35,-.18,z*.35),V(x,-.38,z),end],.011,0xb9a47b,group);
   for(let j=1;j<4;j++){const y=-j*.16;this.tube([V(x*j/4,y,z*j/4),V(x*j/4+.12*Math.cos(a+j),y-.12,z*j/4+.12*Math.sin(a+j)),V(x*j/4+.19*Math.cos(a+j),y-.21,z*j/4+.19*Math.sin(a+j))],.004,0xd2bd91,group);}
  }return group;
 }
 private filter(){
  // Open front shell exposes real modeled baskets, foam pores, ceramic rings and rotor.
  const metal=new T.MeshStandardMaterial({color:0x859596,metalness:.8,roughness:.24});
  const shell=this.add(new T.CylinderGeometry(.95,.95,3.1,64,1,true,Math.PI*.12,Math.PI*1.12),metal,V(0,2.55,0));shell.rotation.y=Math.PI*.35;
  for(const y of [1.04,4.08])this.add(new T.CylinderGeometry(.97,.97,.12,64),metal.clone(),V(0,y,0));
  for(const y of [1.4,2.3,3.35]){this.add(new T.CylinderGeometry(.83,.83,.09,48),new T.MeshStandardMaterial({color:0x344044,roughness:.8}),V(0,y,0));}
  const foam=new T.InstancedMesh(new T.IcosahedronGeometry(.083,1),new T.MeshStandardMaterial({color:0x30434c,roughness:1}),210),d=new T.Object3D();
  for(let i=0;i<210;i++){const a=i*2.399,r=.75*Math.sqrt((i%70)/70);d.position.set(Math.cos(a)*r,1.56+Math.floor(i/70)*.17,Math.sin(a)*r);d.scale.set(1,.8,1);d.updateMatrix();foam.setMatrixAt(i,d.matrix);}this.content.add(foam);
  const media=new T.InstancedMesh(new T.TorusGeometry(.083,.029,8,12),new T.MeshStandardMaterial({color:0xc1b79a,roughness:.97}),180);
  for(let i=0;i<180;i++){const a=i*2.399,r=.72*Math.sqrt((i%60)/60);d.position.set(Math.cos(a)*r,2.48+Math.floor(i/60)*.27,Math.sin(a)*r);d.rotation.set(i*.67,i*.39,i*.71);d.scale.set(1,1,1);d.updateMatrix();media.setMatrixAt(i,d.matrix);}this.content.add(media);
  this.impeller=new T.Group();this.impeller.position.set(0,3.75,0);this.content.add(this.impeller);
  this.add(new T.CylinderGeometry(.2,.2,.32,24),metal.clone(),V(0,0,0),this.impeller);
  for(let i=0;i<6;i++){const a=i*Math.PI/3,m=this.add(new T.BoxGeometry(.5,.12,.08),metal.clone(),V(Math.cos(a)*.4,0,Math.sin(a)*.4),this.impeller);m.rotation.y=-a;}
  this.path([V(-.95,4.6,0),V(-1.15,1.15,0),V(0,1.22,.5),V(0,2.3,.6),V(0,3.45,.6),V(.7,4.35,0),V(1.25,4.6,0)]);
  [['Foam',1.8,1],['Ceramic media',2.85,2],['Impeller',3.8,3]].forEach(([text,y,index])=>this.label(String(text),V(.65,Number(y),.6),Number(index)));
 }
 set(mode:Lesson|null,step=0){
  this.clear();this.mode=mode;this.step=step;this.root.visible=!!mode;this.labelHost.hidden=!mode;
  if(mode!=='layers')for(const [o,original] of this.originals)o.position.copy(original.position);
  if(!mode)return;
  const isolated=(mode==='water'&&step>0&&step<4)||mode==='organisms';
  if(isolated){for(const o of this.world.children){if(o===this.root||o instanceof T.Light)continue;this.savedVisibility.set(o,o.visible);o.visible=false;}}
  if(mode==='water'){
   if(isolated)this.filter();
   else{this.path([V(4.77,1.27,-2.02),V(4.77,5.75,-2.02),V(5.7,5.5,-1),V(5.7,.8,0),V(5.9,.4,1),V(6.1,3.4,0),V(4.4,5.75,-2.02),V(3.93,4.99,-1.57)]);this.path([V(3.93,4.99,-1.57),V(1,4.7,-.4),V(-3,4.4,.6),V(-3.5,1.9,1),V(1,1.4,.9),V(4.77,1.27,-2.02)]);this.label('Open filter cutaway',V(5.7,2.6,0),1);this.label('Intake',V(4.77,1.27,-2.02),0);this.label('Return',V(3.93,4.99,-1.57),4);}
  }
  if(mode==='layers'){
   for(const o of this.housing){this.savedVisibility.set(o,o.visible);o.visible=false;}
   this.rootStudy=this.roots(V(-.6,.95,1.5),1.8);this.roots(V(2,.85,.8),1.3);
   lessons.layers.forEach((s,i)=>this.label(s.tag,V(...s.point),i));
  }
  if(mode==='nitrogen'){
   const points=lessons.nitrogen.map(s=>V(...s.point));const end=step===4?V(-1,.7,.5):points[step+1];
   this.path([points[step],points[step].clone().lerp(end,.5).add(V(0,.25,.5)),end],[0xe5bc6c,0xe89460,0xdab1e7,0x94c8fa,0xb5e59b][step],.17);
   lessons.nitrogen.forEach((s,i)=>this.label(s.tag,points[i],i));
  }
  if(mode==='day'){
   if(!this.night){this.path([V(-1,6.15,.3),V(-1,4,.3),V(-1,2.5,.3)],0xf5d894,.2);this.path([V(-1,2.5,.3),V(0,3.2,.6),V(2,4,.5)],0x8cdbef,.14);}
   else{this.path([V(2,5,.6),V(1,4,.6),V(0,3,.6)],0x8cdbef,.14);this.path([V(-1,2.5,.7),V(-.3,3.5,.7),V(1,4,.7)],0xe7ba7b,.12);}
   lessons.day.forEach((s,i)=>this.label(s.tag,V(...s.point),i));
  }
  if(mode==='organisms'){
   if(step===0){this.specimen=new Tetra3D(this.texture);this.specimen.group.position.set(0,2.9,0);this.specimen.group.scale.setScalar(2.8);this.content.add(this.specimen.group);
    const gill=this.add(new T.TorusGeometry(.31,.025,8,32,Math.PI*1.2),basic(0xe9a6a2),V(1,2.95,.2));gill.rotation.y=.5;
    this.path([V(2.5,3.05,.3),V(1.3,3.05,.35),V(.7,2.8,.4),V(0,2.7,.5)],0x82d7ee,.2);
   }else if(step===1&&this.leaf){
    const mat=(this.leaf.material as T.MeshStandardMaterial).clone();mat.onBeforeCompile=()=>{};
    const pigment=new T.Color();this.leaf.getColorAt(0,pigment);mat.color.multiply(pigment);
    const matrix=new T.Matrix4(),size=new T.Vector3();this.leaf.getMatrixAt(0,matrix);size.setFromMatrixScale(matrix);
    const g=this.leaf.geometry.clone();g.computeBoundingBox();g.translate(0,-.45,0);
    const leaf=this.add(g,mat,V(0,2.75,0));leaf.scale.set(4*size.x/size.y,4,4);leaf.rotation.y=-.3;
    this.path([V(-1,5.5,0),V(0,3.6,.5),V(.3,2.5,.5)],0xf5d894,.17);this.path([V(.3,2.5,.6),V(1.5,3,.6),V(2,4,.6)],0x8cdbef,.15);
   }else{this.roots(V(0,4.5,0),4);this.path([V(2,1.4,.5),V(1,2,.6),V(0,3,.5),V(0,4.4,0)],0xb5e59b,.15);}
   this.label(lessons.organisms[step].tag,V(1.7,3.6,.5),step);
  }
 }
 update(dt:number,camera:T.Camera,flow=65){
  if(!this.mode)return;
  const target=this.mode==='layers'?this.separation:0;
  if(this.mode==='layers')for(const [o,original] of this.originals){const offset=this.plants.includes(o)?target*1.3:-target*.48;o.position.y=T.MathUtils.damp(o.position.y,original.position.y+offset,5,dt);}
  if(this.mode==='layers'){for(const o of this.housing)o.visible=target<.02&&(this.savedVisibility.get(o)??true);for(const o of this.content.children)if(o.userData.rootTemplate)o.visible=target>.02;}
  this.phase+=dt;
  if(this.impeller)this.impeller.rotation.y+=dt*flow*.14;
  this.specimen?.update(this.phase,.4,this.texture,.65,.5,1,dt,.6);
  const dummy=this.dummy;for(const path of this.paths){path.phase+=dt*path.speed*(this.mode==='water'?flow/65:1);for(let i=0;i<path.beads.count;i++){path.curve.getPoint((path.phase+i/path.beads.count)%1,dummy.position);dummy.updateMatrix();path.beads.setMatrixAt(i,dummy.matrix);}path.beads.instanceMatrix.needsUpdate=true;}
  const w=this.host.clientWidth,h=this.host.clientHeight;
  // Label anchors are static; only a changed view or layout needs DOM writes.
  camera.updateMatrixWorld();
  const matrix=this.dummy.matrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
  if(!this.labelsDirty&&w===this.labelWidth&&h===this.labelHeight&&this.labelMatrix.equals(matrix))return;
  this.labelsDirty=false;this.labelWidth=w;this.labelHeight=h;this.labelMatrix.copy(matrix);
  for(const {button,point} of this.labels){const p=this.projected.copy(point).applyMatrix4(matrix);button.hidden=p.z>1||Math.abs(p.x)>1||Math.abs(p.y)>1;button.style.left=Math.max(75,Math.min(w-75,(p.x*.5+.5)*w))+'px';button.style.top=Math.max(40,Math.min(h-40,(-p.y*.5+.5)*h))+'px';}
 }
}
