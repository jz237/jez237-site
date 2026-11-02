// Shard Assault — real-time 3D renderer (three.js). Replaces window.TRender; the
// engine and game loop are unchanged: render(state, dt) is called every frame.
import * as THREE from 'three';
import {WORLDS,worldOf} from './worlds.mjs';
import {buildTerrain,TILE,Z_FRONT} from './terrain.mjs';
import {buildBackdrop} from './backdrop.mjs';
import {createFX} from './fx.mjs';
import {createPost} from './post.mjs';
import {createHUD} from './hud.mjs';
import {createActorKit} from './actors/index.mjs';
import {crystalMaterial} from './materials.mjs';

const D=window.TData,legacy=window.TRender;
const params=new URLSearchParams(location.search);
const C=c=>new THREE.Color(c);
const damp=THREE.MathUtils.damp,clamp=THREE.MathUtils.clamp;

function pickQuality(gl){const q=params.get('q');if(['ultra','high','low'].includes(q))return q;
  try{const saved=localStorage.getItem('shard.quality');if(['ultra','high','low'].includes(saved))return saved;}catch(e){}
  const mobile=matchMedia('(pointer: coarse)').matches||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);if(mobile)return 'low';
  // strong discrete / pro GPUs default to Ultra (ambient occlusion, 4K shadows, 2x pixel ratio)
  try{const ctx=gl.getContext(),ext=ctx.getExtension('WEBGL_debug_renderer_info'),s=ext?ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL):'';
    if(/RTX|RX ?[67]\d{3}|RX ?9\d{3}|Radeon Pro W|Arc\(TM\) A7|Apple M\d (Pro|Max|Ultra)/i.test(s))return 'ultra';}catch(e){}
  return 'high';}

function viewSize(aspect){const w=Math.max(640,Math.min(1100,360*aspect));return [w,w/aspect];}

