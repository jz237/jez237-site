// Effects: GPU particles (closed-form motion), debris, tracers, the arc-lance beam,
// shockwall, rings and a pooled dynamic-light allocator.
import * as THREE from 'three';
import {GLSL_NOISE} from './noise.mjs';

const tmpC=new THREE.Color();

// ---------------------------------------------------------------- particles
class ParticleSystem{
  constructor(max,mode){
    this.max=max;this.head=0;this.time=0;this.dirtyMin=Infinity;this.dirtyMax=-1;
    const g=new THREE.InstancedBufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3));g.setIndex([0,1,2,0,2,3]);
    const mk=(n)=>{const a=new THREE.InstancedBufferAttribute(new Float32Array(max*n),n);a.setUsage(THREE.DynamicDrawUsage);return a;};
    this.aPos=mk(3);this.aVel=mk(3);this.aCol=mk(4);this.aT=mk(4);this.aPh=mk(4);
    g.setAttribute('aPos',this.aPos);g.setAttribute('aVel',this.aVel);g.setAttribute('aCol',this.aCol);g.setAttribute('aT',this.aT);g.setAttribute('aPh',this.aPh);
    g.instanceCount=max;
    // park every slot in the past so nothing draws
    for(let i=0;i<max;i++){this.aT.array[i*4]=-1e6;this.aT.array[i*4+1]=.001;}
    const smoke=mode==='smoke';
    this.uniforms={uTime:{value:0},uLight:{value:new THREE.Color(1,1,1)},uAmbient:{value:new THREE.Color(.4,.4,.45)}};
    this.material=new THREE.ShaderMaterial({uniforms:this.uniforms,transparent:true,depthWrite:false,
      blending:smoke?THREE.NormalBlending:THREE.AdditiveBlending,
      vertexShader:`attribute vec3 aPos,aVel;attribute vec4 aCol,aT,aPh;uniform float uTime;varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;
        void main(){float age=uTime-aT.x;float life=aT.y;if(age<0.||age>life){gl_Position=vec4(2.,2.,2.,1.);return;}
          float k=max(aPh.y,.0001);float e=1.-exp(-k*age);vec3 p=aPos+aVel*e/k;p.y+=aPh.x*(age/k-e/(k*k));
          float t=age/life;float size=mix(aT.z,aT.w,t);
          vec4 mv=modelViewMatrix*vec4(p,1.);vec2 q=position.xy;
          if(aPh.z>0.){vec3 v=aVel*exp(-k*age);v.y+=aPh.x*e/k;vec3 vv=(modelViewMatrix*vec4(v,0.)).xyz;vec2 dir=length(vv.xy)>.001?normalize(vv.xy):vec2(1.,0.);
            float stretch=1.+length(vv.xy)*aPh.z;vec2 side=vec2(-dir.y,dir.x);mv.xy+=dir*q.x*size*stretch+side*q.y*size*.35;}
          else{float a=aPh.w*age+aT.x*7.;mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));mv.xy+=R*q*size;}
          gl_Position=projectionMatrix*mv;vUv=q;vAge=t;vSeed=fract(aT.x*13.7);
          float fade=${smoke?'smoothstep(0.,.15,t)*(1.-smoothstep(.45,1.,t))':'pow(1.-t,1.4)'};vCol=vec4(aCol.rgb,aCol.a*fade);}`,
      fragmentShader:`varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;uniform vec3 uLight,uAmbient;${GLSL_NOISE}
        void main(){float d=length(vUv);if(d>1.)discard;
          ${smoke?`float n=fbm(vUv*1.7+vSeed*9.+vAge*.8);float a=smoothstep(1.,.25,d+n*.45-.2)*vCol.a;vec3 c=vCol.rgb*(uAmbient+uLight*clamp(.55-vUv.y*.5+n*.3,0.,1.));gl_FragColor=vec4(c,a);`
                 :`float a=pow(max(0.,1.-d),2.2);gl_FragColor=vec4(vCol.rgb*vCol.a*a,1.);`}}`});
    this.mesh=new THREE.Mesh(g,this.material);this.mesh.frustumCulled=false;this.mesh.renderOrder=smoke?4:5;
  }
  emit(x,y,z,vx,vy,vz,r,g,b,a,life,s0,s1,grav=0,drag=0,stretch=0,spin=0,delay=0){
    const i=this.head;this.head=(this.head+1)%this.max;
    this.aPos.array.set([x,y,z],i*3);this.aVel.array.set([vx,vy,vz],i*3);this.aCol.array.set([r,g,b,a],i*4);
    this.aT.array.set([this.time+delay,life,s0,s1],i*4);this.aPh.array.set([grav,drag,stretch,spin],i*4);
    if(i<this.dirtyMin)this.dirtyMin=i;if(i>this.dirtyMax)this.dirtyMax=i;
  }
  update(t){this.time=t;this.uniforms.uTime.value=t;
    if(this.dirtyMax>=0){const lo=this.dirtyMin,n=this.dirtyMax-lo+1;
      for(const [a,sz] of [[this.aPos,3],[this.aVel,3],[this.aCol,4],[this.aT,4],[this.aPh,4]]){a.clearUpdateRanges();a.addUpdateRange(lo*sz,n*sz);a.needsUpdate=true;}
      this.dirtyMin=Infinity;this.dirtyMax=-1;}}
  clear(){for(let i=0;i<this.max;i++)this.aT.array[i*4]=-1e6;this.aT.needsUpdate=true;this.aT.clearUpdateRanges();}
}

