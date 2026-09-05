import * as T from 'three';

// All effects share the scene clock: pause and reduced motion freeze everything.
export function createCinematic({scene,root,neural,stars,crest,plates,word,dais,renderer,camera,controls,chrome,steel,black,letterMetal,rnd}) {
  const TAU=Math.PI*2, timed=[];
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=false;
  const key=scene.children.find(o=>o.isDirectionalLight);
  key.castShadow=true;key.shadow.mapSize.set(2048,2048);
  Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:40});
  key.shadow.bias=-.0003;key.shadow.normalBias=.035;
  root.traverse(o=>{if(!o.isMesh)return;o.receiveShadow=true;const depth=o.geometry?.parameters?.options?.depth;o.castShadow=depth>=.25||o.parent===word;});
  const contact=new T.Mesh(new T.PlaneGeometry(25,25),new T.ShadowMaterial({opacity:.6,depthWrite:false}));
  contact.rotation.x=-Math.PI/2;contact.position.y=-4.60;contact.receiveShadow=true;scene.add(contact);

  // Recessed mounting collars, inset hex screws and louvered cooling cartridges.
  const hardware=new T.Group();hardware.name='Recessed hardware';crest.add(hardware);
  const collarGeo=new T.CylinderGeometry(.085,.085,.024,16).rotateX(Math.PI/2);
  const screwGeo=new T.CylinderGeometry(.041,.041,.022,6).rotateX(Math.PI/2);
  const slotGeo=new T.BoxGeometry(.037,.008,.005);
  for(const p of plates){const center=new T.Vector2();p.forEach(v=>center.add(new T.Vector2(...v)));center.divideScalar(p.length);
    for(const v of p){const q=new T.Vector2(...v).lerp(center,.16);
      for(const [geo,mat,z] of [[collarGeo,black,.626],[screwGeo,chrome,.64],[slotGeo,black,.654]]){const m=new T.Mesh(geo,mat);m.position.set(q.x,q.y,z);m.castShadow=m.receiveShadow=true;hardware.add(m)}
    }
  }
  for(const side of [-1,1])for(let k=0;k<3;k++){
    const vent=new T.Group();vent.position.set(side*(2.1+k*.37),.32+k*.5,.665);vent.rotation.z=side*-.56;hardware.add(vent);
    const casing=new T.Mesh(new T.BoxGeometry(.3,.62,.09),black);casing.receiveShadow=casing.castShadow=true;vent.add(casing);
    for(let j=0;j<6;j++){const fin=new T.Mesh(new T.BoxGeometry(.26,.021,.075),steel);fin.position.set(0,-.24+j*.09,.055);fin.rotation.x=.4;vent.add(fin)}
  }

  // Batch hundreds of individual links, then layer traveling signal packets on top.
  const oldLinks=neural.children.filter(o=>o.isLine&&!o.isLineSegments);
  oldLinks.forEach(o=>{neural.remove(o);o.geometry.dispose()});
  const edgePairs=[],links=[];
  for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++){const d=stars[i].distanceTo(stars[j]);if(d>.6&&d<1.5){edgePairs.push([stars[i],stars[j]]);links.push(...stars[i].toArray(),...stars[j].toArray())}}
  const linkGeo=new T.BufferGeometry();linkGeo.setAttribute('position',new T.Float32BufferAttribute(links,3));
  neural.add(new T.LineSegments(linkGeo,new T.LineBasicMaterial({color:0x527d9d,transparent:true,opacity:.12})));
  const packetPositions=[],progress=[],phase=[];
  edgePairs.forEach(([a,b],i)=>{if(i%3)return;for(let j=0;j<20;j++)for(const u of [j/20,(j+1)/20]){packetPositions.push(...a.clone().lerp(b,u).toArray());progress.push(u);phase.push((i*.6180339)%1)}});
  const packetGeo=new T.BufferGeometry();packetGeo.setAttribute('position',new T.Float32BufferAttribute(packetPositions,3));packetGeo.setAttribute('progress',new T.Float32BufferAttribute(progress,1));packetGeo.setAttribute('phase',new T.Float32BufferAttribute(phase,1));
  const packetMat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{time:{value:0}},
    vertexShader:'attribute float progress;attribute float phase;varying float vProgress;varying float vPhase;void main(){vProgress=progress;vPhase=phase;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform float time;varying float vProgress;varying float vPhase;void main(){float head=fract(time*.22+vPhase)*1.7-.35;float d=vProgress-head;float signal=exp(-d*d*230.)+exp(-d*d*24.)*.16;vec3 tint=mix(vec3(4.,.025,.065),vec3(.25,1.8,3.),step(.84,vPhase));gl_FragColor=vec4(tint,signal*.9);}'
  });packetMat.userData.glow=true;timed.push(packetMat);
  const packets=new T.LineSegments(packetGeo,packetMat);packets.name='Traveling neural signals';neural.add(packets);

  const noise=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return n;}`;
  const uvVertex='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
  // Layered low-lying fog with feathered edges, never a full-screen overlay.
  for(let i=0;i<5;i++){
    const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},offset:{value:i*7.3}},vertexShader:uvVertex,
      fragmentShader:`uniform float time;uniform float offset;varying vec2 vUv;${noise}void main(){vec2 p=vUv*vec2(6.,3.);p.x+=time*.027+offset;float n=fbm(p+fbm(p*.7+time*.014));float edge=pow(max(0.,sin(vUv.x*3.14159)*sin(vUv.y*3.14159)),1.6);float density=smoothstep(.32,.76,n)*edge;vec3 col=mix(vec3(.13,.2,.28),vec3(.32,.07,.10),exp(-pow((vUv.x-.5)*4.,2.)));gl_FragColor=vec4(col,density*.26);}`});
    const fog=new T.Mesh(new T.PlaneGeometry(26,3.7),mat);fog.name='Drifting ground mist';fog.position.set((i%2-.5)*4,-3.45,-4+i*2.9);scene.add(fog);timed.push(mat);
  }
  // Soft overhead shafts, dim enough to retain black levels and sharp circuitry.
  for(let i=0;i<3;i++){
    const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{time:{value:0}},vertexShader:uvVertex,
      fragmentShader:`uniform float time;varying vec2 vUv;${noise}void main(){float edge=pow(max(0.,1.-abs(vUv.x-.5)*2.),3.);float fade=sin(vUv.y*3.14159);float dust=.7+.3*noise(vUv*15.+vec2(time*.025,0.));gl_FragColor=vec4(.25,.48,.75,edge*fade*dust*.055);}`});
    const beam=new T.Mesh(new T.PlaneGeometry(2.6,19),mat);beam.position.set(-2.3+i*2.5,5,-6-i*1.8);beam.rotation.z=(i-1)*-.15;scene.add(beam);timed.push(mat);
  }
  const reflectionMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0}},vertexShader:uvVertex,
    fragmentShader:`uniform float time;varying vec2 vUv;${noise}void main(){vec2 p=(vUv-.5)*34.;float r=length(p);float rings=exp(-pow((r-6.6)*1.8,2.))*.28+exp(-pow((r-8.7)*2.,2.))*.07;float ripple=.5+.5*fbm(p*3.+vec2(time*.015,0.));float spokes=pow(max(0.,cos(atan(p.y,p.x)*24.)),15.)*.25;gl_FragColor=vec4(.65,.009,.024,rings*ripple*(.7+spokes));}`});
  const reflection=new T.Mesh(new T.PlaneGeometry(34,34),reflectionMat);reflection.rotation.x=-Math.PI/2;reflection.position.y=-4.595;scene.add(reflection);timed.push(reflectionMat);

  // The sweep follows world coordinates, so one highlight crosses the whole word.
  const sweep={value:0},previousCompile=letterMetal.onBeforeCompile;
  letterMetal.onBeforeCompile=shader=>{previousCompile(shader);shader.uniforms.cinemaTime=sweep;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCinemaWorld;').replace('#include <begin_vertex>','#include <begin_vertex>\nvCinemaWorld=(modelMatrix*vec4(position,1.)).xyz;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float cinemaTime;varying vec3 vCinemaWorld;').replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
    float sweepX=sin(cinemaTime*.22)*11.;float shine=exp(-pow((vCinemaWorld.x-sweepX+vCinemaWorld.y*.32)*2.1,2.));
    totalEmissiveRadiance+=vec3(.22,.29,.36)*shine;`);
  };letterMetal.needsUpdate=true;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let active=!reduced.matches,revealTime=0;
  document.getElementById('replay').setAttribute('aria-pressed',String(active));
  const duration=7.5;
  function cancel(){active=false;document.getElementById('replay')?.setAttribute('aria-pressed','false')}
  function replay(){revealTime=0;active=true;controls.autoRotate=false;document.getElementById('orbit').setAttribute('aria-pressed','false');document.getElementById('replay')?.setAttribute('aria-pressed','true')}
  controls.addEventListener('start',cancel);
  renderer.domElement.addEventListener('wheel',cancel,{passive:true});
  document.getElementById('stage').addEventListener('keydown',cancel);
  for(const id of ['home','orbit'])document.getElementById(id).addEventListener('click',cancel);
  renderer.domElement.addEventListener('dblclick',cancel);
  return {
    cancel,replay,
    update(time,dt,animated){
      for(const mat of timed)mat.uniforms.time.value=time;sweep.value=time;
      chrome.envMapRotation.y=Math.sin(time*.13)*.045;letterMetal.envMapRotation.y=Math.sin(time*.13)*.07;
      // Only major static bodies cast; refresh once for both bloom and beauty passes.
      renderer.shadowMap.needsUpdate=true;
      if(active){revealTime=Math.min(duration,revealTime+dt);const u=revealTime/duration,e=u*u*(3.-2.*u),distance=Math.max(22.6,24.5/Math.max(camera.aspect,.32));
        camera.position.set(T.MathUtils.lerp(3.1,.12,e),T.MathUtils.lerp(1.6,.65,e),T.MathUtils.lerp(Math.max(12,distance*.54),distance,e));
        controls.target.set(0,T.MathUtils.lerp(.9,.65,e),0);
        if(u===1){cancel();controls.autoRotate=animated;document.getElementById('orbit').setAttribute('aria-pressed',String(animated))}
      }
    },
    stats(){return{revealActive:active,revealProgress:revealTime/duration,signalPaths:Math.ceil(edgePairs.length/3),signalTime:packetMat.uniforms.time.value,atmosphereLayers:8,shadows:renderer.shadowMap.enabled}}
  };
}
