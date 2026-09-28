import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { ColliderSpec } from '../src/quarry-layout';

export const northForestBaseline=JSON.parse(readFileSync(new URL('./fixtures/north-forest-edge-before.json',import.meta.url),'utf8'));
export const northForestData=()=>JSON.parse(readFileSync(new URL('../src/quarry-north-forest.json',import.meta.url),'utf8'));
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const northTreeId=(id:string)=>`tree-north-${id}`;
export const northRootId=(id:string,part:number)=>`tree-north-root-${id}-${part}`;
export const northMediumId=(id:string)=>`tree-north-medium-${id}`;

/** An explicit later milestone, not a rewritten historical baseline. Every old
 * collider remains byte-identical; the only additions are manifest trunk shapes.
 */
export function assertNorthForestEvolution(layout:ColliderSpec[]){
  const current=new Map(layout.map(s=>[s.id,s]));assert.equal(current.size,layout.length,'all collider IDs must remain unique');
  const expected=new Map<string,string>(northForestBaseline.physics.colliders.map((s:{id:string;sha256:string})=>[s.id,s.sha256]));
  assert.equal(expected.size,1547);
  for(const [id,before] of expected){assert.ok(current.has(id),`old collider ${id} cannot disappear`);assert.equal(hash(current.get(id)),before,`old collider ${id} cannot change`);}
  const data=northForestData(),trees=data.trees as {id:string;variant:number;x:number;y:number;z:number;height:number;width:number;yaw:number;trunkHeight:number;trunkRadius:number}[];
  const ids=new Set(trees.map(t=>northTreeId(t.id)));assert.equal(ids.size,trees.length,'manifest trunk IDs must be unique');
  const rootCount=trees.reduce((sum,tree)=>sum+data.rootHulls.find((h:any)=>h.variant===tree.variant).parts.length,0);
  assert.equal(layout.length,expected.size+trees.length+rootCount+data.mediumTrees.length,'only explicit mature stems, root bands and medium stems may be added');
  for(const tree of trees){
    assert.ok(Number.isFinite(tree.trunkHeight)&&tree.trunkHeight>0&&Number.isFinite(tree.trunkRadius)&&tree.trunkRadius>0);
    assert.deepEqual(current.get(northTreeId(tree.id)),{id:northTreeId(tree.id),shape:'cylinder',p:{x:tree.x,y:tree.y+tree.trunkHeight/2,z:tree.z},halfHeight:tree.trunkHeight/2,radius:tree.trunkRadius});
    const proxy=data.rootHulls.find((h:any)=>h.variant===tree.variant);assert.ok(proxy,'each variant needs an explicit authored root shape');
    proxy.parts.forEach((part:number[],index:number)=>{
      const points=new Float32Array(part.map((n:number,i:number)=>n*tree.height*(i%3===1?1:tree.width)));
      assert.deepEqual(current.get(northRootId(tree.id,index)),{id:northRootId(tree.id,index),shape:'hull',p:{x:tree.x,y:tree.y,z:tree.z},q:{x:0,y:Math.sin(tree.yaw/2),z:0,w:Math.cos(tree.yaw/2)},points});
    });
  }
  for(const tree of data.mediumTrees)assert.deepEqual(current.get(northMediumId(tree.id)),{id:northMediumId(tree.id),shape:'cylinder',p:{x:tree.x,y:tree.y+tree.trunkHeight/2,z:tree.z},halfHeight:tree.trunkHeight/2,radius:tree.trunkRadius});
  return layout.filter(s=>expected.has(s.id));
}

/** Reconstruct the exact pre-forest source bytes by removing ONLY the two
 * authorized additions; changing any existing placement/math still fails.
 */
export function assertNorthForestLayoutSource(){
  let bytes=readFileSync(new URL('../src/quarry-layout.ts',import.meta.url));
  const lineEnding=bytes.includes(Buffer.from('\r\n'))?'\r\n':'\n';
  const block=["  for(const p of northForest.trees){","    cylinder('tree-north-'+p.id,p.x,p.y+p.trunkHeight/2,p.z,p.trunkHeight,p.trunkRadius);","    const base=northForest.rootHulls.find(h=>h.variant===p.variant)!;","    base.parts.forEach((part,index)=>{","      const points=new Float32Array(part.map((n,i)=>n*p.height*(i%3===1?1:p.width)));","      items.push({id:'tree-north-root-'+p.id+'-'+index,shape:'hull',p:{x:p.x,y:p.y,z:p.z},q:yawRotation(p.yaw),points});","    });","  }","  for(const p of northForest.mediumTrees)cylinder('tree-north-medium-'+p.id,p.x,p.y+p.trunkHeight/2,p.z,p.trunkHeight,p.trunkRadius);"].join(lineEnding);
  for(const statement of ["import northForest from './quarry-north-forest.json';",block]){
    const token=Buffer.from(statement),at=bytes.indexOf(token);assert.ok(at>=0,'authorized forest source addition is missing');assert.equal(bytes.indexOf(token,at+token.length),-1);
    const newline=bytes[at+token.length]===13?2:1;assert.equal(bytes[at+token.length+newline-1],10);
    bytes=Buffer.concat([bytes.subarray(0,at),bytes.subarray(at+token.length+newline)]);
  }
  assert.equal(createHash('sha256').update(bytes).digest('hex'),northForestBaseline.files['src/quarry-layout.ts'],'all original shared physics source bytes must remain unchanged');
}
