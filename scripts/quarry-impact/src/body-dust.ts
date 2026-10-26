/** Body dust (offline): a hard knock shakes the dust out of an old car — out of its seams, off its panels, up from under
 * it — in a cloud all over the body, not just where it was hit. From BODY_DUST.damage of damage up to a full cloud at
 * BODY_DUST.full, BODY_DUST.puffs puffs, as many as the car is dusty: BODY_DUST.base for any old banger, the rest by how
 * much dust and dirt it has picked up (0–1). None in the rain: wet dust stays put. */
export const BODY_DUST={damage:6,full:30,puffs:[6,40],base:.5,size:[1,2.2],life:[1.1,2.1],out:.8,lift:.6,carry:.5,tint:0xa59a84} as const;
/** Puffs of dust for a knock of this damage on a car this dusty (0–1), wet or dry. */
export function bodyDustPuffs(damage:number,dusty:number,wet:boolean){
  const d=Number.isFinite(damage)?damage:0;if(wet||d<BODY_DUST.damage)return 0;
  const k=Math.min(1,(d-BODY_DUST.damage)/(BODY_DUST.full-BODY_DUST.damage)),how=BODY_DUST.base+(1-BODY_DUST.base)*(Number.isFinite(dusty)?Math.max(0,Math.min(1,dusty)):0);
  return Math.round((BODY_DUST.puffs[0]+k*(BODY_DUST.puffs[1]-BODY_DUST.puffs[0]))*how);
}
/** A point on the outside of a box (half extents hx, hy, hz about its middle) and the way out from it there, from three
 * numbers in [0, 1): on a side or the top, never the underside. */
export function bodyPoint(hx:number,hy:number,hz:number,a:number,b:number,c:number){
  const sides=[hy*hz,hy*hz,hx*hy,hx*hy,hx*hz],total=sides.reduce((s,v)=>s+v,0);let pick=a*total,face=0;
  while(face<4&&pick>sides[face]){pick-=sides[face];face++;}
  const u=b*2-1,v=c*2-1;
  switch(face){
    case 0:return{p:[hx,u*hy,v*hz],n:[1,0,0]};
    case 1:return{p:[-hx,u*hy,v*hz],n:[-1,0,0]};
    case 2:return{p:[u*hx,v*hy,hz],n:[0,0,1]};
    case 3:return{p:[u*hx,v*hy,-hz],n:[0,0,-1]};
    default:return{p:[u*hx,hy,v*hz],n:[0,1,0]};
  }
}
