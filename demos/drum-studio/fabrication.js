import * as T from '../aquaclear-studio/vendor/three.module.js';
import {roundedBox} from '../trickle-studio/detail.js?v=3';
const V=(...a)=>new T.Vector3(...a),TAU=Math.PI*2;

// Designed machine details, not a representation of a particular manufacturer's CAD.
export function fabricate({parts,steel,dark,rubber,brass,gearSpin,waterGroup,front}){
 const shell=new T.MeshPhysicalMaterial({color:'#254653',metalness:.46,roughness:.3,clearcoat:.38,clearcoatRoughness:.24});
 const satin=steel.clone();satin.roughness=.24;satin.color.set('#d0d6d4');
 const black=new T.MeshStandardMaterial({color:'#111a20',roughness:.46,metalness:.2});
 const added=[];
 const mesh=(g,geometry,material,x,y,z)=>{const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);added.push(m);return m;};
 const box=(g,w,h,d,x,y,z,m=shell)=>mesh(g,roundedBox(w,h,d,Math.min(.06,w*.15,h*.15,d*.15)),m,x,y,z);
 const cyl=(g,r,l,x,y,z,m=steel,axis='x',segments=40)=>{const a=mesh(g,new T.CylinderGeometry(r,r,l,segments),m,x,y,z);if(axis==='x')a.rotation.z=Math.PI/2;if(axis==='z')a.rotation.x=Math.PI/2;return a;};
 const torus=(g,r,t,x,y,z,m=steel,axis='x')=>{const a=mesh(g,new T.TorusGeometry(r,t,8,64),m,x,y,z);if(axis==='x')a.rotation.y=Math.PI/2;if(axis==='y')a.rotation.x=Math.PI/2;return a;};
 const body=parts.get('body').object;
 // Folded corner channels and pressed end-panel stiffeners catch broad softbox reflections.
 for(const x of [-3.23,3.23]){
  for(const z of [-1.62,1.62]){box(body,.13,3.18,.17,x,1.8,z);box(body,.025,3.09,.035,x+(x>0?.075:-.075),1.8,z,satin);}
  for(const z of [-1.06,0,1.06])box(body,.035,2.8,.045,x,1.84,z,satin);
  box(body,.045,.23,3.17,x,3.2,0);box(body,.045,.24,3.17,x,.43,0);
 }
 // Rear wall is powder-coated outside; inner stainless skin remains visible in section.
 box(body,6.3,2.94,.045,0,1.79,-1.7);
 for(const x of [-2.4,-.8,.8,2.4])box(body,.055,2.7,.06,x,1.8,-1.74,satin);
 front.material=shell;
 for(const x of [-2.96,2.96])box(front,.035,2.94,.022,x,0,.052,satin);
 for(const x of [-1.05,1.05])box(front,.065,2.65,.034,x,0,.052,satin);
 for(const y of [-1.42,1.42])box(front,5.96,.035,.022,0,y,.052,satin);
 const lid=parts.get('lid').object;
 for(const z of [-1.5,1.5])box(lid,6.14,.045,.09,0,4.01,z,satin);
 for(const x of [-2.8,-1.4,0,1.4,2.8])box(lid,.065,.035,2.7,x,4.005,0,satin);
 // Split unions with full flanges, bolt heads and a visible compression gasket.
 const boltGeo=new T.CylinderGeometry(.032,.032,.046,6);
 for(const [id,x,y,z,r] of [['inlet',-3.31,1.55,-.75,.25],['inlet',-3.31,1.55,.75,.25],['outlet',3.31,1.1,-.65,.24],['outlet',3.31,1.1,.65,.24],['waste',-3.32,2.7,0,.17]]){
  const g=parts.get(id).object,sign=x>0?1:-1;
  for(const dx of [-.045,.045])torus(g,r+.045,.045,x+dx,y,z,satin);
  torus(g,r+.065,.014,x,y,z,rubber);
  for(let i=0;i<8;i++){const a=i/8*TAU;const b=mesh(g,boltGeo,satin,x+sign*.09,y+Math.cos(a)*(r+.05),z+Math.sin(a)*(r+.05));b.rotation.z=Math.PI/2;}
 }
 // Recessed pockets and machined hubs give the ring drive real depth.
 for(const x of [-.075,.075])torus(gearSpin,1.245,.025,x,0,0,satin);
 const drive=parts.get('drive').object;
 cyl(drive,.29,.07,2.18,3.39,0,satin);cyl(drive,.25,.04,1.76,3.39,0,black);
 box(drive,.32,.14,.24,2.02,3.68,0);cyl(drive,.038,.12,2.2,3.68,0,brass);
 for(const z of [-.22,.22])for(const x of [1.85,2.35]){cyl(drive,.043,.04,x,3.19,z,satin,'y',6);}
 // A rounded volute, bolted cover, union and cable turn the simple pump cylinder into an assembly.
 const pump=parts.get('rinse').object;
 const volute=mesh(pump,new T.SphereGeometry(.29,36,24),shell,1.72,.56,2.08);volute.scale.set(.57,1,1);
 torus(pump,.245,.018,1.55,.56,2.08,satin);cyl(pump,.09,.16,1.51,.56,2.08,black);
 for(let i=0;i<8;i++){const a=i/8*TAU;const b=mesh(pump,boltGeo,satin,1.55,.56+Math.cos(a)*.23,2.08+Math.sin(a)*.23);b.rotation.z=Math.PI/2;}
 cyl(pump,.095,.2,1.76,.85,2.08,shell,'y');torus(pump,.095,.024,1.76,.91,2.08,satin,'y');
 box(pump,.24,.12,.24,2.13,.83,2.08);for(const x of [1.95,2.35])for(const z of [1.86,2.3])cyl(pump,.045,.05,x,.33,z,satin,'y',6);
 const cable=new T.CatmullRomCurve3([V(2.24,.84,2.08),V(2.65,.62,2.23),V(2.87,.3,2.05),V(3.03,.6,1.65)]);mesh(pump,new T.TubeGeometry(cable,36,.022,8,false),rubber,0,0,0);
 // Functional markings remain textures on real surfaces, not floating UI.
 function badge(g,w,h,x,y,z,rotation,title,subtitle){
  const c=document.createElement('canvas');c.width=768;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#102731';ctx.fillRect(0,0,768,256);ctx.strokeStyle='#93c5bc';ctx.lineWidth=5;ctx.strokeRect(14,14,740,228);ctx.fillStyle='#c7e9db';ctx.font='bold 53px sans-serif';ctx.fillText(title,38,97);ctx.fillStyle='#a2b8ba';ctx.font='27px sans-serif';ctx.fillText(subtitle,38,150);ctx.fillStyle='#d0ac7c';ctx.fillRect(38,188,68,8);ctx.fillStyle='#8baaa9';for(let i=0;i<24;i++)ctx.fillRect(590+i*5,180,2,30);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;const p=mesh(g,new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,roughness:.4,metalness:.25}),x,y,z);p.rotation.y=rotation;
 }
 badge(front,1.65,.55,-1.98,.79,.07,0,'DRUM / 033','SELF-CLEANING SCREEN');
 badge(body,1.72,.58,3.235,2.65,0,Math.PI/2,'DRUM / 033','AUTOMATIC SCREENING');
 badge(pump,.36,.13,2.14,.58,2.315,0,'RINSE','CLEAN-SIDE SUPPLY');
 const control=parts.get('control').object;box(control,.72,.7,.07,2.6,3.1,-1.55,satin);
 // Moving light on the submerged base makes the depth readable, without implying CFD.
 const causticMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{clock:{value:0}},vertexShader:'varying vec2 p;void main(){p=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 p;uniform float clock;void main(){vec2 q=p*vec2(13.,7.);q+=vec2(sin(q.y*1.4+clock*.7),cos(q.x*.8-clock*.5))*.28;float a=abs(sin(q.x*2.+sin(q.y*1.7+clock*.4)));float b=abs(sin(q.y*2.2+sin(q.x*1.4-clock*.6)));float light=pow(1.-min(a,b),14.);float edge=smoothstep(0.,.06,min(min(p.x,1.-p.x),min(p.y,1.-p.y)));gl_FragColor=vec4(.42,.76,.76,light*.15*edge);}`});
 const caustics=new T.Mesh(new T.PlaneGeometry(6.15,3.12),causticMat);caustics.rotation.x=-Math.PI/2;caustics.position.y=.212;waterGroup.add(caustics);
 const ripples=new T.InstancedMesh(new T.TorusGeometry(1,.008,4,64),new T.MeshBasicMaterial({color:'#b8e5dd',transparent:true,opacity:.17,depthWrite:false}),12);waterGroup.add(ripples);const dummy=new T.Object3D();
 // Merge only the new static geometry within each assembly/material. It still
 // inherits picking, isolation and explosion, while avoiding a draw per fastener.
 const batches=new Map();for(const m of added){const key=m.parent.uuid+':'+m.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(m);}
 let batchCount=0;for(const meshes of batches.values()){
  if(meshes.length<2)continue;const attributes={position:[],normal:[],uv:[]};
  for(const m of meshes){m.updateMatrix();const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrix);for(const name of Object.keys(attributes))attributes[name].push(g.getAttribute(name).array);g.dispose();}
  const geometry=new T.BufferGeometry();for(const [name,arrays] of Object.entries(attributes)){const a=new Float32Array(arrays.reduce((n,v)=>n+v.length,0));let offset=0;for(const v of arrays){a.set(v,offset);offset+=v.length;}geometry.setAttribute(name,new T.BufferAttribute(a,name==='uv'?2:3));}
  geometry.computeBoundingSphere();const first=meshes[0],combined=new T.Mesh(geometry,first.material);combined.castShadow=true;combined.receiveShadow=true;first.parent.add(combined);for(const m of meshes)m.removeFromParent();batchCount++;
 }
 const released=new Set();for(const m of added)if(!m.parent&&!released.has(m.geometry)){m.geometry.dispose();released.add(m.geometry);}
 let clock=0;
 return {update(s,h){clock=h.time;causticMat.uniforms.clock.value=h.time;for(let i=0;i<12;i++){const age=(h.time*.34+i/6)%1;dummy.position.set(-2.6,h.dirtyLevel+.014,(i<6?-.75:.75));dummy.rotation.x=Math.PI/2;dummy.scale.setScalar(.06+age*.44);dummy.updateMatrix();ripples.setMatrixAt(i,dummy.matrix);}ripples.instanceMatrix.needsUpdate=true;ripples.visible=h.flow>0;},snapshot:()=>({flangedConnections:5,pumpVolute:true,formedPanels:true,staticBatches:batchCount,waterDetailClock:clock})};
}
