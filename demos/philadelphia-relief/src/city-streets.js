import { prepareStreetGraph, prepareTraffic, trafficPose } from './city-traffic.js?v=philly-2026100901';
import { CITY_LIGHT_GLSL } from './city-lighting.js?v=philly-2026100901';
import { prepareCurbLayout } from './city-curbs.js?v=philly-2026101001';
import { prepareSidewalkRoutes, walkersForRoutes, sidewalkPose, walkerTravel }
  from './city-walkers.js?v=philly-2026101001';

// Instanced, illustrative street furniture; the OSM centerlines remain authoritative.
export function createCityStreets(THREE,{scene,projection,sampleElevation,lighting,onReady=()=>{}}){
  const group=new THREE.Group();group.name='city-street-life';scene.add(group);
  const uniforms={...lighting.uniforms,uSun:{value:new THREE.Vector3()},uNight:{value:0},
    uEye:{value:new THREE.Vector3()},uFog:{value:new THREE.Color(.55,.64,.72)}};
  const material=new THREE.ShaderMaterial({uniforms,vertexShader:`
    varying vec3 vWorld,vNormal,vColor;
    void main(){vec4 p=instanceMatrix*vec4(position,1.0);
      mat3 basis=mat3(instanceMatrix);
      vec3 corrected=normal/vec3(dot(basis[0],basis[0]),dot(basis[1],basis[1]),dot(basis[2],basis[2]));
      vWorld=p.xyz;vNormal=normalize(basis*corrected);vColor=instanceColor;
      gl_Position=projectionMatrix*modelViewMatrix*p;}`,
  fragmentShader:`precision highp float;
    varying vec3 vWorld,vNormal,vColor;
    uniform vec3 uSun,uEye,uFog;uniform float uNight;
    ${CITY_LIGHT_GLSL}
    void main(){vec3 n=normalize(vNormal);
      float sun=max(0.0,dot(n,uSun))*citySunVisibility(vWorld,n,uSun);
      vec3 color=vColor*(.38+sun*.85)*mix(1.0,.23,uNight);
      color+=max(vec3(0.0),vColor-1.0)*uNight;
      float fog=1.0-exp(-length(vWorld-uEye)*.000035);
      gl_FragColor=vec4(mix(color,uFog,fog),1.0);}`});
  const box=new THREE.BoxGeometry(1,1,1),crown=new THREE.IcosahedronGeometry(1,1);
  const make=(geometry,count)=>{const mesh=new THREE.InstancedMesh(geometry,material,count);
    mesh.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(count*3),3);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;
    mesh.count=0;group.add(mesh);return mesh;};
  const street=make(box,14000),trees=make(crown,1600),vehicles=make(box,620*10);
  const signals=make(box,1800);
  const people=make(box,240*5),heads=make(crown,240);
  people.name='sidewalk-walkers';heads.name='sidewalk-walker-heads';
  let sidewalkRoutes=[],walkers=[],walkingTime=0;
  let signalHeads=[];
  const dummy=new THREE.Object3D(),color=new THREE.Color();
  function put(mesh,x,y,z,w,h,d,angle,tint,pitch=0,roll=0){
    if(mesh.count>=mesh.instanceMatrix.count)return;
    dummy.position.set(x,y,z);dummy.rotation.set(pitch,angle,roll,'YXZ');
    dummy.scale.set(w,h,d);dummy.updateMatrix();
    mesh.setMatrixAt(mesh.count,dummy.matrix);
    if(Array.isArray(tint))color.setRGB(...tint);else color.set(tint);
    mesh.setColorAt(mesh.count++,color);
  }
  function uploadInstances(mesh){
    // Upload only populated instances, not the full regional capacity, on
    // every frame. A close-up usually shows a small fraction of all vehicles.
    for(const [attribute,stride] of [[mesh.instanceMatrix,16],[mesh.instanceColor,3]]){
      attribute.clearUpdateRanges();
      if(mesh.count){attribute.addUpdateRange(0,mesh.count*stride);attribute.needsUpdate=true;}
    }
  }
  let graph=null,traffic=null,curbLayout=null,loading=false,disposed=false,age=10;
  let retryDelay=0,request=null,vehicleView=null,motionEnabled=false;
  let lastX=Infinity,lastZ=Infinity,lastExag=0,lastRadius=0;
  const palette=[0xb3b7bb,0x293746,0xd6cdb6,0x813b30,0x3e586c,0xdcb646,0xdddeda];
  const lamps={indicator:[2.6,1.8,.025],head:[2.2,2.1,1.65],
    brake:[2.5,.035,.012],tail:[1.2,.015,.006]};
  const foliage=[0x466544,0x536c3f,0x3d6047,0x60764b];
  const shirts=[0x536b84,0xa16e53,0x8f535f,0x567d70,0xd3c6a7,0x5e586f];
  function load(){if(loading||graph||retryDelay>0||disposed)return;loading=true;
    request=new AbortController();
    fetch('data/city-streets.json',{signal:request.signal}).then(r=>{
      if(!r.ok)throw new Error('Street data unavailable');return r.json();})
      .then(async doc=>{if(disposed)return;const options={signal:request.signal};
        const nextGraph=await prepareStreetGraph(doc,projection,sampleElevation,options);
        const nextTraffic=await prepareTraffic(nextGraph,620,239,options);
        const nextCurbs=await prepareCurbLayout(nextGraph,options);
        if(disposed)return;graph=nextGraph;traffic=nextTraffic;curbLayout=nextCurbs;age=10;onReady();
        // Cars can start while sidewalk topology is prepared in short tasks.
        // Disposal cancels the remaining work before it can attach late walkers.
        const routes=await prepareSidewalkRoutes(graph,options);
        if(disposed)return;sidewalkRoutes=routes;lastX=Infinity;age=10;onReady();})
      .catch(error=>{if(disposed||error.name==='AbortError')return;
        retryDelay=30;console.warn('Decorative street layer:',error.message);})
      .finally(()=>{loading=false;request=null;});
  }
  function rebuild(x,z,exag,radius){
    street.count=0;trees.count=0;signals.count=0;signalHeads=[];
    walkers=walkersForRoutes(sidewalkRoutes,x,z,Math.min(radius,600));vehicleView=null;
    const groundAt=(x,z)=>sampleElevation(projection.xToLon(x),projection.zToLat(z))*exag;
    function strip(ax,az,bx,bz,width,height,clearance,tint,depth=0,ay=groundAt(ax,az),by=groundAt(bx,bz)){
      if(street.count>=street.instanceMatrix.count)return;
      const mx=(ax+bx)/2,mz=(az+bz)/2,my=groundAt(mx,mz),length=Math.hypot(bx-ax,bz-az);
      // Short straight grades cost one instance. Split long spans and terrain
      // bends so sidewalks neither float nor disappear into the ground.
      if(depth<5&&length>8&&(length>45||Math.abs(my-(ay+by)/2)>.12)){
        strip(ax,az,mx,mz,width,height,clearance,tint,depth+1,ay,my);
        strip(mx,mz,bx,bz,width,height,clearance,tint,depth+1,my,by);return;
      }
      put(street,mx,(ay+by)/2+clearance,mz,width,height,Math.hypot(length,by-ay),
        Math.atan2(bx-ax,bz-az),tint,-Math.atan2(by-ay,length));
    }
    const segments=graph.segments.filter(s=>Math.hypot((s.a.x+s.b.x)/2-x,(s.a.z+s.b.z)/2-z)<radius)
      .sort((a,b)=>Math.hypot(a.a.x-x,a.a.z-z)-Math.hypot(b.a.x-x,b.a.z-z));
    // Reserve complete signal assemblies before filling the remaining street
    // budget with scenery. Nearest approaches win when a view is very dense.
    const approaches=graph.edges.filter(edge=>edge.to.signalized
      &&edge.from.junction!==edge.to.junction&&edge.length>=5
      &&Math.hypot(edge.to.x-x,edge.to.z-z)<radius)
      .sort((a,b)=>Math.hypot(a.to.x-x,a.to.z-z)-Math.hypot(b.to.x-x,b.to.z-z));
    for(const edge of approaches){
      if(street.count+2>street.instanceMatrix.count||signals.count+3>signals.instanceMatrix.count)break;
      const node=edge.to,side=edge.width/2+1,px=node.x-edge.dx*5-edge.dz*side,
        pz=node.z-edge.dz*5+edge.dx*side,ground=groundAt(px,pz),angle=Math.atan2(edge.dx,edge.dz);
      put(street,px,ground+2.25,pz,.13,4.5,.13,angle,0x434847);
      put(street,px,ground+4.15,pz,.48,1.35,.28,angle,0x272c2b);
      const start=signals.count;
      for(let lens=0;lens<3;lens++)put(signals,px-edge.dx*.16,ground+4.57-lens*.42,
        pz-edge.dz*.16,.28,.28,.055,angle,0x151c18);
      signalHeads.push({edge,start,state:null});
    }
    for(const s of segments){
      if(street.count>=street.instanceMatrix.count)break;
      const dx=(s.b.x-s.a.x)/s.length,dz=(s.b.z-s.a.z)/s.length,angle=Math.atan2(dx,dz);
      const trimA=s.a.neighbors.size>2?s.width*.7:0,trimB=s.b.neighbors.size>2?s.width*.7:0;
      const curbLength=s.length-trimA-trimB;
      if(curbLength<1)continue;
      // Keep the photographic road surface visible; narrow raised curbs define its edges.
      for(const side of [-1,1]){
        const off=side*(s.width/2+.35);
        for(const [margin,width,height,clearance,tint] of [[.35,.35,.24,.48,0x9c998d],
          [1.35,1.5,.16,.38,0x88877e]]){
          const span=curbLayout(s,side,margin);
          if(span)strip(...span,width,height,clearance,tint);
        }
        if(s.length>28)for(let t=16;t<s.length-12;t+=34){
          const tx=s.a.x+dx*t-dz*(off+side*1.1),tz=s.a.z+dz*t+dx*(off+side*1.1);
          const ground=groundAt(tx,tz);
          // Reserve the complete object across both buffers: a full canopy
          // buffer must not leave bare trunks, nor a full street buffer floating crowns.
          if(street.count<street.instanceMatrix.count&&trees.count<trees.instanceMatrix.count){
            const seed=(Math.imul(s.a.id|0,1664525)+Math.imul(t,1013904223)+(side+1)*239)>>>0;
            const shape=(seed%997)/997,tone=(seed>>>12)%foliage.length;
            put(street,tx,ground+2.2,tz,.35,3.7,.35,0,0x58473a);
            put(trees,tx,ground+4.65+shape*.7,tz,1.9+shape*.7,2.5+shape*.8,
              2.4-shape*.3,angle,foliage[tone]);
          }
          if(side===1&&street.count+2<=street.instanceMatrix.count){
            const lx=tx+dx*5,lz=tz+dz*5,lg=groundAt(lx,lz);
            put(street,lx,lg+3.2,lz,.14,5.8,.14,0,0x434847);
            put(street,lx-dz*.5,lg+6.1,lz+dx*.5,1.25,.18,.36,angle,[1.9,1.6,1.15]);}
        }
      }
      if(s.length>25)for(const [node,sign] of [[s.a,1],[s.b,-1]]){
        if(node.neighbors.size<=2)continue;
        // Both approaches get a crossing, independent of the source way's
        // direction. Start beyond the junction opening on wider streets.
        const setback=Math.max(7,s.width*.7+1.35);
        if(setback+1.35>s.length*.45)continue;
        const stripes=Math.max(1,Math.floor((s.width-2)/1.7)+1);
        if(street.count+stripes>street.instanceMatrix.count)continue;
        for(let stripe=0;stripe<stripes;stripe++){
          const across=(stripe-(stripes-1)/2)*1.7;
          strip(node.x+dx*sign*(setback-1.35)-dz*across,node.z+dz*sign*(setback-1.35)+dx*across,
            node.x+dx*sign*(setback+1.35)-dz*across,node.z+dz*sign*(setback+1.35)+dx*across,
            .65,.035,.52,0xc9c6ac);
        }
      }
    }
    for(const mesh of [street,trees,signals])uploadInstances(mesh);
  }
  return {group,
    get animating(){return !disposed&&group.visible&&motionEnabled
      &&(vehicles.count>0||signals.count>0||people.visible&&people.count>0);},
    update({camera,pose,state,exaggeration,sunDir,dt,reducedMotion,archive,quality}){
      if(disposed)return;
      motionEnabled=!reducedMotion&&state.animationSpeed>0;
      retryDelay=Math.max(0,retryDelay-(Number.isFinite(dt)?Math.max(0,dt):0));
      group.visible=state.era==='present'&&state.compareMode==='off'&&!state.lightweight
        &&!archive&&state.layers.structures&&pose.dist<6500&&!!state.streetLife;
      if(!group.visible)return;load();if(!graph)return;
      const x=projection.lonToX(pose.lon),z=projection.latToZ(pose.lat);
      const radius=quality==='performance'?650:Math.min(2000,Math.max(850,pose.dist*.8));
      age+=dt;
      if(age>1&&(Math.hypot(x-lastX,z-lastZ)>100||exaggeration!==lastExag||Math.abs(radius-lastRadius)>100)){
        rebuild(x,z,exaggeration,radius);age=0;lastX=x;lastZ=z;lastExag=exaggeration;lastRadius=radius;
      }
      uniforms.uSun.value.copy(sunDir);uniforms.uEye.value.copy(camera.position);
      uniforms.uNight.value=1-THREE.MathUtils.smoothstep(sunDir.y,-.1,.12);
      const advancing=motionEnabled&&Number.isFinite(dt)&&dt>0;
      if(advancing){traffic.update(dt*state.animationSpeed,{x,z,radius:radius+150});
        walkingTime+=Math.min(dt*state.animationSpeed,.25);}
      people.visible=heads.visible=pose.dist<1800;
      let signalsChanged=false;
      for(const head of signalHeads){
        const phase=traffic.signal(head.edge);if(phase===head.state)continue;
        head.state=phase;signalsChanged=true;
        for(const [lens,name,tint] of [[0,'red',[2.8,.035,.015]],
          [1,'amber',[2.6,1.4,.025]],[2,'green',[.025,2.3,.25]]]){
          color.setRGB(...(phase===name?tint:[.018,.024,.019]));signals.setColorAt(head.start+lens,color);
        }
      }
      if(signalsChanged){const attribute=signals.instanceColor;attribute.clearUpdateRanges();
        attribute.addUpdateRange(0,signals.count*3);attribute.needsUpdate=true;}
      if(!advancing&&vehicleView&&vehicleView.x===x&&vehicleView.z===z
        &&vehicleView.radius===radius&&vehicleView.exaggeration===exaggeration
        &&vehicleView.dist===pose.dist&&vehicleView.quality===quality)return;
      vehicleView={x,z,radius,exaggeration,dist:pose.dist,quality};
      people.count=0;heads.count=0;
      if(people.visible)for(const walker of walkers){
        if(heads.count>=(quality==='performance'?90:240))break;
        const travel=walkerTravel(walkingTime,walker.seed);
        const p=sidewalkPose(walker.route,walker.offset+travel.distance*walker.direction,walker.direction);
        if(Math.hypot(p.x-x,p.z-z)>Math.min(600,Math.max(220,pose.dist*.65)))continue;
        const sin=Math.sin(p.angle),cos=Math.cos(p.angle),size=.9+walker.seed*.2;
        // Opposite directions keep to separate halves of the sidewalk.
        p.x-=cos*.2;p.z+=sin*.2;
        const ground=sampleElevation(projection.xToLon(p.x),projection.zToLat(p.z))*exaggeration+.47;
        const stride=Math.sin(travel.distance*6+walker.seed*6)*travel.pace;
        const shirt=shirts[Math.floor(walker.seed*shirts.length)%shirts.length];
        const part=(side,up,along,w,h,d,tint,pitch=0)=>put(people,
          p.x+cos*side*size+sin*along*size,ground+up*size,
          p.z-sin*side*size+cos*along*size,w*size,h*size,d*size,p.angle,tint,pitch);
        part(0,1.08,0,.43,.62,.25,shirt);
        for(const side of [-1,1]){
          const leg=stride*side*.43,arm=-stride*side*.35;
          part(side*.12,.79-Math.cos(leg)*.39,-Math.sin(leg)*.39,.16,.78,.18,0x333f4a,leg);
          part(side*.285,1.32-Math.cos(arm)*.28,-Math.sin(arm)*.28,.12,.56,.14,shirt,arm);
        }
        const skin=walker.seed<.35?0x875d47:walker.seed<.7?0xb78a64:0xd0ae8c;
        put(heads,p.x,ground+1.57*size,p.z,.16*size,.19*size,.16*size,p.angle,skin);
      }
      uploadInstances(people);uploadInstances(heads);
      vehicles.count=0;
      for(const car of traffic.cars){const p=trafficPose(car);
        if(Math.hypot(p.x-x,p.z-z)>radius)continue;
        const indicator=traffic.indicator(car);
        const van=car.seed>.88,length=van?6.4:4.4,sin=Math.sin(p.angle),cos=Math.cos(p.angle);
        const groundAt=(side,along)=>sampleElevation(projection.xToLon(p.x+cos*side+sin*along),
          projection.zToLat(p.z-sin*side+cos*along))*exaggeration;
        const rear=groundAt(0,-length*.31),front=groundAt(0,length*.31);
        const pitch=-Math.atan2(front-rear,length*.62),cp=Math.cos(pitch),sp=Math.sin(pitch);
        const roll=Math.atan((groundAt(.9,0)-groundAt(-.9,0))/1.8*cp);
        const cr=Math.cos(roll),sr=Math.sin(roll),y=(rear+front)/2+.4/(cp*cr);
        // Pitch and roll share one road-aligned frame. All four tyres remain
        // on the surface when a hillside slopes both along and across the road.
        const part=(side,up,along,w,h,d,tint)=>{
          const sx=cr*side-sr*up,sy=sr*side+cr*up,sz=cp*along+sp*sy;
          put(vehicles,p.x+cos*sx+sin*sz,y+cp*sy-sp*along,
            p.z-sin*sx+cos*sz,w,h,d,p.angle,tint,pitch,roll);
        };
        const tint=palette[Math.floor(car.seed*palette.length)%palette.length];
        part(0,van?.75:.25,0,1.85,van?1.7:.75,length,tint);
        // Vans keep a solid cargo body; the glazing wraps the front cab just
        // outside its sides and nose instead of disappearing inside the body.
        part(0,van?1.1:.78,van?length*.5-.72:0,van?1.89:1.6,.6,
          van?1.48:length*.52,0x29424e);
        // Four dark tyres and paired bright headlight lenses retain their scale up close.
        for(const side of [-1,1])for(const end of [-1,1]){
          part(side*.9,-.1,end*length*.31,.22,.55,.6,0x202221);
        }
        for(const side of [-1,1]){
          part(side*.61,.25,length*.51,.38,.18,.12,
            indicator===side?lamps.indicator:lamps.head);
        }
        for(const side of [-1,1]){
          part(side*.61,.25,-length*.51,.38,.18,.12,indicator===side?lamps.indicator
            :car.braking?lamps.brake:lamps.tail);
        }
      }
      uploadInstances(vehicles);
    },
    dispose(){disposed=true;request?.abort();scene.remove(group);
      box.dispose();crown.dispose();material.dispose();
      for(const m of [street,trees,vehicles,signals,people,heads])m.dispose();},
  };
}
