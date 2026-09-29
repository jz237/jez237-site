import * as T from 'three';
import type { Vehicle } from './vehicle';
import { DEFINITIONS } from './rules';
import { VehicleThermalState } from './vehicle-thermal-state';

type Puff = {p:T.Vector3;v:T.Vector3;age:number;life:number;size:number;seed:number;kind:number;owner:number;strength:number;depth:number};
type Emitter = {car:Vehicle;state:VehicleThermalState;origin:T.Vector3;smoke:number;flame:number;embers:number;impactSerial:number};
export type ThermalAudio = {id:number;position:T.Vector3;heat:number;burst:number};

/** Bounded, sorted volumetric billboards. Each fragment integrates a turbulent
 * density field through the puff instead of drawing a flat opaque texture. */
export class VehicleFire {
  readonly capacity = 640;
  readonly emitters = new Map<number,Emitter>();
  readonly particles:Puff[] = [];
  readonly mesh:T.Mesh<T.InstancedBufferGeometry,T.ShaderMaterial>;
  readonly lights:T.PointLight[] = [];
  readonly audio:ThermalAudio[] = [];
  readonly bursts:ThermalAudio[] = [];
  private cursor = 0;
  private time = 0;
  private accumulator = 0;
  private quality = 'ultra';
  private offsets = new Float32Array(this.capacity*3);
  private data = new Float32Array(this.capacity*4);
  private details = new Float32Array(this.capacity*4);
  private visible:Puff[]=[];
  private noise:T.Data3DTexture;
  constructor(private scene:T.Scene, private spark:(p:T.Vector3,count:number,type:number,force:number)=>void) {
    let seed=917; const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
    const voxels = new Uint8Array(64*64*64);for(let i=0;i<voxels.length;i++)voxels[i]=Math.floor(random()*255);
    this.noise=new T.Data3DTexture(voxels,64,64,64);this.noise.format=T.RedFormat;
    this.noise.minFilter=this.noise.magFilter=T.LinearFilter;this.noise.wrapS=this.noise.wrapT=this.noise.wrapR=T.RepeatWrapping;this.noise.unpackAlignment=1;this.noise.needsUpdate=true;
    const plane=new T.PlaneGeometry(2,2),g=new T.InstancedBufferGeometry();g.index=plane.index;g.attributes.position=plane.attributes.position;g.attributes.uv=plane.attributes.uv;
    g.setAttribute('offset',new T.InstancedBufferAttribute(this.offsets,3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('puff',new T.InstancedBufferAttribute(this.data,4).setUsage(T.DynamicDrawUsage));
    g.setAttribute('detail',new T.InstancedBufferAttribute(this.details,4).setUsage(T.DynamicDrawUsage));g.instanceCount=0;
    const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,
      uniforms:{volume:{value:this.noise},clock:{value:0},steps:{value:9},sunView:{value:new T.Vector3()},fogColor:{value:new T.Color(0xa5b1bb)}},
      vertexShader:`attribute vec3 offset;attribute vec4 puff;attribute vec4 detail;
        varying vec2 vUv;varying vec4 vPuff;varying vec4 vDetail;varying float vDepth;
        void main(){vUv=uv*2.-1.;vPuff=puff;vDetail=detail;
          vec4 mv=modelViewMatrix*vec4(offset,1.);vDepth=-mv.z;
          float stretch=puff.z<.5?1.:puff.z<1.5?1.75:1.05;
          mv.xy+=position.xy*puff.x*vec2(1.,stretch);gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`precision highp sampler3D;
        uniform sampler3D volume;uniform float clock;uniform int steps;uniform vec3 fogColor;uniform vec3 sunView;
        varying vec2 vUv;varying vec4 vPuff;varying vec4 vDetail;varying float vDepth;
        float turbulence(vec3 p){return texture(volume,p*.041).r*.67+texture(volume,p*.096+17.).r*.33;}
        void main(){float rr=dot(vUv,vUv);if(rr>=1.)discard;
          float span=sqrt(1.-rr),stepSize=2.*span/float(steps),alpha=0.;vec3 color=vec3(0.);
          float kind=vPuff.z,age=vPuff.y,seed=vDetail.x,fade=vPuff.w;
          for(int i=0;i<12;i++){if(i>=steps)break;
            float z=span-(float(i)+.5)*stepSize;
            vec3 q=vec3(vUv,z);vec3 wind=vec3(seed*13.,seed*7.-clock*(kind<.5?.24:1.3),seed*19.);
            float n=turbulence(q*1.9+wind);
            float boundary=max(0.,1.-dot(q,q));
            float density=smoothstep(.25,.66,n)*boundary;
            vec3 c;
            if(kind<.5){
              float shade=turbulence(q*1.9+wind+sunView*.7);
              float sun=clamp(.35+dot(q,sunView)*.3+(n-shade)*2.6,0.,1.);
              vec3 soot=mix(vec3(.024,.025,.027),vec3(.11,.115,.12),age);
              soot=mix(vec3(.34,.36,.38),soot,smoothstep(.05,.5,vDetail.y));
              c=soot*(.58+sun*1.85)+vec3(.008,.010,.013);
              c+=vec3(.32,.034,.001)*vDetail.y*pow(1.-age,4.)*max(0.,.5-q.y);
              density=smoothstep(.34,.7,n)*boundary*3.4*fade;
            }else{
              float taper=kind<1.5?clamp(1.-(q.y+.35)*.5,0.,1.):1.;
              density*=smoothstep(.28,.64,n)*taper*fade*5.;
              float heat=clamp((n-.35)*2.1+(1.-age)*.25-q.y*.2,0.,1.);
              c=mix(vec3(1.4,.035,.001),vec3(4.8,.62,.008),smoothstep(.08,.6,heat));
              c=mix(c,vec3(7.,3.1,.55),smoothstep(.66,1.,heat));
              if(kind>1.5){c=mix(vec3(.035,.036,.038),c*.75,pow(1.-age,2.7));density*=1.1;}
            }
            float a=1.-exp(-density*stepSize);color+=(1.-alpha)*c*a;alpha+=(1.-alpha)*a;
          }
          if(alpha<.003)discard;
          float fog=1.-exp(-.0011*.0011*vDepth*vDepth);color=mix(color/alpha,fogColor,fog);
          gl_FragColor=vec4(color,alpha*smoothstep(.15,.75,vDepth));
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`});
    this.mesh=new T.Mesh(g,material);this.mesh.name='vehicle-volumetric-fire-smoke';this.mesh.frustumCulled=false;this.mesh.renderOrder=4;scene.add(this.mesh);
    for(let i=0;i<this.capacity;i++)this.particles.push({p:new T.Vector3(),v:new T.Vector3(),age:0,life:0,size:1,seed:random()*31,kind:0,owner:-1,strength:1,depth:0});
    for(let i=0;i<2;i++){const light=new T.PointLight(0xff7a24,0,10,2);light.name='vehicle-fire-light-'+i;scene.add(light);this.lights.push(light);}
  }
  setQuality(quality:string){this.quality=quality;this.mesh.material.uniforms.steps.value=quality==='ultra'?9:quality==='high'?7:5;}
  private spawn(e:Emitter,kind:number,burst=false){
    let p=this.particles[this.cursor++%this.capacity];
    // Short flames expire before smoke. Reuse free slots before evicting a live
    // plume, so eight fires do not truncate their rising smoke after two seconds.
    for(let i=1;p.life>0&&i<this.capacity;i++)p=this.particles[this.cursor++%this.capacity];
    const r=()=>Math.random()-.5;
    p.owner=e.car.id;p.kind=kind;p.age=0;
    p.p.copy(e.origin);p.p.x+=r()*.7;p.p.z+=r()*.6;p.p.y+=kind===1?.04:.12;
    p.life=kind===0?3.8+Math.random()*1.6:kind===1?.45+Math.random()*.32:.65+Math.random()*.3;
    p.size=kind===0?.32+Math.random()*.14:kind===1?.18+Math.random()*.2:.48+Math.random()*.2;
    p.strength=kind===0?e.state.smoke:Math.max(.2,e.state.heat);
    p.v.copy(e.car.velocity).multiplyScalar(kind===0?.36:.65);
    p.v.add(new T.Vector3(r()*.5,kind===0?.7+e.state.heat*.8:1.1+e.state.heat,r()*.5));
    if(burst){p.v.add(new T.Vector3(r()*3.5,Math.random()*1.5,r()*3.5));p.p.y+=.1;}
  }
  update(cars:Vehicle[],dt:number,camera:T.Camera){
    this.bursts.length=0;
    const valid=new Set(cars.map(c=>c.id));
    for(const [id,e]of this.emitters)if(!valid.has(id)||!cars.includes(e.car)){this.emitters.delete(id);for(const p of this.particles)if(p.owner===id)p.life=0;}
    for(const car of cars)if(!this.emitters.has(car.id))this.emitters.set(car.id,{car,state:new VehicleThermalState(car.health),origin:new T.Vector3(),smoke:0,flame:0,embers:0,impactSerial:car.impactSerial});
    // Visual effects use the same 60Hz progression at every render rate.
    this.accumulator+=Math.min(.05,Math.max(0,dt));
    while(this.accumulator>=1/60){this.advance(1/60);this.accumulator-=1/60;}
    this.audio.length=0;
    for(const e of this.emitters.values())this.audio.push({id:e.car.id,position:e.origin,heat:e.state.heat,burst:e.state.burst});
    this.prepare(camera);
  }
  private advance(dt:number){
    this.time+=dt;
    for(const e of this.emitters.values()){
      const {car,state}=e;
      if(car.health>state.health+1){for(const p of this.particles)if(p.owner===car.id)p.life=0;e.smoke=e.flame=e.embers=0;}
      // Transform the actual engine-bay position, including rollovers. Buoyancy
      // thereafter remains world-up; emitted smoke stays behind a moving car.
      e.origin.set(0,.22,DEFINITIONS[car.kind].halfLength*.54).applyQuaternion(car.root.quaternion).add(car.root.position);
      const impact=car.impactSerial!==e.impactSerial?car.lastDamage:Math.max(0,state.health-car.health);
      const ignition=state.advance(car.health,dt,impact);e.impactSerial=car.impactSerial;
      car.wreckFinish?.advance(state.heat,dt);
      if(ignition){for(let j=0;j<11;j++)this.spawn(e,2,true);this.spark(e.origin,22,1,3.6);this.bursts.push({id:car.id,position:e.origin.clone(),heat:state.heat,burst:1});}
      const scale=this.quality==='medium'?.6:1;
      e.smoke+=dt*state.smoke*8*scale;e.flame+=dt*state.heat*29*scale;e.embers+=dt*state.heat*5;
      while(e.smoke>=1){this.spawn(e,0);e.smoke--;}
      while(e.flame>=1){this.spawn(e,1);e.flame--;}
      while(e.embers>=1){this.spark(e.origin,1,1,.75);e.embers--;}
    }
    for(const p of this.particles){if(p.life<=0)continue;p.age+=dt;if(p.age>=p.life){p.life=0;continue;}
      p.p.addScaledVector(p.v,dt);
      if(p.kind===0){p.v.x+=(.4+Math.sin(p.age*1.8+p.seed)*.3-p.v.x)*dt*.65;p.v.z+=(-.14+Math.cos(p.age*1.6+p.seed)*.25-p.v.z)*dt*.6;p.v.y+=(1.65-p.v.y)*dt*.5;}
      else {p.v.x*=Math.exp(-dt*.6);p.v.z*=Math.exp(-dt*.6);p.v.y+=dt*.45;}
    }
  }
  private prepare(camera:T.Camera){
    camera.updateMatrixWorld();this.visible.length=0;
    // Same calibrated HDRI sun as static-shadows.ts, guarded by the renderer test.
    this.mesh.material.uniforms.sunView.value.set(.17808175630589612,.7416666663831829,-.6466973357352447).normalize().transformDirection(camera.matrixWorldInverse);
    const view=camera.matrixWorldInverse.elements;
    for(const p of this.particles){if(p.life<=0)continue;p.depth=-(view[2]*p.p.x+view[6]*p.p.y+view[10]*p.p.z+view[14]);if(p.depth<-.5||p.depth>190)continue;this.visible.push(p);}
    this.visible.sort((a,b)=>b.depth-a.depth);
    for(let i=0;i<this.visible.length;i++){
      const p=this.visible[i],age=p.age/p.life;
      this.offsets[i*3]=p.p.x;this.offsets[i*3+1]=p.p.y;this.offsets[i*3+2]=p.p.z;
      const growth=p.kind===0?1+p.age*.85:p.kind===1?1+p.age*.35:1+p.age*2.8;
      const fade=(p.kind===0?Math.min(1,p.age*8):Math.min(1,p.age*28))*Math.pow(1-age,p.kind===0?.65:.8)*p.strength;
      const slot=i*4;
      this.data[slot]=p.size*growth;this.data[slot+1]=age;this.data[slot+2]=p.kind;this.data[slot+3]=fade;
      this.details[slot]=p.seed;this.details[slot+1]=this.emitters.get(p.owner)?.state.heat??0;
    }
    for(const n of ['offset','puff','detail'])this.mesh.geometry.attributes[n].needsUpdate=true;
    this.mesh.geometry.instanceCount=this.visible.length;this.mesh.visible=this.visible.length>0;this.mesh.material.uniforms.clock.value=this.time;
    const nearest=[...this.emitters.values()].filter(e=>e.state.heat>.02).sort((a,b)=>a.origin.distanceToSquared(camera.position)-b.origin.distanceToSquared(camera.position));
    this.lights.forEach((light,i)=>{const e=nearest[i];light.intensity=0;if(!e)return;light.position.copy(e.origin).add(new T.Vector3(0,.35,0));light.intensity=(e.state.heat*(15+3*Math.sin(this.time*17+e.car.id))+e.state.burst*90);});
  }
  get stats(){return{active:this.particles.filter(p=>p.life>0).length,visible:this.visible.length,capacity:this.capacity,emitters:[...this.emitters].map(([id,e])=>({id,health:e.state.health,heat:e.state.heat,smoke:e.state.smoke,exploded:e.state.exploded,origin:e.origin.toArray()})),lights:this.lights.filter(l=>l.intensity>0).length};}
  reset(){for(const p of this.particles)p.life=0;this.emitters.clear();this.audio.length=this.bursts.length=0;this.visible.length=0;this.cursor=0;this.accumulator=0;this.mesh.geometry.instanceCount=0;this.mesh.visible=false;this.lights.forEach(l=>l.intensity=0);}
  dispose(){this.reset();this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();this.noise.dispose();for(const l of this.lights)l.removeFromParent();}
}
