import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {part,mat,metal,dark,silver,cyan,amber,red,soldier,ship,enemy,boss,crystal} from './models.mjs';

import {cliffGeometry,stoneMaterial,dressCliffs,sculptRock,rockPlatform,landscapeRelief} from './cliffs.mjs';

import {smokeTexture,rockFace} from './artisan.mjs';
import {viewWidth,viewHeight,viewOrigin} from './viewport.mjs';
import {ridgeGeometry,atmosphere} from './geology.mjs';
import {buildVistas} from './vistas.mjs';
const D=window.TData,{VIEW_W:BASE_W,VIEW_H:BASE_H,TILE:T,T:Tiles}=D;
let W=BASE_W,H=BASE_H;
const legacy=window.TRender;
const dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0),v3=new THREE.Vector3();
const themes={
  1:{sky:'#091824',rock:'#77776d',fog:'#528997',fill:'#69c9e0',accent:'#63eeff'},
  2:{sky:'#041820',rock:'#5a7970',fog:'#287986',fill:'#50ffd8',accent:'#88ffe5'},
  3:{sky:'#0b1020',rock:'#444e69',fog:'#445583',fill:'#b69dff',accent:'#ba96ff'},
  4:{sky:'#151419',rock:'#69616b',fog:'#70616a',fill:'#ffac62',accent:'#ffbd69'},
  5:{sky:'#170c1d',rock:'#645e65',fog:'#693b73',fill:'#d697ff',accent:'#b7ff68'}
};