function createRenderer(display){
  const stage=display.parentElement;
  const canvas=document.createElement('canvas');canvas.id='gl';canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block';
  stage.insertBefore(canvas,display);
  let gl;
  try{gl=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance',stencil:false});if(!gl.capabilities.isWebGL2)throw Error('WebGL2 required');}
  catch(e){console.warn('WebGL2 unavailable, using the 2D renderer',e);canvas.remove();return legacy.createRenderer(display);}
  let quality=pickQuality(gl);
  gl.setPixelRatio(1);gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;
  gl.shadowMap.enabled=true;gl.shadowMap.type=THREE.PCFSoftShadowMap;gl.info.autoReset=false;
  const dx=display.getContext('2d');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(30,16/9,8,14000);
  const hemi=new THREE.HemisphereLight(0xffffff,0x202020,.8);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffffff,3);sun.castShadow=true;scene.add(sun,sun.target);
  const rim=new THREE.DirectionalLight(0x88ccff,1.1);scene.add(rim,rim.target);
  const pmrem=new THREE.PMREMGenerator(gl);let envRT=null;
  const fx=createFX(scene,quality);
  const post=createPost(gl,scene,camera,quality);
  const hud=createHUD(dx);
  const kit=createActorKit({quality,renderer:gl});
  const stats={backend:'Shard Assault 3D',quality,frames:0,drawCalls:0,triangles:0,frameMs:0,lights:0,resolution:1};
  let level=null,theme=WORLDS[1],terrain=null,backdrop=null,props=null,hero=null,fighter=null,shield=null;
  const enemyModels=new Map(),pickupModels=new Map(),mineModels=new Map();let bossModel=null,bossRef=null;
  let clock=0,levelClock=0,previousFrame=-1,hurt=0,flash=0,frost=0,ca=0,lastFreeze=0,lastGemPulse=0,wasDead=false,lastBossFlash=0;
  const hitSeen=new WeakMap(),mz=new THREE.Vector3();
  let aspect=16/9,Wv=640,Hv=360,viewX=0,viewY=0,bw=0,bh=0,prScale=1,fxOn=true,crt=false;
  const cam={x:0,y:0,yaw:0,pitch:.07,fov:30,lead:0,init:false,zoom:1,panX:0,panY:0};
  const zoomT={z:1,x:0,y:0};let VW=640,onWater=null;   // VW: width of world actually on screen (wider when zoomed out)
  let titleMode=false,titleT=0,titlePlayer=null,bossCue=0;
  window.__modernGraphics={stats,get scene(){return scene;},get camera(){return camera;},get renderer(){return gl;},get hero(){return hero;},kit,fx};

  // ---------------------------------------------------------------- sizing
  function prCap(){const dpr=window.devicePixelRatio||1;return quality==='ultra'?Math.min(dpr,2):quality==='high'?Math.min(dpr,1.5):Math.min(dpr,2);}
  function resize(){
    const rect=canvas.getBoundingClientRect();const w=Math.max(2,rect.width),h=Math.max(2,rect.height);aspect=w/h;
    const pr=prCap()*prScale,nw=Math.round(w*pr),nh=Math.round(h*pr);
    if(nw!==bw||nh!==bh){bw=nw;bh=nh;gl.setSize(bw,bh,false);post.setSize(bw,bh);if(terrain&&terrain.water)terrain.water.setSize(bw,bh);}
    [Wv,Hv]=viewSize(aspect);camera.aspect=aspect;stats.resolution=+(pr).toFixed(2);
  }

  // ---------------------------------------------------------------- level setup
  function environmentFor(th){
    const s=new THREE.Scene();const geo=new THREE.SphereGeometry(50,32,16);const col=[],p=geo.attributes.position;
    const z=C(th.sky.zenith),m=C(th.sky.mid),hz=C(th.sky.horizon),gr=C(th.hemi.ground);
    for(let i=0;i<p.count;i++){const y=p.getY(i)/50;const c=y>0?hz.clone().lerp(m,Math.min(1,y*3)).lerp(z,Math.max(0,y*1.5-.5)):hz.clone().lerp(gr,Math.min(1,-y*4));col.push(c.r,c.g,c.b);}
    geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));s.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
    const sd=new THREE.Vector3(...th.sun.dir).normalize().multiplyScalar(40);const sunBall=new THREE.Mesh(new THREE.SphereGeometry(6,12,8),new THREE.MeshBasicMaterial({color:C(th.sun.color).multiplyScalar(18)}));sunBall.position.copy(sd);s.add(sunBall);
    const fill=new THREE.Mesh(new THREE.PlaneGeometry(60,20),new THREE.MeshBasicMaterial({color:C(th.accent).multiplyScalar(1.4),side:THREE.DoubleSide}));fill.position.set(0,-10,-45);s.add(fill);
    if(envRT)envRT.dispose();envRT=pmrem.fromScene(s,.03);scene.environment=envRT.texture;scene.environmentIntensity=th.enclosed?.45:.6;
    s.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  }
  function clearActors(){
    for(const m of enemyModels.values()){scene.remove(m.root);m.dispose&&m.dispose();}enemyModels.clear();
    for(const m of pickupModels.values()){scene.remove(m.root);m.dispose&&m.dispose();}pickupModels.clear();
    for(const m of mineModels.values()){scene.remove(m.root);m.dispose&&m.dispose();}mineModels.clear();
    if(bossModel){scene.remove(bossModel.root);bossModel.dispose&&bossModel.dispose();bossModel=null;bossRef=null;}
  }
  function setLevel(lv){
    const t0=performance.now();
    if(terrain){scene.remove(terrain.group);terrain.dispose();}if(backdrop){scene.remove(backdrop.group,backdrop.sky);backdrop.dispose();}if(props){scene.remove(props.group);props.dispose();}
    clearActors();fx.clear();
    level=lv;theme=worldOf(lv);
    terrain=buildTerrain(lv,theme,quality);scene.add(terrain.group);
    const wat=terrain.water;post.setWater(wat);
    if(wat){wat.setSize(bw,bh);wat.setLite(!fxOn);wat.onEvent=waterEvent;}
    backdrop=buildBackdrop(lv,theme,terrain,quality);scene.add(backdrop.group,backdrop.sky);
    props=buildProps(lv,theme,terrain);scene.add(props.group);
    if(!hero){hero=kit.hero();scene.add(hero.root);fighter=kit.fighter();scene.add(fighter.root);shield=makeShield();scene.add(shield);
      hero.root.traverse(o=>{if(o.isMesh)o.castShadow=true;});fighter.root.traverse(o=>{if(o.isMesh)o.castShadow=true;});}
    // lighting + atmosphere
    hemi.color.set(theme.hemi.sky);hemi.groundColor.set(theme.hemi.ground);hemi.intensity=theme.hemi.intensity;
    sun.color.set(theme.sun.color);sun.intensity=theme.sun.intensity;rim.color.set(theme.accent);rim.intensity=theme.enclosed?1.3:.9;
    const sm=quality==='ultra'?4096:quality==='high'?2048:1024;sun.shadow.mapSize.set(sm,sm);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}
    sun.shadow.bias=-.0004;sun.shadow.normalBias=.6;sun.shadow.radius=3;
    scene.fog=new THREE.Fog(C(theme.fog.color),theme.fog.near,theme.fog.far);scene.background=C(theme.fog.color);
    gl.toneMappingExposure=theme.exposure;post.setGrade(theme.grade);post.bloom.strength=theme.bloom;post.bloom.threshold=.92;post.bloom.radius=.55;
    environmentFor(theme);
    cam.init=false;levelClock=0;previousFrame=-1;
    stats.levelBuildMs=Math.round(performance.now()-t0);stats.world=lv.world;
    // compile shaders up front so the first frames do not hitch
    try{kit.warm&&kit.warm(gl,scene,camera);gl.compile(scene,camera);}catch(e){}
  }

  // ---------------------------------------------------------------- props: checkpoint beacon, exit gate
  function buildProps(lv,th,terr){
    const group=new THREE.Group(),dispose=[];const metal=new THREE.MeshStandardMaterial({color:'#6d7378',metalness:.85,roughness:.32});dispose.push(metal);
    let beacon=null,gate=null;
    if(lv.checkpoint){const cp=lv.checkpoint,gy=terr.sample(cp.x+10);const g=new THREE.Group();g.position.set(cp.x+10,gy,-18);
      const mast=new THREE.Mesh(new THREE.CylinderGeometry(1.4,2.2,46,10),metal);mast.position.y=23;g.add(mast);
      const base=new THREE.Mesh(new THREE.CylinderGeometry(7,9,5,12),metal);base.position.y=2.5;g.add(base);
      const lamp=new THREE.Mesh(new THREE.OctahedronGeometry(4.5,0),crystalMaterial('#ff5a6a',3));lamp.position.y=50;g.add(lamp);
      const ringM=new THREE.Mesh(new THREE.TorusGeometry(8,.6,6,32),new THREE.MeshBasicMaterial({color:C('#ff5a6a').multiplyScalar(3),toneMapped:false}));ringM.position.y=50;ringM.rotation.x=Math.PI/2;g.add(ringM);
      g.traverse(o=>{if(o.isMesh)o.castShadow=true;});group.add(g);beacon={g,lamp,ring:ringM,on:false};}
    if(lv.exit){const ex=lv.exit;const g=new THREE.Group();g.position.set(ex.x+ex.w/2,-(ex.y+ex.h),-6);
      for(const sx of [-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(6,ex.h+12,16),metal);p.position.set(sx*(ex.w/2+4),(ex.h+12)/2,0);g.add(p);
        const strip=new THREE.Mesh(new THREE.BoxGeometry(1.2,ex.h,1),new THREE.MeshBasicMaterial({color:C(th.accent).multiplyScalar(3),toneMapped:false}));strip.position.set(sx*(ex.w/2+1),ex.h/2+4,8.5);g.add(strip);}
      const top=new THREE.Mesh(new THREE.BoxGeometry(ex.w+20,6,18),metal);top.position.y=ex.h+12;g.add(top);
      const fu={uTime:{value:0},uOpen:{value:0},uColor:{value:C(th.accent)}};
      const field=new THREE.Mesh(new THREE.PlaneGeometry(ex.w+2,ex.h+8),new THREE.ShaderMaterial({uniforms:fu,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
        vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader:`varying vec2 vUv;uniform float uTime,uOpen;uniform vec3 uColor;void main(){vec2 c=vUv-.5;float r=length(c*vec2(1.,.7));float a=atan(c.y,c.x);
          float sw=sin(a*5.+r*30.-uTime*6.)*.5+.5;float lock=step(.5,fract(vUv.y*14.+uTime*.6))*.25;vec3 open=uColor*(sw*.9+.3)*smoothstep(.55,.1,r)*1.8;vec3 shut=vec3(1.,.15,.2)*(lock+.08)*(1.-smoothstep(.45,.5,abs(c.x)));
          gl_FragColor=vec4(mix(shut,open,uOpen),1.);}`}));
      field.position.set(0,ex.h/2+4,2);g.add(field);g.traverse(o=>{if(o.isMesh&&o.material===metal)o.castShadow=true;});group.add(g);gate={g,fu};}
    return {group,beacon,gate,update(s,t){if(beacon){const on=!!s.checkpoint;if(on&&!beacon.on){beacon.on=true;const c=C(th.accent);beacon.lamp.material.emissive.copy(c);beacon.ring.material.color.copy(c).multiplyScalar(3);fx.ring(lv.checkpoint.x+10,-(beacon.g.position.y+50),th.accent,60,.6);}
          beacon.lamp.rotation.y=t*2;beacon.ring.scale.setScalar(1+Math.sin(t*4)*.12);fx.light(beacon.g.position.x,beacon.g.position.y+50,-10,beacon.on?th.accent:'#ff5a6a',.9,90);}
        if(gate){gate.fu.uTime.value=t;gate.fu.uOpen.value=damp(gate.fu.uOpen.value,s.bossDead?1:0,3,1/60);if(s.bossDead)fx.light(gate.g.position.x,gate.g.position.y+30,10,th.accent,1.6,140);}},
      dispose(){group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material!==metal)o.material.dispose();});metal.dispose();}};
  }
  function makeShield(){const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uA:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      vertexShader:`varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`varying vec3 vN;varying vec3 vV;varying vec3 vP;uniform float uTime,uA;void main(){float f=pow(1.-abs(dot(vN,vV)),2.5);float hex=step(.82,fract((vP.x+vP.y*.58)*6.)+fract(vP.y*6.-uTime));
        gl_FragColor=vec4(vec3(.35,.85,1.)*(f*1.6+hex*.25)*uA,1.);}`}));m.visible=false;return m;}

  // ---------------------------------------------------------------- events -> effects
  function consume(events,s){
    for(let e of events){
      switch(e.type){
        case 'explosion':{let size=1;const b=s.boss;if(b&&(b.dying||!b.alive)&&e.x>=b.x-20&&e.x<=b.x+b.w+20)size=b.alive?1.5:2.6;
          else{const near=s.enemies.find(en=>!en.alive&&Math.abs(en.x+en.w/2-e.x)<4&&Math.abs(en.y+en.h/2-e.y)<4);if(near&&(near.type==='drifter'||near.type==='hugger'||near.type==='egg'))size=.75;}
          fx.explosion(e.x,e.y,size,theme);if(terrain.water&&terrain.water.splash(e.x,e.y,size*1.3))splashFX(e.x,-terrain.water.surfaceAt(e.x).y,size*.8);break;}
        case 'spark':fx.sparks(e.x,e.y,'#ffe0a0',6,140,{life:.6});fx.glowBall(e.x,e.y,'#ffc070',6,.08);break;
        case 'muzzle':{const c=e.color||'#ffd23f';if(level.type!=='shmup'&&hero&&hero.getMuzzle&&hero.root.visible){hero.getMuzzle(mz);e={...e,x:mz.x,y:-mz.y};}fx.glowBall(e.x,e.y,c,9,.06,6,2.2);fx.sparks(e.x,e.y,c,3,120,{life:.4});fx.flashLight(e.x,e.y,c,2.4,110,.07);
          if(Math.random()<.35)fx.puff(e.x,e.y,'#8a8a90',1,4,{life:.5,speed:20,alpha:.25});break;}
        case 'pickup':fx.sparks(e.x+8,e.y+8,e.color||'#9be6ff',18,150,{grav:-60,life:1.4});fx.ring(e.x+8,e.y+8,e.color||'#9be6ff',22,.35);fx.flashLight(e.x+8,e.y+8,e.color||'#9be6ff',2.5,90,.25);break;
        case 'splash':{const w=terrain.water,sf=w&&w.surfaceAt(e.x),sy=sf?-sf.y:e.y;if(w)w.splash(e.x,sy,1.4);splashFX(e.x,sy,1);break;}
        case 'land':fx.puff(e.x,e.y,theme.top.color,5,6,{life:.7,speed:55,rise:8,alpha:.45,grav:-10});break;
        case 'bubble':fx.glow.emit(e.x,-e.y,2,(Math.random()-.5)*10,30,0,.4,.8,.9,.7,1.6,1.4,1.8,40,.5,0,0);break;
        case 'updraft':fx.glow.emit(e.x+(Math.random()-.5)*20,-e.y,(Math.random()-.5)*30,0,160,0,.5,.8,1,.6,.6,1.2,.4,0,.5,.02,0);break;
        case 'hurt':hurt=1;ca=Math.max(ca,.012);fx.shakeImpulse(.35);fx.sparks(s.player.x+7,s.player.y+15,'#ff8a8a',10,140);break;
        case 'flash':flash=1;fx.ring(s.player.x+7,s.player.y+15,'#a9eeff',260,.9,{start:4});fx.ring(s.player.x+7,s.player.y+15,'#ffffff',140,.5,{start:2});
          for(let i=0;i<70;i++){const a=Math.random()*6.28,v=80+Math.random()*260;fx.glow.emit(s.player.x+7,-(s.player.y+15),(Math.random()-.5)*40,Math.cos(a)*v,Math.sin(a)*v,(Math.random()-.5)*90,.6,.9,1.2,1,1.2,2.2,.5,-80,1.8,.01,3);}break;
        case 'line':fx.shockwall(e.x,viewY,Hv);break;
        case 'banner':hud.setBanner(e.text,e.sub);if(e.text==='WARNING')bossCue=1.8;break;
      }
    }
  }

  // ---------------------------------------------------------------- water feedback
  // a splash: a crown of droplets, a white burst, spray drifting off, a foam ring on the surface
  function splashFX(x,y,s){const R=Math.random;
    for(let i=0;i<Math.round(34*s);i++){const a=R()*Math.PI,v=(80+R()*190)*s;
      fx.glow.emit(x+(R()-.5)*8,-y,(R()-.5)*24,Math.cos(a)*v*.55,Math.sin(a)*v,(R()-.5)*70,.7,.95,1.1,.95,.55+R()*.5,1.1+R()*1.2,.5,-760,.6,.016,0);}
    for(let i=0;i<Math.round(10*s);i++)fx.glow.emit(x+(R()-.5)*14,-y+2,(R()-.5)*16,(R()-.5)*30,40+R()*70,0,.9,1,1.1,.6,.35,4+R()*3,9,-200,2,0,0);
    fx.puff(x,y-4,'#dff6f8',Math.round(4*s),9*s,{life:1.1,speed:26,rise:18,alpha:.28,z:4});
    fx.ring(x,y,'#bff4ff',30*s,.7,{flat:true,z:0});fx.ring(x,y,'#ffffff',16*s,.4,{flat:true,z:0});}
  function waterEvent(kind,x,y,a){
    if(kind==='plip'){fx.sparks(x,y,'#cdf6ff',5,90,{life:.45,grav:-500});fx.ring(x,y,'#bff4ff',10,.45,{flat:true,z:0});}
    else if(kind==='splash')splashFX(x,y,.7);
    else if(kind==='drip'){fx.ring(x,y,'#bff4ff',9,.6,{flat:true,z:0});}
    if(onWater)onWater(kind,x,y,a);}

  // ---------------------------------------------------------------- camera director
  function updateCamera(s,dt){
    const p=s.player,LW=level.cols*TILE,LH=level.rows*TILE;
    const ox=Math.max(0,Math.min(Math.max(0,LW-Wv),s.cam.x-(Wv-640)/2));
    const oy=Math.max(0,Math.min(Math.max(0,LH-Hv),s.cam.y-(Hv-360)/2));
    let tx=ox+Wv/2,ty=oy+Hv/2;
    const flight=level.type==='shmup';
    const boss=s.boss&&s.boss.alive&&s.boss.awake;
    const lead=flight?0:clamp(p.vx*.12,-26,26)*(p.dead?0:1);cam.lead=damp(cam.lead,lead,1.6,dt);
    tx=clamp(tx+cam.lead,Wv/2,Math.max(Wv/2,LW-Wv/2));
    const yawT=flight?-.06:clamp(-p.vx/205*.045,-.05,.05)+(boss?.0:0),pitchT=flight?.05:(boss?.05:.075);
    if(!cam.init){cam.x=tx;cam.y=ty;cam.yaw=-.5;cam.pitch=.22;cam.fov=22;cam.init=true;}
    const intro=Math.max(0,1-levelClock/2.4),ease=intro*intro*(3-2*intro);
    cam.x=damp(cam.x,tx,8,dt);cam.y=damp(cam.y,ty,8,dt);
    cam.yaw=damp(cam.yaw,yawT,intro>0?2.2:1.8,dt);cam.pitch=damp(cam.pitch,pitchT,2.2,dt);cam.fov=damp(cam.fov,boss?31.5:30,2,dt);
    let yaw=cam.yaw,pitch=cam.pitch,distMul=1+ease*-.35;
    if(bossCue>0&&s.boss){bossCue-=dt;const k=Math.sin(Math.min(1,bossCue/1.8)*Math.PI)*.5;tx+=((s.boss.x+s.boss.w/2)-tx)*.0;yaw+=-.08*k*Math.sign((s.boss.x+s.boss.w/2)-cam.x);pitch-=.03*k;distMul*=1-.08*k;}
    if(s.won||s.gameOver){yaw+=Math.sin(levelClock*.25)*.12;distMul*=.92;}
    const fov=cam.fov;camera.fov=fov;camera.updateProjectionMatrix();
    const d=(Hv/2)/Math.tan(THREE.MathUtils.degToRad(fov/2))*distMul/cam.zoom;
    const sh=fx.shake+Math.min(1.5,s.shake*.12),jx=(Math.sin(clock*71)+Math.sin(clock*113)*.5)*sh*2.2,jy=(Math.cos(clock*83)+Math.cos(clock*127)*.5)*sh*2.2;
    const target=new THREE.Vector3(cam.x+jx,-cam.y+jy,0);
    if(intro>0){target.x=cam.x*(1-ease)+(p.x+7)*ease;target.y=-(cam.y*(1-ease)+(p.y+15)*ease);}
    // viewer zoom (pinch / wheel in the demo): closer frames the trooper, a two-finger drag looks around
    cam.zoom=damp(cam.zoom,zoomT.z,9,dt);cam.panX=damp(cam.panX,zoomT.x,9,dt);cam.panY=damp(cam.panY,zoomT.y,9,dt);
    const zf=cam.zoom,kz=clamp((zf-1)/.7,0,1)*.85;
    target.x+=((p.x+7)-target.x)*kz+cam.panX*Wv;target.y+=(-(p.y+15)-target.y)*kz+cam.panY*Hv;
    if(zf<1){const hw=Wv/zf/2,hh=Hv/zf/2;target.x=clamp(target.x,Math.min(hw,LW/2),Math.max(LW-hw,LW/2));target.y=clamp(target.y,-Math.max(LH-hh,LH/2),-Math.min(hh,LH/2));}
    camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*d,target.y+Math.sin(pitch)*d,Math.cos(yaw)*Math.cos(pitch)*d);
    camera.lookAt(target);camera.rotateZ(sh*.004*Math.sin(clock*57));
    VW=Wv/Math.min(1,zf);viewX=(zf<1?target.x:cam.x)-VW/2;viewY=cam.y-Hv/2;
    // sun shadow box follows the view (texel snapped)
    const sd=new THREE.Vector3(...theme.sun.dir).normalize();const ext=Math.max(Wv,Hv)*.75+120;
    const sc=sun.shadow.camera;sc.left=-ext;sc.right=ext;sc.top=ext*.8;sc.bottom=-ext*.8;sc.near=10;sc.far=2400;sc.updateProjectionMatrix();
    const texel=ext*2/sun.shadow.mapSize.x;const fx0=Math.round(cam.x/texel)*texel,fy0=Math.round(-cam.y/texel)*texel;
    sun.target.position.set(fx0,fy0,-60);sun.position.set(fx0+sd.x*1000,fy0+sd.y*1000,-60+sd.z*1000);
    rim.target.position.set(cam.x,-cam.y,0);rim.position.set(cam.x+200,-cam.y+260,-400);
  }

  // ---------------------------------------------------------------- actors
  function inView(x,margin){return x>viewX-margin&&x<viewX+VW+margin;}
  function updateActors(s,dt){
    const p=s.player,flight=level.type==='shmup';
    const blink=p.invuln>0&&!p.dead?(Math.floor(clock*18)%3!==0):true;
    hero.root.visible=!flight&&!p.dead&&blink;fighter.root.visible=flight&&!p.dead&&blink;
    if(flight){fighter.root.position.set(p.x+p.w/2,-(p.y+p.h/2),0);fighter.update(p,s,dt,clock);}
    else{hero.root.position.set(p.x+p.w/2,-(p.y+p.h),0);hero.update(p,s,dt,clock);}
    shield.visible=!p.dead&&p.invuln>0;if(shield.visible){shield.position.set(p.x+p.w/2,-(p.y+p.h/2),0);shield.scale.setScalar(flight?20:p.morph?13:21);shield.material.uniforms.uTime.value=clock;shield.material.uniforms.uA.value=Math.min(1,p.invuln*2)*(.6+.4*Math.sin(clock*20));}
    if(p.dead&&!wasDead){fx.explosion(p.x+p.w/2,p.y+p.h/2,1.6,theme);fx.ring(p.x+p.w/2,p.y+p.h/2,theme.accent,90,.6);fx.chunks(p.x+p.w/2,p.y+p.h/2,'#9aa6b0',12,220,1.8,.3);fx.shakeImpulse(.6);ca=.02;}wasDead=p.dead;
    // suit light + run dust + morph sparks + thruster glow
    if(!p.dead){fx.light(p.x+p.w/2,-(p.y+10),26,flight?'#9fd8ff':theme.accent,.35,90);
      if(!flight&&p.onGround&&Math.abs(p.vx)>120&&Math.random()<dt*7)fx.puff(p.x+p.w/2-Math.sign(p.vx)*4,p.y+p.h,theme.top.color,1,4,{life:.6,speed:20,rise:10,alpha:.35});
      if(p.morph&&p.onGround&&Math.abs(p.vx)>60&&Math.random()<dt*25)fx.sparks(p.x+p.w/2-Math.sign(p.vx)*7,p.y+p.h-1,'#ffcb78',2,60,{life:.6});
      if(flight&&Math.random()<dt*60){fx.glow.emit(p.x-2,-(p.y+p.h/2),0,-160-Math.random()*80,(Math.random()-.5)*20,0,.6,1,1.8,1,.18,3.2,.6,0,1,0,0);}}
    if(p.inWater&&Math.random()<dt*3)fx.glow.emit(p.x+p.w/2,-(p.y+6),3,(Math.random()-.5)*8,25,0,.4,.8,.9,.6,1.4,1.2,1.6,35,.5,0,0);
    // enemies
    const live=new Set();
    for(const e of s.enemies){if(!e.alive||!inView(e.x,120))continue;live.add(e);let m=enemyModels.get(e);
      if(!m){m=kit.enemy(e);m.root.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(m.root);enemyModels.set(e,m);}
      m.root.position.set(e.x+e.w/2,-(e.y+e.h),0);m.update(e,s,dt,clock);
      const hf=e.hitFlash||0,prev=hitSeen.get(e)||0;if(hf>prev+.01&&dt>0){fx.sparks(e.x+e.w/2,e.y+e.h/2,'#ffd8a0',5,150,{life:.5});fx.glowBall(e.x+e.w/2,e.y+e.h/2,'#ffe2b0',7,.06,8,1.6);}hitSeen.set(e,hf);
      if(s.freeze>0&&Math.random()<dt*3)fx.glow.emit(e.x+Math.random()*e.w,-(e.y+Math.random()*e.h),6,0,8,0,.5,.8,1,.8,.8,1.6,.4,0,.5,0,0);}
    for(const [e,m] of enemyModels)if(!live.has(e)){scene.remove(m.root);m.dispose&&m.dispose();enemyModels.delete(e);}
    // pickups
    const seen=new Set();let gemLights=0;
    for(const it of s.pickups){if(it.taken||!inView(it.x,60))continue;seen.add(it);let m=pickupModels.get(it);
      if(!m){m=kit.pickup(it.type);scene.add(m.root);pickupModels.set(it,m);}
      m.root.position.set(it.x+it.w/2,-(it.y+it.h/2),0);m.update(it,s,dt,clock);
      if(gemLights<(quality==='low'?1:3)&&Math.abs(it.x-p.x)<200){fx.light(it.x+8,-(it.y+8),14,it.type==='gem'?'#4ce4ff':'#ffd23f',.45,60);gemLights++;}}
    for(const [it,m] of pickupModels)if(!seen.has(it)){scene.remove(m.root);m.dispose&&m.dispose();pickupModels.delete(it);}
    // mines
    const ms=new Set(s.mines);for(const mn of s.mines){let m=mineModels.get(mn);if(!m){m=kit.mine();scene.add(m.root);mineModels.set(mn,m);}m.root.position.set(mn.x,-(mn.y),0);m.update(mn,s,dt,clock);
      if(Math.floor(clock*6)%2===0)fx.light(mn.x,-mn.y+3,8,'#ff3030',.25,30);}
    for(const [mn,m] of mineModels)if(!ms.has(mn)){scene.remove(m.root);m.dispose&&m.dispose();mineModels.delete(mn);}
    // boss
    const b=s.boss;
    if(b&&b.alive){if(!bossModel||bossRef!==b){if(bossModel){scene.remove(bossModel.root);bossModel.dispose&&bossModel.dispose();}bossModel=kit.boss(b);bossRef=b;bossModel.root.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(bossModel.root);}
      bossModel.root.visible=true;bossModel.root.position.set(b.x+b.w/2,-(b.y+b.h),0);bossModel.update(b,s,dt,clock);
      if(b.open)fx.light(b.x+b.w/2,-(b.y+b.h/2),40,'#ffd27a',2.2,180);
      if((b.hitFlash||0)>lastBossFlash+.01&&dt>0){const hx=b.x+b.w*(b.open?.5:.15+Math.random()*.7),hy=b.y+b.h*(b.open?.5:.2+Math.random()*.6);fx.sparks(hx,hy,b.open?'#fff0a0':'#c8d8ff',b.open?8:5,b.open?220:170,{life:.5});}lastBossFlash=b.hitFlash||0;if(b.dying&&Math.random()<dt*14)fx.sparks(b.x+Math.random()*b.w,b.y+Math.random()*b.h,'#ffc070',6,200);}
    else if(bossModel){scene.remove(bossModel.root);bossModel.dispose&&bossModel.dispose();bossModel=null;bossRef=null;}
  }

  // ---------------------------------------------------------------- ambient particles
  function ambient(s,dt){
    const k=theme.ambient,area=VW*Hv/230400,x0=viewX-60,y0=viewY;const R=Math.random,Wv=VW;
    const wind=(level.windX||0)*(s.windPhase||0);
    if(k==='dust'){for(let i=0;i<area*dt*30;i++)fx.smoke.emit(x0+R()*(Wv+120),-(y0+R()*Hv),-60+R()*90,60+wind*.8+R()*40,(R()-.5)*14,0,.85,.68,.5,.18,3,1.4,2.4,0,.2,0,0);
      if(Math.abs(wind)>60&&R()<dt*4)fx.smoke.emit(x0+R()*Wv,-(y0+Hv*.6+R()*Hv*.4),-40+R()*60,wind*1.6,10,0,.8,.6,.45,.12,2.2,18,46,0,.4,0,0);}
    else if(k==='motes'){for(let i=0;i<area*dt*22;i++)fx.glow.emit(x0+R()*(Wv+120),-(y0+R()*Hv),-120+R()*150,(R()-.5)*8,6+R()*8,0,.25,.9,.75,.8,4,1.2,.4,0,.1,0,0);}
    else if(k==='speed'){for(let i=0;i<area*dt*40;i++)fx.glow.emit(viewX+Wv+20,-(y0+R()*Hv),-200+R()*200,-900-R()*500,0,0,.35,.35,.6,.6,1.4,1.5,1.5,0,.05,.03,0);}
    else if(k==='embers'){for(let i=0;i<area*dt*26;i++)fx.glow.emit(x0+R()*(Wv+120),-(y0+Hv+10),-150+R()*170,(R()-.5)*30,40+R()*60,0,1.8,.6,.15,1,3.5,1.1,.3,8,.3,.01,0);
      if(R()<dt*8)fx.smoke.emit(x0+R()*Wv,-(y0+Hv),-200+R()*80,10,30,0,.25,.22,.2,.4,6,40,120,4,.2,0,0);}
    else if(k==='spores'){for(let i=0;i<area*dt*16;i++){const g=R()<.4;fx.glow.emit(x0+R()*(Wv+120),-(y0+R()*Hv),-150+R()*180,(R()-.5)*14,(R()-.5)*14,0,g?.7:.9,g?1.6:.5,g?.4:1.5,.9,5,1.6,.3,0,.1,0,0);}}
  }

  // ---------------------------------------------------------------- crates destroyed
  function crates(){if(!terrain.crateIndex.size)return;for(const ti of [...terrain.crateIndex.keys()])if(level.tiles[ti]!==6){const p=terrain.removeCrate(ti);if(p){fx.chunks(p.x,-p.y,level.type==='shmup'?'#3a3f52':'#8a6a44',14,200,2.6,.2);fx.sparks(p.x,-p.y,theme.accent,14,200);}}}

  // ---------------------------------------------------------------- frame
  function render(s,dt){
    const t0=performance.now();titleMode=false;resize();
    if(!level||s.level!==level)setLevel(s.level);
    dt=Math.min(.05,Math.max(0,dt));clock+=dt;levelClock+=dt;
    if(s.frame!==previousFrame){consume(s.events,s);previousFrame=s.frame;s.events.length=0;}
    crates();
    updateCamera(s,dt);
    updateActors(s,dt);
    let beamFrom=null;if(level.type!=='shmup'&&s.player.beamActive&&hero.getMuzzle){hero.getMuzzle(mz);beamFrom={x:mz.x,y:-mz.y};}
    fx.drawShots(s,viewX,VW);fx.drawBeam(s.player,clock,theme,beamFrom);fx.moveWalls(s.floats);
    if(dt>0){ambient(s,dt);for(const f of terrain.falls)if(f.x>viewX-60&&f.x<viewX+VW+60){if(Math.random()<dt*14)fx.puff(f.x+(Math.random()-.5)*20,-(f.bot+40),'#e8f6ff',1,10,{life:1.6,speed:30,rise:26,alpha:.3,z:-40});
      if(Math.random()<dt*30)fx.glow.emit(f.x+(Math.random()-.5)*20,f.bot+40,-40,(Math.random()-.5)*60,40+Math.random()*60,(Math.random()-.5)*30,.5,.7,.8,.7,.7,1.2,.5,-300,.6,.01,0);}}
    props.update(s,clock);terrain.update(clock,dt,s);backdrop.update(clock,camera);
    if(terrain.water){camera.updateMatrixWorld();terrain.water.update(clock,dt,s,camera,viewX,VW);}
    for(const g of terrain.fg){const dxp=Math.abs(g.position.x-(s.player.x+7));g.visible=dxp>60||g.position.x<viewX-200||g.position.x>viewX+Wv+200?true:false;}
    fx.update(dt,clock,level,{x:cam.x},(x,y)=>{const tx=Math.floor(x/TILE),ty=Math.floor(y/TILE);if(tx<0||tx>=level.cols)return false;if(ty>=level.rows)return true;if(ty<0)return false;return level.tiles[ty*level.cols+tx]===1;});
    // post
    hurt=Math.max(0,hurt-dt*2.2);flash=Math.max(0,flash-dt*2.5);ca=Math.max(0,ca-dt*.04);
    frost=damp(frost,s.freeze>0?1:0,4,dt||.016);
    const u=post.u;u.uTime.value=clock;u.uHurt.value=hurt*.8;u.uFlash.value=flash*.55;u.uFrost.value=frost;u.uCA.value=ca+fx.shake*.004;u.uScan.value=crt?1:0;u.uFade.value=0;
    draw();
    // HUD overlay
    dx.clearRect(0,0,960,540);
    hud.draw(s,aspect,project,clock,dt,canvas.clientHeight);
    stats.frames++;stats.frameMs=stats.frameMs*.94+(performance.now()-t0)*.06;autoRes(dt);
  }
  function draw(){gl.info.reset();if(fxOn)post.render();else gl.render(scene,camera);stats.drawCalls=gl.info.render.calls;stats.triangles=gl.info.render.triangles;stats.lights=fx.stats().lights;}
  const pv=new THREE.Vector3();
  function project(x,y){pv.set(x,-y,0).project(camera);if(pv.z>1)return null;return {x:(pv.x+1)/2,y:(1-pv.y)/2};}

  // dynamic resolution: hold 60 fps by scaling the drawing buffer
  let slow=0,fast=0;
  function autoRes(dt){if(params.has('fixed')||dt<=0)return;const ms=dt*1000;
    if(ms>19.5){slow+=dt;fast=0;}else if(ms<15.5){fast+=dt;slow=Math.max(0,slow-dt*.5);}
    if(slow>.8&&prScale>.55){prScale=Math.max(.55,prScale-.1);slow=0;}
    else if(fast>4&&prScale<1){prScale=Math.min(1,prScale+.05);fast=0;}}

  // ---------------------------------------------------------------- title scene
  let titleLevel=null;
  function renderTitle(dt){
    resize();dt=Math.min(.05,Math.max(0,dt));clock+=dt;titleT+=dt;
    if(!titleMode||!titleLevel||level!==titleLevel){
      if(!titleLevel)titleLevel=D.buildLevel(0,0);
      if(level!==titleLevel)setLevel(titleLevel);
      // stand the hero on a high ledge a little way in
      let best=null;for(let tx=12;tx<Math.min(titleLevel.cols-10,90);tx++){const gy=terrain.ground[tx];if(gy>-titleLevel.rows*TILE&&(!best||gy>best.gy+15))best={tx,gy};}
      const gx=(best?best.tx:20)*TILE+10,gy=best?best.gy:terrain.ground[20];
      titlePlayer={x:gx-7,y:-gy-30,w:14,h:30,vx:0,vy:0,facing:-1,onGround:true,crouch:false,morph:false,weapon:'beam',weapons:{spread:3,beam:3,bounce:3},beamActive:false,beamAngle:0,cooldown:0,invuln:0,dead:false,energy:100,maxEnergy:100,lives:3,inWater:false};
      titleMode=true;titleT=0;
    }
    const p=titlePlayer,fake={player:p,level:titleLevel,freeze:0,enemies:[],pickups:[],pshots:[],eshots:[],mines:[],floats:[],cam:{x:p.x-320,y:0},time:999,shake:0,boss:null,windPhase:Math.sin(titleT*.3),frame:-1};
    hero.root.visible=true;fighter.root.visible=false;shield.visible=false;
    hero.root.position.set(p.x+7,-(p.y+30),0);hero.update(p,fake,dt,clock);
    const a=.34+Math.sin(titleT*.11)*.1,pitch=-.05+Math.sin(titleT*.07)*.02,d=190+Math.sin(titleT*.09)*14;
    const tgt=new THREE.Vector3(p.x+7-62,-(p.y-6),0);
    camera.fov=34;camera.aspect=aspect;camera.updateProjectionMatrix();
    camera.position.set(tgt.x+Math.sin(a)*d,tgt.y+Math.sin(pitch)*d+6,Math.cos(a)*d);camera.lookAt(tgt);
    viewX=tgt.x-Wv/2;viewY=-tgt.y-Hv/2;cam.x=tgt.x;cam.y=-tgt.y;
    const sd=new THREE.Vector3(...theme.sun.dir).normalize(),sc=sun.shadow.camera;sc.left=-300;sc.right=300;sc.top=220;sc.bottom=-220;sc.near=10;sc.far=2400;sc.updateProjectionMatrix();
    sun.target.position.set(tgt.x,tgt.y,-60);sun.position.set(tgt.x+sd.x*1000,tgt.y+sd.y*1000,-60+sd.z*1000);
    if(dt>0)ambient(fake,dt);
    fx.light(p.x+7,-(p.y+10),20,theme.accent,.5,80);
    terrain.update(clock,dt,fake);backdrop.update(clock,camera);
    fx.update(dt,clock,level,{x:tgt.x},()=>false);
    const u=post.u;u.uTime.value=clock;u.uHurt.value=0;u.uFlash.value=0;u.uFrost.value=0;u.uCA.value=0;u.uFade.value=Math.max(0,1-titleT*1.2);
    draw();dx.clearRect(0,0,960,540);
  }

  // ---------------------------------------------------------------- API
  function setResolution(scale){quality=scale>=6?'ultra':scale>=3?'high':'low';stats.quality=quality;prScale=1;bw=0;resize();
    const sm=quality==='ultra'?4096:quality==='high'?2048:1024;if(sun.shadow.mapSize.x!==sm){sun.shadow.mapSize.set(sm,sm);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}}
  function setFX(on){fxOn=on;if(!on){prScale=.7;bw=0;}if(on)camera.layers.disable(1);else camera.layers.enable(1);if(terrain&&terrain.water)terrain.water.setLite(!on);}
  function setZoom(z,px,py){zoomT.z=z;zoomT.x=px||0;zoomT.y=py||0;}
  return {setLevel,render,renderTitle,setCRT(on){crt=on;},setFX,setResolution,setZoom,get zoom(){return cam.zoom;},set onWater(f){onWater=f;},get buffer(){return canvas;},get quality(){return quality;},particles:[]};
}

window.TRender={createRenderer};
