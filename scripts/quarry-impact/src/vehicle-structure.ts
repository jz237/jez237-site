import type R from '@dimforge/rapier3d-compat';
type Vec={x:number;y:number;z:number};
type Quat=Vec&{w:number};
type Part={collider:R.Collider;shape:R.Shape;p:Vec;q:Quat;points:Vec[];radius?:number};
const rotate=(v:Vec,q:Quat):Vec=>{
 const tx=2*(q.y*v.z-q.z*v.y),ty=2*(q.z*v.x-q.x*v.z),tz=2*(q.x*v.y-q.y*v.x);
 return{x:v.x+q.w*tx+q.y*tz-q.z*ty,y:v.y+q.w*ty+q.z*tx-q.x*tz,z:v.z+q.w*tz+q.x*ty-q.y*tx};
};
const identity={x:0,y:0,z:0,w:1},zero={x:0,y:0,z:0};
/** Bounded compound contact envelopes, rebuilt from intact shapes only on damage.
 * Each original piece stays separate: cargo beds and cage openings remain open.
 * Explicit chassis mass properties and all collider handles/materials are retained. */
export class VehicleStructure{
 private parts:Part[]=[];
 private minimum={x:0,y:0,z:0};
 private maximum={x:0,y:0,z:0};
 private applied:number[]|undefined=[0,0,0,0,0];
 private legacyHealth=100;
 private mass:number;
 private center:Vec;
 private inertia:Vec;
 private inertiaFrame:Quat;
 constructor(private api:typeof R,private body:R.RigidBody,private main:R.Collider,private legacyExtents:(health:number)=>Vec){
  body.recomputeMassPropertiesFromColliders();
  this.mass=body.mass();this.center={...body.localCom()};this.inertia={...body.principalInertia()};this.inertiaFrame={...body.principalInertiaLocalFrame()};
  for(let i=0;i<body.numColliders();i++){
   const collider=body.collider(i),p={...collider.translationWrtParent()!},q={...collider.rotationWrtParent()!},shape=collider.shape;
   let local:Vec[],radius:number|undefined,copy:R.Shape;
   if(shape.type===api.ShapeType.Cuboid){
    const h=(shape as R.Cuboid).halfExtents;copy=new api.Cuboid(h.x,h.y,h.z);
    local=[];for(const x of [-h.x,h.x])for(const y of [-h.y,h.y])for(const z of [-h.z,h.z])local.push({x,y,z});
   }else if(shape.type===api.ShapeType.ConvexPolyhedron){
    const vertices=(shape as R.ConvexPolyhedron).vertices;copy=new api.ConvexPolyhedron(vertices.slice());
    local=[];for(let n=0;n<vertices.length;n+=3)local.push({x:vertices[n],y:vertices[n+1],z:vertices[n+2]});
   }else if(shape.type===api.ShapeType.Capsule){
    const capsule=shape as R.Capsule;radius=capsule.radius;copy=new api.Capsule(capsule.halfHeight,radius);
    local=[{x:0,y:-capsule.halfHeight,z:0},{x:0,y:capsule.halfHeight,z:0}];
   }else throw new Error('Unsupported vehicle structure shape: '+shape.type);
   const points=local.map(v=>{const t=rotate(v,q);return{x:t.x+p.x,y:t.y+p.y,z:t.z+p.z};});
   for(const v of points)for(const axis of ['x','y','z']as const){this.minimum[axis]=Math.min(this.minimum[axis],v[axis]-(radius??0));this.maximum[axis]=Math.max(this.maximum[axis],v[axis]+(radius??0));}
   this.parts.push({collider,shape:copy,p,q,points,radius});
  }
 }
 update(state:number[]|undefined,health=100){
  if(state===undefined&&this.applied===undefined&&this.legacyHealth===health)return;
  if(state!==undefined&&this.applied!==undefined&&state.every((v,i)=>v===this.applied![i]))return;
  if(state===undefined||state.every(v=>v===0)){
   for(const part of this.parts){part.collider.setShape(part.shape);part.collider.setTranslationWrtParent(part.p);part.collider.setRotationWrtParent(part.q);}
   if(state===undefined){const h=this.legacyExtents(health);this.main.setShape(new this.api.Cuboid(h.x,h.y,h.z));}
  }else{
   // Keep a protected central cell and floor. Mapping is monotone, so convex
   // envelopes remain nondegenerate even at maximum crush in every direction.
   const axis=(v:number,lo:number,hi:number,negative:number,positive:number,limit:number)=>{
    const span=v<0?-lo:hi,depth=Math.min(limit,span*.28)*(v<0?negative:positive);
    return v-Math.sign(v)*depth*Math.min(1,Math.max(0,(Math.abs(v)/span-.25)/.75));
   };
   const warp=(p:Vec):Vec=>({x:axis(p.x,this.minimum.x,this.maximum.x,state[2],state[3],.22),y:p.y<=0?p.y:axis(p.y,0,this.maximum.y,0,state[4],.24),z:axis(p.z,this.minimum.z,this.maximum.z,state[1],state[0],.48)});
   for(const part of this.parts){
    const points=part.points.map(warp),c=part.collider;
    if(part.radius!==undefined){
     const [a,b]=points,dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,length=Math.hypot(dx,dy,dz),scale=Math.sqrt(2*(1+dy/length));
     const q=scale<1e-8?{x:1,y:0,z:0,w:0}:{x:dz/length/scale,y:0,z:-dx/length/scale,w:scale/2};
     c.setShape(new this.api.Capsule(length/2,part.radius));c.setTranslationWrtParent({x:(a.x+b.x)/2,y:(a.y+b.y)/2,z:(a.z+b.z)/2});c.setRotationWrtParent(q);
    }else if(part.shape.type===this.api.ShapeType.Cuboid&&Math.abs(part.q.w)===1){
     const a=points[0],b=points[7];c.setShape(new this.api.Cuboid((b.x-a.x)/2,(b.y-a.y)/2,(b.z-a.z)/2));
     c.setTranslationWrtParent({x:(a.x+b.x)/2,y:(a.y+b.y)/2,z:(a.z+b.z)/2});c.setRotationWrtParent(identity);
    }else{
     c.setShape(new this.api.ConvexPolyhedron(Float32Array.from(points.flatMap(v=>[v.x,v.y,v.z]))));c.setTranslationWrtParent(zero);c.setRotationWrtParent(identity);
    }
   }
  }
  // Shifting the contact envelope must not shift the mass datum or introduce
  // spurious roll/steering forces. The main collider is aligned with the body.
  const p=this.main.translationWrtParent()!;
  this.main.setMassProperties(this.mass,{x:this.center.x-p.x,y:this.center.y-p.y,z:this.center.z-p.z},this.inertia,this.inertiaFrame);
  this.body.recomputeMassPropertiesFromColliders();
  this.applied=state?.slice();this.legacyHealth=health;
 }
}