function createRenderer(display){
  let gl;
  try{gl=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:true});}
  catch(error){console.warn('WebGL unavailable; using HD compatibility renderer.',error);document.getElementById('tactics').dataset.fallback='true';return legacy.createRenderer(display);}
  const mobile=matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  const initialQuality=mobile?2:3;
  gl.setSize(W*initialQuality,H*initialQuality,false);gl.setPixelRatio(1);
  gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.12;
  gl.shadowMap.enabled=true;gl.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-W/2,W/2,H/2,-H/2,.1,1800);
  const hemi=new THREE.HemisphereLight('#b9e8ff','#111829',.95);scene.add(hemi);
  const sun=new THREE.DirectionalLight('#eadcca',2.1);sun.position.set(0,200,220);sun.castShadow=true;
  sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);Object.assign(sun.shadow.camera,{left:-400,right:400,top:270,bottom:-270,near:10,far:750});sun.shadow.bias=-.001;sun.shadow.normalBias=.8;
  scene.add(sun,sun.target);
  const rim=new THREE.DirectionalLight('#44dfff',2);scene.add(rim,rim.target);
  const pmrem=new THREE.PMREMGenerator(gl),environment=new RoomEnvironment();
  const envTarget=pmrem.fromScene(environment,.04);scene.environment=envTarget.texture;scene.environmentIntensity=.6;environment.dispose();pmrem.dispose();
  const lightPool=Array.from({length:12},()=>{const light=new THREE.PointLight('#55eaff',0,130,0);scene.add(light);return light;});
  const composer=new EffectComposer(gl);composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new THREE.Vector2(W*3,H*3),.22,.5,1.85);composer.addPass(bloom);composer.addPass(new OutputPass());
  composer.setSize(W*initialQuality,H*initialQuality);
  gl.info.autoReset=false;
  const terrain=new THREE.Group(),actors=new THREE.Group(),decor=new THREE.Group(),fxGroup=new THREE.Group();scene.add(terrain,actors,decor,fxGroup);
  const hero=soldier(),fighter=ship();actors.add(hero.root,fighter.root);
  const dx=display.getContext('2d');let level,theme,clock=0,quality=initialQuality,fx=true,crt=false,previousFrame=-1,flash=0,hurt=0,lastFreeze=0;
  let viewX=0,viewY=0,vistas=null,lastAspect=0;
  let sky=null,backgroundTexture=null,terrainTiles=null,crateTiles=null,waterTiles=null,spikeTiles=null,terrainCaps=null,tileLookup=new Map(),crateDecals=new Map(),banner=null;
  let shotMeshes=[],rings=[],sparks=[],fogSheets=[],architecture=[],plants=[],rotating=[],exitRing=null,checkpoint=null;
  const enemyModels=new Map(),pickupModels=new Map(),mineModels=new Map();let bossModel=null;
  const loader=new THREE.TextureLoader(),textureCache=new Map();
  function texture(url){if(!textureCache.has(url)){const t=loader.load(url);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());textureCache.set(url,t);}return textureCache.get(url);}
  const rockTextures=Array.from({length:5},(_,i)=>texture(`assets/img/tile${i+1}.jpg`));
  // Continuous mineral texture, with no per-tile seams or brick pattern.
  const mineralData=new Uint8Array(512*512*4);
  const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
  const noise=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix,iy),hash(ix+1,iy),u),THREE.MathUtils.lerp(hash(ix,iy+1),hash(ix+1,iy+1),u),v);};
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
    const broad=noise(x/64,y/45)*.45+noise(x/22,y/12)*.25+noise(x/7,y/5)*.18+noise(x/2,y/2)*.12;
    const strata=Math.abs(Math.sin(y*.29+noise(x*.027,y*.005)*2));
    const n=Math.max(20,Math.min(220,65+broad*150-(strata<.08?18:0))),i=(y*512+x)*4;
    mineralData[i]=n;mineralData[i+1]=n*.98;mineralData[i+2]=n*.92;mineralData[i+3]=255;
  }
  const mineralTexture=new THREE.DataTexture(mineralData,512,512,THREE.RGBAFormat);mineralTexture.wrapS=mineralTexture.wrapT=THREE.RepeatWrapping;mineralTexture.magFilter=THREE.LinearFilter;mineralTexture.minFilter=THREE.LinearMipmapLinearFilter;mineralTexture.generateMipmaps=true;mineralTexture.needsUpdate=true;
  const glowGeo=new THREE.SphereGeometry(1,8,6),glowMats=[amber,cyan,mat('#ff7cdb',.2,.25,3),red];
  const particleMesh=new THREE.InstancedMesh(glowGeo,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.88}),650);particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);particleMesh.frustumCulled=false;fxGroup.add(particleMesh);
  const smokeMap=smokeTexture(),smoke=[],smokePool=[],debris=[];
  const debrisMesh=new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1),mat('#89837b',.5,.7),96);debrisMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);debrisMesh.frustumCulled=false;fxGroup.add(debrisMesh);debrisMesh.count=0;
  const shield=new THREE.Mesh(new THREE.SphereGeometry(20,24,16),new THREE.MeshPhysicalMaterial({color:'#8cddff',roughness:.18,metalness:.1,transparent:true,opacity:.12,wireframe:true,depthWrite:false}));shield.visible=false;fxGroup.add(shield);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(28,9),new THREE.MeshBasicMaterial({map:smokeMap,color:'#05080b',transparent:true,opacity:.55,depthWrite:false}));fxGroup.add(shadow);
  const stats={artVersion:6,backend:'WebGL 2.5D',frames:0,drawCalls:0,triangles:0,lights:0,quality:initialQuality,world:0,models:0,events:{},assetsReady:false,frameMs:0};
  window.__modernGraphics={stats,get scene(){return scene;},get camera(){return camera;},get renderer(){return gl;},get hero(){return hero;},get enemies(){return enemyModels;},get effects(){return {sparks,rings};}};
  function clearGroup(g){const geometries=new Set(),materials=new Set();g.traverse(c=>{if(c.geometry)geometries.add(c.geometry);if(c.material)(Array.isArray(c.material)?c.material:[c.material]).forEach(m=>materials.add(m));});for(const c of [...g.children])g.remove(c);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
  function dynamicLight(i,x,y,z,color,intensity=2,distance=110){if(i>=lightPool.length)return;const l=lightPool[i];l.position.set(x,-y,z);l.color.set(color);l.intensity=intensity;l.distance=distance;}
  function spawnRing(x,y,color,radius=80,life=.65){
    const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending});
    const mesh=new THREE.Mesh(new THREE.TorusGeometry(1,.025,6,64),material);mesh.position.set(x,-y,30);fxGroup.add(mesh);rings.push({mesh,age:0,life,radius});
  }
  function burst(x,y,color,count=20,power=100){
    for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,speed=(.2+Math.random())*power;sparks.push({x,y,z:16+Math.random()*12,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-20,vz:(Math.random()-.5)*20,age:0,life:.25+Math.random()*.55,size:1+Math.random()*2,color:new THREE.Color(color)});}
    if(sparks.length>650)sparks.splice(0,sparks.length-650);
  }
  function puff(x,y,color,count=7,force=35){
    if(!fx)return;
    for(let i=0;i<count;i++){
      let mesh=smokePool.pop();if(!mesh)mesh=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeMap,transparent:true,depthWrite:false,color}));
      mesh.material.color.set(color);mesh.visible=true;mesh.position.set(x,-y,24+Math.random()*6);fxGroup.add(mesh);
      smoke.push({mesh,age:0,life:.7+Math.random()*.7,vx:(Math.random()-.5)*force,vy:15+Math.random()*force,size:7+Math.random()*9});
    }
    while(smoke.length>64){const p=smoke.shift();p.mesh.visible=false;smokePool.push(p.mesh);}
  }
  function consume(events,s){
    for(const e of events){stats.events[e.type]=(stats.events[e.type]||0)+1;
      if(e.type==='explosion'){puff(e.x,e.y,'#514b43',9,55);for(let k=0;k<12;k++)debris.push({x:e.x,y:e.y,z:10,vx:(Math.random()-.5)*180,vy:-40-Math.random()*160,age:0,life:1.1+Math.random()*.5,size:1+Math.random()*2});if(debris.length>96)debris.splice(0,debris.length-96);burst(e.x,e.y,'#ffb95d',32,130);spawnRing(e.x,e.y,'#ffbb70',75,.5);flash=Math.max(flash,.5);}
      if(e.type==='muzzle')burst(e.x,e.y,e.color||'#ffdd83',3,60);
      if(e.type==='spark'||e.type==='clinkfx')burst(e.x,e.y,'#c8faff',6,85);
      if(e.type==='pickup'){burst(e.x,e.y,e.color||'#75edff',12,50);spawnRing(e.x,e.y,e.color||'#75edff',22,.4);}
      if(e.type==='land'){puff(e.x,e.y,theme.rock,3,22);burst(e.x,e.y,theme.rock,6,35);}
      if(e.type==='splash'||e.type==='bubble')burst(e.x,e.y,'#88e4ff',5,25);
      if(e.type==='hurt')hurt=1;
      if(e.type==='flash'){spawnRing(s.player.x,-(-s.player.y),'#9deeff',480,1.2);flash=.35;}
      if(e.type==='line'){spawnRing(e.x,e.y,'#b1ffe5',60,.5);burst(e.x,e.y,'#c1fff1',24,160);}
      if(e.type==='banner')banner={text:e.text,sub:e.sub||'',life:2.6};
    }
  }

  function setLevel(lv){
    level=lv;theme=themes[lv.world];stats.world=lv.world;
    clearGroup(terrain);clearGroup(decor);
    for(const model of enemyModels.values())actors.remove(model.root);enemyModels.clear();
    for(const m of pickupModels.values())actors.remove(m);pickupModels.clear();
    for(const m of mineModels.values())actors.remove(m);mineModels.clear();
    if(bossModel)actors.remove(bossModel.root);bossModel=null;
    for(const r of rings){fxGroup.remove(r.mesh);r.mesh.geometry.dispose();r.mesh.material.dispose();}rings=[];sparks=[];architecture=[];rotating=[];fogSheets=[];plants=[];
    scene.background=new THREE.Color(theme.sky);scene.fog=new THREE.Fog(theme.sky,620,1300);hemi.color.set(theme.fill);rim.color.set(theme.accent);
    backgroundTexture=texture(lv.world===1?'assets/img/crystalline-canyon.png':`assets/img/world${lv.world}-bg.jpg`);
    const skyMat=[1,2,5].includes(lv.world)?atmosphere(lv.world):new THREE.MeshBasicMaterial({map:backgroundTexture,color:'#45545b',depthWrite:false,fog:false});
    sky=new THREE.Mesh(new THREE.PlaneGeometry(W*1.85,H*1.85),skyMat);sky.position.z=-650;decor.add(sky);
    buildTerrain(lv);
    buildScenery(lv);vistas=buildVistas(lv.world,mineralTexture);decor.add(vistas.group);
    const portal=mat(theme.accent,.3,.25,2);
    exitRing=new THREE.Group();exitRing.position.set(lv.exit.x+12,-lv.exit.y-22,2);
    part(exitRing,'torus',[25,2.4],silver);part(exitRing,'torus',[20,1.1],portal);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;part(exitRing,'box',[6,3,5],dark,[Math.cos(a)*25,Math.sin(a)*25,0],[0,0,a]);}decor.add(exitRing);
    checkpoint=new THREE.Group();
    if(lv.checkpoint){const c=lv.checkpoint;checkpoint.position.set(c.x||c.tx*T,-(c.y||c.ty*T),2);part(checkpoint,'cylinder',[2,3,30],silver,[0,15,0]);part(checkpoint,'sphere',[3,3,3],cyan,[0,32,0]);decor.add(checkpoint);}
    terrain.traverse(m=>{if(m.isMesh)m.castShadow=quality>2;});decor.traverse(m=>{if(m.isMesh)m.castShadow=false;});
    previousFrame=-1;clock=0;lastFreeze=0;flash=0;hurt=0;
  }
  function instanced(geometry,material,count){const m=new THREE.InstancedMesh(geometry,material,Math.max(1,count));m.count=count;m.castShadow=true;m.receiveShadow=true;terrain.add(m);return m;}
  function instance(m,i,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){dummy.position.set(x,-y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);}
  function buildTerrain(lv){
    const tiles=[],caps=[],crates=[],water=[],spikes=[];tileLookup=new Map();crateDecals=new Map();
    for(let y=0;y<lv.rows;y++)for(let x=0;x<lv.cols;x++){
      const index=y*lv.cols+x,t=lv.tiles[index];
      if(t===Tiles.SOLID){tiles.push([x,y,index]);if(y===0||lv.tiles[index-lv.cols]!==Tiles.SOLID)caps.push([x,y]);}
      else if(t===Tiles.CRATE)crates.push([x,y,index]);else if(t===Tiles.WATER)water.push([x,y,index]);else if(t===Tiles.SPIKE)spikes.push([x,y,index]);
    }
    const natural=![3,4].includes(lv.world);
    const surface=stoneMaterial(theme.rock,mineralTexture,!natural);
    terrainTiles=new THREE.Mesh(cliffGeometry(lv),surface);terrainTiles.receiveShadow=true;terrainTiles.castShadow=true;terrain.add(terrainTiles);
    dressCliffs(terrain,lv,surface);landscapeRelief(terrain,lv,surface);
    stats.terrain={...terrainTiles.geometry.userData,...terrain.userData.details,...terrain.userData.relief};
    crateTiles=instanced(new THREE.BoxGeometry(18,18,22),mat('#85766b',.6,.4),crates.length);
    crates.forEach(([x,y,index],i)=>{instance(crateTiles,i,x*T+10,y*T+10,-2);tileLookup.set(index,i);crateDecals.set(index,part(terrain,'box',[15,1.2,1.2],amber,[x*T+10,-y*T-9,10],[0,0,Math.PI/4]));});
    waterTiles=instanced(new THREE.BoxGeometry(T,T,12),new THREE.MeshPhysicalMaterial({color:'#1c8293',metalness:.45,roughness:.12,transparent:true,opacity:.5,depthWrite:false}),water.length);
    water.forEach(([x,y],i)=>instance(waterTiles,i,x*T+10,y*T+10,14));
    spikeTiles=instanced(new THREE.ConeGeometry(3.4,18,5),silver,spikes.length*3);
    spikes.forEach(([x,y],i)=>{for(let j=0;j<3;j++)instance(spikeTiles,i*3+j,x*T+3.5+j*6.5,y*T+10,4);});
    for(const pl of lv.platforms||[])rockPlatform(terrain,pl,surface,!natural);
  }
  function buildScenery(lv){
    const random=D.mulberry32(lv.world*1803),industrial=lv.world===3||lv.world===4;
    for(let layer=0;layer<3;layer++){
      const g=new THREE.Group();decor.add(g);const speed=[.12,.32,.56][layer],z=[-450,-260,-120][layer];
      const dull=industrial?mat(layer===0?'#172a38':theme.rock,.65,.75):new THREE.MeshStandardMaterial({color:['#43565c','#3b4a4e','#414747'][layer],roughness:.96,metalness:.03,vertexColors:true});
      dull.vertexColors=!industrial;if(!industrial)dull.color.lerp(new THREE.Color(theme.fog),[.30,.16,.04][layer]);dull.map=industrial?rockTextures[lv.world-1]:mineralTexture;dull.bumpMap=industrial?null:mineralTexture;dull.bumpScale=2;dull.needsUpdate=true;
      if(!industrial){const ridge=new THREE.Mesh(ridgeGeometry(layer+lv.world,layer===0?430:layer===1?340:240),dull);ridge.position.set(-120,-400,z);g.add(ridge);}
      for(let i=0;i<(industrial?15:0);i++){
        const x=i*125+random()*60,y=-340-random()*90,h=80+random()*220;
        if(industrial){
          part(g,'box',[30+random()*50,h,35],dull,[x,y+h/2,z],[0,.2,0]);
          for(let k=0;k<3;k++)part(g,'box',[8,2,1],mat(theme.accent,.1,.5,.45),[x-10+k*10,y+h*.65,z+19]);
          part(g,'cylinder',[7,7,h*.7],silver,[x+30,y+h*.35,z-5]);
          if(layer===2){const rotor=new THREE.Group();rotor.position.set(x,y+h*.65,z+30);g.add(rotor);part(rotor,'torus',[20,2],dark);for(let k=0;k<5;k++)part(rotor,'box',[23,4,2],silver,[0,0,0],[0,0,k*Math.PI/5]);rotating.push(rotor);}
        }
      }
      architecture.push({g,speed,width:1875});
    }
    for(let i=0;i<4;i++){
      const fogMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0},tint:{value:new THREE.Color(theme.fog)},strength:{value:.065+i*.012}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform float time;uniform vec3 tint;uniform float strength;varying vec2 vUv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
      void main(){vec2 p=vUv*vec2(7.,3.)+vec2(time*.016,0.);float n=noise(p)*.65+noise(p*2.3)*.35;float edge=sin(vUv.y*3.14159);gl_FragColor=vec4(tint,n*edge*strength);}`});
      const plane=new THREE.Mesh(new THREE.PlaneGeometry(W*1.6,H*.8),fogMaterial);plane.position.z=i===3?45:-350+i*90;decor.add(plane);fogSheets.push(plane);
    }
  }

  function updateActors(s,dt){
    const p=s.player,flight=level.type==='shmup';
    shield.visible=!p.dead&&p.invuln>0;shield.position.set(p.x+p.w/2,-p.y-p.h/2,9);shield.scale.set(1,.95,1);shield.rotation.y=clock;shield.material.opacity=.035+Math.sin(clock*22)**2*.07;
    shadow.visible=!flight&&!p.dead;shadow.position.set(p.x+p.w/2,-p.y-p.h+1,7);shadow.material.opacity=p.onGround?.48:.13;shadow.scale.set(p.onGround?1:.7,1,1);hero.root.visible=!flight&&!p.dead;fighter.root.visible=flight&&!p.dead;
    const model=flight?fighter:hero;model.root.position.set(p.x+p.w/2,-p.y-p.h,9);if(flight)model.root.position.y=-p.y-p.h/2;
    model.animate(p,dt,clock);
    if(p.morph&&p.onGround&&Math.abs(p.vx)>60&&dt>0){
      burst(p.x+p.w/2-Math.sign(p.vx)*8,p.y+p.h-1,'#ffcb78',2,45);
      stats.events.morphSpark=(stats.events.morphSpark||0)+1;
    }
    // Damage is shown as a brief transparency-free flash, never an unreadable invisible player.
    hero.head.scale.setScalar(1+(p.invuln>0?Math.sin(clock*30)*.015:0));
    const active=new Set();
    for(const e of s.enemies){
      if(!e.alive||Math.abs(e.x-viewX-W/2)>W/2+90)continue;
      active.add(e);let m=enemyModels.get(e);if(!m){m=enemy(e.type,level.world);actors.add(m.root);enemyModels.set(e,m);}
      m.root.visible=true;m.root.position.set(e.x+e.w/2,-e.y-e.h,6);m.animate(e,dt,s.freeze>0?e.t:clock+e.t);
      if(e.hitFlash>0)m.root.scale.y=1.04;else m.root.scale.y=e.type==='eel'?.6:1;
      if(s.freeze>0)m.root.rotation.z=Math.sin(clock*3)*.012;
    }
    for(const [e,m] of enemyModels)if(!active.has(e)){actors.remove(m.root);enemyModels.delete(e);}
    const seen=new Set();
    for(const it of s.pickups){if(it.taken||Math.abs(it.x-viewX-W/2)>W/2+50)continue;seen.add(it);let m=pickupModels.get(it);
      if(!m){m=it.type==='gem'?crystal():new THREE.Group();if(it.type!=='gem'){part(m,'box',[12,12,8],silver);part(m,'box',[3,9,1],it.type==='pu_energy'?mat('#86ff8a',.2,.3,2):amber,[0,0,5]);part(m,'box',[9,3,1],it.type==='pu_energy'?mat('#86ff8a',.2,.3,2):amber,[0,0,5]);}actors.add(m);pickupModels.set(it,m);}
      m.position.set(it.x+8,-it.y-8,8);m.rotation.y=clock*1.4;}
    for(const [it,m] of pickupModels)if(!seen.has(it)){actors.remove(m);pickupModels.delete(it);}
    const mines=new Set(s.mines);
    for(const m of s.mines){let mesh=mineModels.get(m);if(!mesh){mesh=new THREE.Group();part(mesh,'cylinder',[4,5,3],metal);part(mesh,'sphere',[1,1,1],red,[0,2,0]);actors.add(mesh);mineModels.set(m,mesh);}mesh.position.set(m.x,-m.y,8);mesh.rotation.x=.4;}
    for(const [m,mesh] of mineModels)if(!mines.has(m)){actors.remove(mesh);mineModels.delete(m);}
    const b=s.boss;
    if(b&&b.alive){if(!bossModel){bossModel=boss(b.key);actors.add(bossModel.root);}bossModel.root.visible=true;bossModel.root.position.set(b.x,-b.y-b.h,5);bossModel.root.scale.set(b.w,b.h,Math.min(b.w,b.h));bossModel.animate(b,dt,clock);}
    else if(bossModel)bossModel.root.visible=false;
    stats.models=enemyModels.size+pickupModels.size+(bossModel?1:0)+1;
  }
  function updateShots(s,dt){
    const shots=[...s.pshots.map(q=>({q,friendly:true})),...s.eshots.map(q=>({q,friendly:false}))];
    let index=0;
    for(const {q,friendly} of shots){if(q.life<=0||q.x<viewX-60||q.x>viewX+W+60)continue;
      let mesh=shotMeshes[index];if(!mesh){mesh=new THREE.Mesh(new THREE.CapsuleGeometry(1,1,3,6),amber);fxGroup.add(mesh);shotMeshes.push(mesh);}index++;
      mesh.visible=true;mesh.material=friendly?(q.bounces>0||q.kind==='bounce'?glowMats[2]:amber):red;
      mesh.position.set(q.x,-q.y,20);const speed=Math.hypot(q.vx||0,q.vy||0),len=friendly?Math.max(4,speed*.018):5;
      mesh.scale.set(friendly?1.05:1.8,len,friendly?1.05:1.8);v3.set(q.vx||1,-(q.vy||0),0).normalize();mesh.quaternion.setFromUnitVectors(up,v3);
      if(fx&&friendly&&clock%1<.9&&sparks.length<630) {const color=new THREE.Color(mesh.material.color);sparks.push({x:q.x,y:q.y,z:19,vx:0,vy:0,vz:0,age:0,life:.12,size:.8,color});}
    }
    for(let i=index;i<shotMeshes.length;i++)shotMeshes[i].visible=false;
    for(const [tile,index] of tileLookup)if(level.tiles[tile]!==Tiles.CRATE){instance(crateTiles,index,0,100000,0,0,0,0);crateTiles.instanceMatrix.needsUpdate=true;tileLookup.delete(tile);terrain.remove(crateDecals.get(tile));crateDecals.delete(tile);}
    for(let i=debris.length-1;i>=0;i--){const p=debris[i];p.age+=dt;if(p.age>p.life){debris.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=dt*310;}
    debrisMesh.count=debris.length;debris.forEach((p,i)=>{dummy.position.set(p.x,-p.y,p.z);dummy.rotation.set(p.age*7,p.age*4,i);dummy.scale.setScalar(p.size*(1-p.age/p.life));dummy.updateMatrix();debrisMesh.setMatrixAt(i,dummy.matrix);});debrisMesh.instanceMatrix.needsUpdate=true;
    for(let i=smoke.length-1;i>=0;i--){const p=smoke[i];p.age+=dt;if(p.age>=p.life){p.mesh.visible=false;smokePool.push(p.mesh);smoke.splice(i,1);continue;}p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.scale.setScalar(p.size*(1+p.age*2));p.mesh.material.opacity=Math.sin(Math.PI*p.age/p.life)*.32;}
    for(const p of sparks){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy+=dt*85;}
    sparks=sparks.filter(p=>p.age<p.life);
    particleMesh.count=Math.min(quality<=2?300:650,sparks.length);
    sparks.slice(0,particleMesh.count).forEach((p,i)=>{const a=1-p.age/p.life;dummy.position.set(p.x,-p.y,p.z);dummy.rotation.set(0,0,0);dummy.scale.setScalar(p.size*a);dummy.updateMatrix();particleMesh.setMatrixAt(i,dummy.matrix);particleMesh.setColorAt(i,p.color);});
    particleMesh.instanceMatrix.needsUpdate=true;if(particleMesh.instanceColor)particleMesh.instanceColor.needsUpdate=true;
    rings=rings.filter(r=>{r.age+=dt;if(r.age>=r.life){fxGroup.remove(r.mesh);r.mesh.geometry.dispose();r.mesh.material.dispose();return false;}const a=r.age/r.life;r.mesh.scale.setScalar(1+a*r.radius);r.mesh.material.opacity=(1-a)*.7;return true;});
  }
  function updateLights(s){
    lightPool.forEach(l=>l.intensity=0);let n=0;
    const close=s.pickups.filter(p=>p.type==='gem'&&p.x>viewX-20&&p.x<viewX+W+20).sort((a,b)=>Math.abs(a.x-s.player.x)-Math.abs(b.x-s.player.x));
    for(const p of close.slice(0,quality<=2?2:5))dynamicLight(n++,p.x+8,p.y+8,28,'#4ce4ff',.75,65);
    const p=s.player;
    dynamicLight(n++,p.x+p.w/2,p.y+12,40,s.freeze>0?'#b5f3ff':'#72cfff',.8,95);
    if(p.cooldown>.04)dynamicLight(n++,p.x+p.w/2+p.facing*20,p.y+10,30,p.weapon==='bounce'?'#ff6cdd':'#ffc66b',2.8,135);
    if(p.beamActive&&p.beam){const b=p.beam;for(const f of [.25,.7])dynamicLight(n++,b.ox+b.dx*b.len*f,b.oy+b.dy*b.len*f,25,'#5af6ff',2.2,110);}
    if(rings.length){const r=rings[rings.length-1];dynamicLight(n++,r.mesh.position.x,-r.mesh.position.y,55,r.mesh.material.color,4*(1-r.age/r.life),200);}
    if(p.morph)dynamicLight(n++,p.x+8,p.y+8,25,'#5ae8ff',2,90);
    stats.lights=n;
  }

  function overlay(s){
    const p=s.player;dx.save();dx.scale(960/W,540/H);
    const cx=viewX,cy=viewY;
    // Thin branching arcs preserve the silhouette of the target and the beam's true hit extent.
    if(p.beamActive&&p.beam){const b=p.beam;dx.save();dx.lineCap='round';dx.shadowColor='#61ecff';dx.shadowBlur=10;
      for(let branch=0;branch<4;branch++){dx.beginPath();dx.moveTo(b.ox-cx,b.oy-cy);for(let i=1;i<=20;i++){const a=i/20,j=(Math.sin(i*16+clock*75+branch*8))*((branch?3:1)*Math.sin(a*Math.PI));dx.lineTo(b.ox+b.dx*b.len*a-cx-b.dy*j,b.oy+b.dy*b.len*a-cy+b.dx*j);}dx.lineWidth=branch?.65:2;dx.strokeStyle=branch?'#55ceff':'#efffff';dx.stroke();}
      dx.restore();}
    for(const f of s.floats){if(f.line){dx.save();dx.strokeStyle='#d1ffec';dx.lineWidth=2.5;dx.shadowColor='#67ffd4';dx.shadowBlur=18;dx.beginPath();dx.moveTo(f.x-cx,-10);dx.lineTo(f.x-cx,H);dx.stroke();dx.restore();}else{dx.font='600 8px system-ui';dx.textAlign='center';dx.fillStyle='#efffff';dx.fillText(f.text,f.x-cx,f.y-cy);}}
    if(s.freeze>0){dx.fillStyle='rgba(93,192,255,.07)';dx.fillRect(0,0,W,H);dx.strokeStyle='rgba(181,241,255,.35)';dx.lineWidth=.7;for(let i=0;i<14;i++){const x=(i*173)%W,y=i%2?0:H;dx.beginPath();dx.moveTo(x,y);dx.lineTo(x+9,y+(i%2?1:-1)*(15+i%4*7));dx.lineTo(x-3,y+(i%2?1:-1)*(25+i%4*7));dx.stroke();}}
    if(hurt>0){const g=dx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);g.addColorStop(0,'rgba(255,40,60,0)');g.addColorStop(1,`rgba(255,40,60,${hurt*.4})`);dx.fillStyle=g;dx.fillRect(0,0,W,H);}
    drawHUD(s);
    if(banner&&banner.life>0){dx.textAlign='center';dx.font='600 14px system-ui';dx.fillStyle='#e9fcff';dx.fillText(banner.text,W/2,78);dx.font='9px system-ui';dx.fillStyle='#9ab4c3';dx.fillText(banner.sub,W/2,94);}
    if(crt){dx.fillStyle='rgba(0,0,0,.04)';for(let y=0;y<H;y+=3)dx.fillRect(0,y,W,1);}
    dx.restore();
  }
  function drawHUD(s){
    const p=s.player;dx.save();
    const grad=dx.createLinearGradient(0,0,0,55);grad.addColorStop(0,'rgba(3,10,19,.9)');grad.addColorStop(1,'rgba(3,10,19,0)');dx.fillStyle=grad;dx.fillRect(0,0,W,55);
    dx.font='600 7px system-ui';dx.textAlign='left';dx.fillStyle='#9eafb9';dx.fillText('ARMOR',12,13);
    dx.fillStyle='#223643';dx.fillRect(12,19,105,4);dx.fillStyle=p.energy<30?'#ff6b78':'#78e9ed';dx.fillRect(12,19,105*Math.max(0,p.energy/p.maxEnergy),4);
    dx.fillStyle='#edf9ff';dx.font='600 10px system-ui';dx.fillText(String(Math.ceil(p.energy)).padStart(3,'0'),124,24);
    dx.font='8px system-ui';dx.fillStyle='#a5b9c5';dx.fillText(`LIVES ${p.lives}`,12,35);
    const weaponColor={spread:'#ffd491',beam:'#78efff',bounce:'#ff9fe4'}[p.weapon];
    dx.font='600 9px system-ui';dx.fillStyle=weaponColor;dx.fillText(D.WEAPONS[p.weapon].name,177,22);
    dx.font='7px system-ui';dx.fillStyle='#a5b9c5';dx.fillText(`LEVEL ${p.weapons[p.weapon]}   /   FREEZE ${p.bombs}   /   LINE ${p.lines}`,177,35);
    dx.textAlign='right';dx.font='600 12px system-ui';dx.fillStyle='#91f0ff';dx.fillText(`◆ ${p.gems}`,W-12,22);
    dx.font='8px system-ui';dx.fillStyle='#a5b9c5';dx.fillText(String(p.score).padStart(7,'0'),W-12,35);
    dx.textAlign='center';dx.fillStyle=s.time<30?'#ff7685':'#b6c8d4';dx.font='9px system-ui';dx.fillText(`${Math.floor(s.time/60)}:${String(Math.floor(s.time%60)).padStart(2,'0')}`,W/2,21);
    const b=s.boss;if(b&&b.alive&&b.awake){const y=H-50;dx.fillStyle='rgba(3,10,19,.8)';dx.fillRect(W/2-120,y-15,240,26);dx.fillStyle='#ffb9bf';dx.font='600 8px system-ui';dx.fillText(b.name.toUpperCase(),W/2,y-4);dx.fillStyle='#42212f';dx.fillRect(W/2-110,y+2,220,3);dx.fillStyle='#ff6f85';dx.fillRect(W/2-110,y+2,220*Math.max(0,b.hp/b.maxHp),3);}
    dx.restore();
  }

  function render(s,dt){
    const started=performance.now();
    const rect=display.getBoundingClientRect(),aspect=rect.width/Math.max(1,rect.height);
    const nextW=viewWidth(rect.width,rect.height),nextH=viewHeight(rect.width,rect.height);
    if(Math.abs(nextW-W)>.5||Math.abs(nextH-H)>.5||!lastAspect){W=nextW;H=nextH;lastAspect=aspect;camera.left=-W/2;camera.right=W/2;camera.top=H/2;camera.bottom=-H/2;camera.updateProjectionMatrix();gl.setSize(W*quality,H*quality,false);composer.setSize(W*quality,H*quality);}
    stats.viewWidth=W;stats.viewHeight=H;stats.aspect=aspect;
    if(!level||s.level!==level)setLevel(s.level);
    dt=Math.min(.05,Math.max(0,dt));clock+=dt;flash=Math.max(0,flash-dt*2);hurt=Math.max(0,hurt-dt*2);if(banner)banner.life-=dt;
    if(s.frame!==previousFrame){consume(s.events,s);previousFrame=s.frame;s.events.length=0;}
    if(s.freeze>lastFreeze+.1)spawnRing(s.player.x+7,s.player.y+15,'#a9eeff',500,1.3);lastFreeze=s.freeze;
    const shake=Math.min(2,s.shake*.16),camx=viewOrigin(s.cam.x,W,level.cols*T)+Math.sin(clock*89)*shake,camy=Math.max(0,Math.min(Math.max(0,level.rows*T-H),s.cam.y-(H-BASE_H)/2))+Math.cos(clock*77)*shake;
    viewX=camx;viewY=camy;
    camera.position.set(camx+W/2,-camy-H/2,550);camera.lookAt(camx+W/2,-camy-H/2,0);
    sky.position.x=camx+W/2-Math.sin(camx*.0006)*80;sky.position.y=-camy-H/2;
    architecture.forEach(({g,speed,width})=>{g.position.x=camx-((camx*speed)% (width-W));g.position.y=-camy*.6;});
    fogSheets.forEach((f,i)=>{f.position.x=camx+W/2;f.position.y=-camy-H*.65+Math.sin(clock*.1+i)*25;f.material.uniforms.time.value=clock+i*18;});
    rotating.forEach((r,i)=>r.rotation.z=clock*.35*(i%2?1:-1));
    if(vistas){vistas.group.position.x=camx-((camx*.7)%900);vistas.group.position.y=-camy*.7;vistas.animated.forEach(({node,type})=>{if(type==='turbine')node.rotation.z=clock*.6;else node.scale.setScalar(1+Math.sin(clock*1.4)*.035);});}
    sun.position.set(camx+W/2-120,-camy+130,260);sun.target.position.set(camx+W/2,-camy-H/2,-20);
    rim.position.set(camx+W/2+160,-camy+60,-50);rim.target.position.set(camx+W/2,-camy-H/2,0);
    exitRing.rotation.z=clock*.22;exitRing.visible=s.bossDead;
    updateActors(s,dt);updateShots(s,dt);updateLights(s);
    gl.info.reset();if(fx)composer.render();else gl.render(scene,camera);
    dx.clearRect(0,0,960,540);dx.drawImage(gl.domElement,0,0,960,540);overlay(s);
    stats.frames++;stats.drawCalls=gl.info.render.calls;stats.triangles=gl.info.render.triangles;stats.assetsReady=!!backgroundTexture.image;stats.smoke=smoke.length;stats.debris=debris.length;stats.frameMs=stats.frameMs*.95+(performance.now()-started)*.05;
  }
  function setResolution(scale){quality=Math.max(1.5,Math.min(6,scale));terrain.traverse(m=>{if(m.isMesh)m.castShadow=quality>2;});const shadowSize=quality<=2?1024:2048;if(sun.shadow.mapSize.x!==shadowSize){sun.shadow.mapSize.set(shadowSize,shadowSize);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}stats.shadowResolution=shadowSize;gl.setSize(W*quality,H*quality,false);composer.setSize(W*quality,H*quality);stats.quality=quality;}
  function setFX(on){fx=on;gl.shadowMap.enabled=on;smoke.forEach(p=>p.mesh.visible=on);}
  return {setLevel,render,setCRT(on){crt=on;},setFX,setResolution,get buffer(){return gl.domElement;},particles:sparks};
}
window.TRender={createRenderer};
