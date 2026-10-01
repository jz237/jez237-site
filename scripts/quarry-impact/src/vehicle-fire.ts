import * as T from 'three';
import type { Vehicle } from './vehicle';
import { VehicleThermalState } from './vehicle-thermal-state';
import {fireProfile} from './vehicle-fire-profile';
import {fireNoise} from './fire-noise';

type Puff = {p:T.Vector3;v:T.Vector3;anchor:T.Vector3;site:number;age:number;life:number;size:number;seed:number;kind:number;owner:number;strength:number;depth:number;heat:number;aspect:number;soot:number};
type Emitter = {car:Vehicle;state:VehicleThermalState;origin:T.Vector3;smoke:number;flame:number;embers:number;impactSerial:number;profile:ReturnType<typeof fireProfile>;sites:{position:T.Vector3;weight:number;name:string}[]};
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
  private seed=0;
  private offsets = new Float32Array(this.capacity*3);
  private data = new Float32Array(this.capacity*4);
  private details = new Float32Array(this.capacity*4);
  private visible:Puff[]=[];
  private noise:T.Data3DTexture;
  constructor(private scene:T.Scene, private spark:(p:T.Vector3,count:number,type:number,force:number)=>void,private random=()=>Math.random()) {
    let seed=917; const noiseRandom=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
    const voxels=fireNoise();
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
          vec2 up=(viewMatrix*vec4(0.,1.,0.,0.)).xy;float rise=length(up);up=rise>.01?up/rise:vec2(0.,1.);
          vec2 across=vec2(up.y,-up.x);float stretch=puff.z<.5?1.:puff.z<1.5?1.+rise*1.55:1.;
          mv.xy+=(across*position.x*detail.z+up*position.y*stretch)*puff.x;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`precision highp sampler3D;
        uniform sampler3D volume;uniform float clock;uniform int steps;uniform vec3 fogColor;uniform vec3 sunView;
        varying vec2 vUv;varying vec4 vPuff;varying vec4 vDetail;varying float vDepth;
        float turbulence(vec3 p){return texture(volume,p*.041).r*.58+texture(volume,p*.096+17.).r*.29+texture(volume,p*.193-9.).r*.13;}
        void main(){float rr=dot(vUv,vUv);if(rr>=1.)discard;
          float kind=vPuff.z,age=vPuff.y,seed=vDetail.x,fade=vPuff.w;
          int samples=max(4,steps-(kind<.5?2:3));
          float span=sqrt(1.-rr),stepSize=2.*span/float(samples),alpha=0.;vec3 color=vec3(0.);
          for(int i=0;i<9;i++){if(i>=samples)break;
            float z=span-(float(i)+.5)*stepSize;
            vec3 q=vec3(vUv,z);vec3 wind=vec3(seed*13.+sin(clock*.4+seed)*.3,seed*7.-clock*(kind<.5?.20:1.8),seed*19.);
            q.x+=sin(q.y*4.+clock*(2.6+fract(seed))+seed)*.16*(kind<.5?.4:1.)*max(0.,q.y+.6);
            float n=turbulence(q*1.9+wind);
            float boundary=max(0.,1.-dot(q,q));
            float density=smoothstep(.25,.66,n)*boundary;
            vec3 c;
            if(kind<.5){
              float shade=texture(volume,(q*1.9+wind+sunView*.7)*.041).r;
              float sun=clamp(.35+dot(q,sunView)*.3+(n-shade)*1.7,0.,1.);
              vec3 soot=mix(vec3(.037,.039,.041),vec3(.15,.16,.165),age);
              soot=mix(vec3(.62,.65,.66),soot,smoothstep(.03,.55,vDetail.y)*vDetail.w);
              c=soot*(.58+sun*1.85)+vec3(.008,.010,.013);
              c+=vec3(.32,.034,.001)*vDetail.y*pow(1.-age,4.)*max(0.,.5-q.y);
              density=smoothstep(.27,.64,n)*boundary*(1.8+vDetail.y*2.)*fade;
            }else{
              float height=clamp((q.y+1.)*.5,0.,1.);
              float ragged=texture(volume,(q*vec3(1.8,3.8,1.8)+vec3(seed,-clock*3.7,seed))*.33).r;
              float width=mix(.82,.012,pow(height,.72))*(.32+ragged*1.35);
              float curl=sin(height*14.-clock*11.+seed)*.13*height+sin(height*27.+clock*17.-seed)*.055;
              float tongues=kind<1.5?smoothstep(-.025,.08,width-length(vec2(q.x+curl,q.z))) :1.;
              float breaks=kind<1.5?smoothstep(.16,.51,ragged+(1.-height)*.2):1.;
              density*=smoothstep(.27,.61,n)*tongues*breaks*fade*(kind<1.5?4.5:5.);
              float heat=clamp((n-.29)*1.8+(1.-height)*.40+(1.-age)*.15,0.,1.);
              c=mix(vec3(1.25,.075,.002),vec3(3.1,.67,.025),smoothstep(.06,.65,heat));
              c=mix(c,vec3(4.4,2.1,.30),smoothstep(.72,1.,heat));
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
    for(let i=0;i<this.capacity;i++)this.particles.push({p:new T.Vector3(),v:new T.Vector3(),anchor:new T.Vector3(),site:0,age:0,life:0,size:1,seed:noiseRandom()*31,kind:0,owner:-1,strength:1,depth:0,heat:0,aspect:1,soot:1});
    for(let i=0;i<2;i++){const light=new T.PointLight(0xff7a24,0,10,2);light.name='vehicle-fire-light-'+i;scene.add(light);this.lights.push(light);}
  }
  setQuality(quality:string){this.quality=quality;this.mesh.material.uniforms.steps.value=quality==='ultra'?9:quality==='high'?7:5;}
  private spawn(e:Emitter,kind:number,burst=false){
    let p=this.particles[this.cursor++%this.capacity];
    // Short flames expire before smoke. Reuse free slots before evicting a live
    // plume, so eight fires do not truncate their rising smoke after two seconds.
    for(let i=1;p.life>0&&i<this.capacity;i++)p=this.particles[this.cursor++%this.capacity];
    const r=()=>this.random()-.5;
    p.owner=e.car.id;p.kind=kind;p.age=0;
    const total=e.sites.reduce((s,a)=>s+a.weight,0);let pick=this.random()*total;
    const site=e.sites.find(s=>(pick-=s.weight)<=0)??e.sites[0];
    p.site=e.sites.indexOf(site);p.anchor.copy(site.position);
    p.p.copy(burst?e.origin:site.position);p.p.x+=r()*(kind===1?.17:.3);p.p.z+=r()*(kind===1?.17:.3);p.p.y+=kind===1?.18:.12;
    p.life=kind===0?4.+this.random()*1.7:kind===1?.22+this.random()*.29:.8+this.random()*.36;
    p.size=(kind===0?.24+this.random()*.16:kind===1?.11+this.random()*.13:.63+this.random()*.37)*e.profile.scale;
    p.aspect=.65+this.random()*.35;p.heat=e.state.soot;p.soot=e.profile.soot;p.seed=this.random()*31;
    p.strength=kind===0?e.state.smoke:Math.max(.2,e.state.heat);
    p.v.copy(e.car.velocity).multiplyScalar(kind===0?.28:kind===1?0:.65);
    p.v.add(new T.Vector3(r()*.4,kind===0?.7+e.state.heat*.8:.5+e.state.heat*.6,r()*.4));
    if(burst){p.v.add(new T.Vector3(r()*5,this.random()*2.4,r()*5));p.p.y+=.1;p.strength=1;}
  }
  update(cars:Vehicle[],dt:number,camera:T.Camera){
    this.bursts.length=0;
    const valid=new Set(cars.map(c=>c.id));
    for(const [id,e]of this.emitters)if(!valid.has(id)||!cars.includes(e.car)){this.emitters.delete(id);for(const p of this.particles)if(p.owner===id)p.life=0;}
    for(const car of cars)if(!this.emitters.has(car.id)){
      const seed=this.random()+car.id*.731+this.seed++*.173,profile=fireProfile(car.kind,seed);
      this.emitters.set(car.id,{car,state:new VehicleThermalState(car.health,seed),origin:new T.Vector3(),smoke:0,flame:0,embers:0,impactSerial:car.impactSerial,profile,sites:profile.sites.map(s=>({name:s.name,position:new T.Vector3(),weight:s.base}))});
    }
    // Visual effects use the same 60Hz progression at every render rate.
    this.accumulator+=Number.isFinite(dt)?Math.min(.05,Math.max(0,dt)):0;
    while(this.accumulator+1e-9>=1/60){this.advance(1/60);this.accumulator=Math.max(0,this.accumulator-1/60);}
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
      const zones=car.damageZones??car.wreckParts?.zones??{front:0,rear:0,left:0,right:0,roof:0};
      e.profile.sites.forEach((s,i)=>{
        const damage=zones[s.zone as keyof typeof zones];
        e.sites[i].position.set(s.x,s.y,s.z).applyQuaternion(car.root.quaternion).add(car.root.position);
        e.sites[i].weight=s.base*(s.zone==='front'?Math.max(.03,damage/30):s.zone==='rear'?Math.max(0,(damage-12)/28):0);
      });
      const dominant=e.sites.reduce((a,b)=>a.weight>b.weight?a:b);e.origin.copy(dominant.position);
      const impact=car.impactSerial!==e.impactSerial?car.lastDamage:Math.max(0,state.health-car.health);
      const ignition=state.advance(car.health,dt,impact,zones);e.impactSerial=car.impactSerial;
      car.wreckFinish?.advance(state.heat,dt);
      if(ignition){for(let j=0;j<16;j++)this.spawn(e,2,true);for(let j=0;j<8;j++)this.spawn(e,0,true);this.spark(e.origin,32,1,4.5);this.bursts.push({id:car.id,position:e.origin.clone(),heat:state.heat,burst:1});}
      const scale=this.quality==='medium'?.6:1;
      const pulse=.78+.22*Math.sin(this.time*(2.3+e.profile.scale)+e.profile.pulse)+.12*Math.sin(this.time*7.1+e.profile.pulse);
      e.smoke+=dt*state.smoke*10*scale*(.8+e.profile.scale*.2);e.flame+=dt*state.heat*33*scale*pulse;e.embers+=dt*state.heat*2*pulse;
      while(e.smoke>=1){this.spawn(e,0);e.smoke--;}
      while(e.flame>=1){this.spawn(e,1);e.flame--;}
      while(e.embers>=1){this.spark(e.origin,1,1,.75);e.embers--;}
    }
    for(const p of this.particles){if(p.life<=0)continue;p.age+=dt;if(p.age>=p.life){p.life=0;continue;}
      if(p.kind===1){const site=this.emitters.get(p.owner)?.sites[p.site];if(site){p.p.add(site.position).sub(p.anchor);p.anchor.copy(site.position);}}
      p.p.addScaledVector(p.v,dt);
      if(p.kind===0){const gust=.5+Math.sin(this.time*.31)*.23;p.v.x+=(gust+Math.sin(p.age*1.8+p.seed)*.45-p.v.x)*dt*.65;p.v.z+=(-.2+Math.cos(p.age*1.6+p.seed)*.38-p.v.z)*dt*.6;p.v.y+=(1.3+p.heat*.55-p.v.y)*dt*.5;}
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
      const growth=p.kind===0?1+p.age*.88:p.kind===1?1+p.age*.3:1+p.age*2.8;
      const fade=(p.kind===0?Math.min(1,p.age*8):Math.min(1,p.age*28))*Math.pow(1-age,p.kind===0?.65:.8)*p.strength;
      const slot=i*4;
      this.data[slot]=p.size*growth;this.data[slot+1]=age;this.data[slot+2]=p.kind;this.data[slot+3]=fade;
      this.details[slot]=p.seed;this.details[slot+1]=p.heat;this.details[slot+2]=p.aspect;this.details[slot+3]=p.soot;
    }
    for(const n of ['offset','puff','detail'])this.mesh.geometry.attributes[n].needsUpdate=true;
    this.mesh.geometry.instanceCount=this.visible.length;this.mesh.visible=this.visible.length>0;this.mesh.material.uniforms.clock.value=this.time;
    const nearest=[...this.emitters.values()].filter(e=>e.state.heat>.02).sort((a,b)=>a.origin.distanceToSquared(camera.position)-b.origin.distanceToSquared(camera.position));
    this.lights.forEach((light,i)=>{const e=nearest[i];light.intensity=0;if(!e)return;light.position.copy(e.origin).add(new T.Vector3(0,.35,0));light.intensity=(e.state.heat*(8+2*Math.sin(this.time*17+e.profile.pulse))+e.state.burst*75);});
  }
  get stats(){return{active:this.particles.filter(p=>p.life>0).length,visible:this.visible.length,capacity:this.capacity,emitters:[...this.emitters].map(([id,e])=>({id,health:e.state.health,heat:e.state.heat,smoke:e.state.smoke,exploded:e.state.exploded,criticalTime:e.state.criticalTime,origin:e.origin.toArray(),sites:e.sites.map(s=>({name:s.name,weight:s.weight,position:s.position.toArray()}))})),lights:this.lights.filter(l=>l.intensity>0).length};}
  reset(){for(const p of this.particles)p.life=0;this.emitters.clear();this.audio.length=this.bursts.length=0;this.visible.length=0;this.cursor=0;this.accumulator=0;this.mesh.geometry.instanceCount=0;this.mesh.visible=false;this.lights.forEach(l=>l.intensity=0);}
  dispose(){this.reset();this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();this.noise.dispose();for(const l of this.lights)l.removeFromParent();}
}
