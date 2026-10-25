import * as T from 'three';
import type {Vehicle} from './vehicle';

export type Puddle={id:number;x:number;z:number;level:number;radius:number;aspect:number;phases:number[]};
/** Matches the irregular water mesh, including its compressed local Y axis. */
export function puddleDepth(p:Puddle,x:number,y:number,z:number){
  if(Math.abs(y-p.level)>.17)return 0;
  const dx=x-p.x,dz=-(z-p.z)/p.aspect,a=Math.atan2(dz,dx),n=p.phases;
  const edge=1+Math.sin(a*3+n[0]*6.28)*.105+Math.sin(a*5+n[1]*6.28)*.066+Math.sin(a*11+n[2]*6.28)*.025+Math.sin(a*23+n[3]*6.28)*.008;
  return T.MathUtils.clamp((edge-Math.hypot(dx,dz)/p.radius)*6,0,1);
}
type Drop={p:T.Vector3;v:T.Vector3;age:number;life:number;size:number;level:number;alpha:number};
/** Rain spray (offline rain, film 0–1): every grounded wheel off the puddles, past RAIN_SPRAY.from m/s, throws a fine,
 * faint spray off the wet road, up and trailing behind (thrown at a fraction of the car's speed): RAIN_SPRAY.rate drops a
 * second per m/s, up to RAIN_SPRAY.max, per wheel. Shares the puddle drops' pool. */
export const RAIN_SPRAY={from:4,rate:3,max:48,alpha:.3,trail:[.2,.4],lift:[.6,2],life:[.4,.7],size:[.05,.11]} as const;
/** Lamp-lit spray (offline rain): a tail lamp lights the spray behind it red out to SPRAY_LIGHT.tail m (at SPRAY_LIGHT.running
 * while only lit, full while braking), a headlamp lights the spray in front of it warm white out to SPRAY_LIGHT.head m in a
 * narrower cone at SPRAY_LIGHT.headGain, fading with the square of distance; lit drops glow brighter (up to SPRAY_LIGHT.max)
 * and swell by up to SPRAY_LIGHT.grow as the light blooms in them. */
