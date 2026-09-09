import * as T from 'three';

export function createFinalPolish({scene,root,crest,plates,wordBacking,primaryCore,renderer,steel,black}){
 const details=new T.Group();details.name='Backing panel seams and recessed fasteners';wordBacking.add(details);
 const seamMat=new T.MeshStandardMaterial({color:0x010205,roughness:.8,metalness:.4});
 const seamHighlight=new T.LineBasicMaterial({color:0x738291,transparent:true,opacity:.16});
 function seam(points){
  for(let i=1;i<points.length;i++){const a=new T.Vector3(...points[i-1],.337),b=new T.Vector3(...points[i],.337),d=b.clone().sub(a);const cut=new T.Mesh(new T.BoxGeometry(.014,d.length(),.006),seamMat);cut.position.copy(a.clone().add(b).multiplyScalar(.5));cut.rotation.z=-Math.atan2(d.x,d.y);details.add(cut)}
  details.add(new T.Line(new T.BufferGeometry().setFromPoints(points.map(([x,y])=>new T.Vector3(x+.013,y,.342))),seamHighlight));
 }
 for(const x of [-4.35,-2.12,.08,2.27,4.46])seam([[x,-1.16],[x,-1.86],[x+.11,-1.98],[x+.11,-2.84]]);
 const mounts=[[-6.43,-1.14],[6.43,-1.14],[-6.69,-2.81],[6.63,-2.81],...[-5,-2.5,0,2.5,5].map(x=>[x,-2.87])];
 const socketGeo=new T.CylinderGeometry(.054,.054,.009,16).rotateX(Math.PI/2),screwGeo=new T.CylinderGeometry(.029,.029,.007,6).rotateX(Math.PI/2),rimGeo=new T.TorusGeometry(.049,.006,5,20),slotGeo=new T.BoxGeometry(.032,.007,.003);
 for(const [x,y] of mounts){for(const [geo,mat,z] of [[socketGeo,black,.345],[rimGeo,steel,.356],[screwGeo,steel,.350],[slotGeo,black,.356]]){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.receiveShadow=true;details.add(m)}}

 // Spark heads and short fading tails ride actual panel outlines in one draw call.
 const routes=plates.map(p=>({p:p.map(([x,y])=>[x,y,.80]),stage:0}));
 routes.push({p:[[-6.76,-2.91,1.26],[-6.48,-1.08,1.26],[6.48,-1.08,1.26],[6.73,-2.91,1.26]],stage:1});
 routes.push({p:[[-3.10,-2.66,.34],[0,-4.08,.34],[3.10,-2.66,.34]],stage:1});
 const positions=[],progress=[],phase=[],stage=[];
 routes.forEach((route,i)=>{const points=route.p.map(p=>new T.Vector3(...p));points.push(points[0].clone());const curve=new T.CurvePath();for(let j=1;j<points.length;j++)curve.add(new T.LineCurve3(points[j-1],points[j]));for(let j=0;j<200;j++){positions.push(...curve.getPoint(j/200).toArray());progress.push(j/200);phase.push(i*.137);stage.push(route.stage)}});
 const geo=new T.BufferGeometry();for(const [key,values,size] of [['position',positions,3],['progress',progress,1],['phase',phase,1],['stage',stage,1]])geo.setAttribute(key,new T.Float32BufferAttribute(values,size));
 const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{time:{value:0},resolution:{value:innerHeight*renderer.getPixelRatio()},power:{value:new T.Vector2(1,1)}},
  vertexShader:`uniform float time;uniform float resolution;uniform vec2 power;attribute float progress;attribute float phase;attribute float stage;varying float vSpark;varying float vHead;void main(){float head=fract(time*.22+phase)*2.4-.7;float d=progress-head;vHead=exp(-d*d*16000.);float tail=exp(-abs(d)*90.)*step(d,0.)*.35;vSpark=(vHead+tail)*mix(power.x,power.y,stage);vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(resolution*.22/-mv.z,2.,18.);}`,
  fragmentShader:`varying float vSpark;varying float vHead;void main(){vec2 p=gl_PointCoord-.5;float r=length(p);float halo=exp(-r*r*35.);float core=exp(-r*r*480.);float a=(halo*.35+core)*vSpark;if(a<.003)discard;gl_FragColor=vec4(mix(vec3(3.8,.035,.065),vec3(5.,2.,1.2),core*vHead),a);}`});
 mat.userData.glow=true;const sparks=new T.Points(geo,mat);sparks.name='Panel edge sparks';root.add(sparks);
 const iris=primaryCore.getObjectByName('Nine mechanical iris blades'),blades=iris.children.map(leaf=>({leaf,angle:leaf.rotation.z,z:leaf.position.z}));let opening=1;
 return{
  update(time,reveal,power){
   const t=reveal.revealActive?reveal.revealProgress*7.5:7.5;opening=T.MathUtils.smoothstep(t,.35,2.85);
   for(const {leaf,angle,z} of blades){const travel=-.16+.28*opening;leaf.position.set(Math.cos(angle)*travel,Math.sin(angle)*travel,z);leaf.rotation.z=angle+.09*opening}
   mat.uniforms.time.value=time;mat.uniforms.resolution.value=innerHeight*renderer.getPixelRatio();mat.uniforms.power.value.set(power.neural,power.word);
  },
  stats(){return{irisOpening:opening,edgeSparkRoutes:routes.length,edgeSparkTime:mat.uniforms.time.value,backingFasteners:mounts.length,backingSeams:5}}
 };
}

export function setupShowcase(){
 const trigger=document.getElementById('showcase'),exit=document.getElementById('showcase-exit'),stage=document.getElementById('stage');
 let active=false,ownsFullscreen=false,timer;
 const revealExit=()=>{if(!active)return;document.body.classList.add('showcase-controls');clearTimeout(timer);timer=setTimeout(()=>document.body.classList.remove('showcase-controls'),3000)};
 async function leave(){if(!active)return;active=false;clearTimeout(timer);document.body.classList.remove('showcase','showcase-controls');trigger.setAttribute('aria-pressed','false');exit.hidden=true;document.getElementById('toolbar').inert=false;document.querySelector('.back-to-games').inert=false;trigger.focus({preventScroll:true});const leaveFullscreen=ownsFullscreen;ownsFullscreen=false;if(leaveFullscreen&&document.fullscreenElement)try{await document.exitFullscreen()}catch{}}
 async function enter(){
  if(active)return;active=true;document.getElementById('reference').classList.remove('show');document.getElementById('compare').setAttribute('aria-pressed','false');trigger.setAttribute('aria-pressed','true');document.body.classList.add('showcase');exit.hidden=false;document.getElementById('toolbar').inert=true;document.querySelector('.back-to-games').inert=true;stage.focus({preventScroll:true});revealExit();
  ownsFullscreen=!document.fullscreenElement;
  if(ownsFullscreen){try{await document.documentElement.requestFullscreen();if(!active&&document.fullscreenElement)await document.exitFullscreen()}catch{ownsFullscreen=false}}
 }
 trigger.onclick=enter;exit.onclick=leave;
 addEventListener('keydown',e=>{if(e.key==='Escape'&&active)leave()});
 addEventListener('pointermove',revealExit,{passive:true});addEventListener('pointerdown',revealExit,{passive:true});
 document.addEventListener('fullscreenchange',()=>{if(active&&ownsFullscreen&&!document.fullscreenElement)leave()});
 return{stats:()=>({showcase:active})};
}
