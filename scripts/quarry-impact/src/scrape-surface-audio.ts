/** Ground-drag timbre is independent of environmental rubbing: a wall does not
 * become gravel just because the tyres are on a gravel shoulder. */
export function scrapeSurfaceMix(drag:number,environment:number,surface:string,speed:number){
 const unit=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;
 const d=unit(drag),contact=unit(environment),loose=surface==='gravel'||surface==='mud',mud=surface==='mud';
 const motion=Number.isFinite(speed)?Math.min(1,Math.abs(speed)/24):0;
 return{
  metalGain:Math.max(contact,d*(loose?.22:1))*.12,
  looseGain:loose?d*(mud?.075:.095):0,
  metalRate:.88+motion*.24,
  looseRate:(mud?.55:.72)+motion*.18,
 };
}
