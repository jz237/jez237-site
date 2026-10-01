import assert from 'node:assert/strict';
import {bankForestCards} from '../src/scenery-bank-relief';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {restoreReferenceBytes} from './reference-invariants';
import {assertEastBayEvolution,stripEastBayLayout} from './quarry-east-bay-invariants';
import type {ColliderSpec} from '../src/quarry-layout';
export const northBackdropBefore=JSON.parse(readFileSync(new URL('./fixtures/north-backdrop-before.json',import.meta.url),'utf8'));
export const northBackdropData=()=>JSON.parse(readFileSync(new URL('../src/quarry-north-backdrop.json',import.meta.url),'utf8'));
const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

/** A second explicitly additive woodland milestone. Retain every prior shape;
 * only the 52 declared stems and their accepted root bands may be added.
 */
export function assertNorthBackdropEvolution(layout:ColliderSpec[]){
  if(layout.some(s=>s.id==='quarry-east-bay'))layout=assertEastBayEvolution(layout);
  const old=new Map<string,string>(northBackdropBefore.physics.colliders.map((s:any)=>[s.id,s.sha256]));
  assert.equal(old.size,1919);
  const current=new Map(layout.map(s=>[s.id,s]));assert.equal(current.size,layout.length);
  for(const [id,sha]of old){assert.ok(current.has(id),id+' remains present');assert.equal(hash(current.get(id)),sha,id+' remains exactly unchanged');}
  const data=northBackdropData(),accepted=JSON.parse(readFileSync(new URL('../src/quarry-north-forest.json',import.meta.url),'utf8'));
  let additions=0;
  for(const tree of data.trees){
    assert.deepEqual(current.get('tree-'+tree.id),{id:'tree-'+tree.id,shape:'cylinder',p:{x:tree.x,y:tree.y+tree.trunkHeight/2,z:tree.z},halfHeight:tree.trunkHeight/2,radius:tree.trunkRadius});additions++;
    const parts=accepted.rootHulls.find((h:any)=>h.variant===tree.variant).parts;
    parts.forEach((part:number[],i:number)=>{
      const id='tree-'+tree.id+'-root-'+i,points=new Float32Array(part.map((n,j)=>n*tree.height*(j%3===1?1:tree.width)));
      assert.deepEqual(current.get(id),{id,shape:'hull',p:{x:tree.x,y:tree.y,z:tree.z},q:{x:0,y:Math.sin(tree.yaw/2),z:0,w:Math.cos(tree.yaw/2)},points});additions++;
    });
  }
  assert.equal(layout.length,old.size+additions,'no unlisted collider additions');
  assert.equal(additions,364,'52 stems and six compact root bands per tree');
  return layout.filter(s=>old.has(s.id));
}

/** Inverse only the exact approved import and new loop, proving every byte of
 * the previously deployed layout remains present before older gates run.
 */
export function stripNorthBackdropLayout(source:Buffer){
  let bytes=source.includes(Buffer.from("from './quarry-east-bay-collision.json'"))?stripEastBayLayout(source):source;const nl=bytes.includes(Buffer.from('\r\n'))?'\r\n':'\n';
  const block=["  for(const p of northBackdrop.trees){","    cylinder('tree-'+p.id,p.x,p.y+p.trunkHeight/2,p.z,p.trunkHeight,p.trunkRadius);","    const base=northForest.rootHulls.find(h=>h.variant===p.variant)!;","    base.parts.forEach((part,index)=>{","      const points=new Float32Array(part.map((n,i)=>n*p.height*(i%3===1?1:p.width)));","      items.push({id:'tree-'+p.id+'-root-'+index,shape:'hull',p:{x:p.x,y:p.y,z:p.z},q:yawRotation(p.yaw),points});","    });","  }"].join(nl);
  for(const text of ["import northBackdrop from './quarry-north-backdrop.json';",block]){
    const token=Buffer.from(text),at=bytes.indexOf(token);assert.ok(at>=0);assert.equal(bytes.indexOf(token,at+token.length),-1);
    assert.equal(bytes[at+token.length+nl.length-1],10);bytes=Buffer.concat([bytes.subarray(0,at),bytes.subarray(at+token.length+nl.length)]);
  }
  assert.equal(createHash('sha256').update(bytes).digest('hex'),northBackdropBefore.workerInputs.find((p:any)=>p.file==='src/quarry-layout.ts').sha256);
  return bytes;
}

