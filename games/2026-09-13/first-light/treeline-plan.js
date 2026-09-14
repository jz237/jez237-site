// Where the conifer skyline stands: a dense band along the waterline and a serrated line on the hill
// crests behind it. Pure and node-tested; treeline.js turns the points into crossed cards.
const lerp=(a,b,t)=>a+(b-a)*t;
export const TREELINE={shoreBand:[3,62],crestBand:[55,205],crestMin:7.5,heights:{shore:[9,20],crest:[12,25]},budget:{shore:1500,crest:900}};
export function planTreeline({height,shoreDistance,span,random,noise=()=>.5,samples=90000}){
 const shore=[],crest=[];
 for(let i=0;i<samples&&(shore.length<TREELINE.budget.shore||crest.length<TREELINE.budget.crest);i++){
  const x=(random()-.5)*span*.98,z=(random()-.5)*span*.98,y=height(x,z);if(y<.6)continue;
  const d=shoreDistance(x,z),n=noise(x*.03+5,z*.03);
  if(d>=TREELINE.shoreBand[0]&&d<=TREELINE.shoreBand[1]){
   if(shore.length>=TREELINE.budget.shore||n<.18)continue;
   const h=lerp(TREELINE.heights.shore[0],TREELINE.heights.shore[1],random())*(1-.25*d/TREELINE.shoreBand[1]);
   shore.push({x,y:y-.2,z,h,angle:random()*6.283,tint:random(),band:'shore'});
  }else if(d>TREELINE.crestBand[0]&&d<=TREELINE.crestBand[1]&&y>=TREELINE.crestMin){
   if(crest.length>=TREELINE.budget.crest||n<.3)continue;
   // a crest: not lower than the ground around it; a few lower ones keep the line from reading as a fence
   const around=(height(x+4,z)+height(x-4,z)+height(x,z+4)+height(x,z-4))/4;if(y<around-.4&&random()<.7)continue;
   const h=lerp(TREELINE.heights.crest[0],TREELINE.heights.crest[1],random());
   crest.push({x,y:y-.2,z,h,angle:random()*6.283,tint:random(),band:'crest'});
  }
 }
 return {shore,crest};
}
