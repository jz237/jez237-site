import {bendTetra,tetraSpine,type FinKind} from './TetraKinematics.ts';
import {MathUtils} from 'three';

/** Reuse identical section/vertex work without changing the authored mesh or normals. */
export function createTetraDeformation(rest:Float32Array,kind:FinKind,side=1){
 const groups=new Map<number,number[]>();
 const breathing=new Float32Array(rest.length);
 const unique:{x:number;y:number;z:number;indices:number[]}[]=[];
 if(kind==='body'){
  for(let i=0;i<rest.length;i+=3){const x=rest[i],y=rest[i+1],z=rest[i+2];let indices=groups.get(x);if(!indices){indices=[];groups.set(x,indices);}indices.push(i);
   const cover=MathUtils.smoothstep(x,.29,.335)*(1-MathUtils.smoothstep(x,.37,.405))*(1-MathUtils.smoothstep(Math.abs(y+.035),.04,.085));
   const lip=MathUtils.smoothstep(x,.455,.489);
   breathing[i]=z*cover*.23;breathing[i+1]=(y+.035)*lip*2.6;breathing[i+2]=z*lip*1.5;
  }
 }else if(kind!=='tail'){
  const lookup=new Map<string,typeof unique[number]>();
  for(let i=0;i<rest.length;i+=3){const x=rest[i],y=rest[i+1],z=rest[i+2],key=`${x},${y},${z}`;let entry=lookup.get(key);if(!entry){entry={x,y,z,indices:[]};lookup.set(key,entry);unique.push(entry);}entry.indices.push(i);}
 }
 return (out:Float32Array,phase:number,activity:number,pectoralPhase:number,pectoralEffort:number,gill=0,mouth=0)=>{
  if(kind==='body'){
   for(const [x,indices] of groups){
    const spine=tetraSpine(x,phase,activity),sin=Math.sin(spine.angle),cos=Math.cos(spine.angle);
    for(const i of indices){const z=rest[i+2]+breathing[i]*gill+breathing[i+2]*mouth;out[i]=x-z*sin;out[i+1]=rest[i+1]+breathing[i+1]*mouth;out[i+2]=spine.z+z*cos;}
   }
  }else if(kind==='tail'){
   const effort=Math.max(0,Math.min(1.5,activity)),root=tetraSpine(-.30,phase,effort),angle=root.angle+Math.sin(phase-3.7)*(.025+effort*.22),sin=Math.sin(angle),cos=Math.cos(angle);
   for(let i=0;i<rest.length;i+=3){const dx=rest[i]+.30,z=rest[i+2];out[i]=root.x+dx*cos-z*sin;out[i+1]=rest[i+1];out[i+2]=root.z+dx*sin+z*cos;}
  }else if(kind==='pectoral'){
   // Every vertex shares this fin's hinge pose. Evaluate its trigonometry once,
   // retaining the original operation order and exact Float32 vertex results.
   const beat=pectoralPhase+side*.7,strength=.35+pectoralEffort*.65;
   const sweep=Math.sin(beat)*.65*strength,fan=(.45+Math.sin(beat-.5)*.40)*side*strength;
   const cs=Math.cos(sweep),ss=Math.sin(sweep),cf=Math.cos(fan),sf=Math.sin(fan);
   for(const vertex of unique){
    const dx=vertex.x-.25,dy=vertex.y+.055,dz=vertex.z-side*.049;
    const sx=dx*cs-dy*ss,sy=dx*ss+dy*cs;
    const x=.25+sx,y=-.055+sy*cf-dz*sf,z=side*.049+sy*sf+dz*cf;
    const spine=tetraSpine(x,phase,activity),px=x-z*Math.sin(spine.angle),pz=spine.z+z*Math.cos(spine.angle);
    for(const i of vertex.indices){out[i]=px;out[i+1]=y;out[i+2]=pz;}
   }
  }else{
   for(const vertex of unique){const p=bendTetra(vertex.x,vertex.y,vertex.z,phase,activity,kind,side,pectoralPhase,pectoralEffort);for(const i of vertex.indices){out[i]=p[0];out[i+1]=p[1];out[i+2]=p[2];}}
  }
 };
}