/** Historical card proofs see the accepted prior52 entries only after proving
 * their precise removal and every surviving card's complete identity.
 * New runtime-instance tests independently require all52 real replacements.
 */
export function restoreNorthBackdropCards(current:any[]){
  const ids=new Set(northBackdropData().trees.map((t:any)=>t.sourceCardIndex));assert.equal(ids.size,52);
  assert.deepEqual([...ids].sort((a:any,b:any)=>a-b),northBackdropBefore.localCards.map((p:any)=>p.index).sort((a:number,b:number)=>a-b));
  const expected=northBackdropBefore.forest.cards.filter((_:any,index:number)=>!ids.has(index));
  // The later wreck/scenery revision replaces only its recorded foreground
  // conifers. Verify that exact filter before reconstructing this milestone.
  const selected=bankForestCards(expected.map((c:any)=>({kind:c.kind,x:c.matrix[12],z:c.matrix[14],ground:c.matrix[13],height:c.matrix[5],color:c.color} as any)));
  const removed=new Set(selected.map(c=>c.x+':'+c.z));
  const remaining=expected.filter((c:any)=>!removed.has(c.matrix[12]+':'+c.matrix[14]));
  assert.deepEqual(current,remaining,'all cards outside the precise bank foreground replacement remain exact');
  return northBackdropBefore.forest.cards;
}

export function assertNorthBackdropShadowSource(){
  const file=new URL('../src/static-shadows.ts',import.meta.url);let text=restoreReferenceBytes('src/static-shadows.ts',readFileSync(file)).toString();const nl=text.includes('\r\n')?'\r\n':'\n';
  const replace=(from:string[],to:string[])=>{const token=from.join(nl);assert.equal(text.split(token).length,2,'only the exact approved shadow hook may evolve');text=text.replace(token,to.join(nl));};
  replace(['#ifdef QUARRY_STATIC_FRAGMENT_SURFACE','uniform mat4 quarryStaticMatrix;','uniform float quarryStaticNormalBias;','#endif'],[]);
  // Removing a whole line block leaves one newline; remove it alongside the
  // unchanged adjacent declarations to reconstruct the original byte stream.
  text=text.replace('varying vec4 vQuarryStaticCoord;'+nl+nl+'float quarryStaticVisibility()', 'varying vec4 vQuarryStaticCoord;'+nl+'float quarryStaticVisibility()');
  replace(['  #ifdef QUARRY_STATIC_FRAGMENT_SURFACE','  vec4 coordinate = quarryStaticMatrix * vec4(quarryStaticSurfacePosition + quarryStaticSurfaceNormal * quarryStaticNormalBias, 1.0);','  #else','  vec4 coordinate = vQuarryStaticCoord;','  #endif','  if (quarryStaticEnabled < 0.5 || coordinate.z < 0.0) return 1.0;','  return getShadow(quarryStaticMap, quarryStaticSize, 1.0, quarryStaticBias, 1.0, coordinate);'],
    ['  if (quarryStaticEnabled < 0.5 || vQuarryStaticCoord.z < 0.0) return 1.0;','  return getShadow(quarryStaticMap, quarryStaticSize, 1.0, quarryStaticBias, 1.0, vQuarryStaticCoord);']);
  replace(['          // Reprojected tree fragments provide their actual world surface. A','          // moving shadow coordinate interpolated across the source billboard','          // would shade a different depth, so these distant receivers use the','          // complete fixed scenery map. Ordinary surfaces keep both maps.','          const visibility = material.userData.quarryStaticFragmentSurface',"            ? '(UNROLLED_LOOP_INDEX == 0 ? quarryStaticVisibility() : ' + nearShadowExpression + ')'","            : 'min(' + nearShadowExpression + ', (UNROLLED_LOOP_INDEX == 0 ? quarryStaticVisibility() : 1.0))';",'          const lights = T.ShaderChunk.lights_fragment_begin.replace(nearShadowExpression, visibility);'],
    ['          const lights = T.ShaderChunk.lights_fragment_begin.replace(nearShadowExpression,',"            'min(' + nearShadowExpression + ', (UNROLLED_LOOP_INDEX == 0 ? quarryStaticVisibility() : 1.0))');"]);
  assert.equal(createHash('sha256').update(text).digest('hex'),northBackdropBefore.files['src/static-shadows.ts'],'ordinary shadow implementation remains exactly preserved');
}
