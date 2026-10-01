import * as T from 'three';

type Surface={points:T.Vector3[];uv:T.Vector2[]};
const key=(p:T.Vector3)=>p.toArray().map(n=>Math.round(n*1e5)).join(',');

/** Close an authored outer surface with an inset inner skin and folded edges.
 * Work in model space, so parts split into different OBJ material batches share
 * the same edge map. Split T-junctions before finding the exposed perimeter. */
export function panelBacking(meshes:T.Mesh[],inset:T.Vector3):T.BufferGeometry{
  const faces:Surface[]=[],vertices=new Map<string,T.Vector3>();
  for(const mesh of meshes){
    const g=mesh.geometry,p=g.getAttribute('position'),uv=g.getAttribute('uv');
    const count=g.index?.count??p.count;
    for(let i=0;i<count;i+=3){const points:T.Vector3[]=[],coords:T.Vector2[]=[];
      for(let j=0;j<3;j++){const index=g.index?.getX(i+j)??i+j,point=new T.Vector3().fromBufferAttribute(p,index).applyMatrix4(mesh.matrixWorld);points.push(point);coords.push(uv?new T.Vector2(uv.getX(index),uv.getY(index)):new T.Vector2());vertices.set(key(point),point);}
      faces.push({points,uv:coords});
    }
  }
  const positions:number[]=[],texcoords:number[]=[],edges=new Map<string,{a:T.Vector3;b:T.Vector3;count:number}>();
  const triangle=(a:T.Vector3,b:T.Vector3,c:T.Vector3,uv=[new T.Vector2(),new T.Vector2(1,0),new T.Vector2(1,1)])=>{
    if(b.clone().sub(a).cross(c.clone().sub(a)).lengthSq()<1e-18)return;
    positions.push(...a.toArray(),...b.toArray(),...c.toArray());texcoords.push(...uv.flatMap(v=>v.toArray()));
  };
  const all=[...vertices.values()];
  for(const face of faces){
    const [a,b,c]=face.points;triangle(c.clone().add(inset),b.clone().add(inset),a.clone().add(inset),[...face.uv].reverse());
    for(let i=0;i<3;i++){
      const a=face.points[i],b=face.points[(i+1)%3],axis=b.clone().sub(a),lengthSq=axis.lengthSq();if(lengthSq<1e-14)continue;
      const cuts=[{t:0,p:a},{t:1,p:b}];
      for(const p of all){const delta=p.clone().sub(a),t=delta.dot(axis)/lengthSq;
        if(t>1e-5&&t<1-1e-5&&delta.addScaledVector(axis,-t).lengthSq()<1e-12)cuts.push({t,p});
      }
      cuts.sort((a,b)=>a.t-b.t);
      for(let j=0;j<cuts.length-1;j++){
        const a=cuts[j].p,b=cuts[j+1].p,ka=key(a),kb=key(b);if(ka===kb)continue;
        const k=[ka,kb].sort().join('|'),edge=edges.get(k);if(edge)edge.count++;else edges.set(k,{a,b,count:1});
      }
    }
  }
  for(const {a,b,count}of edges.values())if(count===1){
    const ai=a.clone().add(inset),bi=b.clone().add(inset);
    triangle(b,a,ai);triangle(b,ai,bi);
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(texcoords,2));geometry.computeVertexNormals();return geometry;
}

/** Inner skins remain members of the same hood/door damage assembly. Their
 * names deliberately exclude mirrors and fixed front valances. */
export function addClassicPanelBackings(root:T.Group){
  root.updateMatrixWorld(true);
  const groups=new Map<string,T.Mesh[]>();
  root.traverse(o=>{
    if(!(o instanceof T.Mesh)||Array.isArray(o.material)||!o.material.name.startsWith('paint'))return;
    const match=/^panel_(hood|BodyDoor(?:Rear)?[LR])(?:_|Shoulder)/.exec(o.name);if(!match)return;
    const list=groups.get(match[1])??[];list.push(o);groups.set(match[1],list);
  });
  const metal=new T.MeshStandardMaterial({name:'Classic Inner Shell Steel',color:0x414943,roughness:.68,metalness:.45});
  for(const [name,meshes]of groups){
    const inset=name==='hood'?new T.Vector3(0,-.02,0):new T.Vector3(name.endsWith('L')?.025:-.025,0,0);
    const shell=new T.Mesh(panelBacking(meshes,inset),metal);shell.name='panel_'+name+'InnerShell';shell.castShadow=shell.receiveShadow=true;root.add(shell);
    if(name==='hood')addHoodRibs(root,meshes,metal);
  }
}

function addHoodRibs(root:T.Group,outer:T.Mesh[],material:T.Material){
  const points:number[]=[],uv:number[]=[],ray=new T.Raycaster(),down=new T.Vector3(0,-1,0);
  // Pressed channels follow the actual donor hood instead of flat boxes that
  // can poke through its raised centre. Leave space for the edge folds.
  const paths:[T.Vector2,T.Vector2][]=[
    [new T.Vector2(-.47,.87),new T.Vector2(-.47,2.15)],
    [new T.Vector2(.47,.87),new T.Vector2(.47,2.15)],
    ...[.90,1.51,2.12].map(z=>[new T.Vector2(-.48,z),new T.Vector2(.48,z)] as [T.Vector2,T.Vector2]),
  ];
  const profile=[[-.055,0],[-.033,0],[-.025,-.014],[.025,-.014],[.033,0],[.055,0]];
  for(const [a,b]of paths){
    const direction=b.clone().sub(a).normalize(),across=new T.Vector2(-direction.y,direction.x),rows:(T.Vector3[]|null)[]=[];
    const steps=8;
    for(let i=0;i<=steps;i++){
      const centre=a.clone().lerp(b,i/steps),row:T.Vector3[]=[];
      for(const [offset,depth]of profile){
        const p=centre.clone().addScaledVector(across,offset);ray.set(new T.Vector3(p.x,2,p.y),down);
        const hit=ray.intersectObjects(outer,false)[0];if(!hit){row.length=0;break;}
        row.push(new T.Vector3(p.x,hit.point.y-.024+depth,p.y));
      }rows.push(row.length?row:null);
    }
    for(let i=0;i<steps;i++){const a=rows[i],b=rows[i+1];if(!a||!b)continue;
      for(let j=0;j<profile.length-1;j++)for(const triangle of [[a[j],b[j],b[j+1]],[a[j],b[j+1],a[j+1]]]){
        points.push(...triangle.flatMap(p=>p.toArray()));uv.push(0,0,1,0,1,1);
      }
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
  const mat=material.clone();mat.name='Classic Hood Pressings';mat.side=T.DoubleSide;
  const mesh=new T.Mesh(g,mat);mesh.name='panel_hoodInnerRibs';mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
}
