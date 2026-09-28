import * as T from 'three';

export type ProbeSample={gap:number;source:[number,number,number];target:[number,number,number];normal:[number,number,number];mesh:string;triangle:number};
export type ProbeReport={attempted:number;occluded:number;grazing:number;missing:number;samples:ProbeSample[]};

function faceNormal(hit:T.Intersection<T.Object3D>):T.Vector3 {
  return hit.face!.normal.clone().transformDirection(hit.object.matrixWorld);
}

/** Compare exposed geometry along its geometric normal, never a smoothed normal.
 * Both intersections must face the probe with cos(angle)>=.5. Rejecting tangent
 * and hidden faces prevents a neighboring bench from masquerading as contact drift.
 */
export function surfaceProbes(source:T.Mesh[],target:T.Mesh[],budget=900,occluders:T.Mesh[]=[]):ProbeReport {
  const report:ProbeReport={attempted:0,occluded:0,grazing:0,missing:0,samples:[]};
  const triangleCount=source.reduce((sum,m)=>sum+(m.geometry.index?.count??m.geometry.attributes.position.count)/3,0);
  const step=Math.max(1,Math.floor(triangleCount/budget));
  const ray=new T.Raycaster(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
  let serial=0;
  for(const mesh of source){
    const positions=mesh.geometry.attributes.position,indices=mesh.geometry.index;
    const count=(indices?.count??positions.count)/3;
    for(let triangle=0;triangle<count;triangle++,serial++){
      if(serial%step!==0)continue;
      const at=(corner:number)=>indices?indices.getX(triangle*3+corner):triangle*3+corner;
      a.fromBufferAttribute(positions,at(0)).applyMatrix4(mesh.matrixWorld);
      b.fromBufferAttribute(positions,at(1)).applyMatrix4(mesh.matrixWorld);
      c.fromBufferAttribute(positions,at(2)).applyMatrix4(mesh.matrixWorld);
      const normal=b.clone().sub(a).cross(c.clone().sub(a));
      if(normal.lengthSq()<1e-10)continue;
      normal.normalize();
      const point=a.clone().add(b).add(c).multiplyScalar(1/3);
      ray.set(point.clone().addScaledVector(normal,1),normal.clone().negate());ray.near=0;ray.far=2;
      report.attempted++;
      // The runtime cut is front-sided. An underside ray may cross the back of
      // a lower bench first; that invisible exit is not a contact surface.
      const front=(objects:T.Mesh[])=>ray.intersectObjects(objects,false).find(hit=>faceNormal(hit).dot(ray.ray.direction)<-1e-5);
      const own=front([...source,...occluders]);
      if(!own||!source.includes(own.object as T.Mesh)||Math.abs(own.distance-1)>.002){report.occluded++;continue;}
      if(Math.abs(faceNormal(own).dot(ray.ray.direction))<.5){report.grazing++;continue;}
      const other=front(target);
      if(!other){report.missing++;continue;}
      if(Math.abs(faceNormal(other).dot(ray.ray.direction))<.5){report.grazing++;continue;}
      report.samples.push({gap:Math.abs(other.distance-own.distance),source:point.toArray(),target:other.point.toArray(),normal:normal.toArray(),mesh:mesh.name,triangle});
    }
  }
  return report;
}

export function probeSummary(report:ProbeReport,filter=(s:ProbeSample)=>true){
  const samples=report.samples.filter(filter).sort((a,b)=>a.gap-b.gap);
  return {attempted:report.attempted,occluded:report.occluded,grazing:report.grazing,missing:report.missing,count:samples.length,
    median:samples[Math.floor(samples.length*.5)]?.gap??0,p95:samples[Math.floor(samples.length*.95)]?.gap??0,
    max:samples.at(-1)?.gap??0,worst:samples.slice(-5).reverse()};
}

export function collisionMesh(positions:number[],indices:number[],name:string):T.Mesh {
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);
  const mesh=new T.Mesh(geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));mesh.name=name;mesh.updateMatrixWorld(true);return mesh;
}
