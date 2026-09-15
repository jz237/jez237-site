// The near-bank tree decisions, pure and node-tested: which shore points get a real tree, and how
// big each model stands. The meshes and the loader live in trees3d.js.
export const TREES_3D=[
 {id:'pine3d',kind:'pine',height:13.0,spray:'needle'},
 {id:'spruce3d',kind:'pine',height:15.0,spray:'needle'},
 {id:'oak3d',kind:'broad',height:16.4,spray:'leaf'},
 {id:'maple3d',kind:'broad',height:18.2,spray:'leaf'}
];
// how many of each species may stand at once, how far out they reach, and where the flat cards that
// they replace fade away on the Ultra tier
export const CAPACITY=34,REACH=132,CARD_FADE=[92,128],CARD_FADE_DEFAULT=[28,62];
export const TARGET_HEIGHT=14;
// which of `points` a kind should hold, nearest first, inside the reach
export function pickNearest(points,x,z,capacity=CAPACITY,reach=REACH){
 const out=[];
 for(let i=0;i<points.length;i++){const p=points[i];const d=Math.hypot(p.x-x,p.z-z);if(d<reach)out.push({i,d});}
 out.sort((a,b)=>a.d-b.d);
 return out.slice(0,capacity).map(o=>o.i);
}
// the instance scale for a species model at a shore point, normalised to a fourteen-metre tree
export function treeScale(modelHeight,point){
 const s=Math.max(.6,Math.min(1.3,(point.scale??1)*(point.stretch??1)));
 return TARGET_HEIGHT*s/Math.max(1,modelHeight);
}
