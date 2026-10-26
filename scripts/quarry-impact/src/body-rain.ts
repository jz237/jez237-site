import * as T from 'three';

/** Rain on the bodywork (offline rain): raindrops splash on the cars' roofs, bonnets and boot lids — BODY_RAIN.count little
 * rings at a time over the cars within BODY_RAIN.reach m of the camera, each opening out to BODY_RAIN.radius m and fading
 * over BODY_RAIN.life s before landing again, riding along on its car. Only the near-flat tops take them (found once per
 * car by casting down on a BODY_RAIN.grid of points over its bodywork, keeping the spots no steeper than BODY_RAIN.flat);
 * fewer land the lighter the shower. */
export const BODY_RAIN={count:140,reach:16,radius:.085,life:[.22,.42],alpha:.5,grid:[6,11],flat:.4,lift:.012} as const;
export type TopSpot={x:number;y:number;z:number};
/** The near-flat tops of a car's bodywork, in its root frame: a grid of rays cast down over its box (half extents about
 * a centre) onto its panels and glass, keeping the points whose neighbours along the car and across it are no steeper than
 * BODY_RAIN.flat (a windscreen, a pillar, a wing's flank are left out). */
export function topSpots(root:T.Object3D,surfaces:readonly T.Mesh[],centre:T.Vector3,half:T.Vector3):TopSpot[]{
  root.updateMatrixWorld(true);const [nx,nz]=BODY_RAIN.grid,ray=new T.Raycaster(),inverse=root.matrixWorld.clone().invert(),down=new T.Vector3(0,-1,0).transformDirection(root.matrixWorld);
  const height=(x:number,z:number)=>{ray.set(new T.Vector3(x,centre.y+half.y+1,z).applyMatrix4(root.matrixWorld),down);ray.far=half.y*2+1.5;const hits:T.Intersection[]=[];
    for(const m of surfaces)m.raycast(ray,hits);let best=-Infinity;for(const h of hits){const y=h.point.clone().applyMatrix4(inverse).y;if(y>best)best=y;}return best;};
  const xs=Array.from({length:nx},(_,i)=>centre.x-half.x*.9+half.x*1.8*i/(nx-1)),zs=Array.from({length:nz},(_,j)=>centre.z-half.z*.92+half.z*1.84*j/(nz-1));
  const h=xs.map(x=>zs.map(z=>height(x,z))),dx=xs[1]-xs[0],dz=zs[1]-zs[0],spots:TopSpot[]=[];
  for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const y=h[i][j];if(!Number.isFinite(y))continue;
    const slope=(a:number,d:number)=>Number.isFinite(a)?Math.abs(a-y)/d:0;
    const steep=Math.max(slope(h[i-1]?.[j],dx),slope(h[i+1]?.[j],dx),slope(h[i][j-1],dz),slope(h[i][j+1],dz));
    if(steep<=BODY_RAIN.flat)spots.push({x:xs[i],y,z:zs[j]});}
  return spots;
}
export type RainCar={id:number;root:T.Object3D;spots:readonly TopSpot[];spread:{x:number;z:number}};
type Drop={car:RainCar|null;at:T.Vector3;age:number;life:number};
export class BodyRain{
  readonly mesh:T.Mesh;
  landed=0;
  private drops:Drop[];private offset:T.InstancedBufferAttribute;private phase:T.InstancedBufferAttribute;private world=new T.Vector3();
  constructor(parent:T.Object3D,private random=Math.random){
    const geometry=new T.InstancedBufferGeometry(),ring=new T.RingGeometry(.7,1,16,1).rotateX(-Math.PI/2);
    geometry.index=ring.index;geometry.setAttribute('position',ring.getAttribute('position'));
    this.offset=new T.InstancedBufferAttribute(new Float32Array(BODY_RAIN.count*3),3).setUsage(T.DynamicDrawUsage);this.phase=new T.InstancedBufferAttribute(new Float32Array(BODY_RAIN.count),1).setUsage(T.DynamicDrawUsage);
    geometry.setAttribute('offset',this.offset);geometry.setAttribute('phase',this.phase);geometry.instanceCount=BODY_RAIN.count;
    const material=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{radius:{value:BODY_RAIN.radius},alpha:{value:BODY_RAIN.alpha}},
      vertexShader:`attribute vec3 offset;attribute float phase;uniform float radius;varying float vT;void main(){vT=phase;vec3 p=offset+position*radius*(.15+.85*phase);gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
      fragmentShader:`uniform float alpha;varying float vT;void main(){float a=alpha*(1.-vT)*smoothstep(0.,.12,vT)*step(.001,vT);gl_FragColor=vec4(vec3(.86,.9,.94)*a,a);}`});
    this.mesh=new T.Mesh(geometry,material);this.mesh.name='body_rain';this.mesh.frustumCulled=false;this.mesh.visible=false;this.mesh.renderOrder=2;parent.add(this.mesh);
    this.drops=Array.from({length:BODY_RAIN.count},()=>({car:null,at:new T.Vector3(),age:0,life:0}));
  }
  /** Moves the splashes on. `cars` are the ones within reach of the camera (an empty list, or no rain, puts them away);
   * `shower` (0–1) is how hard it rains: that share of the drops land. */
  update(cars:readonly RainCar[],shower:number,dt:number){
    const wet=cars.some(c=>c.spots.length>0);this.mesh.visible=wet;if(!wet||!(dt>0))return;
    const share=Number.isFinite(shower)?Math.max(0,Math.min(1,shower)):1,total=cars.reduce((s,c)=>s+c.spots.length,0);
    this.drops.forEach((d,i)=>{
      d.age+=dt;
      // A drop that missed (a lighter shower) waits out its life before falling again.
      if(d.life<=0||d.age>=d.life||(d.car&&!cars.includes(d.car))){
        // Lands again on a car within reach, the roomier tops taking more; a lighter shower leaves some drops dry.
        let pick=this.random()*total,car:RainCar|null=null;for(const c of cars){if(pick<c.spots.length){car=c;break;}pick-=c.spots.length;}
        d.life=BODY_RAIN.life[0]+this.random()*(BODY_RAIN.life[1]-BODY_RAIN.life[0]);d.age=d.life<=0?0:(d.car?0:this.random()*d.life);
        if(!car||this.random()>share){d.car=null;this.phase.setX(i,0);this.offset.setXYZ(i,0,-1e4,0);return;}
        const s=car.spots[Math.floor(this.random()*car.spots.length)];d.car=car;d.at.set(s.x+(this.random()-.5)*car.spread.x,s.y+BODY_RAIN.lift,s.z+(this.random()-.5)*car.spread.z);this.landed++;
      }
      if(!d.car)return;this.world.copy(d.at).applyMatrix4(d.car.root.matrixWorld);this.offset.setXYZ(i,this.world.x,this.world.y,this.world.z);this.phase.setX(i,Math.min(.999,d.age/d.life));
    });
    this.offset.needsUpdate=true;this.phase.needsUpdate=true;
  }
  /** Splashes on the cars now (QA). */
  get splashing(){return this.drops.filter(d=>d.car).length;}
  reset(){for(const d of this.drops){d.car=null;d.life=0;}this.mesh.visible=false;}
}
