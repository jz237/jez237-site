/** The replacement keeps the accepted 52 distant roots and heights. Separate
 * deterministic variation does not consume the quarry's placement RNG.
 * Run after npm ci; no private outputs, download, Blender or GPU is needed.
 */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {seededRandom} from '../src/quarry-layout';
import {backdropGroundHeight} from '../src/scenery-backdrop';

const root=fileURLToPath(new URL('../',import.meta.url));
const bytes=(file:string)=>readFileSync(path.join(root,file));
const hash=(file:string)=>createHash('sha256').update(bytes(file)).digest('hex');
const json=(file:string)=>JSON.parse(bytes(file).toString('utf8'));
const fixture='tests/fixtures/north-backdrop-before.json';

export function generateNorthBackdrop(){
  assert.equal(hash(fixture),'71d5c0c7261d82b636c108ed659a890469f18207c95f62c07e8a7bda453adeab','The accepted baseline is immutable');
  const before=json(fixture),near=json('src/quarry-north-forest.json');
  const proxyFile='source/models/quarry-north-fir-proxies.json',proxies=json(proxyFile).variants;
  assert.equal(before.localCards.length,52);
  const trees=before.localCards.map((card:any)=>{
    const random=seededRandom(883729+card.index*619);
    const variant=card.kind==='pine'?0:card.kind==='spruce'?1:card.kind==='maple'?2:card.index%2;
    const width=.95+random()*.15,yaw=random()*Math.PI*2,height=card.height;
    const source=proxies.find((p:any)=>p.variant===variant);
    const stand=[...near.stands].sort((a:any,b:any)=>Math.hypot(a.x-card.x,a.z-card.z)-Math.hypot(b.x-card.x,b.z-card.z))[0];
    const centerGroundY=backdropGroundHeight(card.x,card.z),centerBaseline=centerGroundY-.025;
    let y=centerBaseline;
    for(const [px,py,pz]of source.groundPlate.points){
      const x=card.x+(Math.cos(yaw)*px+Math.sin(yaw)*pz)*height*width;
      const z=card.z+(-Math.sin(yaw)*px+Math.cos(yaw)*pz)*height*width;
      y=Math.min(y,backdropGroundHeight(x,z)-py*height-.025);
    }
    return {id:'north-backdrop-'+card.index,sourceCardIndex:card.index,sourceCardKind:card.kind,stand:stand.id,variant,
      x:card.x,y,z:card.z,height,width,yaw,
      trunkRadius:source.normalizedStemRadius*height*width,trunkHeight:source.normalizedStemHeight*height,
      seating:{centerGroundY,centerBaseline,burialHeight:centerBaseline-y}};
  });
  const stands=near.stands.map((stand:any)=>{
    const group=trees.filter((t:any)=>t.stand===stand.id);assert.ok(group.length);
    const mean=(key:string)=>group.reduce((sum:number,t:any)=>sum+t[key],0)/group.length;
    return {id:stand.id,x:mean('x'),y:mean('y'),z:mean('z')};
  });
  return {version:1,units:'metres; world Y up; yaw radians; normalized model scale=(height*width,height,height*width)',
    sector:{startDegrees:350,endDegrees:45},sourceFixture:{file:fixture,sha256:hash(fixture)},
    sourceModels:[0,1,2].map(variant=>{const file=`public/models/quarry-north-fir-${variant}.glb`;return {variant,file,sha256:hash(file)};}),
    rootSeating:{source:proxyFile,sha256:hash(proxyFile),burialMetres:.025,
      method:'Minimum exact terrain support under the rotated/scaled accepted low-Trunk footprint; same support data as existing northern mature trees'},
    stands,trees};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const data=generateNorthBackdrop(),file='src/quarry-north-backdrop.json';
  writeFileSync(path.join(root,file),JSON.stringify(data,null,2)+'\n');
  console.log(JSON.stringify({file,sha256:hash(file),trees:data.trees.length,stands:data.stands.length,
    variants:[0,1,2].map(v=>data.trees.filter((t:any)=>t.variant===v).length),
    minimumRadius:Math.min(...data.trees.map((t:any)=>Math.hypot(t.x,t.z))),
    maximumBurial:Math.max(...data.trees.map((t:any)=>t.seating.burialHeight))},null,2));
}
