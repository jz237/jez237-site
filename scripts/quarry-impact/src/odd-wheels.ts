import * as T from 'three';

/** Odd wheels (offline rivals): an old banger's wheels don't match. From ODD.age of its age, ODD.caps of them have lost a
 * hubcap already (now and then two, ODD.two of them), the bare steel wheel showing; and from ODD.spareAge, ODD.spare of them
 * run on a spare from another car on one corner, without a cap, painted to stand out from the rest — white steel among dark
 * rims (ODD.white), black among bright ones (ODD.black). Each car its own; hiding a cap draws less, and the spare is the same
 * wheel in its own colour, so neither costs a draw call. */
export const ODD={age:.35,caps:.55,two:.3,spareAge:.5,spare:.35,black:0x1c1d1f,white:0xd9d6cc,dark:.3,roughness:.6,metalness:.35} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*61.07+salt*23.71)*43758.5453)%1;
/** Which wheels (0–3) of car `id` of this age have lost their hubcaps, and which runs on a black spare (−1 none). */
export function oddWheelsFor(id:number,age:number){
  const n=Number.isFinite(id)?id:0,missing:number[]=[];let spare=-1;
  if(age>=ODD.age&&hash(n,1)<ODD.caps){const a=Math.floor(hash(n,2)*4)%4;missing.push(a);if(hash(n,3)<ODD.two)missing.push((a+1+Math.floor(hash(n,4)*3))%4);}
  if(age>=ODD.spareAge&&hash(n,5)<ODD.spare)spare=Math.floor(hash(n,6)*4)%4;
  return {missing,spare};
}
/** Rim metal on a wheel (not the tyre, brakes, hoses or a cap). */
const NOT_RIM=/tire|tyre|blocker|disc|brake|hose|brushed chrome|hub ?cap|wheel trim|centre ?cap|domed ?cap/i;
/** Takes off the missing hubcaps and paints the spare's rim (its own copy of the rim materials, shader work kept). Returns
 * how many caps came off and how many rim parts were painted. */
export function fitOddWheels(wheels:readonly (T.Object3D|undefined)[],plan:{missing:readonly number[];spare:number}){
  let caps=0,painted=0;
  // A spare from another car comes without a matching cap.
  for(const i of new Set([...plan.missing,...(plan.spare>=0?[plan.spare]:[])])){const cap=wheels[i]?.getObjectByName('hubcap_fitted') as T.Mesh|undefined;if(!cap)continue;cap.removeFromParent();cap.geometry.dispose();caps++;}
  const w=plan.spare>=0?wheels[plan.spare]:undefined,copies=new Map<T.Material,T.Material>();
  w?.traverse(o=>{
    if(!(o instanceof T.Mesh)||Array.isArray(o.material)||NOT_RIM.test(`${(o.material as T.Material).name} ${o.name}`))return;
    const old=o.material as T.MeshStandardMaterial;let m=copies.get(old) as T.MeshStandardMaterial|undefined;
    if(!m){m=old.clone();m.onBeforeCompile=old.onBeforeCompile;m.customProgramCacheKey=old.customProgramCacheKey;
      const hsl=old.color.getHSL({h:0,s:0,l:0});m.color.setHex(hsl.l<ODD.dark?ODD.white:ODD.black);m.roughness=ODD.roughness;m.metalness=ODD.metalness;copies.set(old,m);}
    o.material=m;painted++;
  });
  return {caps,painted};
}