// ---------------------------------------------------------------- effects facade
export function createFX(scene,quality){
  const low=quality==='low';
  const glow=new ParticleSystem(low?2500:7000,'add'),smoke=new ParticleSystem(low?500:1400,'smoke');
  scene.add(glow.mesh,smoke.mesh);
  const R=Math.random;

  // debris chunks (CPU physics, bounce off solid tiles)
  const chunkGeo=new THREE.IcosahedronGeometry(1,0);{const p=chunkGeo.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)*(.7+((i*37)%11)/22),p.getY(i)*.7,p.getZ(i));chunkGeo.computeVertexNormals();}
  const chunkMat=new THREE.MeshStandardMaterial({roughness:.7,metalness:.25});
  const MAXD=low?120:320,debris=new THREE.InstancedMesh(chunkGeo,chunkMat,MAXD);debris.instanceMatrix.setUsage(THREE.DynamicDrawUsage);debris.castShadow=true;debris.count=0;
  debris.setColorAt(0,new THREE.Color());scene.add(debris);const chunks=[];const dm=new THREE.Object3D();
  // embers that glow (hot debris)
  const hotMat=new THREE.MeshStandardMaterial({color:'#000',emissive:new THREE.Color('#ff7a2a'),emissiveIntensity:4});
  const hot=new THREE.InstancedMesh(chunkGeo,hotMat,low?40:120);hot.count=0;hot.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(hot);const hots=[];

  // tracers: instanced glowing capsules + additive halo billboards share one list
  const boltGeo=new THREE.CapsuleGeometry(1,1,3,8);
  const boltMat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const MAXB=320,bolts=new THREE.InstancedMesh(boltGeo,boltMat,MAXB);bolts.instanceMatrix.setUsage(THREE.DynamicDrawUsage);bolts.setColorAt(0,new THREE.Color());bolts.count=0;bolts.frustumCulled=false;scene.add(bolts);

  // shock rings
  const ringMat=new THREE.ShaderMaterial({uniforms:{uColor:{value:new THREE.Color()},uA:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform vec3 uColor;uniform float uA;void main(){float d=abs(vUv.y-.5)*2.;float a=pow(1.-d,3.)*uA;gl_FragColor=vec4(uColor*a*2.,1.);}`});
  const ringGeo=new THREE.RingGeometry(.82,1,64,1);
  {const uv=ringGeo.attributes.uv,p=ringGeo.attributes.position;for(let i=0;i<p.count;i++){const rr=Math.hypot(p.getX(i),p.getY(i));uv.setXY(i,0,(rr-.82)/.18);}}
  const rings=[];

  // arc-lance beam: core ribbon + jagged branches
  const beamU={uTime:{value:0},uColor:{value:new THREE.Color('#6cf3ff')},uLen:{value:240}};
  const beamMat=new THREE.ShaderMaterial({uniforms:beamU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float uTime,uLen;uniform vec3 uColor;${GLSL_NOISE}
      void main(){float x=vUv.x*uLen;float w=abs(vUv.y-.5)*2.;float n=fbm(vec2(x*.05-uTime*14.,vUv.y*3.+uTime*3.));
        float edge=.35+.45*n;float core=smoothstep(.22,0.,w);float body=smoothstep(edge,edge*.3,w);float flick=.85+.15*sin(uTime*90.+x*.3);
        float tip=smoothstep(0.,.04,vUv.x)*(1.-smoothstep(.96,1.,vUv.x)*.5);
        vec3 c=(uColor*body*1.15+vec3(1.)*core*1.7)*flick*tip;gl_FragColor=vec4(c,1.);}`});
  const beamMesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1,1,1),beamMat);beamMesh.geometry.translate(.5,0,0);beamMesh.visible=false;beamMesh.renderOrder=6;scene.add(beamMesh);
  const BR=4,BSEG=22,branchGeo=new THREE.BufferGeometry();branchGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(BR*BSEG*2*3*3),3));
  const branchMat=new THREE.MeshBasicMaterial({color:new THREE.Color('#9ff8ff').multiplyScalar(2.2),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
  const branches=new THREE.Mesh(branchGeo,branchMat);branches.frustumCulled=false;branches.visible=false;branches.renderOrder=6;scene.add(branches);

  // shockwall (power line)
  const wallU={uTime:{value:0}};
  const wallMat=new THREE.ShaderMaterial({uniforms:wallU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float uTime;${GLSL_NOISE}void main(){float x=abs(vUv.x-.5)*2.;float n=fbm(vec2(vUv.x*4.,vUv.y*9.-uTime*6.));
      float a=smoothstep(.55+n*.4,0.,x);float core=smoothstep(.12,0.,abs(x-n*.15));vec3 c=vec3(.4,1.,.85)*a*1.4+vec3(1.)*core*2.;gl_FragColor=vec4(c,1.);}`});
  const walls=[];

  // dynamic light pool
  const NL=low?4:quality==='ultra'?12:8,lights=[];
  for(let i=0;i<NL;i++){const l=new THREE.PointLight(0xffffff,0,160,1.6);l.castShadow=false;scene.add(l);lights.push(l);}
  let requests=[];const flashes=[];
  function light(x,y,z,color,intensity,distance){requests.push({x,y,z,color,intensity,distance});}
  function flashLight(x,y,color,intensity,distance,life){flashes.push({x,y,color:new THREE.Color(color),intensity,distance,life,age:0});}

  let shake=0;const shakeImpulse=v=>{shake=Math.min(1.6,shake+v);};

  // ---- spawners (game px -> world: x, -y)
  function col(c){return tmpC.set(c);}
  function sparks(x,y,color,n=12,speed=180,opt={}){const c=col(color);for(let i=0;i<n;i++){const a=R()*Math.PI*2,s=speed*(.3+R()*.9),vz=(R()-.5)*speed*.8;
    glow.emit(x,-y,opt.z??4,Math.cos(a)*s,Math.sin(a)*s+(opt.up||0),vz,c.r*1.6,c.g*1.6,c.b*1.6,1,.18+R()*.35*(opt.life||1),1.1+R()*.8,.2,opt.grav??-420,3,.018,0);}}
  function puff(x,y,color,n=6,size=12,opt={}){const c=col(color);for(let i=0;i<n;i++){const a=R()*Math.PI*2,s=(opt.speed||30)*(.3+R());
    smoke.emit(x+(R()-.5)*6,-y+(R()-.5)*6,(opt.z??0)+(R()-.5)*14,Math.cos(a)*s,Math.sin(a)*s*.6+(opt.rise??22),(R()-.5)*20,c.r,c.g,c.b,opt.alpha??.55,(opt.life||1.2)*(.7+R()*.6),size*(.6+R()*.4),size*(2+R()*1.4),opt.grav??30,1.4,0,0);}}
  function glowBall(x,y,color,size,life,z=6,intensity=1.5){const c=col(color);glow.emit(x,-y,z,0,0,0,c.r*intensity,c.g*intensity,c.b*intensity,1,life,size,size*1.6,0,1,0,0);}
  function ring(x,y,color,radius,life,opts={}){const m=new THREE.Mesh(ringGeo,ringMat.clone());m.material.uniforms.uColor.value.set(color);m.position.set(x,-y,opts.z??8);
    if(opts.flat){m.rotation.x=-Math.PI/2;}scene.add(m);rings.push({m,radius,life,age:0,start:opts.start||2});}
  function chunks2(x,y,color,n,speed=160,size=2.2,hotRatio=0){const c=new THREE.Color(color);
    for(let i=0;i<n;i++){const a=R()*Math.PI*2,s=speed*(.35+R()*.8),isHot=R()<hotRatio;const ch={x,y:-y,z:(R()-.5)*20,vx:Math.cos(a)*s,vy:Math.abs(Math.sin(a))*s*1.1+60,vz:(R()-.5)*s*.6,
      rx:R()*6,ry:R()*6,wr:(R()-.5)*14,s:size*(.5+R()),life:1.6+R()*1.4,age:0,c:c.clone().multiplyScalar(.6+R()*.5)};
      if(isHot){if(hots.length<hot.instanceMatrix.count)hots.push(ch);}else if(chunks.length<MAXD)chunks.push(ch);}}

  function explosion(x,y,size=1,theme){
    const s=size;glowBall(x,y,'#ffd9a0',26*s,.22,10,2.4);glowBall(x,y,'#ff8a3c',40*s,.4,8,1.4);
    for(let i=0;i<Math.round(14*s);i++){const a=R()*Math.PI*2,v=(60+R()*120)*s;const c=col(R()<.5?'#ffb050':'#ff5a1e');
      glow.emit(x,-y,(R()-.5)*20,Math.cos(a)*v,Math.sin(a)*v,(R()-.5)*v,c.r*2,c.g*2,c.b*2,1,.35+R()*.3,(7+R()*6)*s,(16+R()*10)*s,40,4,0,1.5);}
    sparks(x,y,'#ffd08a',Math.round(26*s),260*s,{grav:-520});
    puff(x,y,theme&&theme.key==='vaults'?'#3a5458':'#3a3230',Math.round(7*s),11*s,{life:1.6,speed:45*s,rise:30,alpha:.6});
    chunks2(x,y,theme?theme.rock.base:'#6a5a50',Math.round(7*s),190*s,2.2*Math.sqrt(s),.25);
    if(s>=1.4)ring(x,y,'#ffb070',70*s,.45);
    flashLight(x,y,'#ffa050',9*s,170*s,.32+.1*s);shakeImpulse(.25*s);
  }

  function update(dt,t,level,camPos,tileSolid){
    glow.update(t);smoke.update(t);
    // debris
    const step=(list,mesh,colorize)=>{let n=0;for(let i=list.length-1;i>=0;i--){const c=list[i];c.age+=dt;if(c.age>c.life){list.splice(i,1);continue;}
        c.vy-=640*dt;const nx=c.x+c.vx*dt,ny=c.y+c.vy*dt;
        if(tileSolid(nx,-ny)){if(tileSolid(c.x,-ny)){c.vy*=-.38;c.vx*=.7;c.wr*=.6;}else{c.vx*=-.5;}}else{c.x=nx;c.y=ny;}
        c.z+=c.vz*dt;c.vz*=.98;c.rx+=c.wr*dt;c.ry+=c.wr*.7*dt;}
      list.forEach((c,i)=>{const k=1-Math.max(0,(c.age-c.life+.4)/.4);dm.position.set(c.x,c.y,c.z);dm.rotation.set(c.rx,c.ry,0);dm.scale.setScalar(c.s*k);dm.updateMatrix();mesh.setMatrixAt(i,dm.matrix);if(colorize)mesh.setColorAt(i,c.c);});
      mesh.count=list.length;mesh.instanceMatrix.needsUpdate=true;if(colorize&&mesh.instanceColor)mesh.instanceColor.needsUpdate=true;};
    step(chunks,debris,true);step(hots,hot,false);
    for(let i=hots.length-1;i>=0;i--)if(R()<dt*20)glow.emit(hots[i].x,hots[i].y,hots[i].z,0,10,0,1.6,.6,.2,1,.25,1.6,.4,0,1,0,0);
    for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.age+=dt;const a=r.age/r.life;if(a>=1){scene.remove(r.m);r.m.material.dispose();rings.splice(i,1);continue;}
      r.m.scale.setScalar(r.start+a*r.radius);r.m.material.uniforms.uA.value=(1-a)*(1-a);}
    for(let i=walls.length-1;i>=0;i--){const w=walls[i];w.age+=dt;if(w.age>w.life){scene.remove(w.m);w.m.geometry.dispose();walls.splice(i,1);}}
    wallU.uTime.value=t;beamU.uTime.value=t;
    for(let i=flashes.length-1;i>=0;i--){const f=flashes[i];f.age+=dt;if(f.age>f.life){flashes.splice(i,1);continue;}const k=1-f.age/f.life;requests.push({x:f.x,y:-f.y,z:30,color:f.color,intensity:f.intensity*k*k,distance:f.distance});}
    // allocate lights by importance near the camera
    requests.sort((a,b)=>b.intensity/(1+Math.abs(b.x-camPos.x)*.004)-a.intensity/(1+Math.abs(a.x-camPos.x)*.004));
    for(let i=0;i<NL;i++){const l=lights[i],q=requests[i];if(q){l.position.set(q.x,q.y,q.z);l.color.set(q.color);l.intensity=q.intensity*1500;l.distance=q.distance*2.2;}else l.intensity=0;}
    requests=[];shake=Math.max(0,shake-dt*2.2);
  }

  // per-frame drawing helpers
  const bm=new THREE.Object3D(),up=new THREE.Vector3(0,1,0),v=new THREE.Vector3();
  function drawShots(s,viewX,viewW){
    let n=0;const c=new THREE.Color();
    const put=(x,y,vx,vy,len,rad,color,bright)=>{if(n>=MAXB)return;bm.position.set(x,-y,4);v.set(vx||1,-(vy||0),0).normalize();bm.quaternion.setFromUnitVectors(up,v);bm.scale.set(rad,len,rad);bm.updateMatrix();bolts.setMatrixAt(n,bm.matrix);c.set(color).multiplyScalar(bright);bolts.setColorAt(n,c);n++;};
    for(const q of s.pshots){if(q.life<=0||q.x<viewX-40||q.x>viewX+viewW+40)continue;
      if(q.kind==='bounce'){put(q.x,q.y,q.vx,q.vy,2.6,2.6,'#ff7ad9',3.2);if(R()<.7)glow.emit(q.x,-q.y,4,0,0,0,1.6,.5,1.3,1,.25,4,1,0,1,0,0);light(q.x,-q.y,14,'#ff6ad0',.5,70);}
      else{const sp=Math.hypot(q.vx,q.vy);put(q.x,q.y,q.vx,q.vy,Math.max(4,sp*.016),1.05,'#ffd23f',2.2);if(R()<.3)glow.emit(q.x,-q.y,4,0,0,0,1.1,.8,.25,1,.1,2.4,.6,0,1,0,0);}}
    for(const q of s.eshots){if(q.life<=0||q.x<viewX-40||q.x>viewX+viewW+40)continue;
      if(q.kind==='wave'){put(q.x+q.w/2,q.y+q.h/2,q.vx,0,6,5,'#ffb070',3);glow.emit(q.x+q.w/2,-(q.y+q.h),2,0,40,0,1.8,.9,.4,1,.3,7,2,0,1,0,0);light(q.x,-q.y,10,'#ff9040',.8,70);}
      else if(q.kind==='lob'){put(q.x,q.y,q.vx,q.vy,4,4,'#b7ff68',2.4);if(R()<.6)glow.emit(q.x,-q.y,4,0,0,0,.8,1.6,.4,1,.3,5,1,0,1,0,0);}
      else{const flame=q.flame||q.kind==='flame';put(q.x,q.y,q.vx,q.vy,flame?5:3.4,flame?3.4:2.6,flame?'#ff8a3c':'#ff4a6a',3);if(R()<.5)glow.emit(q.x,-q.y,4,0,0,0,1.8,.4,.5,1,.18,4.5,1,0,1,0,0);}}
    bolts.count=n;bolts.instanceMatrix.needsUpdate=true;if(bolts.instanceColor)bolts.instanceColor.needsUpdate=true;
  }
  function drawBeam(p,t,theme,from){
    let b=p.beamActive&&p.beam;beamMesh.visible=branches.visible=!!b;if(!b)return;
    if(from&&Math.hypot(from.x-b.ox,from.y-b.oy)<24){const ex=b.ox+b.dx*b.len,ey=b.oy+b.dy*b.len,L=Math.hypot(ex-from.x,ey-from.y)||1;b={...b,ox:from.x,oy:from.y,dx:(ex-from.x)/L,dy:(ey-from.y)/L,len:L};}
    const len=Math.max(4,b.len),w=(b.width||10)*1.6,ang=Math.atan2(-b.dy,b.dx);
    beamMesh.position.set(b.ox,-b.oy,5);beamMesh.rotation.set(0,0,ang);beamMesh.scale.set(len,w*1.25,1);beamU.uLen.value=len;
    const pos=branchGeo.attributes.position.array;let k=0;const nx=-Math.sin(ang),ny=Math.cos(ang),dx=Math.cos(ang),dy=Math.sin(ang);
    for(let br=0;br<BR;br++){let px=b.ox,py=-b.oy,off=0;const amp=br?5+br*2:2;for(let i=1;i<=BSEG;i++){const a=i/BSEG;off=(R()-.5)*amp*Math.sin(a*Math.PI)*2+off*.35;
        const qx=b.ox+dx*len*a+nx*off,qy=-b.oy+dy*len*a+ny*off,th=br?.35:.7;
        for(const [x,y] of [[px+nx*th,py+ny*th],[px-nx*th,py-ny*th],[qx-nx*th,qy-ny*th],[px+nx*th,py+ny*th],[qx-nx*th,qy-ny*th],[qx+nx*th,qy+ny*th]]){pos[k++]=x;pos[k++]=y;pos[k++]=6;}
        px=qx;py=qy;}}
    branchGeo.attributes.position.needsUpdate=true;branchGeo.computeBoundingSphere();
    const ex=b.ox+b.dx*len,ey=b.oy+b.dy*len;if(R()<.8)sparks(ex,ey,'#9ff8ff',2,160,{life:.6});if(R()<.3)glowBall(ex,ey,'#6cf3ff',10,.1,6,1.6);
    light(b.ox+b.dx*len*.3,-(b.oy+b.dy*len*.3),18,'#5af6ff',2.2,110);light(ex,-ey,18,'#9ff8ff',2,90);
  }
  function shockwall(x,viewTop,viewH){const m=new THREE.Mesh(new THREE.PlaneGeometry(26,viewH+120),wallMat);m.position.set(x,-(viewTop+viewH/2),10);scene.add(m);walls.push({m,age:0,life:.4});
    for(let i=0;i<30;i++)glow.emit(x+(R()-.5)*10,-(viewTop+R()*viewH),8,(R()-.5)*60,(R()-.5)*60,(R()-.5)*40,.6,1.6,1.3,1,.4,3,.5,0,2,.01,0);
    light(x,-(viewTop+viewH/2),20,'#67ffd4',4,260);}
  function moveWalls(floats){let i=0;for(const f of floats)if(f.line&&walls[i]){walls[i].m.position.x=f.x;i++;}}
  function clear(){glow.clear();smoke.clear();chunks.length=0;hots.length=0;debris.count=0;hot.count=0;for(const r of rings){scene.remove(r.m);r.m.material.dispose();}rings.length=0;for(const w of walls){scene.remove(w.m);}walls.length=0;flashes.length=0;}
  return {glow,smoke,sparks,puff,glowBall,ring,chunks:chunks2,explosion,update,drawShots,drawBeam,shockwall,moveWalls,light,flashLight,shakeImpulse,get shake(){return shake;},clear,
    stats:()=>({debris:chunks.length,rings:rings.length,lights:NL})};
}
