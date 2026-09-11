import {bendTetra,tetraSpine,type FinKind} from './TetraKinematics.ts';

/** Reuse identical section/vertex work without changing the authored mesh or normals. */
export function createTetraDeformation(rest:Float32Array,kind:FinKind,side=1){
 const groups=new Map<number,number[]>();
 const unique:{x:number;y:number;z:number;indices:number[]}[]=[];
 if(kind==='body'){
  for(let i=0;i<rest.length;i+=3){const x=rest[i];let indices=groups.get(x);if(!indices){indices=[];groups.set(x,indices);}indices.push(i);}
 }else if(kind!=='tail'){
  const lookup=new Map<string,typeof unique[number]>();
  for(let i=0;i<rest.length;i+=3){const x=rest[i],y=rest[i+1],z=rest[i+2],key=`${x},${y},${z}`;let entry=lookup.get(key);if(!entry){entry={x,y,z,indices:[]};lookup.set(key,entry);unique.push(entry);}entry.indices.push(i);}
 }
 return (out:Float32Array,phase:number,activity:number,pectoralPhase:number,pectoralEffort:number)=>{
  if(kind==='body'){
   for(const [x,indices] of groups){
    const spine=tetraSpine(x,phase,activity),sin=Math.sin(spine.angle),cos=Math.cos(spine.angle);
    for(const i of indices){out[i]=x-rest[i+2]*sin;out[i+1]=rest[i+1];out[i+2]=spine.z+rest[i+2]*cos;}
   }
  }else if(kind==='tail'){
   const effort=Math.max(0,Math.min(1.5,activity)),root=tetraSpine(-.30,phase,effort),angle=root.angle+Math.sin(phase-3.7)*(.025+effort*.22),sin=Math.sin(angle),cos=Math.cos(angle);
   for(let i=0;i<rest.length;i+=3){const dx=rest[i]+.30,z=rest[i+2];out[i]=root.x+dx*cos-z*sin;out[i+1]=rest[i+1];out[i+2]=root.z+dx*sin+z*cos;}
  }else{
   for(const vertex of unique){const p=bendTetra(vertex.x,vertex.y,vertex.z,phase,activity,kind,side,pectoralPhase,pectoralEffort);for(const i of vertex.indices){out[i]=p[0];out[i+1]=p[1];out[i+2]=p[2];}}
  }
 };
}