export const SPRAY_LIGHT={tail:4.5,head:8,running:.35,headGain:.55,max:1.6,alpha:1.4,grow:.6} as const;
export type SprayLamp={x:number;y:number;z:number;tail:boolean;brake?:boolean;dx?:number;dz?:number};
const RED=[1,.13,.06],WARM=[1,.93,.8],smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
/** The lamp light falling on a drop at (x, y, z), as rgb into out (0..SPRAY_LIGHT.max each). */
export function sprayLight(out:number[],x:number,y:number,z:number,lamps:readonly SprayLamp[]){
  out[0]=out[1]=out[2]=0;
  for(const l of lamps){
    const vx=x-l.x,vy=y-l.y,vz=z-l.z,d=Math.hypot(vx,vy,vz),reach=l.tail?SPRAY_LIGHT.tail:SPRAY_LIGHT.head;if(!(d<reach))continue;
    const facing=l.dx===undefined||l.dz===undefined?1:(vx*l.dx+vz*l.dz)/Math.max(d,.05),cone=l.tail?smooth(-.2,.6,facing):smooth(.55,.9,facing);if(cone<=0)continue;
    const k=(1-d/reach)**2*cone*(l.tail?(l.brake?1:SPRAY_LIGHT.running):SPRAY_LIGHT.headGain),c=l.tail?RED:WARM;
    for(let i=0;i<3;i++)out[i]+=c[i]*k;
  }
  for(let i=0;i<3;i++)out[i]=Math.min(SPRAY_LIGHT.max,out[i]);
  return out;
}
type Ripple={p:T.Vector3;water:Puddle|null;age:number;life:number;radius:number;strength:number};
export type SplashSource=Pick<Vehicle,'id'|'velocity'|'health'|'right'|'remoteContactPoints'>&{controller?:Pick<Vehicle['controller'],'wheelIsInContact'|'wheelContactPoint'>};
export class PuddleSplashes {
  readonly capacity=768;
  readonly drops:Drop[]=Array.from({length:this.capacity},()=>({p:new T.Vector3(),v:new T.Vector3(),age:0,life:0,size:0,level:0,alpha:1}));
  readonly ripples:Ripple[]=Array.from({length:48},()=>({p:new T.Vector3(),water:null,age:0,life:0,radius:0,strength:0}));
  readonly spray:T.Mesh<T.InstancedBufferGeometry,T.ShaderMaterial>;
  readonly rings:T.Mesh<T.InstancedBufferGeometry,T.ShaderMaterial>;
  private offset=new Float32Array(this.capacity*3);
  private movement=new Float32Array(this.capacity*3);
  private data=new Float32Array(this.capacity*2);
  private glow=new Float32Array(this.capacity*3);
  private lamps:readonly SprayLamp[]=[];private lit=[0,0,0];
  /** Drops lit by a lamp at the last render (QA). */
  litDrops=0;
  private ringOffset=new Float32Array(48*3);
  private ringData=new Float32Array(48*4);
  private shapes=new Float32Array(48*4);
  private phases=new Float32Array(48*4);
  private budgets=new Map<string,{spray:number;ring:number}>();
  private cursor=0;private ringCursor=0;private accumulator=0;private quality=1;
  emitted=0;wetWheels=0;maxSpeed=0;
  /** Rain spray drops thrown so far and wheels throwing it this step (QA). */
  sprayed=0;sprayWheels=0;
  constructor(scene:T.Scene,private random=()=>Math.random()){
    const geometry=(attributes:Record<string,[Float32Array,number]>)=>{const p=new T.PlaneGeometry(2,2),g=new T.InstancedBufferGeometry();g.index=p.index;g.attributes.position=p.attributes.position;g.attributes.uv=p.attributes.uv;for(const [name,[data,size]]of Object.entries(attributes))g.setAttribute(name,new T.InstancedBufferAttribute(data,size).setUsage(T.DynamicDrawUsage));g.instanceCount=0;return g;};
    this.spray=new T.Mesh(geometry({offset:[this.offset,3],movement:[this.movement,3],drop:[this.data,2],glow:[this.glow,3]}),new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{},
      vertexShader:`attribute vec3 offset;attribute vec3 movement;attribute vec2 drop;attribute vec3 glow;varying vec2 vUv;varying float vFade;varying vec3 vGlow;
      void main(){vUv=uv*2.-1.;vFade=drop.y;vGlow=glow;vec4 mv=modelViewMatrix*vec4(offset,1.);vec2 velocity=(viewMatrix*vec4(movement,0.)).xy;float speed=length(velocity);vec2 up=speed>.01?velocity/speed:vec2(0.,1.);vec2 across=vec2(up.y,-up.x);mv.xy+=(across*position.x*.55+up*position.y*(1.+min(5.,speed*.25)))*drop.x*(1.+min(1.,max(glow.r,glow.g))*${SPRAY_LIGHT.grow.toFixed(2)});gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`varying vec2 vUv;varying float vFade;varying vec3 vGlow;void main(){float d=dot(vUv,vUv);if(d>1.)discard;float rim=pow(max(0.,1.-d),1.5);vec3 color=mix(vec3(.40,.53,.59),vec3(.92,1.,1.02),rim)*(1.-min(1.,max(vGlow.r,vGlow.g))*.85)+vGlow*(.4+rim*1.6);gl_FragColor=vec4(color,min(1.,rim*vFade*.60*(1.+min(1.,max(vGlow.r,vGlow.g))*${SPRAY_LIGHT.alpha.toFixed(2)})));
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`}));
    this.spray.name='tire-puddle-spray';this.spray.frustumCulled=false;this.spray.renderOrder=3;scene.add(this.spray);
    this.rings=new T.Mesh(geometry({offset:[this.ringOffset,3],ring:[this.ringData,4],shape:[this.shapes,4],phases:[this.phases,4]}),new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,
      vertexShader:`attribute vec3 offset;attribute vec4 ring;attribute vec4 shape;attribute vec4 phases;varying vec2 vUv;varying vec2 vWorld;varying vec4 vRing;varying vec4 vShape;varying vec4 vPhases;void main(){vUv=uv*2.-1.;vRing=ring;vShape=shape;vPhases=phases;vec3 p=offset+vec3(position.x*ring.x,0.,position.y*ring.x);vWorld=p.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader:`varying vec2 vUv;varying vec2 vWorld;varying vec4 vRing;varying vec4 vShape;varying vec4 vPhases;void main(){vec2 q=(vWorld-vShape.xy)/vec2(1.,-vShape.w);float a=atan(q.y,q.x);float edge=1.+sin(a*3.+vPhases.x*6.28)*.105+sin(a*5.+vPhases.y*6.28)*.066+sin(a*11.+vPhases.z*6.28)*.025+sin(a*23.+vPhases.w*6.28)*.008;float wet=smoothstep(0.,.07,edge-length(q)/vShape.z);float r=length(vUv);float wave=exp(-pow((r-.79)*32.,2.))*.64+exp(-pow((r-.52)*38.,2.))*.28;gl_FragColor=vec4(.73,.84,.87,wave*vRing.y*wet);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`}));
    this.rings.name='puddle-wheel-ripples';this.rings.frustumCulled=false;this.rings.renderOrder=2;scene.add(this.rings);
  }
  /** The lamps shining now (world space; offline rain), lighting the spray from the next render. */
  light(lamps:readonly SprayLamp[]){this.lamps=lamps;}
  setQuality(quality:string){this.quality=quality==='medium'?.55:quality==='high'?.8:1;}
  update(cars:readonly SplashSource[],waters:Puddle[],dt:number,emit:boolean,render=true,film=0){
    this.accumulator+=Number.isFinite(dt)?Math.min(.05,Math.max(0,dt)):0;
    while(this.accumulator+1e-9>=1/60){this.step(cars,waters,1/60,emit,film);this.accumulator=Math.max(0,this.accumulator-1/60);}
    if(render)this.prepare();
  }
  private step(cars:readonly SplashSource[],waters:Puddle[],dt:number,emit:boolean,film:number){
    this.wetWheels=0;this.sprayWheels=0;
    const wet=Number.isFinite(film)?Math.max(0,Math.min(1,film)):0;
    const used=new Set<string>();
    if(emit)for(const car of cars){
      const speed=Math.hypot(car.velocity.x,car.velocity.z);if(speed<.45||car.health<=0)continue;
      for(let wheel=0;wheel<4;wheel++){
        const p=car.remoteContactPoints?car.remoteContactPoints[wheel]:car.controller?.wheelIsInContact(wheel)?car.controller.wheelContactPoint(wheel):null;if(!p)continue;
        const water=waters.find(w=>puddleDepth(w,p.x,p.y,p.z)>.02);
        if(!water){if(wet>0&&speed>=RAIN_SPRAY.from)this.sprayFrom(car,wheel,p,speed,wet,dt,used);continue;}
        const depth=puddleDepth(water,p.x,p.y,p.z),key=car.id+':'+wheel+':'+water.id;used.add(key);this.wetWheels++;this.maxSpeed=Math.max(this.maxSpeed,speed);
        let b=this.budgets.get(key);if(!b){b={spray:1,ring:1};this.budgets.set(key,b);}
        b.spray+=dt*Math.min(155,6+speed*8)*depth*this.quality;b.ring+=dt*(2+Math.min(8,speed*.4));
        const side=wheel%2?1:-1;
        while(b.spray>=1){
          const d=this.drops[this.cursor++%this.capacity],spread=.4+this.random()*.7;
          d.p.set(p.x+(this.random()-.5)*.10,water.level+.035,p.z+(this.random()-.5)*.14);d.v.copy(car.velocity).multiplyScalar(.15+this.random()*.1);
          d.v.addScaledVector(car.right,side*(.8+speed*.19)*spread);d.v.y=.6+Math.min(4.5,speed*.18)*(.4+this.random()*.8);
          d.age=0;d.life=.5+this.random()*.55;d.level=water.level;d.size=(.007+this.random()*.016)*(1+Math.min(.6,speed/30));d.alpha=1;this.emitted++;b.spray--;
        }
        while(b.ring>=1){const r=this.ripples[this.ringCursor++%48];r.p.set(p.x,water.level+.012,p.z);r.water=water;r.age=0;r.life=.6+this.random()*.5;r.radius=.3+Math.min(1.5,speed*.05);r.strength=.14+Math.min(.20,speed*.015);b.ring--;}
      }
    }
    for(const key of this.budgets.keys())if(!used.has(key))this.budgets.delete(key);
    for(const d of this.drops)if(d.life>0){d.age+=dt;d.v.y-=9.81*dt;d.v.x*=Math.exp(-dt*.65);d.v.z*=Math.exp(-dt*.65);d.p.addScaledVector(d.v,dt);if(d.age>=d.life||d.p.y<d.level)d.life=0;}
    for(const r of this.ripples)if(r.life>0){r.age+=dt;if(r.age>=r.life)r.life=0;}
  }
  private sprayFrom(car:SplashSource,wheel:number,p:{x:number;y:number;z:number},speed:number,wet:number,dt:number,used:Set<string>){
    const key=car.id+':'+wheel+':rain';used.add(key);this.sprayWheels++;
    let b=this.budgets.get(key);if(!b){b={spray:0,ring:0};this.budgets.set(key,b);}
    const r=RAIN_SPRAY,between=(range:readonly number[])=>range[0]+this.random()*(range[1]-range[0]),side=wheel%2?1:-1;
    b.spray+=dt*Math.min(r.max,r.rate*speed)*wet*this.quality;
    while(b.spray>=1){
      const d=this.drops[this.cursor++%this.capacity];
      d.p.set(p.x+(this.random()-.5)*.12,p.y+.04,p.z+(this.random()-.5)*.12);d.v.copy(car.velocity).multiplyScalar(between(r.trail));
      d.v.addScaledVector(car.right,side*(.2+this.random()*.5));d.v.y=between(r.lift)*Math.min(1,speed/12);
      d.age=0;d.life=between(r.life);d.level=p.y-.02;d.size=between(r.size)*(1+Math.min(.6,speed/30));d.alpha=r.alpha;this.sprayed++;b.spray--;
    }
  }
  private prepare(){
    let i=0;this.litDrops=0;for(const d of this.drops)if(d.life>0){d.p.toArray(this.offset,i*3);d.v.toArray(this.movement,i*3);this.data[i*2]=d.size;this.data[i*2+1]=Math.min(1,d.age*45)*Math.pow(1-d.age/d.life,.35)*d.alpha;
      if(this.lamps.length){sprayLight(this.lit,d.p.x,d.p.y,d.p.z,this.lamps);if(this.lit[0]>.02)this.litDrops++;}else this.lit[0]=this.lit[1]=this.lit[2]=0;this.glow.set(this.lit,i*3);i++;}
    this.spray.geometry.instanceCount=i;this.spray.visible=i>0;for(const a of Object.values(this.spray.geometry.attributes))if(a instanceof T.InstancedBufferAttribute)a.needsUpdate=true;
    i=0;for(const r of this.ripples)if(r.life>0&&r.water){r.p.toArray(this.ringOffset,i*3);const t=r.age/r.life;this.ringData.set([r.radius*(.18+t),r.strength*(1-t),0,0],i*4);this.shapes.set([r.water.x,r.water.z,r.water.radius,r.water.aspect],i*4);this.phases.set(r.water.phases,i*4);i++;}
    this.rings.geometry.instanceCount=i;this.rings.visible=i>0;for(const a of Object.values(this.rings.geometry.attributes))if(a instanceof T.InstancedBufferAttribute)a.needsUpdate=true;
  }
  get stats(){return{active:this.drops.filter(d=>d.life>0).length,ripples:this.ripples.filter(r=>r.life>0).length,capacity:this.capacity,emitted:this.emitted,wetWheels:this.wetWheels,maxSpeed:this.maxSpeed,sprayed:this.sprayed,sprayWheels:this.sprayWheels};}
  reset(){for(const d of this.drops)d.life=0;for(const r of this.ripples)r.life=0;this.budgets.clear();this.cursor=this.ringCursor=this.accumulator=this.emitted=this.wetWheels=this.maxSpeed=this.sprayed=this.sprayWheels=0;this.prepare();}
}
