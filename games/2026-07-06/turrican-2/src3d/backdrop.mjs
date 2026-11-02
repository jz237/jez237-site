// Sky dome, planets, distant vistas, clouds, light shafts and per-world set pieces.
import * as THREE from 'three';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {fbm3,ridge3,rng,GLSL_NOISE} from './noise.mjs';
import {terrainMaterial,crystalMaterial} from './materials.mjs';
import {shardGeometry} from './terrain.mjs';

const C=c=>new THREE.Color(c);

export function buildBackdrop(level,theme,terrain,quality){
  const T=20,W=level.cols*T,H=level.rows*T,group=new THREE.Group(),sky=new THREE.Group(),anim=[],disposables=[];
  const r=rng(level.world*77+level.stageIndex*5+3);
  const sun=new THREE.Vector3(...theme.sun.dir).normalize();

  // ---- sky dome (follows the camera)
  const skyU={uZenith:{value:C(theme.sky.zenith)},uMid:{value:C(theme.sky.mid)},uHorizon:{value:C(theme.sky.horizon)},uGlow:{value:C(theme.sky.glow)},
    uSun:{value:sun.clone().setZ(-Math.abs(sun.z))},uStars:{value:theme.sky.stars},uTime:{value:0},uNebula:{value:theme.key==='rift'||theme.key==='spire'?1:0}};
  const skyMat=new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,fog:false,
    vertexShader:`varying vec3 vD;void main(){vD=normalize(position);vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_Position.z=gl_Position.w;}`,
    fragmentShader:`varying vec3 vD;uniform vec3 uZenith,uMid,uHorizon,uGlow,uSun;uniform float uStars,uTime,uNebula;${GLSL_NOISE}
      float star(vec3 d){vec3 p=d*260.;vec3 i=floor(p);float h=fract(sin(dot(i,vec3(127.1,311.7,74.7)))*43758.5);vec3 f=fract(p)-.5;float s=step(.985,h)*smoothstep(.12,0.,length(f));return s*(.5+.5*sin(uTime*2.+h*90.));}
      void main(){vec3 d=normalize(vD);float y=d.y;
        vec3 c=mix(uHorizon,uMid,smoothstep(-.02,.14,y));c=mix(c,uZenith,smoothstep(.12,.6,y));
        c=mix(c,uHorizon*.55,smoothstep(.0,-.25,y));
        float sd=max(dot(d,normalize(uSun)),0.);c+=uGlow*pow(sd,6.)*.55+uGlow*pow(sd,60.)*1.2+vec3(1.,.95,.85)*smoothstep(.9993,.9997,sd)*6.;
        if(uNebula>.5){vec2 q=d.xy/(abs(d.z)+.6)*2.3;float n=fbm(q+vec2(0.,uTime*.003))*fbm(q*2.1+7.);c+=uGlow*pow(n,2.2)*.9*smoothstep(-.1,.5,y);}
        c+=vec3(.9,.95,1.)*star(d)*uStars*smoothstep(.05,.4,y)*2.;
        gl_FragColor=vec4(c,1.);}`});
  const dome=new THREE.Mesh(new THREE.SphereGeometry(9000,48,24),skyMat);dome.renderOrder=-10;dome.frustumCulled=false;sky.add(dome);disposables.push(skyMat,dome.geometry);

  // ---- planet with rings (sky-relative so it sits at "infinity")
  if(theme.planet&&!theme.enclosed){const P=theme.planet;
    const pu={uColor:{value:C(P.color)},uBand:{value:C(P.band)},uSun:{value:sun},uGlow:{value:C(theme.sky.glow)}};
    const pm=new THREE.ShaderMaterial({uniforms:pu,fog:false,vertexShader:`varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`varying vec3 vN;varying vec3 vP;uniform vec3 uColor,uBand,uSun,uGlow;${GLSL_NOISE}
        void main(){float lat=vP.y/length(vP);float b=fbm(vec2(lat*9.,lat*3.+fbm(vec2(vP.x*.002,lat*4.))*1.5));vec3 c=mix(uColor,uBand,smoothstep(.35,.7,b));
        vec3 L=normalize(vec3(-.6,.5,.6));float l=smoothstep(-.15,.6,dot(vN,L));float rim=pow(1.-max(vN.z,0.),3.);
        gl_FragColor=vec4(c*(l*1.05+.16)+uGlow*rim*.7*l+uGlow*rim*.22,1.);}`});
    const planet=new THREE.Mesh(new THREE.SphereGeometry(P.r,64,32),pm);planet.position.set(...P.pos);sky.add(planet);disposables.push(pm,planet.geometry);
    if(P.ring){const rg=new THREE.RingGeometry(P.r*1.35,P.r*2.3,128,1);const ru={uColor:{value:C(P.ring)},uIn:{value:P.r*1.35},uOut:{value:P.r*2.3}};
      const rm=new THREE.ShaderMaterial({uniforms:ru,transparent:true,side:THREE.DoubleSide,depthWrite:false,fog:false,
        vertexShader:`varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader:`varying vec3 vP;uniform vec3 uColor;uniform float uIn,uOut;float h(float x){return fract(sin(x*91.7)*43758.5);}
          void main(){float t=(length(vP.xy)-uIn)/(uOut-uIn);float bands=.55+.45*sin(t*90.)*sin(t*23.+1.)+.25*(h(floor(t*140.))-.5);float a=smoothstep(0.,.05,t)*smoothstep(1.,.85,t)*clamp(bands,0.,1.);
          float shadow=vP.y<0.&&abs(vP.x)<uIn*.75?.25:1.;gl_FragColor=vec4(uColor*(.6+bands*.5)*shadow,a*.7);}`});
      const ring=new THREE.Mesh(rg,rm);ring.position.copy(planet.position);ring.rotation.set(-1.25,.3,.35);sky.add(ring);disposables.push(rm,rg);}
    // a small moon
    const moon=new THREE.Mesh(new THREE.SphereGeometry(P.r*.12,32,16),new THREE.MeshBasicMaterial({color:C(P.color).multiplyScalar(.7),fog:false}));moon.position.set(P.pos[0]+P.r*2.8,P.pos[1]-P.r*.4,P.pos[2]+400);sky.add(moon);disposables.push(moon.geometry,moon.material);
  }

  // ---- distant vistas (open worlds): buttes / canyon walls with crystal spires
  if(!theme.enclosed){
    const vm=terrainMaterial(theme,{strata:theme.key==='mesa'?1.4:.6,bump:1.2});disposables.push(vm);
    const geos=[];const n=quality==='low'?22:46;
    for(let i=0;i<n;i++){const z=-1100-r()*2800,x=-1500+r()*(W+3000),h=(theme.key==='mesa'?260:420)+r()*(theme.key==='mesa'?700:900),rad=120+r()*360;
      const g=new THREE.CylinderGeometry(rad*(.7+r()*.25),rad,h,28,10,false);const p=g.attributes.position;const sd=r()*100;
      for(let k=0;k<p.count;k++){let px=p.getX(k),py=p.getY(k),pz=p.getZ(k);const a=Math.atan2(pz,px),t=(py+h/2)/h;
        let rr=Math.hypot(px,pz);if(rr>1){const terr=theme.key==='mesa'?Math.floor(t*6+fbm3(a,sd,0,2)*1.2)/6:t;rr*=1+fbm3(Math.cos(a)*2,Math.sin(a)*2,t*3+sd,3)*.35-terr*.18;
          px=Math.cos(a)*rr;pz=Math.sin(a)*rr;}
        if(t>.99)py+=fbm3(px*.01,pz*.01,sd,2)*14;p.setXYZ(k,px+x,py+h/2-H-60+r()*0,pz+z);}
      g.computeVertexNormals();const c=new Float32Array(p.count*3).fill(1);g.setAttribute('color',new THREE.BufferAttribute(c,3));g.deleteAttribute('uv');geos.push(g);}
    const vista=new THREE.Mesh(mergeGeometries(geos),vm);group.add(vista);disposables.push(vista.geometry);
    // giant crystal spires glinting in the distance
    const sg=shardGeometry();const scm=crystalMaterial(theme.crystal,1.4);disposables.push(sg,scm);const sp=new THREE.InstancedMesh(sg,scm,40);const dm=new THREE.Object3D();
    for(let i=0;i<40;i++){dm.position.set(-800+r()*(W+1600),-H-40+r()*120,-500-r()*2500);dm.rotation.set((r()-.5)*.5,r()*6,(r()-.5)*.5);const s=.5+r()*1.1;dm.scale.set(16*s,(90+r()*200)*s,16*s);dm.updateMatrix();sp.setMatrixAt(i,dm.matrix);}
    group.add(sp);
    // cloud banks
    const cu={uTime:{value:0},uColor:{value:C(theme.sky.horizon).lerp(C('#ffffff'),.25)},uShade:{value:C(theme.sky.mid)}};
    const cm=new THREE.ShaderMaterial({uniforms:cu,transparent:true,depthWrite:false,fog:false,
      vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`varying vec2 vUv;uniform float uTime;uniform vec3 uColor,uShade;${GLSL_NOISE}
        void main(){vec2 p=vUv*vec2(6.,1.6)+vec2(uTime*.01,0.);float n=fbm(p)*1.1+fbm(p*2.7+3.)*.35;float a=smoothstep(.55,.95,n)*smoothstep(0.,.3,vUv.y)*smoothstep(1.,.6,vUv.y)*smoothstep(0.,.1,vUv.x)*smoothstep(1.,.9,vUv.x);
        gl_FragColor=vec4(mix(uShade,uColor,smoothstep(.5,1.1,n+vUv.y*.3)),a*.8);}`});
    disposables.push(cm);
    for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(9000,1400),cm);m.position.set(W/2,-H+500+i*380,-3800-i*500);sky.add(m);disposables.push(m.geometry);}
    anim.push(t=>cu.uTime.value=t);
  }

  // ---- enclosed set pieces
  const shaftU={uTime:{value:0},uColor:{value:C(theme.key==='foundry'?'#ffb070':theme.key==='spire'?'#d7a0ff':'#7ff0e0')}};
  if(theme.enclosed){
    const sm=new THREE.ShaderMaterial({uniforms:shaftU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false,
      vertexShader:`varying vec2 vUv;varying float vF;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vF=clamp(-p.z/1600.,0.,1.);gl_Position=projectionMatrix*p;}`,
      fragmentShader:`varying vec2 vUv;varying float vF;uniform float uTime;uniform vec3 uColor;${GLSL_NOISE}
        void main(){float n=fbm(vec2(vUv.x*5.+uTime*.05,vUv.y*1.5-uTime*.12));float a=smoothstep(0.,.35,vUv.x)*smoothstep(1.,.65,vUv.x)*pow(vUv.y,1.4)*(.45+n*.8);
        gl_FragColor=vec4(uColor*a*.16*(1.-vF*.5),1.);}`});
    disposables.push(sm);const shafts=quality==='low'?10:24;
    for(let i=0;i<shafts;i++){const x=r()*W,col=Math.min(level.cols-1,Math.max(0,Math.floor(x/T))),top=terrain.ceil[col]<100?terrain.ceil[col]:0,bot=terrain.ground[col]>-H?terrain.ground[col]:-H;
      const h=Math.max(80,top-bot+40),w=30+r()*70;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h,1,1),sm);m.position.set(x,bot+h/2-10,-120-r()*160);m.rotation.set(0,(r()-.5)*.6,(r()-.5)*.35);group.add(m);disposables.push(m.geometry);}
    anim.push(t=>shaftU.uTime.value=t);
  }
  if(theme.key==='vaults'||theme.key==='spire'){
    // hanging stalactite/crystal fangs and big wall crystals near the back wall
    const cone=new THREE.ConeGeometry(1,1,7,3);cone.translate(0,-.5,0);const p=cone.attributes.position;for(let i=0;i<p.count;i++)p.setX(i,p.getX(i)+fbm3(p.getY(i)*3,i*.1,0,2)*.12);cone.computeVertexNormals();
    const stm=terrainMaterial(theme,{bump:1.5});disposables.push(cone,stm);
    const n=Math.round(level.cols*.8),st=new THREE.InstancedMesh(cone,stm,n);const dm=new THREE.Object3D();let k=0;
    for(let i=0;i<n;i++){const x=r()*W,col=Math.floor(x/T),cy=terrain.ceil[Math.max(0,Math.min(level.cols-1,col))];if(cy>=100)continue;const z=-80-r()*240;
      dm.position.set(x,cy+6,z);dm.rotation.set((r()-.5)*.2,r()*6,(r()-.5)*.2);const s=.6+r()*1.4;dm.scale.set(7*s,(26+r()*50)*s,7*s);dm.updateMatrix();st.setMatrixAt(k++,dm.matrix);}
    st.count=k;group.add(st);
    // a bioluminescent colour on the column bottoms of big crystal clusters
    const sg=shardGeometry();const cmat=crystalMaterial(theme.crystal,1.5);disposables.push(sg,cmat);const big=new THREE.InstancedMesh(sg,cmat,60);k=0;
    for(let i=0;i<60;i++){const x=r()*W,col=Math.floor(x/T),gy=terrain.ground[Math.max(0,Math.min(level.cols-1,col))];if(gy<-H)continue;const z=-200-r()*120;
      dm.position.set(x,gy-8+r()*20,z);dm.rotation.set((r()-.5)*.8,r()*6,(r()-.5)*.8);const s=.8+r()*2;dm.scale.set(12*s,(40+r()*90)*s,12*s);dm.updateMatrix();big.setMatrixAt(k++,dm.matrix);}
    big.count=k;group.add(big);
  }
  if(theme.key==='foundry'){
    // machinery wall: pillars, girders, furnace mouths, rotating gears, a molten river behind the lane
    const metal=new THREE.MeshStandardMaterial({color:'#4a4446',metalness:.85,roughness:.42});const dark=new THREE.MeshStandardMaterial({color:'#221e20',metalness:.7,roughness:.55});disposables.push(metal,dark);
    const pillars=[],girders=[],furn=[];
    for(let x=-400;x<W+400;x+=140+r()*60){const z=-150-r()*120,gy=-H+40;const h=H+300;
      const pg=new THREE.BoxGeometry(26+r()*18,h,26+r()*18);pg.translate(x,gy+h/2-60,z);pillars.push(pg);
      if(r()<.6){const gg=new THREE.BoxGeometry(150,10,8);gg.translate(x+70,-60-r()*200,z+10);girders.push(gg);const gb=new THREE.BoxGeometry(150,3,10);gb.rotateZ(.5);gb.translate(x+70,-120-r()*120,z+12);girders.push(gb);}
      if(r()<.3){const fy=terrain.floorAt(x+65,z+16)+18;const fg=new THREE.PlaneGeometry(36,22);fg.translate(x+65,fy+13,z+17.5);furn.push(fg);const hood=new THREE.BoxGeometry(64,46,14);hood.translate(x+65,fy+20,z+10);pillars.push(hood);}}
    group.add(new THREE.Mesh(mergeGeometries(pillars),metal),new THREE.Mesh(mergeGeometries(girders),dark));disposables.push(...pillars,...girders);
    if(furn.length){const fu={uTime:{value:0}};const fm=new THREE.ShaderMaterial({uniforms:fu,fog:false,
        vertexShader:`varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader:`varying vec3 vP;varying vec3 vN;uniform float uTime;${GLSL_NOISE}void main(){float n=fbm(vec2(vP.x*.05,vP.y*.08-uTime*.8));float f=.75+.25*sin(uTime*7.+vP.x*.1);
          vec3 c=mix(vec3(.5,.06,0.),vec3(2.6,.9,.2),n*f);vec2 fp=fract(vP.xy/vec2(44.,30.));c*=mix(1.,.06,step(.78,fract(vP.x*.2)));c*=.35+.65*smoothstep(.9,.1,fp.y);gl_FragColor=vec4(c,1.);}`});
      disposables.push(fm);group.add(new THREE.Mesh(mergeGeometries(furn),fm));anim.push(t=>fu.uTime.value=t);}
    const gear=new THREE.CylinderGeometry(60,60,10,24,1);gear.rotateX(Math.PI/2);disposables.push(gear);
    for(let i=0;i<Math.ceil(W/700);i++){const g=new THREE.Group();const core=new THREE.Mesh(gear,dark);g.add(core);for(let k=0;k<12;k++){const tooth=new THREE.Mesh(new THREE.BoxGeometry(14,18,10),dark);const a=k/12*Math.PI*2;tooth.position.set(Math.cos(a)*64,Math.sin(a)*64,0);tooth.rotation.z=a;g.add(tooth);}
      g.position.set(300+i*700+r()*200,-80-r()*120,-260);const sp=(r()<.5?-1:1)*(.2+r()*.3);group.add(g);anim.push(t=>g.rotation.z=t*sp);}
    const lu={uTime:{value:0}};const lava=new THREE.ShaderMaterial({uniforms:lu,fog:false,
      vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
      fragmentShader:`varying vec3 vW;uniform float uTime;${GLSL_NOISE}void main(){vec2 p=vW.xz*.012+vec2(uTime*.06,0.);float n=fbm(p+fbm(p*1.7+uTime*.03));
        vec3 c=mix(vec3(.25,.03,0.),vec3(4.,1.2,.25),smoothstep(.35,.85,n));c+=vec3(5.,2.,.6)*smoothstep(.82,.95,n);gl_FragColor=vec4(c,1.);}`});
    disposables.push(lava);
    // molten channel following the foundry floor, with steel curbs
    const pts=[];for(let x=-400;x<=W+400;x+=20){const y=terrain.floorAt(x,-225)+1.2;pts.push(x,y,-205,x,y,-245);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));const idx=[];for(let i=0;i<pts.length/6-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}g.setIndex(idx);
    const lv=new THREE.Mesh(g,lava);group.add(lv);disposables.push(g);anim.push(t=>lu.uTime.value=t);
    const curbG=new THREE.BoxGeometry(1,5,4);disposables.push(curbG);const curbs=new THREE.InstancedMesh(curbG,metal,Math.ceil((W+800)/40)*2+4);const cdm=new THREE.Object3D();let ci=0;
    for(let x=-400;x<=W+400;x+=40){const y=terrain.floorAt(x,-225);for(const z of [-203,-247]){cdm.position.set(x,y+1,z);cdm.scale.set(40,1,1);cdm.updateMatrix();curbs.setMatrixAt(ci++,cdm.matrix);}}curbs.count=ci;group.add(curbs);
  }
  if(theme.key==='spire'){
    // colossal crystal columns rising into the dark, pulsing
    const sg=shardGeometry();const cm=crystalMaterial(theme.crystal,1.2);disposables.push(sg,cm);const cols=new THREE.InstancedMesh(sg,cm,26);const dm=new THREE.Object3D();
    for(let i=0;i<26;i++){dm.position.set(r()*W,-H-60,-190-r()*130);dm.rotation.set((r()-.5)*.25,r()*6,(r()-.5)*.25);const s=1+r()*1.2;dm.scale.set(13*s,(H+160)*s*.7,13*s);dm.updateMatrix();cols.setMatrixAt(i,dm.matrix);}
    group.add(cols);anim.push(t=>{cm.emissiveIntensity=1.6+Math.sin(t*1.3)*.5;});
  }
  if(theme.key==='rift'){
    // floating rock islands drifting in the rift
    const rock=mergeVertices(new THREE.IcosahedronGeometry(1,3));const p=rock.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);v.multiplyScalar(1+fbm3(v.x*2,v.y*2,v.z*2,3)*.45);v.y*=.6;p.setXYZ(i,v.x,v.y,v.z);}rock.computeVertexNormals();
    const rm=terrainMaterial(theme,{bump:1.2});const c=new Float32Array(p.count*3).fill(1);rock.setAttribute('color',new THREE.BufferAttribute(c,3));disposables.push(rock,rm);
    const isl=new THREE.InstancedMesh(rock,rm,60);const dm=new THREE.Object3D();const data=[];
    for(let i=0;i<60;i++){const z=-320-r()*1600,s=(10+r()*28)*(1+(-z-320)/800);data.push({x:r()*W,y:-r()*H*1.2+60,z,s,sp:r()*6});}
    group.add(isl);anim.push(t=>{data.forEach((d,i)=>{dm.position.set(d.x,d.y+Math.sin(t*.4+d.sp)*10,d.z);dm.rotation.set(d.sp,t*.05+d.sp,0);dm.scale.setScalar(d.s);dm.updateMatrix();isl.setMatrixAt(i,dm.matrix);});isl.instanceMatrix.needsUpdate=true;});
  }

  function update(t,camera){sky.position.copy(camera.position);skyU.uTime.value=t;for(const a of anim)a(t);}
  function dispose(){disposables.forEach(d=>d.dispose&&d.dispose());}
  return {group,sky,update,dispose};
}
