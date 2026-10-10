import { createStreetGraph, createTraffic, trafficPose } from './city-traffic.js?v=philly-2026100901';
import { CITY_LIGHT_GLSL } from './city-lighting.js?v=philly-2026100901';

// Instanced, illustrative street furniture; the OSM centerlines remain authoritative.
export function createCityStreets(THREE,{scene,projection,sampleElevation,lighting}){
  const group=new THREE.Group();group.name='city-street-life';scene.add(group);
  const uniforms={...lighting.uniforms,uSun:{value:new THREE.Vector3()},uNight:{value:0},
    uEye:{value:new THREE.Vector3()},uFog:{value:new THREE.Color(.55,.64,.72)}};
  const material=new THREE.ShaderMaterial({uniforms,vertexShader:`
    varying vec3 vWorld,vNormal,vColor;
    void main(){vec4 p=instanceMatrix*vec4(position,1.0);
      vWorld=p.xyz;vNormal=normalize(mat3(instanceMatrix)*normal);vColor=instanceColor;
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
  const street=make(box,14000),trees=make(crown,1600),vehicles=make(box,3000);
  const dummy=new THREE.Object3D(),color=new THREE.Color();
  function put(mesh,x,y,z,w,h,d,angle,tint){
    if(mesh.count>=mesh.instanceMatrix.count)return;
    dummy.position.set(x,y,z);dummy.rotation.set(0,angle,0);dummy.scale.set(w,h,d);dummy.updateMatrix();
    mesh.setMatrixAt(mesh.count,dummy.matrix);
    if(Array.isArray(tint))color.setRGB(...tint);else color.set(tint);
    mesh.setColorAt(mesh.count++,color);
  }
  let graph=null,traffic=null,loading=false,disposed=false,age=10,lastX=Infinity,lastZ=Infinity,lastExag=0;
  const palette=[0xb3b7bb,0x293746,0xd6cdb6,0x813b30,0x3e586c,0xdcb646,0xdddeda];
  function load(){if(loading)return;loading=true;
    fetch('data/city-streets.json').then(r=>{
      if(!r.ok)throw new Error('Street data unavailable');return r.json();})
      .then(doc=>{if(disposed)return;graph=createStreetGraph(doc,projection,sampleElevation);
        traffic=createTraffic(graph,620);age=10;})
      .catch(error=>console.warn('Decorative street layer:',error.message));
  }
  function rebuild(x,z,exag,radius){
    street.count=0;trees.count=0;
    const segments=graph.segments.filter(s=>Math.hypot((s.a.x+s.b.x)/2-x,(s.a.z+s.b.z)/2-z)<radius)
      .sort((a,b)=>Math.hypot(a.a.x-x,a.a.z-z)-Math.hypot(b.a.x-x,b.a.z-z));
    for(const s of segments){
      const dx=(s.b.x-s.a.x)/s.length,dz=(s.b.z-s.a.z)/s.length,angle=Math.atan2(dx,dz);
      const mx=(s.a.x+s.b.x)/2,mz=(s.a.z+s.b.z)/2,g=(s.a.ground+s.b.ground)/2*exag;
      const trimA=s.a.neighbors.size>2?s.width*.7:0,trimB=s.b.neighbors.size>2?s.width*.7:0;
      const curbLength=s.length-trimA-trimB,shift=(trimA-trimB)/2;
      if(curbLength<1)continue;
      // Keep the photographic road surface visible; narrow raised curbs define its edges.
      for(const side of [-1,1]){
        const off=side*(s.width/2+.35);
        put(street,mx+dx*shift-dz*off,g+.48,mz+dz*shift+dx*off,.35,.24,curbLength,angle,0x9c998d);
        put(street,mx+dx*shift-dz*(off+side),g+.38,mz+dz*shift+dx*(off+side),
          1.5,.16,curbLength,angle,0x88877e);
        if(s.length>28)for(let t=16;t<s.length-12;t+=34){
          const ground=(s.a.ground+(s.b.ground-s.a.ground)*t/s.length)*exag;
          const tx=s.a.x+dx*t-dz*(off+side*1.1),tz=s.a.z+dz*t+dx*(off+side*1.1);
          put(street,tx,ground+2.2,tz,.35,3.7,.35,0,0x58473a);
          put(trees,tx,ground+5.0,tz,2.3,2.9,2.3,angle,0x466544);
          if(side===1){const lx=tx+dx*5,lz=tz+dz*5;
            put(street,lx,ground+3.2,lz,.14,5.8,.14,0,0x434847);
            put(street,lx-dz*.5,ground+6.1,lz+dx*.5,1.25,.18,.36,angle,[1.9,1.6,1.15]);}
        }
      }
      if(s.length>25&&s.a.neighbors.size>2)for(let across=-s.width/2+1;across<s.width/2;across+=1.7){
        put(street,s.a.x+dx*7-dz*across,s.a.ground*exag+.52,s.a.z+dz*7+dx*across,
          .65,.035,2.7,angle,0xc9c6ac);
      }
    }
    for(const mesh of [street,trees]){mesh.instanceMatrix.needsUpdate=true;
      if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
  }
  return {group,
    update({camera,pose,state,exaggeration,sunDir,dt,reducedMotion,archive,quality}){
      group.visible=state.era==='present'&&state.compareMode==='off'&&!state.lightweight
        &&!archive&&state.layers.structures&&pose.dist<6500&&!!state.streetLife;
      if(!group.visible)return;load();if(!graph)return;
      const x=projection.lonToX(pose.lon),z=projection.latToZ(pose.lat);
      const radius=quality==='performance'?650:Math.min(2000,Math.max(850,pose.dist*.8));
      age+=dt;
      if(age>1&&(Math.hypot(x-lastX,z-lastZ)>100||exaggeration!==lastExag||age>8)){
        rebuild(x,z,exaggeration,radius);age=0;lastX=x;lastZ=z;lastExag=exaggeration;
      }
      uniforms.uSun.value.copy(sunDir);uniforms.uEye.value.copy(camera.position);
      uniforms.uNight.value=1-THREE.MathUtils.smoothstep(sunDir.y,-.1,.12);
      if(!reducedMotion)traffic.update(dt*state.animationSpeed);
      vehicles.count=0;
      for(const car of traffic.cars){const p=trafficPose(car);
        if(Math.hypot(p.x-x,p.z-z)>radius)continue;
        const ground=sampleElevation(projection.xToLon(p.x),projection.zToLat(p.z));
        const y=ground*exaggeration+1.0,van=car.seed>.88,length=van?6.4:4.4;
        const tint=palette[Math.floor(car.seed*palette.length)%palette.length];
        put(vehicles,p.x,y+.45,p.z,1.85,van?1.7:.85,length,p.angle,tint);
        put(vehicles,p.x,y+1.1,p.z,1.6,.65,length*.52,p.angle,0x29424e);
        // Four dark tyres and paired bright headlight lenses retain their scale up close.
        for(const side of [-1,1])for(const end of [-1,1]){
          const dx=Math.cos(p.angle)*side*.9+Math.sin(p.angle)*end*length*.31;
          const dz=-Math.sin(p.angle)*side*.9+Math.cos(p.angle)*end*length*.31;
          put(vehicles,p.x+dx,y-.1,p.z+dz,.22,.55,.6,p.angle,0x202221);
        }
        for(const side of [-1,1]){
          const hx=p.x+Math.sin(p.angle)*length*.51+Math.cos(p.angle)*side*.61;
          const hz=p.z+Math.cos(p.angle)*length*.51-Math.sin(p.angle)*side*.61;
          put(vehicles,hx,y+.35,hz,.38,.18,.12,p.angle,[2.2,2.1,1.65]);
        }
      }
      vehicles.instanceMatrix.needsUpdate=true;
      if(vehicles.instanceColor)vehicles.instanceColor.needsUpdate=true;
    },
    dispose(){disposed=true;scene.remove(group);box.dispose();crown.dispose();material.dispose();
      for(const m of [street,trees,vehicles])m.dispose();},
  };
}
