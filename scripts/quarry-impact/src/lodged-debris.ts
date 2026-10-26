import * as T from 'three';

/** Lodged debris (offline): a hard nose-first hit into another car leaves a chunk of it stuck in the striker's front end — when
 * the blow is LODGE.damage or more and the contact lies past LODGE.front of the striker's half length (its nose), LODGE.chance
 * of the time (fixed per crash) — a crumpled piece LODGE.size m across in the other car's paint, at most LODGE.max on a car. A
 * later blow of LODGE.loosen or more knocks one loose LODGE.shake of the time, and it falls away as debris. */
export const LODGE={damage:10,front:.6,chance:.5,max:3,size:[.12,.26],loosen:18,shake:.4} as const;
const hash=(n:number)=>Math.abs(Math.sin(n*12.9898+4.1414)*43758.5453)%1;
/** Does this blow lodge a piece: its damage, how far along the striker its contact lies (share of half length), the crash's seed? */
export const lodges=(damage:number,along:number,seed:number)=>damage>=LODGE.damage&&along>=LODGE.front&&hash(seed)<LODGE.chance;
/** Does this blow knock a lodged piece loose? */
export const shakesLoose=(damage:number,seed:number)=>damage>=LODGE.loosen&&hash(seed*1.37+.5)<LODGE.shake;
/** A crumpled chunk of bodywork in this paint, its own shape from the seed. */
export function debrisChunk(colour:T.Color,seed:number){
  const size=LODGE.size[0]+(LODGE.size[1]-LODGE.size[0])*hash(seed),g=new T.BoxGeometry(size,size*.45,size*.7,3,2,3),p=g.attributes.position;
  // Torn and crumpled: every corner pushed about, more the further out.
  for(let i=0;i<p.count;i++){const k=hash(seed*31+i),j=hash(seed*17+i*3.1)-.5;p.setXYZ(i,p.getX(i)*(.7+.6*k),p.getY(i)*(.6+.8*hash(seed*7+i)),p.getZ(i)*(.75+.5*j));}
  g.computeVertexNormals();
  const mesh=new T.Mesh(g,new T.MeshStandardMaterial({name:'Lodged debris',color:colour.clone(),roughness:.5,metalness:.25}));
  mesh.name='lodged_debris';mesh.rotation.set((hash(seed*3)-.5)*1.4,hash(seed*5)*Math.PI*2,(hash(seed*9)-.5)*1.4);mesh.castShadow=true;mesh.receiveShadow=true;
  return mesh;
}
/** Sticks a chunk of `colour` into `root` at this world point (half sunk into the bodywork there). */
export function lodgeChunk(root:T.Object3D,point:T.Vector3,colour:T.Color,seed:number){
  root.updateMatrixWorld(true);const chunk=debrisChunk(colour,seed);chunk.position.copy(root.worldToLocal(point.clone()));root.add(chunk);return chunk;
}
