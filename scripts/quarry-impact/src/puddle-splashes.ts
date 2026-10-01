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
type Drop={p:T.Vector3;v:T.Vector3;age:number;life:number;size:number;level:number};
type Ripple={p:T.Vector3;water:Puddle|null;age:number;life:number;radius:number;strength:number};
export class PuddleSplashes {
  readonly capacity=768;
  readonly drops:Drop[]=Array.from({length:this.capacity},()=>({p:new T.Vector3(),v:new T.Vector3(),age:0,life:0,size:0,level:0}));
  readonly ripples:Ripple[]=Array.from({length:48},()=>({p:new T.Vector3(),water:null,age:0,life:0,radius:0,strength:0}));
  readonly spray:T.Mesh<T.InstancedBufferGeometry,T.ShaderMaterial>;
  readonly rings:T.Mesh<T.InstancedBufferGeometry,T.ShaderMaterial>;
  private offset=new Float32Array(this.capacity*3);
  private movement=new Float32Array(this.capacity*3);
  private data=new Float32Array(this.capacity*2);
  private ringOffset=new Float32Array(48*3);
  private ringData=new Float32Array(48*4);
  private shapes=new Float32Array(48*4);
  private phases=new Float32Array(48*4);
  private budgets=new Map<string,{spray:number;ring:number}>();
  private cursor=0;private ringCursor=0;private accumulator=0;private quality=1;
  emitted=0;wetWheels=0;maxSpeed=0;
  constructor(scene:T.Scene,private random=()=>Math.random()){
    const geometry=(attributes:Record<string,[Float32Array,number]>)=>{const p=new T.PlaneGeometry(2,2),g=new T.InstancedBufferGeometry();g.index=p.index;g.attributes.position=p.attributes.position;g.attributes.uv=p.attributes.uv;for(const [name,[data,size]]of Object.entries(attributes))g.setAttribute(name,new T.InstancedBufferAttribute(data,size).setUsage(T.DynamicDrawUsage));g.instanceCount=0;return g;};
    this.spray=new T.Mesh(geometry({offset:[this.offset,3],movement:[this.movement,3],drop:[this.data,2]}),new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{},
      vertexShader:`attribute vec3 offset;attribute vec3 movement;attribute vec2 drop;varying vec2 vUv;varying float vFade;
      void main(){vUv=uv*2.-1.;vFade=drop.y;vec4 mv=modelViewMatrix*vec4(offset,1.);vec2 velocity=(viewMatrix*vec4(movement,0.)).xy;float speed=length(velocity);vec2 up=speed>.01?velocity/speed:vec2(0.,1.);vec2 across=vec2(up.y,-up.x);mv.xy+=(across*position.x*.55+up*position.y*(1.+min(5.,speed*.25)))*drop.x;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`varying vec2 vUv;varying float vFade;void main(){float d=dot(vUv,vUv);if(d>1.)discard;float rim=pow(max(0.,1.-d),1.5);vec3 color=mix(vec3(.40,.53,.59),vec3(.92,1.,1.02),rim);gl_FragColor=vec4(color,rim*vFade*.60);
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
  setQuality(quality:string){this.quality=quality==='medium'?.55:quality==='high'?.8:1;}
  update(cars:Vehicle[],waters:Puddle[],dt:number,emit:boolean){
    this.accumulator+=Number.isFinite(dt)?Math.min(.05,Math.max(0,dt)):0;
    while(this.accumulator+1e-9>=1/60){this.step(cars,waters,1/60,emit);this.accumulator=Math.max(0,this.accumulator-1/60);}
    this.prepare();
  }
  private step(cars:Vehicle[],waters:Puddle[],dt:number,emit:boolean){
    this.wetWheels=0;
    const used=new Set<string>();
    if(emit)for(const car of cars){
      const speed=Math.hypot(car.velocity.x,car.velocity.z);if(speed<.45||car.health<=0)continue;
      for(let wheel=0;wheel<4;wheel++){
        const p=car.controller.wheelContactPoint(wheel);if(!p||!car.controller.wheelIsInContact(wheel))continue;
        const water=waters.find(w=>puddleDepth(w,p.x,p.y,p.z)>.02);if(!water)continue;
        const depth=puddleDepth(water,p.x,p.y,p.z),key=car.id+':'+wheel+':'+water.id;used.add(key);this.wetWheels++;this.maxSpeed=Math.max(this.maxSpeed,speed);
        let b=this.budgets.get(key);if(!b){b={spray:1,ring:1};this.budgets.set(key,b);}
        b.spray+=dt*Math.min(155,6+speed*8)*depth*this.quality;b.ring+=dt*(2+Math.min(8,speed*.4));
        const side=wheel%2?1:-1;
        while(b.spray>=1){
          const d=this.drops[this.cursor++%this.capacity],spread=.4+this.random()*.7;
          d.p.set(p.x+(this.random()-.5)*.10,water.level+.035,p.z+(this.random()-.5)*.14);d.v.copy(car.velocity).multiplyScalar(.15+this.random()*.1);
          d.v.addScaledVector(car.right,side*(.8+speed*.19)*spread);d.v.y=.6+Math.min(4.5,speed*.18)*(.4+this.random()*.8);
          d.age=0;d.life=.5+this.random()*.55;d.level=water.level;d.size=(.007+this.random()*.016)*(1+Math.min(.6,speed/30));this.emitted++;b.spray--;
        }
        while(b.ring>=1){const r=this.ripples[this.ringCursor++%48];r.p.set(p.x,water.level+.012,p.z);r.water=water;r.age=0;r.life=.6+this.random()*.5;r.radius=.3+Math.min(1.5,speed*.05);r.strength=.14+Math.min(.20,speed*.015);b.ring--;}
      }
    }
    for(const key of this.budgets.keys())if(!used.has(key))this.budgets.delete(key);
    for(const d of this.drops)if(d.life>0){d.age+=dt;d.v.y-=9.81*dt;d.v.x*=Math.exp(-dt*.65);d.v.z*=Math.exp(-dt*.65);d.p.addScaledVector(d.v,dt);if(d.age>=d.life||d.p.y<d.level)d.life=0;}
    for(const r of this.ripples)if(r.life>0){r.age+=dt;if(r.age>=r.life)r.life=0;}
  }
  private prepare(){
    let i=0;for(const d of this.drops)if(d.life>0){d.p.toArray(this.offset,i*3);d.v.toArray(this.movement,i*3);this.data[i*2]=d.size;this.data[i*2+1]=Math.min(1,d.age*45)*Math.pow(1-d.age/d.life,.35);i++;}
    this.spray.geometry.instanceCount=i;this.spray.visible=i>0;for(const a of Object.values(this.spray.geometry.attributes))if(a instanceof T.InstancedBufferAttribute)a.needsUpdate=true;
    i=0;for(const r of this.ripples)if(r.life>0&&r.water){r.p.toArray(this.ringOffset,i*3);const t=r.age/r.life;this.ringData.set([r.radius*(.18+t),r.strength*(1-t),0,0],i*4);this.shapes.set([r.water.x,r.water.z,r.water.radius,r.water.aspect],i*4);this.phases.set(r.water.phases,i*4);i++;}
    this.rings.geometry.instanceCount=i;this.rings.visible=i>0;for(const a of Object.values(this.rings.geometry.attributes))if(a instanceof T.InstancedBufferAttribute)a.needsUpdate=true;
  }
  get stats(){return{active:this.drops.filter(d=>d.life>0).length,ripples:this.ripples.filter(r=>r.life>0).length,capacity:this.capacity,emitted:this.emitted,wetWheels:this.wetWheels,maxSpeed:this.maxSpeed};}
  reset(){for(const d of this.drops)d.life=0;for(const r of this.ripples)r.life=0;this.budgets.clear();this.cursor=this.ringCursor=this.accumulator=this.emitted=this.wetWheels=this.maxSpeed=0;this.prepare();}
}
