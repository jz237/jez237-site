import * as T from '../aquaclear-studio/vendor/three.module.js';
const V=(...p)=>new T.Vector3(...p);
export function addDetail({parts,steel,dark,rubber,brass,spin,drumSteel,waterGroup,effects,nozzleXs}){
 const part=id=>parts.get(id).object,pose=new T.Object3D();
 function add(g,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=!mat.transparent;m.receiveShadow=true;g.add(m);return m;}
 function line(g,points,r,mat=steel){return add(g,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p))),36,r,8,false),mat);}
 // Thin folded seams and weld lines define the joins without a painted dirt layer.
 for(const z of [-1.585,1.585])line(part('body'),[[-3.08,.225,z],[0,.225,z],[3.08,.225,z]],.012);
 for(const x of [-3.12,3.12])line(part('body'),[[x,.23,-1.58],[x,1.8,-1.58],[x,3.38,-1.58]],.009);
 for(const z of [-1.58,1.58])line(part('lid'),[[-3.03,3.493,z],[0,3.493,z],[3.03,3.493,z]],.016,rubber);
 // Removable panel clamps rotate with the cage; they share its cut plane.
 const clamps=new T.InstancedMesh(new T.BoxGeometry(.11,.035,.095),drumSteel,36);spin.add(clamps);
 for(let i=0;i<36;i++){const a=(i%12)/12*Math.PI*2,x=[-1.71,-.1,1.41][Math.floor(i/12)];pose.position.set(x,Math.cos(a)*1.305,Math.sin(a)*1.305);pose.rotation.set(a,0,0);pose.scale.setScalar(1);pose.updateMatrix();clamps.setMatrixAt(i,pose.matrix);}clamps.castShadow=true;
 // Wash fittings include hex shoulders, threaded collars and dark nozzle apertures.
 for(const x of nozzleXs){add(part('spray'),new T.CylinderGeometry(.077,.077,.055,6),brass,x,3.30,0);for(const y of [3.335,3.35]){const r=add(part('spray'),new T.TorusGeometry(.06,.006,6,20),steel,x,y,0);r.rotation.x=Math.PI/2;}add(part('spray'),new T.BoxGeometry(.049,.006,.014),rubber,x,3.209,0);}
 // Rear motor vents and captive screw heads, bounded to the drive assembly.
 for(let i=0;i<7;i++)add(part('drive'),new T.BoxGeometry(.007,.022,.32),rubber,2.565,3.25+i*.045,0);
 for(const y of [3.22,3.56])for(const z of [-.19,.19]){const m=add(part('drive'),new T.CylinderGeometry(.024,.024,.012,6),steel,2.575,y,z);m.rotation.z=Math.PI/2;}
 // Glassy beads sit on stationary inner walls above the waterline.
 const beadMat=new T.MeshPhysicalMaterial({color:'#bddee0',roughness:.08,transparent:true,opacity:.46,depthWrite:false,clearcoat:1}),beads=new T.InstancedMesh(new T.SphereGeometry(.026,10,8),beadMat,64);part('body').add(beads);
 for(let i=0;i<64;i++){pose.position.set(-2.95+(i*.618%1)*5.9,2.5+(i*.414%1)*.68,-1.592);pose.rotation.set(0,0,0);pose.scale.set(.38+(i%4)*.15,.7+(i%5)*.2,.25);pose.updateMatrix();beads.setMatrixAt(i,pose.matrix);}
 // Narrow open trough film: same rinse clock as the spray, never a second water route.
 const filmMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{clock:{value:0},strength:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float clock,strength;void main(){float ribbon=pow(.5+.5*sin(vUv.x*92.+clock*14.+sin(vUv.y*26.)*2.),9.);float edge=smoothstep(0.,.08,min(vUv.y,1.-vUv.y));gl_FragColor=vec4(mix(vec3(.16,.25,.23),vec3(.58,.72,.67),ribbon),(.22+ribbon*.28)*edge*strength);}`});
 const film=add(part('trough'),new T.PlaneGeometry(4.6,.49,40,4),filmMat,-.83,2.724,0);film.rotation.x=-Math.PI/2;
 const impact=new T.InstancedMesh(new T.TorusGeometry(1,.055,6,24),new T.MeshBasicMaterial({color:'#b4dbe0',transparent:true,opacity:.35,depthWrite:false}),30);effects.add(impact);
 const drip=new T.InstancedMesh(new T.SphereGeometry(.015,8,6),beadMat,48);effects.add(drip);
 // The controller is legible geometry, using a small locally rendered display texture.
 const canvas=document.createElement('canvas');canvas.width=384;canvas.height=192;const ctx=canvas.getContext('2d'),tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;
 add(part('control'),new T.PlaneGeometry(.47,.24),new T.MeshBasicMaterial({map:tex}),2.6,3.18,-1.263);
 let screenKey='',washTail=0,lastTime=0,last={};
 function update(s,h,operating){
  const dt=Math.max(0,Math.min(.1,h.time-lastTime));if(h.time<lastTime)washTail=0;lastTime=h.time;
  washTail=h.rinse?1:Math.max(0,washTail-dt*.65);film.visible=operating&&washTail>0;filmMat.uniforms.clock.value=h.time;filmMat.uniforms.strength.value=washTail;
  impact.visible=operating&&h.rinse;drip.visible=operating&&washTail>0;
  for(let i=0;i<30;i++){const t=(h.time*2.1+i*.618)%1;pose.position.set(nozzleXs[i%6]+Math.sin(i)*.06,2.731,Math.cos(i)*.1);pose.rotation.set(-Math.PI/2,0,0);const size=.014+t*.12;pose.scale.set(size,size,(1-t)*.65);pose.updateMatrix();impact.setMatrixAt(i,pose.matrix);}impact.instanceMatrix.needsUpdate=true;
  for(let i=0;i<48;i++){const t=(h.time*(.7+(i%4)*.1)+i*.618)%1;pose.position.set(-1.6+(i%12)*.27,3.04-t*t*.28,Math.sin(i)*.15);pose.rotation.set(0,0,0);pose.scale.set(.35,.4+t*.5,.35);pose.updateMatrix();drip.setMatrixAt(i,pose.matrix);}drip.instanceMatrix.needsUpdate=true;
  const level=Math.round(h.meanLoad*16),key=h.phase+':'+level;if(key!==screenKey){screenKey=key;ctx.fillStyle='#112d2b';ctx.fillRect(0,0,384,192);ctx.fillStyle=h.alarm?'#ffc080':'#bfe6cf';ctx.font='bold 48px monospace';ctx.fillText(h.phase.toUpperCase(),18,65);ctx.font='24px monospace';ctx.fillText('SCREEN LOAD',18,108);ctx.fillStyle='#31574b';ctx.fillRect(18,132,345,28);ctx.fillStyle='#b8dab8';ctx.fillRect(18,132,345*level/16,28);tex.needsUpdate=true;}
  last={wallBeads:64,panelClamps:36,troughFilm:film.visible,rinseTail:washTail,detailClock:h.time,controller:h.phase};
 }
 return {update,snapshot:()=>last};
}
